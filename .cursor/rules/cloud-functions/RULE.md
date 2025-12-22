---
description: "Cloud and edge function organization by business capability"
alwaysApply: false
globs: ["**/functions/**", "**/edge-functions/**"]
---

# Cloud/Edge Functions Organization

## Purpose

This rule defines how cloud and edge functions should be organized by business capability rather than technical concerns.

## Core Principle

**Group functions by Business Capability, not by technical similarity.**

## Organization Strategy

### Before Creating a New Function

1. **Analyze existing business capabilities** to which the new cloud function could belong
2. **Group functions by Business Capability**
3. **Only create a new function** when the business capability has not been covered yet
4. **Otherwise**, append or adjust existing functionality

## Example Structure

```
functions/
├── ai-chat/          # Handles conversation logic, context, and calls OpenRouter
├── gamma-generator/  # Handles specific logic for generating presentations/docs via Gamma
└── webhooks/         # Dedicated function to receive incoming data (if third parties call you back)
```

## Why This Approach?

### Performance
- If the Gamma API is slow, it doesn't block users trying to chat with the AI
- Each capability can scale independently
- Failures in one capability don't cascade to others

### Security
- API keys for OpenRouter live only inside the `ai-chat` function environment variables, never in the browser
- Each function has minimal permissions (principle of least privilege)
- Secrets are scoped to specific capabilities

### Maintainability
- Related functionality is grouped together
- Easier to understand what each function does
- Changes to one capability don't affect others

## Examples

### ✅ Good Example

```typescript
// functions/ai-chat/index.ts
// Handles all AI chat-related functionality
export async function handleRequest(req: Request): Promise<Response> {
  // Conversation logic
  // Context management
  // OpenRouter API calls
  // All AI chat capabilities in one place
}
```

### ❌ Bad Example

```typescript
// functions/api-call-1/index.ts - Generic name, unclear purpose
// functions/api-call-2/index.ts - Another generic API call
// functions/utils/index.ts - Mixed concerns
// Bad: Functions organized by technical similarity, not business capability
```

## When to Create a New Function

Create a new function when:
- A new business capability emerges that doesn't fit existing functions
- The capability has distinct performance or security requirements
- The capability needs independent scaling or deployment

Do NOT create a new function when:
- The functionality fits an existing business capability
- You can extend an existing function without breaking its single responsibility
- The change is purely technical (refactoring, not new capability)

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `architecture/RULE.md` - Code organization and separation of concerns
- `workflow/RULE.md` - Deployment processes for cloud functions
- `security/RULE.md` - Security considerations for function organization

**Rules that reference this rule:**
- `workflow/RULE.md` - References deployment of cloud functions

