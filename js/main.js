'use strict';

document.addEventListener('DOMContentLoaded', function() {

    var twitchUsers = ["OgamingSC2", "cretetion", "freecodecamp", "storbeck", "ESL_SC2", "habathcx", "brunofin", "RobotCaleb", "noobs2ninjas", "comster404"];

    //This is the render function
    function resRender(data, usr) {
        //Stream, channel, user not found card data to page via HTML templates
        if (data.status === 404 || data.error === 'Not Found') {
            var noUserTmpl = document.getElementById('offline-template').content.cloneNode(true);
            noUserTmpl.querySelector('.screen-name').innerHTML = data.message;
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

    //This is the request function
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

    //This function iterates over user array, compiles URLs for AJAX req
    function userLoop(urlType, arr, combinedArr) {
        arr.forEach(function(el) {
            combinedArr.push(urlType + el);
        });
    }

    //Checks to see if stream is online - if not, extract usernames from stream URL and append to Channel URL for another AJAX call
    function activeStream(data) {
        if (data.stream !== null) {
            resRender(data);
        } else {
            var channelUser = data._links.channel,
                channelUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/',
                newUrl = [],
                prunedUser = channelUser.substr(channelUser.lastIndexOf('/') + 1);
            newUrl.push(channelUrl + prunedUser);
            getResponse(newUrl, resRender);
        }
    }

    //Build AJAX URLs via userLoop, iterate over returned URL array calling initial AJAX requests via getResponse
    function statusCheck(userArr) {
        var ajaxUrl = [],
            streamsUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/';
        userLoop(streamsUrl, userArr, ajaxUrl);
        ajaxUrl.forEach(function(el) {
            getResponse(el, activeStream);
        });
    }

    //User search function
    var searchBar = document.getElementById('searchBar');
    searchBar.onchange = function() {
        var cardContainer = document.getElementById('mount-point'),
            searchArr = [];
        cardContainer.innerHTML = ' ';

        //Parse search input to accept multiple array elements

        searchArr = searchBar.value.split(' ');
        statusCheck(searchArr);
        searchBar.value = searchBar.defaultValue;
    }

    //Searchbar reveal function
    var searchBtn = document.getElementById('search');
    searchBtn.addEventListener('click', function() {
        var searchBar = document.getElementById('searchBar');
        var cardContainer = document.getElementById('mount-point');
        cardContainer.innerHTML = ' ';
        searchBar.classList.toggle('reveal-element');
        //When search field is hidden again, return to default array view
        if (!searchBar.classList.contains('reveal-element')) {
            cardContainer.innerHTML = ' ';
            statusCheck(twitchUsers);
        }
    });

    //Card hiding function
    function cardHide(nodeList) {
        nodeList.forEach(function(item) {
            item.classList.add('hide-element');
        })
    }

    //Card reveal function
    function cardReveal(nodeList) {
        nodeList.forEach(function(item) {
            item.classList.remove('hide-element');
            item.classList.add('filter-margin');
        })
    }

    //Filter feature function
    var filterBtn = document.getElementById('filter'),
        counter = 1; //This is not very functional...mutating the value of this global variable :-(
    filterBtn.addEventListener('click', function() {
        var cards = document.querySelectorAll('.mdl-card'),
            online = document.querySelectorAll('.online'),
            offline = document.querySelectorAll('.offline'),
            notFound = document.querySelectorAll('.not-found');
        console.log(cards);
        cards.forEach(function(item) {
            if (counter === 1) {
                cardHide(offline);
                cardHide(notFound);
            } else if (counter === 2) {
                cardReveal(offline);
                cardHide(online);
            } else if (counter === 3) {
                cardReveal(notFound);
                cardHide(offline);
            } else if (counter === 4) {
                cardReveal(offline);
                cardReveal(online);
                counter = 0;
            }
            console.log(counter);
        })
        counter++;
    });

    //Fire when ready!
    statusCheck(twitchUsers);
});
