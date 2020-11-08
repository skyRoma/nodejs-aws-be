CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  price integer
);

DROP TABLE products;

CREATE TABLE IF NOT EXISTS stocks (
  product_id uuid,
  count integer
  foreign key ("product_id") references "products" ("id")
);

DROP TABLE stocks;
