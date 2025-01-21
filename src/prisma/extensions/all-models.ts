import { Prisma } from "@prisma/client";

const $allModelsExtension = Prisma.defineExtension({
  name: "allModels",
  model: {
    $allModels: {
      async exists<T>(
        this: T,
        where: Prisma.Args<T, "findFirst">["where"]
      ): Promise<boolean> {
        const context = Prisma.getExtensionContext(this);

        const result = await (context as any).findFirst({ where });
        return result !== null;
      },
    },
  },
});

export default $allModelsExtension;
