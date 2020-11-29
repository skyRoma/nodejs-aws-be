import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from '../models';
import { Client } from 'pg';
import { dbConfig } from '../../db-config';
import { createResponse } from '../../helpers';
import { GET_PRODUCT_BY_ID_QUERY_STRING } from '../constants';

const productNotFoundMsg = 'Product not found';

export const getProductById: APIGatewayProxyHandler = async ({
  pathParameters: { productId },
}) => {
  console.log('productId: ', productId);
  let dbClient: Client;

  try {
    dbClient = new Client(dbConfig);
    await dbClient.connect();
    const {
      rows: [product],
    } = await dbClient.query<Product>(GET_PRODUCT_BY_ID_QUERY_STRING, [
      productId,
    ]);

    if (product) {
      return createResponse(200, product);
    }

    throw new Error(productNotFoundMsg);
  } catch ({ message }) {
    if (message === productNotFoundMsg) {
      return createResponse(404, { message });
    }

    return createResponse(500, { message: 'Internal Server Error' });
  } finally {
    if (dbClient) {
      dbClient.end();
    }
  }
};
