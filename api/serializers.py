from django.db.models.query_utils import Q
from api.models import Person, Registration, CancelledRegistration
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import password_validation
from datetime import datetime

class PersonSerializer(serializers.ModelSerializer):
    registrations = serializers.StringRelatedField(many=True)
    cancelled_registrations = serializers.StringRelatedField(many=True)

    class Meta:
        model = Person
        fields = '__all__'
        read_only_fields = ('id','last_login', 'is_active', 'is_staff','is_superuser', 'created_at', 'updated_at')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # this is internally called by serializer class when validating received data
    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value
    
    def create(self, validated_data):
        validated_data.pop('registrations')
        validated_data.pop('cancelled_registrations')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        password = validated_data.pop('password')

        person = Person.objects.create_user(
            email=email, password=password, 
            first_name=first_name, last_name=last_name,
            **validated_data
        )
        return person
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        instance.updated_at = datetime.now().replace(microsecond=0)
        return super().update(instance, validated_data)

class RegistrationSerializer(serializers.ModelSerializer):
    registered_people = serializers.SlugRelatedField(
        many=True, slug_field='email',
        queryset=Person.objects.all()
    )

    class Meta:
        model = Registration
        fields = ('id','name', 'activity_date', 'date_registered', 'is_closed', 'type', 'registered_people')

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        queryset = instance.registered_people.all()
        people_from_db_count = queryset.count()
        people_from_db = list(queryset)
        people_from_req = validated_data.get('registered_people')
        people_from_req_count = len(people_from_req)
        added = None
        removed = None
        if people_from_db_count > people_from_req_count:
            # get persons to be removed
            removed = list(set(people_from_db).difference(people_from_req)) 
            
        elif people_from_db_count < people_from_req_count:
            # get persons to be added
            added = list(set(people_from_req).difference(people_from_db))
            
        elif people_from_db_count == people_from_req_count:
            # either persons were removed and others added or nothing changed
            removed = list(set(people_from_db).difference(people_from_req))
            if removed:
                added = list(set(people_from_req).difference(people_from_db))
        
        if added:
            # revert cancellations if person has any
            for person in added:
                if not person.revert_cancellation(instance.id):
                    # then person is new to this registration
                    # the framework will handle his addition 
                    pass
                # else the person's registration has been restored
        if removed:
            # cancel person's registration
            for person in removed:
                if not person.cancel_registration(instance.id):
                    # registration cancellation has failed
                    pass
                # else registration cancellation has been successful
        return instance
        


class CancelledRegistrationSerializer(serializers.ModelSerializer):
    registration = serializers.StringRelatedField()
    cancelled_people = serializers.StringRelatedField(many=True)
    
    class Meta:
        model = CancelledRegistration
        fields = ('id','registration','cancelled_people')
    
    def create(self, validated_data):
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class IDSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class MultipleIDSerializer(serializers.Serializer):
    ids = serializers.ListField( 
        child=serializers.IntegerField()
    )