"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { UserSettings } from "@/generated/prisma";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-10 py-6 ">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              // we update the range only if both dates are set
              if (!from || !to) return;

              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} Days`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
        <StatsCards
          userSettings={userSettings}
          from={dateRange.to}
          to={dateRange.to}
        />
        <CategoriesStats  userSettings={userSettings}
          from={dateRange.to}
          to={dateRange.to} />
      </div>
    </>
  );
};

export default Overview;
