# Wardle

A League of Legends–inspired daily puzzle game with eight interactive modes and an Ultimate Bravery loadout generator. Wardle leverages Riot’s Community Dragon and Meraki Analytics APIs (with local JSON fallbacks) for real-time and offline-capable gameplay.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [API Integration](#api-integration)
3. [Data Transformation](#data-transformation)
4. [Game Modes](#game-modes)

   * [Classic Mode](#classic-mode)
   * [Quote Mode](#quote-mode)
   * [Ability Mode](#ability-mode)
   * [Splash Art Mode](#splash-art-mode)
   * [Ward Mode](#ward-mode)
   * [Summoner Icon Mode](#summoner-icon-mode)
   * [Summoner Spell Mode](#summoner-spell-mode)
   * [Ultimate Bravery Mode](#ultimate-bravery-mode)
5. [Technical Architecture](#technical-architecture)
6. [Project Structure](#project-structure)
7. [Data Directory](#data-directory)
8. [Assets Directory](#assets-directory)
9. [Getting Started](#getting-started)
10. [Future Enhancements](#future-enhancements)
11. [Testing Recommendations](#testing-recommendations)
12. [Notes & Known Issues](#notes--known-issues)

---

## Project Overview

Wardle is a daily puzzle web app where players guess League of Legends champions, wards, icons, or spells across multiple modes. It features eight game modes plus an Ultimate Bravery loadout generator, uses a shared daily answer with a UTC reset, and supports offline play with local JSON fallbacks.

---

## API Integration

**Primary Sources**:

* **Community Dragon** (`raw.communitydragon.org`): champion-summary, skins, ward-skins, summoner-icons, summoner-spells, items
* **Meraki Analytics** (`cdn.merakianalytics.com`): detailed champion statistics and ability data

**Fallback**: On API failure, Wardle loads from local JSON files bundled in `src/data/`.

---

## Data Transformation

* **Champions**: Merged attributes from `champion-summary.json` and `champions.json`; normalized roles, genders, species, resources, regions, and ability icons.
* **Summoner Spells**: Filtered and formatted `summoner-spells.json` entries into `SummonerSpell` objects.
* **Ward Skins**: Extracted image paths from `ward-skins.json`.
* **Summoner Icons**: Constructed URLs and names from `summoner-icons.json`.
* **Items**: Filtered meta items from `items.json`.

All transformations unify API and local data formats for consistent use across the app.

---

## Game Modes

### Classic Mode

* Guess a champion’s name.
* Feedback on 7 attributes: Gender, Position(s), Species, Resource, Range type, Region(s), Release year.
* Data from `champion-summary.json`.

### Quote Mode

* Identify the champion from a random voice line.
* Quotes sourced from `champion-summary.json`.

### Ability Mode

* Guess by viewing a single ability icon (Q/W/E/R).
* Icons from the champion JSON’s `spells[].image.full`.

### Splash Art Mode

* Cropped champion splash art that zooms out with each incorrect guess.
* Assets referenced in `skins.json`.

### Ward Mode

* Similar to Splash Art Mode but with ward-skin images.
* Zoom-out mechanic from 300% to 100%.
* Data from `ward-skins.json`.

### Summoner Icon Mode

* Guess the profile icon by image.
* Uses `summoner-icons.json`.

### Summoner Spell Mode

* Identify the spell (e.g., Flash, Ignite) by icon.
* Hints appear after wrong guesses.
* Data from `summoner-spells.json`.

### Ultimate Bravery Mode

* User selects or randomizes a champion.
* Generates a random loadout:

  * **Items**: 3 picks from `items.json`.
  * **Summoner Spells**: 2 picks from `summoner-spells.json`.
  * **Runes/Perks**: Random from each path in `champion-summary.json`.
* Displays build with portraits, item icons, spell icons, and runes.

---

## Technical Architecture

* **Framework**: React 18 + TypeScript + Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **State Management**: React hooks + localStorage
* **Data Loading**: `useGameData` hook with parallel fetch & fallback logic
* **Daily Reset**: UTC midnight seed-based generation

---

## Project Structure

```
src/
├── components/
│   ├── modes/
│   │   ├── ClassicMode.tsx
│   │   ├── QuoteMode.tsx
│   │   ├── AbilityMode.tsx
│   │   ├── SplashArtMode.tsx
│   │   ├── WardMode.tsx
│   │   ├── SummonerIconMode.tsx
│   │   ├── SummonerSpellMode.tsx
│   │   └── UltimateBraveryMode.tsx
│   ├── Header.tsx
│   ├── ModeSelector.tsx
│   └── SearchInput.tsx
├── data/
│   ├── champion-summary.json
│   ├── champions.json
│   ├── skins.json
│   ├── ward-skins.json
│   ├── summoner-icons.json
│   ├── summoner-spells.json
│   └── items.json
├── hooks/
│   └── useGameData.ts
├── types/
│   └── index.ts
├── utils/
│   └── gameLogic.ts
└── App.tsx
```

---

## Data Directory

All JSON files are stored under `src/data/`:

* `champion-summary.json`
* `champions.json`
* `skins.json`
* `ward-skins.json`
* `summoner-icons.json`
* `summoner-spells.json`
* `items.json`

These serve as fallbacks for offline play.

---

## Assets Directory

Organized static assets:

* `images/` — splash arts, ability icons, ward icons, spell icons, etc.
* `data/` — static JSON files for public access (if needed)

---

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```
2. **Development Server**

   ```bash
   npm run dev
   ```
3. **Build for Production**

   ```bash
   npm run build
   npm run preview
   ```
4. **Linting**

   ```bash
   npm run lint
   ```

---

## Testing Recommendations

1. **Normal Operation**: APIs available → loads live data.
2. **API Failure**: Offline or blocked → loads local JSON data.
3. **Partial Failure**: Some endpoints fail → fallback per-resource.
4. **Complete Failure**: Network + missing JSON → empty arrays, no crash.

---

## Future Enhancements

* Sound effects & music
* Leaderboards & social sharing
* Mobile-responsive improvements
* Multi-language support
* Real-time patch updates

---

## Notes & Known Issues

* First-load image latency due to CDN requests
* External URLs for some assets may need caching
* Mobile UI adjustments in progress

---

