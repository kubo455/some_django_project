document.addEventListener('DOMContentLoaded', function() {

    bookView();

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

function bookView() {

    document.querySelector("#book-view").innerHTML = '';
    const bookId =  document.querySelector("#book-id").value;

    fetch(`/book_view/${bookId}`)
    .then(respone => respone.json())
    .then(data => {

        data.book_data.forEach(book => {
            var source = book.image;

            console.log(book.google_book_image);
            if (book.image == '...' && !book.google_book_image) {
                source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`
            } else {
                source = book.google_book_image
            }

            console.log(source);

            var buttonValue = '';

            if (book.reading === false) {
                buttonValue = 'Add to currently reading';
            } else {
                buttonValue = 'Remove from currently reading';
            }
    
            const progressNumber = data.progress_data[0].progress_percentage;

            const element = document.createElement('div');
            element.classList.add('row' ,'px-0');

            element.innerHTML = `<div class="col-lg-4 col-sm-6 px-0 mb-2">
                                    <img src="${source}" id="cover-image-view" class="img rounded" alt="..." style="height: 250px;">
                                </div>
                                <div class="col-lg-4 col-sm-6 px-0 me-2">
                                    <h4>${book.title}</h4>
                                    <p>${book.author}</p>
                                    <p>${book.genre}</p>
                                </div>
                                <div class="col-lg-3 px-0">
                                    <p>Pages: ${book.pages}</p>
                                    <button class="btn btn-primary" value="${book.reading}" id="add-btn">${buttonValue}</button>
                                </div>`;

            const elementDescription = document.createElement('div');
            elementDescription.classList.add('row', 'px-0');

            elementDescription.innerHTML = `<div class="col-12 mt-3 px-0" id="track-progress">
                                                <button class="btn btn-primary mb-3" id="progress-btn">Track progress</button>
                                            </div>
                                            <div class="col-12 px-0" id="progress-bar">
                                                <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="${progressNumber}" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar" style="width: ${progressNumber}%">${progressNumber}%</div>
                                                </div>
                                            </div>
                                            <div class="col-12 px-0" id="book-info">
                                                <h5 class="mt-2">Description:</h5>
                                            </div>
                                            <div class="col mt-2 px-0" id="book-description">
                                            </div>`;



            document.querySelector("#book-view").append(element, elementDescription);

            if (progressNumber === 0) {
                document.querySelector("#progress-bar").style.display = 'none';
            }

            // Fetch data from open open library and get decription
            // !! THIS IS NOT WORKING
            if (book.description == false) {
                fetch(`https://openlibrary.org/books/${data.book_data[0].key}.json`)
                .then(respone => respone.json())
                .then(data => {
                    var description = data.description;
                    if (description == undefined) {
    
                        fetch(`https://openlibrary.org${data.works[0].key}.json`)
                        .then(respone => respone.json())
                        .then(data => {
                            if (typeof(data.description) == "object") {
                                description = data.description.value;
                            } else {
                                description = data.description;
                            }
    
                            if (description == undefined) {
                                description = 'This book does not have decsription. Add one yourself.'
                            }
                            // Open Lib description
                            document.querySelector("#book-description").innerHTML = description;
                        })
                        
                    } else {
                        // No description
                        document.querySelector("#book-description").append(description);
                    }
    
                });
            } else {
                // Google Books description
                document.querySelector("#book-description").innerHTML = book.description;
            }

            console.log(typeof(book.description));

            // Add book to currently readings.
            element.querySelector('button').onclick = function() {

                fetch(`/book_view/${bookId}/reading`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        btn_value: element.querySelector('button').value
                    })
                })
                .then(respone => {
                    if (!respone.ok) {
                        throw new Error(`Http error! Status: ${respone.status}`);
                    }
                    return respone.json();
                })
                .then(() => {
                    bookView();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            }

            // Track progress of book
            elementDescription.querySelector("#progress-btn").onclick = function() {
                document.querySelector("#track-progress").innerHTML = `<div class="col p-0 mb-3">
                                                                            <input class="form-control" id="progress-page" placeholder="Page">
                                                                        </div>
                                                                        <div class="col mb-3">
                                                                            <button class="btn btn-primary" type="submit" id="submit-progress">Submit</button>
                                                                        </div>`;

                // Get input from user on witch page is user and put data to backend                                                                            
                document.querySelector("#submit-progress").onclick = function() {
                    const input_page = elementDescription.querySelector('input').value;

                    if (isNaN(input_page)) {
                        alert('Must provide number!')
                        return false;
                    }

                    fetch('/track_progress', {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json',
                            'X-CSRFToken': csrftoken
                        },
                        body: JSON.stringify({
                            page_progress: input_page,
                            book_id: bookId,
                            pages_total: book.pages
                        })
                    })
                    .then(respone => {
                        if (!respone.ok) {
                            throw new Error(`Http error! Status: ${respone.status}`);
                        }
                        return respone.json()
                    })
                    .then(() => {
                        bookView();
                    })
                    .catch(error => {
                        console.error('Error', error);
                    });

                }
            };

        })

    })
    .catch(error => {
        console.error('Error', error);
    })
};