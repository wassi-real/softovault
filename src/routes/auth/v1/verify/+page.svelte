<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { Shield, Loader2 } from 'lucide-svelte';
</script>

<div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center p-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6">
            <Loader2 class="w-8 h-8 text-red-500 animate-spin" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-4">Verifying your email...</h1>
        <p class="text-gray-400">Please wait while we complete your email verification.</p>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style> 