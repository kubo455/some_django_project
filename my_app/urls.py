from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'), 
    path('logout/', views.logout_view, name='logout'),
    path('book_overview/<int:id>', views.book_overview, name='book_overview'),

    # API
    path('add_book', views.add_book, name='add_book'),
    path('books_view', views.books_view, name='books_view'),
    path('book_view/<int:id>', views.book_view, name='book_view'),
    path('search_book', views.search_book, name='search_book')
]