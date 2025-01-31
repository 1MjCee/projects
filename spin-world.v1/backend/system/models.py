from django.db import models
import random
import uuid
import secrets
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import timedelta
import string
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import MinValueValidator
    

class Currency(models.Model):
    code = models.CharField(max_length=5, primary_key=True, unique=True)
    country = models.CharField(max_length=255,  blank=True, null=True)
    currency_name = models.CharField(max_length=255, blank=True, null=True)
    currency_code = models.CharField(max_length=50,  blank=True, null=True)
    symbol = models.CharField(max_length=255, blank=True, null=True)             

    def __str__(self):
        return f"{self.currency_code}"

    class Meta:
        db_table = 'Currencies'
        verbose_name = "Currency"  
        verbose_name_plural = "Currencies"
        

class Country(models.Model):
    ip_address = models.CharField(max_length=15, primary_key=True, unique=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    currency = models.CharField(max_length=255, null=True, blank=True)
    country_code = models.CharField(max_length=255, blank=True, null=True)
    calling_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    region = models.CharField(max_length=255, blank=True, null=True)
    loc = models.CharField(max_length=50, blank=True, null=True) 
    org = models.CharField(max_length=255, blank=True, null=True)
    postal = models.CharField(max_length=20, blank=True, null=True)
    timezone = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.ip_address
    class Meta:
        db_table = 'Countries'
        verbose_name = "Country"
        verbose_name_plural = "Countries"



class PaymentType(models.Model):
    type = models.CharField(max_length=255, unique=True)
    country = models.CharField(max_length=5, blank=True, null=True)
    icon = models.ImageField(upload_to='uploads/payment_icons/', blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.type
        

class UserManager(BaseUserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError('The email number field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(email, password, **extra_fields)

    def normalize_email(self, email):
        return email

class User(AbstractBaseUser, PermissionsMixin):
    id = models.PositiveIntegerField(unique=True, primary_key=True, editable=False)
    username = models.CharField(max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField(max_length=30, unique=True)
    phone_number = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, max_length=50, blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(auto_now=True)
    avatar = models.ImageField(upload_to='uploads/avatars/', default='uploads/avatars/default.png')
    referral_code = models.CharField(max_length=255, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    def ip_address(self):
        return self.country.ip_address if self.country else None

    ip_address.short_description = 'IP Address'
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='system_user_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='system_user_set_permissions',
        blank=True,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        db_table = 'Users'
        verbose_name = "User"  
        verbose_name_plural = "Users"
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_user_id()
        super().save(*args, **kwargs)
        

    def generate_unique_user_id(self):
        from django.db import transaction
        
        while True:
            new_id = random.randint(10000, 999999)
            if not User.objects.filter(id=new_id).exists():
                return new_id
        

class InvestmentPlan(models.Model):
    number = models.PositiveIntegerField(unique=True, default=1)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, null=True)
    duration_in_months = models.PositiveBigIntegerField(default=1)
    prize_multiplier = models.PositiveBigIntegerField(default=0)
    daily_withdraw_limit = models.DecimalField(max_digits=5, decimal_places=0, default=200, validators=[MinValueValidator(0.00)])
    description = models.TextField(blank=True, null=True, default="")
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)

    def is_free_plan(self):
        """Returns whether the plan is free based on price being 0.00."""
        return self.price == 0
    
    def __str__(self):
        return self.name
    class Meta:
        db_table = 'Investment Plans'


class UserInvestmentPlan(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    investment_plan = models.ForeignKey(InvestmentPlan, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    expired = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.user} - {self.investment_plan}'
    class Meta:
        db_table = 'User Investment Plans'
    
    def check_expiration(self):
        """
        Checks if the user's investment plan has expired based on the plan's duration.
        If the plan is free, it does not expire.
        """
        if self.investment_plan.is_free_plan():
            return 
        
        # Calculate expiration date based on the created_at date and plan duration
        expiration_date = self.created_at + timedelta(
            months=self.investment_plan.duration_in_months
        )
        
        if timezone.now() > expiration_date:
            # Mark the plan as expired
            self.expired = True
            self.save()
            
            # Remove the expired user investment plan
            self.delete()

            # Assign the user to the free plan
            free_plan = InvestmentPlan.objects.filter(price=0.00).first()
            if free_plan:
                UserInvestmentPlan.objects.create(
                    user=self.user,
                    investment_plan=free_plan,
                    created_at=timezone.now()
                )
    

class KYC(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    document_type = models.CharField(max_length=255, blank=True, null=True)
    document_1 = models.TextField(blank=True, null=True)
    document_2 = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    rejected = models.BooleanField(default=False)
    pending = models.BooleanField(default=False)
    document_number = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.name if self.name else f'KYC #{self.id}'
    class Meta:
        db_table = 'kyc'
        
        
# class PaymentMethod(models.Model):
#     name = models.CharField(max_length=255)
#     phone = models.CharField(max_length=255)
#     description = models.TextField()
#     rate = models.CharField(max_length=255, blank=True, null=True)
#     created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     currency = models.CharField(max_length=255, blank=True, null=True)
#     parameter = models.CharField(max_length=255, blank=True, null=True)
#     countries = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.name
#     class Meta:
#         db_table = 'payment_method'

def generate_code(length=10):
    """Generate a random code of fixed length."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

class PromoCode(models.Model):
    won_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='won_promo_codes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_promo_codes', null=True, blank=True)
    code = models.CharField(max_length=255, unique=True, blank=True)
    amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    used = models.BooleanField(default=False)
    adjusted_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_code()
        
        if self.amount == 0.00:
            self.amount = round(random.uniform(2, 5), 2)  
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.code
    class Meta:
        db_table = 'Promo Codes'
        

class Ranking(models.Model):
    ranking = models.PositiveIntegerField(unique=True, default=1)
    name= models.CharField(max_length=255, unique=True, default="Beginner")
    minimum_referrals = models.PositiveIntegerField(default=0)
    minimum_spending = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    max_spins = models.PositiveIntegerField(default=1)
    withdraw_percentage = models.DecimalField(max_digits=5, decimal_places=0, default=0.00, validators=[MinValueValidator(0.00)])
    description = models.TextField(blank=True, null=True, default="")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.ranking} - {self.name}"
    class Meta:
        db_table = 'Rankings'
           

class RankingUser(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ranking = models.ForeignKey(Ranking, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'User Rankings'
    
    def __str__(self):
        return f'{self.user} - {self.ranking}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  
        self.update_spinner_max_spins()

    def update_spinner_max_spins(self):
        try:
            spinner = self.user.spinner
            spinner.max_spins = self.ranking.max_spins
            spinner.save()
        except Spinner.DoesNotExist:
            pass


class ReferralLevel(models.Model):
    rate = models.DecimalField(max_digits=20, decimal_places=2, validators=[MinValueValidator(0.00)])
    level = models.PositiveIntegerField()
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Level {self.level}'
    class Meta:
        db_table = 'Referral Level'
    def clean(self):
        if self.rate < 0:
            raise ValidationError('Rate must be non-negative')
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

        
class Referral(models.Model):
    referred = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referrals')
    referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name='referred_users', blank=True, null=True)
    level = models.ForeignKey(ReferralLevel, on_delete=models.PROTECT)
    completed = models.BooleanField(default=False, blank=True, null=True)
    invitation_code = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.referred} - {self.referrer}'
    class Meta:
        db_table = 'referral'
        

class Share(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    sender = models.BooleanField()
    amount = models.DecimalField(max_digits=20, decimal_places=2, validators=[MinValueValidator(0.00)])
    rate = models.DecimalField(max_digits=20, decimal_places=6)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    currency = models.CharField(max_length=3, default='TZS')
    
    def __str__(self):
        return f'{self.name} - {self.email}'
    class Meta:
        db_table = 'Shares'
        

class Transaction(models.Model):
    parent_transaction = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='child_transactions')

    TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('spending', 'Spending'),
        ('reward', 'Reward'),
        ('interest', 'Interest'),
        ('commission', 'Commission'),
        ('withdrawal', 'Withdawal'),
        ('rebate', 'Rebate'),
    ]

    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    amount_before_deduction = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    description = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=255, unique=True, blank=True, null=True)
    fee = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    address = models.CharField(max_length=255, default='')
    method = models.ForeignKey(PaymentType, on_delete=models.CASCADE)
    wallet = models.ForeignKey('Wallet', on_delete=models.CASCADE, default='deposit')
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Transaction #{self.id} - {self.description}'
    class Meta:
        db_table = 'Transactions'
        

class PaymentProof(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='proofs')
    text = models.TextField( blank=True, null=True)
    proof_file = models.FileField(upload_to='uploads/proofs/')
    date_disbursed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proof for Transaction {self.transaction.id} released on {self.date_disbursed}"
        


def generate_unique_wallet_id():
    return secrets.token_urlsafe(15)  

class Wallet(models.Model):
    id = models.CharField(max_length=30, default=generate_unique_wallet_id, primary_key=True, unique=True, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet")
    deposit = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    expenditure = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    total_earnings = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    withdrawal = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    updated_on = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Ensure unique wallet_id
        if not self.id:
            self.id = generate_unique_wallet_id()
            while Wallet.objects.filter(id=self.id).exists():
                self.id = generate_unique_wallet_id()
        # Calculate the balance before saving
        self.balance = Decimal(self.deposit) + Decimal(self.total_earnings)
        super(Wallet, self).save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.user} - {self.currency}'
    class Meta:
        db_table = 'Wallets'
        
        

class Trade(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stake = models.DecimalField(max_digits=20, decimal_places=5, default=0.00000)
    target = models.DecimalField(max_digits=20, decimal_places=5, default=0.00000)
    paid = models.DecimalField(max_digits=20, decimal_places=5, default=0.00000)
    status = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    updated_at = models.DateTimeField
    
    def __str__(self):
        return f'{self.user} - {self.stake}'
    class Meta:
        db_table = 'Trades'
        
        
    
class TradeSetting(models.Model):
    type = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f'{self.type}: {self.value}'
    class Meta:
        db_table = 'Trade Settings'
        verbose_name = 'Trade Setting'
        verbose_name_plural = 'Trade Settings'


class WithdrawalDetail(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_withdrawal_details")
    real_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=255)
    withdrawal_type = models.ForeignKey(PaymentType, on_delete=models.CASCADE, default=1, related_name="withdrawal_payment_type")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.real_name}"


class Guide(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    general_steps = models.JSONField()

    def __str__(self):
        return self.title


class PaymentMethod(models.Model):
    method_type = models.ForeignKey(PaymentType, on_delete=models.CASCADE)
    address_number = models.CharField(max_length=300, default="1212121212")
    recipient_name = models.CharField(max_length=100, blank=True, null=True)
    minimum_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=2, default=1, validators=[MinValueValidator(0.00)])
    payment_process = models.ForeignKey(Guide, on_delete=models.CASCADE, blank=True, null=True, related_name='payment_process')

    def __str__(self):
        return f"{self.method_type.type}: {self.address_number}"


class WithdrawalTerm(models.Model):
    minimum_withdrawal_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    minimum_withdrawal_commission = models.DecimalField(max_digits=20, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    withdrawal_timeframe_start = models.TimeField(default="07:00:00")
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    withdrawal_timeframe_end = models.TimeField(default="17:00:00")
    withdrawal_processing_time_min = models.IntegerField(default=24)
    withdrawal_processing_time_max = models.IntegerField(default=72)
    withdrawals_processed_on_weekends = models.BooleanField(default=False) 
    withdrawal_tax_percentage = models.DecimalField(max_digits=4, decimal_places=2, default=10.00)
    
    def __str__(self):
        return f"Withdrawal Terms (Min: ${self.minimum_withdrawal_amount}, Tax: {self.withdrawal_tax_percentage}%)"

    class Meta:
        verbose_name = "Withdrawal Term"
        verbose_name_plural = "Withdrawal Terms"


class Notice(models.Model):
    heading = models.CharField(max_length=255)
    introduction = models.TextField(blank=True, null=True)
   

    def __str__(self):
        return self.heading


class NoticeSection(models.Model):
    notice = models.ForeignKey(Notice, related_name='sections', on_delete=models.CASCADE)
    subheading = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='uploads/notices/', blank=True, null=True)
    paragraph = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.subheading or "Section"
    

class Spinner(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_eligible = models.BooleanField(default=False)
    max_spins = models.PositiveIntegerField(default=0)
    spin_count = models.PositiveIntegerField(default=0)
    last_spin = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Eligible: {self.is_eligible}"


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.message[:20]}"
    

class PaymentOrder(models.Model):
    id = models.PositiveIntegerField(unique=True, primary_key=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('confirmed', 'Confirmed'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
        ('canceled', 'Canceled'),
    ]
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=20)
    cryptocurrency = models.CharField(max_length=10)
    crypto_amount = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_id = models.CharField(max_length=50, null=True, blank=True)  
    pay_address = models.CharField(max_length=100, null=True, blank=True)  
    pay_currency = models.CharField(max_length=20, null=True, blank=True)
    expiration_estimate_date = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.status}"
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_order_id()
        super().save(*args, **kwargs)
    
    def generate_unique_order_id(self):        
        while True:
            new_id = random.randint(100000, 9999999)
            if not PaymentOrder.objects.filter(id=new_id).exists():
                return new_id
            else:
                continue

class ExchangeRate(models.Model):
    base_currency = models.CharField(max_length=10, default='USD') 
    target_currency = models.CharField(max_length=10)
    rate = models.DecimalField(max_digits=10, decimal_places=6)  
    fetched_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.base_currency} to {self.target_currency}: {self.rate}"

    class Meta:
        unique_together = ['base_currency', 'target_currency']


class Review(models.Model):
    username = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    review = models.TextField()
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')], default=5)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)


class PaymentConfigurations(models.Model):
    gateway = models.CharField(max_length=255, null=True, blank=True)
    api_key = models.CharField(max_length=255)
    ipn_secret = models.CharField(max_length=255)


class SystemWalletManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

    def get(self):
        try:
            return super().get()
        except ObjectDoesNotExist:
            superusers = User.objects.filter(is_superuser=True)
            if superusers.exists():
                owner = superusers.first()
                wallet = SystemWallet.objects.create(owner=owner)
                return wallet
            else:
                raise ValueError("No superuser found to assign a wallet.")

class SystemWallet(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, limit_choices_to={'is_superuser': True})
    balance = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now=True)

    objects = SystemWalletManager()

    def __str__(self):
        return f"System Wallet - Balance: {self.balance}"

    def deposit(self, amount):
        if amount > 0:
            self.balance += Decimal(amount)
            self.save()
            return True
        return False

    def withdraw(self, amount):
        amount = Decimal(amount)
        if 0 < amount <= self.balance:
            self.balance -= amount
            self.save()
            return True
        return False

    def transfer(self, amount, to_wallet):
        if self.withdraw(amount):
            if to_wallet.deposit(amount):
                return True
            else:
                self.deposit(amount)
                return False
        return False

    class Meta:
        db_table = 'system_wallet'
        verbose_name = "System Wallet"
        verbose_name_plural = "System Wallets"
        
            
