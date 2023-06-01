from django.shortcuts          import redirect
from django.urls               import reverse_lazy
from django.views.generic      import CreateView
from login.forms               import RegisterUserForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.contrib.auth       import logout 


# Create your views here.

class RegisterUser (CreateView):
    form_class = RegisterUserForm 
    template_name = 'login/registry.html'
    success_url = reverse_lazy('homepage_path')


class UserAuthentication(LoginView):
    form_class = AuthenticationForm
    template_name = 'login/login.html'
    # success_url = reverse_lazy('homepage_path')
    # success_url = '/homepage/'

def logout_user (request):
    logout(request)
    return redirect('homepage_path')
