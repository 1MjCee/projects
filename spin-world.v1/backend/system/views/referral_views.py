from rest_framework import viewsets, permissions
from ..models import ReferralLevel, Referral
from rest_framework import viewsets
from ..serializers import (ReferralSerializer, ReferralLevelSerializer,
                           UserSerializer, WalletSerializer, TransactionSerializer,
                           TradeSettingSerializer, ReferralStatsSerializer)
from ..models import Referral, User, Wallet, Transaction, TradeSetting
from rest_framework.response import Response
from rest_framework import status
from ..services import ReferralHelper, ReferralStatisticsHelper
from decimal import Decimal
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.db.models import Case, When, Value, IntegerField, Count
import logging
from django.db.models import Count, Q
from django.db.models import Prefetch
from django.utils import timezone
from django.db.models import Sum
logger = logging.getLogger(__name__)
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _


# Referral Level View
class ReferralLevelViewSet(viewsets.ModelViewSet):
    queryset = ReferralLevel.objects.all()
    serializer_class = ReferralLevelSerializer


class ReferralViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        Retrieve referral statistics for the current user, including:
         - Number of referrals per level
         - List of referrals per level
         - Number of referrals completed today
         - Total referral commission for the month
         - Total referral commission by level
        """
        # Get the current user from the request
        user = request.user
        print(f"Debug: User authenticated - {user.is_authenticated}")

        # Ensure the user is authenticated
        if not user.is_authenticated:
            print("Debug: User is not authenticated.")
            return Response(
                {"detail": _("You must be logged in to access referral statistics.")},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            print("Debug: Attempting to retrieve referral statistics.")
            stats = ReferralStatisticsHelper.get_referral_statistics(user.id)
            print(f"Debug: Retrieved stats - {stats}")
        except User.DoesNotExist:
            print("Debug: User does not exist.")
            return Response(
                {"detail": _("Referrer not found.")},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Debug: An error occurred - {str(e)}")
            return Response(
                {"detail": _("An error occurred while retrieving statistics: {}".format(str(e)))},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        print("Debug: Successfully returned referral statistics.")
        return Response(stats, status=status.HTTP_200_OK)



# User Referral View
class UserReferralViewSet(viewsets.ViewSet):
    """
    Viewset to handle user-specific referral operations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReferralSerializer

    def list(self, request):
        """
        List all referrals where the current user is the referred user.
        """
        # Get the current authenticated user
        user = request.user

        # Fetch referrals where the user is the referred user
        referrals = Referral.objects.filter(referred=user)

        # Serialize the referral data
        serializer = self.serializer_class(referrals, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
