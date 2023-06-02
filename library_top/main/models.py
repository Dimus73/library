from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.

class Books(models.Model):
    title        = models.CharField(max_length=50, blank=False)
    author       = models.CharField(max_length=200, blank=True, null=True) 
    age_range    = models.ForeignKey('Age_range',on_delete=models.PROTECT) 
    img          = models.ImageField(blank=True, null=True)
    googl_id     = models.CharField(max_length=20,blank=True,null=True)
    actual       = models.BooleanField(default=True)
    def __str__ (self):
        return f"{self.title}"

    
class Author(models.Model):
    name        = models.CharField(max_length=50,blank=False)
    actual      = models.BooleanField(default=True)
    def __str__ (self):
        return f"{self.name}"

class Age_range(models.Model):
    range      = models.CharField(max_length=25, blank=False)
    def __str__ (self):
        return f"{self.range}"
    
class Library (models.Model):
    book      = models.ForeignKey(Books, on_delete=models.PROTECT)
    user      = models.ForeignKey(User,on_delete=models.PROTECT)
    def __str__ (self):
        return f"{self.book.title} ovner {self.user.username}"

    
class RentsBook (models.Model):
    rent_user = models.ForeignKey(User,on_delete=models.PROTECT)
    start_date = models.DateField(default=datetime.date.today())
    end_date = models.DateField()