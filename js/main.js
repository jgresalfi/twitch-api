'use strict';

document.addEventListener('DOMContentLoaded', function() {

	//AJAX call to Twitch API
	var twitchUrl = 'http://wind-bow.gomix.me/twitch-api/streams/ESL_SC2';

	function resRender(data) {
		console.log(data)
	}

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
	} //End getResponse

	getResponse(twitchUrl, resRender);

});