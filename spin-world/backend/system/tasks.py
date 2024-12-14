from .models import UserInvestmentPlan, RankingUser, InvestmentPlan, Spinner
from django.utils import timezone
from .services import  RankingHelper
from django.db import transaction
from dateutil.relativedelta import relativedelta
from .views import get_exchange_rates
from celery import shared_task

@shared_task
def check_investment_expiration():
    """
    This task checks if any user's investment plan has expired.
    If expired, it deletes the current plan and assigns the user to the free plan.
    """
    print("Running check_investment_expiration...")
    user_investment_plans = UserInvestmentPlan.objects.filter(expired=False)
    
    for plan in user_investment_plans:
        if plan.investment_plan.is_free_plan():
            print("Free plan, skipping...")
            continue 
        
        # Calculate expiration date based on the created_at date and plan duration
        expiration_date = plan.created_at + relativedelta(months=plan.investment_plan.duration_in_months)
        
        # Check if the plan has expired
        if timezone.now() > expiration_date:
            plan.expired = True
            plan.save()
            
            # Remove the expired user investment plan
            plan.delete()

            # Assign the user to the free plan
            free_plan = InvestmentPlan.objects.filter(price=0.00).first()
            if free_plan:
                UserInvestmentPlan.objects.create(
                    user=plan.user,
                    investment_plan=free_plan,
                    created_at=timezone.now()
                )

@shared_task
def check_user_rankings():
    with transaction.atomic():
        users_with_rankings = RankingUser.objects.all()
        for ranking_user in users_with_rankings:
                RankingHelper.update_user_ranking(ranking_user.user)


def reset_spin_count():
    """Task to reset the spin count for all users at midnight."""
    # Iterate through all Spinner instances and reset the spin count
    print("Reseting Spinners...")
    spinners = Spinner.objects.all()
    for spinner in spinners:
        spinner.spin_count = 0 
        spinner.last_spin = None
        spinner.save()

@shared_task
def fetch_exchange_rates():
    """Task to fetch exchange rates and store them."""
    get_exchange_rates()
    print("Exchange rates task executed successfully.")
