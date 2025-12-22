---
description: "Security best practices and vulnerability prevention"
alwaysApply: true
---

# Security Standards

## Purpose

This rule defines security best practices, vulnerability prevention, and secure coding standards.

## Database Verification

### Critical Requirement
- **NEVER** assume database structures, tables, or field names without verification
- **ALWAYS** check database schema using MCP (Model Context Protocol) tools before making assumptions
- Verify table names, column names, and data types before writing queries
- Don't rely on memory or assumptions about database structure

### Verification Process
1. Use MCP tools to list tables and schemas
2. Verify column names and types before querying
3. Check constraints and relationships
4. Validate data structure matches expectations

## Authentication & Authorization

### Authentication
- Never store passwords in plain text
- Use secure password hashing (bcrypt, Argon2)
- Implement proper session management
- Use secure, HTTP-only cookies for sessions

### Authorization
- Always verify user permissions before operations
- Use principle of least privilege
- Validate authorization at the API boundary
- Never trust client-side authorization checks

## Input Validation

### Sanitization
- Validate and sanitize all user inputs
- Use allowlists over denylists when possible
- Validate data types and ranges
- Reject invalid input early

### SQL Injection Prevention
- Use parameterized queries/prepared statements
- Never concatenate user input into SQL queries
- Use ORM query builders when available

### XSS Prevention
- Escape output appropriately for context (HTML, JavaScript, CSS)
- Use Content Security Policy (CSP) headers
- Sanitize user-generated content
- Use framework's built-in escaping mechanisms

## Data Protection

### Sensitive Data
- Never log sensitive information (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use HTTPS for all data in transit
- Implement proper key management

### Secrets Management
- Never commit secrets to version control
- Use environment variables or secret management services
- Rotate secrets regularly
- Use different secrets for different environments
- **Note**: There may be env files in the repo that you might not be able to see - respect their restrictions

## Examples

### ✅ Good Example

```typescript
// Input validation and parameterized queries
export async function getUserById(userId: string): Promise<User> {
  // Validate input
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  
  // Use parameterized query
  const user = await db.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [userId]
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

// Proper authorization check
export async function deleteUser(
  requestingUserId: string,
  targetUserId: string,
): Promise<void> {
  // Verify authorization
  const requester = await getUserById(requestingUserId);
  if (!requester.isAdmin && requester.id !== targetUserId) {
    throw new Error('Unauthorized');
  }
  
  await db.query('DELETE FROM users WHERE id = $1', [targetUserId]);
}
```

### ❌ Bad Example

```typescript
// Bad: SQL injection, no validation, no authorization
export async function getUserById(userId: string) {
  // Dangerous: SQL injection vulnerability
  const user = await db.query(
    `SELECT * FROM users WHERE id = '${userId}'`
  );
  return user;
}

export async function deleteUser(userId: string) {
  // No authorization check
  await db.query(`DELETE FROM users WHERE id = '${userId}'`);
}
```

## Security Headers

### HTTP Headers
- Implement Content Security Policy (CSP)
- Use HTTPS-only cookies
- Set appropriate CORS headers
- Include security headers (X-Content-Type-Options, X-Frame-Options)

## Dependency Management

### Updates
- Keep dependencies up to date
- Monitor for security vulnerabilities
- Use dependency scanning tools
- Review dependency changes before updating

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `architecture/RULE.md` - Security boundaries and architectural patterns
- `code-style/RULE.md` - Code style for security-related code
- `workflow/RULE.md` - Security review processes
- `cloud-functions/RULE.md` - Security considerations for function organization

**Rules that reference this rule:**
- `architecture/RULE.md` - May reference security patterns
- `testing/RULE.md` - May reference security testing requirements
- `cloud-functions/RULE.md` - References security considerations

