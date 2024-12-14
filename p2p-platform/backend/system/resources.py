from import_export import resources
from import_export.fields import Field
from import_export.widgets import ForeignKeyWidget
from .models import Review, Currency
from django.core.exceptions import ObjectDoesNotExist


class ReviewResource(resources.ModelResource):
    currency = Field(
        column_name='currency', 
        attribute='currency', 
        widget=ForeignKeyWidget(Currency, 'code') 
    )

    class Meta:
        model = Review
        fields = ('id', 'username', 'email', 'review', 'currency', 'rating')

    def before_import_row(self, row, **kwargs):
        code = row.get('code')

        if code:
            try:
                # Try to find the currency by code using get()
                currency = Currency.objects.get(code=code)
                row['currency'] = currency.code  
            except ObjectDoesNotExist:
                return None
        else:
            return None

        return super().before_import_row(row, **kwargs)
