from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Category, Company, Survey, Question, Option, Response as SurveyResponse
from .serializers import (
    CategorySerializer, CompanySerializer, SurveyListSerializer, SurveyDetailSerializer,
    ResponseSerializer, CreateResponseSerializer
)


class IsParticipantOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow participants of a survey to edit their responses.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the participant
        return obj.user == request.user


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class SurveyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Survey.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'company']
    search_fields = ['title', 'description']
    ordering_fields = ['reward', 'created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SurveyDetailSerializer
        return SurveyListSerializer
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        survey = self.get_object()
        
        # Check if user already has an active response for this survey
        existing_response = SurveyResponse.objects.filter(
            user=request.user,
            survey=survey,
            is_complete=False
        ).first()
        
        if existing_response:
            serializer = ResponseSerializer(existing_response)
            return Response(serializer.data)
        
        # Create new response
        response = SurveyResponse.objects.create(
            user=request.user,
            survey=survey
        )
        
        serializer = ResponseSerializer(response)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResponseViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsParticipantOrReadOnly]
    filterset_fields = ['survey', 'is_complete']
    
    def get_queryset(self):
        return SurveyResponse.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return CreateResponseSerializer
        return ResponseSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.query_params.get('complete') == 'true':
            context['complete'] = True
        return context
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        response = self.get_object()
        
        if response.is_complete:
            return Response(
                {"detail": "This survey response is already complete."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark response as complete
        response.is_complete = True
        response.completed_at = timezone.now()
        response.save()
        
        # Check if all required questions are answered
        survey = response.survey
        required_questions = Question.objects.filter(survey=survey, required=True)
        answered_required_questions = set(
            response.answers.filter(question__required=True).values_list('question_id', flat=True)
        )
        
        required_question_ids = set(required_questions.values_list('id', flat=True))
        
        if answered_required_questions != required_question_ids:
            missing_questions = required_question_ids - answered_required_questions
            missing_questions_text = list(
                Question.objects.filter(id__in=missing_questions).values_list('text', flat=True)
            )
            
            return Response({
                "detail": "Not all required questions are answered.",
                "missing_questions": missing_questions_text
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ResponseSerializer(response)
        return Response(serializer.data)