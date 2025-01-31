import { Prisma, Receipt } from "@prisma/client";

import { generate } from "../../utils";
import { ItemRequest } from "../../types";
import { PrismaClient } from "@prisma/client/extension";
import { PrismaClientWithAllModelAndUserExtensions } from "./user-model";

const $addReceiptModelExtension = (
  db: PrismaClientWithAllModelAndUserExtensions
) => {
  return db.$extends({
    name: "receiptModel",
    model: {
      receipt: {
        async add(
          receipt: Omit<Receipt, "id">,
          items: ItemRequest[]
        ): Promise<void> {
          // const context = Prisma.getExtensionContext(this);

          await db.$transaction(async (trx: ExtendedTransactionClient) => {
            const receiptId = receipt.receiptId;
            const itemsDB = items.map((item, idx) => {
              const itemId = generate.itemID(item, receipt.date, idx);

              return { itemId, receiptId, ...item };
            });

            await trx.receipt.create({ data: receipt });
            await trx.item.createMany({ data: itemsDB });
          });
        },

        async get(receiptId: string, userId: string): Promise<Receipt> {
          const context = Prisma.getExtensionContext(this);

          return await (context as any).findFirstOrThrow({
            where: {
              receiptId: receiptId,
              userId: userId,
            },
          });
        },
      },
    },
  });
};

// const $addReceiptModelExtension = (db) => {
//   return db.$extends($receiptModelExtension);
// };

// const $receiptModelExtension = Prisma.defineExtension({
//   name: "receiptModel",
//   model: {
//     receipt: {
//       async add(
//         receipt: Omit<Receipt, "id">,
//         items: ItemRequest[]
//       ): Promise<void> {
//         // const context = Prisma.getExtensionContext(this);

//         await this.$transaction(
//           async (trx: ) => {
//             const receiptId = receipt.receiptId;
//             const itemsDB = items.map((item, idx) => {
//               const itemId = generate.itemID(item, receipt.date, idx);

//               return { itemId, receiptId, ...item };
//             });

//             await trx.receipt.create({ data: receipt });
//             await trx.item.createMany({ data: itemsDB });
//           }
//         );
//       },

//       async get(receiptId: string, userId: string): Promise<Receipt> {
//         const context = Prisma.getExtensionContext(this);

//         return await (context as any).findFirstOrThrow({
//           where: {
//             receiptId: receiptId,
//             userId: userId,
//           },
//         });
//       },
//     },
//   },
// });

export type SpentPrismaClient = ReturnType<typeof $addReceiptModelExtension>;

export { $addReceiptModelExtension };

// export default $receiptModelExtension;
// export default addReceiptModelExtension;
