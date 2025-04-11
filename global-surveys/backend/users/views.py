from rest_framework import status, viewsets, permissions, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import UserProfile, ReferralCode, ReferredUser, ReferralEarning, ReferralActivity, ReferralLevel
from .serializers import (
    RegistrationSerializer, 
    LoginSerializer,
    UserProfileSerializer,
    ReferralSerializer, 
    ReferredUserSerializer,
    ReferralLevelSerializer,
)

User = get_user_model()

class AuthViewSet(viewsets.GenericViewSet):
    """
    ViewSet for user authentication (registration and login)
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create referral code and earnings record immediately
            from .models import ReferralCode, ReferralEarning
            
            # Generate and create referral code
            code_text = ReferralCode.generate_code(user)
            referral_code = ReferralCode.objects.create(user=user, code=code_text)
            
            # Create earnings record
            ReferralEarning.objects.create(user=user)
            
            # Process referral if provided
            invite_code = request.data.get('invite_code')
            if invite_code:
                try:
                    # Look up the referrer's code
                    referrer_code = ReferralCode.objects.get(code=invite_code)
                    
                    # Create the referred user relationship but keep it pending
                    ReferredUser.objects.create(
                        referrer_code=referrer_code,
                        referred_user=user,
                        status='pending'
                    )
                    
                    # Optionally record this as an activity
                    ReferralActivity.objects.create(
                        referred_user=ReferredUser.objects.get(referred_user=user),
                        activity_type='registration',
                    )
            
                except ReferralCode.DoesNotExist:
                    # Invalid referral code, you might want to log this
                    pass
            
            # Handle JWT token generation
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            # Get profile and include it in response
            profile = UserProfile.objects.get(user=user)
            profile_serializer = UserProfileSerializer(profile)
            
            # Return the tokens and user data
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': profile_serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            
            # Handle JWT token generation
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            profile = UserProfile.objects.get(user=user)
            profile_serializer = UserProfileSerializer(profile)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': profile_serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def refresh(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Validate and create new tokens
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        except Exception as e:
            return Response({"detail": str(e)}, 
                            status=status.HTTP_400_BAD_REQUEST)


class ReferralViewSet(viewsets.GenericViewSet):
    """
    ViewSet for managing user referrals
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ReferralSerializer
    
    def get_queryset(self):
        return ReferralCode.objects.filter(user=self.request.user)
    
    def get_object(self):
        return get_object_or_404(ReferralCode, user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_referrals(self, request):
        """Get the current user's referral information"""
        referral_code = self.get_object()
        serializer = self.get_serializer(referral_code)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get summary statistics about referrals"""
        referral_code = self.get_object()
        
        # Get counts for different statuses
        total_referrals = referral_code.referred_users.count()
        active_referrals = referral_code.referred_users.filter(status='active').count()
        pending_referrals = referral_code.referred_users.filter(status='pending').count()
        
        # Get earnings
        try:
            earnings = ReferralEarning.objects.get(user=request.user)
            total_earnings = earnings.total_earnings
            referral_earnings = earnings.referral_earnings
        except ReferralEarning.DoesNotExist:
            total_earnings = 0
            referral_earnings = 0
        
        return Response({
            'referralCode': referral_code.code,
            'level': referral_code.level,
            'totalReferrals': total_referrals,
            'activeReferrals': active_referrals,
            'pendingReferrals': pending_referrals,
            'totalEarnings': total_earnings,
            'referralEarnings': referral_earnings,
        })
    
    @action(detail=False, methods=['get'])
    def referred_users(self, request):
        """Get list of users referred by the current user"""
        referral_code = self.get_object()
        referred_users = referral_code.referred_users.all()
        serializer = ReferredUserSerializer(referred_users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def record_activity(self, request, pk=None):
        """Record an activity for a referred user (e.g., completing a survey)"""
        referred_user = get_object_or_404(ReferredUser, pk=pk)
        
        # Check if the current user is the referrer
        if referred_user.referrer_code.user != request.user:
            return Response(
                {"detail": "You are not authorized to record activities for this user."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        activity_type = request.data.get('activity_type')
        details = request.data.get('details', {})
        
        if not activity_type:
            return Response(
                {"detail": "Activity type is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Record the activity
        activity = ReferralActivity.objects.create(
            referred_user=referred_user,
            activity_type=activity_type,
            details=details
        )
        
        # If this is a survey completion, activate the user if they're pending
        if activity_type == 'survey_completed' and referred_user.status == 'pending':
            referred_user.activate()
            
            # Award referral bonus if it's their first survey
            first_survey = referred_user.activities.filter(
                activity_type='survey_completed'
            ).count() == 1
            
            if first_survey:
                try:
                    # Award $5 bonus for first survey completion by a referral
                    earnings = ReferralEarning.objects.get(user=request.user)
                    earnings.add_referral_earnings(5.00)
                except ReferralEarning.DoesNotExist:
                    pass
        
        return Response({"detail": "Activity recorded successfully."})

    @action(detail=False, methods=['post'])
    def activate_referral(self, request):
        """
        Manually activate a pending referral.
        This could be used by admins or triggered by other events.
        """
        referred_user_id = request.data.get('referred_user_id')
        if not referred_user_id:
            return Response(
                {"detail": "Referred user ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        referred_user = get_object_or_404(ReferredUser, id=referred_user_id)
        
        # Check if the current user is the referrer
        if referred_user.referrer_code.user != request.user:
            return Response(
                {"detail": "You are not authorized to activate this referral."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Activate the referral
        if referred_user.status == 'pending':
            referred_user.activate()
            return Response({"detail": "Referral activated successfully."})
        else:
            return Response({"detail": "Referral is already active."})
        
    @action(detail=False, methods=['get'])
    def levels(self, request):
        """Get all available referral levels and their benefits"""
        levels = ReferralLevel.objects.all().order_by('threshold')
        serializer = ReferralLevelSerializer(levels, many=True)
        return Response(serializer.data)

class UserProfileViewSet(viewsets.GenericViewSet, 
                         mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin):
    """
    ViewSet for user profile management
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's profile"""
        profile = self.get_object()

        profile.calculate_profile_completion()
        profile.save(update_fields=['profile_completion'])
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], url_path='update-me')
    def update_me(self, request):
        """Update the current user's profile"""

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Re-fetch updated profile data
        updated_serializer = self.get_serializer(instance)
        return Response(updated_serializer.data)
        
    @action(detail=False, methods=['get'], url_path='referral-code')
    def get_referral_code(self, request):
        """Get just the user's referral code for easy sharing"""
        try:
            referral_code = ReferralCode.objects.get(user=request.user)
            return Response({
                "referralCode": referral_code.code,
                "level": referral_code.level
            })
        except ReferralCode.DoesNotExist:
            return Response(
                {"detail": "No referral code found."},
                status=status.HTTP_404_NOT_FOUND
            )