from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models import User, Country
from .miscellaneous_serializers import CountrySerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist


# Serializer for User Model
class UserSerializer(serializers.ModelSerializer):
    country = CountrySerializer()
    
    class Meta:
        model = User
        fields = ["id", 'email', 'avatar', 'username', "phone_number", 'country', "is_active", "date_joined"]

# Handles user registration
class RegisterSerializer(serializers.ModelSerializer):
    invite_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email' 'invite_code', 'password')
        extra_kwargs = {'password': {'write_only': True}}


# Serializer for Login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data['email']
        password = data['password']
        
        # Try to find the user by email
        try:
            user = get_user_model().objects.get(email=email)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("No account found with that email address.")  # More user-friendly error

        # Check the password
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password. Please try again.")  # Clear message for incorrect password
        
        # Return the user instance if everything is correct
        return user


# Serializer for returning JWT tokens
class JWTTokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

    @classmethod
    def get_tokens_for_user(cls, user):
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

    
class RegisterUserSerializer(serializers.ModelSerializer):
    invite_code = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'invite_code', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }


# Handles password Reset
class PasswordResetRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    
class PasswordResetSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    reset_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({'old_password': _('Old password is not correct.')})

        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance