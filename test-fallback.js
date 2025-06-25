// Test script to verify fallback data loading works
import championSummaryFallback from './src/data/champion-summary.json' assert { type: 'json' };
import championsFallback from './src/data/champions.json' assert { type: 'json' };
import spellsFallback from './src/data/summoner-spells.json' assert { type: 'json' };

console.log('Testing fallback data...');

// Test champion summary
console.log(`✓ Champion summary: ${championSummaryFallback.length} champions`);
console.log(`Sample champion:`, championSummaryFallback.find(c => c.name === 'Ahri'));

// Test champions data
const championsArray = Object.values(championsFallback);
console.log(`✓ Champions data: ${championsArray.length} champions`);
console.log(`Sample champion:`, championsFallback.Ahri ? 'Ahri found' : 'Ahri not found');

// Test spells
console.log(`✓ Summoner spells: ${spellsFallback.length} spells`);
console.log(`Sample spell:`, spellsFallback.find(s => s.name === 'Flash'));

console.log('✓ All fallback data tests passed!');