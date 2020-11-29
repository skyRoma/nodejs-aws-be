import { S3Handler } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../../constants';
import csv from 'csv-parser';

export const importFileParser: S3Handler = ({ Records }) => {
  try {
    const s3 = new S3({ region: REGION });
    const sqs = new SQS({ region: REGION });

    for (const record of Records) {
      const { key: filePath } = record.s3.object;

      s3.getObject({
        Bucket: BUCKET_NAME,
        Key: filePath,
      })
        .createReadStream()
        .pipe(csv())
        .on('data', data => {
          console.log(data);
          sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_QUEUE_URL,
              MessageBody: JSON.stringify(data),
            },
            () => {
              console.log(
                `Send message with ${JSON.stringify(data)} to ${
                  process.env.SQS_QUEUE_URL
                }`
              );
            }
          );
        })
        .on('end', async () => {
          await s3
            .copyObject({
              Bucket: BUCKET_NAME,
              CopySource: BUCKET_NAME + '/' + filePath,
              Key: filePath.replace('uploaded', 'parsed'),
            })
            .promise();

          console.log(`${filePath} copied`);

          await s3
            .deleteObject({ Bucket: BUCKET_NAME, Key: filePath })
            .promise();

          console.log(`${filePath} deleted`);
        });
    }
  } catch (err) {
    console.error(err);
  }
};
