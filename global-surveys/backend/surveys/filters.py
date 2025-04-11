import django_filters
from .models import Survey, Response


class SurveyFilter(django_filters.FilterSet):
    min_reward = django_filters.NumberFilter(field_name='reward', lookup_expr='gte')
    max_reward = django_filters.NumberFilter(field_name='reward', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    company = django_filters.CharFilter(field_name='company__name', lookup_expr='icontains')
    
    class Meta:
        model = Survey
        fields = ['category', 'company', 'min_reward', 'max_reward']


class ResponseFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='started_at', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='completed_at', lookup_expr='lte')
    
    class Meta:
        model = Response
        fields = ['survey', 'is_complete', 'start_date', 'end_date']