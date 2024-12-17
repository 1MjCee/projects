from django.utils import timezone
from ..models import Notification

class NotificationHelper:
    @staticmethod
    def create_notification(user, message, notification_type):
        Notification.objects.create(user=user, message=message, notification_type=notification_type)

    @staticmethod
    def get_user_notifications(user):
        return Notification.objects.filter(user=user).order_by('-timestamp')

    @staticmethod
    def mark_as_read(notification_id):
        Notification.objects.filter(id=notification_id).update(is_read=True)

    @staticmethod
    def get_unread_count(user):
        return Notification.objects.filter(user=user, is_read=False).count()
