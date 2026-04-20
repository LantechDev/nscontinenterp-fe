import { r as d, d as v } from "./D9q6143x.js";
function t(r) {
  if (r && typeof r == "object" && "data" in r) {
    const e = r.data;
    if (e?.message) return e.message;
    if (e?.error) return e.error;
  }
  return r instanceof Error ? r.message : "An error occurred";
}
function y() {
  const r = v(),
    e = d(!1);
  async function s(c) {
    try {
      return (
        await $fetch(`${r.public.apiBase}/finance/invoice/${c}`, {
          method: "DELETE",
          credentials: "include",
        }),
        { success: !0 }
      );
    } catch (a) {
      return { success: !1, error: t(a) };
    }
  }
  async function i(c) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${r.public.apiBase}/finance/invoice`, {
          query: c ? { jobId: c } : void 0,
          credentials: "include",
        }),
      };
    } catch (a) {
      return (console.error("[Invoices] Failed to fetch:", a), { success: !1, error: t(a) });
    } finally {
      e.value = !1;
    }
  }
  async function u(c) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${r.public.apiBase}/finance/invoice/${c}`, { credentials: "include" }),
      };
    } catch (a) {
      return { success: !1, error: t(a) };
    } finally {
      e.value = !1;
    }
  }
  async function o(c) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${r.public.apiBase}/finance/invoice`, {
          method: "POST",
          body: c,
          credentials: "include",
        }),
      };
    } catch (a) {
      return { success: !1, error: t(a) };
    } finally {
      e.value = !1;
    }
  }
  async function l(c, a) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${r.public.apiBase}/finance/invoice/${c}`, {
          method: "PATCH",
          body: a,
          credentials: "include",
        }),
      };
    } catch (n) {
      return { success: !1, error: t(n) };
    } finally {
      e.value = !1;
    }
  }
  async function f(c) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${r.public.apiBase}/finance/invoice/${c}/void`, {
          method: "POST",
          credentials: "include",
        }),
      };
    } catch (a) {
      return { success: !1, error: t(a) };
    } finally {
      e.value = !1;
    }
  }
  return {
    isLoading: e,
    fetchInvoices: i,
    fetchInvoiceById: u,
    createInvoice: o,
    updateInvoice: l,
    deleteInvoice: s,
    voidInvoice: f,
  };
}
export { y as u };
