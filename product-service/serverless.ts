import type { Serverless } from 'serverless/aws';
import { REGION } from '../constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'be-product-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dotenv: {
      path: '../.env',
      basePath: '../',
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: REGION,
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
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'SNSTopic' },
      },
    ],
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductList',
      events: [
        {
          http: {
            method: 'get',
            path: '/products',
          },
        },
      ],
    },
    getProductById: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
          },
        },
      ],
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      SNSSuccessBatchSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.SUCCESS_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
          FilterPolicy: {
            isBatchSuccess: ['true'],
          },
        },
      },
      SNSFailedBatchSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.UNSUCCESS_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
          FilterPolicy: {
            isBatchSuccess: ['false'],
          },
        },
      },
    },
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'SQSQueue',
        },
        Export: {
          Name: 'SQSQueueUrl',
        },
      },
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
        Export: {
          Name: 'SQSQueueArn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
