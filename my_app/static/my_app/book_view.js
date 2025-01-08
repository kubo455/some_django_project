document.addEventListener('DOMContentLoaded', function() {

    bookView();

})

function bookView() {

    const bookId = book_id;

    fetch(`/book_view/${bookId}`)
    .then(respone => respone.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.error('Error', error);
    })
}