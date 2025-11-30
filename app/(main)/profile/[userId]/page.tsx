import { getMe } from "@/GET/me";
import { notFound } from "next/navigation";
import { Form } from "./_components/form";

export async function generateMetadata() {
  const me = await getMe();

  return {
    title: me?.name
  }
}

export default async function ProfilePage() {
  const me = await getMe();

  if (!me) return notFound();

  return <Form me={me} />
}
