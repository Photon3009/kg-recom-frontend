# Next.js Frontend Coding Standards

## Overview
This document outlines coding standards and best practices for the Next.js 15+ (App Router) frontend project. Following these guidelines ensures clean, maintainable, and performant React/TypeScript applications.

---

## 1. Project Structure

### Recommended Directory Layout (App Router)
```
frontend/
├── app/                        # App Router (Next.js 13+)
│   ├── (auth)/                # Route groups (doesn't affect URL)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Shared layout
│   │   ├── page.tsx           # Dashboard home
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                   # API routes
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── error.tsx              # Error boundary
│   ├── loading.tsx            # Loading UI
│   └── not-found.tsx          # 404 page
├── components/                 # Reusable components
│   ├── ui/                    # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Input/
│   │       ├── Input.tsx
│   │       └── index.ts
│   ├── features/              # Feature-specific components
│   │   └── UserProfile/
│   │       ├── UserProfile.tsx
│   │       └── index.ts
│   └── layouts/               # Layout components
│       └── Header/
│           └── Header.tsx
├── lib/                       # Utility libraries
│   ├── api/                   # API client and services
│   │   ├── client.ts
│   │   └── services/
│   │       └── userService.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useLocalStorage.ts
│   ├── utils/                 # Utility functions
│   │   ├── formatting.ts
│   │   └── validation.ts
│   └── constants/             # Application constants
│       └── routes.ts
├── types/                     # TypeScript type definitions
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
├── styles/                    # Global styles
│   └── globals.css
├── public/                    # Static assets
│   ├── images/
│   └── fonts/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. TypeScript Standards

### Strict Type Safety
```typescript
// tsconfig.json - Enable strict mode
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Definitions
```typescript
// types/models.ts
export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>;

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## 3. Component Standards

### Server Components (Default in App Router)
```typescript
// app/users/page.tsx
import { getUsersList } from '@/lib/api/services/userService';
import { UserCard } from '@/components/features/UserCard';

interface UsersPageProps {
  searchParams: { page?: string; search?: string };
}

// Server Component - async by default
export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

  // Fetch data directly in the component
  const users = await getUsersList({ page, search });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.data.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ searchParams }: UsersPageProps) {
  return {
    title: `Users${searchParams.search ? ` - ${searchParams.search}` : ''}`,
    description: 'Browse all users in the system',
  };
}
```

### Client Components
```typescript
// components/features/UserProfile/UserProfile.tsx
'use client';

import { useState, useCallback } from 'react';
import { User, UserUpdate } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { updateUser } from '@/lib/api/services/userService';

interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserUpdate>({
    fullName: user.fullName,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateUser(user.id, formData);
      onUpdate?.(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, formData, onUpdate]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
```

### Reusable UI Components
```typescript
// components/ui/Button/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500',
      ghost: 'hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## 4. Custom Hooks

### Best Practices
```typescript
// lib/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/models';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from '@/lib/api/services/authService';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await apiLogin(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };
}

// lib/hooks/useDebounce.ts
'use client';

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

---

## 5. API Integration

### API Client Setup
```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, headers, ...restConfig } = config;

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restConfig,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.error || 'An error occurred',
      response.status,
      error.details
    );
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};
```

### API Services
```typescript
// lib/api/services/userService.ts
import { api } from '../client';
import { User, UserCreate, UserUpdate, PaginatedResponse } from '@/types/models';

export async function getUsersList(params: {
  page?: number;
  search?: string;
}): Promise<PaginatedResponse<User>> {
  return api.get<PaginatedResponse<User>>('/api/v1/users', { params });
}

export async function getUserById(id: number): Promise<User> {
  return api.get<User>(`/api/v1/users/${id}`);
}

export async function createUser(data: UserCreate): Promise<User> {
  return api.post<User>('/api/v1/users', data);
}

export async function updateUser(id: number, data: UserUpdate): Promise<User> {
  return api.patch<User>(`/api/v1/users/${id}`, data);
}

export async function deleteUser(id: number): Promise<void> {
  return api.delete<void>(`/api/v1/users/${id}`);
}
```

---

## 6. State Management

### React Context (Simple Cases)
```typescript
// lib/contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Zustand (Complex State)
```typescript
// lib/store/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types/models';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        error: null,
        setUser: (user) => set({ user, error: null }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        reset: () => set({ user: null, isLoading: false, error: null }),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ user: state.user }), // Only persist user
      }
    )
  )
);
```

---

## 7. Form Handling

### React Hook Form + Zod
```typescript
// components/features/LoginForm/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Sign In
      </Button>
    </form>
  );
}
```

---

## 8. Error Handling

### Error Boundaries
```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}

// components/ErrorBoundary/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-red-600">
            <h2>Oops! Something went wrong.</h2>
            <details className="mt-2">
              <summary>Error details</summary>
              <pre className="mt-2 text-sm">{this.state.error?.message}</pre>
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## 9. Performance Optimization

### Code Splitting & Lazy Loading
```typescript
// Dynamic imports for client components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/features/HeavyComponent'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false, // Disable SSR if not needed
  }
);

// Lazy load with suspense
import { lazy, Suspense } from 'react';

const LazyChart = lazy(() => import('@/components/charts/Chart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <LazyChart data={chartData} />
    </Suspense>
  );
}
```

### Memoization
```typescript
'use client';

import { memo, useMemo, useCallback } from 'react';

interface ListItemProps {
  item: { id: number; name: string };
  onDelete: (id: number) => void;
}

// Memoize component to prevent unnecessary re-renders
export const ListItem = memo<ListItemProps>(({ item, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <div className="flex items-center justify-between p-4">
      <span>{item.name}</span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});

ListItem.displayName = 'ListItem';

// Parent component
function ItemList({ items }: { items: Array<{ id: number; name: string }> }) {
  const handleDelete = useCallback((id: number) => {
    // Handle deletion
  }, []);

  // Memoize expensive calculations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <div>
      {sortedItems.map((item) => (
        <ListItem key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

### Image Optimization
```typescript
import Image from 'next/image';

// Always use Next.js Image component
export function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      className="rounded-full"
      priority={false} // Set true for above-the-fold images
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
    />
  );
}
```

---

## 10. Testing

### Component Tests (Jest + React Testing Library)
```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

### Hook Tests
```typescript
// lib/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
```

---

## 11. Styling with Tailwind CSS

### Best Practices
```typescript
// Use cn utility for conditional classes
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'outlined';
  className?: string;
}

export function Card({ children, variant = 'default', className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-6',
        variant === 'default' && 'bg-white shadow-md',
        variant === 'outlined' && 'border border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Responsive Design
```typescript
// Use Tailwind's responsive prefixes
export function ResponsiveGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
```

---

## 12. Accessibility

### Best Practices
```typescript
// components/ui/Dialog/Dialog.tsx
'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
        <h2 id="dialog-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-2 right-2"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
```

---

## 13. Environment Variables

### Configuration
```typescript
// lib/config/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate on startup (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
```

---

## 14. Code Organization Best Practices

### Single Responsibility Principle
```typescript
// Bad - Component doing too much
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetching logic
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  // Rendering logic
  // Analytics logic
  // Form handling
}

// Good - Separated concerns
function UserDashboard() {
  const { users, isLoading } = useUsers();

  return (
    <div>
      <UserStats users={users} />
      <UserList users={users} isLoading={isLoading} />
    </div>
  );
}
```

### DRY (Don't Repeat Yourself)
```typescript
// lib/utils/formatting.ts
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

---

## 15. Documentation Standards

### Component Documentation
```typescript
/**
 * Button component for user interactions.
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Click handler */
  onClick?: () => void;
}
```

---

## Summary Checklist

- ✅ Use TypeScript with strict mode enabled
- ✅ Prefer Server Components over Client Components
- ✅ Use 'use client' directive only when necessary
- ✅ Implement proper error boundaries
- ✅ Use React Hook Form + Zod for form validation
- ✅ Implement proper loading and error states
- ✅ Use Next.js Image component for images
- ✅ Implement proper accessibility (ARIA labels, keyboard navigation)
- ✅ Use Tailwind CSS with cn utility for styling
- ✅ Memoize expensive calculations and callbacks
- ✅ Write unit tests for components and hooks
- ✅ Use proper TypeScript types (avoid 'any')
- ✅ Implement proper SEO with metadata
- ✅ Use environment variables for configuration
- ✅ Follow component composition patterns
- ✅ Implement proper API error handling
- ✅ Use semantic HTML elements
- ✅ Optimize performance with code splitting
- ✅ Document complex components and functions
- ✅ Follow consistent naming conventions
