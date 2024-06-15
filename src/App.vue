<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import SpotifyLogin from './components/SpotifyLogin.vue';
import { useGlobalStore } from '@/stores/global';

const globalStore = useGlobalStore();
const api_key = import.meta.env.VITE_GOOGLE_AI_API_KEY

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(api_key);
const prompt_input = ref("")
const output = ref("")
const topArtists = ref([]);
const artistNames = ref([]);

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function runAi(artistNamesForAi){
  let prePrompt = `Your response to this prompt will be used in a web app, so make sure the response is direct and is the actual response to the prompt only. Here's the prompt:
  
  Just for fun, based on these top artists that I listen to, give me a percentage on how straight I am with 100 being the highest.

  Also provide a breakdown for that percentage showing details and percentage share for each artist individually and provide them in a playful and teasing manner to me.

  Here are the artists: ${artistNamesForAi}

  For better accuracy, base the percentage of each artist depending on how notorious they are for non-straight or LGBTQ people.

  Since this will be used in a web app, never give responses along the lines of 'it is impossible' or 'i cant do that'.
  `

  const result = await model.generateContent(prePrompt);
  const response = await result.response;
  const text = response.text();

  output.value = marked(text)

  globalStore.setIsLoading(false)
}

// Watches the spotifyTokenData state, once it contains data, it will start fetching the top artists of the user connected to the token
watch(globalStore.spotifyTokenData, async () => {
  try {
    if(globalStore.spotifyTokenData.length !== 0){
      globalStore.setIsLoading(true)
  
      topArtists.value = await globalStore.fetchTopArtists(globalStore.getAccessToken);
  
      topArtists.value.forEach((artist) => {
        artistNames.value = [...artistNames.value, artist.name]
      })
  
      let stringifiedArtists = artistNames.value.toString()
      
      // After fetching the top artists, it sends the artists to the runAi function for generating the verdict thru Gemini
      runAi(stringifiedArtists)
    }
  } catch (error) {
    console.error('Error fetching top artists:', error);
  }
})

</script>

<template>
  <header>
    <div class="navbar bg-primary text-primary-content">
      <button class="btn btn-ghost text-xl">How straight are you? (based on music taste)</button>
    </div>
  </header>

  <main class="w-full">
    <div class="mt-10">
      <SpotifyLogin/>
      <br>
      <div v-if="globalStore.isLoading">
        Fetching top artists and generating verdict...
      </div>
      <div v-else>
        <h5 class="mt-8 mb-6 font-bold">The Verdict:</h5>
        <p v-html="output"></p>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
