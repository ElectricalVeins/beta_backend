import AWS, { S3 } from 'aws-sdk';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { config } from '../config/configuration-expert';

enum S3ObjectTypes {
  AUCTION_PHOTO = 'auction',
  USER_PHOTO = 'user',
}

@Injectable()
export class S3Service implements OnApplicationBootstrap {
  client = new S3({ apiVersion: '2006-03-01' });
  bucket = config.get('aws.s3bucket');

  async onApplicationBootstrap(): Promise<void> {
    AWS.config.getCredentials((err) => {
      if (err) {
        Logger.error(err.stack);
      } else {
        Logger.log(`Access key: ${AWS.config.credentials.accessKeyId}`);
      }
    });
  }

  /*TODO: implement read stream*/
  async getObjectFromBucket(key: string): Promise<[S3.Types.Body, S3.Types.GetObjectOutput]> {
    const data = await this.client
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();
    console.log(data);
    return [data.Body, data];
  }

  /*TODO: implement write stream*/
  async uploadObjectToBucket(
    objectType: S3ObjectTypes,
    object: any,
    objectName: string
  ): Promise<[string, S3.Types.PutObjectOutput]> {
    const key = `${S3ObjectTypes[objectType]}/${objectName}`;
    const data = await this.client
      .putObject({
        Bucket: this.bucket,
        Body: object,
        Key: key,
      })
      .promise();
    return [key, data];
  }

  async deleteObjectFromBucket(objectType: S3ObjectTypes, objectName: string): Promise<void> {
    const data = await this.client
      .deleteObject({
        Bucket: this.bucket,
        Key: `${S3ObjectTypes[objectType]}/${objectName}`,
      })
      .promise();
    console.log(data);
  }
}
