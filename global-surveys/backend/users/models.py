from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

"""
Custom User Model and Profile
- Custom user model using email as the unique identifier
- UserProfile model with additional fields
- One-to-one relationship with the User model
- Profile completion percentage
- Methods for getting full name and short name
- Custom user manager for creating users and superusers
- Custom authentication backend to allow login with email
- Custom user manager for creating users and superusers
- Custom user model for using email as the main identifier
"""
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 
    
    def __str__(self):
        return self.email
    
    def increment_referral_count(self):
        """Increment the referral count when a referred user becomes active"""
        try:
            profile = self.profile
            profile.referral_count += 1
            profile.save()
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            UserProfile.objects.create(user=self, referral_count=1)

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    avatar = models.CharField(max_length=255, default="/assets/icons/profile.svg")
    location = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_completion = models.IntegerField(default=0)
    referral_count = models.IntegerField(default=0)
    surveys_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email}'s profile"
        
    def get_full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.user.email
    
    def get_short_name(self):
        if self.first_name:
            return self.first_name
        return self.user.email
    
    # Add this to your UserProfile model
    def calculate_profile_completion(self):
        profile_fields = {
            'first_name': 5,
            'last_name': 5,
            'avatar': 10,
            'location': 10,
            'country': 10,
            'profession': 10,
            'phone': 10,
            'company': 10,
            'bio': 20
        }
        
        # Email is mandatory and gives a base 10% completion
        completion = 10
        
        # Check profile fields and add their weights
        for field, weight in profile_fields.items():
            value = getattr(self, field, None)
            if value and (not isinstance(value, str) or value.strip()):
                completion += weight
        
        # Ensure completion is an integer
        self.profile_completion = int(completion)
        
        return self.profile_completion
        
    def delete(self, *args, **kwargs):
        user = self.user
        user.delete()
    

"""
Referral Code Model
- Model to store user referral codes
- One-to-one relationship with the User model
- Unique referral code for each user
"""
class ReferralCode(models.Model):
    """Model to store user referral codes"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_code')
    code = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Referral levels
    LEVEL_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='bronze')
    
    # Level thresholds
    LEVEL_THRESHOLDS = {
        'bronze': 0,
        'silver': 10,
        'gold': 25,
        'platinum': 50
    }
    
    def __str__(self):
        return f"{self.user.email}'s referral code: {self.code}"
    
    @staticmethod
    def generate_code(user):
        """Generate a unique referral code based on user information"""
        # Use username or email to create personalized code
        email_prefix = user.email.split('@')[0].upper()
        
        # Get current date components
        now = timezone.now()
        year = now.year
        month = now.month
        day = now.day
        
        # Format date as DDMMYY
        date_code = f"{day:02d}{month:02d}{str(year)[2:]}"
        
        # Combine to create a personalized code
        base_code = f"{email_prefix}{date_code}"
        
        # Try the base code first
        candidate_code = base_code
        
        # If the base code exists, add incremental suffixes until we find a unique one
        counter = 1
        while ReferralCode.objects.filter(code=candidate_code).exists():
            # First try adding a 3-digit counter
            candidate_code = f"{base_code}{counter:03d}"
            counter += 1
            
            # If we've tried too many numeric increments, switch to UUID
            if counter > 999:
                unique_suffix = str(uuid.uuid4())[:8]
                candidate_code = f"{base_code}{unique_suffix}"
                
                # Check one last time (extremely unlikely to collide)
                if ReferralCode.objects.filter(code=candidate_code).exists():
                    # Add timestamp at microsecond precision as last resort
                    timestamp = int(now.timestamp() * 1000000)
                    candidate_code = f"{base_code}{timestamp}"
        
        return candidate_code
    
    def update_level(self):
        """Update referral level based on number of referrals"""
        referral_count = self.user.referral_count
        current_level = self.level
        new_level = current_level
        
        # Determine the appropriate level based on referral count
        if referral_count >= self.LEVEL_THRESHOLDS['platinum']:
            new_level = 'platinum'
        elif referral_count >= self.LEVEL_THRESHOLDS['gold']:
            new_level = 'gold'
        elif referral_count >= self.LEVEL_THRESHOLDS['silver']:
            new_level = 'silver'
        else:
            new_level = 'bronze'
        
        # Only update if the level has changed
        if new_level != current_level:
            self.level = new_level
            self.save()
        
        return self.level

"""
Referred User Model
- Model to track users who signed up using a referral code
- One-to-one relationship with the User model
- Foreign key to the ReferralCode model
- Status field to track if the referred user is active or pending
- Method to activate a pending referred user"""
class ReferredUser(models.Model):
    """Model to track users who signed up using a referral code"""
    referrer_code = models.ForeignKey(ReferralCode, on_delete=models.CASCADE, related_name='referred_users')
    referred_user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    join_date = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return f"{self.referred_user.email} referred by {self.referrer_code.user.email}"
    
    def activate(self):
        """Activate a pending referred user"""
        if self.status == 'pending':
            self.status = 'active'
            self.save()
            
            # Increment referral count on the referrer user
            self.referrer_code.user.increment_referral_count()
            
        return self.status

"""Referral Earning Model
- Model to track earnings from referrals
- One-to-one relationship with the User model
- Total earnings and referral earnings fields
- Method to add referral earnings
"""
class ReferralEarning(models.Model):
    """Model to track earnings from referrals"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_earnings')
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    referral_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email}'s earnings: {self.total_earnings}"
    
    def add_referral_earnings(self, amount):
        """Add earnings from a referral"""
        self.referral_earnings += amount
        self.total_earnings += amount
        self.save()


"""
Referral Activity Model
- Model to track referral activities and surveys completed by referred users
- Foreign key to the ReferredUser model
- Activity type field to specify the type of activity
- Activity date field to track when the activity occurred"""
class ReferralActivity(models.Model):
    """Model to track referral activities and surveys completed by referred users"""
    referred_user = models.ForeignKey(ReferredUser, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50)  # e.g., 'survey_completed', 'account_activated'
    activity_date = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(null=True, blank=True)  # For storing additional details
    
    def __str__(self):
        return f"{self.referred_user.referred_user.email} - {self.activity_type} on {self.activity_date}"
    
    @classmethod
    def record_survey_completed(cls, referred_user):
        """Record when a referred user completes a survey"""
        return cls.objects.create(
            referred_user=referred_user,
            activity_type='survey_completed',
        )

class ReferralLevel(models.Model):
    name = models.CharField(max_length=100)
    threshold = models.PositiveIntegerField()
    icon = models.CharField(max_length=20)
    color = models.CharField(max_length=50)
    text_color = models.CharField(max_length=50)
    border_color = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class ReferralLevelBenefit(models.Model):
    level = models.ForeignKey(ReferralLevel, related_name='benefits', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.level.name} - {self.description}"