"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { utapi } from "@/app/api/uploadthing/core";
import { ClientUploadedFileData } from "uploadthing/types";
import { revalidatePath } from "next/cache";

export async function changeName(newName: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  if (newName.length < 2) throw new Error("Name must be at least 2 characters");

  await prisma.user.update({
    where: {
      id: me.id
    },
    data: {
      name: newName
    }
  })
}

export async function changeProfile(
  res: ClientUploadedFileData<{ uploadedBy: string }>[]
) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  if (!res?.length) throw new Error("No file uploaded");

  const profileUrl = res?.[0]?.ufsUrl;

  const fileKey = me.image?.split('/').pop();

  if (fileKey) {
    try {
      await utapi.deleteFiles([fileKey])
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  await prisma.user.update({
    where: {
      id: me.id
    },
    data: {
      image: profileUrl
    }
  })

  revalidatePath("/");
  revalidatePath(`/profile/${me.id}`);
}