import { Prisma, Receipt } from "@prisma/client";

import { generate } from "../../utils";
import { ItemRequest } from "../../types";

const $receiptModelExtension = Prisma.defineExtension({
  name: "receiptModel",
  model: {
    receipt: {
      async add(receipt: Omit<Receipt, "id">, items: ItemRequest[]) {
        const context = Prisma.getExtensionContext(this);

        await (context as any).$transaction(
          async (trx: Prisma.TransactionClient) => {
            const receiptId = receipt.receiptId;
            const itemsDB = items.map((item, idx) => {
              const itemId = generate.itemID(item, receipt.date, idx);

              return { itemId, receiptId, ...item };
            });

            await trx.receipt.create({ data: receipt });
            await trx.item.createMany({ data: itemsDB });
          }
        );
      },

      async get(receiptId: string, userId: string) {
        const context = Prisma.getExtensionContext(this);

        return await (context as any).receipt.findFirstOrThrow({
          where: {
            receiptId: receiptId,
            userId: userId,
          },
        });
      },
    },
  },
});

export default $receiptModelExtension;
