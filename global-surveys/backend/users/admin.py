# admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from .models import User, UserProfile, ReferralCode, ReferredUser, ReferralEarning, ReferralActivity, ReferralLevel, ReferralLevelBenefit

# Unregister default Group admin
admin.site.unregister(Group)


class UserProfileInline(StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = _('Profile')
    fk_name = 'user'
    
    fieldsets = (
        (_('Personal Information'), {
            'fields': ('first_name', 'last_name', 'avatar', 'bio')
        }),
        (_('Contact Information'), {
            'fields': ('phone', 'website', 'location', 'country')
        }),
        (_('Professional Information'), {
            'fields': ('profession', 'company')
        }),
        (_('Profile Status'), {
            'fields': ('profile_completion',),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('profile_completion',)


class ReferralCodeInline(StackedInline):
    model = ReferralCode
    can_delete = False
    verbose_name_plural = _('Referral Code')
    fk_name = 'user'
    
    fieldsets = (
        (_('Referral Information'), {
            'fields': ('code', 'level')
        }),
        (_('Dates'), {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('code', 'created_at')


class ReferralEarningInline(StackedInline):
    model = ReferralEarning
    can_delete = False
    verbose_name_plural = _('Referral Earnings')
    fk_name = 'user'
    
    fieldsets = (
        (_('Earnings Information'), {
            'fields': ('total_earnings', 'referral_earnings')
        }),
        (_('Dates'), {
            'fields': ('last_updated',),
            'classes': ('collapse',),
        }),
    )
    readonly_fields = ('last_updated',)


class ReferredUserInline(TabularInline):
    model = ReferredUser
    fk_name = 'referred_user'
    verbose_name_plural = _('Referred By')
    fields = ('referrer_code', 'status', 'join_date')
    readonly_fields = ('referrer_code', 'join_date')
    can_delete = False
    max_num = 1


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    # Forms loaded from `unfold.forms`
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    
    list_display = ('email', 'get_full_name', 'get_profile_completion', 'get_referral_count', 'get_referral_level', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'referral_code__level')
    search_fields = ('email', 'profile__first_name', 'profile__last_name')
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'get_referral_count')
    inlines = (
        UserProfileInline,
        ReferralCodeInline,
        ReferralEarningInline,
        ReferredUserInline,
    )
    
    fieldsets = (
        (_('Account Information'), {
            'fields': ('email', 'password'),
        }),
        (_('Referral Information'), {
            'fields': ('referral_count', 'referred_by'),
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined'),
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    
    def get_full_name(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.get_full_name()
        return obj.email
    get_full_name.short_description = _('Full Name')
    
    def get_profile_completion(self, obj):
        if hasattr(obj, 'profile'):
            return f"{obj.profile.profile_completion}%"
        return "0%"
    get_profile_completion.short_description = _('Profile Completion')
    
    def get_referral_level(self, obj):
        try:
            return obj.referral_code.get_level_display()
        except:
            return _("No level")
    get_referral_level.short_description = _('Referral Level')

    def get_referral_count(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.referral_count
        return 0
    
    def save_formset(self, request, form, formset, change):
        """
        Calculate profile completion when saving profile data
        """
        instances = formset.save(commit=False)
        for instance in instances:
            if isinstance(instance, UserProfile):
                instance.calculate_profile_completion()
                instance.save()
            else:
                instance.save()
        formset.save_m2m()
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:  # If this is a new user
            # Ensure referral code exists
            try:
                ReferralCode.objects.get(user=obj)
            except ReferralCode.DoesNotExist:
                code_text = ReferralCode.generate_code(obj)
                ReferralCode.objects.create(user=obj, code=code_text)
            
            # Ensure earnings model exists
            try:
                ReferralEarning.objects.get(user=obj)
            except ReferralEarning.DoesNotExist:
                ReferralEarning.objects.create(user=obj)
    
    actions = ['recalculate_levels']
    
    @admin.action(description=_("Recalculate referral levels"))
    def recalculate_levels(self, request, queryset):
        updated = 0
        for user in queryset:
            try:
                referral_code = ReferralCode.objects.get(user=user)
                referral_code.update_level()
                updated += 1
            except ReferralCode.DoesNotExist:
                pass
        
        self.message_user(request, _("Successfully updated {} referral levels.").format(updated))


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ('email', 'get_full_name', 'get_profile_completion', 'get_referral_code', 'referral_count', 'get_referral_level', 'surveys_completed', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('user__email', 'first_name', 'last_name')
    readonly_fields = ('profile_completion',)
    
    def email(self, obj):
        return obj.user.email
    email.short_description = _('Email')
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = _('Full Name')
    
    def get_profile_completion(self, obj):
        return f"{obj.profile_completion}%"
    get_profile_completion.short_description = _('Profile Completion')
    
    def is_active(self, obj):
        return obj.user.is_active
    is_active.boolean = True
    is_active.short_description = _('Active')
    
    def is_staff(self, obj):
        return obj.user.is_staff
    is_staff.boolean = True
    is_staff.short_description = _('Staff')
    
    def date_joined(self, obj):
        return obj.user.date_joined
    date_joined.short_description = _('Date Joined')

    def get_referral_level(self, obj):
        try:
            return obj.user.referral_code.get_level_display()
        except (AttributeError, ReferralCode.DoesNotExist):
            return _("No level")
    get_referral_level.short_description = _('Level')

    def get_referral_code(self, obj):
        try:
            return obj.user.referral_code.code
        except (AttributeError, ReferralCode.DoesNotExist):
            return _("No code")
    get_referral_code.short_description = _('Referral Code')


@admin.register(ReferralCode)
class ReferralCodeAdmin(ModelAdmin):
    list_display = ('code', 'user_email', 'level', 'referral_count', 'created_at')
    list_filter = ('level', 'created_at')
    search_fields = ('code', 'user__email')
    readonly_fields = ('code', 'created_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        (_('Referral Information'), {
            'fields': ('user', 'code', 'level')
        }),
        (_('Dates'), {
            'fields': ('created_at',),
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _("User Email")
    
    def referral_count(self, obj):
        return obj.user.referral_count
    referral_count.short_description = _("Referral Count")
    
    actions = ['update_levels']
    
    @admin.action(description=_("Update levels based on referral count"))
    def update_levels(self, request, queryset):
        for referral_code in queryset:
            referral_code.update_level()
        self.message_user(request, _("Successfully updated levels for {} referral codes.").format(queryset.count()))


@admin.register(ReferredUser)
class ReferredUserAdmin(ModelAdmin):
    list_display = ('referred_email', 'referrer_email', 'status', 'join_date', 'survey_count')
    list_filter = ('status', 'join_date')
    search_fields = ('referred_user__email', 'referrer_code__user__email')
    readonly_fields = ('join_date',)
    ordering = ('-join_date',)
    
    fieldsets = (
        (_('Referral Relationship'), {
            'fields': ('referred_user', 'referrer_code', 'status')
        }),
        (_('Dates'), {
            'fields': ('join_date',),
        }),
    )
    
    def referred_email(self, obj):
        return obj.referred_user.email
    referred_email.short_description = _("Referred User")
    
    def referrer_email(self, obj):
        return obj.referrer_code.user.email
    referrer_email.short_description = _("Referrer")
    
    def survey_count(self, obj):
        return obj.activities.filter(activity_type='survey_completed').count()
    survey_count.short_description = _("Surveys Completed")
    
    actions = ['activate_referrals', 'deactivate_referrals']
    
    @admin.action(description=_("Activate selected referrals"))
    def activate_referrals(self, request, queryset):
        # Only get pending referrals
        to_activate = queryset.filter(status='pending')
        count = to_activate.count()
        
        for referred_user in to_activate:
            referred_user.activate()
            
        self.message_user(request, _("Successfully activated {} referrals.").format(count))
    
    @admin.action(description=_("Deactivate selected referrals"))
    def deactivate_referrals(self, request, queryset):
        # Only update active referrals
        updated = queryset.filter(status='active').update(status='pending')
        self.message_user(request, _("Successfully deactivated {} referrals.").format(updated))


@admin.register(ReferralEarning)
class ReferralEarningAdmin(ModelAdmin):
    list_display = ('user_email', 'total_earnings', 'referral_earnings', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('user__email',)
    readonly_fields = ('last_updated',)
    ordering = ('-total_earnings',)
    
    fieldsets = (
        (_('Earning Information'), {
            'fields': ('user', 'total_earnings', 'referral_earnings')
        }),
        (_('Dates'), {
            'fields': ('last_updated',),
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = _("User Email")


class ReferralActivityInline(TabularInline):
    model = ReferralActivity
    verbose_name_plural = _("Activities")
    fields = ('activity_type', 'activity_date', 'details')
    readonly_fields = ('activity_date',)
    extra = 0


@admin.register(ReferralActivity)
class ReferralActivityAdmin(ModelAdmin):
    list_display = ('get_user', 'get_referrer', 'activity_type', 'activity_date')
    list_filter = ('activity_type', 'activity_date')
    search_fields = ('referred_user__referred_user__email', 'referred_user__referrer_code__user__email')
    readonly_fields = ('activity_date',)
    ordering = ('-activity_date',)
    
    fieldsets = (
        (_('Activity Information'), {
            'fields': ('referred_user', 'activity_type', 'details')
        }),
        (_('Dates'), {
            'fields': ('activity_date',),
        }),
    )
    
    def get_user(self, obj):
        return obj.referred_user.referred_user.email
    get_user.short_description = _("User")
    
    def get_referrer(self, obj):
        return obj.referred_user.referrer_code.user.email
    get_referrer.short_description = _("Referrer")

class ReferralLevelBenefitInline(TabularInline):
    model = ReferralLevelBenefit
    extra = 1
    fields = ('description',)
    verbose_name = "Benefit"
    verbose_name_plural = "Benefits"

@admin.register(ReferralLevel)
class ReferralLevelAdmin(ModelAdmin):
    list_display = ('name', 'threshold', 'icon', 'benefits_count')
    search_fields = ('name',)
    list_filter = ('threshold',)
    ordering = ('threshold',)
    inlines = [ReferralLevelBenefitInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'threshold', 'icon'),
        }),
        ('Styling', {
            'fields': ('color', 'text_color', 'border_color'),
            'classes': ('collapse',),
        }),
    )
    
    def benefits_count(self, obj):
        return obj.benefits.count()
    benefits_count.short_description = 'Benefits'

ReferredUserAdmin.inlines = [ReferralActivityInline]