import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import axios from 'axios';

import { Product } from '../models';

export const getProductById: APIGatewayProxyHandler = async ({
  pathParameters: { productId },
}) => {
  try {
    const products = await axios.get<Product[]>(
      'https://s3.eu-west-1.amazonaws.com/shop-database/product-list.json'
    );
    const product = products.data.find(p => p.id === productId);
    if (product) {
      return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: 200,
        body: JSON.stringify(product),
      };
    }
    throw new Error('Product not found');
  } catch (err) {
    return {
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode: 404,
      body: err.message,
    };
  }
};
