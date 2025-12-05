"use server";

import { revalidatePath } from "next/cache";

export async function revalidateNotif() {
  revalidatePath("/notifications");
}