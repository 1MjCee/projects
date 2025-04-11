from django.contrib import admin
from .models import Category, Company, Survey, Question, Option, Response, Answer, SelectedOption
from unfold.admin import ModelAdmin, StackedInline, TabularInline


class OptionInline(TabularInline):
    model = Option
    extra = 3


class QuestionInline(TabularInline):
    model = Question
    extra = 3
    show_change_link = True


@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ('text', 'survey', 'type', 'required', 'order')
    list_filter = ('survey', 'type', 'required')
    search_fields = ('text', 'survey__title')
    inlines = [OptionInline]


class SelectedOptionInline(TabularInline):
    model = SelectedOption
    extra = 1
    readonly_fields = ('option',)


class AnswerInline(TabularInline):
    model = Answer
    extra = 0
    readonly_fields = ('question', 'text_answer')
    show_change_link = True


@admin.register(Answer)
class AnswerAdmin(ModelAdmin):
    list_display = ('response', 'question', 'text_answer_preview')
    list_filter = ('response__survey',)
    search_fields = ('response__user__username', 'question__text')
    inlines = [SelectedOptionInline]
    
    def text_answer_preview(self, obj):
        if obj.text_answer:
            return obj.text_answer[:50] + ('...' if len(obj.text_answer) > 50 else '')
        return "No text answer"
    text_answer_preview.short_description = 'Text Answer'


@admin.register(Response)
class ResponseAdmin(ModelAdmin):
    list_display = ('user', 'survey', 'started_at', 'completed_at', 'is_complete')
    list_filter = ('survey', 'is_complete')
    search_fields = ('user__username', 'survey__title')
    date_hierarchy = 'started_at'
    inlines = [AnswerInline]


@admin.register(Survey)
class SurveyAdmin(ModelAdmin):
    list_display = ('title', 'category', 'company', 'reward', 'estimated_time', 'is_active')
    list_filter = ('category', 'company', 'is_active')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'
    inlines = [QuestionInline]


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ('name', 'survey_count')
    search_fields = ('name',)
    
    def survey_count(self, obj):
        return obj.surveys.count()
    survey_count.short_description = 'Number of Surveys'


@admin.register(Company)
class CompanyAdmin(ModelAdmin):
    list_display = ('name', 'website', 'survey_count')
    search_fields = ('name',)
    
    def survey_count(self, obj):
        return obj.surveys.count()
    survey_count.short_description = 'Number of Surveys'


@admin.register(Option)
class OptionAdmin(ModelAdmin):
    list_display = ('text', 'question', 'option_id', 'order')
    list_filter = ('question__survey',)
    search_fields = ('text', 'question__text')


@admin.register(SelectedOption)
class SelectedOptionAdmin(ModelAdmin):
    list_display = ('answer', 'option')
    list_filter = ('answer__response__survey',)
    search_fields = ('option__text', 'answer__question__text')