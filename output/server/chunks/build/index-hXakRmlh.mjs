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
  ssrRenderComponent,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { Search, ChevronDown, Plus, Edit } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { g as useAuth, f as useRoles } from "./server.mjs";
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
    const { fetchUsers } = useAuth();
    const { roles } = useRoles();
    const users = ref([]);
    const isLoading = ref(true);
    const searchQuery = ref("");
    const selectedRole = ref("");
    const filteredUsers = computed(() => {
      return users.value.filter((user) => {
        const matchesSearch =
          searchQuery.value === "" ||
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesRole = selectedRole.value === "" || user.role === selectedRole.value;
        return matchesSearch && matchesRole;
      });
    });
    const currentPage = ref(1);
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
    });
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchUsers();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiCheckbox = __nuxt_component_0$1;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">User &amp; Role</h1></div><div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
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
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search User..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><div class="relative"><select class="appearance-none flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground pr-8 cursor-pointer focus:outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedRole)) ? ssrLooseContain(unref(selectedRole), "") : ssrLooseEqual(unref(selectedRole), "")) ? " selected" : ""}>All Roles</option><!--[-->`,
      );
      ssrRenderList(unref(roles), (role) => {
        _push(
          `<option${ssrRenderAttr("value", role.code)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedRole)) ? ssrLooseContain(unref(selectedRole), role.code) : ssrLooseEqual(unref(selectedRole), role.code)) ? " selected" : ""}>${ssrInterpolate(role.name)}</option>`,
        );
      });
      _push(`<!--]--></select>`);
      _push(
        ssrRenderComponent(
          unref(ChevronDown),
          {
            class:
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
          },
          null,
          _parent,
        ),
      );
      _push(`</div>`);
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/settings/users/create",
            class: "btn-primary min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    unref(Plus),
                    { class: "w-4 h-4 mr-2" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(`<span${_scopeId}>New User</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4 mr-2" }),
                  createVNode("span", null, "New User"),
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
        `</th><th class="py-3 px-4 text-sm font-medium text-foreground">Name</th><th class="py-3 px-4 text-sm font-medium text-foreground">Email</th><th class="py-3 px-4 text-sm font-medium text-foreground">Role</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 text-sm font-medium text-foreground">Last Login</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody>`,
      );
      if (unref(isLoading)) {
        _push(
          `<tr><td colspan="7" class="text-center p-8 text-muted-foreground">Loading users...</td></tr>`,
        );
      } else if (unref(filteredUsers).length === 0) {
        _push(
          `<tr><td colspan="7" class="text-center p-8 text-muted-foreground">No users found.</td></tr>`,
        );
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(filteredUsers), (user) => {
          _push(
            `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4">`,
          );
          _push(ssrRenderComponent(_component_UiCheckbox, null, null, _parent));
          _push(
            `</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(user.name)}</td><td class="py-3 px-4 text-sm font-normal">${ssrInterpolate(user.email)}</td><td class="py-3 px-4"><span class="flex items-center gap-1 text-sm text-gray-700">${ssrInterpolate(user.role)}</span></td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                user.status === "active"
                  ? "text-blue-500 border-blue-200"
                  : "text-red-500 border-red-200",
              ),
            )}">${ssrInterpolate(user.status === "active" ? "Active" : "Inactive")}</span></td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(user.lastLogin)}</td><td class="py-3 px-4 text-right"><div class="flex items-center justify-end gap-2">`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: `/settings/users/${user.id}/edit`,
                class: "text-muted-foreground hover:text-foreground",
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
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(
        `</tbody></table></div></div><div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(filteredUsers).length)} data found.</p>`,
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
    "pages/settings/users/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-hXakRmlh.mjs.map
