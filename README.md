# W/Player

A minimal YouTube-style video player built with Tauri, Vue 3, and Pinia.

## Features

- YouTube-inspired minimalist interface
- Play/Pause controls
- Progress bar with seek functionality
- Volume control with mute option
- Fullscreen support
- Keyboard shortcuts
- Auto-hiding controls

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←` - Seek backward 5 seconds
- `→` - Seek forward 5 seconds
- `↑` - Increase volume
- `↓` - Decrease volume
- `F` - Toggle fullscreen
- `M` - Toggle mute

## Development

### Prerequisites

- Node.js
- Rust
- Tauri CLI

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build for production
npm run tauri build
```

## Project Structure

```
w-player/
├── src/
│   ├── components/
│   │   └── VideoPlayer.vue    # Main video player component
│   ├── stores/
│   │   └── playerStore.js     # Pinia store for player state
│   ├── App.vue                # Root component
│   ├── main.js                # Entry point
│   └── style.css              # Global styles
├── src-tauri/                 # Tauri backend
├── index.html
├── package.json
└── vite.config.js
```

## License

MIT
