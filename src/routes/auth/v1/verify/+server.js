import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase-api';

export async function GET({ url }) {
    const code = url.searchParams.get('code');
    const token_hash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    
    console.log('Verification params:', { code, token_hash, type });
    
    try {
        if (code) {
            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('Error exchanging code for session:', error);
                throw redirect(303, '/login?error=Invalid or expired verification link');
            }
            
            console.log('Email verification successful:', data);
            // Successful verification - redirect to confirm-email page to show success
            throw redirect(303, '/confirm-email?verified=true');
        } else if (token_hash && type) {
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
        } else {
            // No verification parameters provided
            console.error('No verification parameters provided');
            throw redirect(303, '/login?error=No verification code provided');
        }
    } catch (error) {
        if (error.status && error.location) {
            // This is already a redirect, re-throw it
            throw error;
        }
        console.error('Unexpected error in verification:', error);
        throw redirect(303, '/login?error=Verification failed');
    }
}

// Handle manual verification code submission
export async function POST({ request }) {
    try {
        const { email, code } = await request.json();
        
        if (!email || !code) {
            return new Response(
                JSON.stringify({ error: 'Email and verification code are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        // Verify the OTP code
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'email'
        });
        
        if (error) {
            console.error('Error verifying manual code:', error);
            return new Response(
                JSON.stringify({ error: 'Invalid or expired verification code' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        console.log('Manual verification successful:', data);
        return new Response(
            JSON.stringify({ success: true, message: 'Email verified successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error in manual verification:', error);
        return new Response(
            JSON.stringify({ error: 'Verification failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}