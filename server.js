var express = require('express');
var request = require('request');
var qs = require('querystring');
var cheerio = require('cheerio');

// Setting up app
var app = express();
app.set('view engine', 'jade');
app.use(express.static('static'));

// Routes
app.get('/', function(req, res) {
    res.send("hello world")
});

app.get('/:book/:chapter/:verse?', function(req, res) {
    var passage = req.params.book + ' ' + req.params.chapter + ':' + req.params.verse
    var query = {
        'key': 'IP',
        'passage': passage,
        'include-footnotes': false,
        'include-short-copyright': false,
        'include-headings': false,
        'include-subheadings': false,
        'include-audio-link': false
    }
    var querystring = qs.stringify(query);

    request('http://www.esvapi.org/v2/rest/passageQuery?' + querystring, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);

            $('.chapter-num').each(function(index, value) {
                var num = $(this).text();
                $(this).text(num.substr(num.length - 2));
            });

            res.render('verse', {pageTitle: $('h2').text(), bible: $.html()})
        }
    });
});

// Start app
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('lamp listening at http://%s:%s', host, port);
});
