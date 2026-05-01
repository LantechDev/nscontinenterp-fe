import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderList,
} from "vue/server-renderer";
import { Plus, Mail, Phone, MapPinPlus, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanySidebar",
  __ssrInlineRender: true,
  props: {
    company: {},
    addresses: {},
    activeAddressMenu: {},
  },
  emits: ["new-job", "add-address", "edit-address", "delete-address", "toggle-menu", "close-menu"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
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
        `<div${ssrRenderAttrs(mergeProps({ class: "w-96 shrink-0 self-stretch p-5 border-r border-slate-200 flex flex-col justify-between items-start overflow-y-auto" }, _attrs))}><div class="self-stretch flex flex-col justify-start items-start gap-4"><div class="self-stretch inline-flex justify-start items-start"><div class="inline-flex flex-col justify-start items-start"><div class="text-black text-base font-semibold font-[&#39;Inter&#39;] leading-6">${ssrInterpolate(__props.company.name)}</div><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(__props.company.code)}</div></div></div><div class="self-stretch inline-flex justify-center items-center gap-4"><div class="flex-1 px-4 py-2.5 bg-primary rounded-md flex justify-center items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors">`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4 text-white" }, null, _parent));
      _push(
        `<div class="text-white text-sm font-medium font-[&#39;Inter&#39;] leading-5">New Job</div></div></div><div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2"><div class="self-stretch flex flex-col justify-start items-start gap-2"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">Description</div><div class="self-stretch h-px bg-slate-100"></div></div><div class="self-stretch text-black text-sm font-normal font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(__props.company.description || "-")}</div></div><div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2"><div class="self-stretch flex flex-col justify-start items-start gap-2"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5"> Contact Details </div><div class="self-stretch h-px bg-slate-100"></div></div><div class="self-stretch flex flex-col justify-start items-start gap-4"><div class="inline-flex justify-center items-center gap-2.5"><div class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">`,
      );
      _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4 text-[#012D5A]" }, null, _parent));
      _push(
        `</div><div class="inline-flex flex-col justify-center items-start"><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> Email Address </div><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(__props.company.email || "-")}</div></div></div><div class="inline-flex justify-center items-center gap-2.5"><div class="p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">`,
      );
      _push(ssrRenderComponent(unref(Phone), { class: "w-4 h-4 text-[#012D5A]" }, null, _parent));
      _push(
        `</div><div class="inline-flex flex-col justify-center items-start"><div class="text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5">Phone</div><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(__props.company.phone || "-")}</div></div></div></div></div><div class="self-stretch flex flex-col justify-start items-start gap-4 mt-2"><div class="self-stretch flex flex-col justify-start items-start gap-2"><div class="self-stretch inline-flex justify-between items-center"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">Address</div><div class="flex justify-end items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80">`,
      );
      _push(
        ssrRenderComponent(unref(MapPinPlus), { class: "w-4 h-4 text-primary" }, null, _parent),
      );
      _push(
        `<div class="text-primary text-sm font-medium font-[&#39;Inter&#39;] leading-5"> Add Address </div></div></div><div class="self-stretch h-px bg-slate-100"></div></div>`,
      );
      if (__props.addresses.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(__props.addresses, (addr) => {
          _push(
            `<div class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 relative"><div class="self-stretch inline-flex justify-between items-start"><div class="flex-1 flex justify-start items-center gap-3"><div class="flex-1 inline-flex flex-col justify-start items-start gap-1"><div class="self-stretch inline-flex justify-between items-start"><div class="text-black text-sm font-semibold font-[&#39;Inter&#39;] leading-5">${ssrInterpolate(addr.label)}</div><div class="address-menu-container relative">`,
          );
          _push(
            ssrRenderComponent(
              unref(MoreVertical),
              {
                class: "w-4 h-4 text-slate-500 cursor-pointer",
                onClick: ($event) => emit("toggle-menu", addr.id),
              },
              null,
              _parent,
            ),
          );
          if (__props.activeAddressMenu === addr.id) {
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
              `<div class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 inline-flex justify-start items-center gap-1 mt-1"><div class="text-center text-blue-700 text-sm font-medium font-[&#39;Inter&#39;] leading-5"> Main </div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(
          `<div class="self-stretch text-gray-400 text-sm font-normal font-[&#39;Inter&#39;] leading-5 py-4"> No address available </div>`,
        );
      }
      _push(
        `</div></div><div class="self-stretch flex flex-col justify-start items-start gap-3 mt-6"><div class="inline-flex justify-center items-center gap-2.5"><div class="inline-flex flex-col justify-center items-start"><div class="text-gray-400 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> Created ${ssrInterpolate(formatDate(__props.company.createdAt))}</div></div></div></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanySidebar.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanySidebar-C5zL0YBH.mjs.map
