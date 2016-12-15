'use strict';

document.addEventListener('DOMContentLoaded', function() {

    var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

    function resRender(data, arr) {
        //Stream and channel card data to page via HTML templates
        if (data.status === 404) {
            console.log('Huzzah!');
            var noUserTmpl = document.getElementById('channel-template').content.cloneNode(true);
            noUserTmpl.querySelector('.screen-name').innerHTML = '<h5>User Not Found</h5>';
            noUserTmpl.querySelector('.mdl-card__title').style.background = 'url("https://www.dropbox.com/s/4grnp44fu97j8xn/twitch_w1.png?raw=1") no-repeat center / cover';
            document.getElementById('mount-point').appendChild(noUserTmpl);
        } else if (data.stream) {
            var streamTmpl = document.getElementById('stream-template').content.cloneNode(true);

            streamTmpl.querySelector('.screen-name').innerHTML = data.stream.channel.display_name;
            streamTmpl.querySelector('.chan-status').innerHTML = '<h5>Player Status: </h5>' + data.stream.channel.status;
            streamTmpl.querySelector('.stream-link').setAttribute('href', data.stream.channel.url);
            streamTmpl.querySelector('.stream-link').setAttribute('target', '_blank');
            streamTmpl.querySelector('img').setAttribute('src', data.stream.channel.logo);
            streamTmpl.querySelector('.mdl-card__title').style.background = 'url(' + data.stream.channel.profile_banner + ') center / cover';
            document.getElementById('mount-point').appendChild(streamTmpl);
        } else if (!data.stream) {
            var chanTmpl = document.getElementById('channel-template').content.cloneNode(true);

            chanTmpl.querySelector('.screen-name').innerHTML = data.display_name;
            chanTmpl.querySelector('.chan-status').innerHTML = '<h5>Stream offline...</h5>';
            chanTmpl.querySelector('img').setAttribute('src', data.logo);
            chanTmpl.querySelector('.mdl-card__title').style.background = 'url("https://www.dropbox.com/s/4grnp44fu97j8xn/twitch_w1.png?raw=1") no-repeat center / cover';
            document.getElementById('mount-point').appendChild(chanTmpl);
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
