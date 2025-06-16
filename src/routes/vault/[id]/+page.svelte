<script>
	import { supabase } from '$lib/supabase.js';
	import { toastStore } from '$lib/stores/toast.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.js';
	import { decryptVaultData, decryptSecrets, encryptSecretData } from '$lib/utils/encryption.js';
import { checkSecretLimits } from '$lib/utils/limits.js';

	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { Plus, Edit, Trash2, Copy, Key, Eye, EyeOff, Save, X, Upload, Download, Settings } from 'lucide-svelte';

	// State variables
	let vault = null;
	let secrets = [];
	let isLoading = true;
	let loadingError = null;
	let showAddForm = false;
	let showImportForm = false;
	let showEditVault = false;
	let editingSecret = null;
	let visibleSecrets = new Set();

	// Get vault ID from params
	let vaultId = $page.params.id;

	// Form data
	let newKey = '';
	let newValue = '';
	let newDescription = '';
	let importContent = '';
	let editVaultTitle = '';
	let editVaultDescription = '';

	// Simple auth check and redirect
	$: if (!$auth.loading && !$auth.user) {
		goto('/login');
	}

	// Main data loading function
	async function loadVaultData() {
		if (!$auth.user || !vaultId) {
			isLoading = false;
			return;
		}

		console.log('Loading vault data for:', vaultId);
		
		try {
			isLoading = true;
			loadingError = null;

			// Load vault and secrets in parallel
			const [vaultResponse, secretsResponse] = await Promise.all([
				supabase
					.from('vaults')
					.select('*')
					.eq('id', vaultId)
					.eq('user_id', $auth.user.id)
					.single(),
				supabase
					.from('secrets')
					.select('*')
					.eq('vault_id', vaultId)
					.order('created_at', { ascending: false })
			]);

			// Handle vault response
			if (vaultResponse.error) {
				console.error('Vault error:', vaultResponse.error);
				if (vaultResponse.error.code === 'PGRST116') {
					loadingError = 'Vault not found or access denied';
				} else {
					loadingError = vaultResponse.error.message;
				}
				return;
			}

			const encryptedVault = vaultResponse.data;
			console.log('Encrypted vault loaded:', encryptedVault);

			// Decrypt vault data using access_key
			try {
				vault = await decryptVaultData(encryptedVault, encryptedVault.access_key);
				console.log('Vault decrypted:', vault);
			} catch (decryptError) {
				console.error('Failed to decrypt vault:', decryptError);
				loadingError = 'Failed to decrypt vault data. The vault may be corrupted.';
				return;
			}

			// Handle secrets response
			if (secretsResponse.error) {
				console.error('Secrets error:', secretsResponse.error);
				toastStore.show('Failed to load secrets: ' + secretsResponse.error.message, 'error');
				secrets = [];
			} else {
				const encryptedSecrets = secretsResponse.data || [];
				console.log('Encrypted secrets loaded:', encryptedSecrets.length);
				
				// Decrypt secrets using vault access_key
				try {
					secrets = await decryptSecrets(encryptedSecrets, encryptedVault.access_key);
					console.log('Secrets decrypted:', secrets.length);
				} catch (decryptError) {
					console.error('Failed to decrypt secrets:', decryptError);
					toastStore.show('Some secrets could not be decrypted', 'warning');
					secrets = [];
				}
			}

		} catch (error) {
			console.error('Unexpected error:', error);
			loadingError = 'Failed to load vault data';
		} finally {
			isLoading = false;
		}
	}

	// Load data when auth is ready
	onMount(() => {
		console.log('Component mounted');
		
		// Wait for auth to be ready, then load data
		const unsubscribe = auth.subscribe(authState => {
			if (!authState.loading) {
				console.log('Auth ready, loading data');
				loadVaultData();
			}
		});

		return unsubscribe;
	});

	// Utility functions
	function resetForm() {
		newKey = '';
		newValue = '';
		newDescription = '';
		showAddForm = false;
	}

	function startEditVault() {
		editVaultTitle = vault.title;
		editVaultDescription = vault.description || '';
		showEditVault = true;
	}

	function cancelEditVault() {
		showEditVault = false;
		editVaultTitle = '';
		editVaultDescription = '';
	}

	function toggleSecretVisibility(secretId) {
		if (visibleSecrets.has(secretId)) {
			visibleSecrets.delete(secretId);
		} else {
			visibleSecrets.add(secretId);
		}
		visibleSecrets = visibleSecrets;
	}

	async function copyToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text);
			toastStore.show('Copied to clipboard', 'success');
		} catch (error) {
			toastStore.show('Failed to copy to clipboard', 'error');
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString();
	}

	// CRUD operations
	async function addSecret() {
		if (!newKey.trim() || !newValue.trim()) {
			toastStore.show('Key and value are required', 'error');
			return;
		}

		// Check secret limits and profile requirements
		const limitCheck = await checkSecretLimits($auth.user.id, vault.id);
		if (!limitCheck.canCreate) {
			toastStore.show(limitCheck.reason, 'error');
			if (limitCheck.reason.includes('profile')) {
				goto('/settings');
			}
			return;
		}

		try {
			// Encrypt secret data before storing
			const secretData = {
				key: newKey.trim(),
				value: newValue.trim(),
				description: newDescription.trim() || null
			};

			const encryptedSecretData = await encryptSecretData(secretData, vault.access_key);

			const { data, error } = await supabase
				.from('secrets')
				.insert({
					vault_id: vault.id,
					key: encryptedSecretData.key,
					value: encryptedSecretData.value,
					description: encryptedSecretData.description
				})
				.select()
				.single();

			if (error) {
				if (error.code === '23505') {
					toastStore.show('A secret with this key already exists', 'error');
				} else {
					toastStore.show(error.message, 'error');
				}
				return;
			}

			// Add the decrypted version to the UI
			const decryptedSecret = {
				...data,
				key: secretData.key,
				value: secretData.value,
				description: secretData.description
			};
			secrets = [decryptedSecret, ...secrets];
			resetForm();
			toastStore.show('Secret added successfully', 'success');
		} catch (error) {
			console.error('Error adding secret:', error);
			toastStore.show('Failed to add secret', 'error');
		}
	}

	async function updateSecret(secret) {
		if (!secret.value.trim()) {
			toastStore.show('Value is required', 'error');
			return;
		}

		try {
			// Encrypt the updated secret data
			const secretData = {
				key: secret.key,
				value: secret.value.trim(),
				description: secret.description?.trim() || null
			};

			const encryptedSecretData = await encryptSecretData(secretData, vault.access_key);

			const { data, error } = await supabase
				.from('secrets')
				.update({
					key: encryptedSecretData.key,
					value: encryptedSecretData.value,
					description: encryptedSecretData.description
				})
				.eq('id', secret.id)
				.select()
				.single();

			if (error) {
				toastStore.show(error.message, 'error');
				return;
			}

			// Update the UI with decrypted data
			const updatedSecret = {
				...data,
				key: secretData.key,
				value: secretData.value,
				description: secretData.description
			};
			secrets = secrets.map(s => s.id === secret.id ? updatedSecret : s);
			editingSecret = null;
			toastStore.show('Secret updated successfully', 'success');
		} catch (error) {
			console.error('Error updating secret:', error);
			toastStore.show('Failed to update secret', 'error');
		}
	}

	async function deleteSecret(secretId) {
		if (!confirm('Are you sure you want to delete this secret?')) {
			return;
		}

		try {
			const { error } = await supabase
				.from('secrets')
				.delete()
				.eq('id', secretId);

			if (error) {
				toastStore.show(error.message, 'error');
				return;
			}

			secrets = secrets.filter(s => s.id !== secretId);
			toastStore.show('Secret deleted successfully', 'success');
		} catch (error) {
			console.error('Error deleting secret:', error);
			toastStore.show('Failed to delete secret', 'error');
		}
	}

	async function updateVault() {
		if (!editVaultTitle.trim()) {
			toastStore.show('Title is required', 'error');
			return;
		}

		try {
			// Encrypt vault metadata
			const vaultData = {
				title: editVaultTitle.trim(),
				description: editVaultDescription.trim() || null
			};

			const encryptedVaultData = await encryptVaultData(vaultData, vault.access_key);

			const { data, error } = await supabase
				.from('vaults')
				.update({
					title: encryptedVaultData.title,
					description: encryptedVaultData.description
				})
				.eq('id', vault.id)
				.eq('user_id', $auth.user.id)
				.select()
				.single();

			if (error) {
				toastStore.show(`Update failed: ${error.message}`, 'error');
				return;
			}

			// Update the UI with decrypted data
			vault = {
				...data,
				title: vaultData.title,
				description: vaultData.description
			};
			showEditVault = false;
			toastStore.show('Vault updated successfully', 'success');
		} catch (error) {
			console.error('Error updating vault:', error);
			toastStore.show('Failed to update vault', 'error');
		}
	}

	// Import/Export functions
	function parseEnvFile(content) {
		const lines = content.split('\n');
		const envData = [];

		for (const line of lines) {
			const trimmedLine = line.trim();
			
			if (!trimmedLine || trimmedLine.startsWith('#')) {
				continue;
			}

			const equalIndex = trimmedLine.indexOf('=');
			if (equalIndex === -1) {
				continue;
			}

			const key = trimmedLine.substring(0, equalIndex).trim();
			let value = trimmedLine.substring(equalIndex + 1).trim();

			if ((value.startsWith('"') && value.endsWith('"')) || 
				(value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}

			if (key) {
				envData.push({
					key,
					value,
					description: 'Imported from .env file'
				});
			}
		}

		return envData;
	}

	async function importEnvFile() {
		if (!importContent.trim()) {
			toastStore.show('Please paste your .env content', 'error');
			return;
		}

		try {
			const envData = parseEnvFile(importContent);
			
			if (envData.length === 0) {
				toastStore.show('No valid environment variables found', 'error');
				return;
			}

			let insertedCount = 0;
			let updatedCount = 0;

			for (const { key, value, description } of envData) {
				const { data: existingSecret } = await supabase
					.from('secrets')
					.select('id')
					.eq('vault_id', vault.id)
					.eq('key', key)
					.single();

				if (existingSecret) {
					const { data, error } = await supabase
						.from('secrets')
						.update({ value, description })
						.eq('id', existingSecret.id)
						.select()
						.single();

					if (!error) {
						secrets = secrets.map(s => s.id === existingSecret.id ? data : s);
						updatedCount++;
					}
				} else {
					const { data, error } = await supabase
						.from('secrets')
						.insert({
							vault_id: vault.id,
							key,
							value,
							description
						})
						.select()
						.single();

					if (!error) {
						secrets = [data, ...secrets];
						insertedCount++;
					}
				}
			}

			showImportForm = false;
			importContent = '';
			toastStore.show(`Import completed: ${insertedCount} added, ${updatedCount} updated`, 'success');
		} catch (error) {
			console.error('Error importing .env file:', error);
			toastStore.show('Failed to import .env file', 'error');
		}
	}

	function downloadAsEnv() {
		if (secrets.length === 0) {
			toastStore.show('No secrets to export', 'error');
			return;
		}

		let content = `# Environment variables exported from ${vault.title}\n`;
		content += `# Generated on ${new Date().toISOString()}\n\n`;

		for (const secret of secrets) {
			if (secret.description) {
				content += `# ${secret.description}\n`;
			}
			
			let value = secret.value;
			if (value.includes(' ') || value.includes('"') || value.includes("'")) {
				value = `"${value.replace(/"/g, '\\"')}"`;
			}
			
			content += `${secret.key}=${value}\n\n`;
		}

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${vault.title.replace(/[^a-zA-Z0-9]/g, '_')}.env`;
		a.click();
		URL.revokeObjectURL(url);
		toastStore.show('Environment file downloaded', 'success');
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			importContent = e.target.result;
			showImportForm = true;
		};
		reader.readAsText(file);
	}
</script>

<!-- Loading State -->
{#if isLoading}
	<div class="max-w-4xl mx-auto px-4 py-8">
		<div class="animate-pulse">
			Reload the page ctrl+r to view
			<div class="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
			<div class="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="h-20 bg-gray-700 rounded"></div>
				{/each}
			</div>
		</div>
	</div>

<!-- Error State -->
{:else if loadingError}
	<div class="max-w-4xl mx-auto px-4 py-8 text-center">
		<h1 class="text-2xl font-bold mb-4 text-red-400">Error Loading Vault</h1>
		<p class="text-gray-400 mb-6">{loadingError}</p>
		<div class="flex gap-4 justify-center">
			<Button variant="primary" onclick={loadVaultData}>Try Again</Button>
			<Button variant="outline" href="/dashboard">Back to Dashboard</Button>
		</div>
	</div>

<!-- Main Content -->
{:else if vault}
	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Vault Header -->
		<div class="mb-8">
			<div class="flex items-start justify-between mb-4 gap-4">
				<div class="flex-1 min-w-0">
					{#if showEditVault}
						<div class="space-y-3">
							<Input bind:value={editVaultTitle} placeholder="Vault title" class="text-2xl font-bold" />
							<Input bind:value={editVaultDescription} placeholder="Vault description (optional)" />
							<div class="flex gap-2">
								<Button variant="primary" size="sm" onclick={updateVault}>
									<Save class="w-4 h-4 mr-2" />
									Save
								</Button>
								<Button variant="outline" size="sm" onclick={cancelEditVault}>Cancel</Button>
							</div>
						</div>
					{:else}
						<div class="flex items-center gap-3">
							<div class="flex-1 min-w-0">
								<h1 class="text-3xl font-bold truncate">{vault.title}</h1>
								{#if vault.description}
									<p class="text-gray-400 mt-1 truncate">{vault.description}</p>
								{/if}
							</div>
							<Button variant="outline" size="md" onclick={startEditVault} title="Edit vault" class="flex-shrink-0">
								<Settings class="w-4 h-4" />
							</Button>
						</div>
					{/if}
				</div>
				<div class="flex gap-2 flex-shrink-0">
					<input type="file" accept=".env" onchange={handleFileUpload} class="hidden" id="env-upload" />
					<Button variant="outline" onclick={() => document.getElementById('env-upload').click()} title="Import .env file">
						<Upload class="w-4 h-4 mr-2" />
						Import
					</Button>
					<Button variant="outline" onclick={downloadAsEnv} title="Download as .env file">
						<Download class="w-4 h-4 mr-2" />
						Export
					</Button>
					<Button variant="primary" onclick={() => showAddForm = true}>
						<Plus class="w-4 h-4 mr-2" />
						Add Secret
					</Button>
				</div>
			</div>

			<!-- Access Key Display -->
			<div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
				<div class="flex items-center justify-between gap-4">
					<div class="flex-1 min-w-0">
						<label class="text-sm text-gray-400 block mb-1">Vault Access Key</label>
						<code class="text-sm font-mono text-gray-300 bg-gray-900 px-2 py-1 rounded block overflow-hidden whitespace-nowrap text-ellipsis">{vault.access_key}</code>
					</div>
					<Button variant="ghost" size="sm" onclick={() => copyToClipboard(vault.access_key)}>
						<Copy class="w-4 h-4" />
					</Button>
				</div>
				<p class="text-xs text-gray-500 mt-2">Use this key to access your vault programmatically</p>
			</div>
		</div>

		<!-- Import Env Form -->
		{#if showImportForm}
			<div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold">Import Environment Variables</h3>
					<Button variant="ghost" size="sm" onclick={() => { showImportForm = false; importContent = ''; }}>
						<X class="w-4 h-4" />
					</Button>
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium mb-2">Paste your .env file content:</label>
					<Textarea bind:value={importContent} placeholder="API_KEY=your_api_key_here&#10;DATABASE_URL=postgresql://...&#10;SECRET_TOKEN=abc123" rows={8} />
					<p class="text-xs text-gray-500 mt-2">Existing secrets with the same key will be updated with new values.</p>
				</div>
				<div class="flex gap-2">
					<Button variant="primary" onclick={importEnvFile}>
						<Upload class="w-4 h-4 mr-2" />
						Import Variables
					</Button>
					<Button variant="ghost" onclick={() => { showImportForm = false; importContent = ''; }}>Cancel</Button>
				</div>
			</div>
		{/if}

		<!-- Add Secret Form -->
		{#if showAddForm}
			<div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold">Add New Secret</h3>
					<Button variant="ghost" size="sm" onclick={resetForm}>
						<X class="w-4 h-4" />
					</Button>
				</div>
				<form onsubmit={(e) => { e.preventDefault(); addSecret(); }}>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label for="newKey" class="block text-sm font-medium mb-2">Key *</label>
							<Input id="newKey" bind:value={newKey} placeholder="e.g., API_KEY, DATABASE_URL" required />
						</div>
						<div>
							<label for="newValue" class="block text-sm font-medium mb-2">Value *</label>
							<Input id="newValue" bind:value={newValue} placeholder="Secret value" type="password" required />
						</div>
					</div>
					<div class="mb-4">
						<label for="newDescription" class="block text-sm font-medium mb-2">Description (Optional)</label>
						<Input id="newDescription" bind:value={newDescription} placeholder="Brief description of this secret" />
					</div>
					<div class="flex gap-2">
						<Button variant="primary" type="submit">
							<Save class="w-4 h-4 mr-2" />
							Add Secret
						</Button>
						<Button variant="ghost" type="button" onclick={resetForm}>Cancel</Button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Secrets List -->
		{#if secrets.length === 0}
			<div class="text-center py-16">
				<div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
					<Key class="w-8 h-8 text-gray-400" />
				</div>
				<h3 class="text-xl font-semibold mb-2">No secrets yet</h3>
				<p class="text-gray-400 mb-6">Add your first secret to get started</p>
				<Button variant="primary" onclick={() => showAddForm = true}>
					<Plus class="w-4 h-4 mr-2" />
					Add Secret
				</Button>
			</div>
		{:else}
			<div class="space-y-4">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold">Secrets ({secrets.length})</h2>
					{#await checkSecretLimits($auth.user.id, vault.id) then limitCheck}
						<div class="text-sm text-gray-400">
							{limitCheck.currentCount}/{limitCheck.maxAllowed} secrets used
							{#if !limitCheck.canCreate}
								<span class="text-red-400 ml-2">(Limit reached)</span>
							{/if}
						</div>
					{/await}
				</div>
				{#each secrets as secret (secret.id)}
					<div class="bg-gray-800 rounded-lg p-6 border border-gray-700 overflow-hidden">
						{#if editingSecret?.id === secret.id}
							<!-- Edit Mode -->
							<div class="space-y-4">
								<div>
									<label class="block text-sm font-medium mb-2" for="secretKey">Key</label>
									<Input id="secretKey" value={secret.key} disabled />
								</div>
								<div>
									<label class="block text-sm font-medium mb-2" for="secretValue">Value</label>
									<Textarea id="secretValue" bind:value={editingSecret.value} rows={3} />
								</div>
								<div>
									<label class="block text-sm font-medium mb-2" for="secretDescription">Description</label>
									<Input id="secretDescription" bind:value={editingSecret.description} />
								</div>
								<div class="flex gap-2">
									<Button variant="primary" onclick={() => updateSecret(editingSecret)}>
										<Save class="w-4 h-4 mr-2" />
										Save
									</Button>
									<Button variant="ghost" onclick={() => editingSecret = null}>Cancel</Button>
								</div>
							</div>
						{:else}
							<!-- View Mode -->
							<div class="flex items-start justify-between min-w-0">
								<div class="flex-1 min-w-0 overflow-hidden">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="text-lg font-semibold font-mono flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">{secret.key}</h3>
									</div>
									<div class="flex items-center gap-2 mb-3">
										<code class="bg-gray-900 px-3 py-2 rounded text-sm font-mono flex-1 overflow-hidden whitespace-nowrap text-ellipsis min-w-0">
											{visibleSecrets.has(secret.id) ? secret.value : '•'.repeat(Math.min(secret.value.length, 20))}
										</code>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => toggleSecretVisibility(secret.id)}
											title={visibleSecrets.has(secret.id) ? 'Hide value' : 'Show value'}
										>
											{#if visibleSecrets.has(secret.id)}
												<EyeOff class="w-4 h-4" />
											{:else}
												<Eye class="w-4 h-4" />
											{/if}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => copyToClipboard(secret.value)}
											title="Copy value"
										>
											<Copy class="w-4 h-4" />
										</Button>
									</div>
									{#if secret.description}
										<p class="text-sm text-gray-400 mb-2 overflow-hidden whitespace-nowrap text-ellipsis">{secret.description}</p>
									{/if}
									<div class="text-xs text-gray-500">
										Created {formatDate(secret.created_at)}
										{#if secret.updated_at !== secret.created_at}
											• Updated {formatDate(secret.updated_at)}
										{/if}
									</div>
								</div>
								<div class="flex items-center gap-2 ml-4">
									<Button
										variant="ghost"
										size="sm"
										onclick={() => editingSecret = { ...secret }}
										title="Edit secret"
									>
										<Edit class="w-4 h-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => deleteSecret(secret.id)}
										title="Delete secret"
										class="text-red-400 hover:text-red-300"
									>
										<Trash2 class="w-4 h-4" />
									</Button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

<!-- Fallback -->
{:else}
	<div class="max-w-4xl mx-auto px-4 py-8 text-center">
		<h1 class="text-2xl font-bold mb-4">Vault not found</h1>
		<p class="text-gray-400 mb-6">The vault you're looking for doesn't exist or you don't have access to it.</p>
		<Button variant="primary" href="/dashboard">Back to Dashboard</Button>
	</div>
{/if}