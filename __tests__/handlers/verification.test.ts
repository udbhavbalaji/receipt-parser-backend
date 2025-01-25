import { Request, Response } from "express";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  expectTypeOf,
} from "vitest";
import { CreateExpressTestApp, TestErrorController } from ".";
import verifyApp from "../../src/handlers/app-verification";
import {
  HTTPStatusCodes,
  SpentAPIErrorResponse,
  SpentAPIExceptionCodes,
} from "../../src/types";
import { secrets } from "../../src/constants";
import axios from ".";
import { AxiosRequestConfig } from "axios";
import { testErrorResponse } from "..";

let app, server;

beforeAll(() => {
  app = CreateExpressTestApp();
  app.use(verifyApp.handle);
  app.get("/api/test", (req: Request, res: Response) => {
    if (!req.headers.secret_app_key && req.headers.app_validated === "Y") {
      res.sendStatus(HTTPStatusCodes.OK);
    } else {
      res.sendStatus(HTTPStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  app.use(TestErrorController("ForbiddenError"));
  server = app.listen(8000);
});

afterAll(() => {
  server.close();
});

describe("App Verification Handler", () => {
  const requestConfig: AxiosRequestConfig = {
    url: "/test",
    method: "GET",
  };

  describe("Should throw an error if the secret app key is missing or invalid", () => {
    it("Invalid app key", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: "invalid",
        },
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.FORBIDDEN);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.INVALID_APP_KEY
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).toBeUndefined();
    });

    it("Missing app key", async () => {
      const response = await axios.request({
        ...requestConfig,
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.FORBIDDEN);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.UNVERIFIED_APP
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).toBeUndefined();
    });
  });

  it("Should pass through without any errors if the secret app key is present and valid", async () => {
    const response = await axios.request({
      ...requestConfig,
      headers: {
        secret_app_key: secrets.SECRET_APP_KEY,
      },
    });

    expect(response.status).toBe(HTTPStatusCodes.OK);
    expect(response.data).toBe("OK");
  });
});
