<template>
  <div class="playlist-panel" :class="{ collapsed: !expanded }">
    <div class="playlist-body">
      <div class="playlist-empty" v-if="store.items.length === 0">
        <p>暂无播放列表</p>
        <p class="hint">可通过文件菜单添加视频</p>
      </div>
      <div
        class="playlist-item"
        v-for="(item, index) in store.items"
        :key="index"
        :class="{ active: item.url === store.videoUrl }"
        @click="playItem(item)"
      >
        <span class="item-index">{{ index + 1 }}</span>
        <div class="item-thumb">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M8 5v14l11-7z" fill="rgba(255,255,255,0.6)"/>
          </svg>
        </div>
        <div class="item-info">
          <span class="item-title">{{ item.title }}</span>
          <span class="item-duration">{{ formatDuration(item.duration) }}</span>
        </div>
      </div>
    </div>
    <div class="playlist-footer" @click="$emit('toggle')">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="white"/>
      </svg>
      <span>播放列表</span>
      <span class="item-count">{{ store.items.length }} 首</span>
      <svg class="chevron" viewBox="0 0 24 24" width="16" height="16" :class="{ rotated: expanded }">
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="white"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/playerStore'

defineProps({
  expanded: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const store = usePlayerStore()

function playItem(item) {
  if (item.url !== store.videoUrl) {
    store.setVideoUrl(item.url)
    store.setVideoTitle(item.title)
    store.setDuration(item.duration)
  }
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.playlist-panel {
  width: 0;
  min-width: 0;
  background: #1c1c1c;
  overflow: hidden;
  transition: width 0.25s ease, min-width 0.25s ease;
  display: flex;
  flex-direction: column;
}

.playlist-panel.collapsed {
  width: 0;
  min-width: 0;
}

.playlist-panel:not(.collapsed) {
  width: 340px;
  min-width: 340px;
}

.playlist-body {
  flex: 1;
  overflow-y: auto;
  padding: 70px 0 8px;
}

.playlist-empty {
  padding: 60px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.playlist-empty .hint {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.2);
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.playlist-item.active {
  background: rgba(214, 40, 57, 0.1);
}

.item-index {
  width: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  flex-shrink: 0;
}

.item-thumb {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-duration {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.playlist-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 16px;
  height: 56px;
  cursor: pointer;
  background: #1c1c1c;
  user-select: none;
  flex-shrink: 0;
}

.playlist-footer span {
  flex: 1;
  font-size: 14px;
  color: white;
}

.item-count {
  flex: none !important;
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.4) !important;
  margin-right: 4px;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}
</style>