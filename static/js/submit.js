$(document).ready(function() {
    $('#submit').click(function(e){
        e.preventDefault();
        var book = $('select[name=book]').val();
        var chapter = $('input[name=chapter]').val();
        var verse = $('input[name=verse]').val();

        url = '/' + book + '/' + chapter + '/' + verse

        $.get(url, function(data) {
            if (String(data).indexOf('ERROR:') > -1) {
                alert("Sorry, that's not a bible verse.");
            } else {
                window.location.href = url;
            }
        });
        
    });
});
