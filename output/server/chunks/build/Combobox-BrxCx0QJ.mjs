import {
  defineComponent,
  ref,
  watch,
  computed,
  nextTick,
  mergeProps,
  unref,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrRenderList,
  ssrRenderClass,
} from "vue/server-renderer";
import { ChevronsUpDown, Plus, Check } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Combobox",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    options: {},
    labelKey: {},
    valueKey: {},
    placeholder: {},
    allowCreate: { type: Boolean },
    filterLocal: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "create", "search"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = ref(false);
    const searchQuery = ref("");
    const containerRef = ref(null);
    const inputRef = ref(null);
    watch(searchQuery, (q) => {
      emit("search", q);
    });
    const getOptionValue = (option) => {
      if (props.valueKey && option[props.valueKey]) {
        return String(option[props.valueKey]);
      }
      return option.id || "";
    };
    const getOptionLabel = (option) => {
      if (props.labelKey && option[props.labelKey]) {
        return String(option[props.labelKey]);
      }
      return option.name || "";
    };
    const filteredOptions = computed(() => {
      if (!props.options) return [];
      if (!props.filterLocal) return props.options;
      if (!searchQuery.value) return props.options;
      const lowerQuery = searchQuery.value.toLowerCase();
      return props.options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
    });
    const cachedSelectedOption = ref(null);
    watch(
      () => props.modelValue,
      (newVal) => {
        if (!newVal) {
          cachedSelectedOption.value = null;
        }
      },
    );
    watch(
      () => props.options,
      (newOptions) => {
        if (props.modelValue && newOptions) {
          const found = newOptions.find((opt) => getOptionValue(opt) === props.modelValue);
          if (found) {
            cachedSelectedOption.value = found;
          }
        }
      },
      { immediate: true, deep: true },
    );
    const selectedLabel = computed(() => {
      if (
        cachedSelectedOption.value &&
        getOptionValue(cachedSelectedOption.value) === props.modelValue
      ) {
        return getOptionLabel(cachedSelectedOption.value);
      }
      const selected = props.options.find((opt) => getOptionValue(opt) === props.modelValue);
      if (selected) {
        cachedSelectedOption.value = selected;
        return getOptionLabel(selected);
      }
      return props.placeholder || "Select option...";
    });
    watch(open, (isOpen) => {
      if (isOpen) {
        nextTick(() => {
          inputRef.value?.focus();
        });
      }
    });
    onClickOutside(containerRef, () => {
      open.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              ref_key: "containerRef",
              ref: containerRef,
              class: "relative",
            },
            _attrs,
          ),
        )}><button type="button" class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><span class="truncate">${ssrInterpolate(unref(selectedLabel))}</span>`,
      );
      _push(
        ssrRenderComponent(
          unref(ChevronsUpDown),
          { class: "ml-2 h-4 w-4 shrink-0 opacity-50" },
          null,
          _parent,
        ),
      );
      _push(`</button>`);
      if (unref(open)) {
        _push(
          `<div class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white dark:bg-slate-950 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"><div class="flex items-center border-b px-3 sticky top-0 bg-white dark:bg-slate-950 z-10"><input${ssrRenderAttr("value", unref(searchQuery))} class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search..."></div><div class="p-1">`,
        );
        if (unref(filteredOptions).length === 0 && !__props.allowCreate) {
          _push(`<div class="py-6 text-center text-sm"> No results found. </div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(filteredOptions).length === 0 && __props.allowCreate && unref(searchQuery)) {
          _push(
            `<div class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-[#012D5A]/10 hover:bg-[#012D5A] hover:text-white">`,
          );
          _push(ssrRenderComponent(unref(Plus), { class: "mr-2 h-4 w-4" }, null, _parent));
          _push(` Create &quot;${ssrInterpolate(unref(searchQuery))}&quot; </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(filteredOptions), (option) => {
          _push(
            `<div class="${ssrRenderClass([
              {
                "bg-[#012D5A] text-white": __props.modelValue === getOptionValue(option),
              },
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#012D5A] hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            ])}">`,
          );
          _push(
            ssrRenderComponent(
              unref(Check),
              {
                class: [
                  "mr-2 h-4 w-4",
                  __props.modelValue === getOptionValue(option) ? "opacity-100" : "opacity-0",
                ],
              },
              null,
              _parent,
            ),
          );
          _push(` ${ssrInterpolate(getOptionLabel(option))}</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/Combobox.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Combobox = Object.assign(_sfc_main, { __name: "UiCombobox" });

export { Combobox as C };
//# sourceMappingURL=Combobox-BrxCx0QJ.mjs.map
