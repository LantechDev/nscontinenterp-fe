import { r as g, L as n, d as b } from "./D9q6143x.js";
function u(s) {
  if (s && typeof s == "object" && "data" in s) {
    const a = s.data;
    if (a?.message) return a.message;
    if (a?.error) return a.error;
  }
  return s instanceof Error ? s.message : "An error occurred";
}
function w() {
  const s = b(),
    a = g(!1),
    t = n("services-list", () => []),
    i = n("services-current", () => null),
    l = n("service-categories-list", () => []),
    o = n("service-units-list", () => []);
  async function v(e, r) {
    a.value = !0;
    try {
      const c = await $fetch(`${s.public.apiBase}/master/services`, {
        params: { search: e, categoryId: r },
        credentials: "include",
      });
      return ((t.value = c || []), { success: !0, data: t.value });
    } catch (c) {
      return { success: !1, error: u(c) };
    } finally {
      a.value = !1;
    }
  }
  async function d() {
    try {
      const e = await $fetch(`${s.public.apiBase}/master/service-categories`, {
        credentials: "include",
      });
      return ((l.value = e || []), { success: !0, data: l.value });
    } catch (e) {
      return { success: !1, error: u(e) };
    }
  }
  async function y() {
    try {
      const e = await $fetch(`${s.public.apiBase}/master/service-units`, {
        credentials: "include",
      });
      return ((o.value = e || []), { success: !0, data: o.value });
    } catch (e) {
      return { success: !1, error: u(e) };
    }
  }
  async function h(e) {
    a.value = !0;
    try {
      const r = await $fetch(`${s.public.apiBase}/master/services/${e}`, {
        credentials: "include",
      });
      return ((i.value = r), { success: !0, data: r });
    } catch (r) {
      return { success: !1, error: u(r) };
    } finally {
      a.value = !1;
    }
  }
  async function p(e) {
    a.value = !0;
    try {
      const r = await $fetch(`${s.public.apiBase}/master/services`, {
        method: "POST",
        body: e,
        credentials: "include",
      });
      return ((t.value = [...t.value, r]), { success: !0, data: r });
    } catch (r) {
      return { success: !1, error: u(r) };
    } finally {
      a.value = !1;
    }
  }
  async function m(e, r) {
    a.value = !0;
    try {
      const c = await $fetch(`${s.public.apiBase}/master/services/${e}`, {
        method: "PUT",
        body: r,
        credentials: "include",
      });
      return (
        i.value?.id === e && (i.value = c),
        (t.value = t.value.map((f) => (f.id === e ? { ...f, ...c } : f))),
        { success: !0, data: c }
      );
    } catch (c) {
      return { success: !1, error: u(c) };
    } finally {
      a.value = !1;
    }
  }
  async function $(e) {
    a.value = !0;
    try {
      return (
        await $fetch(`${s.public.apiBase}/master/services/${e}`, {
          method: "DELETE",
          credentials: "include",
        }),
        (t.value = t.value.filter((r) => r.id !== e)),
        i.value?.id === e && (i.value = null),
        { success: !0 }
      );
    } catch (r) {
      return { success: !1, error: u(r) };
    } finally {
      a.value = !1;
    }
  }
  return {
    services: t,
    currentService: i,
    categories: l,
    units: o,
    isLoading: a,
    fetchServices: v,
    fetchCategories: d,
    fetchUnits: y,
    getService: h,
    createService: p,
    updateService: m,
    deleteService: $,
  };
}
export { w as u };
