# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin for mood tracking, inspired by Amazing Marvin's Mood Tracker. It provides a user-friendly interface for tracking moods and emotions with data stored in JSON format within the vault.

## Development Commands

```bash
# Install dependencies
npm install

# Run development build with watch mode
npm run dev

# Production build (includes TypeScript type checking)
npm run build

# Bump version (updates manifest.json and versions.json)
npm run version
```

## Architecture

### Plugin Structure
- **Main entry**: `src/main.ts` - Extends Obsidian's Plugin class, initializes services, and registers commands/UI components
- **Data storage**: Mood data is persisted in `mood-tracker-data.json` within the vault
- **UI Framework**: Uses Svelte components for modals and interactive elements

### Key Services
- **PersistenceService** (`src/services/persistenceService.ts`): Handles reading/writing data to vault
- **MoodTrackerService** (`src/services/moodTrackerEntryService.ts`): Core business logic for mood entries
- **EmotionsService** (`src/services/emotionsService.ts`): Manages emotion groups and configurations
- **FileService** (`src/filesIntegration/fileService.ts`): Integrates mood entries with daily notes/journals
- **DataIntegrityService** (`src/services/dataIntegrityService.ts`): Validates and maintains data consistency

### UI Components
- **TrackerModal** (`src/trackerModal/`): Main mood entry interface with Svelte components
- **StatsModal** (`src/statsModal/`): History view and statistics visualization using Chart.js
- **Settings** (`src/settings/`): Configuration UI for emotions, labels, and file integration

### Codeblock Rendering
The plugin registers a custom `mood-tracker-stats` codeblock renderer that displays embedded mood graphs in notes with configurable parameters.

## Build System
- **Bundler**: esbuild with Svelte plugin
- **TypeScript**: Strict mode enabled with null checks
- **Target**: ES6/ES2018 for Obsidian compatibility
- **External dependencies**: Obsidian API and CodeMirror modules are marked as external

## Testing Locally
1. Build the plugin with `npm run dev`
2. Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/mood-tracker/` in your test vault
3. Enable the plugin in Obsidian settings