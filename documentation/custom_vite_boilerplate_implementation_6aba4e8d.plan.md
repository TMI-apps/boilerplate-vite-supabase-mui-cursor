---
name: Custom Vite Boilerplate Implementation
overview: Build a custom React + TypeScript + Vite + MUI + Supabase boilerplate that enforces strict architectural rules, includes authentication and todo features as examples, and sets up CI/CD with GitHub Actions.
todos: []
---

# Custom Vite Boilerplate Implementation Plan

## Project Structure

The boilerplate will be created as `vite-mui-supabase-starter` with the following structure:

```javascript
vite-mui-supabase-starter/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .cursorrules/
│   └── (symlink to your rules directory)
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       └── index.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignUpForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   └── todos/
│   │       ├── components/
│   │       │   ├── TodoList.tsx
│   │       │   ├── TodoItem.tsx
│   │       │   └── TodoForm.tsx
│   │       ├── hooks/
│   │       │   └── useTodos.ts
│   │       ├── services/
│   │       │   └── todoService.ts
│   │       └── types/
│   │           └── todo.types.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── TodosPage.tsx
│   ├── store/
│   │   └── contexts/
│   │       └── AuthContext.tsx
│   ├── shared/
│   │   ├── services/
│   │   │   └── supabaseService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── utils/
│   │   └── dateFormatters.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── CHANGELOG.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```



## Implementation Steps

### Phase 1: Project Initialization

**Step 1.1: Create Vite project**

- Run: `pnpm create vite vite-mui-supabase-starter --template react-ts`
- Navigate to project directory
- Initialize pnpm: `pnpm install`

**Step 1.2: Update package.json**

- Set name to `"vite-mui-supabase-starter"`
- Set version to `"0.1.0"`
- Add scripts:
  ```json
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "lint": "gts lint",
        "lint:fix": "gts lint --fix",
        "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
        "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
        "type-check": "tsc --noEmit",
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage"
      }
  ```


**Step 1.3: Install dependencies**

```bash
# Core dependencies
pnpm add react react-dom react-router-dom
pnpm add @mui/material @emotion/react @emotion/styled
pnpm add @supabase/supabase-js

# Dev dependencies
pnpm add -D @types/react @types/react-dom
pnpm add -D @vitejs/plugin-react
pnpm add -D typescript
pnpm add -D gts
pnpm add -D prettier eslint-config-prettier
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D jsdom @testing-library/react @testing-library/jest-dom
```



### Phase 2: TypeScript Configuration

**Step 2.1: Update tsconfig.json**

- Ensure `strict: true` is set
- Add path aliases:
  ```json
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"],
          "@common/*": ["src/common/*"],
          "@features/*": ["src/features/*"],
          "@layouts/*": ["src/layouts/*"],
          "@pages/*": ["src/pages/*"],
          "@store/*": ["src/store/*"],
          "@utils/*": ["src/utils/*"],
          "@shared/*": ["src/shared/*"]
        }
      }
  ```


**Step 2.2: Update vite.config.ts**

- Add path alias resolution:
  ```typescript
      import { defineConfig } from 'vite';
      import react from '@vitejs/plugin-react';
      import path from 'path';
    
      export default defineConfig({
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
            '@common': path.resolve(__dirname, './src/common'),
            '@features': path.resolve(__dirname, './src/features'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@store': path.resolve(__dirname, './src/store'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@shared': path.resolve(__dirname, './src/shared'),
          },
        },
      });
  ```




### Phase 3: Linting and Formatting Setup

**Step 3.1: Initialize GTS**

- Run: `npx gts init`
- This creates base GTS configuration
- Note: GTS 7.0+ uses ESLint 9 flat config format (not `.eslintrc`)

**Step 3.2: Create .prettierrc.json**

- Create Prettier config file (JSON format for ES modules):
  ```json
      {
        "printWidth": 100,
        "tabWidth": 2,
        "useTabs": false,
        "semi": true,
        "singleQuote": false,
        "quoteProps": "as-needed",
        "trailingComma": "es5",
        "bracketSpacing": true,
        "arrowParens": "always",
        "endOfLine": "lf"
      }
  ```

**Step 3.3: Create eslint.config.js**

- Create ESLint flat config that extends GTS and adds architecture rules:
  ```javascript
      import gtsConfig from './node_modules/gts/build/src/index.js';
      import ignores from './eslint.ignores.js';
      import {defineConfig} from 'eslint/config';

      export default defineConfig([
        {ignores},
        ...gtsConfig,
        {
          rules: {
            // Prevent imports from wrong layers - Architecture enforcement
            'no-restricted-imports': [
              'error',
              {
                patterns: [
                  {
                    group: [
                      '@features/*/components',
                      '@features/*/hooks',
                      '@features/*/services',
                    ],
                    message:
                      'Components cannot import from hooks or services. Use hooks instead.',
                  },
                  {
                    group: ['@features/*/hooks'],
                    message: 'Hooks cannot import from components.',
                  },
                  {
                    group: ['@common/*'],
                    message: 'Common components cannot import from features.',
                  },
                ],
              },
            ],
          },
        },
      ]);
  ```

**Step 3.4: Create eslint.ignores.js**

- Create ignores file in ES module format:
  ```javascript
      export default ['build/'];
  ```




### Phase 4: Folder Structure Creation

**Step 4.1: Create directory structure**

- Create all directories as specified in project structure
- Add `.gitkeep` files to empty directories

**Step 4.2: Create global CSS**

- File: `src/assets/styles/global.css`
- Include MUI reset and base styles

### Phase 5: Common Components

**Step 5.1: Create Button component**

- File: `src/common/Button/Button.tsx`
- MUI Button wrapper with consistent styling
- No business logic, pure UI component
- Export via `src/common/Button/index.ts`

**Step 5.2: Create Input component**

- File: `src/common/Input/Input.tsx`
- MUI TextField wrapper
- Export via `src/common/Input/index.ts`

**Step 5.3: Create Modal component**

- File: `src/common/Modal/Modal.tsx`
- MUI Dialog wrapper
- Export via `src/common/Modal/index.ts`

### Phase 6: Supabase Service Setup

**Step 6.1: Create Supabase client**

- File: `src/shared/services/supabaseService.ts`
- Initialize Supabase client with environment variables
- Export client instance and helper functions

**Step 6.2: Create .env.example**

- File: `.env.example`
- Include:
  ```javascript
      VITE_SUPABASE_URL=your-project-url
      VITE_SUPABASE_ANON_KEY=your-anon-key
  ```




### Phase 7: Authentication Feature

**Step 7.1: Create auth types**

- File: `src/features/auth/types/auth.types.ts`
- Define User, AuthState, LoginCredentials, SignUpCredentials types

**Step 7.2: Create auth service**

- File: `src/features/auth/services/authService.ts`
- Pure functions for login, signup, logout, getCurrentUser
- Uses supabaseService, no React hooks

**Step 7.3: Create auth hook**

- File: `src/features/auth/hooks/useAuth.ts`
- Uses React hooks (useState, useEffect)
- Calls authService functions
- Manages auth state

**Step 7.4: Create AuthContext**

- File: `src/store/contexts/AuthContext.tsx`
- Global auth state provider
- Uses useAuth hook internally
- Exports AuthProvider and useAuthContext

**Step 7.5: Create auth components**

- File: `src/features/auth/components/LoginForm.tsx`
- File: `src/features/auth/components/SignUpForm.tsx`
- UI only, call hooks/services, no business logic

**Step 7.6: Create auth pages**

- File: `src/pages/LoginPage.tsx`
- File: `src/pages/SignUpPage.tsx`
- Route-level components that compose auth components

### Phase 8: Todos Feature

**Step 8.1: Create todo types**

- File: `src/features/todos/types/todo.types.ts`
- Define Todo, TodoStatus, CreateTodoInput types

**Step 8.2: Create todo service**

- File: `src/features/todos/services/todoService.ts`
- CRUD functions: createTodo, getTodos, updateTodo, deleteTodo
- Uses supabaseService, no React hooks

**Step 8.3: Create todo hook**

- File: `src/features/todos/hooks/useTodos.ts`
- Uses React hooks
- Calls todoService functions
- Manages todos state

**Step 8.4: Create todo components**

- File: `src/features/todos/components/TodoList.tsx`
- File: `src/features/todos/components/TodoItem.tsx`
- File: `src/features/todos/components/TodoForm.tsx`
- UI only, use hooks for data/logic

**Step 8.5: Create todos page**

- File: `src/pages/TodosPage.tsx`
- Route-level component composing todo components

### Phase 9: Layouts and Routing

**Step 9.1: Create layouts**

- File: `src/layouts/MainLayout.tsx` - App shell with header/nav
- File: `src/layouts/AuthLayout.tsx` - Simple centered layout for auth pages

**Step 9.2: Update App.tsx**

- Set up React Router
- Define routes:
- `/` -> HomePage
- `/login` -> LoginPage (AuthLayout)
- `/signup` -> SignUpPage (AuthLayout)
- `/todos` -> TodosPage (MainLayout, protected)
- Add route protection for authenticated routes

**Step 9.3: Create HomePage**

- File: `src/pages/HomePage.tsx`
- Simple welcome page with navigation

### Phase 10: MUI Theme Setup

**Step 10.1: Create theme configuration**

- File: `src/shared/theme/theme.ts`
- MUI theme with custom colors, typography
- Light/dark mode support

**Step 10.2: Wrap app with ThemeProvider**

- Update `src/main.tsx` to include ThemeProvider and CssBaseline

### Phase 11: Testing Setup

**Step 11.1: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ... other aliases
    },
  },
});
```

**Step 11.2: Create test setup file**

- File: `src/test/setup.ts`
- Configure testing-library/jest-dom

**Step 11.3: Create example tests**

- Test for authService (unit test)
- Test for TodoItem component (component test)

### Phase 12: Git and CI/CD Setup

**Step 12.1: Create .gitignore**

- Standard Vite/Node ignores
- Add `.env`, `dist`, `coverage`, `.DS_Store`

**Step 12.2: Initialize Git repository**

- Run: `git init`
- Create initial commit structure

**Step 12.3: Create CHANGELOG.md**

- Start with version 0.1.0
- Document initial boilerplate creation

**Step 12.4: Create GitHub Actions workflow**

- File: `.github/workflows/ci.yml`
- Run on push/PR:
- Install dependencies (pnpm)
- Run type-check
- Run lint
- Run format check
- Run tests
- Build project

### Phase 13: Documentation

**Step 13.1: Create README.md**

- Project overview
- Prerequisites (Node.js, pnpm, Supabase account)
- Installation instructions
- Architecture explanation
- Development workflow
- Scripts documentation

**Step 13.2: Create ARCHITECTURE.md**

- Detailed explanation of folder structure
- Code placement rules
- Dependency hierarchy
- Examples of correct vs incorrect patterns

### Phase 14: Final Configuration

**Step 14.1: Add pre-commit hooks (optional)**

- Consider husky + lint-staged for pre-commit linting

**Step 14.2: Verify all scripts work**

- Test: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`
- Fix any issues

**Step 14.3: Create initial commit**

- Follow semantic versioning: `[0.1.0] feat: Initial boilerplate setup`
- Ensure CHANGELOG.md matches commit message

## Key Implementation Details

### Architecture Enforcement

1. **ESLint rules** prevent wrong-layer imports
2. **Folder structure** enforces separation
3. **TypeScript path aliases** make imports explicit
4. **Example code** demonstrates correct patterns

### Code Examples Included

- **Auth feature**: Demonstrates service → hook → component → page flow
- **Todos feature**: Demonstrates full CRUD with proper separation
- **Common components**: Shows pure UI components with no logic

### Testing Strategy

- Unit tests for services (pure functions)
- Component tests for UI components
- Integration tests demonstrate hook usage

### CI/CD Pipeline

- Runs on every push/PR
- Validates code quality before merge
- Ensures build succeeds

## Validation Checklist

After implementation, verify:

- [ ] All scripts run without errors
- [ ] TypeScript strict mode enabled
- [ ] Linting passes with GTS
- [ ] Formatting follows Prettier rules (100 char, LF line endings)
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Architecture rules enforced via ESLint
- [ ] Example features work end-to-end