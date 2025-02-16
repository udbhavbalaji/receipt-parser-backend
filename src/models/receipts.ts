import db from "src/config/database";
import {
  throwDatabaseManipulationError,
  throwDatabaseQueryError,
} from "src/errors";
import { ReceiptDB, ItemDB } from "src/types/database";
import { ItemRequest } from "src/types/request";
import { generate, transform } from "src/utils";

const create = (receipt: ReceiptDB, items: ItemRequest[]) => {
  return db.transaction((trx) => {
    return db
      .insert(receipt)
      .into("receipts")
      .returning("receipt_id")
      .transacting(trx)
      .then((receiptIds) => {
        const receiptId = receiptIds[0].receipt_id as string;

        return Promise.all(
          items.map((item, idx) => {
            const itemId = generate.itemID(item, receipt.date, idx);

            type ExtendedItemRequest = {
              itemId: string;
              receiptId: string;
            } & ItemRequest;

            return transform
              .camelToSnakeProperties<ExtendedItemRequest, ItemDB>({
                ["itemId"]: itemId,
                ["receiptId"]: receiptId,
                ...item,
              })
              .then((item) => {
                return db.insert(item).into("items").transacting(trx);
              });
          })
        );
      })
      .catch((err) => {
        throw throwDatabaseManipulationError(err);
      });
  });
};

const get = (
  receiptId: string,
  userId: string,
  cols?: Array<keyof ReceiptDB>
) => {
  const condition = {
    user_id: userId,
    receipt_id: receiptId,
  };
  return db
    .select(cols ?? "*")
    .from("receipts")
    .where(condition)
    .first()
    .catch((err) => {
      throw throwDatabaseQueryError(err);
    });
};

export default { create, get };
