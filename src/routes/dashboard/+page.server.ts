// src/routes/dashboard/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ cookies }) => {
	const userId = cookies.get('user_id');

	if (!userId) {
		throw redirect(302, '/');
	}

	const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
	const userRecord = user[0]; // Get first element from array

	console.log('User query result:', user);
	console.log('User record:', userRecord);

	if (!userRecord) { // Check the actual record, not the array
		throw redirect(302, '/');
	}

	const returnData = {
		user: {
			id: userRecord.id, // Use userRecord, not user
			email: userRecord.email
		}
	};

	console.log('Returning:', returnData);
	return returnData;
};