<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { Shield, Loader2, CheckCircle, XCircle } from 'lucide-svelte';
    
    let status = $state('verifying'); // 'verifying', 'success', 'error'
    let message = $state('Please wait while we complete your email verification.');
    
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            status = 'error';
            message = error;
            setTimeout(() => {
                goto('/login');
            }, 3000);
        } else {
            // The server will handle the actual verification and redirect
            // This page is just for showing the verification process
            setTimeout(() => {
                // If we're still here after 10 seconds, something might be wrong
                if (status === 'verifying') {
                    status = 'error';
                    message = 'Verification is taking longer than expected. Please try again.';
                    setTimeout(() => {
                        goto('/login');
                    }, 3000);
                }
            }, 10000);
        }
    });
</script>

<div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center p-8 max-w-md">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6">
            {#if status === 'verifying'}
                <Loader2 class="w-8 h-8 text-blue-400 animate-spin" />
            {:else if status === 'success'}
                <CheckCircle class="w-8 h-8 text-green-400" />
            {:else if status === 'error'}
                <XCircle class="w-8 h-8 text-red-400" />
            {/if}
        </div>
        
        {#if status === 'verifying'}
            <h1 class="text-2xl font-bold text-white mb-4">Verifying your email...</h1>
        {:else if status === 'success'}
            <h1 class="text-2xl font-bold text-green-400 mb-4">Email Verified!</h1>
        {:else if status === 'error'}
            <h1 class="text-2xl font-bold text-red-400 mb-4">Verification Failed</h1>
        {/if}
        
        <p class="text-gray-400 mb-6">{message}</p>
        
        {#if status === 'error'}
            <p class="text-sm text-gray-500">You will be redirected to the login page shortly.</p>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>