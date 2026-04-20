import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  mergeProps,
  unref,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderClass,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrRenderComponent,
  ssrRenderTeleport,
  ssrRenderStyle,
  ssrRenderAttr,
  ssrRenderList,
} from "vue/server-renderer";
import { ChevronsUpDown, Loader2, Check } from "lucide-vue-next";
import { useDebounceFn, onClickOutside } from "@vueuse/core";
import { u as useRuntimeConfig } from "./server.mjs";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: {},
    labelKey: {},
    valueKey: {},
    fetchOptions: { type: Function },
    initialOptions: {},
    formatDisplay: { type: Function },
    debounceMs: {},
    disabled: { type: Boolean },
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const open = ref(false);
    const searchQuery = ref("");
    const containerRef = ref(null);
    const inputRef = ref(null);
    const dropdownStyle = computed(() => {
      if (!containerRef.value) return {};
      const rect = containerRef.value.getBoundingClientRect();
      return {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        maxWidth: `${rect.width}px`,
      };
    });
    const options = ref([]);
    const isLoading = ref(false);
    const hasFetched = ref(false);
    const defaultFormatDisplay = (option) => {
      if (props.labelKey && option[props.labelKey]) {
        return String(option[props.labelKey]);
      }
      return option.name || option.label || "";
    };
    const formatDisplayFn = computed(() => props.formatDisplay || defaultFormatDisplay);
    const getOptionValue = (option) => {
      if (props.valueKey && option[props.valueKey]) {
        return String(option[props.valueKey]);
      }
      return option.id;
    };
    const getOptionLabel = (option) => {
      return formatDisplayFn.value(option);
    };
    const filteredOptions = computed(() => {
      if (!options.value || options.value.length === 0) return [];
      if (!searchQuery.value) return options.value;
      if (props.fetchOptions) {
        return options.value;
      }
      const lowerQuery = searchQuery.value.toLowerCase();
      return options.value.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
    });
    const selectedLabel = computed(() => {
      if (!props.modelValue) {
        return props.placeholder || "Select option...";
      }
      const selected = options.value.find((opt) => getOptionValue(opt) === props.modelValue);
      if (selected) {
        return getOptionLabel(selected);
      }
      return props.placeholder || "Select option...";
    });
    const debouncedSearch = useDebounceFn(async (query) => {
      if (!props.fetchOptions) return;
      isLoading.value = true;
      try {
        const result = await props.fetchOptions({ query, limit: 50 });
        if (result.success && result.data) {
          options.value = result.data;
          hasFetched.value = true;
        }
      } catch (error) {
        console.error("[SearchSelect] Failed to fetch options:", error);
      } finally {
        isLoading.value = false;
      }
    }, props.debounceMs || 300);
    watch(searchQuery, (newQuery) => {
      if (props.fetchOptions) {
        debouncedSearch(newQuery);
      }
    });
    async function initialFetch() {
      if (props.initialOptions && props.initialOptions.length > 0) {
        options.value = props.initialOptions;
        hasFetched.value = true;
        return;
      }
      if (props.fetchOptions && !hasFetched.value) {
        isLoading.value = true;
        try {
          const result = await props.fetchOptions({ query: "", limit: 50 });
          if (result.success && result.data) {
            options.value = result.data;
            hasFetched.value = true;
          }
        } catch (error) {
          console.error("[SearchSelect] Initial fetch failed:", error);
        } finally {
          isLoading.value = false;
        }
      }
    }
    watch(open, (isOpen) => {
      if (isOpen) {
        nextTick(() => {
          inputRef.value?.focus();
          if (!hasFetched.value) {
            initialFetch();
          }
        });
      }
    });
    onClickOutside(containerRef, () => {
      open.value = false;
    });
    __expose({
      refresh: initialFetch,
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
        )}><button type="button" class="${ssrRenderClass([
          {
            "opacity-50": __props.disabled,
          },
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ])}"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}><span class="truncate">${ssrInterpolate(unref(selectedLabel))}</span>`,
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
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (unref(open)) {
            _push2(
              `<div class="fixed z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95" style="${ssrRenderStyle(unref(dropdownStyle))}"><div class="flex items-center border-b px-3 sticky top-0 bg-popover"><input${ssrRenderAttr("value", unref(searchQuery))} class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Search..."${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}>`,
            );
            if (unref(isLoading)) {
              _push2(
                ssrRenderComponent(
                  unref(Loader2),
                  { class: "h-4 w-4 animate-spin text-muted-foreground" },
                  null,
                  _parent,
                ),
              );
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-1">`);
            if (unref(isLoading) && unref(filteredOptions).length === 0) {
              _push2(`<div class="py-6 text-center text-sm text-muted-foreground">`);
              _push2(
                ssrRenderComponent(
                  unref(Loader2),
                  { class: "h-4 w-4 animate-spin mx-auto mb-2" },
                  null,
                  _parent,
                ),
              );
              _push2(` Loading... </div>`);
            } else if (!unref(isLoading) && unref(filteredOptions).length === 0) {
              _push2(
                `<div class="py-6 text-center text-sm text-muted-foreground"> No results found. </div>`,
              );
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(filteredOptions), (option) => {
              _push2(
                `<div class="${ssrRenderClass([
                  {
                    "bg-accent": __props.modelValue === getOptionValue(option),
                  },
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                ])}">`,
              );
              _push2(
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
              _push2(` ${ssrInterpolate(getOptionLabel(option))}</div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        },
        "body",
        false,
        _parent,
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/SearchSelect.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchSelect = Object.assign(_sfc_main, { __name: "UiSearchSelect" });
function formatAccountDisplay(account) {
  return `${account.accountCode} - ${account.accountName}`;
}
function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function useChartOfAccounts() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const accounts = ref([]);
  async function fetchAccounts() {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/finance/chart-of-accounts`, {
        credentials: "include",
      });
      accounts.value = data || [];
      return { success: true, data: accounts.value };
    } catch (error) {
      console.error("[ChartOfAccounts] Failed to fetch:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function searchAccounts(query) {
    if (accounts.value.length === 0) {
      const result = await fetchAccounts();
      if (!result.success) return result;
    }
    if (!query || query.trim() === "") {
      return { success: true, data: accounts.value };
    }
    const lowerQuery = query.toLowerCase().trim();
    const filtered = accounts.value.filter((account) => {
      const codeMatch = account.accountCode.toLowerCase().includes(lowerQuery);
      const nameMatch = account.accountName.toLowerCase().includes(lowerQuery);
      const typeMatch = account.accountType.toLowerCase().includes(lowerQuery);
      return codeMatch || nameMatch || typeMatch;
    });
    return { success: true, data: filtered };
  }
  function getAccountById(accountId) {
    return accounts.value.find((acc) => acc.id === accountId);
  }
  return {
    isLoading,
    accounts,
    fetchAccounts,
    searchAccounts,
    formatAccountDisplay,
    getAccountById,
  };
}

export { SearchSelect as S, useChartOfAccounts as u };
//# sourceMappingURL=useChartOfAccounts-D5i9Gq00.mjs.map
