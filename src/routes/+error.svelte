<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Button from '$lib/components/Button.svelte';
    import { Home, ArrowLeft } from 'lucide-svelte';

    // Get the error status and message
    const status = $page.status;
    const message = $page.error?.message || 'Page not found';
</script>

<div class="min-h-screen bg-black flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
        <!-- Error Code -->
        <div class="mb-8">
            <h1 class="text-9xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                {status}
            </h1>
        </div>

        <!-- Error Message -->
        <h2 class="text-2xl font-semibold text-white mb-4">
            {status === 404 ? 'Page Not Found' : 'Something went wrong'}
        </h2>
        <p class="text-gray-400 mb-8">
            {status === 404 
                ? "The page you're looking for doesn't exist or has been moved."
                : message}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                variant="primary" 
                size="lg"
                onclick={() => goto('/')}
            >
                <Home class="w-5 h-5 mr-2" />
                Go Home
            </Button>
            <Button 
                variant="outline" 
                size="lg"
                onclick={() => window.history.back()}
            >
                <ArrowLeft class="w-5 h-5 mr-2" />
                Go Back
            </Button>
        </div>

        <!-- Decorative Elements -->
        <div class="mt-12 relative">
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
            </div>
            <div class="relative">
                <div class="text-gray-500 text-sm">
                    Error Code: {status}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style> 