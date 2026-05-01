import { _ as T } from "./DXifQ5ls.js";
import { c as _ } from "./DrxnuvjT.js";
import { T as H } from "./DrUezNjA.js";
import { T as X } from "./DxiaezoG.js";
import {
  e as L,
  q as S,
  R as l,
  $ as v,
  K as t,
  Q as e,
  O as F,
  a9 as Z,
  T as d,
  S as O,
  _ as a,
  a2 as o,
  al as ee,
  P as w,
  l as te,
  a0 as A,
  a1 as k,
  V as C,
  r as h,
  d as se,
  ad as oe,
  o as ae,
  U as E,
  a3 as I,
  aa as M,
} from "./D9q6143x.js";
import { C as V } from "./M8y9e51z.js";
import { C as ne } from "./DnWmaOSL.js";
import { C as U } from "./DD8oliij.js";
import { S as Y } from "./BsM_H8Mt.js";
import { E as re } from "./D__u8pJn.js";
import { o as le } from "./CpiYPBe4.js";
import { C as B } from "./C22E21xF.js";
import { D as ie } from "./BgSnr_43.js";
import { W as de } from "./CCD4SlHB.js";
import { R as ce } from "./ByE3J7Q6.js";
import { F as z } from "./CJ5hAAEc.js";
import { P as ue } from "./CWUm5Boh.js";
import { A as me } from "./BJTICGsx.js";
const pe = { class: "flex items-center gap-3" },
  fe = { class: "flex items-end gap-2" },
  xe = { class: "text-2xl font-bold tracking-tight" },
  ge = L({
    __name: "StatCard",
    props: {
      title: {},
      value: {},
      change: {},
      changeLabel: {},
      icon: {},
      variant: { default: "default" },
    },
    setup(g) {
      const n = g,
        m = S(() => n.change && n.change > 0);
      return (f, p) => (
        a(),
        l(
          "div",
          {
            class: v(
              t(_)(
                "card-stat p-4 rounded-xl border border-border flex flex-col gap-4  justify-between transition-all duration-300 hover:shadow-md",
                n.variant === "primary"
                  ? "bg-[#012D5A] text-white border-[#012D5A]"
                  : "bg-card text-card-foreground",
              ),
            ),
          },
          [
            e("div", pe, [
              e(
                "div",
                {
                  class: v(
                    t(_)("p-2 rounded-lg", n.variant === "primary" ? "bg-white/10" : "bg-muted"),
                  ),
                },
                [
                  (a(),
                  F(
                    Z(n.icon),
                    {
                      class: v(
                        t(_)(
                          "w-5 h-5",
                          n.variant === "primary" ? "text-white" : "text-muted-foreground",
                        ),
                      ),
                    },
                    null,
                    8,
                    ["class"],
                  )),
                ],
                2,
              ),
              e(
                "p",
                {
                  class: v(
                    t(_)(
                      "text-sm font-medium",
                      n.variant === "primary" ? "text-white/80" : "text-muted-foreground",
                    ),
                  ),
                },
                d(n.title),
                3,
              ),
            ]),
            e("div", null, [
              e("div", fe, [
                e("h3", xe, d(n.value), 1),
                n.change !== void 0
                  ? (a(),
                    l(
                      "div",
                      {
                        key: 0,
                        class: v(
                          t(_)(
                            "flex items-center gap-1 text-xs font-medium mb-1",
                            t(m) ? "text-emerald-500" : "text-rose-500",
                          ),
                        ),
                      },
                      [
                        t(m)
                          ? (a(), F(t(H), { key: 0, class: "w-4 h-4" }))
                          : (a(), F(t(X), { key: 1, class: "w-3 h-3" })),
                        e(
                          "span",
                          null,
                          d(Math.abs(n.change).toString().replace(".", ",")) + "%",
                          1,
                        ),
                        n.changeLabel
                          ? (a(),
                            l(
                              "p",
                              {
                                key: 2,
                                class: v(
                                  t(_)(
                                    "text-xs mt-1",
                                    n.variant === "primary"
                                      ? "text-white/50"
                                      : "text-muted-foreground",
                                  ),
                                ),
                              },
                              d(n.changeLabel),
                              3,
                            ))
                          : O("", !0),
                      ],
                      2,
                    ))
                  : O("", !0),
              ]),
            ]),
          ],
          2,
        )
      );
    },
  }),
  be = Object.assign(ge, { __name: "DashboardStatCard" }),
  he = {
    class: "h-full flex flex-col pt-6 px-6 bg-card rounded-xl border border-border shadow-sm",
  },
  ve = { class: "flex-1 w-full min-h-[300px]" },
  _e = L({
    __name: "RevenueChart",
    props: { data: {} },
    setup(g) {
      const n = g,
        m = S(() => [
          {
            name: "Income",
            data: n.data?.income || [5, 15, 10, 18, 25, 22, 35, 28, 24, 30, 28, 25],
          },
          {
            name: "Outcome",
            data: n.data?.outcome || [15, 22, 20, 25, 30, 45, 55, 45, 40, 58, 62, 55],
          },
        ]),
        f = S(() => ({
          chart: { type: "area", height: 300, toolbar: { show: !1 }, fontFamily: "inherit" },
          colors: ["#012D5A", "#EF4444"],
          fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
          },
          dataLabels: { enabled: !1 },
          stroke: { curve: "smooth", width: 2 },
          markers: {
            size: 4,
            colors: ["#fff"],
            strokeColors: ["#012D5A", "#EF4444"],
            strokeWidth: 2,
            hover: { size: 6 },
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
            axisBorder: { show: !1 },
            axisTicks: { show: !1 },
            labels: { style: { colors: "#64748b", fontSize: "12px" } },
          },
          yaxis: {
            max: 100,
            tickAmount: 5,
            labels: { style: { colors: "#64748b", fontSize: "12px" } },
          },
          grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
            yaxis: { lines: { show: !0 } },
            xaxis: { lines: { show: !1 } },
            padding: { top: 0, right: 0, bottom: 0, left: 10 },
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            offsetY: -20,
            markers: { radius: 12 },
            itemMargin: { horizontal: 10 },
          },
          tooltip: {
            y: {
              formatter: function (p) {
                return "Rp " + p + "jt";
              },
            },
          },
        }));
      return (p, i) => {
        const r = te("apexchart"),
          c = ee;
        return (
          a(),
          l("div", he, [
            i[0] ||
              (i[0] = e(
                "div",
                { class: "mb-2" },
                [e("h3", { class: "font-semibold text-lg" }, "Financial Overview")],
                -1,
              )),
            e("div", ve, [
              o(c, null, {
                default: w(() => [
                  o(
                    r,
                    { type: "area", height: "320", options: f.value, series: m.value },
                    null,
                    8,
                    ["options", "series"],
                  ),
                ]),
                _: 1,
              }),
            ]),
          ])
        );
      };
    },
  }),
  ye = Object.assign(_e, { __name: "DashboardRevenueChart" }),
  we = { class: "h-full flex flex-col" },
  De = { class: "flex items-center justify-between mb-4" },
  $e = { key: 0, class: "flex-1 flex flex-col items-center justify-center text-center py-8" },
  Ae = { key: 1, class: "space-y-4 flex-1 overflow-auto pr-2" },
  ke = { class: "flex items-center justify-between mb-1" },
  Ce = { class: "font-semibold text-foreground" },
  Se = { class: "text-sm text-foreground/70 mb-3" },
  Re = { class: "flex items-center gap-1.5 text-xs text-amber-500 font-medium" },
  je = L({
    __name: "UpcomingActivities",
    props: { events: {} },
    setup(g) {
      const n = g,
        m = S(() => n.events || []);
      return (f, p) => {
        const i = T;
        return (
          a(),
          l("div", we, [
            e("div", De, [
              p[1] || (p[1] = e("h3", { class: "font-semibold text-lg" }, "Upcoming Event", -1)),
              o(
                i,
                {
                  to: "/operational/jobs",
                  class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
                },
                { default: w(() => [...(p[0] || (p[0] = [C(" View All ", -1)]))]), _: 1 },
              ),
            ]),
            t(m).length === 0
              ? (a(),
                l("div", $e, [
                  o(t(V), { class: "w-10 h-10 text-muted-foreground/40 mb-3" }),
                  p[2] ||
                    (p[2] = e(
                      "p",
                      { class: "text-sm font-medium text-muted-foreground" },
                      "No upcoming activities",
                      -1,
                    )),
                  p[3] ||
                    (p[3] = e(
                      "p",
                      { class: "text-xs text-muted-foreground/60 mt-1" },
                      " Activities will appear here when scheduled ",
                      -1,
                    )),
                ]))
              : (a(),
                l("div", Ae, [
                  (a(!0),
                  l(
                    A,
                    null,
                    k(
                      t(m),
                      (r) => (
                        a(),
                        l(
                          "div",
                          {
                            key: r.id,
                            class:
                              "p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer",
                          },
                          [
                            e("div", ke, [
                              e("p", Ce, d(r.title), 1),
                              o(t(ne), { class: "w-4 h-4 text-muted-foreground" }),
                            ]),
                            e("p", Se, d(r.description), 1),
                            e("div", Re, [
                              o(t(U), { class: "w-3.5 h-3.5" }),
                              e("span", null, d(r.time), 1),
                            ]),
                          ],
                        )
                      ),
                    ),
                    128,
                  )),
                ])),
          ])
        );
      };
    },
  }),
  Ne = Object.assign(je, { __name: "DashboardUpcomingActivities" }),
  Oe = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  Le = { class: "flex items-center justify-between p-5 border-b border-border" },
  Je = { key: 0, class: "flex flex-col items-center justify-center text-center py-12" },
  Pe = { key: 1, class: "overflow-x-auto" },
  Fe = { class: "w-full" },
  Be = { class: "py-3 px-4" },
  Te = { class: "text-sm font-medium text-[#012D5A]" },
  Ee = { class: "py-3 px-4 text-sm" },
  Ie = { class: "py-3 px-4 text-sm" },
  Me = { class: "py-3 px-4 text-sm" },
  ze = { class: "py-3 px-4" },
  Ve = { class: "py-3 px-4" },
  Ue = { class: "py-3 px-4 text-right" },
  Ye = L({
    __name: "RecentJobs",
    props: { jobs: {} },
    setup(g) {
      const n = g,
        m = S(() => n.jobs || []),
        f = {
          Active: { label: "Active", className: "text-blue-600 border-blue-200 bg-blue-50 border" },
          Pending: {
            label: "Pending",
            className: "text-yellow-600 border-yellow-200 bg-yellow-50 border",
          },
          Canceled: {
            label: "Canceled",
            className: "text-red-600 border-red-200 bg-red-50 border",
          },
          Done: {
            label: "Done",
            className: "text-emerald-600 border-emerald-200 bg-emerald-50 border",
          },
        };
      return (p, i) => {
        const r = T;
        return (
          a(),
          l("div", Oe, [
            e("div", Le, [
              i[1] ||
                (i[1] = e(
                  "h3",
                  { class: "text-lg font-semibold text-foreground" },
                  "Recent Jobs",
                  -1,
                )),
              o(
                r,
                {
                  to: "/operational/jobs",
                  class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
                },
                { default: w(() => [...(i[0] || (i[0] = [C(" View All ", -1)]))]), _: 1 },
              ),
            ]),
            t(m).length === 0
              ? (a(),
                l("div", Je, [
                  o(t(Y), { class: "w-10 h-10 text-muted-foreground/40 mb-3" }),
                  i[2] ||
                    (i[2] = e(
                      "p",
                      { class: "text-sm font-medium text-muted-foreground" },
                      "No recent jobs",
                      -1,
                    )),
                  i[3] ||
                    (i[3] = e(
                      "p",
                      { class: "text-xs text-muted-foreground/60 mt-1" },
                      "Jobs will appear here when created",
                      -1,
                    )),
                ]))
              : (a(),
                l("div", Pe, [
                  e("table", Fe, [
                    i[4] ||
                      (i[4] = e(
                        "thead",
                        null,
                        [
                          e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "No. Job",
                            ),
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "Customer",
                            ),
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "Route",
                            ),
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "ETA",
                            ),
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "Type",
                            ),
                            e(
                              "th",
                              { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                              "Status",
                            ),
                            e("th", {
                              class: "py-3 px-4 text-right text-sm font-medium text-gray-500 w-10",
                            }),
                          ]),
                        ],
                        -1,
                      )),
                    e("tbody", null, [
                      (a(!0),
                      l(
                        A,
                        null,
                        k(
                          t(m),
                          (c) => (
                            a(),
                            l(
                              "tr",
                              {
                                key: c.id,
                                class:
                                  "border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors",
                              },
                              [
                                e("td", Be, [e("span", Te, d(c.jobNumber), 1)]),
                                e("td", Ee, d(c.customer), 1),
                                e("td", Ie, d(c.origin) + " → " + d(c.destination), 1),
                                e("td", Me, d(c.date), 1),
                                e("td", ze, [
                                  e(
                                    "span",
                                    {
                                      class: v(
                                        t(_)(
                                          "text-xs px-2 py-1 rounded font-medium",
                                          c.type === "Export"
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-green-100 text-green-600",
                                        ),
                                      ),
                                    },
                                    d(c.type),
                                    3,
                                  ),
                                ]),
                                e("td", Ve, [
                                  e(
                                    "span",
                                    {
                                      class: v(
                                        t(_)(
                                          "text-xs px-3 py-1 rounded-full border font-medium",
                                          f[c.status]?.className,
                                        ),
                                      ),
                                    },
                                    d(f[c.status]?.label),
                                    3,
                                  ),
                                ]),
                                e("td", Ue, [
                                  o(
                                    r,
                                    {
                                      to: `/operational/jobs?id=${c.id}`,
                                      class:
                                        "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                                    },
                                    { default: w(() => [o(t(re), { class: "w-4 h-4" })]), _: 1 },
                                    8,
                                    ["to"],
                                  ),
                                ]),
                              ],
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                ])),
          ])
        );
      };
    },
  }),
  qe = Object.assign(Ye, { __name: "DashboardRecentJobs" }),
  We = () => {
    const g = se(),
      n = h(null),
      m = h([]),
      f = h(!1),
      p = async (x) => {
        f.value = !0;
        try {
          const b = x ? `?${new URLSearchParams(x).toString()}` : "";
          return await $fetch(`${g.public.apiBase}/admin/dashboard${b}`, {
            credentials: "include",
          });
        } catch (b) {
          return (console.error("Failed to fetch dashboard data:", b), null);
        } finally {
          f.value = !1;
        }
      },
      i = async () => {
        f.value = !0;
        try {
          const x = await $fetch(`${g.public.apiBase}/dashboard/stats`, { credentials: "include" });
          n.value = x;
        } catch (x) {
          console.error("Failed to fetch owner stats:", x);
        } finally {
          f.value = !1;
        }
      },
      r = async () => {
        f.value = !0;
        try {
          const x = await $fetch(`${g.public.apiBase}/dashboard/pending-approvals`, {
            credentials: "include",
          });
          m.value = x;
        } catch (x) {
          console.error("Failed to fetch pending approvals:", x);
        } finally {
          f.value = !1;
        }
      };
    return {
      stats: n,
      pendingApprovals: m,
      isLoading: f,
      fetchDashboard: p,
      fetchStats: i,
      fetchPendingApprovals: r,
      approveBl: async (x) => {
        try {
          const b = await $fetch(`${g.public.apiBase}/operational/jobs/bl/${x}/finalize`, {
            method: "POST",
            credentials: "include",
          });
          return b.success
            ? (await r(), { success: !0 })
            : { success: !1, error: b.error || "Failed to approve BL" };
        } catch (b) {
          return { success: !1, error: b?.data?.message || "An error occurred" };
        }
      },
    };
  },
  Qe = { class: "space-y-6 animate-fade-in p-6" },
  Ke = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4" },
  Ge = { class: "flex items-center gap-2" },
  He = { class: "text-foreground font-semibold" },
  Xe = {
    key: 0,
    class:
      "absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-border z-50 animate-in fade-in zoom-in-95",
  },
  Ze = { class: "p-4 space-y-4" },
  et = { class: "space-y-2" },
  tt = { class: "flex items-center gap-2" },
  st = { class: "flex-1 text-center font-medium" },
  ot = { class: "space-y-2" },
  at = ["value"],
  nt = { class: "space-y-2" },
  rt = ["value"],
  lt = {
    class:
      "flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors",
  },
  it = {
    key: 0,
    class:
      "border border-border rounded-xl bg-white overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500",
  },
  dt = { class: "flex items-center justify-between p-5 border-b border-border" },
  ct = { class: "flex items-center gap-2" },
  ut = { class: "ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md" },
  mt = { class: "divide-y divide-border" },
  pt = { class: "flex items-center gap-4" },
  ft = {
    class:
      "p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform",
  },
  xt = { class: "flex items-center gap-2" },
  gt = { class: "font-semibold text-foreground" },
  bt = { class: "text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase" },
  ht = { class: "text-xs text-muted-foreground flex items-center gap-1 mt-1" },
  vt = { class: "flex items-center gap-2" },
  _t = { key: 1, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  yt = { key: 2, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  wt = { class: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
  Dt = { class: "lg:col-span-2" },
  zt = L({
    __name: "dashboard",
    setup(g) {
      const { fetchDashboard: n, pendingApprovals: m, fetchPendingApprovals: f } = We(),
        { canApproveJobs: p } = oe(),
        i = h(!0),
        r = h(null),
        c = h(!1),
        x = h(null),
        b = new Date().getFullYear(),
        D = h(0),
        R = h(11),
        $ = h(b),
        J = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        q = S(() => {
          const y = J[D.value],
            s = J[R.value];
          return `${y} - ${s}, ${$.value}`;
        }),
        W = async () => {
          ((c.value = !1), (i.value = !0));
          const y = new Date($.value, D.value, 1),
            s = new Date($.value, R.value + 1, 0, 23, 59, 59),
            j = { startDate: y.toISOString(), endDate: s.toISOString() };
          ((r.value = await n(j)), (i.value = !1));
        };
      return (
        le(x, () => {
          c.value = !1;
        }),
        ae(async () => {
          i.value = !0;
          const y = [
            n().then((s) => {
              r.value = s;
            }),
          ];
          (p.value && y.push(f()), await Promise.all(y), (i.value = !1));
        }),
        (y, s) => {
          const j = T,
            P = be,
            Q = ye,
            K = Ne,
            G = qe;
          return (
            a(),
            l("div", Qe, [
              e("div", Ke, [
                s[12] ||
                  (s[12] = e("h1", { class: "page-title text-2xl font-bold" }, "Dashboard", -1)),
                e("div", Ge, [
                  e(
                    "div",
                    { ref_key: "periodDropdownRef", ref: x, class: "relative" },
                    [
                      e(
                        "button",
                        {
                          class:
                            "flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors",
                          onClick: s[0] || (s[0] = (u) => (c.value = !t(c))),
                        },
                        [
                          o(t(V), { class: "w-4 h-4 text-muted-foreground" }),
                          e("span", null, [
                            s[5] || (s[5] = C("Time Period: ", -1)),
                            e("span", He, d(t(q)), 1),
                          ]),
                          o(
                            t(B),
                            {
                              class: v([
                                "w-4 h-4 text-muted-foreground transition-transform",
                                { "rotate-180": t(c) },
                              ]),
                            },
                            null,
                            8,
                            ["class"],
                          ),
                        ],
                      ),
                      t(c)
                        ? (a(),
                          l("div", Xe, [
                            e("div", Ze, [
                              s[9] ||
                                (s[9] = e(
                                  "h3",
                                  { class: "font-semibold text-foreground" },
                                  "Select Period",
                                  -1,
                                )),
                              e("div", et, [
                                s[6] ||
                                  (s[6] = e(
                                    "label",
                                    {
                                      class: "text-xs font-medium text-muted-foreground uppercase",
                                    },
                                    "Year",
                                    -1,
                                  )),
                                e("div", tt, [
                                  e(
                                    "button",
                                    {
                                      class: "p-1 rounded hover:bg-muted transition-colors",
                                      onClick: s[1] || (s[1] = (u) => $.value--),
                                    },
                                    [o(t(B), { class: "w-4 h-4 rotate-90" })],
                                  ),
                                  e("span", st, d(t($)), 1),
                                  e(
                                    "button",
                                    {
                                      class: "p-1 rounded hover:bg-muted transition-colors",
                                      onClick: s[2] || (s[2] = (u) => $.value++),
                                    },
                                    [o(t(B), { class: "w-4 h-4 -rotate-90" })],
                                  ),
                                ]),
                              ]),
                              e("div", ot, [
                                s[7] ||
                                  (s[7] = e(
                                    "label",
                                    {
                                      class: "text-xs font-medium text-muted-foreground uppercase",
                                    },
                                    "Start Month",
                                    -1,
                                  )),
                                E(
                                  e(
                                    "select",
                                    {
                                      "onUpdate:modelValue":
                                        s[3] || (s[3] = (u) => (M(D) ? (D.value = u) : null)),
                                      class:
                                        "w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none",
                                    },
                                    [
                                      (a(),
                                      l(
                                        A,
                                        null,
                                        k(J, (u, N) =>
                                          e("option", { key: N, value: N }, d(u), 9, at),
                                        ),
                                        64,
                                      )),
                                    ],
                                    512,
                                  ),
                                  [[I, t(D)]],
                                ),
                              ]),
                              e("div", nt, [
                                s[8] ||
                                  (s[8] = e(
                                    "label",
                                    {
                                      class: "text-xs font-medium text-muted-foreground uppercase",
                                    },
                                    "End Month",
                                    -1,
                                  )),
                                E(
                                  e(
                                    "select",
                                    {
                                      "onUpdate:modelValue":
                                        s[4] || (s[4] = (u) => (M(R) ? (R.value = u) : null)),
                                      class:
                                        "w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none",
                                    },
                                    [
                                      (a(),
                                      l(
                                        A,
                                        null,
                                        k(J, (u, N) =>
                                          e("option", { key: N, value: N }, d(u), 9, rt),
                                        ),
                                        64,
                                      )),
                                    ],
                                    512,
                                  ),
                                  [[I, t(R)]],
                                ),
                              ]),
                              e(
                                "button",
                                {
                                  class:
                                    "w-full px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors",
                                  onClick: W,
                                },
                                " Apply ",
                              ),
                            ]),
                          ]))
                        : O("", !0),
                    ],
                    512,
                  ),
                  e("button", lt, [
                    o(t(ie), { class: "w-4 h-4 text-muted-foreground" }),
                    s[10] || (s[10] = e("span", null, "Export", -1)),
                  ]),
                  o(
                    j,
                    {
                      to: "/operational/jobs/create",
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors",
                    },
                    {
                      default: w(() => [
                        o(t(ue), { class: "w-4 h-4" }),
                        s[11] || (s[11] = e("span", null, "Quick Add", -1)),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
              ]),
              t(p) && t(m).length > 0
                ? (a(),
                  l("div", it, [
                    e("div", dt, [
                      e("div", ct, [
                        s[13] ||
                          (s[13] = e(
                            "div",
                            { class: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" },
                            null,
                            -1,
                          )),
                        s[14] ||
                          (s[14] = e(
                            "h3",
                            { class: "text-lg font-semibold text-foreground" },
                            "Pending BL Approvals",
                            -1,
                          )),
                        e("span", ut, d(t(m).length) + " Action Required ", 1),
                      ]),
                      t(m).length > 3
                        ? (a(),
                          F(
                            j,
                            {
                              key: 0,
                              to: "/operational/jobs",
                              class: "text-sm font-semibold text-blue-600 hover:text-blue-700",
                            },
                            {
                              default: w(() => [...(s[15] || (s[15] = [C(" View All ", -1)]))]),
                              _: 1,
                            },
                          ))
                        : O("", !0),
                    ]),
                    e("div", mt, [
                      (a(!0),
                      l(
                        A,
                        null,
                        k(
                          t(m).slice(0, 5),
                          (u) => (
                            a(),
                            l(
                              "div",
                              {
                                key: u.id,
                                class:
                                  "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors group",
                              },
                              [
                                e("div", pt, [
                                  e("div", ft, [o(t(z), { class: "w-5 h-5" })]),
                                  e("div", null, [
                                    e("div", xt, [
                                      e("p", gt, d(u.blNumber || "DRAFT BL"), 1),
                                      e("span", bt, d(u.job?.jobNumber), 1),
                                    ]),
                                    e("p", ht, [
                                      o(t(U), { class: "w-3.5 h-3.5" }),
                                      C(
                                        " Requested " +
                                          d(new Date(u.updatedAt).toLocaleDateString()),
                                        1,
                                      ),
                                    ]),
                                  ]),
                                ]),
                                e("div", vt, [
                                  o(
                                    j,
                                    {
                                      to: `/operational/jobs?id=${u.jobId || u.job?.id}&tab=ebl&blId=${u.id}`,
                                      class:
                                        "px-4 py-2 bg-[#012D5A] text-white text-sm font-medium rounded-lg hover:bg-[#012D5A]/90 transition-colors flex items-center gap-2",
                                    },
                                    {
                                      default: w(() => [
                                        s[16] || (s[16] = C(" Review EBL ", -1)),
                                        o(t(me), { class: "w-4 h-4" }),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["to"],
                                  ),
                                ]),
                              ],
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]))
                : O("", !0),
              t(i)
                ? (a(),
                  l("div", _t, [
                    (a(),
                    l(
                      A,
                      null,
                      k(4, (u) =>
                        e(
                          "div",
                          {
                            key: u,
                            class: "card-stat p-4 rounded-xl border border-border animate-pulse",
                          },
                          [
                            ...(s[17] ||
                              (s[17] = [
                                e("div", { class: "h-4 bg-muted rounded w-1/2 mb-3" }, null, -1),
                                e("div", { class: "h-8 bg-muted rounded w-3/4" }, null, -1),
                              ])),
                          ],
                        ),
                      ),
                      64,
                    )),
                  ]))
                : (a(),
                  l("div", yt, [
                    o(
                      P,
                      {
                        title: "Total Income",
                        value: t(r)?.stats?.totalIncome || "Rp0",
                        change: t(r)?.stats?.totalIncomeChange ?? 0,
                        "icon-name": "Wallet",
                        icon: t(de),
                        variant: "primary",
                      },
                      null,
                      8,
                      ["value", "change", "icon"],
                    ),
                    o(
                      P,
                      {
                        title: "Active Job",
                        value: String(t(r)?.stats?.activeJobs || 0),
                        change: t(r)?.stats?.activeJobsChange ?? 0,
                        "change-label": "vs Last Year",
                        icon: t(Y),
                      },
                      null,
                      8,
                      ["value", "change", "icon"],
                    ),
                    o(
                      P,
                      {
                        title: "Invoice Pending",
                        value: String(t(r)?.stats?.pendingInvoices || 0),
                        change: t(r)?.stats?.pendingInvoicesChange ?? 0,
                        "change-label": "vs Last Year",
                        icon: t(ce),
                      },
                      null,
                      8,
                      ["value", "change", "icon"],
                    ),
                    o(
                      P,
                      {
                        title: "Active Offer",
                        value: String(t(r)?.stats?.activeOffers || 0),
                        change: t(r)?.stats?.activeOffersChange ?? 0,
                        "change-label": "vs Last Year",
                        icon: t(z),
                      },
                      null,
                      8,
                      ["value", "change", "icon"],
                    ),
                  ])),
              e("div", wt, [
                e("div", Dt, [o(Q, { data: t(r)?.financialOverview }, null, 8, ["data"])]),
                e("div", null, [o(K, { events: t(r)?.upcomingEvents }, null, 8, ["events"])]),
              ]),
              o(G, { jobs: t(r)?.recentJobs }, null, 8, ["jobs"]),
            ])
          );
        }
      );
    },
  });
export { zt as default };
