'use server';

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { cache } from 'react';
import postgres from 'postgres';
//import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const verifySession = cache(async () => {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  const session = await decrypt(sessionCookie);
  
  if (!session?.userId) {
    return null;
  }
  return { isAuth: true, userId: session.userId.toString() };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await sql<{ id: string; first_name: string; last_name: string; email: string; created_at: string; }[]>`
      SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ${session.userId}
    `;

    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
});