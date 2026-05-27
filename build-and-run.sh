#!/bin/bash
# 交叉编译 + 自动传送到 Windows 运行
# 使用方法: ./build-and-run.sh <WINDOWS_IP> <WINDOWS_USER> <WINDOWS_PASS>

set -e

WINDOWS_IP="${1:-192.168.1.100}"
WINDOWS_USER="${2:-user}"
WINDOWS_PASS="${3:-password}"
REMOTE_DIR="C:\\Users\\$WINDOWS_USER\\Desktop\\WPlayer"

export PATH="/workspace/dev/nodejs/bin:$PATH"
export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=x86_64-w64-mingw32-gcc

cd /workspace/w-player

echo "=== 1. Build frontend ==="
/workspace/dev/vite build

echo "=== 2. Cross-compile for Windows ==="
/workspace/dev/tauri build --target x86_64-pc-windows-gnu --bundles none

EXE="src-tauri/target/x86_64-pc-windows-gnu/release/WPlayer.exe"

if [ ! -f "$EXE" ]; then
    echo "=== Build failed! ==="
    exit 1
fi

echo "=== 3. Transfer to Windows ==="
# 使用 smbclient 或 ssh 传输（二选一）
if command -v smbclient &>/dev/null; then
    smbclient "//$WINDOWS_IP/Users" "$WINDOWS_PASS" -U "$WINDOWS_USER" \
      -c "mkdir $REMOTE_DIR; put \"$EXE\" \"$REMOTE_DIR\\WPlayer.exe\""
elif command -v scp &>/dev/null; then
    scp "$EXE" "$WINDOWS_USER@$WINDOWS_IP:$REMOTE_DIR/WPlayer.exe"
fi

echo "=== Done! File transferred to Windows ==="
echo "Path: $REMOTE_DIR\\WPlayer.exe"