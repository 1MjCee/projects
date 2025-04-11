# surveys/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Response, Survey

@receiver(post_save, sender=Response)
def handle_response_completion(sender, instance, created, **kwargs):
    """
    Signal handler to process completed survey responses.
    """
    if not created and instance.is_complete and instance.completed_at:
        transaction.on_commit(lambda: process_completed_survey(instance))

def process_completed_survey(response):
    """
    Process a completed survey response.
    - Award user with survey reward
    - Update user stats
    - Potentially trigger referral rewards
    """
    from users.models import UserProfile, Transaction
    
    try:
        # Award the survey reward to the user
        user = response.user
        survey = response.survey
        amount = survey.reward
        
        # Create transaction record
        Transaction.objects.create(
            user=user,
            amount=amount,
            transaction_type='SURVEY_REWARD',
            description=f"Reward for completing '{survey.title}'",
            reference_id=str(response.id)
        )
        
        # Update user profile stats
        profile = UserProfile.objects.get(user=user)
        profile.surveys_completed = profile.surveys_completed + 1
        profile.total_earnings = profile.total_earnings + amount
        profile.save()
        
        # Check for referrals - this would be implemented based on your referral system
        check_referral_rewards(user, response)
        
    except Exception as e:
        # Log the error but don't prevent the response from being saved
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error processing survey completion: {str(e)}")

def check_referral_rewards(user, response):
    """
    Check if the completed survey should trigger referral rewards.
    This would be implemented based on your referral system.
    """
    from referrals.models import Referral
    
    try:
        # Example implementation - details would depend on your referral system
        referrals = Referral.objects.filter(referred_user=user, status='pending')
        
        for referral in referrals:
            # If this is the user's first completed survey, activate the referral
            if response.user.responses.filter(is_complete=True).count() == 1:
                referral.status = 'active'
                referral.save()
                
                # Award the referrer
                award_referral_bonus(referral.referrer, referral, response)
    
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error processing referral rewards: {str(e)}")

def award_referral_bonus(referrer, referral, response):
    """
    Award a bonus to the referrer when their referred user completes a survey.
    """
    from users.models import Transaction
    from .models import ReferralLevel
    
    try:
        # Get the referrer's level
        profile = referrer.profile
        level = ReferralLevel.objects.get(name=profile.referral_level)
        
        # Calculate bonus amount based on the survey reward and referral percentage
        survey_reward = response.survey.reward
        bonus_percentage = level.bonus_percentage
        bonus_amount = (survey_reward * bonus_percentage) / 100
        
        # Create transaction record
        Transaction.objects.create(
            user=referrer,
            amount=bonus_amount,
            transaction_type='REFERRAL_BONUS',
            description=f"Referral bonus for {referral.referred_user.username}'s survey completion",
            reference_id=str(referral.id)
        )
        
        # Update referrer's earnings
        profile.referral_earnings = profile.referral_earnings + bonus_amount
        profile.total_earnings = profile.total_earnings + bonus_amount
        profile.save()
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error awarding referral bonus: {str(e)}")