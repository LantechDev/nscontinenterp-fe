<script setup lang="ts">
import { ArrowLeft, Save, Upload, X } from "lucide-vue-next";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useTransaction } from "~/composables/useTransaction";

definePageMeta({
  layout: "dashboard",
  title: "Buat Transaksi",
});

const router = useRouter();

const {
  isSaving,
  error,
  successMessage,
  transactionDate,
  referenceNumber,
  description,
  amount,
  debitAccountId,
  creditAccountId,
  attachmentUrl,
  taxId,
  taxOptions,
  isAccountsLoading,
  canSave,
  handleAccountSearch,
  handleFileUpload,
  removeAttachment,
  saveTransaction,
  initialize,
} = useTransaction();

const fileInput = ref<HTMLInputElement | null>(null);

// Computed for SearchSelect
const formattedTaxOptions = computed(() =>
  taxOptions.value.map((tax) => ({ id: tax.id, name: `${tax.name} (${tax.rate}%)` })),
);

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6 bg-background min-h-screen">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/finance/dashboard"
        class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="page-title text-foreground">Buat Transaksi</h1>
        <p class="text-sm text-muted-foreground">
          Buat transaksi dengan bukti dan akun debit/kredit
        </p>
      </div>
    </div>

    <!-- Alerts -->
    <div
      v-if="error"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      {{ error }}
    </div>
    <div
      v-if="successMessage"
      class="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      {{ successMessage }}
    </div>

    <!-- Main Card -->
    <div class="card-elevated p-8 space-y-8 bg-card shadow-soft border-border">
      <!-- Header Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Tanggal -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Tanggal Transaksi</label>
          <input v-model="transactionDate" type="date" class="input-field" />
        </div>

        <!-- Nomor Referensi -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Nomor Referensi</label>
          <input
            v-model="referenceNumber"
            type="text"
            placeholder="TRX/YYMM/0001"
            class="input-field"
            readonly
          />
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">
          Deskripsi <span class="text-destructive">*</span>
        </label>
        <input
          v-model="description"
          type="text"
          placeholder="Deskripsi transaksi..."
          class="input-field"
        />
      </div>

      <!-- Amount -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">
          Jumlah <span class="text-destructive">*</span>
        </label>
        <input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          class="input-field"
        />
      </div>

      <!-- Tax -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Pajak</label>
        <SearchSelect
          v-model="taxId"
          :initial-options="formattedTaxOptions"
          placeholder="Pilih Pajak (Opsional)"
        />
      </div>

      <!-- Debit and Credit Account Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Akun Debit -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">
            Akun Debit <span class="text-destructive">*</span>
          </label>
          <SearchSelect
            v-model="debitAccountId"
            :fetch-options="handleAccountSearch"
            placeholder="Pilih akun debit..."
            :disabled="isAccountsLoading"
          />
        </div>

        <!-- Akun Kredit -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">
            Akun Kredit <span class="text-destructive">*</span>
          </label>
          <SearchSelect
            v-model="creditAccountId"
            :fetch-options="handleAccountSearch"
            placeholder="Pilih akun kredit..."
            :disabled="isAccountsLoading"
          />
        </div>
      </div>

      <!-- Bukti Transaksi (Attachment) -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Bukti Transaksi</label>
        <div
          class="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          :class="{ 'border-primary bg-primary/5': attachmentUrl }"
          @click="fileInput?.click()"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />
          <div v-if="!attachmentUrl" class="flex flex-col items-center gap-2">
            <Upload class="w-8 h-8 text-muted-foreground" />
            <p class="text-sm text-muted-foreground">Klik untuk upload bukti transaksi</p>
            <p class="text-xs text-muted-foreground">PNG, JPG, atau PDF (maks. 5MB)</p>
          </div>
          <div v-else class="relative">
            <img
              :src="attachmentUrl"
              alt="Bukti transaksi"
              class="max-h-48 mx-auto rounded-lg object-contain"
            />
            <button
              type="button"
              class="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
              @click.stop="removeAttachment"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div class="flex justify-end gap-3 pt-6 border-t border-border">
        <button
          type="button"
          class="btn-outline border-border text-foreground py-2.5"
          @click="router.back()"
        >
          <X class="w-4 h-4 mr-2" />
          Batal
        </button>
        <button
          type="button"
          class="btn-primary py-2.5 px-8"
          :disabled="!canSave || isSaving"
          @click="saveTransaction"
        >
          <Save v-if="!isSaving" class="w-4 h-4 mr-2 text-primary-foreground" />
          <span v-if="isSaving">Menyimpan...</span>
          <span v-else>Simpan Transaksi</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
