<script>
  import Profile from "./profile/profile-card.svelte";
  import Tailwindcss from "./Tailwindcss.svelte";

  // import OtherTabs from "./other-tabs.svelte";

  let OtherTabs;
  import("./other-tabs.svelte")
    .then(module => module.default)
    .then(component => {
      OtherTabs = component;
    })
    .catch(err => console.error(err));
</script>

<style>
  .resume-container {
    padding-top: 2cm;
  }
  .resume-container .resume {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    scroll-behavior: smooth;
    overflow: hidden;

    width: 21cm;
    height: 29.7cm;
  }

  @media (min-width: 1280px) {
    .resume {
      flex-direction: row;
    }
  }

  .tabs {
    overflow: visible;
  }

  :global(.resume) {
    --tab-width-max: 3200px;
    --lb-width-max: 1920px;

    --lb-width: 20%;
    --tabs-width: 100%;
  }
</style>

<div class="resume-container bg-gray-200">
  <div class="resume bg-white flex flex-col justify-start py-2 mx-auto">
    {#if OtherTabs}
      <svelte:component this={OtherTabs} />
    {/if}
  </div>
</div>
