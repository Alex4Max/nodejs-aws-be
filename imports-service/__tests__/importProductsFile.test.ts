
import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '../handler';
import { headers } from '../constants';

describe('ImportProductsFile', () => {
  afterEach(() => { AWSMock.restore(); });
  // const params = {
  //   Bucket: 'some_bucket',
  //   Key: 'path',
  //   Expires: 60,
  //   ContentType: 'text/csv',
  // };

  it('Should return success response', async () => {
    AWSMock.mock('S3','getSignedUrl', (operation, params, callback) => {
      return callback(null, 'some_path');
    });

    const result = await importProductsFile({ queryStringParameters: { name: 'file.csv' }});

    expect(result).toEqual({
      headers,
      statusCode: 200,
      body: JSON.stringify('some_path'),
    });
  });

  it('Should return fail response if there is no file name', async () => {
    AWSMock.mock('S3','getSignedUrl', (operation, params, callback) => {
      return callback(null, 'some_path');
    });

    const result = await importProductsFile({ queryStringParameters: { name: null}});

    expect(result).toEqual({
      headers,
      statusCode: 404,
      body: JSON.stringify('File name must be provided'),
    });
  });

  it('Should return fail response if there is no file name', async () => {
    AWSMock.mock('S3','getSignedUrl', (operation, params, callback) => {
      throw new Error('error');
    });

    let message;
    try {
       await importProductsFile({ queryStringParameters: { name: 'file.csv'}});
    } catch (e) {
      message = e;
    }

    expect(result).toEqual({
      headers,
      statusCode: 500,
      body: JSON.stringify(message),
    });
  });
});
