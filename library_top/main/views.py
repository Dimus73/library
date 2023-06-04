from django.forms import fields
from django.urls import reverse_lazy
from django.views import generic
from .models import Age_range, Books, Library
from django.shortcuts import render
from django.views.generic import CreateView, ListView
from rest_framework import generics, viewsets, permissions
from .serializers import BooksSerializer, Age_rangeSerializer, BoobByGglIdSerializer, LibraryListSerializer

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


