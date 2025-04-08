import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  fname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long. ' })
    .trim(),
  lname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long. ' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email. ' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long ' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter. ' })
    .regex(/\d/, { message: 'Contain at least one number. ' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character. ',
    })
    .trim(),
});
 
export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required. ' })
    .email({ message: 'Please enter a valid email address. ' })
    .trim(),

  password: z
    .string()
    .min(1, { message: 'Password is required. ' }) // No strict length rules for login
    .trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export type baseinfo = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
} 

export type Profile = {
  baseinfo: baseinfo
}