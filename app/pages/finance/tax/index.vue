<script setup lang="ts">
import {
  Plus,
  Search,
  Calculator,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import {
  useFinanceTax,
  type Tax,
  type TaxFilters,
  type Pagination,
} from "~/composables/useFinanceTax";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  layout: "dashboard",
});

const { fetchTaxes, fetchTaxById, deleteTax, updateTax, isLoading: isTaxLoading } = useFinanceTax();
const { confirm } = useConfirm();

// Filters & Pagination
const filters = ref<TaxFilters>({
  search: "",
  type: "",
  page: 1,
  limit: 10,
});

const taxes = ref<Tax[]>([]);
const pagination = ref<Pagination>({
  total: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
});

const viewMode = ref<"list" | "grid">("list");

// Load data
async function loadTaxes() {
  try {
    const result = await fetchTaxes(filters.value);
    taxes.value = result.items;
    pagination.value = result.pagination;
  } catch (error) {
    console.error("Failed to load taxes:", error);
  }
}

// Debounced search
const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.search = val;
    filters.value.page = 1;
  }, 500);
});

// Watch filter changes
watch(
  () => [filters.value.search, filters.value.type, filters.value.page],
  () => {
    loadTaxes();
  },
  { deep: true },
);

const handlePageChange = (page: number) => {
  filters.value.page = page;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const deleteTaxAction = async (id: string) => {
  const tax = taxes.value.find((t) => t.id === id);
  const taxName = tax?.name || id;

  const confirmed = await confirm({
    title: "Hapus Pajak",
    message: `Apakah Anda yakin ingin menghapus pajak ${taxName}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Hapus",
    cancelText: "Batal",
    type: "danger",
  });

  if (confirmed) {
    await deleteTax(id);
    loadTaxes();
  }
};

// Edit modal state
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const editError = ref<string | null>(null);
const editingTaxId = ref<string>("");

// Form state for tax edit
const formData = ref({
  name: "",
  rate: 0,
  type: "",
  description: "",
  isActive: true,
});

// Tax type options
const taxTypeOptions = [
  { value: "ppn", label: "PPN" },
  { value: "pph", label: "PPh" },
];

// Open edit modal with form
const openEditModal = async (id: string) => {
  try {
    editingTaxId.value = id;

    const taxData = await fetchTaxById(id);
    if (!taxData) {
      throw new Error("Failed to load tax data");
    }

    const tax = taxData as Tax;

    formData.value = {
      name: tax.name || "",
      rate: Number(tax.rate) || 0,
      type: tax.type || "",
      description: tax.description || "",
      isActive: tax.isActive ?? true,
    };

    isEditModalOpen.value = true;
    editError.value = null;
  } catch (e) {
    console.error("Failed to open edit modal:", e);
    editError.value = "Failed to load tax data";
  }
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editError.value = null;
  editingTaxId.value = "";
};

// Handle edit - open inline edit modal
const handleEdit = (id: string) => {
  openEditModal(id);
};

// Submit tax update
const handleUpdate = async () => {
  if (!editingTaxId.value) return;

  try {
    isSubmitting.value = true;
    editError.value = null;

    const result = await updateTax(editingTaxId.value, {
      name: formData.value.name,
      rate: formData.value.rate,
      type: formData.value.type,
      description: formData.value.description,
      isActive: formData.value.isActive,
    });

    if (result) {
      closeEditModal();
      await loadTaxes();
    } else {
      throw new Error("Failed to update tax");
    }
  } catch (e) {
    console.error("Failed to update tax:", e);
    editError.value = "Failed to update tax";
  } finally {
    isSubmitting.value = false;
  }
};

const isLoading = computed(() => isTaxLoading.value);

onMounted(() => {
  loadTaxes();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Pajak</h1>
        <p class="text-muted-foreground mt-1">Kelola catatan pajak PPN dan PPh</p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pajak..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.type"
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Tipe</option>
          <option value="ppn">PPN</option>
          <option value="pph">PPh</option>
        </select>
        <NuxtLink
          to="/finance/tax/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Pajak</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- List View -->
      <div
        v-if="viewMode === 'list'"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-white text-left">
                <th class="py-3 px-4 text-sm font-medium text-foreground">Nama</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tipe</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Rate (%)</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tax in taxes"
                :key="tax.id"
                class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                      <Calculator class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ tax.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                  >
                    {{ tax.type }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm font-medium">{{ tax.rate }}%</td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ tax.description || "-" }}
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="
                      cn(
                        'px-2 py-0.5 rounded border text-xs font-medium',
                        tax.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200',
                      )
                    "
                  >
                    {{ tax.isActive ? "Aktif" : "Nonaktif" }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleEdit(tax.id)"
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="deleteTaxAction(tax.id)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="taxes.length === 0">
                <td colspan="6" class="py-12 text-center text-muted-foreground">
                  Tidak ada pajak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tax in taxes"
          :key="tax.id"
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
          @click="navigateTo(`/finance/tax/${tax.id}`)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
              >
                <Calculator class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-base text-foreground">{{ tax.name }}</h3>
                <p class="text-xs text-muted-foreground uppercase">{{ tax.type }}</p>
              </div>
            </div>
            <button class="text-muted-foreground hover:text-foreground" @click.stop>
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-4 mb-4">
            <div>
              <p class="text-xs text-muted-foreground mb-1">Rate</p>
              <p class="text-lg font-bold text-[#012D5A]">{{ tax.rate }}%</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Status</p>
              <span
                :class="
                  cn(
                    'px-2 py-0.5 rounded border text-xs font-medium',
                    tax.isActive
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200',
                  )
                "
              >
                {{ tax.isActive ? "Aktif" : "Nonaktif" }}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-border">
            <p class="text-xs text-muted-foreground line-clamp-2">
              {{ tax.description || "Tidak ada deskripsi" }}
            </p>
          </div>
        </div>
        <div
          v-if="taxes.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          Tidak ada pajak ditemukan.
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <p>{{ pagination.total }} data found.</p>
        <UiPagination
          v-if="pagination.total > 0"
          v-model:page="filters.page"
          :total="pagination.total"
          :items-per-page="pagination.limit"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </div>

  <!-- Edit Modal -->
  <Teleport to="body">
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="closeEditModal"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">Edit Pajak</h2>
          <button @click="closeEditModal" class="p-1 hover:bg-muted rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleUpdate" class="p-6 space-y-4">
          <div v-if="editError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {{ editError }}
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Nama Pajak</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tipe</label>
              <select
                v-model="formData.type"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="" disabled>Pilih Tipe</option>
                <option v-for="opt in taxTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Rate (%)</label>
              <input
                v-model.number="formData.rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="formData.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 rounded border-border text-[#012D5A] focus:ring-[#012D5A]"
            />
            <label for="isActive" class="text-sm font-medium">Pajak Aktif</label>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
