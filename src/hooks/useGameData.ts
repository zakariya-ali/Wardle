import { useState, useEffect } from 'react';
import { Champion, Item, SummonerSpell, Ward, SummonerIcon } from '../types';

// API URLs
const CHAMPION_SUMMARY_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
const CHAMPIONS_URL = 'https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json';
const SKINS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json';
const WARD_SKINS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/ward-skins.json';
const SUMMONER_ICONS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-icons.json';
const SUMMONER_SPELLS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json';
const ITEMS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json';

// Transform functions to convert API data to our expected format
const transformChampionData = (championSummary: any[], championsData: any, skinsData: any[]): Champion[] => {
  return championSummary
    .filter(champ => champ.id > 0) // Filter out invalid entries
    .map(champ => {
      const merakiData = Object.values(championsData).find((c: any) => c.id === champ.id);
      
      // Generate some sample quotes (in real implementation, these would come from the API)
      const sampleQuotes = [
        `${champ.name} quote 1`,
        `${champ.name} quote 2`
      ];

      // Map roles to positions
      const positions = champ.roles?.map((role: string) => {
        switch (role.toLowerCase()) {
          case 'mage': return 'Mid';
          case 'marksman': return 'ADC';
          case 'support': return 'Support';
          case 'tank': return 'Support';
          case 'fighter': return 'Top';
          case 'assassin': return 'Mid';
          default: return 'Top';
        }
      }) || ['Top'];

      // Determine gender (simplified logic)
      const femaleNames = ['ahri', 'annie', 'ashe', 'caitlyn', 'diana', 'elise', 'evelynn', 'fiora', 'irelia', 'janna', 'jinx', 'karma', 'katarina', 'kayle', 'leblanc', 'leona', 'lissandra', 'lulu', 'lux', 'miss fortune', 'morgana', 'nami', 'nidalee', 'orianna', 'poppy', 'quinn', 'riven', 'sejuani', 'shyvana', 'sivir', 'sona', 'soraka', 'syndra', 'tristana', 'vayne', 'vi', 'zyra'];
      const gender = femaleNames.includes(champ.name.toLowerCase()) ? 'Female' : 'Male';

      // Determine species (simplified)
      const species = champ.name.toLowerCase().includes('void') ? ['Void'] : 
                    champ.name.toLowerCase().includes('yordle') ? ['Yordle'] : 
                    ['Human'];

      // Determine resource type
      const resource = merakiData?.resource === 'MANA' ? 'Mana' : 
                     merakiData?.resource === 'ENERGY' ? 'Energy' : 
                     merakiData?.resource === 'BLOOD_WELL' ? 'Manaless' : 'Mana';

      // Determine range type
      const rangeType = merakiData?.attackType === 'MELEE' ? 'Melee' : 'Ranged';

      // Determine regions (simplified)
      const regions = ['Runeterra']; // Default region

      // Get release year (simplified - using a base year + id offset)
      const releaseYear = 2009 + Math.floor(champ.id / 20);

      // Create abilities object
      const abilities = {
        Q: { name: 'Q Ability', icon: `https://cdn.communitydragon.org/latest/champion/${champ.alias}/ability-icon/q` },
        W: { name: 'W Ability', icon: `https://cdn.communitydragon.org/latest/champion/${champ.alias}/ability-icon/w` },
        E: { name: 'E Ability', icon: `https://cdn.communitydragon.org/latest/champion/${champ.alias}/ability-icon/e` },
        R: { name: 'R Ability', icon: `https://cdn.communitydragon.org/latest/champion/${champ.alias}/ability-icon/r` }
      };

      // Get splash art
      const splashArt = merakiData?.skins?.[0]?.splashPath || 
                       `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/assets/characters/${champ.alias.toLowerCase()}/skins/base/images/${champ.alias.toLowerCase()}_splash_centered_0.jpg`;

      return {
        id: champ.id.toString(),
        name: champ.name,
        gender,
        positions: [...new Set(positions)], // Remove duplicates
        species,
        resource,
        rangeType,
        regions,
        releaseYear,
        quotes: sampleQuotes,
        abilities,
        splashArt
      };
    });
};

const transformSummonerSpells = (spellsData: any[]): SummonerSpell[] => {
  return spellsData
    .filter(spell => spell.name && spell.name.trim() !== '') // Filter out empty names
    .map(spell => ({
      id: spell.id.toString(),
      name: spell.name,
      description: spell.description || '',
      icon: spell.iconPath ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${spell.iconPath}` : ''
    }));
};

const transformWards = (wardsData: any[]): Ward[] => {
  return wardsData
    .filter(ward => ward.name && ward.id)
    .slice(0, 20) // Limit to first 20 for performance
    .map(ward => ({
      id: ward.id.toString(),
      name: ward.name,
      icon: ward.wardImagePath ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${ward.wardImagePath}` : ''
    }));
};

const transformSummonerIcons = (iconsData: any[]): SummonerIcon[] => {
  return iconsData
    .filter(icon => icon.title && icon.id)
    .slice(0, 50) // Limit to first 50 for performance
    .map(icon => ({
      id: icon.id.toString(),
      name: icon.title,
      icon: icon.imagePath ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${icon.imagePath}` : ''
    }));
};

const transformItems = (itemsData: any[]): Item[] => {
  return itemsData
    .filter(item => item.name && item.id && item.categories?.includes('Consumable') === false) // Filter out consumables
    .slice(0, 100) // Limit to first 100 for performance
    .map(item => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description || '',
      icon: item.iconPath ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default${item.iconPath}` : '',
      cost: item.priceTotal || 0
    }));
};

export const useGameData = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [spells, setSpells] = useState<SummonerSpell[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [icons, setIcons] = useState<SummonerIcon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading game data from APIs...');
        
        // Fetch all data in parallel
        const [
          championSummaryResponse,
          championsResponse,
          skinsResponse,
          wardsResponse,
          iconsResponse,
          spellsResponse,
          itemsResponse
        ] = await Promise.all([
          fetch(CHAMPION_SUMMARY_URL),
          fetch(CHAMPIONS_URL),
          fetch(SKINS_URL),
          fetch(WARD_SKINS_URL),
          fetch(SUMMONER_ICONS_URL),
          fetch(SUMMONER_SPELLS_URL),
          fetch(ITEMS_URL)
        ]);

        // Parse JSON responses
        const [
          championSummaryData,
          championsData,
          skinsData,
          wardsData,
          iconsData,
          spellsData,
          itemsData
        ] = await Promise.all([
          championSummaryResponse.json(),
          championsResponse.json(),
          skinsResponse.json(),
          wardsResponse.json(),
          iconsResponse.json(),
          spellsResponse.json(),
          itemsResponse.json()
        ]);

        console.log('Raw data loaded, transforming...');

        // Transform data to our expected format
        const transformedChampions = transformChampionData(championSummaryData, championsData, skinsData);
        const transformedSpells = transformSummonerSpells(spellsData);
        const transformedWards = transformWards(wardsData);
        const transformedIcons = transformSummonerIcons(iconsData);
        const transformedItems = transformItems(itemsData);

        console.log(`Loaded ${transformedChampions.length} champions, ${transformedSpells.length} spells, ${transformedWards.length} wards, ${transformedIcons.length} icons, ${transformedItems.length} items`);

        // Set state
        setChampions(transformedChampions);
        setSpells(transformedSpells);
        setWards(transformedWards);
        setIcons(transformedIcons);
        setItems(transformedItems);

      } catch (error) {
        console.error('Failed to load game data:', error);
        // Fallback to empty arrays
        setChampions([]);
        setItems([]);
        setSpells([]);
        setWards([]);
        setIcons([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    champions,
    items,
    spells,
    wards,
    icons,
    loading
  };
};