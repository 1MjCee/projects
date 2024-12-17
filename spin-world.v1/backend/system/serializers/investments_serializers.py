from ..models import InvestmentPlan, UserInvestmentPlan, PromoCode
from .financials_serializers import CurrencySerializer
from rest_framework import serializers


class InvestmentPlanSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    
    class Meta:
        model = InvestmentPlan
        fields = '__all__'


class UserInvestmentPlanSerializer(serializers.ModelSerializer):
    investment_plan = InvestmentPlanSerializer()
    
    class Meta:
        model = UserInvestmentPlan
        fields = ['user', 'investment_plan', 'expired']


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = '__all__'