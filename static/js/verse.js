$(document).ready(function() {

    function getQuery(){
        var vars = [], query;
        var querystring = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < querystring.length; i++){
            query = querystring[i].split('=');
            vars.push(query[0]);
            vars[query[0]] = query[1];
        }
        return vars;
    }
})
