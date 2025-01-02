from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User, Country, Currency
from ..serializers import (LoginSerializer, RegisterUserSerializer, JWTTokenSerializer, PasswordResetSerializer,
                           PasswordResetRequestSerializer, UserSerializer, ChangePasswordSerializer)
from ..services import UserService
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _
import geoip2.webservice
from django.conf import settings
import requests



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        user = request.user  
        if user.is_authenticated:  
            if request.method == 'GET':
                serializer = UserSerializer(user)
                return Response(serializer.data)

            elif request.method == 'PUT':
                serializer = UserSerializer(user, data=request.data, partial=True)

                if serializer.is_valid():
                    # Handle the avatar file if present
                    if 'avatar' in request.FILES:
                        user.avatar = request.FILES['avatar']  
                    serializer.save()  
                    return Response(serializer.data)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "User not authenticated"}, status=401)
    
    @action(detail=False, methods=['get'], url_path='referral-code')
    def referral_code(self, request):
        user = request.user
        referral_code = user.referral_code 
        return Response({'referral_code': referral_code})
    
    @action(detail=False, methods=['put'], url_path='change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        
        # Update password using serializer
        serializer.update(user, serializer.validated_data)
        return Response({"detail": _("Password changed successfully.")}, status=status.HTTP_200_OK)


# Defined User registration Viewset
def get_user_ip_and_country(request):
    # Step 1: Get the client's IP address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    # Step 2: Get the country information by IP using ipinfo.io API
    access_token = settings.IP_INFO_API_KEY

    try:
        # Query ipinfo.io API for detailed information
        url = f'http://ipinfo.io/{ip}/json?token={access_token}'
        response = requests.get(url)
        data = response.json()
        
        # Extract necessary fields from the API response
        country_code = data.get('country', 'Unknown')
        city = data.get('city', 'Unknown')
        region = data.get('region', 'Unknown')
        loc = data.get('loc', 'Unknown')  
        org = data.get('org', 'Unknown')
        postal = data.get('postal', 'Unknown')
        timezone = data.get('timezone', 'Unknown')

        print('Code:', country_code)
        currency = Currency.objects.filter(code=country_code).first()
        curreny_code = currency.currency_code
        country_name =currency.country


        # Step 3: Create a new Country instance with the IP as the primary key
        country = Country(
            ip_address=ip,
            country_code=country_code,
            country=country_name,
            city=city,
            region=region,
            loc=loc,
            org=org,
            postal=postal,
            timezone=timezone,
            currency=curreny_code
        )

        # Save the Country instance to the database
        country.save()

        # Step 4: Return the newly created Country object
        return country  

    except requests.exceptions.RequestException as e:
        print(f"Error while fetching IP info: {e}")
        return None
    
    
class RegistrationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='register', permission_classes = [AllowAny])
    def register(self, request):

        # Call the function to get IP and country
        country = get_user_ip_and_country(request)
        print("Countries:", country)
        if country is None:
            return Response({"detail": "Could not retrieve country information"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            invite_code = serializer.validated_data.get('invite_code', '')
            password = serializer.validated_data['password']

            # Check if either email or username is taken
            email_exists = User.objects.filter(email=email).exists()
            username_exists = User.objects.filter(username=username).exists()

            # Check if both email and username are taken
            if email_exists and username_exists:
                return Response({
                    "detail": "Both the email and username are already taken. Please choose a different email and username."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if the email is taken
            if email_exists:
                return Response({
                    "detail": "Email already taken. Please choose a different email."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if the username is taken
            if username_exists:
                return Response({
                    "detail": "Username already taken. Please choose a different username."
                }, status=status.HTTP_400_BAD_REQUEST)


            try:
                UserService.create_user(username, email, invite_code, country, password)
                return Response({'message': 'Your Registration request has been successful. Procees to Login'}, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        print("Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthViewSet(viewsets.ViewSet):
    # Login method to authenticate users and return tokens
    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            tokens = JWTTokenSerializer.get_tokens_for_user(user)
            return Response(tokens, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
# Defines User Login Viewset
class AuthViewSet(viewsets.ViewSet):

    # Login action to authenticate and return JWT tokens
    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            tokens = JWTTokenSerializer.get_tokens_for_user(user)
            response = Response(tokens, status=status.HTTP_200_OK)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Logout action to remove the refresh token cookie
    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        response = Response({'message': 'Logout successful.'}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        return response