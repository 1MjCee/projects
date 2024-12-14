from django.contrib.admin import AdminSite
from unfold.sites import UnfoldAdminSite
from backend.views import dashboard, dashboard_callback
from django.shortcuts import render, redirect
from django.urls import path
from .forms import PromoCodeGenerationForm
from django.db.models import Sum
from django.utils.timezone import now
from django.contrib import messages
from .CustomAdmins import (
    CustomUserAdmin, InvestmentPlanAdmin, PromoCodeAdmin, TransactionAdmin,
    UserInvestmentPlanAdmin, WalletAdmin, ReferralLevelAdmin, ReferralAdmin,
    GuideAdmin, RankingUserAdmin, RankingAdmin, WithdrawalDetailAdmin,
    WithdrawalTermsAdmin, PaymentMethodAdmin, CurrencyAdmin, NoticeAdmin,
    CountryAdmin, PaymentTypeAdmin, PaymentProofAdmin, NoticeSectionAdmin,
    SpinnersAdmin, PaymentOrderAdmin, UserInvestmentPlanAdmin, ExchangeRateAdmin, ReviewAdmin
)
from .models import (
    User, PromoCode, InvestmentPlan, UserInvestmentPlan, Wallet, Transaction,
    Referral, ReferralLevel, Ranking, RankingUser, WithdrawalDetail, PaymentType,
    WithdrawalTerm, PaymentMethod, Guide, Currency, Notice, Country,
    PaymentProof, NoticeSection, Spinner, PaymentOrder, ExchangeRate, Review
)

class AdminDashboard(UnfoldAdminSite):
    site_header = 'Spin World'
    site_title = 'Spin World'
    index_title = 'Spin World'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(dashboard), name='admin-index'),
        ]
        return custom_urls + urls
    
    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        ordering = [
            'Transaction', 'PaymentOrder', 'User', 'InvestmentPlan', 'UserInvestmentPlan', 'Country', 'PaymentMethod', 'PaymentType',
            'Withdrawal', 'Wallet', 'Currency', 'PaymentProof', 'Referral', 'ReferralLevel', 'Ranking', 'RankingUser',
            'WithdrawalTerm', 'WithdrawalDetail', 'PromoCode', 'Spinner',  'ExchangeRate', 'Guide', 'Notice', 'NoticeSection', 'Review'
        ]
        
        for app in app_list:
            if app['app_label'] == 'system':
                app['models'].sort(key=lambda x: ordering.index(x['object_name']))
        return app_list

# Instantiate the custom admin site
my_custom_admin = AdminDashboard(name='custom_admin')

# Register your models with the custom admin site
my_custom_admin.register(User, CustomUserAdmin)
my_custom_admin.register(PromoCode, PromoCodeAdmin)
my_custom_admin.register(UserInvestmentPlan, UserInvestmentPlanAdmin)
my_custom_admin.register(Wallet, WalletAdmin)
my_custom_admin.register(Transaction, TransactionAdmin)
my_custom_admin.register(Referral, ReferralAdmin)
my_custom_admin.register(ReferralLevel, ReferralLevelAdmin)
my_custom_admin.register(Ranking, RankingAdmin)
my_custom_admin.register(WithdrawalDetail, WithdrawalDetailAdmin)
my_custom_admin.register(RankingUser, RankingUserAdmin)
my_custom_admin.register(PaymentMethod, PaymentMethodAdmin)
my_custom_admin.register(WithdrawalTerm, WithdrawalTermsAdmin)
my_custom_admin.register(Guide, GuideAdmin)
my_custom_admin.register(Currency, CurrencyAdmin)
my_custom_admin.register(Notice, NoticeAdmin)
my_custom_admin.register(NoticeSection, NoticeSectionAdmin)
my_custom_admin.register(Country, CountryAdmin)
my_custom_admin.register(PaymentType, PaymentTypeAdmin)
my_custom_admin.register(PaymentProof, PaymentProofAdmin)
my_custom_admin.register(Spinner, SpinnersAdmin)
my_custom_admin.register(PaymentOrder, PaymentOrderAdmin)
my_custom_admin.register(InvestmentPlan, InvestmentPlanAdmin)
my_custom_admin.register(ExchangeRate, ExchangeRateAdmin)
my_custom_admin.register(Review, ReviewAdmin)
