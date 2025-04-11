from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import UserProfile, ReferralCode, ReferredUser, ReferralEarning, ReferralLevel, ReferralLevelBenefit

User = get_user_model()

"""
Registration Serializer
- Serializes for user registration
- Validates email and password
- Creates a new user and associated profile
- Returns user object
"""
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, write_only=True)

    
    class Meta:
        model = User
        fields = ('email',  'password', 'referral_code')
        
    def create(self, validated_data):

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            referral_code=validated_data.get('referral_code', None)
        )
        # Create an associated profile
        UserProfile.objects.create(user=user)

        return user


"""
Login Serializer
- Serializes for user login
- Validates user credentials
- Returns user object if valid
- Raises validation error if invalid
"""
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    

"""
User Profile Serializer
- Serializes user profile data
- Includes fields like name, email, avatar, location, etc.
- Calculates profile completion percentage"""
class StatsSerializer(serializers.Serializer):
    profileCompletion = serializers.IntegerField(source='profile_completion')
    

# Serializer for referred users (people referred by the current user)
class ReferredUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='referred_user.id')
    name = serializers.SerializerMethodField()
    joinDate = serializers.DateTimeField(source='join_date', format='%Y-%m-%d')
    surveys = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferredUser
        fields = ('id', 'name', 'joinDate', 'status', 'surveys')
    
    def get_name(self, obj):
        profile = UserProfile.objects.get(user=obj.referred_user)
        return profile.get_full_name()
    
    def get_surveys(self, obj):
        # Count survey activities for this referred user
        return obj.activities.filter(activity_type='survey_completed').count()


# Serializer for referral earnings
class ReferralEarningSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(source='total_earnings', max_digits=10, decimal_places=2)
    fromReferrals = serializers.DecimalField(source='referral_earnings', max_digits=10, decimal_places=2)
    
    class Meta:
        model = ReferralEarning
        fields = ('total', 'fromReferrals')


class ReferralLevelBenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralLevelBenefit
        fields = ['description']

class ReferralLevelSerializer(serializers.ModelSerializer):
    benefits = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralLevel
        fields = ['name', 'threshold', 'icon', 'benefits', 'color', 'text_color', 'border_color']
    
    def get_benefits(self, obj):
        benefits = obj.benefits.all()
        return [benefit.description for benefit in benefits]


# Serializer for referral information
class ReferralSerializer(serializers.ModelSerializer):
    referralCode = serializers.CharField(source='code')
    referralCount = serializers.IntegerField(source='user.profile.referral_count')
    referredUsers = ReferredUserSerializer(source='referred_users', many=True)
    earnings = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralCode
        fields = ('referralCode', 'referralCount', 'level', 'referredUsers', 'earnings')
    
    def get_earnings(self, obj):
        try:
            earnings = ReferralEarning.objects.get(user=obj.user)
            return ReferralEarningSerializer(earnings).data
        except ReferralEarning.DoesNotExist:
            return {
                'total': 0,
                'fromReferrals': 0
            }


"""User Profile Serializer
- Serializes user profile data
- Includes fields like name, email, avatar, location, etc.
- Calculates profile completion percentage
"""
class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email')
    createdAt = serializers.DateTimeField(source='user.date_joined', format='%Y-%m-%d')
    stats = serializers.SerializerMethodField()
    referrals = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ('name', 'email', 'avatar', 'createdAt', 'location', 'country', 
                  'profession', 'phone', 'website', 'company', 'bio', 'stats', 'referrals', 'referral_count', 'surveys_completed')
    
    def get_name(self, obj):
    # If obj is a User object and you're trying to get the profile's name
        if hasattr(obj, 'profile'):
            profile = obj.profile
            if profile.first_name and profile.last_name:
                return f"{profile.first_name} {profile.last_name}"
        # If obj is already a UserProfile
        elif hasattr(obj, 'first_name') and hasattr(obj, 'last_name'):
            if obj.first_name and obj.last_name:
                return f"{obj.first_name} {obj.last_name}"
        
        # Fallback to email
        return obj.email if hasattr(obj, 'email') else obj.user.email
    
    def get_stats(self, obj):
        return {
            'profileCompletion': obj.profile_completion
        }
    
    def get_referrals(self, obj):
        try:
            user = obj.user if hasattr(obj, 'user') else obj
            referral_code = ReferralCode.objects.get(user=user)
            return ReferralSerializer(referral_code).data
        except ReferralCode.DoesNotExist:
            return None

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update user data if provided
        user = instance.user
        if 'email' in user_data:
            user.email = user_data['email']
            user.save()
        
        # Update profile data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.calculate_profile_completion()
        instance.save()
        
        return instance


