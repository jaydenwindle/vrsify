$(document).ready(function() {
    $('#submit').click(function(e){
        e.preventDefault();
        var book = $('select[name=book]').val();
        var chapter = $('input[name=chapter]').val();
        var verse = $('input[name=verse]').val();

        url = '/' + book + '/' + chapter + '/' + verse
        console.log(url);
        window.location.href = url
    });
})
