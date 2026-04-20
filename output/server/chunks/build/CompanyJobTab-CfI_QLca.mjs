import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { Building2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyJobTab",
  __ssrInlineRender: true,
  props: {
    jobs: {},
    companyCode: {},
  },
  setup(__props) {
    const formatShortDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<!--[--><div class="justify-start text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5"> Current Job </div>`,
      );
      if (__props.jobs.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.jobs, (job) => {
          _push(
            `<div class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 inline-flex justify-start items-start gap-2 overflow-hidden hover:bg-slate-50 cursor-pointer transition-colors"><div class="flex justify-start items-start gap-2"><div class="inline-flex flex-col justify-start items-start gap-1"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(job.jobNumber)}</div><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(__props.companyCode)}</div></div>`,
          );
          if (job.status) {
            _push(
              `<div class="px-2 py-0.5 bg-blue-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1"><div class="text-center text-blue-700 text-sm font-medium font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(job.status.name)}</div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div><div class="flex-1 flex justify-end items-center gap-4 overflow-hidden"><div class="inline-flex flex-col justify-center items-end gap-1"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(job.pol)}</div><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> ETD: ${ssrInterpolate(formatShortDate(job.etd))}</div></div><div class="size-4 relative overflow-hidden flex items-center justify-center"><div class="w-2.5 h-2.5 outline-2 outline-offset-[-1px] outline-black rotate-45 border-t-2 border-r-2 border-black"></div></div><div class="inline-flex flex-col justify-center items-start gap-1"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(job.pod)}</div><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> ETA: ${ssrInterpolate(formatShortDate(job.eta))}</div></div></div></div>`,
          );
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="w-full py-8 flex flex-col items-center justify-center text-gray-400">`);
        _push(
          ssrRenderComponent(
            unref(Building2),
            { class: "w-8 h-8 mb-2 text-gray-300" },
            null,
            _parent,
          ),
        );
        _push(`<p class="text-sm">No jobs available yet.</p></div>`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyJobTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyJobTab-CfI_QLca.mjs.map
