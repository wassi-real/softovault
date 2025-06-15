<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
import { goto } from '$app/navigation';
import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';
import Textarea from '$lib/components/Textarea.svelte';
import { toastStore } from '$lib/stores/toast.js';
import { supabase } from '$lib/supabase';
import { vaults as vaultsStore } from '$lib/stores/data.js';
import { auth } from '$lib/stores/auth.js';

	// Redirect if not authenticated or email not confirmed
	$effect(() => {
		if (!$auth.loading && !$auth.user) {
			goto('/login');
		} else if (!$auth.loading && $auth.user && !$auth.user.email_confirmed_at) {
			goto(`/confirm-email?email=${encodeURIComponent($auth.user.email)}`);
		}
	});

	let title = $state('');
	let description = $state('');
	let loading = $state(false);

	async function handleCreateVault() {
		if (!title.trim()) {
			toastStore.show('Please enter a vault title', 'error');
			return;
		}

		loading = true;

		const { data: { user } } = await supabase.auth.getUser();

		if (!user) {
			toastStore.show('You must be logged in to create a vault.', 'error');
			loading = false;
			goto('/login');
			return;
		}

		const vaultData = {
			user_id: user.id,
			title: title.trim(),
			description: description.trim() || null
		};

		const { data: newVault, error } = await supabase.from('vaults').insert(vaultData).select().single();

	if (error) {
		toastStore.show(error.message, 'error');
		loading = false;
	} else {
		// Add the new vault to the store for instant UI updates
		vaultsStore.add(newVault);
		toastStore.show('Vault created successfully!', 'success');
		goto(`/vault/${newVault.id}`);
	}
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">New Vault</h1>
		<p class="text-gray-400">Create a secure vault to store your API keys and secrets</p>
	</div>

	<form class="space-y-6" onsubmit={preventDefault(handleCreateVault)}>
		<div>
			<label for="title" class="block text-sm font-medium mb-2">Vault Title *</label>
			<Input id="title" bind:value={title} placeholder="e.g., Production API Keys, Development Secrets" required disabled={loading} />
		</div>

		<div>
			<label for="description" class="block text-sm font-medium mb-2">Description (Optional)</label>
			<Textarea
				id="description"
				bind:value={description}
				placeholder="Brief description of what this vault contains..."
				rows={3}
				disabled={loading}
			/>
		</div>

		<div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
			<h3 class="font-medium text-blue-300 mb-2">What happens next?</h3>
			<ul class="text-sm text-blue-200 space-y-1">
				<li>• Your vault will be created with a unique access key</li>
				<li>• You can add key-value secrets (API keys, tokens, etc.)</li>
				<li>• Use the access key to retrieve secrets programmatically</li>
			</ul>
			<h4 class="font-medium text-blue-300 mb-2">Please ctrl+r if vault creation is not working</h4>
		</div>

		<Button type="submit" variant="primary" size="lg" class="w-full" disabled={loading}>
			{loading ? 'Creating Vault...' : 'Create Vault'}
		</Button>
	</form>
</div>
