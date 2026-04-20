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
  ssrRenderAttr,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { ArrowLeft, Loader2, Save } from "lucide-vue-next";
import { z } from "zod";
import { _ as _sfc_main$1 } from "./index-D-4-Nze-.mjs";
import { e as useRoute, a as useRouter, f as useRoles } from "./server.mjs";
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
import "./Checkbox-BPDemuax.mjs";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    route.params.id;
    useRoles();
    const isLoading = ref(false);
    const isFetching = ref(true);
    const fetchError = ref("");
    z.object({
      name: z.string().min(1, "Nama Role wajib diisi"),
      code: z
        .string()
        .min(1, "Kode Role wajib diisi")
        .regex(
          /^[A-Z0-9_]+$/,
          "Kode harus huruf besar, angka, dan underscore (contoh: ADMIN_USER)",
        ),
      description: z.string().optional(),
    });
    const form = ref({
      name: "",
      code: "",
      description: "",
      permissions: {},
    });
    const availableActions = ["create", "read", "update", "delete"];
    const availableResources = [
      { key: "organization", label: "Organization", description: "Manage company settings" },
      { key: "member", label: "Member", description: "Manage team members" },
      { key: "invitation", label: "Invitation", description: "Manage invites" },
      { key: "job", label: "Job", description: "Operational jobs" },
      { key: "invoice", label: "Invoice", description: "Financial invoices" },
      { key: "payment", label: "Payment", description: "Payment records" },
      { key: "company", label: "Company", description: "Master data companies" },
      { key: "report", label: "Report", description: "View analytical reports" },
    ];
    const errors = ref({});
    const togglePermission = (resource, action) => {
      if (!form.value.permissions[resource]) {
        form.value.permissions[resource] = [];
      }
      const actions = form.value.permissions[resource];
      if (actions.includes(action)) {
        form.value.permissions[resource] = actions.filter((a) => a !== action);
      } else {
        form.value.permissions[resource].push(action);
      }
    };
    const toggleAll = (resource) => {
      const isAll =
        form.value.permissions[resource] &&
        form.value.permissions[resource].length === availableActions.length;
      if (isAll) {
        form.value.permissions[resource] = [];
      } else {
        form.value.permissions[resource] = [...availableActions];
      }
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
            to: "/settings/roles",
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
        `<div><h1 class="page-title">Edit Role</h1><p class="text-muted-foreground mt-1">Update informasi dan permission role</p></div></div></div>`,
      );
      if (unref(isFetching)) {
        _push(`<div class="p-12 text-center">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-8 h-8 mx-auto animate-spin text-muted-foreground" },
            null,
            _parent,
          ),
        );
        _push(`<p class="mt-2 text-muted-foreground">Loading role data...</p></div>`);
      } else {
        _push(`<div>`);
        if (unref(fetchError)) {
          _push(
            `<div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200"><p class="font-medium">Error:</p><p>${ssrInterpolate(unref(fetchError))}</p>`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: "/settings/roles",
                class: "text-sm underline mt-2",
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`Kembali ke List Role`);
                  } else {
                    return [createTextVNode("Kembali ke List Role")];
                  }
                }),
                _: 1,
              },
              _parent,
            ),
          );
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errors).root) {
          _push(
            `<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 mb-6">${ssrInterpolate(unref(errors).root)}</div>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (!unref(fetchError)) {
          _push(
            `<form class="card-elevated p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nama Role <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Contoh: Administrator" class="${ssrRenderClass([{ "border-red-500": unref(errors).name }, "input-field"])}">`,
          );
          if (unref(errors).name) {
            _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).name)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div><div class="space-y-2"><label class="text-sm font-medium">Kode Role <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).code)} type="text" placeholder="Contoh: ADMIN" class="${ssrRenderClass([{ "border-red-500": unref(errors).code }, "input-field uppercase"])}"><p class="text-[10px] text-muted-foreground"> Hanya huruf besar, angka, dan underscore (UNIQUE). </p>`,
          );
          if (unref(errors).code) {
            _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).code)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div><div class="col-span-1 md:col-span-2 space-y-2"><label class="text-sm font-medium">Deskripsi</label><textarea rows="2" placeholder="Deskripsi singkat tentang role ini..." class="input-field">${ssrInterpolate(unref(form).description)}</textarea></div><div class="col-span-1 md:col-span-2 pt-4 border-t border-border"><div class="flex items-center justify-between mb-4"><label class="text-sm font-medium">Permissions</label></div>`,
          );
          _push(
            ssrRenderComponent(
              unref(_sfc_main$1),
              {
                permissions: unref(form).permissions,
                "available-actions": availableActions,
                "available-resources": availableResources,
                onToggle: togglePermission,
                onToggleAll: toggleAll,
              },
              null,
              _parent,
            ),
          );
          _push(
            `</div></div><div class="flex justify-end items-center gap-6 pt-4 border-t border-border">`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: "/settings/roles",
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
          _push(
            `<button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="btn-primary">`,
          );
          if (unref(isLoading)) {
            _push(
              ssrRenderComponent(
                unref(Loader2),
                { class: "w-4 h-4 mr-2 animate-spin" },
                null,
                _parent,
              ),
            );
          } else {
            _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
          }
          _push(` Simpan Perubahan </button></div></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/roles/[id]/edit.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-EmZUZqvn.mjs.map
