<script>
  import Button from "../lib/components/button.svelte";
  import { projects } from "./projects.js";
</script>

<style>
  .projects {
    flex-wrap: wrap;
    justify-content: center;
    max-width: var(--tabs-width);
  }
  .projects > .project {
    /* max-width: 350px; */
  }
  @media screen and (min-width: 412px) {
    .project {
      /* width: 412px; */
    }
  }
</style>

<div class="flex flex-row py-4 mt-6 text-lg text-gray-600 projects w-full">
  {#each projects as proj (proj.title)}
    <div class="max-w-100 p-4 px-5 shadow-sm project rounded-lg ">
      <h2 class="py-1 text-gray-700 font-semibold">{proj.title}</h2>
      <h3 class="py-1 text-gray-600 font-light">{proj.description}</h3>
      <h3 class="py-1 text-gray-700 ">{proj.dev_tools}</h3>
      <h3 class="py-1 text-gray-500 font-light text-sm hover:underline">
        <a href={proj.github_repo}>{proj.github_repo}</a>
      </h3>
    </div>
  {/each}
</div>
