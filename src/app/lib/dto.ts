import 'server-only';

import { getUser } from './dal';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

//implement to see username
/* function canSeeUsername(viewer: { isAdmin: boolean; team: string }) {
  return true;
} */

//implement to see phone number
/* function canSeePhoneNumber(viewer: { isAdmin: boolean; team: string }, team: string) {
  return viewer.isAdmin || team === viewer.team;
} */

  function canSeeBaseInfo (viewer: { created_at: string; }, create: string) {
    return viewer.created_at || create === viewer.created_at;
  }


export async function getProfileDTO(id: string) {
  try {
    const data = await sql<{ id: string; first_name: string; last_name: string; email: string; created_at: string; }[]>`
      SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ${id}
    `;

    if (data.length === 0) return null;
    const user = data[0];
    const currentUser = await getUser();

    return {
      //username: currentUser && canSeeUsername(currentUser) ? user.username : null,
      //phonenumber: currentUser && canSeePhoneNumber(currentUser, user.team) ? user.phonenumber : null,
      baseinfo: currentUser && canSeeBaseInfo(currentUser, user.created_at) ? user : null,
    };
  } catch (error) {
    console.error('Failed to fetch profile DTO:', error);
    return null;
  }
}