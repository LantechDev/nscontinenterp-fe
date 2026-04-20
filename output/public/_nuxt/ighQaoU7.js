import { r as I, L as o, d as J } from "./D9q6143x.js";
const T = (s) =>
    !s || s.length === 0
      ? ""
      : s
          .map((e, l) =>
            typeof e == "number"
              ? (e + 1).toString()
              : e === "containers"
                ? "Container #"
                : e === "items"
                  ? "Item #"
                  : e,
          )
          .join("")
          .replace(/#(\d+)/g, "#$1 ")
          .replace(/\.([^0-9])/g, " $1")
          .trim(),
  f = (s) =>
    s
      .map((e) => {
        const l = T(e.path);
        return `${l ? l + ": " : ""}${e.message}`;
      })
      .join(" | ");
function P(s) {
  if (s && typeof s == "object" && "data" in s) {
    const e = s.data;
    if (e?.error?.issues && Array.isArray(e.error.issues)) return f(e.error.issues);
    if (typeof e?.message == "string" && (e.message.startsWith("[") || e.message.startsWith("{")))
      try {
        const l = JSON.parse(e.message),
          n = Array.isArray(l) ? l : l.issues || l.error?.issues || [];
        if (Array.isArray(n) && n.length > 0) return f(n);
      } catch {}
    if (e?.message) return e.message;
    if (e?.error) return typeof e.error == "string" ? e.error : JSON.stringify(e.error);
  }
  return s instanceof Error ? s.message : "An error occurred";
}
function u(s) {
  return { success: !1, error: P(s) };
}
function A() {
  const s = J(),
    e = I(!1),
    l = o("jobs-list", () => []),
    n = o("jobs-current", () => null);
  async function d() {
    e.value = !0;
    try {
      const t = await $fetch(`${s.public.apiBase}/operational/jobs`, { credentials: "include" });
      return ((l.value = t || []), { success: !0, data: l.value });
    } catch (t) {
      return u(t);
    } finally {
      e.value = !1;
    }
  }
  async function b(t) {
    e.value = !0;
    try {
      const a = await $fetch(`${s.public.apiBase}/operational/jobs`, {
        method: "POST",
        body: t,
        credentials: "include",
      });
      return ((l.value = [...l.value, a]), { success: !0, data: a });
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function y(t) {
    e.value = !0;
    try {
      const a = await $fetch(`${s.public.apiBase}/operational/jobs/${t}`, {
        credentials: "include",
      });
      return ((n.value = a), { success: !0, data: a });
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function p(t, a) {
    e.value = !0;
    try {
      const r = await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}`, {
        method: "PUT",
        body: a,
        credentials: "include",
      });
      if (n.value && n.value.billsOfLading) {
        const i = n.value.billsOfLading.findIndex((c) => c.id === t);
        i !== -1 && (n.value.billsOfLading[i] = r);
      }
      return { success: !0, data: r };
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  async function v(t, a) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}`, {
          method: "PATCH",
          body: a,
          credentials: "include",
        }),
      };
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  async function h(t) {
    e.value = !0;
    try {
      const a = await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}/finalize`, {
        method: "POST",
        credentials: "include",
      });
      if (n.value && n.value.billsOfLading) {
        const r = n.value.billsOfLading.findIndex((i) => i.id === t);
        r !== -1 && (n.value.billsOfLading[r] = a);
      }
      return { success: !0, data: a };
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function $(t) {
    e.value = !0;
    try {
      const a = await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}/request-finalize`, {
        method: "POST",
        credentials: "include",
      });
      if (n.value && n.value.billsOfLading) {
        const r = n.value.billsOfLading.findIndex((i) => i.id === t);
        r !== -1 && (n.value.billsOfLading[r] = a);
      }
      return { success: !0, data: a };
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function g(t) {
    e.value = !0;
    try {
      const a = await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}/unfinalize`, {
        method: "POST",
        credentials: "include",
      });
      if (n.value && n.value.billsOfLading) {
        const r = n.value.billsOfLading.findIndex((i) => i.id === t);
        r !== -1 && (n.value.billsOfLading[r] = a);
      }
      return { success: !0, data: a };
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function m(t) {
    e.value = !0;
    try {
      return (
        await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}`, {
          method: "DELETE",
          credentials: "include",
        }),
        n.value &&
          n.value.billsOfLading &&
          (n.value.billsOfLading = n.value.billsOfLading.filter((a) => a.id !== t)),
        { success: !0 }
      );
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function O(t, a) {
    e.value = !0;
    try {
      const r = await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}/reject`, {
        method: "POST",
        credentials: "include",
        body: { reason: a },
      });
      if (n.value && n.value.billsOfLading) {
        const i = n.value.billsOfLading.findIndex((c) => c.id === t);
        i !== -1 && (n.value.billsOfLading[i] = r);
      }
      return { success: !0, data: r };
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  async function j(t, a) {
    e.value = !0;
    try {
      const r = await $fetch(`${s.public.apiBase}/operational/jobs/${t}`, {
          method: "PUT",
          body: a,
          credentials: "include",
        }),
        i = l.value.findIndex((c) => c.id === t);
      return (i !== -1 && (l.value[i] = r), (n.value = r), { success: !0, data: r });
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  async function B(t) {
    e.value = !0;
    try {
      return {
        success: !0,
        data: await $fetch(`${s.public.apiBase}/operational/jobs/bl/${t}/render`, {
          credentials: "include",
        }),
      };
    } catch (a) {
      return u(a);
    } finally {
      e.value = !1;
    }
  }
  async function L(t) {
    try {
      return {
        success: !0,
        data: await $fetch(`${s.public.apiBase}/operational/jobs/${t}/documents`, {
          credentials: "include",
        }),
      };
    } catch (a) {
      return u(a);
    }
  }
  async function w(t, a) {
    e.value = !0;
    try {
      const r = new FormData();
      return (
        r.append("file", a),
        {
          success: !0,
          data: await $fetch(`${s.public.apiBase}/operational/jobs/${t}/documents`, {
            method: "POST",
            body: r,
            credentials: "include",
          }),
        }
      );
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  async function x(t, a) {
    e.value = !0;
    try {
      return (
        await $fetch(`${s.public.apiBase}/operational/jobs/${t}/documents/${a}`, {
          method: "DELETE",
          credentials: "include",
        }),
        { success: !0 }
      );
    } catch (r) {
      return u(r);
    } finally {
      e.value = !1;
    }
  }
  return {
    jobs: l,
    currentJob: n,
    isLoading: e,
    fetchJobs: d,
    createJob: b,
    updateJob: j,
    getJob: y,
    updateBl: p,
    updateBlDraft: v,
    deleteBl: m,
    getBlRender: B,
    finalizeBl: h,
    requestFinalizeBl: $,
    unfinalizeBl: g,
    rejectBl: O,
    getJobDocuments: L,
    uploadJobDocument: w,
    deleteJobDocument: x,
  };
}
export { A as u };
