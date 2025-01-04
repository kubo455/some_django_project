from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Book(models.Model):
    title = models.CharField(max_length=64)
    author = models.CharField(max_length=64)
    publication_date = models.DateField()
    decription = models.TextField()
    cover_image = models.ImageField()
    genre = models.CharField(max_length=64)

class ReadingProgress(models.Model):
    pass

class Review(models.Model):
    pass

class Genre(models.Model):
    pass