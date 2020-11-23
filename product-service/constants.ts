export const INVALID_PRODUCT_DATA_MSG = 'Product data is invalid';

export const CREATE_PRODUCT_QUERY_STRING =
  'INSERT INTO products(title, description, price) VALUES ($1, $2, $3) RETURNING id';
export const CREATE_STOCK_QUERY_STRING =
  'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
export const GET_PRODUCT_BY_ID_QUERY_STRING =
  'SELECT id, count, price, title, description FROM products INNER JOIN stocks ON id = product_id WHERE id=$1';
