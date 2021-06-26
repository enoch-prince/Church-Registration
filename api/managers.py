from django.contrib.auth.models import BaseUserManager
from django.utils.translation import ugettext_lazy as _

class AccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        if not any([email, first_name, last_name]):
            raise ValueError(_("Required fields are in this order: email, firstname, lastname"))
        
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, first_name, last_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(_("Superuser must be assigned to is_staff=True"))
        if other_fields.get('is_superuser') is not True:
            raise ValueError(_("Superuser must be assigned to is_superuser=True"))
        
        return self.create_user(email, first_name, last_name, password)

    
