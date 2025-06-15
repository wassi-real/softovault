<script>
	let { 
		variant = 'primary', 
		size = 'md', 
		type = 'button',
		href = null,
		onclick = null,
		class: className = '',
		children,
		...props 
	} = $props();

	const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
	
	const variants = {
		primary: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
		secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500 shadow-md hover:shadow-lg',
		ghost: 'hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500 border border-transparent hover:border-gray-600',
		outline: 'border-2 border-gray-600 hover:border-red-500 text-gray-300 hover:text-white hover:bg-red-500/10 focus:ring-red-500'
	};
	
	const sizes = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};
	
	const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
</script>

{#if href}
	<a {href} class={classes} {...props}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={classes} {onclick} {...props}>
		{@render children?.()}
	</button>
{/if}
