import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET } from '$env/static/private';

export async function GET({ url }) {
  const code = url.searchParams.get('code');
  
  if (!code) {
    throw redirect(302, '/?error=no_code');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173/auth/callback'
      })
    });

    const tokens = await tokenResponse.json();
    console.log('Tokens:', tokens); // Debug

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    
    const userInfo = await userResponse.json();
    console.log('User info:', userInfo); // Debug

    // Store in database
    await db.insert(users).values({
      id: userInfo.id,
      email: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      createdAt: new Date()
    });

    throw redirect(302, '/dashboard');
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw redirect(302, '/?error=callback_failed');
  }
}