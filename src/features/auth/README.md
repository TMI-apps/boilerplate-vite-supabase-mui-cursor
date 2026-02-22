# Auth Feature

User authentication and session management via Supabase.

## Purpose

- Email/password login and sign-up
- Google OAuth and Entreefederatie (SAML) sign-in
- Session persistence and auth state subscription
- Profile menu state and handlers
- Auth redirect and callback handling

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| Hooks | `hooks/` | `useAuth`, `useAuthSession`, `useAuthRedirect`, `useUserProfile`, `useProfileMenuState`, `useProfileMenuHandlers` |
| Services | `services/` | `authService`, `authCallbackService` – Supabase auth calls |
| Components | `components/` | `LoginForm` |
| Types | `types/` | `User`, `LoginCredentials`, `SignUpCredentials`, `AuthState` |

## Main API

### `useAuth()`

Returns: `{ user, loading, error, login, signUp, logout, signInWithGoogle, signInWithEntreefederatie }`

- Requires Supabase configured (`isSupabaseConfigured()`). If not, `loading` becomes `false` and handlers no-op.
- Session is initialized on mount and kept in sync via `useAuthStateSubscription`.

### `authService`

- `login(credentials)` / `signUp(credentials)` / `logout()` – password auth
- `signInWithGoogle()` / `signInWithEntreefederatie()` – OAuth/SAML
- Filters anonymous users via `supabaseUserToUser()`

## Dependencies

- `@shared/services/supabaseService` – Supabase client, `isSupabaseConfigured`
- `@config/entreefederatie` – Entreefederatie domain
- `@shared/utils/userUtils` – `supabaseUserToUser`

## Related

- `src/routes/guards/` – auth guards for protected routes
- `documentation/DOC_APP_CODE_MODIFICATION.md` – setup removal flow (auth can be removed if Supabase disabled)
