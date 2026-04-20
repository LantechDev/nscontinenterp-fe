import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import { defineComponent, unref, withCtx, createVNode, useSSRContext } from "vue";
import {
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import {
  LayoutList,
  LayoutGrid,
  Search,
  Plus,
  Wallet,
  Pencil,
  Trash2,
  Download,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { u as useExpensePage } from "./useExpensePage-CibEMg65.mjs";
import { u as useFinanceExpense } from "./useFinanceExpense-CyuGq-0f.mjs";
import { _ as _sfc_main$1 } from "./index-BT9C6lFI.mjs";
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
import "./server.mjs";
import "vue-router";
import "clsx";
import "tailwind-merge";
import "./useCompanies-D5TCq9CR.mjs";
import "./useJobs-BuvuAhhz.mjs";
import "./useConfirm-iFV_8p0v.mjs";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      expenses,
      filters,
      pagination,
      viewMode,
      searchQuery,
      isEditModalOpen,
      isSubmitting,
      editError,
      editingExpenseId,
      formData,
      categoryOptions,
      companies,
      jobs,
      formatCurrency,
      formatDate,
      isLoading,
      handlePageChange,
      closeEditModal,
      handleUpdate,
    } = useExpensePage();
    useFinanceExpense();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<!--[--><div class="space-y-6 animate-fade-in p-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Biaya Operasional</h1><p class="text-muted-foreground mt-1">Catat pengeluaran operasional</p></div><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
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
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari biaya..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><select class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, "") : ssrLooseEqual(unref(filters).categoryId, "")) ? " selected" : ""}>Semua Kategori</option><option value="trucking"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, "trucking") : ssrLooseEqual(unref(filters).categoryId, "trucking")) ? " selected" : ""}>Trucking</option><option value="port"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, "port") : ssrLooseEqual(unref(filters).categoryId, "port")) ? " selected" : ""}>Port</option><option value="customs"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, "customs") : ssrLooseEqual(unref(filters).categoryId, "customs")) ? " selected" : ""}>Customs</option></select>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/expenses/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Catat Biaya</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Catat Biaya"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(isLoading)) {
        _push(
          `<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`,
        );
      } else {
        _push(`<!--[-->`);
        if (unref(viewMode) === "list") {
          _push(
            `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">No. Biaya</th><th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th><th class="py-3 px-4 text-sm font-medium text-foreground">Vendor</th><th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th><th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th><th class="py-3 px-4 text-sm font-medium text-foreground">Kategori</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
          );
          ssrRenderList(unref(expenses), (expense) => {
            _push(
              `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4"><div class="flex items-center gap-2"><div class="p-1.5 rounded bg-red-50 text-destructive">`,
            );
            _push(ssrRenderComponent(unref(Wallet), { class: "w-4 h-4" }, null, _parent));
            _push(
              `</div><span class="text-sm font-medium">${ssrInterpolate(expense.number)}</span></div></td><td class="py-3 px-4 text-sm">${ssrInterpolate(expense.description)}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(expense.vendor?.name || "N/A")}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(unref(formatDate)(expense.date))}</td><td class="py-3 px-4 text-sm font-medium text-destructive">${ssrInterpolate(unref(formatCurrency)(Number(expense.amount)))}</td><td class="py-3 px-4"><span class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">${ssrInterpolate(expense.category?.name || "Uncategorized")}</span></td><td class="py-3 px-4 text-right"><div class="flex gap-1 justify-end"><button class="p-1.5 rounded hover:bg-muted transition-colors">`,
            );
            _push(
              ssrRenderComponent(
                unref(Pencil),
                { class: "w-4 h-4 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push(`</button><button class="p-1.5 rounded hover:bg-muted transition-colors">`);
            _push(
              ssrRenderComponent(
                unref(Trash2),
                { class: "w-4 h-4 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push(`</button><button class="p-1.5 rounded hover:bg-muted transition-colors">`);
            _push(
              ssrRenderComponent(
                unref(Download),
                { class: "w-4 h-4 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push(`</button></div></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(expenses).length === 0) {
            _push(
              `<tr><td colspan="7" class="py-12 text-center text-muted-foreground"> Tidak ada biaya ditemukan. </td></tr>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
          ssrRenderList(unref(expenses), (expense) => {
            _push(
              `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-red-50 text-destructive flex items-center justify-center shrink-0">`,
            );
            _push(ssrRenderComponent(unref(Wallet), { class: "w-6 h-6" }, null, _parent));
            _push(
              `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(expense.number)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(unref(formatDate)(expense.date))}</p></div></div></div><div class="flex gap-2"><button class="text-muted-foreground hover:text-foreground p-1">`,
            );
            _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
            _push(`</button><button class="text-muted-foreground hover:text-foreground p-1">`);
            _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
            _push(`</button><button class="text-muted-foreground hover:text-foreground p-1">`);
            _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
            _push(
              `</button></div><div class="space-y-3 mb-4 mt-3"><div><p class="text-xs text-muted-foreground mb-1">Description</p><p class="text-sm font-medium line-clamp-2">${ssrInterpolate(expense.description)}</p></div><div><p class="text-xs text-muted-foreground mb-1">Vendor</p><p class="text-sm font-medium">${ssrInterpolate(expense.vendor?.name || "N/A")}</p></div><div><p class="text-xs text-muted-foreground mb-1">Amount</p><p class="text-lg font-bold text-destructive">${ssrInterpolate(unref(formatCurrency)(Number(expense.amount)))}</p></div></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">${ssrInterpolate(expense.category?.name || "Uncategorized")}</span></div></div>`,
            );
          });
          _push(`<!--]-->`);
          if (unref(expenses).length === 0) {
            _push(
              `<div class="col-span-full py-12 text-center text-muted-foreground"> Tidak ada biaya ditemukan. </div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(
          `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(pagination).total)} data found.</p>`,
        );
        if (unref(pagination).total > 0) {
          _push(
            ssrRenderComponent(
              _component_UiPagination,
              {
                page: unref(filters).page,
                "onUpdate:page": [
                  ($event) => (unref(filters).page = $event),
                  unref(handlePageChange),
                ],
                total: unref(pagination).total,
                "items-per-page": unref(pagination).limit,
              },
              null,
              _parent,
            ),
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
      _push(
        ssrRenderComponent(
          unref(_sfc_main$1),
          {
            "is-open": unref(isEditModalOpen),
            "is-submitting": unref(isSubmitting),
            "edit-error": unref(editError),
            "editing-expense-id": unref(editingExpenseId),
            "form-data": unref(formData),
            "category-options": unref(categoryOptions),
            companies: unref(companies),
            jobs: unref(jobs),
            onClose: unref(closeEditModal),
            onSubmit: unref(handleUpdate),
          },
          null,
          _parent,
        ),
      );
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/expenses/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-4intI7un.mjs.map
