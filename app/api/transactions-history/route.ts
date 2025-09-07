import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../schema/overview";
import prisma from "@/lib/prisma";
import { GetFormattedForCurrency } from "@/lib/helpers";

export const GET = async (request: Request) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const transaction = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(transaction);
};
export type GetTransactionsHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

const getTransactionsHistory = async (userId: string, from: Date, to: Date) => {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error("User settings not defined!");
  }
  const formatter = GetFormattedForCurrency(userSettings.currency);
  const transactions = await prisma.transactions.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount),
  }));
};
