from django.contrib import admin
from api.models import Person, Registration, CancelledRegistration

from django.contrib.auth.admin import UserAdmin
from django.forms import TextInput, Textarea, CharField
from django import forms
from django.db import models


class RegPeopleInline(admin.TabularInline):
    model = Person.registrations.through
    verbose_name = 'Person'
    verbose_name_plural = 'Registered People'

class XRegPeopleInline(admin.TabularInline):
    model = Person.cancelled_registrations.through
    verbose_name = 'Person'
    verbose_name_plural = 'People with Cancelled Registrations'

@admin.register(Registration)
class RegistrationAdminConfig(admin.ModelAdmin):
    inlines = [RegPeopleInline,]

@admin.register(CancelledRegistration)
class XRegistrationAdminConfig(admin.ModelAdmin):
    inlines = [XRegPeopleInline,]


@admin.register(Person)
class PersonAdminConfig(UserAdmin):
    # model = Person
    search_fields = ('email', 'first_name', 'last_name', 'patronic_name', 'is_member')
    list_filter = (
        'email', 'first_name', 'last_name', 'patronic_name', 'is_active', 'is_staff',
        'is_member', 'is_student_or_young_adult',
    )
    ordering = ('-last_name',)
    list_display = ('email', 'first_name', 'last_name', 'patronic_name',
                    'is_active', 'is_staff', 'is_member', 'is_student_or_young_adult')
    fieldsets = (
        (None, {'fields': ('email', 'first_name', 'last_name', 'patronic_name', 
        'phone_number', 'homegroup', 'is_member', 'is_student_or_young_adult')}),
        ('Activity', {'fields': ('registrations', 'cancelled_registrations',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'patronic_name', 
                'password1', 'password2', 'is_active', 'is_staff'
            )}
         ),
    )

# class PersonAdminConfig(UserAdmin):
#     model = Person
#     search_fields = ('email', 'first_name', 'last_name', 'patronic_name', 'is_member')
#     list_filter = (
#         'email', 'first_name', 'last_name', 'patronic_name', 'is_active', 'is_staff',
#         'is_member', 'is_student_or_young_adult',
#     )
#     ordering = ('-last_name',)
#     list_display = ('email', 'first_name', 'last_name', 'patronic_name',
#                     'is_active', 'is_staff', 'is_member', 'is_student_or_young_adult')
#     fieldsets = (
#         (None, {'fields': ('email', 'first_name', 'last_name', 'patronic_name', 
#         'phone_number', 'homegroup', 'is_member', 'is_student_or_young_adult')}),
#         ('Activity', {'fields': ('registrations', 'cancelled_registrations',)}),
#         ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
#     )
#     formfield_overrides = {
#         models.TextField: {'widget': Textarea(attrs={'rows': 20, 'cols': 60})},
#     }
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': (
#                 'email', 'first_name', 'last_name', 'patronic_name', 
#                 'password1', 'password2', 'is_active', 'is_staff'
#             )}
#          ),
#     )

# class RegistrationAdminConfig(admin.ModelAdmin):
#     model = Registration
#     list_display = [
#         'id', 'name', 'activity_date', 'type', 'is_closed',
#     ]
#     search_fields = ['activity_date', 'id', 'type']
#     list_filter = ['activity_date', 'is_closed']
#     ordering = ['-activity_date',]
#     fieldsets = (
#         (None, {'fields': ('name', 'activity_date', 'type', 'is_closed',)}),
#         ('People', {'fields': ('registered_people',)}),
#     )

# class XRegistrationAdminConfig(admin.ModelAdmin):
#     model = CancelledRegistration
#     list_display = [
#         'id', 'registration', 'cancelled_date',
#     ]
#     search_fields = ['registration', 'id']
#     list_filter = ['registration', 'cancelled_date']
#     ordering = ['-registration',]
#     fieldsets = (
#         (None, {'fields': ('registration',)}),
#         ('People', {'fields': ('cancelled_people',)}),
#     )

# Register your models here.
# admin.site.register(Person, PersonAdminConfig)
# admin.site.register(Registration, RegistrationAdminConfig)
# admin.site.register(CancelledRegistration, XRegistrationAdminConfig)