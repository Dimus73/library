# Generated by Django 4.2.1 on 2023-06-03 11:17

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_books_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='books',
            name='img',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rentsbook',
            name='start_date',
            field=models.DateField(default=datetime.date(2023, 6, 3)),
        ),
    ]