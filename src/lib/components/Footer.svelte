<script>
	import { Github, Twitter, ExternalLink } from 'lucide-svelte';
</script>

<footer class="bg-black-500 border-t border-gray-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Logo and Description -->
			<div class="col-span-1 md:col-span-2">
				<div class="flex items-center space-x-3 mb-4">
					<img src="/src/lib/assets/SoftoVaultLogo.png" alt="SoftoVault Logo" class="w-8 h-8" />
					<span class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SoftoVault</span>
				</div>
				<p class="text-gray-400 mb-6 max-w-md">
					Secure, simple, and developer-friendly secret management. Protect your sensitive data with military-grade encryption.
				</p>
				<div class="flex space-x-4">
					<a href="https://github.com/softovault" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors duration-300">
						<Github class="w-6 h-6" />
					</a>
					<a href="https://twitter.com/softovault" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors duration-300">
						<Twitter class="w-6 h-6" />
					</a>
					<a href="https://reddit.com/r/softovault" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors duration-300">
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
						</svg>
					</a>
					<a href="https://producthunt.com/products/softovault" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors duration-300">
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.319 0 4.199 1.881 4.199 4.199s-1.88 4.201-4.199 4.201z"/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Product Links -->
			<div>
				<h3 class="text-white font-semibold mb-4">Product</h3>
				<ul class="space-y-3">
					<li>
						<a href="/pricing" class="text-gray-400 hover:text-white transition-colors duration-300">Pricing</a>
					</li>
					<li>
						<a href="/sdk" class="text-gray-400 hover:text-white transition-colors duration-300">SDK & API</a>
					</li>
					<li>
						<a href="/about" class="text-gray-400 hover:text-white transition-colors duration-300">About</a>
					</li>
					<li>
						<a href="/dashboard" class="text-gray-400 hover:text-white transition-colors duration-300">Dashboard</a>
					</li>
				</ul>
			</div>

			<!-- Legal Links -->
			<div>
				<h3 class="text-white font-semibold mb-4">Legal</h3>
				<ul class="space-y-3">
					<li>
						<a href="/privacy-policy" class="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
					</li>
					<li>
						<a href="/terms-of-service" class="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
					</li>
					<li>
						<a href="/security" class="text-gray-400 hover:text-white transition-colors duration-300">Security</a>
					</li>
					<li>
						<a href="/contact" class="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="border-t border-gray-800 mt-12 pt-8">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="flex items-center space-x-4 mb-4 md:mb-0">
					<img src="/src/lib/assets/SoftoVaultLogo.png" alt="SoftoVault Logo" class="w-6 h-6" />
					<p class="text-gray-400 text-sm">
						© {new Date().getFullYear()} SoftoVault. All rights reserved.
					</p>
				</div>
				<div class="flex items-center space-x-6 text-sm">
					<span class="text-gray-400">Made with ❤️ for developers</span>
					<div class="flex items-center space-x-2">
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span class="text-gray-400 text-xs">All systems operational</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>