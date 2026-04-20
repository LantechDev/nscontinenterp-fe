import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import { Plus, FileText, Edit } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobBlTab",
  __ssrInlineRender: true,
  props: {
    job: {},
  },
  emits: ["edit-bl"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6-up" }, _attrs))}><div class="flex justify-between items-center"><h2 class="text-lg font-semibold">Managed Bills of Lading</h2><button class="btn-primary text-sm" disabled>`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` New BL </button></div>`);
      if (__props.job.billsOfLading && __props.job.billsOfLading.length > 0) {
        _push(`<div class="grid gap-4"><!--[-->`);
        ssrRenderList(__props.job.billsOfLading, (bl) => {
          _push(
            `<div class="card-elevated p-0 overflow-hidden hover:shadow-lg transition-shadow group"><div class="p-5 flex items-start gap-4"><div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">`,
          );
          _push(ssrRenderComponent(unref(FileText), { class: "w-5 h-5" }, null, _parent));
          _push(
            `</div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><h3 class="font-semibold text-lg hover:text-primary cursor-pointer transition-colors">${ssrInterpolate(bl.blNumber)}</h3><span class="badge-secondary">${ssrInterpolate(bl.status?.name || "DRAFT")}</span></div><div class="flex gap-6 text-sm text-muted-foreground mb-3"><span class="flex items-center gap-1"><span class="font-medium text-foreground">Container:</span> ${ssrInterpolate(bl.containerNumber || "Pending")}</span><span class="flex items-center gap-1"><span class="font-medium text-foreground">Seal:</span> ${ssrInterpolate(bl.sealNumber || "-")}</span></div><div class="flex gap-2 text-xs text-muted-foreground mt-2"><div class="px-2 py-1 bg-muted rounded border border-border"> Shipper: ${ssrInterpolate(bl.blParties?.find((p) => p.partyRoleCode === "SHIPPER")?.companyName || "Not Set")}</div><div class="px-2 py-1 bg-muted rounded border border-border"> Consignee: ${ssrInterpolate(bl.blParties?.find((p) => p.partyRoleCode === "CONSIGNEE")?.companyName || "Not Set")}</div></div></div><div class="flex flex-col gap-2"><button class="btn-outline text-xs w-full">`,
          );
          _push(ssrRenderComponent(unref(Edit), { class: "w-3.5 h-3.5 mr-2" }, null, _parent));
          _push(` Edit Details </button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(
          `<div class="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">`,
        );
        _push(
          ssrRenderComponent(
            unref(FileText),
            { class: "w-12 h-12 mx-auto mb-3 opacity-20" },
            null,
            _parent,
          ),
        );
        _push(` No Bills of Lading found. </div>`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/components/JobBlTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=JobBlTab-CuDR5bCH.mjs.map
