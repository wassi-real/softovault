import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase-api';

export async function GET({ url }) {
    const code = url.searchParams.get('code');
    
    if (code) {
        try {
            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('Error exchanging code for session:', error);
                throw redirect(303, '/login?error=Invalid or expired verification link');
            }
            
            // Successful verification
            throw redirect(303, '/dashboard');
        } catch (error) {
            console.error('Error in auth verification:', error);
            throw redirect(303, '/login?error=Verification failed');
        }
    }
    
    // No code provided
    throw redirect(303, '/login?error=No verification code provided');
} 