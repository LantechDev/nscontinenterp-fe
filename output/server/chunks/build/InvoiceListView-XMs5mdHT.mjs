import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
  ssrRenderComponent,
} from "vue/server-renderer";
import { Receipt, Download } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InvoiceListView",
  __ssrInlineRender: true,
  props: {
    invoices: {},
    getStatusConfig: { type: Function },
    formatCurrency: { type: Function },
    formatDate: { type: Function },
  },
  emits: ["row-click", "download-pdf"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const groupedInvoices = computed(() => {
      const groups = {};
      props.invoices.forEach((invoice) => {
        const jobKey = invoice.job?.jobNumber || "no-job";
        if (!groups[jobKey]) {
          groups[jobKey] = {
            jobKey,
            jobNumber: invoice.job?.jobNumber || "Tanpa Job",
            invoices: [],
          };
        }
        groups[jobKey].invoices.push(invoice);
      });
      return Object.values(groups);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl bg-white overflow-hidden" }, _attrs))}><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">No. Invoice</th><th class="py-3 px-4 text-sm font-medium text-foreground">Job No.</th><th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th><th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th><th class="py-3 px-4 text-sm font-medium text-foreground">Jatuh Tempo</th><th class="py-3 px-4 text-sm font-medium text-foreground">Total</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
      );
      ssrRenderList(unref(groupedInvoices), (group) => {
        _push(
          `<!--[--><tr class="bg-gray-50 border-b border-border"><td colspan="8" class="py-2.5 px-4"><div class="flex items-center gap-2"><span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Job:</span><span class="text-sm font-bold text-[#012D5A]">${ssrInterpolate(group.jobNumber)}</span><span class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2">${ssrInterpolate(group.invoices.length)} INVOICE${ssrInterpolate(group.invoices.length > 1 ? "S" : "")}</span></div></td></tr><!--[-->`,
        );
        ssrRenderList(group.invoices, (invoice) => {
          _push(
            `<tr class="${ssrRenderClass([
              "border-b border-border last:border-b transition-colors cursor-pointer",
              invoice.status?.code === "VOIDED"
                ? "bg-gray-50/80 opacity-60 hover:opacity-80"
                : "hover:bg-muted/30",
            ])}"><td class="py-3 px-4 pl-8"><div class="flex items-center gap-2"><div class="${ssrRenderClass(
              [
                "p-1.5 rounded",
                invoice.status?.code === "VOIDED"
                  ? "bg-gray-100 text-gray-400"
                  : "bg-blue-50 text-[#012D5A]",
              ],
            )}">`,
          );
          _push(ssrRenderComponent(unref(Receipt), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</div><span class="${ssrRenderClass([
              "text-sm font-medium",
              invoice.status?.code === "VOIDED" ? "line-through text-gray-400" : "",
            ])}">${ssrInterpolate(invoice.invoiceNumber)}</span>`,
          );
          if (invoice.status?.code === "VOIDED") {
            _push(
              `<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded"> VOID </span>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></td><td class="py-3 px-4 text-sm font-mono text-muted-foreground uppercase">${ssrInterpolate(invoice.job?.jobNumber || "-")}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(invoice.company?.name || "N/A")}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(__props.formatDate(invoice.issuedDate))}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(__props.formatDate(invoice.dueDate))}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(__props.formatCurrency(invoice.total))}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium",
                __props.getStatusConfig(invoice.status?.code || "UNPAID").class,
              ),
            )}">${ssrInterpolate(__props.getStatusConfig(invoice.status?.code || "UNPAID").label)}</span></td><td class="py-3 px-4 text-right"><div class="flex gap-1 justify-end"><button class="p-1.5 rounded hover:bg-muted transition-colors">`,
          );
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
        _push(`<!--]--><!--]-->`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/invoice/components/InvoiceListView.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=InvoiceListView-XMs5mdHT.mjs.map
