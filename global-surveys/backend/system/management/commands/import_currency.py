import csv
from django.core.management.base import BaseCommand
from ...models import Currency
from django.db import IntegrityError
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Imports country and currency data from a CSV file'

    def handle(self, *args, **kwargs):
        # Define the file path (make sure this matches where your CSV file is located)
        data = os.path.join(settings.BASE_DIR, 'data')
        file_path = os.path.join(data, 'country-code-to-currency-code-mapping.csv')

        # Open the CSV file and read the rows
        try:
            with open(file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    country_name = row.get('Country', '').strip()  
                    country_code = row.get('CountryCode', '').strip()  
                    currency_name = row.get('Currency', '').strip()
                    currency_code = row.get('Code', '').strip()

                    # Ensure required fields are present
                    if not currency_code:
                        self.stdout.write(self.style.ERROR(f'Missing currency code for {country_name}'))
                        continue

                    # Attempt to create the currency record
                    try:
                        currency, created = Currency.objects.get_or_create(
                            code=country_code,
                            defaults={
                                'country': country_name,
                                'currency_name': currency_name,
                                'currency_code': currency_code,
                            }
                        )

                        if created:
                            self.stdout.write(self.style.SUCCESS(f'Created currency: {currency_code} - {currency_name} for country: {country_name}'))
                        else:
                            self.stdout.write(self.style.SUCCESS(f'Currency {currency_code} - {currency_name} already exists for {country_name}'))

                    except IntegrityError as e:
                        self.stdout.write(self.style.ERROR(f'Error processing data for {country_name} - {currency_name}: {e}'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An unexpected error occurred: {e}'))
