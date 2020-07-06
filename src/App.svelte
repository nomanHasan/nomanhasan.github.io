<script>
  import Profile from "./profile/profile-card.svelte";
  import Tailwindcss from './Tailwindcss.svelte';

  // import OtherTabs from "./OtherTabs/OtherTabs-card.svelte";

  let OtherTabs;
  import("./other-tabs.svelte")
    .then(module => module.default)
    .then(component => {
      OtherTabs = component;
    })
    .catch(err => console.error(err));
</script>

<style>
  .app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    width: calc(100vw);
    height: 100%;
    scroll-behavior: smooth;
    overflow: hidden;
  }

  @media (min-width: 1280px) {
    .app {
      flex-direction: row;
      height: calc(100vh - 10px);
    }
  }

  :global(.app) {
    --tab-width-max: 3200px;
    --lb-width-max: 1920px;

    --lb-width: 20%;
    --tabs-width: 100%;
  }
</style>

<div class="app flex flex-col justify-start py-2">
  <Profile />
  <!-- <OtherTabs /> -->
  {#if OtherTabs}
    <svelte:component this={OtherTabs} />
  {/if}
</div>
