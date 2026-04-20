import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  useSSRContext,
  mergeProps,
  withCtx,
  unref,
  createVNode,
  ref,
  computed,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrRenderList,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { ArrowLeft, Plus, Trash2, X, Save } from "lucide-vue-next";
import { S as SearchSelect, u as useChartOfAccounts } from "./useChartOfAccounts-D5i9Gq00.mjs";
import { g as getErrorMessage } from "./utils-C_kyg7_s.mjs";
import { a as useRouter, u as useRuntimeConfig } from "./server.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "@vueuse/core";
import "clsx";
import "tailwind-merge";
import "vue-router";

const formatNumber = (value) => {
  if (!value || value === 0) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
function generateReferenceNumber() {
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1e4)
    .toString()
    .padStart(4, "0");
  return `JV/${year}${month}/${random}`;
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
function handleDebitChange(entry) {
  if (entry.debit > 0) {
    entry.credit = 0;
  }
}
function handleCreditChange(entry) {
  if (entry.credit > 0) {
    entry.debit = 0;
  }
}
function useJournalEntry() {
  const config = useRuntimeConfig();
  const router = useRouter();
  const {
    accounts,
    fetchAccounts,
    searchAccounts,
    formatAccountDisplay,
    isLoading: isAccountsLoading,
  } = useChartOfAccounts();
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref(null);
  const successMessage = ref(null);
  const journalDate = ref(/* @__PURE__ */ new Date().toISOString().split("T")[0]);
  const referenceNumber = ref("");
  const description = ref("");
  const entries = ref([
    { id: "1", accountId: "", debit: 0, credit: 0 },
    { id: "2", accountId: "", debit: 0, credit: 0 },
  ]);
  const totalDebit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  });
  const totalCredit = computed(() => {
    return entries.value.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  });
  const isBalanced = computed(() => {
    return totalDebit.value > 0 && totalDebit.value === totalCredit.value;
  });
  const canSave = computed(() => {
    return isBalanced.value && entries.value.length > 0;
  });
  async function handleAccountSearch(options) {
    const result = await searchAccounts(options.query);
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.map((acc) => ({
          id: acc.id,
          name: formatAccountDisplay(acc),
        })),
      };
    }
    return { success: false, error: result.error };
  }
  function addRow() {
    entries.value.push({
      id: generateId(),
      accountId: "",
      debit: 0,
      credit: 0,
    });
  }
  function removeRow(id) {
    if (entries.value.length > 1) {
      entries.value = entries.value.filter((entry) => entry.id !== id);
    }
  }
  async function saveJournalEntry() {
    if (!canSave.value) return;
    isSaving.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const payload = {
        journalDate: journalDate.value,
        referenceNumber: referenceNumber.value,
        description: description.value,
        entries: entries.value
          .filter((entry) => entry.accountId && (entry.debit > 0 || entry.credit > 0))
          .map((entry) => ({
            accountId: entry.accountId,
            debit: entry.debit,
            credit: entry.credit,
          })),
      };
      await $fetch(`${config.public.apiBase}/finance/journal`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      successMessage.value = "Journal entry saved successfully!";
      setTimeout(() => {
        router.push("/finance/dashboard");
      }, 1500);
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      isSaving.value = false;
    }
  }
  const initialize = async () => {
    await fetchAccounts();
    referenceNumber.value = generateReferenceNumber();
  };
  return {
    // State
    isLoading,
    isSaving,
    error,
    successMessage,
    journalDate,
    referenceNumber,
    description,
    entries,
    // From composable
    accounts,
    isAccountsLoading,
    // Computed
    totalDebit,
    totalCredit,
    isBalanced,
    canSave,
    // Methods
    handleAccountSearch,
    addRow,
    removeRow,
    handleDebitChange,
    handleCreditChange,
    saveJournalEntry,
    initialize,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
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
    } = useJournalEntry();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6 bg-background min-h-screen" }, _attrs))} data-v-477296e7><div class="flex items-center gap-4" data-v-477296e7>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/dashboard",
            class:
              "p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    unref(ArrowLeft),
                    { class: "w-6 h-6" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
              } else {
                return [createVNode(unref(ArrowLeft), { class: "w-6 h-6" })];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        `<div data-v-477296e7><h1 class="page-title text-foreground" data-v-477296e7>Jurnal Manual</h1><p class="text-sm text-muted-foreground" data-v-477296e7>Buat entri jurnal debit/kredit secara manual</p></div></div>`,
      );
      if (unref(error)) {
        _push(
          `<div class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in" data-v-477296e7>${ssrInterpolate(unref(error))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(successMessage)) {
        _push(
          `<div class="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm animate-fade-in" data-v-477296e7>${ssrInterpolate(unref(successMessage))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<div class="card-elevated p-8 space-y-8 bg-card shadow-soft border-border" data-v-477296e7><div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-v-477296e7><div class="space-y-2" data-v-477296e7><label class="text-sm font-medium text-foreground" data-v-477296e7>Tanggal</label><input${ssrRenderAttr("value", unref(journalDate))} type="date" class="input-field" data-v-477296e7></div><div class="space-y-2" data-v-477296e7><label class="text-sm font-medium text-foreground" data-v-477296e7>Referensi (Invoice/PO)</label><input${ssrRenderAttr("value", unref(referenceNumber))} type="text" placeholder="No. Referensi..." class="input-field" data-v-477296e7></div><div class="space-y-2" data-v-477296e7><label class="text-sm font-medium text-foreground" data-v-477296e7>Deskripsi <span class="text-destructive" data-v-477296e7>*</span></label><input${ssrRenderAttr("value", unref(description))} type="text" placeholder="Deskripsi jurnal" class="input-field" data-v-477296e7></div></div><div class="space-y-4 pt-4 border-t border-border" data-v-477296e7><div class="flex items-center justify-between" data-v-477296e7><h2 class="text-lg font-bold text-foreground" data-v-477296e7>Detail Entry</h2><button type="button" class="btn-outline border-border text-foreground hover:bg-muted py-2" data-v-477296e7>`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Tambah Baris </button></div><div class="overflow-x-auto rounded-lg border border-border" data-v-477296e7><table class="data-table w-full border-collapse" data-v-477296e7><thead data-v-477296e7><tr class="bg-muted/50 border-b border-border" data-v-477296e7><th class="w-12 text-center text-xs font-semibold py-4" data-v-477296e7>No</th><th class="text-left py-4 px-4 text-xs font-semibold" data-v-477296e7>Akun</th><th class="w-40 text-right py-4 px-4 text-xs font-semibold" data-v-477296e7>Debit</th><th class="w-40 text-right py-4 px-4 text-xs font-semibold" data-v-477296e7>Kredit</th><th class="w-16 text-center py-4 px-2 text-xs font-semibold" data-v-477296e7>Aksi</th></tr></thead><tbody class="divide-y divide-border" data-v-477296e7><!--[-->`,
      );
      ssrRenderList(unref(entries), (entry, index) => {
        _push(
          `<tr class="hover:bg-muted/20 transition-colors" data-v-477296e7><td class="text-center text-sm text-muted-foreground" data-v-477296e7>${ssrInterpolate(index + 1)}</td><td class="py-3 px-4" data-v-477296e7>`,
        );
        _push(
          ssrRenderComponent(
            SearchSelect,
            {
              modelValue: entry.accountId,
              "onUpdate:modelValue": ($event) => (entry.accountId = $event),
              "fetch-options": unref(handleAccountSearch),
              placeholder: "Pilih akun...",
              disabled: unref(isAccountsLoading),
            },
            null,
            _parent,
          ),
        );
        _push(
          `</td><td class="py-3 px-4" data-v-477296e7><div class="relative group" data-v-477296e7><input${ssrRenderAttr("value", entry.debit)} type="number" min="0" step="0.01" class="w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50"${ssrIncludeBooleanAttr(entry.credit > 0) ? " disabled" : ""} data-v-477296e7></div></td><td class="py-3 px-4" data-v-477296e7><div class="relative group" data-v-477296e7><input${ssrRenderAttr("value", entry.credit)} type="number" min="0" step="0.01" class="w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50"${ssrIncludeBooleanAttr(entry.debit > 0) ? " disabled" : ""} data-v-477296e7></div></td><td class="py-3 px-2 text-center" data-v-477296e7><button type="button" class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"${ssrIncludeBooleanAttr(unref(entries).length <= 1) ? " disabled" : ""} data-v-477296e7>`,
        );
        _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(
        `<!--]--></tbody><tfoot data-v-477296e7><tr class="bg-muted/30 font-medium" data-v-477296e7><td colspan="2" class="py-4 px-4 text-sm text-foreground font-bold" data-v-477296e7>Total</td><td class="py-4 px-4 text-right text-sm font-bold text-foreground" data-v-477296e7>${ssrInterpolate(unref(formatNumber)(unref(totalDebit)))}</td><td class="py-4 px-4 text-right text-sm font-bold text-foreground" data-v-477296e7>${ssrInterpolate(unref(formatNumber)(unref(totalCredit)))}</td><td data-v-477296e7></td></tr></tfoot></table></div><div class="flex justify-center pt-4" data-v-477296e7>`,
      );
      if (unref(isBalanced)) {
        _push(
          `<span class="badge-success px-8 py-2 text-sm font-medium rounded-full shadow-sm animate-fade-in" data-v-477296e7> Seimbang </span>`,
        );
      } else if (
        unref(entries).some((e) => e.accountId) &&
        unref(totalDebit) !== unref(totalCredit)
      ) {
        _push(
          `<span class="inline-flex items-center px-8 py-2 rounded-full text-sm font-medium bg-warning/10 text-warning border border-warning/20" data-v-477296e7> Tidak Seimbang </span>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></div><div class="flex justify-end gap-3 pt-6 border-t border-border" data-v-477296e7><button type="button" class="btn-outline border-border text-foreground py-2.5" data-v-477296e7>`,
      );
      _push(ssrRenderComponent(unref(X), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Batal </button><button type="button" class="btn-primary py-2.5 px-8"${ssrIncludeBooleanAttr(!unref(canSave) || unref(isSaving)) ? " disabled" : ""} data-v-477296e7>`,
      );
      if (!unref(isSaving)) {
        _push(
          ssrRenderComponent(
            unref(Save),
            { class: "w-4 h-4 mr-2 text-primary-foreground" },
            null,
            _parent,
          ),
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(isSaving)) {
        _push(`<span data-v-477296e7>Menyimpan...</span>`);
      } else {
        _push(`<span data-v-477296e7>Simpan Jurnal</span>`);
      }
      _push(`</button></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/journal/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-477296e7"]]);

export { create as default };
//# sourceMappingURL=create-Dw6IfXCy.mjs.map
