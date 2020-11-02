import { getProductById } from '../../handlers/product';
import { headers } from '../../constants';

jest.mock('../../products.json', () => ([
  { "id": "1", "name": "p1", "price": 2.5, "title": "p1-1" },
  { "id": "2", "name": "p2", "price": 100,  "title": "p2-1" },
]));

const mockData = { id: '1', name: 'p1', price: 2.5, title: 'p1-1' };

describe('product module', () => {
  beforeEach(() => jest.resetModules());

  describe('getProductById function', () => {
    test('Should return product and status 200',  async() => {
      const result = await getProductById({ pathParameters: { id: '1' }} as any, {} as any, () => {});
      expect(result).toEqual({
        headers,
        statusCode: 200,
        body: JSON.stringify(mockData),
      });
    });

    test('Should return error message and status 404 if no parameters were passed',  async() => {
      const result = await getProductById({ pathParameters: {}} as any, {} as any, () => {});
      expect(result).toEqual({
        headers,
        statusCode: 404,
        body: JSON.stringify({ message: 'Wrong parameters' }),
      });
    });

    test('Should return error message and status 404 if there is no product with such id',  async() => {
      const result = await getProductById({ pathParameters: { id: '4' }} as any, {} as any, () => {});
      expect(result).toEqual({
        headers,
        statusCode: 404,
        body: JSON.stringify({ message: `Product with id 4 does not exist` }),
      });
    });
  });
});
