"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"; // Google icon

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Image - hide on mobile */}
      <div className="hidden md:block md:w-1/2 h-64 md:h-auto">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        ></div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-5 bg-gray-50 relative">
        {/* Floating card on mobile */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:bg-transparent md:shadow-none">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In to FindMe
          </h1>

          <form className="space-y-4">
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
              Sign In
            </Button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            className="w-full border border-gray-300 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
