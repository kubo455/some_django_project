document.addEventListener('DOMContentLoaded', function() {

    document.querySelector("#book-view").style.display = 'none'; 
    searchBook();
})

function searchBook() {
    
    document.querySelector('#search-book').onclick = function() {
        document.querySelector("#book-view").style.display = 'block'; 

        fetch(`https://openlibrary.org/search.json?q=${document.querySelector('#title').value}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.docs);

            data.docs.forEach(book => {
                const element = document.createElement('div');
                element.classList.add('row', 'border', 'rounded', 'py-3');

                element.innerHTML = `<div class="col">
                                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" class="img rounded-start" alt="..." style="width: 125px; height: auto;">
                                    </div>
                                    <div class="col">
                                        <h5 class="card-title">${book.title}</h5>
                                        <p class="card-text">${book.author_name[0]}</p>
                                    </div>`;

                document.querySelector("#book-view").append(element);
            })
        })
        .catch((error) => {
            console.error('Error:', error)
        });

    }

}

// <div class="card mb-3" style="width: inherit;">
//                                         <div class="row g-0">
//                                             <div class="col-md-4">
//                                                 <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" class="img rounded-start" alt="..." style="width: 125px; height: auto;">
//                                             </div>
//                                             <div class="col-md-8">
//                                                 <div class="card-body">
//                                                     <h5 class="card-title">${book.title}</h5>
//                                                     <p class="card-text">${book.author_name[0]}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>`