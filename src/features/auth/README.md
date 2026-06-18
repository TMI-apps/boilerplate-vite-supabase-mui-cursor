# Auth Feature

User authentication and session management via Supabase.

## Purpose

- Email/password login, sign-up, and password reset
- Google OAuth sign-in (PKCE callback on `/`)
- Anonymous sessions for unauthenticated visitors
- Session persistence and auth state subscription
- Profile menu state and handlers
- Auth redirect and callback handling

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| Hooks | `hooks/` | `useAuth`, `useAuthSession`, `useAuthRedirect`, `useAuthCallbackHandler`, profile menu hooks |
| Services | `services/` | `authService`, `authCallbackService`, `authErrorMessages`, `authValidation` |
| Components | `components/` | `SignInPanel`, `EmailAuthForm`, `LoginForm` (deprecated wrapper) |
| Types | `types/` | `User`, `LoginCredentials`, `SignUpCredentials`, `AuthState` |

## Main API

### `useAuth()` / `useAuthContext()`

Returns:

`{ user, loading, error, login, signUp, logout, signInWithGoogle, requestPasswordReset, updatePassword, clearAuthError }`

- Requires Supabase configured (`isSupabaseConfigured()`). If not, `loading` becomes `false` and handlers no-op.
- Anonymous Supabase users are treated as logged out (`user === null`).
- Session is initialized on mount and kept in sync via `useAuthStateSubscription`.

### Routes

- `/login` – dedicated sign-in page (redirects to `/` when already authenticated)
- `/reset-password` – password recovery from email link
- `/` – inline sign-in when logged out; primary OAuth PKCE callback handler
- `/auth/callback` – legacy OAuth callback (kept for backward compatibility)

## Dependencies

- `@shared/services/supabaseService` – Supabase client, `isSupabaseConfigured`
- `@shared/utils/appOrigin` – absolute app URLs (basename-aware)
- `@config/legal` – placeholder Privacy/Terms URLs (`LEGAL_ORIGIN`)
- `@shared/utils/userUtils` – `supabaseUserToUser`
- `@utils/redirectUtils` – safe post-login redirect paths

## Configuration checklist

- Supabase Redirect URLs: app origin (`getAppOrigin()`), full `/reset-password` URL
- Google OAuth provider enabled in Supabase
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)
- Update `LEGAL_ORIGIN` in `src/config/legal.ts` when product URLs are available

## Related

- `documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` – Google Cloud + Supabase dashboard setup
- `documentation/DOC_MOBILE_LOCAL_DEV.md` – local device testing for OAuth
