'use strict';

document.addEventListener('DOMContentLoaded', function() {

    //AJAX call to Twitch API
    var streamsUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/',
        channelUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/',
        ajaxUrl = [],

        twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

    function resRender(data, arr) {

        //HTML card template for rendering data to page - insert logic to choose stream or channel template...

        if (data.stream) {
            var streamTmpl = document.getElementById('stream-template').content.cloneNode(true),
                socialShare = streamTmpl.getElementById('share-button');

            streamTmpl.getElementById('screen-name').innerHTML = data.stream.channel.display_name;
            streamTmpl.getElementById('chan-status').innerHTML = data.stream.channel.status;
            streamTmpl.getElementById('stream-link').setAttribute('href', data.stream.channel.url);
            document.body.appendChild(streamTmpl);
        } else {
            var chanTmpl = document.getElementById('channel-template').content.cloneNode(true),
                socialShare = chanTmpl.getElementById('share-button');

            chanTmpl.getElementById('screen-name').innerHTML = data.display_name;
            chanTmpl.getElementById('chan-status').innerHTML = '<h3>Offline</h3>';
            document.body.appendChild(chanTmpl);
        }
    }

    //This is the AJAX request
    function getResponse(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
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

    //Checks to see if stream is online - if not, extract usernames from stream URL and add to Channel URL for another AJAX call
    function activeStream(data) {
        var parsedData = data,
            channelUser = parsedData._links.channel,
            prunedUser = channelUser.substr(channelUser.lastIndexOf('/') + 1),
            newUrl = [];
        newUrl.push(channelUrl + prunedUser);
        if (parsedData.stream !== null) {
            resRender(parsedData);
        } else {
            getResponse(newUrl, resRender);
        }
    }

    function statusCheck() {
        //This will build AJAX URLs via userLoop and iterate over returned URL array calling initial AJAX requests
        userLoop(streamsUrl, twitchUsers);
        ajaxUrl.forEach(function(el) {
            getResponse(el, activeStream);
        })
    }
    statusCheck();
});
