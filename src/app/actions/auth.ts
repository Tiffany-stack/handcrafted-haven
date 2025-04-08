'use server';

import bcrypt from 'bcryptjs';
import { SignupFormSchema, FormState, LoginFormSchema } from '../lib/definitions';
import postgres from 'postgres';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

// Database connection
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function login(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 2. Check if the email exists in the database
  const user = await sql`
    SELECT id, email, password_hash FROM users WHERE email = ${email};
  `;

  if (user.length === 0) {
    return {
      errors: { email: ['No user found with this email address.'] },
    };
  }

  const dbUser = user[0];

  // 3. Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compareSync(password, dbUser.password_hash);
  if (!passwordMatch) {
    return {
      errors: { password: ['Incorrect email or password. Please try again.'] },
    };
  }

  // 4. Create user session
  await createSession(dbUser.id);

  // 5. Redirect user to their profile page
  redirect('/');
}

export async function signup(state: FormState, formData: FormData) {
  //await logout();
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    fname: formData.get('fname'),
    lname: formData.get('lname'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { fname, lname, email, password } = validatedFields.data;

  // Check if the email already exists in the database
  const existingUser = await sql`
    SELECT id, email FROM users WHERE email = ${email};
  `;

  if (existingUser.length > 0) {
    //console.log('Email already exists, returning error'); // Debugging line
    return {
      errors: { email: ['Email is already in use. Please choose a different email.'] },
    };
  }
  

  // Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database
  const data = await createUser(fname, lname, email, hashedPassword);

  console.log(data[0])

  const user = data[0];

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  
  // Clear form fields safely
  formData.set("fname", "");
  formData.set("lname", "");
  formData.set("email", "");
  formData.set("password", "");

  // 4. Create user session
  await createSession(user.id);

  // 5. Redirect user to profile page
  redirect('/');
}

export async function logout() {
    deleteSession()
    redirect('/login')
}

// Function to create a new user
async function createUser(fname: string, lname: string, email: string, passwordHash: string) {
  const data = await sql`
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES (${fname}, ${lname}, ${email}, ${passwordHash})
    RETURNING id, first_name, last_name, email, created_at;
  `;

  return data;
}

/* const session = await verifySession()
  const userRole = session?.user?.role
 
  // Return early if user is not authorized to perform the action
  if (userRole !== 'admin') {
    return null
  } */