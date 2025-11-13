"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Image - hide on mobile */}
      <div className="hidden md:block md:w-1/2 h-64 md:h-auto">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        ></div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-5 relative">
        {/* Floating card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:bg-transparent md:shadow-none">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Your FindMe Account
          </h1>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Sign-Up Button */}
          <Button
            type="button"
            className="w-full border border-gray-300 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
