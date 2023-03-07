import {
  EventBridgeEvent,
  S3ObjectCreatedNotificationEventDetail
} from "aws-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import Bundlr from "@bundlr-network/client";
import { recordHandler } from "./recordHandler";

const { REGION, BUNDLR_URL, SOLANA_KEY } = process.env;

const s3Client = new S3Client({ region: REGION });
const bundlr = new Bundlr(BUNDLR_URL || "", "solana", SOLANA_KEY || "");

export const handler = async (
  event: EventBridgeEvent<
    "Object Created",
    S3ObjectCreatedNotificationEventDetail
  >
): Promise<string | unknown> => {
  console.log(event);
  return recordHandler({ s3Client, bundlr, eventDetail: event.detail });
};
