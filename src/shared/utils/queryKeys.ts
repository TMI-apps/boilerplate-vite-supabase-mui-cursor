/**
 * Shared query keys for cross-cutting data (user).
 * Feature-specific keys live in features/[feature]/api/keys.ts.
 *
 * Conventions:
 * - Hierarchical: [resource, subResource?, ...params]
 * - Use `as const` for type-safety
 * - Use spread for derived keys: [...keys.all, "detail", id]
 */

export const sharedQueryKeys = {
  user: {
    all: ["user"] as const,
    profile: (userId: string) => ["user", "profile", userId] as const,
  },
} as const;
