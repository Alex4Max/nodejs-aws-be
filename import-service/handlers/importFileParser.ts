import { S3 } from 'aws-sdk';
// import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import * as csv from 'csv-parser';

import { headers, statusCodes, BUCKET } from '../constants';

export const importFileParser = async (event: any) => {
  const s3 = new S3({ region: 'eu-west-1' });

  try {
    const record = event.Records?.[0];
    const file = record.s3.object.key;

    await new Promise((resolve) => {
      s3.getObject({
        Bucket: BUCKET,
        Key: file
      })
        .createReadStream()
        .pipe(csv())
        .on('data', console.dir)
        .on('end', async () => {
          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${file}`,
            Key: file.replace('uploaded', 'parsed')
          }).promise();
          await s3.deleteObject({
            Bucket: BUCKET,
            Key: file
          }).promise();
          resolve();
        })
    });

    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify(event),
    }
  } catch (e) {
    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    }
  }
};
