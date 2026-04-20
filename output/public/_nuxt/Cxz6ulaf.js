import { _ as l } from "./Cv6YVZ0L.js";
import { _ as r } from "./DXifQ5ls.js";
import { u as i } from "./DWPF6JO7.js";
import { e as c, R as d, Q as e, a2 as o, P as m, _, V as u } from "./D9q6143x.js";
const f = { class: "min-h-screen bg-background flex items-center justify-center p-6" },
  p = { class: "w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm" },
  x = { class: "flex items-center gap-3" },
  g = { class: "h-10 w-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center" },
  b = { class: "mt-6 flex flex-col gap-3" },
  C = c({
    __name: "offline",
    setup(h) {
      i({ title: "Offline - NS Continent ERP" });
      const n = () => {
        window.location.reload();
      };
      return (w, t) => {
        const s = l,
          a = r;
        return (
          _(),
          d("div", f, [
            e("div", p, [
              e("div", x, [
                e("div", g, [
                  o(s, { src: "/pwa/icon-192x192.png", alt: "App icon", class: "h-6 w-6" }),
                ]),
                t[0] ||
                  (t[0] = e(
                    "div",
                    null,
                    [
                      e(
                        "h1",
                        { class: "text-lg font-semibold text-foreground" },
                        "Kamu sedang offline",
                      ),
                      e(
                        "p",
                        { class: "text-sm text-muted-foreground" },
                        "Periksa koneksi internet lalu coba lagi.",
                      ),
                    ],
                    -1,
                  )),
              ]),
              e("div", b, [
                e(
                  "button",
                  { type: "button", class: "btn-primary h-11 w-full", onClick: n },
                  " Muat ulang ",
                ),
                o(
                  a,
                  {
                    to: "/login",
                    class: "w-full text-center text-sm text-accent hover:text-accent/80",
                  },
                  { default: m(() => [...(t[1] || (t[1] = [u(" Kembali ke Login ", -1)]))]), _: 1 },
                ),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { C as default };
