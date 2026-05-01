# React

## Core Concepts

**Virtual DOM, Reconciliation, Keys**

- **Virtual DOM**: A lightweight JavaScript representation of the actual DOM. React maintains a copy in memory and syncs it with the real DOM through a process called reconciliation.

- **Reconciliation**: React's diffing algorithm that compares the new Virtual DOM with the previous one and determines the minimal set of changes needed to update the real DOM.

- **Keys**: Help React identify which items have changed, been added, or removed. Should be stable, unique, and predictable.

```jsx
// Bad - index as key (causes issues with reordering)
{
  items.map((item, index) => <Item key={index} {...item} />);
}

// Good - unique identifier
{
  items.map((item) => <Item key={item.id} {...item} />);
}
```

**Why keys matter:**

- Without keys, React re-renders the entire list
- With proper keys, React only updates changed items
- Wrong keys can cause state bugs and performance issues

---

**Component Lifecycle (Functional Hooks: useEffect Dependencies)**

```jsx
import { useEffect } from "react";

function Component({ userId }) {
  // Runs on EVERY render (no dependencies)
  useEffect(() => {
    console.log("Runs every render");
  });

  // Runs ONCE on mount (empty array)
  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted"); // Cleanup
  }, []);

  // Runs when userId changes
  useEffect(() => {
    fetchUser(userId);
    return () => cancelRequest(); // Cleanup before next effect
  }, [userId]);
}
```

**Lifecycle Mapping:**

| Class Component        | Functional Hook                           |
| ---------------------- | ----------------------------------------- |
| `componentDidMount`    | `useEffect(() => {}, [])`                 |
| `componentDidUpdate`   | `useEffect(() => {}, [deps])`             |
| `componentWillUnmount` | `useEffect(() => { return cleanup }, [])` |

---

**useEffect Dependency Array - Deep Dive**

The dependency array is the second argument of `useEffect`. It controls WHEN the effect runs.

```jsx
// 1. NO DEPENDENCY ARRAY - Runs after EVERY render
useEffect(() => {
  console.log("I run on every single render");
  // ⚠️ DANGER: Can cause infinite loops if you update state here!
});

// 2. EMPTY ARRAY [] - Runs ONLY on mount (and cleanup on unmount)
useEffect(() => {
  console.log("I run only once when component mounts");

  return () => {
    console.log("I run when component unmounts");
  };
}, []); // Empty = no dependencies = never re-run

// 3. WITH DEPENDENCIES [a, b] - Runs when ANY dependency changes
useEffect(() => {
  console.log("I run when userId OR filter changes");
  fetchData(userId, filter);
}, [userId, filter]); // Re-runs if userId OR filter changes
```

**How React Compares Dependencies:**

React uses `Object.is()` (similar to `===`) to compare dependencies:

```jsx
// Primitives - compared by value
const [count, setCount] = useState(0);
useEffect(() => {
  console.log(count);
}, [count]); // ✅ Re-runs only when count value changes

// Objects/Arrays - compared by REFERENCE, not value!
const [user, setUser] = useState({ name: "John" });

useEffect(() => {
  console.log(user.name);
}, [user]); // ⚠️ Re-runs if user REFERENCE changes

// This causes a re-run even if name is the same:
setUser({ name: "John" }); // New object = new reference!

// To depend on specific values:
useEffect(() => {
  console.log(user.name);
}, [user.name]); // ✅ Only re-runs when name string changes
```

**Common Mistakes:**

```jsx
// ❌ MISTAKE 1: Missing dependencies
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(count + 1); // ⚠️ 'count' is stale! Always 0
  }, 1000);
  return () => clearInterval(interval);
}, []); // Missing 'count' in dependencies

// ✅ SOLUTION: Use functional update
useEffect(() => {
  const interval = setInterval(() => {
    setCount((prev) => prev + 1); // ✅ Always has latest value
  }, 1000);
  return () => clearInterval(interval);
}, []); // Now it's correct - no external dependencies

// ❌ MISTAKE 2: Object/function in dependencies causing infinite loops
function Component() {
  const options = { method: "GET" }; // New object every render!

  useEffect(() => {
    fetch("/api", options);
  }, [options]); // ⚠️ Runs every render because options is new object!
}

// ✅ SOLUTION: Memoize or move inside effect
function Component() {
  useEffect(() => {
    const options = { method: "GET" }; // Define inside effect
    fetch("/api", options);
  }, []); // ✅ Now stable
}

// Or use useMemo
function Component() {
  const options = useMemo(() => ({ method: "GET" }), []);

  useEffect(() => {
    fetch("/api", options);
  }, [options]); // ✅ options reference is stable
}
```

**Summary Table:**

| Dependency Array | When Effect Runs               |
| ---------------- | ------------------------------ |
| Not provided     | After every render             |
| `[]` (empty)     | Only on mount                  |
| `[a, b]`         | On mount + when a or b changes |

---

**Controlled vs. Uncontrolled Components**

```jsx
// Controlled - React controls the value
function ControlledInput() {
  const [value, setValue] = useState("");

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled - DOM controls the value
function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return <input ref={inputRef} defaultValue="initial" />;
}
```

**When to use each:**

- **Controlled**: Form validation, instant input formatting, conditional disabling
- **Uncontrolled**: Simple forms, file inputs, integrating with non-React code

---

## Hooks

**useState, useEffect, useMemo, useCallback**

```jsx
// useState - State management
const [count, setCount] = useState(0);
setCount((prev) => prev + 1); // Functional update for derived state

// useEffect - Side effects
useEffect(() => {
  const subscription = api.subscribe();
  return () => subscription.unsubscribe();
}, [dependency]);

// useMemo - Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]); // Only recalculates when data changes

// useCallback - Memoize functions
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // Returns same function reference if id doesn't change
```

---

**useMemo vs useCallback - Deep Comparison:**

Both hooks are for **memoization** (caching), but they serve different purposes:

| Hook          | Returns        | Purpose                      |
| ------------- | -------------- | ---------------------------- |
| `useMemo`     | A **value**    | Cache expensive calculations |
| `useCallback` | A **function** | Cache function references    |

```jsx
// useMemo - Returns the RESULT of calling the function
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b); // Function is CALLED
}, [a, b]);
// memoizedValue = the result (e.g., a number, object, array)

// useCallback - Returns the FUNCTION ITSELF (not called)
const memoizedFunction = useCallback(() => {
  doSomething(a, b); // Function is NOT called, just stored
}, [a, b]);
// memoizedFunction = the function reference
```

**They're Actually Equivalent:**

```jsx
// These two are functionally identical:
useCallback(fn, deps);
useMemo(() => fn, deps);

// Example:
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);

// Is the same as:
const handleClick = useMemo(() => {
  return () => {
    console.log(id);
  };
}, [id]);
```

**When to Use Each:**

```jsx
// ✅ useMemo - For EXPENSIVE CALCULATIONS
function ProductList({ products, filter }) {
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.name.includes(filter));
  }, [products, filter]);

  return <List items={filteredProducts} />;
}

// ✅ useCallback - For STABLE FUNCTION REFERENCES
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Count:", count);
  }, [count]);

  return <MemoizedChild onClick={handleClick} />;
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log("Child rendered"); // Only renders when onClick changes
  return <button onClick={onClick}>Click</button>;
});
```

**Why Stable References Matter:**

```jsx
// Problem: Function recreated every render
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // ❌ New function reference on EVERY render
  const handleClick = () => console.log(count);

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
    </>
  );
}

// Even typing in input causes ExpensiveChild to re-render!

// Solution: useCallback
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // ✅ Same function reference unless count changes
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]);

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
    </>
  );
}
// Now typing in input does NOT re-render ExpensiveChild
```

**Common Mistakes:**

```jsx
// ❌ MISTAKE 1: Using useCallback without React.memo
function Parent() {
  const handleClick = useCallback(() => {}, []);
  return <Child onClick={handleClick} />; // Child re-renders anyway!
}

function Child({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}
// useCallback is useless here because Child always re-renders with Parent

// ✅ SOLUTION: Wrap Child with React.memo
const Child = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});

// ❌ MISTAKE 2: Memoizing everything (premature optimization)
const value = useMemo(() => a + b, [a, b]); // Overhead > simple addition!

// ❌ MISTAKE 3: Missing dependencies
const handleClick = useCallback(() => {
  console.log(count); // Uses 'count' but it's not in deps
}, []); // ⚠️ 'count' will always be stale (0)
```

**Summary - When to Use:**

| Scenario                                   | Hook                              |
| ------------------------------------------ | --------------------------------- |
| Expensive calculation (filtering, sorting) | `useMemo`                         |
| Passing function to `React.memo` child     | `useCallback`                     |
| Function in `useEffect` dependencies       | `useCallback`                     |
| Creating objects/arrays for child props    | `useMemo`                         |
| Simple calculations                        | Neither (overhead isn't worth it) |

---

**Custom Hooks (Debouncing, API Fetching)**

```jsx
// useDebounce - Delay value updates
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  fetchResults(debouncedSearch);
}, [debouncedSearch]);

// useFetch - API fetching with loading/error states
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch");
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

---

## State Management

**Redux (Actions, Reducers, Middleware)**

```javascript
// Action Types
const INCREMENT = "counter/INCREMENT";
const DECREMENT = "counter/DECREMENT";

// Action Creators
const increment = (amount = 1) => ({ type: INCREMENT, payload: amount });
const decrement = (amount = 1) => ({ type: DECREMENT, payload: amount });

// Reducer - Pure function (state, action) => newState
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + action.payload };
    case DECREMENT:
      return { ...state, count: state.count - action.payload };
    default:
      return state;
  }
};

// Middleware - Intercepts actions before reaching reducer
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  const result = next(action);
  console.log("Next State:", store.getState());
  return result;
};

// Redux Toolkit (Modern approach)
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state, action) => {
      state.count += action.payload;
    },
    decrement: (state, action) => {
      state.count -= action.payload;
    },
  },
});
```

---

**Context API vs. Zustand/Jotai**

```jsx
// Context API - Built-in, good for low-frequency updates
const ThemeContext = createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Limitation: All consumers re-render when context changes

// Zustand - Lightweight, selective subscriptions
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Only subscribes to count - won't re-render for other changes
const count = useStore((state) => state.count);

// Jotai - Atomic state management
import { atom, useAtom } from "jotai";

const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Comparison:**

| Feature     | Context        | Zustand   | Jotai     |
| ----------- | -------------- | --------- | --------- |
| Bundle Size | 0              | ~1KB      | ~2KB      |
| Boilerplate | Medium         | Low       | Very Low  |
| Re-renders  | All consumers  | Selective | Selective |
| DevTools    | React DevTools | Yes       | Yes       |

---

**Optimistic Updates, Cross-Tab Sync**

```jsx
// Optimistic Update - Update UI before server confirms
async function updateTodo(id, updates) {
  // 1. Save current state for rollback
  const previousTodos = [...todos];

  // 2. Optimistically update UI
  setTodos(
    todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
  );

  try {
    // 3. Make API call
    await api.updateTodo(id, updates);
  } catch (error) {
    // 4. Rollback on error
    setTodos(previousTodos);
    showError("Failed to update");
  }
}

// Cross-Tab Sync using BroadcastChannel
const channel = new BroadcastChannel("app-state");

// Send updates
channel.postMessage({ type: "STATE_UPDATE", payload: newState });

// Receive updates
channel.onmessage = (event) => {
  if (event.data.type === "STATE_UPDATE") {
    setState(event.data.payload);
  }
};

// Alternative: localStorage event
window.addEventListener("storage", (e) => {
  if (e.key === "app-state") {
    setState(JSON.parse(e.newValue));
  }
});
```

---

## Performance Optimization

**Memoization (React.memo, useMemo)**

```jsx
// React.memo - Prevents re-render if props haven't changed
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{/* Expensive rendering */}</div>;
});

// With custom comparison
const MemoizedComponent = React.memo(
  ({ user }) => <div>{user.name}</div>,
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id,
);

// useMemo - Memoize calculated values
function ProductList({ products, filter }) {
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  return <List items={filteredProducts} />;
}

// When to use:
// - Expensive calculations
// - Referential equality for useEffect dependencies
// - Passing objects/arrays to memoized children
```

---

**Lazy Loading, Code Splitting**

```jsx
import { lazy, Suspense } from "react";

// Lazy load components
const Dashboard = lazy(() => import("./Dashboard"));
const Settings = lazy(() => import("./Settings"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// Named export lazy loading
const MyComponent = lazy(() =>
  import("./MyModule").then((module) => ({ default: module.MyComponent })),
);

// Route-based code splitting with React Router
const routes = [
  {
    path: "/admin",
    lazy: () => import("./AdminPanel"), // React Router v6.4+
  },
];
```

---

**Critical Rendering Path**

The sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels:

1. **DOM Construction**: Parse HTML → DOM Tree
2. **CSSOM Construction**: Parse CSS → CSSOM Tree
3. **Render Tree**: Combine DOM + CSSOM
4. **Layout**: Calculate positions and sizes
5. **Paint**: Fill in pixels

**Optimization Strategies:**

```html
<!-- Defer non-critical JavaScript -->
<script src="app.js" defer></script>

<!-- Preload critical resources -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero.jpg" as="image" />

<!-- Inline critical CSS -->
<style>
  /* Above-the-fold styles */
</style>

<!-- Lazy load non-critical CSS -->
<link
  rel="preload"
  href="non-critical.css"
  as="style"
  onload="this.rel='stylesheet'"
/>
```

---

## Advanced Patterns

**Compound Components**

Components that work together to form a complete UI with shared implicit state.

```jsx
const Tabs = ({ children, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }) => <div className="tab-list">{children}</div>;

Tabs.Tab = ({ index, children }) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button
      className={activeIndex === index ? "active" : ""}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
};

Tabs.Panels = ({ children }) => <div className="panels">{children}</div>;

Tabs.Panel = ({ index, children }) => {
  const { activeIndex } = useContext(TabsContext);
  return activeIndex === index ? <div>{children}</div> : null;
};

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel index={0}>Content 1</Tabs.Panel>
    <Tabs.Panel index={1}>Content 2</Tabs.Panel>
  </Tabs.Panels>
</Tabs>;
```

---

**Render Props**

A technique for sharing code between components using a prop whose value is a function.

```jsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <div>Mouse position: {x}, {y}</div>
)} />

// Or with children as function
<MouseTracker>
  {({ x, y }) => <div>Mouse: {x}, {y}</div>}
</MouseTracker>
```

---

**Error Boundaries, Suspense**

```jsx
// Error Boundary (Class component required)
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>

// Suspense - Handle async loading states
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>

// Suspense with Data Fetching (React 18+)
<Suspense fallback={<Loading />}>
  <UserProfile /> {/* Uses use() hook or suspense-enabled data fetching */}
</Suspense>
```

---

## SSR vs CSR (Rendering Strategies)

### Core Concept

**Server-Side Rendering (SSR)**: The server executes a renderer (templates / `renderToString`) and **generates complete HTML** before sending it to the client. The browser receives that HTML and executes its **Critical Rendering Path** (parse → DOM/CSSOM → layout → paint).

**Client-Side Rendering (CSR)**: The server sends minimal HTML; the browser downloads and executes JavaScript that **generates the markup** (e.g., `data.map(...)`) and inserts nodes into the DOM.

> **Important**: The server does **not** perform layout/paint or execute the browser engine; it only produces HTML text ready for the browser to parse.

### What the Server "Pre-Renders"

The server produces:

- **HTML markup** (strings with tags)
- **Initial state** serialized (e.g., `window.__INITIAL_DATA__`) so the client doesn't need to re-fetch data

The server does **not** produce DOM or CSS/layout calculations — that's done by the browser.

### Flow Comparison

#### CSR Flow

1. Browser receives minimal HTML (`<div id="app"></div>`)
2. Downloads and executes JavaScript bundle
3. JS executes operations like `data.map(...)` → creates nodes (or virtual DOM) → updates DOM → paint
4. Visible content depends on JS bundle execution

#### SSR Flow

1. Server executes renderer and returns HTML with content (`<ul><li>...</li></ul>`)
2. Browser parses HTML → DOM/CSSOM → layout → paint: **content appears quickly**
3. Client JS arrives and **hydrates** (attaches handlers, synchronizes state) to add interactivity

### Initial State — What and Why

**Definition**: A serialized data object embedded in HTML that allows the client to reconstruct exactly the UI that the server already generated, without re-requesting data.

**Can be**:

- Complete store snapshot (Redux: `store.getState()`)
- Props or `pageProps` (Next.js)
- Initial Apollo/GraphQL cache
- Values received in `useState`

**Typical format**:

```html
<script>
  window.__INITIAL_DATA__ = { items: [...], user: {...} };
</script>
```

**Usage**: On the client, create store/state with that data to hydrate without additional fetch:

```javascript
const store = createStore(rootReducer, window.__INITIAL_DATA__);
hydrateRoot(root, <App store={store} />);
```

### Hydration

**Hydration**: The client bundle executes code that attaches event handlers and can reconcile the virtual DOM with the existing DOM.

- If server-side HTML matches what the client would render, the library avoids rewriting nodes and only attaches handlers
- If they don't match, it may replace nodes (diff + patch)
- Hydration can be CPU-intensive and block interactivity if the entire app hydrates at once

**Optimization techniques**:

- **Partial/Progressive Hydration**: Hydrate components incrementally
- **Islands Architecture**: Only hydrate interactive components
- **Streaming SSR**: Send HTML in chunks for incremental rendering

```jsx
// Progressive Hydration - React 18+ Streaming SSR with Suspense
<Suspense fallback={<Loading />}>
  <Comments /> {/* Hydrates independently */}
</Suspense>;

// Selective Hydration - React hydrates based on user interaction
// Components wrapped in Suspense hydrate in priority order
// based on where user interacts first

// Islands Architecture (Astro-style in Next.js)
// Use client components sparingly
("use client"); // Only this component hydrates

// Avoiding hydration mismatches
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton />;

  // Client-only content that might differ from server
  return <div>{window.innerWidth}</div>;
}
```

### Important Variants

**SSG (Static Site Generation)**: Render at build-time → static HTML

**SSR per-request**: Render on each request → dynamic, higher server load

**Streaming SSR**: Send HTML in chunks for incremental client rendering

**Islands / Partial Hydration**: Only hydrate interactive components

### Best Practices

1. **Include critical CSS** in `<head>` or inline (avoid FOUC - Flash of Unstyled Content)
2. **Load scripts with `defer`** when possible
3. **Serialize only necessary data** (don't expose secrets); compress/sanitize JSON
4. **Use caching** (CDN / edge) to reduce server load in per-request SSR
5. **Consider hydration cost reduction** strategies (hydration on interaction, partial hydration)

### Minimal Examples

#### Server (React + Node) — Produces HTML + Initial State

```javascript
// server.js
const html = renderToString(<App initialData={data} />);
const initialState = { items: data };

res.send(`
  <!doctype html>
  <html>
    <body>
      <div id="root">${html}</div>
      <script>
        window.__INITIAL_DATA__ = ${JSON.stringify(initialState)};
      </script>
      <script src="/client.js" defer></script>
    </body>
  </html>
`);
```

#### Client (Hydration)

```javascript
// client.js
const initial = window.__INITIAL_DATA__;
const store = createStore(rootReducer, initial);

hydrateRoot(document.getElementById("root"), <App store={store} />);
```

#### Pure CSR (Client Generates Items)

```html
<!-- index.html -->
<div id="app"></div>
<script src="bundle.js" defer></script>
```

```javascript
// bundle.js
fetch("/api/items")
  .then((r) => r.json())
  .then((data) => {
    document.getElementById("app").innerHTML = `
      <ul>
        ${data.map((item) => `<li>${item.name}</li>`).join("")}
      </ul>
    `;
  });
```

---

## Next.js (SSR/SSG)

**Static vs. Dynamic Rendering**

```jsx
// Static Site Generation (SSG) - Built at build time
// Pages are pre-rendered and cached by CDN
export async function getStaticProps() {
  const posts = await fetchPosts();
  return {
    props: { posts },
    revalidate: 60, // ISR: Regenerate every 60 seconds
  };
}

// Dynamic paths for SSG
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return {
    paths: posts.map((post) => ({ params: { id: post.id } })),
    fallback: "blocking", // or true, false
  };
}

// Server-Side Rendering (SSR) - Built on each request
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;
  const user = await fetchUser(context.params.id);
  return { props: { user } };
}

// App Router (Next.js 13+)
// Static by default, dynamic when using:
// - cookies(), headers()
// - searchParams prop
// - Dynamic route with no generateStaticParams
// - fetch with cache: 'no-store'

// Force dynamic
export const dynamic = "force-dynamic";
// Force static
export const dynamic = "force-static";
```

---

## Testing

**Jest, React Testing Library**

```jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component test
describe("Counter", () => {
  test("increments count when button is clicked", async () => {
    render(<Counter />);

    const button = screen.getByRole("button", { name: /increment/i });
    const count = screen.getByTestId("count");

    expect(count).toHaveTextContent("0");

    await userEvent.click(button);

    expect(count).toHaveTextContent("1");
  });
});

// Testing async behavior
test("displays user data after loading", async () => {
  render(<UserProfile userId="123" />);

  // Wait for loading to complete
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
```

---

**Mocking API Calls**

```jsx
import { rest } from "msw";
import { setupServer } from "msw/node";

// Setup mock server
const server = setupServer(
  rest.get("/api/user/:id", (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, name: "John" }));
  }),

  rest.post("/api/login", (req, res, ctx) => {
    return res(ctx.json({ token: "fake-token" }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test with mocked API
test("fetches and displays user", async () => {
  render(<UserProfile userId="123" />);

  await waitFor(() => {
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});

// Override handler for specific test
test("handles error state", async () => {
  server.use(
    rest.get("/api/user/:id", (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  render(<UserProfile userId="123" />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```
