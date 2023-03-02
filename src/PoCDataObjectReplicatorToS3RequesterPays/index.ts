import {
  EventBridgeEvent,
  S3ObjectCreatedNotificationEventDetail
} from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { recordHandler } from "./recordHandler";

const { REGION } = process.env;

const s3Client = new S3Client({ region: REGION });

export const handler = async (
  event: EventBridgeEvent<
    "Object Created",
    S3ObjectCreatedNotificationEventDetail
  >
): Promise<string | unknown> => {
  console.log(event);
  return recordHandler({ s3Client, eventDetail: event.detail });
};
