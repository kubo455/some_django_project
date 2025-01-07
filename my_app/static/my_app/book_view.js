document.addEventListener('DOMContentLoaded', function() {

    bookView();

})

function bookView() {

    fetch(`/book_view/${book_id}`)
    .then(respone => respone.json())
    .then(data => {
        console.log(data)
    })

}