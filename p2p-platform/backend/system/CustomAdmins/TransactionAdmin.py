from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.utils.html import format_html
from ..models import Transaction
from ..services import DepositHelper, WithdrawalHelper
from unfold.admin import ModelAdmin

class TransactionAdmin(ModelAdmin):

    list_display = ('id', 'user', 'amount', 'code', 'fee', 'amount_before_deduction', 'description', 'status', 'type', 'method', 'wallet', 'created_at', 'confirm_button', 'reject_button')
    list_filter = ('user', 'status', 'type', 'created_at')
    actions = ['confirm_deposit', 'confirm_withdrawal', 'reject_deposit', 'reject_withdrawal']
    list_per_page = 15

    def confirm_button(self, obj):
        """
        Display a dynamic button for confirming transactions based on their type.
        """
        if obj.status == 'pending':
            if obj.type == 'deposit':
                return format_html(
                    '<a class="button" href="{}">Confirm Deposit</a>',
                    reverse('admin:confirm_deposit', args=[obj.pk])
                )
            elif obj.type == 'withdrawal':
                return format_html(
                    '<a class="button" href="{}">Confirm Withdrawal</a>',
                    reverse('admin:confirm_withdrawal', args=[obj.pk])
                )
        return '-'

    confirm_button.short_description = 'Confirm Transaction'
    
    def reject_button(self, obj):
        """
        Display a dynamic button for rejecting transactions based on their type.
        """
        if obj.status == 'pending':
            if obj.type == 'deposit':
                return format_html(
                    '<a class="button" href="{}">Reject Deposit</a>',
                    reverse('admin:reject_deposit', args=[obj.pk])
                )
            elif obj.type == 'withdrawal':
                return format_html(
                    '<a class="button" href="{}">Reject Withdrawal</a>',
                    reverse('admin:reject_withdrawal', args=[obj.pk])
                )
        return '-'
    reject_button.short_description = 'Reject Transaction'

    def get_urls(self):
        """
        Add custom URLs for confirming and rejecting deposit and withdrawal transactions.
        """
        urls = super().get_urls()
        custom_urls = [
            path('confirm-deposit/<int:pk>/', self.admin_site.admin_view(self.confirm_deposit_view), name='confirm_deposit'),
            path('confirm-withdrawal/<int:pk>/', self.admin_site.admin_view(self.confirm_withdrawal_view), name='confirm_withdrawal'),
            path('reject-deposit/<int:pk>/', self.admin_site.admin_view(self.reject_deposit_view), name='reject_deposit'),
            path('reject-withdrawal/<int:pk>/', self.admin_site.admin_view(self.reject_withdrawal_view), name='reject_withdrawal'),
        ]
        return custom_urls + urls

    def confirm_deposit_view(self, request, pk, *args, **kwargs):
        """
        View to handle deposit confirmation from the admin interface.
        """
        try:
            DepositHelper.confirm_deposit(pk)
            self.message_user(request, f'Deposit #{pk} request has been confirmed!.')
        except ValueError as e:
            self.message_user(request, f'Error confirming deposit #{pk}: {str(e)}', level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:system_transaction_changelist')))

    def confirm_withdrawal_view(self, request, pk, *args, **kwargs):
        """
        View to handle withdrawal confirmation from the admin interface.
        """
        try:
            WithdrawalHelper.confirm_withdrawal(pk)
            self.message_user(request, f'Withdrawal #{pk} request has been confirmed!.')
        except ValueError as e:
            self.message_user(request, f'Error confirming withdrawal #{pk}: {str(e)}', level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:system_transaction_changelist')))

    def reject_deposit_view(self, request, pk, *args, **kwargs):
        """
        View to handle deposit rejection from the admin interface.
        """
        try:
            DepositHelper.reject_deposit(pk)
            self.message_user(request, f'Deposit #{pk} request has been rejected!.')
        except ValueError as e:
            self.message_user(request, f'Error rejecting deposit #{pk}: {str(e)}', level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:system_transaction_changelist')))

    def reject_withdrawal_view(self, request, pk, *args, **kwargs):
        """
        View to handle withdrawal rejection from the admin interface.
        """
        try:
            WithdrawalHelper.reject_withdrawal(pk)
            self.message_user(request, f'Withdrawal #{pk} request has been rejected!.')
        except ValueError as e:
            self.message_user(request, f'Error rejecting withdrawal #{pk}: {str(e)}', level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', reverse('admin:system_transaction_changelist')))

    def confirm_deposit(self, request, queryset):
        """
        Action to confirm selected deposit transactions.
        """
        for transaction in queryset:
            if transaction.status == 'pending' and transaction.type == 'deposit':
                try:
                    DepositHelper.confirm_deposit(transaction.id)
                    self.message_user(request, f'Deposit #{transaction.id} request has been confirmed!.')
                except ValueError as e:
                    self.message_user(request, f'Error confirming deposit #{transaction.id}: {str(e)}', level=messages.ERROR)
                except Exception as e:
                    self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
            else:
                self.message_user(request, f'Transaction #{transaction.id} is not a pending deposit.', level=messages.WARNING)

    def confirm_withdrawal(self, request, queryset):
        """
        Action to confirm selected withdrawal transactions.
        """
        for transaction in queryset:
            if transaction.status == 'pending' and transaction.type == 'withdrawal':
                try:
                    WithdrawalHelper.confirm_withdrawal(transaction.id)
                    self.message_user(request, f'Withdrawal #{transaction.id} request has been confirmed!.')
                except ValueError as e:
                    self.message_user(request, f'Error confirming withdrawal #{transaction.id}: {str(e)}', level=messages.ERROR)
                except Exception as e:
                    self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
            else:
                self.message_user(request, f'Transaction #{transaction.id} is not a pending withdrawal.', level=messages.WARNING)

    def reject_deposit(self, request, queryset):
        """
        Action to reject selected deposit transactions.
        """
        for transaction in queryset:
            if transaction.status == 'pending' and transaction.type == 'deposit':
                try:
                    DepositHelper.reject_deposit(transaction.id)
                    self.message_user(request, f'Deposit #{transaction.id} request has been rejected!.')
                except ValueError as e:
                    self.message_user(request, f'Error rejecting deposit #{transaction.id}: {str(e)}', level=messages.ERROR)
                except Exception as e:
                    self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
            else:
                self.message_user(request, f'Transaction #{transaction.id} is not a pending deposit.', level=messages.WARNING)

    def reject_withdrawal(self, request, queryset):
        """
        Action to reject selected withdrawal transactions.
        """
        for transaction in queryset:
            if transaction.status == 'pending' and transaction.type == 'withdrawal':
                try:
                    WithdrawalHelper.reject_withdrawal(transaction.id)
                    self.message_user(request, f'Withdrawal #{transaction.id} rejected successfully.')
                except ValueError as e:
                    self.message_user(request, f'Error rejecting withdrawal #{transaction.id}: {str(e)}', level=messages.ERROR)
                except Exception as e:
                    self.message_user(request, f'Unexpected error: {str(e)}', level=messages.ERROR)
            else:
                self.message_user(request, f'Transaction #{transaction.id} is not a pending withdrawal.', level=messages.WARNING)

    confirm_deposit.short_description = 'Confirm selected deposits'
    confirm_withdrawal.short_description = 'Confirm selected withdrawals'
    reject_deposit.short_description = 'Reject selected deposits'
    reject_withdrawal.short_description = 'Reject selected withdrawals'