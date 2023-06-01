from .models import Author, Books, Age_range, Library, RentsBook
from django.contrib import admin

# Register your models here.
admin.site.register(Books)
admin.site.register(Author)
admin.site.register(Age_range)
admin.site.register(Library)
admin.site.register(RentsBook)