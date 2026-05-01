import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_0$1 } from "./Checkbox-BPDemuax.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import {
  defineComponent,
  ref,
  computed,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  isRef,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrRenderList,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { Search, Plus, Loader2, Shield, Edit, Trash2 } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { f as useRoles } from "./server.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { roles, fetchRoles, isLoading } = useRoles();
    useConfirm();
    const searchQuery = ref("");
    const isDeleting = ref(false);
    const errorRoot = ref("");
    const currentPage = ref(1);
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
    });
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchRoles();
    };
    const filteredRoles = computed(() => {
      if (!searchQuery.value) return roles.value;
      const lowerQuery = searchQuery.value.toLowerCase();
      return roles.value.filter(
        (role) =>
          role.name.toLowerCase().includes(lowerQuery) ||
          role.code.toLowerCase().includes(lowerQuery) ||
          (role.description && role.description.toLowerCase().includes(lowerQuery)),
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiCheckbox = __nuxt_component_0$1;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Role Management</h1></div>`,
      );
      if (unref(errorRoot)) {
        _push(
          `<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">${ssrInterpolate(unref(errorRoot))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
      );
      _push(
        ssrRenderComponent(
          unref(Search),
          { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search Role..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/settings/roles/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>New Role</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "New Role"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        `</div></div><div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 w-10">`,
      );
      _push(ssrRenderComponent(_component_UiCheckbox, { disabled: "" }, null, _parent));
      _push(
        `</th><th class="py-3 px-4 text-sm font-medium text-foreground">Name</th><th class="py-3 px-4 text-sm font-medium text-foreground">Code</th><th class="py-3 px-4 text-sm font-medium text-foreground">Description</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 w-28">Action</th></tr></thead><tbody>`,
      );
      if (unref(isLoading)) {
        _push(`<tr><td colspan="6" class="text-center p-8 text-muted-foreground">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-6 h-6 mx-auto animate-spin mb-2" },
            null,
            _parent,
          ),
        );
        _push(` Loading roles... </td></tr>`);
      } else if (unref(filteredRoles).length === 0) {
        _push(
          `<tr><td colspan="6" class="text-center p-8 text-muted-foreground">No roles found.</td></tr>`,
        );
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(filteredRoles), (role) => {
          _push(
            `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"><td class="py-3 px-4">`,
          );
          _push(ssrRenderComponent(_component_UiCheckbox, null, null, _parent));
          _push(
            `</td><td class="py-3 px-4 text-sm font-medium"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">`,
          );
          _push(ssrRenderComponent(unref(Shield), { class: "w-4 h-4 text-accent" }, null, _parent));
          _push(
            `</div><span>${ssrInterpolate(role.name)}</span></div></td><td class="py-3 px-4 text-sm font-mono text-muted-foreground">${ssrInterpolate(role.code)}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(role.description || "-")}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                role.isActive ? "text-blue-500 border-blue-200" : "text-gray-500 border-gray-200",
              ),
            )}">${ssrInterpolate(role.isActive ? "Active" : "Inactive")}</span></td><td class="py-3 px-4"><div class="flex items-center gap-2">`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: `/settings/roles/${role.id}/edit`,
                class: "text-muted-foreground hover:text-foreground",
                title: "Edit role",
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(
                      ssrRenderComponent(
                        unref(Edit),
                        { class: "w-4 h-4" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                  } else {
                    return [createVNode(unref(Edit), { class: "w-4 h-4" })];
                  }
                }),
                _: 2,
              },
              _parent,
            ),
          );
          _push(
            `<button${ssrIncludeBooleanAttr(unref(isDeleting)) ? " disabled" : ""} class="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50" title="Delete role">`,
          );
          if (unref(isDeleting)) {
            _push(
              ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent),
            );
          } else {
            _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
          }
          _push(`</button></div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(
        `</tbody></table></div></div><div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(filteredRoles).length)} data found.</p>`,
      );
      _push(
        ssrRenderComponent(
          _component_UiPagination,
          {
            page: unref(currentPage),
            "onUpdate:page": [
              ($event) => (isRef(currentPage) ? (currentPage.value = $event) : null),
              handlePageChange,
            ],
            total: unref(pagination).total,
            "items-per-page": unref(pagination).limit,
          },
          null,
          _parent,
        ),
      );
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/roles/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DWCiv0gC.mjs.map
