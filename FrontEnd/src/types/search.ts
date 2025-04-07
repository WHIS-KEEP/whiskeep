export interface Whisky {
  id: number;
  koName: string;
  enName?: string;
  type: string;
  age: number | null;
  abv: number | null;
  avgRating: number;
  recordCounts: number;
  whiskyImg?: string;
}

export const dummySearchResults: Whisky[] = [
  {
    id: 1,
    koName: '아드베그 10년산',
    enName: 'Ardbeg 10 Years Old',
    type: 'Single Malt',
    age: 10,
    abv: 46,
    avgRating: 4.6,
    recordCounts: 128,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Ardbeg_10.png',
  },
  {
    id: 2,
    koName: '발베니 12년 더블우드',
    enName: 'Balvenie 12 DoubleWood',
    type: 'Single Malt',
    age: 12,
    abv: 40,
    avgRating: 4.4,
    recordCounts: 112,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Balvenie_12.png',
  },
  {
    id: 3,
    koName: '버팔로 트레이스',
    enName: 'Buffalo Trace',
    type: 'Bourbon',
    age: 18,
    abv: 45,
    avgRating: 4.1,
    recordCounts: 90,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Buffalo_Trace.png',
  },
  {
    id: 4,
    koName: '글렌피딕 15년',
    enName: 'Glenfiddich 15 Year Old',
    type: 'Single Malt',
    age: 15,
    abv: 51,
    avgRating: 4.3,
    recordCounts: 134,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Glenfiddich_15.png',
  },
  {
    id: 5,
    koName: '레드브레스트 12년 CS',
    enName: 'Redbreast 12 Cask Strength',
    type: 'Single Pot Still',
    age: 12,
    abv: 58.6,
    avgRating: 4.7,
    recordCounts: 76,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Redbreast_12_CS.png',
  },
  {
    id: 6,
    koName: '카발란 솔리스트 셰리 캐스크',
    enName: 'Kavalan Solist Sherry Cask',
    type: 'Single Malt',
    age: 21,
    abv: 57.8,
    avgRating: 4.5,
    recordCounts: 98,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Kavalan_Solist_Sherry.png',
  },
  {
    id: 7,
    koName: '제임슨',
    enName: 'Jameson',
    type: 'Blended',
    age: null,
    abv: 40,
    avgRating: 4.0,
    recordCounts: 200,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Jameson.png',
  },
  {
    id: 8,
    koName: '하이볼트위스키',
    enName: 'Highball Whisky',
    type: 'Grain',
    age: 5,
    abv: 34,
    avgRating: 3.7,
    recordCounts: 50,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Highball.png',
  },
  {
    id: 9,
    koName: '맥켈란 12년 셰리오크',
    enName: 'Macallan 12 Sherry Oak',
    type: 'Single Malt',
    age: 12,
    abv: 40,
    avgRating: 4.8,
    recordCounts: 300,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Macallan_12_Sherry.png',
  },
  {
    id: 10,
    koName: '잭 다니엘스',
    enName: 'Jack Daniel’s',
    type: 'Tennessee',
    age: null,
    abv: 40,
    avgRating: 3.9,
    recordCounts: 250,
    whiskyImg:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Jack_Daniels.png',
  },
];
