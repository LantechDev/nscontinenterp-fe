import { r as i, d as p, M as r } from "./D9q6143x.js";
const g = () => {
  const c = p(),
    t = i(!1),
    n = i(!1);
  async function o() {
    t.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${c.public.apiBase}/finance/payment`, { credentials: "include" }),
      };
    } catch (e) {
      return { success: !1, error: e.message || "Failed to fetch payments" };
    } finally {
      t.value = !1;
    }
  }
  async function l(e) {
    t.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${c.public.apiBase}/finance/payment/${e}`, { credentials: "include" }),
      };
    } catch (a) {
      return { success: !1, error: a.message || "Failed to fetch payment details" };
    } finally {
      t.value = !1;
    }
  }
  async function d(e) {
    n.value = !0;
    try {
      const a = await $fetch(`${c.public.apiBase}/finance/payment`, {
        method: "POST",
        body: e,
        credentials: "include",
      });
      return (r.success("Payment recorded successfully"), { success: !0, data: a });
    } catch (a) {
      const s = a.message || "Failed to record payment";
      return (r.error(s), { success: !1, error: s });
    } finally {
      n.value = !1;
    }
  }
  async function y(e = {}) {
    t.value = !0;
    try {
      const a = {};
      return (
        e.companyId && (a.companyId = e.companyId),
        e.month && (a.month = e.month),
        e.year && (a.year = e.year),
        e.page && (a.page = e.page),
        e.limit && (a.limit = e.limit),
        {
          success: !0,
          data: await $fetch(`${c.public.apiBase}/finance/report/outstanding`, {
            query: a,
            credentials: "include",
          }),
        }
      );
    } catch (a) {
      return { success: !1, error: a.message || "Failed to fetch outstanding report" };
    } finally {
      t.value = !1;
    }
  }
  async function f(e) {
    t.value = !0;
    try {
      return (
        await $fetch(`${c.public.apiBase}/finance/payment/${e}`, {
          method: "DELETE",
          credentials: "include",
        }),
        r.success("Payment deleted successfully"),
        { success: !0 }
      );
    } catch (a) {
      const s = a.message || "Failed to delete payment";
      return (r.error(s), { success: !1, error: s });
    } finally {
      t.value = !1;
    }
  }
  async function m(e) {
    t.value = !0;
    try {
      return (
        await $fetch(`${c.public.apiBase}/finance/payment/${e}/void`, {
          method: "POST",
          credentials: "include",
        }),
        r.success("Payment voided successfully"),
        { success: !0 }
      );
    } catch (a) {
      const s = a,
        u = s.data?.message || s.message || "Failed to void payment";
      return (r.error(u), { success: !1, error: u });
    } finally {
      t.value = !1;
    }
  }
  return {
    isLoading: t,
    isSaving: n,
    fetchPayments: o,
    fetchPaymentById: l,
    createPayment: d,
    fetchOutstandingReport: y,
    deletePayment: f,
    voidPayment: m,
  };
};
export { g as u };
