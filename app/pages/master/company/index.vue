<script setup lang="ts">
import { Download, LayoutGrid, LayoutList, Loader2, Plus, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Combobox from "~/components/ui/Combobox.vue";
import { useCompanies, type MappedCompany } from "~/composables/useCompanies";
import { useMasterData } from "~/composables/useMasterData";
import type { Company } from "~/composables/useMasterData";
import { buildStyledWorkbook, type StyledRow } from "~/lib/excel-styled";
import { exportStyledPdf, type PdfCol } from "~/lib/pdf-export";
import { cn } from "~/lib/utils";
import CompanyCreateModal from "./components/CompanyCreateModal.vue";
import CompanyDetailModal from "./components/CompanyDetailModal.vue";
import CompanyGrid from "./components/CompanyGrid.vue";
import CompanyList from "./components/CompanyList.vue";

definePageMeta({
  layout: "dashboard",
});

const { companies: companiesList, pagination, loadCompanies, deleteCompany } = useCompanies();
const { fetchCompanyCategories } = useMasterData();
const { hasAccess } = useRoleAccess();
const { showExportOptions, triggerX, triggerY, triggerWidth, triggerHeight, openExportPopup } =
  useExportPopup();
const canManageCompany = computed(() => hasAccess("master.company", "manage"));

const companiesData = useAsyncData(
  "companies-list",
  () =>
    loadCompanies({
      page: 1,
      limit: 50,
      type: "ALL",
      status: "ALL",
    }),
  { server: false },
);
const categoriesData = useAsyncData("company-categories", () => fetchCompanyCategories(), {
  server: false,
});

const pending = computed(() => companiesData.pending.value || categoriesData.pending.value);
const refresh = companiesData.refresh;

const route = useRoute();
watch(
  () => route.fullPath,
  () => refreshNuxtData("companies-list"),
);

const { confirm } = useConfirm();

const isDetailOpen = ref(false);
const selectedCompanyDetail = ref<MappedCompany | null>(null);
const isFormOpen = ref(false);
const formMode = ref<"create" | "edit">("create");
const selectedCompanyForm = ref<MappedCompany | null>(null);
const selectedIds = ref<Set<string>>(new Set());
const isExporting = ref(false);

const openDetailModal = (company: MappedCompany) => {
  selectedCompanyDetail.value = company;
  isDetailOpen.value = true;
};

const searchQuery = ref("");
const selectedCategory = ref<string>("all");
const selectedCountry = ref<string>("all");
const selectedCity = ref<string>("all");
const pageSize = ref(50);

const allWhenEmpty = (source: Ref<string>) =>
  computed({
    get: () => source.value,
    set: (value: string | null | undefined) => {
      source.value = value || "all";
    },
  });

const selectedCategoryModel = allWhenEmpty(selectedCategory);
const selectedCountryModel = allWhenEmpty(selectedCountry);
const selectedCityModel = allWhenEmpty(selectedCity);

const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedCompanies = computed(() => {
  const mapped = filteredCompanies.value.map((c) => ({
    ...c,
    code: c.code || `CUST-${c.id.slice(0, 6).toUpperCase()}`,
    email: c.email || "-",
    phone: c.phone || "-",
    address: c.addresses?.[0]?.fullAddress || "-",
    country: c.addresses?.[0]?.country || "-",
    city: c.addresses?.[0]?.city || "-",
    type: c.category?.name || "-",
    categoryName: c.category?.name || "-",
    status: c.isActive ? "Active" : "Inactive",
    totalJobs: c.totalJobs ?? 0,
  }));

  const sorted = [...mapped];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "category":
        comparison = a.categoryName.localeCompare(b.categoryName);
        break;
      case "country":
        comparison = a.country.localeCompare(b.country);
        break;
      case "city":
        comparison = a.city.localeCompare(b.city);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
  return sorted;
});

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

const currentPage = computed({
  get: () => pagination.value.page || 1,
  set: (value) => {
    pagination.value.page = value;
  },
});

const categoryOptions = computed(() => [
  { id: "all", name: "All Types" },
  ...(categoriesData.data.value?.map((c) => ({ id: c.id, name: c.name })) ?? []),
]);

const uniqueAddressOptions = (field: "country" | "city") => {
  const values = new Set<string>();
  companiesList.value.forEach((company) => {
    const value = company.addresses?.[0]?.[field]?.trim();
    if (value) values.add(value);
  });
  return Array.from(values)
    .toSorted((a, b) => a.localeCompare(b))
    .map((value) => ({ id: value, name: value }));
};

const countryOptions = computed(() => [
  { id: "all", name: "All Countries" },
  ...uniqueAddressOptions("country"),
]);
const cityOptions = computed(() => [
  { id: "all", name: "All Cities" },
  ...uniqueAddressOptions("city"),
]);

const filteredCompanies = computed(() => {
  let result = companiesList.value;

  if (selectedCategory.value !== "all") {
    result = result.filter((c) => c.categoryId === selectedCategory.value);
  }

  if (selectedCountry.value !== "all") {
    result = result.filter((c) => c.addresses?.[0]?.country === selectedCountry.value);
  }

  if (selectedCity.value !== "all") {
    result = result.filter((c) => c.addresses?.[0]?.city === selectedCity.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.code?.toLowerCase().includes(query),
    );
  }

  return result;
});

const companyStats = computed(() => {
  const total = pagination.value.total || companiesList.value.length;
  return {
    total,
    active: companiesList.value.filter((company) => company.isActive).length,
    customers: companiesList.value.filter((company) => company.isCustomer).length,
    vendors: companiesList.value.filter((company) => company.isVendor).length,
  };
});

const fetchWithFilters = async (page = 1) => {
  await loadCompanies({
    search: searchQuery.value || undefined,
    type: "ALL",
    status: "ALL",
    page,
    limit: pageSize.value,
  });
};

const patchRenderedCompany = async (company: Company) => {
  const exists = companiesList.value.some((item) => item.id === company.id);
  companiesList.value = exists
    ? companiesList.value.map((item) => (item.id === company.id ? { ...item, ...company } : item))
    : [company, ...companiesList.value];

  if (selectedCompanyDetail.value?.id === company.id) {
    selectedCompanyDetail.value = { ...selectedCompanyDetail.value, ...company };
  }
  if (selectedCompanyForm.value?.id === company.id) {
    selectedCompanyForm.value = { ...selectedCompanyForm.value, ...company };
  }

  if (import.meta.client && localStorage.getItem("debug_api_refresh") === "true") {
    console.debug("[Company UI state]", {
      source: "companies useState",
      item: companiesList.value.find((item) => item.id === company.id),
    });
  }

  await fetchWithFilters(currentPage.value);
};

const handlePageChange = async (page: number) => {
  await fetchWithFilters(page);
};

const selectAll = computed({
  get: () =>
    sortedCompanies.value.length > 0 &&
    sortedCompanies.value.every((c) => selectedIds.value.has(c.id)),
  set: (val) => {
    const next = new Set(selectedIds.value);
    sortedCompanies.value.forEach((company) => {
      if (val) {
        next.add(company.id);
      } else {
        next.delete(company.id);
      }
    });
    selectedIds.value = next;
  },
});

const toggleSelect = (payload: { id: string; value: boolean }) => {
  const next = new Set(selectedIds.value);
  if (payload.value) {
    next.add(payload.id);
  } else {
    next.delete(payload.id);
  }
  selectedIds.value = next;
};

const openCreateModal = () => {
  if (!canManageCompany.value) {
    toast.error("You only have view access for company data.");
    return;
  }

  formMode.value = "create";
  selectedCompanyForm.value = null;
  isFormOpen.value = true;
};

const openEditModal = (company: MappedCompany) => {
  if (!canManageCompany.value) {
    toast.error("You only have view access for company data.");
    return;
  }

  formMode.value = "edit";
  selectedCompanyForm.value = company;
  isFormOpen.value = true;
};

const handleDeleteCompany = async (company: MappedCompany) => {
  if (!canManageCompany.value) {
    toast.error("You only have view access for company data.");
    return;
  }

  const isConfirmed = await confirm({
    title: "Delete company?",
    message: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });
  if (!isConfirmed) return;
  const result = await deleteCompany(company.id);
  if (result.success) {
    toast.success("Company deleted.");
    await fetchWithFilters(currentPage.value);
  } else {
    toast.error(result.error || "Failed to delete company.");
  }
};

const getExportRows = () => sortedCompanies.value;
const exportDate = () => new Date().toISOString().split("T")[0];
const exportPeriodLabel = (total: number) =>
  `Generated: ${new Date().toLocaleDateString("id-ID")} | Total: ${total}`;

const handleExportExcel = () => {
  const rows = getExportRows();
  if (rows.length === 0) {
    toast.error("Tidak ada data company untuk diexport.");
    return;
  }

  isExporting.value = true;
  try {
    const workbookRows: StyledRow[] = [
      { cells: ["COMPANY MASTER REPORT", "", "", "", "", "", "", "", ""], style: 7 },
      {
        cells: [exportPeriodLabel(rows.length), "", "", "", "", "", "", "", ""],
        style: 8,
      },
      {
        cells: [
          "No. Cust",
          "Company",
          "Email",
          "Phone",
          "Type",
          "Country",
          "City",
          "Status",
          "Total Job",
        ],
        style: 0,
      },
    ];

    rows.forEach((company, index) => {
      workbookRows.push({
        cells: [
          company.code,
          company.name,
          company.email,
          company.phone,
          company.type,
          company.country,
          company.city,
          company.status,
          company.totalJobs,
        ],
        style: index % 2 === 0 ? 5 : 6,
      });
    });

    buildStyledWorkbook(
      "Company",
      workbookRows,
      [18, 34, 32, 20, 18, 18, 18, 14, 12],
      `COMPANY_MASTER_${exportDate()}.xlsx`,
    );
    toast.success("Company exported to Excel.");
  } catch (error) {
    console.error("Export company Excel error:", error);
    toast.error("Gagal mengekspor company ke Excel.");
  } finally {
    isExporting.value = false;
  }
};

const handleExportPdf = async () => {
  const rows = getExportRows();
  if (rows.length === 0) {
    toast.error("Tidak ada data company untuk diexport.");
    return;
  }

  isExporting.value = true;
  try {
    const cols: PdfCol[] = [
      { header: "No. Cust", width: 0.11 },
      { header: "Company", width: 0.2 },
      { header: "Email", width: 0.18 },
      { header: "Phone", width: 0.1 },
      { header: "Type", width: 0.12 },
      { header: "Country", width: 0.1 },
      { header: "City", width: 0.1 },
      { header: "Status", width: 0.07, align: "center" },
      { header: "Jobs", width: 0.02, align: "right" },
    ];
    const pdfRows = rows.map((company) => [
      company.code,
      company.name,
      company.email,
      company.phone,
      company.type,
      company.country,
      company.city,
      company.status,
      company.totalJobs,
    ]);

    await exportStyledPdf({
      title: "Company Master Report",
      period: exportPeriodLabel(rows.length),
      cols,
      rows: pdfRows,
      filename: `COMPANY_MASTER_${exportDate()}.pdf`,
      orientation: "landscape",
    });
    toast.success("Company exported to PDF.");
  } catch (error) {
    console.error("Export company PDF error:", error);
    toast.error("Gagal mengekspor company ke PDF.");
  } finally {
    isExporting.value = false;
  }
};

watch([selectedCategory, selectedCountry, selectedCity], () => {
  fetchWithFilters(1);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Company</h1>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-border text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-60"
          :disabled="sortedCompanies.length === 0 || isExporting"
          @click="openExportPopup($event)"
        >
          <Loader2 v-if="isExporting" class="w-4 h-4 animate-spin" />
          <Download v-else class="w-4 h-4" />
          <span>{{ isExporting ? "Exporting..." : "Export" }}</span>
        </button>
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

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Total Companies</p>
        <p class="text-2xl font-bold text-foreground mt-1">{{ companyStats.total }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Active Companies</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ companyStats.active }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Customers</p>
        <p class="text-2xl font-bold text-[#012D5A] mt-1">{{ companyStats.customers }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Vendors</p>
        <p class="text-2xl font-bold text-[#012D5A] mt-1">{{ companyStats.vendors }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Company..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="selectedCategoryModel"
          :options="categoryOptions"
          placeholder="Type"
          class="min-w-[180px]"
        />
        <Combobox
          v-model="selectedCountryModel"
          :options="countryOptions"
          placeholder="Country"
          class="min-w-[180px]"
        />
        <Combobox
          v-model="selectedCityModel"
          :options="cityOptions"
          placeholder="City"
          class="min-w-[180px]"
        />
        <button
          v-if="canManageCompany"
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Company</span>
        </button>
      </div>
    </div>

    <UiLoadingSkeleton
      v-if="pending && viewMode === 'list'"
      variant="table"
      :columns="canManageCompany ? 10 : 9"
    />
    <UiLoadingSkeleton v-else-if="pending" variant="cards" />

    <CompanyList
      v-else-if="viewMode === 'list'"
      :companies="sortedCompanies"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      :select-all="selectAll"
      :selected-ids="selectedIds"
      @update:sort="toggleSort"
      @open-detail="openDetailModal"
      @update:select-all="selectAll = $event"
      @toggle-select="toggleSelect"
      @edit="openEditModal"
      @delete="handleDeleteCompany"
      :can-manage="canManageCompany"
    />

    <CompanyGrid
      v-else
      :companies="sortedCompanies"
      :can-manage="canManageCompany"
      @open-detail="openDetailModal"
      @edit="openEditModal"
      @delete="handleDeleteCompany"
    />

    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ pagination.total || sortedCompanies.length }} data found.</p>
      <UiPagination
        v-if="pagination.total > pagination.limit"
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>

    <CompanyCreateModal
      v-model="isFormOpen"
      :mode="formMode"
      :company="selectedCompanyForm"
      @success="patchRenderedCompany"
    />
    <CompanyDetailModal v-model="isDetailOpen" :company="selectedCompanyDetail" />
    <UiExportOptionsModal
      v-model:open="showExportOptions"
      :trigger-x="triggerX"
      :trigger-y="triggerY"
      :trigger-width="triggerWidth"
      :trigger-height="triggerHeight"
      title="Export Company"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />
  </div>
</template>
