<script>
	import Button from '$lib/components/Button.svelte';
	import { Check, X, Star, Shield, Zap, Crown } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const plans = [
		{
			id: 'free',
			name: 'Free',
			price: '$0',
			period: 'forever',
			description: 'Perfect for personal use and small projects',
			icon: Shield,
			features: [
				{ name: 'Up to 1 vault', included: true },
				{ name: 'Up to 5 secrets', included: true },
				{ name: 'Basic encryption (AES-256)', included: true },
				// { name: 'Time-based expiration', included: true },
				// { name: 'Burn after read', included: true },
				{ name: 'Web interface', included: true },
				{ name: 'API access', included: true },
				// { name: 'Team collaboration', included: false },
				// { name: 'Advanced analytics', included: false },
				{ name: 'Email support', included: false }
			],
			popular: false,
			buttonText: 'Get Started',
			buttonVariant: 'outline'
		},
		{
			id: 'pro',
			name: 'Pro',
			price: '$8',
			period: 'per month',
			description: 'For professionals and growing teams',
			icon: Zap,
			features: [
				{ name: 'Up to 5 vaults', included: true },
				{ name: 'Up to 10 secrets per vault', included: true },
				{ name: 'Advanced encryption (AES-256-GCM)', included: true },
				// { name: 'Time-based expiration', included: true },
				// { name: 'Burn after read', included: true },
				{ name: 'Web interface', included: true },
				{ name: 'Full API access', included: true },
				{ name: 'Team collaboration', included: true },
				{ name: 'Basic analytics', included: true },
				{ name: 'Email support', included: true }
			],
			popular: true,
			buttonText: 'Coming Soon',
			buttonVariant: 'primary'
		},
		{
			id: 'enterprise',
			name: 'Enterprise',
			price: 'Coming Soon',
			period: 'per month',
			description: 'For large teams and organizations',
			icon: Crown,
			features: [
				{ name: 'Unlimited vaults', included: true },
				{ name: 'Unlimited secrets', included: true },
				{ name: 'Enterprise-grade encryption', included: true },
				// { name: 'Advanced expiration policies', included: true },
				// { name: 'Burn after read', included: true },
				{ name: 'Web interface', included: true },
				{ name: 'Full API access', included: true },
				{ name: 'Unlimited team members', included: true },
				{ name: 'Advanced analytics & reporting', included: true },
				{ name: 'Priority support & SLA', included: true },
				{ name: 'Custom integrations', included: true },
				{ name: 'Self Hosting', included: true }
			],
			popular: false,
			buttonText: 'Coming Soon',
			buttonVariant: 'secondary'
		}
	];

	function handlePlanSelect(planId) {
		if (planId === 'free') {
			goto('/register');
		} else if (planId === 'enterprise') {
			// Open contact form or email
			window.location.href = 'mailto:sales@softovault.com?subject=Enterprise Plan Inquiry';
		} else {
			// Redirect to payment/subscription page
			goto('/register?plan=' + planId);
		}
	}
</script>

<svelte:head>
	<title>Pricing - SoftoVault</title>
	<meta name="description" content="Choose the perfect SoftoVault plan for your needs. From free personal use to enterprise solutions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				Simple, Transparent Pricing
			</h1>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto">
				Choose the perfect plan for your security needs. Start free and scale as you grow.
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
			{#each plans as plan}
				<div class="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-red-500/50 {plan.popular ? 'ring-2 ring-red-500 scale-105' : ''}">
					{#if plan.popular}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<div class="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
								<Star class="w-4 h-4 mr-1" />
								Most Popular
							</div>
						</div>
					{/if}

					<!-- Plan Header -->
					<div class="text-center mb-8">
						<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
							<svelte:component this={plan.icon} class="w-8 h-8 text-white" />
						</div>
						<h3 class="text-2xl font-bold text-white mb-2">{plan.name}</h3>
						<p class="text-gray-400 mb-4">{plan.description}</p>
						<div class="mb-6">
							<span class="text-4xl font-bold text-white">{plan.price}</span>
							<span class="text-gray-400 ml-2">/{plan.period}</span>
						</div>
					</div>

					<!-- Features List -->
					<ul class="space-y-4 mb-8">
						{#each plan.features as feature}
							<li class="flex items-center">
								{#if feature.included}
									<Check class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
								{:else}
									<X class="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
								{/if}
								<span class="{feature.included ? 'text-gray-300' : 'text-gray-500'}">
									{feature.name}
								</span>
							</li>
						{/each}
					</ul>

					<!-- CTA Button -->
					<Button 
						variant={plan.buttonVariant} 
						size="lg" 
						class="w-full"
						onclick={() => handlePlanSelect(plan.id)}
					>
						{plan.buttonText}
					</Button>
				</div>
			{/each}
		</div>

		<!-- FAQ Section -->
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
					<h3 class="text-xl font-semibold text-white mb-3">Can I change plans anytime?</h3>
					<p class="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
				</div>
				
				<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
					<h3 class="text-xl font-semibold text-white mb-3">Is my data secure?</h3>
					<p class="text-gray-400">Absolutely. We use industry-standard AES-256 encryption and follow best security practices. Your data is encrypted both in transit and at rest.</p>
				</div>
				
				<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
					<h3 class="text-xl font-semibold text-white mb-3">Do you offer refunds?</h3>
					<p class="text-gray-400">We do not offer a refund. If you're not satisfied, contact us for support.</p>
				</div>
				
				<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
					<h3 class="text-xl font-semibold text-white mb-3">What payment methods do you accept?</h3>
					<p class="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely through Lemon Squeezy.</p>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		<div class="text-center mt-20">
			<h2 class="text-3xl font-bold text-white mb-6">Ready to secure your secrets?</h2>
			<p class="text-xl text-gray-400 mb-8">Join thousands of developers and teams who trust SoftoVault with their sensitive data.</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button variant="primary" size="lg" onclick={() => goto('/register')}>
					Start Free Trial
				</Button>
				<Button variant="outline" size="lg" onclick={() => goto('/about')}>
					Learn More
				</Button>
			</div>
		</div>
	</div>
</div>