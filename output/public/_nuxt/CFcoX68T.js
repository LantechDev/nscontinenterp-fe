import { _ as n } from "./DXifQ5ls.js";
import { S as d } from "./CfuPgfv3.js";
import { A as p } from "./CdOyNhW7.js";
import {
  e as c,
  R as r,
  Q as s,
  a2 as t,
  P as l,
  ah as m,
  V as o,
  K as i,
  _ as u,
} from "./D9q6143x.js";
const f = { class: "space-y-6 animate-fade-in p-6" },
  b = { class: "page-header" },
  v = { class: "flex items-center gap-4" },
  y = { class: "card-elevated p-6 space-y-6" },
  _ = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  x = { type: "submit", class: "btn-primary" },
  V = c({
    __name: "create",
    setup(g) {
      return (h, e) => {
        const a = n;
        return (
          u(),
          r("div", f, [
            s("div", b, [
              s("div", v, [
                t(
                  a,
                  {
                    to: "/operational/ebl",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: l(() => [t(i(p), { class: "w-5 h-5" })]), _: 1 },
                ),
                e[0] ||
                  (e[0] = s(
                    "div",
                    null,
                    [
                      s("h1", { class: "page-title" }, "Buat eBL"),
                      s(
                        "p",
                        { class: "text-muted-foreground mt-1" },
                        "Buat Electronic Bill of Lading",
                      ),
                    ],
                    -1,
                  )),
              ]),
            ]),
            s("form", y, [
              e[3] ||
                (e[3] = m(
                  '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">No. Job</label><select class="input-field"><option value="">Pilih job</option><option value="1">JOB-2024-001234</option><option value="2">JOB-2024-001233</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Shipper</label><input type="text" placeholder="Nama shipper" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Consignee</label><input type="text" placeholder="Nama consignee" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Notify Party</label><input type="text" placeholder="Notify party" class="input-field"></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Deskripsi Barang</label><textarea rows="3" placeholder="Description of goods..." class="input-field"></textarea></div><div class="space-y-2"><label class="text-sm font-medium">Gross Weight (KGS)</label><input type="number" placeholder="0" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Measurement (CBM)</label><input type="number" placeholder="0" class="input-field"></div></div>',
                  1,
                )),
              s("div", _, [
                t(
                  a,
                  { to: "/operational/ebl", class: "btn-secondary" },
                  { default: l(() => [...(e[1] || (e[1] = [o("Batal", -1)]))]), _: 1 },
                ),
                s("button", x, [
                  t(i(d), { class: "w-4 h-4 mr-2" }),
                  e[2] || (e[2] = o(" Simpan ", -1)),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { V as default };
