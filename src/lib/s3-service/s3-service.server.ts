import 'server-only';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Config = {
  accountId: process.env.S3_ACCOUNT_ID!,
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  bucketName: process.env.S3_BUCKET_NAME!,
  objectUrl: process.env.NEXT_PUBLIC_R2_OBJECT_DOMAIN!,
};

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${s3Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
});

export class S3Service {
  static async getSignedPutUrl(key: string) {
    const uploadedKey = `${Date.now()}-${key}`;
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: uploadedKey,
    });

    return {
      uploadUrl: await getSignedUrl(s3, command),
      uploadedUrl: `${s3Config.objectUrl}/${uploadedKey}`,
    };
  }

  static async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    const res = await s3.send(command);

    return {
      ok: res.$metadata.httpStatusCode === 204,
    };
  }
}
