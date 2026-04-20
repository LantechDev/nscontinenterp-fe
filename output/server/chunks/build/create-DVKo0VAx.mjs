import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  mergeProps,
  withCtx,
  unref,
  createVNode,
  createTextVNode,
  useSSRContext,
} from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { ArrowLeft, Save } from "lucide-vue-next";
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
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
        `<div><h1 class="page-title">Buat eBL</h1><p class="text-muted-foreground mt-1">Buat Electronic Bill of Lading</p></div></div></div><form class="card-elevated p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">No. Job</label><select class="input-field"><option value="">Pilih job</option><option value="1">JOB-2024-001234</option><option value="2">JOB-2024-001233</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Shipper</label><input type="text" placeholder="Nama shipper" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Consignee</label><input type="text" placeholder="Nama consignee" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Notify Party</label><input type="text" placeholder="Notify party" class="input-field"></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Deskripsi Barang</label><textarea rows="3" placeholder="Description of goods..." class="input-field"></textarea></div><div class="space-y-2"><label class="text-sm font-medium">Gross Weight (KGS)</label><input type="number" placeholder="0" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Measurement (CBM)</label><input type="number" placeholder="0" class="input-field"></div></div><div class="flex justify-end gap-3 pt-4 border-t border-border">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/ebl",
            class: "btn-secondary",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Batal`);
              } else {
                return [createTextVNode("Batal")];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`<button type="submit" class="btn-primary">`);
      _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Simpan </button></div></form></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/ebl/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DVKo0VAx.mjs.map
