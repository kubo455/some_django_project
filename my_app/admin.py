from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Book, ReadingProgress, BookDescription, UserStats

admin.site.register(User, UserAdmin)
admin.site.register(Book)
admin.site.register(ReadingProgress)
admin.site.register(BookDescription)
admin.site.register(UserStats)