#!/bin/sh

# Extract the database host and port from the DATABASE_URL environment variable
DB_HOST=$(echo $DATABASE_URL | sed -e 's/^.*@//' -e 's/:.*//')
DB_PORT=$(echo $DATABASE_URL | sed -e 's/^.*://' -e 's/\/.*//')
echo "Waiting for PostgreSQL to be ready at $DB_HOST:$DB_PORT..."


# Wait until PostgreSQL is ready to accept connections
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for PostgreSQL to be available at $DB_HOST:$DB_PORT..."
  sleep 2
done
echo "PostgreSQL is ready, continuing with the application setup..."


# Waiting for backend volume to be ready
until cd /app/backend
do
    echo "Waiting for backend volume..."
done

echo "Making migrations..."
until ./manage.py makemigrations
do
    echo "Waiting for migrations to be ready..."
    sleep 2
done

# Migrate database
echo "Applying migrations..."
until ./manage.py migrate
do
    echo "Waiting for migrations to be applied..."
    sleep 2
done

echo "Colllecting static files.."
./manage.py collectstatic --noinput

# Create superuser if it doesn't exist
if [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_USERNAME" ]; then
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()

# Check if a user with the provided email or username exists
if User.objects.filter(email='$DJANGO_SUPERUSER_EMAIL').exists():
    print('User already exists with this email.')
elif User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    print('User already exists with this username.')
else:
    # Create the superuser if neither the email nor the username exists
    user = User.objects.create_superuser(
        email='$DJANGO_SUPERUSER_EMAIL',
        username='$DJANGO_SUPERUSER_USERNAME',
        password='$DJANGO_SUPERUSER_PASSWORD',
    )
    print(f'Superuser created with email: {user.email} and username: {user.username}')
"
fi

# Import currencies
python3 manage.py import_currency
sleep 2

echo "Starting gunicorn.."
gunicorn backend.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4 --log-level debug

