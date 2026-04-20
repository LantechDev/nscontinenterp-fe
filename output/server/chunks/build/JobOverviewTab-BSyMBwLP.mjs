import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderList,
} from "vue/server-renderer";
import { Ship } from "lucide-vue-next";
import { b as formatDate } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobOverviewTab",
  __ssrInlineRender: true,
  props: {
    job: {},
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6-up" }, _attrs))}><div class="card-elevated p-6"><div class="flex items-center gap-4 mb-6 pb-6 border-b border-border"><div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">`,
      );
      _push(ssrRenderComponent(unref(Ship), { class: "w-7 h-7 text-primary" }, null, _parent));
      _push(
        `</div><div><h2 class="text-xl font-semibold">${ssrInterpolate(__props.job.commodity)}</h2><p class="text-muted-foreground">Job Overview</p></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="space-y-4"><h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Route</h4><div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4"><div class="w-1 h-full bg-border relative"><div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div><div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div></div><div class="space-y-6"><div><p class="text-xs text-muted-foreground">POL (Port of Loading)</p><p class="font-medium text-lg">${ssrInterpolate(__props.job.pol)}</p><p class="text-sm text-muted-foreground">${ssrInterpolate(unref(formatDate)(__props.job.etd) || "TBA")}</p></div><div><p class="text-xs text-muted-foreground">POD (Port of Discharge)</p><p class="font-medium text-lg">${ssrInterpolate(__props.job.pod)}</p><p class="text-sm text-muted-foreground">${ssrInterpolate(unref(formatDate)(__props.job.eta) || "TBA")}</p></div></div></div></div><div class="space-y-4"><h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider"> Details </h4><div class="space-y-3"><div class="flex justify-between border-b border-dashed border-border pb-2"><span class="text-sm text-muted-foreground">Vessel</span><span class="font-medium">${ssrInterpolate(__props.job.vessel?.name || "-")}</span></div><div class="flex justify-between border-b border-dashed border-border pb-2"><span class="text-sm text-muted-foreground">Container Type</span><span class="font-medium">${ssrInterpolate(__props.job.containerType?.name || "-")}</span></div><div class="flex justify-between border-b border-dashed border-border pb-2"><span class="text-sm text-muted-foreground">Total BLs</span><span class="font-medium">${ssrInterpolate(__props.job.totalBlCount)}</span></div></div></div><div class="space-y-4"><h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider"> Parties (Default) </h4><div class="space-y-3"><!--[-->`,
      );
      ssrRenderList(__props.job.jobParties, (party) => {
        _push(
          `<div class="p-3 bg-muted/30 rounded-lg"><p class="text-xs text-muted-foreground mb-1">${ssrInterpolate(party.partyRole?.name || party.partyRoleId)}</p><p class="font-medium truncate">${ssrInterpolate(party.companyName || party.company?.name)}</p></div>`,
        );
      });
      _push(`<!--]--></div></div></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/components/JobOverviewTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=JobOverviewTab-BSyMBwLP.mjs.map
