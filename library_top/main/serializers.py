from django.forms import fields
from .models import Books, Age_range, Library
from rest_framework import serializers


class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'

class Age_rangeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Age_range
        fields = '__all__'

class BoobByGglIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'

class BooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Books
        fields = '__all__'

class LibrarySerializer(serializers.ModelSerializer):
    book = BooksSerializer ()
    class Meta:
        model = Library
        fields = '__all__'
