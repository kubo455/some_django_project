from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Book(models.Model):
    title = models.CharField(max_length=64)
    author = models.CharField(max_length=64)
    # publication_date = models.DateField()
    # decription = models.TextField(default=False)
    cover_image = models.ImageField(default=None, blank=True, null=True, upload_to="media/")
    open_lib_cover = models.IntegerField(blank=True, null=True)
    google_books_cover = models.URLField(blank=True, null=True)
    genre = models.CharField(max_length=64)
    pages = models.IntegerField(blank=True, null=True)
    edition_key = models.CharField(blank=True, null=True, max_length=64)
    currently_reading = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class ReadingProgress(models.Model):
    book_title = models.ForeignKey(Book, on_delete=models.CASCADE, blank=True, null=True)
    pages_total = models.IntegerField(blank=True, null=True)
    progress = models.IntegerField(blank=True, null=True)
    book_read = models.BooleanField(default=False)

    def __str__(self):
        return self.book_title.title

class BookDescription(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, blank=True)
    description = models.TextField()

    def __str__(self):
        return f"{self.book.title} {self.description}"

class Review(models.Model):
    pass

class Genre(models.Model):
    pass