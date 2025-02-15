document.addEventListener('DOMContentLoaded', function() {

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    booksView();
    addBook();

});

// const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
// const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

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
            // element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');
            element.classList.add('col-md-4', 'col-lg-3', 'rounded', 'mt-3');

            var source = book.image;

            if (book.image == '...') {
                if (book.google_books_cover == "") {
                    source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
                } else {
                    source = book.google_books_cover;
                }
            }

            let bookTitle = book.title;

            if (bookTitle.length >= 42) {
                bookTitle = bookTitle.slice(0, 42) + '...';
                console.log(bookTitle);
            }

            element.innerHTML = `<div class="px-0 py-0 border rounded" id="custom-card">
                                    <div class="row">
                                        <div class="col-md-6 col-lg-5 d-flex justify-content-center">
                                            <img src="${source}" class="img rounded" alt="image" style="height: 135px; width: inherit;">
                                        </div>
                                        <div class="col mt-2">
                                            <h6 class="card-title">${bookTitle}</>
                                            <p class="card-text"><small class="text-muted">${book.author}</small></p>
                                        </div>
                                    </div>
                                </div>`;
            // element.innerHTML = `<div class="card mb-3" style="width: inherit; height: 167px;">
            //                         <div class="row g-0" style="height: 100%;">
            //                             <div class="col-md-4" style="height: 100%;">
            //                                 <img src="${source}" class="img rounded" alt="..." style="height: 100%; width:100px ;object-fit: cover;">
            //                             </div>
            //                             <div class="col-md-8">
            //                                 <div class="card-body">
            //                                     <h6 class="card-title">${book.title}</h6>
            //                                     <p class="card-text" style="font-size: 15px;">${book.author}</p>
            //                                     <p class="card-text"><small class="text-muted">${book.genre}</small></p>
            //                                 </div>
            //                             </div>
            //                         </div> 
            //                     </div>`;

            element.addEventListener('click', function() {
                // This looks like better solution
                window.location.href = `book_overview/${book.book_id}`;
                // Here can't go back to home page using back button
                // window.location.replace(`book_overview/${book.book_id}`);
            })

            console.log(book.title.length);

            document.querySelector("#books").append(element);
        })

        currentBooks.forEach(book => {
            const element = document.createElement('img');
            // element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');

            // These are classes for custom card view
            // element.classList.add('col-md-4', 'col-lg-3', 'rounded', 'mt-3');

            // Only images
            // element.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'flex-wrap', 'gap-2');
            
            var source = book.image;

            if (book.image == '...') {
                source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`;
            }

            element.classList.add('image-fluid', 'rounded'); // m-1 ADD MARGIN
            element.src = source;
            element.alt = book.title;
            element.style.height = '135px';
            element.style.width = '90px';
            element.id = 'current-books-image';
            // element.dataset.bsToggle = 'popover';
            // element.dataset.bsContent = 'This is popover';
            // element.dataset.bsPlacement = 'top';
            // element.dataset.bsTrigger = 'hover focus';


            // element.innerHTML = `<div class="card mb-3" style="width: inherit; height: 167px;">
            //                         <div class="row g-0" style="height: 100%;">
            //                             <div class="col-md-4" style="height: 100%;">
            //                                 <img src="${source}" class="img rounded" alt="..." style="height: 100%; width:100px ;object-fit: cover;">
            //                             </div>
            //                             <div class="col-md-8">
            //                                 <div class="card-body">
            //                                     <h6 class="card-title">${book.title}</h6>
            //                                     <p class="card-text" style="font-size: 15px;">${book.author}</p>
            //                                     <p class="card-text"><small class="text-muted">${book.genre}</small></p>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>`;

            // element.innerHTML = `<div class="px-0 py-0 border rounded" id="custom-card">
            //                         <div class="row">
            //                             <div class="col-md-6 col-lg-5 d-flex justify-content-center">
            //                                 <img src="${source}" class="img rounded" alt="image" style="height: 135px; width: inherit;">
            //                             </div>
            //                             <div class="col mt-2">
            //                                 <h6 class="card-title">${book.title}</>
            //                                 <p class="card-text"><small class="text-muted">${book.author}</small></p>
            //                             </div>
            //                         </div>
            //                     </div>`;

            // element.innerHTML = `<img src="${source}" class="img-fluid" alt="image" style="height: 135px;">`;

            element.addEventListener('click', function() {
                // This looks like better solution
                window.location.href = `book_overview/${book.book_id}`;
                // Here can't go back to home page using back button
                // window.location.replace(`book_overview/${book.book_id}`);
            })

            // Popover
            new bootstrap.Popover(element, {
                content: `${book.title}`,
                placement: "top",
                trigger: "hover"
            });

            // Should think about this more
            let popover = document.querySelector('.popover');

            if (popover) {
                popover.style.color =  'red';
            }

            document.querySelector("#current-books").append(element);

        })
    })

}


// element.classList.add('col-md-4', 'col-lg-3', 'rounded', 'mt-3');
// element.innerHTML = `<div class="p-3 border rounded">
//                         <div class="row">
//                             <div class="col-md-6 col-lg-4 border text-start">
//                                 <img src="${source}" class="img rounded" alt="image" style="height: 125px;">
//                             </div>
//                             <div class="col border">
//                                 <h6 class="card-title">${book.title}</>
//                                 <p class="card-text" style="font-size: 15px;">${book.author}</p>
//                                 <p class="card-text"><small class="text-muted">${book.genre}</small></p>
//                             </div>
//                         </div>
//                     </div>`;