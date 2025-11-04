# TypeScript Tips for Better Code

TypeScript has become the de facto standard for building large-scale JavaScript applications. Here are some advanced tips to write better TypeScript code.

## 1. Use Discriminated Unions

Discriminated unions (also called tagged unions) are a powerful pattern for type-safe state management.

```typescript
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: string };
type ErrorState = { status: 'error'; error: Error };

type State = LoadingState | SuccessState | ErrorState;

function handleState(state: State) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // TypeScript knows data exists
    case 'error':
      return state.error.message; // TypeScript knows error exists
  }
}
```

## 2. Leverage Template Literal Types

Create precise string types:

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = '/users' | '/posts' | '/comments';
type ApiEndpoint = `${HttpMethod} ${ApiRoute}`;

// Valid: 'GET /users', 'POST /posts', etc.
const endpoint: ApiEndpoint = 'GET /users';
```

## 3. Use `const` Assertions

Make objects deeply readonly:

```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

// config.apiUrl = 'other'; // Error: Cannot assign to 'apiUrl'
```

## 4. Utility Types Are Your Friends

TypeScript provides many built-in utility types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Pick specific properties
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Make all properties readonly
type ReadonlyUser = Readonly<User>;
```

## 5. Use Type Guards

Create custom type guards for runtime type checking:

```typescript
interface Dog {
  bark: () => void;
}

interface Cat {
  meow: () => void;
}

function isDog(animal: Dog | Cat): animal is Dog {
  return 'bark' in animal;
}

function makeSound(animal: Dog | Cat) {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows it's a Dog
  } else {
    animal.meow(); // TypeScript knows it's a Cat
  }
}
```

## 6. Embrace Generic Constraints

Use constraints to make generics more specific:

```typescript
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Now TypeScript knows T has an id property
```

## 7. Avoid `any`, Use `unknown`

When you don't know the type, use `unknown` instead of `any`:

```typescript
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

const result = parseJson('{"name": "John"}');

// Must check type before using
if (typeof result === 'object' && result !== null && 'name' in result) {
  console.log(result.name);
}
```

## 8. Use Indexed Access Types

Access property types from other types:

```typescript
interface User {
  id: string;
  profile: {
    name: string;
    age: number;
  };
}

type ProfileType = User['profile']; // { name: string; age: number }
type NameType = User['profile']['name']; // string
```

## Conclusion

These tips will help you write more type-safe, maintainable TypeScript code. Remember, TypeScript's type system is incredibly powerful – take advantage of it!

---

*Try creating your own TypeScript playground: `touch playground.ts`*
