"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const deleteTransactions = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transactions.findUnique({
    where: {
      userId: user.id,
      id: id,
    },
  });
  console.log(transaction, "TTTTT");
  console.log("DAY", transaction?.date.getUTCDay());
  console.log("MONTH", transaction?.date.getUTCMonth());
  console.log("TTTTyaerT", transaction?.date.getUTCFullYear());

  if (!transaction) {
    throw new Error("Bad request");
  }
  await prisma.$transaction([
    // Delete transaction from db
    prisma.transactions.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    // Update month history
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    // Update year history
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
};
