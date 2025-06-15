<script>
	import { page } from '$app/stores';
	import Button from './Button.svelte';
	import { Shield, Home, Plus, Settings, User, LogOut, Menu, X, DollarSign, Info, Github, Code } from 'lucide-svelte';
	import { auth } from '$lib/stores/auth';
	import { profiles } from '$lib/stores/data';
	import { onMount } from 'svelte';
	
	let isScrolled = $state(false);
	let isMobileMenuOpen = $state(false);
	
	// Initialize auth
	onMount(() => {
		auth.init();
		
		// Handle scroll for navbar transparency
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Load profile when user is authenticated
	$effect(() => {
		if ($auth.user && !$auth.loading) {
			profiles.load($auth.user.id);
		}
	});

	function handleLogout() {
		auth.signOut();
		profiles.clear();
		isMobileMenuOpen = false;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	// Get first letter of username or email for user avatar
	function getUserInitial(user, profile) {
		if (!user) return 'U';
		if (profile?.username) {
			return profile.username.charAt(0).toUpperCase();
		}
		if (user.user_metadata?.username) {
			return user.user_metadata.username.charAt(0).toUpperCase();
		}
		if (user.email) {
			return user.email.charAt(0).toUpperCase();
		}
		return 'U';
	}

	// Get display name for user
	function getDisplayName(user, profile) {
		if (!user) return 'User';
		if (profile?.username) {
			return profile.username;
		}
		if (user.user_metadata?.username) {
			return user.user_metadata.username;
		}
		if (user.email) {
			return user.email.split('@')[0];
		}
		return 'User';
	}
</script>

<nav class="{isScrolled ? 'border-b-2 border-gray-800 bg-black/80' : 'border-b-2 border-gray-800 bg-black/95'} backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all duration-300">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-20">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
					<img src="/src/lib/assets/SoftoVaultLogo.png" alt="SoftoVault Logo" class="w-15 h-15 group-hover:scale-110 transition-transform duration-300" />
					<span class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-300 transition-all duration-300">SoftoVault</span>
				</a>
			</div>
			
			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-2">
				{#if $auth.user}
					<a href="/dashboard" class="nav-link">
						<Home class="w-4 h-4 mr-2" />
						Dashboard
					</a>
					
					<a href="/create" class="nav-link">
						<Plus class="w-4 h-4 mr-2" />
						New Vault
					</a>
					
					<a href="/settings" class="nav-link">
						<Settings class="w-4 h-4 mr-2" />
						Settings
					</a>
					
					<!-- User Avatar -->
					<div class="flex items-center space-x-3 ml-4">
						<div class="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
							<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
								{getUserInitial($auth.user, $profiles)}
							</div>
							<span class="text-sm text-gray-300 hidden xl:block">
								{getDisplayName($auth.user, $profiles)}
							</span>
						</div>
						
						<Button variant="primary" size="md" onclick={handleLogout}>
							<LogOut class="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				{:else}
					<a href="/pricing" class="nav-link">
						<DollarSign class="w-4 h-4 mr-2" />
						Pricing
					</a>
					
					<!-- <a href="/about" class="nav-link">
						<Info class="w-4 h-4 mr-2" />
						About
					</a> -->
					
					<a href="https://github.com/wassi-real/softovault" target="_blank" rel="noopener noreferrer" class="nav-link">
						<Github class="w-4 h-4 mr-2" />
						Github
					</a>
					
					<a href="/sdk" class="nav-link">
						<Code class="w-4 h-4 mr-2" />
						SDK
					</a>
					
					{#if $page.url.pathname !== '/login'}
						<Button variant="secondary" size="md" href="/login">
							Login
						</Button>
					{/if}
					{#if $page.url.pathname !== '/register'}
						<Button variant="outline" size="md" href="/register">
							Register
						</Button>
					{/if}
				{/if}
			</div>
			
			<!-- Mobile menu button -->
			<div class="lg:hidden">
				<Button variant="ghost" size="md" onclick={toggleMobileMenu} class="p-2">
					{#if isMobileMenuOpen}
						<X class="w-6 h-6" />
					{:else}
						<Menu class="w-6 h-6" />
					{/if}
				</Button>
			</div>
		</div>
		
		<!-- Mobile Navigation Menu -->
		{#if isMobileMenuOpen}
			<div class="lg:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md">
				<div class="px-2 pt-2 pb-3 space-y-1">
					{#if $auth.user}
						<!-- User Info -->
						<div class="flex items-center space-x-3 px-3 py-3 border-b border-gray-800 mb-2">
							<div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
								{getUserInitial($auth.user, $profiles)}
							</div>
							<div>
								<div class="text-white font-medium">{getDisplayName($auth.user, $profiles)}</div>
								<div class="text-gray-400 text-sm">{$auth.user.email}</div>
							</div>
						</div>
						
						<a href="/dashboard" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Home class="w-5 h-5 mr-3" />
							Dashboard
						</a>
						
						<a href="/create" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Plus class="w-5 h-5 mr-3" />
							New Vault
						</a>
						
						<a href="/settings" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Settings class="w-5 h-5 mr-3" />
							Settings
						</a>
						
						<button class="mobile-nav-link w-full text-left text-red-400" onclick={handleLogout}>
							<LogOut class="w-5 h-5 mr-3" />
							Logout
						</button>
					{:else}
						<a href="/pricing" class="mobile-nav-link" onclick={closeMobileMenu}>
							<DollarSign class="w-5 h-5 mr-3" />
							Pricing
						</a>
						
						<!-- <a href="/about" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Info class="w-5 h-5 mr-3" />
							About
						</a> -->
						
						<a href="https://github.com/wassi-real/softovault" target="_blank" rel="noopener noreferrer" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Github class="w-5 h-5 mr-3" />
							Github
						</a>
						
						<a href="/sdk" class="mobile-nav-link" onclick={closeMobileMenu}>
							<Code class="w-5 h-5 mr-3" />
							SDK
						</a>
						
						{#if $page.url.pathname !== '/login'}
							<a href="/login" class="mobile-nav-link" onclick={closeMobileMenu}>
								Login
							</a>
						{/if}
						{#if $page.url.pathname !== '/register'}
							<a href="/register" class="mobile-nav-link" onclick={closeMobileMenu}>
								Register
							</a>
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	@reference "../../app.css";
	
	.nav-link {
		@apply relative px-4 py-2 text-base font-medium text-gray-300 rounded-lg transition-all duration-300 ease-in-out;
		@apply hover:text-white hover:bg-gray-800/50;
		@apply border-2 border-transparent hover:border-gray-600;
		@apply transform hover:scale-105 active:scale-95;
		@apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900;
		@apply flex items-center;
	}
	
	.nav-link::before {
		content: '';
		@apply absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/0 to-red-500/0;
		@apply transition-all duration-300 ease-in-out;
		z-index: -1;
	}
	
	.nav-link:hover::before {
		@apply from-red-500/10 to-red-600/10;
	}
	
	.mobile-nav-link {
		@apply flex items-center px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-700;
	}
	
	.mobile-nav-link:hover {
		@apply shadow-lg shadow-red-500/10;
	}
</style>
