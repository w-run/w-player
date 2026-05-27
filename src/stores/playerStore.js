import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const videoUrl = ref('')
  const showControls = ref(true)
  let hideControlsTimer = null

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function setPlaying(value) {
    isPlaying.value = value
  }

  function setCurrentTime(time) {
    currentTime.value = time
  }

  function setDuration(time) {
    duration.value = time
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function setVolume(value) {
    volume.value = value
    if (value > 0) {
      isMuted.value = false
    }
  }

  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  function setVideoUrl(url) {
    videoUrl.value = url
  }

  function resetControlsTimer() {
    if (hideControlsTimer) {
      clearTimeout(hideControlsTimer)
    }
    showControls.value = true
    if (isPlaying.value) {
      hideControlsTimer = setTimeout(() => {
        showControls.value = false
      }, 3000)
    }
  }

  function showControlsPermanently() {
    if (hideControlsTimer) {
      clearTimeout(hideControlsTimer)
    }
    showControls.value = true
  }

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    videoUrl,
    showControls,
    progress,
    togglePlay,
    setPlaying,
    setCurrentTime,
    setDuration,
    toggleMute,
    setVolume,
    toggleFullscreen,
    setVideoUrl,
    resetControlsTimer,
    showControlsPermanently
  }
})
