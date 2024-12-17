from ..models import User, Referral, ReferralLevel, TradeSetting, Transaction, Wallet, WithdrawalDetail
from ..serializers import ReferralSerializer
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
from django.db.models import F
from django.db.models import Sum
from django.db import transaction
from decimal import Decimal
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError


# Handles referral commissions
class ReferralHelper:
    """A class to handle referral logic for your custom system."""

    @classmethod
    def handle_transaction_completion(cls, referred_user, transaction_amount):
        """Handles the completion of a transaction by a referred user."""
        referrals = cls.get_referrals(referred_user)
        cls.calculate_and_pay_commissions(referrals, Decimal(transaction_amount))
        cls.mark_referrals_as_complete(referrals)
        
    @classmethod
    def get_referrals(cls, user):
        """Gets all referral instances for the given user."""
        return Referral.objects.filter(referred=user)

    @classmethod
    def calculate_and_pay_commissions(cls, referrals, transaction_amount):
        """Calculates and pays commissions for each referral instance."""
        for referral in referrals:
            level = referral.level
            commission_rate_percentage = cls.get_commission_rate(level)
            commission_rate = Decimal(commission_rate_percentage) / Decimal(100)
            commission = transaction_amount * Decimal(commission_rate)

            with transaction.atomic():
                referral.referrer.wallet.referral_commission += commission
                referral.referrer.wallet.total_earnings += commission
                referral.referrer.wallet.save()

                # Fetch the associated payment type for the user
                try:
                    withdrawal_detail = WithdrawalDetail.objects.get(user=referral.referrer)
                    payment_type = withdrawal_detail.withdrawal_type
                    print(f"Using payment type: {payment_type}")
                except WithdrawalDetail.DoesNotExist:
                    print("Error: No associated payment type found for user.")
                    raise ValidationError(_("Please set up a withdrawal account first!."))

                Transaction.objects.create(
                    user=referral.referrer,
                    type='commission',
                    amount=commission,
                    description=f"Referral commission for {level}",
                    status='completed',
                    wallet=referral.referrer.wallet,
                    method=payment_type,
                    currency=referral.referrer.wallet.currency
                )
    
    @classmethod
    def mark_referrals_as_complete(cls, referrals):
        """Marks the referral instances as completed."""
        for referral in referrals:
            referral.completed = True
            referral.save()

    @classmethod
    def get_commission_rate(cls, level):
        """Retrieves the commission rate for a given level from the ReferralLevel model."""
        if isinstance(level, ReferralLevel):
            level = level.level
        return ReferralLevel.objects.get(level=level).rate
    
    # @classmethod
    # def update_wallet_balance(cls, user, amount):
    #     """Updates the user's wallet with the given amount.
        
    #     Args:
    #         user (User): The user whose wallet is to be updated.
    #         amount (Decimal): The amount to add to the wallet."""
    #     wallet = user.wallet
    #     wallet.total_earnings += amount
    #     wallet.save()

    @classmethod
    def update_trade_settings(cls, remaining_amount):
        """Updates the trade settings with the remaining amount.
        
        Args:
            remaining_amount (Decimal): The remaining amount after commissions are calculated."""
        try:
            trade_setting = TradeSetting.objects.get(key=TradeSetting.EXTRA_WALLET)
            trade_setting.value += remaining_amount
            trade_setting.save()
        except TradeSetting.DoesNotExist:
            pass
        except Exception as e:
            print(_("Error updating trade settings: {error}").format(error=e))


# Calculates referral Statistics
class ReferralStatisticsHelper:
    @staticmethod
    def get_referral_statistics(referrer_id):
        referrer = get_object_or_404(User, pk=referrer_id)

        # Initialize statistics
        stats = {
            'total_referrals': 0,
            'levels': [],
            'referred_today_count': 0,
            'referral_commission_total': 0.0,
            'commission_by_level': {}
        }
        
        total_referrals = Referral.objects.filter(referrer=referrer).count()
        stats['total_referrals'] = total_referrals

        # Get all referral levels
        levels = ReferralLevel.objects.all()

        # Date range for the current month
        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_month = start_of_month + relativedelta(months=1)

        # Calculate total referral commission for the month
        total_commission = Transaction.objects.filter(
            user=referrer,
            type='commission',
            status='completed',
            created_at__range=(start_of_month, end_of_month)
        ).aggregate(total=Sum('amount'))['total'] or 0.0

        stats['referral_commission_total'] = total_commission

        for level in levels:
            # Filter referrals by referrer and level
            referrals = Referral.objects.filter(referrer=referrer, level=level)
            referrals_today = referrals.filter(created_at__date=timezone.now().date())
            
            level_data = {
                'level': level.level,
                'count': referrals.count(),
                'referrals': ReferralSerializer(referrals, many=True).data
            }
            
            # Add referral counts for today
            stats['referred_today_count'] += referrals_today.count()
            
            # Calculate commission by level for the month
            referred_user_ids = referrals.values_list('referred_id', flat=True)
            commission_by_level = Transaction.objects.filter(
                user=referrer,
                type='commission',
                description__icontains=f'Level {level.level}',
                created_at__range=(start_of_month, end_of_month)
            ).aggregate(total=Sum('amount'))['total'] or 0.0
            
            stats['commission_by_level'][level.level] = commission_by_level
            
            stats['levels'].append(level_data)
        
        return stats