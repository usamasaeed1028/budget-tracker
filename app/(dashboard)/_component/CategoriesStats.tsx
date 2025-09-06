import { UserSettings } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { GetCategoriesStatsResponseType } from "../../api/stats/categories/route";
import { GetFormattedForCurrency } from "@/lib/helpers";
import SkeletonWrapper from "../../../components/SkeletonWrapper";
import { TransactionType } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const CategoriesStats = ({
  userSettings,
  from,
  to,
}: {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${from.toDateString()}&to=${to.toISOString()}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormattedForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex flex-wrap gap-2 md:flex-nowrap w-full">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};
const CategoriesCard = ({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
}) => {
  const filterData = data.filter((cl) => cl.type === type);
  const total = filterData.reduce((acc, cl) => acc + (cl._sum.amount || 0), 0);
  return (
    <Card className="h-80 w-full col-span-6 ">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expense"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filterData?.length === 0 && (
          <div className="flex h-60 w-full flex flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filterData?.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filterData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                console.log(amount,"PERCENTER")
                return (
                  <div className="flex flex-col gap-2" key={item.category}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default CategoriesStats;
