from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal, InvalidOperation
from ..models import UserInvestmentPlan, Wallet, InvestmentPlan, Transaction, WithdrawalDetail
from decimal import Decimal, InvalidOperation
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
# from ..services import ReferralHelper
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext as _


class InvestmentsHelper:
    @staticmethod
    def buy_investment(user, investment_id):
        try:
            print(f"Attempting to buy investment with ID: {investment_id} for user: {user}")

            # Retrieve the investment plan and validate its existence
            investment_plan = InvestmentPlan.objects.get(id=investment_id)
            print(f"Retrieved investment plan: {investment_plan}")

            # Retrieve the user's wallet and validate it exists
            wallet = Wallet.objects.get(user=user)
            print(f"Retrieved wallet: {wallet}")

            # Fetch the associated payment type for the user
            try:
                withdrawal_detail = WithdrawalDetail.objects.get(user=user)
                payment_type = withdrawal_detail.withdrawal_type
                print(f"Using payment type: {payment_type}")
            except WithdrawalDetail.DoesNotExist:
                print("Error: No associated payment type found for user.")
                raise ValidationError(_("Please set up a withdrawal account first!"))

            # Check if the user's total deposits cover the investment price
            if wallet.deposit < investment_plan.price:
                print(f"Validation failed: User's total deposits ({wallet.deposit}) are less than the investment price ({investment_plan.price})")
                raise ValidationError(_("Insufficient Funds for making a Purchase. Please make a deposit and try again. Redirecting to payment page"))

            # Check if the user has already subscribed to this investment plan
            if UserInvestmentPlan.objects.filter(user=user, investment_plan=investment_plan).exists():
                print(f"User has already subscribed to this investment plan: {investment_plan}")
                raise ValidationError(_("You have already subscribed to this plan."))
            
            # Check if the user currently has a free investment plan
            current_plan = UserInvestmentPlan.objects.filter(user=user).first()

            # Begin a transaction to ensure atomicity
            with transaction.atomic():
                if current_plan:
                    print(f"User {user} already has an active investment plan. Replacing the existing plan.")
                    current_plan.delete()

                # Create the investment and Transaction records
                investment = InvestmentsHelper.create_investment(user, investment_plan)
                print(f"You have subscribed to: {investment}")

                message = _("{} has subscribed to {} in {}").format(user, investment_plan.price, investment_plan)
                InvestmentsHelper.create_transaction(user, investment_plan.price, wallet, payment_type, message,
                                                     type='spending', status='completed', currency=wallet.currency)
                print(f"Transaction recorded: {message}")

                return investment

        except InvestmentPlan.DoesNotExist:
            print(f"Error: Investment plan with ID {investment_id} not found.")
            raise ValidationError(_("Investment plan not found"))
        except Wallet.DoesNotExist:
            print(f"Error: Wallet for user {user} not found.")
            raise ValidationError(_("Wallet not found"))
        except ValidationError as e:
            print(f"Validation error occurred: {str(e)}")
            raise ValidationError(str(e))
        except Exception as e:
            print(f"An unexpected error occurred: {str(e)}")
            raise Exception(_("An unexpected error occurred: {error}").format(error=str(e)))

    @staticmethod
    def create_investment(user, investment_plan):
        # Create an investment record with the investment plan's price
        print(f"Creating investment record for user {user} and investment plan {investment_plan}")
        return UserInvestmentPlan.objects.create(
            user=user,
            investment_plan=investment_plan
        )
    
    @staticmethod
    def create_transaction(user, amount, wallet, payment_type, message, type, currency, status='completed'):
        # Create a transaction record
        print(f"Creating transaction record for user {user}, amount {amount}, payment type {payment_type}")
        return Transaction.objects.create(
            user=user,
            amount=amount,
            wallet=wallet,
            method=payment_type,
            description=message,
            type=type,
            status=status,
            currency=currency
        )
