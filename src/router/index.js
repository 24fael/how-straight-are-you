// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import SpotifyLogin from '@/components/SpotifyLogin.vue';
import Callback from '@/components/Callback.vue'; // Create a callback component if needed

const routes = [
    { path: '/', component: SpotifyLogin },
    { path: '/callback', component: Callback }, // Handle Spotify redirect callback
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
