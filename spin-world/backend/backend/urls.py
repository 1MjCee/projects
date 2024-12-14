from django.contrib import admin
from django.urls import path, include
from system.MyAdmin import my_custom_admin
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', my_custom_admin.urls),
    path('api/', include('system.urls')),
    path("api-auth/", include("rest_framework.urls")),
]

admin.autodiscover()

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
