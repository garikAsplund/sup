<!-- src/routes/+page.svelte -->
<script>
  function loginWithGmail() {
    window.location.href = '/api/auth/gmail';
  }
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-8">SUP Email</h1>
    <button 
      onclick={loginWithGmail}
      class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
    >
      Connect Gmail
    </button>
  </div>
</div>