from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.cache import cache
from decouple import config
from django.db import transaction
import random
import secrets
import string
from ..models import User, Wallet, ReferralLevel, Referral, Currency, Country
from django.utils.translation import gettext as _
import os
from dotenv import load_dotenv
from rest_framework.exceptions import ValidationError
from django.http import JsonResponse


load_dotenv()


def generate_referral_code():
    while True:
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(12))
        if not User.objects.filter(referral_code=code).exists():
            return code

    
# Handles User creation Logic
class UserService:
    @staticmethod
    def create_user(username, email, invite_code, country, password):
        print(f"Starting user creation process for username: {username}, email: {email} with IP Address: {country.ip_address} in the country: {country.country_code}")

        
        # Count the number of users with the same IP
        user_count = User.objects.filter(country__ip_address=country.ip_address).count()
        print("User Count:", user_count)
            
        if user_count >= 2:
            raise ValidationError("You cannot register more than 2 accounts from the same IP.")

        code = invite_code
        invitation_code = code if code else None
        referrer = None

        print(f"Invitation Code: {invitation_code}")

        if invitation_code:
            try:
                referrer = User.objects.get(referral_code__iexact=invitation_code)
                print(f"Referrer found: {referrer.username}")
            except User.DoesNotExist:
                print(f"No referrer found for invitation code: {invitation_code}")
                raise ValueError(_('Invalid invitation code.'))

        try:
            with transaction.atomic():
                new_referral_code = generate_referral_code()
                print(f"Generated new referral code: {new_referral_code}")

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    country=country,
                    password=password,
                    referral_code=new_referral_code,
                )
                print(f"User created: {user.username} with referral code {new_referral_code}")

                code = 'US'
                print(f"Looking for Country: {code}")
                currency = Currency.objects.get(code=code)
                print(f"Country Found: {currency.code}")

                Wallet.objects.create(user=user, currency=currency)
                print(f"Wallet created for user {user.username} with currency {currency.currency_code}")

                # Create a referral entry if a referrer exists
                if referrer:
                    print(f"Creating referral entries for referrer {referrer.username}")
                    current_referrer = referrer
                    current_level = 1 
                    while current_referrer and current_level <= 3:
                        print(f"Processing referral level {current_level} for referrer {current_referrer.username}")
                        try:
                            referral_level = ReferralLevel.objects.get(level=current_level)
                            print(f"Referral level found: {referral_level.level}")
                        except ReferralLevel.DoesNotExist:
                            print(f"Referral level {current_level} does not exist.")
                            raise ValueError(_('Referral level does not exist.'))

                        Referral.objects.create(
                            referrer=current_referrer,
                            referred=user,
                            invitation_code=invitation_code,
                            level=referral_level 
                        )
                        print(f"Referral created for {current_referrer.username} at level {current_level}")

                        # Move up one level in the referral chain
                        referrer_referrals = Referral.objects.filter(referred=current_referrer)
                        if referrer_referrals.exists():
                            current_referrer = referrer_referrals.first().referrer
                            print(f"Moved up to next referrer: {current_referrer.username}")
                        else:
                            print(f"No further referrer found, breaking loop.")
                            break
                        current_level += 1

        except Exception as e:
            print(f"Registration Error: {e}")
            raise ValueError(_('An error occurred during registration. Please try again.'))

        print(f"User creation process completed successfully for user {user.username}")
        return user


