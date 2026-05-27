import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const isMuted = ref(false)
  const isFullscreen = ref(false)
  const videoUrl = ref('/res/preview.mp4')
  const videoTitle = ref('')
  const items = ref([])
  const showControls = ref(true)
  const buffered = ref(0)
  const loopMode = ref('stop')
  const showPlaylist = ref(false)
  let hideControlsTimer = null

  const loopModes = ['stop', 'single', 'list', 'cycle', 'shuffle']

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const fileName = computed(() => {
    if (!videoUrl.value) return ''
    const parts = videoUrl.value.split('/')
    return parts[parts.length - 1]
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

  function setBuffered(value) {
    buffered.value = value
  }

  function setVideoTitle(title) {
    videoTitle.value = title
  }

  function cycleLoopMode() {
    const idx = loopModes.indexOf(loopMode.value)
    loopMode.value = loopModes[(idx + 1) % loopModes.length]
  }

  function togglePlaylist() {
    showPlaylist.value = !showPlaylist.value
  }

  function addToPlaylist(url, title, duration) {
    const existing = items.value.findIndex(i => i.url === url)
    const entry = { url, title, duration }
    if (existing >= 0) {
      items.value[existing] = { ...items.value[existing], ...entry }
    } else {
      items.value.push(entry)
    }
  }

  function syncCurrentToPlaylist() {
    const url = videoUrl.value
    if (!url) return
    addToPlaylist(url, videoTitle.value || fileName.value, duration.value)
  }

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    videoUrl,
    videoTitle,
    items,
    showControls,
    buffered,
    loopMode,
    showPlaylist,
    progress,
    fileName,
    togglePlay,
    setPlaying,
    setCurrentTime,
    setDuration,
    toggleMute,
    setVolume,
    toggleFullscreen,
    setVideoUrl,
    resetControlsTimer,
    showControlsPermanently,
    setBuffered,
    setVideoTitle,
    cycleLoopMode,
    togglePlaylist,
    addToPlaylist,
    syncCurrentToPlaylist
  }
})