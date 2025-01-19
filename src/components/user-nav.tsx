"use client"

import Link from "next/link"
import { LayoutGrid, LogOut, User, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/components/hooks/use-user'
import { useRouter } from "next/navigation"

export function UserNav() {
  const { theme, setTheme } = useTheme()
  const router = useRouter();

  const user = useUser();

  if (!user) {
    router.push("/login");
    return null; // Ensure nothing renders until redirection
  }

  // Fallback for missing user details
  const displayName = user.email || "USER";
  const displayEmail = user.email || "No email provided";

  // Generate initials from the user's name or fallback to "U" for USER
  const getInitials = (name: string) => {
    const initials = name.split(" ").map(n => n[0]).join("");
    return initials || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type='button' className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 transition-colors rounded-md hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white">
            {getInitials(displayName)}
          </div>
          <span className="ml-3 hidden lg:block">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/home">
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
