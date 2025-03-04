document.addEventListener('DOMContentLoaded', function() {

    books();

})

async function books() {

    try {
        let response = await fetch('/books_view');
        let data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error fetchig data:', error);
    }

}
