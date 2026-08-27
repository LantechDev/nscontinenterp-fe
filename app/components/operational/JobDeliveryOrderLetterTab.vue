<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose job and draft snapshot data */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-vue-next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";

import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import JobPartyRow from "~/pages/operational/jobs/components/JobPartyRow.vue";
import type {
  DeliveryOrderLetter,
  DeliveryOrderLetterContainer,
} from "~/composables/useDeliveryOrderLetters";
import type { Address, Company, Vessel } from "~/composables/useMasterData";

const props = defineProps<{
  job: any;
  canManageJob?: boolean;
}>();

const {
  fetchDeliveryOrderLetters,
  createDeliveryOrderLetter,
  updateDeliveryOrderLetterDraft,
  finalizeDeliveryOrderLetter,
  unfinalizeDeliveryOrderLetter,
  deleteDeliveryOrderLetter,
} = useDeliveryOrderLetters();
const { fetchCompanies, fetchVessels } = useMasterData();
const { confirm } = useConfirm();

const companies = ref<Company[]>([]);
const vessels = ref<Vessel[]>([]);
const letters = ref<DeliveryOrderLetter[]>([]);
const activeLetter = ref<DeliveryOrderLetter | null>(null);
const isFetching = ref(false);
const isCreating = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const editMode = ref(false);
const previewRef = ref<HTMLElement | null>(null);
const isGeneratingPdf = ref(false);
const logoUrl = ref("/images/transparentnscontinenttebal.png");
const isFinalized = computed(() => activeLetter.value?.status === "finalized");

const form = ref({
  letterNumber: "",
  letterDate: "",
  shippingLineCompanyId: "",
  shippingLineAddressId: "",
  shippingLineName: "",
  shippingLineAddress: "",
  deliveryOrderNo: "",
  mblNumber: "",
  vesselId: "",
  vesselName: "",
  voyageNumber: "",
  eta: "",
  consigneeCompanyId: "",
  consigneeAddressId: "",
  pickupLocation: "",
  consigneeName: "",
  consigneeAddress: "",
  notifyCompanyId: "",
  notifyAddressId: "",
  notifyName: "",
  notifyAddress: "",
  remarks: "",
  containers: [] as DeliveryOrderLetterContainer[],
});

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const toDateInput = (dateStr?: string | null) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0] || "";
};

const selectedTitle = computed(() => activeLetter.value?.letterNumber || "Surat Pengantar DO");

const joinLines = (...values: Array<string | null | undefined>) =>
  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join("\n") || "-";

const getParty = (letter: DeliveryOrderLetter, roleCode: string) =>
  letter.parties?.find((party) => party.partyRoleCode === roleCode);

const findCompany = (companyId?: string | null) =>
  companies.value.find((company) => company.id === companyId);

const findCompanyByName = (name?: string | null) => {
  const normalized = String(name || "")
    .trim()
    .toUpperCase();
  if (!normalized) return undefined;
  return companies.value.find((company) => company.name.trim().toUpperCase() === normalized);
};

const findVessel = (vesselId?: string | null) =>
  vessels.value.find((vessel) => vessel.id === vesselId);

const findVesselByName = (name?: string | null) => {
  const normalized = String(name || "")
    .trim()
    .toUpperCase();
  if (!normalized) return undefined;
  return vessels.value.find((vessel) => vessel.name.trim().toUpperCase() === normalized);
};

const findAddress = (companyId?: string | null, addressId?: string | null): Address | undefined =>
  findCompany(companyId)?.addresses?.find((address) => address.id === addressId);

const defaultAddressId = (companyId?: string | null) => {
  const addresses = findCompany(companyId)?.addresses || [];
  return (addresses.find((address) => address.isDefault) || addresses[0])?.id || "";
};

const assignDefaultAddress = (
  companyId: string,
  addressKey: "shippingLineAddressId" | "consigneeAddressId" | "notifyAddressId",
) => {
  const currentAddressId = form.value[addressKey];
  if (currentAddressId && findAddress(companyId, currentAddressId)) return;
  form.value[addressKey] = companyId ? defaultAddressId(companyId) : "";
};

const syncPartySnapshot = (
  companyId: string,
  addressId: string,
  nameKey: "shippingLineName" | "consigneeName" | "notifyName",
  addressKey: "shippingLineAddress" | "consigneeAddress" | "notifyAddress",
) => {
  const company = findCompany(companyId);
  const address = findAddress(companyId, addressId);
  if (company) form.value[nameKey] = company.name || "";
  form.value[addressKey] = address?.fullAddress || "";
};

const shippingLineAddress = computed(() => {
  if (!activeLetter.value) return "";
  const partyAddress = getParty(activeLetter.value, "SHIPPING_LINE")?.fullAddress;
  if (partyAddress) return partyAddress;
  const company = findCompanyByName(activeLetter.value.shippingLineName);
  const addresses = company?.addresses || [];
  return (addresses.find((address) => address.isDefault) || addresses[0])?.fullAddress || "";
});

const hydratePartySelectorFromName = (
  nameKey: "shippingLineName" | "consigneeName" | "notifyName",
  companyKey: "shippingLineCompanyId" | "consigneeCompanyId" | "notifyCompanyId",
  addressKey: "shippingLineAddressId" | "consigneeAddressId" | "notifyAddressId",
) => {
  if (form.value[companyKey]) return;
  const company = findCompanyByName(form.value[nameKey]);
  if (!company) return;
  form.value[companyKey] = company.id;
  form.value[addressKey] = defaultAddressId(company.id);
};

const hydratePartySelectorsFromSnapshots = () => {
  hydratePartySelectorFromName(
    "shippingLineName",
    "shippingLineCompanyId",
    "shippingLineAddressId",
  );
  hydratePartySelectorFromName("consigneeName", "consigneeCompanyId", "consigneeAddressId");
  hydratePartySelectorFromName("notifyName", "notifyCompanyId", "notifyAddressId");
};

const hydrateVesselSelectorFromName = () => {
  if (form.value.vesselId) return;
  const vessel = findVesselByName(form.value.vesselName);
  if (!vessel) return;
  form.value.vesselId = vessel.id;
};

const loadLetters = async () => {
  if (!props.job?.id) return;
  isFetching.value = true;
  const res = await fetchDeliveryOrderLetters(props.job.id);
  if (res.success) {
    letters.value = res.data || [];
    activeLetter.value = null;
    editMode.value = false;
  } else {
    toast.error(res.error || "Failed to load Surat Pengantar DO.");
  }
  isFetching.value = false;
};

const replaceActiveLetter = (letter: DeliveryOrderLetter) => {
  activeLetter.value = letter;
  const idx = letters.value.findIndex((item) => item.id === letter.id);
  if (idx === -1) letters.value = [letter, ...letters.value];
  else letters.value[idx] = letter;
};

const fillForm = (letter: DeliveryOrderLetter) => {
  const shippingLine = getParty(letter, "SHIPPING_LINE");
  const consignee = getParty(letter, "CONSIGNEE");
  const notify = getParty(letter, "NOTIFY_PARTY");

  form.value = {
    letterNumber: letter.letterNumber || "",
    letterDate: toDateInput(letter.letterDate),
    shippingLineCompanyId: shippingLine?.companyId || "",
    shippingLineAddressId: shippingLine?.addressBookId || "",
    shippingLineName: letter.shippingLineName || "",
    shippingLineAddress: shippingLine?.fullAddress || "",
    deliveryOrderNo: letter.deliveryOrderNo || "",
    mblNumber: letter.mblNumber || "",
    vesselId: findVesselByName(letter.vesselName)?.id || "",
    vesselName: letter.vesselName || "",
    voyageNumber: letter.voyageNumber || "",
    eta: toDateInput(letter.eta),
    consigneeCompanyId: consignee?.companyId || "",
    consigneeAddressId: consignee?.addressBookId || "",
    pickupLocation: letter.pickupLocation || "",
    consigneeName: letter.consigneeName || "",
    consigneeAddress: letter.consigneeAddress || "",
    notifyCompanyId: notify?.companyId || "",
    notifyAddressId: notify?.addressBookId || "",
    notifyName: letter.notifyName || "",
    notifyAddress: letter.notifyAddress || "",
    remarks: letter.remarks || "",
    containers: (letter.containers || []).map((container, index) => ({
      ...container,
      sequence: container.sequence ?? index,
    })),
  };
  hydratePartySelectorsFromSnapshots();
  hydrateVesselSelectorFromName();
};

const selectLetter = (letter: DeliveryOrderLetter) => {
  activeLetter.value = letter;
  editMode.value = false;
  fillForm(letter);
};

const handleCreateDraft = async () => {
  if (!props.job?.id) return;
  isCreating.value = true;
  const res = await createDeliveryOrderLetter(props.job.id);
  if (res.success && res.data) {
    replaceActiveLetter(res.data);
    fillForm(res.data);
    editMode.value = true;
    toast.success("Draft Surat Pengantar DO created.");
  } else {
    toast.error(res.error || "Failed to create Surat Pengantar DO.");
  }
  isCreating.value = false;
};

const handleSave = async () => {
  if (!activeLetter.value?.id) return;
  if (isFinalized.value) {
    toast.error("Finalized Surat Pengantar DO cannot be edited.");
    return;
  }
  isSaving.value = true;
  const { vesselId: _selectedVesselId, ...draftPayload } = form.value;
  const res = await updateDeliveryOrderLetterDraft(activeLetter.value.id, {
    ...draftPayload,
    parties: [
      {
        partyRoleCode: "SHIPPING_LINE",
        companyId: form.value.shippingLineCompanyId || null,
        addressBookId: form.value.shippingLineAddressId || null,
        companyName: form.value.shippingLineName,
        fullAddress: form.value.shippingLineAddress,
      },
      {
        partyRoleCode: "CONSIGNEE",
        companyId: form.value.consigneeCompanyId || null,
        addressBookId: form.value.consigneeAddressId || null,
        companyName: form.value.consigneeName,
        fullAddress: form.value.consigneeAddress,
      },
      {
        partyRoleCode: "NOTIFY_PARTY",
        companyId: form.value.notifyCompanyId || null,
        addressBookId: form.value.notifyAddressId || null,
        companyName: form.value.notifyName,
        fullAddress: form.value.notifyAddress,
      },
    ].filter((party) => party.companyName || party.fullAddress),
  });
  if (res.success && res.data) {
    replaceActiveLetter(res.data);
    fillForm(res.data);
    editMode.value = false;
    toast.success("Surat Pengantar DO saved.");
  } else {
    toast.error(res.error || "Failed to save Surat Pengantar DO.");
  }
  isSaving.value = false;
};

watch(
  () => form.value.shippingLineCompanyId,
  (companyId) => assignDefaultAddress(companyId || "", "shippingLineAddressId"),
);
watch(
  () => form.value.consigneeCompanyId,
  (companyId) => assignDefaultAddress(companyId || "", "consigneeAddressId"),
);
watch(
  () => form.value.notifyCompanyId,
  (companyId) => assignDefaultAddress(companyId || "", "notifyAddressId"),
);

watch(
  () => [form.value.shippingLineCompanyId, form.value.shippingLineAddressId] as const,
  ([companyId, addressId]) =>
    syncPartySnapshot(companyId || "", addressId || "", "shippingLineName", "shippingLineAddress"),
);
watch(
  () => [form.value.consigneeCompanyId, form.value.consigneeAddressId] as const,
  ([companyId, addressId]) =>
    syncPartySnapshot(companyId || "", addressId || "", "consigneeName", "consigneeAddress"),
);
watch(
  () => [form.value.notifyCompanyId, form.value.notifyAddressId] as const,
  ([companyId, addressId]) =>
    syncPartySnapshot(companyId || "", addressId || "", "notifyName", "notifyAddress"),
);

watch(
  () => form.value.vesselId,
  (vesselId) => {
    const vessel = findVessel(vesselId || "");
    form.value.vesselName = vessel?.name || "";
    if (vessel?.voyageNumber != null) {
      form.value.voyageNumber = vessel.voyageNumber || "";
    }
  },
);

const handleDelete = async () => {
  if (!activeLetter.value?.id) return;
  if (isFinalized.value) {
    toast.error("Finalized Surat Pengantar DO cannot be deleted.");
    return;
  }
  const approved = await confirm({
    title: "Delete Surat Pengantar DO?",
    message: "Hapus draft Surat Pengantar DO ini?",
    confirmText: "Delete",
    type: "danger",
  });
  if (!approved) return;

  isDeleting.value = true;
  const res = await deleteDeliveryOrderLetter(activeLetter.value.id);
  if (res.success) {
    letters.value = letters.value.filter((letter) => letter.id !== activeLetter.value?.id);
    activeLetter.value = null;
    editMode.value = false;
    toast.success("Surat Pengantar DO deleted.");
  } else {
    toast.error(res.error || "Failed to delete Surat Pengantar DO.");
  }
  isDeleting.value = false;
};

const handleFinalize = async () => {
  if (!activeLetter.value?.id) return;
  const approved = await confirm({
    title: "Finalize Surat Pengantar DO?",
    message: "Once finalized, you cannot edit it until it is unfinalized.",
    confirmText: "Yes, Finalize",
  });
  if (!approved) return;

  const res = await finalizeDeliveryOrderLetter(activeLetter.value.id);
  if (res.success && res.data) {
    replaceActiveLetter(res.data);
    fillForm(res.data);
    editMode.value = false;
    toast.success("Surat Pengantar DO finalized.");
  } else {
    toast.error(res.error || "Failed to finalize Surat Pengantar DO.");
  }
};

const handleUnfinalize = async () => {
  if (!activeLetter.value?.id) return;
  const approved = await confirm({
    title: "Unfinalize Surat Pengantar DO?",
    message: "This will change the status back to Draft so you can edit it.",
    confirmText: "Yes, Unfinalize",
  });
  if (!approved) return;

  const res = await unfinalizeDeliveryOrderLetter(activeLetter.value.id);
  if (res.success && res.data) {
    replaceActiveLetter(res.data);
    fillForm(res.data);
    toast.success("Surat Pengantar DO unfinalized.");
  } else {
    toast.error(res.error || "Failed to unfinalize Surat Pengantar DO.");
  }
};

const addContainer = () => {
  form.value.containers.push({
    containerNumber: "",
    sealNumber: "",
    containerTypeId: "",
    totalQty: null,
    grossWeight: "",
    measurementCbm: "",
    sequence: form.value.containers.length,
  });
};

const removeContainer = (index: number) => {
  form.value.containers.splice(index, 1);
};

const exportPdf = async () => {
  if (!previewRef.value) return;
  isGeneratingPdf.value = true;
  try {
    await nextTick();
    const canvas = await html2canvas(previewRef.value, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, 210, 297, undefined, "FAST");
    pdf.save(
      `Surat_Pengantar_DO_${activeLetter.value?.letterNumber || props.job?.jobNumber || "Draft"}.pdf`,
    );
    toast.success("Surat Pengantar DO exported.");
  } catch (error) {
    console.error("Failed to export Surat Pengantar DO", error);
    toast.error("Failed to export Surat Pengantar DO.");
  } finally {
    isGeneratingPdf.value = false;
  }
};

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  const [companyData, vesselData] = await Promise.all([fetchCompanies(), fetchVessels()]);
  companies.value = companyData;
  vessels.value = vesselData;
  hydratePartySelectorsFromSnapshots();
  hydrateVesselSelectorFromName();
  loadLetters();
});
</script>

<template>
  <div class="space-y-6 relative">
    <UiLoadingSkeleton v-if="isFetching" variant="form" />

    <template v-else-if="!activeLetter">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-foreground">Surat Pengantar DO</h3>
          <button
            v-if="canManageJob"
            type="button"
            @click="handleCreateDraft"
            :disabled="isCreating"
            class="px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 bg-[#012D5A] text-white hover:bg-[#012D5A]/90 disabled:opacity-50"
          >
            <Loader2 v-if="isCreating" class="w-4 h-4 animate-spin" />
            <Plus v-else class="w-4 h-4" />
            <span>Add Surat Pengantar DO</span>
          </button>
        </div>

        <div
          v-if="letters.length === 0"
          class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
        >
          <div
            class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
          >
            <FileText class="w-6 h-6 text-muted-foreground opacity-40" />
          </div>
          <p class="text-sm font-semibold text-foreground mb-1">Belum ada Surat Pengantar DO</p>
          <p class="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
            Buat draft untuk job import ini agar isi surat tidak perlu diketik manual.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="letter in letters"
            :key="letter.id"
            @click="selectLetter(letter)"
            class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-bold text-sm text-foreground group-hover:text-[#012D5A]">
                  {{ letter.letterNumber || "Draft Surat Pengantar DO" }}
                </p>
                <p
                  class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1"
                >
                  {{ formatDate(letter.createdAt) }}
                </p>
              </div>
              <span
                :class="[
                  'px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest leading-none',
                  letter.status === 'finalized'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200',
                ]"
              >
                {{ letter.status || "draft" }}
              </span>
            </div>
            <div class="border-t border-border pt-3 mt-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p class="text-muted-foreground font-semibold uppercase">MBL</p>
                <p class="font-bold text-foreground mt-1">{{ letter.mblNumber || "-" }}</p>
              </div>
              <div>
                <p class="text-muted-foreground font-semibold uppercase">Vessel</p>
                <p class="font-bold text-foreground mt-1">{{ letter.vesselName || "-" }}</p>
              </div>
              <div>
                <p class="text-muted-foreground font-semibold uppercase">DO No.</p>
                <p class="font-bold text-foreground mt-1">{{ letter.deliveryOrderNo || "-" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"
      >
        <div class="flex items-start gap-4">
          <button
            type="button"
            @click="
              activeLetter = null;
              editMode = false;
            "
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex flex-col gap-2 mt-1">
            <h1 class="text-2xl font-bold text-foreground leading-none">{{ selectedTitle }}</h1>
            <p class="text-sm text-muted-foreground leading-none mb-1">
              Surat pengantar pengambilan Delivery Order.
            </p>
            <span
              :class="[
                'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit',
                isFinalized
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200',
              ]"
            >
              {{ isFinalized ? "Finalized" : "Draft" }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
          <template v-if="!editMode">
            <button
              v-if="canManageJob && !isFinalized"
              type="button"
              @click="editMode = true"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Edit class="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              v-if="canManageJob && !isFinalized"
              type="button"
              @click="handleDelete"
              :disabled="isDeleting"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" />
              <Trash2 v-else class="w-3.5 h-3.5" />
              Delete
            </button>
            <button
              v-if="canManageJob && isFinalized"
              type="button"
              @click="handleUnfinalize"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 shadow-sm transition-colors"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              Reopen Draft
            </button>
            <button
              v-else-if="canManageJob"
              type="button"
              @click="handleFinalize"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              Finalize
            </button>
            <button
              type="button"
              @click="exportPdf"
              :disabled="isGeneratingPdf"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isGeneratingPdf" class="w-3.5 h-3.5 animate-spin" />
              <Download v-else class="w-3.5 h-3.5" />
              {{ isGeneratingPdf ? "Generating..." : "Download PDF" }}
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              @click="editMode = false"
              :disabled="isSaving"
              class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <X class="w-3.5 h-3.5" />
              Cancel Edit
            </button>
            <button
              type="button"
              @click="handleSave"
              :disabled="isSaving"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
              <Save v-else class="w-3.5 h-3.5" />
              {{ isSaving ? "Saving..." : "Save Changes" }}
            </button>
          </template>
        </div>
      </div>

      <div v-if="editMode" class="space-y-6">
        <div class="grid grid-cols-2 gap-x-4 gap-y-5">
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">Nomor Surat</span>
            <input
              v-model="form.letterNumber"
              class="w-full h-9 px-3 rounded-md border border-border text-sm font-normal text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">Tanggal Surat</span>
            <DatePicker v-model="form.letterDate" placeholder="Select date..." class="h-9" />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">DO Number</span>
            <input
              v-model="form.deliveryOrderNo"
              class="w-full h-9 px-3 rounded-md border border-border text-sm font-normal text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">MBL Number</span>
            <input
              v-model="form.mblNumber"
              class="w-full h-9 px-3 rounded-md border border-border text-sm font-normal text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">Vessel / Voyage</span>
            <Combobox
              v-model="form.vesselId"
              :options="vessels"
              label-key="name"
              value-key="id"
              placeholder="Search Vessel..."
              class="h-9 font-normal"
            />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">Voyage Number</span>
            <input
              v-model="form.voyageNumber"
              class="w-full h-9 px-3 rounded-md border border-border text-sm font-normal text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </label>
          <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
            <span class="block">ETA</span>
            <DatePicker v-model="form.eta" placeholder="ETA" class="h-9" />
          </label>
        </div>

        <div class="rounded-lg border border-border bg-white overflow-hidden">
          <div class="px-6 py-3 border-b border-border/50 bg-muted/20">
            <h4 class="text-sm font-bold text-foreground">Parties</h4>
          </div>
          <JobPartyRow
            label="Shipping Line / Agent"
            required
            :companies="companies"
            v-model:companyId="form.shippingLineCompanyId"
            v-model:addressId="form.shippingLineAddressId"
          />
          <JobPartyRow
            label="Consignee"
            required
            :companies="companies"
            v-model:companyId="form.consigneeCompanyId"
            v-model:addressId="form.consigneeAddressId"
          />
          <JobPartyRow
            label="Notify Party"
            :companies="companies"
            v-model:companyId="form.notifyCompanyId"
            v-model:addressId="form.notifyAddressId"
          />
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-bold text-foreground">Containers</h4>
              <p class="text-xs text-muted-foreground mt-0.5">
                Isi container yang perlu muncul di surat.
              </p>
            </div>
            <button
              type="button"
              @click="addContainer"
              class="px-3 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 bg-[#012D5A] text-white hover:bg-[#012D5A]/90 shadow-sm"
            >
              <Plus class="w-4 h-4" />
              Add Container
            </button>
          </div>

          <div class="rounded-lg border border-border bg-white overflow-hidden">
            <div
              class="container-input-grid hidden md:grid px-3 py-2 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              <span>Container No.</span>
              <span>Seal No.</span>
              <span>Qty</span>
              <span>Gross Weight</span>
              <span class="sr-only">Action</span>
            </div>
            <div
              v-if="form.containers.length === 0"
              class="px-4 py-6 text-sm text-muted-foreground"
            >
              No container rows yet.
            </div>
            <div
              v-for="(container, index) in form.containers"
              :key="index"
              class="container-input-grid border-b border-border last:border-b-0 px-3 py-2.5 hover:bg-muted/20 transition-colors"
            >
              <input
                v-model="container.containerNumber"
                placeholder="Container No."
                aria-label="Container No."
                class="h-9 px-3 rounded-md border border-border bg-white text-sm font-normal text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                v-model="container.sealNumber"
                placeholder="Seal No."
                aria-label="Seal No."
                class="h-9 px-3 rounded-md border border-border bg-white text-sm font-normal text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                v-model.number="container.totalQty"
                type="number"
                placeholder="Qty"
                aria-label="Qty"
                class="h-9 px-3 rounded-md border border-border bg-white text-sm font-normal text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                v-model="container.grossWeight"
                placeholder="Gross Weight"
                aria-label="Gross Weight"
                class="h-9 px-3 rounded-md border border-border bg-white text-sm font-normal text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                @click="removeContainer(index)"
                class="w-8 h-8 rounded-md border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center justify-self-end self-center transition-colors"
                aria-label="Remove container"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <label class="block space-y-1.5 text-xs font-semibold text-muted-foreground">
          <span class="block">Remarks</span>
          <textarea
            v-model="form.remarks"
            rows="3"
            class="w-full px-3 py-2 rounded-md border border-border text-sm font-normal text-foreground focus:ring-1 focus:ring-primary outline-none"
          />
        </label>
      </div>

      <div v-else class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto">
        <div
          ref="previewRef"
          class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border"
          style="
            width: 794px;
            height: 1123px;
            padding: 20px 30px;
            box-sizing: border-box;
            position: relative;
          "
        >
          <div
            class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white"
            style="height: 70px"
          >
            <div class="w-[40%] pb-1">
              <img
                :src="logoUrl"
                alt="NS Continent Logo"
                class="h-16 object-contain max-w-[190px]"
                crossorigin="anonymous"
              />
            </div>
            <div class="w-[60%] text-right pb-1 flex flex-col items-end justify-end h-full">
              <div class="text-[0.6rem] font-mono mb-1 text-black">PAGE: 1 OF 1</div>
              <h1 class="text-lg font-bold tracking-widest uppercase leading-none">
                SURAT PENGANTAR DO
              </h1>
            </div>
          </div>

          <div class="opening-box border border-[#062c58] mt-2 mb-2 text-[10.5px] leading-snug">
            <div class="opening-recipient grid grid-cols-[1fr_1.15fr] text-black">
              <div class="border-r border-[#062c58] px-2 py-1.5">
                <p>Kepada Yth.</p>
                <p class="font-bold uppercase">
                  {{ activeLetter.shippingLineName || "Shipping Line / Agent" }}
                </p>
              </div>
              <div class="px-2 py-1.5">
                <p class="font-bold uppercase text-[#062c58]">Address</p>
                <p class="whitespace-pre-wrap uppercase">
                  {{ shippingLineAddress || "-" }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="opening-paragraph-box border border-[#062c58] mb-3 text-[10.5px] leading-relaxed text-black"
          >
            <div class="opening-paragraph px-2 py-1.5">
              Dengan hormat, mohon dibantu untuk proses pengambilan Delivery Order atas shipment
              tersebut di bawah ini.
            </div>
          </div>

          <div
            class="main-border-container border border-[#062c58] flex flex-col text-[0.7rem] relative overflow-hidden"
          >
            <div class="flex border-b border-[#062c58]" style="min-height: 86px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase">
                  Consignee
                </span>
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
                >
                  {{ joinLines(activeLetter.consigneeName, activeLetter.consigneeAddress) }}
                </div>
              </div>
              <div class="w-1/2 flex flex-col">
                <div
                  class="grid grid-cols-[1.15fr_0.85fr_0.8fr] border-b border-[#062c58]"
                  style="min-height: 52px"
                >
                  <div class="min-w-0 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">
                      Letter No.
                    </span>
                    <div
                      class="font-mono uppercase text-[9px] leading-tight text-black mt-1 min-w-0 break-words [overflow-wrap:anywhere]"
                    >
                      {{ activeLetter.letterNumber || "-" }}
                    </div>
                  </div>
                  <div class="min-w-0 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">Date</span>
                    <div
                      class="font-mono uppercase text-[9px] leading-tight text-black mt-1 min-w-0 break-words"
                    >
                      {{ formatDate(activeLetter.letterDate) }}
                    </div>
                  </div>
                  <div class="min-w-0 pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">
                      Job No.
                    </span>
                    <div
                      class="font-mono uppercase text-[9px] leading-tight text-black mt-1 min-w-0 break-words [overflow-wrap:anywhere]"
                    >
                      {{ props.job?.jobNumber || "-" }}
                    </div>
                  </div>
                </div>
                <div class="pt-1 px-2 pb-2 flex-1">
                  <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase">
                    Shipping Line / Agent
                  </span>
                  <div
                    class="font-mono uppercase text-[10px] leading-tight text-black min-w-0 break-words [overflow-wrap:anywhere]"
                  >
                    {{ activeLetter.shippingLineName || "-" }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex border-b border-[#062c58]" style="min-height: 86px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase">
                  Notify Party
                </span>
                <div
                  class="whitespace-pre-wrap font-mono uppercase text-[10px] leading-tight text-black"
                >
                  {{ joinLines(activeLetter.notifyName, activeLetter.notifyAddress) }}
                </div>
              </div>
              <div class="w-1/2">
                <div class="flex border-b border-[#062c58]" style="min-height: 44px">
                  <div class="w-1/2 min-w-0 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">
                      DO No.
                    </span>
                    <div
                      class="font-mono uppercase text-[10px] leading-tight text-black mt-1 min-w-0 break-words [overflow-wrap:anywhere]"
                    >
                      {{ activeLetter.deliveryOrderNo || "-" }}
                    </div>
                  </div>
                  <div class="w-1/2 min-w-0 pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">ETA</span>
                    <div
                      class="font-mono uppercase text-[10px] leading-tight text-black mt-1 min-w-0 break-words"
                    >
                      {{ formatDate(activeLetter.eta) }}
                    </div>
                  </div>
                </div>
                <div class="flex" style="min-height: 47px">
                  <div class="w-1/2 min-w-0 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">
                      MBL No.
                    </span>
                    <div
                      class="font-mono uppercase text-[10px] leading-tight text-black mt-1 min-w-0 break-words [overflow-wrap:anywhere]"
                    >
                      {{ activeLetter.mblNumber || "-" }}
                    </div>
                  </div>
                  <div class="w-1/2 min-w-0 pt-1 px-2">
                    <span class="font-bold text-[0.55rem] leading-none block uppercase">
                      Vessel / Voyage
                    </span>
                    <div
                      class="font-mono uppercase text-[10px] leading-tight text-black mt-1 min-w-0 break-words"
                    >
                      {{ activeLetter.vesselName || "-" }}
                      <template v-if="activeLetter.voyageNumber">
                        / {{ activeLetter.voyageNumber }}
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex border-b border-[#062c58]" style="min-height: 52px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold text-[0.55rem] leading-none block uppercase">
                  Pickup Location
                </span>
                <div class="font-mono uppercase text-[10px] leading-tight text-black mt-1">
                  {{ activeLetter.pickupLocation || "-" }}
                </div>
              </div>
              <div class="w-1/2 pt-1 px-2 pb-2">
                <span class="font-bold text-[0.55rem] leading-none block uppercase">
                  Letter Subject
                </span>
                <div class="font-mono uppercase text-[10px] leading-tight text-black mt-1">
                  PENGANTAR PENGAMBILAN DELIVERY ORDER
                </div>
              </div>
            </div>

            <div class="border-b border-[#062c58]">
              <div
                class="border-b border-[#062c58] bg-[#062c58]/5 px-2 py-1 font-bold uppercase text-[0.58rem]"
              >
                Container Details
              </div>
              <div
                class="grid grid-cols-[38px_1.35fr_1fr_0.65fr_0.95fr] bg-[#062c58]/5 border-b border-[#062c58] font-bold uppercase text-[0.58rem]"
              >
                <div class="border-r border-[#062c58] px-2 py-1">No.</div>
                <div class="border-r border-[#062c58] px-2 py-1">Container No.</div>
                <div class="border-r border-[#062c58] px-2 py-1">Seal No.</div>
                <div class="border-r border-[#062c58] px-2 py-1">Qty</div>
                <div class="px-2 py-1">Gross Weight</div>
              </div>
              <div
                v-for="(container, index) in activeLetter.containers || []"
                :key="container.id || index"
                class="grid grid-cols-[38px_1.35fr_1fr_0.65fr_0.95fr] border-b last:border-b-0 border-[#062c58] font-mono uppercase text-[10px] leading-tight text-black"
                style="min-height: 29px"
              >
                <div class="border-r border-[#062c58] px-2 py-1">{{ index + 1 }}</div>
                <div class="border-r border-[#062c58] px-2 py-1 font-bold">
                  {{ container.containerNumber || "-" }}
                </div>
                <div class="border-r border-[#062c58] px-2 py-1">
                  {{ container.sealNumber || "-" }}
                </div>
                <div class="border-r border-[#062c58] px-2 py-1">
                  {{ container.totalQty || "-" }}
                </div>
                <div class="px-2 py-1">{{ container.grossWeight || "-" }}</div>
              </div>
              <div
                v-if="!activeLetter.containers?.length"
                class="font-mono uppercase text-[10px] text-center text-black py-4"
              >
                No container data
              </div>
            </div>

            <div class="border-b border-[#062c58] pt-1 px-2 pb-2" style="min-height: 64px">
              <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase">
                Remarks
              </span>
              <div
                class="font-mono uppercase text-[10px] leading-tight text-black whitespace-pre-wrap"
              >
                {{ activeLetter.remarks || "-" }}
              </div>
            </div>

            <div class="closing-section p-4 pb-6 text-[11px] leading-relaxed">
              <div class="text-black">
                <p>Demikian surat pengantar ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
              </div>

              <div class="signature-section mt-10 grid grid-cols-2 gap-20 text-[#062c58]">
                <div>
                  <p>Hormat kami,</p>
                  <div class="h-16"></div>
                  <p class="font-bold border-t border-[#062c58] pt-2">PT Nova Sync Continent</p>
                </div>
                <div>
                  <p>Penerima,</p>
                  <div class="h-16"></div>
                  <p class="font-bold border-t border-[#062c58] pt-2">________________________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.a4-page-wrapper {
  padding: 18mm;
  box-sizing: border-box;
}

.container-input-grid {
  display: grid;
  grid-template-columns:
    minmax(150px, 1.1fr) minmax(130px, 1fr) minmax(80px, 0.45fr) minmax(130px, 0.95fr)
    40px;
  gap: 0.75rem;
  align-items: center;
}

@media (max-width: 767px) {
  .container-input-grid {
    grid-template-columns: 1fr;
  }
}
</style>
