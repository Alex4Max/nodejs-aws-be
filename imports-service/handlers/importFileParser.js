import { S3 } from 'aws-sdk';
import csv from 'csv-parser';

import { headers, statusCodes, BUCKET } from '../constants';

export const importFileParser = async (event) => {
  console.log('Event in parser: ');
  console.log(event);

  const s3 = new S3({ region: 'eu-west-1' });

  try {
    const record = event.Records[0];
    const key = record.s3.object.key;

    await new Promise((resolve) => {
      s3.getObject({ Bucket: BUCKET, Key: key })
        .createReadStream()
        .pipe(csv())
        .on('data', console.dir)
        .on('end', async () => {
          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: key.replace('uploaded', 'parsed')
          }).promise();
          await s3.deleteObject({
            Bucket: BUCKET,
            Key: key
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
