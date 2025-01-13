document.addEventListener('DOMContentLoaded', function() {

    searchBook();

})

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

function searchBook() {
    
    document.querySelector('#search-book').onclick = function() {

        var n = 0;

        fetch(`https://openlibrary.org/search.json?q=${document.querySelector('#title').value}&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data.docs);

            data.docs.forEach(book => {
                const element = document.createElement('div');
                element.classList.add('row', 'border-bottom', 'p-3');
                
                element.innerHTML = `<div>
                                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" id="cover-image-${n}" class="img rounded-start" alt="..." style="width: 60px; height: 90px;">
                                    </div>
                                    <div class="ml-3">
                                        <h6 class="card-title" id="title-${n}" style="font-weight: bold;">${book.title}</h6>
                                        <p class="card-text" id="author-${n}">${book.author_name[0]}</p>
                                        <small class="text-muted" id="pages-${n}">Pages: ${book.number_of_pages_median}</small>
                                    </div>
                                    <div class="col d-flex justify-content-end align-items-end">
                                        <button class="btn btn-primary" id="add-to-library-${n}">Add to books</button>
                                    </div>`;

                document.querySelector("#book-view").append(element);

                // Need to think about it first
                const author = book.author_name;
                const title = book.title;
                const pages = book.number_of_pages_median;
                const cover_image = book.cover_i;

                document.querySelector(`#add-to-library-${n}`).addEventListener('click', function() {

                    fetch('search_book', {
                        method: 'PUT',
                        body: JSON.stringify({
                            title: title,
                            author: author,
                            pages: pages,
                            cover_image: cover_image
                        }),
                        headers: {
                            'Content-type': 'application/json',
                            'X-CSFRToken': csrftoken
                        }
                    })
                    .then(() => {
                        console.log('Added too library');
                    });

                })

                // Increment n
                n ++;

            })
        })
        .catch((error) => {
            console.error('Error:', error)
        });

    }

}

function addToLibrary() {

    document.querySelector("#add-to-library").addEventListener('click', function() {

        console.log('ADDD!!!');

    })

}