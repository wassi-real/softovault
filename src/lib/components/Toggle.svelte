<script>
	let { checked = $bindable(false), ...props } = $props();
</script>

<button
	type="button"
	class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 {checked ? 'bg-red-600' : 'bg-gray-600'}"
	onclick={() => checked = !checked}
	{...props}
>
	<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {checked ? 'translate-x-6' : 'translate-x-1'}"></span>
</button>
