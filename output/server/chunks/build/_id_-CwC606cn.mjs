import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderList,
} from "vue/server-renderer";
import { ArrowLeft, Send, Edit, FileText } from "lucide-vue-next";
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
    const quotation = {
      number: "QUO-2024-001",
      customer: "PT Maju Bersama",
      date: "7 Jan 2025",
      validUntil: "7 Feb 2025",
      origin: "Jakarta",
      destination: "Singapore",
      amount: "Rp 25.500.000",
      services: [
        { name: "Ocean Freight - FCL 20ft", price: "Rp 18.000.000" },
        { name: "Trucking Origin", price: "Rp 3.500.000" },
        { name: "Documentation", price: "Rp 2.500.000" },
        { name: "THC Origin", price: "Rp 1.500.000" },
      ],
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
            to: "/sales/quotation",
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
        `<div><h1 class="page-title">${ssrInterpolate(quotation.number)}</h1><p class="text-muted-foreground mt-1">Detail penawaran</p></div></div><div class="flex gap-2"><button class="btn-secondary">`,
      );
      _push(ssrRenderComponent(unref(Send), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Kirim </button><button class="btn-secondary">`);
      _push(ssrRenderComponent(unref(Edit), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Edit </button></div></div><div class="card-elevated p-6"><div class="flex items-center gap-4 mb-6 pb-6 border-b border-border"><div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">`,
      );
      _push(ssrRenderComponent(unref(FileText), { class: "w-7 h-7 text-primary" }, null, _parent));
      _push(
        `</div><div><h2 class="text-xl font-semibold">${ssrInterpolate(quotation.number)}</h2><p class="text-muted-foreground">${ssrInterpolate(quotation.customer)}</p></div><span class="ml-auto badge-warning">Terkirim</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><div class="space-y-1"><p class="text-sm text-muted-foreground">Tanggal</p><p class="font-medium">${ssrInterpolate(quotation.date)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Berlaku Hingga</p><p class="font-medium">${ssrInterpolate(quotation.validUntil)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Rute</p><p class="font-medium">${ssrInterpolate(quotation.origin)} → ${ssrInterpolate(quotation.destination)}</p></div></div><div class="border-t border-border pt-6"><h3 class="font-semibold mb-4">Detail Jasa</h3><div class="space-y-2"><!--[-->`,
      );
      ssrRenderList(quotation.services, (service, index) => {
        _push(
          `<div class="flex justify-between py-2 border-b border-border last:border-0"><span>${ssrInterpolate(service.name)}</span><span class="font-medium">${ssrInterpolate(service.price)}</span></div>`,
        );
      });
      _push(
        `<!--]--><div class="flex justify-between py-3 font-semibold text-lg"><span>Total</span><span class="text-primary">${ssrInterpolate(quotation.amount)}</span></div></div></div></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/sales/quotation/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CwC606cn.mjs.map
