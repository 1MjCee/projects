from rest_framework import viewsets
from ..models import PaymentMethod, PaymentType, PaymentOrder, Currency
from ..serializers import PaymentMethodSerializer, PaymentTypeSerializer
import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers import PaymentOrderSerializer
from django.conf import settings
from rest_framework.decorators import api_view
import json
import hmac
import hashlib
from rest_framework.exceptions import NotFound
import requests
from rest_framework.decorators import action


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class PaymentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentType.objects.all()
    serializer_class = PaymentTypeSerializer


class PaymentOrderViewSet(viewsets.ModelViewSet):
    queryset = PaymentOrder.objects.all()
    serializer_class = PaymentOrderSerializer

    @action(detail=False, methods=["post"])
    def create_payment(self, request):
        # Extract required fields from the request data
        price_amount = request.data.get("amount")
        price_currency = request.data.get("currency")
        pay_currency = request.data.get("cryptocurrency")

        # Fetching the user object
        user = request.user

        # Validation
        if not all([price_amount, price_currency, pay_currency]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Making sure user is authenticated
        if not user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Create the PaymentOrder object but don't save it yet
        order = PaymentOrder(
            user=user,
            amount=price_amount,
            currency=price_currency,
            cryptocurrency=pay_currency,
            status='waiting',
        )

        # Save the PaymentOrder instance to generate the unique `id`
        order.save()

        # Now the `order.id` is automatically generated and unique
        order_id = order.id

        # Step 1: Create the Invoice (before creating payment)
        invoice_url, invoice_id = self.create_invoice(price_amount, price_currency, pay_currency, order_id)

        if not invoice_url:
            return Response({"error": "Error creating invoice"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Create the Payment by Invoice
        api_url = "https://api.nowpayments.io/v1/invoice-payment"
        headers = {
            "x-api-key": settings.NOWPAYMENTS_API_KEY,
            "Content-Type": "application/json",
        }

        payload = {
            "iid": invoice_id,
            "pay_currency": pay_currency,
            "order_description": f"Order {order_id}: {price_amount} {price_currency}",
            "customer_email": user.email if user.is_authenticated else None,
        }

        # Log the payment request payload
        print(f"Payment Request Payload: {payload}")

        # Send the POST request to NOWPayments to create the payment by invoice
        payment_response = requests.post(api_url, headers=headers, json=payload)

        # Log the payment response status and message
        print(f"Payment creation response status code: {payment_response.status_code}")
        print(f"Payment creation response body: {payment_response.text}")

        if payment_response.status_code == 201:
            # Extract payment details from the response
            payment_data = payment_response.json()
            payment_id = payment_data.get("payment_id")
            pay_address = payment_data.get("pay_address")

            # Update the PaymentOrder with payment details
            order.payment_id = payment_id
            order.pay_address = pay_address
            order.status = "waiting"
            order.save()

            # Return the response data including the payment estimate and invoice URL
            return Response({
                "payment_id": payment_id,
                "pay_address": pay_address,
                "amount": price_amount,
                "currency": price_currency,
                "cryptocurrency": pay_currency,
                "order_id": order_id,
                "invoice_url": invoice_url,
            }, status=status.HTTP_201_CREATED)

        else:
            # Handle error response if payment creation fails
            return Response({
                "error": "Error creating payment",
                "details": payment_response.json(),
            }, status=status.HTTP_400_BAD_REQUEST)

    def create_invoice(self, price_amount, price_currency, pay_currency, order_id):
        """
        Automatically creates an invoice on NOWPayments and returns the invoice URL and invoice ID.
        """
        api_url = "https://api.nowpayments.io/v1/invoice"
        
        headers = {
            "x-api-key": settings.NOWPAYMENTS_API_KEY,
            "Content-Type": "application/json",
        }

        # Create payload for invoice creation
        payload = {
            "price_amount": price_amount,
            "price_currency": price_currency,
            "pay_currency": pay_currency,
            "ipn_callback_url": f"http://127.0.0.1:8000/api/payment/callback/{order_id}/", 
        }

        # Send POST request to NOWPayments API
        response = requests.post(api_url, headers=headers, json=payload)

        if response.status_code == 200:
            # If invoice creation is successful, get invoice data
            invoice_data = response.json()
            invoice_url = invoice_data.get("invoice_url")  
            invoice_id = invoice_data.get("id") 
            return invoice_url, invoice_id
        else:
            return None, None


@api_view(['POST'])
def payment_callback(request, order_id):
    """Callback endpoint to receive payment status updates from NOWPayments."""
    
    # Verify the IPN signature to ensure the request is authentic
    if not verify_ipn_signature(request):
        return Response({"detail": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the status from the callback data
    status = request.data.get("payment_status")
    
    # Update payment order status based on the payment status from NOWPayments
    try:
        payment_order = PaymentOrder.objects.get(nowpayments_order_id=order_id)
        if status == "confirmed":
            payment_order.status = "confirmed"
        elif status == "failed":
            payment_order.status = "failed"
        elif status == "expired":
            payment_order.status = "expired"
        elif status == "canceled":
            payment_order.status = "canceled"
        else:
            payment_order.status = "waiting"
        payment_order.save()
        
        return Response({"status": "success"}, status=status.HTTP_200_OK)
    
    except PaymentOrder.DoesNotExist:
        return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

def verify_ipn_signature(request):
    """Verify the HMAC signature to ensure the callback is authentic"""
    signature = request.headers.get('x-nowpayments-sig')
    if not signature:
        return False
    
    # Access the raw request data for signature verification
    raw_data = request.body

    # Sort the data as NOWPayments expects the parameters to be sorted
    try:
        data = json.loads(raw_data)
    except ValueError:
        return False  # Invalid JSON in the request

    # Sort the data lexicographically
    sorted_data = sorted(data.items())
    data_string = json.dumps(sorted_data, separators=(',', ':'))

    # Calculate the expected signature using the shared secret
    expected_signature = hmac.new(
        settings.NOWPAYMENTS_IPN_SECRET.encode(), 
        data_string.encode(), 
        hashlib.sha512
    ).hexdigest()

    return expected_signature == signature


@api_view(['POST'])
def update_payment_status(request, order_id, status):
    try:
        order = PaymentOrder.objects.get(order_id=order_id)
        order.status = status
        order.save()
        return Response({"status": "success", "order_status": status}, status=status.HTTP_200_OK)
    except PaymentOrder.DoesNotExist:
        return Response({"status": "not_found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def payment_status(request, order_id):
    try:
        order = PaymentOrder.objects.get(id=order_id)
        return Response({"status": order.status})
    except PaymentOrder.DoesNotExist:
        return Response({"status": "not_found"}, status=404)
