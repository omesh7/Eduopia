"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { SideBarItem } from "./sidebar-item"
import { UserNav } from "@/components/user-nav"

type Props = {
  className?: string
}

const SideBarData = [
  { label: "Home", href: "/home", iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "Quests", href: "/quests", iconSrc: "/quests.svg" },
  { label: "Shop", href: "/shop", iconSrc: "/shop.svg" },
]

export function SideBar({ className }: Props) {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px] lg:h-screen w-[72px] lg:px-6 transition-all",
        className
      )}
    >
      <Link href="/learn" className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
        <Image src="/mascot.svg" alt="Mascot" height={40} width={40} />
        <h1 className="hidden lg:block text-2xl font-extrabold tracking-wide text-green-600">
          DocuLingo
        </h1>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        {SideBarData.map((item) => (
          <SideBarItem
            key={item.href}
            label={item.label}
            href={item.href}
            iconSrc={item.iconSrc}
          />
        ))}
      </div>

      <div className="mt-auto pb-4">
        <UserNav />
      </div>
    </div>
  )
}