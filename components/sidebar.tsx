"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSideBarStore } from "@/lib/zustand"

export function Sidebar() {
  const isOpen = useSideBarStore(state => state.isOpen)
  const toggle = useSideBarStore(state => state.toggle)

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      {/* <SheetTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <Menu />
        </Button>
      </SheetTrigger> */}
      <SheetContent
        side="left"
        className="flex flex-col gap-0 z-1001"
      >
        <SheetHeader>
          <SheetTitle>Friend List</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 overflow-auto">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem minima facilis non placeat ipsam, cupiditate error. Error officia, eligendi quaerat praesentium rerum culpa, quo hic accusamus optio non unde. Id?
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
