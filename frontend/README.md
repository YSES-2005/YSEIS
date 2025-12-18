# YSEIS Frontend

A modern React frontend application built with the MVVM (Model-View-ViewModel) architecture pattern and file-based routing using TanStack Router.

## Architecture Overview

This frontend follows the **MVVM (Model-View-ViewModel)** pattern, which provides a clear separation of concerns and makes the codebase more maintainable and testable.

### MVVM Structure

```
src/features/
├── [feature]/
│   ├── services/          # Models (Data layer)
│   ├── viewmodels/        # ViewModels (Business logic)
│   └── views/             # Views (UI components)
```

- **Models (Services)**: Handle data fetching, API calls, and business logic
- **ViewModels**: Manage state, handle user interactions, and bridge between Models and Views
- **Views**: Pure UI components that render the UI and delegate user actions to ViewModels

### Example: Authentication Feature

```
src/features/auth/
├── services/
│   └── authService.ts     # API calls for authentication
├── viewmodels/
│   └── useLoginViewModel.ts # Login state and logic
└── views/
    └── LoginView.tsx      # Login UI component
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing with type safety
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/            # Reusable UI components
│   ├── features/         # Feature-based modules
│   │   └── [feature]/
│   │       ├── services/ # Data layer (Models)
│   │       ├── viewmodels/ # Business logic
│   │       └── views/    # UI components
│   ├── lib/              # Utilities and configurations
│   ├── routes/           # File-based routing
│   └── main.tsx          # App entry point
├── public/               # Static assets
└── package.json
```

## File-Based Routing

This application uses **TanStack Router** for file-based routing. Routes are automatically generated based on the file structure in `src/routes/`.

### Route Examples

```
src/routes/
├── __root.tsx            # Root layout
├── index.tsx             # Home page (/)
├── sign-in.tsx           # Sign in page (/sign-in)
└── _auth.tsx             # Auth layout (/auth/*)
```

### Creating New Routes

1. Create a new file in `src/routes/`
2. Use `createFileRoute()` to define the route
3. Export the `Route` component

```typescript
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent() {
  return <div>Dashboard</div>;
}
```

### Route Features

- **Type-safe navigation** with TypeScript
- **Route guards** with `beforeLoad`
- **Search params validation** with Zod schemas
- **Lazy loading** and code splitting
- **Nested layouts** and routes

## Development Workflow

### 1. Setting Up a New Feature

When adding a new feature (e.g., "items"):

```bash
# Create feature directory structure
mkdir -p src/features/items/{services,viewmodels,views}
```

#### Step 1: Create the Service (Model)

```typescript
// src/features/items/services/itemService.ts
import { apiClient } from '@/lib/apiClient';
import { type Item } from '@schemas/itemSchema';

export const itemService = {
  async getItems(): Promise<Item[]> {
    const response = await apiClient.get<Item[]>('/items');
    return response.data;
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await apiClient.post<Item>('/items', item);
    return response.data;
  },
};
```

#### Step 2: Create the ViewModel

```typescript
// src/features/items/viewmodels/useItemsViewModel.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { itemService } from '../services/itemService';

export function useItemsViewModel() {
  const itemsQuery = useQuery({
    queryKey: ['items'],
    queryFn: itemService.getItems,
  });

  const createItemMutation = useMutation({
    mutationFn: itemService.createItem,
    onSuccess: () => {
      itemsQuery.refetch();
    },
  });

  return {
    items: itemsQuery.data ?? [],
    isLoading: itemsQuery.isLoading,
    error: itemsQuery.error,
    createItem: createItemMutation.mutate,
    isCreating: createItemMutation.isPending,
  };
}
```

#### Step 3: Create the View

```typescript
// src/features/items/views/ItemsView.tsx
import { useItemsViewModel } from '../viewmodels/useItemsViewModel';

export function ItemsView() {
  const { items, isLoading, createItem, isCreating } = useItemsViewModel();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => createItem({ name: 'New Item' })}>
        {isCreating ? 'Creating...' : 'Add Item'}
      </button>
    </div>
  );
}
```

#### Step 4: Create the Route

```typescript
// src/routes/items.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ItemsView } from '../features/items/views/ItemsView';

export const Route = createFileRoute('/items')({
  component: ItemsView,
});
```

### 2. State Management

#### Server State (TanStack Query)

Use TanStack Query for server state:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resource'],
  queryFn: fetchResource,
});
```

#### Client State (useState/useReducer)

Use React hooks for local UI state:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

#### Global State

For complex global state, consider Context API or state management libraries.

### 3. Error Handling

#### API Errors

Handle API errors in ViewModels:

```typescript
const mutation = useMutation({
  mutationFn: service.create,
  onError: error => {
    if (error instanceof AxiosError) {
      setError(error.response?.data.message || 'An error occurred');
    }
  },
});
```

#### Validation Errors

Use Zod for form validation:

```typescript
const result = schema.safeParse(data);
if (!result.success) {
  setError('Invalid input');
  return;
}
```

### 4. Authentication Flow

The app uses a token-based authentication system:

1. **Login**: User submits credentials via `LoginView`
2. **ViewModel**: `useLoginViewModel` handles the login logic
3. **Service**: `authService.login` makes the API call
4. **State**: User data is stored in TanStack Query cache
5. **Route Guards**: Protected routes check authentication in `beforeLoad`

#### Protected Route Example

```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const user = await context.getUser();
    if (!user) {
      throw redirect({ to: '/sign-in' });
    }
  },
  component: DashboardComponent,
});
```

## Coding Standards

### 1. TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for all functions and components

### 2. Component Patterns

- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper prop types with TypeScript interfaces

### 3. File Naming

- Use PascalCase for components (`LoginView.tsx`)
- Use camelCase for utilities (`apiClient.ts`)
- Use kebab-case for route files (`sign-in.tsx`)

### 4. Imports

- Group imports by type (React, third-party, internal)
- Use absolute imports with `@` alias for internal modules
- Keep import order consistent

```typescript
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { authService } from '@/features/auth/services/authService';
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

## Environment Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

3. The app will be available at `http://localhost:5173`

## Shared Schemas

The frontend uses shared TypeScript schemas from the `shared` package:

```typescript
import { type User } from '@schemas/userSchema';
import { loginSchema } from '@schemas/loginSchema';
```

This ensures type consistency between frontend and backend.

## UI Components

This project uses **shadcn/ui** components located in `src/components/ui/`. These are pre-built, accessible components that follow the design system.

### Using Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MyComponent() {
  return (
    <div>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </div>
  );
}
```

## Testing

While not currently implemented, the MVVM architecture makes testing straightforward:

- **Services**: Can be unit tested with mocked API calls
- **ViewModels**: Can be tested independently of UI
- **Views**: Can be tested with React Testing Library

## Best Practices

### 1. MVVM Principles

- **Views** should be "dumb" - only render UI and call ViewModel functions
- **ViewModels** should contain all business logic and state management
- **Services** should handle only data fetching and API calls

### 2. Performance

- Use React.memo for expensive components
- Implement proper loading and error states
- Use TanStack Query's caching for API calls

### 3. Accessibility

- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation

### 4. Security

- Never expose sensitive data in the frontend
- Validate all user input
- Use HTTPS for API calls

## Contributing Guidelines

1. **Follow the MVVM pattern** for all new features
2. **Create proper file structure** under `src/features/`
3. **Use TypeScript strictly** - no `any` types
4. **Write meaningful commit messages**
5. **Test thoroughly** before submitting PRs
6. **Follow existing code style** and patterns

### Pull Request Process

1. Create a feature branch from `main`
2. Implement your feature following the MVVM pattern
3. Run linting and type checking
4. Submit a PR with clear description
5. Address any feedback from code review

## Troubleshooting

### Common Issues

1. **Route not found**: Check file structure and ensure proper `createFileRoute` usage
2. **Type errors**: Verify imports from `@schemas` are correct
3. **Build failures**: Run `pnpm lint` and `pnpm type-check` to identify issues

### Getting Help

- Check existing code patterns in similar features
- Refer to TanStack Router and Query documentation
- Ask questions in team discussions

---

This frontend architecture provides a solid foundation for building scalable, maintainable React applications. The MVVM pattern ensures clear separation of concerns, while file-based routing makes navigation intuitive and type-safe.
