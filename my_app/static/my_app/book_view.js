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
            element.classList.add('col', 'p-3');
            element.innerHTML = `<div class="row mb-5 border">
                                    <div class="col-3">
                                        <img src="${book.image}" class="img rounded border" alt="..." style="height: 250px;">
                                    </div>
                                    <div class="col-3">
                                        <h4>${book.title}</h4>
                                        <p>${book.author}</p>
                                        <p>${book.genre}</p>
                                    </div>
                                    <div class="col">
                                        <p>Pages: !!!!!</p>
                                        <p>Your progress: !!!!!</p>
                                    </div>
                                </div>
                                <div class="row border-bottom">
                                    <h5 class="m-2">Book info</h5>
                                </div>
                                <div class="row">
                                        <p class="m-2">SHOULD FIRST SCRAPE DATA AND ADD INFO HERE</p>
                                </div>`;

            document.querySelector("#book-view").append(element);
        })

    })
    .catch(error => {
        console.error('Error', error);
    })
}