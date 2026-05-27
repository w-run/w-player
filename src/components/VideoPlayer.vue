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
      preload="auto"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @loadeddata="handleLoadedData"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleVideoEnded"
      @progress="handleBufferProgress"
      @click="handleVideoClick"
    ></video>

    <div class="big-play-button" v-if="!store.isPlaying" @click="handleBigPlayClick">
      <svg width="80" height="80" viewBox="0 0 100 100">
        <circle class="play-button-bg" cx="50" cy="50" r="46"/>
        <polygon class="play-button-icon" points="38,28 38,72 72,50"/>
      </svg>
    </div>

    <div 
      class="controls-overlay"
      :class="{ 'controls-visible': store.showControls }"
    >
      <div class="progress-bar-wrapper" @click="handleProgressClick">
        <div class="progress-bar">
          <div class="progress-buffered" :style="{ width: store.buffered + '%' }"></div>
          <div class="progress-played" :style="{ width: store.progress + '%' }"></div>
          <div class="progress-handle" :style="{ left: store.progress + '%' }"></div>
        </div>
      </div>

      <div class="controls-bar">
        <div class="controls-left">
          <button class="control-btn" @click="handleVideoClick">
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
          <button class="control-btn" @click="store.cycleLoopMode" :title="loopModeLabel">
            <svg v-if="store.loopMode === 'stop'" viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
              <path d="M11 9l4 3-4 3V9z" fill="white"/>
            </svg>
            <svg v-else-if="store.loopMode === 'single'" viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white"/>
              <path d="M12 7v10l4-5-4-5z" fill="white"/>
              <circle cx="12" cy="12" r="1" fill="white"/>
            </svg>
            <svg v-else-if="store.loopMode === 'list'" viewBox="0 0 24 24" width="22" height="22">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="white"/>
            </svg>
            <svg v-else-if="store.loopMode === 'cycle'" viewBox="0 0 24 24" width="22" height="22">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-2v-2h2v2zm-10 0v-2h2v2H7zm5 5c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 3.31-2.69 6-6 6z" fill="white"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="22" height="22">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill="white"/>
            </svg>
          </button>

          <button class="control-btn" @click="store.togglePlaylist" :title="store.showPlaylist ? '关闭播放列表' : '播放列表'">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2zm15-3l5 4-5 4v-8z" fill="white"/>
            </svg>
          </button>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const videoElement = ref(null)
const playerContainer = ref(null)

const loopModeLabel = computed(() => {
  const labels = {
    stop: '自动停止',
    single: '单曲循环',
    list: '列表顺序播放',
    cycle: '列表循环',
    shuffle: '随机播放'
  }
  return labels[store.loopMode] || '自动停止'
})

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
    store.syncCurrentToPlaylist()
  }
}

function handleLoadedData() {
  if (videoElement.value) {
    store.setDuration(videoElement.value.duration)
    store.syncCurrentToPlaylist()
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

function handleBigPlayClick() {
  if (videoElement.value) {
    store.setPlaying(true)
    videoElement.value.play()
    store.resetControlsTimer()
  }
}

function handleBufferProgress() {
  if (videoElement.value && videoElement.value.buffered.length > 0) {
    const bufferedEnd = videoElement.value.buffered.end(videoElement.value.buffered.length - 1)
    store.setBuffered((bufferedEnd / store.duration) * 100)
  }
}

function handleVideoEnded() {
  store.setPlaying(false)
  store.showControlsPermanently()
  if (videoElement.value) {
    videoElement.value.currentTime = 0
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
  if (videoElement.value && videoElement.value.readyState >= 1) {
    store.setDuration(videoElement.value.duration)
    store.syncCurrentToPlaylist()
  }
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
  transition: transform 0.15s ease;
}

.big-play-button:hover {
  transform: translate(-50%, -50%) scale(1.08);
}

.big-play-button .play-button-bg {
  fill: rgba(0, 0, 0, 0.65);
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 1.5;
  transition: fill 0.2s;
}

.big-play-button:hover .play-button-bg {
  fill: #D62839;
  stroke: #D62839;
}

.big-play-button .play-button-icon {
  fill: white;
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
  background-color: rgba(214, 40, 57, 0.3);
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #D62839;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: #D62839;
  border-radius: 50%;
  opacity: 0;
  transition: left 0.1s linear, opacity 0.1s;
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
