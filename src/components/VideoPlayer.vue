<template>
  <div 
    class="video-player"
    ref="playerContainer"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <video
      ref="videoElement"
      class="video-element"
      :src="store.videoUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @play="handlePlay"
      @pause="handlePause"
      @click="handleVideoClick"
    ></video>

    <div class="big-play-button" v-if="!store.isPlaying" @click="store.togglePlay">
      <svg width="68" height="48" viewBox="0 0 68 48">
        <path class="play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 ,12.21,1.42,27.1,1.55,27.1,1.55s11.79-0.13,17.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path>
        <path d="M 45,24 27,14 27,34" fill="white"></path>
      </svg>
    </div>

    <div 
      class="controls-overlay"
      :class="{ 'controls-visible': store.showControls }"
    >
      <div class="progress-bar-wrapper" @click="handleProgressClick">
        <div class="progress-bar">
          <div class="progress-buffered"></div>
          <div class="progress-played" :style="{ width: store.progress + '%' }"></div>
          <div class="progress-handle" :style="{ left: store.progress + '%' }"></div>
        </div>
      </div>

      <div class="controls-bar">
        <div class="controls-left">
          <button class="control-btn" @click="store.togglePlay">
            <svg v-if="!store.isPlaying" viewBox="0 0 24 24" width="24" height="24">
              <path d="M8 5v14l11-7z" fill="white"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"></path>
            </svg>
          </button>

          <div class="volume-control">
            <button class="control-btn" @click="store.toggleMute">
              <svg v-if="!store.isMuted && store.volume > 0.5" viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="white"></path>
              </svg>
              <svg v-else-if="!store.isMuted && store.volume > 0" viewBox="0 0 24 24" width="24" height="24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" fill="white"></path>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="24" height="24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="white"></path>
              </svg>
            </button>
            <input 
              type="range" 
              class="volume-slider" 
              min="0" 
              max="1" 
              step="0.01"
              :value="store.isMuted ? 0 : store.volume"
              @input="handleVolumeChange"
            >
          </div>

          <span class="time-display">
            {{ formatTime(store.currentTime) }} / {{ formatTime(store.duration) }}
          </span>
        </div>

        <div class="controls-right">
          <button class="control-btn" @click="toggleFullscreen">
            <svg v-if="!store.isFullscreen" viewBox="0 0 24 24" width="24" height="24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="white"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="24" height="24">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="white"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const videoElement = ref(null)
const playerContainer = ref(null)

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function handleTimeUpdate() {
  if (videoElement.value) {
    store.setCurrentTime(videoElement.value.currentTime)
  }
}

function handleLoadedMetadata() {
  if (videoElement.value) {
    store.setDuration(videoElement.value.duration)
  }
}

function handlePlay() {
  store.setPlaying(true)
  store.resetControlsTimer()
}

function handlePause() {
  store.setPlaying(false)
  store.showControlsPermanently()
}

function handleVideoClick() {
  store.togglePlay()
  if (videoElement.value) {
    if (store.isPlaying) {
      videoElement.value.play()
    } else {
      videoElement.value.pause()
    }
  }
}

function handleProgressClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  if (videoElement.value) {
    videoElement.value.currentTime = pos * store.duration
  }
}

function handleVolumeChange(e) {
  const value = parseFloat(e.target.value)
  store.setVolume(value)
  if (videoElement.value) {
    videoElement.value.volume = value
    videoElement.value.muted = store.isMuted
  }
}

function handleMouseMove() {
  store.resetControlsTimer()
}

function handleMouseLeave() {
  if (store.isPlaying) {
    store.resetControlsTimer()
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    playerContainer.value.requestFullscreen()
    store.toggleFullscreen()
  } else {
    document.exitFullscreen()
    store.toggleFullscreen()
  }
}

onMounted(() => {
  const handleKeyDown = (e) => {
    if (!videoElement.value) return
    switch (e.code) {
      case 'Space':
        e.preventDefault()
        handleVideoClick()
        break
      case 'ArrowLeft':
        videoElement.value.currentTime = Math.max(0, videoElement.value.currentTime - 5)
        break
      case 'ArrowRight':
        videoElement.value.currentTime = Math.min(store.duration, videoElement.value.currentTime + 5)
        break
      case 'ArrowUp':
        e.preventDefault()
        store.setVolume(Math.min(1, store.volume + 0.1))
        videoElement.value.volume = store.volume
        break
      case 'ArrowDown':
        e.preventDefault()
        store.setVolume(Math.max(0, store.volume - 0.1))
        videoElement.value.volume = store.volume
        break
      case 'KeyF':
        toggleFullscreen()
        break
      case 'KeyM':
        store.toggleMute()
        videoElement.value.muted = store.isMuted
        break
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.big-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.big-play-button .play-button-bg {
  fill: #212121;
  fill-opacity: 0.8;
}

.big-play-button:hover .play-button-bg {
  fill: #ff0000;
  fill-opacity: 1;
}

.controls-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 20;
}

.controls-visible {
  opacity: 1;
}

.progress-bar-wrapper {
  padding: 8px 0;
  cursor: pointer;
}

.progress-bar {
  position: relative;
  height: 4px;
  margin: 0 12px;
  background-color: rgba(255, 255, 255, 0.2);
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #ff0000;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #ff0000;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.1s;
}

.progress-bar-wrapper:hover .progress-handle {
  opacity: 1;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px 12px;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.volume-control {
  display: flex;
  align-items: center;
}

.volume-slider {
  width: 0;
  opacity: 0;
  transition: width 0.2s, opacity 0.2s;
  cursor: pointer;
}

.volume-control:hover .volume-slider {
  width: 60px;
  opacity: 1;
  margin-left: 4px;
}

.volume-slider {
  -webkit-appearance: none;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.time-display {
  font-size: 13px;
  color: white;
  margin-left: 8px;
  user-select: none;
}
</style>
