from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from api.serializers import (
    CancelledRegistrationSerializer, MultipleIDSerializer, 
    PersonSerializer, RegistrationSerializer, IDSerializer
)
from api.models import CancelledRegistration, Person, Registration
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
import json


class PersonViewSet(viewsets.ModelViewSet):
    
    serializer_class = PersonSerializer

    # this is implemented to eliminate the N+1 query problem with nested serializers
    def get_queryset(self):
        queryset = Person.objects.prefetch_related('registrations', 'cancelled_registrations').all()
        return queryset
    
    @action(methods=['post'], detail=True, url_name='register', url_path='register')
    def register_single(self, request, pk=None):
        serialized = IDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        person = self.get_object()
        id = serialized.data.get('id')
        try:
            reg = Registration.objects.prefetch_related('registered_people').get(id=id)
            try:
                person.registrations.add(reg)
                return Response({'msg': 'Success'}, status=status.HTTP_200_OK)
            except IntegrityError as ie:
                return Response(
                    {'error': f'Registration id {id} already exists!', 
                    'details': str(ie)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except ObjectDoesNotExist as exc:
            return Response({'error': str(exc)}, status=status.HTTP_404_NOT_FOUND)


    @action(methods=['post'], detail=True, url_name='reg_bulk', url_path='reg-bulk')
    def register_bulk(self, request, pk=None):
        serialized = MultipleIDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        ids = serialized.data.get('ids')
        person = self.get_object()
        problematic_ids = []
        
        regs = Registration.objects.prefetch_related('registered_people').filter(id__in=ids)
        
        if not regs.exists():
            return Response(
                {'error': 'None of the registration ids exists in db'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        for reg in regs:
            try:
               person.registrations.add(reg)
            except IntegrityError:
                problematic_ids.append(reg.id)
        
        msg = "Success" if not problematic_ids else f"Error - There were some ids that don't exist in db: {problematic_ids}"
        return Response({"msg": msg}, status=status.HTTP_200_OK)       
        
    
    @action(methods=['post'], detail=True, url_name='cancel_reg', url_path='cancel-reg')
    def cancel_single(self, request, pk=None):
        serialized = IDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        person = self.get_object()
        id = serialized.data.get('id')
        if not person.cancel_registration(id):
            return Response(
                {'error': f'Cannot cancel registration with id <{id}> because it does not exist!'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response({'msg': 'Success'}, status=status.HTTP_200_OK)
    

    @action(methods=['post'], detail=True, url_name='revert_cancelled', url_path='revert-cancelled')
    def revert_single(self, request, pk=None):
        serialized = IDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        person = self.get_object()
        id = serialized.data.get('id')
        if not person.revert_cancellation(id):
            return Response(
                {'error': 'Cannot revert registration which has not been cancelled or does not exist!'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response({'msg': 'Success'}, status=status.HTTP_200_OK)
    

    @action(methods=['post'], detail=True, url_name='cancel_regs', url_path='cancel-regs')
    def cancel_bulk(self, request, pk=None):
        # request.data must be in this format: {'ids':['12','3','5']}
        serialized = MultipleIDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        ids = serialized.data.get('ids')
        person = self.get_object()
        problematic_ids = [id for id in ids if not person.cancel_registration(id)]
        msg = "Success" if not problematic_ids else f"Error - There were some ids that don't exist in db: {problematic_ids}"
        return Response({"msg": msg}, status=status.HTTP_200_OK)

    
    @action(methods=['post'], detail=True, url_name='revert_cancellations', url_path='revert-cancellations')
    def revert_bulk(self, request, pk=None):
        serialized = MultipleIDSerializer(data=request.data)
        
        if not serialized.is_valid():
            return Response({'error': serialized.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        ids = serialized.data.get('ids')
        person = self.get_object()
        problematic_ids = [id for id in ids if not person.revert_cancellation(id)]
        msg = "Success" if not problematic_ids else f"Error - There were some ids they didn't exist in db: {problematic_ids}"
        return Response({"msg": msg}, status=status.HTTP_200_OK)


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    def get_queryset(self):
        queryset = Registration.objects.prefetch_related("registered_people").all()
        return queryset


class CancelledRegistrationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
    ):
    
    serializer_class = CancelledRegistrationSerializer

    def get_queryset(self):
        queryset = CancelledRegistration.objects.select_related("registration").all()
        return queryset
