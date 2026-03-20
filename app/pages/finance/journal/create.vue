<script setup lang="ts">
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-vue-next";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useJournalEntry, formatNumber } from "~/composables/useJournalEntry";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();

const {
  isSaving,
  error,
  successMessage,
  journalDate,
  referenceNumber,
  description,
  entries,
  isAccountsLoading,
  totalDebit,
  totalCredit,
  isBalanced,
  canSave,
  handleAccountSearch,
  addRow,
  removeRow,
  handleDebitChange,
  handleCreditChange,
  saveJournalEntry,
  initialize,
} = useJournalEntry();

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
        <h1 class="page-title text-foreground">Jurnal Manual</h1>
        <p class="text-sm text-muted-foreground">Buat entri jurnal debit/kredit secara manual</p>
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
      <!-- Header Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Tanggal -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Tanggal</label>
          <input v-model="journalDate" type="date" class="input-field" />
        </div>

        <!-- Referensi (Invoice/PO) -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Referensi (Invoice/PO)</label>
          <input
            v-model="referenceNumber"
            type="text"
            placeholder="No. Referensi..."
            class="input-field"
          />
        </div>

        <!-- Deskripsi -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground"
            >Deskripsi <span class="text-destructive">*</span></label
          >
          <input
            v-model="description"
            type="text"
            placeholder="Deskripsi jurnal"
            class="input-field"
          />
        </div>
      </div>

      <!-- Detail Entry Section -->
      <div class="space-y-4 pt-4 border-t border-border">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-foreground">Detail Entry</h2>
          <button
            type="button"
            class="btn-outline border-border text-foreground hover:bg-muted py-2"
            @click="addRow"
          >
            <Plus class="w-4 h-4 mr-2" />
            Tambah Baris
          </button>
        </div>

        <!-- Entries Table -->
        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="data-table w-full border-collapse">
            <thead>
              <tr class="bg-muted/50 border-b border-border">
                <th class="w-12 text-center text-xs font-semibold py-4">No</th>
                <th class="text-left py-4 px-4 text-xs font-semibold">Akun</th>
                <th class="w-40 text-right py-4 px-4 text-xs font-semibold">Debit</th>
                <th class="w-40 text-right py-4 px-4 text-xs font-semibold">Kredit</th>
                <th class="w-16 text-center py-4 px-2 text-xs font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="(entry, index) in entries"
                :key="entry.id"
                class="hover:bg-muted/20 transition-colors"
              >
                <td class="text-center text-sm text-muted-foreground">{{ index + 1 }}</td>
                <td class="py-3 px-4">
                  <SearchSelect
                    v-model="entry.accountId"
                    :fetch-options="handleAccountSearch"
                    placeholder="Pilih akun..."
                    :disabled="isAccountsLoading"
                  />
                </td>
                <td class="py-3 px-4">
                  <div class="relative group">
                    <input
                      v-model.number="entry.debit"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50"
                      :disabled="entry.credit > 0"
                      @input="handleDebitChange(entry)"
                    />
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="relative group">
                    <input
                      v-model.number="entry.credit"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50"
                      :disabled="entry.debit > 0"
                      @input="handleCreditChange(entry)"
                    />
                  </div>
                </td>
                <td class="py-3 px-2 text-center">
                  <button
                    type="button"
                    class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    :disabled="entries.length <= 1"
                    @click="removeRow(entry.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-muted/30 font-medium">
                <td colspan="2" class="py-4 px-4 text-sm text-foreground font-bold">Total</td>
                <td class="py-4 px-4 text-right text-sm font-bold text-foreground">
                  {{ formatNumber(totalDebit) }}
                </td>
                <td class="py-4 px-4 text-right text-sm font-bold text-foreground">
                  {{ formatNumber(totalCredit) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Balanced Indicator -->
        <div class="flex justify-center pt-4">
          <span
            v-if="isBalanced"
            class="badge-success px-8 py-2 text-sm font-medium rounded-full shadow-sm animate-fade-in"
          >
            Seimbang
          </span>
          <span
            v-else-if="entries.some((e) => e.accountId) && totalDebit !== totalCredit"
            class="inline-flex items-center px-8 py-2 rounded-full text-sm font-medium bg-warning/10 text-warning border border-warning/20"
          >
            Tidak Seimbang
          </span>
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
          @click="saveJournalEntry"
        >
          <Save v-if="!isSaving" class="w-4 h-4 mr-2 text-primary-foreground" />
          <span v-if="isSaving">Menyimpan...</span>
          <span v-else>Simpan Jurnal</span>
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
