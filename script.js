"use strict" ;
$(document).ready(function () {

    var pMain = $('#panel-main');
    var pQuote = $('#panel-quote');
    var pAuthor = $('#panel-author');

    var newQuote = {
        text: '',
        author: '',
        link: ''
    };
    var dur = 200;

    function fadePanels(fadeIn) {
        return $.when(pQuote.fadeTo(dur, +fadeIn), pAuthor.fadeTo(dur, +fadeIn));
    }

    function setPanelsText(text, author) {
        text = text || newQuote.text;
        author = author || newQuote.author;
        pQuote.text(text);
        pAuthor.text(author);
    }

    function getNewHeight() {
        var oldQuote = pQuote.text();
        var oldAuthor = pAuthor.text();

        setPanelsText();
        var res = pQuote.outerHeight() + pAuthor.outerHeight();
        setPanelsText(oldQuote, oldAuthor);

        return res;
    }

    function getNextQuote() {
        var apiUrl = 'http://api.forismatic.com/api/1.0/?';
        var params = $.param({
            method: 'getQuote',
            format: 'jsonp',
            lang: 'en'
        });

        var getUrl = apiUrl + params + '&jsonp=?';

        return $.getJSON(getUrl);
    }

    function next_onClick() {
        getNextQuote()
            .success(function (res) {
                newQuote.link = res.quoteLink;
                newQuote.author = res.quoteAuthor ? res.quoteAuthor.trim() : 'Unknown';
                newQuote.text = res.quoteText.trim();
                changeText();
            })
            .fail(next_onClick);
    }

    function changeText() {
        var newHeight = getNewHeight();
        fadePanels(false)
            .done(function () {
                return pMain.animate({height: newHeight}, dur).promise()
                    .done(function () {
                        setPanelsText();
                        fadePanels(true);
                    });
            });
    }

    function onResize() {
        pMain.height(pQuote.outerHeight() + pAuthor.outerHeight());
    }

    function tweet_onClick() {
        var url = "https://twitter.com/intent/tweet?text=";
        var params = "menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=600,height=300";

        var urlText = newQuote.author + ": " + newQuote.text;
        if(urlText.length > 140) {
            urlText = urlText.slice(0, -(urlText.length - 140 + quoteLink.length + 4)) + '... ' + quoteLink;
        }
        urlText = encodeURIComponent(urlText);

        url += urlText;
        window.open(url, "Twitter", params);
    }

    $('#btn-next').on('click', next_onClick);
    $('#btn-tweet').on('click', tweet_onClick);

    $(window).resize(onResize);
    next_onClick();
});