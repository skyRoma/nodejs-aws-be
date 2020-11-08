import axios from 'axios';

import { productsMock } from '../mocks';
import { getProductList } from './get-product-list';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;

describe('getProductList', () => {
  it('should return product list', async () => {
    const expectedResult = {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode: 200,
      body: JSON.stringify(productsMock),
    };
    axiosMock.get.mockResolvedValue({ data: productsMock });

    expect(await getProductList(null, null, null)).toEqual(expectedResult);
  });
});
