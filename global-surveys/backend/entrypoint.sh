#!/bin/sh

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Create superuser if needed
if [ "$DJANGO_SUPERUSER_EMAIL" ]; then
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(email='${DJANGO_SUPERUSER_EMAIL}').exists():
    user = User.objects.create_superuser(
        email='${DJANGO_SUPERUSER_EMAIL}',
        password='${DJANGO_SUPERUSER_PASSWORD}'
    )
    print(f'Superuser created with email: {user.email}')
else:
    print('Superuser already exists with this email.')
"
fi

python3 manage.py add_levels
sleep 2

python3 manage.py add_surveys
sleep 2

# Execute the command passed to docker
exec "$@"