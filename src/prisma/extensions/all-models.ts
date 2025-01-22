import { Prisma } from "@prisma/client";
import { ExtendedPrismaClientWithErrorHandler } from "./all-operations";

const $addAllModelsExtension = (db: ExtendedPrismaClientWithErrorHandler) => {
  return db.$extends($allModelsExtension);
};

const $allModelsExtension = Prisma.defineExtension({
  name: "allModels",
  model: {
    $allModels: {
      exists: async <T>(
        where: Prisma.Args<T, "findFirst">["where"]
      ): Promise<boolean> => {
        const context = Prisma.getExtensionContext(this);

        const result = await (context as any).findFirst({ where });
        return result !== null;
      },
    },
  },
});

export type PrismaClientWithAllAndModelExtensions = ReturnType<
  typeof $addAllModelsExtension
>;

export { $addAllModelsExtension };

export default $allModelsExtension;
