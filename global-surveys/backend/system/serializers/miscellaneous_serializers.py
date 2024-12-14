from ..models import TradeSetting, Notice, Country, NoticeSection, ExchangeRate, Review, Currency
from rest_framework import serializers

class TradeSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeSetting
        fields = ['key', 'value']
        

class NoticeSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeSection
        fields = ['subheading', 'image', 'paragraph']

class NoticeSerializer(serializers.ModelSerializer):
    sections = NoticeSectionSerializer(many=True, read_only=True)  
    class Meta:
        model = Notice
        fields = ['id', 'heading', 'introduction', 'sections']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = '__all__'

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()

    class Meta:
        model = Review
        fields ='__all__'