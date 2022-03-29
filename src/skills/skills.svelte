<script>
  import Button from "../lib/components/button.svelte";

  import { skills } from "./skills.js";

  console.log(skills);
</script>

<style>
  .skills {
    max-width: var(--tabs-width);
  }
</style>

<div class="flex flex-col py-4 mt-6 text-gray-600 skills w-full mb-6">
  <div class="p-4">
    <div class="text-2xl text-gray-700 font-bold">Proficient</div>
    <div class="py-4">
      <div class=" py-2">Language</div>
      <div class="flex flex-row flex-wrap">
        {#each skills.proficient.languages as language, i}
          <div
            class="m-1 p-2 rounded-md bg-gray-100 cursor-pointer"
            style="color: hsl(0, 0%, {i * 7}%); font-weight: {900 - i * 50}; ">
            {language}
          </div>
        {/each}
      </div>
    </div>
    <div class="py-4">
      <div class="py-2">Technologies</div>
      <div class="flex flex-row flex-wrap">
        {#each skills.proficient.technologies as language, i}
          <div
            class="m-1 p-2 rounded-md bg-gray-100 cursor-pointer"
            style="color: hsl(0, 0%, {i * 7}%); font-weight: {900 - i * 70};">
            {language}
          </div>
        {/each}
      </div>
    </div>
    <div class="py-4">
      <div class=" py-2">Databases</div>
      <div class="flex flex-row flex-wrap">
        {#each skills.proficient.databases as language, i}
          <div
            class="m-1 p-2 rounded-md bg-gray-100 cursor-pointer"
            style="color: hsl(0, 0%, {i * 7}%); font-weight: {900 - i * 70};">
            {language}
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="p-4">
    <div class="text-2xl text-gray-700 font-bold">Familiar</div>
    <div class="py-4">
      <div class=" py-2">Language</div>
      <div class="flex flex-row flex-wrap">
        {#each skills.familiar.languages as language, i}
          <div
            class="m-1 p-2 rounded-md bg-gray-100 cursor-pointer"
            style="color: hsl(0, 0%, {skills.proficient.languages.length + i * 7}%);
            font-weight: {900 - (skills.proficient.languages.length + i) * 50};">
            {language}
          </div>
        {/each}
      </div>
    </div>
    <div class="py-4">
      <div class=" py-2">Technologies</div>
      <div class="flex flex-row flex-wrap">
        {#each skills.familiar.technologies as language, i}
          <div
            class="m-1 p-2 rounded-md bg-gray-100 cursor-pointer"
            style="color: hsl(0, 0%, {(skills.proficient.technologies.length + i) * 7}%);
            font-weight: {900 - (skills.proficient.technologies.length + i) * 70};">
            {language}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
