# AGENTS.md - Frontend Project Context & Directives

> **SYSTEM INSTRUCTION:** ALL AI AGENTS WORKING ON THIS FRONTEND REPOSITORY MUST READ AND ADHERE TO THE FOLLOWING ARCHITECTURAL GUIDELINES AND CONSTRAINTS. DO NOT DEVIATE WITHOUT EXPLICIT USER OVERRIDE.

## 1. Project Overview

**Project:** NS Continent ERP Frontend - Shipping & Logistics Management System UI
**Goal:** A comprehensive web application UI for freight forwarding and shipping companies, handling export/import operations, job management, electronic Bills of Lading (eBL), invoicing, payments, and accounting.

## 2. Tech Stack (Strict)

- **Framework:** [Nuxt](https://nuxt.com) v4.2.2 (Modern Vue Framework)
- **UI Framework:** [Vue](https://vuejs.org) v3.5.26 (Progressive JavaScript Framework)
- **Language:** TypeScript (Strict Mode - NO `any` ALLOWED)
- **Styling:** Tailwind CSS
- **State Management:** Vue Composables (useState)
- **API Client:** Built-in $fetch / useFetch with OpenAPI types
- **Auth:** Better Auth client with organization support
- **Linting:** Oxlint (strict type-safe configuration)

## 3. Architecture & Core Philosophy

This project uses a **Feature-Based Directory Structure** with **Composition API** and **ABSOLUTE TYPE SAFETY**.

- **Pages:** File-based routing with Nuxt
- **Components:** Atomic design principles (UI, Layout, Feature)
- **Composables:** Reusable stateful logic
- **Layouts:** Page layout templates
- **Middleware:** Route guards and auth checks

---

## 4. The "Golden Rules" (Violations = Immediate Rejection)

### 1. The Composition API Rule

**ALWAYS** use Composition API with `<script setup>` syntax. **NEVER** use Options API.

**Why?**

- Better TypeScript inference
- More flexible code organization
- Better tree-shaking
- Modern Vue best practice

**Example:**

```vue
<!-- ✅ GOOD -->
<script setup lang="ts">
import { ref, computed } from "vue";

interface Job {
  id: string;
  jobNumber: string;
  pol: string;
  pod: string;
}

const jobs = ref<Job[]>([]);
const jobCount = computed(() => jobs.value.length);

const fetchJobs = async (): Promise<void> => {
  const response = await $fetch<Job[]>("/api/jobs");
  jobs.value = response;
};
</script>

<!-- ❌ BAD -->
<script lang="ts">
export default {
  data() {
    return { jobs: [] };
  },
  computed: {
    jobCount() {
      return this.jobs.length;
    },
  },
};
</script>
```

### 2. The Type Safety Rule (STRICT)

**NEVER** use `any` type. **ALWAYS** define proper types and interfaces.

**Why?**

- Type safety catches errors at compile time
- Enables better IDE support and autocomplete
- Makes refactoring safer
- Self-documenting code

**Example:**

```typescript
// ✅ GOOD
interface CreateJobInput {
  jobNumber: string;
  pol: string;
  pod: string;
  commodity: string;
}

const createJob = async (data: CreateJobInput): Promise<Job> => {
  return await $fetch("/api/jobs", { method: "POST", body: data });
};

// ❌ BAD
const createJob = async (data: any): Promise<any> => {
  return await $fetch("/api/jobs", { method: "POST", body: data });
};
```

### 3. The Composable Pattern Rule

**ALWAYS** use composables for reusable stateful logic. **NEVER** duplicate logic across components.

**Why?**

- DRY (Don't Repeat Yourself)
- Easier testing
- Better code organization
- Shareable logic

**Example:**

```typescript
// ✅ GOOD - composables/useJobs.ts
export const useJobs = () => {
  const jobs = useState<Job[]>("jobs", () => []);
  const loading = ref(false);

  const fetchJobs = async (): Promise<void> => {
    loading.value = true;
    try {
      jobs.value = await $fetch("/api/jobs");
    } finally {
      loading.value = false;
    }
  };

  return { jobs, loading, fetchJobs };
};

// Usage in component
const { jobs, loading, fetchJobs } = useJobs();
```

### 4. The useFetch Rule

**ALWAYS** use `useFetch` or `$fetch` for API calls. **NEVER** use axios or other HTTP libraries.

**Why?**

- Nuxt's built-in fetch handles SSR/hydration
- Automatic error handling
- Type-safe with generics
- Better performance

**Example:**

```vue
<script setup lang="ts">
// ✅ GOOD - useFetch for server-side compatible fetching
const { data: jobs, pending, error } = await useFetch<Job[]>("/api/jobs");

// ✅ GOOD - $fetch for client-side mutations
const createJob = async (jobData: CreateJobInput): Promise<void> => {
  await $fetch("/api/jobs", {
    method: "POST",
    body: jobData,
  });
  await refreshNuxtData("jobs");
};
</script>
```

### 5. The Component Naming Rule

**ALWAYS** use PascalCase for component names. **ALWAYS** use descriptive names.

**Why?**

- Consistent naming convention
- Better readability
- Vue best practices

**Example:**

```text
✅ GOOD:
- JobCard.vue
- BillOfLadingEditor.vue
- DashboardStatCard.vue

❌ BAD:
- jobcard.vue
- bloEditor.vue
- card.vue
```

### 6. The Props/Emits Type Safety Rule

**ALWAYS** define types for props and emits using TypeScript interfaces.

**Example:**

```vue
<script setup lang="ts">
// ✅ GOOD
interface Props {
  job: Job;
  readonly?: boolean;
}

interface Emits {
  (e: "update", job: Job): void;
  (e: "delete", id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

const emit = defineEmits<Emits>();
</script>
```

### 7. The File Structure Rule

**ALWAYS** follow the Nuxt v4 directory structure convention.

**Directory Structure:**

```text
nscontinenterp-fe/
├── app/
│   ├── components/           # Vue components
│   │   ├── ui/              # UI components (Button, Input, Modal)
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── [feature]/       # Feature components
│   │
│   ├── composables/          # Vue composables
│   │   ├── useAuth.ts
│   │   ├── useJobs.ts
│   │   └── useMasterData.ts
│   │
│   ├── layouts/              # Nuxt layouts
│   │   ├── default.vue
│   │   └── dashboard.vue
│   │
│   ├── middleware/           # Route middleware
│   │   └── auth.global.ts
│   │
│   ├── pages/                # File-based routing
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── dashboard.vue
│   │   ├── operational/
│   │   │   ├── jobs/
│   │   │   │   ├── index.vue
│   │   │   │   ├── create.vue
│   │   │   │   └── [id].vue
│   │   │   └── ebl/
│   │   ├── master/
│   │   ├── finance/
│   │   └── settings/
│   │
│   ├── plugins/              # Nuxt plugins
│   │   └── apexcharts.client.ts
│   │
│   ├── types/                # TypeScript types
│   │   └── auth.ts
│   │
│   └── app.vue               # Root component
│
├── public/                   # Static assets
├── nuxt.config.ts            # Nuxt configuration
└── tailwind.config.ts        # Tailwind configuration
```

---

## 5. Domain Context & Naming Conventions

| Business Term        | Code Path                 | Description                     |
| -------------------- | ------------------------- | ------------------------------- |
| **Job/Shipment**     | `pages/operational/jobs/` | Shipment management             |
| **Bill of Lading**   | `pages/operational/ebl/`  | eBL management                  |
| **Customer**         | `pages/master/customer/`  | Customer master data            |
| **Vendor**           | `pages/master/vendor/`    | Vendor master data              |
| **Shipping Service** | `pages/master/services/`  | Service master data             |
| **Quotation**        | `pages/sales/quotation/`  | Sales quotations                |
| **Invoice**          | `pages/finance/invoice/`  | Invoice management              |
| **Payment**          | `pages/finance/payment/`  | Payment records                 |
| **Reports**          | `pages/reports/`          | Financial & operational reports |

---

## 6. Development Workflow (How to build a feature)

When asked to "Build Feature X", follow this strict sequence:

### Phase 1: Types & Data

1. **Define Types:** Create/update types in `app/types/` or inline interfaces.
2. **Create Composable:** Build stateful logic in `app/composables/`.
3. **API Integration:** Define API calls using `useFetch` or `$fetch`.

### Phase 2: UI Components

4. **Build Components:** Create reusable components in `app/components/`.
5. **Create Pages:** Build pages in `app/pages/` following file-based routing.

### Phase 3: Integration

6. **Add Middleware:** Implement auth guards if needed.
7. **Update Layouts:** Adjust layouts if navigation changes required.
8. **Test:** Verify functionality and type safety.

---

## 7. Code Snippet Standards

### A. Page Component Template

```vue
<!-- pages/jobs/index.vue -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Jobs</h1>
    <JobList :jobs="jobs" :loading="pending" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import type { Job } from "~/types/job";

// Page meta
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});

// Fetch data
const { data: jobs, pending, refresh } = await useFetch<Job[]>("/api/jobs");
</script>
```

### B. Component Template

```vue
<!-- components/job/JobCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-semibold">{{ job.jobNumber }}</h3>
    <p class="text-gray-600">{{ job.pol }} → {{ job.pod }}</p>
    <button @click="handleClick" class="btn-primary">View Details</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  job: Job;
}

interface Emits {
  (e: "click", job: Job): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = (): void => {
  emit("click", props.job);
};
</script>
```

### C. Composable Template

```typescript
// composables/useJobs.ts
export interface UseJobsReturn {
  jobs: Ref<Job[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  fetchJobs: () => Promise<void>;
  createJob: (data: CreateJobInput) => Promise<void>;
}

export const useJobs = (): UseJobsReturn => {
  const jobs = useState<Job[]>("jobs", () => []);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchJobs = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      jobs.value = await $fetch("/api/jobs");
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

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
  };
};
```

---

## 8. Code Quality Checklist

**Before committing:**

```bash
# Lint
bun run lint

# Type check
bun run typecheck

# Build test
bun run build
```

**Rules:**

- ✅ No `any` types allowed (strict TypeScript)
- ✅ Use `<script setup lang="ts">` for all components
- ✅ Define types for all props and emits
- ✅ Use composables for reusable logic
- ✅ Use `useFetch` / `$fetch` for API calls
- ✅ Follow Nuxt v4 directory structure
- ✅ Use Tailwind for styling (no inline styles)
- ✅ Handle errors gracefully with try-catch

---

## 9. Common Anti-Patterns to Avoid

### ❌ Using Options API

```vue
<!-- BAD -->
<script lang="ts">
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>

<!-- GOOD -->
<script setup lang="ts">
const count = ref(0);
const increment = (): void => {
  count.value++;
};
</script>
```

### ❌ Using `any` Type

```typescript
// BAD
const fetchData = async (): Promise<any> => {
  return await $fetch("/api/data");
};

// GOOD
interface Data {
  id: string;
  name: string;
}

const fetchData = async (): Promise<Data[]> => {
  return await $fetch<Data[]>("/api/data");
};
```

### ❌ Inline Logic in Templates

```vue
<!-- BAD -->
<template>
  <div v-for="job in jobs.filter((j) => j.status === 'ACTIVE')" :key="job.id">
    {{ job.jobNumber }}
  </div>
</template>

<!-- GOOD -->
<script setup lang="ts">
const activeJobs = computed(() => jobs.value.filter((j) => j.status === "ACTIVE"));
</script>

<template>
  <div v-for="job in activeJobs" :key="job.id">
    {{ job.jobNumber }}
  </div>
</template>
```

---

**END OF INSTRUCTION**
