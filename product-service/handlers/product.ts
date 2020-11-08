import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { dbOptions } from '../db-init';
import { headers, statusCodes } from '../constants';

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const client = new Client(dbOptions);
  console.log(`Get Product by id handler event: ${event.pathParameters}`);

  try {
    const { id } = event.pathParameters;
    if (!id) {
      return {
        headers,
        statusCode: statusCodes.NOT_FOUND,
        body:  JSON.stringify({ message: 'Wrong parameters' }),
      }
    }

    await client.connect();
    const product = await client.query(
        'SELECT p.id, p.title, p.image, p.description, p.price, s.count from product p INNER JOIN stock s ON p.id = s.product_id WHERE p.id = $1',
        [ id ]);

    if (product.rowCount <= 0) {
      return {
        headers,
        statusCode: statusCodes.NOT_FOUND,
        body: JSON.stringify({ message: `Product with id ${id} does not exist` }),
      }
    }

    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify(product.rows),
    };
  } catch (e) {
    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    };
  } finally {
    client.end();
  }
};
