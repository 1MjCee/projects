from rest_framework import serializers
from ..models import PaymentMethod, Guide, PaymentType, PaymentOrder


class GuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guide
        fields = '__all__'

class PaymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentType
        fields = '__all__'

class PaymentMethodSerializer(serializers.ModelSerializer):
    payment_process = GuideSerializer()
    method_type = PaymentTypeSerializer()
    
    class Meta:
        model = PaymentMethod
        fields = ['method_type', 'address_number', 'recipient_name', 'minimum_amount', 'currency', 'exchange_rate', 'payment_process']

class PaymentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentOrder
        fields = '__all__'
    
