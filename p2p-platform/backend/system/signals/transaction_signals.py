from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
import logging
from django.db.models import F
from ..models import User, Wallet, Transaction
from ..services import ReferralHelper

@receiver(post_save, sender=Transaction)
def handle_transaction(sender, instance, created, **kwargs):
    """
    Handle transaction completion and update wallet balance after a Transaction instance is saved.
    
    This signal is triggered only when a Transaction instance is created and processes based on transaction type and status.
    """
    if created:
        print(f"Signal triggered for Transaction ID: {instance.id}") 
        try:
            if instance.status == 'completed':
                # Handle referral commissions if the transaction type is 'spending'
                if instance.type == 'spending':
                    ReferralHelper.handle_transaction_completion(instance.user, instance.amount)

                # Update wallet balance
                with transaction.atomic():
                    wallet = instance.wallet
                    wallet.refresh_from_db()

                    # Define fields to update based on transaction type
                    fields_to_update = {}
                    if instance.type == 'deposit':
                        fields_to_update['deposit'] = F('deposit') + instance.amount
                    # elif instance.type == 'withdrawal':
                    #     fields_to_update['withdrawal'] = F('withdrawal') + instance.amount_before_deduction
                    elif instance.type == 'spending':
                        fields_to_update['expenditure'] = F('expenditure') + instance.amount
                        fields_to_update['deposit'] = F('deposit') - instance.amount

                    if fields_to_update:
                        # Update wallet fields
                        Wallet.objects.filter(pk=wallet.pk).update(**fields_to_update)
                        wallet.refresh_from_db()

                        # Recalculate the available balance
                        balance = (
                            wallet.deposit + wallet.total_earnings
                        )

                        # Save the updated wallet instance
                        wallet.balance = balance
                        wallet.save(update_fields=['deposit', 'withdrawal', 'expenditure', 'total_earnings', 'balance'])
        
        except Exception as e:
            print(f"Error handling transaction: {e} | Transaction ID: {instance.id}")