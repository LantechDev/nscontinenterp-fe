import { _ as n } from "./DXifQ5ls.js";
import { S as r } from "./CfuPgfv3.js";
import { A as p } from "./CdOyNhW7.js";
import {
  e as d,
  R as c,
  Q as s,
  a2 as a,
  P as o,
  ah as m,
  V as i,
  K as l,
  _ as u,
} from "./D9q6143x.js";
const v = { class: "space-y-6 animate-fade-in p-6" },
  f = { class: "page-header" },
  _ = { class: "flex items-center gap-4" },
  b = { class: "card-elevated p-6 space-y-6" },
  x = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  g = { type: "submit", class: "btn-primary" },
  B = d({
    __name: "create",
    setup(h) {
      return (y, e) => {
        const t = n;
        return (
          u(),
          c("div", v, [
            s("div", f, [
              s("div", _, [
                a(
                  t,
                  {
                    to: "/master/services",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: o(() => [a(l(p), { class: "w-5 h-5" })]), _: 1 },
                ),
                e[0] ||
                  (e[0] = s(
                    "div",
                    null,
                    [
                      s("h1", { class: "page-title" }, "Tambah Jasa"),
                      s("p", { class: "text-muted-foreground mt-1" }, "Tambah jasa baru"),
                    ],
                    -1,
                  )),
              ]),
            ]),
            s("form", b, [
              e[3] ||
                (e[3] = m(
                  '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Nama Jasa <span class="text-red-500">*</span></label><input type="text" placeholder="Ocean Freight - FCL" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Satuan <span class="text-red-500">*</span></label><select class="input-field"><option value="">Pilih Satuan</option><option value="CONTAINER">Per Container</option><option value="KG">Per Kilogram</option><option value="CBM">Per CBM</option><option value="DOCUMENT">Per Document</option><option value="SHIPMENT">Per Shipment</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Harga <span class="text-red-500">*</span></label><input type="number" placeholder="0" class="input-field"></div></div><div class="space-y-2"><label class="text-sm font-medium">Deskripsi</label><textarea rows="3" placeholder="Deskripsi jasa (opsional)" class="input-field resize-none"></textarea></div>',
                  2,
                )),
              s("div", x, [
                a(
                  t,
                  { to: "/master/services", class: "btn-secondary" },
                  { default: o(() => [...(e[1] || (e[1] = [i("Batal", -1)]))]), _: 1 },
                ),
                s("button", g, [
                  a(l(r), { class: "w-4 h-4 mr-2" }),
                  e[2] || (e[2] = i(" Simpan ", -1)),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { B as default };
