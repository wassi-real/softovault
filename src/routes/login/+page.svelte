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

	async function handleGitHubLogin() {
		loading = true;
		try {
			await auth.signInWithGitHub();
			// The redirect will be handled by Supabase
		} catch (error) {
			toastStore.show(error.message || 'GitHub login failed', 'error');
			loading = false;
		}
	}
</script>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold mb-2">Welcome to SoftoVault</h1>
		<p class="text-gray-400">Sign in with GitHub to access your vaults</p>
	</div>

	<div class="space-y-6">
		<Button 
			onclick={handleGitHubLogin}
			variant="primary" 
			size="lg" 
			class="w-full flex items-center justify-center gap-3"
			disabled={loading}
		>
			<Github class="w-5 h-5" />
			{loading ? 'Signing in...' : 'Continue with GitHub'}
		</Button>
	</div>

	<div class="text-center mt-8">
		<p class="text-sm text-gray-500">
			By signing in, you agree to our terms of service and privacy policy.
		</p>
	</div>
</div>
