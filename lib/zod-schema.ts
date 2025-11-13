import * as z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.email({ error: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least 1 special character" }),
})