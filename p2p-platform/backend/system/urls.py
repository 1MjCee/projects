from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (RegistrationViewSet, AuthViewSet, InvestmentPlansViewSet, UserInvestmentPlansViewSet,
                    PromoCodeViewSet,  WalletViewSet, TransactionViewSet, PaymentMethodViewSet, ReferralViewSet,
                    ReferralLevelViewSet,  RankingViewSet, RankingUserViewSet, WithdrawalDetailViewSet,
                    DepositViewSet, WithdrawalTermViewSet,  WithdrawalViewSet, AdminDepositConfirmViewSet, AdminRejectDepositViewSet, AdminWithdrawalConfirmViewSet,
                    AdminRejectWithdrawalViewSet, UserViewSet,  CountryViewSet, AuthViewSet, PaymentTypeViewSet, PaymentProofViewSet,
                    SpinnerViewSet, PaymentOrderViewSet, payment_status, payment_callback, get_available_currencies, get_minimum_payment_amount,
                    get_estimated_price, get_exchange_rates, StatsViewSet, ExchangeRateViewSet, ReviewViewSet, UserReferralViewSet
                    )

router = DefaultRouter()

# User Auth Routes
router.register(r'registration', RegistrationViewSet, basename='registration')
router.register(r'users', UserViewSet, basename='users')
router.register(r'auth', AuthViewSet, basename='auth')


# Investment Routes
router.register(r"investment-plans", InvestmentPlansViewSet, basename='investments')
router.register(r"user-investment-plans", UserInvestmentPlansViewSet, basename="user-investments")
router.register(r'promo-codes', PromoCodeViewSet, basename="PromoCode")
router.register(r'user-wallet', WalletViewSet, basename='user-wallet')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-methods')

# Referral routes
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'user-referrals', UserReferralViewSet, basename='user-referrals')
router.register(r'referral-levels', ReferralLevelViewSet, basename='referral-levels')
router.register(r'rankings', RankingViewSet, basename='rankings')
router.register(r'ranking-users', RankingUserViewSet, basename='ranking-users')

# Financials related routes
router.register(r'withdrawal-details', WithdrawalDetailViewSet, basename='withdrawal-detail')
router.register(r'deposits', DepositViewSet, basename='deposit')
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawal')
router.register(r'admin/confirm-deposits', AdminDepositConfirmViewSet, basename='admin-confirm-deposit')
router.register(r'admin/confirm-withdrawals', AdminWithdrawalConfirmViewSet, basename=" admin-confirm-withdrawal")
router.register(r'admin/eject-deposits', AdminRejectDepositViewSet, basename='reject-deposit')
router.register(r'admin/reject-withdrawals', AdminRejectWithdrawalViewSet, basename='reject-withdrawal')
router.register(r'withdrawal-terms', WithdrawalTermViewSet, basename='withdrawal-terms')
router.register(r'payment-types', PaymentTypeViewSet, basename='paymenttype')
router.register(r'withdrawal-proofs', PaymentProofViewSet)

# Miscellanous Routes
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'spinners', SpinnerViewSet, basename="spinners")
router.register(r'stats', StatsViewSet, basename='stats-view')
router.register(r'exchange-rates', ExchangeRateViewSet, basename='exchange-rates')
router.register(r'reviews', ReviewViewSet)

# Payment Order endpoints
router.register(r'payment-orders', PaymentOrderViewSet, basename='payment-order')


urlpatterns = [
    path('', include(router.urls)),
    path('payment-orders/<int:order_id>/status/', payment_status, name='payment-status'),
    path('payment-callback/<int:order_id>/', payment_callback, name='payment-callback'),
    path('payment/currencies/', get_available_currencies, name='get_available_currencies'),
    path('payment/min-amount/', get_minimum_payment_amount, name='get_minimum_payment_amount'),
    path('payment/estimated-price/', get_estimated_price, name='get_estimated_price'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 