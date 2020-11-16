const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

describe('ImportProductsFile', () => {

  afterEach(() => {
    AWSMock.restore();
  });

  it('Should return success response when a file was fulfilled', async () => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3','getSignedUrl', (operation, params, callback) => {
      return callback(null, 'path');
    });
    const params = {
      Bucket: 'any-bucket',
      Key: {},
      Expires: 60,
      ContentType: 'text/csv',
    };

    const s3Mock = new AWS.S3({ region: 'eu-west-1' });
    const url = await s3Mock.getSignedUrlPromise('putObject', params);

    expect(url).toEqual('path');

    AWSMock.restore('S3');
  });
});
