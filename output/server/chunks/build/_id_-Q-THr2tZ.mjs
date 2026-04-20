import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ArrowLeft, Download, Trash2, Edit, Calculator } from "lucide-vue-next";
import { u as useFinanceTax } from "./useFinanceTax-DZl3TxF7.mjs";
import { c as cn } from "./utils-C_kyg7_s.mjs";
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
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const { isLoading } = useFinanceTax();
    const tax = ref(null);
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}>`,
      );
      if (unref(isLoading) && !unref(tax)) {
        _push(
          `<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`,
        );
      } else if (unref(tax)) {
        _push(
          `<!--[--><div class="page-header"><div class="flex items-center justify-between"><div class="flex items-center gap-4">`,
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
          `<div><h1 class="text-2xl font-bold">${ssrInterpolate(unref(tax).name)}</h1><p class="text-muted-foreground mt-1">Detail catatan pajak</p></div></div><div class="flex items-center gap-2"><button class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium">`,
        );
        _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span>Export PDF</span></button><button class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">`,
        );
        _push(ssrRenderComponent(unref(Trash2), { class: "w-5 h-5" }, null, _parent));
        _push(`</button>`);
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: `/finance/tax/edit/${unref(tax).id}`,
              class:
                "flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    ssrRenderComponent(unref(Edit), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                  );
                  _push2(`<span${_scopeId}>Edit</span>`);
                } else {
                  return [
                    createVNode(unref(Edit), { class: "w-4 h-4" }),
                    createVNode("span", null, "Edit"),
                  ];
                }
              }),
              _: 1,
            },
            _parent,
          ),
        );
        _push(
          `</div></div></div><div class="bg-white p-8 rounded-xl border border-border shadow-sm"><div class="flex items-center gap-6 mb-8 pb-8 border-b border-border"><div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">`,
        );
        _push(
          ssrRenderComponent(unref(Calculator), { class: "w-8 h-8 text-[#012D5A]" }, null, _parent),
        );
        _push(
          `</div><div><h2 class="text-2xl font-bold">${ssrInterpolate(unref(tax).name)}</h2><p class="text-muted-foreground font-medium uppercase">${ssrInterpolate(unref(tax).type)}</p></div><div class="ml-auto text-right"><p class="text-sm text-muted-foreground mb-1">Rate</p><p class="text-3xl font-black text-[#012D5A]">${ssrInterpolate(unref(tax).rate)}%</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Tipe Pajak</p><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase bg-muted text-muted-foreground border">${ssrInterpolate(unref(tax).type)}</span></div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Rate</p><p class="font-bold text-lg">${ssrInterpolate(unref(tax).rate)}%</p></div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Status</p><span class="${ssrRenderClass(
            unref(cn)(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              unref(tax).isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200",
            ),
          )}">${ssrInterpolate(unref(tax).isActive ? "Aktif" : "Nonaktif")}</span></div><div class="space-y-1.5"><p class="text-sm text-muted-foreground">Tanggal Dibuat</p><p class="font-bold">${ssrInterpolate(formatDate(unref(tax).createdAt))}</p></div><div class="space-y-1.5 md:col-span-2 lg:col-span-2 pt-4 border-t"><p class="text-sm text-muted-foreground">Deskripsi</p><p class="text-sm text-foreground italic">${ssrInterpolate(unref(tax).description || "-")}</p></div></div></div><!--]-->`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/tax/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Q-THr2tZ.mjs.map
