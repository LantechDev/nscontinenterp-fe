import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderList,
  ssrRenderClass,
} from "vue/server-renderer";
import { Download, TrendingUp, TrendingDown } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profit-loss",
  __ssrInlineRender: true,
  setup(__props) {
    const summary = {
      totalRevenue: "Rp 805.000.000",
      totalCost: "Rp 542.000.000",
      grossProfit: "Rp 263.000.000",
      profitMargin: "32.7%",
    };
    const categories = [
      { name: "Pendapatan Jasa Pengiriman", amount: "Rp 650.000.000", type: "income" },
      { name: "Pendapatan Jasa Customs", amount: "Rp 120.000.000", type: "income" },
      { name: "Pendapatan Lainnya", amount: "Rp 35.000.000", type: "income" },
      { name: "Biaya Operasional", amount: "Rp 380.000.000", type: "expense" },
      { name: "Biaya Overhead", amount: "Rp 95.000.000", type: "expense" },
      { name: "Biaya Lainnya", amount: "Rp 67.000.000", type: "expense" },
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="page-header"><div><h1 class="page-title">Laporan Laba Rugi</h1><p class="text-muted-foreground mt-1">Periode: Januari 2025</p></div><button class="btn-outline">`,
      );
      _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` Export PDF </button></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Pendapatan</p><p class="text-2xl font-bold text-success">${ssrInterpolate(summary.totalRevenue)}</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Biaya</p><p class="text-2xl font-bold text-destructive">${ssrInterpolate(summary.totalCost)}</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Laba Kotor</p><p class="text-2xl font-bold text-primary">${ssrInterpolate(summary.grossProfit)}</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Margin Laba</p><p class="text-2xl font-bold text-accent">${ssrInterpolate(summary.profitMargin)}</p></div></div><div class="card-elevated overflow-hidden"><table class="data-table"><thead><tr><th>Kategori</th><th class="text-right">Jumlah</th></tr></thead><tbody><!--[-->`,
      );
      ssrRenderList(categories, (category) => {
        _push(`<tr><td><div class="flex items-center gap-2">`);
        if (category.type === "income") {
          _push(
            ssrRenderComponent(unref(TrendingUp), { class: "w-4 h-4 text-success" }, null, _parent),
          );
        } else {
          _push(
            ssrRenderComponent(
              unref(TrendingDown),
              { class: "w-4 h-4 text-destructive" },
              null,
              _parent,
            ),
          );
        }
        _push(
          ` ${ssrInterpolate(category.name)}</div></td><td class="${ssrRenderClass([
            "text-right font-medium",
            category.type === "income" ? "text-success" : "text-destructive",
          ])}">${ssrInterpolate(category.amount)}</td></tr>`,
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
    "pages/reports/profit-loss.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profit-loss-nBvsuKtO.mjs.map
