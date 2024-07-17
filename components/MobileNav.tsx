"use client";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { CiMenuFries } from "react-icons/ci";
import Link from "next/link";
import { useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [openSheet, setOpenSheet] = useState(false);

  const Links = [
    { name: "Home", href: "/" },

    { name: "Items", href: "/items" },
    { name: "History", href: "/history" },
    { name: "Chart", href: "/chart" },
  ];

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-black" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <div className="mt-32 mb-20 text-center text-2xl">
          <Link href="/">
            <h1 className="text-4xl font-semibold">
              Wasfy<span className="text-[#62fcaf]">.</span>
            </h1>
          </Link>
        </div>
        <nav className="flex flex-col justify-center items-center gap-8">
          {Links.map((link, index) => {
            return (
              <Link
                href={link.href}
                key={index}
                onClick={() => {
                  setOpenSheet(false);
                }}
                className={`${
                  link.href === pathname &&
                  "text-[#62fcaf] border-b-2 border-[#62fcaf]"
                } text-xl capitalize hover:text-[#62fcaf] transition-all ease-in-out`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
