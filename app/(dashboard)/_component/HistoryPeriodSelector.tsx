import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GetHistoryPeriodsResponseType } from "../../api/history-periods/route";
import SkeletonWrapper from "../../../components/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistoryPeriodSelector = ({
  period,
  timeframe,
  setPeriod,
  setTimeframe,
}: {
  period: Period;
  timeframe: Timeframe;
  setTimeframe: React.Dispatch<React.SetStateAction<Timeframe>>;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
}) => {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "period"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap gap-2 items-center">
        <SkeletonWrapper isLoading={historyPeriods.isFetching}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods?.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isRefetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;

const YearSelector = ({
  period,
  years,
  setPeriod,
}: {
  period: Period;
  years: GetHistoryPeriodsResponseType;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
}) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({ month: period.month, year: parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
        <SelectContent>
          {years.length > 0 &&
            years?.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
const MonthSelector = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
}) => {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({ year: period.year, month: parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
        <SelectContent>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const monthStr = new Date(period.year, month, 1).toLocaleString(
              "default",
              { month: "long" }
            );
            return (
              <SelectItem key={month} value={month.toString()}>
                {monthStr}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
