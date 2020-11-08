-- Create product table:
CREATE TABLE IF NOT EXISTS product (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT null,
  price INT NOT null,
  image TEXT,
  description TEXT
);

-- Create stock table:
CREATE TABlE IF NOT EXISTS stock (
  id serial PRIMARY KEY,
  product_id uuid NOT null,
  count INT NOT null,
  foreign key (product_id) REFERENCES product(id)
);

ALTER TABLE stock
ADD CONSTRAINT product_id_unique UNIQUE (product_id);
