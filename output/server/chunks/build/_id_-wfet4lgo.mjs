import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, ref, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { ArrowLeft, Download, Trash2, Edit, Wallet } from "lucide-vue-next";
import { u as useFinanceExpense } from "./useFinanceExpense-CyuGq-0f.mjs";
import { u as useExpensePage } from "./useExpensePage-CibEMg65.mjs";
import { _ as _sfc_main$1 } from "./index-BT9C6lFI.mjs";
import { e as useRoute } from "./server.mjs";
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
import "./useCompanies-D5TCq9CR.mjs";
import "./useJobs-BuvuAhhz.mjs";
import "./useConfirm-iFV_8p0v.mjs";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const { isLoading } = useFinanceExpense();
    const {
      isEditModalOpen,
      isSubmitting,
      editError,
      editingExpenseId,
      formData,
      categoryOptions,
      companies,
      jobs,
      closeEditModal,
      handleUpdate,
    } = useExpensePage();
    const expense = ref(null);
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    };
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div class="space-y-6 animate-fade-in p-6">`);
      if (unref(isLoading) && !unref(expense)) {
        _push(
          `<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`,
        );
      } else if (unref(expense)) {
        _push(
          `<!--[--><div class="page-header"><div class="flex items-center justify-between"><div class="flex items-center gap-4">`,
        );
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: "/finance/expenses",
              class: "p-2 rounded-lg hover:bg-muted transition-colors",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    ssrRenderComponent(
                      unref(ArrowLeft),
                      { class: "w-5 h-5" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  return [createVNode(unref(ArrowLeft), { class: "w-5 h-5" })];
                }
              }),
              _: 1,
            },
            _parent,
          ),
        );
        _push(
          `<div><h1 class="text-2xl font-bold">${ssrInterpolate(unref(expense).number)}</h1><p class="text-muted-foreground mt-1">Detail biaya operasional</p></div></div><div class="flex items-center gap-2"><button class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium">`,
        );
        _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span>Export PDF</span></button><button class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">`,
        );
        _push(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent));
        _push(
          `</button><button class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium">`,
        );
        _push(ssrRenderComponent(unref(Edit), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span>Edit</span></button></div></div></div><div class="bg-white p-8 rounded-xl border border-border shadow-sm"><div class="flex items-center gap-6 mb-8 pb-8 border-b border-border"><div class="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">`,
        );
        _push(
          ssrRenderComponent(unref(Wallet), { class: "w-8 h-8 text-destructive" }, null, _parent),
        );
        _push(
          `</div><div><h2 class="text-2xl font-bold">${ssrInterpolate(unref(expense).number)}</h2><p class="text-muted-foreground font-medium">${ssrInterpolate(unref(expense).vendor?.name || "Manual Entry")}</p></div><div class="ml-auto text-right"><p class="text-sm text-muted-foreground mb-1">Total Amount</p><p class="text-3xl font-black text-destructive">${ssrInterpolate(formatCurrency(Number(unref(expense).amount)))}</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div class="space-y-1.5 md:col-span-2 lg:col-span-3"><p class="text-sm text-muted-foreground">Deskripsi</p><p class="text-lg font-medium">${ssrInterpolate(unref(expense).description)}</p></div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">No. Job</p>`,
        );
        if (unref(expense).job) {
          _push(
            `<p class="font-bold text-primary">${ssrInterpolate(unref(expense).job.jobNumber)}</p>`,
          );
        } else {
          _push(`<p class="text-muted-foreground">N/A</p>`);
        }
        _push(
          `</div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Tanggal</p><p class="font-bold">${ssrInterpolate(formatDate(unref(expense).date))}</p></div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Kategori</p><div><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border">${ssrInterpolate(unref(expense).category?.name || "Uncategorized")}</span></div></div><div class="space-y-1.5 md:col-span-2 lg:col-span-3 pt-4 border-t"><p class="text-sm text-muted-foreground">Keterangan Tambahan</p><p class="text-sm text-foreground italic">${ssrInterpolate(unref(expense).notes || "-")}</p></div></div></div><!--]-->`,
        );
      } else {
        _push(`<!---->`);
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
    "pages/finance/expenses/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-wfet4lgo.mjs.map
