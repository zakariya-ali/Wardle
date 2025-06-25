// Simple test script to verify the API data loading works
const CHAMPION_SUMMARY_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
const SUMMONER_SPELLS_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json';

async function testDataLoading() {
  try {
    console.log('Testing data loading...');
    
    // Test champion summary
    const champResponse = await fetch(CHAMPION_SUMMARY_URL);
    const champData = await champResponse.json();
    console.log(`✓ Champions loaded: ${champData.length} champions`);
    console.log(`Sample champion:`, champData[1]);
    
    // Test summoner spells
    const spellsResponse = await fetch(SUMMONER_SPELLS_URL);
    const spellsData = await spellsResponse.json();
    console.log(`✓ Spells loaded: ${spellsData.length} spells`);
    console.log(`Sample spell:`, spellsData.find(s => s.name === 'Flash'));
    
    console.log('✓ All data loading tests passed!');
    
  } catch (error) {
    console.error('✗ Data loading failed:', error);
  }
}

testDataLoading();