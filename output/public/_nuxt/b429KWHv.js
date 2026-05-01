import { u as g } from "./CJdNv5wq.js";
import { r as i, q as A } from "./D9q6143x.js";
function x(s) {
  const { createAddress: f, updateAddress: h, deleteAddress: M } = g(),
    v = i(null),
    b = (e) => {
      v.value = v.value === e ? null : e;
    },
    a = () => {
      v.value = null;
    },
    t = i("view"),
    d = i(null),
    c = i(!1),
    l = A(() => s.value?.addresses || []),
    p = A(() =>
      !d.value || !l.value.length ? null : l.value.find((e) => e.id === d.value) || null,
    ),
    w = () => {
      ((t.value = "add"), (d.value = null), a());
    },
    C = (e) => {
      ((t.value = "edit"), (d.value = e.replace("tab-", "")), a());
    },
    o = () => {
      ((t.value = "view"), (d.value = null));
    };
  return {
    activeAddressMenu: v,
    showAddressMenu: b,
    closeAddressMenu: a,
    addressMode: t,
    editingAddressId: d,
    isSaving: c,
    companyAddresses: l,
    editingAddress: p,
    openAddAddressMode: w,
    openEditAddressMode: C,
    closeAddressMode: o,
    handleAddressSave: async (e) => {
      if (s.value) {
        c.value = !0;
        try {
          if (t.value === "add") {
            const { success: n, data: u } = await f(s.value.id, {
              label: e.label,
              fullAddress: e.fullAddress,
              street: e.street,
              city: e.city,
              state: e.state,
              postalCode: e.postalCode,
              country: e.country || "Indonesia",
              eori: e.eori,
              isDefault: l.value.length === 0,
            });
            n && u && (s.value = { ...s.value, addresses: [...l.value, u] });
          } else if (t.value === "edit" && d.value) {
            const { success: n, data: u } = await h(s.value.id, d.value, {
              label: e.label,
              fullAddress: e.fullAddress,
              street: e.street,
              city: e.city,
              state: e.state,
              postalCode: e.postalCode,
              country: e.country,
              eori: e.eori,
            });
            n &&
              u &&
              (s.value = {
                ...s.value,
                addresses: l.value.map((r) => (r.id === d.value ? { ...r, ...u } : r)),
              });
          }
          o();
        } finally {
          c.value = !1;
        }
      }
    },
    handleDeleteAddress: async (e) => {
      if (!s.value) return;
      const n = e.replace("tab-", ""),
        { success: u } = await M(s.value.id, n);
      (u && (s.value = { ...s.value, addresses: l.value.filter((r) => r.id !== n) }), a());
    },
  };
}
export { x as useCompanyAddressForm };
