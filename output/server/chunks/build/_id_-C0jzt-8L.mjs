import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { ArrowLeft, Download, FileText } from "lucide-vue-next";
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
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const ebl = {
      number: "EBL-2024-001",
      job: "JOB-2024-001234",
      shipper: "PT Maju Bersama",
      consignee: "Singapore Trading Co",
      notifyParty: "Same as consignee",
      vessel: "MV Pacific Star",
      voyage: "PS-2024-01",
      portOfLoading: "Jakarta",
      portOfDischarge: "Singapore",
      description: "Electronic goods - 20 cartons",
      grossWeight: "2,500 KGS",
      measurement: "15 CBM",
      issuedDate: "8 Jan 2025",
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div class="flex items-center gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/ebl",
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
        `<div><h1 class="page-title">${ssrInterpolate(ebl.number)}</h1><p class="text-muted-foreground mt-1">Detail eBL</p></div></div><button class="btn-primary">`,
      );
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Download PDF </button></div><div class="card-elevated p-6"><div class="flex items-center gap-4 mb-6 pb-6 border-b border-border"><div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">`,
      );
      _push(ssrRenderComponent(unref(FileText), { class: "w-7 h-7 text-primary" }, null, _parent));
      _push(
        `</div><div><h2 class="text-xl font-semibold">${ssrInterpolate(ebl.number)}</h2><p class="text-muted-foreground">${ssrInterpolate(ebl.job)}</p></div><span class="ml-auto badge-success">Terbit</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-1"><p class="text-sm text-muted-foreground">Shipper</p><p class="font-medium">${ssrInterpolate(ebl.shipper)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Consignee</p><p class="font-medium">${ssrInterpolate(ebl.consignee)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Notify Party</p><p class="font-medium">${ssrInterpolate(ebl.notifyParty)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Vessel/Voyage</p><p class="font-medium">${ssrInterpolate(ebl.vessel)} / ${ssrInterpolate(ebl.voyage)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Port of Loading</p><p class="font-medium">${ssrInterpolate(ebl.portOfLoading)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Port of Discharge</p><p class="font-medium">${ssrInterpolate(ebl.portOfDischarge)}</p></div><div class="space-y-1 md:col-span-2"><p class="text-sm text-muted-foreground">Description of Goods</p><p class="font-medium">${ssrInterpolate(ebl.description)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Gross Weight</p><p class="font-medium">${ssrInterpolate(ebl.grossWeight)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Measurement</p><p class="font-medium">${ssrInterpolate(ebl.measurement)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Tanggal Terbit</p><p class="font-medium">${ssrInterpolate(ebl.issuedDate)}</p></div></div></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/ebl/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C0jzt-8L.mjs.map
