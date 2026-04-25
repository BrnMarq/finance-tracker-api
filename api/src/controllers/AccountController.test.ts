import request from 'supertest';
import app from '../app';
import { prismaMock } from '../singleton';

describe('AccountController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/accounts should create an account', async () => {
    const mockAccount = { id: 1, name: 'Test Portfolio', createdAt: new Date() };
    prismaMock.account.create.mockResolvedValue(mockAccount);

    const response = await request(app)
      .post('/api/accounts')
      .send({ name: 'Test Portfolio' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ...mockAccount,
      createdAt: mockAccount.createdAt.toISOString()
    });
  });

  it('GET /api/accounts should return all accounts', async () => {
    const mockAccounts = [
      { id: 1, name: 'Test Portfolio', createdAt: new Date() }
    ];
    prismaMock.account.findMany.mockResolvedValue(mockAccounts);

    const response = await request(app).get('/api/accounts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Test Portfolio');
  });
});
