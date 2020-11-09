import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from '../models';
import { Client } from 'pg';
import { dbConfig } from '../../db-config';
import { createResponse } from '../../helpers';

export const getProductByIdqueryString =
  'SELECT id, count, price, title, description FROM products INNER JOIN stocks ON id = product_id WHERE id=$1';
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
    } = await dbClient.query<Product>(getProductByIdqueryString, [productId]);

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
