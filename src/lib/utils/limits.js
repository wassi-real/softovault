import { supabase } from '$lib/supabase.js';
import { profiles } from '$lib/stores/data.js';

/**
 * Check if user has a profile and get their premium status
 * @param {string} userId - The user ID
 * @returns {Promise<{hasProfile: boolean, isPremium: boolean, profile: object|null}>}
 */
export async function checkUserProfile(userId) {
	try {
		const { data: profile, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('user_id', userId)
			.single();

		if (error && error.code !== 'PGRST116') {
			console.error('Error checking user profile:', error);
			return { hasProfile: false, isPremium: false, profile: null };
		}

		return {
			hasProfile: !!profile,
			isPremium: profile?.premium || false,
			profile: profile
		};
	} catch (error) {
		console.error('Error checking user profile:', error);
		return { hasProfile: false, isPremium: false, profile: null };
	}
}

/**
 * Check if user can create a new vault
 * @param {string} userId - The user ID
 * @returns {Promise<{canCreate: boolean, currentCount: number, maxAllowed: number, reason?: string}>}
 */
export async function checkVaultLimits(userId) {
	try {
		// First check if user has a profile
		const { hasProfile, isPremium } = await checkUserProfile(userId);
		
		if (!hasProfile) {
			return {
				canCreate: false,
				currentCount: 0,
				maxAllowed: 0,
				reason: 'You must create a profile first to use SoftoVault. Please go to Settings to create your profile.'
			};
		}

		// Get current vault count
		const { count, error } = await supabase
			.from('vaults')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId);

		if (error) {
			console.error('Error counting vaults:', error);
			return { canCreate: false, currentCount: 0, maxAllowed: 0, reason: 'Error checking vault limits' };
		}

		const currentCount = count || 0;
		const maxAllowed = isPremium ? 5 : 1;

		return {
			canCreate: currentCount < maxAllowed,
			currentCount,
			maxAllowed,
			reason: currentCount >= maxAllowed ? 
				`You have reached the maximum number of vaults (${maxAllowed}) for your account type. ${isPremium ? '' : 'Upgrade to Premium to create up to 5 vaults.'}` : 
				undefined
		};
	} catch (error) {
		console.error('Error checking vault limits:', error);
		return { canCreate: false, currentCount: 0, maxAllowed: 0, reason: 'Error checking vault limits' };
	}
}

/**
 * Check if user can create a new secret in a vault
 * @param {string} userId - The user ID
 * @param {string} vaultId - The vault ID
 * @returns {Promise<{canCreate: boolean, currentCount: number, maxAllowed: number, reason?: string}>}
 */
export async function checkSecretLimits(userId, vaultId) {
	try {
		// First check if user has a profile
		const { hasProfile, isPremium } = await checkUserProfile(userId);
		
		if (!hasProfile) {
			return {
				canCreate: false,
				currentCount: 0,
				maxAllowed: 0,
				reason: 'You must create a profile first to use SoftoVault. Please go to Settings to create your profile.'
			};
		}

		// Get current secret count for this vault
		const { count, error } = await supabase
			.from('secrets')
			.select('*', { count: 'exact', head: true })
			.eq('vault_id', vaultId);

		if (error) {
			console.error('Error counting secrets:', error);
			return { canCreate: false, currentCount: 0, maxAllowed: 0, reason: 'Error checking secret limits' };
		}

		const currentCount = count || 0;
		const maxAllowed = isPremium ? 10 : 5;

		return {
			canCreate: currentCount < maxAllowed,
			currentCount,
			maxAllowed,
			reason: currentCount >= maxAllowed ? 
				`You have reached the maximum number of secrets (${maxAllowed}) for your account type. ${isPremium ? '' : 'Upgrade to Premium to create up to 10 secrets per vault.'}` : 
				undefined
		};
	} catch (error) {
		console.error('Error checking secret limits:', error);
		return { canCreate: false, currentCount: 0, maxAllowed: 0, reason: 'Error checking secret limits' };
	}
}

/**
 * Get user limits summary
 * @param {string} userId - The user ID
 * @returns {Promise<{hasProfile: boolean, isPremium: boolean, vaultLimits: object, profile: object|null}>}
 */
export async function getUserLimitsSummary(userId) {
	try {
		const { hasProfile, isPremium, profile } = await checkUserProfile(userId);
		const vaultLimits = await checkVaultLimits(userId);

		return {
			hasProfile,
			isPremium,
			vaultLimits,
			profile
		};
	} catch (error) {
		console.error('Error getting user limits summary:', error);
		return {
			hasProfile: false,
			isPremium: false,
			vaultLimits: { canCreate: false, currentCount: 0, maxAllowed: 0 },
			profile: null
		};
	}
}