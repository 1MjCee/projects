from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from ..models import Wallet, Transaction, WithdrawalDetail, WithdrawalTerm, PaymentProof
from ..serializers import (WalletSerializer, TransactionSerializer, WithdrawalDetailSerializer, WithdrawalTermSerializer, PaymentProofSerializer)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from ..services import WithdrawalHelper, DepositHelper
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAdminUser
from django.utils.translation import gettext as _
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated, AllowAny


# WALLET VIEWSET
class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        try:
            wallet = Wallet.objects.get(user=user)
            serializer = WalletSerializer(wallet)
            return Response(serializer.data)
        except Wallet.DoesNotExist:
            return Response({"detail": _("Wallet not found.")}, status=404)


# TRANSACTIONS VIEWSET
class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
   

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(user=user).order_by('created_at')


"""
This is Withdrawa detail viewset which creates, updates, and retrieves
withdrawal details for the user
"""
class WithdrawalDetailViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post', 'put'], url_path='withdrawal')
    def create_or_update(self, request):
        serializer = WithdrawalDetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            withdrawal_detail, created = WithdrawalHelper.set_withdrawal_details(
                user=request.user,
                real_name=serializer.validated_data['real_name'],
                account_number=serializer.validated_data['account_number'],
                withdrawal_type=serializer.validated_data.get('withdrawal_type')
            )
            if created:
                print("Withdrawal details created successfully.")
                return Response(WithdrawalDetailSerializer(withdrawal_detail).data, status=status.HTTP_201_CREATED)
            else:
                print("Withdrawal details updated successfully.")
                return Response(WithdrawalDetailSerializer(withdrawal_detail).data, status=status.HTTP_200_OK)
        
        print("Error processing withdrawal details:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request):
        """
        List the withdrawal details for the authenticated user.

        Args:
            request: The request object.

        Returns:
            Response: A response containing the withdrawal details or an error message.
        """
        withdrawal_detail = WithdrawalDetail.objects.filter(user=request.user).first()
        if withdrawal_detail:
            serializer = WithdrawalDetailSerializer(withdrawal_detail)
            return Response(serializer.data)
        return Response({"detail": _("No withdrawal details found.")}, status=status.HTTP_404_NOT_FOUND)


class WithdrawalTermViewSet(viewsets.ModelViewSet):
    queryset = WithdrawalTerm.objects.all()
    serializer_class = WithdrawalTermSerializer


# DEPOSIT VIEWSET
class DepositViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def deposit_request(self, request):
        try:
            user = request.user
            amount = request.data.get('amount')
            reference_code = request.data.get('reference_code')
            payment_type = request.data.get('payment_type') 

            if not amount or not reference_code or not payment_type:
                return Response({'success': False, 'message': _('Amount, reference code, and payment type are required')}, 
                                status=status.HTTP_400_BAD_REQUEST)

            amount = float(amount)

            # Process the deposit using the service layer
            transaction_record = DepositHelper.process_deposit(user, amount, reference_code, payment_type)

            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Deposit request has been submitted successfully'), 
                             'transaction': serializer.data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminDepositConfirmViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm the deposit transaction with the given ID.
        """
        try:
            transaction_record = DepositHelper.confirm_deposit(pk)
            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Deposit request has been confirmed!'), 'transaction': serializer.data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class AdminRejectDepositViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Reject the deposit transaction with the given ID.
        """
        try:
            transaction_record = DepositHelper.reject_deposit(pk)
            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Deposit request rejected has been rejected!'), 'transaction': serializer.data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class WithdrawalViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def withdrawal_request(self, request):
        try:
            user = request.user
            print(f"User: {user.username}, ID: {user.id}")  
            
            amount = request.data.get('amount')
            print(f"Requested withdrawal amount: {amount}")  

            if not amount:
                print("Error: No amount specified")  
                return Response({'success': False, 'message': _('Please specify withdrawal amount!')}, status=status.HTTP_400_BAD_REQUEST)

            amount = float(amount)
            print(f"Processed amount: {amount}") 

            # Check if the user has a WithdrawalDetail record
            if not WithdrawalDetail.objects.filter(user=user).exists():
                print("Error: No WithdrawalDetail found for user")  
                return Response(
                    {'success': False, 'message': _('Please add your withdrawal method before proceeding!')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for pending withdrawal transactions
            if Transaction.objects.filter(user=user, type='withdrawal', status='pending').exists():
                print("Error: User has pending withdrawal requests")  
                return Response(
                    {'success': False, 'message': _('You have a pending withdrawal request!')},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process the withdrawal using the service layer
            transaction_record = WithdrawalHelper.process_withdrawal(user, amount)
            print(f"Transaction record created: {transaction_record}")  

            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Withdrawal request has been submitted!'), 'transaction': serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Exception occurred: {str(e)}") 
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminWithdrawalConfirmViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm the withdrawal transaction with the given ID.
        """
        try:
            transaction_record = WithdrawalHelper.confirm_withdrawal(pk)
            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Withdrawal request approved!'), 'transaction': serializer.data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminRejectWithdrawalViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        Reject the withdrawal transaction with the given ID.
        """
        try:
            transaction_record = WithdrawalHelper.reject_withdrawal(pk)
            serializer = TransactionSerializer(transaction_record)
            return Response({'success': True, 'message': _('Withdrawal request has been rejected '), 'transaction': serializer.data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentProofViewSet(viewsets.ModelViewSet):
    queryset = PaymentProof.objects.all()
    serializer_class = PaymentProofSerializer