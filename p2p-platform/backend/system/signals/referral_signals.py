from django.db.models.signals import post_save
from referrals.signals import create_multi_level_referral 
from referrals.models import Referral
from django.dispatch import receiver

@receiver(post_save, sender=Referral)
def process_referral(sender, instance, created, **kwargs):
    if created:
        create_multi_level_referral(instance)