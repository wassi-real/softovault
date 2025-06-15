<script>
	import { Shield, Lock, Eye, Database, Globe, Users } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Privacy Policy - SoftoVault</title>
	<meta name="description" content="SoftoVault's privacy policy. Learn how we protect your data and respect your privacy." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
				Privacy Policy
			</h1>
			<p class="text-xl text-gray-400 max-w-3xl mx-auto">
				Your privacy is our priority. This policy explains how we collect, use, and protect your information.
			</p>
			<p class="text-sm text-gray-500 mt-4">
				Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
			</p>
		</div>

		<!-- Privacy Principles -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<Shield class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">Zero Knowledge</h3>
				<p class="text-gray-400 text-sm">We never see your unencrypted data</p>
			</div>
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<Lock class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">End-to-End Encryption</h3>
				<p class="text-gray-400 text-sm">Your data is encrypted before leaving your device</p>
			</div>
			<div class="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
				<Eye class="w-12 h-12 text-red-500 mx-auto mb-4" />
				<h3 class="text-lg font-semibold text-white mb-2">Transparency</h3>
				<p class="text-gray-400 text-sm">Clear policies with no hidden practices</p>
			</div>
		</div>

		<!-- Policy Content -->
		<div class="prose prose-invert max-w-none">
			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Database class="w-6 h-6 mr-3 text-red-500" />
					Information We Collect
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Account Information</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Email address (for account creation and authentication)</li>
						<li>Username (optional, for personalization)</li>
						<li>Password (hashed and salted, never stored in plain text)</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Usage Data</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>API usage statistics (for billing and rate limiting)</li>
						<li>Error logs (for debugging and service improvement)</li>
						<li>Access timestamps (for security monitoring)</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Encrypted Data</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Your secrets and vault contents (encrypted client-side)</li>
						<li>Vault metadata (titles, descriptions - also encrypted)</li>
						<li>Access policies and expiration settings</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Lock class="w-6 h-6 mr-3 text-red-500" />
					How We Protect Your Data
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Encryption</h3>
					<p class="text-gray-400">
						All sensitive data is encrypted using AES-256-GCM encryption before it leaves your device. 
						We use a zero-knowledge architecture, meaning we cannot decrypt your data even if we wanted to.
					</p>

					<h3 class="text-lg font-semibold text-white mt-6">Infrastructure Security</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>SOC 2 Type II certified infrastructure</li>
						<li>Regular security audits and penetration testing</li>
						<li>Multi-factor authentication for all team access</li>
						<li>Encrypted data transmission (TLS 1.3)</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Access Controls</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Role-based access control (RBAC)</li>
						<li>Principle of least privilege</li>
						<li>Regular access reviews and audits</li>
						<li>Automated threat detection and response</li>
					</ul>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Users class="w-6 h-6 mr-3 text-red-500" />
					How We Use Your Information
				</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						We use your information solely to provide and improve our services:
					</p>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Account management and authentication</li>
						<li>Service delivery and API access</li>
						<li>Billing and subscription management</li>
						<li>Customer support and troubleshooting</li>
						<li>Security monitoring and fraud prevention</li>
						<li>Service improvement and feature development</li>
					</ul>
					<p class="text-gray-400 mt-4">
						<strong>We never:</strong> Sell your data, use it for advertising, or share it with third parties 
						except as required by law or with your explicit consent.
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
					<Globe class="w-6 h-6 mr-3 text-red-500" />
					Data Retention and Deletion
				</h2>
				<div class="text-gray-300 space-y-4">
					<h3 class="text-lg font-semibold text-white">Retention Periods</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li>Account data: Retained while your account is active</li>
						<li>Encrypted secrets: Retained according to your expiration settings</li>
						<li>Usage logs: Retained for 90 days for security purposes</li>
						<li>Billing records: Retained for 7 years as required by law</li>
					</ul>

					<h3 class="text-lg font-semibold text-white mt-6">Data Deletion</h3>
					<p class="text-gray-400">
						You can delete your account and all associated data at any time through your 
						account settings. Upon deletion, all your encrypted data is permanently removed 
						from our systems within 30 days.
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-white mb-4">Your Rights</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						Under GDPR and other privacy laws, you have the following rights:
					</p>
					<ul class="list-disc list-inside space-y-2 text-gray-400">
						<li><strong>Access:</strong> Request a copy of your personal data</li>
						<li><strong>Rectification:</strong> Correct inaccurate personal data</li>
						<li><strong>Erasure:</strong> Request deletion of your personal data</li>
						<li><strong>Portability:</strong> Export your data in a machine-readable format</li>
						<li><strong>Restriction:</strong> Limit how we process your data</li>
						<li><strong>Objection:</strong> Object to certain types of processing</li>
					</ul>
					<p class="text-gray-400 mt-4">
						To exercise these rights, contact us at privacy@softovault.com
					</p>
				</div>
			</div>

			<div class="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
				<h2 class="text-2xl font-bold text-white mb-4">Contact Us</h2>
				<div class="text-gray-300 space-y-4">
					<p class="text-gray-400">
						If you have any questions about this privacy policy or our data practices, 
						please contact us:
					</p>
					<div class="space-y-2 text-gray-400">
						<p><strong>Email:</strong> privacy@softovault.com</p>
						<p><strong>Address:</strong> SoftoVault Inc., 123 Security Street, Privacy City, PC 12345</p>
						<p><strong>Data Protection Officer:</strong> dpo@softovault.com</p>
					</div>
					<p class="text-gray-400 mt-4">
						We will respond to your inquiry within 30 days.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>