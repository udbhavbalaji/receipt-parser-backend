import { LoginStatus, Prisma, User } from "@prisma/client";
import { PrismaClientWithAllAndModelExtensions } from "./all-models";

const $addUserModelExtension = (db: PrismaClientWithAllAndModelExtensions) => {
  return db.$extends($userModelExtension);
};

const $userModelExtension = Prisma.defineExtension({
  name: "userModel",
  model: {
    user: {
      async loginCheck(email: string) {
        const context = Prisma.getExtensionContext(this);

        return await (context as any).findFirstOrThrow({
          select: {
            userId: true,
            loggedIn: true,
            password: true,
            lastGeneratedToken: true,
          },
          where: {
            email: email,
          },
        });
      },

      async logIn(userId: string, token: string): Promise<User> {
        const context = Prisma.getExtensionContext(this);

        return await (context as any).update({
          where: {
            userId: userId,
          },
          data: {
            loggedIn: LoginStatus.LOGGED_IN,
            lastGeneratedToken: token,
          },
        });
      },

      async logOut(userId: string): Promise<User> {
        const context = Prisma.getExtensionContext(this);
        return await (context as any).update({
          where: {
            userId: userId,
          },
          data: {
            loggedIn: LoginStatus.LOGGED_OUT,
          },
        });
      },

      async getMe(userId: string): Promise<User> {
        const context = Prisma.getExtensionContext(this);

        return await (context as any).findFirstOrThrow({
          omit: {
            password: true,
            lastGeneratedToken: true,
            id: true,
          },
          where: {
            userId: userId,
          },
        });
      },
    },
  },
});

export type PrismaClientWithAllModelAndUserExtensions = ReturnType<
  typeof $addUserModelExtension
>;

export { $addUserModelExtension };

export default $userModelExtension;
