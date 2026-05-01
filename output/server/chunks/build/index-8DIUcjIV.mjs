import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import {
  defineComponent,
  computed,
  ref,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  isRef,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import {
  LayoutList,
  LayoutGrid,
  Search,
  Plus,
  FileText,
  MoreVertical,
  Send,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { d as useState, u as useRuntimeConfig } from "./server.mjs";
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
import "clsx";
import "tailwind-merge";
import "vue-router";

function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function calculateItemAmount(quantity, unitPrice) {
  return quantity * unitPrice;
}
function calculateTotals(items) {
  const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subTotal * 0.11;
  const total = subTotal + taxAmount;
  return { subTotal, taxAmount, total };
}
function useQuotations() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const quotations = useState("quotations-list", () => []);
  const currentQuotation = useState("quotations-current", () => null);
  async function fetchQuotations(search, status) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/marketing/quotations`, {
        params: { search, status },
        credentials: "include",
      });
      quotations.value = data || [];
      return { success: true, data: quotations.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function getQuotation(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/marketing/quotations/${id}`, {
        credentials: "include",
      });
      currentQuotation.value = data;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function createQuotation(payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/marketing/quotations`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      quotations.value = [...quotations.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function updateQuotation(id, payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/marketing/quotations/${id}`, {
        method: "PUT",
        body: payload,
        credentials: "include",
      });
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = data;
      }
      quotations.value = quotations.value.map((q) => (q.id === id ? { ...q, ...data } : q));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteQuotation(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/marketing/quotations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      quotations.value = quotations.value.filter((q) => q.id !== id);
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = null;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  return {
    quotations,
    currentQuotation,
    isLoading,
    fetchQuotations,
    getQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    calculateItemAmount,
    calculateTotals,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { quotations: quotationsList, fetchQuotations } = useQuotations();
    function formatAmount(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const quotations = computed(() => {
      return quotationsList.value.map((q) => ({
        id: q.id,
        number: q.number,
        customer: q.customer?.name || "-",
        date: formatDate(q.date),
        amount: formatAmount(q.total),
        status: q.status.toLowerCase(),
      }));
    });
    const statusConfig = {
      draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
      sent: { label: "Terkirim", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      accepted: { label: "Diterima", class: "bg-green-50 text-green-700 border-green-200" },
      rejected: { label: "Ditolak", class: "bg-red-50 text-red-700 border-red-200" },
    };
    const viewMode = ref("list");
    const currentPage = ref(1);
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
    });
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchQuotations();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Penawaran</h1><p class="text-muted-foreground mt-1">Kelola quotation dan penawaran harga</p></div><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "list"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutList), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "grid"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button></div></div></div><div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
      );
      _push(
        ssrRenderComponent(
          unref(Search),
          { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<input type="text" placeholder="Cari penawaran..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><select class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"><option value="">Semua Status</option><option value="draft">Draft</option><option value="sent">Terkirim</option><option value="accepted">Diterima</option><option value="rejected">Ditolak</option></select>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/sales/quotation/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Buat Penawaran</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Buat Penawaran"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(viewMode) === "list") {
        _push(
          `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">No. Penawaran</th><th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th><th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th><th class="py-3 px-4 text-sm font-medium text-foreground">Total</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
        );
        ssrRenderList(unref(quotations), (quotation) => {
          _push(
            `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4"><div class="flex items-center gap-2"><div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">`,
          );
          _push(ssrRenderComponent(unref(FileText), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</div><span class="text-sm font-medium">${ssrInterpolate(quotation.number)}</span></div></td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(quotation.customer)}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(quotation.date)}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(quotation.amount)}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium",
                statusConfig[quotation.status]?.class,
              ),
            )}">${ssrInterpolate(statusConfig[quotation.status]?.label)}</span></td><td class="py-3 px-4 text-right"><button class="text-muted-foreground hover:text-foreground">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(quotations), (quotation) => {
          _push(
            `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0">`,
          );
          _push(ssrRenderComponent(unref(FileText), { class: "w-6 h-6" }, null, _parent));
          _push(
            `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(quotation.number)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(quotation.date)}</p></div></div><button class="text-muted-foreground hover:text-foreground">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button></div><div class="space-y-3 mb-4"><div><p class="text-xs text-muted-foreground mb-1">Customer</p><p class="text-sm font-medium">${ssrInterpolate(quotation.customer)}</p></div><div><p class="text-xs text-muted-foreground mb-1">Total Amount</p><p class="text-lg font-bold text-[#012D5A]">${ssrInterpolate(quotation.amount)}</p></div></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium",
                statusConfig[quotation.status]?.class,
              ),
            )}">${ssrInterpolate(statusConfig[quotation.status]?.label)}</span><div class="flex gap-2"><button class="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Kirim">`,
          );
          _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(quotations).length)} data found.</p>`,
      );
      _push(
        ssrRenderComponent(
          _component_UiPagination,
          {
            page: unref(currentPage),
            "onUpdate:page": [
              ($event) => (isRef(currentPage) ? (currentPage.value = $event) : null),
              handlePageChange,
            ],
            total: unref(pagination).total,
            "items-per-page": unref(pagination).limit,
          },
          null,
          _parent,
        ),
      );
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/sales/quotation/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-8DIUcjIV.mjs.map
