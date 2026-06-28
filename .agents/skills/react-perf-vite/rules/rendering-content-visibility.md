# content-visibility for long lists

**Impact:** HIGH (long lists)

Defer layout/paint for off-screen rows.

```css
.task-row {
  content-visibility: auto;
  contain-intrinsic-size: 0 72px;
}
```

Apply to list item wrappers in large task/message lists.
