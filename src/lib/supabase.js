import { createBrowserClient } from '@supabase/ssr';
import { browser } from '$app/environment';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
	global: {
		fetch,
	},
	cookies: {
		getAll() {
			if (!browser) return [];
			return document.cookie
				.split(';')
				.map(cookie => {
					const [name, ...rest] = cookie.trim().split('=');
					return { name, value: rest.join('=') };
				})
				.filter(cookie => cookie.name && cookie.value);
		},
		setAll(cookiesToSet) {
			if (!browser) return;
			cookiesToSet.forEach(({ name, value, options }) => {
				const cookieOptions = {
					path: '/',
					...options
				};
				
				let cookieString = `${name}=${value}`;
				
				if (cookieOptions.maxAge) {
					cookieString += `; Max-Age=${cookieOptions.maxAge}`;
				}
				if (cookieOptions.path) {
					cookieString += `; Path=${cookieOptions.path}`;
				}
				if (cookieOptions.domain) {
					cookieString += `; Domain=${cookieOptions.domain}`;
				}
				if (cookieOptions.secure) {
					cookieString += '; Secure';
				}
				if (cookieOptions.httpOnly) {
					cookieString += '; HttpOnly';
				}
				if (cookieOptions.sameSite) {
					cookieString += `; SameSite=${cookieOptions.sameSite}`;
				}
				
				document.cookie = cookieString;
			});
		}
	}
});
