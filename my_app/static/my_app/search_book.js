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

        document.querySelector("#book-view").innerHTML = '';
        var n = 0;

        // USE THIS ONE TO LOOK FOR BOOK INFO !!!!!!!!!!!!!!!!!!!!!

        fetch(`https://openlibrary.org/search.json?q=${document.querySelector('#title').value}&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data.docs);

            data.docs.forEach(book => {
                const element = document.createElement('div');
                element.classList.add('row');
                element.id = 'search-view';
                
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
                const author = book.author_name[0];
                const title = book.title;
                const pages = book.number_of_pages_median;
                const cover_image = book.cover_i;
                const edition_key = book.cover_edition_key;
                // const edition_key = book.edition_key[0];
                console.log(book.cover_edition_key);

                document.querySelector(`#add-to-library-${n}`).addEventListener('click', function() {

                    fetch('search_book', {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({
                            title: title,
                            author: author,
                            pages: pages,
                            cover_image: cover_image,
                            edition_key: edition_key,
                        }),
                        mode: 'same-origin'
                    })
                    // Think of changig code!!!
                    .then(response => {
                        if (!response.ok) { 
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // Proceed only if the response is OK
                    })
                    // .then(data => {
                        // console.log('Success:', data)
                    // })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                })

                // Increment n
                n ++;

            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

}

function bookInfo() {

    

}