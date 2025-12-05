"use client";

import { Bell, CheckCheck, Loader2, MoreVertical, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import Image from "next/image";
import Link from "next/link";
import { Notification, User } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import { deleteNotification, undoDeleteNotification } from "@/actions/delete-notification";
import { toast } from "sonner";
import { pusherClient } from "@/lib/pusher";
import { revalidateNotif } from "@/actions/revalidate-notif";
import { markAllAsRead } from "@/actions/mark-all-as-read";
import { cn } from "@/lib/utils";
import { deleteAllNotification } from "@/actions/delete-all-notification";
import { markAsReadOrUnread } from "@/actions/mark-as-read-or-unread";

type NotificationsProps = {
  me: User | null
  notifications: (Notification & { sender: User | null })[] | null;
};

export function Notifications({ me, notifications }: NotificationsProps) {
  const [isPending, setTransition] = useTransition();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-channel-${me?.id}`);

    channel.bind("friend-request", () => revalidateNotif())
    channel.bind("accept-request", () => revalidateNotif())

    return () => {
      channel.unbind("friend-request");
      channel.unbind("accept-request");
      pusherClient.unsubscribe(`private-channel-${me?.id}`)
    }
  }, [me?.id]);

  function handleMarkAllAsRead() {
    setTransition(async () => {
      await markAllAsRead()
        .then(() => toast.success("Marked all as read!"))
        .catch(() => toast.error("Something went wrong"));
    })
  }

  function handleDeleteAllNotification() {
    setIsOpenDeleteDialog(true)
    setTransition(() => {
      deleteAllNotification()
        .then(() => toast.success("Deleted all notifications!"))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsOpenDeleteDialog(false));
    })
  }

  const unReadNotifLength = notifications?.filter(n => n.isRead === false).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon-sm" className="relative">
          <Bell className="w-6 h-6 text-gray-700" />

          {/* Red unread badge */}
          {!!unReadNotifLength && unReadNotifLength > 0 && (
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
            <Button
              className="p-2 rounded-md hover:bg-gray-100"
              title="Mark all as read"
              variant="ghost"
              disabled={isPending || !notifications?.length}
              onClick={handleMarkAllAsRead}
            >
              {!isPending ? <CheckCheck size={20} /> : <Loader2 size={20} className="animate-spin" />}
            </Button>

            {/* Delete all */}
            <Dialog open={isOpenDeleteDialog} onOpenChange={setIsOpenDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Delete all"
                  variant="ghost"
                  disabled={isPending || !notifications?.length}
                >
                  <Trash2 size={20} />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm z-1001">
                <DialogHeader>
                  <DialogTitle>Delete all notifications?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All your notifications will be permanently removed.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    variant="destructive"
                    disabled={isPending}
                    onClick={handleDeleteAllNotification}
                  >
                    Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="max-h-87 divide-y overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationCards n={n} key={n.id} />
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

function NotificationCards({ n }: { n: Notification & { sender: User | null } }) {
  const [isPending, setTransition] = useTransition();

  function handleDeleteNotification() {
    setTransition(async () => {
      await deleteNotification(n.id)
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

  function handleMarkAsReadOrUnRead() {
    setTransition(async () => {
      await markAsReadOrUnread(n.id, n.isRead)
        .then(() => toast.success("Marked as read!"))
        .catch(() => toast.error("Something went wrong"));
    })
  }

  return (
    <div
      className={cn("flex items-start gap-3 p-4 transition relative",
        n.isRead ? "hover:bg-gray-100" : "bg-blue-100"
      )}
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
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MoreVertical className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={handleMarkAsReadOrUnRead}
            disabled={isPending}
          >
            {n.isRead ? "Mark as unread" : "Mark as read"}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteNotification}
            disabled={isPending}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}