import { getProductsList } from '../../handlers/productsList';
import { headers } from '../../constants';

jest.mock('../../products.json', () => ([
  { "id": "1", "name": "p1", "price": 2.5, "title": "p1-1" },
  { "id": "2", "name": "p2", "price": 100,  "title": "p2-1" },
]));

const mockData = [
  { id: '1', name: 'p1', price: 2.5, title: 'p1-1' },
  { id: '2', name: 'p2', price: 100,  title: 'p2-1' }
];

describe('productsList module', () => {
  beforeEach(() => jest.resetModules());

  describe('getProductsList function', () => {
    test('Should return products list and status 200',  async () => {
      const result = await getProductsList({} as any, {} as any, () => {});
      expect(result).toEqual({
        headers,
        statusCode: 200,
        body: JSON.stringify(mockData),
      });
    });
  });
});
