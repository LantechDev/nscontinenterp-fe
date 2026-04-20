import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  mergeProps,
  withCtx,
  unref,
  createVNode,
  isRef,
  computed,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { ArrowLeft, Upload, X, Save } from "lucide-vue-next";
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

function useTransaction() {
  const config = useRuntimeConfig();
  const router = useRouter();
  const {
    accounts,
    fetchAccounts,
    searchAccounts,
    formatAccountDisplay,
    isLoading: isAccountsLoading,
  } = useChartOfAccounts();
  const isSaving = ref(false);
  const error = ref(null);
  const successMessage = ref(null);
  const transactionDate = ref(/* @__PURE__ */ new Date().toISOString().split("T")[0]);
  const referenceNumber = ref("");
  const description = ref("");
  const amount = ref(0);
  const debitAccountId = ref("");
  const creditAccountId = ref("");
  const attachmentUrl = ref("");
  const canSave = computed(() => {
    return (
      debitAccountId.value &&
      creditAccountId.value &&
      amount.value > 0 &&
      description.value.trim().length > 0
    );
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
  async function handleFileUpload(event) {
    const target = event.target;
    const file = target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      error.value = "Hanya file gambar atau PDF yang diperbolehkan";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Ukuran file maksimal 5MB";
      return;
    }
    attachmentUrl.value = URL.createObjectURL(file);
  }
  function removeAttachment() {
    if (attachmentUrl.value) {
      URL.revokeObjectURL(attachmentUrl.value);
      attachmentUrl.value = "";
    }
  }
  async function saveTransaction() {
    if (!canSave.value) return;
    isSaving.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const payload = {
        journalDate: transactionDate.value,
        referenceNumber: referenceNumber.value,
        description: description.value,
        attachmentUrl: attachmentUrl.value,
        entries: [
          {
            accountId: debitAccountId.value,
            debit: amount.value,
            credit: 0,
          },
          {
            accountId: creditAccountId.value,
            debit: 0,
            credit: amount.value,
          },
        ],
      };
      await $fetch(`${config.public.apiBase}/finance/journal`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      successMessage.value = "Transaksi berhasil disimpan!";
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
    const date = /* @__PURE__ */ new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1e4)
      .toString()
      .padStart(4, "0");
    referenceNumber.value = `TRX/${year}${month}/${random}`;
  };
  return {
    // State
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
    // From composable
    accounts,
    isAccountsLoading,
    // Computed
    canSave,
    // Methods
    handleAccountSearch,
    handleFileUpload,
    removeAttachment,
    saveTransaction,
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
      transactionDate,
      referenceNumber,
      description,
      amount,
      debitAccountId,
      creditAccountId,
      attachmentUrl,
      isAccountsLoading,
      canSave,
      handleAccountSearch,
    } = useTransaction();
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6 bg-background min-h-screen" }, _attrs))} data-v-414003fb><div class="flex items-center gap-4" data-v-414003fb>`,
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
        `<div data-v-414003fb><h1 class="page-title text-foreground" data-v-414003fb>Buat Transaksi</h1><p class="text-sm text-muted-foreground" data-v-414003fb> Buat transaksi dengan bukti dan akun debit/kredit </p></div></div>`,
      );
      if (unref(error)) {
        _push(
          `<div class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in" data-v-414003fb>${ssrInterpolate(unref(error))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(successMessage)) {
        _push(
          `<div class="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm animate-fade-in" data-v-414003fb>${ssrInterpolate(unref(successMessage))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<div class="card-elevated p-8 space-y-8 bg-card shadow-soft border-border" data-v-414003fb><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-414003fb><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb>Tanggal Transaksi</label><input${ssrRenderAttr("value", unref(transactionDate))} type="date" class="input-field" data-v-414003fb></div><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb>Nomor Referensi</label><input${ssrRenderAttr("value", unref(referenceNumber))} type="text" placeholder="TRX/YYMM/0001" class="input-field" readonly data-v-414003fb></div></div><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb> Deskripsi <span class="text-destructive" data-v-414003fb>*</span></label><input${ssrRenderAttr("value", unref(description))} type="text" placeholder="Deskripsi transaksi..." class="input-field" data-v-414003fb></div><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb> Jumlah <span class="text-destructive" data-v-414003fb>*</span></label><input${ssrRenderAttr("value", unref(amount))} type="number" min="0" step="0.01" placeholder="0" class="input-field" data-v-414003fb></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-414003fb><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb> Akun Debit <span class="text-destructive" data-v-414003fb>*</span></label>`,
      );
      _push(
        ssrRenderComponent(
          SearchSelect,
          {
            modelValue: unref(debitAccountId),
            "onUpdate:modelValue": ($event) =>
              isRef(debitAccountId) ? (debitAccountId.value = $event) : null,
            "fetch-options": unref(handleAccountSearch),
            placeholder: "Pilih akun debit...",
            disabled: unref(isAccountsLoading),
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb> Akun Kredit <span class="text-destructive" data-v-414003fb>*</span></label>`,
      );
      _push(
        ssrRenderComponent(
          SearchSelect,
          {
            modelValue: unref(creditAccountId),
            "onUpdate:modelValue": ($event) =>
              isRef(creditAccountId) ? (creditAccountId.value = $event) : null,
            "fetch-options": unref(handleAccountSearch),
            placeholder: "Pilih akun kredit...",
            disabled: unref(isAccountsLoading),
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div></div><div class="space-y-2" data-v-414003fb><label class="text-sm font-medium text-foreground" data-v-414003fb>Bukti Transaksi</label><div class="${ssrRenderClass([{ "border-primary bg-primary/5": unref(attachmentUrl) }, "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"])}" data-v-414003fb><input type="file" accept="image/*" class="hidden" data-v-414003fb>`,
      );
      if (!unref(attachmentUrl)) {
        _push(`<div class="flex flex-col items-center gap-2" data-v-414003fb>`);
        _push(
          ssrRenderComponent(
            unref(Upload),
            { class: "w-8 h-8 text-muted-foreground" },
            null,
            _parent,
          ),
        );
        _push(
          `<p class="text-sm text-muted-foreground" data-v-414003fb>Klik untuk upload bukti transaksi</p><p class="text-xs text-muted-foreground" data-v-414003fb>PNG, JPG, atau PDF (maks. 5MB)</p></div>`,
        );
      } else {
        _push(
          `<div class="relative" data-v-414003fb><img${ssrRenderAttr("src", unref(attachmentUrl))} alt="Bukti transaksi" class="max-h-48 mx-auto rounded-lg object-contain" data-v-414003fb><button type="button" class="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90" data-v-414003fb>`,
        );
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      }
      _push(
        `</div></div><div class="flex justify-end gap-3 pt-6 border-t border-border" data-v-414003fb><button type="button" class="btn-outline border-border text-foreground py-2.5" data-v-414003fb>`,
      );
      _push(ssrRenderComponent(unref(X), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Batal </button><button type="button" class="btn-primary py-2.5 px-8"${ssrIncludeBooleanAttr(!unref(canSave) || unref(isSaving)) ? " disabled" : ""} data-v-414003fb>`,
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
        _push(`<span data-v-414003fb>Menyimpan...</span>`);
      } else {
        _push(`<span data-v-414003fb>Simpan Transaksi</span>`);
      }
      _push(`</button></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/transactions/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-414003fb"]]);

export { create as default };
//# sourceMappingURL=create-BV3UwjQo.mjs.map
