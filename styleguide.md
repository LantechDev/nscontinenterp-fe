# Code Quality & Style Guide - Frontend (AI Reviewer Reference)

This document serves as the authoritative guide for maintaining code quality, architectural integrity, and stylistic consistency in the NS Continent ERP Frontend project. It is intended to be used by human developers and AI Code Reviewers during Pull Requests.

---

## 1. Core Architectural Principles

### 1.1. Nuxt v4.2.2 + Vue v3.5.26 Standards

- **Standard:** Always use Vue 3.5.26 Composition API with `<script setup lang="ts">` syntax.
- **Never:** Use Options API or `export default { ... }` syntax.
- **Reasoning:**
  - Better TypeScript type inference
  - More flexible code organization
  - Better tree-shaking and performance
  - Reactivity system improvements in Vue 3.5
- **Reviewer Action:** Reject any component using Options API.

### 1.2. Feature-Based Directory Structure

- **Standard:** Organize code by feature/domain, not by type.
- **Structure:**
  ```
  app/
  ├── components/[feature]/    # Feature-specific components
  ├── composables/             # Reusable stateful logic
  ├── pages/[feature]/         # Page components
  └── types/                   # TypeScript types
  ```
- **Reviewer Action:** Flag generic folders like `components/shared/` or misplaced components.

---

## 2. Type Safety & Contract Integrity

### 2.1. NO `any` Type (Strict)

- **Standard:** Never use `any` type. Always define explicit types and interfaces.
- **Reasoning:** `any` defeats TypeScript's type checking and leads to runtime errors.
- **Reviewer Action:** Flag any `any` usage as a critical violation.
- **Example:**

```typescript
// ✅ GOOD
interface Job {
  id: string;
  jobNumber: string;
  pol: string;
  pod: string;
  commodity: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  return await $fetch<Job[]>("/api/jobs");
};

// ❌ BAD
const fetchJobs = async (): Promise<any> => {
  return await $fetch("/api/jobs");
};
```

### 2.2. Props & Emits Type Safety (Mandatory)

- **Standard:** Always define interfaces for props and emits.
- **Use:** `withDefaults()` for default prop values.
- **Reviewer Action:** Flag `defineProps()` or `defineEmits()` without type parameters.
- **Example:**

```vue
<script setup lang="ts">
// ✅ GOOD
interface Props {
  job: Job;
  readonly?: boolean;
  showActions?: boolean;
}

interface Emits {
  (e: "update", job: Job): void;
  (e: "delete", id: string): void;
  (e: "refresh"): void;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  showActions: true,
});

const emit = defineEmits<Emits>();
</script>

// ❌ BAD const props = defineProps(['job', 'readonly']) const emit = defineEmits(['update',
'delete'])
```

### 2.3. Narrowing Over Widening

- **Standard:** Use `as const` for literals and config objects.
- **Reasoning:** Precision in types allows TypeScript to catch logical errors.
- **Example:**

```typescript
// ✅ GOOD
const JOB_STATUSES = ["DRAFT", "ACTIVE", "CLOSED"] as const;
type JobStatus = (typeof JOB_STATUSES)[number];

// ❌ BAD
const JOB_STATUSES: string[] = ["DRAFT", "ACTIVE", "CLOSED"];
```

---

## 3. Composables Pattern

### 3.1. The Composables Rule (Mandatory)

- **Standard:** Extract reusable stateful logic into composables in `app/composables/`.
- **Naming:** Use `use[Feature]` naming convention.
- **Why:** DRY principle, easier testing, better code organization.
- **Reviewer Action:** Flag duplicated logic across components.
- **Example:**

```typescript
// composables/useJobs.ts
export interface UseJobsReturn {
  jobs: Ref<Job[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  fetchJobs: () => Promise<void>;
  createJob: (data: CreateJobInput) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useJobs = (): UseJobsReturn => {
  const jobs = useState<Job[]>("jobs", () => []);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchJobs = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      jobs.value = await $fetch<Job[]>("/api/jobs");
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  const createJob = async (data: CreateJobInput): Promise<void> => {
    await $fetch("/api/jobs", {
      method: "POST",
      body: data,
    });
    await fetchJobs();
  };

  const deleteJob = async (id: string): Promise<void> => {
    await $fetch(`/api/jobs/${id}`, { method: "DELETE" });
    await fetchJobs();
  };

  return {
    jobs: readonly(jobs),
    loading: readonly(loading),
    error: readonly(error),
    fetchJobs,
    createJob,
    deleteJob,
  };
};
```

### 3.2. useState vs ref

- **Standard:** Use `useState()` for SSR-compatible global state.
- **Use `ref()`** for local component state only.
- **Why:** `useState()` persists across component re-renders and works with SSR.

---

## 4. API Integration

### 4.1. The useFetch / $fetch Rule (Mandatory)

- **Standard:** Use `useFetch` for server-side compatible data fetching.
- **Use `$fetch`** for client-side mutations (POST, PUT, DELETE).
- **Never:** Use axios or other HTTP libraries.
- **Why:** Nuxt's built-in fetch handles SSR/hydration, automatic error handling, and is type-safe.
- **Reviewer Action:** Flag any axios or fetch API usage.
- **Example:**

```vue
<script setup lang="ts">
// ✅ GOOD - useFetch for SSR-compatible fetching
const { data: jobs, pending, error, refresh } = await useFetch<Job[]>("/api/jobs");

// ✅ GOOD - $fetch for mutations
const createJob = async (jobData: CreateJobInput): Promise<void> => {
  await $fetch("/api/jobs", {
    method: "POST",
    body: jobData,
  });
  await refreshNuxtData("jobs");
};
</script>
```

### 4.2. API Type Safety

- **Standard:** Always specify generic types for API responses.
- **Pattern:** Import types from shared types or define inline.
- **Example:**

```typescript
// ✅ GOOD
const { data: job } = await useFetch<Job>(`/api/jobs/${jobId}`);

// ✅ GOOD with error handling
const { data: jobs, error } = await useFetch<Job[]>("/api/jobs");
if (error.value) {
  console.error("Failed to fetch jobs:", error.value);
}
```

---

## 5. Component Standards

### 5.1. Component Naming (Mandatory)

- **Standard:** Use PascalCase for component names.
- **Multi-word:** Always use multi-word names to avoid HTML conflicts.
- **Feature Prefix:** Use feature prefix for feature-specific components.
- **Example:**

```text
✅ GOOD:
- JobCard.vue
- BillOfLadingEditor.vue
- DashboardStatCard.vue
- CustomerList.vue
- QuotationForm.vue

❌ BAD:
- jobcard.vue (kebab-case)
- bloEditor.vue (unclear abbreviation)
- card.vue (too generic, single word)
- User.vue (conflicts with HTML)
```

### 5.2. Component File Structure

- **Order:**
  1. `<script setup lang="ts">` - Logic
  2. `<template>` - Template
  3. `<style scoped>` - Scoped styles (if needed)
- **Reviewer Action:** Flag components with styles in wrong order or without scoped.

### 5.3. Template Complexity

- **Standard:** Keep templates simple. Move complex logic to `<script>`.
- **Constraint:** No complex expressions in templates.
- **Example:**

```vue
<!-- ✅ GOOD -->
<script setup lang="ts">
const activeJobs = computed(() => jobs.value.filter((j) => j.status === "ACTIVE"));
const formattedDate = (date: string): string => new Date(date).toLocaleDateString();
</script>

<template>
  <div v-for="job in activeJobs" :key="job.id">
    {{ formattedDate(job.createdAt) }}
  </div>
</template>

<!-- ❌ BAD -->
<template>
  <div v-for="job in jobs.filter((j) => j.status === 'ACTIVE')" :key="job.id">
    {{ new Date(job.createdAt).toLocaleDateString() }}
  </div>
</template>
```

---

## 6. Styling Standards

### 6.1. Tailwind CSS Only

- **Standard:** Use Tailwind CSS for all styling.
- **Never:** Use inline styles or `<style>` blocks for layout/styling.
- **Exception:** Scoped styles for complex animations or third-party overrides.
- **Reviewer Action:** Flag inline styles or arbitrary CSS.

### 6.2. Tailwind Best Practices

- **Use:** `@apply` for repeated patterns in scoped styles only.
- **Avoid:** Arbitrary values like `w-[123px]` unless necessary.
- **Prefer:** Standard Tailwind classes like `w-32`.

---

## 7. Route & Page Standards

### 7.1. Page Meta (Mandatory)

- **Standard:** Always define page metadata using `definePageMeta`.
- **Include:**
  - `middleware` - Auth guards
  - `layout` - Layout selection
  - `title` - Page title
- **Example:**

```vue
<script setup lang="ts">
// ✅ GOOD
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Job Management",
});
</script>
```

### 7.2. Dynamic Routes

- **Standard:** Use bracket notation for dynamic segments.
- **Validation:** Validate route params using Zod or type guards.
- **Example:**

```typescript
// pages/jobs/[id].vue
const route = useRoute();
const jobId = computed(() => {
  const id = route.params.id;
  if (typeof id !== "string" || !id) {
    throw new Error("Invalid job ID");
  }
  return id;
});
```

---

## 8. Error Handling

### 8.1. API Error Handling

- **Standard:** Always handle API errors gracefully.
- **Pattern:** Show user-friendly error messages.
- **Example:**

```typescript
// ✅ GOOD
const { data, error } = await useFetch<Job[]>("/api/jobs");

if (error.value) {
  const message =
    error.value.statusCode === 401
      ? "Please login to view jobs"
      : "Failed to load jobs. Please try again.";

  showNotification(message, "error");
}
```

### 8.2. Component Error Boundaries

- **Standard:** Use `onErrorCaptured` for component-level error handling.
- **Pattern:** Log errors and show fallback UI.

---

## 9. Import Conventions

### 9.1. Nuxt Auto-imports

- **Standard:** Rely on Nuxt auto-imports for Vue/Nuxt APIs.
- **No need to import:** `ref`, `computed`, `useState`, `useFetch`, etc.
- **Explicit import:** For composables from other features.

### 9.2. Import Order

1. Vue/Nuxt APIs (auto-imported, no explicit import needed)
2. Third-party libraries
3. Composables (`~/composables/*`)
4. Types (`~/types/*`)
5. Components (Nuxt auto-imports these)

---

## 10. Summary Checklist for AI Reviewer

| Category      | Must Have                               | Immediate Rejection            |
| :------------ | :-------------------------------------- | :----------------------------- |
| **Vue**       | `<script setup lang="ts">`              | Options API / No TypeScript    |
| **Types**     | Typed props/emits with interfaces       | Untyped props/emits            |
| **Logic**     | Composables for reusable state          | Duplicated logic in components |
| **API**       | `useFetch` / `$fetch` with generics     | Axios / manual fetch           |
| **Naming**    | PascalCase, multi-word component names  | Single word / lowercase names  |
| **Styling**   | Tailwind CSS classes only               | Inline styles / arbitrary CSS  |
| **Pages**     | `definePageMeta` with middleware/layout | Missing page metadata          |
| **Safety**    | Error handling for all async operations | Unhandled promises             |
| **Structure** | Feature-based organization              | Mixed/unclear organization     |
| **Types**     | No `any` usage                          | `any` type anywhere            |

---

## 11. File Length Limits

### 11.1. Maximum 300 Lines Per File (Mandatory)

- **Standard:** No single file should exceed 300 lines of code.
- **Reasoning:**
  - **Readability:** Smaller files are easier to understand, navigate, and review.
  - **Maintainability:** Large files often indicate god classes that do too much.
  - **Collaboration:** Smaller files reduce merge conflicts in team environments.
  - **Performance:** Faster parsing and type-checking in large codebases.
  - **Testing:** Easier to unit test focused, single-responsibility modules.
- **Reviewer Action:** Flag any file exceeding 300 lines. Request refactoring before merging.

### 11.2. Refactoring Strategies

When a file approaches or exceeds 300 lines, apply these strategies:

#### A. Extract to Composables

Move reusable stateful logic into composables:

```typescript
// ❌ BAD - Component with 400+ lines
// app/pages/finance/dashboard.vue

<script setup lang="ts">
const jobs = ref([]);
const invoices = ref([]);
const payments = ref([]);

const fetchJobs = async () => { ... };
const fetchInvoices = async () => { ... };
const fetchPayments = async () => { ... };

const calculateRevenue = () => { ... };
const calculateExpenses = () => { ... };
const calculateProfit = () => { ... };

const jobStats = computed(() => { ... });
const invoiceStats = computed(() => { ... });
const paymentStats = computed(() => { ... });
// ... 300+ more lines
</script>

// ✅ GOOD - Extracted composables
// app/composables/useFinanceDashboard.ts

export const useFinanceDashboard = () => {
  const jobs = ref([]);
  const fetchJobs = async () => { ... };
  const jobStats = computed(() => { ... });

  return { jobs, fetchJobs, jobStats };
};

// app/pages/finance/dashboard.vue (now ~80 lines)
<script setup lang="ts">
const { jobs, fetchJobs, jobStats } = useFinanceDashboard();
</script>
```

#### B. Split Large Components

Break down monolithic components into smaller, focused sub-components:

```text
// ❌ BAD
// app/pages/master/company/index.vue (800+ lines)

// ✅ GOOD - Split into focused components
// app/pages/master/company/index.vue (~50 lines)
// app/pages/master/company/components/CompanyList.vue
// app/pages/master/company/components/CompanyCreateModal.vue
// app/pages/master/company/components/CompanyDetailModal.vue
// app/pages/master/company/components/CompanySidebar.vue
```

#### C. Use Component Composition

Leverage slots and props for component reusability:

```vue
// ❌ BAD - One massive data table component with all features // components/DataTable.vue (500+
lines with all edge cases) // ✅ GOOD - Generic base + feature-specific wrappers //
components/ui/DataTable.vue (base functionality) // components/finance/InvoiceTable.vue
(domain-specific extension)
```

#### D. Extract Utility Functions

Move pure functions to utility files:

```typescript
// ❌ BAD - Utility functions in component
// app/pages/reports/profit-loss.vue

const formatCurrency = (value: number) => { ... };
const formatDate = (date: Date) => { ... };
const calculatePercentage = (a: number, b: number) => { ... };

// ✅ GOOD - Shared utilities
// app/lib/utils.ts
export const formatCurrency = (value: number) => { ... };
export const formatDate = (date: Date) => { ... };
export const calculatePercentage = (a: number, b: number) => { ... };
```

#### E. Split Type Definitions

Separate large type definitions into dedicated files:

```typescript
// ❌ BAD - All types in one file
// app/types/all.ts (300+ lines of interfaces)

// ✅ GOOD - Organized type files
// app/types/finance.ts (finance-related types)
// app/types/auth.ts (authentication types)
// app/types/job.ts (job-related types)
```

### 11.3. Line Counting Guidelines

- **Count includes:** All lines in the file (script, template, styles)
- **Excludes:** Empty lines at the end of file
- **Tooling:** Use `wc -l` or IDE line count to verify
- **Graceful limit:** Target 250 lines, hard limit at 300 lines

### 11.4. Exceptions

Some files may legitimately exceed 300 lines:

- Generated code (auto-generated from schemas)
- Third-party library wrappers
- Complex configuration files
- Test files with extensive test cases

For exceptions, add a comment at the top:

```typescript
// NOTE: This file exceeds 300 lines due to [reason]
// Consider refactoring in future iterations
```

---

You are a senior Nuxt 3 architect.

Refactor my Nuxt 3 application into a production-grade, SSR-first, scalable architecture.

This must cover ALL layers:

* Page
* Composable
* Component
* API (using a single catch-all proxy `/server/api/[...path].ts`)

---

# 🎯 OBJECTIVES

* Fix slow production performance
* Eliminate blank screen on initial load
* Enforce SSR-first rendering
* Prevent duplicate fetching
* Remove ALL client-only initial fetch patterns
* Ensure clean separation of concerns
* Make architecture reusable across all modules

---

# 🚫 HARD RULES (ZERO TOLERANCE)

You MUST reject and refactor any of the following patterns:

### ❌ FORBIDDEN:

```ts
onMounted(() => fetchData())
```

```ts
if (import.meta.client) {
  initialize()
}
```

```ts
fetchData() // auto run inside composable
```

```ts
$fetch("https://external-api.com/...")
```

```ts
useAsyncData inside component
```

```ts
component fetching its own data
```

---

### ❗ KEY PRINCIPLE:

If data is needed on FIRST RENDER → it MUST be fetched on SERVER via `useAsyncData`.

---

# 🧱 REQUIRED ARCHITECTURE

---

## 1. PAGE LAYER (SSR ENTRY POINT)

### ✅ MUST:

* Use:

```ts
const { data, pending, error, refresh } = await useAsyncData("key", () =>
  $fetch("/api/...")
)
```

* Responsibilities:

  * initial data fetching (SSR)
  * read query params (filters, pagination)
  * pass data into composable

---

### ❌ MUST NOT:

* use `onMounted` for initial fetch
* use `import.meta.client`
* fetch directly inside template or component
* duplicate fetching with composable

---

### ✅ MUST INJECT DATA:

```ts
const module = useModule()

if (data.value) {
  module.setData(data.value)
}
```

---

## 2. COMPOSABLE LAYER (STATE + LOGIC ONLY)

### ✅ MUST CONTAIN:

* `ref`, `reactive`
* computed
* business logic
* CRUD actions

---

### ❌ MUST NOT:

* perform initial fetch automatically
* run fetch on import
* contain SSR logic

---

### ✅ MUST PROVIDE:

```ts
function setData(data) {
  state.value = data
}
```

---

### ✅ ALLOWED FETCH:

ONLY for:

* pagination change
* filter change
* user actions (create/update/delete)

---

## 3. COMPONENT LAYER (PURE UI ONLY — STRICT)

---

### ❌ COMPONENT MUST NOT:

* call `$fetch`
* use `useAsyncData`
* fetch data
* mutate global state directly
* contain heavy watchers
* compute expensive logic repeatedly

---

### ✅ COMPONENT MUST:

* receive data via props
* emit events upward
* use computed instead of watch

---

## 3.1 DATA PASSING STRATEGY

❌ BAD:

```ts
:company="company"
```

✅ GOOD:

```ts
:name="company.name"
:status="company.status"
```

---

## 3.2 EVENT-DRIVEN DESIGN

```ts
emit("edit", id)
emit("delete", id)
emit("refresh")
```

---

## 3.3 PERFORMANCE RULES

* Use `v-memo` for large lists
* Use stable `:key`
* Avoid inline functions in template
* Avoid deep watchers
* Memoize expensive computed
* Avoid mapping large objects in template

---

## 3.4 LIST OPTIMIZATION

* Use pagination OR virtual scrolling
* NEVER render full dataset blindly
* Pre-map data in composable, not template

---

## 4. SERVER API (CATCH-ALL ONLY)

Use ONLY:

```
/server/api/[...path].ts
```

---

### MUST:

* proxy to backend API
* forward cookies
* support all HTTP methods
* normalize headers
* include caching:

```ts
export default cachedEventHandler(handler, {
  maxAge: 60,
  swr: true,
})
```

---

## 5. API USAGE RULE (FRONTEND)

### ✅ MUST:

```ts
$fetch("/api/finance/expense")
```

---

### ❌ NEVER:

```ts
$fetch("https://erp.nscontinent.com/api/...")
```

---

## 6. DATA FLOW (FINAL ARCHITECTURE)

```
Page (SSR)
  ↓
useAsyncData
  ↓
/api/[...path] (proxy + cache)
  ↓
Backend API
  ↓
Composable (state + logic)
  ↓
Component (pure UI)
```

---

## 7. LOADING STRATEGY

* Initial load → use `pending` from `useAsyncData`
* Subsequent actions → use `isLoading` from composable

---

## 8. PERFORMANCE GUARANTEES

After refactor:

* No blank screen
* No client-only first fetch
* No duplicate API calls
* Minimal re-render
* Fast TTFB + fast hydration
* Scalable across all modules

---

## 9. OUTPUT FORMAT

You MUST output:

1. Refactored Page (SSR-first)
2. Refactored Composable (no initial fetch)
3. Refactored Components (pure UI)
4. Optimized `[...path].ts` (if needed)
5. Explanation:

   * what was wrong
   * what was fixed
   * why it improves performance

---

## ⚠️ HARD CONSTRAINTS

* DO NOT remove business logic
* DO NOT reduce features
* DO NOT merge layers into one file
* DO NOT create new API files (use `[...path].ts`)
* KEEP strict TypeScript
* KEEP existing functionality intact

---

## 🧠 BONUS OPTIMIZATION (APPLY IF POSSIBLE)

* Debounce search input
* Lazy-load dropdown data
* Split heavy components
* Cache expensive computed
* Avoid unnecessary reactive dependencies

---

## 🔥 FINAL RULE (MOST IMPORTANT)

If you see ANY of these:

```ts
onMounted(fetchData)
initialize()
import.meta.client
```

You MUST:

* DELETE IT
* MOVE logic into `useAsyncData`
* RESTRUCTURE properly

NO EXCEPTIONS.



**End of Guide**
