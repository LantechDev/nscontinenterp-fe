import { _ } from "./Cv6YVZ0L.js";
import {
  c as D,
  e as E,
  f as M,
  ad as j,
  r,
  R as m,
  Q as e,
  K as s,
  a2 as p,
  S as L,
  T as V,
  Y as C,
  U as x,
  W as F,
  aa as v,
  ar as A,
  O as g,
  Z as z,
  V as B,
  _ as a,
} from "./D9q6143x.js";
import { E as H } from "./D__u8pJn.js";
const N = D("eye-off", [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ]),
  R = "" + new URL("login.Z_OMUEo5.svg", import.meta.url).href,
  S = { class: "min-h-screen flex" },
  U = { class: "hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden" },
  O = { class: "absolute inset-0" },
  P = ["src"],
  I = { class: "relative z-10 flex flex-col justify-center px-12 xl:px-20" },
  T = { class: "flex items-center gap-4 mb-8" },
  q = {
    class: "flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm",
  },
  Y = { class: "w-full lg:w-1/2 flex items-center justify-center p-8 bg-background" },
  Z = { class: "w-full max-w-md space-y-8 animate-fade-in" },
  K = { class: "lg:hidden flex items-center justify-center gap-3 mb-8" },
  Q = {
    class:
      "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary/20 backdrop-blur-sm",
  },
  W = { key: 0, class: "bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200" },
  $ = { class: "relative" },
  G = ["type"],
  J = ["disabled"],
  X = { key: 1 },
  ae = E({
    __name: "login",
    setup(ee) {
      const b = M(),
        { login: h, listOrganizations: w, setActiveOrganization: y } = j(),
        i = r(!1),
        d = r(!1),
        u = r(""),
        c = r(""),
        l = r(""),
        k = async () => {
          ((l.value = ""), (d.value = !0));
          try {
            const o = await h(u.value, c.value);
            if (o.success) {
              const t = await w();
              if (t.success && t.data && t.data.length > 0) {
                const n = t.data[0];
                n?.id && (await y(n.id));
              } else console.warn("[Login] No organizations found for user");
              b.push("/dashboard");
            } else
              ((l.value = o.error || "Login gagal. Periksa email dan password Anda."),
                console.error("[Login] Login failed:", o.error));
          } catch (o) {
            (console.error("[Login] Unexpected error:", o),
              (l.value = "Terjadi kesalahan koneksi. Pastikan server berjalan."));
          } finally {
            d.value = !1;
          }
        };
      return (o, t) => {
        const n = _;
        return (
          a(),
          m("div", S, [
            e("div", U, [
              e("div", O, [
                e(
                  "img",
                  {
                    src: s(R),
                    alt: "",
                    class:
                      "object-cover flex w-full h-full bg-black opacity-50 drop-shadow-[0_40px_70px_rgba(0,0,0,0.5)]",
                  },
                  null,
                  8,
                  P,
                ),
                t[3] ||
                  (t[3] = e(
                    "div",
                    {
                      class:
                        "absolute inset-0 bg-gradient-to-b from-[#012D5A]/10 via-[#012D5A]/30 to-[#012D5A]/80",
                    },
                    null,
                    -1,
                  )),
                t[4] || (t[4] = e("div", { class: "absolute inset-0 bg-black/10" }, null, -1)),
              ]),
              t[7] ||
                (t[7] = e(
                  "div",
                  {
                    class:
                      "absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30",
                  },
                  null,
                  -1,
                )),
              e("div", I, [
                e("div", T, [
                  e("div", q, [
                    p(n, {
                      src: "/favicon.png",
                      alt: "Logo",
                      class: "w-full h-full object-cover object-left rounded-lg",
                    }),
                  ]),
                  t[5] ||
                    (t[5] = e(
                      "div",
                      null,
                      [
                        e("h1", { class: "text-3xl font-bold text-white" }, "NSContinent"),
                        e("p", { class: "text-white/70 text-sm" }, "E-Report Finance"),
                      ],
                      -1,
                    )),
                ]),
                t[6] ||
                  (t[6] = e(
                    "div",
                    { class: "space-y-6 max-w-md" },
                    [
                      e(
                        "h2",
                        { class: "text-4xl xl:text-5xl font-bold text-white leading-tight" },
                        " Manage Your Business Finances with Ease ",
                      ),
                      e(
                        "p",
                        { class: "text-lg text-white/80" },
                        " System integrated for comprehensive financial reporting, designed to streamline your operations and empower your business growth. ",
                      ),
                    ],
                    -1,
                  )),
              ]),
              t[8] ||
                (t[8] = e(
                  "div",
                  {
                    class:
                      "absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2",
                  },
                  null,
                  -1,
                )),
              t[9] ||
                (t[9] = e(
                  "div",
                  {
                    class: "absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl",
                  },
                  null,
                  -1,
                )),
            ]),
            e("div", Y, [
              e("div", Z, [
                e("div", K, [
                  e("div", Q, [p(n, { src: "/favicon.png", alt: "Logo", class: "w-8 h-8" })]),
                  t[10] ||
                    (t[10] = e(
                      "div",
                      null,
                      [
                        e("h1", { class: "text-2xl font-bold text-foreground" }, "Lantech"),
                        e("p", { class: "text-xs text-muted-foreground" }, "E-Report Finance"),
                      ],
                      -1,
                    )),
                ]),
                t[14] ||
                  (t[14] = e(
                    "div",
                    { class: "text-center lg:text-left" },
                    [
                      e("h2", { class: "text-2xl font-bold text-foreground" }, "Selamat Datang"),
                      e(
                        "p",
                        { class: "text-muted-foreground mt-2" },
                        "Masuk ke akun Anda untuk melanjutkan",
                      ),
                    ],
                    -1,
                  )),
                s(l) ? (a(), m("div", W, V(s(l)), 1)) : L("", !0),
                e(
                  "form",
                  { class: "space-y-5", onSubmit: C(k, ["prevent"]) },
                  [
                    e("div", null, [
                      t[11] ||
                        (t[11] = e(
                          "label",
                          { for: "email", class: "block text-sm font-medium text-foreground mb-2" },
                          " Email ",
                          -1,
                        )),
                      x(
                        e(
                          "input",
                          {
                            id: "email",
                            "onUpdate:modelValue":
                              t[0] || (t[0] = (f) => (v(u) ? (u.value = f) : null)),
                            type: "email",
                            placeholder: "nama@perusahaan.com",
                            class: "input-field",
                            required: "",
                          },
                          null,
                          512,
                        ),
                        [[F, s(u)]],
                      ),
                    ]),
                    e("div", null, [
                      t[12] ||
                        (t[12] = e(
                          "div",
                          { class: "flex items-center justify-between mb-2" },
                          [
                            e(
                              "label",
                              {
                                for: "password",
                                class: "block text-sm font-medium text-foreground",
                              },
                              " Password ",
                            ),
                            e(
                              "button",
                              {
                                type: "button",
                                class: "text-sm text-accent hover:text-accent/80 font-medium",
                              },
                              " Lupa Password? ",
                            ),
                          ],
                          -1,
                        )),
                      e("div", $, [
                        x(
                          e(
                            "input",
                            {
                              id: "password",
                              "onUpdate:modelValue":
                                t[1] || (t[1] = (f) => (v(c) ? (c.value = f) : null)),
                              type: s(i) ? "text" : "password",
                              placeholder: "••••••••",
                              class: "input-field pr-12",
                              required: "",
                            },
                            null,
                            8,
                            G,
                          ),
                          [[A, s(c)]],
                        ),
                        e(
                          "button",
                          {
                            type: "button",
                            class:
                              "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                            onClick: t[2] || (t[2] = (f) => (i.value = !s(i))),
                          },
                          [
                            s(i)
                              ? (a(), g(s(N), { key: 0, class: "w-5 h-5" }))
                              : (a(), g(s(H), { key: 1, class: "w-5 h-5" })),
                          ],
                        ),
                      ]),
                    ]),
                    t[13] ||
                      (t[13] = e(
                        "div",
                        { class: "flex items-center gap-2" },
                        [
                          e("input", {
                            id: "remember",
                            type: "checkbox",
                            class: "w-4 h-4 rounded border-border text-primary focus:ring-primary",
                          }),
                          e(
                            "label",
                            { for: "remember", class: "text-sm text-muted-foreground" },
                            " Ingat saya di perangkat ini ",
                          ),
                        ],
                        -1,
                      )),
                    e(
                      "button",
                      {
                        type: "submit",
                        disabled: s(d),
                        class: "w-full btn-primary h-12 text-base",
                      },
                      [
                        s(d)
                          ? (a(), g(s(z), { key: 0, class: "w-5 h-5 animate-spin" }))
                          : (a(), m("span", X, "Masuk")),
                      ],
                      8,
                      J,
                    ),
                  ],
                  32,
                ),
                t[15] ||
                  (t[15] = e(
                    "p",
                    { class: "text-center text-sm text-muted-foreground" },
                    [
                      B(" Belum punya akun? "),
                      e(
                        "button",
                        { class: "text-accent hover:text-accent/80 font-medium" },
                        " Hubungi Administrator ",
                      ),
                    ],
                    -1,
                  )),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { ae as default };
