import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TabsContent } from "./ui/tabs";
import { Friend, User } from "@/generated/prisma/client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { unFriend } from "@/actions/friend";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useOnlineUsersContext } from "@/context/online-users";
import { useTrackFriendsStore } from "@/lib/zustand";
import { LocateFixed, UserMinus } from "lucide-react";

export async function getFriend(debounceSearch: string) {
  const res = await fetch("/api/friend?search=" + debounceSearch);
  const data = await res.json();
  return data as (Friend & { requester: User | null, receiver: User | null })[]
}

type FriendType = {
  me: User | null
}

export function FriendTab({ me }: FriendType) {
  const { onlineUsers } = useOnlineUsersContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("")
  const [debounceSearch, setDebounceSearch] = useState("")
  const setUserIdToTrack = useTrackFriendsStore(s => s.setUserId)
  const userIdToTrack = useTrackFriendsStore(s => s.userId)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [search])

  const {
    data: friends
  } = useQuery({
    queryKey: ['friend', debounceSearch],
    queryFn: () => getFriend(debounceSearch)
  })

  const mutationUnFriend = useMutation({
    mutationFn: async (id: string) => {
      const data = await unFriend(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] })
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["friend"] });
    }
  })

  return (
    <TabsContent
      value="friend"
      className="flex flex-col min-h-0"
    >
      {/* Search bar */}
      <div className="bg-white pb-2">
        <div className="flex items-center gap-2 w-full px-3 py-2 border rounded-xl bg-gray-100 focus-within:bg-white focus-within:border-gray-300 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.22-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            onChange={e => setSearch(e.target.value)}
            value={search}
            placeholder="Search people by their name or email"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {(!friends || friends.length === 0) && (
        <p className="text-gray-500 text-sm text-center py-4">
          No friends yet.
        </p>
      )}

      <div className='flex flex-col gap-2 overflow-auto'>
        {friends?.map((item) => {
          const myFriend = item.requester?.id === me?.id ? item.receiver : item.requester;
          const isOnline = onlineUsers.find(user => user.id === myFriend?.id);
          const hasLatAndLng = onlineUsers.some((u) => (
            u.id === myFriend?.id && u.lat && u.lng
          ))

          return (
            <div
              key={item.id}
              className="flex items-start gap-4 p-3 rounded-xl border bg-white shadow-sm"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <Image
                  src={myFriend?.image ?? ""}
                  alt={myFriend?.name ?? "Unknown user"}
                  width={200}
                  height={200}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                {isOnline && (
                  <span className="absolute -right-0.5 bottom-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow" />
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 line-clamp-1">
                    {myFriend?.name ?? "Unknown user"}
                  </span>

                  <span className="text-sm text-gray-500 line-clamp-">
                    {myFriend?.email}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className={cn(
                          "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
                        )}
                      >
                        <UserMinus className="w-4 h-4" />
                        Unfriend
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to unfriend {myFriend?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          They will be removed from your friends list. You&apos;ll need to send a new friend request if you want to connect again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => mutationUnFriend.mutate(item.id)}
                          disabled={mutationUnFriend.isPending}
                          className="bg-red-600 hover:bg-red-700 duration-200"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    onClick={() => setUserIdToTrack(myFriend?.id || "")}
                    disabled={hasLatAndLng ? false : true}
                    variant="default"
                    className={cn(
                      "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95",
                      myFriend?.id === userIdToTrack && "bg-yellow-400 hover:bg-yellow-500"
                    )}
                  >
                    <LocateFixed className="w-4 h-4" />
                    {myFriend?.id === userIdToTrack ? "Tracking" : "Track"}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TabsContent>
  )
}
