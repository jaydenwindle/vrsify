$(document).ready(function() {
    $('#submit').click(function(e){
        e.preventDefault();
        var book = $('select[name=book]').val();
        var chapter = $('input[name=chapter]').val();
        var verse = $('input[name=verse]').val();

        url = '/' + book + '/' + chapter + '/' + verse
        console.log(isValidQuery(url));
        if (isValidQuery(url)) {
            window.location.href = url
        } else {
            alert("Sorry, that's not a bible verse.")
        }

        // console.log(url);
        // window.location.href = url
    });
});

function isValidQuery(url) {
    var isValid;
    $.get(url, function(data) {
        if (String(data).indexOf('ERROR:') > -1) {
            // console.log(false);
            isValid = false;
        } else {
            // console.log(true);
            isValid = true;
        }
    });
    return isValid;
}
