from django.db.models import Sum, Count
from ..models import Wallet, Transaction, WithdrawalDetail, WithdrawalTerm, PaymentMethod, PaymentType
from ..serializers import WithdrawalDetailSerializer
from decimal import Decimal
from django.db import transaction
from typing import Union
from django.utils.translation import gettext as _
from django.core.exceptions import ValidationError


def aggregate_wallet_field(user, field: str) -> Union[Decimal, int]:
    result = Wallet.objects.filter(user=user).aggregate(total=Sum(field))['total']
    return result or 0

def get_total_earnings(user) -> Union[Decimal, int]:
    """Get the total earnings for the given user."""
    return aggregate_wallet_field(user, 'earnings')

def get_total_profits(user) -> Union[Decimal, int]:
    """Get the total profits for the given user."""
    return aggregate_wallet_field(user, 'profits')

def get_total_transactions(user) -> int:
    """Get the total number of transactions for the given user."""
    return Transaction.objects.filter(user=user).count()

def get_wallet_balance(user) -> Decimal:
    """Get the wallet balance for the given user."""
    try:
        wallet = Wallet.objects.get(user=user)
        return wallet.available_balance
    except Wallet.DoesNotExist:
        return Decimal('0.00')


class WithdrawalHelper:
    @staticmethod
    def set_withdrawal_details(user, real_name, account_number, withdrawal_type):
        existing_detail = WithdrawalDetail.objects.filter(user=user).first()

        if existing_detail:
            # Existing detail found, it will be updated or replaced
            existing_detail.real_name = real_name
            existing_detail.account_number = account_number
            existing_detail.withdrawal_type = withdrawal_type
            existing_detail.save()
            return existing_detail, False 
        else:
            # No existing detail, create a new one
            withdrawal_detail = WithdrawalDetail.objects.create(
                user=user,
                real_name=real_name,
                account_number=account_number,
                withdrawal_type=withdrawal_type
            )
            return withdrawal_detail, True
    
    @staticmethod
    def process_withdrawal(user, amount):
        """
        Process the withdrawal request by creating a transaction record.
        The withdrawal amount will be updated only when the transaction is confirmed as completed.
        """
        try:
            print(f"Processing withdrawal for user: {user.username}, amount: {amount}")  

            with transaction.atomic():
                # Get the user's wallet
                wallet = Wallet.objects.get(user=user)
                print(f"User wallet balance: {wallet.balance}, total earnings: {wallet.total_earnings}") 

                # Get the withdrawal terms
                withdrawal_terms = WithdrawalTerm.objects.first()
                print(f"Withdrawal terms: min amount {withdrawal_terms.minimum_withdrawal_amount}, currency {withdrawal_terms.currency}")  

                # Convert amount to Decimal if it's not already
                initial_amount = Decimal(amount)
                print(f"Initial amount as Decimal: {initial_amount}") 

                # Check if there is sufficient balance
                if wallet.total_earnings < initial_amount:
                    print("Error: Insufficient wallet balance") 
                    raise ValueError(_("You do not have sufficient Earnings to withdraw. keep spinning to increase your amount"))
                
                
                if initial_amount < withdrawal_terms.minimum_withdrawal_amount:
                    print(f"Error: Withdrawal amount less than minimum required: {withdrawal_terms.minimum_withdrawal_amount}") 
                    raise ValueError(
                        _("You cannot withdraw less than {currency} {amount}").format(
                            currency=withdrawal_terms.currency,
                            amount=withdrawal_terms.minimum_withdrawal_amount
                        )
                    )
                
                # Fetch the associated payment type for the user
                try:
                    withdrawal_detail = WithdrawalDetail.objects.get(user=user)
                    payment_type = withdrawal_detail.withdrawal_type
                    print(f"Using payment type: {payment_type}")
                except WithdrawalDetail.DoesNotExist:
                    print("Error: No associated payment type found for user.")
                    raise ValidationError(_("No payment method associated with your account."))
                
                # Calculate the 10% withdrawal fee
                tax_percentage = withdrawal_terms.withdrawal_tax_percentage / 100
                withdrawal_fee = initial_amount * tax_percentage
                net_amount = initial_amount - withdrawal_fee
                print(f"Withdrawal fee: {withdrawal_fee}, Net amount after fee: {net_amount}") 

                # Create a transaction record
                transaction_record = Transaction(
                    user=user,
                    amount=net_amount,
                    amount_before_deduction=initial_amount,
                    fee=withdrawal_fee,
                    status='pending',
                    type='withdrawal',
                    wallet=user.wallet,
                    method=payment_type,
                    currency=wallet.currency
                )
                transaction_record.save()
                print(f"Transaction record created: {transaction_record}") 

            return transaction_record

        except Exception as e:
            print(f"Exception in process_withdrawal: {str(e)}")
            raise
    

    @staticmethod
    def confirm_withdrawal(transaction_id):
        """
        Confirm the withdrawal transaction and update the wallet.
        """
        try:
            with transaction.atomic():
                transaction_record = Transaction.objects.get(id=transaction_id, status='pending')

                # Check if the wallet has sufficient balance
                wallet = Wallet.objects.get(user=transaction_record.user)
                if wallet.total_earnings < transaction_record.amount_before_deduction:
                    raise ValueError(_("Insufficient balance"))

                # Update the transaction status to completed
                transaction_record.status = 'completed'
                transaction_record.save()

                # Update the user's wallet
                wallet.withdrawal += transaction_record.amount_before_deduction
                wallet.total_earnings -= transaction_record.amount_before_deduction
                wallet.save()

                return transaction_record
        except Transaction.DoesNotExist:
            raise ValueError(_("Transaction does not exist or is not pending"))
        except Wallet.DoesNotExist:
            raise ValueError(_("User wallet does not exist"))
        
    
    @staticmethod
    def reject_withdrawal(transaction_id):
        try:
            transaction = Transaction.objects.get(id=transaction_id, type='withdrawal')
            if transaction.status != 'pending':
                raise ValueError(_('Transaction is not in a pending state.'))
            transaction.status = 'rejected'
            transaction.save()
            return transaction
        except Transaction.DoesNotExist:
            raise ValueError(_('Transaction does not exist.'))



# Defines the deposit helper
class DepositHelper:
    @staticmethod
    def process_deposit(user, amount, reference_code, payment_type):
        """
        Process the deposit request by creating a transaction record.
        The deposit amount will be updated only when the transaction is confirmed as completed.
        """
        print((f"Processing deposit with payment type: {payment_type}")
)

        # Get the payment method based on the provided payment type
        try:
            payment_type_instance = PaymentType.objects.get(id=payment_type)
        except PaymentType.DoesNotExist:
            raise ValueError(_("Invalid payment type selected."))
        
        # Get the payment method based on the payment type
        try:
            payment_method = PaymentMethod.objects.get(method_type=payment_type_instance)
        except PaymentMethod.DoesNotExist:
            raise ValueError(_("No payment method found for the selected payment type."))

        # Check deposit terms
        if amount < payment_method.minimum_amount:
            raise ValueError(
                _("Deposit amount must be more than {currency} {amount}").format(
                    currency=payment_method.currency,
                    amount=payment_method.minimum_amount
                )
            )

        with transaction.atomic():
            # Create a new transaction record
            transaction_record = Transaction(
                user=user,
                amount=amount,
                amount_before_deduction=amount,
                code=reference_code,
                status='pending',
                type='deposit',
                wallet=user.wallet,
                currency=payment_method.currency,
                method=payment_type_instance
            )
            transaction_record.save()

        return transaction_record

    @staticmethod
    def confirm_deposit(transaction_id):
        """
        Confirm the deposit transaction and update the wallet.
        """
        try:
            with transaction.atomic():
                # Get the transaction record
                transaction_record = Transaction.objects.get(id=transaction_id, status='pending')

                # Update the transaction status to completed
                transaction_record.status = 'completed'
                transaction_record.save()

                # Update the user's wallet
                wallet = Wallet.objects.get(user=transaction_record.user)
                wallet.deposit += transaction_record.amount
                wallet.save()

                return transaction_record
        except Transaction.DoesNotExist:
            raise ValueError(_("Transaction does not exist or is not pending"))
        except Wallet.DoesNotExist:
            raise ValueError(_("User wallet does not exist"))
    
    @staticmethod
    def reject_deposit(transaction_id):
        try:
            transaction = Transaction.objects.get(id=transaction_id, type='deposit')
            if transaction.status != 'pending':
                raise ValueError(_('Transaction is not in a pending state.'))
            transaction.status = 'rejected'
            transaction.save()
            return transaction
        except Transaction.DoesNotExist:
            raise ValueError(_('Transaction does not exist.'))