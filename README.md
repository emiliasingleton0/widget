# Mochi Desk Buddy v2.0

A transparent, frameless Windows desktop companion that feels like a small character living on your desktop—not a productivity panel with a mascot.

## Highlights

- Truly transparent Electron window with no gray/navy panel
- Frameless, always-on-top, resizable companion
- Drag Mochi from the upper area of the window
- Resize from the subtle bottom-right grip or Settings
- Tasks, focus timer, and quick notes emerge as liquid-glass bubbles
- Animated ears, blinking, breathing, cursor-following eyes, and tiny reactions
- Blush, Milk, and Night themes
- Position, size, tasks, notes, and settings persist
- Tray icon for show/hide and quit
- Temporary click-through “Ghost Mode” automatically turns off after 12 seconds

## Run

```powershell
npm.cmd install
npm.cmd start
```

Or double-click `RUN-MOCHI.bat` after installing dependencies.

## Build a Windows installer

```powershell
npm.cmd run build:installer
```

The installer is written to `dist`.

## Notes

Windows may warn about locally built unsigned applications. Public distribution without warnings requires code signing.
