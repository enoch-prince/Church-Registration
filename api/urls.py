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

# urlpatterns = [
#     path('people', PersonList.as_view()),
#     path('people/<int:pk>', PersonDetail.as_view()),
#     path('people/<int:pk>/cancel-registration', CancelSingle.as_view()),
#     path('people/<int:pk>/revert-cancellation', RevertSingle.as_view()),
#     path('people/cancel-registration', CancelBulk.as_view()),
#     path('people/revert-cancellation', RevertBulk.as_view()),
#     path('registration', RegistrationList.as_view()),
#     path('registration/<int:pk>', RegistrationDetail.as_view()),
#     path('cancelled-registration', CancelledRegistrationList.as_view()),
#     path('cancelled-registration/<int:pk>', CancelledRegistrationDetail.as_view()),
# ]
