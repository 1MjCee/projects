from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from ..models import UserInvestmentPlan, InvestmentPlan
from django.db import IntegrityError

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def assign_free_plan_to_new_user(sender, instance, created, **kwargs):
    if created:  
        try:
            free_plan = InvestmentPlan.objects.get(number=1)

            UserInvestmentPlan.objects.create(user=instance, investment_plan=free_plan)
        except InvestmentPlan.DoesNotExist:
            print("Free plan with number 1 does not exist.")
        except IntegrityError as e:
            print(f"Error creating UserInvestmentPlan: {e}")
