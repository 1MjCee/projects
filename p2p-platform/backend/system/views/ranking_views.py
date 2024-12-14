from rest_framework import viewsets
from ..models import RankingUser, Ranking
from ..serializers import RankingUserSerializer, RankingSerializer
from ..services import RankingHelper
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import OperationalError
import time

class RankingViewSet(viewsets.ModelViewSet):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer


class RankingUserViewSet(viewsets.ModelViewSet):
    queryset = RankingUser.objects.all()
    serializer_class = RankingUserSerializer

    def get_queryset(self):
        return RankingUser.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Update the ranking using a retry mechanism
        self._retry_update_user_ranking(instance.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def _retry_update_user_ranking(self, user, retries=5, delay=1):
        for attempt in range(retries):
            try:
                RankingHelper.update_user_ranking(user)
                return
            except OperationalError as e:
                print(f"Attempt {attempt + 1} to update ranking failed: {e}")
                time.sleep(delay)
        print("All attempts to update ranking failed.")