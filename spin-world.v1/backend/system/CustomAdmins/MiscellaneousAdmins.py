from django.contrib import admin
from ..models import NoticeSection
from unfold.admin import ModelAdmin
from unfold.admin import StackedInline, TabularInline
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm, SelectableFieldsExportForm
from ..resources import ReviewResource


class ExchangeRateAdmin(ModelAdmin):
    list_display = ('base_currency', 'target_currency', 'rate', 'fetched_at')
    search_fields = ('target_currency',)

class PaymentConfigurationsAdmin(ModelAdmin):
    list_display = ('gateway', 'api_key', 'ipn_secret')


class SectionInline(TabularInline):
    model = NoticeSection
    tab = True
    extra = 1 

class NoticeAdmin(ModelAdmin):
    list_display = ('id', 'heading', 'introduction')  
    search_fields = ('heading',) 
    inlines = [SectionInline]


class NoticeSectionAdmin(ModelAdmin):
    list_display = ('subheading', 'notice')  
    list_filter = ('notice',)


class ReviewAdmin(ModelAdmin, ImportExportModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    resource_class = ReviewResource

    list_display = ('username', 'email', 'currency', 'review', 'rating', 'created_at')