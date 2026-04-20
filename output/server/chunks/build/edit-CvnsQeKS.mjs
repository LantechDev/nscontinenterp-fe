import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  unref,
  withCtx,
  createVNode,
  createTextVNode,
  useSSRContext,
} from "vue";
import {
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
} from "vue/server-renderer";
import { ArrowLeft, Trash2, Loader2, Save, AlertTriangle } from "lucide-vue-next";
import { z } from "zod";
import { e as useRoute, a as useRouter, g as useAuth, f as useRoles } from "./server.mjs";
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const userId = route.params.id;
    useAuth();
    const { roles } = useRoles();
    const isLoading = ref(false);
    const isFetching = ref(true);
    const fetchError = ref("");
    z.object({
      name: z.string().min(1, "Nama wajib diisi"),
      email: z.string().email("Format email tidak valid"),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
      role: z.string().min(1, "Role wajib dipilih"),
      status: z.enum(["active", "inactive"]).default("active"),
    }).refine(
      (data) => {
        if (data.password && data.password !== data.confirmPassword) {
          return false;
        }
        return true;
      },
      {
        message: "Password dan Konfirmasi Password tidak cocok",
        path: ["confirmPassword"],
      },
    );
    const form = ref({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      status: "active",
    });
    const errors = ref({});
    const showDeleteConfirm = ref(false);
    const isDeleting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<!--[--><div class="space-y-6 animate-fade-in p-6"><div class="page-header"><div class="flex items-center gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: `/settings/users/${unref(userId)}`,
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
        `<div><h1 class="page-title">Edit User</h1><p class="text-muted-foreground mt-1">Edit informasi user</p></div></div><button type="button" class="btn-destructive">`,
      );
      _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(` Hapus User </button></div>`);
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
        _push(`<p class="mt-2 text-muted-foreground">Loading user data...</p></div>`);
      } else {
        _push(`<div>`);
        if (unref(fetchError)) {
          _push(
            `<div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200"><p class="font-medium">Error:</p><p>${ssrInterpolate(unref(fetchError))}</p><button class="text-sm underline mt-2">Coba lagi/Refresh</button></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `<form class="card-elevated p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nama</label><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Nama lengkap" class="${ssrRenderClass([{ "border-red-500": unref(errors).name }, "input-field"])}">`,
        );
        if (unref(errors).name) {
          _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="space-y-2"><label class="text-sm font-medium">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="email@example.com" class="${ssrRenderClass([{ "border-red-500": unref(errors).email }, "input-field"])}">`,
        );
        if (unref(errors).email) {
          _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).email)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="col-span-1 md:col-span-2 border-t pt-4 mt-2"><p class="text-sm font-medium mb-4 text-muted-foreground">Ubah Password (Optional)</p><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Password Baru</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="Biarkan kosong jika tidak diubah" class="${ssrRenderClass([{ "border-red-500": unref(errors).password }, "input-field"])}">`,
        );
        if (unref(errors).password) {
          _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).password)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="space-y-2"><label class="text-sm font-medium">Konfirmasi Password</label><input${ssrRenderAttr("value", unref(form).confirmPassword)} type="password" placeholder="Ulangi password baru" class="${ssrRenderClass([{ "border-red-500": unref(errors).confirmPassword }, "input-field"])}">`,
        );
        if (unref(errors).confirmPassword) {
          _push(
            `<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).confirmPassword)}</p>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div></div></div><div class="space-y-2"><label class="text-sm font-medium">Role</label><select class="${ssrRenderClass([{ "border-red-500": unref(errors).role }, "input-field"])}"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "") : ssrLooseEqual(unref(form).role, "")) ? " selected" : ""}>Pilih role</option><!--[-->`,
        );
        ssrRenderList(unref(roles), (role) => {
          _push(
            `<option${ssrRenderAttr("value", role.code)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, role.code) : ssrLooseEqual(unref(form).role, role.code)) ? " selected" : ""}>${ssrInterpolate(role.name)}</option>`,
          );
        });
        _push(`<!--]--></select>`);
        if (unref(errors).role) {
          _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).role)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="space-y-2"><label class="text-sm font-medium">Status</label><select class="input-field"><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>Aktif</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>Tidak Aktif</option></select></div></div><div class="flex justify-end items-center gap-6 pt-4 border-t border-border">`,
        );
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: `/settings/users/${unref(userId)}`,
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
        _push(` Simpan Perubahan </button></div></form></div>`);
      }
      _push(`</div>`);
      if (unref(showDeleteConfirm)) {
        _push(
          `<div class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 animate-fade-in"><div class="bg-background rounded-lg shadow-lg max-w-md w-full p-6 mx-4"><div class="flex items-center gap-3 text-red-600 mb-4"><div class="p-2 bg-red-100 rounded-full">`,
        );
        _push(ssrRenderComponent(unref(AlertTriangle), { class: "w-6 h-6" }, null, _parent));
        _push(
          `</div><h3 class="text-lg font-semibold">Hapus User?</h3></div><p class="text-muted-foreground mb-6"> Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan. </p><div class="flex justify-end gap-3"><button type="button" class="btn-secondary"${ssrIncludeBooleanAttr(unref(isDeleting)) ? " disabled" : ""}> Batal </button><button type="button" class="btn-destructive"${ssrIncludeBooleanAttr(unref(isDeleting)) ? " disabled" : ""}>`,
        );
        if (unref(isDeleting)) {
          _push(
            ssrRenderComponent(
              unref(Loader2),
              { class: "w-4 h-4 mr-2 animate-spin" },
              null,
              _parent,
            ),
          );
        } else {
          _push(`<span>Ya, Hapus</span>`);
        }
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/users/[id]/edit.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-CvnsQeKS.mjs.map
