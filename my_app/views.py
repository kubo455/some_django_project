import json
import requests

from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from .forms import BookForm
from django.db.models import Sum

from .models import User, Book, ReadingProgress, BookDescription, UserStats
from my_app.helpers.helpers import convert_data_to_json

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
        # Chesk if the form is valid and save the data from the user
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('/')
    else:
        form = BookForm()

    return render(request, 'my_app/index.html', {"form": form})

def books_view(request):
    # Get the books data and return Json response
    all_books = convert_data_to_json(Book.objects.all(), False)

    # Data for currently_reading books
    current_books = convert_data_to_json(Book.objects.filter(currently_reading=True), False)

    # Data for not finished books and read books
    not_finish = convert_data_to_json(ReadingProgress.objects.filter(user=request.user, book_read=False, 
                                                                     book_title__currently_reading=False), True)
    read = convert_data_to_json(ReadingProgress.objects.filter(user=request.user, book_read=True), True)

    data = {
        'all_books': all_books,
        'current_books': current_books,
        'not_finished': not_finish,
        'read': read
    }

    # I should change this to add not-finished books, read books, and currently reading
    # should only return data I need for only one type

    return JsonResponse(data, safe=False)

def book_overview(request, id):

    return render(request, 'my_app/book_overview.html', {"book_id":id})

def book_view(request, id):
    # data = []
    book_data = []
    progress_data = []

    book = Book.objects.get(pk=id)
    # Get the book data from DB

    if not book.cover_image:
        image = '...'
    else:
        image = book.cover_image.url

    if BookDescription.objects.filter(book=book).exists():
        book_description = BookDescription.objects.get(book=book).description
    else:
        book_description = False

    book_data.append({
        'title': book.title,
        'author': book.author,
        'genre': book.genre,
        'image': image,
        'pages': book.pages,
        'open_lib_cover': book.open_lib_cover,
        'key': book.edition_key,
        'reading': book.currently_reading,
        'description': book_description,
        'google_book_image': book.google_books_cover
    })

    if ReadingProgress.objects.filter(book_title=book).exists():
        # Get how much % is user progress in book
        book_progress = ReadingProgress.objects.get(book_title=book)
        if book_progress.progress == book_progress.pages_total:
            progress_percentage = 100
        else:
            progress_percentage = book_progress.progress / (book_progress.pages_total / 100)


        progress_data.append({
            'pages_total': book_progress.pages_total,
            'progress': book_progress.progress,
            'progress_percentage': int(progress_percentage)
        })
    else:
        progress_data.append({
            'pages_total': book.pages,
            'progress': 0,
            'progress_percentage': 0
        })

    data = {
        'book_data': book_data,
        'progress_data': progress_data
    }

    return JsonResponse(data, safe=False)

def reading(request, id):

    if request.method == 'PUT':
        data = json.loads(request.body)
        btn_value = data.get('btn_value')
        print(btn_value)

        book = Book.objects.get(pk=id)
        if btn_value == 'false':
            book.currently_reading = True
        else:
            book.currently_reading = False
        # book.currently_reading = bool(btn_value)
        book.save()
        
        return JsonResponse({'message': 'Added to currently reading!'}, status=200)
    

def track_progress(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        page_progress = data.get('page_progress')
        bookd_id = data.get('book_id')
        pages_total = data.get('pages_total')
        print(page_progress, bookd_id, pages_total)

        # Check if the user is on last page
        if int(page_progress) == int(pages_total):
            status = True
        else:
            status = False

        # Check if the progress is already added to database if not create one
        check_book = ReadingProgress.objects.filter(book_title=Book.objects.get(pk=int(bookd_id))).exists()
        if not check_book:
            ReadingProgress.objects.create(book_title=Book.objects.get(pk=int(bookd_id)), progress=int(page_progress), pages_total=pages_total, book_read=status)
        else:
            book = ReadingProgress.objects.get(book_title=Book.objects.get(pk=int(bookd_id)))
            book.progress = int(page_progress)
            book.book_read = status
            book.save()

        update_stats = UserStats.objects.get(user=request.user)
        update_stats.total_books = ReadingProgress.objects.filter(book_read=True).count()
        update_stats.total_pages = ReadingProgress.objects.aggregate(Sum('progress'))['progress__sum'] or 0
        update_stats.save()
        
        return JsonResponse({'message': 'Successfully added to the progress!'}, status=200)


# Open Library API
# def search_book(request):
#     if request.method == 'PUT':
#         data = json.loads(request.body)
#         title = data.get('title')
#         author = data.get('author')
#         pages = data.get('pages')
#         cover_image = data.get('cover_image')
#         edition_key = data.get('edition_key')

#         # Check if there are number of pages provided if not set it to 0
#         if pages == None:
#             pages = 0

#         add_to_library = Book.objects.create(
#                 title=title, 
#                 author=author, 
#                 genre='Have to add', 
#                 pages=int(pages), 
#                 open_lib_cover=cover_image, 
#                 edition_key=edition_key
#             )
            
#         add_to_library.save()

#         # Should repair this line !!!
#         # return render(request, 'my_app/index.html')
#         return JsonResponse({'message': 'Added to books!!'}, status=200)
    

#     return render(request, 'my_app/search_book.html')

# Google Books API
def search_book(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        title = data.get('title')
        author = data.get('author')
        pages = data.get('pages')
        cover_image = data.get('cover_image')
        # edition_key = data.get('edition_key')

        # Check if there are number of pages provided if not set it to 0
        if pages == None:
            pages = 0

        add_to_library = Book.objects.create(
                title=title, 
                author=author, 
                genre='Have to add', 
                pages=int(pages), 
                google_books_cover=cover_image,
                # open_lib_cover=cover_image, 
                # edition_key=edition_key
            )
            
        add_to_library.save()

        # Should repair this line !!!
        return JsonResponse({'message': 'Added to books!!'}, status=200)
    
    return render(request, 'my_app/search_book.html')

def search_view(request, book_id):

    return render(request, 'my_app/search_view.html', {'book_id': book_id})

def search_term(request, term):
    url = f'https://www.googleapis.com/books/v1/volumes?q={term}+intitle'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data, safe=False) # safe=False allows returning a list
    else:
        return JsonResponse({'erro': 'Failed to fetch data'}, status=response.status_code)

def add_to_library(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        title = data.get('title')
        author = data.get('author')
        pages = data.get('pages')
        cover_image = data.get('cover_image')
        description = data.get('description')

        # Check if there are number of pages provided if not set it to 0
        if pages == None:
            pages = 0

        add_to_library = Book.objects.create(
                title=title, 
                author=author, 
                genre='Have to add', 
                pages=int(pages), 
                google_books_cover=cover_image,
                # open_lib_cover=cover_image, 
                # edition_key=edition_key
            )
            
        add_to_library.save()

        print(description)

        book_description = BookDescription.objects.create(
            book=Book.objects.get(id=add_to_library.id),
            description=description
        )

        book_description.save()

        return JsonResponse({'message': 'Added to books!!'}, status=200)

def user_stats(request):

    # books_read = ReadingProgress.objects.filter(book_read=True).count()
    # pages_progress = ReadingProgress.objects.aggregate(Sum('progress'))['progress__sum'] or 0

    if not UserStats.objects.filter(user=request.user).exists():
        UserStats.objects.create(user=request.user, total_books=ReadingProgress.objects.filter(book_read=True).count(), 
                                 total_pages=ReadingProgress.objects.aggregate(Sum('progress'))['progress__sum'] or 0)

    data = UserStats.objects.get(user=request.user)
    user_data = {
        'total_pages': data.total_pages,
        'total_books': data.total_books
    }

    return JsonResponse(user_data, safe=False)

def user_library(request):

    return render(request, 'my_app/library.html')