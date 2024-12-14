from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import Spinner, Ranking, RankingUser
from django.conf import settings
from ..services import RankingHelper

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_spinner_and_ranking(sender, instance, created, **kwargs):
    if created:
        spinner = Spinner.objects.create(user=instance, max_spins=0, is_eligible=False)

        # Check if the user is neither staff nor a superuser
        if not instance.is_staff and not instance.is_superuser:
            try:
                default_ranking = Ranking.objects.get(ranking=1)
                spinner.max_spins = default_ranking.max_spins
                spinner.is_eligible = True
                spinner.save() 

                # Create RankingUser instance
                RankingUser.objects.create(user=instance, ranking=default_ranking)

            except Ranking.DoesNotExist:
                print("Default ranking 'Begginer' does not exist. User created without a ranking.")
