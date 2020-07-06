<script>
  import Experience from "./experience/experience-card.svelte";
  import Projects from "./projects/projects.svelte";
  import Skills from "./skills/skills.svelte";
</script>

<style>
  .tabs {
    scroll-behavior: smooth;
  }
</style>

<div class="flex flex-col tabs lg:overflow-y-auto h-full w-full">
  <h2
    class="font-hairline text-3xl uppercase text-center text-gray-800 my-3"
    id="projects">
    Projects
  </h2>
  <Projects />
  <!-- <Skills /> -->
  <h2
    class="font-hairline text-3xl uppercase text-center text-gray-800 my-3"
    id="experience">
    Experience
  </h2>
  <Experience />
  <h2
    class="font-hairline text-3xl uppercase text-center text-gray-800 my-3"
    id="skills">
    Skills
  </h2>
  <Skills />
</div>
