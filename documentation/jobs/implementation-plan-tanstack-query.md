# Implementatieplan: TanStack Query

**Versie:** 2.0  
**Datum:** 26 februari 2025  
**Status:** Voltooid

## Doel

TanStack Query integreren in de boilerplate om server state te beheren met caching, deduplicatie en stale-while-revalidate. Dit lost de volgende problemen op:

- Trage terug-navigatie (data opnieuw laden)
- Dubbele API-calls voor dezelfde data
- Verouderde informatie zonder refresh

---

## Voorwaarden

- [x] `@tanstack/react-query` geïnstalleerd via pnpm
- [x] Bestaande architectuur en layer rules gevolgd
- [x] `projectStructure.config.cjs` bijgewerkt voor `features/*/api/` map (zie Stap 2.0)

---

## Keuzes en implementatielog

*Bijgewerkt tijdens uitvoering. Voor latere update van ARCHITECTURE.md en boilerplate-docs.*

### Gemaakte keuzes

| Beslispunt | Keuze | Verantwoording |
|------------|-------|----------------|
| **Stap 2.0: Query keys locatie** | `features/*/api/keys.ts` (api-map in projectStructure) | Gekozen voor de api-map i.p.v. `features/*/services/queryKeys.ts`. Reden: duidelijke scheiding – api-map voor query keys en fetchers, services voor pure API-calls. Schaalbaarder bij veel features. |
| **Stap 1.2: DevTools** | Geïnstalleerd | Handig voor development; alleen in devDependencies. |
| **Stap 1.3: ESLint plugin** | Geïnstalleerd + `exhaustive-deps` op warn | Voorkomt incomplete query keys; warn i.p.v. error om migratie soepel te houden. |
| **Shared vs feature keys** | Shared voor user/config, feature-based voor rest | User en config zijn cross-cutting; overige data per feature in `features/*/api/keys.ts`. |
| **Stap 4: Auth-boundary** | Singleton `queryClient.clear()` in authService.logout | Cache legen vóór signOut; voorkomt dat user A data zichtbaar is na login van user B. |
| **Stap 5: useUserProfile** | Service extractie + useUserProfileQuery + wrapper | userProfileService.ts voor fetch; useUserProfile blijft bestaande interface; UserProfile naar auth.types. |
| **Stap 5.5: Mutations** | useUpdateUserProfile als voorbeeld | Concreet voorbeeld in auth; invalidatiepatronen in DOC_TANSTACK_QUERY.md. |
| **Stap 6: useConfigurationData** | useConfigurationQuery + wrapper | fetchConfigSection in configService; useConfigurationData behoudt bestaande interface. |

### Voortgang

| Stap | Status | Datum |
|------|--------|-------|
| 1 | Voltooid | 2026-02-27 |
| 2.0 | Voltooid | 2026-02-27 |
| 2 | Voltooid | 2026-02-27 |
| 3 | Voltooid | 2026-02-27 |
| 4 | Voltooid | 2026-02-27 |
| 5 | Voltooid | 2026-02-27 |
| 5.5 | Voltooid | 2026-02-27 |
| 6 | Voltooid | 2026-02-27 |
| 7 | Voltooid | 2026-02-26 |
| 6.5 | Voltooid | 2026-02-26 |
| 6.6 | Voltooid | 2026-02-26 |
| 6.7 | Voltooid | 2026-02-26 |
| 8 | Voltooid | 2026-02-26 |
| 9 | Voltooid | 2026-02-26 |

### Architecture docs – later bijwerken

Na afronding van de implementatie moeten deze docs worden bijgewerkt:

- **ARCHITECTURE.md**: Sectie over server state management en TanStack Query; feature-structuur met `api/` map; QueryProvider in provider-hiërarchie
- **`.cursor/rules/architecture/RULE.md`**: Eventueel `api` map in folder structure; path alias voor query-gerelateerde imports indien gewenst
- **`projectStructure.config.cjs`**: Al bijgewerkt (api-map toegevoegd)

---

## Stappenoverzicht

| Stap | Beschrijving                                    | Geschatte tijd |
| ---- | ----------------------------------------------- | -------------- |
| 1    | Dependencies en basisconfiguratie               | 30 min         |
| 2    | Query keys (feature-based) en QueryClient setup | 60 min         |
| 2.0  | Project structure: api-map toevoegen            | 15 min         |
| 3    | QueryProvider en App-integratie                 | 30 min         |
| 4    | Auth-boundary (cache clear bij logout)          | 30 min         |
| 5    | Migratie useUserProfile                         | 45 min         |
| 5.5  | Mutations: voorbeeld en invalidatiepatronen     | 45 min         |
| 6    | Migratie useConfigurationData                   | 45 min         |
| 6.5  | (Optioneel) Prefetching strategie               | 30 min         |
| 6.6  | (Optioneel) React.lazy + Suspense integratie    | 30 min         |
| 6.7  | (Optioneel) Query Error Boundary                | 30 min         |
| 7    | Test utilities en bestaande tests aanpassen     | 45 min         |
| 8    | Documentatie                                    | 45 min         |
| 9    | Validatie en cleanup                            | 45 min         |

---

## Stap 1: Dependencies en basisconfiguratie

### 1.1 Package installeren

```bash
pnpm add @tanstack/react-query
```

### 1.2 (Optioneel) DevTools voor development

```bash
pnpm add -D @tanstack/react-query-devtools
```

### 1.3 (Optioneel) ESLint plugin voor query keys

```bash
pnpm add -D @tanstack/eslint-plugin-query
```

Voeg toe aan `eslint.config.js` indien gewenst voor `exhaustive-deps` op query keys.

### Deliverables

- [x] `@tanstack/react-query` in `package.json` dependencies
- [x] DevTools geïnstalleerd (`@tanstack/react-query-devtools`)
- [x] ESLint plugin geïnstalleerd en geconfigureerd (`@tanstack/eslint-plugin-query`, `exhaustive-deps` op warn)

---

## Stap 2.0: Project structure – api-map toevoegen

**Bestand:** `projectStructure.config.cjs`

**Wijziging:** Voeg `api` map toe aan feature-structuur (zowel nested als flat) voor API-gerelateerde code (query keys, fetchers).

**Nested features** (na `store`, rond regel 167):

```javascript
{
  name: "api",
  children: [{ name: "*.ts" }],
},
```

**Flat features** (na `store`, rond regel 224):

```javascript
{
  name: "api",
  children: [{ name: "*.ts" }],
},
```

**Alternatief:** Gebruik `features/*/services/queryKeys.ts` als je geen projectStructure-wijziging wilt – keys in services is ook valide.

**→ Gekozen:** api-map in projectStructure (zie Keuzes en implementatielog).

### Deliverables

- [x] `api` map toegevoegd aan `projectStructure.config.cjs`
- [ ] ~~Besluit: keys in `features/*/services/queryKeys.ts`~~ (niet gekozen)

---

## Stap 2: Query keys (feature-based) en QueryClient setup

### 2.1 Feature-based query keys

**Strategie:** Elke feature beheert eigen keys. Cross-cutting keys (user, config) blijven in shared.

**Shared keys** (cross-cutting, gebruikt door meerdere features):

**Bestand:** `src/shared/utils/queryKeys.ts`

```typescript
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
```

**Feature-based keys** (per feature):

**Bestand:** `src/features/projects/api/keys.ts` (voorbeeld voor toekomstige projects-feature)

```typescript
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.all, "list", filters] as const,
  detail: (slug: string) => [...projectKeys.all, "detail", slug] as const,
} as const;
```

**Conventies:**

- Hiërarchie: `[resource, subResource?, ...params]`
- `as const` voor type-safety
- Gebruik spread voor afgeleide keys: `[...projectKeys.all, "list"]`
- Bij 3+ features: altijd feature-based; shared alleen voor user/config

### 2.2 QueryClient configuratie

**Bestand:** `src/shared/utils/queryClient.ts`

**Strategie:** Begin met defaults, override per feature indien nodig.

```typescript
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 min default
        gcTime: 1000 * 60 * 30, // 30 min cache
        refetchOnWindowFocus: true,
        retry: (failureCount, error) => {
          // Geen retry bij 404 – pas aan op basis van jouw API error-structuur
          if (
            error &&
            typeof error === "object" &&
            "status" in error &&
            (error as { status: number }).status === 404
          ) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 0,
      },
    },
  });

export const queryClient = createQueryClient();
```

**Override per query:** Bij specifieke behoeften (bijv. realtime data met `staleTime: 0`).

### Deliverables

- [x] `src/shared/utils/queryKeys.ts` met shared keys (user, config)
- [ ] (Optioneel) `src/features/projects/api/keys.ts` als voorbeeld voor feature-based keys
- [x] `src/shared/utils/queryClient.ts` met defaults en singleton export

---

## Stap 3: QueryProvider en App-integratie

### 3.1 QueryProvider component

**Bestand:** `src/shared/context/QueryProvider.tsx`

**Inhoud:**

- Wrapper rond `QueryClientProvider` van TanStack
- Gebruikt `createQueryClient()` voor de client
- Exporteert de provider component

### 3.2 App.tsx aanpassen

**Wijziging:** `QueryProvider` als buitenste provider toevoegen (boven `AuthProvider`), zodat `queryClient` beschikbaar is voor logout-handler.

**Volgorde:**

```
QueryClientProvider
  └── AuthProvider
        └── BrowserRouter
              └── AppContent
```

### 3.3 (Optioneel) React Query DevTools

Toevoegen in `QueryProvider` of `App.tsx`, alleen in development.

### Deliverables

- [x] `src/shared/context/QueryProvider.tsx` aangemaakt
- [x] `App.tsx` gewijzigd met `QueryProvider` als root provider
- [ ] App start zonder errors (handmatig verifiëren)

---

## Stap 4: Auth-boundary (cache clear bij logout)

### 4.1 QueryClient beschikbaar maken voor logout

**Optie A:** `queryClient` als singleton exporteren uit `queryClient.ts` en importeren in auth-logout handler.

**Optie B:** `useQueryClient()` hook in een component die binnen `QueryClientProvider` zit – auth-logout wordt aangeroepen vanuit een component die al binnen de provider zit, dus `useQueryClient()` kan in de logout-handler via een hook in de AuthProvider.

**Aanbeveling:** Singleton `queryClient` exporteren uit `queryClient.ts` en in de logout-functie `queryClient.clear()` aanroepen vóór `signOut()`.

### 4.2 Logout handler aanpassen

**Locatie:** Waar logout wordt afgehandeld (bijv. `useAuth`, `AuthContext`, of auth feature).

**Wijziging:**

1. Import `queryClient` uit `@shared/utils/queryClient`
2. Roep `queryClient.clear()` aan vóór `supabase.auth.signOut()`

### Deliverables

- [x] `queryClient` singleton geëxporteerd (of toegankelijk voor logout)
- [x] Logout roept `queryClient.clear()` aan (in authService.logout, vóór signOut)
- [ ] Geen user-data zichtbaar na login van andere user (handmatig verifiëren) — **overgeslagen:** boilerplate heeft nog geen login geconfigureerd; testen zodra Supabase auth actief is

---

## Stap 5: Migratie useUserProfile

### 5.1 Nieuwe hook: useUserProfileQuery

**Bestand:** `src/features/auth/hooks/useUserProfileQuery.ts`

**Inhoud:**

- `useQuery` met `sharedQueryKeys.user.profile(userId)`
- `queryFn` die huidige fetch-logica uit `useUserProfile` aanroept (of service)
- `enabled: !!userId`
- `staleTime` en `gcTime` voor user profile (bijv. 5 min / 30 min)

### 5.2 Service extractie (indien nodig)

Als fetch-logica nu in de hook zit: verplaatsen naar `src/features/auth/services/userProfileService.ts` als pure functie.

### 5.3 useUserProfile als wrapper (tijdelijk)

**Wijziging:** `useUserProfile` laat intern `useUserProfileQuery` aanroepen en mapt het resultaat naar de bestaande interface (`profile`, `loading`, `error`, `refetch`).

### 5.4 Consumenten controleren

Controleren of alle gebruikers van `useUserProfile` nog correct werken (ProfileMenu, ProfileInfo, etc.).

### Deliverables

- [x] `useUserProfileQuery.ts` aangemaakt
- [x] `userProfileService.ts` aangemaakt (fetch-logica geëxtraheerd)
- [x] `UserProfile` en `UserRole` type verplaatst naar `auth.types.ts`
- [x] `useUserProfile` gebruikt `useUserProfileQuery` (geen breaking changes)
- [x] Bestaande componenten werken zonder wijziging (tests slagen)
- [ ] (Optioneel) Consumenten direct naar `useUserProfileQuery` migreren

---

## Stap 5.5: Mutations – voorbeeld en invalidatiepatronen

### 5.5.1 Mutation hook voorbeeld

**Bestand:** `src/features/projects/hooks/useCreateProject.ts` (voorbeeld voor toekomstige feature)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@features/projects/api/keys";
import { ProjectService } from "@features/projects/services/projectService";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};
```

### 5.5.2 Invalidatiepatronen

| Mutatie             | Invalideer                                      | Niet invalideren           |
| ------------------- | ----------------------------------------------- | -------------------------- |
| Create project      | `projectKeys.lists()`                           | Detail (nog niet bestaand) |
| Update project      | `projectKeys.detail(id)`, `projectKeys.lists()` | Andere features            |
| Delete project      | `projectKeys.detail(id)`, `projectKeys.lists()` | User, config               |
| Update user profile | `sharedQueryKeys.user.profile(userId)`          | Config, projects           |

**Regel:** Invalideer alleen direct gerelateerde keys. Geen brede `invalidateQueries({ queryKey: [] })`.

### 5.5.3 Optimistic updates (optioneel)

Alleen voor snelle, reversibele acties (toggles, likes). Niet voor: betalingen, account-wijzigingen.

```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) });
  const previous = queryClient.getQueryData(projectKeys.detail(id));
  queryClient.setQueryData(projectKeys.detail(id), newData);
  return { previous };
},
onError: (_err, _vars, context) => {
  if (context?.previous) {
    queryClient.setQueryData(projectKeys.detail(id), context.previous);
  }
},
```

### 5.5.4 Documentatie

Voeg invalidatiepatronen toe aan `documentation/DOC_TANSTACK_QUERY.md`.

### Deliverables

- [x] Voorbeeld mutation hook: `useUpdateUserProfile` (auth feature)
- [x] `userProfileService.updateUserProfile` toegevoegd
- [x] Invalidatiepatronen gedocumenteerd in DOC_TANSTACK_QUERY.md
- [x] Optimistic update voorbeeld in documentatie (optioneel patroon)

---

## Stap 6: Migratie useConfigurationData

### 6.1 Nieuwe hook: useConfigurationQuery

**Bestand:** `src/features/setup/hooks/useConfigurationQuery.ts`

**Inhoud:**

- `useQuery` met `sharedQueryKeys.config.section(section)`
- `queryFn` die `/api/read-config` aanroept en de juiste sectie extraheert
- `staleTime` en `gcTime` voor config (bijv. 10 min / 1 uur)

### 6.2 useConfigurationData als wrapper (tijdelijk)

**Wijziging:** `useConfigurationData` roept `useConfigurationQuery` aan en mapt naar de bestaande interface.

### 6.3 Consumenten controleren

Controleren of alle gebruikers van `useConfigurationData` nog correct werken (SetupPage, secties, etc.).

### Deliverables

- [x] `useConfigurationQuery.ts` aangemaakt
- [x] `fetchConfigSection` toegevoegd aan configService
- [x] `useConfigurationData` gebruikt `useConfigurationQuery` (geen breaking changes)
- [x] Setup-wizard en config-views werken correct (tests slagen)

---

## Stap 6.5: (Optioneel) Prefetching strategie

### 6.5.1 usePrefetch hook

**Bestand:** `src/shared/hooks/usePrefetch.ts`

```typescript
import { useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@features/projects/api/keys";
import { fetchProjects } from "@features/projects/services/projectService";

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  return {
    prefetchProjects: () => {
      queryClient.prefetchQuery({
        queryKey: projectKeys.lists(),
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};
```

### 6.5.2 Gebruik in navigatie

```tsx
<Link to="/projects" onMouseEnter={prefetchProjects}>
  Projecten
</Link>
```

**Regel:** Alleen prefetchen voor kritieke routes. Niet op alle links – meet eerst of het nodig is.

### Deliverables

- [x] `usePrefetch` hook aangemaakt (`src/shared/hooks/usePrefetch.ts`)
- [x] Prefetch op hover voor Setup-links (Topbar, HomePage)
- [x] Documentatie: DOC_TANSTACK_QUERY.md sectie Prefetching

---

## Stap 6.6: (Optioneel) React.lazy + Suspense integratie

### 6.6.1 Lazy loading van pagina's

**Voordeel:** Bundle splitting per route + cached data = snelle navigatie.

```tsx
// App.tsx
const ProjectsPage = lazy(() => import("@pages/ProjectsPage"));

<QueryProvider>
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  </Suspense>
</QueryProvider>;
```

### 6.6.2 Combinatie

- Pagina laadt pas bij navigeren (code splitting)
- Data komt uit TanStack Query cache (snel bij terugkeer)
- Suspense fallback tijdens lazy load; query heeft eigen loading state

### Deliverables

- [x] Lazy loading voor HomePage en SetupPage
- [x] PageLoadingState component als Suspense fallback
- [x] Documentatie: DOC_TANSTACK_QUERY.md sectie Lazy loading

---

## Stap 6.7: (Optioneel) Query Error Boundary

### 6.7.1 QueryErrorBoundary component

**Bestand:** `src/components/common/QueryErrorBoundary/QueryErrorBoundary.tsx`

**Optie A:** Met `react-error-boundary` (indien geïnstalleerd: `pnpm add react-error-boundary`)

```tsx
import { ErrorBoundary } from "react-error-boundary";

export const QueryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallback={<ErrorState onRetry={() => window.location.reload()} />}
    onError={(error) => console.error("Query error:", error)}
  >
    {children}
  </ErrorBoundary>
);
```

**Optie B:** Eigen class-based Error Boundary (geen extra dependency).

**Let op:** TanStack Query heeft geen eigen `QueryError`; gebruik generieke `Error`/`unknown`. De boundary vangt alle errors in de child tree.

### 6.7.2 Plaatsing

Wrap route-level content of specifieke secties waar query errors afgehandeld moeten worden.

### Deliverables

- [x] `QueryErrorBoundary` component (class-based, geen extra dependency)
- [x] Error fallback UI met Retry-knop (reload)
- [x] Plaatsing: rond Suspense + Routes in App.tsx

---

## Stap 7: Test utilities en bestaande tests aanpassen

### 7.1 QueryClient test wrapper

**Bestand:** `tests/test-utils.tsx` of `src/shared/utils/testUtils.tsx`

**Inhoud:**

- `createTestQueryClient()` – QueryClient met `retry: false` voor tests
- `createQueryClientWrapper()` – React component die `QueryClientProvider` wrapt

### 7.2 Bestaande tests aanpassen

**Bestanden die mogelijk wijziging nodig hebben:**

- `src/components/common/ProfileMenu/ProfileMenu.test.tsx` (gebruikt `useUserProfile`)
- Andere tests die `useUserProfile` of `useConfigurationData` mocken

**Aanpak:** Componenten die queries gebruiken wrappen met `createQueryClientWrapper()` of de mock zo aanpassen dat deze binnen een QueryClientProvider werkt.

### Deliverables

- [x] Test utility voor QueryClient beschikbaar (`tests/test-utils.tsx`)
- [x] Bestaande tests slagen (87/87)
- [x] `pnpm test:run` groen

### Uitgevoerd

- `createTestQueryClient()` – retry: false, gcTime: 0
- `createQueryClientWrapper()` – wrapper voor `render(..., { wrapper })`
- ProfileMenu.test.tsx mockt `useUserProfile` – geen wijziging nodig
- DOC_TANSTACK_QUERY.md sectie Testing uitgebreid met voorbeeld en wanneer wrapper vs mock

---

## Stap 8: Documentatie

### 8.1 Permanente documentatie

**Bestand:** `documentation/DOC_TANSTACK_QUERY.md`

**Inhoud:**

- Overzicht van de implementatie
- **Query key conventies:** feature-based vs shared, voorbeelden
- **Stale/gc times:** defaults (5 min / 30 min), override per feature, tabel per datatype
- **Invalidatie-regels:** patronen per mutatie-type, wat wel/niet invalideren
- **Auth-boundaries:** logout = `queryClient.clear()`
- **Mutations:** voorbeelden, onSuccess invalidatie, optimistic updates (waar van toepassing)
- **Prefetching:** wanneer wel/niet, usePrefetch voorbeeld
- **Lazy + Suspense:** combinatie met TanStack Query
- **Error handling:** QueryErrorBoundary, retry-logica
- **Testing-aanpak:** createTestQueryClient, createQueryClientWrapper
- **Migratie-strategie:** voor nieuwe features, generieke patterns (useEntityList, useEntityDetail)

### 8.2 Feature README updates

- `src/features/auth/README.md` – vermelden dat `useUserProfileQuery` de primaire hook is
- `src/features/setup/README.md` – vermelden dat `useConfigurationQuery` de primaire hook is

### 8.3 ARCHITECTURE.md (optioneel)

Korte sectie over server state management en TanStack Query toevoegen.

### Deliverables

- [x] `documentation/DOC_TANSTACK_QUERY.md` – compleet met alle secties, migratie-strategie, retry-logica
- [x] Feature READMEs bijgewerkt (auth, setup – TanStack Query hooks vermeld)
- [x] ARCHITECTURE.md uitgebreid – sectie Server State Management, api-map in feature structuur

---

## Stap 9: Validatie en cleanup

### 9.1 Validatie-commando's

```bash
pnpm validate:structure
pnpm arch:check
pnpm lint
pnpm type-check
pnpm test:run
```

### 9.2 Handmatige verificatie

- [ ] App start met `pnpm dev` (handmatig te verifiëren)
- [ ] Login/logout werkt; cache wordt geleegd bij logout
- [ ] ProfileMenu toont correcte user data
- [ ] Setup-wizard laadt config correct
- [ ] Navigatie terug naar eerder bezochte pagina toont gecachte data (geen nieuwe load)

### 9.3 Boilerplate-specifieke validatie

- [x] Feature-based query keys werken (auth, setup)
- [x] Lazy loading + TanStack Query combinatie geïmplementeerd
- [x] Prefetching werkt op hover (Setup-links)
- [x] Mutations invalideren correct (useUpdateUserProfile)
- [x] Error boundaries geïmplementeerd (QueryErrorBoundary)
- [x] DevTools zichtbaar in development
- [ ] Bundle size analyse (TanStack Query ~13kb gzipped) – optioneel

### 9.4 Cleanup

- [x] Lint errors opgelost (prettier, floating promises)
- [x] Deprecation comments bij useUserProfile en useConfigurationData
- [x] Implementatieplan bijgewerkt naar "Voltooid"
- [x] Root-level assets map verwijderd (structure validation)

### Deliverables

- [x] type-check, lint, validate:structure slagen
- [ ] Handmatige checks (app start, login/logout, navigatie) – door gebruiker uit te voeren
- [x] Boilerplate-specifieke checklist afgevinkt
- [x] Code opgeschoond

### Not covered by automated tests

The following are **not** covered by automated tests and require manual verification:

- App starts with `pnpm dev`
- Login/logout flow and cache clear on logout
- ProfileMenu shows correct user data after login
- Setup wizard loads config correctly
- Navigating back to a previously visited page shows cached data (no new API call)
- Prefetching on hover over Setup links (network tab or faster load)
- QueryErrorBoundary catches errors (e.g. by disabling network)
- DevTools visible in development

Unit tests (87/87) cover hooks and services; integration/e2e of the full flow is not automated.

---

## Risico's en mitigatie

| Risico                                           | Mitigatie                                                       |
| ------------------------------------------------ | --------------------------------------------------------------- |
| Breaking changes voor consumenten                | Oude hooks als thin wrappers behouden                           |
| Auth-context heeft geen toegang tot queryClient  | Singleton exporteren of queryClient via props/context doorgeven |
| Tests falen door ontbrekende QueryClientProvider | Test wrapper toevoegen en tests aanpassen                       |
| Dependency-cruiser of ESLint violations          | Layer rules en import-paden controleren                         |

---

## Volgorde van uitvoering

De stappen zijn zo opgezet dat ze grotendeels sequentieel kunnen worden uitgevoerd. Stap 4 (auth-boundary) kan parallel met stap 5 worden gedaan als de logout-handler al bekend is. Stap 7 (tests) kan na stap 5 en 6 worden uitgevoerd. Stappen 6.5, 6.6, 6.7 zijn optioneel en kunnen na stap 6 of 7.

**Aanbevolen volgorde:** 1 → 2.0 → 2 → 3 → 4 → 5 → 5.5 → 6 → [6.5, 6.6, 6.7] → 7 → 8 → 9

---

## Appendix A: Generieke query patterns

Voor nieuwe features: herbruikbare patronen naast de concrete migraties (useUserProfile, useConfigurationData).

### useEntityList pattern

```typescript
// features/projects/hooks/useProjectList.ts
export const useProjectList = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => ProjectService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};
```

### useEntityDetail pattern

```typescript
// features/projects/hooks/useProjectDetail.ts
export const useProjectDetail = (id: string | null) => {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: () => ProjectService.getById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};
```

### useFeatureData pattern

Generiek voor configuratie-achtige data: `useFeatureData<T>(key, fetcher, options)`.

### Toepassing

- Concreet: useUserProfile, useConfigurationData (bestaande boilerplate)
- Generiek: useProjectList, useProjectDetail (voorbeelden voor nieuwe features)
- Documenteer beide in DOC_TANSTACK_QUERY.md

---

## Checklist voor afronding

- [x] Stap 1 voltooid
- [x] Stap 2.0 voltooid (project structure)
- [x] Stap 2 voltooid
- [x] Stap 3 voltooid
- [x] Stap 4 voltooid
- [x] Stap 5 voltooid
- [x] Stap 5.5 voltooid (mutations)
- [x] Stap 6 voltooid
- [x] Stappen 6.5, 6.6, 6.7 (optioneel) voltooid
- [x] Stap 7 voltooid
- [x] Stap 8 voltooid
- [x] Stap 9 voltooid
- [x] CHANGELOG.md bijgewerkt met TanStack Query integratie
