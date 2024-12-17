from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from ..models import User
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from django.utils.html import format_html
from django.urls import reverse
from django.utils.http import urlencode

class CustomUserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    
    # Display fields in the list view
    list_display = ('id', 'username', 'email', 'get_ip_address_link', 'get_country', 'referral_code', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login')
    
    # Fields to search in the admin interface
    search_fields = ( 'username', 'email', 'country__country_code')
    
    # Filters to use in the list view
    list_filter = ('is_staff', 'is_active', 'date_joined', 'last_login', 'country__country_code')
    
    # Fieldsets for the detail view
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('referral_code',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('date_joined', 'last_login')}),
    )
    
    # Add fieldsets for user creation
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )
    
    # Read-only fields
    readonly_fields = ('date_joined', 'last_login')

    # Ordering
    ordering = ('date_joined',)

    def get_ip_address_link(self, obj):
        if obj.country:  # Check if the user has a related country
            url = reverse('admin:%s_%s_change' % ('system', 'country'), args=[obj.country.ip_address])
            return format_html('<a href="{}">{}</a>', url, obj.country.ip_address)
        return '-'

    get_ip_address_link.short_description = 'IP Address'
    def get_country(self, obj):
        return obj.country.country if obj.country else '-'
    
    get_country.short_description = 'Country'
    
class GuideAdmin(ModelAdmin):
    list_display = ('title', 'description', 'general_steps')
    search_fields = ('title',)
    list_per_page = 10
    
class CountryAdmin(ModelAdmin):
    list_display = (
        'ip_address' , 'country_code', 'calling_code', 'currency', 'city', 'region', 
        'loc', 'org', 'postal', 'timezone',
    )
    readonly_fields = ('ip_address', 'currency', 'country_code', 'calling_code', 'city',
                       'region', 'loc', 'org', 'postal', 'timezone')
    search_fields = ('country_code', 'city', 'region')
    ordering = ('country_code',)
