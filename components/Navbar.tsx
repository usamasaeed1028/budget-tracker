"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-seperate bg-backgorund md:hidden">
      <nav className="container flex  items-center justify-between px-2">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4 justify-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] p-3 sm:w-[540px]" side="left">
              <Logo />
              <div className="flex flex-col gap-1 pt-4">
                {items?.map((item) => (
                  <NavbarItem
                    key={item?.label}
                    link={item?.link}
                    label={item?.label}
                    onClickItem={() => setIsOpen((prev) => !prev)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex h-[80px] min-h-[80px] items-center gap-x-4">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};

const DesktopNavbar = () => {
  return (
    <div className="hidden border-seperate border-b bg-backgorund md:flex justify-center items-center">
      <nav className="container flex  items-center justify-between px-0">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4 justify-center">
          <Logo />
          <div className="flex h-full items-center gap-4">
            {items?.map((item) => (
              <NavbarItem
                key={item?.label}
                link={item?.link}
                label={item?.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSwitchSessionUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
};

const NavbarItem = ({
  link,
  label,
  onClickItem,
}: {
  link: string;
  label: string;
  onClickItem?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center">
      <Link
        onClick={onClickItem && onClickItem}
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
      )}
    </div>
  );
};

export default Navbar;
