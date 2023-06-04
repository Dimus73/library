"""
URL configuration for library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from .views import Book_Add, BooksList, homepage, BooksApi, Age_rangeApi, BookByGglId 
from .views import CustomObtainAuthToken, LibraryListAPI, UserProfileView
from rest_framework import routers
# from django.conf.urls import url


router = routers.SimpleRouter()
router.register(r'book', BooksApi)
# routerLbr = routers.SimpleRouter()
# routerLbr.register(r'library', LibraryAPI)


urlpatterns = [
    path('', homepage, name='homepage_path'),
    # path('/homepage/', homepage, name='homepage_path'),
    
    path('bookslist/',     BooksList.as_view(), name='booklist_path'),
    path('bookadd/',       Book_Add.as_view(), name='bookadd_path'),

    # path('api/v1/auth/', include('rest_framework.urls')),
    path('api/v1/auth/',   include('djoser.urls')),
    path('api/v1/auth/',   include('djoser.urls.authtoken')),
    path('api/v1/auth/authenticate/', CustomObtainAuthToken.as_view()),
    path('api/v1/profile', UserProfileView.as_view()),

    path('api/v1/',        include(router.urls)),   
    path('api/v1/age/',    Age_rangeApi.as_view()),
    path('api/v1/ggl/<str:id>', BookByGglId.as_view()),

    # path('api/v1/',     include(routerLbr.urls)),
    path('api/v1/library/list', LibraryListAPI.as_view())
    # path('bookadd/',       Book_Add.as_view(), name='bookadd_path'),

]
