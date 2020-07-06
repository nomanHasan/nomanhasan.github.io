<script>
  import Button from "../lib/components/button.svelte";
</script>

<style>
  .profile {
    min-height: 100%;
    min-width: 360px;
  }
  .propic {
    height: 200px;
    width: 200px;
    background-image: url("/propic_30kb.webp");
    background-size: 200px 200px;
  }
  .name {
    font-weight: 100;
    text-transform: uppercase;
  }
  .n2 {
    padding: 2px 0px;
  }
</style>

<div class="profile flex flex-row justify-center">
  <div class="innerdiv flex flex-col justify-start">
    <img
      src="./propic_30kb.webp"
      class="mx-auto my-3"
      width="200"
      height="200"
      alt="Noman Hasan" />
    <h1 class="text-4xl text-gray-800 name uppercase text-center my-4">
      Noman Hasan
    </h1>
    <h2 class="text-lg text-gray-700 text-center n2">Software Engineer</h2>
    <h2 class="text-md text-gray-600 text-center n2">Javascript</h2>
    <h2 class="text-md text-gray-700 text-center n2">
      <b>VueJS</b>
      , Angular, React and NodeJS
    </h2>
    <div class="flex flex-col py-4">
      <Button classes={'green'} text={'View on Github'} icon={'github.svg'} />
      <Button text={'View on Medium'} icon={'medium-icon.svg'} />
      <Button
        classes={'cyan'}
        text={'View on Linkedin'}
        icon={'linkedin.svg'} />
    </div>
    <div class="flex flex-col mb-4">
      <a
        class="text-gray-800 text-center"
        href="mailto:nomanbinhussein@gmail.com">
        <b>nomanbinhussein@gmail.com</b>
      </a>
    </div>
    <div class="flex flex-col mb-4">
      <a class="text-gray-500 py-2 text-center underline" href="#projects">
        <b>Projects</b>
      </a>
      <a class="text-gray-500 py-2 text-center underline" href="#experience">
        <b>Experience</b>
      </a>
      <a class="text-gray-500 py-2 text-center underline" href="#skills">
        <b>Skills</b>
      </a>
    </div>
  </div>
</div>
