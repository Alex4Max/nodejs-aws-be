import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { dbOptions } from '../db-init';
import { headers, statusCodes, defaultImage } from '../constants';

export const postNewProduct: APIGatewayProxyHandler = async (event) => {
  const client = new Client(dbOptions);
  console.log(`Post Product List handler event: ${event}`);

  const result: { headers: any, statusCode: statusCodes, body: string} = {
    headers,
    statusCode: statusCodes.BAD_REQUEST,
    body: '',
  };

  try {
    let { title, price, image = defaultImage, description = '', count } = JSON.parse(event.body);

    if (!title || typeof title !== 'string') {
      result.body = JSON.stringify({ message: 'The title of product must be non-empty string!' });
      return result;
    }

    if (!price || typeof price !== 'number' || price < 0) {
      result.body = JSON.stringify({ message: 'Wrong value for a price' });
      return result;
    }

    if (!count || typeof count !== 'number' || count < 0) {
      result.body = JSON.stringify({ message: 'Product count must be greater than zero number'});
      return result;
    }

    await client.connect();
    await client.query('BEGIN');
    const product = await client.query(
      'INSERT INTO product (title, price, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [ title, price, image, description ]
    );
    const stock = await client.query(
      'INSERT INTO stock (product_id, count) VALUES ($1, $2) RETURNING *',
      [product.rows[0].id, count]
    );
    await client.query('COMMIT');

    result.statusCode = statusCodes.OK;
    result.body = JSON.stringify({ ...product.rows[0], count: stock.rows[0].count });

    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    result.statusCode = statusCodes.SERVER_ERROR;
    result.body = JSON.stringify(e);

    return result;
  } finally {
    client.end();
  }
};