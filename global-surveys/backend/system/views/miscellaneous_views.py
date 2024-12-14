from rest_framework import viewsets, status
from ..models import Notice, Country, PromoCode, User, ExchangeRate, Review
from ..serializers import NoticeSerializer, CountrySerializer, ExchangeRateSerializer, ReviewSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import requests
from django.http import JsonResponse
from rest_framework.decorators import action
from django.db.models import Sum
from django.utils.timezone import now
from datetime import datetime
from django.utils import timezone



# Calculates stats to be used in the hero section
class StatsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], permission_classes = [AllowAny])
    def stats(self, request):
        today = now().date()
        stats = {
            "amountToBeWon": "{:,.2f}".format(PromoCode.objects.aggregate(total_amount=Sum('amount'))['total_amount'] * 20 or 0),
            "customersToday": User.objects.filter(date_joined__date=today, is_staff=False, is_superuser=False).count(),
            "totalCustomers": User.objects.filter(is_staff=False, is_superuser=False).count()
        }
        return Response(stats)


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]


class ExchangeRateViewSet(viewsets.ModelViewSet):
    queryset = ExchangeRate.objects.all()  
    serializer_class = ExchangeRateSerializer 


# Fetching Available Crypto Currencies
@api_view(['GET'])
def get_available_currencies(request):
    """Fetch available currencies from NOWPayments API"""
    url = "https://api.nowpayments.io/v1/merchant/coins"
    headers = {"x-api-key": settings.NOWPAYMENTS_API_KEY}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return Response({"currencies": data.get("selectedCurrencies", [])}, status=status.HTTP_200_OK)
    
    return Response({"error": "Unable to fetch currencies"}, status=status.HTTP_400_BAD_REQUEST)


# Fetchingt Minimum Amount
@api_view(['GET'])
def get_minimum_payment_amount(request):
    """Fetch the minimum payment amount for the selected cryptocurrency pair"""
    
    # Get the selected cryptocurrency and currency from the query parameters
    currency_from = request.GET.get("currency_from")
    currency_to = request.GET.get("currency_to")
    fiat_equivalent = request.GET.get("fiat_equivalent", "usd")  # Optional
    is_fixed_rate = request.GET.get("is_fixed_rate", "False")
    is_fee_paid_by_user = request.GET.get("is_fee_paid_by_user", "False")
    
    # Check if both currencies are provided
    if not currency_from or not currency_to:
        return Response({"error": "Both 'currency_from' and 'currency_to' are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Prepare the API request to NOWPayments
    url = f"https://api.nowpayments.io/v1/min-amount"
    headers = {
        "x-api-key": settings.NOWPAYMENTS_API_KEY
    }
    params = {
        "currency_from": currency_from,
        "currency_to": currency_to,
        "fiat_equivalent": fiat_equivalent,
        "is_fixed_rate": is_fixed_rate,
        "is_fee_paid_by_user": is_fee_paid_by_user
    }
    
    # Make the GET request to NOWPayments
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return Response({
            "min_amount": data.get("min_amount"),
            "fiat_equivalent": data.get("fiat_equivalent", None)
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Unable to fetch minimum amount."}, status=status.HTTP_400_BAD_REQUEST)


# Getting the Estimated Price
@api_view(['GET'])
def get_estimated_price(request):
    """Fetch estimated price in cryptocurrency."""
    # Extract the required parameters from the request
    amount = request.query_params.get('amount')
    currency_from = request.query_params.get('currency_from')
    currency_to = request.query_params.get('currency_to')

    if not amount or not currency_from or not currency_to:
        return Response({"error": "Missing required parameters."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        amount = float(amount)
    except ValueError:
        return Response({"error": "Invalid amount."}, status=status.HTTP_400_BAD_REQUEST)

    # Construct the URL to fetch the estimated price
    url = "https://api.nowpayments.io/v1/estimate"
    headers = {
        "x-api-key": settings.NOWPAYMENTS_API_KEY
    }
    params = {
        "amount": amount,
        "currency_from": currency_from,
        "currency_to": currency_to
    }

    # Send the request to NOWPayments API
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        estimated_price = data.get("estimated_amount")
        if estimated_price is None:
            return Response({"error": "Unable to get estimated price."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"estimated_price": estimated_price}, status=status.HTTP_200_OK)

    return Response({"error": "Unable to fetch estimated price."}, status=status.HTTP_400_BAD_REQUEST)


#  Real Time Currency Converter
def get_exchange_rates():
    API_KEY = settings.EXCHANGE_API_KEY
    BASE_URL = f'https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD'
    
    try:
        response = requests.get(BASE_URL)
    
        if response.status_code == 200:
            data = response.json()
            
            if data.get('result') == 'success' and 'conversion_rates' in data:
                rates = data['conversion_rates']
                
                # Loop through all the currencies returned by the API
                for target_currency, rate in rates.items():
                    try:
                        # Record the fetched time
                        fetched_at = timezone.now()
                        
                        # Save the exchange rate for each currency
                        ExchangeRate.objects.update_or_create(
                            base_currency='USD', 
                            target_currency=target_currency,
                            defaults={'rate': rate, 'fetched_at': fetched_at}
                        )
                        print(f"Exchange rate for {target_currency} updated successfully.")
                    except Exception as e:
                        print(f"Error saving exchange rate for {target_currency}: {str(e)}")
                
                print('All exchange rates fetched and saved successfully.')
            else:
                print(f"Invalid data or error in response: {data}")
        else:
            print(f"Request failed with status code {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f'Error fetching exchange rates: {str(e)}')


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

