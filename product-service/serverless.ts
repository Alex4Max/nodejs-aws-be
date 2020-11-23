import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: [{
        'Fn::GetAtt': ['SQSQueue', 'Arn'],
      }],
    }, {
      Effect: 'Allow',
      Action: 'sns:*',
      Resource: {
        Ref: 'SNSTopic',
      },
    }],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'my-product-queue'
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'my-product-topic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'sashamasj@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
    },
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'SQSQueue',
        }
      },
      ProductQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
      },
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [{
        http: {
          method: 'get',
          path: 'product/list',
          cors: true,
        },
      }],
    },
    getProductById: {
      handler: 'handler.getProductById',
      events: [{
        http: {
          method: 'get',
          path: 'product/{id}',
          cors: true,
        },
      }],
    },
    addProduct: {
      handler: 'handler.postNewProduct',
      events: [{
        http: {
          method: 'post',
          path: 'product/add',
          cors: true,
        },
      }],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [{
        sqs: {
          batchSize: 3,
          arn: {
            'Fn::GetAtt': [ 'SQSQueue', 'Arn' ],
          },
        },
      }],
    },
  },
};

module.exports = serverlessConfiguration;
