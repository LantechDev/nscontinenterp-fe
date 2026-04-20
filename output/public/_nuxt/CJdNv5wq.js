import { d as v, L as C, r as w } from "./D9q6143x.js";
function c() {
  return v().public.apiBase;
}
function n(a) {
  if (a && typeof a == "object" && "data" in a) {
    const e = a.data;
    if (e?.message) return e.message;
    if (e?.error) return e.error;
  }
  return a instanceof Error ? a.message : "An error occurred";
}
const u = {
  async fetchCompanies(a) {
    try {
      return {
        success: !0,
        data:
          (await $fetch(`${c()}/master/companies`, { params: a, credentials: "include" })) || [],
      };
    } catch (e) {
      return { success: !1, error: n(e), data: [] };
    }
  },
  async getCompanyById(a) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies/${a}`, { credentials: "include" }),
      };
    } catch (e) {
      return { success: !1, error: n(e) };
    }
  },
  async getCompanyDetails(a) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies/${a}/details`, { credentials: "include" }),
      };
    } catch (e) {
      return { success: !1, error: n(e) };
    }
  },
  async createCompany(a) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies`, {
          method: "POST",
          body: a,
          credentials: "include",
        }),
      };
    } catch (e) {
      return { success: !1, error: n(e) };
    }
  },
  async updateCompany(a, e) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies/${a}`, {
          method: "PUT",
          body: e,
          credentials: "include",
        }),
      };
    } catch (s) {
      return { success: !1, error: n(s) };
    }
  },
  async deleteCompany(a) {
    try {
      return (
        await $fetch(`${c()}/master/companies/${a}`, { method: "DELETE", credentials: "include" }),
        { success: !0 }
      );
    } catch (e) {
      return { success: !1, error: n(e) };
    }
  },
  async createAddress(a, e) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies/${a}/addresses`, {
          method: "POST",
          body: e,
          credentials: "include",
        }),
      };
    } catch (s) {
      return { success: !1, error: n(s) };
    }
  },
  async updateAddress(a, e, s) {
    try {
      return {
        success: !0,
        data: await $fetch(`${c()}/master/companies/${a}/addresses/${e}`, {
          method: "PUT",
          body: s,
          credentials: "include",
        }),
      };
    } catch (i) {
      return { success: !1, error: n(i) };
    }
  },
  async deleteAddress(a, e) {
    try {
      return (
        await $fetch(`${c()}/master/companies/${a}/addresses/${e}`, {
          method: "DELETE",
          credentials: "include",
        }),
        { success: !0 }
      );
    } catch (s) {
      return { success: !1, error: n(s) };
    }
  },
};
function A() {
  const a = C("companies", () => []),
    e = w(!1);
  async function s(r) {
    e.value = !0;
    try {
      const t = await u.fetchCompanies(r);
      return (t.success && t.data && (a.value = t.data), t);
    } finally {
      e.value = !1;
    }
  }
  async function i(r) {
    e.value = !0;
    try {
      return await u.getCompanyById(r);
    } finally {
      e.value = !1;
    }
  }
  async function d(r) {
    e.value = !0;
    try {
      return await u.getCompanyDetails(r);
    } finally {
      e.value = !1;
    }
  }
  async function y(r) {
    e.value = !0;
    try {
      const t = await u.createCompany(r);
      return (t.success && t.data && (a.value = [t.data, ...a.value]), t);
    } finally {
      e.value = !1;
    }
  }
  async function f(r, t) {
    e.value = !0;
    try {
      const o = await u.updateCompany(r, t);
      return (
        o.success &&
          o.data &&
          (a.value = a.value.map((l) => (l.id === r ? { ...l, ...o.data } : l))),
        o
      );
    } finally {
      e.value = !1;
    }
  }
  async function m(r) {
    e.value = !0;
    try {
      const t = await u.deleteCompany(r);
      return (t.success && (a.value = a.value.filter((o) => o.id !== r)), t);
    } finally {
      e.value = !1;
    }
  }
  async function p(r, t) {
    e.value = !0;
    try {
      return await u.createAddress(r, t);
    } finally {
      e.value = !1;
    }
  }
  async function h(r, t, o) {
    e.value = !0;
    try {
      return await u.updateAddress(r, t, o);
    } finally {
      e.value = !1;
    }
  }
  async function $(r, t) {
    e.value = !0;
    try {
      return await u.deleteAddress(r, t);
    } finally {
      e.value = !1;
    }
  }
  return {
    companies: a,
    isLoading: e,
    fetchCompanies: s,
    getCompanyById: i,
    getCompanyDetails: d,
    createCompany: y,
    updateCompany: f,
    deleteCompany: m,
    createAddress: p,
    updateAddress: h,
    deleteAddress: $,
  };
}
export { A as u };
