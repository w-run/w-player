<template>
  <div
    class="titlebar"
    :class="{ 'controls-visible': store.showControls }"
    @dblclick="toggleMaximize"
  >
    <div class="titlebar-drag">
      <div class="menu-trigger" @click.stop="toggleMenu">
        <img src="/logo.svg" class="menu-icon" alt="menu" />
      </div>
      <span class="title-text">{{ store.videoTitle || store.fileName || 'W/Player' }}</span>
    </div>
    <div class="drag-spacer" data-tauri-drag-region></div>
    <div class="window-controls">
      <button class="win-btn" @click="minimizeWindow" title="最小化">
        <svg viewBox="0 0 12 12" width="18" height="18">
          <rect x="1" y="5.5" width="10" height="1" fill="currentColor"/>
        </svg>
      </button>
      <button class="win-btn" @click="toggleMaximize" title="最大化">
        <svg viewBox="0 0 12 12" width="18" height="18">
          <rect x="1.5" y="1.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1"/>
        </svg>
      </button>
      <button class="win-btn win-btn-close" @click="closeWindow" title="关闭">
        <svg viewBox="0 0 12 12" width="18" height="18">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.2" fill="none"/>
        </svg>
      </button>
    </div>

    <div class="nav-menu" v-if="showMenu" @click.stop>
      <div class="menu-section">
        <div class="menu-item" @click="handleOpenFile">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>打开文件</span>
        </div>
        <div class="menu-item" @click="handleOpenUrl">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>打开链接</span>
        </div>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-section">
        <div class="menu-item" @click="handleSettings">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>设置</span>
        </div>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-section">
        <div class="menu-item" @click="handleAbout">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 16v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="8.5" r="0.5" fill="currentColor"/>
          </svg>
          <span>关于 W/Player</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/playerStore'

const store = usePlayerStore()
const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function onDocumentClick() {
  showMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

function handleOpenFile() {
  showMenu.value = false
}

function handleOpenUrl() {
  showMenu.value = false
}

function handleSettings() {
  showMenu.value = false
}

function handleAbout() {
  showMenu.value = false
}

function minimizeWindow() {}
function toggleMaximize() {}
function closeWindow() {}
</script>

<style scoped>
.titlebar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  height: 80px;
  padding: 10px 12px 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%);
  user-select: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  text-align: left;
}

.titlebar.controls-visible {
  opacity: 1;
  pointer-events: auto;
}

.titlebar-drag {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  height: 60px;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}

.menu-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  width: 36px;
  height: 36px;
}

.title-text {
  font-size: 20px;
  font-weight: 500;
  color: white;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;
}

.drag-spacer {
  flex: 1;
  height: 60px;
}

.window-controls {
  display: flex;
  align-items: flex-start;
  gap: 2px;
  padding-top: 4px;
}

.win-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 40px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}

.win-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.win-btn-close:hover {
  background: #e81123;
  color: white;
}

.nav-menu {
  position: absolute;
  top: 64px;
  left: 16px;
  width: 230px;
  background: #1c1c1c;
  border-radius: 10px;
  padding: 8px 0;
  z-index: 200;
}

.menu-section {
  padding: 2px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition: background 0.12s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.menu-divider {
  height: 1px;
  margin: 4px 14px;
  background: #1c1c1c;
}
</style>