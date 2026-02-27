/**
 * Shared query keys for cross-cutting data (user, config).
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
  config: {
    all: ["config"] as const,
    section: (section: string) => ["config", section] as const,
  },
} as const;
