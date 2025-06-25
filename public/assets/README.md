# Assets Directory

This directory contains static assets for the Wardle game:

## Structure
- `images/` - Champion splash arts, ability icons, ward icons, etc.
- `data/` - JSON data files (if needed for public access)

## Data Sources
The game uses the following data sources as specified in the MVP:
- champion-summary.json (attributes, quotes, runes)
- champions.json (master champion list)
- skins.json (splash-art references)
- ward-skins.json (ward icons)
- summoner-icons.json (profile icons)
- summoner-spells.json (spell icons & names)
- items.json (item icons & metadata)

All data is currently loaded from the src/data directory and bundled with the application.