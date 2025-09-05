"use client";
import { UserSettings } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, useCallback, useMemo } from "react";
import { GetBalanceStatsResponseType } from "../../api/stats/balance/route";
import { GetFormattedForCurrency, dateToUTCDate } from "@/lib/helpers";
import SkeletonWrapper from "../../../components/SkeletonWrapper";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import Countup from "react-countup";

const StatsCards = ({
  userSettings,
  from,
  to,
}: {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${from.toDateString()}&to=${to.toISOString()}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormattedForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative container flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expenses"
          icon={
            <TrendingUp className="flex-shrink-0 h-12 w-12 rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
          <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingDown className="flex-shrink-0 h-12 w-12 rounded-lg p-2 text-red-500 bg-emerald-400/10" />
          }
        />
          <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="flex-shrink-0 h-12 w-12 rounded-lg p-2 text-violet-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCards;

const StatCard = ({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode;
}) => {
  const formatFn = useCallback((value: number) => {
    return formatter.format(value);
  }, []);
  return (
    <Card className="flex flex-row h-24 w-full items-center gap-2 p-4">
      <div>{icon}</div>
      <div className="flex flex-col gap-0 items-center">
        <p className="text-muted-foreground">{title}</p>
        <Countup
          preserveValue
          redraw={false}
          end={value}
          formattingFn={formatFn}
          decimals={2}
          className="text-2xl"
        />
      </div>
    </Card>
  );
};
