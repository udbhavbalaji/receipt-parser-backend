import { messages } from "src/constants";
import { throwInternalServerError } from "src/errors";
import { SpentAPIExceptionCodes } from "src/types/enums";

const camelToSnakeProperties = <
  T extends Record<string, any>,
  R extends Record<string, any>
>(
  input: T
): Promise<R> => {
  return import("change-case")
    .then((changeCase) => {
      const output: Record<string, any> = {};

      Object.keys(input).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          const snakeKey = changeCase.snakeCase(key, { delimiter: "_" });
          output[snakeKey] = input[key];
        }
      });

      return output as R;
    })
    .catch((err) => {
      throw throwInternalServerError(
        messages.error.PropertyStyleError,
        SpentAPIExceptionCodes.PROPERTY_TRANSFORMATION_ERROR
      );
    });
};

const snakeToCamelProperties = <
  T extends Record<string, any>,
  R extends Record<string, any>
>(
  input: T
): Promise<R> => {
  return import("change-case")
    .then((changeCase) => {
      const output: Record<string, any> = {};

      Object.keys(input).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          const camelKey = changeCase.camelCase(key);
          output[camelKey] = input[key];
        }
      }); // end forEach

      return output as R;
    })
    .catch((err) => {
      throw throwInternalServerError(
        messages.error.PropertyStyleError,
        SpentAPIExceptionCodes.PROPERTY_TRANSFORMATION_ERROR
      );
    });
};

export default { camelToSnakeProperties, snakeToCamelProperties };
