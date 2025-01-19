import json

from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from .forms import BookForm
from .models import Book

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

# def add_book(request):
#     if request.method == 'POST':
#         # data_json = json.loads(request.body)
#         # title = data_json.get('title')
#         # author = data_json.get('author')
#         # genre = data_json.get('genre')
#         # image = data_json.get('image')
#         # title = request.POST.get('title')
#         # author = request.POST.get('author')
#         # genre = request.POST.get('genre')
#         # image = request.FILES.get('image')

#         print(title)

#         # if image:
#             # with open(f'/random_project/media/{image.name}', 'wb+') as destination:
#                 # for chunk in image.chunks():
#                     # destination.write(chunk)

#         # Book.objects.create(title=title, author=author, genre=genre, cover_image=image)

#         return JsonResponse({"message": "Succesfully added book"})

#     return JsonResponse({'error': 'Invalid request'}, status=400)

def add_book(request):
    if request.method == 'POST':
        # Chesk if the form is valid and save the data from the user
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('/')
    else:
        form = BookForm()

    return render(request, 'my_app/index.html', {"form": form})

def books_view(request):
    data = []
    books = Book.objects.all()
    # Get the books data a return Json response
    for book in books:
        if not book.cover_image:
            image = '...'
        else:
            image = book.cover_image.url

        data.append({
            'book_id': book.pk,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'image': image,
            'open_lib_cover': book.open_lib_cover,
            'key': book.edition_key
        })

    return JsonResponse(data, safe=False)

def book_overview(request, id):

    return render(request, 'my_app/book_overview.html', {"book_id":id})

def book_view(request, id):
    data = []
    book = Book.objects.get(pk=id)
    # Get the book data from DB

    if not book.cover_image:
        image = '...'
    else:
        image = book.cover_image.url

    data.append({
        'title': book.title,
        'author': book.author,
        'genre': book.genre,
        'image': image,
        'pages': book.pages,
        'open_lib_cover': book.open_lib_cover,
        'key': book.edition_key
    })

    return JsonResponse(data, safe=False)


def search_book(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        title = data.get('title')
        author = data.get('author')
        pages = data.get('pages')
        cover_image = data.get('cover_image')
        edition_key = data.get('edition_key')

        add_to_library = Book.objects.create(
                title=title, 
                author=author, 
                genre='Have to add', 
                pages=int(pages), 
                open_lib_cover=cover_image, 
                edition_key=edition_key
            )
            
        add_to_library.save()

        return JsonResponse({'message': 'Added to books!!'}, status=200)
    

    return render(request, 'my_app/search_book.html')