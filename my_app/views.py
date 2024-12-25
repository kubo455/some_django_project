from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate

# Create your views here.

def index(request):
    print(request.user.is_authenticated)
    if request.user.is_authenticated:
        return render(request, 'my_app/index.html')
        
    return render(request, 'my_app/login.html')

def login_view(request):
    return render(request, 'my_app/login.html')

def reqister_view(request):
    return render(request, 'my_app/register.html')