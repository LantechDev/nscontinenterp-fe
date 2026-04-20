import {
  d as N,
  e as V,
  ad as F,
  f as B,
  N as D,
  r as x,
  o as G,
  R as u,
  Q as e,
  U as g,
  W as v,
  K as s,
  a3 as C,
  a0 as f,
  a1 as E,
  S as m,
  T as d,
  $,
  V as T,
  _ as c,
  aq as J,
} from "./D9q6143x.js";
import { b as z } from "./DrxnuvjT.js";
function j() {
  return N().public.apiBase;
}
async function H(l = {}) {
  const r = new URLSearchParams();
  return (
    l.userId && r.append("userId", l.userId),
    l.organizationId && r.append("organizationId", l.organizationId),
    l.action && r.append("action", l.action),
    l.targetModel && r.append("targetModel", l.targetModel),
    l.startDate && r.append("startDate", l.startDate),
    l.endDate && r.append("endDate", l.endDate),
    l.search && r.append("search", l.search),
    l.page && r.append("page", String(l.page)),
    l.limit && r.append("limit", String(l.limit)),
    await $fetch(`${j()}/admin/activity-logs?${r.toString()}`, { credentials: "include" })
  );
}
function Q(l) {
  return (
    {
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
    }[l] || l
  );
}
function W(l) {
  return (
    {
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
    }[l] || "text-gray-600 bg-gray-50"
  );
}
const X = { class: "p-6" },
  K = { class: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6" },
  q = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  Y = { class: "lg:col-span-2" },
  Z = { class: "relative" },
  ee = ["value"],
  te = ["value"],
  ae = { class: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" },
  se = { key: 0, class: "p-8 text-center text-gray-500" },
  oe = { key: 1, class: "p-8 text-center text-gray-500" },
  le = { key: 2, class: "min-w-full divide-y divide-gray-200" },
  ne = { class: "bg-white divide-y divide-gray-200" },
  ie = { class: "px-6 py-4 whitespace-nowrap text-sm text-gray-500" },
  re = { class: "px-6 py-4 whitespace-nowrap" },
  de = { class: "text-sm font-medium text-gray-900" },
  ue = { class: "text-xs text-gray-500" },
  ce = { class: "px-6 py-4 whitespace-nowrap" },
  ge = { class: "px-6 py-4 whitespace-nowrap" },
  pe = { class: "text-sm font-medium text-gray-900" },
  xe = { key: 0, class: "text-xs text-gray-500" },
  me = { class: "px-6 py-4" },
  ye = { class: "text-sm text-gray-900 mb-1" },
  be = { class: "flex flex-wrap gap-x-3 gap-y-1" },
  ve = { key: 0, class: "flex items-center text-xs text-gray-400" },
  fe = { key: 1, class: "flex items-center text-xs text-gray-400" },
  Ee = { key: 3, class: "px-6 py-4 flex items-center justify-between border-t border-gray-200" },
  Ae = { class: "text-sm text-gray-500" },
  he = { class: "flex gap-2" },
  we = ["disabled"],
  De = ["disabled"],
  Le = V({
    __name: "index",
    setup(l) {
      const r = [
          { value: "", label: "All Actions" },
          { value: "LOGIN", label: "Login" },
          { value: "LOGOUT", label: "Logout" },
          { value: "LOGIN_FAILED", label: "Login Failed" },
          { value: "CRUD", label: "CRUD Operations" },
          { value: "DATA", label: "Data Actions" },
        ],
        A = {
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
        },
        L = [
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
        ],
        { user: R, session: O } = F(),
        _ = B();
      D(
        R,
        (o) => {
          o || _.push("/login");
        },
        { immediate: !0 },
      );
      const y = x([]),
        b = x(!0),
        n = x({ page: 1, limit: 20, total: 0, totalPages: 0 }),
        i = x({ actionCategory: "", targetModel: "", startDate: "", endDate: "", search: "" });
      function I(o) {
        if (!o) return "Unknown Device";
        let t = "Unknown OS";
        o.includes("Windows")
          ? (t = "Windows")
          : o.includes("Mac OS")
            ? (t = "macOS")
            : o.includes("iPhone")
              ? (t = "iPhone")
              : o.includes("iPad")
                ? (t = "iPad")
                : o.includes("Android")
                  ? (t = "Android")
                  : o.includes("Linux") && (t = "Linux");
        let a = "Unknown Browser";
        return (
          o.includes("Chrome")
            ? (a = "Chrome")
            : o.includes("Firefox")
              ? (a = "Firefox")
              : o.includes("Safari") && !o.includes("Chrome")
                ? (a = "Safari")
                : o.includes("Edge")
                  ? (a = "Edge")
                  : o.includes("Opera") && (a = "Opera"),
          `${t} • ${a}`
        );
      }
      const k = (o) => A[o] || [];
      async function p() {
        b.value = !0;
        try {
          let o;
          const t = i.value.actionCategory;
          t && t !== "CRUD" && t !== "DATA" && (o = t);
          const a = await H({
            action: o,
            targetModel: i.value.targetModel || void 0,
            startDate: i.value.startDate || void 0,
            endDate: i.value.endDate || void 0,
            search: i.value.search || void 0,
            page: n.value.page,
            limit: n.value.limit,
            organizationId: O.value?.activeOrganizationId,
          });
          let w = a.logs;
          if (t === "CRUD" || t === "DATA") {
            const U = k(t);
            w = a.logs.filter((M) => U.includes(M.action));
          }
          ((y.value = w), (n.value = a.pagination));
        } catch (o) {
          console.error("Failed to fetch activity logs:", o);
        } finally {
          b.value = !1;
        }
      }
      const P = J(p, 300);
      function S() {
        ((i.value = {
          actionCategory: "",
          targetModel: "",
          startDate: "",
          endDate: "",
          search: "",
        }),
          (n.value.page = 1),
          p());
      }
      function h(o) {
        o >= 1 && o <= n.value.totalPages && ((n.value.page = o), p());
      }
      return (
        G(() => {
          p();
        }),
        D(
          [i],
          () => {
            ((n.value.page = 1), P());
          },
          { deep: !0 },
        ),
        (o, t) => (
          c(),
          u("div", X, [
            t[16] ||
              (t[16] = e(
                "div",
                { class: "mb-6" },
                [
                  e("h1", { class: "text-2xl font-semibold text-gray-900" }, "Activity Logs"),
                  e(
                    "p",
                    { class: "text-sm text-gray-500 mt-1" },
                    " Track all user activities including login, data changes, and more ",
                  ),
                ],
                -1,
              )),
            e("div", K, [
              e("div", q, [
                e("div", Y, [
                  t[8] ||
                    (t[8] = e(
                      "label",
                      { class: "block text-sm font-medium text-gray-700 mb-1" },
                      "Search Keywords",
                      -1,
                    )),
                  e("div", Z, [
                    t[7] ||
                      (t[7] = e(
                        "span",
                        {
                          class:
                            "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                        },
                        [e("div", { class: "i-lucide-search h-4 w-4 text-gray-400" })],
                        -1,
                      )),
                    g(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue": t[0] || (t[0] = (a) => (s(i).search = a)),
                          type: "text",
                          placeholder: "Search by user, description, or target...",
                          class:
                            "w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                        },
                        null,
                        512,
                      ),
                      [[v, s(i).search]],
                    ),
                  ]),
                ]),
                e("div", null, [
                  t[9] ||
                    (t[9] = e(
                      "label",
                      { class: "block text-sm font-medium text-gray-700 mb-1" },
                      "Action Type",
                      -1,
                    )),
                  g(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue": t[1] || (t[1] = (a) => (s(i).actionCategory = a)),
                        class:
                          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                      },
                      [
                        (c(),
                        u(
                          f,
                          null,
                          E(r, (a) =>
                            e("option", { key: a.value, value: a.value }, d(a.label), 9, ee),
                          ),
                          64,
                        )),
                      ],
                      512,
                    ),
                    [[C, s(i).actionCategory]],
                  ),
                ]),
                e("div", null, [
                  t[10] ||
                    (t[10] = e(
                      "label",
                      { class: "block text-sm font-medium text-gray-700 mb-1" },
                      "Target",
                      -1,
                    )),
                  g(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue": t[2] || (t[2] = (a) => (s(i).targetModel = a)),
                        class:
                          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                      },
                      [
                        (c(),
                        u(
                          f,
                          null,
                          E(L, (a) =>
                            e("option", { key: a.value, value: a.value }, d(a.label), 9, te),
                          ),
                          64,
                        )),
                      ],
                      512,
                    ),
                    [[C, s(i).targetModel]],
                  ),
                ]),
                e("div", null, [
                  t[11] ||
                    (t[11] = e(
                      "label",
                      { class: "block text-sm font-medium text-gray-700 mb-1" },
                      "From Date",
                      -1,
                    )),
                  g(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue": t[3] || (t[3] = (a) => (s(i).startDate = a)),
                        type: "date",
                        class:
                          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                      },
                      null,
                      512,
                    ),
                    [[v, s(i).startDate]],
                  ),
                ]),
                e("div", null, [
                  t[12] ||
                    (t[12] = e(
                      "label",
                      { class: "block text-sm font-medium text-gray-700 mb-1" },
                      "To Date",
                      -1,
                    )),
                  g(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue": t[4] || (t[4] = (a) => (s(i).endDate = a)),
                        type: "date",
                        class:
                          "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                      },
                      null,
                      512,
                    ),
                    [[v, s(i).endDate]],
                  ),
                ]),
              ]),
              e("div", { class: "mt-4 flex justify-end gap-2" }, [
                e(
                  "button",
                  { onClick: S, class: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800" },
                  " Clear Filters ",
                ),
              ]),
            ]),
            e("div", ae, [
              s(b)
                ? (c(), u("div", se, "Loading activity logs..."))
                : s(y).length === 0
                  ? (c(), u("div", oe, " No activity logs found "))
                  : (c(),
                    u("table", le, [
                      t[15] ||
                        (t[15] = e(
                          "thead",
                          { class: "bg-gray-50" },
                          [
                            e("tr", null, [
                              e(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Time ",
                              ),
                              e(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " User ",
                              ),
                              e(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Action ",
                              ),
                              e(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Target ",
                              ),
                              e(
                                "th",
                                {
                                  class:
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                },
                                " Details ",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      e("tbody", ne, [
                        (c(!0),
                        u(
                          f,
                          null,
                          E(
                            s(y),
                            (a) => (
                              c(),
                              u("tr", { key: a.id, class: "hover:bg-gray-50" }, [
                                e("td", ie, d(s(z)(a.createdAt)), 1),
                                e("td", re, [
                                  e("div", de, d(a.user?.name || "System"), 1),
                                  e("div", ue, d(a.user?.email || ""), 1),
                                ]),
                                e("td", ce, [
                                  e(
                                    "span",
                                    {
                                      class: $([
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        s(W)(a.action),
                                      ]),
                                    },
                                    d(s(Q)(a.action)),
                                    3,
                                  ),
                                ]),
                                e("td", ge, [
                                  e("div", pe, d(a.targetModel || "System"), 1),
                                  a.targetName
                                    ? (c(), u("div", xe, d(a.targetName), 1))
                                    : m("", !0),
                                ]),
                                e("td", me, [
                                  e("div", ye, d(a.description), 1),
                                  e("div", be, [
                                    a.ipAddress
                                      ? (c(),
                                        u("div", ve, [
                                          t[13] ||
                                            (t[13] = e(
                                              "div",
                                              { class: "i-lucide-globe h-3 w-3 mr-1" },
                                              null,
                                              -1,
                                            )),
                                          T(" " + d(a.ipAddress), 1),
                                        ]))
                                      : m("", !0),
                                    a.userAgent
                                      ? (c(),
                                        u("div", fe, [
                                          t[14] ||
                                            (t[14] = e(
                                              "div",
                                              { class: "i-lucide-monitor h-3 w-3 mr-1" },
                                              null,
                                              -1,
                                            )),
                                          T(" " + d(I(a.userAgent)), 1),
                                        ]))
                                      : m("", !0),
                                  ]),
                                ]),
                              ])
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ])),
              s(n).totalPages > 1
                ? (c(),
                  u("div", Ee, [
                    e(
                      "div",
                      Ae,
                      " Showing " +
                        d((s(n).page - 1) * s(n).limit + 1) +
                        " to " +
                        d(Math.min(s(n).page * s(n).limit, s(n).total)) +
                        " of " +
                        d(s(n).total) +
                        " results ",
                      1,
                    ),
                    e("div", he, [
                      e(
                        "button",
                        {
                          onClick: t[5] || (t[5] = (a) => h(s(n).page - 1)),
                          disabled: s(n).page === 1,
                          class:
                            "px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",
                        },
                        " Previous ",
                        8,
                        we,
                      ),
                      e(
                        "button",
                        {
                          onClick: t[6] || (t[6] = (a) => h(s(n).page + 1)),
                          disabled: s(n).page === s(n).totalPages,
                          class:
                            "px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",
                        },
                        " Next ",
                        8,
                        De,
                      ),
                    ]),
                  ]))
                : m("", !0),
            ]),
          ])
        )
      );
    },
  });
export { Le as default };
