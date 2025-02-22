document.addEventListener('DOMContentLoaded', function() {

    searchView(document.querySelector("#book-id").value);

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


function searchView(bookId) {
    console.log(bookId);

    fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        const author = data.volumeInfo.authors?.[0] || '';
        const title = data.volumeInfo.title;
        const pages = data.volumeInfo.pageCount;
        const cover_image = data.volumeInfo.imageLinks?.thumbnail || '...';
        const description = data.volumeInfo?.description || 'No description';
        const categories = data.volumeInfo.categories?.[0] || "";

        console.log(description);


        const element = document.createElement('div');
        element.classList.add('p-0', 'container');
        element.innerHTML = `<div class="row">
                                <div class="col-3">
                                    <img src="${cover_image}" id="cover-image-view" class="img rounded" alt="..." style="height: 250px;">
                                </div>
                                <div class="col d-flex flex-column">
                                    <div>
                                        <h4>${title}</h4>
                                    </div>
                                    <div>
                                        <p>${author}</p>
                                    </div>
                                    <div>
                                        <small class="text-muted">${categories}</small>
                                    </div>
                                    <div class="mt-auto d-flex justify-content-between align-items-end">
                                        <small>Pages: ${pages}</small>
                                        <button class="btn btn-primary" type="submit" id="add-btn">Add to your books</button>
                                    </div>
                                </div>
                            </div>
                            <div class="row m-0 mt-3" id="book-info">
                                <div class="col px-0">
                                    <div>Description:</div>
                                </div>
                            </div>
                            <div class="row m-0 mt-3">
                                <div class="col px-0">
                                    <div id="book-description">${data.volumeInfo.description}</div>
                                </div>
                            </div>`;

        document.querySelector("#search-view").append(element);

        element.querySelector('button').addEventListener('click', function() {

            console.log('!!!!!!!!!');

            fetch('/add_to_library', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    pages: pages,
                    cover_image: cover_image,
                    description: description,
                }),
                mode: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Proceed only if the response is OK
            })
            .catch(error => {
                console.error('Error:', error);
            });

        })

    })
            
}