import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

// CORS headers
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Handle preflight requests
export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: corsHeaders
	});
}

// Helper function to authenticate vault access using access_key
async function authenticateVault(accessKey) {
	if (!accessKey) {
		throw error(401, { message: 'Authorization header required' });
	}

	// Query vault by access_key
	const { data: vault, error: vaultError } = await supabase
		.from('vaults')
		.select('id, title, description, user_id, created_at, updated_at')
		.eq('access_key', accessKey)
		.single();

	if (vaultError || !vault) {
		throw error(401, { message: 'Invalid access key' });
	}

	// Update last_accessed timestamp
	await supabase
		.from('vaults')
		.update({ 
			last_accessed: new Date().toISOString(),
			accessed: true 
		})
		.eq('id', vault.id);

	return vault;
}

// Helper function to get secrets for a vault
async function getVaultSecrets(vaultId) {
	const { data: secrets, error: secretsError } = await supabase
		.from('secrets')
		.select('key, value, description, created_at, updated_at')
		.eq('vault_id', vaultId)
		.order('created_at', { ascending: true });

	if (secretsError) {
		throw error(500, { message: 'Failed to retrieve secrets' });
	}

	return secrets || [];
}

// GET /api/vault/all - Get all secrets
export async function GET({ request }) {
	try {
		// Extract access key from Authorization header
		const authHeader = request.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw error(401, { message: 'Authorization header must be in format: Bearer <access_key>' });
		}

		const accessKey = authHeader.substring(7); // Remove 'Bearer ' prefix
		
		// Authenticate vault
		const vault = await authenticateVault(accessKey);
		
		// Get all secrets for this vault
		const secrets = await getVaultSecrets(vault.id);
		
		// Convert to key-value pairs for SDK compatibility
		const secretsObject = {};
		secrets.forEach(secret => {
			secretsObject[secret.key] = secret.value;
		});

		return json({
			success: true,
			secrets: secretsObject,
			count: secrets.length
		}, {
			headers: corsHeaders
		});
	} catch (err) {
		console.error('API Error:', err);
		if (err.status) {
			throw err;
		}
		throw error(500, { message: 'Internal server error' });
	}
}