# forms.py
from django import forms
from .models import User  


class PromoCodeGenerationForm(forms.Form):
    number_of_codes = forms.IntegerField(min_value=1, required=True, label="Number of Promo Codes")
    amount = forms.DecimalField(max_digits=10, decimal_places=2, required=True, label="Amount")


class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'
        
    def clean_phone_number(self):
        print("Validating phone number...")
        phone_number = self.cleaned_data.get('phone_number')
        if not phone_number:
            raise forms.ValidationError("Phone number is required.")
        if len(phone_number) < 10:  
            raise forms.ValidationError("Phone number must be at least 10 characters long.")
        return phone_number

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
