<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import Select from '$lib/components/Select.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import TTLSelector from '$lib/components/TTLSelector.svelte';
	import TagsInput from '$lib/components/TagsInput.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { supabase } from '$lib/supabase';
	import EditVaultSkeleton from '$lib/components/EditVaultSkeleton.svelte';

	let { data } = $props();

	// These variables will be populated once the vault promise resolves
	let vault, title, type, content, ttl, burnAfterRead, passcode, tags;

	let formLoading = $state(false);

	const typeOptions = [
		{ value: 'secret', label: 'Secret' },
		{ value: 'snippet', label: 'Code Snippet' }
	];

	async function handleUpdateVault() {
		if (!title.trim() || !content.trim()) {
			toastStore.show('Please fill in all required fields', 'error');
			return;
		}

		formLoading = true;

		const vaultDataToUpdate = {
			title: title.trim(),
			description: content.trim(),
			password: passcode.trim(),
			data: { type, ttl, burnAfterRead, tags }
		};

		const { error } = await supabase.from('vaults').update(vaultDataToUpdate).eq('id', vault.id);

		if (error) {
			toastStore.show(error.message, 'error');
			formLoading = false;
		} else {
			toastStore.show('Vault updated successfully!', 'success');
			goto(`/vault/${vault.id}`);
		}
	}

	// This function runs when the promise resolves, populating the form fields
	function initializeForm(loadedVault) {
		vault = loadedVault;
		title = vault.title || '';
		type = vault.data?.type || 'secret';
		content = vault.description || '';
		ttl = vault.data?.ttl || '1h';
		burnAfterRead = vault.data?.burnAfterRead || false;
		passcode = vault.password || '';
		tags = vault.data?.tags || [];
		return true; // Needed for the #if block to render
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
	{#await data.vault}
		<EditVaultSkeleton />
	{:then loadedVault}
		{#if initializeForm(loadedVault)}
			<div class="mb-8">
				<h1 class="text-3xl font-bold mb-2">Edit Vault</h1>
				<p class="text-gray-400">Update the details of your secure vault</p>
			</div>

			<form class="space-y-6" onsubmit={preventDefault(handleUpdateVault)}>
				<div>
					<label for="title" class="block text-sm font-medium mb-2">Title *</label>
					<Input id="title" bind:value={title} placeholder="Enter vault title" required disabled={formLoading} />
				</div>

				<div>
					<label for="type" class="block text-sm font-medium mb-2">Type</label>
					<Select id="type" bind:value={type} options={typeOptions} disabled={formLoading} />
				</div>

				<div>
					<label for="content" class="block text-sm font-medium mb-2">Content *</label>
					<Textarea
						id="content"
						bind:value={content}
						placeholder={type === 'snippet' ? 'Paste your code here...' : 'Enter your secret content...'}
						rows={8}
						required
						disabled={formLoading}
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2" for="ttl">Time to Live</label>
					<TTLSelector id="ttl" bind:value={ttl} disabled={formLoading} />
				</div>

				<div class="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
					<div>
						<h3 class="font-medium">Burn After Read</h3>
						<p class="text-sm text-gray-400">Vault will be deleted after first access</p>
					</div>
					<Toggle bind:checked={burnAfterRead} disabled={formLoading} />
				</div>

				<div>
					<label for="passcode" class="block text-sm font-medium mb-2">Passcode (Optional)</label>
					<Input
						id="passcode"
						type="password"
						bind:value={passcode}
						placeholder="Enter optional passcode"
						disabled={formLoading}
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2" for="tags">Tags</label>
					<TagsInput id="tags" bind:tags disabled={formLoading} />
				</div>

				<div class="flex items-center gap-4">
					<Button type="submit" variant="primary" size="lg" class="flex-1" disabled={formLoading}>
						{formLoading ? 'Saving Changes...' : 'Save Changes'}
					</Button>
					<Button href={`/vault/${vault.id}`} variant="secondary" size="lg"> Cancel </Button>
				</div>
			</form>
		{/if}
	{:catch error}
		<div class="text-center py-16">
			<p class="text-red-400">An error occurred while loading the vault: {error.message}</p>
		</div>
	{/await}
</div> 