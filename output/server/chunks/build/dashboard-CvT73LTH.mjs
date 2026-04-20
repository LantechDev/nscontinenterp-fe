import { _ as __nuxt_component_0$2 } from "./NuxtImg-DaZEoQQo.mjs";
import { _ as __nuxt_component_0$3 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  a as useRouter,
  e as useRoute,
  _ as __nuxt_component_1$1,
  i as __nuxt_component_2,
  g as useAuth,
  h as useRoleAccess,
} from "./server.mjs";
import {
  defineComponent,
  computed,
  ref,
  watch,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  createBlock,
  openBlock,
  toDisplayString,
  useSSRContext,
  createTextVNode,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderClass,
  ssrRenderList,
} from "vue/server-renderer";
import {
  Menu,
  Bell,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  Ship,
  Wallet,
  Settings,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import { _ as __nuxt_component_0$1 } from "./Modal-DzxIm9v2.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { t as toast } from "./index-DJGQOf1Z.mjs";
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
import "./composables-BvrNzaE9.mjs";
import "../routes/renderer.mjs";
import "vue-bundle-renderer/runtime";
import "unhead/server";
import "devalue";
import "unhead/utils";
import "vue-router";
import "clsx";
import "tailwind-merge";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Master Data",
    icon: Package,
    children: [
      { title: "Company", href: "/master/company" },
      { title: "Service", href: "/master/services" },
      { title: "Vessel", href: "/master/vessel" },
    ],
  },
  {
    title: "Operational",
    icon: Ship,
    children: [
      { title: "Job", href: "/operational/jobs" },
      { title: "eBL", href: "/operational/ebl" },
      { title: "Closing Job", href: "/operational/closing" },
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      { title: "Dashboard", href: "/finance/dashboard" },
      { title: "Invoice", href: "/finance/invoice" },
      { title: "Outstanding Report", href: "/finance/report/outstanding" },
      { title: "Biaya Operasional", href: "/finance/expenses" },
      { title: "Pajak", href: "/finance/tax" },
    ],
  },
  // Backlog for now - Rafael, 25/03/2026
  // {
  //   title: "Reports",
  //   icon: BarChart3,
  //   href: "/reports",
  // },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Users", href: "/settings/users" },
      { title: "Roles", href: "/settings/roles" },
      { title: "Activity Logs", href: "/settings/activity-logs" },
      { title: "Tenant", href: "/settings/tenant" },
    ],
  },
];
function useAppSidebar() {
  const { user, session, logout, listOrganizations, setActiveOrganization } = useAuth();
  const { canAccessPath } = useRoleAccess();
  const router = useRouter();
  const organizations = ref([]);
  const isOrgDropdownOpen = ref(false);
  const isUserDropdownOpen = ref(false);
  const expandedItems = ref(["Master Data", "Operational", "Finance"]);
  const route = useRoute();
  const currentOrg = computed(() => {
    if (!session.value?.activeOrganizationId) return null;
    return organizations.value.find((o) => o.id === session.value?.activeOrganizationId) || null;
  });
  const navItems = computed(() =>
    NAV_ITEMS.map((item) => {
      if (!item.children) {
        return canAccessPath(item.href || "") ? item : null;
      }
      const visibleChildren = item.children.filter((child) => canAccessPath(child.href));
      if (visibleChildren.length === 0) {
        return null;
      }
      return {
        ...item,
        children: visibleChildren,
      };
    }).filter((item) => item !== null),
  );
  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      await router.push("/login");
    }
  };
  const toggleOrgDropdown = async () => {
    if (!isOrgDropdownOpen.value) {
      if (organizations.value.length === 0) {
        const { success, data } = await listOrganizations();
        if (success && data) {
          organizations.value = data;
        }
      }
    }
    isOrgDropdownOpen.value = !isOrgDropdownOpen.value;
  };
  const handleOrgSwitch = async (orgId) => {
    isOrgDropdownOpen.value = false;
    await setActiveOrganization(orgId);
    await router.push("/dashboard");
  };
  const toggleExpand = (title) => {
    if (expandedItems.value.includes(title)) {
      expandedItems.value = expandedItems.value.filter((item) => item !== title);
    } else {
      expandedItems.value = [...expandedItems.value, title];
    }
  };
  const isActive = (href) => route.path === href;
  const isChildActive = (children) => children?.some((child) => route.path === child.href) ?? false;
  return {
    // State
    user,
    organizations,
    isOrgDropdownOpen,
    isUserDropdownOpen,
    expandedItems,
    // Computed
    currentOrg,
    navItems,
    // Methods
    handleLogout,
    toggleOrgDropdown,
    handleOrgSwitch,
    toggleExpand,
    isActive,
    isChildActive,
  };
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  props: {
    variant: { default: "desktop" },
    open: { type: Boolean, default: false },
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      organizations,
      isOrgDropdownOpen,
      expandedItems,
      currentOrg,
      isActive,
      isChildActive,
      navItems,
    } = useAppSidebar();
    const isMobile = computed(() => props.variant === "mobile");
    const handleClose = () => {
      if (isMobile.value) {
        emit("close");
      }
    };
    const sidebarClasses = computed(() =>
      cn(
        "fixed inset-y-0 left-0 bg-[#012D5A] text-white flex-col font-sans transition-transform duration-300 will-change-transform pb-[env(safe-area-inset-bottom)]",
        isMobile.value
          ? cn(
              "lg:hidden flex z-[1100] w-72 max-w-[90vw] shadow-2xl pt-[env(safe-area-inset-top)]",
              props.open ? "translate-x-0" : "-translate-x-full",
            )
          : "hidden lg:flex z-40 w-64 translate-x-0",
      ),
    );
    const overlayClasses = computed(() =>
      cn(
        "fixed inset-0 bg-black/40 transition-opacity duration-200 lg:hidden",
        props.open ? "opacity-100 z-[1090]" : "opacity-0 pointer-events-none",
      ),
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0$2;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_ClientOnly = __nuxt_component_1$1;
      _push(`<!--[-->`);
      if (unref(isMobile)) {
        _push(`<div class="${ssrRenderClass(unref(overlayClasses))}" data-v-fdb82488></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<aside class="${ssrRenderClass(unref(sidebarClasses))}" data-v-fdb82488><div class="px-4 py-4 mb-2" data-v-fdb82488>`,
      );
      if (unref(isMobile)) {
        _push(
          `<div class="flex items-center justify-between mb-3" data-v-fdb82488><p class="text-sm font-medium text-white/90" data-v-fdb82488>Menu</p><button type="button" class="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close menu" data-v-fdb82488>`,
        );
        _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<button class="flex items-center justify-between w-full px-3 py-2.5 bg-[#1e4a7a]/50 rounded-lg hover:bg-[#1e4a7a]/70 transition-colors border border-white/10" data-v-fdb82488><div class="flex items-center gap-3 min-w-0" data-v-fdb82488><div class="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden" data-v-fdb82488>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtImg,
          {
            src: "/images/logo2.png",
            alt: "NS Continent",
            class: "w-full h-full object-contain",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><span class="font-medium text-sm truncate" data-v-fdb82488>${ssrInterpolate(unref(currentOrg)?.name || "NS Continent")}</span></div><div class="flex flex-col gap-0.5" data-v-fdb82488>`,
      );
      _push(
        ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-white/70" }, null, _parent),
      );
      _push(`</div></button>`);
      if (unref(isOrgDropdownOpen)) {
        _push(
          `<div class="${ssrRenderClass([unref(isMobile) ? "z-[1120]" : "z-50", "absolute top-16 left-4 w-56 bg-white text-slate-900 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"])}" data-v-fdb82488><div class="py-1" data-v-fdb82488><!--[-->`,
        );
        ssrRenderList(unref(organizations), (org) => {
          _push(
            `<button class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors" data-v-fdb82488>${ssrInterpolate(org.name)}</button>`,
          );
        });
        _push(`<!--]-->`);
        if (unref(organizations).length === 0) {
          _push(
            `<div class="px-4 py-2 text-xs text-slate-500" data-v-fdb82488> No organizations </div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isOrgDropdownOpen)) {
        _push(
          `<div class="${ssrRenderClass([unref(isMobile) ? "z-[1110]" : "z-40", "fixed inset-0 bg-transparent"])}" data-v-fdb82488></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><nav class="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hidden" data-v-fdb82488>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/dashboard",
            class: unref(cn)(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              unref(isActive)("/dashboard")
                ? "bg-[#1e4a7a]/50 text-white"
                : "text-white/80 hover:bg-white/5 hover:text-white",
            ),
            onClick: handleClose,
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span data-v-fdb82488${_scopeId}>Dashboard</span>`);
              } else {
                return [createVNode("span", null, "Dashboard")];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`<!--[-->`);
      ssrRenderList(unref(navItems).slice(1), (item) => {
        _push(`<!--[-->`);
        if (item.children) {
          _push(
            `<div class="space-y-1" data-v-fdb82488><button class="${ssrRenderClass(
              unref(cn)(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                unref(isChildActive)(item.children) || unref(expandedItems).includes(item.title)
                  ? "text-white"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              ),
            )}" data-v-fdb82488><div class="flex items-center gap-3" data-v-fdb82488><span data-v-fdb82488>${ssrInterpolate(item.title)}</span></div>`,
          );
          _push(
            ssrRenderComponent(
              unref(ChevronDown),
              {
                class: [
                  "w-4 h-4 transition-transform duration-200",
                  unref(expandedItems).includes(item.title) ? "rotate-180" : "",
                ],
              },
              null,
              _parent,
            ),
          );
          _push(`</button>`);
          if (unref(expandedItems).includes(item.title)) {
            _push(`<div class="space-y-1 pl-3" data-v-fdb82488><!--[-->`);
            ssrRenderList(item.children, (child) => {
              _push(
                ssrRenderComponent(
                  _component_NuxtLink,
                  {
                    key: child.href,
                    to: child.href,
                    class: unref(cn)(
                      "block w-full text-left px-3 py-3 rounded-lg text-sm transition-colors mb-1 last:mb-0",
                      unref(isActive)(child.href)
                        ? "bg-[#1e4a7a] text-white font-medium"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    ),
                    onClick: handleClose,
                  },
                  {
                    default: withCtx((_, _push2, _parent2, _scopeId) => {
                      if (_push2) {
                        _push2(`${ssrInterpolate(child.title)}`);
                      } else {
                        return [createTextVNode(toDisplayString(child.title), 1)];
                      }
                    }),
                    _: 2,
                  },
                  _parent,
                ),
              );
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: item.href,
                class: unref(cn)(
                  "flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  unref(isActive)(item.href)
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white",
                ),
                onClick: handleClose,
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(
                      `<div class="flex items-center gap-3" data-v-fdb82488${_scopeId}><span data-v-fdb82488${_scopeId}>${ssrInterpolate(item.title)}</span></div>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        unref(ChevronRight),
                        { class: "w-4 h-4 text-white/50" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("span", null, toDisplayString(item.title), 1),
                      ]),
                      createVNode(unref(ChevronRight), { class: "w-4 h-4 text-white/50" }),
                    ];
                  }
                }),
                _: 2,
              },
              _parent,
            ),
          );
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav><div class="p-4 mt-auto relative" data-v-fdb82488>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></aside><!--]-->`);
    };
  },
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/layout/AppSidebar.vue",
  );
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(
  _export_sfc(_sfc_main$3, [["__scopeId", "data-v-fdb82488"]]),
  { __name: "LayoutAppSidebar" },
);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  setup(__props) {
    const { state, handleConfirm, handleCancel } = useConfirm();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0$1;
      _push(
        ssrRenderComponent(
          _component_UiModal,
          mergeProps(
            {
              "model-value": unref(state).isOpen,
              "onUpdate:modelValue": (val) => !val && unref(handleCancel)(),
              width: "max-w-md",
            },
            _attrs,
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="p-4"${_scopeId}><div class="flex flex-col items-center text-center gap-4 py-4"${_scopeId}>`,
                );
                if (unref(state).options.type === "danger") {
                  _push2(
                    `<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(AlertTriangle),
                      { class: "w-6 h-6" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</div>`);
                } else {
                  _push2(
                    `<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(unref(Info), { class: "w-6 h-6" }, null, _parent2, _scopeId),
                  );
                  _push2(`</div>`);
                }
                _push2(
                  `<div class="space-y-2"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>${ssrInterpolate(unref(state).title)}</h3><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(unref(state).message)}</p></div></div><div class="flex items-center gap-3 mt-6"${_scopeId}><button type="button" class="btn-secondary flex-1 justify-center"${_scopeId}>${ssrInterpolate(unref(state).options.cancelText || "Cancel")}</button><button type="button" class="${ssrRenderClass(
                    [
                      "btn-primary flex-1 justify-center",
                      unref(state).options.type === "danger"
                        ? "bg-red-600 hover:bg-red-700 border-red-600"
                        : "",
                    ],
                  )}"${_scopeId}>${ssrInterpolate(unref(state).options.confirmText || "Confirm")}</button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "p-4" }, [
                    createVNode(
                      "div",
                      { class: "flex flex-col items-center text-center gap-4 py-4" },
                      [
                        unref(state).options.type === "danger"
                          ? (openBlock(),
                            createBlock(
                              "div",
                              {
                                key: 0,
                                class:
                                  "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600",
                              },
                              [createVNode(unref(AlertTriangle), { class: "w-6 h-6" })],
                            ))
                          : (openBlock(),
                            createBlock(
                              "div",
                              {
                                key: 1,
                                class:
                                  "w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600",
                              },
                              [createVNode(unref(Info), { class: "w-6 h-6" })],
                            )),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "h3",
                            { class: "text-lg font-semibold" },
                            toDisplayString(unref(state).title),
                            1,
                          ),
                          createVNode(
                            "p",
                            { class: "text-sm text-muted-foreground" },
                            toDisplayString(unref(state).message),
                            1,
                          ),
                        ]),
                      ],
                    ),
                    createVNode("div", { class: "flex items-center gap-3 mt-6" }, [
                      createVNode(
                        "button",
                        {
                          type: "button",
                          class: "btn-secondary flex-1 justify-center",
                          onClick: unref(handleCancel),
                        },
                        toDisplayString(unref(state).options.cancelText || "Cancel"),
                        9,
                        ["onClick"],
                      ),
                      createVNode(
                        "button",
                        {
                          type: "button",
                          class: [
                            "btn-primary flex-1 justify-center",
                            unref(state).options.type === "danger"
                              ? "bg-red-600 hover:bg-red-700 border-red-600"
                              : "",
                          ],
                          onClick: unref(handleConfirm),
                        },
                        toDisplayString(unref(state).options.confirmText || "Confirm"),
                        11,
                        ["onClick"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
    };
  },
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/ConfirmDialog.vue",
  );
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$2, { __name: "UiConfirmDialog" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PwaUpdate",
  __ssrInlineRender: true,
  setup(__props) {
    const needRefresh = ref(false);
    const hasShownUpdateToast = ref(false);
    const showUpdateToast = () => {
      if (hasShownUpdateToast.value) return;
      hasShownUpdateToast.value = true;
      toast("Versi baru tersedia", {
        description: "Klik reload untuk memperbarui aplikasi.",
        duration: Infinity,
        action: {
          label: "Reload",
          onClick: () => {},
        },
      });
    };
    watch(needRefresh, (value) => {
      if (value) showUpdateToast();
    });
    return (_ctx, _push, _parent, _attrs) => {
      {
        _push(`<!---->`);
      }
    };
  },
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/pwa/PwaUpdate.vue",
  );
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "PwaUpdate" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const route = useRoute();
    const showHeader = computed(() => route.meta.hideHeader !== true);
    const isMobileSidebarOpen = ref(false);
    const currentDate = ref("");
    const currentTime = ref("");
    ref("");
    ref([]);
    ref(false);
    ref(false);
    ref(null);
    ref(null);
    const closeMobileSidebar = () => {
      isMobileSidebarOpen.value = false;
    };
    watch(
      () => route.fullPath,
      () => {
        closeMobileSidebar();
      },
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutAppSidebar = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1$1;
      const _component_NuxtPage = __nuxt_component_2;
      const _component_UiConfirmDialog = __nuxt_component_3;
      const _component_PwaUpdate = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_LayoutAppSidebar, null, null, _parent));
      _push(
        ssrRenderComponent(
          _component_LayoutAppSidebar,
          {
            variant: "mobile",
            open: unref(isMobileSidebarOpen),
            onClose: closeMobileSidebar,
          },
          null,
          _parent,
        ),
      );
      _push(`<div class="lg:ml-64">`);
      if (unref(showHeader)) {
        _push(
          `<header class="sticky top-0 z-[1000] h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between gap-3 px-4 sm:px-6"><div class="flex items-center gap-3 flex-1 min-w-0"><button type="button" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Open menu">`,
        );
        _push(ssrRenderComponent(unref(Menu), { class: "w-5 h-5 text-gray-600" }, null, _parent));
        _push(`</button>`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(
          `</div><div class="flex items-center gap-3 sm:gap-4 shrink-0"><button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">`,
        );
        _push(ssrRenderComponent(unref(Bell), { class: "w-5 h-5 text-gray-500" }, null, _parent));
        _push(
          `<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button><div class="hidden sm:block text-right"><p class="text-sm font-medium text-gray-900">${ssrInterpolate(unref(currentDate))}</p><p class="text-xs text-gray-500">${ssrInterpolate(unref(currentTime))}</p></div></div></header>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<main class="px-4 py-4 sm:px-6 sm:py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:pb-6">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtPage,
          {
            key: _ctx.$route.fullPath,
          },
          null,
          _parent,
        ),
      );
      _push(`</main></div>`);
      _push(ssrRenderComponent(_component_UiConfirmDialog, null, null, _parent));
      _push(ssrRenderComponent(_component_PwaUpdate, null, null, _parent));
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "layouts/dashboard.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-CvT73LTH.mjs.map
