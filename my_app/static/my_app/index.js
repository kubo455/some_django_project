document.addEventListener('DOMContentLoaded', function() {

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
        document.querySelector("#add-book-form").style.display = 'block';        
        document.querySelector("#add-button").style.display = 'none';

        document.querySelector("#add-book-form").onsubmit = function(e) {
            e.preventDefault()

            const title = document.querySelector("#title").value;
            const author = document.querySelector("#author").value;
            const genre = document.querySelector("#genre").value;
            console.log(title);

            fetch('/add_book', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    author: author,
                    genre: genre
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
            })
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    alert("Book added! ")
                } else {
                    console.log('ERROR');
                }
            })
            .catch(error => {
                console.error('Error', error.message);
            })
        }                               
    })
}