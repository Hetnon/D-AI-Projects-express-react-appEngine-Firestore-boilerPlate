// priority order for ranking quotes within minimum schedule
export const WITHIN_SCHEDULE_RANKING_ORDER = [
    'TIER',
    'PRICE',
    'PROVIDER_QUALITY',
    'AVAILABILITY',
    'DISTANCE',
    'TIME_RECEIVED'
];


// priority order for ranking quotes outside minimum schedule
export const OUTSIDE_SCHEDULE_RANKING_ORDER = [
    'AVAILABILITY',
    'TIER',
    'PRICE',
    'PROVIDER_QUALITY',
    'DISTANCE',
    'TIME_RECEIVED'
];