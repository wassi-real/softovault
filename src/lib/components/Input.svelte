<script>
	let { 
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		required = false,
		class: className = '',
		...props 
	} = $props();

	const classes = `w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`;
</script>

<input 
	{type} 
	bind:value 
	{placeholder} 
	{required}
	class={classes}
	{...props}
/>
