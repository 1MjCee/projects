from rest_framework import serializers
from ..models import PromoCode, Spinner
from .user_auth_serializers import UserSerializer

class PromoCodeSerializer(serializers.ModelSerializer):
    won_by = UserSerializer()

    class Meta:
        model = PromoCode
        fields = '__all__'
        
class RedeemPromoCodeSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=255)


class SpinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spinner
        fields = ['user', 'max_spins', 'spin_count', 'is_eligible', 'last_spin']