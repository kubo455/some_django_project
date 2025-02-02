document.addEventListener('DOMContentLoaded', function() {

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
        
        console.log(allBooks);

        allBooks.forEach(book => {
            const element = document.createElement('div');
            element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');
            // element.classList.add('card');
            // element.style.width = '15rem';

            var source = book.image;

            if (book.image == '...') {
                if (book.google_books_cover == "") {
                    source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
                } else {
                    source = book.google_books_cover;
                }
            }

            element.innerHTML = `<div class="card mb-3" style="width: inherit; height: 167px;">
                                    <div class="row g-0" style="height: 100%;">
                                        <div class="col-md-4" style="height: 100%;">
                                            <img src="${source}" class="img rounded" alt="..." style="height: 100%; width:100px ;object-fit: cover;">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h6 class="card-title">${book.title}</h6>
                                                <p class="card-text" style="font-size: 15px;">${book.author}</p>
                                                <p class="card-text"><small class="text-muted">${book.genre}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;


                                // <a href="/book_overview/${book.book_id}" class="card-text">${book.book_id}</a>
                                // `<div class="card" style="width: inherit;">
                                //     <img src="${book.image}" class="card-img-top" alt="..." style="width: 120px; height: auto;">
                                //     <div class="card-body">
                                //         ${book.title}<br>
                                //         ${book.author}<br>
                                //         ${book.genre}
                                //     </div>
                                // </div>` 

            element.addEventListener('click', function() {
                // This looks like better solution
                window.location.href = `book_overview/${book.book_id}`;
                // Here can't go back to home page using back button
                // window.location.replace(`book_overview/${book.book_id}`);
            })

            document.querySelector("#books").append(element);
        })

        currentBooks.forEach(book => {
            const element = document.createElement('div');
            element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');

            var source = book.image;

            if (book.image == '...') {
                source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
            }

            element.innerHTML = `<div class="card mb-3" style="width: inherit; height: 167px;">
                                    <div class="row g-0" style="height: 100%;">
                                        <div class="col-md-4" style="height: 100%;">
                                            <img src="${source}" class="img rounded" alt="..." style="height: 100%; width:100px ;object-fit: cover;">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h6 class="card-title">${book.title}</h6>
                                                <p class="card-text" style="font-size: 15px;">${book.author}</p>
                                                <p class="card-text"><small class="text-muted">${book.genre}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

            element.addEventListener('click', function() {
                // This looks like better solution
                window.location.href = `book_overview/${book.book_id}`;
                // Here can't go back to home page using back button
                // window.location.replace(`book_overview/${book.book_id}`);
            })

            document.querySelector("#current-books").append(element);

        })
    })

}

function currentBooksView() {

    

}