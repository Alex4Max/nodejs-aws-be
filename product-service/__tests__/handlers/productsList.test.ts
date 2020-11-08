import { Client } from 'pg';
import { getProductsList } from '../../handlers/productsList';
import { headers } from '../../constants';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const data = [
  { "id": "1", "name": "p1", "price": 2.5, "title": "p1-1" },
  { "id": "2", "name": "p2", "price": 100,  "title": "p2-1" },
];

const mockData = [
  { id: '1', name: 'p1', price: 2.5, title: 'p1-1' },
  { id: '2', name: 'p2', price: 100,  title: 'p2-1' }
];

describe('productsList module', () => {
  let client: any;
  beforeEach(() => client = new Client());
  afterEach(() =>  jest.clearAllMocks());

  describe('getProductsList function', () => {
    test('Should return products list and status 200',  async () => {
      client.query.mockResolvedValueOnce({ rows: data, rowCount: 2 });

      const result = await getProductsList({} as any, {} as any, () => {});

      expect(result).toEqual({
        headers,
        statusCode: 200,
        body: JSON.stringify(mockData),
      });
    });
  });
});
