# JB Test Task

## Setup and run

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

To build for production:

```bash
npm run build   # type-checks with tsc, then bundles with Vite
npm run preview # serves the built output locally
```

---

## How authored CSS reaches the browser

The project uses **SCSS** (via `sass-embedded`) compiled by **Vite**:

1. **Authoring** — styles are written in `.scss` files:
   - `src/style.scss` — global styles, Sass variables, `@use "sass:color"` functions
   - `src/Card.module.scss` — component-scoped CSS Module, imports mixins via `@use`
   - `src/styles/mixins.scss` — shared `@mixin` definitions
   - `src/styles/variables.scss` — reserved for shared Sass variables

2. **SCSS → CSS** — Vite invokes `sass-embedded` at request time (dev) or build time (prod):
   - Sass variables (`$primary-color`, `$card-radius`, …) are substituted with their literal values
   - `color.adjust()` and similar Sass functions are evaluated; only the resulting hex/rgb value remains
   - `@mixin` / `@include` pairs are inlined — mixin bodies are copied to every call site
   - CSS Modules class names (`.card`, `.btnInclude`, …) are hashed to unique identifiers (e.g. `_card_1a2b3c`)

3. **Delivery** — in dev mode Vite injects the compiled CSS as `<style>` blocks via JavaScript modules; in production it emits standalone `.css` files.

---

## Generated CSS and source maps

### Dev mode

Vite does not write files to disk in dev mode. The compiled CSS and its source map are served as virtual modules over HTTP. To inspect them:

- Open **DevTools → Sources → `localhost:5173`** and look for entries under `src/` — DevTools uses the embedded source map to display the original `.scss` source directly.
- To see the raw generated CSS, open **DevTools → Network**, filter by `Fetch/XHR` or `JS`, and find the module URL that ends in `.scss?...`.

### Production build (`npm run build`)

Output is written to `dist/`:

```
dist/
  assets/
    index-[hash].css        ← compiled, minified CSS bundle
    index-[hash].js         ← compiled JS bundle
```

Note: Vite does not emit a standalone `.css.map` file. CSS source maps are embedded in the JS bundle's transform chain. To inspect them, open DevTools → Sources and use the source map link from the `.js.map` file, or use dev mode where `devSourcemap: true` makes the original `.scss` files directly browsable in DevTools → Sources.
