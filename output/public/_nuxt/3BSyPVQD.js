import {
  c as Jt,
  ab as ys,
  f as Ge,
  r as A,
  N as De,
  q as B,
  d as _t,
  M as na,
  o as Ya,
  aj as bs,
  e as ue,
  R as p,
  Q as e,
  a0 as E,
  a1 as N,
  O as ie,
  U as H,
  a2 as Y,
  W as Ke,
  K as t,
  aa as k,
  S as V,
  $ as J,
  T as v,
  a3 as ne,
  V as oe,
  _ as c,
  Y as xs,
  al as Wt,
  P as Pe,
  l as Ea,
  a8 as ws,
  ah as Cs,
  a9 as Ss,
  aI as Ts,
} from "./D9q6143x.js";
import { E as Ba } from "./BS85nYjr.js";
import { g as As, f as ae, c as te } from "./DrxnuvjT.js";
import { u as Ht } from "./BfskLp3w.js";
import { u as $s } from "./CJdNv5wq.js";
import { u as Ds } from "./DivQEVj9.js";
import { _ as Qe } from "./DOOzgCLm.js";
import { _ as ze } from "./Doao-lii.js";
import { S as Ve } from "./DK0cRrZx.js";
import { C as Ye } from "./C22E21xF.js";
import { D as vt } from "./BgSnr_43.js";
import { P as Ra } from "./CWUm5Boh.js";
import { P as Ps } from "./p41O2Qdo.js";
import { T as Fs } from "./DhzAXlPS.js";
import { _ as Is } from "./DXifQ5ls.js";
import { C as ks } from "./C8fnjjG_.js";
import { _ as Os } from "./DhCF3Kco.js";
import { u as Ls } from "./CCv5WdYi.js";
import { C as ra } from "./BoOMJ_MG.js";
import "./DrUezNjA.js";
const Je = Jt("arrow-up-down", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }],
]);
const yt = Jt("funnel", [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i",
    },
  ],
]);
const Ys = Jt("lock", [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
  ]),
  Yt = A("Overview"),
  Es = A("month"),
  la = A(1),
  ia = A(!1);
function Ua() {
  const a = ys(),
    T = Ge();
  (ia.value || (a.query.tab && (Yt.value = a.query.tab), (ia.value = !0)),
    De(Yt, (n) => {
      T.replace({ query: { ...a.query, tab: n } });
    }));
  function i() {
    la.value = 1;
  }
  return { activeTab: Yt, selectedPeriod: Es, currentPage: la, resetPage: i };
}
const Et = A(new Date().getFullYear().toString()),
  Bt = A(""),
  Rt = A(""),
  Ut = A(""),
  da = A("createdAt"),
  ca = A("desc"),
  ut = A(!1),
  qt = A(""),
  ua = A("all"),
  Nt = A(""),
  gt = A(""),
  ga = A("date"),
  pa = A("desc"),
  pt = A(!1),
  jt = A(""),
  ma = A("all"),
  Mt = A(""),
  mt = A(""),
  Gt = A("date"),
  Bs = A("desc"),
  ht = A(!1),
  ha = A("ar"),
  Kt = A(""),
  fa = A("dueDate"),
  va = A("asc"),
  ft = A(!1),
  ya = A("all");
function Rs() {
  return B(() => {
    const a = new Date().getFullYear(),
      T = [];
    for (let i = a; i >= a - 5; i--) T.push(i.toString());
    return T;
  });
}
function Us() {
  return [
    { value: "createdAt", label: "Date" },
    { value: "jobNumber", label: "Job Number" },
    { value: "revenue", label: "Revenue" },
    { value: "cogs", label: "COGS" },
    { value: "profit", label: "Profit" },
    { value: "margin", label: "Margin" },
  ];
}
function qs() {
  return [
    { value: "date", label: "Date" },
    { value: "jobNumber", label: "Job Number" },
    { value: "customer", label: "Customer" },
    { value: "total", label: "Total Amount" },
  ];
}
function Ns() {
  return [
    { value: "all", label: "All" },
    { value: "invoice", label: "Customer Invoice" },
    { value: "payment", label: "Payment Out" },
  ];
}
function js() {
  return [
    { value: "date", label: "Date" },
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "createdAt", label: "Created" },
  ];
}
function Ms() {
  return [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "partial", label: "Partial" },
    { value: "payment_out", label: "Payment Out" },
  ];
}
function Gs() {
  return [
    { value: "dueDate", label: "Due Date" },
    { value: "invoiceNumber", label: "Invoice Number" },
    { value: "company", label: "Company" },
    { value: "total", label: "Total Amount" },
    { value: "remaining", label: "Remaining" },
    { value: "aging", label: "Aging" },
  ];
}
function _e() {
  const { activeTab: a, selectedPeriod: T, currentPage: i, resetPage: n } = Ua();
  return {
    activeTab: a,
    selectedPeriod: T,
    currentPage: i,
    selectedYear: Et,
    searchQuery: Bt,
    cogsCustomerId: Rt,
    cogsServiceId: Ut,
    sortBy: da,
    sortOrder: ca,
    showSortDropdown: ut,
    transactionYear: qt,
    transactionType: ua,
    transactionCustomerId: Nt,
    transactionSearch: gt,
    transactionSortBy: ga,
    transactionSortOrder: pa,
    showTransactionSortDropdown: pt,
    financeCloseYear: jt,
    financeCloseType: ma,
    financeCloseCustomerId: Mt,
    financeCloseSearch: mt,
    financeCloseSortBy: Gt,
    financeCloseSortOrder: Bs,
    showFinanceCloseSortDropdown: ht,
    arApToggle: ha,
    arApSearch: Kt,
    arApSortBy: fa,
    arApSortOrder: va,
    showArApSortDropdown: ft,
    arApStatusFilter: ya,
    getCogsFilters: () => {
      const d = { sortBy: da.value, sortOrder: ca.value, page: i.value, limit: 10 };
      return (
        Bt.value && (d.search = Bt.value),
        Rt.value && (d.companyId = Rt.value),
        Ut.value && (d.serviceId = Ut.value),
        Et.value && (d.year = parseInt(Et.value)),
        d
      );
    },
    getTransactionFilters: () => {
      const d = { sortBy: ga.value, sortOrder: pa.value, type: ua.value, page: i.value, limit: 10 };
      return (
        gt.value && gt.value.trim() && (d.search = gt.value.trim()),
        Nt.value && (d.companyId = Nt.value),
        qt.value && (d.year = parseInt(qt.value)),
        d
      );
    },
    getFinanceCloseFilters: () => {
      const d = {
        sortBy: Gt.value,
        sortOrder: Gt.value === "date" ? "desc" : "asc",
        type: ma.value,
        page: i.value,
        limit: 10,
      };
      return (
        mt.value && mt.value.trim() && (d.search = mt.value.trim()),
        Mt.value && (d.companyId = Mt.value),
        jt.value && (d.year = parseInt(jt.value)),
        d
      );
    },
    getArApFilters: () => {
      const d = {
        type: ha.value,
        sortBy: fa.value,
        sortOrder: va.value,
        status: ya.value,
        page: i.value,
        limit: 10,
      };
      return (Kt.value && (d.search = Kt.value), d);
    },
    resetPage: () => {
      n();
    },
    toggleSortDropdown: () => {
      ut.value = !ut.value;
    },
    toggleTransactionSortDropdown: () => {
      pt.value = !pt.value;
    },
    toggleFinanceCloseSortDropdown: () => {
      ht.value = !ht.value;
    },
    toggleArApSortDropdown: () => {
      ft.value = !ft.value;
    },
    closeAllDropdowns: () => {
      ((ut.value = !1), (pt.value = !1), (ht.value = !1), (ft.value = !1));
    },
  };
}
const X = As;
function Ks(a, T, i) {
  const n = { period: a };
  return (T && (n.year = T), i && Object.assign(n, i), n);
}
const Qt = {
    stats: A(0),
    overview: A(0),
    charts: A(0),
    jobCosts: A(0),
    transactions: A(0),
    transactionStats: A(0),
    financeClose: A(0),
    closedPeriods: A(0),
    arAp: A(0),
    arApStats: A(0),
    assets: A(0),
    assetsStats: A(0),
  },
  ba = A(!1),
  zt = A(null);
function Ce() {
  const T = _t().public.apiBase || "";
  function i(y) {
    return ++Qt[y].value;
  }
  function n(y, w) {
    return w === Qt[y].value;
  }
  function u(y) {
    ba.value = y;
  }
  function h(y, w, g) {
    n(y, w) && (zt.value = g);
  }
  function b(y, w) {
    n(y, w) && (zt.value = null);
  }
  return {
    baseUrl: T,
    requestIds: Qt,
    isLoading: ba,
    error: zt,
    getNextRequestId: i,
    isLatestRequest: n,
    setLoading: u,
    setError: h,
    clearError: b,
    buildQueryParams: Ks,
    getErrorMessage: X,
  };
}
const xa = A(null),
  wa = A(null),
  Ca = A(null);
function Qs() {
  const {
    baseUrl: a,
    getNextRequestId: T,
    isLatestRequest: i,
    setLoading: n,
    setError: u,
    clearError: h,
    buildQueryParams: b,
  } = Ce();
  async function y(C = "month", l) {
    const s = T("stats");
    (n(!0), h("stats", s));
    try {
      const o = b(C, l),
        d = await $fetch(`${a}/finance/dashboard`, {
          method: "GET",
          query: o,
          credentials: "include",
        });
      return (console.log("[FE_TRACE] Stats response:", d), i("stats", s) && (xa.value = d), d);
    } catch (o) {
      const d = X(o);
      return (console.error("Failed to fetch stats:", d), u("stats", s, d), null);
    } finally {
      i("stats", s) && n(!1);
    }
  }
  async function w(C = "month", l) {
    const s = T("overview");
    (n(!0), h("overview", s));
    try {
      const o = b(C, l),
        d = await $fetch(`${a}/finance/dashboard/overview`, {
          method: "GET",
          query: o,
          credentials: "include",
        });
      return (i("overview", s) && (wa.value = d), d);
    } catch (o) {
      const d = X(o);
      return (console.error("Failed to fetch overview stats:", d), u("overview", s, d), null);
    } finally {
      i("overview", s) && n(!1);
    }
  }
  async function g(C = "month", l) {
    const s = T("charts");
    (n(!0), h("charts", s));
    try {
      const o = b(C, l),
        d = await $fetch(`${a}/finance/dashboard/charts`, {
          method: "GET",
          query: o,
          credentials: "include",
        });
      return (i("charts", s) && (Ca.value = d), d);
    } catch (o) {
      const d = X(o);
      return (console.error("Failed to fetch chart data:", d), u("charts", s, d), null);
    } finally {
      i("charts", s) && n(!1);
    }
  }
  return {
    stats: xa,
    overviewStats: wa,
    chartData: Ca,
    fetchStats: y,
    fetchOverviewStats: w,
    fetchChartData: g,
  };
}
const Sa = A([]),
  Ta = A({ page: 1, limit: 10, total: 0, totalPages: 0 });
function zs() {
  const {
    baseUrl: a,
    getNextRequestId: T,
    isLatestRequest: i,
    setLoading: n,
    setError: u,
    clearError: h,
  } = Ce();
  async function b(y = "month", w) {
    const g = T("jobCosts");
    (n(!0), h("jobCosts", g));
    try {
      const C = { period: y, page: w?.page || 1, limit: w?.limit || 10, ...w };
      (delete C.page, delete C.limit, (C.page = w?.page || 1), (C.limit = w?.limit || 10));
      const l = await $fetch(`${a}/finance/dashboard/job-costs`, {
        method: "GET",
        query: C,
        credentials: "include",
      });
      return (
        console.log("[FE_TRACE] Job costs response:", {
          itemCount: l.items?.length,
          total: l.pagination?.total,
        }),
        i("jobCosts", g) &&
          ((Sa.value = l.items || []),
          l.pagination &&
            (Ta.value = {
              page: l.pagination.page,
              limit: l.pagination.limit,
              total: l.pagination.total,
              totalPages: l.pagination.totalPages,
            })),
        l
      );
    } catch (C) {
      const l = X(C);
      return (console.error("Failed to fetch job costs:", l), u("jobCosts", g, l), null);
    } finally {
      i("jobCosts", g) && n(!1);
    }
  }
  return { jobCosts: Sa, pagination: Ta, fetchJobCosts: b };
}
const Aa = A([]),
  Vt = A(null),
  $e = A({ page: 1, limit: 10, total: 0, totalPages: 0 });
function Vs() {
  const {
    baseUrl: a,
    getNextRequestId: T,
    isLatestRequest: i,
    setLoading: n,
    setError: u,
    clearError: h,
  } = Ce();
  async function b(l) {
    const s = T("transactions");
    (n(!0), h("transactions", s));
    try {
      const o = await $fetch(`${a}/finance/dashboard/transactions`, {
        method: "POST",
        body: l,
        credentials: "include",
      });
      return (await g("month", 1, $e.value.limit), o);
    } catch (o) {
      const d = X(o);
      return (
        console.error("Failed to create manual transaction:", d), u("transactions", s, d), null
      );
    } finally {
      i("transactions", s) && n(!1);
    }
  }
  async function y(l, s) {
    const o = T("transactions");
    (n(!0), h("transactions", o));
    try {
      const d = await $fetch(`${a}/finance/dashboard/transactions/${l}`, {
        method: "PUT",
        body: s,
        credentials: "include",
      });
      return (await g("month", $e.value.page, $e.value.limit), d);
    } catch (d) {
      const r = X(d);
      return (
        console.error("Failed to update manual transaction:", r), u("transactions", o, r), null
      );
    } finally {
      i("transactions", o) && n(!1);
    }
  }
  async function w(l) {
    const s = T("transactions");
    (n(!0), h("transactions", s));
    try {
      return (
        await $fetch(`${a}/finance/dashboard/transactions/${l}`, {
          method: "DELETE",
          credentials: "include",
        }),
        await g("month", $e.value.page, $e.value.limit),
        !0
      );
    } catch (o) {
      const d = X(o);
      return (
        console.error("Failed to delete manual transaction:", d), u("transactions", s, d), !1
      );
    } finally {
      i("transactions", s) && n(!1);
    }
  }
  async function g(l = "month", s = 1, o = 10, d) {
    const r = T("transactions");
    (n(!0), h("transactions", r));
    try {
      const { page: m, limit: I, ...P } = d || {},
        q = { period: l, page: s, limit: o, ...P },
        U = await $fetch(`${a}/finance/dashboard/transactions`, {
          method: "GET",
          query: q,
          credentials: "include",
        });
      return (
        i("transactions", r) &&
          ((Aa.value = U.items),
          U.pagination &&
            ($e.value = {
              page: U.pagination.page,
              limit: U.pagination.limit,
              total: U.pagination.total,
              totalPages: U.pagination.totalPages,
            }),
          U.stats && (Vt.value = U.stats)),
        U
      );
    } catch (m) {
      const I = X(m);
      return (console.error("Failed to fetch transactions:", I), u("transactions", r, I), null);
    } finally {
      i("transactions", r) && n(!1);
    }
  }
  async function C(l = "month", s) {
    const o = T("transactionStats");
    (n(!0), h("transactionStats", o));
    try {
      const d = { period: l };
      s && Object.assign(d, s);
      const r = await $fetch(`${a}/finance/dashboard/transactions/stats`, {
        method: "GET",
        query: d,
        credentials: "include",
      });
      return (i("transactionStats", o) && (Vt.value = r), r);
    } catch (d) {
      const r = X(d);
      return (
        console.error("Failed to fetch transaction stats:", r), u("transactionStats", o, r), null
      );
    } finally {
      i("transactionStats", o) && n(!1);
    }
  }
  return {
    transactions: Aa,
    transactionStats: Vt,
    pagination: $e,
    fetchTransactions: g,
    fetchTransactionStats: C,
    createManualTransaction: b,
    updateManualTransaction: y,
    deleteManualTransaction: w,
  };
}
const $a = A(null),
  Da = A([]);
function Js() {
  const {
    baseUrl: a,
    error: T,
    getNextRequestId: i,
    isLatestRequest: n,
    setLoading: u,
    setError: h,
    clearError: b,
    buildQueryParams: y,
  } = Ce();
  async function w(s = "month", o) {
    const d = i("financeClose");
    (u(!0), b("financeClose", d));
    try {
      const r = y(s, o),
        m = await $fetch(`${a}/finance/dashboard/finance-close`, {
          method: "GET",
          query: r,
          credentials: "include",
        });
      return (n("financeClose", d) && ($a.value = m), m);
    } catch (r) {
      const m = X(r);
      return (
        console.error("Failed to fetch finance close stats:", m), h("financeClose", d, m), null
      );
    } finally {
      n("financeClose", d) && u(!1);
    }
  }
  async function g() {
    const s = i("closedPeriods");
    (u(!0), b("closedPeriods", s));
    try {
      const o = await $fetch(`${a}/finance/dashboard/finance-close/periods`, {
        method: "GET",
        credentials: "include",
      });
      return (n("closedPeriods", s) && (Da.value = o), o);
    } catch (o) {
      const d = X(o);
      return (console.error("Failed to fetch closed periods:", d), h("closedPeriods", s, d), null);
    } finally {
      n("closedPeriods", s) && u(!1);
    }
  }
  async function C(s, o) {
    (u(!0), b("financeClose", 0));
    try {
      return (
        await $fetch(`${a}/finance/dashboard/finance-close/periods/${s}/close`, {
          method: "POST",
          body: { notes: o },
          credentials: "include",
        }),
        await g(),
        { success: !0, message: "Period closed successfully" }
      );
    } catch (d) {
      const r = X(d);
      return (
        console.error("Failed to close period:", r), (T.value = r), { success: !1, message: r }
      );
    } finally {
      u(!1);
    }
  }
  async function l(s) {
    (u(!0), b("financeClose", 0));
    try {
      return (
        await $fetch(`${a}/finance/dashboard/finance-close/periods/${s}/reopen`, {
          method: "POST",
          credentials: "include",
        }),
        await g(),
        { success: !0, message: "Period reopened successfully" }
      );
    } catch (o) {
      const d = X(o);
      return (
        console.error("Failed to reopen period:", d), (T.value = d), { success: !1, message: d }
      );
    } finally {
      u(!1);
    }
  }
  return {
    financeCloseStats: $a,
    closedPeriods: Da,
    fetchFinanceCloseStats: w,
    fetchClosedPeriods: g,
    closePeriod: C,
    reopenPeriod: l,
  };
}
const Pa = A([]),
  Fa = A(null),
  Ia = A({ page: 1, limit: 10, total: 0, totalPages: 0 });
function _s() {
  const {
    baseUrl: a,
    getNextRequestId: T,
    isLatestRequest: i,
    setLoading: n,
    setError: u,
    clearError: h,
  } = Ce();
  async function b(w = "month", g = 1, C = 10, l) {
    const s = T("arAp");
    (n(!0), h("arAp", s));
    try {
      const o = { period: w, page: g, limit: C, ...l },
        d = await $fetch(`${a}/finance/dashboard/ar-ap`, {
          method: "GET",
          query: o,
          credentials: "include",
        });
      return (
        i("arAp", s) &&
          ((Pa.value = d.items),
          d.pagination &&
            (Ia.value = {
              page: d.pagination.page,
              limit: d.pagination.limit,
              total: d.pagination.total,
              totalPages: d.pagination.totalPages,
            })),
        d
      );
    } catch (o) {
      const d = X(o);
      return (
        console.error("Failed to fetch AR/AP items:", d),
        na.error(d || "Gagal memuat data AR/AP."),
        u("arAp", s, d),
        null
      );
    } finally {
      i("arAp", s) && n(!1);
    }
  }
  async function y(w = "month") {
    const g = T("arApStats");
    (n(!0), h("arApStats", g));
    try {
      const C = await $fetch(`${a}/finance/dashboard/ar-ap/stats`, {
        method: "GET",
        query: { period: w },
        credentials: "include",
      });
      return (i("arApStats", g) && (Fa.value = C), C);
    } catch (C) {
      const l = X(C);
      return (
        console.error("Failed to fetch AR/AP stats:", l),
        na.error(l || "Gagal memuat statistik AR/AP."),
        u("arApStats", g, l),
        null
      );
    } finally {
      i("arApStats", g) && n(!1);
    }
  }
  return { arApItems: Pa, arApStats: Fa, pagination: Ia, fetchArApItems: b, fetchArApStats: y };
}
function Fe() {
  const a = Ce(),
    T = Qs(),
    i = zs(),
    n = Vs(),
    u = Js(),
    h = _s();
  async function b(y = "month", w) {
    (a.setLoading(!0), a.clearError("stats", 0));
    const g = w?.year;
    try {
      await Promise.all([
        T.fetchStats(y, g),
        T.fetchOverviewStats(y, g),
        i.fetchJobCosts(y, w),
        n.fetchTransactions(y, 1, 10, w),
      ]);
    } finally {
      a.setLoading(!1);
    }
  }
  return {
    isLoading: a.isLoading,
    error: a.error,
    stats: T.stats,
    overviewStats: T.overviewStats,
    chartData: T.chartData,
    fetchStats: T.fetchStats,
    fetchOverviewStats: T.fetchOverviewStats,
    fetchChartData: T.fetchChartData,
    jobCosts: i.jobCosts,
    pagination: i.pagination,
    cogsPagination: i.pagination,
    fetchJobCosts: i.fetchJobCosts,
    transactions: n.transactions,
    transactionStats: n.transactionStats,
    transactionPagination: n.pagination,
    fetchTransactions: n.fetchTransactions,
    fetchTransactionStats: n.fetchTransactionStats,
    createManualTransaction: n.createManualTransaction,
    updateManualTransaction: n.updateManualTransaction,
    deleteManualTransaction: n.deleteManualTransaction,
    financeCloseStats: u.financeCloseStats,
    closedPeriods: u.closedPeriods,
    fetchFinanceCloseStats: u.fetchFinanceCloseStats,
    fetchClosedPeriods: u.fetchClosedPeriods,
    closePeriod: u.closePeriod,
    reopenPeriod: u.reopenPeriod,
    arApItems: h.arApItems,
    arApStats: h.arApStats,
    arApPagination: h.pagination,
    fetchArApItems: h.fetchArApItems,
    fetchArApStats: h.fetchArApStats,
    fetchAll: b,
  };
}
function Ws() {
  const T = _t().public.apiBase || "",
    i = A(0),
    n = A(!1),
    u = A(null),
    h = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  async function b(o = "month", d) {
    const r = ++i.value;
    n.value = !0;
    try {
      const m = { period: o };
      d && (m.year = d);
      const I = await $fetch(`${T}/finance/dashboard/charts`, {
        method: "GET",
        query: m,
        credentials: "include",
      });
      return (r === i.value && (u.value = I), I);
    } catch (m) {
      return (console.error("Failed to fetch chart data:", m), null);
    } finally {
      r === i.value && (n.value = !1);
    }
  }
  const y = B(() => ({
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
        categories: u.value?.months || h,
        axisBorder: { show: !1 },
        axisTicks: { show: !1 },
        labels: { style: { colors: "#64748b", fontSize: "12px" } },
      },
      yaxis: {
        max: (o) => Math.ceil(o * 1.2),
        tickAmount: 5,
        labels: { style: { colors: "#64748b", fontSize: "12px" }, formatter: (o) => `Rp${o}jt` },
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
      tooltip: { y: { formatter: (o) => `Rp ${o}jt` } },
    })),
    w = B(() => [
      {
        name: "Income",
        data: u.value?.incomeData || [25, 28, 35, 40, 42, 45, 48, 52, 55, 58, 62, 65],
      },
      {
        name: "Outcome",
        data: u.value?.expenseData || [20, 25, 30, 35, 38, 42, 45, 48, 50, 52, 55, 58],
      },
    ]),
    g = B(() => ({
      chart: { type: "area", height: 280, toolbar: { show: !1 }, fontFamily: "inherit" },
      colors: ["#012D5A"],
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] },
      },
      dataLabels: { enabled: !1 },
      stroke: { curve: "smooth", width: 2 },
      markers: {
        size: 4,
        colors: ["#fff"],
        strokeColors: ["#012D5A"],
        strokeWidth: 2,
        hover: { size: 6 },
      },
      xaxis: {
        categories: u.value?.months || h,
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
      legend: { position: "top", horizontalAlign: "right", offsetY: -20 },
      tooltip: { y: { formatter: (o) => `${o}%` } },
    })),
    C = B(() => [
      {
        name: "Margin",
        data: u.value?.marginData || [25, 28, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55],
      },
    ]),
    l = B(() => ({
      chart: { type: "donut", height: 220, fontFamily: "inherit" },
      colors: ["#1e3a8a", "#38bdf8", "#3b82f6", "#60a5fa", "#2563eb"],
      labels:
        u.value?.top5 && u.value.top5.length > 0
          ? u.value.top5.map((o) => o.name)
          : ["Lorem Ipsum", "Dolor Sit", "Amet Consect", "Elit Sed", "Tempor Inc"],
      dataLabels: { enabled: !1 },
      legend: { show: !1 },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: !0,
              value: {
                show: !0,
                fontSize: "11px",
                fontWeight: 500,
                color: "#1e293b",
                formatter: (o) => ae(o),
              },
              total: {
                show: !0,
                label: "Total",
                fontSize: "12px",
                color: "#64748b",
                formatter: (o) => {
                  const d = o.globals.series.reduce((r, m) => r + m, 0);
                  return ae(d);
                },
              },
            },
          },
        },
      },
      stroke: { width: 0 },
      tooltip: { y: { formatter: (o) => ae(o) } },
    })),
    s = B(() => {
      const o = u.value?.top5;
      return o && o.length > 0 ? o.map((d) => d.value) : [40, 30, 22, 10, 8];
    });
  return {
    isLoading: n,
    chartData: u,
    fetchChartData: b,
    financialChartOptions: y,
    financialChartSeries: w,
    marginTrendChartOptions: g,
    marginTrendChartSeries: C,
    top5ChartOptions: l,
    top5ChartSeries: s,
  };
}
function Hs() {
  const { overviewStats: a, fetchOverviewStats: T } = Fe(),
    i = Ws(),
    n = B(() => {
      if (!a.value)
        return [
          {
            title: "Total Income",
            value: "Rp0",
            change: 0,
            changeLabel: "vs Last Period",
            isPrimary: !0,
          },
          { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
          { title: "Net Profit", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
          { title: "Margins", value: "0%", changeLabel: "From income", suffix: "%" },
        ];
      const h = a.value;
      return [
        {
          title: "Total Income",
          value: h.totalIncomeFormatted || "Rp0",
          change: h.incomeGrowth,
          changeLabel: "vs Last Period",
          isPrimary: !0,
        },
        {
          title: "Total Outcome",
          value: h.totalOutcomeFormatted || "Rp0",
          change: h.outcomeGrowth,
          changeLabel: "vs Last Period",
        },
        {
          title: "Net Profit",
          value: h.netProfitFormatted || "Rp0",
          change: h.incomeGrowth,
          changeLabel: "vs Last Period",
        },
        { title: "Margins", value: `${h.margins || 0}%`, changeLabel: "From income", suffix: "%" },
      ];
    });
  async function u(h, b) {
    (await T(h, b), await i.fetchChartData(h, b));
  }
  return {
    overviewStats: a,
    overviewStatsCards: n,
    chartData: i.chartData,
    financialChartOptions: i.financialChartOptions,
    financialChartSeries: i.financialChartSeries,
    marginTrendChartOptions: i.marginTrendChartOptions,
    marginTrendChartSeries: i.marginTrendChartSeries,
    top5ChartOptions: i.top5ChartOptions,
    top5ChartSeries: i.top5ChartSeries,
    fetchOverview: u,
  };
}
function Xs() {
  const { stats: a, fetchAll: T, pagination: i } = Fe(),
    {
      selectedPeriod: n,
      selectedYear: u,
      searchQuery: h,
      cogsCustomerId: b,
      cogsServiceId: y,
      sortBy: w,
      sortOrder: g,
      showSortDropdown: C,
      getCogsFilters: l,
    } = _e(),
    s = B(() => {
      if (!a.value)
        return [
          { title: "Total COGS", value: "Rp0", changeLabel: "vs Last Period", isPrimary: !0 },
          { title: "Average Cost/Job", value: "Rp0", changeLabel: "vs Last Period" },
          { title: "Highest Job", value: "Rp0", changeLabel: "vs Last Period" },
          { title: "Cost Growth", value: "0%", changeLabel: "From income", suffix: "%" },
        ];
      const R = a.value;
      return [
        {
          title: "Total COGS",
          value: R.totalCogsFormatted || "Rp0",
          change: R.costGrowth,
          changeLabel: "vs Last Period",
          isPrimary: !0,
        },
        {
          title: "Average Cost/Job",
          value: R.averageCostPerJobFormatted || "Rp0",
          change: R.costGrowth,
          changeLabel: "vs Last Period",
        },
        {
          title: "Highest Job",
          value: R.highestJob?.cogsFormatted || "Rp0",
          change: R.costGrowth,
          changeLabel: R.highestJob?.jobNumber || "N/A",
        },
        {
          title: "Cost Growth",
          value: `${R.costGrowth || 0}%`,
          changeLabel: "From previous period",
          suffix: "%",
        },
      ];
    });
  let o = null;
  function d(R) {
    const j = R.target;
    ((h.value = j.value),
      o && clearTimeout(o),
      (o = setTimeout(() => {
        m();
      }, 300)));
  }
  async function r(R) {
    R.key === "Enter" && (o && clearTimeout(o), await m());
  }
  async function m() {
    await T(n.value, l());
  }
  async function I(R) {
    ((u.value = R), await T(n.value, l()));
  }
  async function P(R) {
    ((b.value = R), await T(n.value, l()));
  }
  async function q(R) {
    ((y.value = R), await T(n.value, l()));
  }
  async function U(R) {
    (w.value === R
      ? (g.value = g.value === "asc" ? "desc" : "asc")
      : ((w.value = R), (g.value = "desc")),
      await T(n.value, l()));
  }
  function O() {
    C.value = !C.value;
  }
  async function ee(R) {
    await T(R, l());
  }
  return {
    stats: a,
    cogsStats: s,
    pagination: i,
    selectedYear: u,
    searchQuery: h,
    cogsCustomerId: b,
    cogsServiceId: y,
    sortBy: w,
    sortOrder: g,
    showSortDropdown: C,
    getCogsFilters: l,
    handleSearchInput: d,
    handleSearchKeydown: r,
    handleSearch: m,
    handleYearChange: I,
    handleCustomerChange: P,
    handleServiceChange: q,
    handleSort: U,
    handleSortDropdownToggle: O,
    fetchCogs: ee,
  };
}
function Zs() {
  const { transactions: a, transactionStats: T, fetchTransactions: i, pagination: n } = Fe(),
    {
      selectedPeriod: u,
      currentPage: h,
      transactionYear: b,
      transactionType: y,
      transactionCustomerId: w,
      transactionSearch: g,
      transactionSortBy: C,
      transactionSortOrder: l,
      showTransactionSortDropdown: s,
      getTransactionFilters: o,
    } = _e(),
    d = B(() => {
      const M = T.value;
      return M
        ? [
            {
              title: "Journal Volume",
              value: ae(M.totalJournal),
              isPrimary: !0,
              changeLabel: "vs Last Period",
            },
            {
              title: "Total Transaction",
              value: ae(M.totalIncome),
              change: 0,
              changeLabel: "vs Last Period",
            },
            {
              title: "Today Transaction",
              value: `${M.todayTransactions}`,
              changeLabel: "Items today",
              suffix: " items",
            },
            {
              title: "All Transactions",
              value: `${n.value.total}`,
              changeLabel: "Total count",
              suffix: " items",
            },
          ]
        : [
            { title: "Journal", value: "Rp0", isPrimary: !0 },
            { title: "Total Income", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
            { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
            { title: "Today Transaction", value: "0", changeLabel: "", suffix: "" },
          ];
    });
  let r = null;
  function m(M) {
    const de = M.target;
    ((g.value = de.value),
      r && clearTimeout(r),
      (r = setTimeout(() => {
        P();
      }, 300)));
  }
  async function I(M) {
    M.key === "Enter" && (r && clearTimeout(r), await P());
  }
  async function P() {
    await i(u.value, h.value, n.value.limit, o());
  }
  async function q(M) {
    ((b.value = M), await i(u.value, h.value, n.value.limit, o()));
  }
  async function U(M) {
    ((y.value = M), await i(u.value, h.value, n.value.limit, o()));
  }
  async function O(M) {
    ((w.value = M), await i(u.value, h.value, n.value.limit, o()));
  }
  async function ee(M) {
    (C.value === M
      ? (l.value = l.value === "asc" ? "desc" : "asc")
      : ((C.value = M), (l.value = "desc")),
      (s.value = !1),
      await i(u.value, h.value, n.value.limit, o()));
  }
  function R() {
    s.value = !s.value;
  }
  async function j(M) {
    await i(M, h.value, n.value.limit, o());
  }
  return {
    transactions: a,
    transactionStats: T,
    transactionStatsCards: d,
    pagination: n,
    transactionYear: b,
    transactionType: y,
    transactionCustomerId: w,
    transactionSearch: g,
    transactionSortBy: C,
    transactionSortOrder: l,
    showTransactionSortDropdown: s,
    getTransactionFilters: o,
    handleSearchInput: m,
    handleSearchKeydown: I,
    handleSearch: P,
    handleYearChange: q,
    handleTypeChange: U,
    handleCustomerChange: O,
    handleSort: ee,
    handleSortDropdownToggle: R,
    fetchTxData: j,
  };
}
function eo() {
  const {
      financeCloseStats: a,
      closedPeriods: T,
      fetchFinanceCloseStats: i,
      fetchClosedPeriods: n,
      closePeriod: u,
      reopenPeriod: h,
    } = Fe(),
    { confirm: b } = Ht(),
    {
      selectedPeriod: y,
      currentPage: w,
      financeCloseYear: g,
      financeCloseType: C,
      financeCloseCustomerId: l,
      financeCloseSearch: s,
      financeCloseSortBy: o,
      financeCloseSortOrder: d,
      showFinanceCloseSortDropdown: r,
      getFinanceCloseFilters: m,
    } = _e(),
    { transactions: I, fetchTransactions: P, pagination: q } = Fe(),
    U = B(
      () =>
        a.value || {
          period: "Loading...",
          status: "Open",
          description: "Loading...",
          revenue: "Rp0",
          cogs: "Rp0",
          nettPL: "Rp0",
          readinessScore: 0,
        },
    );
  let O = null;
  function ee(S) {
    const K = S.target;
    ((s.value = K.value),
      O && clearTimeout(O),
      (O = setTimeout(() => {
        j();
      }, 300)));
  }
  async function R(S) {
    S.key === "Enter" && (O && clearTimeout(O), await j());
  }
  async function j() {
    await P(y.value, w.value, q.value.limit, m());
  }
  async function M(S) {
    g.value = S;
    const K = S ? parseInt(S) : void 0;
    (await i(y.value, K), await P(y.value, w.value, q.value.limit, m()));
  }
  async function de(S) {
    ((C.value = S), await P(y.value, w.value, q.value.limit, m()));
  }
  async function me(S) {
    ((l.value = S), await P(y.value, w.value, q.value.limit, m()));
  }
  async function ge(S) {
    (o.value === S
      ? (d.value = d.value === "asc" ? "desc" : "asc")
      : ((o.value = S), (d.value = "desc")),
      await P(y.value, w.value, q.value.limit, m()));
  }
  function he() {
    r.value = !r.value;
  }
  async function fe() {
    if (
      !(await b({
        title: "Close Period",
        message: "Are you sure you want to close this period? This action cannot be undone.",
        type: "danger",
      }))
    )
      return;
    const K = await u(y.value);
    K &&
      (await b({
        title: K.success ? "Success" : "Error",
        message: K.message,
        type: K.success ? void 0 : "danger",
      }));
  }
  async function pe(S) {
    if (
      !(await b({
        title: "Reopen Period",
        message:
          "Are you sure you want to reopen this period? This will allow modifications to transactions in this period.",
      }))
    )
      return;
    const Z = await h(S);
    Z &&
      (await b({
        title: Z.success ? "Success" : "Error",
        message: Z.message,
        type: Z.success ? void 0 : "danger",
      }));
  }
  async function L(S) {
    const K = g.value ? parseInt(g.value) : void 0;
    (await i(S, K), await n(), await P(S, w.value, q.value.limit, m()));
  }
  return {
    financeCloseStats: a,
    closedPeriods: T,
    financeCloseData: U,
    transactions: I,
    pagination: q,
    financeCloseYear: g,
    financeCloseType: C,
    financeCloseCustomerId: l,
    financeCloseSearch: s,
    financeCloseSortBy: o,
    financeCloseSortOrder: d,
    showFinanceCloseSortDropdown: r,
    getFinanceCloseFilters: m,
    handleSearchInput: ee,
    handleSearchKeydown: R,
    handleSearch: j,
    handleYearChange: M,
    handleTypeChange: de,
    handleCustomerChange: me,
    handleSort: ge,
    handleSortDropdownToggle: he,
    handleClosePeriod: fe,
    handleReopenPeriod: pe,
    fetchFinanceClose: L,
  };
}
function to() {
  const { arApItems: a, arApStats: T, fetchArApItems: i, fetchArApStats: n, pagination: u } = Fe();
  Ht();
  const {
    selectedPeriod: h,
    currentPage: b,
    arApToggle: y,
    arApSearch: w,
    arApSortBy: g,
    arApSortOrder: C,
    showArApSortDropdown: l,
    arApStatusFilter: s,
    getArApFilters: o,
  } = _e();
  let d = null;
  function r(j) {
    const M = j.target;
    ((w.value = M.value),
      d && clearTimeout(d),
      (d = setTimeout(() => {
        I();
      }, 300)));
  }
  async function m(j) {
    j.key === "Enter" && (d && clearTimeout(d), await I());
  }
  async function I() {
    await Promise.all([i(h.value, b.value, u.value.limit, o()), n(h.value)]);
  }
  async function P(j) {
    ((y.value = j), await Promise.all([i(h.value, b.value, u.value.limit, o()), n(h.value)]));
  }
  async function q(j) {
    (g.value === j
      ? (C.value = C.value === "asc" ? "desc" : "asc")
      : ((g.value = j), (C.value = "desc")),
      (l.value = !1),
      await Promise.all([i(h.value, b.value, u.value.limit, o()), n(h.value)]));
  }
  function U() {
    l.value = !l.value;
  }
  async function O(j) {
    ((s.value = j), await Promise.all([i(h.value, b.value, u.value.limit, o()), n(h.value)]));
  }
  async function ee(j) {
    await Promise.all([i(j, b.value, u.value.limit, o()), n(j)]);
  }
  async function R() {
    await Promise.all([i(h.value, b.value, u.value.limit, o()), n(h.value)]);
  }
  return {
    arApItems: a,
    arApStats: T,
    pagination: u,
    arApToggle: y,
    arApSearch: w,
    arApSortBy: g,
    arApSortOrder: C,
    showArApSortDropdown: l,
    arApStatusFilter: s,
    getArApFilters: o,
    handleSearchInput: r,
    handleSearchKeydown: m,
    handleSearch: I,
    handleToggleChange: P,
    handleSort: q,
    handleSortDropdownToggle: U,
    handleStatusFilterChange: O,
    fetchArAp: ee,
    handleRefresh: R,
  };
}
function ao() {
  const a = Ge(),
    T = Ua(),
    { activeTab: i, selectedPeriod: n, currentPage: u, resetPage: h } = T,
    b = _e(),
    {
      selectedYear: y,
      searchQuery: w,
      cogsCustomerId: g,
      cogsServiceId: C,
      sortBy: l,
      sortOrder: s,
      showSortDropdown: o,
      transactionYear: d,
      transactionType: r,
      transactionCustomerId: m,
      transactionSearch: I,
      transactionSortBy: P,
      transactionSortOrder: q,
      showTransactionSortDropdown: U,
      financeCloseYear: O,
      financeCloseType: ee,
      financeCloseCustomerId: R,
      financeCloseSearch: j,
      financeCloseSortBy: M,
      financeCloseSortOrder: de,
      showFinanceCloseSortDropdown: me,
      arApToggle: ge,
      arApSearch: he,
      arApSortBy: fe,
      arApSortOrder: pe,
      showArApSortDropdown: L,
      arApStatusFilter: S,
    } = b,
    K = Hs(),
    Z = Xs(),
    se = Zs(),
    F = eo(),
    W = to(),
    re = Fe(),
    {
      isLoading: We,
      error: bt,
      jobCosts: xt,
      cogsPagination: He,
      transactionPagination: Xe,
      arApPagination: Ze,
    } = re;
  Ce();
  const wt = B(() => {
      switch (i.value) {
        case "COGS":
          return He.value;
        case "Transaction":
          return Xe.value;
        case "Accounts Receivable":
          return Ze.value;
        default:
          return He.value;
      }
    }),
    { companies: et, fetchCompanies: Ct } = $s(),
    { services: tt, fetchServices: St } = Ds(),
    Ee = A(!1),
    Be = A(!1);
  async function Ie($, _) {
    switch ($) {
      case "Overview": {
        const Te = y.value ? parseInt(y.value) : void 0;
        await K.fetchOverview(_, Te);
        break;
      }
      case "COGS":
        await re.fetchAll(_, b.getCogsFilters());
        break;
      case "Transaction":
        await se.fetchTxData(_);
        break;
      case "Finance Close":
        await F.fetchFinanceClose(_);
        break;
      case "Accounts Receivable":
        await W.fetchArAp(_);
        break;
    }
  }
  async function Se() {
    if (!et.value.length) {
      Ee.value = !0;
      try {
        await Ct({ type: "CUSTOMER" });
      } finally {
        Ee.value = !1;
      }
    }
  }
  async function at() {
    if (!tt.value.length) {
      Be.value = !0;
      try {
        await St();
      } finally {
        Be.value = !1;
      }
    }
  }
  async function st($) {
    ((n.value = $), h(), await Ie(i.value, $));
  }
  async function Tt($) {
    ((i.value = $),
      h(),
      ["COGS", "Transaction", "Finance Close"].includes($) && (await Se()),
      $ === "COGS" && (await at()),
      await Ie($, n.value));
  }
  async function At($) {
    u.value = $;
    const _ = i.value;
    _ === "COGS"
      ? await re.fetchJobCosts(n.value, { ...b.getCogsFilters(), page: $ })
      : _ === "Transaction"
        ? await re.fetchTransactions(n.value, $, Xe.value.limit, b.getTransactionFilters())
        : _ === "Finance Close"
          ? await F.fetchFinanceClose(n.value)
          : _ === "Accounts Receivable" &&
            (await re.fetchArApItems(n.value, $, Ze.value.limit, b.getArApFilters()));
  }
  function ot($) {
    $.target.closest(".relative") || b.closeAllDropdowns();
  }
  return (
    Ya(async () => {
      (document.addEventListener("click", ot),
        await Promise.all([Se(), at()]),
        await Ie(i.value, n.value));
    }),
    bs(() => document.removeEventListener("click", ot)),
    De(ge, async () => {
      i.value === "Accounts Receivable" && (h(), await Ie("Accounts Receivable", n.value));
    }),
    {
      isLoading: We,
      error: bt,
      selectedPeriod: n,
      activeTab: i,
      currentPage: u,
      selectedYear: y,
      searchQuery: w,
      cogsCustomerId: g,
      cogsServiceId: C,
      sortBy: l,
      sortOrder: s,
      showSortDropdown: o,
      transactionYear: d,
      transactionType: r,
      transactionCustomerId: m,
      transactionSearch: I,
      transactionSortBy: P,
      transactionSortOrder: q,
      showTransactionSortDropdown: U,
      financeCloseYear: O,
      financeCloseType: ee,
      financeCloseCustomerId: R,
      financeCloseSearch: j,
      financeCloseSortBy: M,
      financeCloseSortOrder: de,
      showFinanceCloseSortDropdown: me,
      arApToggle: ge,
      arApSearch: he,
      arApSortBy: fe,
      arApSortOrder: pe,
      showArApSortDropdown: L,
      arApStatusFilter: S,
      isLoadingCustomers: Ee,
      isLoadingServices: Be,
      stats: K.overviewStats,
      overviewStats: K.overviewStats,
      jobCosts: xt,
      transactions: re.transactions,
      transactionStats: re.transactionStats,
      financeCloseStats: F.financeCloseStats,
      closedPeriods: F.closedPeriods,
      arApItems: W.arApItems,
      arApStats: W.arApStats,
      pagination: wt,
      companies: et,
      services: tt,
      chartData: K.chartData,
      financialChartOptions: K.financialChartOptions,
      financialChartSeries: K.financialChartSeries,
      marginTrendChartOptions: K.marginTrendChartOptions,
      marginTrendChartSeries: K.marginTrendChartSeries,
      top5ChartOptions: K.top5ChartOptions,
      top5ChartSeries: K.top5ChartSeries,
      overviewStatsCards: K.overviewStatsCards,
      cogsStats: Z.cogsStats,
      transactionStatsCards: se.transactionStatsCards,
      financeCloseData: F.financeCloseData,
      handlePeriodChange: st,
      handleTabChange: Tt,
      handlePageChange: At,
      handleClosePeriod: F.handleClosePeriod,
      handleReopenPeriod: F.handleReopenPeriod,
      handleYearChange: Z.handleYearChange,
      handleCogsCustomerChange: Z.handleCustomerChange,
      handleCogsServiceChange: Z.handleServiceChange,
      handleCogsSearch: Z.handleSearch,
      handleCogsSearchInput: Z.handleSearchInput,
      handleCogsSearchKeydown: Z.handleSearchKeydown,
      handleCogsSort: Z.handleSort,
      handleCogsSortDropdownToggle: Z.handleSortDropdownToggle,
      handleTransactionYearChange: se.handleYearChange,
      handleTransactionTypeChange: se.handleTypeChange,
      handleTransactionCustomerChange: se.handleCustomerChange,
      handleTransactionSearch: se.handleSearch,
      handleTransactionSearchInput: se.handleSearchInput,
      handleTransactionSearchKeydown: se.handleSearchKeydown,
      handleTransactionSort: se.handleSort,
      handleTransactionSortDropdownToggle: se.handleSortDropdownToggle,
      handleTransactionExport: () => {
        try {
          const $ = new Ba(),
            _ = $.internal.pageSize.getWidth(),
            Te = $.internal.pageSize.getHeight(),
            Q = 20,
            Re = _ - Q * 2;
          let G = Q;
          const Ue = [1, 45, 90],
            ke = [31, 41, 55],
            $t = [107, 114, 128],
            Dt = [229, 231, 235];
          ($.setFillColor(...Ue),
            $.rect(0, 0, _, 40, "F"),
            $.setTextColor(255, 255, 255),
            $.setFontSize(24),
            $.setFont("helvetica", "bold"),
            $.text("TRANSACTIONS REPORT", Q, 25),
            $.setFontSize(12),
            $.setFont("helvetica", "normal"));
          const Pt = d.value ? `Year: ${d.value}` : "All Years";
          $.text(Pt, _ - Q, 20, { align: "right" });
          const Ft = new Date().toLocaleDateString("id-ID");
          ($.text(`Generated: ${Ft}`, _ - Q, 30, { align: "right" }),
            (G = 55),
            $.setTextColor(...ke),
            $.setFontSize(10),
            $.setFont("helvetica", "bold"),
            $.text("Filters:", Q, G),
            $.setFont("helvetica", "normal"),
            (G += 7));
          const ve = [];
          (d.value && ve.push(`Year: ${d.value}`),
            r.value && ve.push(`Type: ${r.value}`),
            m.value && ve.push(`Customer ID: ${m.value}`),
            I.value && ve.push(`Search: ${I.value}`),
            ve.length === 0 && ve.push("None (All Data)"),
            $.setTextColor(...$t),
            ve.forEach((ce) => {
              ($.text(ce, Q, G), (G += 6));
            }),
            (G += 10),
            $.setFillColor(...Ue),
            $.rect(Q, G, Re, 10, "F"),
            $.setTextColor(255, 255, 255),
            $.setFontSize(9),
            $.setFont("helvetica", "bold"),
            $.text("No.", Q + 2, G + 7),
            $.text("Date", Q + 20, G + 7),
            $.text("Job Number", Q + 45, G + 7),
            $.text("Customer", Q + 85, G + 7),
            $.text("Type", Q + 130, G + 7),
            $.text("Amount", Q + 160, G + 7),
            (G += 10),
            $.setTextColor(...ke),
            $.setFont("helvetica", "normal"),
            $.setFontSize(8));
          const It = se.transactions.value || [];
          let nt = 0;
          (It.forEach((ce, lt) => {
            (G > Te - 30 && ($.addPage(), (G = Q)),
              lt % 2 === 0 && ($.setFillColor(249, 250, 251), $.rect(Q, G, Re, 10, "F")),
              $.setTextColor(...ke),
              $.text((lt + 1).toString(), Q + 2, G + 7),
              $.text(ce.date ? new Date(ce.date).toLocaleDateString("id-ID") : "-", Q + 20, G + 7),
              $.text(ce.jobNumber?.substring(0, 15) || "-", Q + 45, G + 7),
              $.text(ce.customer?.substring(0, 18) || "-", Q + 85, G + 7),
              $.text(ce.type?.substring(0, 10) || "-", Q + 130, G + 7),
              $.text(ae(ce.total || 0), Q + 160, G + 7),
              (nt += ce.total || 0),
              (G += 10));
          }),
            (G += 5),
            $.setFillColor(...Dt),
            $.rect(Q, G, Re, 12, "F"),
            $.setFont("helvetica", "bold"),
            $.setTextColor(...ke),
            $.text("TOTAL", Q + 2, G + 8),
            $.text(ae(nt), Q + 160, G + 8));
          const rt = Te - 15;
          ($.setFillColor(...Ue),
            $.rect(0, rt - 5, _, 20, "F"),
            $.setTextColor(255, 255, 255),
            $.setFont("helvetica", "normal"),
            $.setFontSize(8),
            $.text("PT. Nusantara Continent - Transactions Report", _ / 2, rt + 5, {
              align: "center",
            }));
          const kt = `Transactions_Report${d.value ? `_${d.value}` : ""}.pdf`;
          $.save(kt);
        } catch ($) {
          (console.error("Failed to export transactions PDF:", $),
            alert("Failed to export PDF. Please try again."));
        }
      },
      handleTransactionCreate: () => {
        a.push("/finance/transactions/create");
      },
      handleTransactionEdit: ($) => {
        a.push(`/finance/transaction/${$.id}/edit`);
      },
      handleTransactionDelete: async ($) => {
        const { confirm: _ } = Ht();
        (await _({
          title: "Delete Transaction",
          message: "Are you sure you want to delete this transaction?",
          type: "danger",
          confirmText: "Delete",
          cancelText: "Cancel",
        })) && (await re.deleteManualTransaction($.id));
      },
      handleFinanceCloseYearChange: F.handleYearChange,
      handleFinanceCloseTypeChange: F.handleTypeChange,
      handleFinanceCloseCustomerChange: F.handleCustomerChange,
      handleFinanceCloseSearch: F.handleSearch,
      handleFinanceCloseSearchInput: F.handleSearchInput,
      handleFinanceCloseSearchKeydown: F.handleSearchKeydown,
      handleFinanceCloseSort: F.handleSort,
      handleFinanceCloseSortDropdownToggle: F.handleSortDropdownToggle,
      handleArApToggleChange: W.handleToggleChange,
      handleArApSearch: W.handleSearch,
      handleArApSearchInput: W.handleSearchInput,
      handleArApSearchKeydown: W.handleSearchKeydown,
      handleArApSort: W.handleSort,
      handleArApSortDropdownToggle: W.handleSortDropdownToggle,
      handleArApStatusFilterChange: W.handleStatusFilterChange,
      handleArApRefresh: W.handleRefresh,
    }
  );
}
const ka = A([]),
  Oa = A(null),
  La = A({ page: 1, limit: 10, total: 0, totalPages: 0 });
function so() {
  const {
    baseUrl: a,
    getNextRequestId: T,
    isLatestRequest: i,
    setLoading: n,
    setError: u,
    clearError: h,
  } = Ce();
  async function b(g = 1, C = 10, l) {
    const s = T("assets");
    (n(!0), h("assets", s));
    try {
      const o = { page: g, limit: C };
      l &&
        (l.search && (o.search = l.search),
        l.sortBy && (o.sortBy = l.sortBy),
        l.sortOrder && (o.sortOrder = l.sortOrder),
        l.year && (o.year = l.year),
        l.serviceId && (o.serviceId = l.serviceId),
        l.companyId && (o.companyId = l.companyId));
      const d = await $fetch(`${a}/finance/dashboard/assets`, {
        method: "GET",
        query: o,
        credentials: "include",
      });
      return (
        i("assets", s) &&
          ((ka.value = d.items),
          d.pagination &&
            (La.value = {
              page: d.pagination.page,
              limit: d.pagination.limit,
              total: d.pagination.total,
              totalPages: d.pagination.totalPages,
            })),
        d
      );
    } catch (o) {
      const d = X(o);
      return (console.error("Failed to fetch assets:", d), u("assets", s, d), null);
    } finally {
      i("assets", s) && n(!1);
    }
  }
  async function y(g) {
    const C = T("assetsStats");
    (n(!0), h("assetsStats", C));
    try {
      const l = {};
      g && (l.year = g);
      const s = await $fetch(`${a}/finance/dashboard/assets/stats`, {
        method: "GET",
        query: l,
        credentials: "include",
      });
      return (i("assetsStats", C) && (Oa.value = s), s);
    } catch (l) {
      const s = X(l);
      return (console.error("Failed to fetch asset stats:", s), u("assetsStats", C, s), null);
    } finally {
      i("assetsStats", C) && n(!1);
    }
  }
  async function w(g) {
    try {
      return await $fetch(`${a}/finance/dashboard/assets`, {
        method: "POST",
        body: g,
        credentials: "include",
      });
    } catch (C) {
      const l = X(C);
      return (console.error("Failed to create asset:", l), null);
    }
  }
  return {
    assets: ka,
    assetStats: Oa,
    pagination: La,
    fetchAssets: b,
    fetchAssetStats: y,
    createAsset: w,
  };
}
const oo = {
    active: { label: "Active", class: "bg-blue-50 text-blue-700 border-blue-200" },
    closed: { label: "Closed", class: "bg-green-50 text-green-700 border-green-200" },
    pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  },
  no = [
    "Overview",
    "COGS",
    "Transaction",
    "Assets",
    "Accounts Receivable",
    "Trial Balance",
    "Finance Close",
  ],
  ro = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ],
  lo = { class: "space-y-4 px-6" },
  io = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  co = { class: "border border-border rounded-xl bg-white mt-4" },
  uo = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  go = { class: "flex flex-wrap items-center gap-2" },
  po = { class: "relative flex items-center" },
  mo = { class: "relative" },
  ho = {
    key: 0,
    class: "absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10",
  },
  fo = ["onClick"],
  vo = { key: 0, class: "text-xs text-muted-foreground" },
  yo = {
    class:
      "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
  },
  bo = { class: "flex flex-wrap items-center gap-2 p-5 border-b border-border bg-gray-50/30" },
  xo = { class: "relative" },
  wo = ["value"],
  Co = ["disabled"],
  So = ["value"],
  To = ["disabled"],
  Ao = ["value"],
  $o = { class: "overflow-x-auto" },
  Do = { class: "w-full" },
  Po = { key: 0 },
  Fo = { class: "py-3 px-4" },
  Io = { class: "text-sm font-medium text-[#012D5A]" },
  ko = { class: "py-3 px-4 text-sm" },
  Oo = { class: "py-3 px-4 text-sm" },
  Lo = { class: "py-3 px-4 text-sm text-right font-medium" },
  Yo = { class: "py-3 px-4 text-sm text-right" },
  Eo = { class: "py-3 px-4 text-sm text-right" },
  Bo = { class: "py-3 px-4 text-sm text-right" },
  Ro = { class: "py-3 px-4 text-center" },
  Uo = { class: "flex items-center justify-between p-4 border-t border-border" },
  qo = { class: "text-sm text-muted-foreground" },
  No = ue({
    __name: "CogsTab",
    props: {
      statsCards: {},
      jobs: {},
      isLoading: { type: Boolean },
      isLoadingCustomers: { type: Boolean },
      isLoadingServices: { type: Boolean },
      pagination: {},
      companies: {},
      services: {},
      selectedYear: {},
      searchQuery: {},
      customerId: {},
      serviceId: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      availableYears: {},
      sortOptions: {},
    },
    emits: [
      "update:selectedYear",
      "update:searchQuery",
      "update:customerId",
      "update:serviceId",
      "update:sortBy",
      "update:sortOrder",
      "update:showSortDropdown",
      "yearChange",
      "customerChange",
      "serviceChange",
      "search",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
    ],
    setup(a, { emit: T }) {
      const i = a,
        n = T,
        u = ae,
        h = (s) => `${s.toFixed(1)}%`,
        b = (s) => oo[s],
        y = B({ get: () => i.searchQuery, set: (s) => n("update:searchQuery", s) }),
        w = B({ get: () => i.selectedYear, set: (s) => n("update:selectedYear", s) }),
        g = B({ get: () => i.customerId, set: (s) => n("update:customerId", s) }),
        C = B({ get: () => i.serviceId, set: (s) => n("update:serviceId", s) }),
        l = B({ get: () => i.showSortDropdown, set: (s) => n("update:showSortDropdown", s) });
      return (s, o) => {
        const d = Qe,
          r = ze;
        return (
          c(),
          p("div", lo, [
            e("div", io, [
              (c(!0),
              p(
                E,
                null,
                N(
                  a.statsCards,
                  (m, I) => (c(), ie(d, { key: I, card: m, index: I }, null, 8, ["card", "index"])),
                ),
                128,
              )),
            ]),
            e("div", co, [
              e("div", uo, [
                o[14] ||
                  (o[14] = e("h2", { class: "text-lg font-semibold" }, "Job Cost Breakdown", -1)),
                e("div", go, [
                  e("div", po, [
                    H(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            o[0] || (o[0] = (m) => (k(y) ? (y.value = m) : null)),
                          onInput: o[1] || (o[1] = (m) => n("searchInput", m)),
                          onKeydown: o[2] || (o[2] = (m) => n("searchKeydown", m)),
                          type: "text",
                          placeholder: "Search job or customer...",
                          class:
                            "w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                        },
                        null,
                        544,
                      ),
                      [[Ke, t(y)]],
                    ),
                    Y(t(Ve), {
                      class:
                        "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    }),
                  ]),
                  e("div", mo, [
                    e(
                      "button",
                      {
                        class:
                          "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                        onClick: o[3] || (o[3] = (m) => n("toggleSortDropdown")),
                      },
                      [
                        Y(t(Je), { class: "w-4 h-4" }),
                        o[12] || (o[12] = e("span", null, "Sort", -1)),
                        Y(t(Ye), { class: "w-3 h-3" }),
                      ],
                    ),
                    t(l)
                      ? (c(),
                        p("div", ho, [
                          (c(!0),
                          p(
                            E,
                            null,
                            N(
                              a.sortOptions,
                              (m) => (
                                c(),
                                p(
                                  "button",
                                  {
                                    key: m.value,
                                    onClick: (I) => n("sort", m.value),
                                    class: J(
                                      t(te)(
                                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between",
                                        a.sortBy === m.value
                                          ? "text-[#012D5A] font-medium"
                                          : "text-gray-700",
                                      ),
                                    ),
                                  },
                                  [
                                    e("span", null, v(m.label), 1),
                                    a.sortBy === m.value
                                      ? (c(),
                                        p("span", vo, v(a.sortOrder === "asc" ? "↑" : "↓"), 1))
                                      : V("", !0),
                                  ],
                                  10,
                                  fo,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : V("", !0),
                  ]),
                  e("button", yo, [
                    Y(t(vt), { class: "w-4 h-4" }),
                    o[13] || (o[13] = e("span", null, "Export", -1)),
                  ]),
                ]),
              ]),
              e("div", bo, [
                e("div", xo, [
                  H(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue":
                          o[4] || (o[4] = (m) => (k(w) ? (w.value = m) : null)),
                        onChange: o[5] || (o[5] = (m) => n("yearChange", m.target.value)),
                        class:
                          "appearance-none px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
                      },
                      [
                        o[15] || (o[15] = e("option", { value: "" }, "All Years", -1)),
                        (c(!0),
                        p(
                          E,
                          null,
                          N(
                            a.availableYears,
                            (m) => (c(), p("option", { key: m, value: m }, v(m), 9, wo)),
                          ),
                          128,
                        )),
                      ],
                      544,
                    ),
                    [[ne, t(w)]],
                  ),
                  Y(t(yt), {
                    class:
                      "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": o[6] || (o[6] = (m) => (k(g) ? (g.value = m) : null)),
                      onChange: o[7] || (o[7] = (m) => n("customerChange", m.target.value)),
                      class: "px-3 py-2 text-sm border border-border rounded-lg bg-white",
                      disabled: a.isLoadingCustomers,
                    },
                    [
                      o[16] || (o[16] = e("option", { value: "" }, "All Customers", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.companies,
                          (m) => (c(), p("option", { key: m.id, value: m.id }, v(m.name), 9, So)),
                        ),
                        128,
                      )),
                    ],
                    40,
                    Co,
                  ),
                  [[ne, t(g)]],
                ),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": o[8] || (o[8] = (m) => (k(C) ? (C.value = m) : null)),
                      onChange: o[9] || (o[9] = (m) => n("serviceChange", m.target.value)),
                      class: "px-3 py-2 text-sm border border-border rounded-lg bg-white",
                      disabled: a.isLoadingServices,
                    },
                    [
                      o[17] || (o[17] = e("option", { value: "" }, "All Services", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.services,
                          (m) => (c(), p("option", { key: m.id, value: m.id }, v(m.name), 9, Ao)),
                        ),
                        128,
                      )),
                    ],
                    40,
                    To,
                  ),
                  [[ne, t(C)]],
                ),
              ]),
              e("div", $o, [
                e("table", Do, [
                  o[19] ||
                    (o[19] = e(
                      "thead",
                      null,
                      [
                        e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "JOB",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "POL - POD",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Customer",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Revenue",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "COGS",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Profit",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Margin",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-center text-sm font-medium text-gray-500" },
                            "Status",
                          ),
                        ]),
                      ],
                      -1,
                    )),
                  e("tbody", null, [
                    !a.jobs.length && !a.isLoading
                      ? (c(),
                        p("tr", Po, [
                          ...(o[18] ||
                            (o[18] = [
                              e(
                                "td",
                                { colspan: "8", class: "py-8 text-center text-muted-foreground" },
                                "No data available",
                                -1,
                              ),
                            ])),
                        ]))
                      : V("", !0),
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.jobs,
                        (m) => (
                          c(),
                          p(
                            "tr",
                            { key: m.id, class: "border-b border-gray-100 hover:bg-gray-50/50" },
                            [
                              e("td", Fo, [e("span", Io, v(m.jobNumber), 1)]),
                              e("td", ko, v(m.polPod), 1),
                              e("td", Oo, v(m.customer), 1),
                              e("td", Lo, v(t(u)(m.revenue)), 1),
                              e("td", Yo, v(t(u)(m.cogs)), 1),
                              e("td", Eo, v(t(u)(m.profit)), 1),
                              e("td", Bo, v(h(m.margin)), 1),
                              e("td", Ro, [
                                e(
                                  "span",
                                  {
                                    class: J(
                                      t(te)(
                                        "px-2 py-1 rounded border text-xs font-medium",
                                        b(m.status).class,
                                      ),
                                    ),
                                  },
                                  v(b(m.status).label),
                                  3,
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
              ]),
              e("div", Uo, [
                e("p", qo, [
                  a.pagination.total > 0
                    ? (c(),
                      p(
                        E,
                        { key: 0 },
                        [
                          oe(
                            "Showing " +
                              v((a.pagination.page - 1) * a.pagination.limit + 1) +
                              " to " +
                              v(
                                Math.min(
                                  a.pagination.page * a.pagination.limit,
                                  a.pagination.total,
                                ),
                              ) +
                              " of " +
                              v(a.pagination.total) +
                              " results",
                            1,
                          ),
                        ],
                        64,
                      ))
                    : (c(), p(E, { key: 1 }, [oe("No results found")], 64)),
                ]),
                Y(
                  r,
                  {
                    page: a.pagination.page,
                    "onUpdate:page": [
                      o[10] || (o[10] = (m) => (a.pagination.page = m)),
                      o[11] || (o[11] = (m) => n("pageChange", m)),
                    ],
                    total: a.pagination.total,
                    "items-per-page": a.pagination.limit,
                  },
                  null,
                  8,
                  ["page", "total", "items-per-page"],
                ),
              ]),
            ]),
          ])
        );
      };
    },
  }),
  jo = Object.assign(No, { __name: "FinanceDashboardCogsTab" }),
  Mo = { class: "bg-[#012D5A] rounded-xl p-4 mb-4" },
  Go = { class: "flex flex-col lg:flex-row gap-4" },
  Ko = { class: "flex-1" },
  Qo = { class: "flex items-center gap-4 mb-2" },
  zo = { class: "text-lg font-semibold text-white" },
  Vo = { class: "text-white/60 text-sm mb-4 max-w-xl" },
  Jo = { class: "flex items-center gap-6" },
  _o = { class: "text-white text-base font-semibold" },
  Wo = { class: "text-white text-base font-semibold" },
  Ho = { class: "text-green-400 text-base font-semibold" },
  Xo = { key: 0, class: "mt-3" },
  Zo = { class: "text-white/40 text-sm" },
  en = ue({
    __name: "FinanceCloseStatus",
    props: { financeCloseData: {} },
    emits: ["closePeriod"],
    setup(a, { emit: T }) {
      const i = a,
        n = B(() => {
          if (i.financeCloseData.status === "Closed" && i.financeCloseData.periodEnd)
            try {
              return new Date(i.financeCloseData.periodEnd).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            } catch {
              return "";
            }
          return "";
        });
      return (u, h) => (
        c(),
        p("div", Mo, [
          e("div", Go, [
            e("div", Ko, [
              e("div", Qo, [
                e("h3", zo, v(a.financeCloseData.period), 1),
                e(
                  "span",
                  {
                    class: J(
                      t(te)(
                        "px-2 py-0.5 text-sm font-medium rounded-md",
                        a.financeCloseData.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      ),
                    ),
                  },
                  v(a.financeCloseData.status),
                  3,
                ),
              ]),
              e("p", Vo, v(a.financeCloseData.description), 1),
              e("div", Jo, [
                e("div", null, [
                  h[0] || (h[0] = e("p", { class: "text-white/60 text-sm" }, "Revenue", -1)),
                  e("p", _o, v(a.financeCloseData.revenue), 1),
                ]),
                h[3] || (h[3] = e("div", { class: "w-[1px] h-8 bg-white/20" }, null, -1)),
                e("div", null, [
                  h[1] || (h[1] = e("p", { class: "text-white/60 text-sm" }, "COGS", -1)),
                  e("p", Wo, v(a.financeCloseData.cogs), 1),
                ]),
                h[4] || (h[4] = e("div", { class: "w-[1px] h-8 bg-white/20" }, null, -1)),
                e("div", null, [
                  h[2] || (h[2] = e("p", { class: "text-white/60 text-sm" }, "Nett P&L", -1)),
                  e("p", Ho, v(a.financeCloseData.nettPL), 1),
                ]),
              ]),
              a.financeCloseData.status === "Closed" && t(n)
                ? (c(), p("div", Xo, [e("p", Zo, "Closed on: " + v(t(n)), 1)]))
                : V("", !0),
            ]),
          ]),
        ])
      );
    },
  }),
  tn = Object.assign(en, { __name: "FinanceDashboardFinanceCloseStatus" }),
  an = { class: "border border-border rounded-xl bg-white" },
  sn = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  on = { class: "flex flex-wrap items-center gap-2" },
  nn = { class: "relative flex items-center" },
  rn = { class: "relative" },
  ln = {
    key: 0,
    class: "absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10",
  },
  dn = ["onClick"],
  cn = { key: 0, class: "text-xs text-muted-foreground" },
  un = {
    class:
      "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
  },
  gn = { class: "flex flex-wrap items-center gap-2 p-5 border-b border-border bg-gray-50/30" },
  pn = { class: "relative" },
  mn = ["value"],
  hn = ["value"],
  fn = ["disabled"],
  vn = ["value"],
  yn = { class: "overflow-x-auto" },
  bn = { class: "w-full" },
  xn = { key: 0 },
  wn = { class: "py-3 px-4" },
  Cn = { class: "text-sm font-medium text-[#012D5A]" },
  Sn = { class: "py-3 px-4 text-sm" },
  Tn = { class: "py-3 px-4 text-sm" },
  An = { class: "py-3 px-4 text-sm" },
  $n = { class: "py-3 px-4 text-sm text-right font-semibold" },
  Dn = { class: "flex items-center justify-between p-4 border-t border-border" },
  Pn = { class: "text-sm text-muted-foreground" },
  Fn = ue({
    __name: "FinanceCloseTransactions",
    props: {
      transactions: {},
      isLoading: { type: Boolean },
      isLoadingCustomers: { type: Boolean },
      pagination: {},
      companies: {},
      searchQuery: {},
      selectedYear: {},
      transactionType: {},
      customerId: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      availableYears: {},
      sortOptions: {},
      typeOptions: {},
    },
    emits: [
      "update:searchQuery",
      "update:selectedYear",
      "update:transactionType",
      "update:customerId",
      "update:showSortDropdown",
      "yearChange",
      "typeChange",
      "customerChange",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
    ],
    setup(a, { emit: T }) {
      const i = a,
        n = T,
        u = ae,
        h = B({ get: () => i.searchQuery, set: (C) => n("update:searchQuery", C) }),
        b = B({ get: () => i.selectedYear, set: (C) => n("update:selectedYear", C) }),
        y = B({ get: () => i.transactionType, set: (C) => n("update:transactionType", C) }),
        w = B({ get: () => i.customerId, set: (C) => n("update:customerId", C) }),
        g = B({ get: () => i.showSortDropdown, set: (C) => n("update:showSortDropdown", C) });
      return (C, l) => {
        const s = ze;
        return (
          c(),
          p("div", an, [
            e("div", sn, [
              l[14] ||
                (l[14] = e("h2", { class: "text-lg font-semibold" }, "Finance Transaction", -1)),
              e("div", on, [
                e("div", nn, [
                  H(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue":
                          l[0] || (l[0] = (o) => (k(h) ? (h.value = o) : null)),
                        onInput: l[1] || (l[1] = (o) => n("searchInput", o)),
                        onKeydown: l[2] || (l[2] = (o) => n("searchKeydown", o)),
                        type: "text",
                        placeholder: "Search job or customer...",
                        class:
                          "w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                      },
                      null,
                      544,
                    ),
                    [[Ke, t(h)]],
                  ),
                  Y(t(Ve), {
                    class:
                      "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  }),
                ]),
                e("div", rn, [
                  e(
                    "button",
                    {
                      class:
                        "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                      onClick: l[3] || (l[3] = (o) => n("toggleSortDropdown")),
                    },
                    [
                      Y(t(Je), { class: "w-4 h-4" }),
                      l[12] || (l[12] = e("span", null, "Sort", -1)),
                      Y(t(Ye), { class: "w-3 h-3" }),
                    ],
                  ),
                  t(g)
                    ? (c(),
                      p("div", ln, [
                        (c(!0),
                        p(
                          E,
                          null,
                          N(
                            a.sortOptions,
                            (o) => (
                              c(),
                              p(
                                "button",
                                {
                                  key: o.value,
                                  onClick: (d) => n("sort", o.value),
                                  class: J(
                                    t(te)(
                                      "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between",
                                      a.sortBy === o.value
                                        ? "text-[#012D5A] font-medium"
                                        : "text-gray-700",
                                    ),
                                  ),
                                },
                                [
                                  e("span", null, v(o.label), 1),
                                  a.sortBy === o.value
                                    ? (c(), p("span", cn, v(a.sortOrder === "asc" ? "↑" : "↓"), 1))
                                    : V("", !0),
                                ],
                                10,
                                dn,
                              )
                            ),
                          ),
                          128,
                        )),
                      ]))
                    : V("", !0),
                ]),
                e("button", un, [
                  Y(t(vt), { class: "w-4 h-4" }),
                  l[13] || (l[13] = e("span", null, "Export", -1)),
                ]),
              ]),
            ]),
            e("div", gn, [
              e("div", pn, [
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": l[4] || (l[4] = (o) => (k(b) ? (b.value = o) : null)),
                      onChange: l[5] || (l[5] = (o) => n("yearChange", o.target.value)),
                      class:
                        "appearance-none px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
                    },
                    [
                      l[15] || (l[15] = e("option", { value: "" }, "All Years", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.availableYears,
                          (o) => (c(), p("option", { key: o, value: o }, v(o), 9, mn)),
                        ),
                        128,
                      )),
                    ],
                    544,
                  ),
                  [[ne, t(b)]],
                ),
                Y(t(yt), {
                  class:
                    "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                }),
              ]),
              H(
                e(
                  "select",
                  {
                    "onUpdate:modelValue": l[6] || (l[6] = (o) => (k(y) ? (y.value = o) : null)),
                    onChange: l[7] || (l[7] = (o) => n("typeChange", t(y))),
                    class: "px-3 py-2 text-sm border border-border rounded-lg bg-white",
                  },
                  [
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.typeOptions,
                        (o) => (
                          c(), p("option", { key: o.value, value: o.value }, v(o.label), 9, hn)
                        ),
                      ),
                      128,
                    )),
                  ],
                  544,
                ),
                [[ne, t(y)]],
              ),
              H(
                e(
                  "select",
                  {
                    "onUpdate:modelValue": l[8] || (l[8] = (o) => (k(w) ? (w.value = o) : null)),
                    onChange: l[9] || (l[9] = (o) => n("customerChange", o.target.value)),
                    class: "px-3 py-2 text-sm border border-border rounded-lg bg-white",
                    disabled: a.isLoadingCustomers,
                  },
                  [
                    l[16] || (l[16] = e("option", { value: "" }, "All Customers", -1)),
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.companies,
                        (o) => (c(), p("option", { key: o.id, value: o.id }, v(o.name), 9, vn)),
                      ),
                      128,
                    )),
                  ],
                  40,
                  fn,
                ),
                [[ne, t(w)]],
              ),
            ]),
            e("div", yn, [
              e("table", bn, [
                l[18] ||
                  (l[18] = e(
                    "thead",
                    null,
                    [
                      e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                        e(
                          "th",
                          { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                          "JOB",
                        ),
                        e(
                          "th",
                          { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                          "Tanggal",
                        ),
                        e(
                          "th",
                          { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                          "Customer",
                        ),
                        e(
                          "th",
                          { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                          "Type",
                        ),
                        e(
                          "th",
                          { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                          "Total",
                        ),
                      ]),
                    ],
                    -1,
                  )),
                e("tbody", null, [
                  !a.transactions.length && !a.isLoading
                    ? (c(),
                      p("tr", xn, [
                        ...(l[17] ||
                          (l[17] = [
                            e(
                              "td",
                              { colspan: "5", class: "py-8 text-center text-muted-foreground" },
                              "No data available",
                              -1,
                            ),
                          ])),
                      ]))
                    : V("", !0),
                  (c(!0),
                  p(
                    E,
                    null,
                    N(
                      a.transactions,
                      (o) => (
                        c(),
                        p(
                          "tr",
                          { key: o.id, class: "border-b border-gray-100 hover:bg-gray-50/50" },
                          [
                            e("td", wn, [e("span", Cn, v(o.jobNumber), 1)]),
                            e("td", Sn, v(o.date), 1),
                            e("td", Tn, v(o.customer), 1),
                            e("td", An, [
                              e(
                                "span",
                                {
                                  class: J(
                                    t(te)(
                                      "px-2 py-1 rounded text-xs font-medium",
                                      o.isIncome
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-red-50 text-red-700 border border-red-200",
                                    ),
                                  ),
                                },
                                v(o.type),
                                3,
                              ),
                            ]),
                            e("td", $n, [
                              e(
                                "span",
                                { class: J(o.isIncome ? "text-green-700" : "text-red-600") },
                                v(t(u)(o.total)),
                                3,
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
            ]),
            e("div", Dn, [
              e("p", Pn, [
                a.pagination.total > 0
                  ? (c(),
                    p(
                      E,
                      { key: 0 },
                      [
                        oe(
                          "Showing " +
                            v((a.pagination.page - 1) * a.pagination.limit + 1) +
                            " to " +
                            v(
                              Math.min(a.pagination.page * a.pagination.limit, a.pagination.total),
                            ) +
                            " of " +
                            v(a.pagination.total) +
                            " results",
                          1,
                        ),
                      ],
                      64,
                    ))
                  : (c(), p(E, { key: 1 }, [oe("No results found")], 64)),
              ]),
              Y(
                s,
                {
                  page: a.pagination.page,
                  "onUpdate:page": [
                    l[10] || (l[10] = (o) => (a.pagination.page = o)),
                    l[11] || (l[11] = (o) => n("pageChange", o)),
                  ],
                  total: a.pagination.total,
                  "items-per-page": a.pagination.limit,
                },
                null,
                8,
                ["page", "total", "items-per-page"],
              ),
            ]),
          ])
        );
      };
    },
  }),
  In = Object.assign(Fn, { __name: "FinanceDashboardFinanceCloseTransactions" }),
  kn = { class: "space-y-4 px-6" },
  On = { key: 0, class: "mb-6" },
  Ln = { class: "bg-white rounded-lg border border-gray-200 overflow-hidden" },
  Yn = { class: "w-full text-sm" },
  En = ["onClick"],
  Bn = { class: "px-4 py-3" },
  Rn = { class: "font-medium text-gray-900" },
  Un = { class: "px-4 py-3 text-right text-gray-900" },
  qn = { class: "px-4 py-3 text-right text-gray-900" },
  Nn = { class: "px-4 py-3 text-center text-gray-600" },
  jn = ["onClick"],
  Mn = ue({
    __name: "FinanceCloseTab",
    props: {
      financeCloseData: {},
      transactions: {},
      isLoading: { type: Boolean },
      isLoadingCustomers: { type: Boolean },
      pagination: {},
      companies: {},
      searchQuery: {},
      selectedYear: {},
      transactionType: {},
      customerId: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      availableYears: {},
      sortOptions: {},
      typeOptions: {},
      closedPeriods: {},
    },
    emits: [
      "update:searchQuery",
      "update:selectedYear",
      "update:transactionType",
      "update:customerId",
      "update:sortBy",
      "update:sortOrder",
      "update:showSortDropdown",
      "yearChange",
      "typeChange",
      "customerChange",
      "search",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
      "reopenPeriod",
    ],
    setup(a, { emit: T }) {
      const i = Ge(),
        n = a,
        u = T,
        h = B(() => n.transactions || []);
      function b(w) {
        if (!w) return "";
        try {
          return new Date(w).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return "";
        }
      }
      function y(w) {
        i.push(`/finance/finance-close/${w.id}`);
      }
      return (w, g) => {
        const C = tn,
          l = In;
        return (
          c(),
          p("div", kn, [
            a.closedPeriods && a.closedPeriods.length > 0
              ? (c(),
                p("div", On, [
                  g[16] ||
                    (g[16] = e(
                      "h3",
                      { class: "text-sm font-semibold text-gray-700 mb-3" },
                      "Closed Periods History",
                      -1,
                    )),
                  e("div", Ln, [
                    e("table", Yn, [
                      g[15] ||
                        (g[15] = e(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            e("tr", null, [
                              e(
                                "th",
                                { class: "px-4 py-2 text-left text-gray-600 font-medium" },
                                "Period",
                              ),
                              e(
                                "th",
                                { class: "px-4 py-2 text-right text-gray-600 font-medium" },
                                "Revenue",
                              ),
                              e(
                                "th",
                                { class: "px-4 py-2 text-right text-gray-600 font-medium" },
                                "COGS",
                              ),
                              e(
                                "th",
                                { class: "px-4 py-2 text-right text-gray-600 font-medium" },
                                "Nett P&L",
                              ),
                              e(
                                "th",
                                { class: "px-4 py-2 text-center text-gray-600 font-medium" },
                                "Closed Date",
                              ),
                              e(
                                "th",
                                { class: "px-4 py-2 text-center text-gray-600 font-medium" },
                                "Actions",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      e("tbody", null, [
                        (c(!0),
                        p(
                          E,
                          null,
                          N(
                            a.closedPeriods,
                            (s) => (
                              c(),
                              p(
                                "tr",
                                {
                                  key: s.id,
                                  class:
                                    "border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                                  onClick: (o) => y(s),
                                },
                                [
                                  e("td", Bn, [
                                    e("span", Rn, v(s.period), 1),
                                    g[14] ||
                                      (g[14] = e(
                                        "span",
                                        {
                                          class:
                                            "ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded",
                                        },
                                        "Closed",
                                        -1,
                                      )),
                                  ]),
                                  e("td", Un, v(s.revenue), 1),
                                  e("td", qn, v(s.cogs), 1),
                                  e(
                                    "td",
                                    {
                                      class: J([
                                        "px-4 py-3 text-right font-medium",
                                        Number(s.nettPL.replace(/[^0-9.-]/g, "")) >= 0
                                          ? "text-green-600"
                                          : "text-red-600",
                                      ]),
                                    },
                                    v(s.nettPL),
                                    3,
                                  ),
                                  e("td", Nn, v(b(s.periodEnd)), 1),
                                  e(
                                    "td",
                                    {
                                      class: "px-4 py-3 text-center",
                                      onClick: g[0] || (g[0] = xs(() => {}, ["stop"])),
                                    },
                                    [
                                      e(
                                        "button",
                                        {
                                          onClick: (o) => u("reopenPeriod", s.id),
                                          class:
                                            "px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium transition-colors",
                                        },
                                        " Reopen ",
                                        8,
                                        jn,
                                      ),
                                    ],
                                  ),
                                ],
                                8,
                                En,
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                ]))
              : V("", !0),
            Y(C, { "finance-close-data": a.financeCloseData }, null, 8, ["finance-close-data"]),
            Y(
              l,
              {
                transactions: t(h),
                "is-loading": a.isLoading,
                "is-loading-customers": a.isLoadingCustomers,
                pagination: a.pagination,
                companies: a.companies,
                "search-query": a.searchQuery,
                "selected-year": a.selectedYear,
                "transaction-type": a.transactionType,
                "customer-id": a.customerId,
                "sort-by": a.sortBy,
                "sort-order": a.sortOrder,
                "show-sort-dropdown": a.showSortDropdown,
                "available-years": a.availableYears,
                "sort-options": a.sortOptions,
                "type-options": a.typeOptions,
                "onUpdate:searchQuery": g[1] || (g[1] = (s) => u("update:searchQuery", s)),
                "onUpdate:selectedYear": g[2] || (g[2] = (s) => u("update:selectedYear", s)),
                "onUpdate:transactionType": g[3] || (g[3] = (s) => u("update:transactionType", s)),
                "onUpdate:customerId": g[4] || (g[4] = (s) => u("update:customerId", s)),
                "onUpdate:showSortDropdown":
                  g[5] || (g[5] = (s) => u("update:showSortDropdown", s)),
                onYearChange: g[6] || (g[6] = (s) => u("yearChange", s)),
                onTypeChange: g[7] || (g[7] = (s) => u("typeChange", s)),
                onCustomerChange: g[8] || (g[8] = (s) => u("customerChange", s)),
                onSearchInput: g[9] || (g[9] = (s) => u("searchInput", s)),
                onSearchKeydown: g[10] || (g[10] = (s) => u("searchKeydown", s)),
                onSort: g[11] || (g[11] = (s) => u("sort", s)),
                onToggleSortDropdown: g[12] || (g[12] = (s) => u("toggleSortDropdown")),
                onPageChange: g[13] || (g[13] = (s) => u("pageChange", s)),
              },
              null,
              8,
              [
                "transactions",
                "is-loading",
                "is-loading-customers",
                "pagination",
                "companies",
                "search-query",
                "selected-year",
                "transaction-type",
                "customer-id",
                "sort-by",
                "sort-order",
                "show-sort-dropdown",
                "available-years",
                "sort-options",
                "type-options",
              ],
            ),
          ])
        );
      };
    },
  }),
  Gn = Object.assign(Mn, { __name: "FinanceDashboardFinanceCloseTab" }),
  Kn = { class: "bg-white rounded-xl border border-border p-4 h-full flex flex-col" },
  Qn = { class: "flex items-center justify-between mb-4" },
  zn = { class: "flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-md" },
  Vn = { class: "flex-1 flex items-center justify-center min-h-[200px]" },
  Jn = { class: "flex flex-col gap-3 mt-2" },
  _n = { class: "flex items-center gap-2" },
  Wn = { class: "text-xs text-gray-500" },
  Hn = { class: "text-xs font-semibold text-black" },
  Xn = ue({
    __name: "Top5Chart",
    props: { chartData: {}, options: {}, series: {} },
    setup(a) {
      const T = a,
        i = ["#1e3a8a", "#38bdf8", "#3b82f6", "#60a5fa", "#2563eb"],
        n = B(() => {
          const h = T.chartData?.top5 || [];
          if (h.length === 0)
            return [
              { name: "Lorem Ipsum", value: 40, color: i[0] },
              { name: "Dolor Sit", value: 30, color: i[1] },
              { name: "Amet Consect", value: 22, color: i[2] },
              { name: "Elit Sed", value: 10, color: i[3] },
              { name: "Tempor Inc", value: 8, color: i[4] },
            ];
          const b = h.toSorted((w, g) => g.value - w.value).slice(0, 5),
            y = b.reduce((w, g) => w + g.value, 0);
          return b.map((w, g) => ({
            name: w.name,
            value: y > 0 ? Math.round((w.value / y) * 100) : 0,
            color: i[g % i.length],
          }));
        }),
        u = A("Income");
      return (h, b) => {
        const y = Ea("apexchart"),
          w = Wt;
        return (
          c(),
          p("div", Kn, [
            e("div", Qn, [
              b[2] ||
                (b[2] = e("h3", { class: "text-sm font-semibold text-gray-900" }, "Top 5", -1)),
              e("div", zn, [
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": b[0] || (b[0] = (g) => (k(u) ? (u.value = g) : null)),
                      class: "text-xs font-medium text-gray-500 bg-transparent focus:outline-none",
                    },
                    [
                      ...(b[1] ||
                        (b[1] = [
                          e("option", { value: "Income" }, "Income", -1),
                          e("option", { value: "Outcome" }, "Outcome", -1),
                        ])),
                    ],
                    512,
                  ),
                  [[ne, t(u)]],
                ),
              ]),
            ]),
            e("div", Vn, [
              Y(w, null, {
                default: Pe(() => [
                  Y(
                    y,
                    { type: "donut", height: "220", options: a.options, series: a.series },
                    null,
                    8,
                    ["options", "series"],
                  ),
                ]),
                _: 1,
              }),
            ]),
            e("div", Jn, [
              (c(!0),
              p(
                E,
                null,
                N(
                  t(n),
                  (g) => (
                    c(),
                    p("div", { key: g.name, class: "flex items-center justify-between" }, [
                      e("div", _n, [
                        e(
                          "div",
                          {
                            class: "w-1.5 h-1.5 rounded-full",
                            style: ws({ backgroundColor: g.color }),
                          },
                          null,
                          4,
                        ),
                        e("span", Wn, v(g.name), 1),
                      ]),
                      e("span", Hn, v(g.value) + "%", 1),
                    ])
                  ),
                ),
                128,
              )),
            ]),
          ])
        );
      };
    },
  }),
  Zn = Object.assign(Xn, { __name: "FinanceTop5Chart" }),
  er = { class: "space-y-4 px-6" },
  tr = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  ar = { class: "grid grid-cols-1 lg:grid-cols-3 gap-4" },
  sr = { class: "lg:col-span-2 bg-white rounded-xl border border-border p-4" },
  or = { class: "h-72 w-full" },
  nr = { class: "bg-white rounded-xl border border-border p-4" },
  rr = { class: "h-72 w-full" },
  lr = ue({
    __name: "OverviewTab",
    props: {
      statsCards: {},
      financialChartOptions: {},
      financialChartSeries: {},
      top5ChartOptions: {},
      top5ChartSeries: {},
      chartData: {},
      marginTrendChartOptions: {},
      marginTrendChartSeries: {},
    },
    setup(a) {
      return (T, i) => {
        const n = Qe,
          u = Ea("apexchart"),
          h = Wt;
        return (
          c(),
          p("div", er, [
            e("div", tr, [
              (c(!0),
              p(
                E,
                null,
                N(
                  a.statsCards,
                  (b, y) => (c(), ie(n, { key: y, card: b, index: y }, null, 8, ["card", "index"])),
                ),
                128,
              )),
            ]),
            e("div", ar, [
              e("div", sr, [
                i[0] ||
                  (i[0] = e(
                    "div",
                    { class: "flex items-center justify-between mb-4" },
                    [
                      e(
                        "h3",
                        { class: "text-sm font-semibold text-gray-900" },
                        "Financial Overview",
                      ),
                    ],
                    -1,
                  )),
                e("div", or, [
                  Y(h, null, {
                    default: Pe(() => [
                      Y(
                        u,
                        {
                          type: "area",
                          height: "280",
                          options: a.financialChartOptions,
                          series: a.financialChartSeries,
                        },
                        null,
                        8,
                        ["options", "series"],
                      ),
                    ]),
                    _: 1,
                  }),
                ]),
              ]),
              Y(
                Zn,
                {
                  "chart-data": a.chartData,
                  options: a.top5ChartOptions,
                  series: a.top5ChartSeries,
                },
                null,
                8,
                ["chart-data", "options", "series"],
              ),
            ]),
            e("div", nr, [
              i[1] ||
                (i[1] = Cs(
                  '<div class="flex items-center justify-between mb-4"><h3 class="text-sm font-medium text-gray-900">Margin Trend</h3><div class="flex items-center gap-4"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-[#012D5A]"></div><span class="text-[10px] text-neutral-700">Margin</span></div></div></div>',
                  1,
                )),
              e("div", rr, [
                Y(h, null, {
                  default: Pe(() => [
                    Y(
                      u,
                      {
                        type: "area",
                        height: "280",
                        options: a.marginTrendChartOptions,
                        series: a.marginTrendChartSeries,
                      },
                      null,
                      8,
                      ["options", "series"],
                    ),
                  ]),
                  _: 1,
                }),
              ]),
            ]),
          ])
        );
      };
    },
  }),
  ir = Object.assign(lr, { __name: "FinanceDashboardOverviewTab" }),
  dr = { class: "space-y-4 px-6" },
  cr = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  ur = { class: "border border-border rounded-xl bg-white mt-4" },
  gr = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  pr = { class: "flex flex-wrap items-center gap-2" },
  mr = { class: "relative flex items-center" },
  hr = { class: "relative" },
  fr = {
    key: 0,
    class: "absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10",
  },
  vr = ["onClick"],
  yr = { key: 0, class: "text-xs text-muted-foreground" },
  br = { class: "flex items-center gap-2 p-5 border-b border-border bg-gray-50/30" },
  xr = { class: "relative" },
  wr = ["value"],
  Cr = ["value"],
  Sr = ["disabled"],
  Tr = ["value"],
  Ar = { class: "overflow-x-auto" },
  $r = { class: "w-full" },
  Dr = { key: 0 },
  Pr = { class: "py-3 px-4" },
  Fr = { class: "text-sm font-medium text-[#012D5A]" },
  Ir = { class: "py-3 px-4 text-sm" },
  kr = { class: "py-3 px-4 text-sm" },
  Or = { class: "py-3 px-4 text-sm" },
  Lr = { class: "py-3 px-4 text-sm" },
  Yr = { key: 1, class: "text-muted-foreground" },
  Er = { class: "py-3 px-4 text-sm text-right font-semibold" },
  Br = { class: "py-3 px-4 text-center" },
  Rr = { key: 0, class: "flex items-center justify-center gap-1" },
  Ur = { key: 1, class: "flex items-center justify-center gap-1" },
  qr = ["onClick"],
  Nr = ["onClick"],
  jr = { class: "flex items-center justify-between p-4 border-t border-border" },
  Mr = { class: "text-sm text-muted-foreground" },
  Gr = ue({
    __name: "TransactionTab",
    props: {
      statsCards: {},
      transactions: {},
      isLoading: { type: Boolean },
      isLoadingCustomers: { type: Boolean },
      pagination: {},
      companies: {},
      searchQuery: {},
      selectedYear: {},
      transactionType: {},
      customerId: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      availableYears: {},
      sortOptions: {},
      typeOptions: {},
    },
    emits: [
      "update:searchQuery",
      "update:selectedYear",
      "update:transactionType",
      "update:customerId",
      "update:sortBy",
      "update:sortOrder",
      "update:showSortDropdown",
      "yearChange",
      "typeChange",
      "customerChange",
      "search",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
      "export",
      "create",
      "edit",
      "delete",
    ],
    setup(a, { emit: T }) {
      const i = a,
        n = T,
        u = ae;
      function h(l) {
        return l.referenceType === "INVOICE" || l.referenceType === "PAYMENT";
      }
      const b = B({ get: () => i.searchQuery, set: (l) => n("update:searchQuery", l) }),
        y = B({ get: () => i.selectedYear, set: (l) => n("update:selectedYear", l) }),
        w = B({ get: () => i.transactionType, set: (l) => n("update:transactionType", l) }),
        g = B({ get: () => i.customerId, set: (l) => n("update:customerId", l) }),
        C = B({ get: () => i.showSortDropdown, set: (l) => n("update:showSortDropdown", l) });
      return (l, s) => {
        const o = Qe,
          d = ze;
        return (
          c(),
          p("div", dr, [
            e("div", cr, [
              (c(!0),
              p(
                E,
                null,
                N(
                  a.statsCards,
                  (r, m) => (c(), ie(o, { key: m, card: r, index: m }, null, 8, ["card", "index"])),
                ),
                128,
              )),
            ]),
            e("div", ur, [
              e("div", gr, [
                s[17] || (s[17] = e("h2", { class: "text-lg font-semibold" }, "Transactions", -1)),
                e("div", pr, [
                  e("div", mr, [
                    H(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            s[0] || (s[0] = (r) => (k(b) ? (b.value = r) : null)),
                          onInput: s[1] || (s[1] = (r) => n("searchInput", r)),
                          onKeydown: s[2] || (s[2] = (r) => n("searchKeydown", r)),
                          type: "text",
                          placeholder: "Search job or customer...",
                          class:
                            "w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                        },
                        null,
                        544,
                      ),
                      [[Ke, t(b)]],
                    ),
                    Y(t(Ve), {
                      class:
                        "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    }),
                  ]),
                  e("div", hr, [
                    e(
                      "button",
                      {
                        class:
                          "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                        onClick: s[3] || (s[3] = (r) => n("toggleSortDropdown")),
                      },
                      [
                        Y(t(Je), { class: "w-4 h-4" }),
                        s[14] || (s[14] = e("span", null, "Sort", -1)),
                        Y(t(Ye), { class: "w-3 h-3" }),
                      ],
                    ),
                    t(C)
                      ? (c(),
                        p("div", fr, [
                          (c(!0),
                          p(
                            E,
                            null,
                            N(
                              a.sortOptions,
                              (r) => (
                                c(),
                                p(
                                  "button",
                                  {
                                    key: r.value,
                                    onClick: (m) => n("sort", r.value),
                                    class: J(
                                      t(te)(
                                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between",
                                        a.sortBy === r.value
                                          ? "text-[#012D5A] font-medium"
                                          : "text-gray-700",
                                      ),
                                    ),
                                  },
                                  [
                                    e("span", null, v(r.label), 1),
                                    a.sortBy === r.value
                                      ? (c(),
                                        p("span", yr, v(a.sortOrder === "asc" ? "↑" : "↓"), 1))
                                      : V("", !0),
                                  ],
                                  10,
                                  vr,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : V("", !0),
                  ]),
                  e(
                    "button",
                    {
                      class:
                        "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                      onClick: s[4] || (s[4] = (r) => n("export")),
                    },
                    [
                      Y(t(vt), { class: "w-4 h-4" }),
                      s[15] || (s[15] = e("span", null, "Export", -1)),
                    ],
                  ),
                  e(
                    "button",
                    {
                      class:
                        "flex items-center gap-2 px-3 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg",
                      onClick: s[5] || (s[5] = (r) => n("create")),
                    },
                    [
                      Y(t(Ra), { class: "w-4 h-4" }),
                      s[16] || (s[16] = e("span", null, "Add Transaction", -1)),
                    ],
                  ),
                ]),
              ]),
              e("div", br, [
                e("div", xr, [
                  H(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue":
                          s[6] || (s[6] = (r) => (k(y) ? (y.value = r) : null)),
                        onChange: s[7] || (s[7] = (r) => n("yearChange", r.target.value)),
                        class:
                          "w-full flex-1 px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
                      },
                      [
                        s[18] || (s[18] = e("option", { value: "" }, "All Years", -1)),
                        (c(!0),
                        p(
                          E,
                          null,
                          N(
                            a.availableYears,
                            (r) => (c(), p("option", { key: r, value: r }, v(r), 9, wr)),
                          ),
                          128,
                        )),
                      ],
                      544,
                    ),
                    [[ne, t(y)]],
                  ),
                  Y(t(yt), {
                    class:
                      "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": s[8] || (s[8] = (r) => (k(w) ? (w.value = r) : null)),
                      onChange: s[9] || (s[9] = (r) => n("typeChange", t(w))),
                      class: "px-3 py-2 flex-1 text-sm border border-border rounded-lg bg-white",
                    },
                    [
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.typeOptions,
                          (r) => (
                            c(), p("option", { key: r.value, value: r.value }, v(r.label), 9, Cr)
                          ),
                        ),
                        128,
                      )),
                    ],
                    544,
                  ),
                  [[ne, t(w)]],
                ),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue":
                        s[10] || (s[10] = (r) => (k(g) ? (g.value = r) : null)),
                      onChange: s[11] || (s[11] = (r) => n("customerChange", r.target.value)),
                      class: "px-3 py-2 flex-1 text-sm border border-border rounded-lg bg-white",
                      disabled: a.isLoadingCustomers,
                    },
                    [
                      s[19] || (s[19] = e("option", { value: "" }, "All Customers", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.companies,
                          (r) => (c(), p("option", { key: r.id, value: r.id }, v(r.name), 9, Tr)),
                        ),
                        128,
                      )),
                    ],
                    40,
                    Sr,
                  ),
                  [[ne, t(g)]],
                ),
              ]),
              e("div", Ar, [
                e("table", $r, [
                  s[21] ||
                    (s[21] = e(
                      "thead",
                      null,
                      [
                        e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "JOB",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Tanggal",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Customer",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Type",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Payment Method",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Total",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-center text-sm font-medium text-gray-500" },
                            "Actions",
                          ),
                        ]),
                      ],
                      -1,
                    )),
                  e("tbody", null, [
                    !a.transactions.length && !a.isLoading
                      ? (c(),
                        p("tr", Dr, [
                          ...(s[20] ||
                            (s[20] = [
                              e(
                                "td",
                                { colspan: "7", class: "py-8 text-center text-muted-foreground" },
                                "No data available",
                                -1,
                              ),
                            ])),
                        ]))
                      : V("", !0),
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.transactions,
                        (r) => (
                          c(),
                          p(
                            "tr",
                            { key: r.id, class: "border-b border-gray-100 hover:bg-gray-50/50" },
                            [
                              e("td", Pr, [e("span", Fr, v(r.jobNumber), 1)]),
                              e("td", Ir, v(r.date), 1),
                              e("td", kr, v(r.customer), 1),
                              e("td", Or, [
                                e(
                                  "span",
                                  {
                                    class: J(
                                      t(te)(
                                        "px-2 py-1 rounded text-xs font-medium",
                                        r.isIncome
                                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                                          : "bg-red-50 text-red-700 border border-red-200",
                                      ),
                                    ),
                                  },
                                  v(r.type),
                                  3,
                                ),
                              ]),
                              e("td", Lr, [
                                r.paymentMethod
                                  ? (c(),
                                    p(
                                      "span",
                                      {
                                        key: 0,
                                        class: J(
                                          t(te)(
                                            "px-2 py-1 rounded text-xs font-medium",
                                            r.paymentMethod === "Cash"
                                              ? "bg-green-50 text-green-700 border border-green-200"
                                              : "bg-purple-50 text-purple-700 border border-purple-200",
                                          ),
                                        ),
                                      },
                                      v(r.paymentMethod),
                                      3,
                                    ))
                                  : (c(), p("span", Yr, "-")),
                              ]),
                              e("td", Er, [
                                e(
                                  "span",
                                  { class: J(r.isIncome ? "text-green-700" : "text-red-600") },
                                  v(t(u)(r.total)),
                                  3,
                                ),
                              ]),
                              e("td", Br, [
                                h(r)
                                  ? (c(),
                                    p("div", Rr, [
                                      Y(t(Ys), {
                                        class: "w-4 h-4 text-gray-400",
                                        title: "Auto-created from invoice",
                                      }),
                                    ]))
                                  : (c(),
                                    p("div", Ur, [
                                      e(
                                        "button",
                                        {
                                          class:
                                            "p-1.5 text-gray-500 hover:text-[#012D5A] hover:bg-gray-100 rounded transition-colors",
                                          title: "Edit transaction",
                                          onClick: (m) => n("edit", r),
                                        },
                                        [Y(t(Ps), { class: "w-4 h-4" })],
                                        8,
                                        qr,
                                      ),
                                      e(
                                        "button",
                                        {
                                          class:
                                            "p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors",
                                          title: "Delete transaction",
                                          onClick: (m) => n("delete", r),
                                        },
                                        [Y(t(Fs), { class: "w-4 h-4" })],
                                        8,
                                        Nr,
                                      ),
                                    ])),
                              ]),
                            ],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                ]),
              ]),
              e("div", jr, [
                e("p", Mr, [
                  a.pagination.total > 0
                    ? (c(),
                      p(
                        E,
                        { key: 0 },
                        [
                          oe(
                            "Showing " +
                              v((a.pagination.page - 1) * a.pagination.limit + 1) +
                              " to " +
                              v(
                                Math.min(
                                  a.pagination.page * a.pagination.limit,
                                  a.pagination.total,
                                ),
                              ) +
                              " of " +
                              v(a.pagination.total) +
                              " results",
                            1,
                          ),
                        ],
                        64,
                      ))
                    : (c(), p(E, { key: 1 }, [oe("No results found")], 64)),
                ]),
                Y(
                  d,
                  {
                    page: a.pagination.page,
                    "onUpdate:page": [
                      s[12] || (s[12] = (r) => (a.pagination.page = r)),
                      s[13] || (s[13] = (r) => n("pageChange", r)),
                    ],
                    total: a.pagination.total,
                    "items-per-page": a.pagination.limit,
                  },
                  null,
                  8,
                  ["page", "total", "items-per-page"],
                ),
              ]),
            ]),
          ])
        );
      };
    },
  }),
  Kr = Object.assign(Gr, { __name: "FinanceDashboardTransactionTab" }),
  Qr = { class: "space-y-4 px-6" },
  zr = {
    class:
      "flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border rounded-xl bg-[#012D5A] text-white p-5",
  },
  Vr = { class: "flex items-center gap-8" },
  Jr = { class: "flex items-center gap-6 text-sm" },
  _r = { class: "flex flex-col" },
  Wr = { class: "font-semibold text-base" },
  Hr = { class: "flex flex-col" },
  Xr = { class: "font-semibold text-base" },
  Zr = { key: 0, class: "flex items-center justify-center py-12" },
  el = { key: 1, class: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl" },
  tl = { key: 2, class: "space-y-4" },
  al = ["onClick"],
  sl = { class: "flex items-center gap-3" },
  ol = { class: "text-lg font-semibold text-[#012D5A]" },
  nl = { class: "px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-muted-foreground" },
  rl = { class: "flex items-center gap-6 text-sm" },
  ll = { class: "text-muted-foreground" },
  il = { class: "font-semibold text-foreground" },
  dl = { class: "text-muted-foreground" },
  cl = { class: "font-semibold text-foreground" },
  ul = { key: 0, class: "overflow-x-auto" },
  gl = { class: "w-full" },
  pl = ["onClick"],
  ml = { class: "py-3 px-4" },
  hl = { class: "text-sm font-medium text-[#012D5A]" },
  fl = { class: "py-3 px-4 text-sm" },
  vl = { class: "py-3 px-4 text-sm text-right font-semibold" },
  yl = { class: "py-3 px-4 text-sm text-right" },
  bl = { class: "py-3 px-4 text-sm text-right font-semibold" },
  xl = { class: "border border-border rounded-xl bg-[#012D5A] text-white overflow-hidden" },
  wl = { class: "flex justify-between items-center p-5" },
  Cl = { class: "flex gap-8 text-sm" },
  Sl = { class: "font-semibold" },
  Tl = { class: "font-semibold" },
  Al = {
    key: 0,
    class: "border border-border rounded-xl bg-white text-center py-12 text-muted-foreground",
  },
  $l = ue({
    __name: "TrialBalanceTab",
    props: { selectedPeriod: {}, selectedYear: {}, availableYears: {} },
    emits: ["update:selectedYear", "yearChange"],
    setup(a, { emit: T }) {
      const i = a,
        n = A(!1),
        u = A([]),
        h = A(null),
        b = A(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "COGS", "EXPENSE"]),
        y = ae,
        g = _t().public.apiBase || "";
      async function C() {
        ((n.value = !0), (h.value = null));
        try {
          const I = new URLSearchParams({ period: i.selectedPeriod });
          i.selectedYear && I.append("year", i.selectedYear);
          const P = await $fetch(`${g}/finance/dashboard/trial-balance?${I.toString()}`, {
            method: "GET",
            credentials: "include",
          });
          u.value = P || [];
        } catch (I) {
          (console.error("Failed to fetch trial balance:", I),
            (h.value = "Failed to load trial balance data"),
            (u.value = []));
        } finally {
          n.value = !1;
        }
      }
      function l(I) {
        const P = Ge(),
          q = new URLSearchParams({ period: i.selectedPeriod });
        (i.selectedYear && q.append("year", i.selectedYear),
          P.push(`/finance/trial-balance/${I}?${q.toString()}`));
      }
      function s(I) {
        const P = b.value.indexOf(I);
        P > -1 ? b.value.splice(P, 1) : b.value.push(I);
      }
      function o(I) {
        return b.value.includes(I);
      }
      function d(I) {
        return (
          {
            ASSET: "Assets",
            LIABILITY: "Liabilities",
            EQUITY: "Equity",
            REVENUE: "Revenue",
            COGS: "Cost of Goods Sold",
            EXPENSE: "Expenses",
          }[I] || I
        );
      }
      (De(
        () => [i.selectedPeriod, i.selectedYear],
        () => {
          C();
        },
      ),
        Ya(() => {
          C();
        }));
      const r = B(() => u.value.reduce((I, P) => I + P.totalDebit, 0)),
        m = B(() => u.value.reduce((I, P) => I + P.totalCredit, 0));
      return (I, P) => {
        const q = Is;
        return (
          c(),
          p("div", Qr, [
            e("div", zr, [
              e("div", Vr, [
                P[3] || (P[3] = e("h2", { class: "text-lg font-semibold" }, "Grand Total", -1)),
                e("div", Jr, [
                  e("div", _r, [
                    P[0] || (P[0] = e("span", { class: "text-white/60 text-xs" }, "Debit", -1)),
                    e("span", Wr, v(t(y)(t(r))), 1),
                  ]),
                  P[2] || (P[2] = e("div", { class: "w-px h-8 bg-white/20" }, null, -1)),
                  e("div", Hr, [
                    P[1] || (P[1] = e("span", { class: "text-white/60 text-xs" }, "Credit", -1)),
                    e("span", Xr, v(t(y)(t(m))), 1),
                  ]),
                ]),
              ]),
              Y(
                q,
                {
                  to: "/finance/journal/create",
                  class:
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#012D5A] hover:bg-white/90 rounded-lg transition-colors",
                },
                {
                  default: Pe(() => [...(P[4] || (P[4] = [e("span", null, "Input Jurnal", -1)]))]),
                  _: 1,
                },
              ),
            ]),
            n.value
              ? (c(),
                p("div", Zr, [
                  ...(P[5] ||
                    (P[5] = [
                      e(
                        "div",
                        { class: "flex items-center gap-2" },
                        [
                          e("div", {
                            class:
                              "w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin",
                          }),
                          e("span", { class: "text-muted-foreground" }, "Loading trial balance..."),
                        ],
                        -1,
                      ),
                    ])),
                ]))
              : h.value
                ? (c(), p("div", el, v(h.value), 1))
                : (c(),
                  p("div", tl, [
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        u.value,
                        (U) => (
                          c(),
                          p(
                            "div",
                            {
                              key: U.type,
                              class: "border border-border rounded-xl bg-white overflow-hidden",
                            },
                            [
                              e(
                                "button",
                                {
                                  class:
                                    "w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors",
                                  onClick: (O) => s(U.type),
                                },
                                [
                                  e("div", sl, [
                                    (c(),
                                    ie(Ss(o(U.type) ? t(ks) : t(Ye)), {
                                      class: "w-4 h-4 text-muted-foreground",
                                    })),
                                    e("h2", ol, v(d(U.type)), 1),
                                    e("span", nl, v(U.items.length) + " accounts", 1),
                                  ]),
                                  e("div", rl, [
                                    e("span", ll, [
                                      P[6] || (P[6] = oe("Debit: ", -1)),
                                      e("span", il, v(t(y)(U.totalDebit)), 1),
                                    ]),
                                    e("span", dl, [
                                      P[7] || (P[7] = oe("Credit: ", -1)),
                                      e("span", cl, v(t(y)(U.totalCredit)), 1),
                                    ]),
                                  ]),
                                ],
                                8,
                                al,
                              ),
                              o(U.type)
                                ? (c(),
                                  p("div", ul, [
                                    e("table", gl, [
                                      P[8] ||
                                        (P[8] = e(
                                          "thead",
                                          null,
                                          [
                                            e(
                                              "tr",
                                              {
                                                class:
                                                  "border-b border-t border-border bg-gray-50/50",
                                              },
                                              [
                                                e(
                                                  "th",
                                                  {
                                                    class:
                                                      "py-3 px-4 text-left text-sm font-medium text-gray-500",
                                                  },
                                                  "Account Code",
                                                ),
                                                e(
                                                  "th",
                                                  {
                                                    class:
                                                      "py-3 px-4 text-left text-sm font-medium text-gray-500",
                                                  },
                                                  "Account Name",
                                                ),
                                                e(
                                                  "th",
                                                  {
                                                    class:
                                                      "py-3 px-4 text-right text-sm font-medium text-gray-500",
                                                  },
                                                  " Opening Balance ",
                                                ),
                                                e(
                                                  "th",
                                                  {
                                                    class:
                                                      "py-3 px-4 text-right text-sm font-medium text-gray-500",
                                                  },
                                                  "Debit",
                                                ),
                                                e(
                                                  "th",
                                                  {
                                                    class:
                                                      "py-3 px-4 text-right text-sm font-medium text-gray-500",
                                                  },
                                                  "Credit",
                                                ),
                                              ],
                                            ),
                                          ],
                                          -1,
                                        )),
                                      e("tbody", null, [
                                        (c(!0),
                                        p(
                                          E,
                                          null,
                                          N(
                                            U.items,
                                            (O) => (
                                              c(),
                                              p(
                                                "tr",
                                                {
                                                  key: O.id,
                                                  class:
                                                    "border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors",
                                                  onClick: (ee) => l(O.id),
                                                },
                                                [
                                                  e("td", ml, [e("span", hl, v(O.accountCode), 1)]),
                                                  e("td", fl, v(O.accountName), 1),
                                                  e("td", vl, [
                                                    e(
                                                      "span",
                                                      {
                                                        class: J(
                                                          O.openingBalance >= 0
                                                            ? "text-green-700"
                                                            : "text-red-600",
                                                        ),
                                                      },
                                                      v(t(y)(O.openingBalance)),
                                                      3,
                                                    ),
                                                  ]),
                                                  e("td", yl, v(t(y)(O.debitTotal)), 1),
                                                  e("td", bl, [
                                                    e(
                                                      "span",
                                                      {
                                                        class: J(
                                                          O.closingBalance >= 0
                                                            ? "text-green-700"
                                                            : "text-red-600",
                                                        ),
                                                      },
                                                      v(t(y)(O.closingBalance)),
                                                      3,
                                                    ),
                                                  ]),
                                                ],
                                                8,
                                                pl,
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                    ]),
                                  ]))
                                : V("", !0),
                            ],
                          )
                        ),
                      ),
                      128,
                    )),
                    e("div", xl, [
                      e("div", wl, [
                        P[11] ||
                          (P[11] = e("h2", { class: "text-lg font-semibold" }, "Grand Total", -1)),
                        e("div", Cl, [
                          e("span", null, [
                            P[9] || (P[9] = oe("Debit: ", -1)),
                            e("span", Sl, v(t(y)(t(r))), 1),
                          ]),
                          e("span", null, [
                            P[10] || (P[10] = oe("Credit: ", -1)),
                            e("span", Tl, v(t(y)(t(m))), 1),
                          ]),
                        ]),
                      ]),
                    ]),
                    u.value.length === 0
                      ? (c(),
                        p("div", Al, " No trial balance data available for the selected period "))
                      : V("", !0),
                  ])),
          ])
        );
      };
    },
  }),
  Dl = Object.assign($l, { __name: "FinanceDashboardTrialBalanceTab" }),
  Pl = { class: "space-y-4 px-6" },
  Fl = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  Il = { class: "flex items-center gap-2 mt-4 mb-4" },
  kl = { class: "flex items-center bg-white border border-border rounded-lg p-1" },
  Ol = { class: "border border-border rounded-xl bg-white" },
  Ll = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  Yl = { class: "text-lg font-semibold" },
  El = { class: "flex flex-wrap items-center gap-2" },
  Bl = { class: "relative flex items-center" },
  Rl = { class: "relative" },
  Ul = {
    key: 0,
    class: "absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10",
  },
  ql = ["onClick"],
  Nl = { key: 0, class: "text-xs text-muted-foreground" },
  jl = { class: "flex flex-wrap items-center gap-2 p-5 border-b border-border bg-gray-50/30" },
  Ml = ["value"],
  Gl = { class: "overflow-x-auto" },
  Kl = { class: "w-full" },
  Ql = { key: 0 },
  zl = { class: "py-3 px-4" },
  Vl = { class: "text-sm font-medium text-[#012D5A]" },
  Jl = { class: "py-3 px-4 text-sm" },
  _l = { class: "py-3 px-4 text-sm text-right font-medium" },
  Wl = { class: "py-3 px-4 text-sm text-right text-green-600" },
  Hl = { class: "py-3 px-4 text-sm" },
  Xl = { class: "py-3 px-4 text-center" },
  Zl = { class: "py-3 px-4 text-center" },
  ei = { class: "py-3 px-4 text-center" },
  ti = ["onClick"],
  ai = { key: 1, class: "text-xs text-green-600 flex items-center justify-center gap-1" },
  si = { class: "flex items-center justify-between p-4 border-t border-border" },
  oi = { class: "text-sm text-muted-foreground" },
  ni = { key: 0, class: "space-y-4" },
  ri = { class: "p-3 bg-gray-50 rounded-lg" },
  li = { class: "flex justify-between items-center mb-2" },
  ii = { class: "text-sm font-medium text-[#012D5A]" },
  di = { class: "flex justify-between items-center mb-2" },
  ci = { class: "text-sm font-medium" },
  ui = { class: "flex justify-between items-center" },
  gi = { class: "text-sm font-medium text-red-600" },
  pi = {
    key: 0,
    class: "p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3",
  },
  mi = { key: 1, class: "p-3 bg-red-50 border border-red-200 rounded-lg" },
  hi = { class: "text-sm text-red-600" },
  fi = { key: 2, class: "space-y-4" },
  vi = ["value", "max"],
  yi = ["value"],
  bi = ["value"],
  xi = ["value"],
  wi = ["value"],
  Ci = ["value"],
  Si = ["disabled"],
  Ti = { key: 0 },
  Ai = { key: 1 },
  $i = ue({
    __name: "AccountsReceivableTab",
    props: {
      stats: {},
      items: {},
      isLoading: { type: Boolean },
      pagination: {},
      searchQuery: {},
      arApToggle: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      statusFilter: {},
      sortOptions: {},
      statusOptions: {},
    },
    emits: [
      "update:searchQuery",
      "update:arApToggle",
      "update:sortBy",
      "update:sortOrder",
      "update:showSortDropdown",
      "update:statusFilter",
      "search",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
      "statusFilterChange",
      "refresh",
    ],
    setup(a, { emit: T }) {
      const i = a,
        n = T,
        u = ae,
        h = (L) =>
          new Date(L).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        b = B(() =>
          i.arApToggle === "ar"
            ? [
                { title: "Total Piutang (AR)", value: u(i.stats.totalAr), isPrimary: !0 },
                { title: "Piutang Overdue", value: u(i.stats.overdueAr), isPrimary: !1 },
              ]
            : [
                { title: "Total Hutang (AP)", value: u(i.stats.totalAp), isPrimary: !0 },
                { title: "Hutang Overdue", value: u(i.stats.overdueAp), isPrimary: !1 },
              ],
        ),
        y = B({ get: () => i.searchQuery, set: (L) => n("update:searchQuery", L) });
      B({ get: () => i.arApToggle, set: (L) => n("update:arApToggle", L) });
      const w = B({ get: () => i.showSortDropdown, set: (L) => n("update:showSortDropdown", L) }),
        g = B({ get: () => i.statusFilter, set: (L) => n("update:statusFilter", L) });
      De(
        () => i.statusFilter,
        (L) => {
          n("statusFilterChange", L);
        },
      );
      const C = (L) => {
          switch (L) {
            case "paid":
              return "bg-green-50 text-green-700 border-green-200";
            case "partial":
              return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "payment_out":
              return "bg-red-50 text-red-700 border-red-200";
            default:
              return "bg-gray-50 text-gray-700 border-gray-200";
          }
        },
        l = (L) => {
          switch (L) {
            case "paid":
              return "Paid";
            case "partial":
              return "Partial";
            case "payment_out":
              return "Payment Out";
            default:
              return L;
          }
        },
        s = (L) => (L === null ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"),
        o = (L) => (L === null ? "-" : `+${L}d`),
        { createPayment: d, isLoading: r } = Ls(),
        m = A(!1),
        I = A(null),
        P = A(null),
        q = A(!1);
      function U() {
        return new Date().toISOString().split("T")[0] || "";
      }
      const O = A({ amount: 0, paymentDate: U(), paymentMethodId: "", reference: "", notes: "" }),
        ee = [
          { id: "cash", name: "Cash" },
          { id: "bank_transfer", name: "Bank Transfer" },
          { id: "cheque", name: "Cheque" },
          { id: "credit_card", name: "Credit Card" },
        ];
      function R(L) {
        ((I.value = L),
          (O.value = {
            amount: L.remaining,
            paymentDate: U(),
            paymentMethodId: "",
            reference: "",
            notes: "",
          }),
          (P.value = null),
          (q.value = !1),
          (m.value = !0));
      }
      function j() {
        ((m.value = !1), (I.value = null), (P.value = null), (q.value = !1));
      }
      async function M() {
        if (!I.value) return;
        ((P.value = null), (q.value = !1));
        const L = await d({
          companyId: I.value.companyId,
          amount: O.value.amount,
          paymentDate: O.value.paymentDate,
          paymentMethodId: O.value.paymentMethodId || void 0,
          reference: O.value.reference || void 0,
          notes: O.value.notes || void 0,
          allocations: [{ invoiceId: I.value.id, amount: O.value.amount }],
        });
        L.success
          ? ((q.value = !0),
            setTimeout(() => {
              (j(), n("refresh"));
            }, 1500))
          : (P.value = L.error || "Failed to create payment");
      }
      function de(L) {
        const S = L.target;
        O.value.amount = Number(S.value) || 0;
      }
      function me(L) {
        const S = L.target;
        O.value.paymentDate = S.value;
      }
      function ge(L) {
        const S = L.target;
        O.value.paymentMethodId = S.value;
      }
      function he(L) {
        const S = L.target;
        O.value.reference = S.value;
      }
      function fe(L) {
        const S = L.target;
        O.value.notes = S.value;
      }
      function pe(L) {
        return L.remaining <= 0;
      }
      return (L, S) => {
        const K = Qe,
          Z = ze,
          se = Os;
        return (
          c(),
          p("div", Pl, [
            e("div", Fl, [
              (c(!0),
              p(
                E,
                null,
                N(
                  t(b),
                  (F, W) => (c(), ie(K, { key: W, card: F, index: W }, null, 8, ["card", "index"])),
                ),
                128,
              )),
            ]),
            e("div", Il, [
              S[10] || (S[10] = e("span", { class: "text-sm text-muted-foreground" }, "View:", -1)),
              e("div", kl, [
                e(
                  "button",
                  {
                    class: J(
                      t(te)(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                        a.arApToggle === "ar"
                          ? "bg-[#012D5A] text-white"
                          : "text-muted-foreground hover:text-foreground",
                      ),
                    ),
                    onClick: S[0] || (S[0] = (F) => n("update:arApToggle", "ar")),
                  },
                  " AR ",
                  2,
                ),
                e(
                  "button",
                  {
                    class: J(
                      t(te)(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                        a.arApToggle === "ap"
                          ? "bg-[#012D5A] text-white"
                          : "text-muted-foreground hover:text-foreground",
                      ),
                    ),
                    onClick: S[1] || (S[1] = (F) => n("update:arApToggle", "ap")),
                  },
                  " AP ",
                  2,
                ),
              ]),
            ]),
            e("div", Ol, [
              e("div", Ll, [
                e("h2", Yl, v(a.arApToggle === "ar" ? "Account Receivable" : "Account Payable"), 1),
                e("div", El, [
                  e("div", Bl, [
                    H(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            S[2] || (S[2] = (F) => (k(y) ? (y.value = F) : null)),
                          onInput: S[3] || (S[3] = (F) => n("searchInput", F)),
                          onKeydown: S[4] || (S[4] = (F) => n("searchKeydown", F)),
                          type: "text",
                          placeholder: "Search by company...",
                          class:
                            "w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                        },
                        null,
                        544,
                      ),
                      [[Ke, t(y)]],
                    ),
                    Y(t(Ve), {
                      class:
                        "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    }),
                  ]),
                  e("div", Rl, [
                    e(
                      "button",
                      {
                        class:
                          "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                        onClick: S[5] || (S[5] = (F) => n("toggleSortDropdown")),
                      },
                      [
                        Y(t(Je), { class: "w-4 h-4" }),
                        S[11] || (S[11] = e("span", null, "Sort", -1)),
                        Y(t(Ye), { class: "w-3 h-3" }),
                      ],
                    ),
                    t(w)
                      ? (c(),
                        p("div", Ul, [
                          (c(!0),
                          p(
                            E,
                            null,
                            N(
                              a.sortOptions,
                              (F) => (
                                c(),
                                p(
                                  "button",
                                  {
                                    key: F.value,
                                    onClick: (W) => n("sort", F.value),
                                    class: J(
                                      t(te)(
                                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between",
                                        a.sortBy === F.value
                                          ? "text-[#012D5A] font-medium"
                                          : "text-gray-700",
                                      ),
                                    ),
                                  },
                                  [
                                    e("span", null, v(F.label), 1),
                                    a.sortBy === F.value
                                      ? (c(),
                                        p("span", Nl, v(a.sortOrder === "asc" ? "↑" : "↓"), 1))
                                      : V("", !0),
                                  ],
                                  10,
                                  ql,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : V("", !0),
                  ]),
                ]),
              ]),
              e("div", jl, [
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": S[6] || (S[6] = (F) => (k(g) ? (g.value = F) : null)),
                      class: "px-3 py-2 text-sm border border-border rounded-lg bg-white",
                    },
                    [
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.statusOptions,
                          (F) => (
                            c(), p("option", { key: F.value, value: F.value }, v(F.label), 9, Ml)
                          ),
                        ),
                        128,
                      )),
                    ],
                    512,
                  ),
                  [[ne, t(g)]],
                ),
              ]),
              e("div", Gl, [
                e("table", Kl, [
                  S[14] ||
                    (S[14] = e(
                      "thead",
                      null,
                      [
                        e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Invoice No.",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Company",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Total",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Pay",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Remain",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Due Date",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-center text-sm font-medium text-gray-500" },
                            "Aging",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-center text-sm font-medium text-gray-500" },
                            "Status",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-center text-sm font-medium text-gray-500" },
                            "Aksi",
                          ),
                        ]),
                      ],
                      -1,
                    )),
                  e("tbody", null, [
                    !a.items.length && !a.isLoading
                      ? (c(),
                        p("tr", Ql, [
                          ...(S[12] ||
                            (S[12] = [
                              e(
                                "td",
                                { colspan: "9", class: "py-8 text-center text-muted-foreground" },
                                "No data available",
                                -1,
                              ),
                            ])),
                        ]))
                      : V("", !0),
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.items,
                        (F) => (
                          c(),
                          p(
                            "tr",
                            { key: F.id, class: "border-b border-gray-100 hover:bg-gray-50/50" },
                            [
                              e("td", zl, [e("span", Vl, v(F.invoiceNumber), 1)]),
                              e("td", Jl, v(F.company), 1),
                              e("td", _l, v(t(u)(F.total)), 1),
                              e("td", Wl, v(t(u)(F.paid)), 1),
                              e(
                                "td",
                                {
                                  class: J([
                                    "py-3 px-4 text-sm text-right font-medium",
                                    F.remaining > 0 ? "text-red-600" : "",
                                  ]),
                                },
                                v(t(u)(F.remaining)),
                                3,
                              ),
                              e("td", Hl, v(h(F.dueDate)), 1),
                              e("td", Xl, [
                                e(
                                  "span",
                                  {
                                    class: J(
                                      t(te)("px-2 py-1 rounded text-xs font-medium", s(F.aging)),
                                    ),
                                  },
                                  v(o(F.aging)),
                                  3,
                                ),
                              ]),
                              e("td", Zl, [
                                e(
                                  "span",
                                  {
                                    class: J(
                                      t(te)(
                                        "px-2 py-1 rounded text-xs font-medium border",
                                        C(F.status),
                                      ),
                                    ),
                                  },
                                  v(l(F.status)),
                                  3,
                                ),
                              ]),
                              e("td", ei, [
                                pe(F)
                                  ? (c(),
                                    p("span", ai, [
                                      Y(t(ra), { class: "w-3 h-3" }),
                                      S[13] || (S[13] = oe(" Lunas ", -1)),
                                    ]))
                                  : (c(),
                                    p(
                                      "button",
                                      {
                                        key: 0,
                                        onClick: (W) => R(F),
                                        class:
                                          "px-3 py-1.5 text-xs font-medium bg-[#012D5A] text-white rounded-md hover:bg-[#012D5A]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#012D5A] focus:ring-offset-2",
                                      },
                                      " Lunasi ",
                                      8,
                                      ti,
                                    )),
                              ]),
                            ],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                ]),
              ]),
              e("div", si, [
                e("p", oi, [
                  a.pagination.total > 0
                    ? (c(),
                      p(
                        E,
                        { key: 0 },
                        [
                          oe(
                            " Showing " +
                              v((a.pagination.page - 1) * a.pagination.limit + 1) +
                              " to " +
                              v(
                                Math.min(
                                  a.pagination.page * a.pagination.limit,
                                  a.pagination.total,
                                ),
                              ) +
                              " of " +
                              v(a.pagination.total) +
                              " results ",
                            1,
                          ),
                        ],
                        64,
                      ))
                    : (c(), p(E, { key: 1 }, [oe("No results found")], 64)),
                ]),
                Y(
                  Z,
                  {
                    page: a.pagination.page,
                    "onUpdate:page": [
                      S[7] || (S[7] = (F) => (a.pagination.page = F)),
                      S[8] || (S[8] = (F) => n("pageChange", F)),
                    ],
                    total: a.pagination.total,
                    "items-per-page": a.pagination.limit,
                  },
                  null,
                  8,
                  ["page", "total", "items-per-page"],
                ),
              ]),
            ]),
            Y(
              se,
              {
                modelValue: t(m),
                "onUpdate:modelValue": S[9] || (S[9] = (F) => (k(m) ? (m.value = F) : null)),
                title: "Lunasi Invoice",
                description: "Record payment for the invoice",
                width: "max-w-md",
              },
              {
                footer: Pe(() => [
                  t(q)
                    ? V("", !0)
                    : (c(),
                      p(
                        "button",
                        {
                          key: 0,
                          onClick: j,
                          class:
                            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors",
                        },
                        " Cancel ",
                      )),
                  t(q)
                    ? (c(),
                      p(
                        "button",
                        {
                          key: 2,
                          onClick: j,
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors",
                        },
                        " Close ",
                      ))
                    : (c(),
                      p(
                        "button",
                        {
                          key: 1,
                          onClick: M,
                          disabled: t(r) || t(O).amount <= 0,
                          class:
                            "px-4 py-2 text-sm font-medium text-white bg-[#012D5A] rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        },
                        [
                          t(r)
                            ? (c(), p("span", Ti, "Processing..."))
                            : (c(), p("span", Ai, "Save Payment")),
                        ],
                        8,
                        Si,
                      )),
                ]),
                default: Pe(() => [
                  t(I)
                    ? (c(),
                      p("div", ni, [
                        e("div", ri, [
                          e("div", li, [
                            S[15] ||
                              (S[15] = e(
                                "span",
                                { class: "text-sm text-muted-foreground" },
                                "Invoice",
                                -1,
                              )),
                            e("span", ii, v(t(I).invoiceNumber), 1),
                          ]),
                          e("div", di, [
                            S[16] ||
                              (S[16] = e(
                                "span",
                                { class: "text-sm text-muted-foreground" },
                                "Company",
                                -1,
                              )),
                            e("span", ci, v(t(I).company), 1),
                          ]),
                          e("div", ui, [
                            S[17] ||
                              (S[17] = e(
                                "span",
                                { class: "text-sm text-muted-foreground" },
                                "Sisa",
                                -1,
                              )),
                            e("span", gi, v(t(u)(t(I).remaining)), 1),
                          ]),
                        ]),
                        t(q)
                          ? (c(),
                            p("div", pi, [
                              Y(t(ra), { class: "w-5 h-5 text-green-600" }),
                              S[18] ||
                                (S[18] = e(
                                  "span",
                                  { class: "text-sm text-green-700" },
                                  "Payment recorded successfully!",
                                  -1,
                                )),
                            ]))
                          : V("", !0),
                        t(P) ? (c(), p("div", mi, [e("span", hi, v(t(P)), 1)])) : V("", !0),
                        t(q)
                          ? V("", !0)
                          : (c(),
                            p("div", fi, [
                              e("div", null, [
                                S[19] ||
                                  (S[19] = e(
                                    "label",
                                    {
                                      for: "payment-amount",
                                      class: "block text-sm font-medium text-gray-700 mb-1",
                                    },
                                    " Amount ",
                                    -1,
                                  )),
                                e(
                                  "input",
                                  {
                                    id: "payment-amount",
                                    type: "number",
                                    value: t(O).amount,
                                    onInput: de,
                                    class:
                                      "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                    placeholder: "Enter amount",
                                    min: "0",
                                    max: t(I).remaining,
                                  },
                                  null,
                                  40,
                                  vi,
                                ),
                              ]),
                              e("div", null, [
                                S[20] ||
                                  (S[20] = e(
                                    "label",
                                    {
                                      for: "payment-date",
                                      class: "block text-sm font-medium text-gray-700 mb-1",
                                    },
                                    " Payment Date ",
                                    -1,
                                  )),
                                e(
                                  "input",
                                  {
                                    id: "payment-date",
                                    type: "date",
                                    value: t(O).paymentDate,
                                    onInput: me,
                                    class:
                                      "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                  },
                                  null,
                                  40,
                                  yi,
                                ),
                              ]),
                              e("div", null, [
                                S[22] ||
                                  (S[22] = e(
                                    "label",
                                    {
                                      for: "payment-method",
                                      class: "block text-sm font-medium text-gray-700 mb-1",
                                    },
                                    " Payment Method ",
                                    -1,
                                  )),
                                e(
                                  "select",
                                  {
                                    id: "payment-method",
                                    value: t(O).paymentMethodId,
                                    onChange: ge,
                                    class:
                                      "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                  },
                                  [
                                    S[21] ||
                                      (S[21] = e("option", { value: "" }, "Select method", -1)),
                                    (c(),
                                    p(
                                      E,
                                      null,
                                      N(ee, (F) =>
                                        e("option", { key: F.id, value: F.id }, v(F.name), 9, xi),
                                      ),
                                      64,
                                    )),
                                  ],
                                  40,
                                  bi,
                                ),
                              ]),
                              e("div", null, [
                                S[23] ||
                                  (S[23] = e(
                                    "label",
                                    {
                                      for: "payment-reference",
                                      class: "block text-sm font-medium text-gray-700 mb-1",
                                    },
                                    " Reference (Optional) ",
                                    -1,
                                  )),
                                e(
                                  "input",
                                  {
                                    id: "payment-reference",
                                    type: "text",
                                    value: t(O).reference,
                                    onInput: he,
                                    class:
                                      "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                    placeholder: "Transaction number, cheque number, etc.",
                                  },
                                  null,
                                  40,
                                  wi,
                                ),
                              ]),
                              e("div", null, [
                                S[24] ||
                                  (S[24] = e(
                                    "label",
                                    {
                                      for: "payment-notes",
                                      class: "block text-sm font-medium text-gray-700 mb-1",
                                    },
                                    " Notes (Optional) ",
                                    -1,
                                  )),
                                e(
                                  "textarea",
                                  {
                                    id: "payment-notes",
                                    value: t(O).notes,
                                    onInput: fe,
                                    class:
                                      "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                                    placeholder: "Additional notes...",
                                    rows: "2",
                                  },
                                  null,
                                  40,
                                  Ci,
                                ),
                              ]),
                            ])),
                      ]))
                    : V("", !0),
                ]),
                _: 1,
              },
              8,
              ["modelValue"],
            ),
          ])
        );
      };
    },
  }),
  Di = Object.assign($i, { __name: "FinanceDashboardAccountsReceivableTab" }),
  Pi = { class: "space-y-4 px-6" },
  Fi = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  Ii = { class: "border border-border rounded-xl bg-white mt-4" },
  ki = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  Oi = { class: "flex flex-wrap items-center gap-2" },
  Li = { class: "relative flex items-center" },
  Yi = { class: "relative" },
  Ei = {
    key: 0,
    class: "absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10",
  },
  Bi = ["onClick"],
  Ri = { key: 0, class: "text-xs text-muted-foreground" },
  Ui = { class: "flex items-center gap-2 p-5 border-b border-border bg-gray-50/30" },
  qi = { class: "relative flex-1" },
  Ni = ["value"],
  ji = ["disabled"],
  Mi = ["value"],
  Gi = ["disabled"],
  Ki = ["value"],
  Qi = { class: "overflow-x-auto" },
  zi = { class: "w-full" },
  Vi = { key: 0 },
  Ji = { class: "py-3 px-4" },
  _i = { class: "text-sm font-medium text-[#012D5A]" },
  Wi = { class: "py-3 px-4 text-sm" },
  Hi = { class: "py-3 px-4 text-sm" },
  Xi = { class: "py-3 px-4 text-sm text-right font-medium" },
  Zi = { class: "flex items-center justify-between p-4 border-t border-border" },
  ed = { class: "text-sm text-muted-foreground" },
  td = ue({
    __name: "AssetsTab",
    props: {
      statsCards: {},
      assets: {},
      isLoading: { type: Boolean },
      isLoadingServices: { type: Boolean },
      isLoadingCompanies: { type: Boolean },
      pagination: {},
      services: {},
      companies: {},
      searchQuery: {},
      selectedYear: {},
      serviceId: {},
      companyId: {},
      sortBy: {},
      sortOrder: {},
      showSortDropdown: { type: Boolean },
      availableYears: {},
      sortOptions: {},
    },
    emits: [
      "update:searchQuery",
      "update:selectedYear",
      "update:serviceId",
      "update:companyId",
      "update:sortBy",
      "update:sortOrder",
      "update:showSortDropdown",
      "yearChange",
      "serviceChange",
      "companyChange",
      "search",
      "searchInput",
      "searchKeydown",
      "sort",
      "toggleSortDropdown",
      "pageChange",
      "export",
      "addAsset",
    ],
    setup(a, { emit: T }) {
      const i = a,
        n = T,
        u = ae,
        h = (l) =>
          new Date(l).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        b = B({ get: () => i.searchQuery, set: (l) => n("update:searchQuery", l) }),
        y = B({ get: () => i.selectedYear, set: (l) => n("update:selectedYear", l) }),
        w = B({ get: () => i.serviceId, set: (l) => n("update:serviceId", l) }),
        g = B({ get: () => i.companyId, set: (l) => n("update:companyId", l) }),
        C = B({ get: () => i.showSortDropdown, set: (l) => n("update:showSortDropdown", l) });
      return (l, s) => {
        const o = Qe,
          d = ze;
        return (
          c(),
          p("div", Pi, [
            e("div", Fi, [
              (c(!0),
              p(
                E,
                null,
                N(
                  a.statsCards,
                  (r, m) => (
                    c(),
                    ie(
                      o,
                      { key: m, card: r, index: m, class: J(m < 2 ? "md:col-span-2" : "") },
                      null,
                      8,
                      ["card", "index", "class"],
                    )
                  ),
                ),
                128,
              )),
            ]),
            e("div", Ii, [
              e("div", ki, [
                s[17] || (s[17] = e("h2", { class: "text-lg font-semibold" }, "Assets", -1)),
                e("div", Oi, [
                  e("div", Li, [
                    H(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            s[0] || (s[0] = (r) => (k(b) ? (b.value = r) : null)),
                          onInput: s[1] || (s[1] = (r) => n("searchInput", r)),
                          onKeydown: s[2] || (s[2] = (r) => n("searchKeydown", r)),
                          type: "text",
                          placeholder: "Search assets...",
                          class:
                            "w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                        },
                        null,
                        544,
                      ),
                      [[Ke, t(b)]],
                    ),
                    Y(t(Ve), {
                      class:
                        "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    }),
                  ]),
                  e("div", Yi, [
                    e(
                      "button",
                      {
                        class:
                          "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                        onClick: s[3] || (s[3] = (r) => n("toggleSortDropdown")),
                      },
                      [
                        Y(t(Je), { class: "w-4 h-4" }),
                        s[14] || (s[14] = e("span", null, "Sort", -1)),
                        Y(t(Ye), { class: "w-3 h-3" }),
                      ],
                    ),
                    t(C)
                      ? (c(),
                        p("div", Ei, [
                          (c(!0),
                          p(
                            E,
                            null,
                            N(
                              a.sortOptions,
                              (r) => (
                                c(),
                                p(
                                  "button",
                                  {
                                    key: r.value,
                                    onClick: (m) => n("sort", r.value),
                                    class: J(
                                      t(te)(
                                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between",
                                        a.sortBy === r.value
                                          ? "text-[#012D5A] font-medium"
                                          : "text-gray-700",
                                      ),
                                    ),
                                  },
                                  [
                                    e("span", null, v(r.label), 1),
                                    a.sortBy === r.value
                                      ? (c(),
                                        p("span", Ri, v(a.sortOrder === "asc" ? "↑" : "↓"), 1))
                                      : V("", !0),
                                  ],
                                  10,
                                  Bi,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]))
                      : V("", !0),
                  ]),
                  e(
                    "button",
                    {
                      class:
                        "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg",
                      onClick: s[4] || (s[4] = (r) => n("export")),
                    },
                    [
                      Y(t(vt), { class: "w-4 h-4" }),
                      s[15] || (s[15] = e("span", null, "Export", -1)),
                    ],
                  ),
                  e(
                    "button",
                    {
                      class:
                        "flex items-center gap-2 px-3 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg",
                      onClick: s[5] || (s[5] = (r) => n("addAsset")),
                    },
                    [
                      Y(t(Ra), { class: "w-4 h-4" }),
                      s[16] || (s[16] = e("span", null, "Add Asset", -1)),
                    ],
                  ),
                ]),
              ]),
              e("div", Ui, [
                e("div", qi, [
                  H(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue":
                          s[6] || (s[6] = (r) => (k(y) ? (y.value = r) : null)),
                        onChange: s[7] || (s[7] = (r) => n("yearChange", r.target.value)),
                        class:
                          "w-full px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
                      },
                      [
                        s[18] || (s[18] = e("option", { value: "" }, "All Years", -1)),
                        (c(!0),
                        p(
                          E,
                          null,
                          N(
                            a.availableYears,
                            (r) => (c(), p("option", { key: r, value: r }, v(r), 9, Ni)),
                          ),
                          128,
                        )),
                      ],
                      544,
                    ),
                    [[ne, t(y)]],
                  ),
                  Y(t(yt), {
                    class:
                      "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue": s[8] || (s[8] = (r) => (k(w) ? (w.value = r) : null)),
                      onChange: s[9] || (s[9] = (r) => n("serviceChange", t(w))),
                      class: "flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-white",
                      disabled: a.isLoadingServices,
                    },
                    [
                      s[19] || (s[19] = e("option", { value: "" }, "All Services", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.services,
                          (r) => (c(), p("option", { key: r.id, value: r.id }, v(r.name), 9, Mi)),
                        ),
                        128,
                      )),
                    ],
                    40,
                    ji,
                  ),
                  [[ne, t(w)]],
                ),
                H(
                  e(
                    "select",
                    {
                      "onUpdate:modelValue":
                        s[10] || (s[10] = (r) => (k(g) ? (g.value = r) : null)),
                      onChange: s[11] || (s[11] = (r) => n("companyChange", r.target.value)),
                      class:
                        "w-full flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-white",
                      disabled: a.isLoadingCompanies,
                    },
                    [
                      s[20] || (s[20] = e("option", { value: "" }, "All Companies", -1)),
                      (c(!0),
                      p(
                        E,
                        null,
                        N(
                          a.companies,
                          (r) => (c(), p("option", { key: r.id, value: r.id }, v(r.name), 9, Ki)),
                        ),
                        128,
                      )),
                    ],
                    40,
                    Gi,
                  ),
                  [[ne, t(g)]],
                ),
              ]),
              e("div", Qi, [
                e("table", zi, [
                  s[22] ||
                    (s[22] = e(
                      "thead",
                      null,
                      [
                        e("tr", { class: "border-b border-border bg-gray-50/50" }, [
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Name",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Date",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-left text-sm font-medium text-gray-500" },
                            "Description",
                          ),
                          e(
                            "th",
                            { class: "py-3 px-4 text-right text-sm font-medium text-gray-500" },
                            "Price",
                          ),
                        ]),
                      ],
                      -1,
                    )),
                  e("tbody", null, [
                    !a.assets.length && !a.isLoading
                      ? (c(),
                        p("tr", Vi, [
                          ...(s[21] ||
                            (s[21] = [
                              e(
                                "td",
                                { colspan: "4", class: "py-8 text-center text-muted-foreground" },
                                "No data available",
                                -1,
                              ),
                            ])),
                        ]))
                      : V("", !0),
                    (c(!0),
                    p(
                      E,
                      null,
                      N(
                        a.assets,
                        (r) => (
                          c(),
                          p(
                            "tr",
                            { key: r.id, class: "border-b border-gray-100 hover:bg-gray-50/50" },
                            [
                              e("td", Ji, [e("span", _i, v(r.name), 1)]),
                              e("td", Wi, v(h(r.date)), 1),
                              e("td", Hi, v(r.description), 1),
                              e("td", Xi, v(t(u)(r.price)), 1),
                            ],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                ]),
              ]),
              e("div", Zi, [
                e("p", ed, [
                  a.pagination.total > 0
                    ? (c(),
                      p(
                        E,
                        { key: 0 },
                        [
                          oe(
                            "Showing " +
                              v((a.pagination.page - 1) * a.pagination.limit + 1) +
                              " to " +
                              v(
                                Math.min(
                                  a.pagination.page * a.pagination.limit,
                                  a.pagination.total,
                                ),
                              ) +
                              " of " +
                              v(a.pagination.total) +
                              " results",
                            1,
                          ),
                        ],
                        64,
                      ))
                    : (c(), p(E, { key: 1 }, [oe("No results found")], 64)),
                ]),
                Y(
                  d,
                  {
                    page: a.pagination.page,
                    "onUpdate:page": [
                      s[12] || (s[12] = (r) => (a.pagination.page = r)),
                      s[13] || (s[13] = (r) => n("pageChange", r)),
                    ],
                    total: a.pagination.total,
                    "items-per-page": a.pagination.limit,
                  },
                  null,
                  8,
                  ["page", "total", "items-per-page"],
                ),
              ]),
            ]),
          ])
        );
      };
    },
  }),
  ad = Object.assign(td, { __name: "FinanceDashboardAssetsTab" }),
  sd = { class: "flex flex-col h-screen overflow-hidden" },
  od = { class: "shrink-0 bg-white border-b border-border" },
  nd = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6" },
  rd = { class: "flex items-center gap-1 bg-gray-100 border border-transparent rounded-lg p-1" },
  ld = ["onClick"],
  id = { class: "" },
  dd = { class: "flex gap-1 overflow-x-auto -mb-px" },
  cd = ["onClick"],
  ud = { class: "flex-1 overflow-y-auto relative pt-6 pb-10" },
  gd = {
    class: "absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]",
  },
  pd = { key: 7, class: "bg-gray-50 rounded-xl border border-border p-8 text-center" },
  md = { class: "text-muted-foreground" },
  Ed = ue({
    __name: "dashboard",
    setup(a) {
      const {
          isLoading: T,
          selectedPeriod: i,
          activeTab: n,
          selectedYear: u,
          searchQuery: h,
          cogsCustomerId: b,
          cogsServiceId: y,
          sortBy: w,
          sortOrder: g,
          showSortDropdown: C,
          transactionYear: l,
          transactionType: s,
          transactionCustomerId: o,
          transactionSearch: d,
          transactionSortBy: r,
          transactionSortOrder: m,
          showTransactionSortDropdown: I,
          financeCloseYear: P,
          financeCloseType: q,
          financeCloseCustomerId: U,
          financeCloseSearch: O,
          financeCloseSortBy: ee,
          financeCloseSortOrder: R,
          showFinanceCloseSortDropdown: j,
          arApToggle: M,
          arApSearch: de,
          arApSortBy: me,
          arApSortOrder: ge,
          showArApSortDropdown: he,
          arApStatusFilter: fe,
          isLoadingCustomers: pe,
          isLoadingServices: L,
          jobCosts: S,
          transactions: K,
          closedPeriods: Z,
          arApItems: se,
          arApStats: F,
          pagination: W,
          companies: re,
          services: We,
          chartData: bt,
          financialChartOptions: xt,
          financialChartSeries: He,
          marginTrendChartOptions: Xe,
          marginTrendChartSeries: Ze,
          top5ChartOptions: wt,
          top5ChartSeries: et,
          overviewStatsCards: Ct,
          cogsStats: tt,
          transactionStatsCards: St,
          financeCloseData: Ee,
          handlePeriodChange: Be,
          handleTabChange: Ie,
          handlePageChange: Se,
          handleReopenPeriod: at,
          handleYearChange: st,
          handleCogsCustomerChange: Tt,
          handleCogsServiceChange: At,
          handleCogsSearch: ot,
          handleCogsSearchInput: $,
          handleCogsSearchKeydown: _,
          handleCogsSort: Te,
          handleCogsSortDropdownToggle: Q,
          handleTransactionYearChange: Re,
          handleTransactionTypeChange: G,
          handleTransactionCustomerChange: Ue,
          handleTransactionSearch: ke,
          handleTransactionSearchInput: $t,
          handleTransactionSearchKeydown: Dt,
          handleTransactionSort: Pt,
          handleTransactionSortDropdownToggle: Ft,
          handleTransactionExport: ve,
          handleTransactionCreate: It,
          handleTransactionEdit: nt,
          handleTransactionDelete: rt,
          handleFinanceCloseYearChange: kt,
          handleFinanceCloseTypeChange: ce,
          handleFinanceCloseCustomerChange: lt,
          handleFinanceCloseSearch: qa,
          handleFinanceCloseSearchInput: Na,
          handleFinanceCloseSearchKeydown: ja,
          handleFinanceCloseSort: Ma,
          handleFinanceCloseSortDropdownToggle: Ga,
          handleArApSearch: Ka,
          handleArApSearchInput: Qa,
          handleArApSearchKeydown: za,
          handleArApSort: Va,
          handleArApSortDropdownToggle: Ja,
          handleArApStatusFilterChange: _a,
          handleArApRefresh: Wa,
        } = ao(),
        qe = Rs(),
        Ha = Us(),
        Xt = qs(),
        Zt = Ns(),
        Xa = Gs(),
        Za = Ms(),
        es = js(),
        { assets: ts, assetStats: ea, pagination: it, fetchAssets: as, fetchAssetStats: ss } = so(),
        Ne = A(""),
        le = A(""),
        ye = A(""),
        be = A(""),
        Ae = A("date"),
        xe = A("desc"),
        je = A(!1),
        Ot = A(!1),
        ta = B(() => ts.value),
        os = B(() => {
          const D = ea.value?.totalValue || 0,
            x = ea.value?.totalAssets || 0;
          return [
            { title: "Total Assets", value: ae(D), isPrimary: !0 },
            { title: "Assets Count", value: x.toString(), changeLabel: "", suffix: "" },
          ];
        });
      async function Oe() {
        Ot.value = !0;
        try {
          (await as(it.value.page, it.value.limit, {
            search: Ne.value || void 0,
            sortBy: Ae.value,
            sortOrder: xe.value,
            year: le.value || void 0,
            serviceId: ye.value || void 0,
            companyId: be.value || void 0,
          }),
            await ss(le.value || void 0));
        } finally {
          Ot.value = !1;
        }
      }
      (De(
        [Ne, le, ye, be, Ae, xe],
        () => {
          n.value === "Assets" && Oe();
        },
        { deep: !0 },
      ),
        De(
          n,
          (D) => {
            D === "Assets" && Oe();
          },
          { immediate: !0 },
        ),
        De(i, () => {
          n.value === "Assets" && Oe();
        }));
      function ns() {
        Oe();
      }
      function rs(D) {}
      function ls(D) {
        D.key === "Enter" && Oe();
      }
      function is(D) {
        Ae.value === D
          ? (xe.value = xe.value === "asc" ? "desc" : "asc")
          : ((Ae.value = D), (xe.value = "desc"));
      }
      function ds(D) {
        ((it.value.page = D), Oe());
      }
      function cs() {
        try {
          const D = new Ba(),
            x = D.internal.pageSize.getWidth(),
            dt = D.internal.pageSize.getHeight(),
            f = 20,
            Me = x - f * 2;
          let z = f;
          const Lt = [1, 45, 90],
            ct = [31, 41, 55],
            gs = [107, 114, 128],
            ps = [229, 231, 235];
          (D.setFillColor(...Lt),
            D.rect(0, 0, x, 40, "F"),
            D.setTextColor(255, 255, 255),
            D.setFontSize(24),
            D.setFont("helvetica", "bold"),
            D.text("ASSETS REPORT", f, 25),
            D.setFontSize(12),
            D.setFont("helvetica", "normal"));
          const ms = le.value ? `Year: ${le.value}` : "All Years";
          D.text(ms, x - f, 20, { align: "right" });
          const hs = new Date().toLocaleDateString("id-ID");
          (D.text(`Generated: ${hs}`, x - f, 30, { align: "right" }),
            (z = 55),
            D.setTextColor(...ct),
            D.setFontSize(10),
            D.setFont("helvetica", "bold"),
            D.text("Filters:", f, z),
            D.setFont("helvetica", "normal"),
            (z += 7));
          const Le = [];
          (le.value && Le.push(`Year: ${le.value}`),
            ye.value && Le.push(`Service ID: ${ye.value}`),
            be.value && Le.push(`Company ID: ${be.value}`),
            Le.length === 0 && Le.push("None (All Data)"),
            D.setTextColor(...gs),
            Le.forEach((we) => {
              (D.text(we, f, z), (z += 6));
            }),
            (z += 10),
            D.setFillColor(...Lt),
            D.rect(f, z, Me, 10, "F"),
            D.setTextColor(255, 255, 255),
            D.setFontSize(9),
            D.setFont("helvetica", "bold"),
            D.text("No.", f + 2, z + 7),
            D.text("Name", f + 20, z + 7),
            D.text("Date", f + 80, z + 7),
            D.text("Service", f + 110, z + 7),
            D.text("Price", f + 160, z + 7),
            (z += 10),
            D.setTextColor(...ct),
            D.setFont("helvetica", "normal"),
            D.setFontSize(8));
          const fs = ta.value || [];
          let aa = 0;
          (fs.forEach((we, oa) => {
            (z > dt - 30 && (D.addPage(), (z = f)),
              oa % 2 === 0 && (D.setFillColor(249, 250, 251), D.rect(f, z, Me, 10, "F")),
              D.setTextColor(...ct),
              D.text((oa + 1).toString(), f + 2, z + 7),
              D.text(we.name?.substring(0, 25) || "-", f + 20, z + 7),
              D.text(we.date ? new Date(we.date).toLocaleDateString("id-ID") : "-", f + 80, z + 7),
              D.text(we.service?.substring(0, 20) || "-", f + 110, z + 7),
              D.text(ae(we.price || 0), f + 160, z + 7),
              (aa += we.price || 0),
              (z += 10));
          }),
            (z += 5),
            D.setFillColor(...ps),
            D.rect(f, z, Me, 12, "F"),
            D.setFont("helvetica", "bold"),
            D.setTextColor(...ct),
            D.text("TOTAL", f + 2, z + 8),
            D.text(ae(aa), f + 160, z + 8));
          const sa = dt - 15;
          (D.setFillColor(...Lt),
            D.rect(0, sa - 5, x, 20, "F"),
            D.setTextColor(255, 255, 255),
            D.setFont("helvetica", "normal"),
            D.setFontSize(8),
            D.text("PT. Nusantara Continent - Assets Report", x / 2, sa + 5, { align: "center" }));
          const vs = `Assets_Report${le.value ? `_${le.value}` : ""}.pdf`;
          D.save(vs);
        } catch (D) {
          (console.error("Failed to export assets PDF:", D),
            alert("Failed to export PDF. Please try again."));
        }
      }
      async function us() {
        await Ge().push("/master/assets/create");
      }
      return (D, x) => {
        const dt = Wt;
        return (
          c(),
          p("div", sd, [
            e("div", od, [
              e("div", nd, [
                x[39] ||
                  (x[39] = e(
                    "div",
                    null,
                    [
                      e("h1", { class: "text-2xl font-bold" }, "Finance"),
                      e(
                        "p",
                        { class: "text-muted-foreground text-base" },
                        " Manage cash flow, COGS, receivables/payables, and financial reports ",
                      ),
                    ],
                    -1,
                  )),
                e("div", rd, [
                  (c(!0),
                  p(
                    E,
                    null,
                    N(
                      t(ro),
                      (f) => (
                        c(),
                        p(
                          "button",
                          {
                            key: f.value,
                            class: J(
                              t(te)(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                t(i) === f.value
                                  ? "bg-[#012D5A] text-white"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                              ),
                            ),
                            onClick: (Me) => t(Be)(f.value),
                          },
                          v(f.label),
                          11,
                          ld,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
              ]),
              e("div", id, [
                e("nav", dd, [
                  (c(!0),
                  p(
                    E,
                    null,
                    N(
                      t(no),
                      (f) => (
                        c(),
                        p(
                          "button",
                          {
                            key: f,
                            class: J(
                              t(te)(
                                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                t(n) === f
                                  ? "border-[#012D5A] text-[#012D5A]"
                                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-gray-300",
                              ),
                            ),
                            onClick: (Me) => t(Ie)(f),
                          },
                          v(f),
                          11,
                          cd,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
              ]),
            ]),
            e("div", ud, [
              Y(dt, null, {
                default: Pe(() => [
                  H(
                    e(
                      "div",
                      gd,
                      [
                        ...(x[40] ||
                          (x[40] = [
                            e(
                              "div",
                              { class: "flex items-center gap-2" },
                              [
                                e("div", {
                                  class:
                                    "w-4 h-4 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin",
                                }),
                                e("span", { class: "text-sm text-muted-foreground" }, "Loading..."),
                              ],
                              -1,
                            ),
                          ])),
                      ],
                      512,
                    ),
                    [[Ts, t(T)]],
                  ),
                  t(n) === "Overview"
                    ? (c(),
                      ie(
                        ir,
                        {
                          key: 0,
                          "stats-cards": t(Ct),
                          "financial-chart-options": t(xt),
                          "financial-chart-series": t(He),
                          "top5-chart-options": t(wt),
                          "top5-chart-series": t(et),
                          "chart-data": t(bt) || {},
                          "margin-trend-chart-options": t(Xe),
                          "margin-trend-chart-series": t(Ze),
                        },
                        null,
                        8,
                        [
                          "stats-cards",
                          "financial-chart-options",
                          "financial-chart-series",
                          "top5-chart-options",
                          "top5-chart-series",
                          "chart-data",
                          "margin-trend-chart-options",
                          "margin-trend-chart-series",
                        ],
                      ))
                    : t(n) === "COGS"
                      ? (c(),
                        ie(
                          jo,
                          {
                            key: 1,
                            "stats-cards": t(tt),
                            jobs: t(S),
                            "is-loading": t(T),
                            "is-loading-customers": t(pe),
                            "is-loading-services": t(L),
                            companies: t(re),
                            services: t(We),
                            pagination: t(W),
                            "selected-year": t(u),
                            "onUpdate:selectedYear":
                              x[0] || (x[0] = (f) => (k(u) ? (u.value = f) : null)),
                            "search-query": t(h),
                            "onUpdate:searchQuery":
                              x[1] || (x[1] = (f) => (k(h) ? (h.value = f) : null)),
                            "customer-id": t(b),
                            "onUpdate:customerId":
                              x[2] || (x[2] = (f) => (k(b) ? (b.value = f) : null)),
                            "service-id": t(y),
                            "onUpdate:serviceId":
                              x[3] || (x[3] = (f) => (k(y) ? (y.value = f) : null)),
                            "sort-by": t(w),
                            "onUpdate:sortBy":
                              x[4] || (x[4] = (f) => (k(w) ? (w.value = f) : null)),
                            "sort-order": t(g),
                            "onUpdate:sortOrder":
                              x[5] || (x[5] = (f) => (k(g) ? (g.value = f) : null)),
                            "show-sort-dropdown": t(C),
                            "onUpdate:showSortDropdown":
                              x[6] || (x[6] = (f) => (k(C) ? (C.value = f) : null)),
                            "available-years": t(qe),
                            "sort-options": t(Ha),
                            onYearChange: t(st),
                            onCustomerChange: t(Tt),
                            onServiceChange: t(At),
                            onSearch: t(ot),
                            onSearchInput: t($),
                            onSearchKeydown: t(_),
                            onSort: t(Te),
                            onToggleSortDropdown: t(Q),
                            onPageChange: t(Se),
                          },
                          null,
                          8,
                          [
                            "stats-cards",
                            "jobs",
                            "is-loading",
                            "is-loading-customers",
                            "is-loading-services",
                            "companies",
                            "services",
                            "pagination",
                            "selected-year",
                            "search-query",
                            "customer-id",
                            "service-id",
                            "sort-by",
                            "sort-order",
                            "show-sort-dropdown",
                            "available-years",
                            "sort-options",
                            "onYearChange",
                            "onCustomerChange",
                            "onServiceChange",
                            "onSearch",
                            "onSearchInput",
                            "onSearchKeydown",
                            "onSort",
                            "onToggleSortDropdown",
                            "onPageChange",
                          ],
                        ))
                      : t(n) === "Transaction"
                        ? (c(),
                          ie(
                            Kr,
                            {
                              key: 2,
                              "stats-cards": t(St),
                              transactions: t(K),
                              "is-loading": t(T),
                              "is-loading-customers": t(pe),
                              pagination: t(W),
                              companies: t(re),
                              "search-query": t(d),
                              "onUpdate:searchQuery":
                                x[7] || (x[7] = (f) => (k(d) ? (d.value = f) : null)),
                              "selected-year": t(l),
                              "onUpdate:selectedYear":
                                x[8] || (x[8] = (f) => (k(l) ? (l.value = f) : null)),
                              "transaction-type": t(s),
                              "onUpdate:transactionType":
                                x[9] || (x[9] = (f) => (k(s) ? (s.value = f) : null)),
                              "customer-id": t(o),
                              "onUpdate:customerId":
                                x[10] || (x[10] = (f) => (k(o) ? (o.value = f) : null)),
                              "sort-by": t(r),
                              "onUpdate:sortBy":
                                x[11] || (x[11] = (f) => (k(r) ? (r.value = f) : null)),
                              "sort-order": t(m),
                              "onUpdate:sortOrder":
                                x[12] || (x[12] = (f) => (k(m) ? (m.value = f) : null)),
                              "show-sort-dropdown": t(I),
                              "onUpdate:showSortDropdown":
                                x[13] || (x[13] = (f) => (k(I) ? (I.value = f) : null)),
                              "available-years": t(qe),
                              "sort-options": t(Xt),
                              "type-options": t(Zt),
                              onYearChange: t(Re),
                              onTypeChange: t(G),
                              onCustomerChange: t(Ue),
                              onSearch: t(ke),
                              onSearchInput: t($t),
                              onSearchKeydown: t(Dt),
                              onSort: t(Pt),
                              onToggleSortDropdown: t(Ft),
                              onExport: t(ve),
                              onPageChange: t(Se),
                              onCreate: t(It),
                              onEdit: t(nt),
                              onDelete: t(rt),
                            },
                            null,
                            8,
                            [
                              "stats-cards",
                              "transactions",
                              "is-loading",
                              "is-loading-customers",
                              "pagination",
                              "companies",
                              "search-query",
                              "selected-year",
                              "transaction-type",
                              "customer-id",
                              "sort-by",
                              "sort-order",
                              "show-sort-dropdown",
                              "available-years",
                              "sort-options",
                              "type-options",
                              "onYearChange",
                              "onTypeChange",
                              "onCustomerChange",
                              "onSearch",
                              "onSearchInput",
                              "onSearchKeydown",
                              "onSort",
                              "onToggleSortDropdown",
                              "onExport",
                              "onPageChange",
                              "onCreate",
                              "onEdit",
                              "onDelete",
                            ],
                          ))
                        : t(n) === "Finance Close"
                          ? (c(),
                            ie(
                              Gn,
                              {
                                key: 3,
                                "finance-close-data": t(Ee),
                                transactions: t(K),
                                "is-loading": t(T),
                                "is-loading-customers": t(pe),
                                pagination: t(W),
                                companies: t(re),
                                "search-query": t(O),
                                "onUpdate:searchQuery":
                                  x[14] || (x[14] = (f) => (k(O) ? (O.value = f) : null)),
                                "selected-year": t(P),
                                "onUpdate:selectedYear":
                                  x[15] || (x[15] = (f) => (k(P) ? (P.value = f) : null)),
                                "transaction-type": t(q),
                                "onUpdate:transactionType":
                                  x[16] || (x[16] = (f) => (k(q) ? (q.value = f) : null)),
                                "customer-id": t(U),
                                "onUpdate:customerId":
                                  x[17] || (x[17] = (f) => (k(U) ? (U.value = f) : null)),
                                "sort-by": t(ee),
                                "onUpdate:sortBy":
                                  x[18] || (x[18] = (f) => (k(ee) ? (ee.value = f) : null)),
                                "sort-order": t(R),
                                "onUpdate:sortOrder":
                                  x[19] || (x[19] = (f) => (k(R) ? (R.value = f) : null)),
                                "show-sort-dropdown": t(j),
                                "onUpdate:showSortDropdown":
                                  x[20] || (x[20] = (f) => (k(j) ? (j.value = f) : null)),
                                "available-years": t(qe),
                                "sort-options": t(Xt),
                                "type-options": t(Zt),
                                "closed-periods": t(Z),
                                onYearChange: t(kt),
                                onTypeChange: t(ce),
                                onCustomerChange: t(lt),
                                onSearch: t(qa),
                                onSearchInput: t(Na),
                                onSearchKeydown: t(ja),
                                onSort: t(Ma),
                                onToggleSortDropdown: t(Ga),
                                onPageChange: t(Se),
                                onReopenPeriod: t(at),
                              },
                              null,
                              8,
                              [
                                "finance-close-data",
                                "transactions",
                                "is-loading",
                                "is-loading-customers",
                                "pagination",
                                "companies",
                                "search-query",
                                "selected-year",
                                "transaction-type",
                                "customer-id",
                                "sort-by",
                                "sort-order",
                                "show-sort-dropdown",
                                "available-years",
                                "sort-options",
                                "type-options",
                                "closed-periods",
                                "onYearChange",
                                "onTypeChange",
                                "onCustomerChange",
                                "onSearch",
                                "onSearchInput",
                                "onSearchKeydown",
                                "onSort",
                                "onToggleSortDropdown",
                                "onPageChange",
                                "onReopenPeriod",
                              ],
                            ))
                          : t(n) === "Trial Balance"
                            ? (c(),
                              ie(
                                Dl,
                                {
                                  key: 4,
                                  "selected-year": t(u),
                                  "onUpdate:selectedYear":
                                    x[21] || (x[21] = (f) => (k(u) ? (u.value = f) : null)),
                                  "selected-period": t(i),
                                  "available-years": t(qe),
                                  onYearChange: t(st),
                                },
                                null,
                                8,
                                [
                                  "selected-year",
                                  "selected-period",
                                  "available-years",
                                  "onYearChange",
                                ],
                              ))
                            : t(n) === "Accounts Receivable"
                              ? (c(),
                                ie(
                                  Di,
                                  {
                                    key: 5,
                                    stats: t(F) || {
                                      totalAr: 0,
                                      overdueAr: 0,
                                      totalAp: 0,
                                      overdueAp: 0,
                                    },
                                    items: t(se),
                                    "is-loading": t(T),
                                    pagination: t(W),
                                    "search-query": t(de),
                                    "onUpdate:searchQuery":
                                      x[22] || (x[22] = (f) => (k(de) ? (de.value = f) : null)),
                                    "ar-ap-toggle": t(M),
                                    "onUpdate:arApToggle":
                                      x[23] || (x[23] = (f) => (k(M) ? (M.value = f) : null)),
                                    "sort-by": t(me),
                                    "onUpdate:sortBy":
                                      x[24] || (x[24] = (f) => (k(me) ? (me.value = f) : null)),
                                    "sort-order": t(ge),
                                    "onUpdate:sortOrder":
                                      x[25] || (x[25] = (f) => (k(ge) ? (ge.value = f) : null)),
                                    "show-sort-dropdown": t(he),
                                    "onUpdate:showSortDropdown":
                                      x[26] || (x[26] = (f) => (k(he) ? (he.value = f) : null)),
                                    "status-filter": t(fe),
                                    "onUpdate:statusFilter":
                                      x[27] || (x[27] = (f) => (k(fe) ? (fe.value = f) : null)),
                                    "sort-options": t(Xa),
                                    "status-options": t(Za),
                                    onSearch: t(Ka),
                                    onSearchInput: t(Qa),
                                    onSearchKeydown: t(za),
                                    onSort: t(Va),
                                    onToggleSortDropdown: t(Ja),
                                    onStatusFilterChange: t(_a),
                                    onPageChange: t(Se),
                                    onRefresh: t(Wa),
                                  },
                                  null,
                                  8,
                                  [
                                    "stats",
                                    "items",
                                    "is-loading",
                                    "pagination",
                                    "search-query",
                                    "ar-ap-toggle",
                                    "sort-by",
                                    "sort-order",
                                    "show-sort-dropdown",
                                    "status-filter",
                                    "sort-options",
                                    "status-options",
                                    "onSearch",
                                    "onSearchInput",
                                    "onSearchKeydown",
                                    "onSort",
                                    "onToggleSortDropdown",
                                    "onStatusFilterChange",
                                    "onPageChange",
                                    "onRefresh",
                                  ],
                                ))
                              : t(n) === "Assets"
                                ? (c(),
                                  ie(
                                    ad,
                                    {
                                      key: 6,
                                      "stats-cards": t(os),
                                      assets: t(ta),
                                      "is-loading": t(Ot),
                                      "is-loading-services": t(L),
                                      "is-loading-companies": t(pe),
                                      pagination: t(it),
                                      services: t(We),
                                      companies: t(re),
                                      "search-query": t(Ne),
                                      "onUpdate:searchQuery":
                                        x[28] || (x[28] = (f) => (k(Ne) ? (Ne.value = f) : null)),
                                      "selected-year": t(le),
                                      "onUpdate:selectedYear":
                                        x[29] || (x[29] = (f) => (k(le) ? (le.value = f) : null)),
                                      "service-id": t(ye),
                                      "onUpdate:serviceId":
                                        x[30] || (x[30] = (f) => (k(ye) ? (ye.value = f) : null)),
                                      "company-id": t(be),
                                      "onUpdate:companyId":
                                        x[31] || (x[31] = (f) => (k(be) ? (be.value = f) : null)),
                                      "sort-by": t(Ae),
                                      "onUpdate:sortBy":
                                        x[32] || (x[32] = (f) => (k(Ae) ? (Ae.value = f) : null)),
                                      "sort-order": t(xe),
                                      "onUpdate:sortOrder":
                                        x[33] || (x[33] = (f) => (k(xe) ? (xe.value = f) : null)),
                                      "show-sort-dropdown": t(je),
                                      "onUpdate:showSortDropdown":
                                        x[34] || (x[34] = (f) => (k(je) ? (je.value = f) : null)),
                                      "available-years": t(qe),
                                      "sort-options": t(es),
                                      onYearChange: x[35] || (x[35] = (f) => (le.value = f)),
                                      onServiceChange: x[36] || (x[36] = (f) => (ye.value = f)),
                                      onCompanyChange: x[37] || (x[37] = (f) => (be.value = f)),
                                      onSearch: ns,
                                      onSearchInput: rs,
                                      onSearchKeydown: ls,
                                      onSort: is,
                                      onToggleSortDropdown:
                                        x[38] || (x[38] = () => (je.value = !t(je))),
                                      onPageChange: ds,
                                      onExport: cs,
                                      onAddAsset: us,
                                    },
                                    null,
                                    8,
                                    [
                                      "stats-cards",
                                      "assets",
                                      "is-loading",
                                      "is-loading-services",
                                      "is-loading-companies",
                                      "pagination",
                                      "services",
                                      "companies",
                                      "search-query",
                                      "selected-year",
                                      "service-id",
                                      "company-id",
                                      "sort-by",
                                      "sort-order",
                                      "show-sort-dropdown",
                                      "available-years",
                                      "sort-options",
                                    ],
                                  ))
                                : (c(), p("div", pd, [e("p", md, v(t(n)) + " - Coming Soon", 1)])),
                ]),
                _: 1,
              }),
            ]),
          ])
        );
      };
    },
  });
export { Ed as default };
