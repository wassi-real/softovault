import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase-api';

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

// GET /api/vault/key/[key] - Get specific secret by key
export async function GET({ request, params }) {
	try {
		// Extract access key from Authorization header
		const authHeader = request.headers.get('authorization');
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw error(401, { message: 'Authorization header must be in format: Bearer <access_key>' });
		}

		const accessKey = authHeader.substring(7); // Remove 'Bearer ' prefix
		const secretKey = decodeURIComponent(params.key);
		
		if (!secretKey) {
			throw error(400, { message: 'Secret key is required' });
		}
		
		// Authenticate vault
		const vault = await authenticateVault(accessKey);
		
		// Get specific secret
		const { data: secret, error: secretError } = await supabase
			.from('secrets')
			.select('key, value, description, created_at, updated_at')
			.eq('vault_id', vault.id)
			.eq('key', secretKey)
			.single();

		if (secretError || !secret) {
			throw error(404, { message: `Secret with key '${secretKey}' not found` });
		}

		return json({
			success: true,
			key: secret.key,
			value: secret.value,
			description: secret.description,
			created_at: secret.created_at,
			updated_at: secret.updated_at
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