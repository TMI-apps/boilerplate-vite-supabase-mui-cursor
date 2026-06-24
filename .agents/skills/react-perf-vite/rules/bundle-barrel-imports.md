# Avoid barrel imports (MUI, icons)

**Impact:** CRITICAL

Import from package subpaths, not barrel entry files. This repo already follows this pattern.

**Incorrect:**

```typescript
import { Button, TextField } from "@mui/material";
```

**Correct:**

```typescript
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
```

Vite has no Next.js `optimizePackageImports` — deep imports are the SSOT here.
