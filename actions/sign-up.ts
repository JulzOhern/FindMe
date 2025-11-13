"use server";

import { signUpSchema } from '@/lib/zod-schema';
import * as z from 'zod'

import bcrypt from "bcryptjs"
import { prisma } from '@/lib/prisma';

export async function signUp(data: z.infer<typeof signUpSchema>) {
  try {
    const { name, email, password } = data

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (user && user.email) return { error: "Email already exists" }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    })

    return { data: newUser }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error("Failed to sign up " + error.message);
    }
  }
}