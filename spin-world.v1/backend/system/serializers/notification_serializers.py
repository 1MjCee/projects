from rest_framework import serializers
from ..models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'notification_type', 'timestamp', 'is_read']
