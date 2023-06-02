from django.forms import fields
from django.urls import reverse_lazy
from .models import Books
from django.shortcuts import render
from django.views.generic import CreateView, ListView
from rest_framework import generics, viewsets, permissions
from .serializers import BooksSerializer

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

class BooksApi(viewsets.ModelViewSet):
    queryset = Books.objects.all()
    serializer_class = BooksSerializer
    permission_classes = [permissions.IsAuthenticated]