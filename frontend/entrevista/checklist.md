# Javascript React

## 0. JavaScript Fundamentals

- Asynchronous Programming
- Event Loop, Micro/Macro Tasks
- Promises, async/await, error handling
- Callback hell vs. promise chaining
- Example: Predict output of mixed setTimeout/Promise code
- ES6+ Features
- WeakMap/WeakSet (common gap)
- Destructuring, spread/rest, arrow functions
- Modules (ES6 vs. CommonJS)
- Functions & Scopes
- Closures, currying, this context
- Recursion (e.g., deep object cloning)
- OOP & Prototypes
- Classes, inheritance, prototypal chain
- Singleton pattern (often missed)
- Data Structures
- Array methods (map, reduce, filter, sort)
- Objects vs. Maps/Sets
- Coding Task: Group books by decade using reduce

## 1. React

- Core Concepts
- Virtual DOM, reconciliation, keys
- Component lifecycle (functional hooks: `useEffect` dependencies)
- Controlled vs. uncontrolled components
- Hooks
- `useState`, `useEffect`, `useMemo`, `useCallback`
- Custom hooks (e.g., debouncing, API fetching)

- State Management
- Redux (actions, reducers, middleware)
- Context API vs. Zustand/Jotai
- Optimistic updates, cross-tab sync

- Performance Optimization
- Memoization (`React.memo`, `useMemo`)
- Lazy loading, code splitting
- Critical Rendering Path
- Advanced Patterns
- Compound components, render props
- Error boundaries, Suspense

- Testing
- Jest, React Testing Library
- Mocking API calls
- Next.js (SSR/SSG)
- Static vs. dynamic rendering
- Hydration strategies

## 2. TypeScript

- Types & Interfaces
- Generics, `Partial`, `Omit`, utility types
- `unknown` vs. `any` (common confusion)
- Advanced Typing
- Decorators, conditional types
- Type guards, discriminated unions

---

## 3. System Design (Senior/Lead)

- Architecture
- MVC vs. Microservices
- SOLID principles, design patterns (Factory, Singleton)
- Scalability
- Caching (Redis), load balancing
- Message queues (RabbitMQ/SQS)
- API Design
- REST vs. GraphQL
- Rate limiting, pagination

## 4. Web Security

- OWASP Top 10
- XSS, CSRF, CORS
- JWT best practices
- HTTPS/SSL
- HTTP/2 vs. HTTP/3

## 5. Cloud (AWS/Azure)

Focus only on the cloud services assigned to you. Remember, it should be based on fundamental knowledge, as you are not applying for a cloud-specific position.

- Core Services
  - EC2, Lambda, S3, API Gateway
  - Docker, Kubernetes (basic orchestration)
- Familiar with deploying services in Azure like Azure Storage, Azure Functions, Databases

- Azure Kubernetes Service (AKS)

## 6. DevOps

- CI/CD
  - GitHub Actions, Jenkins pipelines
  - Infrastructure as Code (IaC) gaps noted

- High Availability
  - Multi-region deployments, autoscaling

---

## Common Coding Challenges

1. JavaScript
   - Reverse strings, count characters
   - Deep cloning objects
2. React
   - Theme toggling with Context
   - Movie list rendering with state
3. Node.js
   - HTTP server, file streaming

---

## Quick Reference - Key Interview Points

### JavaScript

- Event Loop: Sync → Microtasks (all) → 1 Macrotask → Repeat
- Closures: Function + Lexical Environment
- `this`: Depends on how function is called, arrow functions inherit
- Prototypes: `prototype` is on functions, `__proto__` is on objects, chain ends at `null`
- Hoisting: `var` → undefined, `let/const` → TDZ, `function` → fully hoisted
- TDZ: Time between scope entry and `let/const` declaration
- `===` vs `==`: Always use `===` (strict), `==` does type coercion

### React

- Virtual DOM: Lightweight copy for efficient diffing
- Keys: Unique, stable identifiers for list items
- Hooks rules: Top level only, same order every render
- Performance: `React.memo`, `useMemo`, `useCallback`, lazy loading

### TypeScript

- `unknown` > `any`: Type-safe, requires narrowing
- Generics: Type parameters for reusable code
- Discriminated Unions: Use `kind` property for exhaustive checks
- Utility Types: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`
