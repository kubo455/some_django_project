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
            console.log(book);
            var source = book.image;

            if (book.image == '...') {
                source = `https://covers.openlibrary.org/b/id/${book.open_lib_cover}-M.jpg`
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
                                        <p>Pages: !!!!!</p>
                                        <p>Your progress: !!!!!</p>
                                    </div>
                                </div>
                                <div class="row m-0" id="book-info">
                                    <h5 class="m-2">Book info</h5>
                                </div>
                                <div class="row m-0">
                                    <p class="m-2">SHOULD FIRST SCRAPE DATA AND ADD INFO HERE</p>
                                </div>`;

            document.querySelector("#book-view").append(element);
        })

    })
    .catch(error => {
        console.error('Error', error);
    })
}