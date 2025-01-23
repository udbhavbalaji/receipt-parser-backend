import { SpentAPIExceptionCodes, HTTPStatusCodes } from "./enums";

type ResponseType =
  | "error"
  | "string"
  | "object"
  | "array"
  | "null"
  | "info"
  | "instruction";

interface BasicSpentAPIResponse {
  status: HTTPStatusCodes;
  // type: ResponseType;
}

type MessageRequired<T> = { message: string } & T;
type MessageOptional<T> = { message?: string } & T;

interface BasicErrorResponse extends BasicSpentAPIResponse {
  errorCode: SpentAPIExceptionCodes;
  errors?: any;
}

interface StringReturnSuccessResponse extends BasicSpentAPIResponse {
  body: string;
}

interface ObjectReturnSuccessResponse<
  T extends Record<string, any> = Record<string, any>
> extends BasicSpentAPIResponse {
  body: T;
}

interface ArrayReturnSuccessResponse<
  T extends Record<string, any> = Record<string, any>
> extends BasicSpentAPIResponse {
  body: T[];
}

interface NullReturnSuccessResponse extends BasicSpentAPIResponse {
  body: null;
}

interface InstructionResponse extends BasicSpentAPIResponse {
  action: SpentRequiredAction;
}

interface SpentRequiredAction {
  endpoint: string;
  method: string;
  params?: any;
}

type SpentAPIErrorResponse = MessageRequired<BasicErrorResponse> & {
  type: "error";
};

type SpentAPIArrayResponse<
  T extends Record<string, any> = Record<string, any>
> = MessageOptional<ArrayReturnSuccessResponse<T>> & { type: "array" };
type SpentAPIObjectResponse<
  T extends Record<string, any> = Record<string, any>
> = MessageOptional<ObjectReturnSuccessResponse<T>> & { type: "object" };
type SpentAPIStringResponse = MessageOptional<StringReturnSuccessResponse> & {
  type: "string";
};
type SpentAPINullResponse = MessageOptional<NullReturnSuccessResponse> & {
  type: "null";
};

type SpentAPISuccessResponse =
  | SpentAPIArrayResponse
  | SpentAPIObjectResponse
  | SpentAPIStringResponse
  | SpentAPINullResponse;

type SpentAPIInfoResponse = MessageRequired<BasicSpentAPIResponse> & {
  type: "info";
};

type SpentAPIInstructionResponse = MessageRequired<InstructionResponse> & {
  type: "instruction";
};

type SpentAPIResponse =
  | SpentAPISuccessResponse
  | SpentAPIErrorResponse
  | SpentAPIInfoResponse
  | SpentAPIInstructionResponse;

export {
  SpentAPIResponse,
  SpentAPISuccessResponse,
  SpentAPIErrorResponse,
  SpentAPIInfoResponse,
  SpentAPIInstructionResponse,
  SpentAPIArrayResponse,
  SpentAPIObjectResponse,
  SpentAPIStringResponse,
  SpentAPINullResponse,
  SpentRequiredAction,
  ResponseType,
};
