// var toHighlight =
var q = getQueryList();
var hl = q.hl;

for (var i = 0; i < hl.length; i++) {
    hl[i] = escapeId(hl[i]);
}

var text = $('#' + hl[0]).nextUntil('#' + hl[hl.length - 1]).andSelf().add('#' + hl[hl.length - 1]);

text.each(function(index) {
    if (index < text.length - 1) {
        $(this).text($(this).text() + " ");
    }
});

text.wrapAll('<span class="highlight"></span>');


function getQueryList(){
    var queryList = {}, query;
    var queries = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < queries.length; i++)
    {
        query = queries[i].split('=');
        queryList[query[0]] = JSON.parse(decodeURIComponent(query[1]));
    }
    return queryList;
}

function escapeId(id) {
    id = id.replace(/\./g, '\\.');
    id = id.replace(/\-/g, '\\-');
    return id;
}
