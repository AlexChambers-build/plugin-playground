# Explore Skill Examples

Concrete examples of research sessions and expected outputs.

---

## Example 1: Error Handling Research

### Query
"How should I handle database connection failures?"

### Process

**Step 1: Identify candidates**
- Keywords: database, connection, failures, error, handling
- Likely domains: scalability, data, anti-patterns

**Step 2: Scan frontmatter**
```
scalability-patterns.md:
  patterns: [circuit-breaker, retry-pattern, bulkhead, connection-pooling]
  keywords: [resilience, fault tolerance, failure]
  → Score: 12 (HIGH)

data-architecture-patterns.md:
  patterns: [repository-pattern]
  keywords: [database, persistence]
  → Score: 5 (HIGH)

anti-patterns.md:
  patterns: [n-plus-one]
  keywords: [database]
  → Score: 3 (MEDIUM)
```

**Step 3: Read relevant sections**
- scalability lines 353-450 (Circuit Breaker)
- scalability lines 523-620 (Retry Patterns)
- scalability lines 1003-1100 (Connection Pooling)

**Step 4: Synthesize**

### Output

```markdown
## Research Findings: Database Connection Failure Handling

### Relevance Summary
- **Primary**: scalability-patterns.md > Circuit Breaker (HIGH)
- **Secondary**: Retry Patterns, Connection Pooling
- **Related**: anti-patterns.md > N+1 Query Problem

### Key Findings

#### Circuit Breaker Pattern
**Source**: scalability-patterns.md lines 353-450
**Summary**: Prevents cascading failures by failing fast when a database
is unavailable. Uses three states (Closed→Open→Half-Open) with configurable
thresholds. When failures exceed threshold, circuit "opens" and requests
fail immediately without attempting the database call.
**Best for**: Preventing cascade failures, protecting recovering systems

#### Retry with Exponential Backoff
**Source**: scalability-patterns.md lines 523-620
**Summary**: Automatically retry failed operations with increasing delays
(1s, 2s, 4s, 8s...) plus random jitter. Handles transient failures while
avoiding thundering herd on recovery.
**Best for**: Transient network issues, brief unavailability

#### Connection Pooling
**Source**: scalability-patterns.md lines 1003-1100
**Summary**: Maintain a pool of reusable connections instead of creating
new ones per request. Handles connection lifecycle, validates connections
before use, and manages pool size.
**Best for**: Reducing connection overhead, managing connection limits

### Comparison

| Factor | Circuit Breaker | Retry | Pooling |
|--------|-----------------|-------|---------|
| Purpose | Fail fast | Eventually succeed | Efficient connections |
| When | Service down | Transient failures | Always |
| Overhead | State tracking | Delay time | Memory for pool |

### Recommendation

Implement all three in layers:
1. **Connection Pool** at the base (always use)
2. **Retry with backoff** for transient failures
3. **Circuit Breaker** wrapping the retry for prolonged outages

This gives you efficient connections, automatic recovery from blips,
and protection against cascade failures.

### Anti-Patterns to Avoid
- **Infinite retry without backoff**: Can overwhelm recovering database
- **No timeout on connections**: Threads hang indefinitely
- **Ignoring pool exhaustion**: Silent failures when pool is empty

### Next Steps
- `/deep-dive scalability circuit-breaker` - Implementation details
- `/deep-dive scalability retry-patterns` - Backoff algorithms
- `/explore-compare circuit-breaker bulkhead` - Resilience pattern comparison
```

---

## Example 2: Authentication Research

### Query
"What's the best way to implement authentication for an API?"

### Process

**Step 1: Scan frontmatter**
```
security-patterns.md:
  patterns: [mfa, oauth2, jwt, passwordless]
  keywords: [authentication, auth, login]
  → Score: 15 (HIGH)

api-design-patterns.md:
  patterns: [jwt, oauth, authentication]
  keywords: [API, authentication]
  → Score: 8 (HIGH)
```

**Step 2: Read sections**
- security lines 22-250 (Authentication Patterns)
- api lines 1253-1319 (Authentication Patterns)

### Output

```markdown
## Research Findings: API Authentication

### Relevance Summary
- **Primary**: security-patterns.md > Authentication Patterns (HIGH)
- **Secondary**: api-design-patterns.md > Authentication Patterns (HIGH)

### Key Findings

#### JWT (JSON Web Tokens)
**Source**: security-patterns.md, api-design-patterns.md
**Summary**: Stateless tokens containing encoded claims, signed by server.
Client sends token in Authorization header. No server-side session storage.
**Best for**: Stateless APIs, microservices, mobile apps

#### OAuth 2.0 / OpenID Connect
**Source**: security-patterns.md lines 89-150
**Summary**: Delegated authorization framework. Users authenticate with
identity provider (Google, GitHub), your API receives tokens. PKCE flow
recommended for SPAs and mobile.
**Best for**: Third-party login, delegated access, enterprise SSO

#### API Keys
**Source**: api-design-patterns.md lines 1253-1280
**Summary**: Simple static tokens for server-to-server communication.
Easy to implement but limited security (no expiration, no user context).
**Best for**: Internal services, simple integrations, rate limiting

### Comparison

| Factor | JWT | OAuth 2.0 | API Keys |
|--------|-----|-----------|----------|
| Complexity | Medium | High | Low |
| Stateless | Yes | Depends | Yes |
| User context | Yes | Yes | No |
| Expiration | Built-in | Yes | Manual |
| Third-party auth | No | Yes | No |

### Recommendation

**For a typical API:**
1. Use **JWT** for user authentication (stateless, scalable)
2. Add **OAuth 2.0** if you need third-party login
3. Use **API Keys** only for service-to-service calls

**Security essentials:**
- Short JWT expiration (15 min) + refresh tokens
- HTTPS only
- Store tokens securely (httpOnly cookies or secure storage)

### Anti-Patterns to Avoid
- **Long-lived JWTs**: Can't be revoked if compromised
- **Tokens in URLs**: Leaked in logs and referrer headers
- **Rolling your own crypto**: Use established libraries

### Next Steps
- `/deep-dive security jwt` - JWT implementation details
- `/deep-dive security oauth` - OAuth 2.0 flows
- `/explore-compare jwt session` - Stateless vs stateful auth
```

---

## Example 3: Architecture Decision

### Query
"Should I use microservices or monolith?"

### Output Format

```markdown
## Research Findings: Microservices vs Monolith

### Key Findings

#### Monolithic Architecture
**Source**: backend-architecture-patterns.md lines 22-85
**Summary**: Single deployable unit, shared database, simpler operations.
**Best for**: Small teams, new products, unclear domain boundaries

#### Microservices Architecture
**Source**: backend-architecture-patterns.md lines 87-160
**Summary**: Independent services, decentralized data, complex operations.
**Best for**: Large teams, clear domains, independent scaling needs

#### Modular Monolith (Middle Ground)
**Source**: backend-architecture-patterns.md lines 533-592
**Summary**: Monolith with strict module boundaries. Easier to split later.
**Best for**: Growing teams, evolving domains, future flexibility

### Comparison

| Factor | Monolith | Microservices | Modular Monolith |
|--------|----------|---------------|------------------|
| Initial speed | Fast | Slow | Medium |
| Team independence | Low | High | Medium |
| Operational complexity | Low | High | Low |
| Scaling | All together | Independent | All together |
| Future flexibility | Harder to split | Already split | Easy to split |

### Recommendation

**Start with Modular Monolith** unless you have:
- Large team (20+ engineers)
- Clear, stable domain boundaries
- DevOps expertise for distributed systems

The modular monolith gives you clean boundaries that can become
microservices later, without the upfront operational complexity.

### Anti-Patterns to Avoid
- **Distributed Monolith**: Microservices with tight coupling (worst of both)
- **Premature decomposition**: Splitting before understanding the domain

### Next Steps
- `/deep-dive backend modular-monolith` - Implementation approach
- `/explore-compare microservices monolith` - Detailed tradeoffs
- `/explore-scenario scaling existing app` - When to consider splitting
```
