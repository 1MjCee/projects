from django.contrib import admin
from unfold.admin import ModelAdmin


class WalletAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = (
        'id', 'user', 'deposit', 'expenditure', 'total_earnings', 'withdrawal', 'balance', 'currency', 'updated_on'
    )
    
    # Filters to use in the list view
    list_filter = ('currency', 'updated_on', 'user')
    
    # Fields to search in the admin interface
    search_fields = ('id', 'user__email', 'user__username')
    
    # Read-only fields
    readonly_fields = ('updated_on',)

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('user', 'deposit', 'total_earnings', 'withdrawal', 'currency')
        }),
        ('Timestamps', {
            'fields': ('updated_on', )
        }),
    )
    list_per_page = 10