from django.forms import fields
from django.http import JsonResponse, response
from django.urls import reverse_lazy
from django.views import generic
from .models import Age_range, Books, Library, UserProfile
from django.shortcuts import render
from django.views.generic import CreateView, ListView
from rest_framework import generics, viewsets, permissions
from .serializers import BooksSerializer, Age_rangeSerializer, BoobByGglIdSerializer, LibraryListSerializer, LibraryAddSerializer, LibrarySeachBookSerializer
from rest_framework.views import APIView

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.db.models import Q
import json
from django.http import HttpResponse

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
        try:
            profile = UserProfile.objects.get(user=token.user_id)
            profile_pk = profile.pk
        except:
            profile_pk = 0
        return Response({'token': token.key, 'id': token.user_id, 'profile_id':profile_pk})

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
        

class LibrarySeachBook (APIView):
    def get(self, request):
        title = request.GET.get('title', '')
        author = request.GET.get('author', '')
        age_range = request.GET.get('age_range', '')
        print (title, author, age_range)

        book_list = Library.objects.all()
        if title != ' ':
            print ('Ищем по заголовку', title)
            book_list = book_list.filter(book__title__icontains=title)
        if author != ' ':
            print ('Ищем по заголовку', title)
            book_list = book_list.filter(book__author__icontains=author)
        search_data = []
        for book in book_list:
            search_data.append({
                'id': book.pk,
                'titel': book.book.title,
                'author' : book.book.author,
                'img' : book.book.img,
                'name' : ' ' if book.user.first_name is None else book.user.first_name + \
                        ' ' + ' ' if  book.user.last_name is None else book.user.last_name,
                'addres' : ' ' if book.user.city is None else book.user.city + \
                        ' ' + ' ' if  book.user.address is None else book.user.address,
                # 'name' : 'Dmitry Prigozhin',
                # 'addres' : 'Hyfa, hgalli25',
                'phone' : book.user.phone,
                'email' : book.user.email
            })
        print (search_data)
        json_data = json.dumps(search_data)
        return HttpResponse(json_data, content_type='application/json')
    
        # return JsonResponse(search_data)
        # ser_data = LibrarySeachBookSerializer(search_data, many=True)
        # print(ser_data.data)
        # return (response(ser_data.validated_data))
