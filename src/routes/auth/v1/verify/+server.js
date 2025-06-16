import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase-api';

export async function GET({ url }) {
    const code = url.searchParams.get('code');
    const token_hash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    
    console.log('Verification params:', { code, token_hash, type });
    
    if (code) {
        try {
            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('Error exchanging code for session:', error);
                throw redirect(303, '/login?error=Invalid or expired verification link');
            }
            
            console.log('Email verification successful:', data);
            // Successful verification - redirect to confirm-email page to show success
            throw redirect(303, '/confirm-email?verified=true');
        } catch (error) {
            console.error('Error in auth verification:', error);
            throw redirect(303, '/login?error=Verification failed');
        }
    } else if (token_hash && type) {
        try {
            // Handle token-based verification (alternative method)
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash,
                type: 'email'
            });
            
            if (error) {
                console.error('Error verifying OTP:', error);
                throw redirect(303, '/login?error=Invalid or expired verification link');
            }
            
            console.log('Token verification successful:', data);
            throw redirect(303, '/confirm-email?verified=true');
        } catch (error) {
            console.error('Error in token verification:', error);
            throw redirect(303, '/login?error=Verification failed');
        }
    }
    
    // No verification parameters provided
    console.error('No verification parameters provided');
    throw redirect(303, '/login?error=No verification code provided');
}