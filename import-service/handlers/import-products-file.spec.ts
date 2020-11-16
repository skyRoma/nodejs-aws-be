import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWSMock from 'aws-sdk-mock';
import { createResponse } from '../../helpers';

import { importProductsFile } from './import-products-file';

describe('importProductsFile', () => {
  it('should return signed url', async () => {
    const mockedUrl = 'mockedUrl';
    AWSMock.mock('S3', 'getSignedUrl', (_operation, _params, cb) => {
      cb(null, mockedUrl);
    });

    expect(
      await importProductsFile(
        ({
          queryStringParameters: { name: 'name' },
        } as unknown) as APIGatewayProxyEvent,
        null,
        null
      )
    ).toEqual(createResponse(200, mockedUrl));
  });

  it('should return error response', async () => {
    expect(await importProductsFile(null, null, null)).toEqual(
      createResponse(500, { message: 'Internal Server Error' })
    );
  });
});
