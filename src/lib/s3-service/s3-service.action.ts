'use server';

import { S3Service } from './s3-service.server';

export async function getSignedUploadUrl(key: string) {
  return await S3Service.getSignedPutUrl(key);
}
