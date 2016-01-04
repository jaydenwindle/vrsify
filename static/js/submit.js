$(document).ready(function() {
    $('#submit').click(function(e){
        e.preventDefault();
        var book = $('select[name=book]').val();
        var chapter = $('input[name=chapter]').val();
        var verse = $('input[name=verse]').val();
        var url;

        if (chapter == '') {
            chapter = '1';
        }

        if (verse != '') {
            // verse was inputted
            url = '/' + book + '/' + chapter + '/' + verse
        } else {
            // verse not inputted
            url = '/' + book + '/' + chapter
        }

        $.get(url + '?validate=true', function(data) {
            if (data == 'false') {
                alert('Sorry, that\'s not a verse in the bible.')
            } else {
                window.location.href = url;
            }
        });
    });
});
