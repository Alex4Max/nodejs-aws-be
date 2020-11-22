import { APIGatewayProxyHandler, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { dbOptions } from '../db-init';
import { headers, statusCodes } from '../constants';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const client = new Client(dbOptions);
  console.log(`Get Product List handler event: ${event}`);

  try {
    await client.connect();
    const body = JSON.stringify((await client.query(
        'SELECT p.id, p.title, p.image, p.description, p.price, s.count from product p INNER JOIN stock s ON p.id = s.product_id')
    ).rows);

    return {
      headers,
      statusCode: statusCodes.OK,
      body,
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
