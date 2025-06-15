<script>
	let { 
		value = $bindable(''),
		options = [],
		class: className = '',
		...props 
	} = $props();

	const classes = `w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`;
</script>

<select bind:value class={classes} {...props}>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
