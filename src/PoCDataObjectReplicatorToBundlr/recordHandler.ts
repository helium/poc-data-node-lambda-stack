import { S3ObjectCreatedNotificationEventDetail } from "aws-lambda";
import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand
} from "@aws-sdk/client-s3";
import Bundlr from "@bundlr-network/client";
import { Readable } from "stream";
import { extractComponentsFromFilename } from "./utils/extractComponentsFromFilename";
import { createArweaveTags } from "./utils/createArweaveTags";

export const recordHandler = async ({
  s3Client,
  bundlr,
  eventDetail
}: {
  s3Client: S3Client;
  bundlr: Bundlr;
  eventDetail: S3ObjectCreatedNotificationEventDetail;
}): Promise<string | unknown> => {
  try {
    console.log(eventDetail);

    const srcBucketName = eventDetail.bucket.name; // Foundation bucket that file was written into
    const srcObjectKey = decodeURIComponent(
      eventDetail.object.key.replace(/\+/g, " ")
    ); // Should be of format <record-type>.<unix-ms-ts>.gz

    const params = {
      Bucket: srcBucketName,
      Key: srcObjectKey
    };
    console.log("params", params);

    const { ETag } = await s3Client.send(new HeadObjectCommand(params));
    const { Body } = await s3Client.send(new GetObjectCommand(params));

    if (!Body) {
      throw new Error("data.Body is undefined");
    }
    if (!(Body instanceof Readable)) {
      throw new Error("data.Body is not an instanceof Readable");
    }

    const { fileType, isoDateComponents } =
      extractComponentsFromFilename(srcObjectKey);
    const tags = createArweaveTags({
      fileType,
      isoDateComponents,
      filename: srcObjectKey,
      MD5: ETag || ""
    });

    await bundlr.upload(Body, {
      tags,
    });

    return "Success" // for unit testing
  } catch (err) {
    console.error(err);
    throw err;
  }
};
