"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/generated/prisma";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

const CategoryPicker = ({ type, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery?.data?.find(
    (caterogry: Category) => caterogry.name === value
  );

  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select Category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search Category..." />
          <CreateCategoryDialog
            type={type}
            onSuccessCallback={successCallback}
          />
          <CommandEmpty>
            <p>Category not found!</p>
            <p className="text-xs text-muted-foreground">
              Tip: create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery?.data &&
                categoriesQuery.data.map((category: Category) => {
                  return (
                    <CommandItem
                      key={category.name}
                      onSelect={() => {
                        setValue(category.name);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <CategoryRow category={category} />
                      <Check
                        className={cn(
                          "mr-2 w-4h-4 opacity-0",
                          value === category.name && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  );
                })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="" role="img">
        {category.icon}
      </span>
      <span className="">{category.name}</span>
    </div>
  );
};
export default CategoryPicker;
