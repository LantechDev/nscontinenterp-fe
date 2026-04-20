import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  computed,
  mergeProps,
  withCtx,
  unref,
  createVNode,
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
} from "vue/server-renderer";
import { ArrowLeft, Save } from "lucide-vue-next";
import { u as useFinanceExpense } from "./useFinanceExpense-CyuGq-0f.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
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
import "./server.mjs";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { isLoading } = useFinanceExpense();
    useCompanies();
    useJobs();
    useServices();
    const form = ref({
      number: "",
      description: "",
      amount: 0,
      date: /* @__PURE__ */ new Date().toISOString().split("T")[0],
      categoryId: "",
      vendorId: "",
      jobId: "",
      notes: "",
    });
    const vendors = ref([]);
    const jobs = ref([]);
    const categories = ref([]);
    const vendorsList = computed(() => vendors.value);
    const jobsList = computed(() => jobs.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div class="flex items-center gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/expenses",
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
        `<div><h1 class="text-2xl font-bold">Catat Biaya Baru</h1><p class="text-muted-foreground mt-1">Masukkan detail pengeluaran operasional</p></div></div></div><div class="max-w-3xl"><form class="space-y-6 bg-white p-8 rounded-xl border border-border"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">No. Biaya</label><input${ssrRenderAttr("value", unref(form).number)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="EXP-2024-XXXX"></div><div class="space-y-2"><label class="text-sm font-medium">Tanggal</label><input${ssrRenderAttr("value", unref(form).date)} type="date" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Deskripsi</label><input${ssrRenderAttr("value", unref(form).description)} type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="Contoh: Biaya Trucking JOB..."></div><div class="space-y-2"><label class="text-sm font-medium">Vendor</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).vendorId) ? ssrLooseContain(unref(form).vendorId, "") : ssrLooseEqual(unref(form).vendorId, "")) ? " selected" : ""}>Pilih Vendor (Opsional)</option><!--[-->`,
      );
      ssrRenderList(unref(vendorsList), (vendor) => {
        _push(
          `<option${ssrRenderAttr("value", vendor.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).vendorId) ? ssrLooseContain(unref(form).vendorId, vendor.id) : ssrLooseEqual(unref(form).vendorId, vendor.id)) ? " selected" : ""}>${ssrInterpolate(vendor.name)}</option>`,
        );
      });
      _push(
        `<!--]--></select></div><div class="space-y-2"><label class="text-sm font-medium">Kategori</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).categoryId) ? ssrLooseContain(unref(form).categoryId, "") : ssrLooseEqual(unref(form).categoryId, "")) ? " selected" : ""}>Pilih Kategori (Opsional)</option><!--[-->`,
      );
      ssrRenderList(unref(categories), (cat) => {
        _push(
          `<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).categoryId) ? ssrLooseContain(unref(form).categoryId, cat.id) : ssrLooseEqual(unref(form).categoryId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`,
        );
      });
      _push(
        `<!--]--></select></div><div class="space-y-2"><label class="text-sm font-medium">Jumlah (IDR)</label><input${ssrRenderAttr("value", unref(form).amount)} type="number" required class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="0"></div><div class="space-y-2"><label class="text-sm font-medium">No. Job (Opsional)</label><select class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).jobId) ? ssrLooseContain(unref(form).jobId, "") : ssrLooseEqual(unref(form).jobId, "")) ? " selected" : ""}>Pilih Job</option><!--[-->`,
      );
      ssrRenderList(unref(jobsList), (job) => {
        _push(
          `<option${ssrRenderAttr("value", job.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).jobId) ? ssrLooseContain(unref(form).jobId, job.id) : ssrLooseEqual(unref(form).jobId, job.id)) ? " selected" : ""}>${ssrInterpolate(job.jobNumber)}</option>`,
        );
      });
      _push(
        `<!--]--></select></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Keterangan Tambahan</label><textarea rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Tambahkan catatan jika perlu...">${ssrInterpolate(unref(form).notes)}</textarea></div></div><div class="flex justify-end gap-3 pt-4 border-t"><button type="button" class="px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2">`,
      );
      if (!unref(isLoading)) {
        _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isLoading)) {
        _push(`<span>Menyimpan...</span>`);
      } else {
        _push(`<span>Simpan Biaya</span>`);
      }
      _push(`</button></div></form></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/expenses/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BnDH40vJ.mjs.map
