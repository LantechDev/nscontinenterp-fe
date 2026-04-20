import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
} from "vue/server-renderer";
import { ArrowLeft, Save } from "lucide-vue-next";
import { u as useFinanceTax } from "./useFinanceTax-DZl3TxF7.mjs";
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
    const { isLoading } = useFinanceTax();
    const form = ref({
      name: "",
      rate: 0,
      type: "",
      description: "",
      isActive: true,
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div class="flex items-center gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/tax",
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
        `<div><h1 class="text-2xl font-bold">Catat Pajak</h1><p class="text-muted-foreground mt-1">Tambah catatan pajak baru</p></div></div></div><div class="max-w-3xl"><form class="space-y-6 bg-white p-8 rounded-xl border border-border"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nama Pajak</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="Contoh: PPN 11%"></div><div class="space-y-2"><label class="text-sm font-medium">Tipe Pajak</label><select required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "") : ssrLooseEqual(unref(form).type, "")) ? " selected" : ""}>Pilih tipe pajak</option><option value="ppn"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "ppn") : ssrLooseEqual(unref(form).type, "ppn")) ? " selected" : ""}>PPN</option><option value="pph"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "pph") : ssrLooseEqual(unref(form).type, "pph")) ? " selected" : ""}>PPh</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Rate (%)</label><input${ssrRenderAttr("value", unref(form).rate)} type="number" step="0.01" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="0"></div><div class="space-y-2"><label class="text-sm font-medium">Status</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"><option${ssrRenderAttr("value", true)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).isActive) ? ssrLooseContain(unref(form).isActive, true) : ssrLooseEqual(unref(form).isActive, true)) ? " selected" : ""}>Aktif</option><option${ssrRenderAttr("value", false)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).isActive) ? ssrLooseContain(unref(form).isActive, false) : ssrLooseEqual(unref(form).isActive, false)) ? " selected" : ""}>Nonaktif</option></select></div></div><div class="space-y-2"><label class="text-sm font-medium">Deskripsi</label><textarea rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Catatan tambahan...">${ssrInterpolate(unref(form).description)}</textarea></div><div class="flex justify-end gap-3 pt-4 border-t border-border"><button type="button" class="px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2">`,
      );
      if (!unref(isLoading)) {
        _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isLoading)) {
        _push(`<span>Menyimpan...</span>`);
      } else {
        _push(`<span>Simpan</span>`);
      }
      _push(`</button></div></form></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/tax/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BKL4ukAW.mjs.map
