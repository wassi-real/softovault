<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { auth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { Github } from 'lucide-svelte';

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

	async function handleGitHubSignup() {
		loading = true;
		try {
			await auth.signInWithGitHub();
			// The redirect will be handled by Supabase
		} catch (error) {
			toastStore.show(error.message || 'GitHub signup failed', 'error');
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-2">Join SoftoVault</h1>
		<p class="text-gray-400">Sign up with GitHub to start creating vaults</p>
	</div>

	<div class="space-y-6">
		<Button 
			onclick={handleGitHubSignup}
			variant="primary" 
			size="lg" 
			class="w-full flex items-center justify-center gap-3"
			disabled={loading}
		>
			<Github class="w-5 h-5" />
			{loading ? 'Signing up...' : 'Continue with GitHub'}
		</Button>
	</div>

	<div class="text-center mt-8">
		<p class="text-gray-400">
			Already have an account? 
			<a href="/login" class="text-red-400 hover:text-red-300">Sign in</a>
		</p>
	</div>

	<div class="text-center mt-4">
		<p class="text-sm text-gray-500">
			By signing up, you agree to our terms of service and privacy policy.
		</p>
	</div>
</div>