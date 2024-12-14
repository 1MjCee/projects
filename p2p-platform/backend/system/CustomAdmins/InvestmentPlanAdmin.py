from django.contrib import admin
from ..models import InvestmentPlan, UserInvestmentPlan
from unfold.admin import ModelAdmin    

class InvestmentPlanAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = ('number', 'name', 'price', 'currency', 'duration_in_months', 'prize_multiplier', 'daily_withdraw_limit', 'description', 'created_at')
    
    # Fields to search in the admin interface
    search_fields = ('name', 'price', 'currency')
    
    # Filters to use in the list view
    list_filter = ('created_at', 'name', 'currency')
    
    # Read-only fields
    readonly_fields = ('created_at', )
    list_per_page = 15


class UserInvestmentPlanAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = (
        'id', 'user', 'investment_plan', 'created_at', 'expired'
    )
    
    # Filters to use in the list view
    list_filter = ('expired', 'created_at')
    
    # Fields to search in the admin interface
    search_fields = ('id', 'user__email', 'investment_plan__name')
    
    # Read-only fields
    readonly_fields = ('created_at',)
    list_per_page = 15

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('user', 'investment_plan', 'expired')
        }),
        ('Timestamps', {
            'fields': ('created_at', )
        }),
    )