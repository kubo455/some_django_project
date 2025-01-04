import json

from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from .forms import BookForm

from .models import User

def index(request):
    # My home page
    form = BookForm()

    if request.user.is_authenticated:
        return render(request, 'my_app/index.html', {'form': form})
        
    return render(request, 'my_app/login.html')

def login_view(request):
    if request.user.is_authenticated:
        return render(request, 'my_app/index.html')
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        # Check if the password or username is right
        else:
            return render(request, 'my_app/login.html', {'message':  'Invalid username or password'})

    return render(request, 'my_app/login.html')

def register_view(request):
    if request.user.is_authenticated:    
        return render(request, 'my_app/index.html')
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        password_conf = request.POST['password-confirmation']
        if password != password_conf:
            return render(request, 'my_app/register.html', {'message': 'Passwords do not match'})
        else:
            # Check if the username exits
            check_new_user = User.objects.filter(username=username).exists()
            if check_new_user:
                return render(request, 'my_app/register.html', {'message': 'User with this name already exist'})
            else:
                new_user = User.objects.create(username=username)
                new_user.set_password(password)
                new_user.save()
                login(request, new_user)
                return HttpResponseRedirect(reverse('index'))

    return render(request, 'my_app/register.html')

def logout_view(request):
    logout(request)
    return render(request, "my_app/login.html")

def add_book(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        title = data_json.get('title')
        author = data_json.get('author')
        genre = data_json.get('genre')
        print(title)

        return JsonResponse({"message": "Succesfully added book"}, status=200)


    data = []

    return JsonResponse(data, safe=False)