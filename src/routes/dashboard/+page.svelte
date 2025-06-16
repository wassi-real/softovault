<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { auth } from '$lib/stores/auth.js';
	import { vaults as vaultsStore } from '$lib/stores/data.js';
	import { Plus, ExternalLink, Trash2, Shield, Edit, Key, Copy } from 'lucide-svelte';
	import { supabase } from '$lib/supabase.js';
	import DashboardItemSkeleton from '$lib/components/DashboardItemSkeleton.svelte';
	import { goto } from '$app/navigation';
import { profiles } from '$lib/stores/data.js';
import { getUserLimitsSummary } from '$lib/utils/limits.js';

	let vaults = $state([]);
	let loading = $state(false);
	let userProfile = $state(null);
	let userLimits = $state(null);

	// Subscribe to vaults store for real-time updates
	vaultsStore.subscribe(value => {
		vaults = value;
	});

	// Subscribe to profiles store
	profiles.subscribe(value => {
		userProfile = value;
	});

	// Reactive statement to handle auth state changes
	$effect(async () => {
		if (!$auth.loading && $auth.user) {
			// Load profile and user limits
			await profiles.load($auth.user.id);
			userLimits = await getUserLimitsSummary($auth.user.id);
			
			// Check if user has a profile, if not redirect to settings
			if (!userLimits.hasProfile) {
				goto('/settings');
				return;
			}
			
			// Load vaults from cache or fetch if needed
			await vaultsStore.load();
		} else if (!$auth.loading && !$auth.user) {
			goto('/login');
		}
	});

	async function loadVaults() {
		// Force refresh from server
		await vaultsStore.load(true);
	}

	async function deleteVault(id) {
		if (confirm('Are you sure you want to delete this vault?')) {
			// Optimistically remove from UI
			vaultsStore.remove(id);
			
			const { error } = await supabase.from('vaults').delete().eq('id', id);

			if (error) {
				toastStore.show(error.message, 'error');
				// Reload to restore the vault if deletion failed
				await vaultsStore.load(true);
			} else {
				toastStore.show('Vault deleted successfully', 'success');
			}
		}
	}

	function copyVaultUrl(id) {
		const url = `${window.location.origin}/vault/${id}`;
		navigator.clipboard.writeText(url).then(() => {
			toastStore.show('Vault URL copied to clipboard!', 'success');
		});
	}

	function copyAccessKey(accessKey) {
		navigator.clipboard.writeText(accessKey).then(() => {
			toastStore.show('Access key copied to clipboard!', 'success');
		});
	}

	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 instant-load">
	<div class="flex justify-between items-center mb-12">
		<div class="animate-slideIn">
			<h1 class="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Your Vaults</h1>
			<p class="text-lg text-gray-400">Manage your secure password vaults with ease</p>
			
			{#if userLimits}
				<div class="mt-4 flex items-center gap-4 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full {userLimits.isPremium ? 'bg-yellow-500' : 'bg-gray-500'}"></div>
						<span class="text-gray-300">{userLimits.isPremium ? 'Premium' : 'Free'} Account</span>
					</div>
					<div class="text-gray-400">
						Vaults: {userLimits.vaultLimits.currentCount}/{userLimits.vaultLimits.maxAllowed}
					</div>
					{#if !userLimits.isPremium}
						<a href="/settings" class="text-red-400 hover:text-red-300 transition-colors">
							Upgrade to Premium
						</a>
					{/if}
				</div>
			{/if}
		</div>

<style>
	@reference "../../app.css";
	
	.vault-card {
		background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.8) 100%);
		border: 1px solid rgba(75, 85, 99, 0.4);
		border-radius: 20px;
		padding: 32px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
		transform: translateY(20px);
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(10px);
	}
	
	.vault-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.03) 100%);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		border-radius: 20px;
	}
	
	.vault-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	
	.vault-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3);
		border-color: rgba(239, 68, 68, 0.5);
	}
	
	.vault-card:hover::before {
		opacity: 1;
	}
	
	.vault-card:hover::after {
		opacity: 1;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	.animate-fadeIn {
		animation: fadeIn 0.6s ease-out;
	}
	
	.animate-slideIn {
		animation: slideIn 0.6s ease-out;
	}
</style>
		<div class="animate-slideIn" style="animation-delay: 0.2s;">
			<Button href="/create" size="lg" class="flex items-center space-x-3">
				<Plus class="w-5 h-5" />
				<span>New Vault</span>
			</Button>
		</div>
	</div>

	{#if loading}
		<div class="grid gap-6">
			{#each Array(3) as _}
				<DashboardItemSkeleton />
			{/each}
		</div>
	{:else if vaults.length === 0}
		<div class="text-center py-20 animate-fadeIn">
			<div class="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
				<Shield class="w-10 h-10 text-gray-400" />
			</div>
			<h2 class="text-2xl font-semibold mb-3 text-white">No vaults yet</h2>
			<p class="text-lg text-gray-400 mb-8">Create your first vault to get started securing your passwords</p>
			<Button variant="primary" size="lg" href="/create">
				<Plus class="w-5 h-5 mr-3" />
				Create Your First Vault
			</Button>
		</div>
	{:else}
		<div class="grid gap-8">
			{#each vaults as vault, index (vault.id)}
				<div class="vault-card group" style="animation-delay: {index * 0.1}s;">
					<!-- Header Section -->
					<div class="flex items-start justify-between mb-6">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
								<Shield class="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 class="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300 mb-1">{vault.title}</h3>
								<div class="flex items-center gap-3">
									<span class="px-3 py-1 bg-red-500/15 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2 border border-red-500/20">
										<Key class="w-4 h-4" />
										{vault.secrets?.[0]?.count || 0} secrets
									</span>
									<span class="text-sm text-gray-500">•</span>
									<span class="text-sm text-gray-400">Created {formatDate(vault.created_at)}</span>
								</div>
							</div>
						</div>
						
						<!-- Action Buttons -->
						<div class="flex items-center gap-2">
							<Button
								variant="primary"
								size="md"
								onclick={() => goto(`/vault/${vault.id}`)}
								class="flex items-center gap-2"
							>
								<Shield class="w-4 h-4" />
								Manage
							</Button>
							<Button
								variant="ghost"
								size="md"
								onclick={() => copyVaultUrl(vault.id)}
								title="Copy vault URL"
							>
								<ExternalLink class="w-4 h-4" />
							</Button>
							<Button
								variant="ghost"
								size="md"
								onclick={() => deleteVault(vault.id)}
								title="Delete vault"
								class="text-red-400 hover:text-red-300 hover:bg-red-500/10"
							>
								<Trash2 class="w-4 h-4" />
							</Button>
						</div>
					</div>

					<!-- Description Section -->
					{#if vault.description}
						<div class="mb-6">
							<p class="text-gray-300 text-base leading-relaxed">{vault.description}</p>
						</div>
					{/if}

					<!-- Access Key Section -->
					<div class="bg-gray-900/60 rounded-xl p-5 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<label class="text-sm font-medium text-gray-400 block mb-3">Vault Access Key</label>
								<div class="flex items-center gap-3">
									<code class="text-base font-mono text-gray-200 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">{vault.access_key.substring(0, 20)}...</code>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => copyAccessKey(vault.access_key)}
										title="Copy access key"
										class="text-gray-400 hover:text-white"
									>
										<Copy class="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer Info -->
					{#if vault.last_accessed}
						<div class="mt-4 pt-4 border-t border-gray-700/30">
							<p class="text-sm text-gray-500">Last accessed {formatDate(vault.last_accessed)}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
