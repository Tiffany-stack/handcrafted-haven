'use server';

import { NextResponse } from 'next/server';
import { getProfileDTO } from '@/app/lib/dto';
import { verifySession } from '@/app/lib/dal';
import { deleteSession } from '@/app/lib/session';

export async function GET() {
    try {
        const session = await verifySession();

        if (!session || !session.userId) { 
            return NextResponse.json({ error: 'Unauthorized' }, { status: 200 });
        }

        const profile = await getProfileDTO(session.userId);

        if (!profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await deleteSession(); // Handle session deletion
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error("Error logging the user out:", error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}