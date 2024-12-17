from django.contrib import admin
from unfold.admin import ModelAdmin


# Customizing Referral Levels in Admin Panel
class ReferralLevelAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = ('id', 'rate', 'level', 'created_at', 'updated_at')
    
    # Fields to search in the admin interface
    search_fields = ('rate', 'level')
    
    # Filters to use in the list view
    list_filter = ('created_at', 'updated_at')
    
    # Read-only fields
    readonly_fields = ('created_at', 'updated_at')

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('rate', 'level')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    list_per_page = 15


# Customizing Referrals Data in Admin Panel
class ReferralAdmin(ModelAdmin):
    # Display fields in the list view
    list_display = (
        'id', 'referrer', 'referred', 'level', 'completed', 'invitation_code', 'created_at', 'updated_at'
    )
    
    # Fields to search in the admin interface
    search_fields = ('code', 'level', 'referrer__email', 'referred__email')
    
    # Filters to use in the list view
    list_filter = ('level', 'referrer', 'completed', 'created_at', 'updated_at')
    
    # Read-only fields
    readonly_fields = ('created_at', 'updated_at')

    # Fieldsets for the detail view
    fieldsets = (
        (None, {
            'fields': ('referrer', 'referred', 'level', 'completed', 'invitation_code')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    list_per_page = 15