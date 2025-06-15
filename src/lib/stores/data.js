import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { auth } from './auth.js';

// Cache stores
const vaultsCache = writable([]);
const secretsCache = writable(new Map()); // Map of vaultId -> secrets array
const loadingStates = writable(new Map()); // Track loading states

// Subscription management
let vaultSubscription = null;
let secretSubscriptions = new Map();

// Export stores
export const vaults = {
	subscribe: vaultsCache.subscribe,
	
	// Load vaults with caching
	load: async (forceRefresh = false) => {
		const authState = get(auth);
		if (!authState.user) return [];
		
		const currentVaults = get(vaultsCache);
		if (!forceRefresh && currentVaults.length > 0) {
			return currentVaults;
		}
		
		try {
			const { data: fetchedVaults, error } = await supabase
				.from('vaults')
				.select(`
					*,
					secrets:secrets(count)
				`)
				.eq('user_id', authState.user.id)
				.order('created_at', { ascending: false });
			
			if (error) throw error;
			
			const vaultsData = fetchedVaults || [];
			vaultsCache.set(vaultsData);
			
			// Setup realtime subscription for vaults
			if (!vaultSubscription) {
				try {
					vaultSubscription = supabase
						.channel(`vaults_${authState.user.id}`)
						.on(
							'postgres_changes',
							{
								event: '*',
								schema: 'public',
								table: 'vaults',
								filter: `user_id=eq.${authState.user.id}`
							},
							(payload) => {
								vaultsCache.update(currentVaults => {
									if (payload.eventType === 'INSERT') {
										return [payload.new, ...currentVaults];
									} else if (payload.eventType === 'DELETE') {
										return currentVaults.filter(v => v.id !== payload.old.id);
									} else if (payload.eventType === 'UPDATE') {
										return currentVaults.map(v => 
											v.id === payload.new.id ? payload.new : v
										);
									}
									return currentVaults;
								});
							}
						)
						.subscribe();
				} catch (error) {
					console.warn('Failed to setup vault subscription:', error);
				}
			}
			
			return vaultsData;
		} catch (error) {
			console.error('Error loading vaults:', error);
			return [];
		}
	},
	
	// Add vault to cache
	add: (vault) => {
		vaultsCache.update(vaults => [vault, ...vaults]);
	},

	// Update vault in cache
	update: (vaultId, updatedVault) => {
		vaultsCache.update(vaults => 
			vaults.map(v => v.id === vaultId ? updatedVault : v)
		);
	},

	// Remove vault from cache
	remove: (vaultId) => {
		vaultsCache.update(vaults => vaults.filter(v => v.id !== vaultId));
		// Also clean up secrets cache
		secretsCache.update(cache => {
			cache.delete(vaultId);
			return new Map(cache);
		});
	},
	
	// Clear cache
	clear: () => {
		vaultsCache.set([]);
		secretsCache.set(new Map());
		if (vaultSubscription) {
			try {
				supabase.removeChannel(vaultSubscription);
			} catch (error) {
				console.warn('Error removing vault subscription:', error);
			}
			vaultSubscription = null;
		}
		// Clear all secret subscriptions
		secretSubscriptions.forEach(subscription => {
			try {
				supabase.removeChannel(subscription);
			} catch (error) {
				console.warn('Error removing secret subscription:', error);
			}
		});
		secretSubscriptions.clear();
	}
};

export const secrets = {
	subscribe: secretsCache.subscribe,
	
	// Load secrets for a specific vault with caching
	load: async (vaultId, forceRefresh = false) => {
		const authState = get(auth);
		if (!authState.user) return [];
		
		const currentCache = get(secretsCache);
		if (!forceRefresh && currentCache.has(vaultId)) {
			return currentCache.get(vaultId);
		}
		
		try {
			const { data: fetchedSecrets, error } = await supabase
				.from('secrets')
				.select('*')
				.eq('vault_id', vaultId)
				.order('created_at', { ascending: false });
			
			if (error) throw error;
			
			const secretsData = fetchedSecrets || [];
			secretsCache.update(cache => {
				cache.set(vaultId, secretsData);
				return new Map(cache);
			});
			
			// Setup realtime subscription for this vault's secrets
			if (!secretSubscriptions.has(vaultId)) {
				try {
					const subscription = supabase
						.channel(`secrets_vault_${vaultId}`)
						.on(
							'postgres_changes',
							{
								event: '*',
								schema: 'public',
								table: 'secrets',
								filter: `vault_id=eq.${vaultId}`
							},
							(payload) => {
								secretsCache.update(cache => {
									const currentSecrets = cache.get(vaultId) || [];
									let updatedSecrets;
									
									if (payload.eventType === 'INSERT') {
										updatedSecrets = [payload.new, ...currentSecrets];
									} else if (payload.eventType === 'DELETE') {
										updatedSecrets = currentSecrets.filter(s => s.id !== payload.old.id);
									} else if (payload.eventType === 'UPDATE') {
										updatedSecrets = currentSecrets.map(s => 
											s.id === payload.new.id ? payload.new : s
										);
									}
									
									cache.set(vaultId, updatedSecrets);
									return new Map(cache);
								});
							}
						)
						.subscribe();
					
					secretsSubscriptions.set(vaultId, subscription);
				} catch (error) {
					console.warn('Failed to setup secrets subscription:', error);
				}
			}
			
			return secretsData;
		} catch (error) {
			console.error('Error loading secrets:', error);
			return [];
		}
	},
	
	// Get secrets for a specific vault from cache
	get: (vaultId) => {
		const cache = get(secretsCache);
		return cache.get(vaultId) || [];
	},
	
	// Add secret to cache
	add: (vaultId, secret) => {
		secretsCache.update(cache => {
			const currentSecrets = cache.get(vaultId) || [];
			cache.set(vaultId, [secret, ...currentSecrets]);
			return new Map(cache);
		});
	},
	
	// Update secret in cache
	update: (vaultId, secretId, updatedSecret) => {
		secretsCache.update(cache => {
			const currentSecrets = cache.get(vaultId) || [];
			const updatedSecrets = currentSecrets.map(s => 
				s.id === secretId ? updatedSecret : s
			);
			cache.set(vaultId, updatedSecrets);
			return new Map(cache);
		});
	},
	
	// Remove secret from cache
	remove: (vaultId, secretId) => {
		secretsCache.update(cache => {
			const currentSecrets = cache.get(vaultId) || [];
			const filteredSecrets = currentSecrets.filter(s => s.id !== secretId);
			cache.set(vaultId, filteredSecrets);
			return new Map(cache);
		});
	},
	
	// Clear cache for a specific vault
	clearVault: (vaultId) => {
		secretsCache.update(cache => {
			cache.delete(vaultId);
			return new Map(cache);
		});
		if (secretSubscriptions.has(vaultId)) {
			try {
				supabase.removeChannel(secretSubscriptions.get(vaultId));
			} catch (error) {
				console.warn('Error removing secret subscription:', error);
			}
			secretSubscriptions.delete(vaultId);
		}
	},

	// Clear all cache
	clear: () => {
		secretsCache.set(new Map());
		secretSubscriptions.forEach(subscription => {
			try {
				supabase.removeChannel(subscription);
			} catch (error) {
				console.warn('Error removing secret subscription:', error);
			}
		});
		secretSubscriptions.clear();
	}
};

// Initialize data loading when auth state changes
let lastUserId = null;
auth.subscribe(async (authState) => {
	const currentUserId = authState.user?.id;
	
	// Only react to actual user changes to prevent infinite loops
	if (currentUserId !== lastUserId) {
		lastUserId = currentUserId;
		
		if (authState.user && !authState.loading) {
			// Preload vaults when user logs in
			vaults.load();
		} else if (!authState.user) {
			// Clear cache when user logs out
			vaults.clear();
			secrets.clear();
		}
	}
});

// Profiles store
const profilesCache = writable(null);

export const profiles = {
	subscribe: profilesCache.subscribe,
	
	// Load user profile
	load: async (userId, force = false) => {
		try {
			const currentProfile = get(profilesCache);
			if (currentProfile && !force) {
				return currentProfile;
			}

			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('user_id', userId)
				.single();

			if (error && error.code !== 'PGRST116') {
				console.error('Error loading profile:', error);
				return null;
			}

			profilesCache.set(data);
			return data;
		} catch (error) {
			console.error('Error loading profile:', error);
			return null;
		}
	},
	
	// Update profile in cache
	update: (profile) => {
		profilesCache.set(profile);
	},
	
	// Clear profile cache
	clear: () => {
		profilesCache.set(null);
	}
};

// Export loading states
export const loading = {
	subscribe: loadingStates.subscribe,
	set: (key, value) => {
		loadingStates.update(states => {
			states.set(key, value);
			return new Map(states);
		});
	},
	get: (key) => {
		const states = get(loadingStates);
		return states.get(key) || false;
	}
};