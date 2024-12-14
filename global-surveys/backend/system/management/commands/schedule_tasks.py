from django.core.management.base import BaseCommand
from django.utils.timezone import now
from celery import Celery
from celery.schedules import crontab
from celery import shared_task
from system.tasks import check_user_rankings, check_investment_expiration, reset_spin_count, fetch_exchange_rates

class Command(BaseCommand):
    help = 'Schedule tasks using Celery'

    def handle(self, *args, **options):
        check_user_rankings.delay() 
        check_investment_expiration.delay()  
        fetch_exchange_rates.delay() 
        self.stdout.write(self.style.SUCCESS('Tasks have been executed manually'))
