document.addEventListener('DOMContentLoaded', function() {

    // For pop over using Boostrap
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    booksView();
    addBook();

});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function addBook() {
    const addBookForm = document.querySelector("#add-book-form").style.display = 'none'; 

    document.querySelector("#add-book").addEventListener('click', () => {

        document.querySelector("#books-view").style.display = 'none'; 
        document.querySelector("#add-book-form").style.display = 'block';        
        document.querySelector("#add-button").style.display = 'none';

    })
}

// function addBook() {
//     const addBookForm = document.querySelector("#add-book-form").style.display = 'none'; 

//     document.querySelector("#add-book").addEventListener('click', () => {
//         document.querySelector("#books-view").style.display = 'none'; 
//         document.querySelector("#add-book-form").style.display = 'block';        
//         document.querySelector("#add-button").style.display = 'none';

//         document.querySelector("#add-book-form").onsubmit = function(e) {
//             e.preventDefault()

//             const title = document.querySelector("#title").value;
//             const author = document.querySelector("#author").value;
//             const genre = document.querySelector("#genre").value;
//             // const image = document.querySelector("#image").value;
//             // console.log(title);
            
//             // ////////////////////////////////////////////////////
//             const image = document.querySelector("#image").files[0];

//             const formData = new FormData();
//             formData.append('title', title);
//             formData.append('author', author);
//             formData.append('genre', genre);
//             formData.append('image', image);

//             fetch('/add_book', {
//                 method: 'POST',
//                 body: formData,
//                 // body: JSON.stringify({
//                 //     title: title,
//                 //     author: author,
//                 //     genre: genre,
//                 //     image: image
//                 // }),
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': csrftoken
//                 },
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log(response);
//                     alert("Book added! ")
//                 } else {
//                     console.log('ERROR');
//                 }
//             })
//             .then(() => {
//                 booksView();
//             })
//             .catch(error => {
//                 console.error('Error', error.message);
//             })
//         }                               
//     })
// }

function booksView() {

    fetch('/books_view')
    .then(response => response.json())
    .then(data => {
        const allBooks = data.all_books;
        const currentBooks = data.current_books;
        
        allBooks.forEach(book => {
            const element = document.createElement('div');
            // element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');
            element.classList.add('col-sm-12', 'col-md-6', 'col-lg-4', 'rounded', 'mt-3');

            var source = book.image;

            if (book.image == '...') {
                if (book.google_books_cover == "") {
                    source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
                } else {
                    source = book.google_books_cover;
                }
            }

            let bookTitle = book.title;

            if (bookTitle.length >= 30) {
                bookTitle = bookTitle.slice(0, 30) + '...';
            }

            element.innerHTML = `<div class="rounded" id="custom-card">
                                    <div class="row d-flex justify-content-start">
                                        <div class="col col-md-4 d-flex justify-content-start">
                                            <img src="${source}" id="img-all-books" class="img rounded" alt="image">
                                        </div>
                                        <div class="col d-flex justify-content-end align-items-end" id="all-books-info">
                                            <h6 class="card-title mt-3" style="font-weight: 800;">${bookTitle}</>
                                            <p class="card-text"><small class="text-muted">${book.author}</small></p>
                                        </div>
                                    </div>
                                </div>`;

            element.addEventListener('click', function() {
                // This looks like better solution
                window.location.href = `book_overview/${book.book_id}`;
            })

            document.querySelector("#books").append(element);
        })

        currentBooks.forEach(book => {
            const element = document.createElement('img');
    
            var source = book.image;

            if (book.image == '...') {
                if (book.google_books_cover == "") {
                    source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
                } else {
                    source = book.google_books_cover;
                }
            }

            element.classList.add('image-fluid', 'rounded', 'm-1'); // m-1 ADD MARGIN
            element.src = source;
            element.alt = book.title;
            element.style.height = '135px';
            element.style.width = '90px';
            element.id = 'current-books-image';

            element.addEventListener('click', function() {
                window.location.href = `book_overview/${book.book_id}`;
            })

            // Popover
            new bootstrap.Popover(element, {
                content: `${book.title}`,
                placement: "top",
                trigger: "hover"
            });


            document.querySelector("#current-books").append(element);

        })
    })

}