import { defineComponent, watch, ref, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderAttr,
  ssrRenderList,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderClass,
} from "vue/server-renderer";
import { g as useAuth, a as useRouter, u as useRuntimeConfig } from "./server.mjs";
import { a as formatDateTime } from "./utils-C_kyg7_s.mjs";
import { useDebounceFn } from "@vueuse/core";
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
import "clsx";
import "tailwind-merge";

function getApiBase() {
  const config = useRuntimeConfig();
  return config.public.apiBase;
}
async function getActivityLogs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.organizationId) params.append("organizationId", filters.organizationId);
  if (filters.action) params.append("action", filters.action);
  if (filters.targetModel) params.append("targetModel", filters.targetModel);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.search) params.append("search", filters.search);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  const response = await $fetch(`${getApiBase()}/admin/activity-logs?${params.toString()}`, {
    credentials: "include",
  });
  return response;
}
function getActionLabel(action) {
  const labels = {
    LOGIN: "Login",
    LOGOUT: "Logout",
    LOGIN_FAILED: "Login Failed",
    CREATE: "Created",
    READ: "Viewed",
    UPDATE: "Updated",
    DELETE: "Deleted",
    EXPORT: "Exported",
    IMPORT: "Imported",
    APPROVE: "Approved",
    REJECT: "Rejected",
    SUBMIT: "Submitted",
    CANCEL: "Cancelled",
    CLOSE: "Closed",
    OPEN: "Opened",
    ARCHIVE: "Archived",
    RESTORE: "Restored",
  };
  return labels[action] || action;
}
function getActionColor(action) {
  const colors = {
    LOGIN: "text-green-600 bg-green-50",
    LOGOUT: "text-gray-600 bg-gray-50",
    LOGIN_FAILED: "text-red-600 bg-red-50",
    CREATE: "text-blue-600 bg-blue-50",
    READ: "text-gray-600 bg-gray-50",
    UPDATE: "text-yellow-600 bg-yellow-50",
    DELETE: "text-red-600 bg-red-50",
    EXPORT: "text-purple-600 bg-purple-50",
    IMPORT: "text-indigo-600 bg-indigo-50",
    APPROVE: "text-green-600 bg-green-50",
    REJECT: "text-red-600 bg-red-50",
    SUBMIT: "text-blue-600 bg-blue-50",
    CANCEL: "text-gray-600 bg-gray-50",
    CLOSE: "text-orange-600 bg-orange-50",
    OPEN: "text-green-600 bg-green-50",
    ARCHIVE: "text-gray-600 bg-gray-50",
    RESTORE: "text-blue-600 bg-blue-50",
  };
  return colors[action] || "text-gray-600 bg-gray-50";
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const ACTION_CATEGORIES = [
      { value: "", label: "All Actions" },
      { value: "LOGIN", label: "Login" },
      { value: "LOGOUT", label: "Logout" },
      { value: "LOGIN_FAILED", label: "Login Failed" },
      { value: "CRUD", label: "CRUD Operations" },
      { value: "DATA", label: "Data Actions" },
    ];
    const actionCategoryMap = {
      CRUD: ["CREATE", "READ", "UPDATE", "DELETE"],
      DATA: [
        "EXPORT",
        "IMPORT",
        "APPROVE",
        "REJECT",
        "SUBMIT",
        "CANCEL",
        "CLOSE",
        "OPEN",
        "ARCHIVE",
        "RESTORE",
      ],
    };
    const TARGET_MODELS = [
      { value: "", label: "All Models" },
      { value: "User", label: "User" },
      { value: "Company", label: "Company" },
      { value: "Vessel", label: "Vessel" },
      { value: "Job", label: "Job" },
      { value: "Invoice", label: "Invoice" },
      { value: "Quotation", label: "Quotation" },
      { value: "EBL", label: "EBL" },
      { value: "JournalEntry", label: "Journal Entry" },
      { value: "Tax", label: "Tax" },
      { value: "Expense", label: "Expense" },
      { value: "Role", label: "Role" },
    ];
    const { user, session } = useAuth();
    const router = useRouter();
    watch(
      user,
      (newUser) => {
        if (!newUser) {
          router.push("/login");
        }
      },
      { immediate: true },
    );
    const logs = ref([]);
    const isLoading = ref(true);
    const pagination = ref({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
    const filters = ref({
      actionCategory: "",
      targetModel: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    function parseUA(ua) {
      if (!ua) return "Unknown Device";
      let os = "Unknown OS";
      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Mac OS")) os = "macOS";
      else if (ua.includes("iPhone")) os = "iPhone";
      else if (ua.includes("iPad")) os = "iPad";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("Linux")) os = "Linux";
      let browser = "Unknown Browser";
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";
      else if (ua.includes("Opera")) browser = "Opera";
      return `${os} • ${browser}`;
    }
    const getActionsForCategory = (category) => {
      return actionCategoryMap[category] || [];
    };
    async function fetchLogs() {
      isLoading.value = true;
      try {
        let actionValue = void 0;
        const category = filters.value.actionCategory;
        if (category && category !== "CRUD" && category !== "DATA") {
          actionValue = category;
        }
        const response = await getActivityLogs({
          action: actionValue,
          targetModel: filters.value.targetModel || void 0,
          startDate: filters.value.startDate || void 0,
          endDate: filters.value.endDate || void 0,
          search: filters.value.search || void 0,
          page: pagination.value.page,
          limit: pagination.value.limit,
          organizationId: session.value?.activeOrganizationId,
        });
        let filteredLogs = response.logs;
        if (category === "CRUD" || category === "DATA") {
          const allowedActions = getActionsForCategory(category);
          filteredLogs = response.logs.filter((log) => allowedActions.includes(log.action));
        }
        logs.value = filteredLogs;
        pagination.value = response.pagination;
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        isLoading.value = false;
      }
    }
    const debouncedFetchLogs = useDebounceFn(fetchLogs, 300);
    watch(
      [filters],
      () => {
        pagination.value.page = 1;
        debouncedFetchLogs();
      },
      { deep: true },
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "p-6" }, _attrs))}><div class="mb-6"><h1 class="text-2xl font-semibold text-gray-900">Activity Logs</h1><p class="text-sm text-gray-500 mt-1"> Track all user activities including login, data changes, and more </p></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div class="lg:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Search Keywords</label><div class="relative"><span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><div class="i-lucide-search h-4 w-4 text-gray-400"></div></span><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="Search by user, description, or target..." class="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Action Type</label><select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><!--[-->`,
      );
      ssrRenderList(ACTION_CATEGORIES, (cat) => {
        _push(
          `<option${ssrRenderAttr("value", cat.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).actionCategory) ? ssrLooseContain(unref(filters).actionCategory, cat.value) : ssrLooseEqual(unref(filters).actionCategory, cat.value)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`,
        );
      });
      _push(
        `<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Target</label><select class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"><!--[-->`,
      );
      ssrRenderList(TARGET_MODELS, (model) => {
        _push(
          `<option${ssrRenderAttr("value", model.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).targetModel) ? ssrLooseContain(unref(filters).targetModel, model.value) : ssrLooseEqual(unref(filters).targetModel, model.value)) ? " selected" : ""}>${ssrInterpolate(model.label)}</option>`,
        );
      });
      _push(
        `<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">From Date</label><input${ssrRenderAttr("value", unref(filters).startDate)} type="date" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">To Date</label><input${ssrRenderAttr("value", unref(filters).endDate)} type="date" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div><div class="mt-4 flex justify-end gap-2"><button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"> Clear Filters </button></div></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">`,
      );
      if (unref(isLoading)) {
        _push(`<div class="p-8 text-center text-gray-500">Loading activity logs...</div>`);
      } else if (unref(logs).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> No activity logs found </div>`);
      } else {
        _push(
          `<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Time </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> User </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Action </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Target </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Details </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`,
        );
        ssrRenderList(unref(logs), (log) => {
          _push(
            `<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(unref(formatDateTime)(log.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(log.user?.name || "System")}</div><div class="text-xs text-gray-500">${ssrInterpolate(log.user?.email || "")}</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass(
              [
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                unref(getActionColor)(log.action),
              ],
            )}">${ssrInterpolate(unref(getActionLabel)(log.action))}</span></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(log.targetModel || "System")}</div>`,
          );
          if (log.targetName) {
            _push(`<div class="text-xs text-gray-500">${ssrInterpolate(log.targetName)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(
            `</td><td class="px-6 py-4"><div class="text-sm text-gray-900 mb-1">${ssrInterpolate(log.description)}</div><div class="flex flex-wrap gap-x-3 gap-y-1">`,
          );
          if (log.ipAddress) {
            _push(
              `<div class="flex items-center text-xs text-gray-400"><div class="i-lucide-globe h-3 w-3 mr-1"></div> ${ssrInterpolate(log.ipAddress)}</div>`,
            );
          } else {
            _push(`<!---->`);
          }
          if (log.userAgent) {
            _push(
              `<div class="flex items-center text-xs text-gray-400"><div class="i-lucide-monitor h-3 w-3 mr-1"></div> ${ssrInterpolate(parseUA(log.userAgent))}</div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      if (unref(pagination).totalPages > 1) {
        _push(
          `<div class="px-6 py-4 flex items-center justify-between border-t border-gray-200"><div class="text-sm text-gray-500"> Showing ${ssrInterpolate((unref(pagination).page - 1) * unref(pagination).limit + 1)} to ${ssrInterpolate(Math.min(unref(pagination).page * unref(pagination).limit, unref(pagination).total))} of ${ssrInterpolate(unref(pagination).total)} results </div><div class="flex gap-2"><button${ssrIncludeBooleanAttr(unref(pagination).page === 1) ? " disabled" : ""} class="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"> Previous </button><button${ssrIncludeBooleanAttr(unref(pagination).page === unref(pagination).totalPages) ? " disabled" : ""} class="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"> Next </button></div></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/activity-logs/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BuyzPoU4.mjs.map
