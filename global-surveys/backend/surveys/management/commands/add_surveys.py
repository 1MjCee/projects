import json
from django.core.management.base import BaseCommand
from surveys.models import Category, Company, Survey, Question, Option

class Command(BaseCommand):
    help = 'Import survey data from JSON'

    def add_arguments(self, parser):
        parser.add_argument(
            '--from-file',
            action='store_true',
            help='Import data from a file instead of using hardcoded data',
        )
        parser.add_argument(
            'file_path',
            nargs='?',
            type=str,
            help='Path to the JSON file (required if --from-file is used)',
        )

    def handle(self, *args, **kwargs):
        from_file = kwargs.get('from_file', False)
        file_path = kwargs.get('file_path', None)
        
        if from_file and not file_path:
            self.stderr.write(self.style.ERROR('File path is required when using --from-file'))
            return
        
        # Create categories
        self.stdout.write('Creating categories...')
        categories = {
            'Market Research': Category.objects.get_or_create(name='Market Research', defaults={'description': 'Surveys about consumer preferences and market trends'})[0],
            'Technology': Category.objects.get_or_create(name='Technology', defaults={'description': 'Surveys about tech usage, preferences, and trends'})[0],
            'Finance': Category.objects.get_or_create(name='Finance', defaults={'description': 'Surveys about financial behaviors and attitudes'})[0],
            'Workplace': Category.objects.get_or_create(name='Workplace', defaults={'description': 'Surveys about work environments and practices'})[0],
            'Environment': Category.objects.get_or_create(name='Environment', defaults={'description': 'Surveys about sustainability and environmental concerns'})[0],
            'Travel & Leisure': Category.objects.get_or_create(name='Travel & Leisure', defaults={'description': 'Surveys about travel habits and preferences'})[0],
            'Retail': Category.objects.get_or_create(name='Retail', defaults={'description': 'Surveys about shopping experiences and preferences'})[0],
            'Entertainment': Category.objects.get_or_create(name='Entertainment', defaults={'description': 'Surveys about media consumption and entertainment'})[0],
        }
        
        # Create companies
        self.stdout.write('Creating companies...')
        companies = {
            'Consumer Insights Co.': Company.objects.get_or_create(name='Consumer Insights Co.', defaults={'website': 'https://consumerinsights.example.com'})[0],
            'TechTrends Analytics': Company.objects.get_or_create(name='TechTrends Analytics', defaults={'website': 'https://techtrendsanalytics.example.com'})[0],
            'Money Matters Institute': Company.objects.get_or_create(name='Money Matters Institute', defaults={'website': 'https://moneymatters.example.com'})[0],
            'Future of Work Research': Company.objects.get_or_create(name='Future of Work Research', defaults={'website': 'https://futureofwork.example.com'})[0],
            'Green Earth Initiative': Company.objects.get_or_create(name='Green Earth Initiative', defaults={'website': 'https://greenearth.example.com'})[0],
            'Wanderlust Surveys': Company.objects.get_or_create(name='Wanderlust Surveys', defaults={'website': 'https://wanderlustsurveys.example.com'})[0],
            'Digital Market Research': Company.objects.get_or_create(name='Digital Market Research', defaults={'website': 'https://digitalmarketresearch.example.com'})[0],
            'MediaMetrics Inc.': Company.objects.get_or_create(name='MediaMetrics Inc.', defaults={'website': 'https://mediametrics.example.com'})[0],
        }
        
        # Get the survey data
        if from_file:
            try:
                with open(file_path, 'r') as f:
                    surveys_data = json.load(f)
                    self.stdout.write(f'Loaded survey data from {file_path}')
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Error loading data from file: {str(e)}'))
                return
        else:
            # Use hardcoded data if not from file
            surveys_data = self.get_hardcoded_survey_data()
        
        # Create surveys
        self.stdout.write('Creating surveys...')
        survey_count = 0
        
        for survey_id, survey_data in surveys_data.items():
            # Skip if survey already exists
            if Survey.objects.filter(title=survey_data['title']).exists():
                self.stdout.write(f'Survey "{survey_data["title"]}" already exists, skipping...')
                continue
                
            # Create survey
            survey = Survey.objects.create(
                title=survey_data['title'],
                description=survey_data['description'],
                estimated_time=survey_data['estimatedTime'],
                reward=survey_data['reward'],
                category=categories[survey_data['category']],
                company=companies[survey_data['company']]
            )
            
            # Create questions and options
            question_count = 0
            option_count = 0
            
            for i, question_data in enumerate(survey_data['questions']):
                question = Question.objects.create(
                    survey=survey,
                    text=question_data['text'],
                    type=question_data['type'],
                    required=question_data.get('required', True),
                    min=question_data.get('min'),
                    max=question_data.get('max'),
                    step=question_data.get('step', 1),
                    min_label=question_data.get('minLabel'),
                    max_label=question_data.get('maxLabel'),
                    placeholder=question_data.get('placeholder'),
                    order=i
                )
                question_count += 1
                
                # Create options for multiple-choice and checkbox questions
                if 'options' in question_data:
                    for j, option_data in enumerate(question_data['options']):
                        Option.objects.create(
                            question=question,
                            option_id=option_data['id'],
                            text=option_data['text'],
                            order=j
                        )
                        option_count += 1
            
            self.stdout.write(f'Created survey "{survey.title}" with {question_count} questions and {option_count} options')
            survey_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully imported {survey_count} surveys'))

    def get_hardcoded_survey_data(self):
        """Return the hardcoded survey data from your existing JSON structure."""
        # This is where your actual survey data goes
        return {
            "1": {
                "id": 1,
                "title": "Consumer Preferences Survey",
                "description": "Share your opinions about everyday products and services",
                "estimatedTime": "8-10 min",
                "reward": 10.0,
                "category": "Market Research",
                "company": "Consumer Insights Co.",
                "questions": [
                    {
                        "id": 101,
                        "type": "multiple-choice",
                        "text": "How often do you shop online?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Daily" },
                            { "id": "b", "text": "A few times a week" },
                            { "id": "c", "text": "A few times a month" },
                            { "id": "d", "text": "Rarely" },
                            { "id": "e", "text": "Never" },
                        ],
                    },
                    {
                        "id": 102,
                        "type": "multiple-choice",
                        "text": "What factor most influences your purchasing decisions?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Price" },
                            { "id": "b", "text": "Quality" },
                            { "id": "c", "text": "Brand reputation" },
                            { "id": "d", "text": "Recommendations from friends/family" },
                            { "id": "e", "text": "Online reviews" },
                        ],
                    },
                    {
                        "id": 103,
                        "type": "checkbox",
                        "text": "Which of the following have you purchased in the last month? (Select all that apply)",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Clothing" },
                            { "id": "b", "text": "Electronics" },
                            { "id": "c", "text": "Groceries" },
                            { "id": "d", "text": "Home goods" },
                            { "id": "e", "text": "Beauty products" },
                        ],
                    },
                    {
                        "id": 104,
                        "type": "scale",
                        "text": "On a scale of 1-5, how satisfied are you with your recent online shopping experiences?",
                        "required": True,
                        "min": 1,
                        "max": 5,
                        "minLabel": "Very dissatisfied",
                        "maxLabel": "Very satisfied",
                    },
                    {
                        "id": 105,
                        "type": "multiple-choice",
                        "text": "How important is sustainability in your purchasing decisions?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Extremely important" },
                            { "id": "b", "text": "Very important" },
                            { "id": "c", "text": "Moderately important" },
                            { "id": "d", "text": "Slightly important" },
                            { "id": "e", "text": "Not important at all" },
                        ],
                    },
                    {
                        "id": 106,
                        "type": "multiple-choice",
                        "text": "How often do you use coupons or promotional codes when shopping?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Always" },
                            { "id": "b", "text": "Often" },
                            { "id": "c", "text": "Sometimes" },
                            { "id": "d", "text": "Rarely" },
                            { "id": "e", "text": "Never" },
                        ],
                    },
                    {
                        "id": 107,
                        "type": "checkbox",
                        "text": "Which payment methods do you regularly use? (Select all that apply)",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Credit card" },
                            { "id": "b", "text": "Debit card" },
                            { "id": "c", "text": "PayPal or similar services" },
                            { "id": "d", "text": "Mobile payment (Apple Pay, Google Pay, etc.)" },
                            { "id": "e", "text": "Buy now, pay later services" },
                            { "id": "f", "text": "Cash" },
                        ],
                    },
                    {
                        "id": 108,
                        "type": "scale",
                        "text": "How likely are you to try a new brand if it offers a significant discount?",
                        "required": True,
                        "min": 1,
                        "max": 5,
                        "minLabel": "Very unlikely",
                        "maxLabel": "Very likely",
                    },
                    {
                        "id": 109,
                        "type": "multiple-choice",
                        "text": "How do you primarily learn about new products?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Social media" },
                            { "id": "b", "text": "TV advertisements" },
                            { "id": "c", "text": "Friends and family" },
                            { "id": "d", "text": "Online searches" },
                            { "id": "e", "text": "In-store displays" },
                            { "id": "f", "text": "Email newsletters" },
                        ],
                    },
                    {
                        "id": 110,
                        "type": "text",
                        "text": "What improvements would you like to see in your shopping experiences?",
                        "required": False,
                        "placeholder": "Enter your answer here...",
                    },
                ],
            },
            "2": {
                "id": 2,
                "title": "Tech Usage Habits",
                "description": "Tell us about your technology preferences and daily usage",
                "estimatedTime": "12-15 min",
                "reward": 15.0,
                "category": "Technology",
                "company": "TechTrends Analytics",
                "questions": [
                    {
                        "id": 201,
                        "type": "multiple-choice",
                        "text": "What type of smartphone do you currently use?",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "iPhone" },
                            { "id": "b", "text": "Android" },
                            { "id": "c", "text": "Other" },
                            { "id": "d", "text": "I don't use a smartphone" },
                        ],
                    },
                    {
                        "id": 202,
                        "type": "checkbox",
                        "text": "Which of the following devices do you own? (Select all that apply)",
                        "required": True,
                        "options": [
                            { "id": "a", "text": "Laptop" },
                            { "id": "b", "text": "Desktop computer" },
                            { "id": "c", "text": "Tablet" },
                            { "id": "d", "text": "Smart TV" },
                            { "id": "e", "text": "Smart speaker (e.g., Amazon Echo, Google Home)" },
                            { "id": "f", "text": "Smartwatch or fitness tracker" },
                        ],
                    },
                    # Add more questions from your data
                ]
            }
            # Add the rest of your surveys
        }