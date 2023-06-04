from django.forms import fields
from .models import Books, Age_range, Library, UserProfile
from rest_framework import serializers
from django.contrib.auth.models import User


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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = '__all__'
class UserProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    class Meta:
        model=UserProfile
        fields = '__all__'

class LibraryListSerializer(serializers.ModelSerializer):
    book = BooksSerializer ()
    user = UserSerializer ()
    class Meta:
        model = Library
        fields = '__all__'


