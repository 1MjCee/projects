from ..models import RankingUser, Ranking, Referral
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.db import transaction

class RankingHelper:
    @staticmethod
    def _get_user_metrics(user):
        total_expenditure = getattr(user, 'wallet', None).expenditure if hasattr(user, 'wallet') else 0
        referral_count = Referral.objects.filter(
            referrer=user,
            level__level=1,
            completed=True
        ).count()
        return total_expenditure, referral_count

    @staticmethod
    def update_user_ranking(user):
        try:
            ranking_user = user.rankinguser
        except ObjectDoesNotExist:
            return  

        total_expenditure, referral_count = RankingHelper._get_user_metrics(user)

        with transaction.atomic():
            ranking = Ranking.objects.filter(
                Q(minimum_spending__lte=total_expenditure) | 
                Q(minimum_referrals__lte=referral_count)
            ).order_by('-ranking').first()

            if ranking and ranking != ranking_user.ranking:
                # Print the current and new ranking
                old_ranking = ranking_user.ranking
                ranking_user.ranking = ranking
                ranking_user.save()

                # Update spinner max spins
                ranking_user.update_spinner_max_spins()

                # Print the updated ranking
                print(f"User {user} ranking updated from {old_ranking} to {ranking}.")
            else:
                print(f"User {user} ranking remains unchanged: {ranking_user.ranking}.")