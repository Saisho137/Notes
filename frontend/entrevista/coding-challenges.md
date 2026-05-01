# Coding Challenges - Solutions

## 1. JavaScript

**Reverse String**

```javascript
// Multiple approaches
const reverse1 = (str) => str.split("").reverse().join("");
const reverse2 = (str) => [...str].reverse().join("");
const reverse3 = (str) => {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
};

// Handle Unicode properly
const reverseUnicode = (str) => [...str].reverse().join("");
reverseUnicode("👋🌍"); // '🌍👋'
```

**Count Characters**

```javascript
function countChars(str) {
  return str.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}

countChars("hello"); // { h: 1, e: 1, l: 2, o: 1 }

// Alternative with Map
function countCharsMap(str) {
  const map = new Map();
  for (const char of str) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}
```

**Deep Cloning Objects**

```javascript
// Recursive approach
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // Handle circular references
  if (seen.has(obj)) return seen.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }

  return clone;
}

// Modern alternative
const clone = structuredClone(obj);
```

---

## 2. React

**Theme Toggling with Context**

```jsx
// ThemeContext.jsx
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// Usage
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

**Movie List Rendering with State**

```jsx
function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [movies, filter]);

  if (loading) return <Spinner />;

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search movies..."
      />
      <ul>
        {filteredMovies.map((movie) => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.year}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. Node.js

**HTTP Server**

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (method === "GET" && url === "/api/users") {
    res.writeHead(200);
    res.end(JSON.stringify({ users: [] }));
  } else if (method === "POST" && url === "/api/users") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const user = JSON.parse(body);
      res.writeHead(201);
      res.end(JSON.stringify({ created: user }));
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(3000, () => console.log("Server running on port 3000"));
```

**File Streaming**

```javascript
const fs = require("fs");
const http = require("http");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "large-file.txt");
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Content-Length": stat.size,
  });

  // Stream file instead of loading entirely into memory
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on("error", (err) => {
    res.writeHead(500);
    res.end("Error reading file");
  });
});

// Transform stream example
const { Transform } = require("stream");

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

fs.createReadStream("input.txt")
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream("output.txt"));
```
