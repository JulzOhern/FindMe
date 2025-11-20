import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TabsContent } from './ui/tabs'
import { Friend, User } from '@/generated/prisma/client';
import Image from 'next/image';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { acceptRequest, declineRequest } from '@/actions/friend-request';
import { useEffect, useState } from 'react';
import { useOnlineUsersContext } from '@/context/online-users';
import { UserCheck, UserMinus, XCircle } from 'lucide-react';

async function getFriendRequest(search: string) {
  const res = await fetch("/api/friend-request?search=" + search);
  const data = await res.json();
  return data as (Friend & { requester: User | null })[] | null
}

type FriendRequestTabProps = {
  getFriendRequestCount: (count: number) => void
}

export function FriendRequestTab({ getFriendRequestCount }: FriendRequestTabProps) {
  const { onlineUsers } = useOnlineUsersContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [search]);

  const {
    data: friendRequest
  } = useQuery({
    queryKey: ['friend-request', debounceSearch],
    queryFn: () => getFriendRequest(debounceSearch)
  })

  useEffect(() => {
    getFriendRequestCount(friendRequest?.length || 0);
  }, [friendRequest?.length, getFriendRequestCount]);

  const mutationAcceptRequest = useMutation({
    mutationFn: async (id: string) => {
      const data = await acceptRequest(id);
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] })
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["friend"] });
    }
  })

  const mutationDeclineRequest = useMutation({
    mutationFn: async (id: string) => {
      const data = await declineRequest(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] })
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
    }
  })

  return (
    <TabsContent
      value="friend-request"
      className="flex flex-col min-h-0"
    >
      {/* Search bar */}
      <div className="sticky top-0 bg-white pb-2 z-10">
        <div className="flex items-center gap-2 w-full px-3 py-2 border rounded-xl bg-gray-100 focus-within:bg-white focus-within:border-gray-300 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
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

      {(!friendRequest || friendRequest.length === 0) && (
        <p className="text-gray-500 text-sm text-center py-4">
          No friend requests yet.
        </p>
      )}

      <div className='flex flex-col gap-2 overflow-auto'>
        {friendRequest?.map((item) => {
          const isOnline = onlineUsers.find(user => user.id === item.requester?.id);

          return (
            <div
              key={item.id}
              className="flex items-start gap-4 p-3 rounded-xl border bg-white shadow-sm"
            >
              {/* Avatar */}
              <div className='relative shrink-0'>
                <Image
                  src={item.requester?.image ?? ""}
                  alt={item.requester?.name ?? "Unknown user"}
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
                    {item.requester?.name ?? "Unknown user"}
                  </span>

                  <span className="text-sm text-gray-500 line-clamp-">
                    {item.requester?.email}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => mutationAcceptRequest.mutate(item.id)}
                    disabled={mutationAcceptRequest.isPending}
                    className={cn(
                      "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium transition-all",
                      item.status === "PENDING" && "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]",
                    )}
                  >
                    {item.status === "PENDING" ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Accept
                      </>
                    ) : (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Unfriend
                      </>
                    )}
                  </Button>

                  {item.status === "PENDING" && (
                    <Button
                      onClick={() => mutationDeclineRequest.mutate(item.id)}
                      disabled={mutationDeclineRequest.isPending}
                      className={cn(
                        "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-all",
                      )}
                    >
                      <XCircle className="w-4 h-4" />
                      Declined
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TabsContent>
  )
}
