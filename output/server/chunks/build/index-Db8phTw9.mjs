import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import { defineComponent, ref, computed, mergeProps, unref, isRef, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrInterpolate,
} from "vue/server-renderer";
import { LayoutList, LayoutGrid, Search, Plus, Loader2 } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import _sfc_main$3 from "./ServiceCreateModal-CaY7_020.mjs";
import _sfc_main$1 from "./ServiceListView-CCgGhho6.mjs";
import _sfc_main$2 from "./ServiceGridView-BmWLe_q5.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import { n as navigateTo } from "./server.mjs";
import "clsx";
import "tailwind-merge";
import "./Modal-DzxIm9v2.mjs";
import "./Combobox-BrxCx0QJ.mjs";
import "@vueuse/core";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { services: servicesList, isLoading, fetchServices, createService } = useServices();
    const searchQuery = ref("");
    const selectedStatus = ref("all");
    const formatPrice = (price) => {
      if (!price) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };
    const parsePrice = (value) => {
      const cleaned = value.replace(/[^\d]/g, "");
      return parseInt(cleaned) || 0;
    };
    const services = computed(() => {
      let filtered = servicesList.value.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        price: formatPrice(s.customerPrice),
        rawPrice: s.customerPrice || 0,
        unit: s.unit?.name || "-",
        unitId: s.unit?.id || "",
        selected: false,
        status: s.isActive ? "Active" : "Inactive",
      }));
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query),
        );
      }
      if (selectedStatus.value !== "all") {
        filtered = filtered.filter(
          (s) => s.status.toLowerCase() === selectedStatus.value.toLowerCase(),
        );
      }
      return filtered;
    });
    const sortField = ref("name");
    const sortDirection = ref("asc");
    const sortedServices = computed(() => {
      const sorted = [...services.value];
      sorted.sort((a, b) => {
        let comparison = 0;
        switch (sortField.value) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "code":
            comparison = a.code.localeCompare(b.code);
            break;
          case "price":
            comparison = a.rawPrice - b.rawPrice;
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }
        return sortDirection.value === "asc" ? comparison : -comparison;
      });
      return sorted;
    });
    const toggleSort = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortDirection.value = "asc";
      }
    };
    const viewMode = ref("list");
    const isCreateOpen = ref(false);
    const isSubmitting = ref(false);
    const formError = ref(null);
    const createModalRef = ref(null);
    const handleCreateService = async (formData) => {
      if (!formData.name || !formData.code) {
        formError.value = "Please fill in all required fields (Name, Code)";
        return;
      }
      isSubmitting.value = true;
      formError.value = null;
      const serviceData = {
        name: formData.name,
        code: formData.code,
        vendorPrice: parsePrice(formData.vendorPrice),
        customerPrice: parsePrice(formData.customerPrice),
        currency: formData.currency,
        taxRate: parseFloat(formData.taxRate) || 0,
        unitId: formData.unitId || void 0,
        categoryId: formData.categoryId || void 0,
        isActive: formData.status === "Active",
      };
      const result = await createService(serviceData);
      if (result.success) {
        isCreateOpen.value = false;
        await fetchServices();
      } else {
        formError.value = result.error || "Failed to create service";
      }
      isSubmitting.value = false;
    };
    const handleRowClick = (id) => {
      navigateTo(`/master/services/${id}`);
    };
    const currentPage = ref(1);
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
    });
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchServices();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Services</h1><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "list"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutList), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "grid"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button></div></div></div><div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
      );
      _push(
        ssrRenderComponent(
          unref(Search),
          { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search Service..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><select class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground border border-border"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "all") : ssrLooseEqual(unref(selectedStatus), "all")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "active") : ssrLooseEqual(unref(selectedStatus), "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "inactive") : ssrLooseEqual(unref(selectedStatus), "inactive")) ? " selected" : ""}>Inactive</option></select><button class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap">`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent));
      _push(`<span>New Service</span></button></div></div>`);
      if (unref(isLoading)) {
        _push(`<div class="flex items-center justify-center py-12">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-8 h-8 animate-spin text-[#012D5A]" },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (unref(viewMode) === "list") {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$1),
            {
              services: unref(sortedServices),
              "sort-field": unref(sortField),
              "sort-direction": unref(sortDirection),
              onToggleSort: toggleSort,
              onRowClick: handleRowClick,
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$2),
            {
              services: unref(sortedServices),
              onRowClick: handleRowClick,
            },
            null,
            _parent,
          ),
        );
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(sortedServices).length)} data found.</p>`,
      );
      _push(
        ssrRenderComponent(
          _component_UiPagination,
          {
            page: unref(currentPage),
            "onUpdate:page": [
              ($event) => (isRef(currentPage) ? (currentPage.value = $event) : null),
              handlePageChange,
            ],
            total: unref(pagination).total,
            "items-per-page": unref(pagination).limit,
          },
          null,
          _parent,
        ),
      );
      _push(`</div>`);
      _push(
        ssrRenderComponent(
          unref(_sfc_main$3),
          {
            ref_key: "createModalRef",
            ref: createModalRef,
            "is-open": unref(isCreateOpen),
            "is-submitting": unref(isSubmitting),
            error: unref(formError),
            "onUpdate:isOpen": (val) => (isCreateOpen.value = val),
            onSubmit: handleCreateService,
          },
          null,
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/services/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Db8phTw9.mjs.map
