import { _ as n } from "./DXifQ5ls.js";
import { S as d } from "./CfuPgfv3.js";
import { A as r } from "./CdOyNhW7.js";
import {
  e as p,
  R as c,
  Q as e,
  a2 as t,
  P as l,
  ah as u,
  V as o,
  K as i,
  _ as m,
} from "./D9q6143x.js";
const f = { class: "space-y-6 animate-fade-in p-6" },
  v = { class: "page-header" },
  _ = { class: "flex items-center gap-4" },
  b = { class: "card-elevated p-6 space-y-6" },
  x = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  g = { type: "submit", class: "btn-primary" },
  V = p({
    __name: "create",
    setup(y) {
      return (h, a) => {
        const s = n;
        return (
          m(),
          c("div", f, [
            e("div", v, [
              e("div", _, [
                t(
                  s,
                  {
                    to: "/sales/quotation",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: l(() => [t(i(r), { class: "w-5 h-5" })]), _: 1 },
                ),
                a[0] ||
                  (a[0] = e(
                    "div",
                    null,
                    [
                      e("h1", { class: "page-title" }, "Buat Penawaran"),
                      e("p", { class: "text-muted-foreground mt-1" }, "Buat penawaran harga baru"),
                    ],
                    -1,
                  )),
              ]),
            ]),
            e("form", b, [
              a[3] ||
                (a[3] = u(
                  '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Customer</label><select class="input-field"><option value="">Pilih customer</option><option value="1">PT Maju Bersama</option><option value="2">CV Sukses Makmur</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Tanggal</label><input type="date" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Rute Asal</label><input type="text" placeholder="Jakarta" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Rute Tujuan</label><input type="text" placeholder="Singapore" class="input-field"></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Jasa yang Ditawarkan</label><textarea rows="4" placeholder="Detail jasa dan harga..." class="input-field"></textarea></div><div class="space-y-2"><label class="text-sm font-medium">Total Penawaran</label><input type="text" placeholder="Rp 0" class="input-field"></div></div>',
                  1,
                )),
              e("div", x, [
                t(
                  s,
                  { to: "/sales/quotation", class: "btn-secondary" },
                  { default: l(() => [...(a[1] || (a[1] = [o("Batal", -1)]))]), _: 1 },
                ),
                e("button", g, [
                  t(i(d), { class: "w-4 h-4 mr-2" }),
                  a[2] || (a[2] = o(" Simpan ", -1)),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { V as default };
