# TypeScript

## Types & Interfaces

**Generics, Partial, Omit, Utility Types**

```typescript
// Generics - Reusable type-safe components
function identity<T>(value: T): T {
  return value;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

const userResponse: ApiResponse<User> = { data: user, status: 200 };

// Common Utility Types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Required<T> - All properties required
type RequiredUser = Required<PartialUser>;

// Omit<T, K> - Remove properties
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number; }

// Pick<T, K> - Select specific properties
type UserCredentials = Pick<User, "email" | "id">;
// { email: string; id: number; }

// Record<K, V> - Object type with specific key/value types
type UserMap = Record<string, User>;

// Readonly<T> - All properties readonly
type ReadonlyUser = Readonly<User>;

// ReturnType<T> - Extract return type of function
type FetchResult = ReturnType<typeof fetchUser>;

// Parameters<T> - Extract parameter types as tuple
type FetchParams = Parameters<typeof fetchUser>;
```

---

**unknown vs. any**

```typescript
// any - Disables type checking (AVOID)
let anyValue: any = "hello";
anyValue.foo.bar; // No error, but will crash at runtime!
anyValue = 123;
anyValue.toUpperCase(); // No error, crashes at runtime

// unknown - Type-safe any (PREFER)
let unknownValue: unknown = "hello";
unknownValue.foo; // Error! Object is of type 'unknown'

// Must narrow type before using
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase(); // OK, TypeScript knows it's a string
}

// Use cases for unknown:
// 1. API responses before validation
// 2. User input
// 3. Third-party library data

function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // Safe, data is User
  }
}

// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value
  );
}
```

---

## Advanced Typing

**Decorators**

```typescript
// Decorators are functions that modify classes/methods/properties
// Requires: "experimentalDecorators": true in tsconfig

// Class Decorator
function Logger(constructor: Function) {
  console.log("Creating instance of:", constructor.name);
}

@Logger
class User {
  constructor(public name: string) {}
}

// Method Decorator
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}

// Property Decorator
function Required(target: any, key: string) {
  // Validation logic
}

class Form {
  @Required
  email: string;
}
```

---

**Conditional Types**

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract and Exclude
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type Numbers = 1 | 2 | 3 | 4 | 5;
type SmallNumbers = Extract<Numbers, 1 | 2 | 3>; // 1 | 2 | 3
type BigNumbers = Exclude<Numbers, 1 | 2 | 3>; // 4 | 5

// Infer keyword - Extract types
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Str = ArrayElement<string[]>; // string

// Practical example: API response unwrapping
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<User>>; // User
```

---

**Type Guards, Discriminated Unions**

```typescript
// Type Guards - Narrow types at runtime
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value is string
  } else {
    console.log(value.toFixed(2)); // value is number
  }
}

// Discriminated Unions - Use a common property to differentiate
interface Circle {
  kind: "circle"; // Discriminant
  radius: number;
}

interface Square {
  kind: "square"; // Discriminant
  sideLength: number;
}

interface Rectangle {
  kind: "rectangle"; // Discriminant
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Result types (common pattern)
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function fetchUser(id: string): Result<User> {
  try {
    const user = db.findUser(id);
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: e as Error };
  }
}
```
