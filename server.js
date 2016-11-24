var express = require('express');
var request = require('request');
var qs = require('querystring');
var cheerio = require('cheerio');

// Setting up app
var app = express();
app.set('view engine', 'jade');
app.use(express.static('static'));

var port = process.env.PORT || 8080

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
    // limit request to only one chapter
    if (req.params.chapter.indexOf('-') > -1) {
        req.params.chapter = req.params.chapter.substring(0, req.params.chapter.indexOf('-'));
    }

    if (req.params.verse == undefined) {
        var passage = req.params.book + ' ' + req.params.chapter
    } else {
        var passage = req.params.book + ' ' + req.params.chapter + ':' + req.params.verse
    }
    console.log(passage);
    // build query string
    var query = {
        'key': 'IP',
        'passage': passage,
        'include-footnotes': false,
        'include-short-copyright': false,
        'include-headings': false,
        'include-subheadings': false,
        'include-audio-link': false,
    }
    var querystring = qs.stringify(query);

    console.time('api request');
    request('http://www.esvapi.org/v2/rest/passageQuery?' + querystring, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.timeEnd('api request');
            parsePassage(body, function(data, verses) {
                renderPassage(req, res, data, verses)
            })
        }
    });
});

function parsePassage(data, cb) {
    var verses = {};

    $ = cheerio.load(data);
    console.time('parsing verse');
    // parsing chapter numbers
    $('.chapter-num').each(function(index, value) {
        var num = $(this).text();
        $(this).text(num.substr(num.length - 2));
    });

    // get verse numbers
    var verseNumSpans = $('.chapter-num, .verse-num');
    var vNums = [];
    verseNumSpans.each(function() {
        vNums.push($(this).text().trim());
    });

    // Get passage text
    var text = $('.esv-text').text();
    text = text.replace(/\n\n/gm,"\n"); // replace double newline with single newline
    text = text.replace(/\n/gm,"<br>"); // replace newlines with break tags
    text = text.replace(/\u00a0/g, ' '); // the api returns some weird space characters, so change to normal space

    // for each verse
    for (var i = 0; i < vNums.length; i++) {
        if (i != vNums.length - 1) {
            // all but last verse, handle normally
            verses[vNums[i]] = text.substring(text.indexOf(vNums[i]), text.indexOf(vNums[i + 1]));
        } else {
            // last verse, get text to end
            verses[vNums[i]] = text.substring(text.indexOf(vNums[i]));
        }
        // strip numbers from start of verse text
        verses[vNums[i]] = verses[vNums[i]].substr(String(vNums[i]).length);
        // deal with spaces at start and end of verse
        verses[vNums[i]] = verses[vNums[i]].trim();
        verses[vNums[i]] = verses[vNums[i]] + ' ';
    }


    console.timeEnd('parsing verse');
    cb(data, verses);
}

function renderPassage(req, res, data, verses) {
    bible = data
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
                    bible: verses,
                    img: req.query.img
                });
            } else {
                res.render('verse', {
                    pageTitle: $('h2').text(),
                    bible: verses
                });
            }
        }
    }
    // cb();
}

// TODO: finish implementing custom backgrounds
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
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('lamp listening at http://%s:%s', host, port);
});
