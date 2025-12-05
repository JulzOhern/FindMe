"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSideBarStore } from "@/lib/zustand"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeopleTab } from "./people-tab"
import { User } from "@/app/generated/prisma/client";
import { FriendRequestTab } from "./friend-request-tab"
import { FriendTab } from "./friend-tab"
import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import approx from "approximate-number";

const TABS = ["friend", "friend-request", "people"]

type SidebarProps = {
  me: User | null;
}

export function Sidebar({ me }: SidebarProps) {
  const isOpen = useSideBarStore(state => state.isOpen)
  const toggle = useSideBarStore(state => state.toggle)
  const [friendRequestCount, setFriendRequestCount] = useState(0)

  const getFriendRequestCount = useCallback((count: number) => {
    setFriendRequestCount(count);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetContent
        side="left"
        className="flex flex-col gap-0 border-r bg-white sm:w-3/4 sm:max-w-md w-full shadow-sm z-1001">
        {/* Header */}
        <SheetHeader className="pb-2 border-b">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Friend List
          </SheetTitle>
          <SheetDescription className="hidden" />
        </SheetHeader>

        {/* Tabs */}
        <Tabs
          defaultValue="friends"
          className="flex-1 flex flex-col p-3 min-h-0"
        >
          <TabsList className="w-full rounded-lg border">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize"
              >
                {tab.split("-").join(" ")}
                <span
                  className={cn(
                    "rounded-full text-red-500 text-xs",
                    friendRequestCount === 0 && "hidden",
                    tab !== "friend-request" && "hidden"
                  )}
                >
                  {approx(friendRequestCount)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <FriendTab
            me={me}
          />
          <FriendRequestTab
            getFriendRequestCount={getFriendRequestCount}
          />
          <PeopleTab me={me} />
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
