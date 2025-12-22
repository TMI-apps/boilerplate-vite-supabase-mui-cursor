# Vite MUI Supabase Starter

A modern, production-ready boilerplate for building React applications with TypeScript, Vite, Material-UI, and Supabase. This starter enforces strict architectural rules and includes authentication and todos features as examples.

## Features

- ⚡️ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **Material-UI (MUI)** - Comprehensive UI component library
- 🗄️ **Supabase** - Backend-as-a-Service for authentication and database
- 🧭 **React Router** - Client-side routing
- 📏 **ESLint + GTS + Prettier** - Code quality and style enforcement (see [ARCHITECTURE.md](./ARCHITECTURE.md#code-quality-tools))
- 🧪 **Vitest** - Fast unit testing framework
- 🏗️ **Strict Architecture** - Enforced folder structure and import rules
- 🔒 **Authentication** - Complete auth flow (login, signup, logout)
- ✅ **Todos Feature** - Example CRUD implementation

## Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 8.x or higher (recommended) or npm/yarn
- **Supabase Account** - [Sign up here](https://supabase.com)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vite-mui-supabase-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up Supabase database:
   - Create a `todos` table in your Supabase project:
   ```sql
   CREATE TABLE todos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     status TEXT NOT NULL DEFAULT 'pending',
     user_id UUID NOT NULL REFERENCES auth.users(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

   -- Create policy for users to manage their own todos
   CREATE POLICY "Users can manage their own todos"
     ON todos
     FOR ALL
     USING (auth.uid() = user_id);
   ```

5. Start the development server:
```bash
pnpm dev
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage

## Architecture

This project follows a strict feature-based architecture. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information about:

- Folder structure
- Code placement rules
- Dependency hierarchy
- Import patterns
- Code quality tools (GTS, ESLint, Prettier)

## Development Workflow

1. **Create a feature**: Add files in `src/features/[feature-name]/`
2. **Use common components**: Import from `@common/*`
3. **Access shared services**: Import from `@shared/*`
4. **Follow the layer rules**: Components → Hooks → Services
5. **Write tests**: Add tests alongside your code

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── common/          # Reusable UI components (no business logic)
├── features/        # Feature modules (auth, todos, etc.)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── todos/
├── layouts/         # Layout components
├── pages/           # Route-level page components
├── store/           # Global state (contexts, etc.)
├── shared/          # Shared utilities and services
├── utils/           # Utility functions
└── components/      # App-level components
```

## Testing

Tests are written using Vitest and React Testing Library. Example tests are included for:
- Service functions (unit tests)
- React components (component tests)

Run tests:
```bash
pnpm test
```

## CI/CD

GitHub Actions workflow runs on every push/PR:
- Type checking
- Linting
- Format checking
- Tests
- Build verification

## Contributing

1. Follow the architecture rules
2. Write tests for new features
3. Ensure all checks pass (`pnpm lint`, `pnpm format:check`, `pnpm test`)
4. Update CHANGELOG.md for significant changes

## License

MIT
