import { S3ObjectCreatedNotificationEventDetail } from "aws-lambda";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";

const { DEST_BUCKET } = process.env;

export const recordHandler = async ({
  s3Client,
  eventDetail
}: {
  s3Client: S3Client;
  eventDetail: S3ObjectCreatedNotificationEventDetail;
}): Promise<string | unknown> => {
  try {
    console.log(eventDetail);

    const srcBucketName = eventDetail.bucket.name; // Foundation bucket that file was written into
    const srcObjectKey = decodeURIComponent(
      eventDetail.object.key.replace(/\+/g, " ")
    ); // Should be of format <record-type>.<unix-ms-ts>.gz

    const params = {
      Bucket: DEST_BUCKET,
      CopySource: `/${srcBucketName}/${srcObjectKey}`,
      Key: `${srcBucketName}/${srcObjectKey}`
    };
    console.log("params", params);

    const data = await s3Client.send(new CopyObjectCommand(params));
    console.log("Success", data);

    return "Success"; // For unit tests;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
