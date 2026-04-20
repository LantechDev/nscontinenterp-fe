import { u as useRuntimeConfig } from "./server.mjs";
import { ref, defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderClass,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrRenderComponent,
  ssrRenderList,
} from "vue/server-renderer";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";

function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function handleApiError(error) {
  return { success: false, error: getErrorMessage(error) };
}
function useMasterData() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  async function fetchCompanies() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/companies`, {
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  async function fetchContainerTypes() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/container-types`, {
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  async function fetchPackageTypes() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/package-types`, {
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  async function fetchVessels(query) {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/vessels`, {
        params: { search: query },
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  async function fetchPorts(query) {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/ports`, {
        params: { search: query },
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  async function createCompany(name, address) {
    try {
      isLoading.value = true;
      const data = await $fetch(`${config.public.apiBase}/master/companies`, {
        method: "POST",
        body: {
          name,
          isCustomer: true,
          isVendor: false,
          ...address,
        },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function createVessel(name) {
    try {
      isLoading.value = true;
      const data = await $fetch(`${config.public.apiBase}/master/vessels`, {
        method: "POST",
        body: { name },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchPaymentMethods() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/payment-methods`, {
        credentials: "include",
      });
      return data;
    } catch {
      return [];
    }
  }
  return {
    isLoading,
    fetchCompanies,
    fetchContainerTypes,
    fetchPackageTypes,
    fetchVessels,
    fetchPorts,
    fetchPaymentMethods,
    createCompany,
    createVessel,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DatePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: {},
    disabled: { type: Boolean },
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    const containerRef = ref(null);
    const viewDate = ref(
      props.modelValue ? new Date(props.modelValue) : /* @__PURE__ */ new Date(),
    );
    const formattedDate = computed(() => {
      if (!props.modelValue) return props.placeholder || "Select date...";
      try {
        const date = new Date(props.modelValue);
        return new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date);
      } catch (e) {
        return props.modelValue;
      }
    });
    const currentMonthName = computed(() => {
      return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
        viewDate.value,
      );
    });
    const daysInMonth = computed(() => {
      const year = viewDate.value.getFullYear();
      const month = viewDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      const firstDayIdx = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = firstDayIdx - 1; i >= 0; i--) {
        days.push({
          day: prevMonthLastDay - i,
          month: month - 1,
          year,
          isCurrentMonth: false,
        });
      }
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
          day: i,
          month,
          year,
          isCurrentMonth: true,
        });
      }
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        days.push({
          day: i,
          month: month + 1,
          year,
          isCurrentMonth: false,
        });
      }
      return days;
    });
    const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    function isSelected(d) {
      if (!props.modelValue) return false;
      const sel = new Date(props.modelValue);
      return sel.getDate() === d.day && sel.getMonth() === d.month && sel.getFullYear() === d.year;
    }
    function isToday(d) {
      const today = /* @__PURE__ */ new Date();
      return (
        today.getDate() === d.day && today.getMonth() === d.month && today.getFullYear() === d.year
      );
    }
    onClickOutside(containerRef, () => {
      isOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              ref_key: "containerRef",
              ref: containerRef,
              class: "relative w-full",
            },
            _attrs,
          ),
        )}><button type="button" class="${ssrRenderClass([{ "text-muted-foreground": !__props.modelValue, "ring-2 ring-ring ring-offset-2": unref(isOpen) }, "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-muted/50"])}"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}><span class="truncate">${ssrInterpolate(unref(formattedDate))}</span>`,
      );
      _push(
        ssrRenderComponent(
          unref(Calendar),
          { class: "ml-2 h-4 w-4 shrink-0 opacity-50" },
          null,
          _parent,
        ),
      );
      _push(`</button>`);
      if (unref(isOpen)) {
        _push(
          `<div class="absolute z-[1001] mt-1 w-72 rounded-md border bg-white dark:bg-slate-950 p-3 shadow-lg animate-in fade-in zoom-in-95"><div class="flex items-center justify-between mb-4"><button type="button" class="p-1 hover:bg-muted rounded-md transition-colors">`,
        );
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
        _push(
          `</button><span class="text-sm font-semibold">${ssrInterpolate(unref(currentMonthName))}</span><button type="button" class="p-1 hover:bg-muted rounded-md transition-colors">`,
        );
        _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div><div class="grid grid-cols-7 gap-1 mb-1"><!--[-->`);
        ssrRenderList(dayLabels, (label) => {
          _push(
            `<span class="text-center text-[10px] font-bold text-muted-foreground uppercase py-1">${ssrInterpolate(label)}</span>`,
          );
        });
        _push(`<!--]--></div><div class="grid grid-cols-7 gap-1"><!--[-->`);
        ssrRenderList(unref(daysInMonth), (d, idx) => {
          _push(
            `<button type="button" class="${ssrRenderClass([
              [
                d.isCurrentMonth ? "text-foreground hover:bg-muted" : "text-muted-foreground/40",
                isSelected(d) ? "bg-[#012D5A] text-white hover:bg-[#012D5A]" : "",
                isToday(d) && !isSelected(d) ? "border border-[#012D5A] text-[#012D5A]" : "",
              ],
              "h-8 w-full flex items-center justify-center rounded-md text-xs transition-all",
            ])}">${ssrInterpolate(d.day)}</button>`,
          );
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
    "components/ui/DatePicker.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DatePicker = Object.assign(_sfc_main, { __name: "UiDatePicker" });

export { DatePicker as D, useMasterData as u };
//# sourceMappingURL=DatePicker-I7QCahB1.mjs.map
