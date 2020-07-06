
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/lib/components/button.svelte generated by Svelte v3.23.2 */

    const file = "src/lib/components/button.svelte";

    function create_fragment(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t1;
    	let button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*text*/ ctx[0]);
    			if (img.src !== (img_src_value = "./" + /*icon*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "25");
    			attr_dev(img, "height", "25");
    			attr_dev(img, "alt", "Medium Icon");
    			add_location(img, file, 45, 2, 975);
    			attr_dev(span, "class", "text-center px-4");
    			add_location(span, file, 46, 2, 1041);
    			attr_dev(button, "class", button_class_value = "" + (/*classes*/ ctx[2] + " text-gray-700 hover:text-gray-800 font-bold py-2 px-4 my-2 rounded flex\n  justify-center" + " svelte-zy9d9z"));
    			add_location(button, file, 42, 0, 855);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t0);
    			append_dev(button, span);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 2 && img.src !== (img_src_value = "./" + /*icon*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*text*/ 1) set_data_dev(t1, /*text*/ ctx[0]);

    			if (dirty & /*classes*/ 4 && button_class_value !== (button_class_value = "" + (/*classes*/ ctx[2] + " text-gray-700 hover:text-gray-800 font-bold py-2 px-4 my-2 rounded flex\n  justify-center" + " svelte-zy9d9z"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { text } = $$props;
    	let { icon } = $$props;
    	let { classes } = $$props;
    	const writable_props = ["text", "icon", "classes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, []);

    	$$self.$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("classes" in $$props) $$invalidate(2, classes = $$props.classes);
    	};

    	$$self.$capture_state = () => ({ text, icon, classes });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("classes" in $$props) $$invalidate(2, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, icon, classes];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { text: 0, icon: 1, classes: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !("text" in props)) {
    			console.warn("<Button> was created without expected prop 'text'");
    		}

    		if (/*icon*/ ctx[1] === undefined && !("icon" in props)) {
    			console.warn("<Button> was created without expected prop 'icon'");
    		}

    		if (/*classes*/ ctx[2] === undefined && !("classes" in props)) {
    			console.warn("<Button> was created without expected prop 'classes'");
    		}
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/profile/profile-card.svelte generated by Svelte v3.23.2 */
    const file$1 = "src/profile/profile-card.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let h20;
    	let t4;
    	let h21;
    	let t6;
    	let h22;
    	let b0;
    	let t8;
    	let t9;
    	let div0;
    	let button0;
    	let t10;
    	let button1;
    	let t11;
    	let button2;
    	let t12;
    	let div1;
    	let a0;
    	let b1;
    	let t14;
    	let div2;
    	let a1;
    	let b2;
    	let t16;
    	let a2;
    	let b3;
    	let t18;
    	let a3;
    	let b4;
    	let current;

    	button0 = new Button({
    			props: {
    				classes: "green",
    				text: "View on Github",
    				icon: "github.svg"
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				text: "View on Medium",
    				icon: "medium-icon.svg"
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				classes: "cyan",
    				text: "View on Linkedin",
    				icon: "linkedin.svg"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Noman Hasan";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Software Engineer";
    			t4 = space();
    			h21 = element("h2");
    			h21.textContent = "Javascript";
    			t6 = space();
    			h22 = element("h2");
    			b0 = element("b");
    			b0.textContent = "VueJS";
    			t8 = text("\n      , Angular, React and NodeJS");
    			t9 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			t11 = space();
    			create_component(button2.$$.fragment);
    			t12 = space();
    			div1 = element("div");
    			a0 = element("a");
    			b1 = element("b");
    			b1.textContent = "nomanbinhussein@gmail.com";
    			t14 = space();
    			div2 = element("div");
    			a1 = element("a");
    			b2 = element("b");
    			b2.textContent = "Live Projects";
    			t16 = space();
    			a2 = element("a");
    			b3 = element("b");
    			b3.textContent = "Experience";
    			t18 = space();
    			a3 = element("a");
    			b4 = element("b");
    			b4.textContent = "Skills";
    			if (img.src !== (img_src_value = "./propic_30kb.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "mx-auto my-3");
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "200");
    			attr_dev(img, "alt", "Noman Hasan");
    			add_location(img, file$1, 27, 4, 458);
    			attr_dev(h1, "class", "text-4xl text-gray-800 name uppercase text-center my-4 svelte-1u7b570");
    			add_location(h1, file$1, 33, 4, 589);
    			attr_dev(h20, "class", "text-lg text-gray-700 text-center n2 svelte-1u7b570");
    			add_location(h20, file$1, 36, 4, 689);
    			attr_dev(h21, "class", "text-md text-gray-600 text-center n2 svelte-1u7b570");
    			add_location(h21, file$1, 37, 4, 765);
    			add_location(b0, file$1, 39, 6, 890);
    			attr_dev(h22, "class", "text-md text-gray-700 text-center n2 svelte-1u7b570");
    			add_location(h22, file$1, 38, 4, 834);
    			attr_dev(div0, "class", "flex flex-col py-4");
    			add_location(div0, file$1, 42, 4, 951);
    			add_location(b1, file$1, 54, 8, 1391);
    			attr_dev(a0, "class", "text-gray-800 text-center");
    			attr_dev(a0, "href", "mailto:nomanbinhussein@gmail.com");
    			add_location(a0, file$1, 51, 6, 1289);
    			attr_dev(div1, "class", "flex flex-col mb-4");
    			add_location(div1, file$1, 50, 4, 1250);
    			add_location(b2, file$1, 59, 8, 1567);
    			attr_dev(a1, "class", "text-gray-500 py-2 text-center underline");
    			attr_dev(a1, "href", "#projects");
    			add_location(a1, file$1, 58, 6, 1489);
    			add_location(b3, file$1, 62, 8, 1685);
    			attr_dev(a2, "class", "text-gray-500 py-2 text-center underline");
    			attr_dev(a2, "href", "#experience");
    			add_location(a2, file$1, 61, 6, 1605);
    			add_location(b4, file$1, 65, 8, 1796);
    			attr_dev(a3, "class", "text-gray-500 py-2 text-center underline");
    			attr_dev(a3, "href", "#skills");
    			add_location(a3, file$1, 64, 6, 1720);
    			attr_dev(div2, "class", "flex flex-col mb-4");
    			add_location(div2, file$1, 57, 4, 1450);
    			attr_dev(div3, "class", "flex flex-col justify-start");
    			add_location(div3, file$1, 26, 2, 412);
    			attr_dev(div4, "class", "profile flex flex-row justify-center svelte-1u7b570");
    			add_location(div4, file$1, 25, 0, 359);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, img);
    			append_dev(div3, t0);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, h20);
    			append_dev(div3, t4);
    			append_dev(div3, h21);
    			append_dev(div3, t6);
    			append_dev(div3, h22);
    			append_dev(h22, b0);
    			append_dev(h22, t8);
    			append_dev(div3, t9);
    			append_dev(div3, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t10);
    			mount_component(button1, div0, null);
    			append_dev(div0, t11);
    			mount_component(button2, div0, null);
    			append_dev(div3, t12);
    			append_dev(div3, div1);
    			append_dev(div1, a0);
    			append_dev(a0, b1);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(a1, b2);
    			append_dev(div2, t16);
    			append_dev(div2, a2);
    			append_dev(a2, b3);
    			append_dev(div2, t18);
    			append_dev(div2, a3);
    			append_dev(a3, b4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile_card> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Profile_card", $$slots, []);
    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class Profile_card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile_card",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const experiences = [
        {
            name: "Berlin 3 Services GmbH",
            location: "Berlin",
            position: "Lead Frontend Engineer",
            from: "Oct 2018",
            to: "Present",
            development_tools: ["VueJS", "React"],
            description: "Lead Developer of the Frontend Application Project. I am responsible for developing large scale frontend app which scales in size, feature and platform. My work involves developing features, plugins/libraries to use in the app and ensuring fast, intuitive and bug free user experience.",
        },
        {
            name: "Hoxro LMS",
            location: "Dhaka",
            position: "Software Engineer",
            from: "July 2017",
            to: "Oct 2018",
            development_tools: ["Angular 4", "NodeJS"],
            description: "Leading Frontend team, creating and managing in-house plugins.",
            description_list: [
                "Utilize expertise on Javascript Stack and Typescript. Especially Angular 4.",
                "Create Frontend project Skeleton, maintaining structure and best practices across the project.",
                "Encourage functional programming with Javascript and implementing FP concept cleverly to improve overall code quality, test-ability and scalability.",
                "Assist team in learning Angular 4, Git, Advanced DOM APIs and fixing critical bugs.",
                "Develop sophisticated Typescript/Javascript libraries to be used in the project.",
                "Developing a lean lightweight and high-performing Frontend App without any third-party plugins.",
            ],
        },
        {
            name: "Unclehub LLC",
            location: "Northern Virginia",
            position: "Full Stack Developer",
            from: "March 2017",
            to: "June 2017",
            development_tools: ["ExpressJS", "Angular 4", "Nodejs", "PostgreSQL", "Heroku", "Amazon PostgreSQL"],
        },
        {
            name: "TuitionStock",
            location: "Dhaka",
            position: "Full Stack Developer",
            from: "December 2016",
            to: "February 2017",
            development_tools: ["ExpressJS", "Angular 2", "Nodejs", "MongoDB", "Amazon EC2"]
        },
    ];

    /* src/experience/experience-card.svelte generated by Svelte v3.23.2 */
    const file$2 = "src/experience/experience-card.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (35:10) {:else}
    function create_else_block(ctx) {
    	let div;
    	let t_value = ", " + /*devt*/ ctx[3] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "pr-1 font-light");
    			add_location(div, file$2, 35, 12, 1144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(35:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:10) {#if i == 0}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*devt*/ ctx[3] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "pr-1 font-semibold");
    			add_location(div, file$2, 33, 12, 1069);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(33:10) {#if i == 0}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#each expr.development_tools as devt, i}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[5] == 0) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(32:8) {#each expr.development_tools as devt, i}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if expr.description}
    function create_if_block(ctx) {
    	let div;
    	let t_value = /*expr*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "pr-1 font-light text-gray-700 mt-2");
    			add_location(div, file$2, 40, 8, 1275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:6) {#if expr.description}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#each experiences as expr (expr.name)}
    function create_each_block(key_1, ctx) {
    	let div1;
    	let h2;
    	let t0_value = /*expr*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let h30;
    	let t2_value = /*expr*/ ctx[0].location + "";
    	let t2;
    	let t3;
    	let h31;
    	let t4_value = /*expr*/ ctx[0].position + "";
    	let t4;
    	let t5;
    	let h32;
    	let t6_value = /*expr*/ ctx[0].from + "";
    	let t6;
    	let t7;
    	let t8_value = /*expr*/ ctx[0].to + "";
    	let t8;
    	let t9;
    	let div0;
    	let t10;
    	let t11;
    	let each_value_1 = /*expr*/ ctx[0].development_tools;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*expr*/ ctx[0].description && create_if_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			h30 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			h31 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			h32 = element("h3");
    			t6 = text(t6_value);
    			t7 = text(" - ");
    			t8 = text(t8_value);
    			t9 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			attr_dev(h2, "class", "text-gray-700 font-semibold");
    			add_location(h2, file$2, 24, 6, 596);
    			attr_dev(h30, "class", "text-cyan-400 font-hairline");
    			add_location(h30, file$2, 25, 6, 659);
    			attr_dev(h31, "class", "text-gray-700 ");
    			add_location(h31, file$2, 26, 6, 726);
    			attr_dev(h32, "class", "text-gray-500 font-light");
    			add_location(h32, file$2, 27, 6, 780);
    			attr_dev(div0, "class", "flex flex-row overflow-hidden");
    			set_style(div0, "max-width", "100%");
    			set_style(div0, "text-overflow", "ellipsis");
    			set_style(div0, "white-space", "nowrap");
    			add_location(div0, file$2, 28, 6, 852);
    			attr_dev(div1, "class", "p-4 shadow-sm m-1");
    			add_location(div1, file$2, 23, 4, 558);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			append_dev(div1, h30);
    			append_dev(h30, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h31);
    			append_dev(h31, t4);
    			append_dev(div1, t5);
    			append_dev(div1, h32);
    			append_dev(h32, t6);
    			append_dev(h32, t7);
    			append_dev(h32, t8);
    			append_dev(div1, t9);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t10);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*experiences*/ 0) {
    				each_value_1 = /*expr*/ ctx[0].development_tools;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*expr*/ ctx[0].description) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:2) {#each experiences as expr (expr.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = experiences;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*expr*/ ctx[0].name;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Experience";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "font-hairline text-3xl uppercase text-center text-gray-800 mb-6");
    			add_location(h2, file$2, 19, 2, 412);
    			attr_dev(div, "class", "flex flex-col py-4 mt-6 text-lg text-gray-600 experience svelte-govigi");
    			add_location(div, file$2, 18, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*experiences*/ 0) {
    				const each_value = experiences;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Experience_card> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Experience_card", $$slots, []);
    	$$self.$capture_state = () => ({ Button, experiences });
    	return [];
    }

    class Experience_card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience_card",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.23.2 */
    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let div;
    	let profile;
    	let t;
    	let experience;
    	let current;
    	profile = new Profile_card({ $$inline: true });
    	experience = new Experience_card({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(profile.$$.fragment);
    			t = space();
    			create_component(experience.$$.fragment);
    			attr_dev(div, "class", "app flex flex-col justify-start svelte-1k9tss9");
    			add_location(div, file$3, 19, 2, 533);
    			add_location(main, file$3, 18, 0, 524);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(profile, div, null);
    			append_dev(div, t);
    			mount_component(experience, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(profile);
    			destroy_component(experience);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Profile: Profile_card, Experience: Experience_card });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
