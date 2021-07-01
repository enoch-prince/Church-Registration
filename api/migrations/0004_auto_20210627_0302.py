# Generated by Django 3.2.4 on 2021-06-27 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20210627_0135'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='cancelled_registrations',
            field=models.ManyToManyField(blank=True, related_name='cancelled_people', to='api.CancelledRegistration', verbose_name='Cancelled Registrations'),
        ),
        migrations.AlterField(
            model_name='person',
            name='registrations',
            field=models.ManyToManyField(blank=True, related_name='registered_people', to='api.Registration', verbose_name='Registrations'),
        ),
    ]
