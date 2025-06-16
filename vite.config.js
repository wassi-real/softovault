import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current directory
	const env = loadEnv(mode, process.cwd(), '');
	
	// Expose VITE_ variables as PUBLIC_
	const envWithProcessPrefix = {
		'process.env': Object.entries(env).reduce(
			(acc, [key, val]) => {
				if (key.startsWith('VITE_')) {
					acc[key] = val;
					acc[`PUBLIC_${key.slice(5)}`] = val;
				}
				return acc;
			},
			{}
		)
	};

	return {
		plugins: [tailwindcss(), sveltekit()],
		define: envWithProcessPrefix,
		optimizeDeps: {
			include: ['@supabase/ssr']
		},
		ssr: {
			noExternal: ['@supabase/ssr']
		}
	};
});
