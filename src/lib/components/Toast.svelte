<script>
	let { message, type = 'info', onClose } = $props();
	
	const typeClasses = {
		success: 'bg-green-600 border-green-500',
		error: 'bg-red-600 border-red-500',
		info: 'bg-blue-600 border-blue-500'
	};
	
	// Auto-close after 3 seconds
	setTimeout(() => {
		onClose?.();
	}, 3000);
</script>

<div class="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
	<div class="flex items-center p-4 rounded-lg border text-white {typeClasses[type]}">
		<span class="mr-3">
			{#if type === 'success'}
				✓
			{:else if type === 'error'}
				✕
			{:else}
				ℹ
			{/if}
		</span>
		<span>{message}</span>
		<button
			class="ml-4 text-white/80 hover:text-white"
			onclick={onClose}
		>
			×
		</button>
	</div>
</div>
