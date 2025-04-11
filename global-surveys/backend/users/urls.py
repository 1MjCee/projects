from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserProfileViewSet, ReferralViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'referrals', ReferralViewSet, basename='referrals')

urlpatterns = [
    path('', include(router.urls)),
]