<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import { profiles } from '$lib/stores/data.js';
	import { toastStore } from '$lib/stores/toast.js';
	import { supabase } from '$lib/supabase';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { User, Save, Trash2 } from 'lucide-svelte';

	let profile = $state(null);
	let loading = $state(false);
	let saving = $state(false);
	let username = $state('');
	let bio = $state('');
	let email = $state('');
	let premium = $state(false);

	// Redirect if not authenticated
	$effect(() => {
		if (!$auth.loading && !$auth.user) {
			goto('/login');
		}
	});

	// Load user profile
	onMount(async () => {
		if ($auth.user) {
			email = $auth.user.email;
			await loadProfile();
		}
	});

	async function loadProfile() {
		loading = true;
		try {
			const data = await profiles.load($auth.user.id);
			if (data) {
				profile = data;
				username = data.username || '';
				bio = data.bio || '';
				premium = data.premium || false;
			}
		} catch (err) {
			console.error('Unexpected error loading profile:', err);
			toastStore.show('An unexpected error occurred', 'error');
		} finally {
			loading = false;
		}
	}

	async function saveProfile() {
		if (!username.trim()) {
			toastStore.show('Username is required', 'error');
			return;
		}

		saving = true;
		try {
			const profileData = {
				user_id: $auth.user.id,
				username: username.trim(),
				bio: bio.trim() || null,
				premium: premium
			};

			let result;
			if (profile) {
				// Update existing profile
				result = await supabase
					.from('profiles')
					.update(profileData)
					.eq('id', profile.id)
					.select()
					.single();
			} else {
				// Create new profile
				result = await supabase
					.from('profiles')
					.insert(profileData)
					.select()
					.single();
			}

			if (result.error) {
				if (result.error.code === '23505') {
					toastStore.show('Username already exists', 'error');
				} else {
					console.error('Error saving profile:', result.error);
					toastStore.show(result.error.message, 'error');
				}
			} else {
				profile = result.data;
				profiles.update(result.data);
				toastStore.show('Profile saved successfully', 'success');
			}
		} catch (err) {
			console.error('Unexpected error saving profile:', err);
			toastStore.show('An unexpected error occurred', 'error');
		} finally {
			saving = false;
		}
	}

	async function deleteProfile() {
		if (!profile) return;
		
		if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
			return;
		}

		try {
			const { error } = await supabase
				.from('profiles')
				.delete()
				.eq('id', profile.id);

			if (error) {
				console.error('Error deleting profile:', error);
				toastStore.show(error.message, 'error');
			} else {
				profile = null;
				username = '';
				bio = '';
				profiles.clear();
				toastStore.show('Profile deleted successfully', 'success');
			}
		} catch (err) {
			console.error('Unexpected error deleting profile:', err);
			toastStore.show('An unexpected error occurred', 'error');
		}
	}
</script>

<svelte:head>
	<title>Settings - SoftoVault</title>
</svelte:head>

{#if loading}
	<div class="max-w-2xl mx-auto px-4 py-8">
		<div class="animate-pulse">
			<div class="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
			<div class="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="h-12 bg-gray-700 rounded"></div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="max-w-2xl mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center mb-4">
				<User class="w-8 h-8 text-red-500 mr-3" />
				<h1 class="text-3xl font-bold">Settings</h1>
			</div>
			<p class="text-gray-400">Manage your profile and account settings</p>
		</div>

		<!-- Profile Settings -->
		<div class="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
			<h2 class="text-xl font-semibold mb-6">Profile Information</h2>
			
			<form on:submit|preventDefault={saveProfile}>
				<div class="space-y-4">
					<!-- Email (read-only) -->
					<div>
						<label class="block text-sm font-medium mb-2">Email</label>
						<Input bind:value={email} disabled placeholder="Your email address" />
						<p class="text-xs text-gray-500 mt-1">Email cannot be changed from here</p>
					</div>

					<!-- Username -->
					<div>
						<label class="block text-sm font-medium mb-2">Username *</label>
						<Input bind:value={username} placeholder="Enter your username" required />
						<p class="text-xs text-gray-500 mt-1">This will be displayed in your profile</p>
					</div>

					<!-- Bio -->
					<div>
						<label class="block text-sm font-medium mb-2">Bio</label>
						<Textarea bind:value={bio} placeholder="Tell us about yourself..." rows="4" />
						<p class="text-xs text-gray-500 mt-1">Optional: A brief description about yourself</p>
					</div>

					<!-- Premium Status -->
					<div>
						<label class="flex items-center space-x-3">
							<input type="checkbox" bind:checked={premium} class="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2" />
							<span class="text-sm font-medium">Premium Account</span>
						</label>
						<p class="text-xs text-gray-500 mt-1">Premium users can create up to 5 vaults and 10 secrets per vault</p>
					</div>
				</div>

				<div class="flex gap-3 mt-6">
					<Button variant="primary" type="submit" disabled={saving}>
						<Save class="w-4 h-4 mr-2" />
						{saving ? 'Saving...' : 'Save Profile'}
					</Button>
					
					{#if profile}
						<Button variant="outline" type="button" onclick={deleteProfile}>
							<Trash2 class="w-4 h-4 mr-2" />
							Delete Profile
						</Button>
					{/if}
				</div>
			</form>
		</div>

		<!-- Account Information -->
		<div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
			<h2 class="text-xl font-semibold mb-4">Account Information</h2>
			<div class="space-y-3">
				<div class="flex justify-between items-center">
					<span class="text-gray-400">User ID:</span>
					<code class="text-sm font-mono text-gray-300 bg-gray-900 px-2 py-1 rounded">{$auth.user?.id}</code>
				</div>
				<div class="flex justify-between items-center">
					<span class="text-gray-400">Account Created:</span>
					<span class="text-gray-300">{new Date($auth.user?.created_at).toLocaleDateString()}</span>
				</div>
				<div class="flex justify-between items-center">
					<span class="text-gray-400">Email Verified:</span>
					<span class="text-gray-300">{$auth.user?.email_confirmed_at ? 'Yes' : 'No'}</span>
				</div>
			</div>
		</div>
	</div>
{/if}