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
        console.log(data);

        data.forEach(book => {
            const element = document.createElement('div');
            element.classList.add('col-3', 'p-3', 'rounded', 'd-flex');
            // element.classList.add('card');
            // element.style.width = '15rem';

            element.innerHTML = `<div class="card mb-3" style="width: inherit;">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <img src="${book.image}" class="img rounded-start" alt="..." style="height: 165px;">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">${book.title}</h5>
                                                <p class="card-text">${book.author}</p>
                                                <a href="/book_overview/${book.book_id}" class="card-text">${book.book_id}</a>
                                                <p class="card-text"><small class="text-muted">${book.genre}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

                                // `<div class="card" style="width: inherit;">
                                //     <img src="${book.image}" class="card-img-top" alt="..." style="width: 120px; height: auto;">
                                //     <div class="card-body">
                                //         ${book.title}<br>
                                //         ${book.author}<br>
                                //         ${book.genre}
                                //     </div>
                                // </div>`

            // element.addEventListener('click', function() {
                
            // }) 

            document.querySelector("#books").append(element);
        })
    })

}