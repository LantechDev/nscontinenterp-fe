import { _ as P } from "./DXifQ5ls.js";
import { _ as N } from "./kUcy7b0j.js";
import { _ as j } from "./Doao-lii.js";
import {
  e as A,
  ad as M,
  ac as T,
  r as u,
  q as $,
  o as D,
  M as V,
  R as r,
  Q as e,
  a2 as a,
  U as h,
  K as o,
  W as B,
  aa as x,
  a3 as q,
  a0 as w,
  a1 as L,
  P as C,
  T as l,
  t as E,
  $ as F,
  Y as Q,
  _ as i,
} from "./D9q6143x.js";
import { c as z } from "./DrxnuvjT.js";
import { S as G } from "./DK0cRrZx.js";
import { C as I } from "./C22E21xF.js";
import { P as K } from "./CWUm5Boh.js";
import { S as W } from "./CHWjNEBX.js";
import "./C0WRWJjF.js";
const Y = { class: "space-y-6 animate-fade-in p-6" },
  H = { class: "flex items-center justify-between gap-4" },
  J = { class: "relative w-full max-w-sm" },
  O = { class: "flex items-center gap-3" },
  X = { class: "relative" },
  Z = ["value"],
  tt = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  et = { class: "overflow-x-auto" },
  st = { class: "w-full" },
  ot = { class: "border-b border-border bg-white text-left" },
  nt = { class: "py-3 px-4 w-10" },
  at = { key: 0 },
  rt = { key: 1 },
  lt = ["onClick"],
  it = { class: "py-3 px-4" },
  dt = { class: "py-3 px-4 text-sm font-medium" },
  ut = { class: "py-3 px-4 text-sm font-normal" },
  pt = { class: "py-3 px-4" },
  mt = { class: "flex items-center gap-1 text-sm text-gray-700" },
  ct = { class: "py-3 px-4" },
  ft = { class: "py-3 px-4 text-sm text-muted-foreground" },
  xt = { class: "flex items-center justify-end gap-2" },
  gt = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  Pt = A({
    __name: "index",
    setup(vt) {
      const { fetchUsers: g } = M(),
        { roles: k, fetchRoles: U } = T(),
        v = u([]),
        _ = u(!0),
        d = u(""),
        p = u(""),
        f = $(() =>
          v.value.filter((n) => {
            const t =
                d.value === "" ||
                n.name.toLowerCase().includes(d.value.toLowerCase()) ||
                n.email.toLowerCase().includes(d.value.toLowerCase()),
              c = p.value === "" || n.role === p.value;
            return t && c;
          }),
        );
      D(async () => {
        U();
        try {
          const n = await g();
          n.success &&
            n.data &&
            Array.isArray(n.data.users) &&
            (v.value = n.data.users.map((t) => ({
              id: t.id,
              name: t.name,
              email: t.email,
              role: t.role,
              status: t.banned ? "inactive" : "active",
              lastLogin: t.lastLogin ? new Date(t.lastLogin).toLocaleString() : "-",
            })));
        } catch (n) {
          (console.error("Failed to fetch users", n), V.error("Gagal memuat daftar user."));
        } finally {
          _.value = !1;
        }
      });
      const m = u(1),
        y = u({ total: 0, limit: 10, page: 1 }),
        S = (n) => {
          ((m.value = n), g());
        };
      return (n, t) => {
        const c = P,
          b = N,
          R = j;
        return (
          i(),
          r("div", Y, [
            t[14] ||
              (t[14] = e(
                "div",
                { class: "flex items-center justify-between" },
                [e("h1", { class: "text-2xl font-bold" }, "User & Role")],
                -1,
              )),
            e("div", H, [
              e("div", J, [
                a(o(G), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                h(
                  e(
                    "input",
                    {
                      "onUpdate:modelValue": t[0] || (t[0] = (s) => (x(d) ? (d.value = s) : null)),
                      type: "text",
                      placeholder: "Search User...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    512,
                  ),
                  [[B, o(d)]],
                ),
              ]),
              e("div", O, [
                e("div", X, [
                  h(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue":
                          t[1] || (t[1] = (s) => (x(p) ? (p.value = s) : null)),
                        class:
                          "appearance-none flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground pr-8 cursor-pointer focus:outline-none",
                      },
                      [
                        t[4] || (t[4] = e("option", { value: "" }, "All Roles", -1)),
                        (i(!0),
                        r(
                          w,
                          null,
                          L(
                            o(k),
                            (s) => (
                              i(), r("option", { key: s.id, value: s.code }, l(s.name), 9, Z)
                            ),
                          ),
                          128,
                        )),
                      ],
                      512,
                    ),
                    [[q, o(p)]],
                  ),
                  a(o(I), {
                    class:
                      "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                a(
                  c,
                  {
                    to: "/settings/users/create",
                    class: "btn-primary min-w-fit whitespace-nowrap",
                  },
                  {
                    default: C(() => [
                      a(o(K), { class: "w-4 h-4 mr-2" }),
                      t[5] || (t[5] = e("span", null, "New User", -1)),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
            e("div", tt, [
              e("div", et, [
                e("table", st, [
                  e("thead", null, [
                    e("tr", ot, [
                      e("th", nt, [a(b, { disabled: "" })]),
                      t[6] ||
                        (t[6] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Name",
                          -1,
                        )),
                      t[7] ||
                        (t[7] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Email",
                          -1,
                        )),
                      t[8] ||
                        (t[8] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Role",
                          -1,
                        )),
                      t[9] ||
                        (t[9] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Status",
                          -1,
                        )),
                      t[10] ||
                        (t[10] = e(
                          "th",
                          { class: "py-3 px-4 text-sm font-medium text-foreground" },
                          "Last Login",
                          -1,
                        )),
                      t[11] || (t[11] = e("th", { class: "py-3 px-4 w-10" }, null, -1)),
                    ]),
                  ]),
                  e("tbody", null, [
                    o(_)
                      ? (i(),
                        r("tr", at, [
                          ...(t[12] ||
                            (t[12] = [
                              e(
                                "td",
                                { colspan: "7", class: "text-center p-8 text-muted-foreground" },
                                "Loading users...",
                                -1,
                              ),
                            ])),
                        ]))
                      : o(f).length === 0
                        ? (i(),
                          r("tr", rt, [
                            ...(t[13] ||
                              (t[13] = [
                                e(
                                  "td",
                                  { colspan: "7", class: "text-center p-8 text-muted-foreground" },
                                  "No users found.",
                                  -1,
                                ),
                              ])),
                          ]))
                        : (i(!0),
                          r(
                            w,
                            { key: 2 },
                            L(
                              o(f),
                              (s) => (
                                i(),
                                r(
                                  "tr",
                                  {
                                    key: s.id,
                                    class:
                                      "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                                    onClick: (_t) =>
                                      ("navigateTo" in n ? n.navigateTo : o(E))(
                                        `/settings/users/${s.id}`,
                                      ),
                                  },
                                  [
                                    e("td", it, [a(b)]),
                                    e("td", dt, l(s.name), 1),
                                    e("td", ut, l(s.email), 1),
                                    e("td", pt, [e("span", mt, l(s.role), 1)]),
                                    e("td", ct, [
                                      e(
                                        "span",
                                        {
                                          class: F(
                                            o(z)(
                                              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                              s.status === "active"
                                                ? "text-blue-500 border-blue-200"
                                                : "text-red-500 border-red-200",
                                            ),
                                          ),
                                        },
                                        l(s.status === "active" ? "Active" : "Inactive"),
                                        3,
                                      ),
                                    ]),
                                    e("td", ft, l(s.lastLogin), 1),
                                    e(
                                      "td",
                                      {
                                        class: "py-3 px-4 text-right",
                                        onClick: t[2] || (t[2] = Q(() => {}, ["stop"])),
                                      },
                                      [
                                        e("div", xt, [
                                          a(
                                            c,
                                            {
                                              to: `/settings/users/${s.id}/edit`,
                                              class: "text-muted-foreground hover:text-foreground",
                                            },
                                            {
                                              default: C(() => [a(o(W), { class: "w-4 h-4" })]),
                                              _: 1,
                                            },
                                            8,
                                            ["to"],
                                          ),
                                        ]),
                                      ],
                                    ),
                                  ],
                                  8,
                                  lt,
                                )
                              ),
                            ),
                            128,
                          )),
                  ]),
                ]),
              ]),
            ]),
            e("div", gt, [
              e("p", null, l(o(f).length) + " data found.", 1),
              a(
                R,
                {
                  page: o(m),
                  "onUpdate:page": [t[3] || (t[3] = (s) => (x(m) ? (m.value = s) : null)), S],
                  total: o(y).total,
                  "items-per-page": o(y).limit,
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
export { Pt as default };
