import { getUser } from "@/GET/user";
import { ProfileImage } from "./_components/profile-image";
import { Leaflet } from "./_components/leaflet";
import { getMe } from "@/GET/me";
import { NotFriendFallback } from "./_components/not-friend-fallback";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { UnFriendButton } from "./_components/unfriend-btn";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUser(userId);
  const me = await getMe();
  const isFriend = user?.receivedFriends.some((r) => r.requesterId === me?.id && r.status === "ACCEPTED") || user?.requestedFriends.some((r) => r.receiverId === me?.id && r.status === "ACCEPTED");

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-muted-foreground">
        User not found.
      </div>
    );
  }

  const joinedAt = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{user.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <ProfileImage user={user} />

        {/* User Info + Joined + Button */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{user.name}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {/* Icon circle for visual cue */}
            <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-500 rounded-full text-xs font-semibold">
              🗓
            </span>

            {/* Joined text */}
            <span className="text-sm">
              Joined <span className="font-medium text-orange-600">{joinedAt}</span>
            </span>
          </div>

          {/* Unfriend Button below joined date */}
          {isFriend && <UnFriendButton user={user} me={me} />}
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

      {isFriend ? (
        <Leaflet user={user} me={me} />
      ) : (
        <NotFriendFallback user={user} me={me} />
      )}
    </div>
  );
}
