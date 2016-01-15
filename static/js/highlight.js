$(document).ready(function() {

    // handle highlights in url
    var hl = getQueryList().hl;
    var v, s, e;
    for (var i = 0; i < hl.length; i++) {
        v = hl[i].split(':')[0];
        s = hl[i].split(':')[1].split('-')[0];
        e = hl[i].split(':')[1].split('-')[1];
        console.log(v, s, e);
    }

    // handle user highlighting
    $('.esv-text').mouseup(function() {
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        var node = document.createElement('span');
        node.className = 'highlight';
        range.surroundContents(node)
        // if (sel.toString() != '') {
        //     // something is highlighted
        //     console.log(range.startContainer, range.startOffset, range.endOffset);
        //     highlight(range.startContainer.parentNode.parentNode.id, range.endContainer.parentNode.parentNode.id, range.startOffset, range.endOffset);
        //     document.getSelection().empty();
        // } else {
        //     // nothing selected, clear all highlights
        //     console.log($('.highlight').children()[0]);
        // }
    })
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

function highlight(startId, endId, start, end) {
    var verse, vs, ve
    if (startId != endId) {
        vs = $('#' + startId).children('.verse-text').html();
        vs = vs.slice(0, start) + '<span class="highlight">' + vs.slice(start) + '</span>';
        console.log(vs);
        $('#' + startId).children('.verse-text').html(vs);

        for (var i = Number(startId) + 1; i < endId; i++) {
            verse = $('#' + i).children('.verse-text').html();
            verse = '<span class="highlight">' + verse + '</span>'
            console.log(verse);
            $('#' + i).children('.verse-text').html(verse);
        }

        ve = $('#' + endId).children('.verse-text').html();
        ve = '<span class="highlight">' + ve.slice(0, end) + '</span>' + ve.slice(end);
        $('#' + endId).children('.verse-text').html(ve);
        console.log(ve);
    } else {
        vs = $('#' + startId).children('.verse-text').html();
        vs = vs.slice(0, start) + '<span class="highlight">' + vs.slice(start, end) + '</span>' + vs.slice(end);
        console.log(vs);
        $('#' + startId).children('.verse-text').html(vs);
    }



    // txt = verse.html();
    // before = txt.slice(0, start);
    // if (end > txt.length) {
    //     end = txt.length;
    //     after = '';
    // } else {
    //     after = txt.slice(end);
    // }
    // hl = txt.slice(start, end);
    //
    // verse.html(before + '<span class="highlight">' + hl + '</span>' + after);
}
