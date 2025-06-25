# Wardle API Integration

This document describes how Wardle integrates with the official League of Legends APIs to provide real-time game data.

## API Sources

### Community Dragon API
Community Dragon provides comprehensive League of Legends game data extracted directly from the game client.

**Base URL**: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/`

**Endpoints Used**:
- `champion-summary.json` - Champion basic information and roles
- `skins.json` - Champion skin data and splash art references
- `ward-skins.json` - Ward skin icons and metadata
- `summoner-icons.json` - Profile icon data
- `summoner-spells.json` - Summoner spell icons and descriptions
- `items.json` - Item data and icons

### Meraki Analytics API
Meraki Analytics provides detailed champion statistics and ability information.

**Base URL**: `https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/`

**Endpoints Used**:
- `champions.json` - Detailed champion data including abilities, stats, and metadata

## Data Transformation

The raw API data is transformed to match our application's data structure:

### Champions
- **Source**: champion-summary.json + champions.json
- **Transformation**: Maps roles to positions, determines gender/species/resource types, generates ability icon URLs
- **Output**: Champion objects with standardized attributes for the Classic Mode

### Summoner Spells
- **Source**: summoner-spells.json
- **Transformation**: Filters out empty entries, constructs full icon URLs
- **Output**: SummonerSpell objects for Summoner Spell Mode

### Ward Skins
- **Source**: ward-skins.json
- **Transformation**: Extracts ward image paths, constructs full URLs
- **Output**: Ward objects for Ward Mode

### Summoner Icons
- **Source**: summoner-icons.json
- **Transformation**: Uses title as name, constructs full image URLs
- **Output**: SummonerIcon objects for Summoner Icon Mode

### Items
- **Source**: items.json
- **Transformation**: Filters out consumables, constructs icon URLs
- **Output**: Item objects for Ultimate Bravery Mode

## Benefits of API Integration

1. **Always Current**: Data is always up-to-date with the latest game patches
2. **Comprehensive**: Access to the complete League of Legends dataset
3. **Official Sources**: Uses the same data that powers the game client
4. **No Maintenance**: No need to manually update static files

## Error Handling

The application includes robust error handling:
- Graceful fallback to empty arrays if API calls fail
- Console logging for debugging API issues
- Loading states to provide user feedback
- Retry logic could be added in the future

## Performance Considerations

- All API calls are made in parallel for faster loading
- Data is limited (e.g., 50 icons, 20 wards) to prevent excessive memory usage
- Data is cached in React state to avoid repeated API calls
- Future improvements could include localStorage caching

## CORS and Security

The APIs used are public and CORS-enabled, allowing direct browser access without a backend proxy.

## Future Enhancements

Potential improvements to the API integration:
- Add caching with expiration times
- Implement retry logic with exponential backoff
- Add data validation and schema checking
- Support for multiple languages
- Real-time updates when new patches are released