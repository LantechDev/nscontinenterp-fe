import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  mergeProps,
  withCtx,
  unref,
  createVNode,
  createTextVNode,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ArrowLeft, Edit, User, Shield } from "lucide-vue-next";
import { e as useRoute, g as useAuth } from "./server.mjs";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const userId = route.params.id;
    useAuth();
    const user = ref(null);
    const isLoading = ref(true);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div class="flex items-center gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/settings/users",
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
        `<div><h1 class="page-title">${ssrInterpolate(unref(user)?.name || "Loading...")}</h1><p class="text-muted-foreground mt-1">Detail user</p></div></div>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: `/settings/users/${unref(userId)}/edit`,
            class: [
              "btn-primary",
              { "opacity-50 pointer-events-none": unref(isLoading) || !unref(user) },
            ],
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    unref(Edit),
                    { class: "w-4 h-4 mr-2" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(` Edit `);
              } else {
                return [
                  createVNode(unref(Edit), { class: "w-4 h-4 mr-2" }),
                  createTextVNode(" Edit "),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
      if (unref(isLoading)) {
        _push(`<div class="p-8 text-center text-muted-foreground">Loading...</div>`);
      } else if (unref(errorMessage)) {
        _push(
          `<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">${ssrInterpolate(unref(errorMessage))}</div>`,
        );
      } else if (unref(user)) {
        _push(
          `<div class="card-elevated p-6"><div class="flex items-center gap-4 mb-6 pb-6 border-b border-border"><div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">`,
        );
        _push(ssrRenderComponent(unref(User), { class: "w-7 h-7 text-primary" }, null, _parent));
        _push(
          `</div><div><h2 class="text-xl font-semibold">${ssrInterpolate(unref(user).name)}</h2><p class="text-muted-foreground">${ssrInterpolate(unref(user).email)}</p></div><span class="${ssrRenderClass(
            [
              "ml-auto px-2 py-0.5 rounded border text-xs font-medium bg-white",
              unref(user).status === "active"
                ? "text-blue-500 border-blue-200"
                : "text-red-500 border-red-200",
            ],
          )}">${ssrInterpolate(unref(user).status === "active" ? "Active" : "Inactive")}</span></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"><div class="space-y-1"><p class="text-sm text-muted-foreground">Role</p><p class="font-medium flex items-center gap-2 text-primary">`,
        );
        _push(ssrRenderComponent(unref(Shield), { class: "w-4 h-4" }, null, _parent));
        _push(
          ` ${ssrInterpolate(unref(user).role)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Login Terakhir</p><p class="font-medium">${ssrInterpolate(unref(user).lastLogin)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Tanggal Dibuat</p><p class="font-medium">${ssrInterpolate(unref(user).createdAt)}</p></div></div></div>`,
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
    "pages/settings/users/[id]/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CUL_A4PR.mjs.map
