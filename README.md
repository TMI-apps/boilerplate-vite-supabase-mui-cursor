# Vite MUI Supabase Starter

A modern, production-ready boilerplate for building React applications with TypeScript, Vite, Material-UI, and Supabase. This starter enforces strict architectural rules and includes authentication as an example feature.

## Features

- ⚡️ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **Material-UI (MUI)** - Comprehensive UI component library
- 🗄️ **Supabase** - Backend-as-a-Service for authentication and database (optional)
- 🧭 **React Router** - Client-side routing
- 📏 **ESLint + GTS + Prettier** - Code quality and style enforcement (see [ARCHITECTURE.md](./ARCHITECTURE.md#code-quality-tools))
- 🧪 **Vitest** - Fast unit testing framework
- 🏗️ **Strict Architecture** - Enforced folder structure and import rules
- 🔒 **Authentication** - Complete auth flow (login, signup, logout) - requires Supabase
- 📊 **Airtable Integration** - Connect to Airtable as a data source (optional)

## Prerequisites

### Required

- **Node.js** 20.x or higher - [Download here](https://nodejs.org/)
- **pnpm** 9.15.4 or higher (recommended) or npm/yarn
  - Install globally: `npm install -g pnpm`
- **Git** - Required for cloning the repository and git hooks
  - [Download here](https://git-scm.com/downloads)

### Optional

- **Supabase Account** (optional) - [Sign up here](https://supabase.com) if you want to use authentication and database features
- **Graphviz** (optional) - Required only for generating architecture graph visualizations
  - Install: `choco install graphviz` (Windows with Chocolatey) or [download installer](https://graphviz.org/download/)
  - Only needed if you want to run `pnpm arch:graph` to visualize the architecture
- **Airtable Account** (optional) - [Sign up here](https://airtable.com) if you want to use Airtable as a data source

### Configure Line Endings

**IMPORTANT:** Before starting, configure VS Code/Cursor to use Linux line endings (`\n`). This ensures consistent line endings across all files and prevents linting errors.

#### Editor Configuration (VS Code / Cursor)

**Note:** Cursor uses VS Code settings. Configure the line ending setting in VS Code/Cursor settings:

1. Press `Ctrl + ,` to open Settings
2. Search for `files.eol` or `line ending`
3. Change the setting from `auto` to `\n` (Linux)
   - The setting is: **"Files: Eol"** → Select `\n` from the dropdown

See [this guide](https://stackoverflow.com/questions/71240918/how-to-set-default-line-endings-in-visual-studio-code) for more details.

#### Git Configuration

Configure Git to preserve LF line endings (the repository already includes `.gitattributes` to enforce this):

```bash
git config core.autocrlf false
```

This prevents Git from converting LF to CRLF on Windows systems.

**Why this matters:** The repository uses LF line endings. Without proper configuration, Git on Windows may convert them to CRLF, causing thousands of Prettier/ESLint errors.

### Linter Setup

This project uses **ESLint** and **Prettier** for code quality and formatting. The linters are already configured and will run automatically.

#### Verify Linter Installation

After running `pnpm install`, verify that the linters work correctly:

```bash
# Check for linting issues
pnpm lint

# Check if code formatting is correct
pnpm format:check
```

#### Common Linter Commands

- `pnpm lint` - Check for code quality issues (ESLint)
- `pnpm lint:fix` - Auto-fix ESLint errors
- `pnpm format` - Format all code with Prettier
- `pnpm format:check` - Check if code is formatted correctly

#### Editor Integration

**Recommended:** Configure VS Code/Cursor to:
- Format on save using Prettier
- Show ESLint errors in real-time
- Install the ESLint and Prettier extensions

**If you see many linting errors after cloning:**
- This is usually due to line ending issues (see [Configure Line Endings](#configure-line-endings) above)
- Run `pnpm format` to auto-fix formatting issues
- Run `pnpm lint:fix` to auto-fix linting issues

### Using Cursor Agent

When using Cursor's AI agent to make commits, you may encounter permission issues. This section explains how to configure Cursor to allow Git commits. To allow the agent to perform Git commits automatically, configure the **Command Allowlist** in Cursor settings.

#### Configure Command Allowlist

1. Open Cursor Settings (`Ctrl + ,`)
2. Search for "Command Allowlist" or "allowlist"
3. Add the following commands to the allowlist:
   - `powershell`
   - `Set-Location`
   - `git diff`
   - `git commit`
   - `cd`
   - `git add`

**Why this is needed:** By default, Cursor's agent runs in a sandboxed environment. Adding these commands to the allowlist allows Git operations to run outside the sandbox, preventing permission errors (like `env.exe: couldn't create signal pipe, Win32 error 5`) when committing.

**Note:** After adding these commands to the allowlist, the Cursor agent can perform Git commits without requiring elevated permissions (`all`), making the workflow smoother.

## Quick Start Guide

### Step 1: Clone and Install

Open Cursor in the folder where you want to create your project, then run:

```bash
git clone https://github.com/TMI-apps/boilerplate-vite-supabase-mui-cursor .
pnpm install
```

**Note:** You may see TypeScript compilation errors during installation. These are normal and won't prevent the app from running. Vite transpiles TypeScript on the fly for the dev server.

### Step 2: Start the Development Server

```bash
pnpm dev
```

The app will open at `http://localhost:5173/` (or another port if 5173 is in use) and automatically redirect you to the setup wizard.

### Step 3: Complete the Setup Wizard

When you first run the app, a setup wizard will guide you through configuration. All sections are optional - configure what you need and skip the rest.

#### Configure Supabase (Authentication) 🔐

1. **Get Supabase Credentials:**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to **Project Settings → API**
   - Copy your **Project URL** and **Publishable Key** (previously called "anon key")

2. **In the Setup Wizard:**
   - Enter your Supabase URL and publishable key
   - Click **"Test Connection"**
   - Copy the environment variables shown
   - Create a `.env` file in the project root:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
     ```
   - **Note:** The legacy `VITE_SUPABASE_ANON_KEY` also works for backward compatibility
   - **Important:** Restart your dev server (`Ctrl+C` then `pnpm dev` again)

#### Configure Airtable (Optional) 📊

- Enter your Airtable API key, Base ID, and Table ID in the setup wizard
- This enables you to connect to Airtable as a data source

#### Customize Theme (Optional) 🎨

   - Use the [MUI Theme Creator](https://bareynol.github.io/mui-theme-creator/) to generate a theme JSON
   - Paste it in the theme step (or skip to use default)

### Step 4: Access Your App

- **Home:** `http://localhost:5173/`
- **Setup:** `http://localhost:5173/setup` (accessible anytime)
- **Login:** `http://localhost:5173/login` (if Supabase is configured)

### That's It! 🎉

Your app is ready to use. You can start building features or customize it to your needs.

**Need to configure Supabase later?** Just navigate to `/setup` in your app and follow the steps.

## Installation

For detailed installation instructions, see the [Quick Start Guide](#quick-start-guide) above.

### Optional: Manual Supabase Setup

If you prefer to set up Supabase manually instead of using the setup wizard (recommended: use the [setup wizard](#step-3-complete-the-setup-wizard) instead):

1. Create a `.env` file in the project root directory

2. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```
**Note:** The legacy `VITE_SUPABASE_ANON_KEY` also works for backward compatibility.

3. Restart the development server for environment variables to take effect

### Features

- ✅ **Authentication**: Supabase authentication (when configured)
- ✅ **Airtable Integration**: Connect to Airtable as a data source (when configured)
- ✅ **Theme Customization**: Customize the MUI theme
- ✅ **Frontend Development**: All UI components and features work independently

### Configuring Supabase Later

If you skipped Supabase setup initially, you can configure it anytime:

1. Navigate to `/setup` in your running app
2. Follow the setup wizard steps to configure Supabase credentials
3. Create the `.env` file with your credentials (see [Manual Supabase Setup](#optional-manual-supabase-setup))
4. **Restart your development server** (`Ctrl+C` then `pnpm dev`)


### Troubleshooting

**Setup wizard not appearing?**
- Make sure you're accessing `http://localhost:5173/` (or the port shown in your terminal)
- Clear your browser's local storage and reload
- Check that the dev server is running

**Supabase connection failing?**
- Verify your credentials are correct (check for typos)
- Ensure your `.env` file is in the project root (not in `src/`)
- Make sure you've restarted the dev server after creating `.env`
- Check that your Supabase project is active and not paused

**Environment variables not working?**
- Vite requires environment variables to start with `VITE_`
- Restart the dev server after changing `.env` file
- Don't commit `.env` to git (it should be in `.gitignore`)

**TypeScript errors during installation or when running `pnpm dev`?**
- TypeScript compilation errors are normal and won't prevent the app from running
- Vite handles TypeScript transpilation on the fly for the dev server
- These errors are typically related to type definitions in node_modules and can be ignored during development

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint (code quality checks)
- `pnpm lint:fix` - Auto-fix ESLint errors
- `pnpm format` - Format all code with Prettier
- `pnpm format:check` - Check if code is formatted correctly
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage

### Code Quality Tools

This project uses **GTS**, **ESLint**, and **Prettier** together for code quality and formatting:

- **GTS** (Google TypeScript Style) - Provides pre-configured ESLint rules
- **ESLint** - Catches bugs and enforces code quality (with custom architecture rules)
- **Prettier** - Formats code automatically for consistency

**Quick Start:**
- Format code: `pnpm format`
- Check for issues: `pnpm lint`
- Auto-fix issues: `pnpm lint:fix`

**Editor Setup:**
- Configure your editor to format on save using Prettier
- ESLint will provide real-time feedback in your IDE
- See [ARCHITECTURE.md](./ARCHITECTURE.md#code-quality-tools) for detailed documentation

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
├── features/        # Feature modules (auth, etc.)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
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

