# RAG for Dynamic Prompts - Research Document

**Date:** 2025-01-19  
**Goal:** Replace current LLM-based analyzer with vector search/RAG system for matching user queries to relevant dynamic prompts

**Critical Requirement:** Must create testing/validation tool FIRST before replacing existing analyzer. Testing tool will be accessible via admin dashboard debug tools section.

## Executive Summary

This document collects research and implementation patterns for implementing RAG (Retrieval Augmented Generation) to replace the current LLM-based analyzer system for dynamic prompt relevance matching.

### Current State
- ✅ pgvector extension already installed (v0.8.0)
- ✅ 18 dynamic instructions in database
- ❌ No embedding column on `dynamic_instructions` table
- ❌ Required extensions (pgmq, pg_net, pg_cron, hstore) not installed
- ❌ No vector indexes or search functions

### Implementation Requirements
1. Install extensions: pgmq, pg_net, pg_cron, hstore
2. Add `embedding vector(384)` column to `dynamic_instructions` table
3. Create utility functions and queue system for automatic embedding generation
4. Implement Edge Function using `Supabase.ai.Session('gte-small')` for embedding generation
5. Create semantic search function `match_dynamic_instructions`
6. Create HNSW index for fast similarity search
7. Backfill embeddings for existing 18 instructions
8. **Initial:** Create admin debug page at `/admin/debug/rag` for testing
9. **Future:** Replace LLM analyzer calls with vector search in frontend

### Quick Design Summary

| Aspect | Decision |
|--------|----------|
| **Embedding Content** | `knowledge_key` only (matches current analyzer) |
| **Query Context** | Last ~512 tokens, let model truncate automatically |
| **Scoring** | Cosine distance → similarity: `1 - distance` |
| **Thresholds** | Use existing thresholds (0.5-0.7), filter in app code |
| **Fallback** | Return empty result (graceful degradation) |
| **User-Scoped** | Ignore for now (future feature, treat all equally) |
| **Assistant Filter** | Filter in SQL via `assistant_dynamic_instructions` join |
| **Migration** | Start in `/admin/debug/rag`, test before replacing |
| **Error Handling** | User-friendly messages, graceful degradation |

---

## Current System Overview

### Dynamic Instructions Table Structure

The `dynamic_instructions` table stores dynamic prompts that can be conditionally included based on message content:

```sql
CREATE TABLE dynamic_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,                    -- Instruction key/identifier
  knowledge_key TEXT NOT NULL,          -- Knowledge base key for similarity matching
  dynamic_prompt TEXT NOT NULL,         -- Instruction text to include
  "order" INTEGER DEFAULT 0,           -- Display/application order
  threshold NUMERIC(3, 1) DEFAULT 0.7,  -- Similarity threshold (0.0-1.0)
  scope instruction_scope DEFAULT 'global', -- 'global' or 'user'
  user_id UUID REFERENCES users(id),     -- NULL for global, set for user-scoped
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields for RAG:**
- `knowledge_key`: Currently used as a text description for the LLM analyzer. This will become the searchable text for embeddings.
- `dynamic_prompt`: The actual instruction text that gets appended to system prompts when relevant.
- `threshold`: Minimum similarity score (0.0-1.0) required to include the instruction.

### Current Analyzer System

**How it works:**
1. When a user sends a message, an analyzer model (GPT-4o-mini) evaluates each dynamic instruction
2. Scores each instruction from 0.0 (not relevant) to 1.0 (essential)
3. Includes instructions that exceed their threshold
4. Orders by score (most relevant first)

**Current Implementation:**
- Analyzer runs before main AI model
- Uses lightweight model (GPT-4o-mini) for cost efficiency
- Average response time: 200-500ms
- Cost: ~$0.0001-0.0003 per message
- Two AI calls per message: analyzer + main completion

**Location:**
- `src/shared/context/AnalyzerContext.tsx` - Main analyzer logic
- `src/features/chat/services/openaiService.ts` - Analyzer API calls
- `src/features/chat/services/analyzerHelpers.ts` - Helper functions

### Assistant-Dynamic Instructions Relationship

Assistants can have multiple dynamic instructions via the `assistant_dynamic_instructions` junction table:

```sql
CREATE TABLE assistant_dynamic_instructions (
  assistant_id UUID NOT NULL REFERENCES assistants(id) ON DELETE CASCADE,
  dynamic_instruction_id UUID NOT NULL REFERENCES dynamic_instructions(id) ON DELETE CASCADE,
  PRIMARY KEY (assistant_id, dynamic_instruction_id)
);
```

This means we need to filter dynamic instructions by assistant when performing vector search.

### Global vs User-Scoped Instructions

**Note:** User-scoped instructions are a future feature. Current implementation treats all instructions equally.

Dynamic instructions have two scopes in the database schema:

**Global Instructions** (`scope = 'global'`, `user_id = NULL`):
- Created by admins
- Available to all users
- Example: "Image generation", "Presentation design"
- **Current state:** All 18 existing instructions are global

**User-Scoped Instructions** (`scope = 'user'`, `user_id = <user's UUID>`):
- **Future feature:** Not implemented yet
- Would be created by individual users
- Would only be visible to that specific user
- Example: User John creates "My custom coding style" instruction

**For RAG Search (Current Implementation):**
- **Simplified:** Search all dynamic instructions, ignore `scope` and `user_id` fields
- **Future:** Can add filtering when user-scoped feature is implemented
- **Current:** All instructions are global, so no filtering needed

---

## Goal: RAG-Based Dynamic Prompt Matching

### Objectives

1. **Replace LLM Analyzer** with vector search for faster, more cost-effective relevance matching
2. **Auto-generate embeddings** for dynamic prompts when they are created/updated
3. **Use semantic search** to find most relevant dynamic prompts based on user query
4. **Maintain threshold-based filtering** - only include prompts above their threshold
5. **Support conversation context** - consider past couple of queries for better matching

### Benefits Over Current System

- **Speed**: Vector search is typically faster than LLM API calls (milliseconds vs hundreds of milliseconds)
- **Cost**: No per-message analyzer API call cost
- **Scalability**: Can handle many dynamic prompts efficiently with proper indexing
- **Consistency**: Deterministic similarity scores vs LLM variability

---

## Supabase Vector Search Architecture

### Core Components

Based on Supabase documentation, we'll need:

1. **pgvector extension** - For storing and querying vector embeddings
2. **Automatic embedding generation** - Using triggers, queues, and Edge Functions
3. **Semantic search function** - To find similar dynamic prompts
4. **gte-small model** - Built-in Supabase embedding model (384 dimensions)

### pgvector Extension

**Enable the extension:**
```sql
create extension if not exists vector
with schema extensions;
```

**Vector column type:**
- `vector(n)` - Full precision (32-bit floats)
- `halfvec(n)` - Half precision (16-bit floats) - saves space
- `sparsevec(n)` - Sparse vectors

For `gte-small` (384 dimensions), we'll use:
```sql
embedding vector(384)  -- or halfvec(384) to save space
```

### Similarity Metrics

pgvector supports 3 distance operators:

| Operator | Description | Use Case |
|----------|-------------|----------|
| `<->` | Euclidean distance | General purpose |
| `<#>` | Negative inner product | Fastest if vectors normalized |
| `<=>` | Cosine distance | Safe default, good for text |

**Recommendation:** Use cosine distance (`<=>`) as default since we don't know if embeddings are normalized.

---

## Automatic Embedding Generation Pattern

### Architecture Overview

Supabase recommends using:
1. **Triggers** - Detect when content changes
2. **pgmq** - Queue embedding generation jobs
3. **pg_net** - Make async HTTP requests to Edge Functions
4. **pg_cron** - Process queue and retry failed jobs
5. **Edge Functions** - Generate embeddings via API

### Step-by-Step Pattern

#### 1. Enable Required Extensions

```sql
-- For vector operations
create extension if not exists vector with schema extensions;

-- For queueing and processing jobs
create extension if not exists pgmq;

-- For async HTTP requests
create extension if not exists pg_net with schema extensions;

-- For scheduled processing and retries
create extension if not exists pg_cron;

-- For clearing embeddings during updates
create extension if not exists hstore with schema extensions;
```

#### 2. Create Utility Functions

**Project URL function** (needed for Edge Function invocation):
```sql
create schema util;

create function util.project_url()
returns text
language plpgsql
security definer
as $$
declare
  secret_value text;
begin
  select decrypted_secret into secret_value 
  from vault.decrypted_secrets 
  where name = 'project_url';
  return secret_value;
end;
$$;
```

**Generic Edge Function invoker:**
```sql
create or replace function util.invoke_edge_function(
  name text,
  body jsonb,
  timeout_milliseconds int = 5 * 60 * 1000
)
returns void
language plpgsql
as $$
declare
  headers_raw text;
  auth_header text;
begin
  headers_raw := current_setting('request.headers', true);
  auth_header := case
    when headers_raw is not null then
      (headers_raw::json->>'authorization')
    else null
  end;

  perform net.http_post(
    url => util.project_url() || '/functions/v1/' || name,
    headers => jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', auth_header
    ),
    body => body,
    timeout_milliseconds => timeout_milliseconds
  );
end;
$$;
```

**Column clearing function:**
```sql
create or replace function util.clear_column()
returns trigger
language plpgsql as $$
declare
    clear_column text := TG_ARGV[0];
begin
    NEW := NEW #= hstore(clear_column, NULL);
    return NEW;
end;
$$;
```

#### 3. Create Queue and Trigger Functions

**Create embedding jobs queue:**
```sql
select pgmq.create('embedding_jobs');
```

**Generic trigger function to queue embedding jobs:**
```sql
create or replace function util.queue_embeddings()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_function text = TG_ARGV[0];
  embedding_column text = TG_ARGV[1];
begin
  perform pgmq.send(
    queue_name => 'embedding_jobs',
    msg => jsonb_build_object(
      'id', NEW.id,
      'schema', TG_TABLE_SCHEMA,
      'table', TG_TABLE_NAME,
      'contentFunction', content_function,
      'embeddingColumn', embedding_column
    )
  );
  return NEW;
end;
$$;
```

**Process embedding jobs function:**
```sql
create or replace function util.process_embeddings(
  batch_size int = 10,
  max_requests int = 10,
  timeout_milliseconds int = 5 * 60 * 1000
)
returns void
language plpgsql
as $$
declare
  job_batches jsonb[];
  batch jsonb;
begin
  with
    numbered_jobs as (
      select
        message || jsonb_build_object('jobId', msg_id) as job_info,
        (row_number() over (order by 1) - 1) / batch_size as batch_num
      from pgmq.read(
        queue_name => 'embedding_jobs',
        vt => timeout_milliseconds / 1000,
        qty => max_requests * batch_size
      )
    ),
    batched_jobs as (
      select
        jsonb_agg(job_info) as batch_array,
        batch_num
      from numbered_jobs
      group by batch_num
    )
  select array_agg(batch_array)
  from batched_jobs
  into job_batches;

  foreach batch in array job_batches loop
    perform util.invoke_edge_function(
      name => 'embed',
      body => batch,
      timeout_milliseconds => timeout_milliseconds
    );
  end loop;
end;
$$;
```

**Schedule processing:**
```sql
select cron.schedule(
  'process-embeddings',
  '10 seconds',
  $$ select util.process_embeddings(); $$
);
```

#### 4. Edge Function for Embedding Generation

**Using gte-small (built-in Supabase model):**

Supabase Edge Functions have built-in support for `gte-small`. Here's the implementation:

```typescript
// supabase/functions/embed/index.ts
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('expected POST request', { status: 405 })
  }

  if (req.headers.get('content-type') !== 'application/json') {
    return new Response('expected json body', { status: 400 })
  }

  const jobs = await req.json()
  
  // Initialize Supabase client with service role
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const completedJobs = []
  const failedJobs = []

  for (const job of jobs) {
    try {
      // Fetch the row using direct SQL query (as per Supabase pattern)
      // The contentFunction is a SQL function name, not a column
      const { data: rows, error: fetchError } = await supabase.rpc('exec_sql', {
        query: `
          select
            id,
            ${job.contentFunction}(t) as content
          from
            ${job.schema}.${job.table} t
          where
            id = $1
        `,
        params: [job.id]
      })

      // Alternative: Direct query if contentFunction is just a column name
      // For dynamic_instructions, we'll query knowledge_key directly
      const { data: row, error: directError } = await supabase
        .from(job.table)
        .select('knowledge_key, dynamic_prompt')
        .eq('id', job.id)
        .single()

      if (directError || !row) {
        throw new Error(`Row not found: ${job.table}/${job.id}`)
      }

      // Use knowledge_key as content (matches current analyzer behavior)
      const content = row.knowledge_key
      
      if (!content || typeof content !== 'string') {
        throw new Error(`Invalid content: ${job.table}/${job.id}`)
      }

      // Truncate if longer than ~512 tokens (gte-small limit)
      // Rough estimate: 1 token ≈ 4 characters
      const maxChars = 512 * 4 // ~2048 characters
      const truncatedContent = content.length > maxChars 
        ? content.substring(0, maxChars) 
        : content

      // Generate embedding using gte-small (built-in Supabase model)
      const session = new Supabase.ai.Session('gte-small')
      const embedding = await session.run(truncatedContent, {
        mean_pool: true,    // Average token embeddings
        normalize: true     // Unit norm (crucial for cosine similarity)
      })

      // Update row with embedding
      // Note: embedding is an array of 384 numbers
      const { error: updateError } = await supabase
        .from(job.table)
        .update({ [job.embeddingColumn]: `[${embedding.join(',')}]` })
        .eq('id', job.id)

      if (updateError) {
        throw updateError
      }

      // Delete job from queue using pgmq function
      const { error: deleteError } = await supabase.rpc('pgmq_delete', {
        queue_name: 'embedding_jobs',
        msg_id: job.jobId
      })

      if (deleteError) {
        console.warn(`Failed to delete job ${job.jobId} from queue:`, deleteError)
      }

      completedJobs.push(job)
    } catch (error) {
      failedJobs.push({
        ...job,
        error: error instanceof Error ? error.message : JSON.stringify(error)
      })
    }
  }

  return new Response(
    JSON.stringify({ completedJobs, failedJobs }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'x-completed-jobs': completedJobs.length.toString(),
        'x-failed-jobs': failedJobs.length.toString()
      }
    }
  )
})
```

**Key Implementation Notes:**
- Use `new Supabase.ai.Session('gte-small')` to create embedding session
- Call `session.run(text, { mean_pool: true, normalize: true })` to generate embedding
- Returns array of 384 numbers
- Truncate input if longer than ~512 tokens (~2048 characters)
- Store as PostgreSQL array format: `[number, number, ...]`

---

## Semantic Search Function

### Match Function Pattern

Create a function to find similar dynamic prompts:

```sql
-- Match dynamic instructions using cosine distance (<=>)
create or replace function match_dynamic_instructions (
  query_embedding extensions.vector(384),  -- gte-small produces 384 dimensions
  assistant_id_filter uuid,                -- Required: filter by assistant
  user_id_filter uuid,                     -- Required: current user ID for user-scoped instructions
  match_count int default 10               -- Max results to return
)
returns table (
  id uuid,
  key text,
  knowledge_key text,
  dynamic_prompt text,
  "order" integer,
  threshold numeric,
  scope instruction_scope,
  user_id uuid,
  similarity_score float,                  -- Calculated similarity (1 - distance)
  created_at timestamptz,
  updated_at timestamptz,
  tags text[]
)
language sql
security definer
as $$
  select 
    di.id,
    di.key,
    di.knowledge_key,
    di.dynamic_prompt,
    di."order",
    di.threshold,
    di.scope,
    di.user_id,
    -- Calculate similarity score: 1 - cosine_distance
    1.0 - (di.embedding <=> query_embedding) as similarity_score,
    di.created_at,
    di.updated_at,
    di.tags
  from dynamic_instructions di
  inner join assistant_dynamic_instructions adi 
    on di.id = adi.dynamic_instruction_id
  where 
    -- Filter by assistant (required)
    adi.assistant_id = assistant_id_filter
    -- Filter by scope: global OR user's own user-scoped instructions
    and (
      di.scope = 'global' 
      or (di.scope = 'user' and di.user_id = user_id_filter)
    )
    -- Only include if embedding exists
    and di.embedding is not null
  order by di.embedding <=> query_embedding asc
  limit least(match_count, 200);
$$;
```

### Vector Index

For performance, create an HNSW index:

```sql
-- HNSW index for fast similarity search
create index on dynamic_instructions 
using hnsw (embedding vector_cosine_ops);

-- Note: halfvec_cosine_ops if using halfvec(384)
```

**Index considerations:**
- HNSW supports up to 4000 dimensions for `halfvec`
- For `vector(384)`, we're well within limits
- Index creation can take time for large tables
- Consider `halfvec` to save space if acceptable

---

## Implementation Considerations

### What to Embed

**Option 1: Embed `knowledge_key` only**
- Pros: Matches current analyzer behavior (analyzer sees knowledge_key)
- Cons: May miss semantic meaning in `dynamic_prompt`

**Option 2: Embed `knowledge_key + dynamic_prompt`**
- Pros: Captures full semantic meaning
- Cons: May be too broad, could match on prompt content rather than intent

**Option 3: Embed `knowledge_key` with optional `dynamic_prompt` prefix**
- Pros: Balanced approach
- Cons: More complex

**Recommendation:** Start with Option 1 (embed `knowledge_key`) to match current behavior, then experiment with Option 2 if needed.

### Query Embedding

For user queries, we need to:
1. Generate embedding for the user's message
2. Include context from past messages (last ~512 tokens)
3. Search for similar dynamic instructions

**Query construction:**
- Concatenate recent messages (user + assistant) up to ~2048 characters
- Let gte-small model automatically truncate at 512 tokens if exceeded
- No manual tokenization needed - model handles truncation internally
- Simple string concatenation: `message1 + "\n\n" + message2 + ...`

**Implementation Options:**

**Option 1: Generate embedding in Edge Function**
Create an Edge Function endpoint that takes user message and returns embedding:

```typescript
// supabase/functions/generate-query-embedding/index.ts
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('expected POST request', { status: 405 })
  }

  const { text } = await req.json()
  
  if (!text || typeof text !== 'string') {
    return new Response('expected text in body', { status: 400 })
  }

  // Generate embedding using gte-small
  const session = new Supabase.ai.Session('gte-small')
  const embedding = await session.run(text, {
    mean_pool: true,
    normalize: true
  })

  return new Response(
    JSON.stringify({ embedding }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' }
    }
  )
})
```

**Option 2: Generate embedding client-side (if possible)**
If Supabase client library supports AI session (unlikely), generate client-side. Otherwise, use Edge Function.

**Option 3: Use RPC function in database**
Create a database function that calls Edge Function internally (more complex, not recommended).

**Recommendation:** Use Option 1 (Edge Function) for query embedding generation.

### Threshold Handling

**Design Decision:** Use cosine distance directly, convert to similarity in SQL function
1. Calculate similarity score in SQL: `similarity_score = 1 - cosine_distance`
2. Return similarity_score in function results
3. Filter in application code: `WHERE similarity_score >= instruction.threshold`
4. This allows per-instruction threshold filtering (thresholds vary from 0.5-0.7)

### Assistant Filtering

Since assistants have specific dynamic instructions via `assistant_dynamic_instructions`:
- Filter results by `assistant_id` when searching
- Only return dynamic instructions assigned to the current assistant
- Consider both global and user-scoped instructions

### Conversation Context

To consider "past couple of queries":
- Store recent message embeddings temporarily (in-memory or cache)
- Concatenate last 2-3 user messages before embedding
- Or: Average embeddings of recent messages
- Or: Use a weighted combination

---

## Database Schema Changes Needed

### Add Embedding Column

```sql
-- Add embedding column to dynamic_instructions table
alter table dynamic_instructions
add column embedding extensions.vector(384);

-- Or use halfvec to save space:
-- add column embedding extensions.halfvec(384);
```

### Create Index

```sql
-- Create HNSW index for fast similarity search
create index idx_dynamic_instructions_embedding 
on dynamic_instructions 
using hnsw (embedding vector_cosine_ops);
```

### Create Triggers

```sql
-- Function to generate embedding input from knowledge_key
create or replace function embedding_input_for_dynamic_instruction(
  di dynamic_instructions
)
returns text
language plpgsql
immutable
as $$
begin
  -- Embed the knowledge_key (matches current analyzer behavior)
  return di.knowledge_key;
  
  -- Alternative: include dynamic_prompt for richer semantics
  -- return di.knowledge_key || E'\n\n' || di.dynamic_prompt;
end;
$$;

-- Trigger for insert events
create trigger embed_dynamic_instructions_on_insert
  after insert
  on dynamic_instructions
  for each row
  execute function util.queue_embeddings(
    'embedding_input_for_dynamic_instruction',
    'embedding'
  );

-- Trigger for update events (when knowledge_key changes)
create trigger embed_dynamic_instructions_on_update
  after update of knowledge_key, dynamic_prompt
  on dynamic_instructions
  for each row
  execute function util.queue_embeddings(
    'embedding_input_for_dynamic_instruction',
    'embedding'
  );

-- Optional: Clear embedding on update (for accuracy)
create trigger clear_dynamic_instruction_embedding_on_update
  before update of knowledge_key, dynamic_prompt
  on dynamic_instructions
  for each row
  execute function util.clear_column('embedding');
```

---

## Edge Function Implementation Notes

### gte-small Model

- **Dimensions:** 384
- **Built-in:** Yes, available in Supabase Edge Functions
- **Language:** English only
- **Max Input:** ~512 tokens (longer inputs are truncated)
- **Performance:** Sub-second generation (~100-200ms), even from cold start
- **Cost:** Charged as CPU time, cost-efficient compared to external APIs

**API Usage:**
```typescript
// In Supabase Edge Function
const session = new Supabase.ai.Session('gte-small');

const embedding = await session.run(inputString, {
  mean_pool: true,    // Average token embeddings
  normalize: true     // Unit norm (important for cosine similarity)
});
```

**Key Points:**
- Uses ONNX runtime under the hood (Rust-based extension)
- `mean_pool: true` averages token embeddings to represent the input
- `normalize: true` scales vector to unit length (crucial for cosine similarity)
- Returns a 384-dimensional array of numbers

### Alternative: Use OpenAI or Other Provider

If we need multilingual support or different dimensions, we can use OpenAI's embedding API:

```typescript
// Generate embedding using OpenAI
const response = await fetch('https://api.openai.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'text-embedding-3-small',  // 1536 dimensions
    input: text,
  }),
})

const { data } = await response.json()
const embedding = data[0].embedding
```

**Note:** If using OpenAI, we'd need to change vector dimension to 1536 instead of 384.

---

## Performance Considerations

### Batch Processing

- Process embeddings in batches (default: 10 per batch)
- Use pgmq visibility timeouts for retries
- Schedule processing every 10 seconds (adjustable)

### Index Performance

- HNSW index provides fast approximate nearest neighbor search
- Trade-off between accuracy and speed (HNSW parameters)
- Index creation time increases with table size

### Query Performance

- Vector search is typically very fast (< 10ms for small-medium datasets)
- With proper indexing, should be faster than current LLM analyzer
- Consider caching query embeddings if same queries are repeated

---

## Migration Strategy

### Phase 1: Setup Infrastructure
1. Enable pgvector extension
2. Add embedding column to `dynamic_instructions`
3. Create utility functions and queue system
4. Create Edge Function for embedding generation

### Phase 2: Generate Embeddings
1. Create triggers for auto-generation
2. Backfill embeddings for existing dynamic instructions
3. Verify embeddings are generated correctly

### Phase 3: Implement Search
1. Create `match_dynamic_instructions` function
2. Create HNSW index
3. Test semantic search queries

### Phase 4: **CRITICAL - Testing & Validation Tool** ⚠️
**IMPORTANT:** This phase must be completed BEFORE replacing the existing analyzer. We need to validate that the RAG system works correctly and produces good results.

1. **Create Admin Testing Page**
   - Add new page at `/admin/debug/rag` (or `/admin/debug/rag-test`)
   - Link from admin dashboard debug tools section
   - Create separate page from existing debug tools for focused RAG testing

2. **Testing Interface Features**
   - **Query Input**: Text area to enter test queries (user messages)
   - **Context Input**: Optional field to add conversation context (last messages)
   - **Assistant Selector**: Dropdown to select which assistant to test with
   - **Run Test Button**: Execute vector search and display results
   
3. **Results Display**
   - **Side-by-Side Comparison**: Show both RAG results AND current LLM analyzer results
   - **RAG Results Panel**:
     - List of matched dynamic instructions with similarity scores
     - Show which instructions passed threshold
     - Display the `knowledge_key` and `dynamic_prompt` for each match
     - Show similarity score vs threshold comparison
   - **Current Analyzer Results Panel**:
     - Show current LLM analyzer scores for comparison
     - Display which instructions the analyzer would include
   - **Comparison Metrics**:
     - Number of matches found by each system
     - Overlap between systems (which instructions both found)
     - Differences (which RAG found but analyzer didn't, and vice versa)
   
4. **Advanced Testing Features**
   - **Batch Testing**: Upload CSV/json with multiple test queries
   - **Threshold Slider**: Adjust threshold dynamically to see how results change
   - **Embedding Visualization**: Show query embedding generation time
   - **Performance Metrics**: Display search latency, embedding generation time
   - **Export Results**: Save test results for analysis

5. **Validation Criteria**
   - Test with various query types (short, long, ambiguous, specific)
   - Compare RAG results with current analyzer results
   - Verify similarity scores make sense
   - Check that threshold filtering works correctly
   - Validate performance (should be faster than analyzer)
   - Test edge cases (empty queries, very long queries, etc.)

6. **Iteration & Tuning**
   - Adjust thresholds based on test results
   - Fine-tune embedding content if needed (knowledge_key vs knowledge_key + dynamic_prompt)
   - Test with different conversation contexts
   - Validate that results improve with context vs without

**Success Criteria for Phase 4:**
- RAG system produces relevant matches
- Results are comparable or better than current analyzer
- Performance is acceptable (< 200ms total)
- Edge cases handled gracefully
- Admin team can validate results through testing interface

### Phase 5: Replace Analyzer (ONLY AFTER VALIDATION)
1. Update `AnalyzerContext` to use vector search
2. Generate query embeddings for user messages
3. Replace LLM analyzer calls with vector search
4. Maintain threshold-based filtering
5. Keep old analyzer code commented/available for rollback

### Phase 6: Optimize & Monitor
1. Add conversation context support
2. Fine-tune thresholds based on production data
3. Monitor performance and accuracy
4. Collect metrics on match quality
5. Remove old analyzer code once stable

---

## Design Decisions (2025-01-19)

### 1. Embedding Content ✅
**Decision:** Embed only `knowledge_key` (Option A)
- Matches current analyzer behavior
- Keeps embeddings focused on search intent
- `knowledge_key` values are short (13-19 chars), well within token limits

### 2. Query Context ✅
**Decision:** Use last 512 tokens of conversation context, let embedding model truncate automatically
- No manual tokenization needed - gte-small handles truncation
- Concatenate recent messages (user + assistant) up to ~2048 characters
- Model automatically truncates at 512 tokens if exceeded
- Simple implementation: just concatenate strings and pass to embedding function

### 3. Threshold & Scoring ✅
**Decision:** Use cosine distance directly (Option A)
- Convert distance to similarity: `similarity = 1 - distance`
- Compare directly to existing thresholds (no calibration needed initially)
- Thresholds range from 0.5-0.7 in current data
- Can adjust thresholds later if needed based on testing

### 4. Fallback Strategy ✅
**Decision:** Return empty result if vector search fails (Option B)
- No dynamic prompts appended if search fails
- Keep error messages simple and user-friendly
- System continues to work without dynamic prompts (graceful degradation)

### 5. User-Scoped Instructions ✅
**Decision:** Ignore scope/user_id for now (future feature)
- **Current state:** No user-scoped dynamic instructions exist yet
- **Implementation:** Treat all dynamic instructions equally, ignore `scope` and `user_id` fields
- **Future:** Can add user-scoped filtering later when feature is implemented
- **Simplification:** No need to filter by user_id in search function

### 6. Assistant Filtering ✅
**Decision:** Filter at database level via SQL join (Option A)
- Join with `assistant_dynamic_instructions` table in search function
- More efficient than filtering in application code
- SQL: `JOIN assistant_dynamic_instructions adi ON di.id = adi.dynamic_instruction_id WHERE adi.assistant_id = $assistant_id`

### 7. Migration Approach ✅
**Decision:** Testing tool first, then gradual migration
- **Phase 1:** Create testing tool at `/admin/debug/rag` (or `/admin/debug/rag-test`)
- **Phase 2:** Link from admin dashboard debug tools section
- **Phase 3:** Test and validate RAG system thoroughly before replacing analyzer
- **Phase 4:** Keep existing LLM analyzer running in production during testing
- **Phase 5:** Side-by-side comparison in testing tool
- **Phase 6:** Only replace analyzer after validation confirms RAG works well

### 8. Performance Requirements ✅
**Decision:** Not a primary concern initially
- Focus on correctness and functionality first
- Optimize later if needed
- Expected performance: ~110-210ms (faster than current 200-500ms)

### 9. Edge Cases ✅
**Decision:** Easy-to-understand error messages
- Empty/short messages: Return empty results with clear message
- Long messages: Let embedding model truncate (automatic)
- Multiple matches with same score: Return all, order by existing `order` field
- No matches: Return empty array (not an error)

### 10. Monitoring ✅
**Decision:** No monitoring initially
- Add metrics later if needed
- Focus on getting basic functionality working first

---

## Open Questions (Resolved)

1. ~~**gte-small API:** What is the exact API for generating embeddings with gte-small in Supabase Edge Functions?~~ ✅ **RESOLVED:** Use `new Supabase.ai.Session('gte-small')` with `session.run(text, { mean_pool: true, normalize: true })`
2. ~~**Embedding content:** Should we embed `knowledge_key` only, or include `dynamic_prompt`?~~ ✅ **RESOLVED:** Embed `knowledge_key` only
3. ~~**Conversation context:** How should we combine multiple recent messages for better matching?~~ ✅ **RESOLVED:** Concatenate last messages up to ~2048 chars, let model truncate
4. ~~**Threshold tuning:** How do vector similarity scores compare to current LLM scores?~~ ✅ **RESOLVED:** Use direct conversion (1 - distance), test and adjust if needed
5. ~~**Fallback:** Should we keep LLM analyzer as fallback if vector search fails?~~ ✅ **RESOLVED:** Return empty result, graceful degradation
6. ~~**User-scoped instructions:** How to handle user-scoped dynamic instructions in vector search?~~ ✅ **RESOLVED:** Filter in SQL WHERE clause
7. ~~**Input length:** gte-small truncates at ~512 tokens. Do we need to handle long values?~~ ✅ **RESOLVED:** Let model truncate automatically, no manual handling needed

---

## Client-Side Integration

### Generating Query Embeddings

From the frontend (React/TypeScript), call the Edge Function to generate query embeddings:

```typescript
// Generate embedding for user message
async function generateQueryEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/generate-query-embedding`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ text })
    }
  )

  if (!response.ok) {
    throw new Error('Failed to generate query embedding')
  }

  const { embedding } = await response.json()
  return embedding
}
```

### Performing Vector Search

Call the `match_dynamic_instructions` RPC function:

```typescript
// Find relevant dynamic instructions
async function findRelevantDynamicInstructions(
  queryEmbedding: number[],
  assistantId: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10
) {
  const { data, error } = await supabase.rpc('match_dynamic_instructions', {
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_threshold: matchThreshold,
    match_count: matchCount,
    assistant_id_filter: assistantId,
    scope_filter: null // or 'global'/'user' as needed
  })

  if (error) {
    throw error
  }

  return data
}
```

### Testing Tool Implementation (Phase 4 - Critical First Step)

**Location:** `/admin/debug/rag` or `/admin/debug/rag-test`

**Purpose:** Validate RAG system works correctly before replacing existing analyzer

**Key Components:**
1. **Query Input Component**
   - Text area for user message
   - Optional context input (previous messages)
   - Assistant selector dropdown
   - "Run Test" button

2. **Results Comparison Component**
   - Split view: RAG results vs Current Analyzer results
   - Side-by-side comparison of matched instructions
   - Similarity scores and thresholds displayed
   - Visual indicators for matches/overlaps/differences

3. **Performance Metrics Display**
   - Embedding generation time
   - Vector search time
   - Total latency
   - Comparison with analyzer latency

4. **Advanced Controls**
   - Threshold slider for dynamic adjustment
   - Toggle to include/exclude conversation context
   - Export results functionality

**Integration Points:**
- Link from admin dashboard debug tools section
- Use existing `useSelectedAssistant` hook for assistant selection
- Call new RAG search function (to be created)
- Call existing analyzer function for comparison
- Display results in comparison view

### Integration with AnalyzerContext (Phase 5 - After Validation)

**ONLY AFTER TESTING TOOL VALIDATES RAG SYSTEM WORKS:**

Replace the current `runAnalyzerForMessage` function to:
1. Concatenate recent messages (user + assistant) up to ~2048 characters
2. Generate query embedding via Edge Function
3. Call `match_dynamic_instructions` RPC with assistant_id (no user_id needed for now)
4. Filter results by threshold: `similarity_score >= instruction.threshold`
5. Order by similarity_score descending (most relevant first)
6. Return matching dynamic prompts

**Error Handling:**
- If embedding generation fails: Return empty result with user-friendly error
- If vector search fails: Return empty result (graceful degradation)
- If no matches: Return empty array (not an error)

---

## References

- [Supabase Semantic Search Documentation](https://supabase.com/docs/guides/ai/semantic-search)
- [Supabase Automatic Embeddings Guide](https://supabase.com/docs/guides/ai/automatic-embeddings)
- [Next.js Vector Search Example](https://supabase.com/docs/guides/ai/examples/nextjs-vector-search)
- [Supabase AI Models Documentation](https://supabase.com/docs/guides/functions/ai-models)
- [Supabase Generate Text Embeddings Quickstart](https://supabase.com/docs/guides/ai/quickstarts/generate-text-embeddings)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

---

## Current Database State (via MCP - 2025-01-19)

### Project Information
- **Project ID:** `cfcwwyrjkhjdlljtwcwv`
- **Project Name:** MILA
- **Region:** eu-west-1
- **Status:** ACTIVE_HEALTHY

### Extensions Status
- ✅ **pgvector** (v0.8.0) - **INSTALLED** in `extensions` schema
- ❌ **pgmq** - Available but NOT installed
- ❌ **pg_net** - Available but NOT installed  
- ❌ **pg_cron** - Available but NOT installed
- ❌ **hstore** - Available but NOT installed

### dynamic_instructions Table
- **Total rows:** 18 dynamic instructions
- **Current columns:** id, key, knowledge_key, dynamic_prompt, order, threshold, scope, user_id, created_at, updated_at, tags
- ❌ **embedding column:** Does NOT exist yet
- **Existing indexes:**
  - Primary key on `id`
  - Index on `scope`
  - Partial index on `user_id` (WHERE user_id IS NOT NULL)
  - Composite index on `(scope, user_id)`
  - GIN index on `tags`
- ❌ **Vector index:** Does NOT exist yet

### Sample Data Analysis
Sample of 5 dynamic instructions:
- **knowledge_key lengths:** 13-19 characters (well within 512 token limit)
- **dynamic_prompt lengths:** 2,075-4,897 characters
- **Thresholds:** 0.5-0.7
- **Scope:** All samples shown are 'global'

**Key Finding:** 
- `knowledge_key` values are short (13-19 chars) and safe for gte-small's 512 token limit
- `dynamic_prompt` values are much longer (2000-5000 chars), but we're only embedding `knowledge_key`
- All 18 existing instructions are global scope (`scope = 'global'`)
- No user-scoped instructions exist yet (future feature)

### assistant_dynamic_instructions Junction Table
- **Total rows:** 86 relationships
- Shows many-to-many relationship between assistants and dynamic instructions is actively used

---

## Next Steps

### Immediate (Phase 1-3: Infrastructure)
1. ~~Verify gte-small embedding API in Supabase Edge Functions~~ ✅ **RESOLVED**
2. ~~Check current database state~~ ✅ **COMPLETED**
3. Install required extensions (pgmq, pg_net, pg_cron, hstore)
4. Create database migration for embedding column and triggers
5. Implement Edge Function for embedding generation using `Supabase.ai.Session('gte-small')`
6. Create semantic search function `match_dynamic_instructions`
7. Create HNSW index for fast similarity search
8. Backfill embeddings for existing 18 instructions

### Critical First Step (Phase 4: Testing Tool) ⚠️
**MUST BE COMPLETED BEFORE REPLACING ANALYZER**

9. **Create Admin Testing Page** (`/admin/debug/rag` or `/admin/debug/rag-test`)
   - Add route in admin routes
   - Link from admin dashboard debug tools section
   - Create separate page component for RAG testing

10. **Implement Testing Interface**
    - Query input component (user message + optional context)
    - Assistant selector dropdown
    - Results comparison view (RAG vs Current Analyzer)
    - Performance metrics display
    - Threshold adjustment controls

11. **Implement RAG Search Function**
    - Create `generateQueryEmbedding` function (calls Edge Function)
    - Create `findRelevantDynamicInstructions` function (calls RPC)
    - Filter results by threshold
    - Return formatted results for display

12. **Implement Comparison Logic**
    - Call both RAG search and current analyzer
    - Compare results side-by-side
    - Calculate overlap/differences
    - Display metrics

13. **Test & Validate**
    - Test with various query types
    - Compare results with current analyzer
    - Validate performance
    - Test edge cases
    - Iterate and tune thresholds

### After Validation (Phase 5: Replace Analyzer)
14. **ONLY AFTER TESTING TOOL VALIDATES RAG WORKS:**
    - Replace LLM analyzer calls with vector search in `AnalyzerContext`
    - Update `runAnalyzerForMessage` function
    - Keep old analyzer code available for rollback

### Future (Phase 6: Optimization)
15. Add conversation context support
16. Fine-tune thresholds based on production data
17. Monitor performance and accuracy
18. Remove old analyzer code once stable
