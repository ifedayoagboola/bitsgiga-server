import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createR2Client, createR2UploadClient } from '@src/integrations/storage/r2';
import variables from '@src/variables';

const s3 = createR2Client();
const uploadS3 = createR2UploadClient();
const BUCKET = variables.storage.r2.bucket as string;

export async function presignUpload(
  key: string,
  contentType: string = 'application/octet-stream',
  ttlSec: number = 60
): Promise<string> {
  const cmd = new PutObjectCommand({ 
    Bucket: BUCKET, 
    Key: key, 
    ContentType: contentType
  });
  return getSignedUrl(uploadS3, cmd, { expiresIn: ttlSec });
}

export async function presignDownload(key: string, ttlSec: number = 3600): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: ttlSec });
}

export async function deleteObject(key: string): Promise<void> {
  const cmd = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3.send(cmd);
}

export function validateContentType(contentType: string): boolean {
  const allowed = variables.storage.upload.allowedMime;
  return !allowed.length || allowed.includes(contentType);
}

