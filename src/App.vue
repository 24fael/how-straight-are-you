<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

const api_key = import.meta.env.VITE_GOOGLE_AI_API_KEY

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(api_key);
const prompt_input = ref("")
const output = ref("")

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function runAi(){
  let prePrompt = `Your response to this prompt will be used in a web app, so make sure the response is direct and is the actual response to the prompt only. Here's the prompt:
  
  Just for fun, based on these top artists that I listen to, give me a percentage on how straight I am with 100 being the highest.

  Also provide a breakdown for that percentage showing details and percentage share for each artist individually and provide them in a playful and teasing manner to me.

  Here are the artists: ${prompt_input.value}
  `

  const result = await model.generateContent(prePrompt);
  const response = await result.response;
  const text = response.text();

  output.value = marked(text)
}

</script>

<template>
  <header>
    <div class="navbar bg-primary text-primary-content">
      <button class="btn btn-ghost text-xl">How straight are you? (based on music taste)</button>
    </div>
  </header>

  <main class="w-full">
    <p class="mt-10 mx-auto">
      <input type="text" placeholder="Your top artists separated by commas. (e.g.: Drake, SZA, Migos)" v-model="prompt_input" class="input input-bordered w-full max-w-xs">
      <button @click="runAi" class="btn btn-accent ms-3">Ask AI</button>
      <br>
      <h5 class="mt-8 mb-6 font-bold">AI's Response:</h5>
      <p v-html="output"></p>
    </p>
  </main>
</template>

<style scoped>

</style>
