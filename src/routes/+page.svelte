<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	let heroRef;
	let mouseX = 0;
	let mouseY = 0;

	onMount(() => {
		const handleMouseMove = (e) => {
			if (heroRef) {
				const rect = heroRef.getBoundingClientRect();
				mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
				mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	});
</script>

<svelte:head>
	<title>SoftoVault - Secure Secret Management</title>
	<meta name="description" content="Securely store and share secrets with military-grade encryption, time-based expiration, and burn-after-read functionality." />
</svelte:head>

<div 
	bind:this={heroRef}
	class="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 overflow-hidden"
>
	<!-- Enhanced Animated Background Grid -->
	<div class="absolute inset-0 opacity-80">
		<div class="absolute inset-0 bg-gradient-to-br from-red-500/15 via-purple-500/5 to-red-600/15 animate-gradient-shift"></div>
		<svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(239 68 68 / 0.15)" stroke-width="1" class="animate-pulse"/>
					<circle cx="0" cy="0" r="1" fill="rgb(239 68 68 / 0.2)" class="animate-ping" style="animation-duration: 3s;"/>
				</pattern>
				<pattern id="grid-secondary" width="80" height="80" patternUnits="userSpaceOnUse">
					<path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgb(168 85 247 / 0.08)" stroke-width="1"/>
					<circle cx="40" cy="40" r="2" fill="rgb(168 85 247 / 0.15)" class="animate-pulse" style="animation-duration: 4s;"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid-secondary)" class="animate-grid-slow" />
			<rect width="100%" height="100%" fill="url(#grid)" class="animate-grid" />
		</svg>
	</div>

	<!-- Floating Particles -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		{#each Array(20) as _, i}
			<div 
				class="absolute w-1 h-1 bg-red-500/30 rounded-full animate-float"
				style="
					left: {Math.random() * 100}%; 
					top: {Math.random() * 100}%; 
					animation-delay: {Math.random() * 5}s;
					animation-duration: {3 + Math.random() * 4}s;
				"
			></div>
		{/each}
	</div>

	<!-- Main Content -->
	<div 
		class="relative z-10 text-center max-w-5xl mx-auto transform transition-transform duration-300 ease-out"
		style="transform: perspective(1000px) rotateX({mouseY * 2}deg) rotateY({mouseX * 2}deg)"
	>
		<!-- Main Title -->
		<!-- <div class="mb-8">
			<h1 class="text-6xl md:text-8xl lg:text-9xl font-black mb-4 leading-none">
				<span class="inline-block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-gradient bg-300p hover:scale-105 transition-transform duration-500">
					Softo
				</span>
				<span class="inline-block bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent animate-gradient-reverse bg-300p hover:scale-105 transition-transform duration-500">
					Vault
				</span>
			</h1>
			<div class="h-1 w-32 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full animate-pulse"></div>
		</div> -->
		
		<!-- Subtitle -->
		<p class="text-2xl md:text-4xl lg:text-5xl text-gray-200 mb-8 leading-tight font-light tracking-wide">
			<span class="inline-block animate-fade-in-up" style="animation-delay: 0.2s">
				Secure environment without
			</span>
			<br>
			<span class="inline-block bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-semibold animate-fade-in-up" style="animation-delay: 0.4s">
				exposed secrets
			</span>
		</p>
		
		<!-- Description -->
		<p class="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.6s">
			Manage your 
			<span class="text-red-400 font-medium">API keys</span>, 
			<span class="text-red-400 font-medium">environment variables</span>, 
			<span class="text-red-400 font-medium">database credentials</span>, and 
			<span class="text-red-400 font-medium">sensitive configurations</span> 
			without hardcoding them in files or repositories.
		</p>
		
		<!-- CTA Buttons -->
		<div class="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style="animation-delay: 0.8s">
			<Button 
				variant="primary" 
				size="xl"
				class="text-xl px-12 py-4 shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
				onclick={() => goto('/create')}
			>
				🚀 Start Your Vault
			</Button>
			
			<Button 
				variant="outline" 
				size="xl"
				class="text-xl px-12 py-4 border-2 border-gray-600 hover:border-red-500 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
				onclick={() => goto('/login')}
			>
				🔐 Login
			</Button>
		</div>

		<!-- Stats/Features -->
		<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style="animation-delay: 1s">
			<div class="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
				<div class="text-3xl md:text-4xl font-bold text-red-500 mb-2">🔐</div>
				<div class="text-gray-400">No Hardcoded Secrets</div>
			</div>
			<div class="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
				<div class="text-3xl md:text-4xl font-bold text-red-500 mb-2">⚡</div>
				<div class="text-gray-400">Environment Variables</div>
			</div>
			<div class="text-center p-6 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
				<div class="text-3xl md:text-4xl font-bold text-red-500 mb-2">🛡️</div>
				<div class="text-gray-400">Secure by Design</div>
			</div>
		</div>
	</div>
</div>

<!-- What is SoftoVault Section -->
<div class="py-32 bg-black">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				What is SoftoVault?
			</h2>
			<p class="text-xl text-gray-400">
				A secure, developer-friendly solution for managing sensitive data
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">🔒 Secure Secret Management</h3>
				<p class="text-gray-400">
					Store your API keys, passwords, and sensitive configuration data with military-grade encryption. 
					Your secrets are encrypted at rest and in transit, ensuring maximum security.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">⚡ Developer-First Experience</h3>
				<p class="text-gray-400">
					Built by developers, for developers. Integrate SoftoVault into your applications with our 
					comprehensive SDK and REST API. Manage secrets programmatically with ease.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">🔄 Environment Variables</h3>
				<p class="text-gray-400">
					Seamlessly manage environment variables across different environments. 
					Keep your development, staging, and production configurations secure and organized.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">🔑 Access Control</h3>
				<p class="text-gray-400">
					Fine-grained access control for your secrets. Share access with team members 
					or external services while maintaining full control over who can access what.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- FAQ Section -->
<div class="py-32 bg-black border-t border-gray-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				Frequently Asked Questions
			</h2>
			<p class="text-xl text-gray-400">
				Everything you need to know about SoftoVault
			</p>
		</div>

		<div class="space-y-6">
			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">How secure is SoftoVault?</h3>
				<p class="text-gray-400">
					SoftoVault uses military-grade encryption to protect your secrets. All data is encrypted at rest 
					and in transit using AES-256 encryption. We also implement strict access controls and audit logging 
					to ensure your secrets remain secure.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">How do I integrate SoftoVault with my application?</h3>
				<p class="text-gray-400">
					We provide a comprehensive SDK and REST API that makes integration simple. You can use our client 
					libraries for popular programming languages or make direct API calls. Check out our documentation 
					for detailed integration guides.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">Can I use SoftoVault for team collaboration? (Coming Soon)</h3>
				<p class="text-gray-400">
					Yes! SoftoVault is designed for both individual developers and teams. You can share access to 
					specific vaults with team members, set up different access levels, and track who accessed what 
					and when.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">What happens if I lose access to my account?</h3>
				<p class="text-gray-400">
					We have a secure account recovery process in place. You can set up backup email addresses and 
					use two-factor authentication for additional security. Our support team is also available to help 
					with account recovery.
				</p>
			</div>

			<div class="bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 hover:border-red-500/50 transition-all duration-300">
				<h3 class="text-xl font-semibold text-white mb-4">Is there a free tier available?</h3>
				<p class="text-gray-400">
					Yes! We offer a generous free tier for individual developers and small projects. Check out our 
					pricing page for detailed information about our plans and features.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes gradient {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	@keyframes gradient-reverse {
		0%, 100% { background-position: 100% 50%; }
		50% { background-position: 0% 50%; }
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px) rotate(0deg);
			opacity: 0.3;
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
			opacity: 0.8;
		}
	}

	@keyframes grid-move {
		0% { transform: translate(0, 0) rotate(0deg); }
		100% { transform: translate(40px, 40px) rotate(360deg); }
	}

	@keyframes grid-move-slow {
		0% { transform: translate(0, 0) rotate(0deg) scale(1); }
		50% { transform: translate(40px, 40px) rotate(180deg) scale(1.1); }
		100% { transform: translate(80px, 80px) rotate(360deg) scale(1); }
	}

	@keyframes gradient-shift {
		0%, 100% { 
			background: linear-gradient(45deg, rgb(239 68 68 / 0.15), rgb(168 85 247 / 0.05), rgb(220 38 38 / 0.15));
		}
		33% { 
			background: linear-gradient(135deg, rgb(168 85 247 / 0.15), rgb(239 68 68 / 0.05), rgb(147 51 234 / 0.15));
		}
		66% { 
			background: linear-gradient(225deg, rgb(220 38 38 / 0.15), rgb(147 51 234 / 0.05), rgb(239 68 68 / 0.15));
		}
	}

	.animate-gradient {
		animation: gradient 6s ease infinite;
	}

	.animate-gradient-reverse {
		animation: gradient-reverse 6s ease infinite;
	}

	.animate-gradient-shift {
		animation: gradient-shift 8s ease-in-out infinite;
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
		opacity: 0;
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-grid {
		animation: grid-move 15s linear infinite;
	}

	.animate-grid-slow {
		animation: grid-move-slow 25s ease-in-out infinite;
	}

	.bg-300p {
		background-size: 300% 300%;
	}
</style>
