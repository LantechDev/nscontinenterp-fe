import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Building2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyActivityTab",
  __ssrInlineRender: true,
  props: {
    activities: {},
  },
  setup(__props) {
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<!--[--><div class="justify-start text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5"> Latest Activity </div>`,
      );
      if (__props.activities.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.activities, (activity) => {
          _push(
            `<div class="self-stretch inline-flex justify-between items-start flex-wrap content-start"><div class="flex justify-start items-start gap-2 overflow-hidden"><div class="p-2 bg-zinc-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">`,
          );
          _push(
            ssrRenderComponent(
              unref(Building2),
              { class: "w-4 h-4 text-[#012D5A]" },
              null,
              _parent,
            ),
          );
          _push(
            `</div><div class="self-stretch inline-flex flex-col justify-between items-start"><div class="justify-start text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(activity.action)}</div><div class="justify-start text-black text-sm font-normal font-[&#39;Inter&#39;] leading-5"> by ${ssrInterpolate(activity.user?.name || "System")}</div></div></div><div class="justify-start text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(formatDate(activity.createdAt))}</div></div>`,
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
        _push(`<p class="text-sm">No activity available yet.</p></div>`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyActivityTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyActivityTab-CyC0EgTh.mjs.map
