import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
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
  CheckCircle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "closing",
  __ssrInlineRender: true,
  setup(__props) {
    const closingJobs = [
      {
        id: "1",
        jobId: "3",
        number: "JOB-2024-001232",
        customer: "PT Logistik Nusantara",
        totalRevenue: "Rp 32.500.000",
        totalCost: "Rp 24.200.000",
        profit: "Rp 8.300.000",
        status: "closed",
      },
      {
        id: "2",
        jobId: "4",
        number: "JOB-2024-001230",
        customer: "PT Maju Bersama",
        totalRevenue: "Rp 28.000.000",
        totalCost: "Rp 21.500.000",
        profit: "Rp 6.500.000",
        status: "pending",
      },
    ];
    const viewMode = ref("list");
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Closing Job</h1><p class="text-muted-foreground mt-1">Tutup job dan hitung profit</p></div><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
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
        `<input type="text" placeholder="Cari job untuk closing..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div></div>`,
      );
      if (unref(viewMode) === "list") {
        _push(
          `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th><th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th><th class="py-3 px-4 text-sm font-medium text-foreground">Total Revenue</th><th class="py-3 px-4 text-sm font-medium text-foreground">Total Cost</th><th class="py-3 px-4 text-sm font-medium text-foreground">Profit</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
        );
        ssrRenderList(closingJobs, (job) => {
          _push(
            `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4"><span class="text-sm font-medium">${ssrInterpolate(job.number)}</span></td><td class="py-3 px-4 text-sm">${ssrInterpolate(job.customer)}</td><td class="py-3 px-4 text-sm text-green-600 font-medium">${ssrInterpolate(job.totalRevenue)}</td><td class="py-3 px-4 text-sm text-red-600 font-medium">${ssrInterpolate(job.totalCost)}</td><td class="py-3 px-4 text-sm text-[#012D5A] font-bold">${ssrInterpolate(job.profit)}</td><td class="py-3 px-4">`,
          );
          if (job.status === "closed") {
            _push(
              `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">`,
            );
            _push(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3" }, null, _parent));
            _push(` Closed </span>`);
          } else {
            _push(
              `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">`,
            );
            _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3" }, null, _parent));
            _push(` Pending </span>`);
          }
          _push(
            `</td><td class="py-3 px-4 text-right"><button class="text-muted-foreground hover:text-foreground">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        ssrRenderList(closingJobs, (job) => {
          _push(
            `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(job.number)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(job.customer)}</p></div><button class="text-muted-foreground hover:text-foreground">`,
          );
          _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button></div><div class="space-y-4 mb-4"><div class="grid grid-cols-2 gap-2 text-sm"><div class="space-y-1"><p class="text-xs text-muted-foreground">Revenue</p><p class="font-medium text-green-600">${ssrInterpolate(job.totalRevenue)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground">Cost</p><p class="font-medium text-red-600">${ssrInterpolate(job.totalCost)}</p></div></div><div class="pt-3 border-t border-border"><div class="flex items-center justify-between"><p class="text-sm font-medium text-muted-foreground">Profit</p><p class="text-lg font-bold text-[#012D5A]">${ssrInterpolate(job.profit)}</p></div></div></div><div class="flex items-center justify-between pt-4 border-t border-border">`,
          );
          if (job.status === "closed") {
            _push(
              `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">`,
            );
            _push(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3" }, null, _parent));
            _push(` Closed </span>`);
          } else {
            _push(
              `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">`,
            );
            _push(ssrRenderComponent(unref(Clock), { class: "w-3 h-3" }, null, _parent));
            _push(` Pending </span>`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(closingJobs.length)} data found.</p><div class="flex items-center gap-2"><button class="p-1 hover:text-foreground disabled:opacity-50">`,
      );
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
      _push(
        `<span class="sr-only">Previous</span></button><button class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"> 1 </button><span class="px-1">...</span><button class="flex items-center gap-1 hover:text-foreground"> Next `,
      );
      _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
      _push(`</button></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/closing.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=closing-BOB50JZ9.mjs.map
