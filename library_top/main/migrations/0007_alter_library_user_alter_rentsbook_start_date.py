# Generated by Django 4.2.1 on 2023-06-05 10:51

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_rentsbook_start_date_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='library',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main.userprofile'),
        ),
        migrations.AlterField(
            model_name='rentsbook',
            name='start_date',
            field=models.DateField(default=datetime.date(2023, 6, 5)),
        ),
    ]
