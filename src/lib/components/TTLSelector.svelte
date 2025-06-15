<script>
	let { value = $bindable('1h'), id = '', disabled = false } = $props();

	const options = [
		{ value: '10m', label: '10 minutes' },
		{ value: '1h', label: '1 hour' },
		{ value: '24h', label: '24 hours' },
		{ value: '7d', label: '7 days' }
	];
</script>

<select {id} bind:value {disabled} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
