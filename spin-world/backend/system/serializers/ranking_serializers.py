from ..models import Ranking, RankingUser
from rest_framework import serializers

class RankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ranking
        fields = '__all__'

class RankingUserSerializer(serializers.ModelSerializer):
    ranking = RankingSerializer()
    
    class Meta:
        model = RankingUser
        fields = '__all__'