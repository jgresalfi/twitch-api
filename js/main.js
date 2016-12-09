'use strict';

document.addEventListener('DOMContentLoaded', function() {

    //AJAX call to Twitch API
    var streamsUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/',
        channelUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/',
        ajaxUrl = [],
        res,
        twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

    function resRender(data, arr) {
        //This function will handle rendering data/elements to page
        console.log('We\'re in the render function now...');
    }

    //This is the AJAX request
    function getResponse(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                callback(this.response);
            } else { console.log(this.response); }
        }
        xhr.send();
    }

    //This function iterates over user array, compiles URLs
    function userLoop(urlType, arr) {
        arr.forEach(function(el) {
            ajaxUrl.push(urlType + el);
        });
    }

    //Checks to see if stream is online
    function activeStream(data) {
        var parsedData = JSON.parse(data),
            channelUser = Array.from(parsedData._links.channel),
            newUrl = channelUrl + channelUser;
        if (parsedData.stream === null) {
            console.log('Hi there: ' + parsedData._links.channel);
            getResponse(newUrl, resRender);
        }
    }

    function statusCheck() {
        //This will call initial AJAX request and determine user stream status - stream === null
        var checkArr = [];
        userLoop(streamsUrl, twitchUsers);
        ajaxUrl.forEach(function(el) {
            getResponse(el, activeStream);
        })
    }

    //Call some function to set whole thing off...
    statusCheck();

});
