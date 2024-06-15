// src/services/spotifyService.js
import axios from 'axios';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_CALLBACK_URI; // Your redirect URI
const scopes = 'user-read-private user-read-email user-top-read'; // Requested Spotify scopes

export function getSpotifyAuthUrl() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const responseType = 'code';
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=${responseType}`;
    return authUrl;
}

export async function getSpotifyToken(code) {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const response = await axios.post(tokenEndpoint, new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
    }).toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data;
}
