import { UserSettings } from "@/generated/prisma";
import React from "react";

const CategoriesStats = ({
  userSettings,
  from,
  to,
}: {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}) => {
  return <div>CategoriesStats</div>;
};

export default CategoriesStats;
