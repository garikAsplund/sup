// src/routes/api/emails/+server.ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types.js';
import type { EmailDisplay, GmailListResponse, GmailMessageDetails } from '$lib/types.js';

export const GET: RequestHandler = async ({ cookies }) => {
  const userId = cookies.get('user_id');
  
	if (!userId) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
		const userRecord = user[0];

		if (!userRecord || !userRecord.accessToken) {
			return json({ error: 'User not found or not authenticated' }, { status: 404 });
		}

		// Get message list
		const listResponse = await fetch(
			'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10',
			{
				headers: {
					Authorization: `Bearer ${userRecord.accessToken}`,
					Accept: 'application/json'
				}
			}
		);

		const listData: GmailListResponse = await listResponse.json();

		// Fetch details for each message
		const emailPromises = (listData.messages || []).map(async (msg) => {
			const detailResponse = await fetch(
				`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
				{
					headers: { Authorization: `Bearer ${userRecord.accessToken}` }
				}
			);

			const detail: GmailMessageDetails = await detailResponse.json();

			// Extract useful info
			const headers = detail.payload.headers;
			const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
			const sender = headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';
			const date = new Date(parseInt(detail.internalDate));

			return {
				id: detail.id,
				subject,
				sender,
				snippet: detail.snippet,
				date,
				isRead: !detail.labelIds.includes('UNREAD')
			} as EmailDisplay;
		});

		const emails = await Promise.all(emailPromises);
		return json({ emails });
	} catch (error) {
		console.error('Email fetch error:', error);
		return json({ error: 'Failed to fetch emails' }, { status: 500 });
	}
};
