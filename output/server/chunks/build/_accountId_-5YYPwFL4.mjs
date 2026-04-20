import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderList,
  ssrRenderClass,
  ssrRenderAttr,
} from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { c as cn, f as formatRupiah } from "./utils-C_kyg7_s.mjs";
import { u as useRuntimeConfig } from "./server.mjs";
import "clsx";
import "tailwind-merge";
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[accountId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const accountId = computed(() => route.params.accountId);
    const isLoading = ref(false);
    const accountDetail = ref(null);
    const error = ref(null);
    const selectedPeriod = ref(route.query.period || "month");
    const selectedYear = ref(
      route.query.year || /* @__PURE__ */ new Date().getFullYear().toString(),
    );
    const availableYears = computed(() => {
      const currentYear = /* @__PURE__ */ new Date().getFullYear();
      const years = [];
      for (let i = currentYear; i >= currentYear - 5; i--) {
        years.push(i.toString());
      }
      return years;
    });
    const formatCurrency = formatRupiah;
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase || "";
    async function fetchAccountDetail() {
      if (!accountId.value) return;
      isLoading.value = true;
      error.value = null;
      accountDetail.value = null;
      try {
        const queryParams = new URLSearchParams({
          period: selectedPeriod.value,
        });
        if (selectedYear.value) {
          queryParams.append("year", selectedYear.value);
        }
        const data = await $fetch(
          `${baseUrl}/finance/dashboard/trial-balance/${accountId.value}?${queryParams.toString()}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        accountDetail.value = data;
      } catch (err) {
        console.error("Failed to fetch account detail:", err);
        error.value = "Failed to load account details";
      } finally {
        isLoading.value = false;
      }
    }
    watch(
      () => route.params.accountId,
      () => {
        if (accountId.value) {
          fetchAccountDetail();
        }
      },
      { immediate: true },
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center gap-4"><button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">`,
      );
      _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent));
      _push(`</button><div><h1 class="text-2xl font-bold">Account Detail</h1>`);
      if (accountDetail.value) {
        _push(
          `<p class="text-muted-foreground mt-1">${ssrInterpolate(accountDetail.value.accountCode)} - ${ssrInterpolate(accountDetail.value.accountName)}</p>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></div><div class="flex flex-col sm:flex-row gap-4"><div class="flex items-center gap-2"><label class="text-sm font-medium text-muted-foreground">Period:</label><div class="flex bg-white border border-border rounded-lg p-1"><!--[-->`,
      );
      ssrRenderList(["day", "week", "month", "year"], (period) => {
        _push(
          `<button class="${ssrRenderClass(
            unref(cn)(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
              selectedPeriod.value === period
                ? "bg-[#012D5A] text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            ),
          )}">${ssrInterpolate(period)}</button>`,
        );
      });
      _push(
        `<!--]--></div></div><div class="flex items-center gap-2"><label class="text-sm font-medium text-muted-foreground">Year:</label><select${ssrRenderAttr("value", selectedYear.value)} class="px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#012D5A]"><!--[-->`,
      );
      ssrRenderList(availableYears.value, (year) => {
        _push(`<option${ssrRenderAttr("value", year)}>${ssrInterpolate(year)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
      if (isLoading.value) {
        _push(
          `<div class="flex items-center justify-center py-12"><div class="flex items-center gap-2"><div class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"></div><span class="text-muted-foreground">Loading account details...</span></div></div>`,
        );
      } else if (error.value) {
        _push(
          `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">${ssrInterpolate(error.value)}</div>`,
        );
      } else if (accountDetail.value) {
        _push(
          `<div class="space-y-6"><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div class="p-4 bg-gray-50 rounded-lg"><div class="text-xs text-muted-foreground uppercase">Opening Balance</div><div class="${ssrRenderClass([accountDetail.value.openingBalance >= 0 ? "text-green-600" : "text-red-600", "text-lg font-semibold"])}">${ssrInterpolate(unref(formatCurrency)(accountDetail.value.openingBalance))}</div></div><div class="p-4 bg-gray-50 rounded-lg"><div class="text-xs text-muted-foreground uppercase">Debit Total</div><div class="text-lg font-semibold">${ssrInterpolate(unref(formatCurrency)(accountDetail.value.debitTotal))}</div></div><div class="p-4 bg-gray-50 rounded-lg"><div class="text-xs text-muted-foreground uppercase">Credit Total</div><div class="text-lg font-semibold">${ssrInterpolate(unref(formatCurrency)(accountDetail.value.creditTotal))}</div></div><div class="p-4 bg-gray-50 rounded-lg"><div class="text-xs text-muted-foreground uppercase">Closing Balance</div><div class="${ssrRenderClass([accountDetail.value.closingBalance >= 0 ? "text-green-600" : "text-red-600", "text-lg font-semibold"])}">${ssrInterpolate(unref(formatCurrency)(accountDetail.value.closingBalance))}</div></div></div><div class="border border-border rounded-xl bg-white overflow-hidden"><div class="px-6 py-4 border-b border-border"><h2 class="text-lg font-semibold">Journal Entries</h2></div><div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"> Date </th><th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"> Reference </th><th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"> Description </th><th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"> Debit </th><th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"> Credit </th><th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"> Running Balance </th></tr></thead><tbody class="divide-y divide-border"><!--[-->`,
        );
        ssrRenderList(accountDetail.value.journalEntries, (entry) => {
          _push(
            `<tr class="hover:bg-gray-50"><td class="px-4 py-3 text-sm">${ssrInterpolate(entry.journalDate)}</td><td class="px-4 py-3 text-sm">`,
          );
          if (entry.referenceType) {
            _push(
              `<span class="text-muted-foreground">${ssrInterpolate(entry.referenceType)}</span>`,
            );
          } else {
            _push(`<span class="text-muted-foreground">-</span>`);
          }
          _push(
            `</td><td class="px-4 py-3 text-sm"><div>${ssrInterpolate(entry.description || "-")}</div></td><td class="px-4 py-3 text-sm text-right">${ssrInterpolate(entry.debit > 0 ? unref(formatCurrency)(entry.debit) : "-")}</td><td class="px-4 py-3 text-sm text-right">${ssrInterpolate(entry.credit > 0 ? unref(formatCurrency)(entry.credit) : "-")}</td><td class="${ssrRenderClass([entry.runningBalance >= 0 ? "text-green-600" : "text-red-600", "px-4 py-3 text-sm text-right font-medium"])}">${ssrInterpolate(unref(formatCurrency)(entry.runningBalance))}</td></tr>`,
          );
        });
        _push(`<!--]--></tbody></table></div>`);
        if (accountDetail.value.journalEntries.length === 0) {
          _push(
            `<div class="text-center py-8 text-muted-foreground"> No journal entries for this account in the selected period </div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(
          `<div class="text-center py-12 text-muted-foreground">No account details available</div>`,
        );
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/trial-balance/[accountId].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_accountId_-5YYPwFL4.mjs.map
