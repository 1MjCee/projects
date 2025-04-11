# surveys/serializers.py
from rest_framework import serializers
from .models import Category, Company, Survey, Question, Option, Response, Answer, SelectedOption


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website']


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'option_id', 'text']


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'text', 'type', 'required', 'min', 'max', 'step', 
            'min_label', 'max_label', 'placeholder', 'options'
        ]


class SurveyListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Survey
        fields = [
            'id', 'title', 'description', 'estimated_time', 'reward',
            'category_name', 'company_name'
        ]


class SurveyDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Survey
        fields = [
            'id', 'title', 'description', 'estimated_time', 'reward',
            'category', 'company', 'questions'
        ]


class SelectedOptionSerializer(serializers.ModelSerializer):
    option_text = serializers.CharField(source='option.text', read_only=True)
    option_id = serializers.CharField(source='option.option_id', read_only=True)
    
    class Meta:
        model = SelectedOption
        fields = ['id', 'option_id', 'option_text']


class AnswerSerializer(serializers.ModelSerializer):
    selected_options = SelectedOptionSerializer(many=True, read_only=True)
    question_text = serializers.CharField(source='question.text', read_only=True)
    question_type = serializers.CharField(source='question.type', read_only=True)
    
    class Meta:
        model = Answer
        fields = ['id', 'question_text', 'question_type', 'text_answer', 'selected_options']


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    survey_title = serializers.CharField(source='survey.title', read_only=True)
    
    class Meta:
        model = Response
        fields = ['id', 'survey', 'survey_title', 'started_at', 'completed_at', 'is_complete', 'answers']


# Serializers for creating responses
class CreateSelectedOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedOption
        fields = ['option']


class CreateAnswerSerializer(serializers.ModelSerializer):
    selected_options = CreateSelectedOptionSerializer(many=True, required=False)
    
    class Meta:
        model = Answer
        fields = ['question', 'text_answer', 'selected_options']
    
    def create(self, validated_data):
        selected_options_data = validated_data.pop('selected_options', [])
        answer = Answer.objects.create(**validated_data)
        
        for option_data in selected_options_data:
            SelectedOption.objects.create(answer=answer, **option_data)
        
        return answer


class CreateResponseSerializer(serializers.ModelSerializer):
    answers = CreateAnswerSerializer(many=True, required=False)
    
    class Meta:
        model = Response
        fields = ['survey', 'answers']
    
    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        user = self.context['request'].user
        response = Response.objects.create(user=user, **validated_data)
        
        for answer_data in answers_data:
            selected_options_data = answer_data.pop('selected_options', [])
            answer = Answer.objects.create(response=response, **answer_data)
            
            for option_data in selected_options_data:
                SelectedOption.objects.create(answer=answer, **option_data)
        
        return response
    
    def update(self, instance, validated_data):
        answers_data = validated_data.pop('answers', [])
        instance = super().update(instance, validated_data)
        
        # Handle completion if all required questions are answered
        if self.context.get('complete', False):
            from django.utils import timezone
            instance.is_complete = True
            instance.completed_at = timezone.now()
            instance.save()
        
        # Process answers
        for answer_data in answers_data:
            selected_options_data = answer_data.pop('selected_options', [])
            question = answer_data.get('question')
            
            # Try to get existing answer or create new one
            answer, created = Answer.objects.get_or_create(
                response=instance,
                question=question,
                defaults=answer_data
            )
            
            if not created:
                for attr, value in answer_data.items():
                    setattr(answer, attr, value)
                answer.save()
                # Clear existing selected options
                answer.selected_options.all().delete()
            
            # Create new selected options
            for option_data in selected_options_data:
                SelectedOption.objects.create(answer=answer, **option_data)
        
        return instance