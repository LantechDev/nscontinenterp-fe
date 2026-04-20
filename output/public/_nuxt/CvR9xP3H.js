import { _ as n } from "./DXifQ5ls.js";
import { S as c } from "./CfuPgfv3.js";
import { A as d } from "./CdOyNhW7.js";
import {
  e as p,
  R as r,
  Q as t,
  a2 as s,
  P as l,
  ah as m,
  V as o,
  K as i,
  _ as u,
} from "./D9q6143x.js";
const v = { class: "space-y-6 animate-fade-in p-6" },
  f = { class: "page-header" },
  b = { class: "flex items-center gap-4" },
  _ = { class: "card-elevated p-6 space-y-6" },
  x = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  g = { type: "submit", class: "btn-primary" },
  V = p({
    __name: "create",
    setup(y) {
      return (h, e) => {
        const a = n;
        return (
          u(),
          r("div", v, [
            t("div", f, [
              t("div", b, [
                s(
                  a,
                  {
                    to: "/finance/invoice",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: l(() => [s(i(d), { class: "w-5 h-5" })]), _: 1 },
                ),
                e[0] ||
                  (e[0] = t(
                    "div",
                    null,
                    [
                      t("h1", { class: "page-title" }, "Buat Invoice"),
                      t("p", { class: "text-muted-foreground mt-1" }, "Buat tagihan ke customer"),
                    ],
                    -1,
                  )),
              ]),
            ]),
            t("form", _, [
              e[3] ||
                (e[3] = m(
                  '<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-sm font-medium">Customer</label><select class="input-field"><option value="">Pilih customer</option><option value="1">PT Maju Bersama</option><option value="2">CV Sukses Makmur</option></select></div><div class="space-y-2"><label class="text-sm font-medium">No. Job (Opsional)</label><select class="input-field"><option value="">Pilih job</option><option value="1">JOB-2024-001234</option></select></div><div class="space-y-2"><label class="text-sm font-medium">Tanggal Invoice</label><input type="date" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">Jatuh Tempo</label><input type="date" class="input-field"></div><div class="space-y-2 md:col-span-2"><label class="text-sm font-medium">Deskripsi</label><textarea rows="3" placeholder="Detail tagihan..." class="input-field"></textarea></div><div class="space-y-2"><label class="text-sm font-medium">Jumlah</label><input type="text" placeholder="Rp 0" class="input-field"></div><div class="space-y-2"><label class="text-sm font-medium">PPN</label><select class="input-field"><option value="0">Tanpa PPN</option><option value="1.1">PPN 1.1% (Freight)</option><option value="11">PPN 11%</option></select></div></div>',
                  1,
                )),
              t("div", x, [
                s(
                  a,
                  { to: "/finance/invoice", class: "btn-secondary" },
                  { default: l(() => [...(e[1] || (e[1] = [o("Batal", -1)]))]), _: 1 },
                ),
                t("button", g, [
                  s(i(c), { class: "w-4 h-4 mr-2" }),
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
