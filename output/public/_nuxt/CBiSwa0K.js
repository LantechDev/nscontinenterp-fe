import { _ as W } from "./DhCF3Kco.js";
import {
  L as Y,
  r as d,
  q as B,
  H as S,
  d as Z,
  e as z,
  o as E,
  R as L,
  Q as c,
  a2 as b,
  O as M,
  K as a,
  U as G,
  W as J,
  aa as U,
  Z as O,
  P,
  S as X,
  V as T,
  T as j,
  _ as h,
} from "./D9q6143x.js";
import { _ as ee } from "./ViT1jJDu.js";
import { _ as te } from "./BTvuPQw3.js";
import { _ as se } from "./CW0EdNRq.js";
import { S as ae } from "./DK0cRrZx.js";
import { P as le } from "./CWUm5Boh.js";
import { T as oe } from "./DhzAXlPS.js";
import "./DrxnuvjT.js";
import "./CfuPgfv3.js";
import "./C22E21xF.js";
import "./DeUJRdQC.js";
import "./p41O2Qdo.js";
import "./BsM_H8Mt.js";
function A(u) {
  if (u && typeof u == "object" && "data" in u) {
    const l = u.data;
    if (l?.message) return l.message;
    if (l?.error) return l.error;
  }
  return u instanceof Error ? u.message : "An error occurred";
}
function re() {
  const u = Z(),
    l = Y("vessels", () => []),
    r = d(!1),
    $ = B(() => {
      const o = l.value || [];
      return {
        total: o.length,
        active: o.filter((t) => t.isActive && !t.deletedAt).length,
        inactive: o.filter((t) => !t.isActive || t.deletedAt).length,
      };
    }),
    w = async (o) => {
      r.value = !0;
      try {
        const t = await $fetch(`${u.public.apiBase}/master/vessels`, {
          params: { search: o },
          credentials: "include",
        });
        return ((l.value = t || []), { success: !0, data: l.value });
      } catch (t) {
        return { success: !1, error: A(t) };
      } finally {
        r.value = !1;
      }
    },
    k = async (o) => {
      r.value = !0;
      try {
        const t = await $fetch(`${u.public.apiBase}/master/vessels`, {
          method: "POST",
          body: o,
          credentials: "include",
        });
        return ((l.value = [t, ...l.value]), { success: !0, data: t });
      } catch (t) {
        return { success: !1, error: A(t) };
      } finally {
        r.value = !1;
      }
    },
    D = async (o, t) => {
      r.value = !0;
      try {
        const m = await $fetch(`${u.public.apiBase}/master/vessels/${o}`, {
          method: "PUT",
          body: t,
          credentials: "include",
        });
        return (
          (l.value = l.value.map((x) => (x.id === o ? { ...x, ...m } : x))),
          { success: !0, data: m }
        );
      } catch (m) {
        return { success: !1, error: A(m) };
      } finally {
        r.value = !1;
      }
    },
    N = async (o) => {
      r.value = !0;
      try {
        return (
          await $fetch(`${u.public.apiBase}/master/vessels/${o}`, {
            method: "DELETE",
            credentials: "include",
          }),
          (l.value = l.value.filter((t) => t.id !== o)),
          { success: !0 }
        );
      } catch (t) {
        return { success: !1, error: A(t) };
      } finally {
        r.value = !1;
      }
    },
    f = async (o) => {
      r.value = !0;
      try {
        return {
          success: !0,
          data: await $fetch(`${u.public.apiBase}/master/vessels/${o}`, { credentials: "include" }),
        };
      } catch (t) {
        return { success: !1, error: A(t) };
      } finally {
        r.value = !1;
      }
    };
  return {
    vessels: S(l),
    stats: S($),
    isLoading: S(r),
    fetchVessels: w,
    createVessel: k,
    updateVessel: D,
    deleteVessel: N,
    getVesselById: f,
  };
}
const ne = { class: "space-y-6 animate-fade-in p-6" },
  ie = { class: "flex items-center justify-between gap-4" },
  ue = { class: "relative w-full max-w-sm" },
  ce = { key: 0, class: "flex items-center justify-center py-12" },
  de = { key: 0, class: "py-4" },
  me = { class: "text-sm text-muted-foreground" },
  ve = { class: "font-medium text-foreground" },
  fe = ["disabled"],
  pe = ["disabled"],
  Se = z({
    __name: "index",
    setup(u) {
      const {
        vessels: l,
        stats: r,
        isLoading: $,
        fetchVessels: w,
        createVessel: k,
        updateVessel: D,
        deleteVessel: N,
      } = re();
      E(() => {
        w();
      });
      const f = d(""),
        o = B(() => {
          let s = l.value.map((e) => ({
            id: e.id,
            name: e.name,
            imoNumber: e.imoNumber || "-",
            createdAt: new Date(e.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            status: e.isActive && !e.deletedAt ? "Active" : "Inactive",
          }));
          if (f.value) {
            const e = f.value.toLowerCase();
            s = s.filter(
              (n) => n.name.toLowerCase().includes(e) || n.imoNumber.toLowerCase().includes(e),
            );
          }
          return s;
        }),
        t = d("name"),
        m = d("asc"),
        x = B(() => {
          const s = [...o.value];
          return (
            s.sort((e, n) => {
              let i = 0;
              switch (t.value) {
                case "name":
                  i = e.name.localeCompare(n.name);
                  break;
                case "imoNumber":
                  i = e.imoNumber.localeCompare(n.imoNumber);
                  break;
                case "createdAt":
                  i = e.createdAt.localeCompare(n.createdAt);
                  break;
                case "status":
                  i = e.status.localeCompare(n.status);
                  break;
                default:
                  i = e.name.localeCompare(n.name);
              }
              return m.value === "asc" ? i : -i;
            }),
            s
          );
        }),
        I = (s) => {
          t.value === s
            ? (m.value = m.value === "asc" ? "desc" : "asc")
            : ((t.value = s), (m.value = "asc"));
        },
        _ = d(!1),
        v = d(!1),
        V = d(null),
        p = d(null),
        q = () => {
          ((p.value = null), (_.value = !0));
        },
        F = (s) => {
          ((p.value = l.value.find((e) => e.id === s) || null), (_.value = !0));
        },
        R = async (s) => {
          if (!s.name) {
            V.value = "Vessel name is required";
            return;
          }
          ((v.value = !0), (V.value = null));
          const e = {
            name: s.name,
            imoNumber: s.imoNumber || void 0,
            description: s.description || void 0,
            isActive: s.isActive,
          };
          let n;
          (p.value ? (n = await D(p.value.id, e)) : (n = await k(e)),
            n.success
              ? ((_.value = !1), (p.value = null), await w())
              : (V.value = n.error || "Failed to save vessel"),
            (v.value = !1));
        },
        g = d(!1),
        y = d(null),
        Q = (s) => {
          ((y.value = l.value.find((e) => e.id === s) || null), (g.value = !0));
        },
        H = async () => {
          if (!y.value) return;
          v.value = !0;
          const s = await N(y.value.id);
          (s.success
            ? ((g.value = !1), (y.value = null), await w())
            : (V.value = s.error || "Failed to delete vessel"),
            (v.value = !1));
        },
        C = d(null),
        K = (s) => {
          C.value = C.value === s ? null : s;
        };
      return (
        E(() => {
          document.addEventListener("click", (s) => {
            s.target.closest(".dropdown-menu") || (C.value = null);
          });
        }),
        (s, e) => {
          const n = W;
          return (
            h(),
            L("div", ne, [
              e[7] ||
                (e[7] = c(
                  "div",
                  { class: "flex items-center justify-between" },
                  [c("h1", { class: "text-2xl font-bold" }, "Vessels")],
                  -1,
                )),
              b(
                a(se),
                { total: a(r).total, active: a(r).active, inactive: a(r).inactive },
                null,
                8,
                ["total", "active", "inactive"],
              ),
              c("div", ie, [
                c("div", ue, [
                  b(a(ae), {
                    class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  }),
                  G(
                    c(
                      "input",
                      {
                        "onUpdate:modelValue":
                          e[0] || (e[0] = (i) => (U(f) ? (f.value = i) : null)),
                        type: "text",
                        placeholder: "Search Vessel...",
                        class:
                          "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                      },
                      null,
                      512,
                    ),
                    [[J, a(f)]],
                  ),
                ]),
                c(
                  "button",
                  {
                    onClick: q,
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  [
                    b(a(le), { class: "w-4 h-4" }),
                    e[4] || (e[4] = c("span", null, "New Vessel", -1)),
                  ],
                ),
              ]),
              a($)
                ? (h(), L("div", ce, [b(a(O), { class: "w-8 h-8 animate-spin text-[#012D5A]" })]))
                : (h(),
                  M(
                    a(te),
                    {
                      key: 1,
                      vessels: a(x),
                      "sort-field": a(t),
                      "sort-direction": a(m),
                      "open-menu-id": a(C),
                      onToggleSort: I,
                      onToggleMenu: K,
                      onEdit: F,
                      onDelete: Q,
                    },
                    null,
                    8,
                    ["vessels", "sort-field", "sort-direction", "open-menu-id"],
                  )),
              b(
                a(ee),
                {
                  "is-open": a(_),
                  "is-submitting": a(v),
                  error: a(V),
                  "editing-vessel": a(p),
                  "onUpdate:isOpen": e[1] || (e[1] = (i) => (_.value = i)),
                  onSubmit: R,
                },
                null,
                8,
                ["is-open", "is-submitting", "error", "editing-vessel"],
              ),
              b(
                n,
                {
                  modelValue: a(g),
                  "onUpdate:modelValue": e[3] || (e[3] = (i) => (U(g) ? (g.value = i) : null)),
                  title: "Delete Vessel",
                  description:
                    "Are you sure you want to delete this vessel? This action cannot be undone.",
                  width: "max-w-md",
                },
                {
                  footer: P(() => [
                    c(
                      "button",
                      {
                        type: "button",
                        onClick: e[2] || (e[2] = (i) => (g.value = !1)),
                        class:
                          "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                        disabled: a(v),
                      },
                      " Cancel ",
                      8,
                      fe,
                    ),
                    c(
                      "button",
                      {
                        type: "button",
                        onClick: H,
                        disabled: a(v),
                        class:
                          "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      },
                      [
                        a(v)
                          ? (h(), M(a(O), { key: 0, class: "w-4 h-4 animate-spin" }))
                          : (h(), M(a(oe), { key: 1, class: "w-4 h-4" })),
                        T(" " + j(a(v) ? "Deleting..." : "Delete"), 1),
                      ],
                      8,
                      pe,
                    ),
                  ]),
                  default: P(() => [
                    a(y)
                      ? (h(),
                        L("div", de, [
                          c("p", me, [
                            e[5] || (e[5] = T(" You are about to delete ", -1)),
                            c("span", ve, j(a(y).name), 1),
                            e[6] || (e[6] = T(". ", -1)),
                          ]),
                        ]))
                      : X("", !0),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              ),
            ])
          );
        }
      );
    },
  });
export { Se as default };
