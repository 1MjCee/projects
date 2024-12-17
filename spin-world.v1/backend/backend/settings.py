from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from celery.schedules import crontab

load_dotenv()

AUTH_USER_MODEL = "system.User"

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# Now Payments Api
NOWPAYMENTS_API_KEY = os.environ.get("NOWPAYMENTS_API_KEY")

# Exhange Rates API
EXCHANGE_API_KEY = os.getenv('EXCHANGE_API_KEY')

# GEO iP DETAILS
GEOIP_ACCOUNT_ID = os.environ.get("GEOIP_ACCOUNT_ID")
GEOIP_LICENSE_KEY = os.environ.get("GEOIP_LICENSE_KEY")
IP_INFO_API_KEY = os.environ.get("IP_INFO")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost", '162.246.21.20', 'spin-world.site']

CELERY_BROKER_URL = 'redis://localhost:6379/0'  
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0' 
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_BEAT_SCHEDULE = {
    # Task to check user rankings every 5 minutes
    'check_user_rankings': {
        'task': 'system.tasks.check_user_rankings',
        'schedule': crontab(minute='*/5'),
    },
    # Task to check investment expiration every 5 minutes
    'check_investment_expiration': {
        'task': 'system.tasks.check_investment_expiration',
        'schedule': crontab(minute='*/5'),  # Run every 5 minutes
    },
    # Task to reset spin count at midnight every day
    'reset_spin_count': {
        'task': 'system.tasks.reset_spin_count',
        'schedule': crontab(minute=0, hour=0), 
    },
    # Task to fetch exchange rates every hour
    'fetch_exchange_rates': {
        'task': 'system.tasks.fetch_exchange_rates',
        'schedule': crontab(minute=0),
    },
}

# Application definition
INSTALLED_APPS = [
    'unfold',
    "unfold.contrib.filters",
    "unfold.contrib.forms", 
    "unfold.contrib.inlines",  
    "unfold.contrib.import_export",  
    'import_export',
    "unfold.contrib.guardian",  
    "unfold.contrib.simple_history",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'system',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django.contrib.humanize',
    'django_extensions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  
    'ROTATE_REFRESH_TOKENS': True,  
    'BLACKLIST_AFTER_ROTATION': True,  
    'AUTH_HEADER_TYPES': ('Bearer',),  
    'AUTH_COOKIE': 'access_token', 
    
}

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'OPTIONS': {
            'timeout': 20,
        }
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'anexx_db',
#         'USER': 'anexx',
#         'PASSWORD': 'anexx61', 
#         'HOST': 'db',
#         'PORT': '5432',
#     }
# } 


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.redis.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',  # Redis server URL
#     }
# }

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

STATIC_URL = '/django_static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'django_static')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configure CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    'http://192.168.0.13:3000',
    "https://spin-world.site"
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.0.13:3000",
    "https://spin-world.site"
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]


UNFOLD = {
    "SITE_TITLE": "Spin World",
    "SITE_HEADER": "Spin World",
    "SITE_URL": "/",
    
    "SITE_SYMBOL": "speed",  
    
    "SHOW_VIEW_ON_SITE": True, 
    "DASHBOARD_CALLBACK": "backend.views.dashboard_callback",
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": False,
    
    "COLORS": {
        "font": {
            "subtle-light": "107 114 128",
            "subtle-dark": "156 163 175",
            "default-light": "75 85 99",
            "default-dark": "209 213 219",
            "important-light": "17 24 39",
            "important-dark": "243 244 246",
        },
        "primary": {
            "50": "250 245 255",
            "100": "243 232 255",
            "200": "233 213 255",
            "300": "216 180 254",
            "400": "192 132 252",
            "500": "168 85 247",
            "600": "147 51 234",
            "700": "126 34 206",
            "800": "107 33 168",
            "900": "88 28 135",
            "950": "59 7 100",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇬🇧",
                "fr": "🇫🇷",
                "nl": "🇧🇪",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        
        "navigation": [
            {
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": _("Users"),
                        "icon": "people",
                        "link": reverse_lazy("admin:system_user_changelist"),
                    },
                    {
                        "title": _("Transactions"),
                        "icon": "contract",
                        "link": reverse_lazy("admin:system_transaction_changelist"),
                    },
                    {
                        "title": _("Subscription Plans"),
                        "icon": "inventory",
                        "link": reverse_lazy("admin:system_investmentplan_changelist"),
                    },
                    {
                        "title": _("Payment Orders"),
                        "icon": "inventory",
                        "link": reverse_lazy("admin:system_paymentorder_changelist"),
                    },
                    {
                        "title": _("Wallets"),
                        "icon": "wallet",
                        "link": reverse_lazy("admin:system_wallet_changelist"),
                    },
                    {
                        "title": _("Referrals"),
                        "icon": "groups",
                        "link": reverse_lazy("admin:system_referral_changelist"),
                    },
                     {
                        "title": _("Payment Methods"),
                        "icon": "payments",
                        "link": reverse_lazy("admin:system_paymentmethod_changelist"),
                    },
                ],
            },
        ],
    },
}