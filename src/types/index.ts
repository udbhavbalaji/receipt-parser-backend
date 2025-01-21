enum SpentAPIExceptionCodes {
  NOT_FOUND = 1001,
  ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE_CONTENT = 1004,
  CHECK_CONSTRAINT_FAILED = 1005,
  FOREIGN_KEY_CONSTRAINT_FAILED = 1006,
  INVALID_PASSWORD = 1007,
  NOT_NULL_CONSTRAINT_FAILED = 1008,
  BAD_REQUEST = 2001,
  VALIDATION_ERROR = 2002,
  JSON_PARSE_ERROR = 2003,
  UNAUTHORIZED = 2004,
  INVALID_JWT = 2005,
  USER_ALREADY_LOGGED_IN = 2006,
  JWT_EXPIRED = 2007,
  USER_SIGNED_OUT = 2008,
  UNVERIFIED_APP = 2009,
  INVALID_APP_KEY = 2010,
  APP_NOT_VALIDATED = 2011,
  MISSING_JWT_ERROR = 2012,
  JWT_ERROR = 2013,
  FORBIDDEN = 2014,
  INTERNAL_SERVER_ERROR = 3001,
  QUERY_ERROR = 3002,
  PROPERTY_TRANSFORMATION_ERROR = 3003,
  BINDING_ERROR = 3004,
  GENERIC_DATABASE_ERROR = 3005,
  SECRETS_NOT_AVAILABLE = 3006,
}

enum HTTPStatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  REDIRECT_REQUIRED = 307,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  UNPROCESSABLE_CONTENT = 422,
  TOO_MANY_REQUESTS = 429,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

interface ItemRequest {
  amount: number;
  description: string;
  flags?: string | null;
  qty: number;
  unitPrice: number;
}

interface ReceiptRequest {
  merchantName: string;
  merchantAddress: string | null;
  merchantPhone: string | null;
  merchantWebsite: string | null;
  receiptNo: string;
  date: string;
  time: string | null;
  items: ItemRequest[];
  currency: string;
  total: number;
  subtotal: number;
  tax: number | null;
  serviceCharge: string | null;
  tip: number | null;
}

export { SpentAPIExceptionCodes, HTTPStatusCodes, ReceiptRequest, ItemRequest };
