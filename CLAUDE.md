# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RepoJump** - A Chrome extension (Manifest V3) that converts URLs between GitHub, CodeWiki, and GitHub1s for faster code browsing.

## Installation

Load the extension in Chrome:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the project directory

## Architecture

- **manifest.json** - Extension configuration, host permissions, and keyboard shortcuts
- **src/background.js** - Service worker handling:
  - Global keyboard commands (Alt+Shift+D/1/G)
  - Message routing from popup/other scripts
  - URL conversion functions
- **src/popup/** - Extension popup UI:
  - `popup.html` - Button interface
  - `popup.js` - Event handlers, button state management, keyboard shortcuts (D/1/G keys)
  - `popup.css` - Styling

## URL Conversion

Conversion functions in `src/background.js` extract `owner/repo` from pathname (using `split('/').slice(1, 3)`), discarding branch/file info:

- `convertToCodeWiki()` - GitHub/1s → codewiki.google
- `convertToGitHub1s()` - GitHub/CodeWiki → github1s.com
- `convertToGitHub()` - CodeWiki/1s → github.com

## Keyboard Shortcuts

- **Alt+Shift+D** - Convert to CodeWiki
- **Alt+Shift+1** - Convert to GitHub1s
- **Alt+Shift+G** - Return to GitHub
- **Popup focus**: D / 1 / G keys trigger the same actions

## Host Permissions

`tabs` permission for URL access, host access to github.com, github1s.com, codewiki.google
