export interface Party {
  id: string;
  name: string;
  shortName: string;
  color: string;
  leader: string;
  symbol: string;
}

export const TAMIL_NADU_PARTIES: Party[] = [
  {
    id: 'dmk',
    name: 'Dravida Munnetra Kazhagam',
    shortName: 'DMK',
    color: '#DC143C', // Crimson red
    leader: 'M.K. Stalin',
    symbol: '🌅', // Rising Sun
  },
  {
    id: 'aiadmk',
    name: 'All India Anna Dravida Munnetra Kazhagam',
    shortName: 'AIADMK',
    color: '#006400', // Dark green
    leader: 'Edappadi K. Palaniswami',
    symbol: '🌿', // Two Leaves
  },
  {
    id: 'bjp',
    name: 'Bharatiya Janata Party',
    shortName: 'BJP',
    color: '#FF9933', // Saffron
    leader: 'K. Annamalai',
    symbol: '🪷', // Lotus
  },
  {
    id: 'tvk',
    name: 'Tamilaga Vettri Kazhagam',
    shortName: 'TVK',
    color: '#8B0000', // Dark red
    leader: 'Vijay',
    symbol: '⚔️', // Sword (placeholder)
  },
  {
    id: 'ntk',
    name: 'Naam Tamilar Katchi',
    shortName: 'NTK',
    color: '#FFD700', // Gold
    leader: 'Seeman',
    symbol: '🏹', // Bow and Arrow
  },
  {
    id: 'congress',
    name: 'Indian National Congress',
    shortName: 'INC',
    color: '#0000CD', // Medium blue
    leader: 'K. Selvaperunthagai',
    symbol: '✋', // Hand
  },
  {
    id: 'nota',
    name: 'None of the Above',
    shortName: 'NOTA',
    color: '#696969', // Dim gray
    leader: '',
    symbol: '⊘',
  },
];
