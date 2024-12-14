from django.core.management.base import BaseCommand
from django_q.models import Schedule

class Command(BaseCommand):
    help = 'Remove all scheduled tasks'

    def handle(self, *args, **kwargs):
        deleted_count, _ = Schedule.objects.all().delete()
        if deleted_count:
            self.stdout.write(self.style.SUCCESS(f'Successfully removed {deleted_count} task(s).'))
        else:
            self.stdout.write(self.style.WARNING('No tasks found to remove.'))
