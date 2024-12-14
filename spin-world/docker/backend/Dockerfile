FROM python:3.12.3-alpine

# Create a group and user for Celery
RUN apk add --no-cache shadow
RUN groupadd -r celery && useradd -r -g celery celery

# set working directory
WORKDIR /app

# Copy requirements first for better cache utilization
COPY ./backend/requirements.txt /app/backend/

RUN pip3 install --upgrade pip
RUN pip3 install gunicorn
RUN pip3 install -r backend/requirements.txt

# Copy the rest of the project
COPY ./docker /app/docker
COPY ./backend /app/backend

# Copy the wait-for-it.sh script into the container
COPY ./scripts/wait-for-it.sh /wait-for-it.sh

# Make the script executable
RUN chmod +x /wait-for-it.sh

# Change ownership of the application files to the celery user
RUN chown -R celery:celery /app
RUN chmod -R 775 /app/backend/django_static
RUN chmod -R 775 /app/backend/media

# Switch to the non-root celery user
USER celery

# Expose the port your application listens on (if applicable)
EXPOSE 8000
