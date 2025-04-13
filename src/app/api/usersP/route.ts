import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type User = {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash?: string;
    created_at?: string;
};

async function getUsers(): Promise<User[]> {
    const data = await sql<User[]>`
    SELECT id, first_name, last_name, email
    FROM users;
    `;
    return data;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request): Promise<Response> {
    try {
        
            // Fetch all users

            const users = await getUsers();

            return new Response(JSON.stringify(users), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching users' }), { status: 500 });
    }
}