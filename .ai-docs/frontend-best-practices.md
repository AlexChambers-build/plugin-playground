---
domain: general
title: "Frontend Best Practices"
description: "Frontend Best Practices - comprehensive documentation covering overview, technology-stack, directory-structure, recommended-structure-for-scaling, naming-conventions and more."

patterns:
  - overview
  - technology-stack
  - directory-structure
  - recommended-structure-for-scaling
  - naming-conventions
  - files-and-folders
  - variables-and-functions
  - component-best-practices
  - component-structure
  - component-design-principles
  - single-responsibility-principle-srp
  - keep-components-small
  - avoid-prop-drilling
  - state-management
  - local-state-usestate
  - side-effects-useeffect
  - derived-state
  - props-and-proptypes
  - destructuring-props
  - optional-props-with-defaults
  - event-handling
  - naming
  - api-integration
  - service-layer
  - error-handling
  - loading-states
  - styling
  - css-organization
  - class-naming
  - code-quality
  - eslint-rules
  - avoid-common-pitfalls
  - performance-optimization
  - when-to-optimize
  - optimization-techniques
  - accessibility
  - semantic-html
  - aria-attributes
  - keyboard-navigation
  - testing-considerations
  - component-testing-structure
  - testable-code
  - git-and-version-control
  - commit-messages
  - key-principles-summary

keywords:

sections:
  - name: "Overview"
    line_start: 3
    line_end: 5
    summary: "This document outlines the best practices for the React + Vite frontend application. The frontend is..."
  - name: "Technology Stack"
    line_start: 6
    line_end: 11
    summary: "Content about Technology Stack"
  - name: "Directory Structure"
    line_start: 12
    line_end: 40
    summary: "frontend/"
  - name: "Naming Conventions"
    line_start: 41
    line_end: 55
    summary: "Content about Naming Conventions"
  - name: "Component Best Practices"
    line_start: 56
    line_end: 237
    summary: "1. **Imports** - External libraries first, then internal modules"
  - name: "API Integration"
    line_start: 238
    line_end: 294
    summary: "Create a dedicated service layer for API calls:"
  - name: "Styling"
    line_start: 295
    line_end: 321
    summary: "/* TodoItem.css */"
  - name: "Code Quality"
    line_start: 322
    line_end: 365
    summary: "1. **Missing Keys in Lists**"
  - name: "Performance Optimization"
    line_start: 366
    line_end: 385
    summary: "1. **Memoization**: Use `useMemo` for expensive calculations"
  - name: "Accessibility"
    line_start: 386
    line_end: 410
    summary: "Use appropriate HTML elements:"
  - name: "Testing Considerations"
    line_start: 411
    line_end: 430
    summary: "// Component should be testable"
  - name: "Git and Version Control"
    line_start: 431
    line_end: 444
    summary: "Examples:"
  - name: "Key Principles Summary"
    line_start: 445
    line_end: 452
    summary: "1. **KISS (Keep It Simple, Stupid)**: Write simple, readable code first"

complexity: intermediate
line_count: 452
last_updated: 2025-12-19

related:
---

# Frontend Best Practices

## Overview
This document outlines the best practices for the React + Vite frontend application. The frontend is built using React 19.2.0 with functional components and hooks, bundled with Vite.

## Technology Stack
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Language**: JavaScript (JSX)
- **Linting**: ESLint with React-specific plugins

## Directory Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Public static files
└── dist/                # Build output (generated)
```

### Recommended Structure for Scaling
As the application grows, consider organizing by feature:

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Modal, Input)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Utility functions
├── constants/          # Application constants
└── styles/             # Global styles and theme
```

## Naming Conventions

### Files and Folders
- **Components**: PascalCase (e.g., `TodoList.jsx`, `Modal.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `apiClient.js`)
- **Styles**: Match component name (e.g., `TodoList.css` for `TodoList.jsx`)
- **Constants**: UPPER_SNAKE_CASE for files (e.g., `API_ENDPOINTS.js`)

### Variables and Functions
- **Components**: PascalCase (e.g., `function TodoList()`, `const Modal = () => {}`)
- **Functions**: camelCase (e.g., `fetchTodos`, `handleSubmit`, `toggleTodo`)
- **Event Handlers**: Prefix with `handle` (e.g., `handleClick`, `handleChange`, `handleSubmit`)
- **Boolean Variables**: Prefix with `is`, `has`, `should` (e.g., `isModalOpen`, `hasError`, `shouldValidate`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_ITEMS`)

## Component Best Practices

### Component Structure
1. **Imports** - External libraries first, then internal modules
2. **Constants** - Component-level constants
3. **Component Definition** - Main component logic
4. **Helper Functions** - Component-specific utilities
5. **Export** - Default or named export

Example:
```jsx
import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import './ComponentName.css';

const DEFAULT_LIMIT = 10;

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### Component Design Principles

#### Single Responsibility Principle (SRP)
- Each component should do one thing well
- Extract complex logic into custom hooks
- Separate presentational and container components

Example:
```jsx
// GOOD: Separate concerns
function Modal({ isOpen, children, onClose }) {
  return isOpen ? (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container">{children}</div>
    </div>
  ) : null;
}

function TodoModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '' });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TodoForm form={form} onChange={setForm} onSubmit={onSubmit} />
    </Modal>
  );
}
```

#### Keep Components Small
- Aim for components under 150 lines
- Extract sub-components when logic becomes complex
- Use composition over large monolithic components

#### Avoid Prop Drilling
- For deeply nested data, consider Context API
- Keep prop chains under 3 levels deep
- Extract intermediate components when needed

### State Management

#### Local State (useState)
Use for component-specific state:
- Form inputs
- UI state (modals, dropdowns)
- Temporary data

```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [todoForm, setTodoForm] = useState({ title: '', description: '' });
```

#### Side Effects (useEffect)
- Always specify dependencies
- Clean up subscriptions and listeners
- One effect per concern

```jsx
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') handleClose();
  };

  if (isModalOpen) {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }
}, [isModalOpen]);
```

#### Derived State
Calculate values instead of storing them:

```jsx
// GOOD: Derive from state
const todoItems = todos.filter(todo => !todo.done);
const doneItems = todos.filter(todo => todo.done);

// BAD: Don't store derived values
const [todoItems, setTodoItems] = useState([]);
const [doneItems, setDoneItems] = useState([]);
```

### Props and PropTypes

#### Destructuring Props
```jsx
// GOOD: Destructure in function signature
function TodoItem({ id, title, done, onToggle }) {
  return (
    <div>
      <span>{title}</span>
      <button onClick={() => onToggle(id, !done)}>Toggle</button>
    </div>
  );
}

// ACCEPTABLE: Destructure in body for complex components
function ComplexComponent(props) {
  const { id, title, done, onToggle } = props;
  // Complex logic that uses props object
}
```

#### Optional Props with Defaults
```jsx
function Button({ variant = 'primary', size = 'medium', children }) {
  return <button className={`btn-${variant} btn-${size}`}>{children}</button>;
}
```

### Event Handling

#### Naming
- Component props: `onEventName` (e.g., `onClick`, `onSubmit`)
- Internal handlers: `handleEventName` (e.g., `handleClick`, `handleSubmit`)

```jsx
function TodoForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    onSubmit(formData);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Avoid Inline Functions in JSX (for performance-critical lists)
```jsx
// GOOD: Define handler outside JSX
const handleClick = () => doSomething();
return <button onClick={handleClick}>Click</button>;

// ACCEPTABLE: Inline for simple, non-repeated elements
return <button onClick={() => setCount(c => c + 1)}>Increment</button>;

// BAD: Inline arrow functions in large lists
return items.map(item => (
  <div onClick={() => handleClick(item.id)}>{item.name}</div>
));
```

## API Integration

### Service Layer Pattern
Create a dedicated service layer for API calls:

```javascript
// services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async getTodos() {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async createTodo(data) {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },
};
```

### Error Handling
```jsx
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const fetchTodos = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.getTodos();
    setTodos(data);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching todos:', err);
  } finally {
    setLoading(false);
  }
};
```

### Loading States
Always handle loading, success, and error states:

```jsx
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{data}</div>;
```

## Styling

### CSS Organization
- Use component-scoped CSS files
- Follow BEM or similar naming methodology
- Avoid deep nesting (max 3 levels)

```css
/* TodoItem.css */
.todo-item {
  /* Base styles */
}

.todo-item__title {
  /* Element styles */
}

.todo-item--done {
  /* Modifier styles */
}
```

### Class Naming
- Use kebab-case for CSS classes (e.g., `todo-item`, `modal-backdrop`)
- Prefix with component name for uniqueness
- Use semantic names (describe what, not how)

## Code Quality

### ESLint Rules
- Enable React Hooks rules
- Enable React Refresh plugin for HMR
- Follow ESLint recommended configs

### Avoid Common Pitfalls
1. **Missing Keys in Lists**
   ```jsx
   // GOOD
   {items.map(item => <div key={item.id}>{item.name}</div>)}

   // BAD
   {items.map((item, index) => <div key={index}>{item.name}</div>)}
   ```

2. **Stale Closures in Effects**
   ```jsx
   // GOOD: Include dependencies
   useEffect(() => {
     doSomething(value);
   }, [value]);

   // BAD: Missing dependencies
   useEffect(() => {
     doSomething(value);
   }, []); // value is stale
   ```

3. **Conditional Hooks**
   ```jsx
   // GOOD: Hooks at top level
   const [state, setState] = useState(null);
   if (condition) {
     // Use state
   }

   // BAD: Conditional hook
   if (condition) {
     const [state, setState] = useState(null);
   }
   ```

## Performance Optimization

### When to Optimize
- Only optimize when you have measured performance issues
- Use React DevTools Profiler to identify bottlenecks
- Follow YAGNI: Don't optimize prematurely

### Optimization Techniques
1. **Memoization**: Use `useMemo` for expensive calculations
2. **Callback Memoization**: Use `useCallback` for functions passed to children
3. **Component Memoization**: Use `React.memo` for components with expensive renders
4. **Code Splitting**: Use `React.lazy` and `Suspense` for route-based splitting
5. **Virtual Lists**: For long lists (100+ items), use virtualization libraries

Example:
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

## Accessibility

### Semantic HTML
Use appropriate HTML elements:
```jsx
// GOOD
<button onClick={handleClick}>Click me</button>

// BAD
<div onClick={handleClick}>Click me</div>
```

### ARIA Attributes
Add ARIA labels when needed:
```jsx
<button aria-label="Close modal" onClick={onClose}>×</button>
<input aria-describedby="email-help" type="email" />
```

### Keyboard Navigation
Ensure all interactive elements are keyboard accessible:
- Test with Tab key navigation
- Support Escape key for modals/dropdowns
- Support Enter/Space for custom buttons

## Testing Considerations

### Component Testing Structure
```jsx
// Component should be testable
export function TodoItem({ id, title, done, onToggle }) {
  return (
    <div data-testid={`todo-${id}`}>
      <span>{title}</span>
      <button onClick={() => onToggle(id)}>Toggle</button>
    </div>
  );
}
```

### Testable Code
- Keep business logic separate from components
- Use dependency injection (pass services as props)
- Avoid hard-coded dependencies

## Git and Version Control

### Commit Messages
- Use conventional commits format
- Scope to feature/component when possible

Examples:
```
feat(todos): add modal for creating todos
fix(todos): prevent empty todo submission
refactor(modal): extract modal component from App
style(todos): improve button hover states
```

## Key Principles Summary

1. **KISS (Keep It Simple, Stupid)**: Write simple, readable code first
2. **YAGNI (You Aren't Gonna Need It)**: Don't add features until needed
3. **DRY (Don't Repeat Yourself)**: Extract reusable logic, but don't over-abstract
4. **SRP (Single Responsibility)**: One component, one responsibility
5. **Composition over Inheritance**: Build complex UIs from simple components
