import Image from 'next/image';
import { TabsContent } from './ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Friend, User } from '@/generated/prisma/client';
import { acceptRequest, addFriend, cancelRequest, declineRequest, unFriend } from '@/actions/people';
import { cn } from '@/lib/utils';

async function getPeople(search: string) {
  const response = await fetch(`/api/people?search=${search}`);
  const data = await response.json();
  return data as (User & { receivedFriends: Friend[], requestedFriends: Friend[] })[] | null;
}

type PeopleTabProps = {
  me: User | null
}

type PeopleCardProps = {
  item: User & { receivedFriends: Friend[], requestedFriends: Friend[] }
  me: User | null
}

export function PeopleTab({ me }: PeopleTabProps) {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("")

  const { data: people } = useQuery({
    queryKey: ['people', debounceSearch],
    queryFn: () => getPeople(debounceSearch)
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [search]);

  return (
    <TabsContent
      value="people"
      className="flex flex-col min-h-0"
    >
      {/* Search bar */}
      <div className="bg-white pb-2">
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

      {(!people || people.length === 0) && (
        <p className="text-gray-500 text-sm text-center py-4">
          No people available.
        </p>
      )}

      <div className='flex flex-col gap-2 overflow-auto'>
        {people?.map((item) => (
          <PeopleCard
            key={item.id}
            item={item}
            me={me}
          />
        ))}
      </div>
    </TabsContent>
  )
}

function PeopleCard({ item, me }: PeopleCardProps) {
  const queryClient = useQueryClient();
  const myFriendRequest = item.receivedFriends.find(friend => (
    friend.requesterId === me?.id
  ))
  const receivedFriendRequest = item.requestedFriends.find(friend => (
    friend.receiverId === me?.id
  ))

  const isAddFriend = (!myFriendRequest && !receivedFriendRequest)
  const isCancelRequest = myFriendRequest?.status === "PENDING" && !receivedFriendRequest
  const isAcceptRequest = receivedFriendRequest?.status === "PENDING" && receivedFriendRequest
  const isUnFriend = myFriendRequest?.status === "ACCEPTED" || receivedFriendRequest?.status === "ACCEPTED"

  const mutation = useMutation({
    mutationFn: async () => {
      const receiverId = item.id;
      if (isAddFriend) return await addFriend(receiverId);
      if (isCancelRequest) return await cancelRequest(receiverId);
      if (isAcceptRequest) return await acceptRequest(receiverId);
      if (isUnFriend) return await unFriend(receiverId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["people"] })
    }
  })

  const mutationDecline = useMutation({
    mutationFn: async () => {
      const requesterId = item.id;
      const data = await declineRequest(requesterId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["people"] });
    }
  })

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl border bg-white shadow-sm">
      {/* Avatar */}
      <Image
        src={item.image ?? ""}
        alt={item.name ?? "Unknown user"}
        width={200}
        height={200}
        className="w-12 h-12 rounded-full object-cover border"
      />

      {/* Right content */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-900 line-clamp-1">
            {item.name ?? "Unknown user"}
          </span>

          <span className="text-sm text-gray-500 line-clamp-">
            {item.email}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || mutationDecline.isPending}
            className={cn(
              "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium transition-all",
              isAddFriend && "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
              isCancelRequest && "bg-neutral-500 text-white hover:bg-neutral-600 active:scale-[0.98]",
              isAcceptRequest && "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]",
              isUnFriend && "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
            )}
          >
            {isAddFriend && "Add Friend"}
            {isCancelRequest && "Cancel Request"}
            {isAcceptRequest && "Accept Request"}
            {isUnFriend && "Unfriend"}
          </Button>

          {receivedFriendRequest && receivedFriendRequest.status === "PENDING" && (
            <Button
              onClick={() => mutationDecline.mutate()}
              disabled={mutationDecline.isPending}
              className={cn(
                "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-all",
              )}
            >
              Declined
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}