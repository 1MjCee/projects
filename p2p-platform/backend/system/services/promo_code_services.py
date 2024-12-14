from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from ..models import PromoCode, Wallet, Transaction, WithdrawalDetail, UserInvestmentPlan
from django.utils.translation import gettext as _

class PromotionHelper:
    @staticmethod
    def redeem_code(user, code):
        try:
            promo_code = PromoCode.objects.get(code=code, used=False)
        except PromoCode.DoesNotExist:
            raise ValidationError(_("Invalid or already used treasure code"))

        with transaction.atomic():
            promo_code.won_by = user
            promo_code.used = True
            promo_code.save()

            # Add the promo amount to the user's wallet
            wallet, created = Wallet.objects.get_or_create(user=user)

            # Fetch Users Subscription and adjust amount based on multiplier
            user_investment_plan = UserInvestmentPlan.objects.filter(user=user).first()
            if user_investment_plan:
                prize_multiplier = user_investment_plan.investment_plan.prize_multiplier
                adjusted_amount = promo_code.amount * prize_multiplier
            else:
                # No multiplier if no investment plan is found
                adjusted_amount = promo_code.amount

             # Update the adjusted_amount field on the PromoCode
            promo_code.adjusted_amount = adjusted_amount
            promo_code.save()

            wallet.total_earnings += adjusted_amount
            wallet.save()

            # Fetch the associated payment type for the user
            try:
                withdrawal_detail = WithdrawalDetail.objects.get(user=user)
                payment_type = withdrawal_detail.withdrawal_type
            except WithdrawalDetail.DoesNotExist:
                raise ValidationError(_("Please set up a withdrawal account first!."))

            # Create a transaction instance to record the promo amount
            Transaction.objects.create(
                user=user,
                amount=adjusted_amount,
                description=_("Promomotion code %(code)s has been redeemed by %(user)s and %(amount)s added to balance") % {'code': code, 'user': user, 'amount': adjusted_amount},
                type='reward',  
                status='completed',  
                wallet=wallet,
                currency=wallet.currency,
                method=payment_type
            )

        return adjusted_amount