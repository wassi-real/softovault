<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { auth } from '$lib/stores/auth.js';
	import { vaults as vaultsStore } from '$lib/stores/data.js';
	import { page } from '$app/stores';
	import { profiles } from '$lib/stores/data.js';
	import { checkUserProfile } from '$lib/utils/limits.js';
	import { goto } from '$app/navigation';
	
	interface Props {
		children?: import('svelte').Snippet;
		data: {
			user: any;
		};
	}

	let { children, data }: Props = $props();

	// Track if we've already preloaded to prevent redundant calls
	let hasPreloaded = false;

	$effect(() => {
		if (data.user) {
			// Update auth store if user is logged in from server-side check
			auth.update(state => ({ ...state, user: data.user, loading: false }));
		}
	});

	// Initialize auth
	onMount(() => {
		auth.init();
	});

	// Preload data when user is authenticated and on relevant routes
	$effect(async () => {
		if ($auth.user && !$auth.loading && !hasPreloaded) {
			const currentRoute = $page.route.id;
			if (currentRoute?.includes('dashboard') || currentRoute?.includes('vault') || data.user) {
				// Check if user has a profile for protected routes
				if (currentRoute?.includes('dashboard') || currentRoute?.includes('vault') || currentRoute?.includes('create')) {
					const { hasProfile } = await checkUserProfile($auth.user.id);
					if (!hasProfile && !currentRoute?.includes('settings')) {
						// Redirect to settings if no profile exists
						goto('/settings');
						return;
					}
				}
				
				// Preload vaults data for instant navigation
				vaultsStore.load();
				hasPreloaded = true;
			}
		}
		
		// Reset preload flag when user logs out
		if (!$auth.user) {
			hasPreloaded = false;
		}
	});
</script>

<div class="min-h-screen bg-black text-white flex flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
	
	{#if $toastStore.message}
		<Toast 
			message={$toastStore.message} 
			type={$toastStore.type}
			onClose={() => toastStore.clear()}
		/>
	{/if}
</div>
