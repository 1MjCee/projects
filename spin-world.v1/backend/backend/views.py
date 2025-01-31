from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Sum
from django.utils.timezone import now
from django.contrib.admin.views.decorators import staff_member_required
from system.models import User, Transaction, PromoCode, Referral, PaymentOrder, SystemWallet
from system.forms import PromoCodeGenerationForm 

def generate_promo_code():
    import random, string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def dashboard_callback(request, context):
    # Get today's date
    today = now().date()

    # Statistics calculations
    context.update({
        'system_balance': SystemWallet.objects.get().balance,
        'pending_withdrawals': "{:,.2f}".format(Transaction.objects.filter(type='withdrawal', status='pending').aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'pending_withdrawals_count': Transaction.objects.filter(type='withdrawal', status='pending').count(),
        'completed_withdrawals': "{:,.2f}".format(Transaction.objects.filter(type='withdrawal', status='completed').aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'completed_deposit_count': Transaction.objects.filter(type='deposit', status='completed').count(),
        'todays_deposits': "{:,.2f}".format(Transaction.objects.filter(status='confirmed', created_at__date=today).aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'total_deposits': "{:,.2f}".format(PaymentOrder.objects.filter(status='confirmed', created_at__date=today).aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'total_users': User.objects.filter(is_staff=False, is_superuser=False).count(),
        'users_joined_today': User.objects.filter(is_staff=False, is_superuser=False, date_joined__date=today).count(),
        'active_users': User.objects.filter(is_staff=False, is_superuser=False, is_active=True).count(),
        'completed_referrals': Referral.objects.filter(completed=True).count(),
        'completed_deposits': "{:,.2f}".format(Transaction.objects.filter(type='deposit', status='completed').aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'pending_deposits': "{:,.2f}".format(Transaction.objects.filter(type='deposit', status='pending').aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'rejected_deposits': "{:,.2f}".format(Transaction.objects.filter(type='deposit', status='rejected').aggregate(total_amount=Sum('amount'))['total_amount'] or 0),
        'rejected_deposits_count': Transaction.objects.filter(type='deposit', status='rejected').count(),
    })

    # Create a list of cards for the dashboard
    context['cards'] = [
        {'title': 'Today\'s Users', 'value': context['users_joined_today']},
        {'title': 'Active Users', 'value': context['active_users']},
        {'title': 'Total Users', 'value': context['total_users']},
        {'title': "Today\'s Deposits", 'value': context['total_deposits']},
        {'title': "Total Deposits", 'value': context['todays_deposits']},
        {'title': 'Withdrawals', 'value': context['completed_withdrawals']},
        {'title': 'Referrals', 'value': context['completed_referrals']},
    ]

    return context

@staff_member_required
def dashboard(request):
    # Promo code form handling
    if request.method == 'POST':
        form = PromoCodeGenerationForm(request.POST)
        if form.is_valid():
            number_of_codes = form.cleaned_data['number_of_codes']
            amount = form.cleaned_data['amount']
            for _ in range(number_of_codes):
                PromoCode.objects.create(
                    code=generate_promo_code(),
                    amount=amount,
                    created_by=request.user
                )
            messages.success(request, "Promo codes created successfully!")
            return redirect('admin:dashboard')
    else:
        form = PromoCodeGenerationForm()

    context = dashboard_callback(request, {})
    context['form'] = form 

    return render(request, 'admin/dashboard.html', context)
