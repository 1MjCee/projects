from django.contrib import admin
from ..models import Ranking
from unfold.admin import ModelAdmin


class RankingAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = (
        'ranking', 'name', 'minimum_referrals', 'minimum_spending', 'max_spins', 'withdraw_percentage', 'description'
    )
    
    # Fields to search in the admin interface
    search_fields = ('ranking', 'name', 'max_spins')
    
    # Filters to use in the list view
    list_filter = ('ranking', 'name', 'minimum_referrals', 'minimum_spending', 'max_spins', 'withdraw_percentage')

    # Read-only fields
    readonly_fields = ('created_at', 'updated_at')

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('ranking', 'name', 'minimum_referrals', 'minimum_spending', 'max_spins', 'withdraw_percentage', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


class RankingUserAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = (
        'id', 'user', 'ranking', 'created_at', 'updated_at'
    )
    
    # Fields to search in the admin interface
    search_fields = ('user__phone', 'ranking__ranking')
    
    # Filters to use in the list view
    list_filter = ('user', 'ranking')
    
    # Read-only fields
    readonly_fields = ('created_at', 'updated_at')

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('user', 'ranking')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )