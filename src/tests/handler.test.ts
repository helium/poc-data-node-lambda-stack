import "aws-sdk-client-mock-jest";
import {
  EventBridgeEvent,
  S3ObjectCreatedNotificationEventDetail
} from "aws-lambda";
import { handler } from "..";
import { recordHandler } from "../recordHandler";
import { mockEventDetailMaker } from "./util/mockEventDetailMaker";

jest.mock("@aws-sdk/client-s3");
jest.mock("../recordHandler");

describe("handler", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  test("invokes recordHandler", async () => {
    (recordHandler as jest.Mock).mockImplementation();

    const mockArg = { name: "src_bucket", key: "test.1234567891011.gz" };
    const mockEventDetail = mockEventDetailMaker(
      mockArg
    ) as S3ObjectCreatedNotificationEventDetail;
    const mockEvent = {
      detail: mockEventDetail
    } as EventBridgeEvent<
      "Object Created",
      S3ObjectCreatedNotificationEventDetail
    >;

    await handler(mockEvent);

    expect(recordHandler).toHaveBeenCalledTimes(1);
    expect(recordHandler).toHaveBeenCalledWith({
      eventDetail: mockEventDetail,
      s3Client: {}
    });
  });

  test("handles error when recordHandler throws", async () => {
    (recordHandler as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const mockEventDetail = {};
    const mockEvent = {
      detail: mockEventDetail
    } as EventBridgeEvent<
      "Object Created",
      S3ObjectCreatedNotificationEventDetail
    >;

    try {
      await handler(mockEvent);
    } catch (err) {
      expect((err as unknown as Error).name).toStrictEqual("Error");
    }

    expect(recordHandler).toHaveBeenCalledTimes(1);
    expect(recordHandler).toHaveBeenCalledWith({
      eventDetail: mockEventDetail,
      s3Client: {}
    });
  });
});
