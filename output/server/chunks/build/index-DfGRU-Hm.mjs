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
import { LayoutList, LayoutGrid, Search, ChevronDown, Plus, Loader2 } from "lucide-vue-next";
import _sfc_main$1 from "./CompanyList-D7lfcCYm.mjs";
import _sfc_main$2 from "./CompanyGrid-BtmfT20H.mjs";
import _sfc_main$3 from "./CompanyCreateModal-BTEc1Ih0.mjs";
import CompanyDetailModal from "./CompanyDetailModal-Dqa6C3Om.mjs";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import "./Checkbox-BPDemuax.mjs";
import "./Modal-DzxIm9v2.mjs";
import "./CompanySidebar-C5zL0YBH.mjs";
import "./CompanyMainContent-CRL18xQD.mjs";
import "./CompanyActivityTab-CyC0EgTh.mjs";
import "./CompanyJobTab-CfI_QLca.mjs";
import "./CompanyInvoiceTab-DxL6RABJ.mjs";
import "./CompanyAddressTab-CvjBOTg2.mjs";
import "./CompanyNotesTab-BrQDifYh.mjs";
import "./CompanyAddressForm-VBZNMe2f.mjs";
import "./useCompanyAddressForm-5b9x2tuV.mjs";
import "./server.mjs";
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
import "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { companies: companiesList, isLoading, fetchCompanies } = useCompanies();
    const isDetailOpen = ref(false);
    const selectedCompanyDetail = ref(null);
    const openDetailModal = (company) => {
      selectedCompanyDetail.value = company;
      isDetailOpen.value = true;
    };
    const searchQuery = ref("");
    const selectedType = ref("all");
    const selectedStatus = ref("all");
    const companies = computed(() => {
      let filtered = companiesList.value.map((c) => ({
        ...c,
        code: c.code || `CUST-${c.id.slice(0, 6).toUpperCase()}`,
        email: c.email || "-",
        phone: c.phone || "-",
        address: c.addresses?.[0]?.fullAddress || "-",
        type: c.isVendor && c.isCustomer ? "Both" : c.isVendor ? "Vendor" : "Company",
        status: c.isActive ? "Active" : "Inactive",
        totalJobs: 0,
        // TODO: fetch from API
        selected: false,
      }));
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query),
        );
      }
      if (selectedType.value !== "all") {
        filtered = filtered.filter(
          (c) => c.type.toLowerCase() === selectedType.value.toLowerCase(),
        );
      }
      if (selectedStatus.value !== "all") {
        filtered = filtered.filter(
          (c) => c.status.toLowerCase() === selectedStatus.value.toLowerCase(),
        );
      }
      return filtered;
    });
    const sortField = ref("name");
    const sortDirection = ref("asc");
    const sortedCompanies = computed(() => {
      const sorted = [...companies.value];
      sorted.sort((a, b) => {
        let comparison = 0;
        switch (sortField.value) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "code":
            comparison = a.code.localeCompare(b.code);
            break;
          case "type":
            comparison = a.type.localeCompare(b.type);
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
    const currentPage = ref(1);
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
    });
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchCompanies();
    };
    const selectAll = computed({
      get: () => companies.value.length > 0 && companies.value.every((c) => c.selected),
      set: (val) => companies.value.forEach((c) => (c.selected = val)),
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Company</h1><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
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
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search Company..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><div class="relative"><select class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "all") : ssrLooseEqual(unref(selectedType), "all")) ? " selected" : ""}>All Types</option><option value="company"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "company") : ssrLooseEqual(unref(selectedType), "company")) ? " selected" : ""}>Company</option><option value="vendor"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "vendor") : ssrLooseEqual(unref(selectedType), "vendor")) ? " selected" : ""}>Vendor</option><option value="both"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "both") : ssrLooseEqual(unref(selectedType), "both")) ? " selected" : ""}>Both</option></select>`,
      );
      _push(
        ssrRenderComponent(
          unref(ChevronDown),
          {
            class:
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="relative"><select class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "all") : ssrLooseEqual(unref(selectedStatus), "all")) ? " selected" : ""}>All Status</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "active") : ssrLooseEqual(unref(selectedStatus), "active")) ? " selected" : ""}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "inactive") : ssrLooseEqual(unref(selectedStatus), "inactive")) ? " selected" : ""}>Inactive</option></select>`,
      );
      _push(
        ssrRenderComponent(
          unref(ChevronDown),
          {
            class:
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><button class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap">`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent));
      _push(`<span>New Company</span></button></div></div>`);
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
            _sfc_main$1,
            {
              companies: unref(sortedCompanies),
              "sort-field": unref(sortField),
              "sort-direction": unref(sortDirection),
              "select-all": unref(selectAll),
              "onUpdate:sort": toggleSort,
              onOpenDetail: openDetailModal,
              "onUpdate:selectAll": ($event) => (selectAll.value = $event),
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(
          ssrRenderComponent(
            _sfc_main$2,
            {
              companies: unref(sortedCompanies),
              onOpenDetail: openDetailModal,
            },
            null,
            _parent,
          ),
        );
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(sortedCompanies).length)} data found.</p>`,
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
          _sfc_main$3,
          {
            modelValue: unref(isCreateOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isCreateOpen) ? (isCreateOpen.value = $event) : null,
            onRefresh: unref(fetchCompanies),
          },
          null,
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          CompanyDetailModal,
          {
            modelValue: unref(isDetailOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isDetailOpen) ? (isDetailOpen.value = $event) : null,
            company: unref(selectedCompanyDetail),
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
    "pages/master/company/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DfGRU-Hm.mjs.map
