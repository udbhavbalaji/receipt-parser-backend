import { AxiosError } from "axios";
import {
  HTTPStatusCodes,
  SpentAPIErrorResponse,
  SpentAPIExceptionCodes,
} from "../src/types";
import { expect, expectTypeOf } from "vitest";

export const testErrorResponse = (
  err: any,
  status: HTTPStatusCodes,
  errorCode: SpentAPIExceptionCodes
) => {
  if (err instanceof AxiosError) {
    const errorResponse = err.response?.data;
    expect(errorResponse.status).toBe(status);
    expect(errorResponse.type).toBe("error");
    expect(errorResponse.errorCode).toBe(errorCode);
    expectTypeOf(errorResponse).toMatchTypeOf<SpentAPIErrorResponse>();
  } else throw err;
};
