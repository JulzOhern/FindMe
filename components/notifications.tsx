"use client";

import { Bell, CheckCheck, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Notification, User } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useTransition } from "react";
import { deleteNotification, undoDeleteNotification } from "@/actions/delete-notification";
import { toast } from "sonner";

type NotificationsProps = {
  notifications: (Notification & { sender: User | null })[] | null;
};

export function Notifications({ notifications }: NotificationsProps) {
  const count = notifications?.length || 0;
  const [isPending, setTransition] = useTransition();

  function handleDeleteNotification(notificationId: string) {
    setTransition(async () => {
      await deleteNotification(notificationId)
        .then((data) => toast.success("Deleted", {
          description: "Notification deleted!",
          action: {
            label: "Undo",
            onClick: () => undoDeleteNotification(data)
          }
        }))
        .catch(() => toast.error("Something went wrong"));
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon-sm" className="relative">
          <Bell className="w-6 h-6 text-gray-700" />

          {/* Red unread badge */}
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-xl shadow-xl border overflow-hidden"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Notifications</h2>

          <div className="flex items-center gap-1">
            {/* Mark all as read */}
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              title="Mark all as read"
            >
              <CheckCheck size={20} />
            </button>

            {/* Delete all */}
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              title="Delete all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-87 divide-y overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 p-4 hover:bg-gray-100 transition relative"
              >
                {/* Avatar + text inside link */}
                <Link
                  href={`/user/${n.sender?.id}`}
                  className="flex-1 flex gap-3"
                >
                  <Image
                    src={n.sender?.image ?? "/default-avatar.png"}
                    alt="Sender Profile Picture"
                    width={100}
                    height={120}
                    className="w-10 h-10 object-cover rounded-full"
                  />

                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-600">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>

                {/* 3 dots menu OUTSIDE the link */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()} // prevent link click
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => console.log("Mark unread:", n.id)}
                    >
                      Mark as unread
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDeleteNotification(n.id)}
                      disabled={isPending}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
