<!-- src/components/Callback.vue -->
<template>
    <div>
        <p>Loading...</p>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { getSpotifyToken } from '@/services/spotifyService';
    import { useGlobalStore } from '@/stores/global'

    const global = useGlobalStore()

    const handleSpotifyCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const tokenData = await getSpotifyToken(code);

                // Put token data in global store (Pinia state management)
                global.$patch({ spotifyTokenData: tokenData })

                
            } catch (error) {
                console.error('Error fetching Spotify token:', error);
            }
        }
    };

    onMounted(() => {
        handleSpotifyCallback();
    });
</script>
