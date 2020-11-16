import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../../constants';
import { createResponse } from '../../helpers';

export const importProductsFile: APIGatewayProxyHandler = async event => {
  try {
    const { name } = event.queryStringParameters;
    const path = `uploaded/${name}`;
    const s3 = new S3({ region: REGION });
    const params = {
      Bucket: BUCKET_NAME,
      Key: path,
      Expires: 60,
      ContentType: 'text/csv',
    };
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    return createResponse(200, signedUrl);
  } catch (err) {
    return createResponse(500, { message: 'Internal Server Error' });
  }
};
