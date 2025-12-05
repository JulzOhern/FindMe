"use client"

import { unFriend } from "@/actions/people"
import { Button } from "@/components/ui/button"
import { Friend, User } from "@/app/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
import { UserMinus } from "lucide-react"

type UnFriendButtonProps = {
  user: (User & { receivedFriends: Friend[], requestedFriends: Friend[] }) | null
  me: User | null
}

export function UnFriendButton({ user, me }: UnFriendButtonProps) {
  const queryClient = useQueryClient();
  const myFriendRequest = user?.receivedFriends.find(friend => (
    friend.requesterId === me?.id
  ))
  const receivedFriendRequest = user?.requestedFriends.find(friend => (
    friend.receiverId === me?.id
  ))

  const isUnFriend = myFriendRequest?.status === "ACCEPTED" || receivedFriendRequest?.status === "ACCEPTED"

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return
      const receiverId = user?.id;
      if (isUnFriend) return await unFriend(receiverId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-request"] });
      queryClient.invalidateQueries({ queryKey: ["people"] })
    }
  })

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="mt-3 w-fit px-4 py-1.5 text-sm rounded-lg font-medium transition-all bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
          >
            <UserMinus className="w-4 h-4" />
            Unfriend
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to unfriend {user?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be removed from your friends list. You&apos;ll need to send a new friend request if you want to connect again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="bg-red-600 hover:bg-red-700 duration-200"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
