import { defineComponent, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { MapPinPlus, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyAddressTab",
  __ssrInlineRender: true,
  props: {
    addresses: {},
    activeAddressMenu: {},
  },
  emits: ["add-address", "edit-address", "delete-address", "toggle-menu"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<!--[--><div class="self-stretch flex justify-between items-center"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">Address</div><div class="bg-primary flex justify-end items-center gap-3 rounded-[6px] px-4 py-2 cursor-pointer hover:opacity-80">`,
      );
      _push(ssrRenderComponent(unref(MapPinPlus), { class: "w-4 h-4 text-white" }, null, _parent));
      _push(
        `<div class="text-white text-sm font-medium font-[&#39;Inter&#39;] leading-5">Add Address</div></div></div>`,
      );
      if (__props.addresses.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.addresses, (addr) => {
          _push(
            `<div class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 transition-colors relative"><div class="self-stretch flex justify-between items-start"><div class="flex-1 flex justify-start items-center gap-3"><div class="flex-1 flex flex-col justify-start items-start gap-1"><div class="self-stretch flex justify-between items-start"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(addr.label)}</div><div class="address-menu-container relative">`,
          );
          _push(
            ssrRenderComponent(
              unref(MoreVertical),
              {
                class: "w-4 h-4 text-slate-500 cursor-pointer",
                onClick: ($event) => emit("toggle-menu", "tab-" + addr.id),
              },
              null,
              _parent,
            ),
          );
          if (__props.activeAddressMenu === "tab-" + addr.id) {
            _push(
              `<div class="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]"><div class="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">`,
            );
            _push(
              ssrRenderComponent(
                unref(Pencil),
                { class: "w-3.5 h-3.5 text-slate-600" },
                null,
                _parent,
              ),
            );
            _push(
              `<span class="text-sm text-slate-700">Edit</span></div><div class="px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2">`,
            );
            _push(
              ssrRenderComponent(
                unref(Trash2),
                { class: "w-3.5 h-3.5 text-red-500" },
                null,
                _parent,
              ),
            );
            _push(`<span class="text-sm text-red-500">Delete</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div><div class="self-stretch text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(addr.fullAddress || "-")}</div></div></div></div>`,
          );
          if (addr.isDefault) {
            _push(
              `<div class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1 mt-1"><div class="text-center text-blue-700 text-sm font-medium font-[&#39;Inter&#39;] leading-5"> Main </div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="w-full py-8 flex flex-col items-center justify-center text-gray-400">`);
        _push(
          ssrRenderComponent(
            unref(MapPinPlus),
            { class: "w-8 h-8 mb-2 text-gray-300" },
            null,
            _parent,
          ),
        );
        _push(`<p class="text-sm">No address available yet.</p></div>`);
      }
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyAddressTab.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyAddressTab-CvjBOTg2.mjs.map
