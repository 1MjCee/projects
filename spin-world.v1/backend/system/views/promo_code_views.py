from rest_framework import viewsets, permissions
from ..serializers import RedeemPromoCodeSerializer, PromoCodeSerializer, SpinnerSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..services import PromotionHelper
from django.shortcuts import render, redirect
from ..models import PromoCode, Spinner, Wallet, WithdrawalDetail, UserInvestmentPlan
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import random
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse
from django.views import View
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import user_passes_test


class PromoCodeViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        promo_codes = PromoCode.objects.all()
        serializer = PromoCodeSerializer(promo_codes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='redeem', permission_classes = [IsAuthenticated])
    def redeem(self, request):
        print("Received request data:", request.data)
        serializer = RedeemPromoCodeSerializer(data=request.data)

        # Fetch the associated payment type for the user
        try:
            wallet = Wallet.objects.get(user=request.user)
            user_investment_plan = UserInvestmentPlan.objects.filter(user=request.user).first()
            currency = str(wallet.currency)
            print("Wallet found:", wallet) 
        except Wallet.DoesNotExist:
            print("No wallet found for user:", request.user) 
            raise ValidationError(_("Please set up a withdrawal account first!."))


        if serializer.is_valid():
            print("Serializer is valid:", serializer.validated_data) 
            code = serializer.validated_data['code']
            prize_multiplier = user_investment_plan.investment_plan.prize_multiplier
            try:
                amount = PromotionHelper.redeem_code(request.user, code)
                print("Promo code redeemed. Amount:", amount)
                message = _(f"{currency} {amount} successfully added to your wallet. Congratulations")
                return Response({"message": message, "amount": amount, "currency": currency}, status=status.HTTP_200_OK)
            except ValidationError as e:
                print("Error during code redemption:", str(e))
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SpinnerViewSet(viewsets.ModelViewSet):
    queryset = Spinner.objects.all()
    serializer_class = SpinnerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        spinner, created = Spinner.objects.get_or_create(user=user)
        serializer.save(spinner=spinner)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def spin(self, request):
        user = request.user
        try:
            spinner = Spinner.objects.get(user=user)

            if spinner.is_eligible and spinner.max_spins > 0 and spinner.spin_count <= spinner.max_spins:
                spinner.spin_count += 1
                spinner.last_spin = timezone.now()
                spinner.save()
                return Response(
                    {
                        "message": "Spin successful!",
                        "remaining_spins": spinner.max_spins - spinner.spin_count 
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "message": "You are not eligible to spin or have exhausted your spins."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

        except Spinner.DoesNotExist:
            return Response(
                {"message": "You are not a spinner."},
                status=status.HTTP_404_NOT_FOUND
            )

 