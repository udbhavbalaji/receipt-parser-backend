import {
  describe,
  expect,
  expectTypeOf,
  it,
  afterAll,
  beforeAll,
} from "vitest";
import { secrets } from "../../src/constants";
import {
  HTTPStatusCodes,
  SpentAPIErrorResponse,
  SpentAPIExceptionCodes,
  SpentAPIObjectResponse,
  SpentAPIStringResponse,
} from "../../src/types";
import axios from ".";
import { testErrorResponse } from "..";
import { AxiosRequestConfig } from "axios";
import db from "../../src/prisma";
import CreateExpressApp from "../../src/app";
import { omit } from "lodash";

let app, server;

beforeAll(() => {
  app = CreateExpressApp();
  server = app.listen(3000);
});

afterAll(async () => {
  const modelNames = Object.keys(db).filter(
    (key) =>
      !key.startsWith("_") && key !== "disconnect" && !key.startsWith("$")
  );

  for (const model of modelNames) {
    await db[model].deleteMany();
  }

  db.$disconnect();
  server.close();
});

describe("User Registration Route", () => {
  const requestConfig: AxiosRequestConfig = {
    url: "/register",
    method: "POST",
    headers: {
      secret_app_key: secrets.SECRET_APP_KEY,
    },
  };

  const sampleData = {
    firstName: "John",
    lastName: "Doe",
    email: "1BZtH@example.com",
    password: "$2a$10$cPOGtKnzFbNgHP9iUQMc7u8yHwhor.dkbOkpKWjfZOyPMSLOxtP12",
  };

  describe("Test user registration and ensure no duplicate login is possible", () => {
    it("Should register a new user", async () => {
      const response = await axios.request({
        ...requestConfig,
        data: sampleData,
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.CREATED);
      expect(responseData.type).toBe("string");
      expect(responseData.body).toBe("Created");
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIStringResponse>();
    });

    it("Should throw an error for duplicate registration", async () => {
      const response = await axios.request({
        ...requestConfig,
        data: sampleData,
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.BAD_REQUEST);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.ALREADY_EXISTS
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });
  });

  describe("Should throw an error if the request body is missing or not in the correct format", () => {
    it("Should throw an error if request body is missing", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });
  });

  it("Should throw an error if the request body is missing required data", async () => {
    const response = await axios.request({
      ...requestConfig,
      headers: {
        secret_app_key: secrets.SECRET_APP_KEY,
      },
      data: omit(sampleData, "firstName"),
    });

    const responseData = response.data;

    expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
    expect(responseData.type).toBe("error");
    expect(responseData.errorCode).toBe(
      SpentAPIExceptionCodes.VALIDATION_ERROR
    );
    expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
    expect(responseData.errors).not.toBeNull();
  });

  it("Should throw an error if the user tries to enter invalid email", async () => {
    const response = await axios.request({
      ...requestConfig,
      headers: {
        secret_app_key: secrets.SECRET_APP_KEY,
      },
      data: { ...sampleData, email: "invalid" },
    });

    const responseData = response.data;

    expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
    expect(responseData.type).toBe("error");
    expect(responseData.errorCode).toBe(
      SpentAPIExceptionCodes.VALIDATION_ERROR
    );
    expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
    expect(responseData.errors).not.toBeNull();
  });

  it("Should throw an error if the user tries to enter a password that's too short", async () => {
    const response = await axios.request({
      ...requestConfig,
      headers: {
        secret_app_key: secrets.SECRET_APP_KEY,
      },
      data: { ...sampleData, password: "123" },
    });

    const responseData = response.data;

    expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
    expect(responseData.type).toBe("error");
    expect(responseData.errorCode).toBe(
      SpentAPIExceptionCodes.VALIDATION_ERROR
    );
    expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
    expect(responseData.errors).not.toBeNull();
  });
});

describe("Login route", () => {
  const requestConfig: AxiosRequestConfig = {
    url: "/login",
    method: "PUT",
    headers: {
      secret_app_key: secrets.SECRET_APP_KEY,
    },
  };

  const sampleData = {
    email: "1BZtH@example.com",
    password: "testing123",
  };

  describe("Should throw an error if the request body is missing or not in the correct format", () => {
    it("Should throw an error if request body is missing", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });

    it("Should throw an error if the request body is missing required data", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: omit(sampleData, "password"),
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });

    it("Should throw an error if the user tries to enter invalid email", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: { ...sampleData, email: "invalid" },
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });

    it("Should throw an error if the user tries to enter a password that's too short", async () => {
      const response = await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: { ...sampleData, email: "invalid" },
      });

      const responseData = response.data;

      expect(responseData.status).toBe(HTTPStatusCodes.UNPROCESSABLE_CONTENT);
      expect(responseData.type).toBe("error");
      expect(responseData.errorCode).toBe(
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      expect(responseData.errors).not.toBeNull();
    });

    describe("Given valid input data, should log the user in if credentials are correct", () => {
      // fixme: need to fix this test so that the error code being sent is unauthorized and not bad request (can tell if email or password is wrong if status codes sent back are different)
      it("Should throw an error if users email isn't found", async () => {
        const response = await axios.request({
          ...requestConfig,
          headers: {
            secret_app_key: secrets.SECRET_APP_KEY,
          },
          data: { ...sampleData, email: "incorrect@email.com" },
        });

        const responseData = response.data;

        expect(responseData.status).toBe(HTTPStatusCodes.UNAUTHORIZED);
        expect(responseData.type).toBe("error");
        expect(responseData.errorCode).toBe(SpentAPIExceptionCodes.NOT_FOUND);
        expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
        expect(responseData.errors).toBeDefined();

        // try {
        //   await axios.request({
        //     ...requestConfig,
        //     data: { ...sampleData, email: "incorrect@email.com" },
        //   });
        // } catch (err) {
        //   testErrorResponse(
        //     err,
        //     HTTPStatusCodes.UNAUTHORIZED,
        //     SpentAPIExceptionCodes.NOT_FOUND
        //   );
        // }
      });

      it("Should throw an error if password is incorrect", async () => {
        const response = await axios.request({
          ...requestConfig,
          headers: {
            secret_app_key: secrets.SECRET_APP_KEY,
          },
          data: { ...sampleData, password: "incorrect" },
        });

        const responseData = response.data;

        expect(responseData.status).toBe(HTTPStatusCodes.UNAUTHORIZED);
        expect(responseData.type).toBe("error");
        expect(responseData.errorCode).toBe(
          SpentAPIExceptionCodes.INCORRECT_PASSWORD
        );
        expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      });

      it("Should log the user in with the correct password", async () => {
        const response = await axios.request({
          ...requestConfig,
          data: sampleData,
        });

        const responseData = response.data;

        expect(responseData.status).toBe(HTTPStatusCodes.OK);
        expect(responseData.type).toBe("object");
        expect(responseData.body.token).toBeDefined();
        expectTypeOf(responseData.body).toMatchTypeOf<{ token: string }>();
        expectTypeOf(responseData).toMatchTypeOf<SpentAPIObjectResponse>();
      });

      it("Should throw an error if user is already logged in", async () => {
        const response = await axios.request({
          ...requestConfig,
          headers: {
            secret_app_key: secrets.SECRET_APP_KEY,
          },
          data: sampleData,
        });

        const responseData = response.data;

        expect(responseData.status).toBe(HTTPStatusCodes.FORBIDDEN);
        expect(responseData.type).toBe("error");
        expect(responseData.errorCode).toBe(
          SpentAPIExceptionCodes.USER_ALREADY_LOGGED_IN
        );
        expectTypeOf(responseData).toMatchTypeOf<SpentAPIErrorResponse>();
      });
    });
  });
});
