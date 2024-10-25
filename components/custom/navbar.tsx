"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { handleSignOut } from "@/app/(auth)/authActions";
import { History } from "./history";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = ({ session }: { session: any }) => {
  const router = useRouter();

  const onSignOut = async () => {
    await handleSignOut();
    router.refresh();
  };

  return (
    <div className="bg-white absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30 border-b border-[#60A2B1]">
      <div className="flex flex-row gap-3 items-center">
        <History user={session?.user} />
        <div className="flex flex-row gap-2 items-center">
          <div className="text-sm text-[#60A2B1] font-semibold">Agente 007</div>
        </div>
      </div>

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="py-1.5 px-2 h-fit font-normal bg-[#60A2B1] text-white hover:bg-[#4A8291] transition-colors"
            >
              {session.user?.email}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-[#60A2B1]">
            <DropdownMenuItem>
              <ThemeToggle />
            </DropdownMenuItem>
            <DropdownMenuItem className="p-1 z-50">
              <button
                onClick={onSignOut}
                className="w-full text-left px-1 py-0.5 text-[#D6541D] hover:text-[#B04418] transition-colors"
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="py-1.5 px-2 h-fit font-normal bg-[#60A2B1] text-white hover:bg-[#4A8291] transition-colors" asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
};