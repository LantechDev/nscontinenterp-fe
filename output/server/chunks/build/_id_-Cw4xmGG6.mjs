import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  mergeProps,
  unref,
  withCtx,
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
import { Loader2, ArrowLeft, Edit, Package } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import _sfc_main$1 from "./ServiceCreateModal-CaY7_020.mjs";
import { e as useRoute } from "./server.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
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
import "./Modal-DzxIm9v2.mjs";
import "./Combobox-BrxCx0QJ.mjs";
import "@vueuse/core";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = route.params.id;
    const { isLoading, updateService } = useServices();
    const service = ref(null);
    const formatPrice = (price, currency = "IDR") => {
      if (!price) return `${currency} 0`;
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
      }).format(price);
    };
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };
    const isEditOpen = ref(false);
    const isSubmitting = ref(false);
    const formError = ref(null);
    const parsePrice = (value) => {
      const cleaned = value.replace(/[^\d]/g, "");
      return parseInt(cleaned) || 0;
    };
    const handleUpdateService = async (formData) => {
      isSubmitting.value = true;
      formError.value = null;
      const payload = {
        name: formData.name,
        code: formData.code,
        vendorPrice: parsePrice(formData.vendorPrice),
        customerPrice: parsePrice(formData.customerPrice),
        currency: formData.currency,
        taxRate: parseFloat(formData.taxRate) || 0,
        unitId: formData.unitId || void 0,
        categoryId: formData.categoryId || void 0,
        isActive: formData.status === "Active",
      };
      const result = await updateService(id, payload);
      if (result.success) {
        service.value = result.data || null;
        isEditOpen.value = false;
      } else {
        formError.value = result.error || "Failed to update service";
      }
      isSubmitting.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}>`,
      );
      if (unref(isLoading)) {
        _push(`<div class="flex items-center justify-center py-20">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-8 h-8 animate-spin text-primary" },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (unref(service)) {
        _push(`<!--[--><div class="page-header"><div class="flex items-center gap-4">`);
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: "/master/services",
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
          `<div><h1 class="page-title">${ssrInterpolate(unref(service).name)}</h1><p class="text-muted-foreground mt-1">Detail jasa untuk ${ssrInterpolate(unref(service).code)}</p></div></div><div class="flex items-center gap-3"><div class="${ssrRenderClass(
            unref(cn)(
              "px-3 py-1 rounded-full text-xs font-medium",
              unref(service).isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
            ),
          )}">${ssrInterpolate(unref(service).isActive ? "Active" : "Inactive")}</div><button class="btn-secondary">`,
        );
        _push(ssrRenderComponent(unref(Edit), { class: "w-4 h-4 mr-2" }, null, _parent));
        _push(
          ` Edit </button></div></div><div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-3 space-y-6"><div class="border border-border rounded-xl bg-white overflow-hidden"><div class="p-4 border-b border-border bg-slate-50 flex items-center gap-4"><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">`,
        );
        _push(ssrRenderComponent(unref(Package), { class: "w-5 h-5 text-primary" }, null, _parent));
        _push(
          `</div><div><h2 class="font-bold text-foreground">Service Information</h2><p class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest"> General details &amp; classification </p></div></div><div class="p-6"><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm"><div class="space-y-1"><p class="text-muted-foreground font-medium">Service Code</p><p class="font-bold text-slate-900">${ssrInterpolate(unref(service).code)}</p></div><div class="space-y-1"><p class="text-muted-foreground font-medium">Category</p><p class="font-bold text-slate-900 capitalize">${ssrInterpolate(unref(service).category?.name || "-")}</p></div><div class="space-y-1"><p class="text-muted-foreground font-medium">Unit</p><p class="font-bold text-slate-900">${ssrInterpolate(unref(service).unit?.name || "-")}</p></div><div class="space-y-1"><p class="text-muted-foreground font-medium">Tax Rate</p><p class="font-bold text-[#012D5A]">${ssrInterpolate(unref(service).taxRate || 0)}%</p></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="border border-border rounded-xl bg-white p-6 relative overflow-hidden"><div class="flex items-center justify-between mb-4"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground"> Net Cost (Vendor) </p><div class="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase leading-none">${ssrInterpolate(unref(service).currency || "IDR")}</div></div><p class="text-2xl font-black text-slate-800 tabular-nums leading-none">${ssrInterpolate(
            formatPrice(unref(service).vendorPrice, unref(service).currency || "IDR")
              .replace(unref(service).currency || "IDR", "")
              .trim(),
          )}</p><p class="text-[11px] text-muted-foreground mt-3 font-medium"> Purchasing rate from primary vendor. </p></div><div class="border border-border rounded-xl bg-white p-6 relative overflow-hidden"><div class="flex items-center justify-between mb-4"><p class="text-xs font-bold uppercase tracking-widest text-[#012D5A]"> Selling Price (Customer) </p><div class="px-2 py-1 bg-[#012D5A] rounded text-[10px] font-bold text-white uppercase leading-none">${ssrInterpolate(unref(service).currency || "IDR")}</div></div><p class="text-2xl font-black text-[#012D5A] tabular-nums leading-none">${ssrInterpolate(
            formatPrice(unref(service).customerPrice, unref(service).currency || "IDR")
              .replace(unref(service).currency || "IDR", "")
              .trim(),
          )}</p><div class="flex items-center gap-1.5 mt-3"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div><p class="text-[11px] text-green-600 font-bold uppercase">Standard Sales Rate</p></div></div></div></div><div class="space-y-6"><div class="border border-border rounded-xl bg-white overflow-hidden"><div class="p-4 bg-slate-50 border-b border-border"><h3 class="font-bold text-xs uppercase tracking-widest text-slate-500">Metadata</h3></div><div class="p-5 space-y-4"><div class="space-y-1"><p class="text-[10px] font-bold uppercase text-muted-foreground">Registered At</p><p class="text-sm font-semibold text-slate-700">${ssrInterpolate(formatDate(unref(service).createdAt))}</p></div><div class="space-y-1"><p class="text-[10px] font-bold uppercase text-muted-foreground">Last Updated</p><p class="text-sm font-semibold text-slate-700">${ssrInterpolate(formatDate(unref(service).updatedAt))}</p></div></div></div><div class="border border-border border-dashed rounded-xl p-4 bg-slate-50/50"><p class="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest"> Service Status </p><p class="text-[11px] text-muted-foreground leading-relaxed font-medium"> This service is currently <span class="${ssrRenderClass(unref(service).isActive ? "text-green-600 font-bold" : "text-red-600 font-bold")}">${ssrInterpolate(unref(service).isActive ? "operational" : "suspended")}</span>. </p></div></div></div><!--]-->`,
        );
      } else {
        _push(
          `<div class="flex flex-col items-center justify-center py-20 text-muted-foreground">`,
        );
        _push(
          ssrRenderComponent(unref(Package), { class: "w-12 h-12 mb-4 opacity-20" }, null, _parent),
        );
        _push(`<p>Service not found</p>`);
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: "/master/services",
              class: "mt-4 text-primary hover:underline",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Back to Services `);
                } else {
                  return [createTextVNode(" Back to Services ")];
                }
              }),
              _: 1,
            },
            _parent,
          ),
        );
        _push(`</div>`);
      }
      _push(
        ssrRenderComponent(
          unref(_sfc_main$1),
          {
            "is-open": unref(isEditOpen),
            "is-submitting": unref(isSubmitting),
            error: unref(formError),
            "initial-data": unref(service),
            "onUpdate:isOpen": (val) => (isEditOpen.value = val),
            onSubmit: handleUpdateService,
          },
          null,
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/services/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Cw4xmGG6.mjs.map
