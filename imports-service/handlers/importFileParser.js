import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';
const { SQS_URL } = process.env;

import { headers, statusCodes, BUCKET } from '../constants';

export const importFileParser = async (event) => {
  console.log('Event in parser: ');
  console.log(event);

  const s3 = new S3({ region: 'eu-west-1' });
  const sqs = new SQS({ region: 'eu-west-1' });

  try {
    const record = event.Records[0];
    const key = record.s3.object.key;

    await new Promise((resolve) => {
      s3.getObject({ Bucket: BUCKET, Key: key })
        .createReadStream()
        .pipe(csv())
        .on('data', item => {
          sqs.sendMessage({
            QueueUrl: SQS_URL,
            MessageBody: JSON.stringify(item)
          }).send() })
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

    console.log('Success!');

    return {
      headers,
      statusCode: statusCodes.OK,
      body: JSON.stringify(event),
    }
  } catch (e) {
    console.log('Error occurred!');
    console.log(e);

    return {
      headers,
      statusCode: statusCodes.SERVER_ERROR,
      body: JSON.stringify(e),
    }
  }
};
