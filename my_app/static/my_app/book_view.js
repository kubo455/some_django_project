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

        data.forEach(book => {
            console.log(book);
            var source = book.image;

            if (book.image == '...') {
                source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`
            }

            var buttonValue = '';

            if (book.reading === false) {
                buttonValue = 'Add to currently reading';
            } else {
                buttonValue = 'Remove from currently reading';
            }
    
            const element = document.createElement('div');
            element.classList.add('p-0');
            element.innerHTML = `<div class="row mb-5 p-1">
                                    <div class="col-3">
                                        <img src="${source}" id="cover-image-view" class="img rounded" alt="..." style="height: 250px;">
                                    </div>
                                    <div class="col-3">
                                        <h4>${book.title}</h4>
                                        <p>${book.author}</p>
                                        <p>${book.genre}</p>
                                    </div>
                                    <div class="col">
                                        <p>Pages: ${book.pages}</p>
                                        <p>Your progress: !!!!!</p>
                                        <div class="row m-0 py-3" id="progress">
                                            <button class="btn btn-primary" value="${book.reading}" id="add-btn">${buttonValue}</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row ml-1" id="track-progress">
                                    <button class="btn btn-primary mb-3" id="progress-btn">Track progress</button>
                                </div>
                                <div class="progress ml-1" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                    <div class="progress-bar" style="width: 25%">25%</div>
                                </div>
                                <div class="row m-0" id="book-info">
                                    <h5 class="m-2">Book info</h5>
                                </div>
                                <div class="row m-0">
                                    <p class="m-2">Description:</p>
                                    <p class="m-2" id="book-description"></p>
                                </div>`;

            document.querySelector("#book-view").append(element);

            // Fetch data from open open library and get decription
            // !! THIS IS NOT WORKING
            fetch(`https://openlibrary.org/books/${data[0].key}.json`)
            .then(respone => respone.json())
            .then(data => {
                const description = data.description;
                console.log(data.description);

                document.querySelector("#book-description").append(description);
            })

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
            element.querySelector("#progress-btn").onclick = function() {
                document.querySelector("#track-progress").innerHTML = `<div class="col p-0">
                                                                            <input class="form-control" id="progress-page" placeholder="Page">
                                                                        </div>
                                                                        <div class="col">
                                                                            <button class="btn btn-primary" type="submit" id="submit-progress">Submit</button>
                                                                        </div>`;

                // Get input from user on witch page is user and put data to backend                                                                            
                document.querySelector("#submit-progress").onclick = function() {
                    const input_page = element.querySelector('input').value;

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
}