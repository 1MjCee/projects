from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"


class Company(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Companies"


class Survey(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    estimated_time = models.CharField(max_length=50)
    reward = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='surveys')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='surveys')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class Question(models.Model):
    QUESTION_TYPES = (
        ('multiple-choice', 'Multiple Choice'),
        ('checkbox', 'Checkbox'),
        ('scale', 'Scale'),
        ('text', 'Text'),
    )
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    required = models.BooleanField(default=True)
    min = models.IntegerField(null=True, blank=True)  # For scale questions
    max = models.IntegerField(null=True, blank=True)  # For scale questions
    step = models.IntegerField(null=True, blank=True, default=1)  # For scale questions
    min_label = models.CharField(max_length=100, null=True, blank=True)  # For scale questions
    max_label = models.CharField(max_length=100, null=True, blank=True)  # For scale questions
    placeholder = models.CharField(max_length=200, null=True, blank=True)  # For text questions
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.survey.title} - Question {self.order}"
    
    class Meta:
        ordering = ['order']


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_id = models.CharField(max_length=10)  # e.g., "a", "b", "c"
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.text
    
    class Meta:
        ordering = ['order']


class Response(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='survey_responses')
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_complete = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.survey.title}"
    
    class Meta:
        ordering = ['-started_at']


class Answer(models.Model):
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text_answer = models.TextField(null=True, blank=True)  # For text and scale questions
    
    def __str__(self):
        if self.text_answer:
            return f"{self.question.text} - {self.text_answer[:30]}"
        return f"Answer to {self.question.text[:30]}"


class SelectedOption(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='selected_options')
    option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name='selections')
    
    def __str__(self):
        return f"{self.answer.question.text} - {self.option.text}"
    
    class Meta:
        unique_together = ('answer', 'option')