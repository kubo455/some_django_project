document.addEventListener('DOMContentLoaded', function() {

    addBook();

});

function addBook() {
    document.querySelector("#add-book").addEventListener('click', () => {
        
        const addBookForm = document.querySelector('#add-book-form');
        addBookForm.innerHTML = `<div class="container d-flex justify-content-center">
                                    <div class="col-4 border rounded p-3">
                                        <div class="row p-2">
                                            Title
                                            <input type="text" id="title" class="form-control">
                                        </div>
                                        <div class="row p-2">
                                            Author
                                            <input type="text" id="author" class="form-control">
                                        </div>
                                        <div class="row p-2">
                                            Genre
                                            <input type="text" id="genre" class="form-control">
                                        </div>
                                        <div class="row p-2"> 
                                            <button class="btn btn-primary" id="add-btn" type="submit">Add to books</button>
                                        </div>
                                    </div>
                                </div>`;


        document.querySelector("#add-btn").onclick = function() {
            
            console.log(document.querySelector('#title').value)

            fetch('/add_book', {
                method: 'POST',
                body: JSON.stringify({
                    title: document.querySelector('#title').value,
                    author: document.querySelector('#author').value,
                    genre: document.querySelector('#genre').value
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log("SUCCES");
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