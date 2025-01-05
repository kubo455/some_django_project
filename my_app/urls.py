from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'), 
    path('logout/', views.logout_view, name='logout'),

    # API
    path('add_book', views.add_book, name='add_book'),
    path('books_view', views.books_view, name='books_view')
]