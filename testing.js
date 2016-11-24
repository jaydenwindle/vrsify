var parseString = require('xml2js').parseString;
var request = require('request');
var qs = require('querystring');

var query = {
    'key': 'IP',
    'passage': 'Genesis 1',
    'output-format': 'crossway-xml-1.0',
    'include-footnotes': false,
    'include-short-copyright': false,
    'include-headings': false,
    'include-subheadings': false,
    'include-audio-link': false
}
var querystring = qs.stringify(query);

request('http://www.esvapi.org/v2/rest/passageQuery?' + querystring, function(error, response, body) {
    console.log(body);
    // parseString(body, function(err, result) {
    //     console.log(err, result);
    // })
});
