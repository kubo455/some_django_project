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
    genre = models.CharField(max_length=64)
    pages = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.title

class ReadingProgress(models.Model):
    pass

class Review(models.Model):
    pass

class Genre(models.Model):
    pass