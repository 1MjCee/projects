from django.core.management.base import BaseCommand
from django_q.models import Schedule

class Command(BaseCommand):
    help = 'List all scheduled tasks'

    def handle(self, *args, **kwargs):
        tasks = Schedule.objects.all()
        if not tasks:
            self.stdout.write(self.style.WARNING('No scheduled tasks found.'))
            return

        self.stdout.write('Scheduled Tasks:')
        for task in tasks:
            self.stdout.write(f' - Name: {task.name}, Next Run: {task.next_run}, Status: {task.last_run}')
