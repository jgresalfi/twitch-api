'use strict';

document.addEventListener('DOMContentLoaded', function() {

	//AJAX call to Twitch API
	var streamsUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/',
	    channelUrl = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/',
	    ajaxUrl = '',
			twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];

	function resRender(data, arr) {
		console.log(data)
		//This function will handle rendering data/elements to page
	}

	//This is the AJAX request
	function getResponse(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				console.log(this.status);
				callback(this.response);
			} else { console.log(this.response); }
		}
	xhr.send();
	}

	//This function iterates over user array, compiles URLs
	function userLoop(urlType, arr) {
		arr.forEach(function(e) {
			ajaxUrl = urlType + e;
			console.log(ajaxUrl)
		});
	}

	function statusCheck(data) {
		if (data.stream === null) {
			userLoop(channelUrl, twitchUsers, resRender);
		}
		else {

		}
	}

	// getResponse(twitchUrl, resRender);
	userLoop(streamsUrl, twitchUsers);
});




