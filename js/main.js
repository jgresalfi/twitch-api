'use strict';

document.addEventListener('DOMContentLoaded', function() {

    var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

    function resRender(data, arr) {
        //Stream and channel card data to page via HTML templates
        if (data.status === 404) {
            var noUserTmpl = document.getElementById('channel-template').content.cloneNode(true);
            noUserTmpl.getElementById('chan-status').innerHTML = '<h3>User Not Found</h3>';
            document.body.appendChild(noUserTmpl);
        } else if (data.stream) {
            var streamTmpl = document.getElementById('stream-template').content.cloneNode(true),
                socialShare = streamTmpl.getElementById('share-button');

            streamTmpl.getElementById('screen-name').innerHTML = data.stream.channel.display_name;
            streamTmpl.getElementById('chan-status').innerHTML = data.stream.channel.status;
            streamTmpl.getElementById('stream-link').setAttribute('href', data.stream.channel.url);
            streamTmpl.querySelector('img').setAttribute('src', data.stream.channel.logo);
            streamTmpl.querySelector('.mdl-card__title').style.background = 'url(' + data.stream.channel.profile_banner + ') center / cover';
            document.body.appendChild(streamTmpl);
        } else if (!data.stream) {
            var chanTmpl = document.getElementById('channel-template').content.cloneNode(true),
                socialShare = chanTmpl.getElementById('share-button');

            chanTmpl.getElementById('screen-name').innerHTML = data.display_name;
            chanTmpl.getElementById('chan-status').innerHTML = '<h3>Offline</h3>';
            chanTmpl.querySelector('img').setAttribute('src', data.logo);
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
            } else { console.log('AJAX call error: ' + this.response); }
        }
        xhr.send();
    }

    //This function iterates over user array, compiles URLs
    function userLoop(urlType, arr, combinedArr) {
        arr.forEach(function(el) {
            combinedArr.push(urlType + el);
        });
    }

    //Checks to see if stream is online - if not, extract usernames from stream URL and append to Channel URL for another AJAX call
    function activeStream(data) {
        var channelUser = data._links.channel,
            channelUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/',
            newUrl = [],
            prunedUser = channelUser.substr(channelUser.lastIndexOf('/') + 1);
        newUrl.push(channelUrl + prunedUser);
        if (data.stream !== null) {
            resRender(data);
        } else {
            getResponse(newUrl, resRender);
        }
    }

    function statusCheck() {
        //This will build AJAX URLs via userLoop and iterate over returned URL array calling initial AJAX requests
        var ajaxUrl = [],
            streamsUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/';
        userLoop(streamsUrl, twitchUsers, ajaxUrl);
        ajaxUrl.forEach(function(el) {
            getResponse(el, activeStream);
        })
    }
    statusCheck();
});
