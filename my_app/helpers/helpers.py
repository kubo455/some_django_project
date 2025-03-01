import json
from my_app.models import Book, ReadingProgress

def convert_data_to_json(books, flag):
    """Converts my data to JSON."""
    data = []

    for book in books:
        if flag == True:
            book = book.book_title

        if not book.cover_image:
            image = '...'
        else:
            image = book.cover_image.url

        data.append({
            'book_id': book.pk,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'image': image,
            'open_lib_cover': book.open_lib_cover,
            'key': book.edition_key,
            'currently_reading': book.currently_reading,
            'google_books_cover': book.google_books_cover,
        })

    return data