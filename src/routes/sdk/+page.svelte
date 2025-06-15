<script>
	import Button from '$lib/components/Button.svelte';
	import { Code, Download, Book, Terminal, Copy, Check } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let copiedCode = '';

	const sdks = [
		{
			name: 'JavaScript/Node.js',
			language: 'javascript',
			install: 'npm install @softovault/client',
			code: `
				// Get a single secret
				import { Vault } from '@softovault/client'

				const vault = new Vault('your-vault-access-key')
				const secret = await vault.get('API_KEY')
				console.log(secret)

				// Get all secrets
				import { Vault } from '@softovault/client'

				const vault = new Vault('your-vault-access-key')
				const secrets = await vault.getAll()
				console.log(secrets) // { "API_KEY": "value", "DB_URL": "value", ... }



			`,
			color: 'from-yellow-500 to-yellow-600'
		},
	];

	const features = [
		{
			icon: Code,
			title: 'RESTful API',
			description: 'Clean, intuitive REST API with comprehensive documentation and examples.'
		},
		{
			icon: Terminal,
			title: 'CLI Tool',
			description: 'Command-line interface for managing vaults and secrets from your terminal.'
		},
		{
			icon: Book,
			title: 'Comprehensive Docs',
			description: 'Detailed documentation with examples, tutorials, and best practices.'
		},
		{
			icon: Download,
			title: 'JavaScript SDK',
			description: 'Official JavaScript SDK with full TypeScript support and complete API coverage.'
		}
	];

	function copyToClipboard(text, id) {
		navigator.clipboard.writeText(text).then(() => {
			copiedCode = id;
			setTimeout(() => {
				copiedCode = '';
			}, 2000);
		});
	}
</script>

<svelte:head>
	<title>SDK & API - SoftoVault</title>
	<meta name="description" content="Integrate SoftoVault into your applications with our JavaScript SDK and REST API. Built by developers, for developers." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				Developer Tools & SDK
			</h1>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
				Integrate SoftoVault into your applications with our comprehensive SDKs and REST API. Built by developers, for developers.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button variant="primary" size="lg" onclick={() => goto('/register')}>
					Get API Key
				</Button>
				<Button variant="outline" size="lg">
					<Book class="w-5 h-5 mr-2" />
				<a href="https://www.npmjs.com/package/@softovault/client#methods">View Documentation</a>	
				</Button>
			</div>
		</div>

		<!-- Features -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
			{#each features as feature}
				<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:border-red-500/50 transition-all duration-300">
					<div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg mb-4">
						<svelte:component this={feature.icon} class="w-6 h-6 text-white" />
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
					<p class="text-gray-400 text-sm">{feature.description}</p>
				</div>
			{/each}
		</div>

		<!-- SDK Examples -->
		<div class="mb-20">
			<h2 class="text-3xl font-bold text-center text-white mb-12">Quick Start with JavaScript SDK</h2>
			<div class="flex justify-center">
				{#each sdks as sdk}
					<div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden max-w-3xl w-full shadow-xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300">
						<!-- Header -->
						<div class="bg-gradient-to-r {sdk.color} p-6">
							<div class="flex items-center justify-between">
								<h3 class="text-2xl font-bold text-white">{sdk.name}</h3>
								<button 
									class="text-white hover:text-gray-200 transition-colors"
									onclick={() => copyToClipboard(sdk.code, sdk.name)}
								>
									{#if copiedCode === sdk.name}
										<Check class="w-6 h-6" />
									{:else}
										<Copy class="w-6 h-6" />
									{/if}
								</button>
							</div>
							<p class="text-white/90 text-base mt-2">Install: <code class="bg-black/30 px-3 py-1 rounded font-mono">{sdk.install}</code></p>
						</div>

						<!-- Code Block -->
						<div class="p-8">
							<pre class="text-base text-gray-300 overflow-x-auto"><code>{sdk.code}</code></pre>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- API Reference -->
		

		<!-- CLI Tool -->
		<div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-20">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
				<div>
					<h2 class="text-3xl font-bold text-white mb-6">
						<Terminal class="w-8 h-8 inline mr-3" />
						Command Line (Coming Soon)
					</h2>
					<p class="text-lg text-gray-400 mb-6">
						Manage your vaults and secrets directly from your terminal. Perfect for CI/CD pipelines and automation.
					</p>
					<div class="space-y-3">
						<div class="flex items-center text-gray-300">
							<Check class="w-5 h-5 text-green-500 mr-3" />
							Cross-platform support
						</div>
						<div class="flex items-center text-gray-300">
							<Check class="w-5 h-5 text-green-500 mr-3" />
							Interactive and scriptable modes
						</div>
						<div class="flex items-center text-gray-300">
							<Check class="w-5 h-5 text-green-500 mr-3" />
							Built-in security best practices
						</div>
					</div>
				</div>
				<div class="bg-gray-900 rounded-lg p-6 border border-gray-700">
					<div class="flex items-center mb-4">
						<div class="flex space-x-2">
							<div class="w-3 h-3 bg-red-500 rounded-full"></div>
							<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
							<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						</div>
						<span class="text-gray-400 text-sm ml-4">Terminal</span>
					</div>
					<pre class="text-sm text-gray-300"><code># Install the CLI
npm install @softovault/client

# Login with your API key
softovault auth login

# Create a new vault
softovault vault create "My Secrets"

# Add a secret
softovault secret add vault-id \
  --key "API_KEY" \
  --value "secret-value" \
  --expires "24h"

# List all vaults
softovault vault list</code></pre>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		<div class="text-center">
			<h2 class="text-3xl font-bold text-white mb-6">Ready to Start Building?</h2>
			<p class="text-xl text-gray-400 mb-8">
				Get your API key and start integrating SoftoVault into your applications today.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button variant="primary" size="lg" onclick={() => goto('/register')}>
					Get Started Free
				</Button>
				<Button variant="outline" size="lg">
					<Book class="w-5 h-5 mr-2" />
					Read Documentation
				</Button>
			</div>
		</div>
	</div>
</div>