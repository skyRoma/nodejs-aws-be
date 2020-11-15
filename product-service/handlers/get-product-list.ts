import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { Product } from '../models';
import { Client } from 'pg';
import { dbConfig } from '../../db-config';
import { createResponse } from '../../helpers';

const queryString =
  'SELECT id, count, price, title, description FROM products INNER JOIN stocks ON id = product_id';

export const getProductList: APIGatewayProxyHandler = async event => {
  console.log('event', event);
  let dbClient: Client;

  try {
    dbClient = new Client(dbConfig);
    await dbClient.connect();
    const { rows } = await dbClient.query<Product>(queryString);

    return createResponse(200, rows);
  } catch (error) {
    return createResponse(500, { message: 'Internal Server Error' });
  } finally {
    if (dbClient) {
      dbClient.end();
    }
  }
};
