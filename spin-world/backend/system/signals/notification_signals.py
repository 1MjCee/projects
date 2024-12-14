from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import Transaction, Notification,RankingUser

@receiver(post_save, sender=Transaction)
def create_transaction_notification(sender, instance, created, **kwargs):
    if created:
        # Define base message
        message = f"Transaction #{instance.id} of {instance.amount} {instance.currency.code}: "

        # Customize message based on transaction type and status
        if instance.type == 'deposit':
            message += "Your deposit has been processed."
        elif instance.type == 'withdrawal':
            if instance.status == 'completed':
                message += "Your withdrawal has been successfully completed."
            elif instance.status == 'pending':
                message += "Your withdrawal is currently pending."
            elif instance.status == 'rejected':
                message += "Your withdrawal has been rejected."
        elif instance.type == 'reward':
            message += "You've received a reward!"
        # Add more conditions as needed for different types and statuses...

        # Create the notification
        Notification.objects.create(
            user=instance.user,
            message=message,
        )

@receiver(post_save, sender=RankingUser)
def create_ranking_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user,
            message=f"Congratulations! You have achieved the rank of {instance.ranking.name}.",
        )




