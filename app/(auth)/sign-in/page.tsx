"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  async function handleOauthSignIn(provider: string) {
    await signIn(provider, { callbackUrl: "/" })
      .then(() => console.log("Sign-in successful"))
      .catch(error => console.error(error));
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Image */}
      <div className="hidden md:block md:w-1/2 h-64 md:h-auto">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        ></div>
      </div>

      {/* Right Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 md:p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to FindMe
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Track your friend's locations in real-time and see their route directions.
            Stay connected and never get lost again.
          </p>

          {/* Google OAuth Button */}
          <Button
            onClick={() => handleOauthSignIn("google")}
            type="button"
            className="w-full border border-gray-300 flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition mb-6"
          >
            <FcGoogle size={24} />
            Sign in with Google
          </Button>

          <p className="text-gray-400 text-xs mt-4">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
