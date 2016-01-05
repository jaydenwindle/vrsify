var express = require('express');
var request = require('request');
var qs = require('querystring');
var cheerio = require('cheerio');

// Setting up app
var app = express();
app.set('view engine', 'jade');
app.use(express.static('static'));

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// Data
var books = [
    'Genesis',         'Exodus',          'Leviticus',     'Numbers',
    'Deuteronomy',     'Joshua',          'Judges',        'Ruth',
    '1 Samuel',        '2 Samuel',        '1 Kings',       '2 Kings',
    '1 Chronicles',    '2 Chronicles',    'Ezra',          'Nehemiah',
    'Esther',          'Job',             'Psalm',         'Proverbs',
    'Ecclesiastes',    'Song of Solomon', 'Isaiah',        'Jeremiah',
    'Lamentations',    'Ezekiel',         'Daniel',        'Hosea',
    'Joel',            'Amos',            'Obadiah',       'Jonah',
    'Micah',           'Nahum',           'Habakkuk',      'Zephaniah',
    'Haggai',          'Zechariah',       'Malachi',       'Matthew',
    'Mark',            'Luke',            'John',          'Acts',
    'Romans',          '1 Corinthians',   '2 Corinthians', 'Galatians',
    'Ephesians',       'Philippians',     'Colossians',    '1 Thessalonians',
    '2 Thessalonians', '1 Timothy',       '2 Timothy',     'Titus',
    'Philemon',        'Hebrews',         'James',         '1 Peter',
    '2 Peter',         '1 John',          '2 John',        '3 John',
    'Jude',            'Revelation'
];

// Routes
app.get('/', function(req, res) {
    res.render('index', {
        pageTitle: 'vrsify',
        booklist: books,
    })
});

app.get('/plans', function(req, res) {
    res.render('plans');
})

app.get('/:book/:chapter/:verse?', function(req, res) {
    console.log(req.protocol + '://' + req.get('host') + req.url);
    if (req.params.verse == undefined) {
        var passage = req.params.book + ' ' + req.params.chapter
    } else {
        var passage = req.params.book + ' ' + req.params.chapter + ':' + req.params.verse
    }
    console.log(passage);
    var query = {
        'key': 'IP',
        'passage': passage,
        'include-footnotes': false,
        'include-short-copyright': false,
        'include-headings': false,
        'include-subheadings': false,
        'include-audio-link': false,
        'include-word-ids': true
    }
    var querystring = qs.stringify(query);

    request('http://www.esvapi.org/v2/rest/passageQuery?' + querystring, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parsing chapter numbers
            $ = cheerio.load(body);
            $('.chapter-num').each(function(index, value) {
                var num = $(this).text();
                $(this).text(num.substr(num.length - 2));
            });

            verses = {};


            // console.log($('p .verse-num'));

            // $('')[0].nextSibling.nodeValue;

            bible = $.html()

            renderVerse(req, res)
        }
    });
});

function renderVerse(req, res, cb) {
    if (bible.indexOf('ERROR') > -1) {
        // verse not found
        if (req.query.validate == 'true') {
            // validate main page form submission
            res.send('false');
        } else {
            // render not found page
            res.render('404', {
                message: "That's not a bible verse."
            });
        }
    } else {
        // verse found, return verse page
        if (req.query.validate == 'true') {
            // validate main page form submission
            res.send('true');
        } else {
            // render verse page
            if (req.query.img != undefined) {
                // img is set, render with image
                res.render('verse', {
                    pageTitle: $('h2').text(),
                    bible: $.html(),
                    img: req.query.img
                });
            } else {
                res.render('verse', {
                    pageTitle: $('h2').text(),
                    bible: $.html()
                });
            }
        }
    }
    // cb();
}

// function getImage(url, callback) {
//     // image handling (dev in progress)
//
//     request({url: url, encoding: null}, function (err, res, body) {
//         if (!err && res.statusCode == 200) {
//             // So as encoding set to null then request body became Buffer object
//             var base64prefix = 'data:' + res.headers['content-type'] + ';base64,';
//             var image = base64prefix + body.toString('base64')
//             // console.log(image);
//             callback(image);
//         }
//     });
// }

// Start app
var server = app.listen(port, ip, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('lamp listening at http://%s:%s', host, port);
});
