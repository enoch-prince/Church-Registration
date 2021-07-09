from api.managers import AccountManager
from django.contrib.auth.models import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from django.db import models, IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import PermissionsMixin


class Registration(models.Model):

    class Types(models.TextChoices):
        '''Python version of an enum class used to implement choice type fields for the Registration Model '''
        SUNDAY_SERVICE = "SUNDAY_SERVICE", "Sunday service"
        EVENT = "EVENT", "Event"

    name = models.CharField(_("Name of Registration"), max_length=120)
    activity_date = models.DateField(_("Date of Activity"), auto_now_add=False)
    date_registered = models.DateTimeField(_("Date Registered"), auto_now_add=True)
    is_closed = models.BooleanField(_("Registration Closed?"), default=True)
    type = models.CharField(_("Type of Registration"), max_length=20, choices=Types.choices, default=Types.SUNDAY_SERVICE)

    def __str__(self):
        return self.name + " - " + self.activity_date.isoformat()

class CancelledRegistration(models.Model):
    registration = models.OneToOneField("api.Registration", verbose_name=_("Registration to be cancelled"), on_delete=models.CASCADE)
    cancelled_date = models.DateTimeField(_("Cancellation Date"), auto_now_add=True)

    def __str__(self):
        return self.registration.name + " - " + self.registration.activity_date.isoformat()


class Person(AbstractBaseUser, PermissionsMixin):

    objects = AccountManager()

    email = models.EmailField(_("Email"), max_length=80, null=False, unique=True)
    first_name = models.CharField(_("First Name"), max_length=80, null=False)
    last_name = models.CharField(_("Surname"), max_length=80, null=False)
    patronic_name = models.CharField(_("Patronic Name"), max_length=80, null=True, blank=True)
    phone_number = models.CharField(_("Phone Number"), max_length=20, blank=True, null=True)
    homegroup = models.CharField(_("Home Group"), max_length=50, blank=True, null=True)
    is_member = models.BooleanField(_("Member of Hope Church?"), default=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now_add=False, null=True, blank=True)

    is_student_or_young_adult = models.BooleanField(_("Student or Young Adult?"), default=False)
    registrations = models.ManyToManyField("api.Registration", related_name='registered_people', verbose_name=_("Registrations"), blank=True)
    cancelled_registrations = models.ManyToManyField("api.CancelledRegistration", related_name='cancelled_people', verbose_name=_("Cancelled Registrations"), blank=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.first_name + " " + self.last_name + " " + (self.patronic_name if self.patronic_name else "")
    
    def cancel_registration(self, reg_id):
        try:
            reg = self.registrations.get(id=reg_id)
            try:
                self.cancelled_registrations.create(registration=reg)
            except IntegrityError:
                # exception occured because of an attempt to duplicate key
                # means reg obj exist both in person regs and x_regs
                # so we remove reg obj in person's regs anyway
                pass
            self.registrations.remove(reg)
            return True
        except ObjectDoesNotExist:
            print("Error: Registration Object does not exist")
            return None
    
    def revert_cancellation(self, reg_id):
        try:
            x_reg = self.cancelled_registrations.filter(registration__id=reg_id).first()
            if not x_reg:
                return False
            try:
                self.registrations.add(x_reg.registration)
            except IntegrityError:
                # exception occured because of an attempt to duplicate key
                # means reg obj exist both in person regs and x_regs
                # so we delete person's x_reg anyway
                pass
            x_reg.delete()
            return True
        except ObjectDoesNotExist:
            print("Error: Cancelled registration Object does not exist")
            return False