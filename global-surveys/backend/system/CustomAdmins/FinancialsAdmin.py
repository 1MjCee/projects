from django.contrib import admin
from ..models import WithdrawalDetail, WithdrawalTerm
from django.utils.html import mark_safe
from unfold.admin import ModelAdmin

class CurrencyAdmin(ModelAdmin):
    list_display = ('code', 'country', 'currency_code', 'currency_name', 'symbol')
    search_fields = ('code', 'currency_name', 'country')
    readonly_fields = ('code', 'currency_name', 'currency_code', 'country')
    ordering = ('country',)
    list_per_page = 20

class WithdrawalDetailAdmin(ModelAdmin):
    list_display = ('user', 'real_name', 'account_number', 'withdrawal_type', 'created_at', 'updated_at')
    search_fields = ('user__username', 'real_name', 'account_number')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')

    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Username'
    

class PaymentProofAdmin(ModelAdmin):
    list_display = ('transaction', 'text', 'date_disbursed', 'proof_file')
    search_fields = ('transaction__id',)
    list_filter = ('date_disbursed', 'date_disbursed')
    readonly_fields = ('date_disbursed',)


class WithdrawalTermsAdmin(ModelAdmin):
    list_display = (
        'minimum_withdrawal_amount',
        'minimum_withdrawal_commission',
        'withdrawal_tax_percentage',
        'withdrawal_timeframe_start',
        'withdrawal_timeframe_end',
        'withdrawal_processing_time_min',
        'withdrawal_processing_time_max',
        'currency',
        'withdrawals_processed_on_weekends',
    )
    list_filter = (
        'withdrawals_processed_on_weekends',
        'withdrawal_tax_percentage',
        'currency',
    )
    search_fields = (
        'minimum_withdrawal_amount',
        'minimum_withdrawal_commission',
        'withdrawal_tax_percentage',
        'currency',
    )
    readonly_fields = []
    fieldsets = (
        ('Basic Details', {
            'fields': (
                'minimum_withdrawal_amount',
                'minimum_withdrawal_commission',
                'withdrawal_tax_percentage',
                'currency',
            ),
        }),
        ('Timeframe and Processing', {
            'fields': (
                'withdrawal_timeframe_start',
                'withdrawal_timeframe_end',
                'withdrawal_processing_time_min',
                'withdrawal_processing_time_max',
            ),
        }),
        ('Other Settings', {
            'fields': (
                'withdrawals_processed_on_weekends',
            ),
            'description': 'Specify whether withdrawals are processed on weekends.',
        }),
    )