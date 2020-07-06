<script>
  export let text;
  export let icon;
  export let classes;
</script>

<style>
  button {
    @apply bg-gray-100;
  }
  button:hover {
    @apply bg-gray-200;
  }
  button.green {
    @apply bg-green-100;
  }
  button.green:hover {
    @apply bg-green-200;
  }
  button.cyan {
    @apply bg-cyan-100;
  }
  button.cyan:hover {
    @apply bg-cyan-200;
  }
</style>

<button
  class="{classes} text-gray-700 hover:text-gray-800 font-bold py-2 px-4 my-2 rounded flex
  justify-center">
  <img src="./{icon}" width="25" height="25" alt="Medium Icon" />
  <span class="text-center px-4">{text}</span>
</button>
