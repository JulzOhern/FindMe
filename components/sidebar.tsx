"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSideBarStore } from "@/lib/zustand"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeopleTab } from "./people-tab"
import { User } from "@/generated/prisma/client"
import { FriendRequestTab } from "./friend-request-tab"

const TABS = ["friends", "friend-request", "people"]

type SidebarProps = {
  me: User | null;
}

export function Sidebar({ me }: SidebarProps) {
  const isOpen = useSideBarStore(state => state.isOpen)
  const toggle = useSideBarStore(state => state.toggle)

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetContent
        side="left"
        className="flex flex-col gap-0 border-r bg-white sm:w-3/4 w-full shadow-sm z-1001">
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
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Friends */}
          <TabsContent
            value="friends"
            className="text-sm text-gray-600 px-1"
          >
            No friends yet.
          </TabsContent>

          <FriendRequestTab />
          <PeopleTab me={me} />
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
