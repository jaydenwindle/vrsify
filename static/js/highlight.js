$(document).ready(function() {
    
})

function getQueryList(){
    var queryList = {}, query;
    var queries = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    // check to see if there are any queries
    if (queries[0].indexOf('=') != -1) {
        for (var i = 0; i < queries.length; i++) {
            query = queries[i].split('=');
            queryList[query[0]] = JSON.parse(decodeURIComponent(query[1]));
        }
    }
    return queryList;
}

function escapeId(id) {
    id = id.replace(/\./g, '\\.');
    id = id.replace(/\-/g, '\\-');
    return id;
}

function highlight(hl) {
