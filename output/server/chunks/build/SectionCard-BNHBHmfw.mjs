import {
  defineComponent,
  mergeProps,
  createVNode,
  resolveDynamicComponent,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderVNode,
  ssrInterpolate,
  ssrRenderClass,
  ssrRenderSlot,
} from "vue/server-renderer";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: {
    id: {},
    title: {},
    icon: {},
    bodyClass: {},
    noPadding: { type: Boolean },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<section${ssrRenderAttrs(
          mergeProps(
            {
              id: __props.id,
              class:
                "bg-card rounded-xl border border-border/60 shadow-sm scroll-mt-24 transition-all duration-300",
            },
            _attrs,
          ),
        )}><div class="px-6 py-3.5 border-b border-border/40 flex items-center gap-2.5 bg-muted/5 rounded-t-xl"><div class="p-1.5 rounded-lg bg-primary/5 text-primary">`,
      );
      ssrRenderVNode(
        _push,
        createVNode(resolveDynamicComponent(__props.icon), { class: "w-4 h-4" }, null),
        _parent,
      );
      _push(
        `</div><h2 class="font-semibold text-[14px] text-foreground/90 uppercase tracking-tight">${ssrInterpolate(__props.title)}</h2></div><div class="${ssrRenderClass(__props.noPadding ? "" : "p-4 md:p-6 " + (__props.bodyClass || ""))}">`,
      );
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/components/SectionCard.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=SectionCard-BNHBHmfw.mjs.map
