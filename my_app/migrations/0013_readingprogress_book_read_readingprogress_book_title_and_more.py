# Generated by Django 5.1.4 on 2025-01-23 17:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_app', '0012_book_edition_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='readingprogress',
            name='book_read',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='readingprogress',
            name='book_title',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='my_app.book'),
        ),
        migrations.AddField(
            model_name='readingprogress',
            name='pages_total',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='readingprogress',
            name='progress',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
