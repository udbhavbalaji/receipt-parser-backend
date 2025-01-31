import axios2, { AxiosError, AxiosInstance } from "axios";
import { expect, expectTypeOf } from "vitest";

import {
  SpentAPIExceptionCodes,
  HTTPStatusCodes,
  SpentAPIErrorResponse,
} from "../../src/types";

const axios: AxiosInstance = axios2.create({
  baseURL: "http://localhost:3000/api/auth",
});

export const testErrorResponse = (
  err: any,
  status: HTTPStatusCodes,
  errorCode: SpentAPIExceptionCodes
) => {
  if (err instanceof AxiosError) {
    const errorResponseMissing = err.response?.data;
    expect(errorResponseMissing.status).toBe(status);
    expect(errorResponseMissing.type).toBe("error");
    expect(errorResponseMissing.errorCode).toBe(errorCode);
    expectTypeOf(errorResponseMissing).toMatchTypeOf<SpentAPIErrorResponse>();
  } else throw err;
};

export default axios;
