import { _ as v } from "./DXifQ5ls.js";
import {
  e as b,
  ab as y,
  ad as L,
  r as m,
  o as w,
  M as _,
  R as d,
  Q as t,
  S as k,
  a2 as i,
  P as g,
  T as r,
  K as s,
  $ as f,
  V as x,
  _ as l,
} from "./D9q6143x.js";
import { U as A } from "./BiL-zx6i.js";
import { S as D } from "./D5amknJa.js";
import { A as S } from "./CdOyNhW7.js";
import { S as I } from "./CHWjNEBX.js";
const N = { class: "space-y-6 animate-fade-in p-6" },
  T = { class: "page-header" },
  V = { class: "flex items-center gap-4" },
  B = { class: "page-title" },
  C = { key: 0, class: "p-8 text-center text-muted-foreground" },
  M = { key: 1, class: "bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200" },
  R = { key: 2, class: "card-elevated p-6" },
  U = { class: "flex items-center gap-4 mb-6 pb-6 border-b border-border" },
  j = { class: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center" },
  E = { class: "text-xl font-semibold" },
  P = { class: "text-muted-foreground" },
  $ = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" },
  q = { class: "space-y-1" },
  z = { class: "font-medium flex items-center gap-2 text-primary" },
  G = { class: "space-y-1" },
  K = { class: "font-medium" },
  Q = { class: "space-y-1" },
  F = { class: "font-medium" },
  te = b({
    __name: "index",
    setup(H) {
      const u = y().params.id,
        { fetchUserById: h } = L(),
        a = m(null),
        c = m(!0),
        n = m("");
      return (
        w(async () => {
          try {
            const o = await h(u);
            if (o.success && o.data) {
              const e = o.data.user || o.data;
              a.value = {
                id: e.id,
                name: e.name,
                email: e.email,
                role: e.role,
                status: e.banned ? "inactive" : "active",
                lastLogin: e.lastLogin
                  ? new Date(e.lastLogin).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-",
                createdAt: e.createdAt
                  ? new Date(e.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-",
              };
            } else ((n.value = o.error || "Gagal mengambil data user."), _.error(n.value));
          } catch (o) {
            const e = o;
            ((n.value = e.message || "Terjadi kesalahan."), _.error(n.value));
          } finally {
            c.value = !1;
          }
        }),
        (o, e) => {
          const p = v;
          return (
            l(),
            d("div", N, [
              t("div", T, [
                t("div", V, [
                  i(
                    p,
                    {
                      to: "/settings/users",
                      class: "p-2 rounded-lg hover:bg-muted transition-colors",
                    },
                    { default: g(() => [i(s(S), { class: "w-5 h-5" })]), _: 1 },
                  ),
                  t("div", null, [
                    t("h1", B, r(s(a)?.name || "Loading..."), 1),
                    e[0] ||
                      (e[0] = t("p", { class: "text-muted-foreground mt-1" }, "Detail user", -1)),
                  ]),
                ]),
                i(
                  p,
                  {
                    to: `/settings/users/${s(u)}/edit`,
                    class: f(["btn-primary", { "opacity-50 pointer-events-none": s(c) || !s(a) }]),
                  },
                  {
                    default: g(() => [
                      i(s(I), { class: "w-4 h-4 mr-2" }),
                      e[1] || (e[1] = x(" Edit ", -1)),
                    ]),
                    _: 1,
                  },
                  8,
                  ["to", "class"],
                ),
              ]),
              s(c)
                ? (l(), d("div", C, "Loading..."))
                : s(n)
                  ? (l(), d("div", M, r(s(n)), 1))
                  : s(a)
                    ? (l(),
                      d("div", R, [
                        t("div", U, [
                          t("div", j, [i(s(A), { class: "w-7 h-7 text-primary" })]),
                          t("div", null, [
                            t("h2", E, r(s(a).name), 1),
                            t("p", P, r(s(a).email), 1),
                          ]),
                          t(
                            "span",
                            {
                              class: f([
                                "ml-auto px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                s(a).status === "active"
                                  ? "text-blue-500 border-blue-200"
                                  : "text-red-500 border-red-200",
                              ]),
                            },
                            r(s(a).status === "active" ? "Active" : "Inactive"),
                            3,
                          ),
                        ]),
                        t("div", $, [
                          t("div", q, [
                            e[2] ||
                              (e[2] = t(
                                "p",
                                { class: "text-sm text-muted-foreground" },
                                "Role",
                                -1,
                              )),
                            t("p", z, [i(s(D), { class: "w-4 h-4" }), x(" " + r(s(a).role), 1)]),
                          ]),
                          t("div", G, [
                            e[3] ||
                              (e[3] = t(
                                "p",
                                { class: "text-sm text-muted-foreground" },
                                "Login Terakhir",
                                -1,
                              )),
                            t("p", K, r(s(a).lastLogin), 1),
                          ]),
                          t("div", Q, [
                            e[4] ||
                              (e[4] = t(
                                "p",
                                { class: "text-sm text-muted-foreground" },
                                "Tanggal Dibuat",
                                -1,
                              )),
                            t("p", F, r(s(a).createdAt), 1),
                          ]),
                        ]),
                      ]))
                    : k("", !0),
            ])
          );
        }
      );
    },
  });
export { te as default };
