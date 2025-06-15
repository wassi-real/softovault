<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import { toastStore } from '$lib/stores/toast.js';
	import { supabase } from '$lib/supabase.js';
	import Button from '$lib/components/Button.svelte';
	import { Mail, CheckCircle, Clock } from 'lucide-svelte';

	let email = $state('');
	let resendLoading = $state(false);
	let resendCooldown = $state(0);
	let intervalId;

	onMount(() => {
		// Get email from URL params or auth store
		const urlParams = new URLSearchParams(window.location.search);
		email = urlParams.get('email') || '';

		// Check if user is already confirmed
		const unsubscribe = auth.subscribe(({ user, loading }) => {
			if (!loading && user && user.email_confirmed_at) {
				goto('/dashboard');
			}
		});

		// Start cooldown timer if there's a timestamp in localStorage
		const lastResend = localStorage.getItem('lastEmailResend');
		if (lastResend) {
			const timeSinceResend = Date.now() - parseInt(lastResend);
			const remainingCooldown = Math.max(0, 60000 - timeSinceResend); // 60 second cooldown
			if (remainingCooldown > 0) {
				startCooldown(Math.ceil(remainingCooldown / 1000));
			}
		}

		return () => {
			if (unsubscribe) unsubscribe();
			if (intervalId) clearInterval(intervalId);
		};
	});

	function startCooldown(seconds) {
		resendCooldown = seconds;
		intervalId = setInterval(() => {
			resendCooldown--;
			if (resendCooldown <= 0) {
				clearInterval(intervalId);
			}
		}, 1000);
	}

	async function resendConfirmation() {
		if (!email || resendLoading || resendCooldown > 0) return;

		resendLoading = true;
		try {
			const { error } = await supabase.auth.resend({
				type: 'signup',
				email: email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) throw error;

			toastStore.show('Confirmation email sent successfully!', 'success');
			localStorage.setItem('lastEmailResend', Date.now().toString());
			startCooldown(60); // 60 second cooldown
		} catch (error) {
			toastStore.show(error.message || 'Failed to resend confirmation email', 'error');
		} finally {
			resendLoading = false;
		}
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<svelte:head>
	<title>Confirm Your Email - SoftoVault</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<div class="bg-blue-500/10 border border-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
			<Mail class="w-8 h-8 text-blue-400" />
		</div>
		<h1 class="text-3xl font-bold mb-2">Check Your Email</h1>
		<p class="text-gray-400 mb-6">
			We've sent a confirmation link to
			{#if email}
				<span class="text-white font-medium">{email}</span>
			{:else}
				your email address
			{/if}
		</p>
	</div>

	<div class="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
		<div class="flex items-start space-x-3 mb-4">
			<CheckCircle class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
			<div>
				<h3 class="font-medium text-white mb-1">Click the confirmation link</h3>
				<p class="text-sm text-gray-400">Open the email and click the confirmation link to verify your account.</p>
			</div>
		</div>
		<div class="flex items-start space-x-3">
			<Clock class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
			<div>
				<h3 class="font-medium text-white mb-1">Access your dashboard</h3>
				<p class="text-sm text-gray-400">Once confirmed, you'll be automatically redirected to your dashboard.</p>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		<Button 
			on:click={resendConfirmation}
			disabled={resendLoading || resendCooldown > 0 || !email}
			variant="outline"
			class="w-full"
		>
			{#if resendLoading}
				Sending...
			{:else if resendCooldown > 0}
				Resend in {resendCooldown}s
			{:else}
				Resend Confirmation Email
			{/if}
		</Button>

		<Button 
			on:click={goToLogin}
			variant="ghost"
			class="w-full"
		>
			Back to Login
		</Button>
	</div>

	<div class="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
		<p class="text-sm text-yellow-400">
			<strong>Didn't receive the email?</strong> Check your spam folder or try resending the confirmation email.
		</p>
	</div>
</div>