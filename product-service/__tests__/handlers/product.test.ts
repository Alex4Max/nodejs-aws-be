import { Client } from 'pg';
import { getProductById } from '../../handlers/product';
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

const mockData = { id: '1', name: 'p1', price: 2.5, title: 'p1-1' };

describe('product module', () => {
  let client: any;
  beforeEach(() => client = new Client());
  afterEach(() =>  jest.clearAllMocks());

  describe('getProductById function', () => {
    test('Should return product and status 200',  async() => {
      client.query.mockResolvedValueOnce({ rows: data[0], rowCount: 1 });

      const result = await getProductById({ pathParameters: { id: '1' }} as any, {} as any, () => {});

      expect(result).toEqual({
        headers,
        statusCode: 200,
        body: JSON.stringify(mockData),
      });
    });

    test('Should return error message and status 404 if no parameters were passed',  async() => {
      client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const result = await getProductById({ pathParameters: {}} as any, {} as any, () => {});

      expect(result).toEqual({
        headers,
        statusCode: 404,
        body: JSON.stringify({ message: 'Wrong parameters' }),
      });
    });

    test('Should return error message and status 404 if there is no product with such id',  async() => {
      client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const result = await getProductById({ pathParameters: { id: '4' }} as any, {} as any, () => {});

      expect(result).toEqual({
        headers,
        statusCode: 404,
        body: JSON.stringify({ message: `Product with id 4 does not exist` }),
      });
    });
  });
});
