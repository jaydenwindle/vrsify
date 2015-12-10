var express = require('express');
var request = require('request');
var qs = require('querystring');
var app = express();

app.get('/', function(req, res) {
    res.send("hello world")
});

app.get('/:book/:chapter/:verse', function(req, res) {
    var query = {
        'key': 'IP',
        'passage': req.params.book + ' ' + req.params.chapter + ' ' + req.params.verse,
        'include-footnotes': false,
        'include-short-copyright': false,
        'include-audio-link': false
    }
    var querystring = qs.stringify(query);

    request('http://www.esvapi.org/v2/rest/passageQuery?' + querystring, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('lamp listening at http://%s:%s', host, port);
});
