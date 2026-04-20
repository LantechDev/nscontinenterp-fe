import { _ as __nuxt_component_0 } from "./NuxtImg-DaZEoQQo.mjs";
import { defineComponent, ref, watchEffect, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { Building, MapPin, Phone, Mail, FileText, Loader2, Save } from "lucide-vue-next";
import { z } from "zod";
import { g as useAuth } from "./server.mjs";
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
import "./composables-BvrNzaE9.mjs";
import "../routes/renderer.mjs";
import "vue-bundle-renderer/runtime";
import "unhead/server";
import "devalue";
import "unhead/utils";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { session } = useAuth();
    useConfirm();
    const isLoading = ref(false);
    const errorRoot = ref("");
    const successMessage = ref("");
    const isEditing = ref(false);
    z.object({
      name: z.string().min(1, "Nama Tenant wajib diisi"),
      slug: z.string().min(1, "Slug wajib diisi"),
      logo: z.string().optional(),
      // Metadata fields
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
      taxId: z.string().optional(),
    });
    const form = ref({
      name: "",
      slug: "",
      logo: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    });
    const errors = ref({});
    const initData = async () => {
      if (form.value.name) return;
      isLoading.value = true;
      try {
        const { listOrganizations } = useAuth();
        const res = await listOrganizations();
        if (res.success && res.data) {
          const activeOrgId = session.value?.activeOrganizationId;
          const org = res.data.find((o) => o.id === activeOrgId);
          if (org) {
            form.value = {
              name: org.name,
              slug: org.slug,
              logo: org.logo || "",
              address: org.metadata?.address || "",
              phone: org.metadata?.phone || "",
              email: org.metadata?.email || "",
              taxId: org.metadata?.taxId || "",
            };
          }
        }
      } catch (e) {
        console.error("Failed to load organization data", e);
      } finally {
        isLoading.value = false;
      }
    };
    watchEffect(() => {
      if (session.value?.activeOrganizationId) {
        isEditing.value = true;
        initData();
      } else {
        isEditing.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Tenant Settings</h1><p class="text-muted-foreground mt-1"> Kelola informasi perusahaan dan profil organisasi Anda. </p></div></div>`,
      );
      if (unref(successMessage)) {
        _push(
          `<div class="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">${ssrInterpolate(unref(successMessage))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      if (unref(errorRoot)) {
        _push(
          `<div class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">${ssrInterpolate(unref(errorRoot))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<form class="space-y-8"><div class="card-elevated p-6"><div class="flex items-center gap-3 mb-6 pb-4 border-b border-border"><div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]">`,
      );
      _push(ssrRenderComponent(unref(Building), { class: "w-5 h-5" }, null, _parent));
      _push(
        `</div><div><h2 class="text-lg font-bold">Informasi Umum</h2><p class="text-sm text-muted-foreground">Profil dasar organisasi</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nama Tenant <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Contoh: NS Continent" class="${ssrRenderClass([{ "border-red-500": unref(errors).name }, "input-field"])}">`,
      );
      if (unref(errors).name) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><div class="space-y-2"><label class="text-sm font-medium">Slug <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).slug)} type="text" placeholder="ns-continent" class="${ssrRenderClass([{ "bg-muted/50": unref(isEditing), "border-red-500": unref(errors).slug }, "input-field"])}"${ssrIncludeBooleanAttr(unref(isEditing)) ? " readonly" : ""} title="Slug digunakan untuk identifikasi URL">`,
      );
      if (unref(errors).slug) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).slug)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<p class="text-[10px] text-muted-foreground"> Slug digunakan untuk identifikasi URL dan sistem. ${ssrInterpolate(unref(isEditing) ? "(Read-only)" : "(Auto-generated from name)")}</p></div><div class="col-span-1 md:col-span-2 space-y-2"><label class="text-sm font-medium">Logo URL</label><div class="flex gap-4 items-center">`,
      );
      if (unref(form).logo) {
        _push(
          `<div class="w-12 h-12 rounded border border-border overflow-hidden bg-white flex-shrink-0">`,
        );
        _push(
          ssrRenderComponent(
            _component_NuxtImg,
            {
              src: unref(form).logo,
              alt: "Logo",
              class: "w-full h-full object-contain",
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `<input${ssrRenderAttr("value", unref(form).logo)} type="text" placeholder="https://..." class="input-field"></div></div></div></div><div class="card-elevated p-6"><div class="flex items-center gap-3 mb-6 pb-4 border-b border-border"><div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]">`,
      );
      _push(ssrRenderComponent(unref(MapPin), { class: "w-5 h-5" }, null, _parent));
      _push(
        `</div><div><h2 class="text-lg font-bold">Kontak &amp; Alamat</h2><p class="text-sm text-muted-foreground">Informasi detail untuk dokumen dan footer</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="col-span-1 md:col-span-2 space-y-2"><label class="text-sm font-medium">Alamat Lengkap</label><textarea rows="3" placeholder="Jl. Raya..." class="input-field">${ssrInterpolate(unref(form).address)}</textarea></div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2">`,
      );
      _push(ssrRenderComponent(unref(Phone), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(
        ` Telepon </label><input${ssrRenderAttr("value", unref(form).phone)} type="text" placeholder="+62..." class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2">`,
      );
      _push(ssrRenderComponent(unref(Mail), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(
        ` Email Resmi </label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="contact@company.com" class="${ssrRenderClass([{ "border-red-500": unref(errors).email }, "input-field"])}">`,
      );
      if (unref(errors).email) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><div class="space-y-2"><label class="text-sm font-medium flex items-center gap-2">`,
      );
      _push(ssrRenderComponent(unref(FileText), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(
        ` Tax ID (NPWP) </label><input${ssrRenderAttr("value", unref(form).taxId)} type="text" placeholder="XX.XXX.XXX.X-XXX.XXX" class="input-field"></div></div></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="btn-primary min-w-[150px]">`,
      );
      if (unref(isLoading)) {
        _push(
          ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent),
        );
      } else {
        _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
      }
      _push(
        ` ${ssrInterpolate(unref(isEditing) ? "Simpan Perubahan" : "Buat Tenant")}</button></div></form></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/tenant/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BRsWskUZ.mjs.map
