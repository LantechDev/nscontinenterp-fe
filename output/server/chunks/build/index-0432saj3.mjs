import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./JobDetailSlideOver-BAyYqm_H.mjs";
import {
  defineComponent,
  ref,
  computed,
  watch,
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
  ssrRenderAttr,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import {
  LayoutList,
  LayoutGrid,
  Plus,
  Search,
  Ship,
  ArrowRight,
  Calendar,
  Eye,
  MoreVertical,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { e as useRoute, a as useRouter } from "./server.mjs";
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
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { jobs, isLoading } = useJobs();
    const route = useRoute();
    useRouter();
    const searchQuery = ref("");
    const viewMode = ref("list");
    const filteredJobs = computed(() => {
      return jobs.value.filter((job) => {
        const matchesSearch =
          job.jobNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          job.commodity.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesSearch;
      });
    });
    const getStatusClass = (statusId) => {
      if (statusId === "completed") return "bg-gray-100 text-gray-700 border-gray-200";
      if (statusId === "pending") return "bg-yellow-50 text-yellow-700 border-yellow-200";
      return "bg-blue-50 text-blue-700 border-blue-200";
    };
    const selectedJobId = ref("");
    const isDetailOpen = ref(false);
    const initialTab = ref(void 0);
    const initialBlId = ref(void 0);
    function openJobDetail(id, tab, blId) {
      selectedJobId.value = id;
      initialTab.value = tab;
      initialBlId.value = blId;
      isDetailOpen.value = true;
    }
    watch(
      () => route.query.id,
      (newId) => {
        if (newId) {
          setTimeout(() => {
            openJobDetail(newId, route.query.tab, route.query.blId);
          }, 50);
        }
      },
      { immediate: true },
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_OperationalJobDetailSlideOver = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in pb-10 p-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-xl sm:text-2xl font-bold">Job / Shipment</h1><p class="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1"> Manage job and shipment </p></div><div class="flex items-center justify-between sm:justify-end gap-2 shrink-0"><div class="flex items-center bg-white border border-border rounded-lg p-1"><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "list"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}" title="List View">`,
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
        )}" title="Grid View">`,
      );
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-4 h-4" }, null, _parent));
      _push(`</button></div>`);
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs/create",
            class:
              "sm:hidden flex items-center justify-center w-9 h-9 bg-[#012D5A] text-white rounded-lg transition-colors",
            title: "New Job",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-5 h-5" }, null, _parent2, _scopeId),
                );
              } else {
                return [createVNode(unref(Plus), { class: "w-5 h-5" })];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        `</div></div><div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"><div class="relative flex-1">`,
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
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari job..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="hidden sm:flex items-center gap-3">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Open New Job</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Open New Job"),
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
        _push(`<div class="p-8 text-center text-muted-foreground">Loading jobs...</div>`);
      } else if (unref(viewMode) === "list") {
        _push(
          `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr class="border-b border-border bg-gray-50/50 text-left"><th class="py-3 px-4 text-sm font-semibold text-foreground">No. Job</th><th class="py-3 px-4 text-sm font-semibold text-foreground hidden md:table-cell"> Komoditas </th><th class="py-3 px-4 text-sm font-semibold text-foreground">Rute</th><th class="py-3 px-4 text-sm font-semibold text-foreground hidden sm:table-cell text-center"> ETA </th><th class="py-3 px-4 text-sm font-semibold text-foreground text-center">Status</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
        );
        ssrRenderList(unref(filteredJobs), (job) => {
          _push(
            `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4"><div class="flex items-center gap-2"><div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">`,
          );
          _push(ssrRenderComponent(unref(Ship), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</div><span class="text-sm font-medium">${ssrInterpolate(job.jobNumber)}</span></div></td><td class="py-3 px-4 text-sm hidden md:table-cell max-w-xs truncate"${ssrRenderAttr("title", job.commodity)}>${ssrInterpolate(job.commodity || "-")}</td><td class="py-3 px-4"><div class="flex flex-col text-sm"><span class="flex items-center gap-1 font-medium truncate max-w-[100px] sm:max-w-none">${ssrInterpolate(job.pol)}</span><span class="flex items-center gap-1 text-muted-foreground text-[10px] sm:text-xs">`,
          );
          _push(
            ssrRenderComponent(
              unref(ArrowRight),
              { class: "w-2.5 h-2.5 sm:w-3 h-3" },
              null,
              _parent,
            ),
          );
          _push(
            ` ${ssrInterpolate(job.pod)}</span></div></td><td class="py-3 px-4 hidden sm:table-cell"><div class="flex items-center justify-center gap-2 text-sm text-gray-600">`,
          );
          _push(ssrRenderComponent(unref(Calendar), { class: "w-3 h-3" }, null, _parent));
          _push(
            ` ${ssrInterpolate(job.eta || "-")}</div></td><td class="py-3 px-4"><div class="flex flex-col gap-1 items-center"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tight",
                getStatusClass(job.status?.code),
              ),
            )}">${ssrInterpolate(job.status?.name || "Active")}</span>`,
          );
          if (job.billsOfLading?.some((bl) => bl.status?.code === "PENDING_APPROVAL")) {
            _push(
              `<span class="px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[8px] font-extrabold flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap"><div class="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div> APPROVE BL </span>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></td><td class="py-3 px-4 text-right"><div class="flex items-center justify-end gap-2"><button class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors" title="View Details">`,
          );
          _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button><button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredJobs).length === 0) {
          _push(
            `<tr><td colspan="6" class="p-8 text-center text-muted-foreground">Belum ada data job.</td></tr>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(unref(filteredJobs), (job) => {
          _push(
            `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0">`,
          );
          _push(ssrRenderComponent(unref(Ship), { class: "w-6 h-6" }, null, _parent));
          _push(
            `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(job.jobNumber)}</h3><p class="text-xs text-muted-foreground max-w-[200px] truncate"${ssrRenderAttr("title", job.commodity)}>${ssrInterpolate(job.commodity)}</p></div></div><div class="flex items-center gap-1"><button class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors" title="View Details">`,
          );
          _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button><button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button></div></div><div class="space-y-3 mb-4"><div class="flex items-center gap-2 text-sm">`,
          );
          _push(
            ssrRenderComponent(
              unref(MapPin),
              { class: "w-4 h-4 text-muted-foreground" },
              null,
              _parent,
            ),
          );
          _push(`<span class="font-medium">${ssrInterpolate(job.pol)}</span>`);
          _push(
            ssrRenderComponent(
              unref(ArrowRight),
              { class: "w-3 h-3 text-muted-foreground" },
              null,
              _parent,
            ),
          );
          _push(
            `<span class="font-medium">${ssrInterpolate(job.pod)}</span></div><div class="flex items-center gap-2 text-sm text-gray-600">`,
          );
          _push(
            ssrRenderComponent(
              unref(Calendar),
              { class: "w-4 h-4 text-muted-foreground" },
              null,
              _parent,
            ),
          );
          _push(
            `<span>ETA: ${ssrInterpolate(job.eta || "-")}</span></div></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="${ssrRenderClass(
              unref(cn)(
                "px-2 py-0.5 rounded border text-xs font-medium",
                getStatusClass(job.status?.code),
              ),
            )}">${ssrInterpolate(job.status?.name || "Active")}</span>`,
          );
          if (job.billsOfLading?.some((bl) => bl.status?.code === "PENDING_APPROVAL")) {
            _push(
              `<span class="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> PENDING BL APPROVAL </span>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(filteredJobs).length)} data found.</p><div class="flex items-center gap-2"><button class="p-1 hover:text-foreground disabled:opacity-50">`,
      );
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
      _push(
        `<span class="sr-only">Previous</span></button><button class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"> 1 </button><span class="px-1">...</span><button class="flex items-center gap-1 hover:text-foreground"> Next `,
      );
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
      _push(`</button></div></div>`);
      _push(
        ssrRenderComponent(
          _component_OperationalJobDetailSlideOver,
          {
            modelValue: unref(isDetailOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isDetailOpen) ? (isDetailOpen.value = $event) : null,
            "job-id": unref(selectedJobId),
            "initial-tab": unref(initialTab),
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
    "pages/operational/jobs/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0432saj3.mjs.map
