# Generated by Django 5.1.3 on 2025-01-19 15:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0010_rename_payment_icon_paymenttype_icon'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemWallet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=2, default=0.0, max_digits=20)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('owner', models.OneToOneField(blank=True, limit_choices_to={'is_superuser': True}, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'System Wallet',
                'verbose_name_plural': 'System Wallets',
                'db_table': 'system_wallet',
            },
        ),
    ]
