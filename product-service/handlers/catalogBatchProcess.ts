import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { Client } from 'pg';
import { dbOptions } from '../db-init';
import { defaultImage, headers, statusCodes } from '../constants';

export const catalogBatchProcess = async (event: SQSEvent): Promise<any> => {
  const sns = new SNS({ apiVersion: '2010-03-31', region: 'eu-west-1' });
  const client = new Client(dbOptions);
  console.log(`catalog batch process event: ${event}`);
  console.log(event.Records);

  try {
    await client.connect();
    await client.query('BEGIN');

    await Promise.all(event.Records?.map(async (item) => {
      let { title, price, image = defaultImage, description = '', count } = JSON.parse(item.body);

      // TODO create separate validation fn
      if (!title || typeof title !== 'string'
        || !price || typeof Number(price) !== 'number' || price < 0
        || !count || typeof Number(count) !== 'number' || count < 0) {
        return Promise.reject();
      } else {
        const product = await client.query(
          'INSERT INTO product (title, price, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
          [ title, price, image, description ]
        );
        await client.query(
          'INSERT INTO stock (product_id, count) VALUES ($1, $2) RETURNING *',
          [product.rows[0].id, count]
        );
        return Promise.resolve(item.body)
      }
    }))
      .catch(async (e) => {
        await client.query('ROLLBACK');

        return {
          statusCode: statusCodes.SERVER_ERROR,
          headers,
          body: JSON.stringify(e)
        }
      });

    await client.query('COMMIT');

    await sns.publish({
      Subject: 'New product in your shop',
      Message: 'One more product was added',
      TopicArn: process.env.SNS_ARN
    }).promise();

    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify({ message: 'Products were added' })
    };
  } catch (e) {
    await client.query('ROLLBACK');

    return {
      statusCode: statusCodes.SERVER_ERROR,
      headers,
      body: JSON.stringify(e)
    }
  } finally {
    client.end();
  }
};