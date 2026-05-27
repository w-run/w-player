<template>
  <div class="app">
    <VideoPlayer />
  </div>
</template>

<script setup>
import VideoPlayer from './components/VideoPlayer.vue'
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
