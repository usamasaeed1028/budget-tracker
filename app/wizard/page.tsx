import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Logo from "../../components/Logo";
import { CurrencyComboBox } from "../../components/CurrencyComboBox";

const page = async () => {
  const user = await currentUser();
  console.log(user);
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container w-[40%] flex flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user?.firstName}!👋 </span>
        </h1>
        <h2 className="mt-3 text-center text-base text-muted-foreground">
          Lets get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm">
          {" "}
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
          <CardContent className="w-full px-0">
            <CurrencyComboBox />{" "}
          </CardContent>
        </CardHeader>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>I am done! Take me to the dashboard</Link>
      </Button>
      <div className="mt-8">
        {" "}
        <Logo />
      </div>
    </div>
  );
};

export default page;
