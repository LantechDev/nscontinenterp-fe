import { _ as __nuxt_component_0 } from "./NuxtImg-DaZEoQQo.mjs";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-c0iC1rLL.mjs";
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { u as useHead } from "./composables-BvrNzaE9.mjs";
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
import "../routes/renderer.mjs";
import "vue-bundle-renderer/runtime";
import "unhead/server";
import "devalue";
import "unhead/utils";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "offline",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Offline - NS Continent ERP",
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background flex items-center justify-center p-6" }, _attrs))}><div class="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm"><div class="flex items-center gap-3"><div class="h-10 w-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtImg,
          {
            src: "/pwa/icon-192x192.png",
            alt: "App icon",
            class: "h-6 w-6",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div><h1 class="text-lg font-semibold text-foreground">Kamu sedang offline</h1><p class="text-sm text-muted-foreground">Periksa koneksi internet lalu coba lagi.</p></div></div><div class="mt-6 flex flex-col gap-3"><button type="button" class="btn-primary h-11 w-full"> Muat ulang </button>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/login",
            class: "w-full text-center text-sm text-accent hover:text-accent/80",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Kembali ke Login `);
              } else {
                return [createTextVNode(" Kembali ke Login ")];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/offline.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=offline-CRLtIZ8p.mjs.map
