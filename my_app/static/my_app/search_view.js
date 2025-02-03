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

        const element = document.createElement('div');
        element.classList.add('p-0');
        element.innerHTML = `<div class="row mb-5 p-1">
                                    <div class="col-3">
                                        <img src="${data.volumeInfo.imageLinks.thumbnail}" id="cover-image-view" class="img rounded" alt="..." style="height: 250px;">
                                    </div>
                                    <div class="col-3">
                                        <h4>${data.volumeInfo.title}</h4>
                                        <p>${data.volumeInfo.authors[0]}</p>
                                        <p>${data.volumeInfo.categories[0]}</p>
                                    </div>
                                    <div class="col">
                                        <p>Pages: ${data.volumeInfo.pageCount}</p>
                                    </div>
                                </div>
                                <div class="row m-0" id="book-info">
                                    <h5 class="m-2">Description:</h5>
                                </div>
                                <div class="row m-0">
                                    <p class="m-2" id="book-description">${data.volumeInfo.description}</p>
                                </div>`;

        document.querySelector("#search-view").append(element);


    })
            
}