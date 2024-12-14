from ..models import Wallet, Transaction, WithdrawalDetail, WithdrawalTerm, Currency, PaymentType, PaymentProof
from .Payment_method_serializers import PaymentTypeSerializer
from rest_framework import serializers

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class WalletSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    
    class Meta:
        model = Wallet
        fields = '__all__'
        

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        

class WithdrawalDetailSerializer(serializers.ModelSerializer):
    withdrawal_type =  serializers.PrimaryKeyRelatedField(queryset=PaymentType.objects.all(), required=True)
    
    class Meta:
        model = WithdrawalDetail
        fields = ["real_name", "account_number", "withdrawal_type"]
    

class WithdrawalTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalTerm
        fields = '__all__'
        

class PaymentProofSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer()

    class Meta:
        model = PaymentProof
        fields = '__all__'