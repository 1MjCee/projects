from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CompanyViewSet, SurveyViewSet, ResponseViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'surveys', SurveyViewSet)
router.register(r'responses', ResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
]