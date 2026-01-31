const { syncSet } = require('./scryfallService');
const axios = require('axios');
const { PrismaClient } = require('../generated/client');

jest.mock('axios');
jest.mock('../generated/client', () => {
  const mPrisma = {
    card: {
      upsert: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('scryfallService', () => {
  it('should sync cards correctly', async () => {
    const mockData = {
      data: {
        has_more: false,
        data: [
          {
            id: '123',
            name: 'Test Card',
            set: 'tst',
            set_name: 'Test Set',
            collector_number: '1',
            rarity: 'common',
          }
        ]
      }
    };
    
    axios.get.mockResolvedValue(mockData);
    
    const count = await syncSet('tst');
    expect(count).toBe(1);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('tst'));
  });
});
