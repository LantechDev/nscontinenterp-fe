import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import { Download, ArrowDown, ArrowUp } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cashflow",
  __ssrInlineRender: true,
  setup(__props) {
    const cashflow = [
      {
        id: "1",
        date: "7 Jan 2025",
        description: "Pembayaran dari PT Maju Bersama",
        type: "in",
        amount: "Rp 25.500.000",
        balance: "Rp 125.500.000",
      },
      {
        id: "2",
        date: "6 Jan 2025",
        description: "Pembayaran ke CV Trucking Mandiri",
        type: "out",
        amount: "Rp 3.500.000",
        balance: "Rp 100.000.000",
      },
      {
        id: "3",
        date: "5 Jan 2025",
        description: "Pembayaran dari CV Sukses Makmur",
        type: "in",
        amount: "Rp 18.250.000",
        balance: "Rp 103.500.000",
      },
      {
        id: "4",
        date: "5 Jan 2025",
        description: "Pembayaran ke PT Pelayaran Nusantara",
        type: "out",
        amount: "Rp 12.500.000",
        balance: "Rp 85.250.000",
      },
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Laporan Arus Kas</h1><p class="text-muted-foreground mt-1">Periode: Januari 2025</p></div><button class="btn-outline">`,
      );
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Export PDF </button></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Saldo Awal</p><p class="text-2xl font-bold">Rp 72.250.000</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Masuk</p><p class="text-2xl font-bold text-success">Rp 69.250.000</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Keluar</p><p class="text-2xl font-bold text-destructive">Rp 16.000.000</p></div></div><div class="card-elevated overflow-hidden"><table class="data-table"><thead><tr><th>Tanggal</th><th>Deskripsi</th><th class="text-right">Masuk</th><th class="text-right">Keluar</th><th class="text-right">Saldo</th></tr></thead><tbody><!--[-->`,
      );
      ssrRenderList(cashflow, (item) => {
        _push(
          `<tr><td class="text-muted-foreground">${ssrInterpolate(item.date)}</td><td><div class="flex items-center gap-2">`,
        );
        if (item.type === "in") {
          _push(
            ssrRenderComponent(unref(ArrowDown), { class: "w-4 h-4 text-success" }, null, _parent),
          );
        } else {
          _push(
            ssrRenderComponent(
              unref(ArrowUp),
              { class: "w-4 h-4 text-destructive" },
              null,
              _parent,
            ),
          );
        }
        _push(
          ` ${ssrInterpolate(item.description)}</div></td><td class="text-right font-medium text-success">${ssrInterpolate(item.type === "in" ? item.amount : "-")}</td><td class="text-right font-medium text-destructive">${ssrInterpolate(item.type === "out" ? item.amount : "-")}</td><td class="text-right font-medium">${ssrInterpolate(item.balance)}</td></tr>`,
        );
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/reports/cashflow.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cashflow-CiJcCHwp.mjs.map
