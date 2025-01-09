document.addEventListener('DOMContentLoaded', function() {

    bookView();

})

function bookView() {

    const bookId =  document.querySelector("#book-id").value;

    fetch(`/book_view/${bookId}`)
    .then(respone => respone.json())
    .then(data => {
        console.log(data)

        data.forEach(book => {
            const element = document.createElement('div');
            element.classList.add('col');
            element.innerHTML = `<div class="row">
                                    <div class="col-3">
                                        <img src="${book.image}" class="img rounded-start" alt="..." style="height: 250px;">
                                    </div>
                                    <div class="col">
                                        <h4>${book.title}</h4>
                                        <p>${book.author}</p>
                                        <p>${book.genre}</p>
                                    </div>
                                </div>`

            document.querySelector("#book-view").append(element);
        })

    })
    .catch(error => {
        console.error('Error', error);
    })
}