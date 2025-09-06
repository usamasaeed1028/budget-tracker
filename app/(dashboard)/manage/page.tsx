"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { CurrencyComboBox } from "../../../components/CurrencyComboBox";
import { TransactionType } from "@/lib/types";
import { Category } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../../../components/SkeletonWrapper";
import { TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import CreateCategoryDialog from "../_component/CreateCategoryDialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import DeleteCategoryDialog from "../_component/DeleteCategoryDialog";

const page = () => {
  return (
    <>
      <div className="border-b bg-card flex flex-col justify-center items-center">
        <div className="container flex flex-wrap items-center justify-between gap-6 p-3">
          <div className="">
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center ">
        <div className="container w-full flex flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>
                Set your default currency for transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencyComboBox />
            </CardContent>
          </Card>
          <CategoryList type="income" />
          <CategoryList type="expense" />
        </div>
      </div>
    </>
  );
};

export default page;

const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const dataAvailable =
    categoriesQuery?.data && categoriesQuery?.data?.length > 0;
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                {type === "expense" ? (
                  <TrendingDown className="h-12 w-12 rounded-lg bg-red-400/10 p-2 text-red-500" />
                ) : (
                  <TrendingUp className="h-12 w-12 rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
                )}
              </div>
              <div>
                {type === "income" ? "Incomes" : "Expenses"} Categories{" "}
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              onSuccessCallback={() => categoriesQuery.refetch()}
              customSyles
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="h-40 w-full flex flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={`m-1 ${
                  type === "income" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => {
              return <CategoryCard category={category} key={category.name} />;
            })}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col gap-2 items-center p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate cursor-pointer items-center gap-2 text-muted-foreground rounded-t-none hover:bg-red-500/20"
            variant="secondary"
          >
            <TrashIcon className="w-4 h-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
};
