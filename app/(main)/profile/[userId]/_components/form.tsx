"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/generated/prisma/client'
import { ArrowLeft } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { changeName, changeProfile } from '@/actions/profile'
import { toast } from 'sonner'
import { UploadButton } from '@/utils/uploadthing'

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type FormProps = {
  me: User | null
}

export function Form({ me }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema) });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    await changeName(data.name)
      .then(() => toast.success("Name updated!"))
      .catch(() => toast.error("Error updating name"));
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      {/* Profile Image */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        {/* Avatar Container */}
        <div className='shrink-0'>
          <Image
            src={me?.image || ""}
            alt={me?.name || "Profile picture"}
            width={450}
            height={550}
            className="w-36 h-36 rounded-full object-cover border shadow-md transition-all group-hover:shadow-lg group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your account details
          </p>
        </div>

        {/* Upload Button */}
        <div className="mt-2">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: "bg-primary text-white text-sm px-4 py-2 rounded-lg shadow transition hover:bg-primary/90",
              container: "flex justify-center",
            }}
            onClientUploadComplete={(res) => {
              // console.log("Files: ", res);
              changeProfile(res)
                .then(() => {
                  toast.success("Profile picture updated!", {
                    description: "Your profile picture has been updated."
                  })
                })
                .catch(() => toast.error("Error updating profile picture"));
            }}
            onUploadError={(error: Error) => {
              toast.error("Error uploading profile", {
                description: error.message
              });
            }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-6"
      >
        {/* Name */}
        <div className="flex flex-col space-y-1.5">
          <Label>Name</Label>
          <Input
            defaultValue={me?.name || ""}
            placeholder="Enter your name"
            className="rounded-lg"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 font-semibold">Email Address</Label>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
            <span className="text-gray-800 font-medium">{me?.email || "No email found"}</span>

            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
              Verified
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            This is the primary email associated with your account.
          </p>
        </div>

        {/* Save Changes and Logout Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm transition"
          >
            Save Changes
          </Button>

          <Button
            variant="destructive"
            className="w-full py-2 rounded-lg transition bg-red-500/10 hover:bg-red-500/20 text-red-500"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </form>
    </div>
  )
}
