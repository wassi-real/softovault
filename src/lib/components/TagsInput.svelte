<script>
	let { tags = $bindable([]), id = '', disabled = false } = $props();
	let inputValue = $state('');

	function addTag() {
		const tag = inputValue.trim();
		if (tag && !tags.includes(tag)) {
			tags = [...tags, tag];
			inputValue = '';
		}
	}

	function removeTag(tagToRemove) {
		tags = tags.filter(tag => tag !== tagToRemove);
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		}
	}
</script>

<div class="space-y-2">
	<div class="flex flex-wrap gap-2">
		{#each tags as tag}
			<span class="inline-flex items-center px-2 py-1 bg-gray-700 text-sm rounded">
				{tag}
				<button
					type="button"
					class="ml-1 text-gray-400 hover:text-white"
					onclick={() => removeTag(tag)}
				>
					×
				</button>
			</span>
		{/each}
	</div>
	
	<input
		{id}
		type="text"
		bind:value={inputValue}
		placeholder="Add tags..."
		class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
		onkeydown={handleKeydown}
		{disabled}
	/>
</div>
