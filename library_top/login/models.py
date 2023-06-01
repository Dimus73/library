from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.ImageField()
    addres = models.CharField(max_length=50, blank=True, null=True)
    def __str__(self) -> str:
        return f'{self.user.username}'
