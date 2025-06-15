<script lang="ts">
	import { onMount } from 'svelte';
	import type { EmailDisplay } from '$lib/types.js';
	import type { PageData } from './$types.js';
    
    let { data }: PageData = $props();

    console.log(data.user);

	let emails: EmailDisplay[] = $state([]);
	let loading: boolean = $state(true);
	let error: string | null = $state(null);

	onMount(async () => {
    if (!data.user) {
      error = 'User not authenticated';
      loading = false;
      return;
    }
    
    try {
      const response = await fetch('/api/emails');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      emails = result.emails || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to fetch emails';
      console.error('Email fetch error:', err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-6 max-w-4xl mx-auto">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">SUP Email</h1>
    {#if data.user}
      <p class="text-gray-600">Welcome, {data.user.email}</p>
    {:else}
      <p class="text-red-600">Not authenticated</p>
    {/if}
  </div>
  
  {#if loading}
    <p>Loading emails...</p>
  {:else if error}
    <p class="text-red-600">Error: {error}</p>
  {:else}
    <!-- your email display code -->
    <div class="space-y-3">
      {#each emails as email}
        <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-lg">{email.subject}</h3>
            <span class="text-sm text-gray-500">{email.date}</span>
          </div>
          <p class="text-gray-600 mb-2">{email.sender}</p>
          <p class="text-gray-700 text-sm">{email.snippet}</p>
          {#if !email.isRead}
            <span class="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-2">Unread</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>