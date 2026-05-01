import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./JobDetailSlideOver-BAyYqm_H.mjs";
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
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import {
  LayoutList,
  LayoutGrid,
  Search,
  Plus,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { u as useRuntimeConfig } from "./server.mjs";
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
import "./useInvoices-DKKCQ9mY.mjs";
import "./useServices-DFtvjO_i.mjs";
import "./useCompanies-D5TCq9CR.mjs";
import "./Combobox-BrxCx0QJ.mjs";
import "@vueuse/core";
import "./Modal-DzxIm9v2.mjs";
import "./index-DJGQOf1Z.mjs";
import "jspdf";
import "html2canvas";
import "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "./usePayments-BGfFm4PO.mjs";
import "./DatePicker-I7QCahB1.mjs";
import "./JobPartyRow-CsBs8qVt.mjs";
import "./SectionCard-BNHBHmfw.mjs";
import "./useConfirm-iFV_8p0v.mjs";
import "./useJobs-BuvuAhhz.mjs";
import "clsx";
import "tailwind-merge";
import "vue-router";

function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function useEbls() {
  const config = useRuntimeConfig();
  const ebls = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  async function fetchEbls() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bls`, {
        credentials: "include",
      });
      ebls.value = data || [];
      return ebls.value;
    } catch (err) {
      error.value = getErrorMessage(err);
      console.error("Error fetching EBLs:", err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  async function getEblById(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}`, {
        credentials: "include",
      });
      return data;
    } catch (err) {
      error.value = getErrorMessage(err);
      console.error("Error fetching EBL:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    ebls,
    isLoading,
    error,
    fetchEbls,
    getEblById,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { ebls, isLoading } = useEbls();
    const getStatusInfo = (ebl) => {
      const statusCode = ebl.status?.code || ebl.statusId || "";
      const statusMap = {
        draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
        issued: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
        surrendered: {
          label: "Surrendered",
          class: "bg-yellow-50 text-yellow-700 border-yellow-200",
        },
        DRAFT: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
        ISSUED: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
      };
      return (
        statusMap[statusCode] || {
          label: ebl.status?.name || statusCode || "Unknown",
          class: "bg-gray-100 text-gray-700",
        }
      );
    };
    const viewMode = ref("list");
    const selectedJobId = ref("");
    const initialBlId = ref("");
    const isDetailOpen = ref(false);
    const groupedEbls = computed(() => {
      const groups = {};
      ebls.value.forEach((ebl) => {
        const jobId = ebl.jobId;
        if (!groups[jobId]) {
          groups[jobId] = {
            jobId,
            jobNumber: ebl.job?.jobNumber || "Unknown Job",
            ebls: [],
          };
        }
        groups[jobId].ebls.push(ebl);
      });
      return Object.values(groups);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_OperationalJobDetailSlideOver = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">eBL (Electronic Bill of Lading)</h1><p class="text-muted-foreground mt-1">Kelola dokumen eBL</p></div><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "list"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutList), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "grid"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button></div></div></div><div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
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
        `<input type="text" placeholder="Cari eBL..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/ebl/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Buat eBL</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Buat eBL"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(isLoading)) {
        _push(`<div class="p-8 text-center text-muted-foreground">Loading EBLs...</div>`);
      } else if (unref(viewMode) === "list") {
        _push(
          `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">No. eBL</th><th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th></tr></thead><tbody><!--[-->`,
        );
        ssrRenderList(unref(groupedEbls), (group) => {
          _push(
            `<!--[--><tr class="bg-gray-50 border-b border-border"><td colspan="3" class="py-2.5 px-4"><div class="flex items-center gap-2"><span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Job:</span><span class="text-sm font-bold text-[#012D5A]">${ssrInterpolate(group.jobNumber)}</span><span class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2">${ssrInterpolate(group.ebls.length)} BL${ssrInterpolate(group.ebls.length > 1 ? "S" : "")}</span></div></td></tr><!--[-->`,
          );
          ssrRenderList(group.ebls, (ebl) => {
            _push(
              `<tr class="border-b border-border last:border-b hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4 pl-8"><div class="flex items-center gap-2"><div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">`,
            );
            _push(ssrRenderComponent(unref(FileText), { class: "w-4 h-4" }, null, _parent));
            _push(
              `</div><span class="text-sm font-medium">${ssrInterpolate(ebl.blNumber)}</span></div></td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(ebl.job?.jobNumber || "-")}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
                unref(cn)(
                  "px-2 py-0.5 rounded border text-xs font-medium",
                  getStatusInfo(ebl).class,
                ),
              )}">${ssrInterpolate(getStatusInfo(ebl).label)}</span></td></tr>`,
            );
          });
          _push(`<!--]--><!--]-->`);
        });
        _push(`<!--]-->`);
        if (unref(ebls).length === 0) {
          _push(
            `<tr><td colspan="3" class="p-8 text-center text-muted-foreground">Belum ada data eBL.</td></tr>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(ebls), (ebl) => {
          _push(
            `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0">`,
          );
          _push(ssrRenderComponent(unref(FileText), { class: "w-6 h-6" }, null, _parent));
          _push(
            `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(ebl.blNumber)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(ebl.job?.jobNumber || "-")}</p></div></div><button class="text-muted-foreground hover:text-foreground">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="${ssrRenderClass(unref(cn)("px-2 py-0.5 rounded border text-xs font-medium", getStatusInfo(ebl).class))}">${ssrInterpolate(getStatusInfo(ebl).label)}</span></div></div>`,
          );
        });
        _push(`<!--]-->`);
        if (unref(ebls).length === 0) {
          _push(
            `<div class="col-span-full p-8 text-center text-muted-foreground"> Belum ada data eBL. </div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (unref(ebls).length > 0) {
        _push(
          `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(ebls).length)} data found.</p><div class="flex items-center gap-2"><button class="p-1 hover:text-foreground disabled:opacity-50">`,
        );
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span class="sr-only">Previous</span></button><button class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"> 1 </button><span class="px-1">...</span><button class="flex items-center gap-1 hover:text-foreground"> Next `,
        );
        _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        ssrRenderComponent(
          _component_OperationalJobDetailSlideOver,
          {
            modelValue: unref(isDetailOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isDetailOpen) ? (isDetailOpen.value = $event) : null,
            "job-id": unref(selectedJobId),
            "initial-tab": "ebl",
            "initial-bl-id": unref(initialBlId),
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
    "pages/operational/ebl/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CEO6sk4t.mjs.map
