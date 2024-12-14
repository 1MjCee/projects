from rest_framework import viewsets, permissions
from ..models import InvestmentPlan, PromoCode, UserInvestmentPlan, Transaction, Wallet
from ..serializers import InvestmentPlanSerializer, PromoCodeSerializer, UserInvestmentPlanSerializer
from ..services import InvestmentsHelper
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class InvestmentPlansViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InvestmentPlan.objects.all().order_by("price")
    serializer_class = InvestmentPlanSerializer
    
    @action(detail=False, methods=['post'], url_path='invest')
    def buy_investment(self, request):
        user = request.user
        investment_id = request.data.get('investment_id')

        if not investment_id:
            return Response({"detail": _("Investment ID is required")}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call the updated buy_investment method from InvestmentsHelper
            investment = InvestmentsHelper.buy_investment(user, investment_id)
            
            # You might want to add some feedback here
            return Response({"detail": _("Your investment has been succcessfully created!!"), "data": UserInvestmentPlanSerializer(investment).data}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle any unexpected errors
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserInvestmentPlansViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserInvestmentPlanSerializer
    
    def get_queryset(self):
        """
        This view returns a list of investment plans for the currently authenticated user.
        """
        return UserInvestmentPlan.objects.filter(user=self.request.user, expired=False)