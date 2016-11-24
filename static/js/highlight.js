$(document).ready(function() {

    // handle highlights in url
    // var hl = getQueryList().hl;
    // if (hl) {
    //     for (var i = 0; i < hl.length; i++) {
    //         console.log(document.getElementById(hl[i][0]).childNodes[1].firstChild);
    //         var range = document.createRange(
    //             document.getElementById(hl[i][0]).childNodes[1].firstChild, // start text node
    //             hl[i][1], // start offset
    //             document.getElementById(hl[i][2]).childNodes[1].firstChild, // end text node
    //             hl[i][3] // end offset
    //         );
    //         highlight(range);
    //     }
    // }

    // handle user highlighting
    $('.esv-text').mouseup(function() {
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        console.log(range);
        var hl = []
        highlight(range)
        // hl.push([
        //     range.startContainer.parentElement.parentElement.id,
        //     range.startOffset,
        //     range.endContainer.parentElement.id,
        //     range.endOffset
        // ]);
        // var id = range.startContainer.parentElement.parentElement.id;
        // console.log(document.getElementById(id).childNodes[1].firstChild);
        // console.log(hl);
        // window.location.replace(window.location.href + '?hl=' + JSON.stringify(hl))
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

function highlight(range) {
    var node = document.createElement('span');
    node.className = 'highlight';
    node.appendChild(range.extractContents());
    range.insertNode(node);
}
