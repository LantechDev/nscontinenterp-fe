import { _ as D } from "./DXifQ5ls.js";
import { _ as N } from "./kUcy7b0j.js";
import { _ as P } from "./Doao-lii.js";
import {
  e as V,
  ac as j,
  r as p,
  o as B,
  q as U,
  R as d,
  Q as e,
  S as $,
  K as s,
  T as c,
  a2 as n,
  U as M,
  W as Q,
  aa as y,
  P as v,
  V as q,
  Z as w,
  a0 as E,
  a1 as H,
  $ as z,
  O as k,
  _ as r,
} from "./D9q6143x.js";
import { c as F } from "./DrxnuvjT.js";
import { u as G } from "./BfskLp3w.js";
import { S as I } from "./DK0cRrZx.js";
import { P as K } from "./CWUm5Boh.js";
import { S as O } from "./D5amknJa.js";
import { S as W } from "./CHWjNEBX.js";
import { T as Y } from "./DhzAXlPS.js";
import "./C0WRWJjF.js";
const Z = { class: "space-y-6 animate-fade-in p-6" },
  J = { key: 0, class: "bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200" },
  X = { class: "flex items-center justify-between gap-4" },
  ee = { class: "relative w-full max-w-sm" },
  te = { class: "flex items-center gap-3" },
  se = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  oe = { class: "overflow-x-auto" },
  ne = { class: "w-full" },
  ae = { class: "border-b border-border bg-white text-left" },
  re = { class: "py-3 px-4 w-10" },
  ie = { key: 0 },
  le = { colspan: "6", class: "text-center p-8 text-muted-foreground" },
  de = { key: 1 },
  ce = { class: "py-3 px-4" },
  ue = { class: "py-3 px-4 text-sm font-medium" },
  me = { class: "flex items-center gap-3" },
  pe = { class: "w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center" },
  fe = { class: "py-3 px-4 text-sm font-mono text-muted-foreground" },
  xe = { class: "py-3 px-4 text-sm text-muted-foreground" },
  ge = { class: "py-3 px-4" },
  _e = { class: "py-3 px-4" },
  he = { class: "flex items-center gap-2" },
  be = ["onClick", "disabled"],
  ye = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  Be = V({
    __name: "index",
    setup(ve) {
      const { roles: _, fetchRoles: h, deleteRole: C, isLoading: R } = j(),
        { confirm: S } = G(),
        u = p(""),
        f = p(!1),
        m = p("");
      B(() => {
        h();
      });
      const x = p(1),
        b = p({ total: 0, limit: 10, page: 1 }),
        L = (a) => {
          ((x.value = a), h());
        },
        g = U(() => {
          if (!u.value) return _.value;
          const a = u.value.toLowerCase();
          return _.value.filter(
            (t) =>
              t.name.toLowerCase().includes(a) ||
              t.code.toLowerCase().includes(a) ||
              (t.description && t.description.toLowerCase().includes(a)),
          );
        }),
        T = async (a) => {
          if (
            await S({
              title: "Hapus Role?",
              message: `Apakah Anda yakin ingin menghapus role ${a.name}? Tindakan ini tidak dapat dibatalkan.`,
              confirmText: "Ya, Hapus",
              cancelText: "Batal",
              type: "danger",
            })
          ) {
            ((f.value = !0), (m.value = ""));
            try {
              const i = await C(a.id);
              if (!i.success) {
                const l = i;
                m.value = l.error || "Gagal menghapus role.";
              }
            } catch (i) {
              const l = i;
              m.value = l.message || "Terjadi kesalahan sistem.";
            } finally {
              f.value = !1;
            }
          }
        };
      return (a, t) => {
        const i = D,
          l = N,
          A = P;
        return (
          r(),
          d("div", Z, [
            t[10] ||
              (t[10] = e(
                "div",
                { class: "flex items-center justify-between" },
                [e("h1", { class: "text-2xl font-bold" }, "Role Management")],
                -1,
              )),
            s(m) ? (r(), d("div", J, c(s(m)), 1)) : $("", !0),
            e("div", X, [
              e("div", ee, [
                n(s(I), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                M(
                  e(
                    "input",
                    {
                      "onUpdate:modelValue": t[0] || (t[0] = (o) => (y(u) ? (u.value = o) : null)),
                      type: "text",
                      placeholder: "Search Role...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    512,
                  ),
                  [[Q, s(u)]],
                ),
              ]),
              e("div", te, [
                n(
                  i,
                  {
                    to: "/settings/roles/create",
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  {
                    default: v(() => [
                      n(s(K), { class: "w-4 h-4" }),
                      t[2] || (t[2] = e("span", null, "New Role", -1)),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
            e("div", se, [
              e("div", oe, [
                e("table", ne, [
                  e("thead", null, [
                    e("tr", ae, [
                      e("th", re, [n(l, { disabled: "" })]),
                      t[3] ||
                        (t[3] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Name",
                          -1,
                        )),
                      t[4] ||
                        (t[4] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Code",
                          -1,
                        )),
                      t[5] ||
                        (t[5] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Description",
                          -1,
                        )),
                      t[6] ||
                        (t[6] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Status",
                          -1,
                        )),
                      t[7] || (t[7] = e("th", { class: "py-3 px-4 w-28" }, "Action", -1)),
                    ]),
                  ]),
                  e("tbody", null, [
                    s(R)
                      ? (r(),
                        d("tr", ie, [
                          e("td", le, [
                            n(s(w), { class: "w-6 h-6 mx-auto animate-spin mb-2" }),
                            t[8] || (t[8] = q(" Loading roles... ", -1)),
                          ]),
                        ]))
                      : s(g).length === 0
                        ? (r(),
                          d("tr", de, [
                            ...(t[9] ||
                              (t[9] = [
                                e(
                                  "td",
                                  { colspan: "6", class: "text-center p-8 text-muted-foreground" },
                                  "No roles found.",
                                  -1,
                                ),
                              ])),
                          ]))
                        : (r(!0),
                          d(
                            E,
                            { key: 2 },
                            H(
                              s(g),
                              (o) => (
                                r(),
                                d(
                                  "tr",
                                  {
                                    key: o.id,
                                    class:
                                      "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                                  },
                                  [
                                    e("td", ce, [n(l)]),
                                    e("td", ue, [
                                      e("div", me, [
                                        e("div", pe, [n(s(O), { class: "w-4 h-4 text-accent" })]),
                                        e("span", null, c(o.name), 1),
                                      ]),
                                    ]),
                                    e("td", fe, c(o.code), 1),
                                    e("td", xe, c(o.description || "-"), 1),
                                    e("td", ge, [
                                      e(
                                        "span",
                                        {
                                          class: z(
                                            s(F)(
                                              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                              o.isActive
                                                ? "text-blue-500 border-blue-200"
                                                : "text-gray-500 border-gray-200",
                                            ),
                                          ),
                                        },
                                        c(o.isActive ? "Active" : "Inactive"),
                                        3,
                                      ),
                                    ]),
                                    e("td", _e, [
                                      e("div", he, [
                                        n(
                                          i,
                                          {
                                            to: `/settings/roles/${o.id}/edit`,
                                            class: "text-muted-foreground hover:text-foreground",
                                            title: "Edit role",
                                          },
                                          {
                                            default: v(() => [n(s(W), { class: "w-4 h-4" })]),
                                            _: 1,
                                          },
                                          8,
                                          ["to"],
                                        ),
                                        e(
                                          "button",
                                          {
                                            onClick: (we) => T(o),
                                            disabled: s(f),
                                            class:
                                              "text-red-500 hover:text-red-700 transition-colors disabled:opacity-50",
                                            title: "Delete role",
                                          },
                                          [
                                            s(f)
                                              ? (r(),
                                                k(s(w), { key: 0, class: "w-4 h-4 animate-spin" }))
                                              : (r(), k(s(Y), { key: 1, class: "w-4 h-4" })),
                                          ],
                                          8,
                                          be,
                                        ),
                                      ]),
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
            ]),
            e("div", ye, [
              e("p", null, c(s(g).length) + " data found.", 1),
              n(
                A,
                {
                  page: s(x),
                  "onUpdate:page": [t[1] || (t[1] = (o) => (y(x) ? (x.value = o) : null)), L],
                  total: s(b).total,
                  "items-per-page": s(b).limit,
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
  });
export { Be as default };
