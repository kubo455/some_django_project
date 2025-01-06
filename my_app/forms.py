from django.forms import ModelForm, CharField
from my_app.models import Book
from django import forms

class BookForm(ModelForm):
    class Meta:
        model = Book
        # fields = '__all__'
        fields = ['title', 'author', 'genre', 'cover_image']
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "author": forms.TextInput(attrs={"class": "form-control"}),
            "genre": forms.TextInput(attrs={"class": "form-control"}),
        }