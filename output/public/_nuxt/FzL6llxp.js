import { _ as a } from "./DXifQ5ls.js";
import {
  e as r,
  ab as m,
  R as l,
  Q as s,
  a2 as i,
  P as c,
  T as o,
  V as p,
  K as d,
  _ as u,
} from "./D9q6143x.js";
import { D as _ } from "./BgSnr_43.js";
import { F as f } from "./CJ5hAAEc.js";
import { A as g } from "./CdOyNhW7.js";
const x = { class: "space-y-6 animate-fade-in p-6" },
  v = { class: "page-header" },
  y = { class: "flex items-center gap-4" },
  h = { class: "page-title" },
  b = { class: "btn-primary" },
  D = { class: "card-elevated p-6" },
  P = { class: "flex items-center gap-4 mb-6 pb-6 border-b border-border" },
  w = { class: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center" },
  B = { class: "text-xl font-semibold" },
  S = { class: "text-muted-foreground" },
  T = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  L = { class: "space-y-1" },
  V = { class: "font-medium" },
  C = { class: "space-y-1" },
  N = { class: "font-medium" },
  O = { class: "space-y-1" },
  j = { class: "font-medium" },
  k = { class: "space-y-1" },
  M = { class: "font-medium" },
  E = { class: "space-y-1" },
  F = { class: "font-medium" },
  G = { class: "space-y-1" },
  J = { class: "font-medium" },
  W = { class: "space-y-1 md:col-span-2" },
  A = { class: "font-medium" },
  K = { class: "space-y-1" },
  R = { class: "font-medium" },
  Q = { class: "space-y-1" },
  q = { class: "font-medium" },
  z = { class: "space-y-1" },
  H = { class: "font-medium" },
  es = r({
    __name: "[id]",
    setup(I) {
      m().params.id;
      const e = {
        number: "EBL-2024-001",
        job: "JOB-2024-001234",
        shipper: "PT Maju Bersama",
        consignee: "Singapore Trading Co",
        notifyParty: "Same as consignee",
        vessel: "MV Pacific Star",
        voyage: "PS-2024-01",
        portOfLoading: "Jakarta",
        portOfDischarge: "Singapore",
        description: "Electronic goods - 20 cartons",
        grossWeight: "2,500 KGS",
        measurement: "15 CBM",
        issuedDate: "8 Jan 2025",
      };
      return (X, t) => {
        const n = a;
        return (
          u(),
          l("div", x, [
            s("div", v, [
              s("div", y, [
                i(
                  n,
                  {
                    to: "/operational/ebl",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: c(() => [i(d(g), { class: "w-5 h-5" })]), _: 1 },
                ),
                s("div", null, [
                  s("h1", h, o(e.number), 1),
                  t[0] ||
                    (t[0] = s("p", { class: "text-muted-foreground mt-1" }, "Detail eBL", -1)),
                ]),
              ]),
              s("button", b, [
                i(d(_), { class: "w-4 h-4 mr-2" }),
                t[1] || (t[1] = p(" Download PDF ", -1)),
              ]),
            ]),
            s("div", D, [
              s("div", P, [
                s("div", w, [i(d(f), { class: "w-7 h-7 text-primary" })]),
                s("div", null, [s("h2", B, o(e.number), 1), s("p", S, o(e.job), 1)]),
                t[2] || (t[2] = s("span", { class: "ml-auto badge-success" }, "Terbit", -1)),
              ]),
              s("div", T, [
                s("div", L, [
                  t[3] ||
                    (t[3] = s("p", { class: "text-sm text-muted-foreground" }, "Shipper", -1)),
                  s("p", V, o(e.shipper), 1),
                ]),
                s("div", C, [
                  t[4] ||
                    (t[4] = s("p", { class: "text-sm text-muted-foreground" }, "Consignee", -1)),
                  s("p", N, o(e.consignee), 1),
                ]),
                s("div", O, [
                  t[5] ||
                    (t[5] = s("p", { class: "text-sm text-muted-foreground" }, "Notify Party", -1)),
                  s("p", j, o(e.notifyParty), 1),
                ]),
                s("div", k, [
                  t[6] ||
                    (t[6] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Vessel/Voyage",
                      -1,
                    )),
                  s("p", M, o(e.vessel) + " / " + o(e.voyage), 1),
                ]),
                s("div", E, [
                  t[7] ||
                    (t[7] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Port of Loading",
                      -1,
                    )),
                  s("p", F, o(e.portOfLoading), 1),
                ]),
                s("div", G, [
                  t[8] ||
                    (t[8] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Port of Discharge",
                      -1,
                    )),
                  s("p", J, o(e.portOfDischarge), 1),
                ]),
                s("div", W, [
                  t[9] ||
                    (t[9] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Description of Goods",
                      -1,
                    )),
                  s("p", A, o(e.description), 1),
                ]),
                s("div", K, [
                  t[10] ||
                    (t[10] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Gross Weight",
                      -1,
                    )),
                  s("p", R, o(e.grossWeight), 1),
                ]),
                s("div", Q, [
                  t[11] ||
                    (t[11] = s("p", { class: "text-sm text-muted-foreground" }, "Measurement", -1)),
                  s("p", q, o(e.measurement), 1),
                ]),
                s("div", z, [
                  t[12] ||
                    (t[12] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Tanggal Terbit",
                      -1,
                    )),
                  s("p", H, o(e.issuedDate), 1),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { es as default };
