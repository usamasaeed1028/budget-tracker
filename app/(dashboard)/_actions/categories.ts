"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "../../../schema/categories";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const CreateCategory = async (form: CreateCategorySchemaType) => {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("bad request!ƒ");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = parsedBody.data;
  return prisma.category.create({
    data: { userId: user.id, name, icon, type },
  });
};

export const deleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request!ƒ");
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
};
