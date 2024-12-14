from django.contrib import admin
from ..models import PromoCode
from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
import random
from ..forms import PromoCodeGenerationForm
from django.contrib import messages
import string
from django.utils.translation import gettext as _
from unfold.admin import ModelAdmin
from ..models import PromoCode


class PromoCodeAdmin(ModelAdmin):
    actions = ['generate_promo_codes']

    # Display fields in the list view
    list_display = ('code', 'amount', 'used', 'adjusted_amount', 'created_at', 'updated_at', 'won_by', 'created_by')
    
    # Fields to search in the admin interface
    search_fields = ('code', 'won_by__email', 'created_by__email')
    
    # Filters to use in the list view
    list_filter = ('used', 'created_at', 'updated_at', 'won_by', 'created_by')
    
    # Read-only fields (if needed)
    readonly_fields = ('created_at', 'updated_at')

    @admin.action(description='Generate Promo Codes')
    def generate_promo_codes(self, request, queryset):
        num_codes = int(request.POST.get('num_codes', 10))
        for promo in queryset:
            amount = promo.amount
            for _ in range(num_codes):
                PromoCode.objects.create(
                    created_by=request.user,
                    amount=amount
                )
        self.message_user(request, f'{num_codes * len(queryset)} Promo Codes created successfully.')

    
    list_per_page = 10

class SpinnersAdmin(ModelAdmin):
    list_display = ('user', 'is_eligible', 'max_spins', 'spin_count', 'last_spin')
    search_fields = ('user',)
    list_filter = ('user', 'is_eligible', 'last_spin')