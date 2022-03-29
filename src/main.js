
import { routes } from "svelte-hash-router";

import Home from "./home.svelte";
import Resume from "./resume.svelte";

import App from './App.svelte';

routes.set({
	'/': Home,
	'/resume': Resume
})

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;