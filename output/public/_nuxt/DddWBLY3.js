import { r as f, d } from "./D9q6143x.js";
function y() {
  const r = d(),
    a = f(!1);
  async function i(t) {
    a.value = !0;
    try {
      const e = new URLSearchParams();
      return (
        t &&
          Object.entries(t).forEach(([n, c]) => {
            c != null && c !== "" && e.append(n, String(c));
          }),
        await $fetch(`${r.public.apiBase}/finance/tax?${e.toString()}`, { credentials: "include" })
      );
    } catch (e) {
      throw (console.error("[Tax] Failed to fetch:", e), e);
    } finally {
      a.value = !1;
    }
  }
  async function o(t) {
    a.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/tax/${t}`, { credentials: "include" });
    } catch (e) {
      throw (console.error("[Tax] Failed to fetch by ID:", e), e);
    } finally {
      a.value = !1;
    }
  }
  async function l(t) {
    a.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/tax`, {
        method: "POST",
        body: t,
        credentials: "include",
      });
    } catch (e) {
      throw (console.error("[Tax] Failed to create:", e), e);
    } finally {
      a.value = !1;
    }
  }
  async function u(t, e) {
    a.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/tax/${t}`, {
        method: "PATCH",
        body: e,
        credentials: "include",
      });
    } catch (n) {
      throw (console.error("[Tax] Failed to update:", n), n);
    } finally {
      a.value = !1;
    }
  }
  async function s(t) {
    a.value = !0;
    try {
      return (
        await $fetch(`${r.public.apiBase}/finance/tax/${t}`, {
          method: "DELETE",
          credentials: "include",
        }),
        { success: !0 }
      );
    } catch (e) {
      throw (console.error("[Tax] Failed to delete:", e), e);
    } finally {
      a.value = !1;
    }
  }
  return { isLoading: a, fetchTaxes: i, fetchTaxById: o, createTax: l, updateTax: u, deleteTax: s };
}
export { y as u };
