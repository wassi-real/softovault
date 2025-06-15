<script>
	let { 
		value = $bindable(''),
		placeholder = '',
		rows = 4,
		required = false,
		class: className = '',
		...props 
	} = $props();

	const classes = `w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical ${className}`;
</script>

<textarea 
	bind:value 
	{placeholder} 
	{rows}
	{required}
	class={classes}
	{...props}
></textarea>
