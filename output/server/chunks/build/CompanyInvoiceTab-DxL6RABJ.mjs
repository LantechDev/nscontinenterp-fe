import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { Building2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyInvoiceTab",
  __ssrInlineRender: true,
  props: {
    invoices: {},
  },
  setup(__props) {
    const formatShortDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<!--[--><div class="justify-start text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5"> Invoices </div>`,
      );
      if (__props.invoices.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.invoices, (invoice) => {
          _push(
            `<div class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 cursor-pointer transition-colors"><div class="self-stretch flex justify-between items-start"><div class="flex justify-start items-start gap-3"><div class="inline-flex flex-col justify-start items-start gap-1"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(invoice.invoiceNumber)}</div><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(invoice.currency)} ${ssrInterpolate(Number(invoice.total).toLocaleString())}</div></div>`,
          );
          if (invoice.status) {
            _push(
              `<div class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1"><div class="text-center text-blue-700 text-sm font-medium font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(invoice.status.name)}</div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div><div class="text-gray-500 text-sm"> Issued: ${ssrInterpolate(formatShortDate(invoice.issuedDate))} | Due: ${ssrInterpolate(formatShortDate(invoice.dueDate))}</div></div>`,
          );
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="w-full py-8 flex flex-col items-center justify-center text-gray-400">`);
        _push(
          ssrRenderComponent(
            unref(Building2),
            { class: "w-8 h-8 mb-2 text-gray-300" },
            null,
            _parent,
          ),
        );
        _push(`<p class="text-sm">No invoices available yet.</p></div>`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyInvoiceTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyInvoiceTab-DxL6RABJ.mjs.map
