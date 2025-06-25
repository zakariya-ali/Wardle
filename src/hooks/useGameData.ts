import { useState, useEffect } from 'react';
import { Champion, Item, SummonerSpell, Ward, SummonerIcon } from '../types';

// Import JSON data
import championsData from '../data/champions.json';
import itemsData from '../data/items.json';
import spellsData from '../data/summonerSpells.json';
import wardsData from '../data/wards.json';
import iconsData from '../data/summonerIcons.json';

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
        setChampions(championsData as Champion[]);
        setItems(itemsData as Item[]);
        setSpells(spellsData as SummonerSpell[]);
        setWards(wardsData as Ward[]);
        setIcons(iconsData as SummonerIcon[]);
      } catch (error) {
        console.error('Failed to load game data:', error);
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