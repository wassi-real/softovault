<script>
	import { preventDefault } from 'svelte/legacy';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { auth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { Mail, Key, ArrowLeft } from 'lucide-svelte';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let loginMethod = $state('password'); // 'password' or 'reset'
	let resetSent = $state(false);
	let resendCooldown = $state(0);
	let intervalId;

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

	function switchLoginMethod(method) {
		loginMethod = method;
		resetSent = false;
		password = '';
		if (intervalId) clearInterval(intervalId);
		resendCooldown = 0;
	}

	async function handlePasswordLogin() {
		if (!email || !password) {
			toastStore.show('Please fill in all fields', 'error');
			return;
		}
		
		loading = true;
		try {
			await auth.signIn(email, password);
			toastStore.show('Login successful!', 'success');
			goto('/dashboard');
		} catch (error) {
			toastStore.show(error.message || 'Login failed', 'error');
		} finally {
			loading = false;
		}
	}

	async function sendPasswordReset() {
		if (!email) {
			toastStore.show('Please enter your email address', 'error');
			return;
		}

		loading = true;
		try {
			await auth.resetPassword(email);
			resetSent = true;
			startCooldown(60); // 60 second cooldown
			toastStore.show('Password reset link sent to your email!', 'success');
		} catch (error) {
			toastStore.show(error.message || 'Failed to send password reset email', 'error');
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
		<p class="text-gray-400">Sign in to access your vaults</p>
	</div>

	<!-- Login Method Toggle -->
	<div class="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1 mb-6">
		<button
			type="button"
			class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 {loginMethod === 'password' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}"
			onclick={() => switchLoginMethod('password')}
		>
			<Key class="w-4 h-4" />
			Password
		</button>
		<button
			type="button"
			class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 {loginMethod === 'reset' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}"
			onclick={() => switchLoginMethod('reset')}
		>
			<Mail class="w-4 h-4" />
			Reset Password
		</button>
	</div>

	{#if loginMethod === 'password'}
		<!-- Password Login Form -->
		<form class="space-y-6" onsubmit={preventDefault(handlePasswordLogin)}>
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
					placeholder="Enter your password"
					disabled={loading}
					required
				/>
			</div>

			<Button type="submit" variant="primary" size="lg" class="w-full" disabled={loading}>
				{loading ? 'Signing In...' : 'Sign In'}
			</Button>
		</form>
	{:else}
		<!-- Password Reset Form -->
		<div class="space-y-6">
			{#if !resetSent}
				<div>
					<label for="email-reset" class="block text-sm font-medium mb-2">Email</label>
					<Input
						id="email-reset"
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						disabled={loading}
						required
					/>
				</div>

				<div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
					<p class="text-sm text-gray-300">
						Enter your email address and we'll send you a link to reset your password.
					</p>
				</div>

				<Button 
					onclick={sendPasswordReset}
					variant="primary" 
					size="lg" 
					class="w-full" 
					disabled={loading || !email}
				>
					{loading ? 'Sending Reset Link...' : 'Send Reset Link'}
				</Button>
			{:else}
				<div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
					<div class="flex items-center gap-2 mb-2">
						<Mail class="w-5 h-5 text-green-400" />
						<h3 class="font-medium text-green-400">Reset Link Sent!</h3>
					</div>
					<p class="text-sm text-gray-300">
						We've sent a password reset link to <span class="font-medium text-white">{email}</span>
					</p>
					<p class="text-sm text-gray-400 mt-2">
						Check your email and click the link to reset your password.
					</p>
				</div>

				<div class="flex items-center justify-between">
					<Button 
						onclick={() => switchLoginMethod('reset')}
						variant="ghost" 
						size="sm"
						class="flex items-center gap-2"
					>
						<ArrowLeft class="w-4 h-4" />
						Back
					</Button>

					<Button 
						onclick={sendPasswordReset}
						variant="ghost" 
						size="sm"
						disabled={loading || resendCooldown > 0}
					>
						{#if resendCooldown > 0}
							Resend in {resendCooldown}s
						{:else}
							Resend Link
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	{/if}

	<div class="text-center mt-6">
		<p class="text-gray-400">
			Don't have an account? 
			<a href="/register" class="text-red-400 hover:text-red-300">Sign up</a>
		</p>
	</div>
</div>
