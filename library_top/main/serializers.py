from django.forms import fields
from .models import Books, Age_range
from rest_framework import serializers

class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'

class Age_rangeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Age_range
        fields = '__all__'
