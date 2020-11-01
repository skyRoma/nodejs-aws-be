import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import axios from 'axios';

import { Product } from '../models';

export const getProductList: APIGatewayProxyHandler = async () => {
  const products = await axios.get<Product[]>(
    'https://s3.eu-west-1.amazonaws.com/shop-database/product-list.json'
  );

  return {
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode: 200,
    body: JSON.stringify(products.data),
  };
};
