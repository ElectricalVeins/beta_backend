import { S3, config as AWSConfig } from 'aws-sdk';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import config from '../../config/configuration-expert';

export enum S3ObjectTypesEnum {
  AUCTION_PHOTO = 'auction',
  USER_PHOTO = 'user',
}

@Injectable()
export class S3Service implements OnApplicationBootstrap {
  private readonly logger = new Logger(S3Service.name);
  private readonly client = new S3({ apiVersion: '2006-03-01' });
  private readonly bucket = config.get('aws.s3bucket');

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Checking AWS credentials...');
    AWSConfig.getCredentials((err) => {
      if (err) {
        this.logger.error(err.stack);
      } else {
        this.logger.log(`AWS credentials: OK`);
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
    objectType: S3ObjectTypesEnum,
    object: any,
    objectName: string
  ): Promise<[string, S3.Types.PutObjectOutput]> {
    const key = `${S3ObjectTypesEnum[objectType]}/${objectName}`;
    const data = await this.client
      .putObject({
        Bucket: this.bucket,
        Body: object,
        Key: key,
      })
      .promise();
    return [key, data];
  }

  async deleteObjectFromBucket(objectType: S3ObjectTypesEnum, objectName: string): Promise<void> {
    const data = await this.client
      .deleteObject({
        Bucket: this.bucket,
        Key: `${S3ObjectTypesEnum[objectType]}/${objectName}`,
      })
      .promise();
    console.log(data);
  }
}
