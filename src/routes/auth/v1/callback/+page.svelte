<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast.js';

	let status = $state('processing'); // 'processing', 'success', 'error'
	let errorMessage = $state('');

	onMount(async () => {
		try {
			// First, try to get session from URL hash (OAuth callback)
			const { data: sessionData, error: sessionError } = await supabase.auth.getSessionFromUrl();
			
			if (sessionError) {
				console.error('OAuth callback error:', sessionError);
				status = 'error';
				errorMessage = sessionError.message;
				return;
			}

			// Check if we got a session from the URL
			if (sessionData.session) {
				status = 'success';
				toastStore.show('Successfully signed in with GitHub!', 'success');
				
				// Redirect to dashboard after a brief delay
				setTimeout(() => {
					goto('/dashboard');
				}, 1500);
			} else {
				// If no session from URL, check if there's already an active session
				const { data: currentSession } = await supabase.auth.getSession();
				
				if (currentSession.session) {
					status = 'success';
					toastStore.show('Already signed in!', 'success');
					setTimeout(() => {
						goto('/dashboard');
					}, 1500);
				} else {
					// No session found anywhere, redirect to login
					status = 'error';
					errorMessage = 'No session found. Please try signing in again.';
					
					setTimeout(() => {
						goto('/login');
					}, 3000);
				}
			}
		} catch (err) {
			console.error('Unexpected error during OAuth callback:', err);
			status = 'error';
			errorMessage = 'An unexpected error occurred. Please try again.';
			
			setTimeout(() => {
				goto('/login');
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>Authenticating - SoftoVault</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-900">
	<div class="max-w-md w-full mx-auto px-4">
		<div class="text-center">
			{#if status === 'processing'}
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
				<h1 class="text-2xl font-bold text-white mb-2">Authenticating...</h1>
				<p class="text-gray-400">Please wait while we complete your GitHub sign-in.</p>
			{:else if status === 'success'}
				<div class="w-12 h-12 mx-auto mb-4 text-green-500">
					<svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-white mb-2">Success!</h1>
				<p class="text-gray-400">You've been successfully signed in. Redirecting to your dashboard...</p>
			{:else if status === 'error'}
				<div class="w-12 h-12 mx-auto mb-4 text-red-500">
					<svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
				<p class="text-gray-400 mb-4">{errorMessage}</p>
				<p class="text-sm text-gray-500">You will be redirected to the login page shortly.</p>
			{/if}
		</div>
	</div>
</div>
