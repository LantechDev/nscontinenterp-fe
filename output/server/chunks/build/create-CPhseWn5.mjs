import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_0$1 } from "./Checkbox-BPDemuax.mjs";
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
  ssrRenderList,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { ArrowLeft, Loader2, Save } from "lucide-vue-next";
import { z } from "zod";
import { a as useRouter, f as useRoles } from "./server.mjs";
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
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoles();
    const isLoading = ref(false);
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
    const hasPermission = (resource, action) => {
      return form.value.permissions[resource]?.includes(action) || false;
    };
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
    const isAllSelected = (resource) => {
      const current = form.value.permissions[resource];
      return current && current.length === availableActions.length;
    };
    const toggleAll = (resource) => {
      if (isAllSelected(resource)) {
        form.value.permissions[resource] = [];
      } else {
        form.value.permissions[resource] = [...availableActions];
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiCheckbox = __nuxt_component_0$1;
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
        `<div><h1 class="page-title">Tambah Role</h1><p class="text-muted-foreground mt-1">Buat role baru dengan permission khusus</p></div></div></div>`,
      );
      if (unref(errors).root) {
        _push(
          `<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">${ssrInterpolate(unref(errors).root)}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
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
        `</div><div class="col-span-1 md:col-span-2 space-y-2"><label class="text-sm font-medium">Deskripsi</label><textarea rows="2" placeholder="Deskripsi singkat tentang role ini..." class="input-field">${ssrInterpolate(unref(form).description)}</textarea></div><div class="col-span-1 md:col-span-2 pt-4 border-t border-border"><div class="flex items-center justify-between mb-4"><label class="text-sm font-medium">Permissions</label></div><div class="border border-border rounded-lg overflow-hidden bg-white"><table class="w-full text-sm"><thead class="bg-gray-50 border-b border-border"><tr><th class="text-left py-3 px-4 font-medium text-muted-foreground w-1/3"> Resource </th><!--[-->`,
      );
      ssrRenderList(availableActions, (action) => {
        _push(
          `<th class="text-center py-3 px-4 font-medium text-muted-foreground capitalize">${ssrInterpolate(action)}</th>`,
        );
      });
      _push(
        `<!--]--><th class="text-center py-3 px-4 font-medium text-muted-foreground">All</th></tr></thead><tbody><!--[-->`,
      );
      ssrRenderList(availableResources, (resource, index) => {
        _push(
          `<tr class="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"><td class="py-3 px-4"><div class="font-medium text-foreground">${ssrInterpolate(resource.label)}</div><div class="text-xs text-muted-foreground">${ssrInterpolate(resource.description)}</div></td><!--[-->`,
        );
        ssrRenderList(availableActions, (action) => {
          _push(`<td class="text-center py-3 px-4"><div class="flex justify-center">`);
          _push(
            ssrRenderComponent(
              _component_UiCheckbox,
              {
                "model-value": hasPermission(resource.key, action),
                "onUpdate:modelValue": ($event) => togglePermission(resource.key, action),
              },
              null,
              _parent,
            ),
          );
          _push(`</div></td>`);
        });
        _push(`<!--]--><td class="text-center py-3 px-4"><div class="flex justify-center">`);
        _push(
          ssrRenderComponent(
            _component_UiCheckbox,
            {
              "model-value": isAllSelected(resource.key),
              "onUpdate:modelValue": ($event) => toggleAll(resource.key),
            },
            null,
            _parent,
          ),
        );
        _push(`</div></td></tr>`);
      });
      _push(
        `<!--]--></tbody></table></div><p class="text-xs text-muted-foreground mt-2"> Configure what this role can do for each resource in the system. </p></div></div><div class="flex justify-end items-center gap-6 pt-4 border-t border-border">`,
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
          ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent),
        );
      } else {
        _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
      }
      _push(` Simpan Role </button></div></form></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/roles/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-CPhseWn5.mjs.map
