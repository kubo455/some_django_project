# Generated by Django 5.1.4 on 2025-01-05 13:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0004_remove_book_publication_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='cover_image',
        ),
        migrations.RemoveField(
            model_name='book',
            name='decription',
        ),
    ]
