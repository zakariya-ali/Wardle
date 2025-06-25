# Data Directory

This directory previously contained static JSON files for development.

The application now loads data directly from the official League of Legends APIs:

- **Champion Summary**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json
- **Champions**: https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json
- **Skins**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json
- **Ward Skins**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/ward-skins.json
- **Summoner Icons**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json
- **Summoner Spells**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json
- **Items**: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json

All data is fetched dynamically and transformed to match our application's data structure.