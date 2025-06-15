<script>
	import { preventDefault } from 'svelte/legacy';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
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

	async function handleRegister() {
		if (!email || !password || !confirmPassword) {
			toastStore.show('Please fill in all fields', 'error');
			return;
		}

		if (password !== confirmPassword) {
			toastStore.show('Passwords do not match', 'error');
			return;
		}
		
		loading = true;
		try {
			await auth.signUp(email, password);
			toastStore.show('Registration successful! Check your email to verify your account.', 'success');
			goto(`/confirm-email?email=${encodeURIComponent(email)}`);
		} catch (error) {
			toastStore.show(error.message || 'Registration failed', 'error');
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-2">Create Account</h1>
		<p class="text-gray-400">Sign up to start creating vaults</p>
	</div>

	<form class="space-y-6" onsubmit={preventDefault(handleRegister)}>
		<div>
			<label for="email" class="block text-sm font-medium mb-2">Email</label>
			<Input
				id="email"
				type="email"
				bind:value={email}
				placeholder="Enter your email"
				disabled={loading}
				required
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium mb-2">Password</label>
			<Input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Create password"
				disabled={loading}
				required
			/>
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium mb-2">Confirm Password</label>
			<Input
				id="confirmPassword"
				type="password"
				bind:value={confirmPassword}
				placeholder="Confirm password"
				disabled={loading}
				required
			/>
		</div>

		<Button type="submit" variant="primary" size="lg" class="w-full" disabled={loading}>
			{loading ? 'Creating Account...' : 'Create Account'}
		</Button>
	</form>

	<div class="text-center mt-6">
		<p class="text-gray-400">
			Already have an account? 
			<a href="/login" class="text-red-400 hover:text-red-300">Sign in</a>
		</p>
	</div>
</div>