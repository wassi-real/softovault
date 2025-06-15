<script>
	let { code = '' } = $props();
	
	// Simple syntax highlighting for common languages
	function highlightCode(code) {
		return code
			.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>') // Multi-line comments
			.replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>') // Single-line comments
			.replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default)\b/g, '<span class="text-purple-400">$&</span>') // Keywords
			.replace(/"([^"\\]|\\.)*"/g, '<span class="text-green-400">$&</span>') // Strings
			.replace(/'([^'\\]|\\.)*'/g, '<span class="text-green-400">$&</span>') // Strings
			.replace(/\b\d+\b/g, '<span class="text-blue-400">$&</span>'); // Numbers
	}
</script>

<div class="relative">
	<div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
		<span class="text-sm text-gray-400">Code</span>
		<button
			class="text-sm text-gray-400 hover:text-white"
			onclick={() => navigator.clipboard.writeText(code)}
		>
			Copy
		</button>
	</div>
	<pre class="p-4 overflow-x-auto"><code class="text-sm">{@html highlightCode(code)}</code></pre>
</div>
