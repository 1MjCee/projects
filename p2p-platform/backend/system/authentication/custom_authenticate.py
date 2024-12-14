from django.contrib.auth.backends import ModelBackend
from system.models import User

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, phone_number=None, calling_code=None, password=None, **kwargs):
        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            return None

        # Check if the calling code matches
        if user.country.calling_code != calling_code:
            return None

        if user.check_password(password):
            return user
        return None
