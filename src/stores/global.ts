// src/stores/global.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    spotifyTokenData: {},
    isLoading: false
  }),
  getters: {
    getAccessToken: (state) => state.spotifyTokenData.access_token,
    getRefreshToken: (state) => state.spotifyTokenData.refresh_token,
    getScope: (state) => state.spotifyTokenData.scope,
    getTokenType: (state) => state.spotifyTokenData.token_type,
  },
  actions: {
    async fetchTopArtists(accessToken) {
      if (!accessToken) {
        throw new Error('No access token found');
      }

      try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            limit: 5,
          },
        });
        return response.data.items;
      } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
      }
    },
    setIsLoading(value: boolean){
      this.isLoading = value
    }
  },
});
