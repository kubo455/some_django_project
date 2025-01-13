document.addEventListener('DOMContentLoaded', function() {

    // document.querySelector("#book-view").style.display = 'none'; 
    searchBook();
})

function searchBook() {
    
    document.querySelector('#search-book').onclick = function() {
        // document.querySelector("#book-view").style.display = 'block'; 

        fetch(`https://openlibrary.org/search.json?q=${document.querySelector('#title').value}&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data.docs);

            data.docs.forEach(book => {
                const element = document.createElement('div');
                element.classList.add('row', 'border', 'rounded', 'p-3', 'mt-3');
                // element.style.height = '150px';
                
                element.innerHTML = `<div>
                                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" class="img rounded-start" alt="..." style="width: 60px; height: 90px;">
                                    </div>
                                    <div class="ml-3">
                                        <h6 class="card-title" style="font-weight: bold;">${book.title}</h6>
                                        <p class="card-text">${book.author_name[0]}</p>
                                    </div>
                                    <div class="col d-flex justify-content-end align-items-start">
                                        <button class="btn btn-primary">Add to books</button>
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