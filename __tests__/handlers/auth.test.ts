import {
  beforeAll,
  afterAll,
  describe,
  expect,
  it,
  expectTypeOf,
  vi,
} from "vitest";
import { Request, Response } from "express";
import { CreateExpressTestApp } from ".";
import { auth } from "../../src/handlers/index";
import { AxiosRequestConfig } from "axios";
import { secrets } from "../../src/constants";

let app, server;
const mockDB = {
  user: {
    findFirstOrThrow: vi.fn().mockImplementation(() => {}),
  },
};

// Guide: https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o

beforeAll(() => {
  app = CreateExpressTestApp();
  app.get(
    "/test",
    auth.handle(false, true),
    (req: Request, res: Response) => {}
  );

  app.get(
    "/test/ignoreExpiry",
    auth.handle(true, true),
    (req: Request, res: Response) => {}
  );

  server = app.listen(3000);
});

afterAll(() => {
  server.close();
});

describe("Auth Handler", () => {
  const requestConfig: AxiosRequestConfig = {
    url: "/test",
    method: "GET",
    headers: {
      secret_app_key: secrets.SECRET_APP_KEY,
      // Authorization:
    },
  };
});
