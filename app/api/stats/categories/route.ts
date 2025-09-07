import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../schema/overview";

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

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
};

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transactions.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId: userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: { amount: true },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
  return stats;
};
