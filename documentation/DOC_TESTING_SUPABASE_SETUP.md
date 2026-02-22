# Testing Supabase Setup Without Real Credentials

This guide explains how to test the Supabase setup flow (including the "Test & Save" completion fix) without using actual Supabase credentials. For setup states and transitions, see [DOC_SETUP_STATES_AND_TRANSITIONS.md](./DOC_SETUP_STATES_AND_TRANSITIONS.md).

## Option 1: Dev Bypass (Fastest – Manual Browser Test)

A dev-only bypass is built into `supabaseService.ts`. When running `pnpm dev`, use these **test credentials** to skip the real connection:

| Field | Value |
|-------|-------|
| **Supabase URL** | `https://test-local.supabase.co` |
| **API Key** | `test-anon-key-for-local-testing` |

**Steps:**

1. Run `pnpm dev`
2. Go to `/setup`
3. Open the Supabase section
4. Enter the test credentials above
5. Click **Test & Save**

**Expected:** The connection test succeeds immediately (no network call to Supabase), env vars are written, and the section shows as completed on the first click.

**Note:** The bypass only runs when `import.meta.env.DEV` is true (i.e. in `vite dev`). Production builds still require real credentials.

---

## Option 2: Unit Test with Mocks

Use Vitest to mock `testSupabaseConnection` and `writeEnvVariables` and assert the completion logic.

Example test structure (adapt paths to your setup):

```typescript
// src/features/setup/components/sections/__tests__/SupabaseSection.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SupabaseCard } from "../SupabaseSection";

vi.mock("@shared/services/supabaseService", () => ({
  testSupabaseConnection: vi.fn(),
}));

vi.mock("../../services/envWriterService", () => ({
  writeEnvVariables: vi.fn(),
}));

import * as supabaseService from "@shared/services/supabaseService";
import * as envWriterService from "../../services/envWriterService";

describe("SupabaseSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseService.testSupabaseConnection).mockResolvedValue({ success: true });
    vi.mocked(envWriterService.writeEnvVariables).mockResolvedValue({ success: true });
  });

  it("marks section as completed on first Test & Save when test and write succeed", async () => {
    const user = userEvent.setup();
    render(<SupabaseCard />);

    await user.click(screen.getByText(/Connect to Supabase/i));
    await user.type(screen.getByLabelText(/URL/i), "https://test.supabase.co");
    await user.type(screen.getByLabelText(/API key/i), "test-key");
    await user.click(screen.getByText(/Test & Save/i));

    await waitFor(() => {
      expect(screen.getByText(/Complete/i)).toBeInTheDocument();
    });
  });
});
```

Run with: `pnpm test:run`

---

## Option 3: Mock `/api/write-env` for Full E2E

If you want to test the full flow (including the env writer) without writing to `.env`:

1. Use the dev bypass credentials (Option 1), or
2. Add a test mode that mocks the fetch to `/api/write-env` in your test setup.

---

## Verifying the Fix

The fix ensures that when you click **Test & Save** the first time and both the connection test and env write succeed:

1. `updateSetupSectionStatus("supabase", "completed")` is called
2. `onStatusChange` is triggered
3. The card shows as completed immediately
4. The dialog can close (if `closeOnSave` is true)

Without the fix, you had to click twice: once to test/write, and again to mark as completed.
