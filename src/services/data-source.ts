import { DATA_SOURCE_MODE } from '@/constants/apiConfig';

import type { GiftedDataSource } from './gifted-data-source';
import { mockGiftedDataSource } from './mock-gifted-data-source';
import { restGiftedDataSource } from './rest-gifted-data-source';

/** The selected source is fixed at app startup; REST failures are not masked. */
export const giftedDataSource: GiftedDataSource =
  DATA_SOURCE_MODE === 'rest' ? restGiftedDataSource : mockGiftedDataSource;

export const isUsingMockData = DATA_SOURCE_MODE === 'mock';