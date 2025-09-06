import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_component/CreateTransactionDialog";
import Overview from "./_component/Overview";
import History from "./_component/History";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }
  return (
    <div className="h-full bg-background w-full flex flex-col items-center">
      <div className="border-b bg-card w-full flex justify-center">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6 w-full">
          <p className="text-3xl font-bold">Hello, {user.firstName}!</p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="cursor-pointer border-emerald-500  hover:bg-emerald-700 hover:text-white"
                >
                  New income
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="cursor-pointer border-emerald-500 hover:bg-emerald-700 hover:text-white"
                >
                  New expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />

    </div>
  );
};

export default page;
