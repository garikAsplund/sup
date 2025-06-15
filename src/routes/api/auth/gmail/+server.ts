import { redirect } from '@sveltejs/kit';
import { GMAIL_CLIENT_ID } from '$env/static/private';

export async function GET() {
  const params = new URLSearchParams({
    client_id: GMAIL_CLIENT_ID,
    redirect_uri: 'http://localhost:5173/auth/callback',
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });

  throw redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}