
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
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

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

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
			b2.textContent = "Projects";
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
			add_location(img, file$1, 27, 4, 466);
			attr_dev(h1, "class", "text-4xl text-gray-800 name uppercase text-center my-4 svelte-7ztvp1");
			add_location(h1, file$1, 33, 4, 597);
			attr_dev(h20, "class", "text-lg text-gray-700 text-center n2 svelte-7ztvp1");
			add_location(h20, file$1, 36, 4, 697);
			attr_dev(h21, "class", "text-md text-gray-600 text-center n2 svelte-7ztvp1");
			add_location(h21, file$1, 37, 4, 773);
			add_location(b0, file$1, 39, 6, 898);
			attr_dev(h22, "class", "text-md text-gray-700 text-center n2 svelte-7ztvp1");
			add_location(h22, file$1, 38, 4, 842);
			attr_dev(div0, "class", "flex flex-col py-4");
			add_location(div0, file$1, 42, 4, 959);
			add_location(b1, file$1, 54, 8, 1399);
			attr_dev(a0, "class", "text-gray-800 text-center");
			attr_dev(a0, "href", "mailto:nomanbinhussein@gmail.com");
			add_location(a0, file$1, 51, 6, 1297);
			attr_dev(div1, "class", "flex flex-col mb-4");
			add_location(div1, file$1, 50, 4, 1258);
			add_location(b2, file$1, 59, 8, 1575);
			attr_dev(a1, "class", "text-gray-500 py-2 text-center underline");
			attr_dev(a1, "href", "#projects");
			add_location(a1, file$1, 58, 6, 1497);
			add_location(b3, file$1, 62, 8, 1688);
			attr_dev(a2, "class", "text-gray-500 py-2 text-center underline");
			attr_dev(a2, "href", "#experience");
			add_location(a2, file$1, 61, 6, 1608);
			add_location(b4, file$1, 65, 8, 1799);
			attr_dev(a3, "class", "text-gray-500 py-2 text-center underline");
			attr_dev(a3, "href", "#skills");
			add_location(a3, file$1, 64, 6, 1723);
			attr_dev(div2, "class", "flex flex-col mb-4");
			add_location(div2, file$1, 57, 4, 1458);
			attr_dev(div3, "class", "innerdiv flex flex-col justify-start");
			add_location(div3, file$1, 26, 2, 411);
			attr_dev(div4, "class", "profile flex flex-row justify-center svelte-7ztvp1");
			add_location(div4, file$1, 25, 0, 358);
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

/* src/App.svelte generated by Svelte v3.23.2 */

const { console: console_1 } = globals;
const file$2 = "src/App.svelte";

// (33:2) {#if OtherTabs}
function create_if_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*OtherTabs*/ ctx[0];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (switch_value !== (switch_value = /*OtherTabs*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(33:2) {#if OtherTabs}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div;
	let profile;
	let t;
	let current;
	profile = new Profile_card({ $$inline: true });
	let if_block = /*OtherTabs*/ ctx[0] && create_if_block(ctx);

	const block = {
		c: function create() {
			div = element("div");
			create_component(profile.$$.fragment);
			t = space();
			if (if_block) if_block.c();
			attr_dev(div, "class", "app flex flex-col justify-start py-2 svelte-1gmx5jq");
			add_location(div, file$2, 29, 0, 680);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(profile, div, null);
			append_dev(div, t);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*OtherTabs*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*OtherTabs*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(profile.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(profile.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(profile);
			if (if_block) if_block.d();
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
	let OtherTabs;

	import('./other-tabs-1b9d1613.js').then(module => module.default).then(component => {
		$$invalidate(0, OtherTabs = component);
	}).catch(err => console.error(err));

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("App", $$slots, []);
	$$self.$capture_state = () => ({ Profile: Profile_card, OtherTabs });

	$$self.$inject_state = $$props => {
		if ("OtherTabs" in $$props) $$invalidate(0, OtherTabs = $$props.OtherTabs);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [OtherTabs];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$2.name
		});
	}
}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export { Button as B, SvelteComponentDev as S, validate_each_keys as a, validate_slots as b, space as c, dispatch_dev as d, element as e, attr_dev as f, add_location as g, set_style as h, init as i, insert_dev as j, append_dev as k, detach_dev as l, destroy_each as m, noop as n, empty as o, destroy_block as p, create_component as q, mount_component as r, safe_not_equal as s, text as t, update_keyed_each as u, validate_each_argument as v, transition_in as w, transition_out as x, destroy_component as y, app as z };
//# sourceMappingURL=main-12739277.js.map
