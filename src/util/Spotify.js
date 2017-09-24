const clientId = '777b2331c9a2462a89d156e40ac8277e';
const redirectUri = "http://localhost:3000/";

let accessToken;

let Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}
		const token = window.location.href.match(/access_token=([^&]*)/);
		const expiration = window.location.href.match(/expires_in=([^&]*)/);

		if (token && expiration) {
			accessToken = token;
			const expires = expiration;
			window.setTimeout(() => accessToken = '', expires * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			const accessUrl = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectUri;
			window.location(accessUrl);
		}



	}
};

export default Spotify;