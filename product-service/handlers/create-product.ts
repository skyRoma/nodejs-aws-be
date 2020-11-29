import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { Product, ProductSchema } from '../models';
import { Client } from 'pg';
import { dbConfig } from '../../db-config';
import { createResponse } from '../../helpers';
import {
  CREATE_PRODUCT_QUERY_STRING,
  CREATE_STOCK_QUERY_STRING,
  GET_PRODUCT_BY_ID_QUERY_STRING,
  INVALID_PRODUCT_DATA_MSG,
} from '../constants';

export const createProduct: APIGatewayProxyHandler = async ({ body }) => {
  console.log('body: ', body);
  let dbClient: Client;

  try {
    const isProductValid = await ProductSchema.isValid(JSON.parse(body));
    if (!isProductValid) {
      throw new Error(INVALID_PRODUCT_DATA_MSG);
    }
    const { title, description, price, count } = JSON.parse(body);
    dbClient = new Client(dbConfig);
    await dbClient.connect();
    await dbClient.query('BEGIN');

    const {
      rows: [{ id: newProductId }],
    } = await dbClient.query<Product>(CREATE_PRODUCT_QUERY_STRING, [
      title,
      description,
      price,
    ]);

    await dbClient.query<Product>(CREATE_STOCK_QUERY_STRING, [
      newProductId,
      count,
    ]);

    const {
      rows: [product],
    } = await dbClient.query<Product>(GET_PRODUCT_BY_ID_QUERY_STRING, [
      newProductId,
    ]);

    await dbClient.query('COMMIT');

    return createResponse(201, product);
  } catch ({ message }) {
    if (dbClient) {
      await dbClient.query('ROLLBACK');
    }

    if (message === INVALID_PRODUCT_DATA_MSG) {
      return createResponse(400, { message });
    }

    return createResponse(500, { message: 'Internal Server Error' });
  } finally {
    if (dbClient) {
      dbClient.end();
    }
  }
};
