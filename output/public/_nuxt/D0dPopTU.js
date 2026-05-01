import { r as f, d as p } from "./D9q6143x.js";
function h() {
  const r = p(),
    n = f(!1);
  async function i(a) {
    n.value = !0;
    try {
      const e = new URLSearchParams();
      return (
        a &&
          Object.entries(a).forEach(([t, c]) => {
            c != null && c !== "" && e.append(t, String(c));
          }),
        await $fetch(`${r.public.apiBase}/finance/expense?${e.toString()}`, {
          credentials: "include",
        })
      );
    } catch (e) {
      throw (console.error("[Expense] Failed to fetch:", e), e);
    } finally {
      n.value = !1;
    }
  }
  async function s(a) {
    n.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/expense/${a}`, { credentials: "include" });
    } catch (e) {
      throw (console.error("[Expense] Failed to fetch by ID:", e), e);
    } finally {
      n.value = !1;
    }
  }
  async function o(a) {
    n.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/expense`, {
        method: "POST",
        body: a,
        credentials: "include",
      });
    } catch (e) {
      throw (console.error("[Expense] Failed to create:", e), e);
    } finally {
      n.value = !1;
    }
  }
  async function l(a, e) {
    n.value = !0;
    try {
      return await $fetch(`${r.public.apiBase}/finance/expense/${a}`, {
        method: "PATCH",
        body: e,
        credentials: "include",
      });
    } catch (t) {
      throw (console.error("[Expense] Failed to update:", t), t);
    } finally {
      n.value = !1;
    }
  }
  async function u(a) {
    n.value = !0;
    try {
      return (
        await $fetch(`${r.public.apiBase}/finance/expense/${a}`, {
          method: "DELETE",
          credentials: "include",
        }),
        { success: !0 }
      );
    } catch (e) {
      throw (console.error("[Expense] Failed to delete:", e), e);
    } finally {
      n.value = !1;
    }
  }
  return {
    isLoading: n,
    fetchExpenses: i,
    fetchExpenseById: s,
    createExpense: o,
    updateExpense: l,
    deleteExpense: u,
  };
}
export { h as u };
