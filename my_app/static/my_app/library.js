document.addEventListener('DOMContentLoaded', function() {

    books(true, false);

    document.querySelector("#classic-view").onclick = function() {
        books(true, false);
    }

    document.querySelector("#shelf-view").onclick = function() {
        books(false, true);
    }

})

async function books(classic, shelf) {

    try {
        let response = await fetch('/books_view');
        let data = await response.json();

        const current = data.current_books;
        const read = data.read;
        const all = data.all_books;
        const notFinish = data.not_finish;

        // SHOULD PLACE THIS CODE ELSEWHERE !@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (classic === true) {

            classicView(all);
            changeClass('all-books', 'currently-reading', 'not-finish', 'read');
            switchView('classic-view', 'shelf-view');

            document.querySelector("#read").onclick = function() {
                classicView(read);
                changeClass('read', 'currently-reading', 'not-finish', 'all-books');
            }
    
            document.querySelector("#all-books").onclick = function() {
                classicView(all);
                changeClass('all-books', 'currently-reading', 'not-finish', 'read');
            }
    
            document.querySelector("#currently-reading").onclick = function() {
                classicView(current);
                changeClass('currently-reading', 'not-finish', 'all-books', 'read');
            }
    
            document.querySelector("#not-finish").onclick = function() {
                classicView(notFinish);
                changeClass('not-finish', 'read', 'currently-reading', 'all-books');
            }  
        } else if (shelf === true) {

            shelfView(all);
            changeClass('all-books', 'currently-reading', 'not-finish', 'read');
            switchView('shelf-view', 'classic-view');

            document.querySelector("#read").onclick = function() {
                shelfView(read);
                changeClass('read', 'currently-reading', 'not-finish', 'all-books');
            }
    
            document.querySelector("#all-books").onclick = function() {
                shelfView(all);
                changeClass('all-books', 'currently-reading', 'not-finish', 'read');
            }
    
            document.querySelector("#currently-reading").onclick = function() {
                shelfView(current);
                changeClass('currently-reading', 'not-finish', 'all-books', 'read');
            }
    
            document.querySelector("#not-finish").onclick = function() {
                shelfView(notFinish);
                changeClass('not-finish', 'read', 'currently-reading', 'all-books');
            }  
        }


    } catch (error) {
        console.error('Error fetchig data:', error);
    }

}

function classicView(booksData) {

    document.querySelector("#library-view").innerHTML = '';

    if (booksData === undefined) {

        document.querySelector("#library-view").innerHTML = '<p class="mt-3">This list is empty</p>';

    } else {

        booksData.forEach(book => {

            const element = document.createElement('div');
            element.classList.add('row');
            element.id = 'library-books';

            let source = book.image;

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

            element.innerHTML = `<div class="col-lg-1 col-md-3 col-sm-6 me-3 px-0">
                                    <img src="${source}" id="search-cover-image" class="img rounded" alt="..." style="width: 60px; height: 90px;">
                                </div>
                                <div class="col px-0">
                                    <h6 class="card-title" id="title" style="font-weight: bold;">
                                        <a href="/book_overview/${book.book_id}" id="book-link">${book.title}</a>
                                    </h6>
                                    <p id="author"><small style="color: grey;">${book.author}</small></p>
                                </div>`;

            document.querySelector('#library-view').append(element);

            element.querySelector("#search-cover-image").addEventListener('click', function () {
                window.location.href = `/book_overview/${book.book_id}`;
            }); 

        })
    }
}

function shelfView(booksData) {

    document.querySelector("#library-view").innerHTML = '';

    if (booksData === undefined) {

        console.log('!!!!');
        document.querySelector("#library-view").innerHTML = '<p class="mt-3">This list is empty</p>';

    } else {

        booksData.forEach(book => {

            const element = document.createElement('img');

            let source = book.image;

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

            document.querySelector("#library-view").append(element);

        })
    }
}

function changeClass(id, id1, id2, id3) {

    let element = document.querySelector(`#${id}`);
    let element1 = document.querySelector(`#${id1}`);
    let element2 = document.querySelector(`#${id2}`);
    let element3 = document.querySelector(`#${id3}`)

    element.classList.replace('custom-btn', 'link-active');
    element1.classList.replace('link-active', 'custom-btn');
    element2.classList.replace('link-active', 'custom-btn');
    element3.classList.replace('link-active', 'custom-btn');

}

function switchView(view, view1) {

    let element = document.querySelector(`#${view}`);
    let element1 = document.querySelector(`#${view1}`);

    element.classList.replace('custom-btn', 'link-active');
    element1.classList.replace('link-active', 'custom-btn');

}

// Have to change that user can change the view
