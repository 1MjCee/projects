from django.contrib import admin
from unfold.admin import ModelAdmin


class PaymentMethodAdmin(ModelAdmin):
    list_display = ('method_type', 'address_number', 'recipient_name', 'minimum_amount', 'payment_process', 'currency', 'exchange_rate')
    search_fields = ('method_type', 'address_number', 'recipient_name')
    
    def method_type(self, obj):
        return obj.method_type.type 

    method_type.admin_order_field = 'method_type'  
    method_type.short_description = 'Method Type'
    
    list_per_page = 10
    
class PaymentTypeAdmin(ModelAdmin):
    list_display = ('id', 'type', 'country', 'description')
    search_fields = ('type',)
    fieldsets = (
        (None, {
            'fields': ('type', 'country', 'payment_icon', 'description')
        }),
        ('Additional Information', {
            'fields': ('description',),
            'classes': ('collapse',) 
        }),
    )
    autocomplete_fields = ['country']

    list_per_page = 10


class PaymentOrderAdmin(ModelAdmin):
    list_display = ('id', 'user', 'amount', 'currency', 'cryptocurrency',
                    'crypto_amount', 'payment_id', 'pay_address', 'expiration_estimate_date',
                    'description', 'status', 'created_at')
    search_fields = ('amount', 'currency', 'cryptocurrency', 'status')
