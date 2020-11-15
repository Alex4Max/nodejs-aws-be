import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import { headers, statusCodes, BUCKET } from '../constants';

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('Import data lambda event: ');
  console.log(event);
  try {
    const fileName = event.queryStringParameters?.name;

    console.log(fileName);

    if (!fileName) {
      return {
        headers,
        statusCode: statusCodes.NOT_FOUND,
        body: JSON.stringify('File name must be provided'),
      }
    }
    const catalogPath = `uploaded/${fileName}`;

    const s3 = new S3({ region: 'eu-west-1' });
    const params = {
      Bucket: BUCKET,
      Key: catalogPath,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const body = await s3.getSignedUrlPromise('putObject', params);

    return {
      headers,
      statusCode: statusCodes.OK,
      body,
    }
  } catch (e) {
    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    }

  }
}

