import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderClass,
  ssrIncludeBooleanAttr,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderAttr,
} from "vue/server-renderer";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    page: { default: 1 },
    total: {},
    itemsPerPage: { default: 10 },
    maxVisiblePages: { default: 5 },
  },
  emits: ["update:page"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage));
    const visiblePages = computed(() => {
      const pages = [];
      const total = totalPages.value;
      const current = props.page;
      const maxVisible = props.maxVisiblePages;
      if (total <= maxVisible) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);
        if (end - start < maxVisible - 1) {
          start = Math.max(1, end - maxVisible + 1);
        }
        if (start > 1) {
          pages.push(1);
          if (start > 2) {
            pages.push("...");
          }
        }
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (end < total) {
          if (end < total - 1) {
            pages.push("...");
          }
          pages.push(total);
        }
      }
      return pages;
    });
    const canGoPrevious = computed(() => props.page > 1);
    const canGoNext = computed(() => props.page < totalPages.value);
    const isPageNumber = (p) => typeof p === "number";
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<nav${ssrRenderAttrs(
          mergeProps(
            {
              class: "flex items-center gap-1",
              "aria-label": "Pagination",
            },
            _attrs,
          ),
        )}><button${ssrIncludeBooleanAttr(!unref(canGoPrevious)) ? " disabled" : ""} class="${ssrRenderClass(
          [
            [
              unref(canGoPrevious)
                ? "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                : "bg-gray-50 text-gray-400 cursor-not-allowed",
            ],
            "px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors",
          ],
        )}" aria-label="Previous page"> Previous </button><!--[-->`,
      );
      ssrRenderList(unref(visiblePages), (p, index) => {
        _push(`<!--[-->`);
        if (!isPageNumber(p)) {
          _push(`<span class="px-2 py-1.5 text-sm text-gray-400">${ssrInterpolate(p)}</span>`);
        } else {
          _push(
            `<button class="${ssrRenderClass([
              [
                p === __props.page
                  ? "bg-[#012D5A] text-white border-[#012D5A]"
                  : "bg-white text-gray-700 border-border hover:bg-gray-50 hover:text-gray-900",
              ],
              "px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
            ])}"${ssrRenderAttr("aria-current", p === __props.page ? "page" : void 0)}>${ssrInterpolate(p)}</button>`,
          );
        }
        _push(`<!--]-->`);
      });
      _push(
        `<!--]--><button${ssrIncludeBooleanAttr(!unref(canGoNext)) ? " disabled" : ""} class="${ssrRenderClass(
          [
            [
              unref(canGoNext)
                ? "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                : "bg-gray-50 text-gray-400 cursor-not-allowed",
            ],
            "px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors",
          ],
        )}" aria-label="Next page"> Next </button></nav>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/Pagination.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "UiPagination" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=Pagination-RMwlys3Y.mjs.map
