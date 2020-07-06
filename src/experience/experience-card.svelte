<script>
  import Button from "../lib/components/button.svelte";
  import { experiences } from "./experienceData.js";
</script>

<style>
  .experience {
    max-width: var(--tabs-width);
  }
  @media screen and (min-width: 412px) {
    .experience {
      /* width: 412px; */
    }
  }
</style>

<div class="flex flex-col py-4 mt-6 text-lg text-gray-600 experience w-full">
  {#each experiences as expr (expr.name)}
    <div class="p-4 px-5 shadow-sm my-1 rounded-lg">
      <h2 class="text-gray-700 font-semibold">{expr.name}</h2>
      <h3 class="text-cyan-400 font-hairline">{expr.location}</h3>
      <h3 class="text-gray-700 ">{expr.position}</h3>
      <h3 class="text-gray-500 font-light">{expr.from} - {expr.to}</h3>
      <div
        class="flex flex-row overflow-hidden"
        style=" max-width: 100%; text-overflow: ellipsis; white-space: nowrap;">
        {#each expr.development_tools as devt, i}
          {#if i == 0}
            <div class="pr-1 font-semibold">{devt}</div>
          {:else}
            <div class="pr-1 font-light">{', ' + devt}</div>
          {/if}
        {/each}
      </div>
      {#if expr.description}
        <div class="pr-1 font-light text-gray-700 mt-2">{expr.description}</div>
      {/if}
    </div>
  {/each}
</div>
