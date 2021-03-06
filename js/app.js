// zadanie 7 - wykorzystanie 1 ajaxa

$(document).ready(function () {
    var rootDiv = $('#root');
    AllBooks(rootDiv);
    form();
    //Dodaje dodatkowe informacje o książkach
    rootDiv.on('click', '.book', function () {
        var bookDiv = $(this);
        var detailDiv = bookDiv.find('div');
        var bookId = $(this).data('id');

        ajaxFunction('http://localhost:8000/book/' + bookId, 'GET', undefined, function (bookDetails) {
            detailDiv.toggle();
            detailDiv.text('Author: ' + bookDetails.author + ', id: ' + bookDetails.id + ', isbn: ' + bookDetails.isbn + ', publisher ' + bookDetails.publisher + ', type' + bookDetails.type);

        })

    });
    // usuwa wybraną książkę
    rootDiv.on('click', '.delete-button', function (e) {
        e.stopPropagation();
        var bookId = $(this).parent().data('id');
        ajaxFunction('http://localhost:8000/book/' + bookId, 'DELETE',undefined, function () {
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


        var author = $('#author').val();
        var isbn = $('#isbn').val();
        var publisher = $('#publisher').val();
        var title = $('#title').val();
        var type = $('#type').val();

        var newBook = {
            isbn: isbn,
            title: title,
            author: author,
            publisher: publisher,
            genre: type,
        };

        ajaxFunction('http://localhost:8000/book/','POST', JSON.stringify(newBook), function () {
            AllBooks($('#root'));
    })})}



//Wywołuje wszystkie dostępne książki
function AllBooks(rootElement) {
    rootElement.html('');
    ajaxFunction('http://localhost:8000/book/','GET',undefined, function(data){
    for (var i = 0; i < data.length; i++) {
        var newTag = $('<div class="book" data-id="' + data[i].id + '">' + data[i].title + '<button class="delete-button">Usun</button>' + '<div style=display:none;></div></div>');
        rootElement.append(newTag);

}})}



function ajaxFunction(url, method, data, handleSuccessFn){
    $.ajax({
      url: url,
      type: method,
      data: data,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).done(handleSuccessFn)
      .fail(function(xhr, status, err){
      console.log("ERR", xhr, status, err);
    })

}

