import { describe, expect, expectTypeOf, it, afterAll } from "vitest";
import { messages, secrets } from "../../src/constants";
import {
  HTTPStatusCodes,
  SpentAPIExceptionCodes,
  SpentAPIStringResponse,
} from "../../src/types";
import axios, { testErrorResponse } from ".";
import { AxiosRequestConfig } from "axios";
import { Application } from "express";
import db from "../../src/prisma";

import { omit } from "lodash";

let server: Application;

afterAll(async () => {
  const modelNames = Object.keys(db).filter(
    (key) =>
      !key.startsWith("_") && key !== "disconnect" && !key.startsWith("$")
  );

  for (const model of modelNames) {
    await db[model].deleteMany();
  }

  db.$disconnect();
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
    password: "$2y$10$O6eNmxgaXInHfZP.zh7i/evrYikZipIv/1.GhxK7ciAATf..MXkge",
  };

  describe("Test user registration and ensure no duplicate login is possible", () => {
    it("Should register a new user", async () => {
      const response = await axios.request({
        ...requestConfig,
        data: sampleData,
      });

      const responseData = response.data;

      expect(responseData.status).toBe(201);
      expect(responseData.type).toBe("string");
      expect(responseData.body).toBe("Created");
      expectTypeOf(responseData).toMatchTypeOf<SpentAPIStringResponse>();
    });

    it("Should throw an error for duplicate registration", async () => {
      try {
        await axios.request({
          ...requestConfig,
          data: sampleData,
        });
      } catch (err) {
        testErrorResponse(
          err,
          HTTPStatusCodes.BAD_REQUEST,
          SpentAPIExceptionCodes.ALREADY_EXISTS
        );
        expect(err.response.data.errors).not.toBeNull();
      }
    });
  });

  describe("Should throw an error if the secret app key is missing or invalid", async () => {
    it("Missing app key", async () => {
      try {
        await axios.request({
          ...requestConfig,
          headers: {},
          data: sampleData,
        });
      } catch (err) {
        testErrorResponse(
          err,
          HTTPStatusCodes.FORBIDDEN,
          SpentAPIExceptionCodes.UNVERIFIED_APP
        );
      }
    });

    it("Invalid app key", async () => {
      try {
        await axios.request({
          ...requestConfig,
          headers: {
            secret_app_key: "invalid",
          },
          data: sampleData,
        });
      } catch (err) {
        testErrorResponse(
          err,
          HTTPStatusCodes.FORBIDDEN,
          SpentAPIExceptionCodes.INVALID_APP_KEY
        );
      }
    });
  });

  describe("Should throw an error if the request body is missing or not in the correct format", () => {
    it("Should throw an error if request body is missing", async () => {
      try {
        await axios.request({
          ...requestConfig,
          headers: {
            secret_app_key: secrets.SECRET_APP_KEY,
          },
          data: {},
        });
      } catch (err) {
        testErrorResponse(
          err,
          HTTPStatusCodes.UNPROCESSABLE_CONTENT,
          SpentAPIExceptionCodes.VALIDATION_ERROR
        );
        expect(err.response.data.errors).not.toBeNull();
      }
    });
  });

  it("Should throw an error if the request body is missing required data", async () => {
    try {
      await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: omit(sampleData, "firstName"),
      });
    } catch (err) {
      testErrorResponse(
        err,
        HTTPStatusCodes.UNPROCESSABLE_CONTENT,
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expect(err.response.data.errors).not.toBeNull();
    }
  });

  it("Should throw an error if the user tries to enter invalid email", async () => {
    try {
      await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: { ...sampleData, email: "invalid" },
      });
    } catch (err) {
      testErrorResponse(
        err,
        HTTPStatusCodes.UNPROCESSABLE_CONTENT,
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expect(err.response.data.errors).not.toBeNull();
    }
  });

  it("Should throw an error if the user tries to enter a password that's too short", async () => {
    try {
      await axios.request({
        ...requestConfig,
        headers: {
          secret_app_key: secrets.SECRET_APP_KEY,
        },
        data: { ...sampleData, password: "invalid" },
      });
    } catch (err) {
      testErrorResponse(
        err,
        HTTPStatusCodes.UNPROCESSABLE_CONTENT,
        SpentAPIExceptionCodes.VALIDATION_ERROR
      );
      expect(err.response.data.errors).not.toBeNull();
    }
  });
});
