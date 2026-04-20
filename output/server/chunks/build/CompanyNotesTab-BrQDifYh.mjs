import { defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { Building2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyNotesTab",
  __ssrInlineRender: true,
  props: {
    notes: {},
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<!--[--><div class="justify-start text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">Notes</div>`,
      );
      if (__props.notes) {
        _push(
          `<div class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-slate-50"><p class="text-black text-sm font-normal font-[&#39;Inter&#39;] leading-5 whitespace-pre-wrap">${ssrInterpolate(__props.notes)}</p></div>`,
        );
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
        _push(`<p class="text-sm">No notes available yet.</p></div>`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyNotesTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyNotesTab-BrQDifYh.mjs.map
