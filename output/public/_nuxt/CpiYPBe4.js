import {
  C as A,
  D as b,
  q as C,
  E as P,
  F as y,
  G as L,
  s as f,
  H as v,
  o as O,
  I as x,
  J as R,
  K as F,
} from "./D9q6143x.js";
const D = b ? window : void 0;
function E(o) {
  var l;
  const u = y(o);
  return (l = u?.$el) !== null && l !== void 0 ? l : u;
}
function M(...o) {
  const l = (n, t, s, c) => (n.addEventListener(t, s, c), () => n.removeEventListener(t, s, c)),
    u = C(() => {
      const n = P(y(o[0])).filter((t) => t != null);
      return n.every((t) => typeof t != "string") ? n : void 0;
    });
  return L(
    () => {
      var n, t;
      return [
        (n = (t = u.value) === null || t === void 0 ? void 0 : t.map((s) => E(s))) !== null &&
        n !== void 0
          ? n
          : [D].filter((s) => s != null),
        P(y(u.value ? o[1] : o[0])),
        P(F(u.value ? o[2] : o[1])),
        y(u.value ? o[3] : o[2]),
      ];
    },
    ([n, t, s, c], m, d) => {
      if (!n?.length || !t?.length || !s?.length) return;
      const h = R(c) ? { ...c } : c,
        k = n.flatMap((p) => t.flatMap((w) => s.map((a) => l(p, w, a, h))));
      d(() => {
        k.forEach((p) => p());
      });
    },
    { flush: "post" },
  );
}
function B(o, l, u = {}) {
  const {
    window: n = D,
    ignore: t = [],
    capture: s = !0,
    detectIframe: c = !1,
    controls: m = !1,
  } = u;
  if (!n) return m ? { stop: A, cancel: A, trigger: A } : A;
  let d = !0;
  const h = (e) =>
    y(t).some((i) => {
      if (typeof i == "string")
        return Array.from(n.document.querySelectorAll(i)).some(
          (r) => r === e.target || e.composedPath().includes(r),
        );
      {
        const r = E(i);
        return r && (e.target === r || e.composedPath().includes(r));
      }
    });
  function k(e) {
    const i = y(e);
    return i && i.$.subTree.shapeFlag === 16;
  }
  function p(e, i) {
    const r = y(e),
      $ = r.$.subTree && r.$.subTree.children;
    return $ == null || !Array.isArray($)
      ? !1
      : $.some((I) => I.el === i.target || i.composedPath().includes(I.el));
  }
  const w = (e) => {
    const i = E(o);
    if (
      e.target != null &&
      !(!(i instanceof Element) && k(o) && p(o, e)) &&
      !(!i || i === e.target || e.composedPath().includes(i))
    ) {
      if (("detail" in e && e.detail === 0 && (d = !h(e)), !d)) {
        d = !0;
        return;
      }
      l(e);
    }
  };
  let a = !1;
  const T = [
      M(
        n,
        "click",
        (e) => {
          a ||
            ((a = !0),
            setTimeout(() => {
              a = !1;
            }, 0),
            w(e));
        },
        { passive: !0, capture: s },
      ),
      M(
        n,
        "pointerdown",
        (e) => {
          const i = E(o);
          d = !h(e) && !!(i && !e.composedPath().includes(i));
        },
        { passive: !0 },
      ),
      c &&
        M(
          n,
          "blur",
          (e) => {
            setTimeout(() => {
              var i;
              const r = E(o);
              ((i = n.document.activeElement) === null || i === void 0 ? void 0 : i.tagName) ===
                "IFRAME" &&
                !r?.contains(n.document.activeElement) &&
                l(e);
            }, 0);
          },
          { passive: !0 },
        ),
    ].filter(Boolean),
    g = () => T.forEach((e) => e());
  return m
    ? {
        stop: g,
        cancel: () => {
          d = !1;
        },
        trigger: (e) => {
          ((d = !0), w(e), (d = !1));
        },
      }
    : g;
}
function N() {
  const o = f(!1),
    l = x();
  return (
    l &&
      O(() => {
        o.value = !0;
      }, l),
    o
  );
}
function S(o) {
  const l = N();
  return C(() => (l.value, !!o()));
}
function j(o = {}) {
  const { window: l = D } = o,
    u = l?.navigator,
    n = S(() => u && "connection" in u),
    t = f(!0),
    s = f(!1),
    c = f(void 0),
    m = f(void 0),
    d = f(void 0),
    h = f(void 0),
    k = f(void 0),
    p = f(void 0),
    w = f("unknown"),
    a = n.value && u.connection;
  function T() {
    u &&
      ((t.value = u.onLine),
      (c.value = t.value ? void 0 : Date.now()),
      (m.value = t.value ? Date.now() : void 0),
      a &&
        ((d.value = a.downlink),
        (h.value = a.downlinkMax),
        (p.value = a.effectiveType),
        (k.value = a.rtt),
        (s.value = a.saveData),
        (w.value = a.type)));
  }
  const g = { passive: !0 };
  return (
    l &&
      (M(
        l,
        "offline",
        () => {
          ((t.value = !1), (c.value = Date.now()));
        },
        g,
      ),
      M(
        l,
        "online",
        () => {
          ((t.value = !0), (m.value = Date.now()));
        },
        g,
      )),
    a && M(a, "change", T, g),
    T(),
    {
      isSupported: n,
      isOnline: v(t),
      saveData: v(s),
      offlineAt: v(c),
      onlineAt: v(m),
      downlink: v(d),
      downlinkMax: v(h),
      effectiveType: v(p),
      rtt: v(k),
      type: v(w),
    }
  );
}
export { B as o, j as u };
