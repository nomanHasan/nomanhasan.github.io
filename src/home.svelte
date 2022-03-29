<script>
  import { Router, Link, Route } from "svelte-routing";
  import Profile from "./profile/profile-card.svelte";
  import Tailwindcss from "./Tailwindcss.svelte";

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
  .home {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    width: calc(100vw);
    height: 100%;
    scroll-behavior: smooth;
    overflow: hidden;
  }

  @media (min-width: 1280px) {
    .home {
      flex-direction: row;
      height: calc(100vh - 10px);
    }
  }

  :global(.home) {
    --tab-width-max: 3200px;
    --lb-width-max: 1920px;

    --lb-width: 20%;
    --tabs-width: 100%;
  }
</style>

<div class="home flex flex-col justify-start py-2">
  <Profile />
  {#if OtherTabs}
    <svelte:component this={OtherTabs} />
  {/if}
</div>
