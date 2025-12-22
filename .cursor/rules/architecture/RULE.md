---
description: "Architectural patterns and structural organization standards"
alwaysApply: true
---

# Architecture Standards

## Purpose

This rule defines architectural patterns, module organization, and structural standards for application design.

## Design Principles

### Simplification Over Complexification
- **CRITICAL**: When fixing bugs or issues, always first simplify and reduce code
- Only add code when simplification failed or user explicitly gave permission
- Try to fix everything by reducing complexity before adding new code
- Prefer removing code over adding code when possible

### Separation of Concerns
- Separate business logic from presentation
- Keep data access separate from business logic
- Isolate side effects and I/O operations

### Single Responsibility
- Each module/class should have one reason to change
- Functions should do one thing well
- Avoid god objects or utility classes with too many responsibilities

### Dependency Management
- Depend on abstractions, not concretions
- Use dependency injection for testability
- Minimize coupling between modules

## Project Structure

### Directory Organization
- Group related files by feature/domain
- Keep shared utilities in a common location
- Separate concerns by layer (presentation, business, data)

### Module Boundaries
- Define clear interfaces between modules
- Avoid circular dependencies
- Use explicit imports and exports

## Code Placement Rules (Strict Placement)

Follow these four rules. If a piece of code doesn't meet the criteria for a layer, it must move to the next one.

### 1. The Component Rule (UI Only)
A component file should only contain:
- JSX (Layout)
- Event handlers that call other functions
- Local UI state (e.g., `isOpen`, `isHovered`)
- **Zero** data fetching, **zero** complex math, and **zero** business logic

### 2. The Hook Rule (Orchestration)
If logic requires a React lifecycle (`useEffect`, `useState`, `useContext`), it must live in a hook:
- **Feature Hooks**: Logic specific to one feature (e.g., `useCartCalculation`)
- **Global Hooks**: Reusable logic (e.g., `useLocalStorage`, `useWindowSize`)

### 3. The Service/Util Rule (Logic Only)
If logic does not require a React lifecycle, it must not be in a component or a hook:
- Put it in a standard `.js` or `.ts` file
- **Why**: This makes the logic portable and testable without a DOM

### 4. The "One-Way" Directory Rule
Code can only import from "lower" levels:
- A Component can import a Hook, but a Hook can never import a Component
- Services can import from utils, but utils cannot import from services
- Maintain clear dependency hierarchy

## Standard Folder Structure

Standardize your project structure using this exact map. If you create a new file, it has a pre-determined home:

```
src/
├── assets/       # Static files (images, fonts, global CSS)
├── common/       # "Dumb" UI components (Button, Input, Modal) - No business logic allowed
├── features/     # THE CORE - Folders grouped by domain (e.g., 'billing', 'profile')
│   └── [feature-name]/
│       ├── components/  # Feature-specific UI
│       ├── hooks/       # Feature-specific logic (useBillingData)
│       ├── services/    # Pure functions / API calls (billingApi)
│       └── types/       # Type definitions (if using TypeScript)
├── layouts/      # Page wrappers (Header/Footer/Sidebar)
├── pages/        # Route-level components (only used for routing/connecting features)
├── store/        # Global state (Redux/Zustand/Context)
└── utils/        # Global helpers (date formatters, currency math)
```

## Logic Decision Flowchart

When you write a line of code, ask these questions in order:
1. Is it a pure calculation? (e.g., formatting a price) → `utils/`
2. Does it fetch data or talk to an API? → `services/` (inside a feature)
3. Does it use `useEffect` or `useState`? → `hooks/`
4. Is it a generic UI element (like a blue button)? → `common/`
5. Does it connect multiple features or define a URL? → `pages/`

## Enforcement

The best way to stop subjectivity is to automate the punishment for breaking rules:
- **ESLint**: Use `eslint-plugin-import` to prevent "circular dependencies" or "illegal imports" (e.g., preventing a common component from importing a feature component)
- **Folder Peeking**: If a folder has more than 10 files, it is required to be broken down into sub-folders

## Patterns

### Component Patterns
- Prefer composition over inheritance
- Use functional components with hooks
- Keep components focused and reusable

### State Management
- Keep state as local as possible
- Lift state up only when necessary
- Use appropriate state management solutions

### Error Handling
- Handle errors at appropriate boundaries
- Provide meaningful error messages
- Log errors for debugging

## Architecture Documentation

### Documentation Maintenance
- **REQUIRED**: Maintain architecture documentation for all projects
- Update architecture documentation after structural changes
- Keep documentation in sync with actual implementation
- Use clear, descriptive section headings

### Documentation Location
- **ARCHITECTURE.md** and **CHANGELOG.md** must be in the project root directory (not in `documentation/` folder)
- These files are project-wide references that need to be easily discoverable
- The root location follows standard conventions (Keep a Changelog format) and ensures README references work correctly
- **If these files are found in the wrong location (e.g., `documentation/` folder), they must be moved to the root directory**
- Other project-specific documentation can be stored in `documentation/` folder (e.g., implementation plans, job-specific docs)
- Document major architectural decisions and patterns
- Include diagrams or visual representations when helpful
- Keep documentation up to date with code changes

### When to Update Documentation
- After adding new features or modules
- After refactoring major components
- After changing architectural patterns
- After adding new dependencies or frameworks
- When architectural decisions change

## Examples

### ✅ Good Example

```typescript
// Clear separation: data access, business logic, presentation
// data/userRepository.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
}

// domain/userService.ts
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    return user;
  }
}

// presentation/UserComponent.tsx
export function UserComponent({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    userService.getUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

### ❌ Bad Example

```typescript
// Bad: Everything mixed together, no separation
export function UserComponent({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        // Business logic mixed with presentation
        if (data.status === 'active') {
          setUser(data);
        }
      });
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `code-style/RULE.md` - Naming conventions for architectural elements
- `testing/RULE.md` - Testing patterns that depend on architecture
- `security/RULE.md` - Security boundaries and architectural patterns
- `workflow/RULE.md` - Code review standards for architecture
- `cloud-functions/RULE.md` - Function organization patterns

**Rules that reference this rule:**
- All other rules may reference architectural patterns
- `cloud-functions/RULE.md` - References code organization principles

