from django.db.models import base
from api.views import (
    CancelledRegistrationViewSet, 
    PersonViewSet, 
    RegistrationViewSet
)
from django.urls import path
from rest_framework import routers

app_name = 'api'

router = routers.SimpleRouter(trailing_slash=False)
router.register(r'people', PersonViewSet, basename='person')
router.register(r'registrations', RegistrationViewSet, basename='reg')
router.register(r'cancelled-registrations', CancelledRegistrationViewSet, basename='x_reg')

urlpatterns = router.urls