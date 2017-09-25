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
	},

	search(term) {
		fetch('https://api.spotify.com/v1/search?type=track&q=' + term, 
			{
  				headers: {Authorization: 'Bearer ' + accessToken}
			}).then(response => {
				if (response.ok) {
				return response.json();
				}
			}).then(jsonResponse => {
				if (!jsonResponse.tracks) {
					return [];
				} else {
					return jsonResponse.tracks.items.map(track => ({
						id: track.id,
						name: track.name,
						artist: track.artists[0].name,
						album: track.album.name,
						uri: track.uri
					}));
				}
			});
	},

	savePlaylist(name, trackUris) {
		if(!name || trackUris === 0) {
			return;
		}

		const accessToken = this.getAccessToken;
		const headers = {Authorization: 'Bearer ' + accessToken};
		let userId;

		fetch('https://api.spotify.com/v1/me', 
			{headers: headers}).then(response => {
				if(response.ok) {
					return response.json();
				}
			}).then(jsonResponse => {
				userId = jsonResponse.id;

				fetch('/v1/users/'+ userId + '/playlists', {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({name: name})
				}).then(response => {
					if(response.ok) {
						return response.json();
					}
				}).then(jsonResponse => {
					let playlistID = jsonResponse.id;
					fetch('/v1/users/' + userId + '/playlists/' + playlistID + '/tracks', {
						headers: headers,
						method: 'POST',
						body: JSON.stringify({uri: trackUris})
					}).then(response => {
						if (response.ok) {
							return response.json();
						}
					}).then(jsonResponse => {
						return jsonResponse;
					})

				});
			});
	}

}



export default Spotify;