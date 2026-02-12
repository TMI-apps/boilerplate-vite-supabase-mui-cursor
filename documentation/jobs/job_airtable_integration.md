# Airtable Integration - Implementation Plan

## User Stories

### User Story 1: Configure Airtable Connection
**As a** developer  
**I want to** configure Airtable credentials in the setup wizard  
**So that** I can use Airtable as my data backend

**Acceptance Criteria:**
- Setup wizard includes Airtable configuration step
- User can enter Airtable Personal Access Token, Base ID, and Table ID
- Connection test validates credentials
- Environment variables are generated for Airtable config
- User can skip Airtable setup (fallback to browser storage)
- Airtable can be configured alongside or instead of Supabase

### User Story 2: Use Airtable for Todos
**As a** user  
**I want** my todos to sync with Airtable  
**So that** I can access them across devices

**Acceptance Criteria:**
- Todos CRUD operations work with Airtable when configured
- Field mapping between Todo type and Airtable fields works correctly
- Error handling for API rate limits (5 req/sec) and failures
- Loading states during Airtable operations
- Fallback to browser storage if Airtable not configured
- Priority: Supabase → Airtable → Browser Storage

### User Story 3: Switch Between Data Backends
**As a** developer  
**I want to** choose between Supabase and Airtable  
**So that** I can use the backend that fits my needs

**Acceptance Criteria:**
- App supports both Supabase and Airtable configurations
- User can configure one or both backends
- Priority/fallback order is clear (Supabase → Airtable → Browser Storage)
- Setup wizard allows configuring both backends
- Strategy pattern abstracts backend selection

### User Story 4: Airtable Authentication
**As a** user  
**I want** authentication to work consistently  
**So that** my data is secure

**Acceptance Criteria:**
- Auth always uses Supabase (Airtable is data-only)
- Auth state is managed consistently with existing patterns
- Protected routes work with Supabase auth regardless of data backend

## Chosen Implementation Plan: Plan B (Strategy Pattern Refactor)

### Overview
Implement a clean data provider abstraction layer using the Strategy pattern. This approach:
- Creates reusable provider interfaces
- Makes it easy to add more backends in the future
- Maintains single responsibility per provider
- Improves testability

### Architecture Decision: Strategy Pattern

**Why Strategy Pattern:**
- Cleaner architecture than if/else chains
- Easier to extend with more backends
- Better separation of concerns
- More testable (can mock providers easily)

**Trade-off:**
- More upfront refactoring than Plan A
- Slightly more complex initial implementation
- But significantly cleaner long-term

## Component/API Design

### Data Provider Interface

```typescript
// src/shared/services/dataProviders/types.ts
export interface DataProvider {
  createTodo(input: CreateTodoInput, userId: string): Promise<{ todo: Todo | null; error: Error | null }>;
  getTodos(userId: string): Promise<{ todos: Todo[]; error: Error | null }>;
  updateTodo(todoId: string, input: UpdateTodoInput): Promise<{ todo: Todo | null; error: Error | null }>;
  deleteTodo(todoId: string): Promise<{ error: Error | null }>;
}
```

### Provider Implementations

1. **SupabaseProvider** (`src/shared/services/dataProviders/supabaseProvider.ts`)
   - Implements DataProvider interface
   - Uses existing Supabase client
   - Wraps existing Supabase CRUD logic

2. **AirtableProvider** (`src/shared/services/dataProviders/airtableProvider.ts`)
   - Implements DataProvider interface
   - Uses Airtable SDK
   - Maps Todo types to Airtable record format

3. **BrowserStorageProvider** (`src/shared/services/dataProviders/browserStorageProvider.ts`)
   - Implements DataProvider interface
   - Wraps existing browser storage logic

### Provider Factory

```typescript
// src/shared/services/dataProviders/providerFactory.ts
export function getDataProvider(): DataProvider {
  if (isSupabaseConfigured()) {
    return new SupabaseProvider();
  }
  if (isAirtableConfigured()) {
    return new AirtableProvider();
  }
  return new BrowserStorageProvider();
}
```

### Service Layer Refactor

```typescript
// src/features/todos/services/todoService.ts
import { getDataProvider } from "@shared/services/dataProviders/providerFactory";

const provider = getDataProvider();

export const createTodo = async (input, userId) => {
  return provider.createTodo(input, userId);
};
```

**API Surface:**
- Minimal changes to existing service functions
- Same return types: `{ todo: Todo | null; error: Error | null }`
- Same function signatures
- Backward compatible

## State & Data Flow

### Configuration State
- **Environment Variables:**
  - `VITE_SUPABASE_URL` (existing)
  - `VITE_SUPABASE_ANON_KEY` (existing)
  - `VITE_AIRTABLE_API_KEY` (new)
  - `VITE_AIRTABLE_BASE_ID` (new)
  - `VITE_AIRTABLE_TABLE_ID` (new)

- **Configuration Checks:**
  - `isSupabaseConfigured()` - checks env vars
  - `isAirtableConfigured()` - checks env vars
  - Priority: Supabase → Airtable → Browser Storage

### Data Flow
1. Service function called (e.g., `createTodo`)
2. Provider factory selects appropriate provider
3. Provider executes operation
4. Result returned in consistent format
5. Hook handles state updates

### Async States
- Loading: Managed in hooks (existing pattern)
- Error: Returned from providers, handled in hooks
- Success: Data returned, hooks update state

## UI/UX Considerations

### Setup Wizard Changes

**New Step: "Choose Data Backend" (Optional)**
- Radio buttons: "Supabase", "Airtable", or "Browser Storage"
- Default: Supabase (if configured) or Browser Storage
- Can configure both Supabase and Airtable

**Airtable Configuration Step:**
- Personal Access Token input (password type)
- Base ID input
- Table ID input
- Test connection button
- Copy env vars button

**Layout:**
- Extend existing SetupPage.tsx
- Add new step type: `"backend-choice"` or `"airtable-config"`
- Maintain existing stepper UI pattern

### Responsive Strategy
- Desktop-first (matches existing app)
- Mobile: Stack inputs vertically
- Key breakpoints: Use MUI defaults

### Interactive States
- **Loading**: Spinner during connection test
- **Success**: Green checkmark, proceed to next step
- **Error**: Red alert with error message
- **Disabled**: Disable "Next" until valid config

### Empty States
- If no backend configured: Show browser storage message
- If Airtable configured but no data: Empty todo list (existing pattern)

## Accessibility Planning

### Keyboard Interactions
- Tab through form inputs
- Enter to submit/test connection
- Escape to cancel (if applicable)

### ARIA Attributes
- Form labels for all inputs
- Error messages with `aria-live="polite"`
- Loading states with `aria-busy="true"`

### Focus Management
- Initial focus on first input
- Focus on error message after validation failure
- Focus on success message after successful test

### Semantic HTML
- Use `<form>` for configuration forms
- Use `<fieldset>` for backend choice radio group
- Use proper `<label>` associations

## Technical Considerations

### File Structure

**New Files:**
```
src/shared/services/
  ├── airtableService.ts                    # Airtable client initialization
  └── dataProviders/
      ├── types.ts                          # DataProvider interface
      ├── providerFactory.ts                # Provider selection logic
      ├── supabaseProvider.ts              # Supabase implementation
      ├── airtableProvider.ts               # Airtable implementation
      └── browserStorageProvider.ts         # Browser storage implementation

src/features/todos/services/
  └── todoAirtableService.ts                # Airtable-specific CRUD helpers (optional)

src/pages/
  └── SetupPage.tsx                         # Modified to include Airtable step
```

**Modified Files:**
```
src/features/todos/services/todoService.ts  # Refactored to use providers
src/shared/services/supabaseService.ts      # Add isAirtableConfigured check
src/vite-env.d.ts                           # Add Airtable env types
package.json                                 # Add airtable dependency
```

### Pseudo-code Implementation

```typescript
// Provider Interface
interface DataProvider {
  createTodo(input, userId): Promise<{todo, error}>;
  getTodos(userId): Promise<{todos, error}>;
  updateTodo(id, input): Promise<{todo, error}>;
  deleteTodo(id): Promise<{error}>;
}

// Airtable Provider
class AirtableProvider implements DataProvider {
  private base: AirtableBase;
  
  constructor() {
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
    this.base = new Airtable({ apiKey }).base(baseId);
  }
  
  async createTodo(input, userId) {
    try {
      const record = await this.base(TABLE_NAME).create({
        Title: input.title,
        Description: input.description || "",
        Status: input.status || "pending",
        UserId: userId,
        CreatedAt: new Date().toISOString(),
      });
      return { todo: mapRecordToTodo(record), error: null };
    } catch (error) {
      return { todo: null, error: mapAirtableError(error) };
    }
  }
  
  // ... other methods
}

// Provider Factory
function getDataProvider(): DataProvider {
  if (isSupabaseConfigured()) return new SupabaseProvider();
  if (isAirtableConfigured()) return new AirtableProvider();
  return new BrowserStorageProvider();
}

// Service Refactor
const provider = getDataProvider();

export const createTodo = async (input, userId) => {
  return provider.createTodo(input, userId);
};
```

### Airtable Field Mapping

**Airtable Table Schema:**
- `Title` (Single line text) → `Todo.title`
- `Description` (Long text) → `Todo.description`
- `Status` (Single select: "pending", "completed") → `Todo.status`
- `UserId` (Single line text) → `Todo.user_id`
- `CreatedAt` (Date) → `Todo.created_at`
- `UpdatedAt` (Date) → `Todo.updated_at`
- `Id` (Auto-generated) → `Todo.id` (Airtable record ID)

**Mapping Functions:**
```typescript
function mapTodoToRecord(todo: Todo): AirtableRecordFields {
  return {
    Title: todo.title,
    Description: todo.description || "",
    Status: todo.status,
    UserId: todo.user_id,
    CreatedAt: todo.created_at || new Date().toISOString(),
    UpdatedAt: todo.updated_at || new Date().toISOString(),
  };
}

function mapRecordToTodo(record: AirtableRecord): Todo {
  return {
    id: record.id,
    title: record.fields.Title,
    description: record.fields.Description || undefined,
    status: record.fields.Status as TodoStatus,
    user_id: record.fields.UserId,
    created_at: record.fields.CreatedAt,
    updated_at: record.fields.UpdatedAt,
  };
}
```

### Performance Implications

**Bundle Size:**
- Airtable SDK: ~50KB (minified)
- Provider abstraction: ~5KB
- Total impact: ~55KB

**Rendering:**
- No impact (providers are service-layer only)
- No React components added

**Lazy Loading:**
- Providers initialized on first use
- No need for code splitting (providers are small)

### Error Scenarios

1. **Airtable API Errors:**
   - Rate limit (5 req/sec): Return error, show user message
   - Invalid API key: Connection test fails
   - Base/Table not found: Return error with clear message
   - Network errors: Return error, allow retry

2. **Configuration Errors:**
   - Missing env vars: Provider factory returns BrowserStorageProvider
   - Invalid Base ID: Connection test fails
   - Invalid Table ID: First operation fails with clear error

3. **Data Mapping Errors:**
   - Missing required fields: Return error
   - Invalid field types: Return error with field name

### Dependencies Assessment

**New Dependencies:**
- `airtable` (official SDK) - Latest stable version
- No breaking changes expected

**Existing Dependencies:**
- All existing dependencies remain unchanged
- No version updates required

### Integration Points

1. **Service Layer:**
   - `todoService.ts` uses provider factory
   - Same function signatures maintained
   - Hooks unchanged (they call services)

2. **Setup Wizard:**
   - Add Airtable step after Supabase step
   - Reuse existing test connection pattern
   - Reuse env var copy pattern

3. **Configuration:**
   - Add Airtable env vars to `vite-env.d.ts`
   - Add `isAirtableConfigured()` check
   - Add `testAirtableConnection()` function

### Impact on Existing Functionality

**No Breaking Changes:**
- All existing service functions maintain same signatures
- Hooks unchanged
- Components unchanged
- Auth unchanged (still uses Supabase)

**Behavioral Changes:**
- If both Supabase and Airtable configured: Supabase takes priority
- If only Airtable configured: Airtable used for data
- If neither configured: Browser storage used

### Complexity Assessment

**Cyclomatic Complexity:**
- Provider factory: ~3 (simple if/else)
- Provider methods: ~5-7 each (try/catch + error handling)
- Service functions: ~2 (just call provider)
- **Within threshold (≤10)**

**Nesting Depth:**
- Max nesting: 3 levels (try/catch + if/else)
- **Within threshold (≤4)**

**Maintainability:**
- High: Clear separation of concerns
- Easy to add new providers
- Easy to test (can mock providers)

## Validation & Testing Plan

### Unit Tests

**Provider Tests:**
- Test SupabaseProvider CRUD operations
- Test AirtableProvider CRUD operations
- Test BrowserStorageProvider CRUD operations
- Test provider factory selection logic
- Test error handling in each provider

**Service Tests:**
- Test todoService uses correct provider
- Test error propagation from providers
- Test data transformation

**Airtable Service Tests:**
- Test connection validation
- Test field mapping (Todo ↔ Airtable record)
- Test rate limit handling
- Test error mapping

### Integration Tests

**Setup Wizard:**
- Test Airtable configuration flow
- Test connection test success/failure
- Test env var generation
- Test backend selection

**Todo Operations:**
- Test create todo with Airtable
- Test get todos with Airtable
- Test update todo with Airtable
- Test delete todo with Airtable
- Test fallback to browser storage when Airtable not configured

### Manual Testing Steps

1. **Setup Airtable:**
   - Start app, go to setup wizard
   - Choose Airtable as backend
   - Enter API key, Base ID, Table ID
   - Test connection (should succeed)
   - Copy env vars to .env file
   - Restart dev server

2. **Create Airtable Table:**
   - Create table with required fields
   - Verify field names match expected schema

3. **Test Todo Operations:**
   - Create todo (should appear in Airtable)
   - Get todos (should load from Airtable)
   - Update todo (should update in Airtable)
   - Delete todo (should delete from Airtable)

4. **Test Priority:**
   - Configure both Supabase and Airtable
   - Verify Supabase takes priority
   - Remove Supabase config
   - Verify Airtable is used

5. **Test Fallback:**
   - Remove Airtable config
   - Verify browser storage is used
   - Verify no errors occur

### Test Cases

**Happy Path:**
- ✅ Configure Airtable successfully
- ✅ Create todo via Airtable
- ✅ Read todos from Airtable
- ✅ Update todo via Airtable
- ✅ Delete todo via Airtable

**Error Cases:**
- ✅ Invalid API key (connection test fails)
- ✅ Invalid Base ID (connection test fails)
- ✅ Invalid Table ID (operations fail)
- ✅ Rate limit exceeded (error returned)
- ✅ Network error (error returned)

**Edge Cases:**
- ✅ Both Supabase and Airtable configured (Supabase priority)
- ✅ Neither configured (browser storage fallback)
- ✅ Airtable configured but Supabase not (Airtable used, auth still requires Supabase)
- ✅ Empty todo list (no errors)

## Files to Create

1. `src/shared/services/airtableService.ts` - Airtable client initialization
2. `src/shared/services/dataProviders/types.ts` - DataProvider interface
3. `src/shared/services/dataProviders/providerFactory.ts` - Provider selection
4. `src/shared/services/dataProviders/supabaseProvider.ts` - Supabase provider
5. `src/shared/services/dataProviders/airtableProvider.ts` - Airtable provider
6. `src/shared/services/dataProviders/browserStorageProvider.ts` - Browser storage provider
7. `src/features/todos/services/todoAirtableService.ts` - Airtable CRUD helpers (optional)

## Files to Modify

1. `src/features/todos/services/todoService.ts` - Refactor to use providers
2. `src/shared/services/supabaseService.ts` - Add isAirtableConfigured export
3. `src/pages/SetupPage.tsx` - Add Airtable configuration step
4. `src/vite-env.d.ts` - Add Airtable env types
5. `package.json` - Add airtable dependency

## Implementation Order

1. Install Airtable SDK
2. Create provider interface and types
3. Create Airtable service (client initialization)
4. Create Airtable provider
5. Refactor Supabase to provider
6. Refactor browser storage to provider
7. Create provider factory
8. Refactor todoService to use providers
9. Add Airtable configuration to setup wizard
10. Add Airtable env types
11. Test end-to-end

