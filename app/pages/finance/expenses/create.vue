<script setup lang="ts">
import { ArrowLeft, Save } from "lucide-vue-next";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { useCompanies } from "~/composables/useCompanies";
import { useJobs } from "~/composables/useJobs";
import { useServices } from "~/composables/useServices";

definePageMeta({
  layout: "dashboard",
});

const { createExpense, isLoading } = useFinanceExpense();
const { fetchCompanies } = useCompanies();
const { fetchJobs } = useJobs();
const { fetchServices } = useServices();

const form = ref({
  number: "",
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  categoryId: "",
  vendorId: "",
  jobId: "",
  notes: "",
});

const vendors = ref<unknown[]>([]);
const jobs = ref<unknown[]>([]);
const categories = ref<{ id: string; name: string }[]>([]);

// Typed helpers for template
const vendorsList = computed(() => vendors.value as { id: string; name: string }[]);
const jobsList = computed(() => jobs.value as { id: string; jobNumber: string }[]);

async function loadInitialData() {
  const [vendorRes, jobRes, serviceRes] = await Promise.all([
    fetchCompanies({ type: "VENDOR" }),
    fetchJobs(),
    fetchServices(),
  ]);

  if (vendorRes.success && vendorRes.data) vendors.value = vendorRes.data;
  if (jobRes.success && jobRes.data) jobs.value = jobRes.data;
  // Use services as categories — each service has a category embedded
  if (serviceRes.success && serviceRes.data) {
    // Extract unique categories from services
    const catMap = new Map<string, { id: string; name: string }>();
    for (const svc of serviceRes.data) {
      if (svc.category) {
        catMap.set(svc.category.id, { id: svc.category.id, name: svc.category.name });
      }
    }
    categories.value = Array.from(catMap.values());
  }
}

async function handleSubmit() {
  try {
    const payload: Record<string, unknown> = {
      number: form.value.number,
      description: form.value.description,
      amount: Number(form.value.amount),
      date: form.value.date,
    };
    if (form.value.categoryId) payload.categoryId = form.value.categoryId;
    if (form.value.vendorId) payload.vendorId = form.value.vendorId;
    if (form.value.jobId) payload.jobId = form.value.jobId;

    await createExpense(payload);
    navigateTo("/finance/expenses");
  } catch (error) {
    alert("Gagal mencatat biaya: " + (error as Error).message);
  }
}

onMounted(() => {
  loadInitialData();
  form.value.number = `EXP-${Date.now().toString().slice(-6)}`;
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/expenses" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold">Catat Biaya Baru</h1>
          <p class="text-muted-foreground mt-1">Masukkan detail pengeluaran operasional</p>
        </div>
      </div>
    </div>

    <div class="max-w-3xl">
      <form
        @submit.prevent="handleSubmit"
        class="space-y-6 bg-white p-8 rounded-xl border border-border"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">No. Biaya</label>
            <input
              v-model="form.number"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="EXP-2024-XXXX"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Tanggal</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium">Deskripsi</label>
            <input
              v-model="form.description"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="Contoh: Biaya Trucking JOB..."
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Vendor</label>
            <select
              v-model="form.vendorId"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="">Pilih Vendor (Opsional)</option>
              <option v-for="vendor in vendorsList" :key="vendor.id" :value="vendor.id">
                {{ vendor.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Kategori</label>
            <select
              v-model="form.categoryId"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="">Pilih Kategori (Opsional)</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Jumlah (IDR)</label>
            <input
              v-model="form.amount"
              type="number"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
              placeholder="0"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">No. Job (Opsional)</label>
            <select
              v-model="form.jobId"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
            >
              <option value="">Pilih Job</option>
              <option v-for="job in jobsList" :key="job.id" :value="job.id">
                {{ job.jobNumber }}
              </option>
            </select>
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium">Keterangan Tambahan</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none"
              placeholder="Tambahkan catatan jika perlu..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="navigateTo('/finance/expenses')"
            class="px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2"
          >
            <Save v-if="!isLoading" class="w-4 h-4" />
            <span v-if="isLoading">Menyimpan...</span>
            <span v-else>Simpan Biaya</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
