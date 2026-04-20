import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrRenderClass,
  ssrRenderComponent,
  ssrInterpolate,
} from "vue/server-renderer";
import { Receipt, Download } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InvoiceGridView",
  __ssrInlineRender: true,
  props: {
    invoices: {},
    getStatusConfig: { type: Function },
    formatCurrency: { type: Function },
    formatDate: { type: Function },
  },
  emits: ["row-click", "download-pdf"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, _attrs))}><!--[-->`,
      );
      ssrRenderList(__props.invoices, (invoice) => {
        _push(
          `<div class="${ssrRenderClass([
            "border border-border rounded-xl p-5 transition-all cursor-pointer",
            invoice.status?.code === "VOIDED"
              ? "bg-gray-50 opacity-60 hover:opacity-80 hover:shadow-none"
              : "bg-white hover:shadow-sm",
          ])}"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="${ssrRenderClass(
            [
              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
              invoice.status?.code === "VOIDED"
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-50 text-[#012D5A]",
            ],
          )}">`,
        );
        _push(ssrRenderComponent(unref(Receipt), { class: "w-6 h-6" }, null, _parent));
        _push(
          `</div><div><div class="flex items-center gap-2 flex-wrap"><h3 class="${ssrRenderClass([
            "font-bold text-base",
            invoice.status?.code === "VOIDED" ? "line-through text-gray-400" : "text-foreground",
          ])}">${ssrInterpolate(invoice.invoiceNumber)}</h3>`,
        );
        if (invoice.status?.code === "VOIDED") {
          _push(
            `<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">VOID</span>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><p class="text-xs text-muted-foreground">${ssrInterpolate(__props.formatDate(invoice.issuedDate))}</p></div></div></div><div class="space-y-3 mb-4"><div><p class="text-xs text-muted-foreground mb-1">Job No.</p><p class="text-sm font-mono uppercase text-muted-foreground">${ssrInterpolate(invoice.job?.jobNumber || "-")}</p></div><div><p class="text-xs text-muted-foreground mb-1">Customer</p><p class="text-sm font-medium">${ssrInterpolate(invoice.company?.name || "N/A")}</p></div><div><p class="text-xs text-muted-foreground mb-1">Total Amount</p><p class="text-lg font-bold text-[#012D5A]">${ssrInterpolate(__props.formatCurrency(invoice.total))}</p></div><div><p class="text-xs text-muted-foreground mb-1">Due Date</p><p class="text-sm text-gray-700">${ssrInterpolate(__props.formatDate(invoice.dueDate))}</p></div></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-0.5 rounded border text-xs font-medium",
              __props.getStatusConfig(invoice.status?.code || "UNPAID").class,
            ),
          )}">${ssrInterpolate(__props.getStatusConfig(invoice.status?.code || "UNPAID").label)}</span><div class="flex gap-1"><button class="p-1.5 rounded hover:bg-muted transition-colors">`,
        );
        _push(
          ssrRenderComponent(
            unref(Download),
            { class: "w-4 h-4 text-muted-foreground" },
            null,
            _parent,
          ),
        );
        _push(`</button></div></div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/invoice/components/InvoiceGridView.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=InvoiceGridView-CoQ_ezBl.mjs.map
