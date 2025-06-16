<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { auth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);

	onMount(() => {
		// Initialize auth
		auth.init();

		// Redirect if already logged in
		const unsubscribe = auth.subscribe(({ user, loading: authLoading }) => {
			if (user && !authLoading) {
				goto('/dashboard');
			}
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	async function handleSignUp() {
		if (!email || !password || !confirmPassword) {
			toastStore.show('Please fill in all fields', 'error');
			return;
		}

		if (password !== confirmPassword) {
			toastStore.show('Passwords do not match', 'error');
			return;
		}

		if (password.length < 6) {
			toastStore.show('Password must be at least 6 characters', 'error');
			return;
		}

		loading = true;
		try {
			await auth.signUp(email, password);
			toastStore.show('Account created successfully!', 'success');
			goto('/dashboard');
		} catch (error) {
			toastStore.show(error.message || 'Sign up failed', 'error');
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-2">Join SoftoVault</h1>
		<p class="text-gray-400">Create your account</p>
	</div>

	<form on:submit|preventDefault={handleSignUp} class="space-y-6">
		<div>
			<label for="email" class="block text-sm font-medium text-gray-300 mb-2">
				Email
			</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
				placeholder="Enter your email"
				required
				disabled={loading}
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
				Password
			</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
				placeholder="Enter your password"
				required
				disabled={loading}
			/>
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
				Confirm Password
			</label>
			<input
				id="confirmPassword"
				type="password"
				bind:value={confirmPassword}
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
				placeholder="Confirm your password"
				required
				disabled={loading}
			/>
		</div>

		<Button 
			type="submit"
			variant="primary" 
			size="lg" 
			class="w-full"
			disabled={loading}
		>
			{loading ? 'Creating account...' : 'Create Account'}
		</Button>
	</form>

	<div class="text-center mt-6">
		<p class="text-gray-400">
			Already have an account?
			<a href="/login" class="text-red-500 hover:text-red-400 ml-1">Sign in</a>
		</p>
	</div>

	<div class="text-center mt-8">
		<p class="text-sm text-gray-500">
			By creating an account, you agree to our terms of service and privacy policy.
		</p>
	</div>
</div>