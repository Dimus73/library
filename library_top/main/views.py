from django.forms import fields
from django.urls import reverse_lazy
from django.views import generic
from .models import Age_range, Books, Library, UserProfile
from django.shortcuts import render
from django.views.generic import CreateView, ListView
from rest_framework import generics, viewsets, permissions
from .serializers import BooksSerializer, Age_rangeSerializer, BoobByGglIdSerializer, LibraryListSerializer, LibraryAddSerializer
from rest_framework.views import APIView

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

# Create your views here.


def homepage(request):
    return render(request, 'main/homepage.html')

class BooksList(ListView):
    model = Books
    fields = '__all__'
    template_name = 'main/books_list.html'
    

class Book_Add(CreateView):
    model = Books
    fields = '__all__'
    template_name = 'main/book_add.html'
    success_url = reverse_lazy ('booklist_path')

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})

class BooksApi(viewsets.ModelViewSet):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class Age_rangeApi(generics.ListAPIView):
    queryset = Age_range.objects.all()
    serializer_class = Age_rangeSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookByGglId(generics.RetrieveAPIView):
    queryset = Books.objects.all()
    serializer_class = BoobByGglIdSerializer
    lookup_field = 'googl_id'
    lookup_url_kwarg = 'id'
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LibraryListAPI(generics.ListAPIView):
    queryset = Library.objects.all()
    serializer_class = LibraryListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LibraryCreateAPI(generics.CreateAPIView):
    queryset = Library.objects.all()
    serializer_class = LibraryAddSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post (self, request):
        print("Мы в профиле пользователя",request.data)
        try:
            profile_info = request.data
            user = request.user
            user_profile, created = UserProfile.objects.get_or_create(user=user)
            user_profile.first_name    = profile_info['first_name']
            user_profile.last_name     = profile_info['last_name']
            user_profile.email         = profile_info['Email']
            user_profile.phone         = profile_info['phone']
            user_profile.city          = profile_info['city']
            user_profile.address       = profile_info['address']
            user_profile.geo_latitudes = profile_info['geo_latitudes']
            user_profile.geo_longitude = profile_info['geo_longitude']
            user_profile.save()
            return Response ({'ok':True, 'user_profile_id':user_profile.id, 'message':'User profile created successfully'})
        except:
            return Response ({'ok':False, 'message':'Error creating user profile'})
