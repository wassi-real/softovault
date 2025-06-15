<script>
	import { FileText, Shield, AlertTriangle, Users, CreditCard, Gavel } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Terms of Service - SoftoVault</title>
	<meta name="description" content="SoftoVault's terms of service. Understand your rights and responsibilities when using our platform." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				Terms of Service
			</h1>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto">
				These terms govern your use of SoftoVault. Please read them carefully.
			</p>
			<p class="text-sm text-gray-500 mt-4">
				Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
			</p>
		</div>

		<!-- Key Points -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<Shield class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">Your Data Rights</h3>
				<p class="text-gray-400 text-sm">You own your data and control access</p>
			</div>
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<Users class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">Fair Use</h3>
				<p class="text-gray-400 text-sm">Use our service responsibly and legally</p>
			</div>
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<CreditCard class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">Clear Billing</h3>
				<p class="text-gray-400 text-sm">Transparent pricing with no hidden fees</p>
			</div>
		</div>

		<!-- Terms Content -->
		<div class="prose prose-invert max-w-none">
			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<FileText class="w-6 h-6 mr-3 text-red-500" />
					Acceptance of Terms
				</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						By accessing or using SoftoVault ("the Service"), you agree to be bound by these Terms of Service 
						("Terms"). If you disagree with any part of these terms, you may not access the Service.
					</p>
					<p class="text-gray-400">
						These Terms apply to all visitors, users, and others who access or use the Service.
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Users class="w-6 h-6 mr-3 text-red-500" />
					User Accounts
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Account Creation</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>You must provide accurate and complete information when creating an account</li>
						<li>You are responsible for maintaining the security of your account credentials</li>
						<li>You must be at least 18 years old to create an account</li>
						<li>One person or legal entity may maintain only one free account</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Account Responsibilities</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>You are responsible for all activities that occur under your account</li>
						<li>Notify us immediately of any unauthorized use of your account</li>
						<li>Keep your contact information up to date</li>
						<li>Do not share your account credentials with others</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Shield class="w-6 h-6 mr-3 text-red-500" />
					Acceptable Use
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Permitted Uses</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Store and manage sensitive information securely</li>
						<li>Use our API for legitimate business purposes</li>
						<li>Share secrets with authorized team members</li>
						<li>Integrate with your applications and workflows</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Prohibited Uses</h3>
					<p class="text-gray-400 mb-2">You may not use the Service to:</p>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Store illegal content or facilitate illegal activities</li>
						<li>Violate any laws or regulations</li>
						<li>Infringe on intellectual property rights</li>
						<li>Transmit malware, viruses, or harmful code</li>
						<li>Attempt to gain unauthorized access to our systems</li>
						<li>Reverse engineer or attempt to extract source code</li>
						<li>Use the service for cryptocurrency mining</li>
						<li>Resell or redistribute the service without permission</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<CreditCard class="w-6 h-6 mr-3 text-red-500" />
					Billing and Payments
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Subscription Plans</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Free plans are subject to usage limits and feature restrictions</li>
						<li>Paid plans are billed monthly or annually in advance</li>
						<li>All fees are non-refundable except as required by law</li>
						<li>We offer a 30-day money-back guarantee for new paid subscriptions</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Payment Terms</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Payment is due immediately upon subscription</li>
						<li>Failed payments may result in service suspension</li>
						<li>You authorize us to charge your payment method automatically</li>
						<li>Price changes will be communicated 30 days in advance</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Cancellation</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>You may cancel your subscription at any time</li>
						<li>Cancellation takes effect at the end of your current billing period</li>
						<li>No refunds for partial months or unused features</li>
						<li>Your data remains accessible during the current billing period</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<AlertTriangle class="w-6 h-6 mr-3 text-red-500" />
					Service Availability
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Uptime and Reliability</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
						<li>Scheduled maintenance will be announced in advance when possible</li>
						<li>We are not liable for downtime due to circumstances beyond our control</li>
						<li>Service credits may be available for extended outages per our SLA</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Service Modifications</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>We may modify or discontinue features with reasonable notice</li>
						<li>Major changes will be communicated 30 days in advance</li>
						<li>We will provide migration tools for discontinued features when possible</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4">Data and Privacy</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Your Data Rights</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>You retain ownership of all data you store in SoftoVault</li>
						<li>You can export your data at any time</li>
						<li>You can delete your account and data at any time</li>
						<li>We use zero-knowledge encryption - we cannot access your unencrypted data</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Data Processing</h3>
					<p class="text-gray-400">
						Our data processing practices are detailed in our 
						<a href="/privacy-policy" class="text-red-400 hover:text-red-300 underline">Privacy Policy</a>. 
						By using the Service, you consent to the data practices described therein.
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Gavel class="w-6 h-6 mr-3 text-red-500" />
					Limitation of Liability
				</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						To the maximum extent permitted by law, SoftoVault shall not be liable for any 
						indirect, incidental, special, consequential, or punitive damages, including but 
						not limited to loss of profits, data, use, goodwill, or other intangible losses.
					</p>
					<p class="text-gray-400">
						Our total liability for any claim arising out of or relating to these Terms or 
						the Service shall not exceed the amount you paid us in the 12 months preceding 
						the claim.
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4">Termination</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Termination by You</h3>
					<p class="text-gray-400">
						You may terminate your account at any time by following the instructions in 
						your account settings. Upon termination, your access to the Service will cease 
						immediately.
					</p>

					<h3 class="text-lg font-semibold text-white mt-6">Termination by Us</h3>
					<p class="text-gray-400">
						We may terminate or suspend your account immediately if you violate these Terms 
						or engage in prohibited activities. We will provide notice when possible.
					</p>

					<h3 class="text-lg font-semibold text-white mt-6">Effect of Termination</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>All rights and licenses granted to you will cease</li>
						<li>You will lose access to your data after 30 days</li>
						<li>We will delete your data according to our retention policy</li>
						<li>Provisions that should survive termination will remain in effect</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
				<h2 class="text-2xl font-bold text-white mb-4">Contact Information</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						If you have any questions about these Terms of Service, please contact us:
					</p>
					<div class="space-y-2 text-gray-400">
						<p><strong>Email:</strong> legal@softovault.com</p>
						<p><strong>Address:</strong> SoftoVault Inc., 123 Security Street, Privacy City, PC 12345</p>
						<p><strong>Support:</strong> support@softovault.com</p>
					</div>
					<p class="text-gray-400 mt-4">
						These Terms of Service are effective as of the date listed above and will remain 
						in effect except with respect to any changes in their provisions in the future, 
						which will be in effect immediately after being posted on this page.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>