from ..models import ReferralLevel, Referral, User
from rest_framework import serializers
from django.db import transaction
from . import UserSerializer


class NestedReferralSerializer(serializers.ModelSerializer):
    """Serializer for nested referrals within a level."""
    referred = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 

    class Meta:
        model = Referral
        fields = ['id', 'completed', 'invitation_code', 'referred', 'level']


class ReferralLevelSerializer(serializers.ModelSerializer):
    """Serializer for ReferralLevel, including nested referrals."""
    referrals = NestedReferralSerializer(many=True, read_only=True)

    class Meta:
        model = ReferralLevel
        fields = ['id', 'level', 'referrals', 'rate']
    
    def validate_rate(self, value):
        if value < 0:
            raise serializers.ValidationError('Rate must be non-negative')
        return value


class ReferralSerializer(serializers.ModelSerializer):
    """Serializer for Referral, including nested levels and their referrals."""
    level = ReferralLevelSerializer(read_only=True) 
    referred = UserSerializer(read_only=True)
    referrer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Referral
        fields = ['id', 'completed', 'invitation_code', 'created_at', 'updated_at', 'referred', 'referrer', 'level']
    
    def get_level(self, obj):
        """Custom method to include only essential level information."""
        return {
            'id': obj.level.id,
            'level': obj.level.level,
        }


class ReferralStatsSerializer(serializers.Serializer):
    """Serializer for referral statistics."""
    today_referrals_count = serializers.IntegerField()
    completed_referrals_count = serializers.IntegerField()
    completed_referrals_list = ReferralSerializer(many=True)
    total_commission = serializers.DecimalField(max_digits=20, decimal_places=2)

    def to_representation(self, instance):
        """Customize the representation of the stats serializer."""
        data = super().to_representation(instance)
        return data