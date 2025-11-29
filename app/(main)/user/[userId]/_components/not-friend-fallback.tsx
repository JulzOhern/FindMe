"use client";

import { Button } from '@/components/ui/button'
import { Friend, User } from '@/generated/prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, UserMinus, UserPlus, UserPlus2, UserX } from 'lucide-react'

import { acceptRequest, addFriend, cancelRequest, declineRequest } from '@/actions/people';

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
import { cn } from '@/lib/utils';

type NotFriendFallbackProps = {
  user: (User & { receivedFriends: Friend[], requestedFriends: Friend[] }) | null
  me: User | null
}

export function NotFriendFallback({ user, me }: NotFriendFallbackProps) {
  const queryClient = useQueryClient();
  const myFriendRequest = user?.receivedFriends.find(friend => (
    friend.requesterId === me?.id
  ))
  const receivedFriendRequest = user?.requestedFriends.find(friend => (
    friend.receiverId === me?.id
  ))

  const isAddFriend = (!myFriendRequest && !receivedFriendRequest)
  const isCancelRequest = myFriendRequest?.status === "PENDING" && !receivedFriendRequest
  const isAcceptRequest = receivedFriendRequest?.status === "PENDING" && receivedFriendRequest

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return
      const receiverId = user?.id;
      if (isAddFriend) return await addFriend(receiverId);
      if (isCancelRequest) return await cancelRequest(receiverId);
      if (isAcceptRequest) return await acceptRequest(receiverId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["people"] })
    }
  })

  const mutationDecline = useMutation({
    mutationFn: async () => {
      if (!user?.id) return
      const requesterId = user?.id;
      const data = await declineRequest(requesterId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["friend"] });
    }
  })

  return (
    <div className="mt-10 p-8 rounded-3xl border bg-card flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shadow-inner">
        <UserPlus2 />
      </div>

      <h2 className="text-xl font-semibold mt-6">You're not friends yet</h2>

      <p className="text-muted-foreground max-w-sm mt-2">
        Add this user as your friend to view their live location and interact with them.
      </p>

      <div className="flex items-center gap-1">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || mutationDecline.isPending}
          className={cn(
            "mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium transition-all",
            isAddFriend && "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
            isCancelRequest && "bg-neutral-500 text-white hover:bg-neutral-600 active:scale-[0.98]",
            isAcceptRequest && "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
          )}
        >
          {isAddFriend && (
            <>
              <UserPlus className="w-4 h-4" />
              Add Friend
            </>
          )}
          {isCancelRequest && (
            <>
              <UserX className="w-4 h-4" />
              Cancel Request
            </>
          )}
          {isAcceptRequest && (
            <>
              <UserCheck className="w-4 h-4" />
              Accept Request
            </>
          )}
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
  )
}
