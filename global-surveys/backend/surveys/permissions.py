from rest_framework import permissions


class IsParticipantOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow participants of a survey to edit their responses.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the participant
        return obj.user == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to create/update surveys, categories, and companies.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated request
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff


class CanTakeSurvey(permissions.BasePermission):
    """
    Custom permission to check if a user can take a survey.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Additional checks could be added here
        # For example, checking if the user has already completed the survey,
        # if they meet demographic requirements, etc.
        
        return True