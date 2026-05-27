#!/bin/bash
# W/Player Windows构建脚本
# 使用 /workspace/dev 下的开发工具

export PATH="/workspace/dev/nodejs/bin:$PATH"
export CARGO_TARGET_X86_64_PC_WINDOWS_GNU_LINKER=x86_64-w64-mingw32-gcc
export CC_x86_64_pc_windows_gnu=x86_64-w64-mingw32-gcc
export CXX_x86_64_pc_windows_gnu=x86_64-w64-mingw32-g++

cd /workspace/w-player

echo "=== Building W/Player for Windows 11 x64 ==="
echo "Target: x86_64-pc-windows-gnu"
echo ""

/workspace/dev/tauri build --target x86_64-pc-windows-gnu --bundles msi,nsis

if [ $? -eq 0 ]; then
    echo ""
    echo "=== Build completed successfully ==="
    echo "Output files:"
    find src-tauri/target -name "*.exe" -o -name "*.msi" 2>/dev/null | grep "x86_64-pc-windows-gnu"
else
    echo ""
    echo "=== Build failed ==="
    exit 1
fi