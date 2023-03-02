import "aws-sdk-client-mock-jest";
import { S3ObjectCreatedNotificationEventDetail } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
import { recordHandler } from "../recordHandler";
import { mockEventDetailMaker } from "./util/mockEventDetailMaker";

const DEST_BUCKET = "dest_bucket";

const s3Mock = mockClient(S3Client);

describe("recordHandler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    s3Mock.reset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("handles an EventBridge S3 Event", async () => {
    s3Mock.on(CopyObjectCommand).resolves({});

    const mockArg = { name: "src_bucket", key: "test.gz" };
    const mockEventDetail = mockEventDetailMaker(
      mockArg
    ) as S3ObjectCreatedNotificationEventDetail;

    const result = await recordHandler({
      s3Client: s3Mock as unknown as S3Client,
      eventDetail: mockEventDetail
    });

    expect(s3Mock).toHaveReceivedCommand(CopyObjectCommand);
    expect(s3Mock).toHaveReceivedCommandWith(CopyObjectCommand, {
      Bucket: DEST_BUCKET,
      CopySource: `/${mockArg.name}/${mockArg.key}`,
      Key: `${mockArg.name}/${mockArg.key}`
    });

    expect(result).toBe("Success");
  });

  test("handles an exception from s3Client", async () => {
    s3Mock.on(CopyObjectCommand).rejects({});

    const mockArg = { name: "src_bucket", key: "test.gz" };
    const mockEventDetail = mockEventDetailMaker(
      mockArg
    ) as S3ObjectCreatedNotificationEventDetail;

    let error;
    try {
      await recordHandler({
        s3Client: s3Mock as unknown as S3Client,
        eventDetail: mockEventDetail
      });
    } catch (err) {
      error = err;
    }

    expect(s3Mock).toHaveReceivedCommand(CopyObjectCommand);
    expect(s3Mock).toHaveReceivedCommandWith(CopyObjectCommand, {
      Bucket: DEST_BUCKET,
      CopySource: `/${mockArg.name}/${mockArg.key}`,
      Key: `${mockArg.name}/${mockArg.key}`
    });

    expect(error).toStrictEqual(new Error());
    expect(typeof error).toBe("object");
  });

  test("handles an exception from malformed event", async () => {
    let error;
    try {
      await recordHandler(
        {} as {
          s3Client: S3Client;
          eventDetail: S3ObjectCreatedNotificationEventDetail;
        }
      );
    } catch (err) {
      error = err;
    }

    expect(s3Mock).not.toHaveReceivedCommand(CopyObjectCommand);

    expect((error as unknown as TypeError).name).toStrictEqual("TypeError");
  });
});
