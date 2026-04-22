import request from 'supertest';
import app from '../app';
import { prismaMock } from '../singleton';

// We need to mock the ContextService as it uses setTimeout and is async
jest.mock('../services/ContextService', () => {
  return {
    ContextService: jest.fn().mockImplementation(() => {
      return {
        processMedia: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

describe('TransactionController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/transactions should create a BOT transaction without context', async () => {
    const mockTx = {
      id: 1,
      accountId: 1,
      symbol: 'BTC-USD',
      amount: 1,
      price: 50000,
      type: 'BUY',
      context: null,
      status: 'PENDING_CONTEXT',
      source: 'BOT',
      date: new Date()
    };

    prismaMock.transaction.create.mockResolvedValue(mockTx);

    const response = await request(app)
      .post('/api/transactions')
      .send({ accountId: 1, symbol: 'BTC-USD', amount: 1, price: 50000, type: 'BUY', source: 'BOT' });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('PENDING_CONTEXT');
  });

  it('POST /api/transactions/:id/context should accept media upload', async () => {
    const mockMedia = {
      id: 1,
      url: '/uploads/dummy.jpg',
      type: 'IMAGE',
      transactionId: 1,
      createdAt: new Date()
    };

    prismaMock.transactionMedia.create.mockResolvedValue(mockMedia);

    // Using supertest's attach to simulate a file upload
    const response = await request(app)
      .post('/api/transactions/1/context')
      .attach('file', Buffer.from('fake image data'), 'test.jpg');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Media uploaded successfully. Context processing started and completed.');
    expect(response.body).toHaveProperty('mediaId', 1);
  });
});
