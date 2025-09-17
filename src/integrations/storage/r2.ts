import { S3Client } from "@aws-sdk/client-s3";
import type { FinalizeHandler, FinalizeHandlerArguments, MetadataBearer } from "@aws-sdk/types";

// Common R2 configuration
function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID!;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 env missing: R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
  }

  return {
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  };
}

// Checksum stripping middleware
function addChecksumStrippingMiddleware(s3: S3Client) {
  s3.middlewareStack.addRelativeTo(
    <Output extends MetadataBearer = MetadataBearer>(next: FinalizeHandler<any, Output>) =>
      async (args: FinalizeHandlerArguments<any>) => {
        const req: any = args.request;
        if (req?.headers) {
          delete req.headers["x-amz-sdk-checksum-algorithm"];
          delete req.headers["x-amz-checksum-crc32"];
          delete req.headers["x-amz-checksum-crc32c"];
          delete req.headers["x-amz-checksum-sha1"];
          delete req.headers["x-amz-checksum-sha256"];
        }
        return next(args);
      },
    { relation: "before", toMiddleware: "awsAuthMiddleware", name: "stripChecksumHeaders" }
  );
}

export function createR2Client() {
  return new S3Client(getR2Config());
}

export function createR2UploadClient() {
  const s3 = new S3Client(getR2Config());
  
  // Remove checksum middleware and add stripping middleware
  try {
    s3.middlewareStack.remove("flexibleChecksumsMiddleware");
  } catch { /* ignore if not present */ }
  
  addChecksumStrippingMiddleware(s3);
  return s3;
}
