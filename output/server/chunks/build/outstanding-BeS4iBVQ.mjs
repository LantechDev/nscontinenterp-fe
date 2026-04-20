import {
  defineComponent,
  ref,
  watch,
  computed,
  mergeProps,
  unref,
  isRef,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrIncludeBooleanAttr,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ChevronLeft, FileText, Loader2, Search, TrendingUp } from "lucide-vue-next";
import { f as formatRupiah, c as cn } from "./utils-C_kyg7_s.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import { u as usePayments } from "./usePayments-BGfFm4PO.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import { a as useRouter } from "./server.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "clsx";
import "tailwind-merge";
import "./index-DJGQOf1Z.mjs";
import "@vueuse/core";
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
import "vue-router";

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    card: {},
    index: {},
    class: {},
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class: unref(cn)(
                "border border-border rounded-xl p-4",
                __props.card.isPrimary
                  ? "bg-[#012D5A] border-[#012D5A] text-white"
                  : "bg-white border-border",
                _ctx.$props.class,
              ),
            },
            _attrs,
          ),
        )}><div class="flex items-start justify-between"><div><p class="${ssrRenderClass(
          unref(cn)(
            "text-sm font-medium",
            __props.card.isPrimary ? "text-white/80" : "text-muted-foreground",
          ),
        )}">${ssrInterpolate(__props.card.title)}</p><p class="${ssrRenderClass(unref(cn)("text-xl font-bold mt-1", __props.card.isPrimary ? "text-white" : "text-foreground"))}">${ssrInterpolate(__props.card.value)}</p></div>`,
      );
      if (__props.card.change && __props.card.change > 0 && !__props.card.suffix) {
        _push(
          `<div class="${ssrRenderClass(
            unref(cn)(
              "flex items-center gap-1 text-xs font-medium",
              __props.card.isPrimary ? "text-green-400" : "text-green-600",
            ),
          )}">`,
        );
        _push(ssrRenderComponent(unref(TrendingUp), { class: "w-3 h-3" }, null, _parent));
        _push(`<span>${ssrInterpolate(__props.card.change)}%</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.card.changeLabel) {
        _push(
          `<p class="${ssrRenderClass(unref(cn)("text-xs mt-2", __props.card.isPrimary ? "text-white/60" : "text-muted-foreground"))}">${ssrInterpolate(__props.card.changeLabel)}</p>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/finance/StatCard.vue",
  );
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "FinanceStatCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "outstanding",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchOutstandingReport, isLoading } = usePayments();
    const { companies } = useCompanies();
    const filters = ref({
      companyId: "",
      month: /* @__PURE__ */ new Date().getMonth() + 1,
      year: /* @__PURE__ */ new Date().getFullYear(),
    });
    const pagination = ref({
      page: 1,
      limit: 10,
      total: 0,
    });
    const reportData = ref(null);
    const loadReport = async () => {
      const result = await fetchOutstandingReport({
        companyId: filters.value.companyId || void 0,
        month: filters.value.month || void 0,
        year: filters.value.year || void 0,
        page: pagination.value.page,
        limit: pagination.value.limit,
      });
      if (result.success && result.data) {
        reportData.value = result.data;
        pagination.value.total = result.data.pagination.total;
      }
    };
    watch(
      filters,
      () => {
        pagination.value.page = 1;
      },
      { deep: true },
    );
    const formatCurrency = formatRupiah;
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };
    const isExporting = ref(false);
    const monthOptions = [
      { label: "January", value: 1 },
      { label: "February", value: 2 },
      { label: "March", value: 3 },
      { label: "April", value: 4 },
      { label: "May", value: 5 },
      { label: "June", value: 6 },
      { label: "July", value: 7 },
      { label: "August", value: 8 },
      { label: "September", value: 9 },
      { label: "October", value: 10 },
      { label: "November", value: 11 },
      { label: "December", value: 12 },
    ];
    const currentYear = /* @__PURE__ */ new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
      const y = currentYear - i;
      return { label: String(y), value: y };
    });
    useRouter();
    const statsCards = computed(() => {
      if (!reportData.value) return [];
      return [
        {
          title: "Total Invoiced",
          value: formatCurrency(reportData.value.summary.totalInvoiced),
          changeLabel: `From ${reportData.value.summary.count} invoices`,
          isPrimary: false,
        },
        {
          title: "Total Paid",
          value: formatCurrency(reportData.value.summary.totalPaid),
          changeLabel: "Collected funds",
          isPrimary: false,
        },
        {
          title: "Total Outstanding",
          value: formatCurrency(reportData.value.summary.totalOutstanding),
          changeLabel: "Awaiting collection",
          isPrimary: true,
        },
      ];
    });
    const companyOptions = computed(() => {
      return [
        { name: "All Customers", id: "" },
        ...companies.value.map((c) => ({ name: c.name, id: c.id })),
      ];
    });
    ref("/images/transparentnscontinenttebal.png");
    const monthValue = computed({
      get: () => String(filters.value.month),
      set: (val) => (filters.value.month = Number(val)),
    });
    const yearValue = computed({
      get: () => String(filters.value.year),
      set: (val) => (filters.value.year = Number(val)),
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FinanceStatCard = __nuxt_component_0;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col h-screen overflow-hidden bg-white" }, _attrs))} data-v-74907b38><div class="shrink-0 bg-white border-b border-border" data-v-74907b38><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6" data-v-74907b38><div class="flex items-center gap-4" data-v-74907b38><button class="w-10 h-10 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-all active:scale-95" data-v-74907b38>`,
      );
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-5 h-5" }, null, _parent));
      _push(
        `</button><div data-v-74907b38><h1 class="text-2xl font-bold" data-v-74907b38>Outstanding Payments</h1><p class="text-muted-foreground text-base" data-v-74907b38>Financial aging and collection report</p></div></div><div class="flex items-center gap-3" data-v-74907b38><button${ssrIncludeBooleanAttr(unref(isExporting) || !unref(reportData)) ? " disabled" : ""} class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50" data-v-74907b38>`,
      );
      if (!unref(isExporting)) {
        _push(
          ssrRenderComponent(unref(FileText), { class: "w-4 h-4 text-green-600" }, null, _parent),
        );
      } else {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      }
      _push(
        `<span class="font-medium text-gray-700" data-v-74907b38>Export Excel</span></button></div></div></div><div class="flex-1 overflow-y-auto pt-6 pb-20 custom-scrollbar" data-v-74907b38><div class="space-y-6 px-6" data-v-74907b38>`,
      );
      if (unref(reportData)) {
        _push(
          `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-v-74907b38><!--[-->`,
        );
        ssrRenderList(unref(statsCards), (card, index) => {
          _push(
            ssrRenderComponent(
              _component_FinanceStatCard,
              {
                key: index,
                card,
                index,
              },
              null,
              _parent,
            ),
          );
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<div class="border border-border rounded-xl bg-white" data-v-74907b38><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" data-v-74907b38><h2 class="text-lg font-semibold" data-v-74907b38>Report Data</h2><div class="flex flex-wrap items-center gap-2" data-v-74907b38><button${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-all active:scale-95 disabled:opacity-50" data-v-74907b38>`,
      );
      if (!unref(isLoading)) {
        _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      }
      _push(
        `<span data-v-74907b38>Generate Report</span></button></div></div><div class="flex flex-wrap items-center gap-3 p-5 border-b border-border bg-gray-50/30" data-v-74907b38><div class="flex-1 min-w-[200px]" data-v-74907b38>`,
      );
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(filters).companyId,
            "onUpdate:modelValue": ($event) => (unref(filters).companyId = $event),
            options: unref(companyOptions),
            "label-key": "name",
            "value-key": "id",
            placeholder: "All Customers",
          },
          null,
          _parent,
        ),
      );
      _push(`</div><div class="w-48" data-v-74907b38>`);
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(monthValue),
            "onUpdate:modelValue": ($event) =>
              isRef(monthValue) ? (monthValue.value = $event) : null,
            options: monthOptions,
            "label-key": "label",
            "value-key": "value",
            placeholder: "Month",
          },
          null,
          _parent,
        ),
      );
      _push(`</div><div class="w-32" data-v-74907b38>`);
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(yearValue),
            "onUpdate:modelValue": ($event) =>
              isRef(yearValue) ? (yearValue.value = $event) : null,
            options: unref(yearOptions),
            "label-key": "label",
            "value-key": "value",
            placeholder: "Year",
          },
          null,
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(reportData)) {
        _push(
          `<div class="overflow-x-auto" data-v-74907b38><table class="w-full" data-v-74907b38><thead data-v-74907b38><tr class="border-b border-border bg-gray-50/50" data-v-74907b38><th class="py-3 px-4 text-left text-sm font-medium text-gray-500" data-v-74907b38>Inv Date</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500" data-v-74907b38>Invoice No.</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500" data-v-74907b38>Customer</th><th class="py-3 px-4 text-right text-sm font-medium text-gray-500" data-v-74907b38>Total</th><th class="py-3 px-4 text-right text-sm font-medium text-gray-500" data-v-74907b38> Outstanding </th><th class="py-3 px-4 text-center text-sm font-medium text-gray-500" data-v-74907b38>Status</th></tr></thead><tbody class="divide-y divide-gray-100" data-v-74907b38><!--[-->`,
        );
        ssrRenderList(unref(reportData).invoices, (inv) => {
          _push(
            `<tr class="hover:bg-gray-50/50 transition-colors" data-v-74907b38><td class="py-3 px-4 text-sm text-gray-600" data-v-74907b38>${ssrInterpolate(formatDate(inv.issuedDate))}</td><td class="py-3 px-4" data-v-74907b38><span class="text-sm font-medium text-[#012D5A]" data-v-74907b38>${ssrInterpolate(inv.invoiceNumber)}</span></td><td class="py-3 px-4 text-sm" data-v-74907b38><div class="flex flex-col" data-v-74907b38><span class="font-medium text-gray-900" data-v-74907b38>${ssrInterpolate(inv.company.name)}</span><span class="text-[10px] text-muted-foreground uppercase font-bold tracking-tight" data-v-74907b38>${ssrInterpolate(inv.company.code)}</span></div></td><td class="py-3 px-4 text-sm text-right font-medium text-gray-700" data-v-74907b38>${ssrInterpolate(unref(formatCurrency)(inv.total))}</td><td class="py-3 px-4 text-sm text-bold text-right text-orange-600" data-v-74907b38>${ssrInterpolate(unref(formatCurrency)(inv.balanceDue))}</td><td class="py-3 px-4 text-center" data-v-74907b38><span class="${ssrRenderClass(
              [
                "px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider",
                inv.status.code === "PARTIALLY_PAID"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200",
              ],
            )}" data-v-74907b38>${ssrInterpolate(inv.status.name)}</span></td></tr>`,
          );
        });
        _push(
          `<!--]--></tbody><tfoot class="bg-gray-50/50 font-bold border-t border-border" data-v-74907b38><tr data-v-74907b38><td colspan="3" class="py-4 px-4 text-sm text-gray-700 text-right uppercase tracking-wider" data-v-74907b38> Grand Totals </td><td class="py-4 px-4 text-right text-sm text-[#012D5A] font-bold" data-v-74907b38>${ssrInterpolate(unref(formatCurrency)(unref(reportData).summary.totalInvoiced))}</td><td class="py-4 px-4 text-right text-sm text-orange-600 font-bold" data-v-74907b38>${ssrInterpolate(unref(formatCurrency)(unref(reportData).summary.totalOutstanding))}</td><td data-v-74907b38></td></tr></tfoot></table></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(reportData) && unref(pagination).total > 0) {
        _push(
          `<div class="flex items-center justify-between p-4 border-t border-border bg-gray-50/10" data-v-74907b38><p class="text-sm text-muted-foreground font-medium" data-v-74907b38> Showing ${ssrInterpolate((unref(pagination).page - 1) * unref(pagination).limit + 1)} to ${ssrInterpolate(Math.min(unref(pagination).page * unref(pagination).limit, unref(pagination).total))} of ${ssrInterpolate(unref(pagination).total)} results </p>`,
        );
        _push(
          ssrRenderComponent(
            _component_UiPagination,
            {
              page: unref(pagination).page,
              "onUpdate:page": [($event) => (unref(pagination).page = $event), loadReport],
              total: unref(pagination).total,
              "items-per-page": unref(pagination).limit,
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (!unref(isLoading)) {
        _push(
          `<div class="flex flex-col items-center justify-center py-24 px-6" data-v-74907b38><div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4" data-v-74907b38>`,
        );
        _push(ssrRenderComponent(unref(Search), { class: "w-8 h-8 text-gray-300" }, null, _parent));
        _push(
          `</div><h3 class="text-lg font-semibold text-gray-900 mb-1" data-v-74907b38>Generate Report</h3><p class="text-muted-foreground text-center max-w-sm text-sm" data-v-74907b38> Select filters above and click generate to analyze outstanding payments. </p></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(isLoading)) {
        _push(`<div class="flex flex-col items-center justify-center py-24" data-v-74907b38>`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-10 h-10 animate-spin text-[#012D5A] opacity-20 mb-4" },
            null,
            _parent,
          ),
        );
        _push(
          `<p class="text-sm font-medium text-muted-foreground animate-pulse" data-v-74907b38> Calculating balances... </p></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/report/outstanding.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const outstanding = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-74907b38"]]);

export { outstanding as default };
//# sourceMappingURL=outstanding-BeS4iBVQ.mjs.map
