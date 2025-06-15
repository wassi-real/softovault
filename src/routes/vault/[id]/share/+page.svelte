<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { toastStore } from '$lib/stores/toast.js';
	import { Copy } from 'lucide-svelte';

	const vaultId = $page.params.id;
	const shareUrl = `${$page.url.origin}/vault/${vaultId}`;

	function copyToClipboard() {
		navigator.clipboard.writeText(shareUrl).then(() => {
			toastStore.show('Vault URL copied to clipboard!', 'success');
		}).catch(() => {
			toastStore.show('Failed to copy URL', 'error');
		});
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-16">
	<div class="text-center">
		<div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
			<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
			</svg>
		</div>
		
		<h1 class="text-3xl font-bold mb-4">Vault Created!</h1>
		<p class="text-gray-400 mb-8">Share this link to give others access to your vault</p>
		
		<div class="bg-gray-800 rounded-lg p-4 mb-6">
			<div class="flex items-center gap-3">
				<code class="flex-1 text-sm text-gray-300 break-all">{shareUrl}</code>
				<Button variant="secondary" size="sm" onclick={copyToClipboard}>
					<Copy class="w-4 h-4" />
				</Button>
			</div>
		</div>
		
		<div class="flex gap-4 justify-center">
			<Button variant="primary" onclick={copyToClipboard}>
				Copy Link
			</Button>
			<Button variant="secondary" href="/dashboard">
				View Dashboard
			</Button>
		</div>
	</div>
</div>
