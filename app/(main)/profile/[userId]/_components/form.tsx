"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/generated/prisma/client'
import { ArrowLeft } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type FormProps = {
  me: User | null
}

export function Form({ me }: FormProps) {
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
      <div className="flex flex-col items-center mt-6">
        <Image
          src={me?.image || ""}
          alt={me?.name || "Profile picture"}
          width={120}
          height={120}
          className="w-28 h-28 rounded-full object-cover border shadow-sm"
        />

        <h1 className="mt-4 text-2xl font-semibold">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your account details
        </p>
      </div>

      {/* Form */}
      <form className="mt-10 space-y-6">
        {/* Name */}
        <div className="flex flex-col space-y-1.5">
          <Label>Name</Label>
          <Input
            defaultValue={me?.name || ""}
            placeholder="Enter your name"
            className="rounded-lg"
          />
        </div>

        {/* Email (Read Only) */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Email Addresses</h3>

          {/* Email Item */}
          <div className="flex items-center space-x-2">
            <span>{me?.email}</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Primary</span>
            <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">Google</span>
          </div>

          {/* Add Email */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-red-600 text-sm font-medium hover:underline mt-2"
              >
                + Add Email Address
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Email Address</DialogTitle>
                <DialogDescription>
                  Enter the email address you want to add to your account.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" placeholder="example@example.com" />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  className='bg-blue-600 hover:bg-blue-700'
                  type="submit"
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
