import requests
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from .models import Country, Currency
from django.contrib.auth.models import AnonymousUser
from django.urls import resolve
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.middleware import AuthenticationMiddleware
from rest_framework_simplejwt.exceptions import AuthenticationFailed

"""Custom middleware to assign a country to a user based on their IP address"""
class CountryAssignmentMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Step 1: Get the client's IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Step 2: Handle user country assignment
        user = request.user

        if not user.is_authenticated:
            return  # Exit early if the user is not authenticated

        # Check if the user already has a country assigned
        existing_country = getattr(user, 'country', None)

        if existing_country:
            if existing_country.ip_address == ip:
                return  
        else:
            pass

        # Step 3: Fetch country info from ipinfo.io only if needed
        access_token = settings.IP_INFO_API_KEY
        # test_ip = "41.212.86.175"
        try:
            url = f'http://ipinfo.io/{ip}/json?token={access_token}'
            response = requests.get(url)
            data = response.json()

            # Extract necessary fields from the API response
            country_code = data.get('country', 'Unknown')
            region = data.get('region', 'Unknown')
            

            # Get the currency based on country code
            currency = Currency.objects.filter(code=country_code).first()
            currency_code = currency.currency_code if currency else 'Unknown'
            country_name = currency.country if currency else 'Unknown'

            # Step 4: Create or update the Country instance
            country, created = Country.objects.get_or_create(
                ip_address=ip,
                defaults={
                    'country_code': country_code,
                    'country': country_name,
                    'region': region,
                    'currency': currency_code,
                }
            )

            # Assign the country to the user and save
            user.country = country
            user.save()

        except requests.exceptions.RequestException as e:
            # Handle error in IP resolution
            print(f"Error while fetching IP info: {e}")

"""Custom middleware to authenticate users using JWT tokens in the Authorization header"""
class JWTHeaderAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.startswith('/api/'):
            return self.get_response(request)

        jwt_authenticator = JWTAuthentication()
        raw_token = request.META.get('HTTP_AUTHORIZATION', '')

        # Check if the header exists and is formatted correctly
        if raw_token.startswith('Bearer '):
            token = raw_token.split('Bearer ')[1]
            try:
                validated_token = jwt_authenticator.get_validated_token(token)
                request.user = jwt_authenticator.get_user(validated_token)
            except AuthenticationFailed:
                request.user = AnonymousUser()
        else:
            request.user = AnonymousUser()

        return self.get_response(request)
           