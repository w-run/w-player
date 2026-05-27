<template>
  <div class="app-root">
    <TitleBar />
    <div class="app-body">
      <div class="player-area">
        <VideoPlayer />
      </div>
      <PlaylistPanel :expanded="store.showPlaylist" @toggle="store.togglePlaylist" />
    </div>
  </div>
</template>

<script setup>
import TitleBar from './components/TitleBar.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import PlaylistPanel from './components/PlaylistPanel.vue'
import { usePlayerStore } from './stores/playerStore'

const store = usePlayerStore()
</script>

<style scoped>
.app-root {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.app-body {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.player-area {
  flex: 1;
  position: relative;
  min-width: 0;
}
</style>