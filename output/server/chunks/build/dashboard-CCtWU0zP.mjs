import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  computed,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  createTextVNode,
  resolveDynamicComponent,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderList,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderClass,
  ssrRenderVNode,
} from "vue/server-renderer";
import {
  Calendar,
  ChevronDown,
  Download,
  Plus,
  FileText,
  Clock,
  ArrowRight,
  Wallet,
  Ship,
  Receipt,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Eye,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { g as useAuth, u as useRuntimeConfig, _ as __nuxt_component_1$1 } from "./server.mjs";
import { onClickOutside } from "@vueuse/core";
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
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    value: {},
    change: {},
    changeLabel: {},
    icon: {},
    variant: { default: "default" },
  },
  setup(__props) {
    const props = __props;
    const isPositive = computed(() => props.change && props.change > 0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class: unref(cn)(
                "card-stat p-4 rounded-xl border border-border flex flex-col gap-4  justify-between transition-all duration-300 hover:shadow-md",
                props.variant === "primary"
                  ? "bg-[#012D5A] text-white border-[#012D5A]"
                  : "bg-card text-card-foreground",
              ),
            },
            _attrs,
          ),
        )}><div class="flex items-center gap-3"><div class="${ssrRenderClass(unref(cn)("p-2 rounded-lg", props.variant === "primary" ? "bg-white/10" : "bg-muted"))}">`,
      );
      ssrRenderVNode(
        _push,
        createVNode(
          resolveDynamicComponent(props.icon),
          {
            class: unref(cn)(
              "w-5 h-5",
              props.variant === "primary" ? "text-white" : "text-muted-foreground",
            ),
          },
          null,
        ),
        _parent,
      );
      _push(
        `</div><p class="${ssrRenderClass(
          unref(cn)(
            "text-sm font-medium",
            props.variant === "primary" ? "text-white/80" : "text-muted-foreground",
          ),
        )}">${ssrInterpolate(props.title)}</p></div><div><div class="flex items-end gap-2"><h3 class="text-2xl font-bold tracking-tight">${ssrInterpolate(props.value)}</h3>`,
      );
      if (props.change !== void 0) {
        _push(
          `<div class="${ssrRenderClass(
            unref(cn)(
              "flex items-center gap-1 text-xs font-medium mb-1",
              unref(isPositive) ? "text-emerald-500" : "text-rose-500",
            ),
          )}">`,
        );
        if (unref(isPositive)) {
          _push(ssrRenderComponent(unref(TrendingUp), { class: "w-4 h-4" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(TrendingDown), { class: "w-3 h-3" }, null, _parent));
        }
        _push(
          `<span>${ssrInterpolate(Math.abs(props.change).toString().replace(".", ","))}%</span>`,
        );
        if (props.changeLabel) {
          _push(
            `<p class="${ssrRenderClass(
              unref(cn)(
                "text-xs mt-1",
                props.variant === "primary" ? "text-white/50" : "text-muted-foreground",
              ),
            )}">${ssrInterpolate(props.changeLabel)}</p>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  },
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/dashboard/StatCard.vue",
  );
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$4, { __name: "DashboardStatCard" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RevenueChart",
  __ssrInlineRender: true,
  props: {
    data: {},
  },
  setup(__props) {
    const props = __props;
    computed(() => [
      {
        name: "Income",
        data: props.data?.income || [5, 15, 10, 18, 25, 22, 35, 28, 24, 30, 28, 25],
      },
      {
        name: "Outcome",
        data: props.data?.outcome || [15, 22, 20, 25, 30, 45, 55, 45, 40, 58, 62, 55],
      },
    ]);
    computed(() => ({
      chart: {
        type: "area",
        height: 300,
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },
      colors: ["#012D5A", "#EF4444"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 4,
        colors: ["#fff"],
        strokeColors: ["#012D5A", "#EF4444"],
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        max: 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
          },
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetY: -20,
        markers: {
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "Rp " + val + "jt";
          },
        },
      },
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "h-full flex flex-col pt-6 px-6 bg-card rounded-xl border border-border shadow-sm" }, _attrs))}><div class="mb-2"><h3 class="font-semibold text-lg">Financial Overview</h3></div><div class="flex-1 w-full min-h-[300px]">`,
      );
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/dashboard/RevenueChart.vue",
  );
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$3, { __name: "DashboardRevenueChart" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UpcomingActivities",
  __ssrInlineRender: true,
  props: {
    events: {},
  },
  setup(__props) {
    const props = __props;
    const activities = computed(() => props.events || []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "h-full flex flex-col" }, _attrs))}><div class="flex items-center justify-between mb-4"><h3 class="font-semibold text-lg">Upcoming Event</h3>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs",
            class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View All `);
              } else {
                return [createTextVNode(" View All ")];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
      if (unref(activities).length === 0) {
        _push(`<div class="flex-1 flex flex-col items-center justify-center text-center py-8">`);
        _push(
          ssrRenderComponent(
            unref(Calendar),
            { class: "w-10 h-10 text-muted-foreground/40 mb-3" },
            null,
            _parent,
          ),
        );
        _push(
          `<p class="text-sm font-medium text-muted-foreground">No upcoming activities</p><p class="text-xs text-muted-foreground/60 mt-1"> Activities will appear here when scheduled </p></div>`,
        );
      } else {
        _push(`<div class="space-y-4 flex-1 overflow-auto pr-2"><!--[-->`);
        ssrRenderList(unref(activities), (activity) => {
          _push(
            `<div class="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"><div class="flex items-center justify-between mb-1"><p class="font-semibold text-foreground">${ssrInterpolate(activity.title)}</p>`,
          );
          _push(
            ssrRenderComponent(
              unref(ChevronRight),
              { class: "w-4 h-4 text-muted-foreground" },
              null,
              _parent,
            ),
          );
          _push(
            `</div><p class="text-sm text-foreground/70 mb-3">${ssrInterpolate(activity.description)}</p><div class="flex items-center gap-1.5 text-xs text-amber-500 font-medium">`,
          );
          _push(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(`<span>${ssrInterpolate(activity.time)}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/dashboard/UpcomingActivities.vue",
  );
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$2, { __name: "DashboardUpcomingActivities" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RecentJobs",
  __ssrInlineRender: true,
  props: {
    jobs: {},
  },
  setup(__props) {
    const props = __props;
    const jobs = computed(() => props.jobs || []);
    const statusConfig = {
      Active: { label: "Active", className: "text-blue-600 border-blue-200 bg-blue-50 border" },
      Pending: {
        label: "Pending",
        className: "text-yellow-600 border-yellow-200 bg-yellow-50 border",
      },
      Canceled: { label: "Canceled", className: "text-red-600 border-red-200 bg-red-50 border" },
      Done: {
        label: "Done",
        className: "text-emerald-600 border-emerald-200 bg-emerald-50 border",
      },
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl bg-white overflow-hidden" }, _attrs))}><div class="flex items-center justify-between p-5 border-b border-border"><h3 class="text-lg font-semibold text-foreground">Recent Jobs</h3>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs",
            class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View All `);
              } else {
                return [createTextVNode(" View All ")];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
      if (unref(jobs).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center text-center py-12">`);
        _push(
          ssrRenderComponent(
            unref(Ship),
            { class: "w-10 h-10 text-muted-foreground/40 mb-3" },
            null,
            _parent,
          ),
        );
        _push(
          `<p class="text-sm font-medium text-muted-foreground">No recent jobs</p><p class="text-xs text-muted-foreground/60 mt-1">Jobs will appear here when created</p></div>`,
        );
      } else {
        _push(
          `<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-gray-50/50"><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">No. Job</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Route</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">ETA</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th><th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th><th class="py-3 px-4 text-right text-sm font-medium text-gray-500 w-10"></th></tr></thead><tbody><!--[-->`,
        );
        ssrRenderList(unref(jobs), (job) => {
          _push(
            `<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"><td class="py-3 px-4"><span class="text-sm font-medium text-[#012D5A]">${ssrInterpolate(job.jobNumber)}</span></td><td class="py-3 px-4 text-sm">${ssrInterpolate(job.customer)}</td><td class="py-3 px-4 text-sm">${ssrInterpolate(job.origin)} → ${ssrInterpolate(job.destination)}</td><td class="py-3 px-4 text-sm">${ssrInterpolate(job.date)}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "text-xs px-2 py-1 rounded font-medium",
                job.type === "Export" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600",
              ),
            )}">${ssrInterpolate(job.type)}</span></td><td class="py-3 px-4"><span class="${ssrRenderClass(
              unref(cn)(
                "text-xs px-3 py-1 rounded-full border font-medium",
                statusConfig[job.status]?.className,
              ),
            )}">${ssrInterpolate(statusConfig[job.status]?.label)}</span></td><td class="py-3 px-4 text-right">`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: `/operational/jobs?id=${job.id}`,
                class:
                  "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(
                      ssrRenderComponent(
                        unref(Eye),
                        { class: "w-4 h-4" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                  } else {
                    return [createVNode(unref(Eye), { class: "w-4 h-4" })];
                  }
                }),
                _: 2,
              },
              _parent,
            ),
          );
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/dashboard/RecentJobs.vue",
  );
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "DashboardRecentJobs" });
const useDashboard = () => {
  const config = useRuntimeConfig();
  const stats = ref(null);
  const pendingApprovals = ref([]);
  const isLoading = ref(false);
  const fetchDashboard = async (params) => {
    isLoading.value = true;
    try {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      const data = await $fetch(`${config.public.apiBase}/admin/dashboard${query}`, {
        credentials: "include",
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  const fetchStats = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/dashboard/stats`, {
        credentials: "include",
      });
      stats.value = data;
    } catch (error) {
      console.error("Failed to fetch owner stats:", error);
    } finally {
      isLoading.value = false;
    }
  };
  const fetchPendingApprovals = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/dashboard/pending-approvals`, {
        credentials: "include",
      });
      pendingApprovals.value = data;
    } catch (error) {
      console.error("Failed to fetch pending approvals:", error);
    } finally {
      isLoading.value = false;
    }
  };
  const approveBl = async (id) => {
    try {
      const resp = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}/finalize`, {
        method: "POST",
        credentials: "include",
      });
      if (resp.success) {
        await fetchPendingApprovals();
        return { success: true };
      }
      return { success: false, error: resp.error || "Failed to approve BL" };
    } catch (error) {
      return {
        success: false,
        error: error?.data?.message || "An error occurred",
      };
    }
  };
  return {
    // State
    stats,
    pendingApprovals,
    isLoading,
    // Methods
    fetchDashboard,
    fetchStats,
    fetchPendingApprovals,
    approveBl,
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { pendingApprovals } = useDashboard();
    const { canApproveJobs } = useAuth();
    const loading = ref(true);
    const dashboardData = ref(null);
    const showPeriodDropdown = ref(false);
    const periodDropdownRef = ref(null);
    const currentYear = /* @__PURE__ */ new Date().getFullYear();
    const selectedStartMonth = ref(0);
    const selectedEndMonth = ref(11);
    const selectedYear = ref(currentYear);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const periodDisplay = computed(() => {
      const start = months[selectedStartMonth.value];
      const end = months[selectedEndMonth.value];
      return `${start} - ${end}, ${selectedYear.value}`;
    });
    onClickOutside(periodDropdownRef, () => {
      showPeriodDropdown.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DashboardStatCard = __nuxt_component_1;
      const _component_DashboardRevenueChart = __nuxt_component_2;
      const _component_DashboardUpcomingActivities = __nuxt_component_3;
      const _component_DashboardRecentJobs = __nuxt_component_4;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h1 class="page-title text-2xl font-bold">Dashboard</h1><div class="flex items-center gap-2"><div class="relative"><button class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors">`,
      );
      _push(
        ssrRenderComponent(
          unref(Calendar),
          { class: "w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<span>Time Period: <span class="text-foreground font-semibold">${ssrInterpolate(unref(periodDisplay))}</span></span>`,
      );
      _push(
        ssrRenderComponent(
          unref(ChevronDown),
          {
            class: [
              "w-4 h-4 text-muted-foreground transition-transform",
              { "rotate-180": unref(showPeriodDropdown) },
            ],
          },
          null,
          _parent,
        ),
      );
      _push(`</button>`);
      if (unref(showPeriodDropdown)) {
        _push(
          `<div class="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-border z-50 animate-in fade-in zoom-in-95"><div class="p-4 space-y-4"><h3 class="font-semibold text-foreground">Select Period</h3><div class="space-y-2"><label class="text-xs font-medium text-muted-foreground uppercase">Year</label><div class="flex items-center gap-2"><button class="p-1 rounded hover:bg-muted transition-colors">`,
        );
        _push(
          ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 rotate-90" }, null, _parent),
        );
        _push(
          `</button><span class="flex-1 text-center font-medium">${ssrInterpolate(unref(selectedYear))}</span><button class="p-1 rounded hover:bg-muted transition-colors">`,
        );
        _push(
          ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 -rotate-90" }, null, _parent),
        );
        _push(
          `</button></div></div><div class="space-y-2"><label class="text-xs font-medium text-muted-foreground uppercase">Start Month</label><select class="w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none"><!--[-->`,
        );
        ssrRenderList(months, (month, index) => {
          _push(
            `<option${ssrRenderAttr("value", index)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStartMonth)) ? ssrLooseContain(unref(selectedStartMonth), index) : ssrLooseEqual(unref(selectedStartMonth), index)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`,
          );
        });
        _push(
          `<!--]--></select></div><div class="space-y-2"><label class="text-xs font-medium text-muted-foreground uppercase">End Month</label><select class="w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none"><!--[-->`,
        );
        ssrRenderList(months, (month, index) => {
          _push(
            `<option${ssrRenderAttr("value", index)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEndMonth)) ? ssrLooseContain(unref(selectedEndMonth), index) : ssrLooseEqual(unref(selectedEndMonth), index)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`,
          );
        });
        _push(
          `<!--]--></select></div><button class="w-full px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"> Apply </button></div></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><button class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors">`,
      );
      _push(
        ssrRenderComponent(
          unref(Download),
          { class: "w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(`<span>Export</span></button>`);
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Quick Add</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Quick Add"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(canApproveJobs) && unref(pendingApprovals).length > 0) {
        _push(
          `<div class="border border-border rounded-xl bg-white overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500"><div class="flex items-center justify-between p-5 border-b border-border"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div><h3 class="text-lg font-semibold text-foreground">Pending BL Approvals</h3><span class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">${ssrInterpolate(unref(pendingApprovals).length)} Action Required </span></div>`,
        );
        if (unref(pendingApprovals).length > 3) {
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: "/operational/jobs",
                class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` View All `);
                  } else {
                    return [createTextVNode(" View All ")];
                  }
                }),
                _: 1,
              },
              _parent,
            ),
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="divide-y divide-border"><!--[-->`);
        ssrRenderList(unref(pendingApprovals).slice(0, 5), (bl) => {
          _push(
            `<div class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors group"><div class="flex items-center gap-4"><div class="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">`,
          );
          _push(ssrRenderComponent(unref(FileText), { class: "w-5 h-5" }, null, _parent));
          _push(
            `</div><div><div class="flex items-center gap-2"><p class="font-semibold text-foreground">${ssrInterpolate(bl.blNumber || "DRAFT BL")}</p><span class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase">${ssrInterpolate(bl.job?.jobNumber)}</span></div><p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">`,
          );
          _push(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(
            ` Requested ${ssrInterpolate(new Date(bl.updatedAt).toLocaleDateString())}</p></div></div><div class="flex items-center gap-2">`,
          );
          _push(
            ssrRenderComponent(
              _component_NuxtLink,
              {
                to: `/operational/jobs?id=${bl.jobId || bl.job?.id}&tab=ebl&blId=${bl.id}`,
                class:
                  "px-4 py-2 bg-[#012D5A] text-white text-sm font-medium rounded-lg hover:bg-[#012D5A]/90 transition-colors flex items-center gap-2",
              },
              {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Review EBL `);
                    _push2(
                      ssrRenderComponent(
                        unref(ArrowRight),
                        { class: "w-4 h-4" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                  } else {
                    return [
                      createTextVNode(" Review EBL "),
                      createVNode(unref(ArrowRight), { class: "w-4 h-4" }),
                    ];
                  }
                }),
                _: 2,
              },
              _parent,
            ),
          );
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(
            `<div class="card-stat p-4 rounded-xl border border-border animate-pulse"><div class="h-4 bg-muted rounded w-1/2 mb-3"></div><div class="h-8 bg-muted rounded w-3/4"></div></div>`,
          );
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`);
        _push(
          ssrRenderComponent(
            _component_DashboardStatCard,
            {
              title: "Total Income",
              value: unref(dashboardData)?.stats?.totalIncome || "Rp0",
              change: unref(dashboardData)?.stats?.totalIncomeChange ?? 0,
              "icon-name": "Wallet",
              icon: unref(Wallet),
              variant: "primary",
            },
            null,
            _parent,
          ),
        );
        _push(
          ssrRenderComponent(
            _component_DashboardStatCard,
            {
              title: "Active Job",
              value: String(unref(dashboardData)?.stats?.activeJobs || 0),
              change: unref(dashboardData)?.stats?.activeJobsChange ?? 0,
              "change-label": "vs Last Year",
              icon: unref(Ship),
            },
            null,
            _parent,
          ),
        );
        _push(
          ssrRenderComponent(
            _component_DashboardStatCard,
            {
              title: "Invoice Pending",
              value: String(unref(dashboardData)?.stats?.pendingInvoices || 0),
              change: unref(dashboardData)?.stats?.pendingInvoicesChange ?? 0,
              "change-label": "vs Last Year",
              icon: unref(Receipt),
            },
            null,
            _parent,
          ),
        );
        _push(
          ssrRenderComponent(
            _component_DashboardStatCard,
            {
              title: "Active Offer",
              value: String(unref(dashboardData)?.stats?.activeOffers || 0),
              change: unref(dashboardData)?.stats?.activeOffersChange ?? 0,
              "change-label": "vs Last Year",
              icon: unref(FileText),
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      }
      _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2">`);
      _push(
        ssrRenderComponent(
          _component_DashboardRevenueChart,
          {
            data: unref(dashboardData)?.financialOverview,
          },
          null,
          _parent,
        ),
      );
      _push(`</div><div>`);
      _push(
        ssrRenderComponent(
          _component_DashboardUpcomingActivities,
          {
            events: unref(dashboardData)?.upcomingEvents,
          },
          null,
          _parent,
        ),
      );
      _push(`</div></div>`);
      _push(
        ssrRenderComponent(
          _component_DashboardRecentJobs,
          {
            jobs: unref(dashboardData)?.recentJobs,
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
    "pages/dashboard.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-CCtWU0zP.mjs.map
