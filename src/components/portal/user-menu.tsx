"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABEL } from "@/lib/roles";

export function UserMenu() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  if (!user || !role) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex size-11 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserAvatar name={user.name} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="grid gap-0.5 px-3 py-2">
          <span className="text-sm font-semibold text-foreground">{user.name}</span>
          <span className="text-xs font-normal">{ROLE_LABEL[role]} · {user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${role.toLowerCase()}/profile`}>
            <UserRound />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          destructive
          onSelect={() => {
            logout();
            toast.success("You've been logged out");
            router.push("/");
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
