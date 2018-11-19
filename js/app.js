$(document).ready(function () {
    var rootDiv = $('#root');
    AllBooks(rootDiv);
    form();
    //Dodaje dodatkowe informacje o książkach
    rootDiv.on('click', '.book', function () {
        var bookDiv = $(this);
        var detailDiv = bookDiv.find('div');
        var bookId = $(this).data('id');

        $.ajax({
            url: 'http://localhost:8000/book/' + bookId,
            type: 'GET'
        }).done(function (bookDetails) {
            detailDiv.toggle();
            detailDiv.text('Author: ' + bookDetails.author + ', id: ' + bookDetails.id + ', isbn: ' + bookDetails.isbn + ', publisher ' + bookDetails.publisher + ', type' + bookDetails.type);
        }).fail(function (xhr, status, err) {
            console.log(err);
            console.log(xhr);
            console.log(status);
        }).always(function (xhr, status) {
        })


    });
    // usuwa wybraną książkę
    rootDiv.on('click', '.delete-button', function (e) {
        e.stopPropagation();
        var bookId = $(this).parent().data('id');
        $.ajax({
            url: 'http://localhost:8000/book/' + bookId,
            type: 'DELETE'
        }).done(function () {
            AllBooks(rootDiv);
        })
    })

});

//Dodaje nowe książki
function form() {
    var form = $('.new_book');
    var submit = form.find('#add-button');
    submit.on('click', function (e) {
        e.preventDefault();

        var newBook = {};

        newBook.author = $('#author').val();
        newBook.isbn = $('#isbn').val();
        newBook.publisher = $('#publisher').val();
        newBook.title = $('#title').val();
        newBook.type = $('#type').val();

        $.ajax({
            url: 'http://localhost:8000/book/',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(newBook)
        }).done(function () {
            AllBooks($('#root'));
        }).fail(function (xhr, status, err) {
            console.log(err);
            console.log(xhr);
            console.log(status);
        }).always(function (xhr, status) {
        })
    })
}


//Wywołuje wszystkie dostępne książki
function AllBooks(rootElement) {
    rootElement.html('');
    $.ajax({
        url: 'http://localhost:8000/book/',
        type: 'GET'
    }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            var newTag = $('<div class="book" data-id="' + data[i].id + '">' + data[i].title + '<button class="delete-button">Usun</button>' + '<div style=display:none;></div></div>');
            rootElement.append(newTag);
        }
    }).fail(function (xhr, status, err) {
    }).always(function (xhr, status) {
    })
}
