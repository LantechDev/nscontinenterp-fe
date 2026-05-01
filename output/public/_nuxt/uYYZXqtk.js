import { _ as fs } from "./DOOzgCLm.js";
import { _ as ls } from "./Doao-lii.js";
import { u as os } from "./CCv5WdYi.js";
import { u as cs } from "./CJdNv5wq.js";
import { f as hs } from "./DrxnuvjT.js";
import { C as Dn } from "./DKEGG4ny.js";
import {
  e as us,
  r as _t,
  N as xs,
  f as ds,
  q as Xt,
  o as ps,
  R as Cr,
  Q as fe,
  a2 as Xr,
  K as ce,
  O as Tt,
  Z as Rn,
  S as zt,
  a0 as E0,
  a1 as w0,
  aa as S0,
  T as cr,
  $ as vs,
  _ as qe,
} from "./D9q6143x.js";
import { C as ms } from "./Btb_jfTP.js";
import { F as gs } from "./CJ5hAAEc.js";
import { S as A0 } from "./DK0cRrZx.js";
import { _ as _s } from "./DlAUqK2U.js";
import "./DrUezNjA.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./CWUm5Boh.js";
import "./C0WRWJjF.js";
var en = {};
en.version = "0.18.5";
var ha = 1252,
  Ts = [874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1e4],
  ua = function (e) {
    Ts.indexOf(e) != -1 && (ha = e);
  };
function Es() {
  ua(1252);
}
var Dt = function (e) {
  ua(e);
};
function ws() {
  (Dt(1200), Es());
}
var Kt = function (t) {
    return String.fromCharCode(t);
  },
  F0 = function (t) {
    return String.fromCharCode(t);
  },
  rn,
  Lr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Rt(e) {
  for (var t = "", r = 0, n = 0, a = 0, i = 0, s = 0, f = 0, o = 0, l = 0; l < e.length; )
    ((r = e.charCodeAt(l++)),
      (i = r >> 2),
      (n = e.charCodeAt(l++)),
      (s = ((r & 3) << 4) | (n >> 4)),
      (a = e.charCodeAt(l++)),
      (f = ((n & 15) << 2) | (a >> 6)),
      (o = a & 63),
      isNaN(n) ? (f = o = 64) : isNaN(a) && (o = 64),
      (t += Lr.charAt(i) + Lr.charAt(s) + Lr.charAt(f) + Lr.charAt(o)));
  return t;
}
function Ir(e) {
  var t = "",
    r = 0,
    n = 0,
    a = 0,
    i = 0,
    s = 0,
    f = 0,
    o = 0;
  e = e.replace(/[^\w\+\/\=]/g, "");
  for (var l = 0; l < e.length; )
    ((i = Lr.indexOf(e.charAt(l++))),
      (s = Lr.indexOf(e.charAt(l++))),
      (r = (i << 2) | (s >> 4)),
      (t += String.fromCharCode(r)),
      (f = Lr.indexOf(e.charAt(l++))),
      (n = ((s & 15) << 4) | (f >> 2)),
      f !== 64 && (t += String.fromCharCode(n)),
      (o = Lr.indexOf(e.charAt(l++))),
      (a = ((f & 3) << 6) | o),
      o !== 64 && (t += String.fromCharCode(a)));
  return t;
}
var de = (function () {
    return (
      typeof Buffer < "u" &&
      typeof process < "u" &&
      typeof process.versions < "u" &&
      !!process.versions.node
    );
  })(),
  Nr = (function () {
    if (typeof Buffer < "u") {
      var e = !Buffer.from;
      if (!e)
        try {
          Buffer.from("foo", "utf8");
        } catch {
          e = !0;
        }
      return e
        ? function (t, r) {
            return r ? new Buffer(t, r) : new Buffer(t);
          }
        : Buffer.from.bind(Buffer);
    }
    return function () {};
  })();
function Yr(e) {
  return de
    ? Buffer.alloc
      ? Buffer.alloc(e)
      : new Buffer(e)
    : typeof Uint8Array < "u"
      ? new Uint8Array(e)
      : new Array(e);
}
function y0(e) {
  return de
    ? Buffer.allocUnsafe
      ? Buffer.allocUnsafe(e)
      : new Buffer(e)
    : typeof Uint8Array < "u"
      ? new Uint8Array(e)
      : new Array(e);
}
var mr = function (t) {
  return de
    ? Nr(t, "binary")
    : t.split("").map(function (r) {
        return r.charCodeAt(0) & 255;
      });
};
function vn(e) {
  if (typeof ArrayBuffer > "u") return mr(e);
  for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), n = 0; n != e.length; ++n)
    r[n] = e.charCodeAt(n) & 255;
  return t;
}
function Mt(e) {
  if (Array.isArray(e))
    return e
      .map(function (n) {
        return String.fromCharCode(n);
      })
      .join("");
  for (var t = [], r = 0; r < e.length; ++r) t[r] = String.fromCharCode(e[r]);
  return t.join("");
}
function Ss(e) {
  if (typeof Uint8Array > "u") throw new Error("Unsupported");
  return new Uint8Array(e);
}
var He = de
  ? function (e) {
      return Buffer.concat(
        e.map(function (t) {
          return Buffer.isBuffer(t) ? t : Nr(t);
        }),
      );
    }
  : function (e) {
      if (typeof Uint8Array < "u") {
        var t = 0,
          r = 0;
        for (t = 0; t < e.length; ++t) r += e[t].length;
        var n = new Uint8Array(r),
          a = 0;
        for (t = 0, r = 0; t < e.length; r += a, ++t)
          if (((a = e[t].length), e[t] instanceof Uint8Array)) n.set(e[t], r);
          else {
            if (typeof e[t] == "string") throw "wtf";
            n.set(new Uint8Array(e[t]), r);
          }
        return n;
      }
      return [].concat.apply(
        [],
        e.map(function (i) {
          return Array.isArray(i) ? i : [].slice.call(i);
        }),
      );
    };
function As(e) {
  for (var t = [], r = 0, n = e.length + 250, a = Yr(e.length + 255), i = 0; i < e.length; ++i) {
    var s = e.charCodeAt(i);
    if (s < 128) a[r++] = s;
    else if (s < 2048) ((a[r++] = 192 | ((s >> 6) & 31)), (a[r++] = 128 | (s & 63)));
    else if (s >= 55296 && s < 57344) {
      s = (s & 1023) + 64;
      var f = e.charCodeAt(++i) & 1023;
      ((a[r++] = 240 | ((s >> 8) & 7)),
        (a[r++] = 128 | ((s >> 2) & 63)),
        (a[r++] = 128 | ((f >> 6) & 15) | ((s & 3) << 4)),
        (a[r++] = 128 | (f & 63)));
    } else
      ((a[r++] = 224 | ((s >> 12) & 15)),
        (a[r++] = 128 | ((s >> 6) & 63)),
        (a[r++] = 128 | (s & 63)));
    r > n && (t.push(a.slice(0, r)), (r = 0), (a = Yr(65535)), (n = 65530));
  }
  return (t.push(a.slice(0, r)), He(t));
}
var St = /\u0000/g,
  Yt = /[\u0001-\u0006]/g;
function ft(e) {
  for (var t = "", r = e.length - 1; r >= 0; ) t += e.charAt(r--);
  return t;
}
function gr(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Ce("0", t - r.length) + r;
}
function Xn(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Ce(" ", t - r.length) + r;
}
function tn(e, t) {
  var r = "" + e;
  return r.length >= t ? r : r + Ce(" ", t - r.length);
}
function Fs(e, t) {
  var r = "" + Math.round(e);
  return r.length >= t ? r : Ce("0", t - r.length) + r;
}
function ys(e, t) {
  var r = "" + e;
  return r.length >= t ? r : Ce("0", t - r.length) + r;
}
var C0 = Math.pow(2, 32);
function tt(e, t) {
  if (e > C0 || e < -C0) return Fs(e, t);
  var r = Math.round(e);
  return ys(r, t);
}
function nn(e, t) {
  return (
    (t = t || 0),
    e.length >= 7 + t &&
      (e.charCodeAt(t) | 32) === 103 &&
      (e.charCodeAt(t + 1) | 32) === 101 &&
      (e.charCodeAt(t + 2) | 32) === 110 &&
      (e.charCodeAt(t + 3) | 32) === 101 &&
      (e.charCodeAt(t + 4) | 32) === 114 &&
      (e.charCodeAt(t + 5) | 32) === 97 &&
      (e.charCodeAt(t + 6) | 32) === 108
  );
}
var O0 = [
    ["Sun", "Sunday"],
    ["Mon", "Monday"],
    ["Tue", "Tuesday"],
    ["Wed", "Wednesday"],
    ["Thu", "Thursday"],
    ["Fri", "Friday"],
    ["Sat", "Saturday"],
  ],
  In = [
    ["J", "Jan", "January"],
    ["F", "Feb", "February"],
    ["M", "Mar", "March"],
    ["A", "Apr", "April"],
    ["M", "May", "May"],
    ["J", "Jun", "June"],
    ["J", "Jul", "July"],
    ["A", "Aug", "August"],
    ["S", "Sep", "September"],
    ["O", "Oct", "October"],
    ["N", "Nov", "November"],
    ["D", "Dec", "December"],
  ];
function Cs(e) {
  return (
    e || (e = {}),
    (e[0] = "General"),
    (e[1] = "0"),
    (e[2] = "0.00"),
    (e[3] = "#,##0"),
    (e[4] = "#,##0.00"),
    (e[9] = "0%"),
    (e[10] = "0.00%"),
    (e[11] = "0.00E+00"),
    (e[12] = "# ?/?"),
    (e[13] = "# ??/??"),
    (e[14] = "m/d/yy"),
    (e[15] = "d-mmm-yy"),
    (e[16] = "d-mmm"),
    (e[17] = "mmm-yy"),
    (e[18] = "h:mm AM/PM"),
    (e[19] = "h:mm:ss AM/PM"),
    (e[20] = "h:mm"),
    (e[21] = "h:mm:ss"),
    (e[22] = "m/d/yy h:mm"),
    (e[37] = "#,##0 ;(#,##0)"),
    (e[38] = "#,##0 ;[Red](#,##0)"),
    (e[39] = "#,##0.00;(#,##0.00)"),
    (e[40] = "#,##0.00;[Red](#,##0.00)"),
    (e[45] = "mm:ss"),
    (e[46] = "[h]:mm:ss"),
    (e[47] = "mmss.0"),
    (e[48] = "##0.0E+0"),
    (e[49] = "@"),
    (e[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "'),
    e
  );
}
var Oe = {
    0: "General",
    1: "0",
    2: "0.00",
    3: "#,##0",
    4: "#,##0.00",
    9: "0%",
    10: "0.00%",
    11: "0.00E+00",
    12: "# ?/?",
    13: "# ??/??",
    14: "m/d/yy",
    15: "d-mmm-yy",
    16: "d-mmm",
    17: "mmm-yy",
    18: "h:mm AM/PM",
    19: "h:mm:ss AM/PM",
    20: "h:mm",
    21: "h:mm:ss",
    22: "m/d/yy h:mm",
    37: "#,##0 ;(#,##0)",
    38: "#,##0 ;[Red](#,##0)",
    39: "#,##0.00;(#,##0.00)",
    40: "#,##0.00;[Red](#,##0.00)",
    45: "mm:ss",
    46: "[h]:mm:ss",
    47: "mmss.0",
    48: "##0.0E+0",
    49: "@",
    56: '"上午/下午 "hh"時"mm"分"ss"秒 "',
  },
  D0 = {
    5: 37,
    6: 38,
    7: 39,
    8: 40,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 14,
    28: 14,
    29: 14,
    30: 14,
    31: 14,
    50: 14,
    51: 14,
    52: 14,
    53: 14,
    54: 14,
    55: 14,
    56: 14,
    57: 14,
    58: 14,
    59: 1,
    60: 2,
    61: 3,
    62: 4,
    67: 9,
    68: 10,
    69: 12,
    70: 13,
    71: 14,
    72: 14,
    73: 15,
    74: 16,
    75: 17,
    76: 20,
    77: 21,
    78: 22,
    79: 45,
    80: 46,
    81: 47,
    82: 0,
  },
  Os = {
    5: '"$"#,##0_);\\("$"#,##0\\)',
    63: '"$"#,##0_);\\("$"#,##0\\)',
    6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
    64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
    7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
    65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
    8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
    66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
    41: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',
    42: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
    43: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',
    44: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)',
  };
function an(e, t, r) {
  for (
    var n = e < 0 ? -1 : 1, a = e * n, i = 0, s = 1, f = 0, o = 1, l = 0, c = 0, p = Math.floor(a);
    l < t && ((p = Math.floor(a)), (f = p * s + i), (c = p * l + o), !(a - p < 5e-8));
  )
    ((a = 1 / (a - p)), (i = s), (s = f), (o = l), (l = c));
  if ((c > t && (l > t ? ((c = o), (f = i)) : ((c = l), (f = s))), !r)) return [0, n * f, c];
  var x = Math.floor((n * f) / c);
  return [x, n * f - x * c, c];
}
function $t(e, t, r) {
  if (e > 2958465 || e < 0) return null;
  var n = e | 0,
    a = Math.floor(86400 * (e - n)),
    i = 0,
    s = [],
    f = { D: n, T: a, u: 86400 * (e - n) - a, y: 0, m: 0, d: 0, H: 0, M: 0, S: 0, q: 0 };
  if (
    (Math.abs(f.u) < 1e-6 && (f.u = 0),
    t && t.date1904 && (n += 1462),
    f.u > 0.9999 && ((f.u = 0), ++a == 86400 && ((f.T = a = 0), ++n, ++f.D)),
    n === 60)
  )
    ((s = r ? [1317, 10, 29] : [1900, 2, 29]), (i = 3));
  else if (n === 0) ((s = r ? [1317, 8, 29] : [1900, 1, 0]), (i = 6));
  else {
    n > 60 && --n;
    var o = new Date(1900, 0, 1);
    (o.setDate(o.getDate() + n - 1),
      (s = [o.getFullYear(), o.getMonth() + 1, o.getDate()]),
      (i = o.getDay()),
      n < 60 && (i = (i + 6) % 7),
      r && (i = Ls(o, s)));
  }
  return (
    (f.y = s[0]),
    (f.m = s[1]),
    (f.d = s[2]),
    (f.S = a % 60),
    (a = Math.floor(a / 60)),
    (f.M = a % 60),
    (a = Math.floor(a / 60)),
    (f.H = a),
    (f.q = i),
    f
  );
}
var xa = new Date(1899, 11, 31, 0, 0, 0),
  Ds = xa.getTime(),
  Rs = new Date(1900, 2, 1, 0, 0, 0);
function da(e, t) {
  var r = e.getTime();
  return (
    t ? (r -= 1461 * 24 * 60 * 60 * 1e3) : e >= Rs && (r += 1440 * 60 * 1e3),
    (r - (Ds + (e.getTimezoneOffset() - xa.getTimezoneOffset()) * 6e4)) / (1440 * 60 * 1e3)
  );
}
function zn(e) {
  return e.indexOf(".") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}
function Is(e) {
  return e.indexOf("E") == -1
    ? e
    : e.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/, "$1E").replace(/(E[+-])(\d)$/, "$10$2");
}
function ks(e) {
  var t = e < 0 ? 12 : 11,
    r = zn(e.toFixed(12));
  return r.length <= t || ((r = e.toPrecision(10)), r.length <= t) ? r : e.toExponential(5);
}
function Ns(e) {
  var t = zn(e.toFixed(11));
  return t.length > (e < 0 ? 12 : 11) || t === "0" || t === "-0" ? e.toPrecision(6) : t;
}
function Ps(e) {
  var t = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E),
    r;
  return (
    t >= -4 && t <= -1
      ? (r = e.toPrecision(10 + t))
      : Math.abs(t) <= 9
        ? (r = ks(e))
        : t === 10
          ? (r = e.toFixed(10).substr(0, 12))
          : (r = Ns(e)),
    zn(Is(r.toUpperCase()))
  );
}
function Wn(e, t) {
  switch (typeof e) {
    case "string":
      return e;
    case "boolean":
      return e ? "TRUE" : "FALSE";
    case "number":
      return (e | 0) === e ? e.toString(10) : Ps(e);
    case "undefined":
      return "";
    case "object":
      if (e == null) return "";
      if (e instanceof Date) return Br(14, da(e, t && t.date1904), t);
  }
  throw new Error("unsupported value in General format: " + e);
}
function Ls(e, t) {
  t[0] -= 581;
  var r = e.getDay();
  return (e < 60 && (r = (r + 6) % 7), r);
}
function Ms(e, t, r, n) {
  var a = "",
    i = 0,
    s = 0,
    f = r.y,
    o,
    l = 0;
  switch (e) {
    case 98:
      f = r.y + 543;
    case 121:
      switch (t.length) {
        case 1:
        case 2:
          ((o = f % 100), (l = 2));
          break;
        default:
          ((o = f % 1e4), (l = 4));
          break;
      }
      break;
    case 109:
      switch (t.length) {
        case 1:
        case 2:
          ((o = r.m), (l = t.length));
          break;
        case 3:
          return In[r.m - 1][1];
        case 5:
          return In[r.m - 1][0];
        default:
          return In[r.m - 1][2];
      }
      break;
    case 100:
      switch (t.length) {
        case 1:
        case 2:
          ((o = r.d), (l = t.length));
          break;
        case 3:
          return O0[r.q][0];
        default:
          return O0[r.q][1];
      }
      break;
    case 104:
      switch (t.length) {
        case 1:
        case 2:
          ((o = 1 + ((r.H + 11) % 12)), (l = t.length));
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 72:
      switch (t.length) {
        case 1:
        case 2:
          ((o = r.H), (l = t.length));
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 77:
      switch (t.length) {
        case 1:
        case 2:
          ((o = r.M), (l = t.length));
          break;
        default:
          throw "bad minute format: " + t;
      }
      break;
    case 115:
      if (t != "s" && t != "ss" && t != ".0" && t != ".00" && t != ".000")
        throw "bad second format: " + t;
      return r.u === 0 && (t == "s" || t == "ss")
        ? gr(r.S, t.length)
        : (n >= 2 ? (s = n === 3 ? 1e3 : 100) : (s = n === 1 ? 10 : 1),
          (i = Math.round(s * (r.S + r.u))),
          i >= 60 * s && (i = 0),
          t === "s"
            ? i === 0
              ? "0"
              : "" + i / s
            : ((a = gr(i, 2 + n)), t === "ss" ? a.substr(0, 2) : "." + a.substr(2, t.length - 1)));
    case 90:
      switch (t) {
        case "[h]":
        case "[hh]":
          o = r.D * 24 + r.H;
          break;
        case "[m]":
        case "[mm]":
          o = (r.D * 24 + r.H) * 60 + r.M;
          break;
        case "[s]":
        case "[ss]":
          o = ((r.D * 24 + r.H) * 60 + r.M) * 60 + Math.round(r.S + r.u);
          break;
        default:
          throw "bad abstime format: " + t;
      }
      l = t.length === 3 ? 1 : 2;
      break;
    case 101:
      ((o = f), (l = 1));
      break;
  }
  var c = l > 0 ? gr(o, l) : "";
  return c;
}
function Mr(e) {
  var t = 3;
  if (e.length <= t) return e;
  for (var r = e.length % t, n = e.substr(0, r); r != e.length; r += t)
    n += (n.length > 0 ? "," : "") + e.substr(r, t);
  return n;
}
var pa = /%/g;
function Bs(e, t, r) {
  var n = t.replace(pa, ""),
    a = t.length - n.length;
  return Or(e, n, r * Math.pow(10, 2 * a)) + Ce("%", a);
}
function bs(e, t, r) {
  for (var n = t.length - 1; t.charCodeAt(n - 1) === 44; ) --n;
  return Or(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)));
}
function va(e, t) {
  var r,
    n = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + va(e, -t);
    var a = e.indexOf(".");
    a === -1 && (a = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % a;
    if (
      (i < 0 && (i += a),
      (r = (t / Math.pow(10, i)).toPrecision(n + 1 + ((a + i) % a))),
      r.indexOf("e") === -1)
    ) {
      var s = Math.floor(Math.log(t) * Math.LOG10E);
      for (
        r.indexOf(".") === -1
          ? (r = r.charAt(0) + "." + r.substr(1) + "E+" + (s - r.length + i))
          : (r += "E+" + (s - i));
        r.substr(0, 2) === "0.";
      )
        ((r = r.charAt(0) + r.substr(2, a) + "." + r.substr(2 + a)),
          (r = r.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.")));
      r = r.replace(/\+-/, "-");
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function (f, o, l, c) {
      return o + l + c.substr(0, (a + i) % a) + "." + c.substr(i) + "E";
    });
  } else r = t.toExponential(n);
  return (
    e.match(/E\+00$/) &&
      r.match(/e[+-]\d$/) &&
      (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)),
    e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")),
    r.replace("e", "E")
  );
}
var ma = /# (\?+)( ?)\/( ?)(\d+)/;
function Us(e, t, r) {
  var n = parseInt(e[4], 10),
    a = Math.round(t * n),
    i = Math.floor(a / n),
    s = a - i * n,
    f = n;
  return (
    r +
    (i === 0 ? "" : "" + i) +
    " " +
    (s === 0
      ? Ce(" ", e[1].length + 1 + e[4].length)
      : Xn(s, e[1].length) + e[2] + "/" + e[3] + gr(f, e[4].length))
  );
}
function Ws(e, t, r) {
  return r + (t === 0 ? "" : "" + t) + Ce(" ", e[1].length + 2 + e[4].length);
}
var ga = /^#*0*\.([0#]+)/,
  _a = /\).*[0#]/,
  Ta = /\(###\) ###\\?-####/;
function je(e) {
  for (var t = "", r, n = 0; n != e.length; ++n)
    switch ((r = e.charCodeAt(n))) {
      case 35:
        break;
      case 63:
        t += " ";
        break;
      case 48:
        t += "0";
        break;
      default:
        t += String.fromCharCode(r);
    }
  return t;
}
function R0(e, t) {
  var r = Math.pow(10, t);
  return "" + Math.round(e * r) / r;
}
function I0(e, t) {
  var r = e - Math.floor(e),
    n = Math.pow(10, t);
  return t < ("" + Math.round(r * n)).length ? 0 : Math.round(r * n);
}
function Hs(e, t) {
  return t < ("" + Math.round((e - Math.floor(e)) * Math.pow(10, t))).length ? 1 : 0;
}
function Vs(e) {
  return e < 2147483647 && e > -2147483648
    ? "" + (e >= 0 ? e | 0 : (e - 1) | 0)
    : "" + Math.floor(e);
}
function hr(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(_a)) {
    var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? hr("n", n, r) : "(" + hr("n", n, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return bs(e, t, r);
  if (t.indexOf("%") !== -1) return Bs(e, t, r);
  if (t.indexOf("E") !== -1) return va(t, r);
  if (t.charCodeAt(0) === 36) return "$" + hr(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var a,
    i,
    s,
    f,
    o = Math.abs(r),
    l = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return l + tt(o, t.length);
  if (t.match(/^[#?]+$/))
    return (
      (a = tt(r, 0)),
      a === "0" && (a = ""),
      a.length > t.length ? a : je(t.substr(0, t.length - a.length)) + a
    );
  if ((i = t.match(ma))) return Us(i, o, l);
  if (t.match(/^#+0+$/)) return l + tt(o, t.length - t.indexOf("0"));
  if ((i = t.match(ga)))
    return (
      (a = R0(r, i[1].length)
        .replace(/^([^\.]+)$/, "$1." + je(i[1]))
        .replace(/\.$/, "." + je(i[1]))
        .replace(/\.(\d*)$/, function (T, u) {
          return "." + u + Ce("0", je(i[1]).length - u.length);
        })),
      t.indexOf("0.") !== -1 ? a : a.replace(/^0\./, ".")
    );
  if (((t = t.replace(/^#+([0.])/, "$1")), (i = t.match(/^(0*)\.(#*)$/))))
    return (
      l +
      R0(o, i[2].length)
        .replace(/\.(\d*[1-9])0*$/, ".$1")
        .replace(/^(-?\d*)$/, "$1.")
        .replace(/^0\./, i[1].length ? "0." : ".")
    );
  if ((i = t.match(/^#{1,3},##0(\.?)$/))) return l + Mr(tt(o, 0));
  if ((i = t.match(/^#,##0\.([#0]*0)$/)))
    return r < 0
      ? "-" + hr(e, t, -r)
      : Mr("" + (Math.floor(r) + Hs(r, i[1].length))) + "." + gr(I0(r, i[1].length), i[1].length);
  if ((i = t.match(/^#,#*,#0/))) return hr(e, t.replace(/^#,#*,/, ""), r);
  if ((i = t.match(/^([0#]+)(\\?-([0#]+))+$/)))
    return (
      (a = ft(hr(e, t.replace(/[\\-]/g, ""), r))),
      (s = 0),
      ft(
        ft(t.replace(/\\/g, "")).replace(/[0#]/g, function (T) {
          return s < a.length ? a.charAt(s++) : T === "0" ? "0" : "";
        }),
      )
    );
  if (t.match(Ta))
    return (
      (a = hr(e, "##########", r)), "(" + a.substr(0, 3) + ") " + a.substr(3, 3) + "-" + a.substr(6)
    );
  var c = "";
  if ((i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)))
    return (
      (s = Math.min(i[4].length, 7)),
      (f = an(o, Math.pow(10, s) - 1, !1)),
      (a = "" + l),
      (c = Or("n", i[1], f[1])),
      c.charAt(c.length - 1) == " " && (c = c.substr(0, c.length - 1) + "0"),
      (a += c + i[2] + "/" + i[3]),
      (c = tn(f[2], s)),
      c.length < i[4].length && (c = je(i[4].substr(i[4].length - c.length)) + c),
      (a += c),
      a
    );
  if ((i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)))
    return (
      (s = Math.min(Math.max(i[1].length, i[4].length), 7)),
      (f = an(o, Math.pow(10, s) - 1, !0)),
      l +
        (f[0] || (f[1] ? "" : "0")) +
        " " +
        (f[1]
          ? Xn(f[1], s) + i[2] + "/" + i[3] + tn(f[2], s)
          : Ce(" ", 2 * s + 1 + i[2].length + i[3].length))
    );
  if ((i = t.match(/^[#0?]+$/)))
    return ((a = tt(r, 0)), t.length <= a.length ? a : je(t.substr(0, t.length - a.length)) + a);
  if ((i = t.match(/^([#0?]+)\.([#0]+)$/))) {
    ((a = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1")),
      (s = a.indexOf(".")));
    var p = t.indexOf(".") - s,
      x = t.length - a.length - p;
    return je(t.substr(0, p) + a + t.substr(t.length - x));
  }
  if ((i = t.match(/^00,000\.([#0]*0)$/)))
    return (
      (s = I0(r, i[1].length)),
      r < 0
        ? "-" + hr(e, t, -r)
        : Mr(Vs(r))
            .replace(/^\d,\d{3}$/, "0$&")
            .replace(/^\d*$/, function (T) {
              return "00," + (T.length < 3 ? gr(0, 3 - T.length) : "") + T;
            }) +
          "." +
          gr(s, i[1].length)
    );
  switch (t) {
    case "###,##0.00":
      return hr(e, "#,##0.00", r);
    case "###,###":
    case "##,###":
    case "#,###":
      var d = Mr(tt(o, 0));
      return d !== "0" ? l + d : "";
    case "###,###.00":
      return hr(e, "###,##0.00", r).replace(/^0\./, ".");
    case "#,###.00":
      return hr(e, "#,##0.00", r).replace(/^0\./, ".");
  }
  throw new Error("unsupported format |" + t + "|");
}
function Gs(e, t, r) {
  for (var n = t.length - 1; t.charCodeAt(n - 1) === 44; ) --n;
  return Or(e, t.substr(0, n), r / Math.pow(10, 3 * (t.length - n)));
}
function Xs(e, t, r) {
  var n = t.replace(pa, ""),
    a = t.length - n.length;
  return Or(e, n, r * Math.pow(10, 2 * a)) + Ce("%", a);
}
function Ea(e, t) {
  var r,
    n = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + Ea(e, -t);
    var a = e.indexOf(".");
    a === -1 && (a = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % a;
    if (
      (i < 0 && (i += a),
      (r = (t / Math.pow(10, i)).toPrecision(n + 1 + ((a + i) % a))),
      !r.match(/[Ee]/))
    ) {
      var s = Math.floor(Math.log(t) * Math.LOG10E);
      (r.indexOf(".") === -1
        ? (r = r.charAt(0) + "." + r.substr(1) + "E+" + (s - r.length + i))
        : (r += "E+" + (s - i)),
        (r = r.replace(/\+-/, "-")));
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function (f, o, l, c) {
      return o + l + c.substr(0, (a + i) % a) + "." + c.substr(i) + "E";
    });
  } else r = t.toExponential(n);
  return (
    e.match(/E\+00$/) &&
      r.match(/e[+-]\d$/) &&
      (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)),
    e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")),
    r.replace("e", "E")
  );
}
function Er(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(_a)) {
    var n = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? Er("n", n, r) : "(" + Er("n", n, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return Gs(e, t, r);
  if (t.indexOf("%") !== -1) return Xs(e, t, r);
  if (t.indexOf("E") !== -1) return Ea(t, r);
  if (t.charCodeAt(0) === 36) return "$" + Er(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var a,
    i,
    s,
    f,
    o = Math.abs(r),
    l = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return l + gr(o, t.length);
  if (t.match(/^[#?]+$/))
    return (
      (a = "" + r),
      r === 0 && (a = ""),
      a.length > t.length ? a : je(t.substr(0, t.length - a.length)) + a
    );
  if ((i = t.match(ma))) return Ws(i, o, l);
  if (t.match(/^#+0+$/)) return l + gr(o, t.length - t.indexOf("0"));
  if ((i = t.match(ga)))
    return (
      (a = ("" + r).replace(/^([^\.]+)$/, "$1." + je(i[1])).replace(/\.$/, "." + je(i[1]))),
      (a = a.replace(/\.(\d*)$/, function (T, u) {
        return "." + u + Ce("0", je(i[1]).length - u.length);
      })),
      t.indexOf("0.") !== -1 ? a : a.replace(/^0\./, ".")
    );
  if (((t = t.replace(/^#+([0.])/, "$1")), (i = t.match(/^(0*)\.(#*)$/))))
    return (
      l +
      ("" + o)
        .replace(/\.(\d*[1-9])0*$/, ".$1")
        .replace(/^(-?\d*)$/, "$1.")
        .replace(/^0\./, i[1].length ? "0." : ".")
    );
  if ((i = t.match(/^#{1,3},##0(\.?)$/))) return l + Mr("" + o);
  if ((i = t.match(/^#,##0\.([#0]*0)$/)))
    return r < 0 ? "-" + Er(e, t, -r) : Mr("" + r) + "." + Ce("0", i[1].length);
  if ((i = t.match(/^#,#*,#0/))) return Er(e, t.replace(/^#,#*,/, ""), r);
  if ((i = t.match(/^([0#]+)(\\?-([0#]+))+$/)))
    return (
      (a = ft(Er(e, t.replace(/[\\-]/g, ""), r))),
      (s = 0),
      ft(
        ft(t.replace(/\\/g, "")).replace(/[0#]/g, function (T) {
          return s < a.length ? a.charAt(s++) : T === "0" ? "0" : "";
        }),
      )
    );
  if (t.match(Ta))
    return (
      (a = Er(e, "##########", r)), "(" + a.substr(0, 3) + ") " + a.substr(3, 3) + "-" + a.substr(6)
    );
  var c = "";
  if ((i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/)))
    return (
      (s = Math.min(i[4].length, 7)),
      (f = an(o, Math.pow(10, s) - 1, !1)),
      (a = "" + l),
      (c = Or("n", i[1], f[1])),
      c.charAt(c.length - 1) == " " && (c = c.substr(0, c.length - 1) + "0"),
      (a += c + i[2] + "/" + i[3]),
      (c = tn(f[2], s)),
      c.length < i[4].length && (c = je(i[4].substr(i[4].length - c.length)) + c),
      (a += c),
      a
    );
  if ((i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/)))
    return (
      (s = Math.min(Math.max(i[1].length, i[4].length), 7)),
      (f = an(o, Math.pow(10, s) - 1, !0)),
      l +
        (f[0] || (f[1] ? "" : "0")) +
        " " +
        (f[1]
          ? Xn(f[1], s) + i[2] + "/" + i[3] + tn(f[2], s)
          : Ce(" ", 2 * s + 1 + i[2].length + i[3].length))
    );
  if ((i = t.match(/^[#0?]+$/)))
    return ((a = "" + r), t.length <= a.length ? a : je(t.substr(0, t.length - a.length)) + a);
  if ((i = t.match(/^([#0]+)\.([#0]+)$/))) {
    ((a = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1")),
      (s = a.indexOf(".")));
    var p = t.indexOf(".") - s,
      x = t.length - a.length - p;
    return je(t.substr(0, p) + a + t.substr(t.length - x));
  }
  if ((i = t.match(/^00,000\.([#0]*0)$/)))
    return r < 0
      ? "-" + Er(e, t, -r)
      : Mr("" + r)
          .replace(/^\d,\d{3}$/, "0$&")
          .replace(/^\d*$/, function (T) {
            return "00," + (T.length < 3 ? gr(0, 3 - T.length) : "") + T;
          }) +
          "." +
          gr(0, i[1].length);
  switch (t) {
    case "###,###":
    case "##,###":
    case "#,###":
      var d = Mr("" + o);
      return d !== "0" ? l + d : "";
    default:
      if (t.match(/\.[0#?]*$/))
        return Er(e, t.slice(0, t.lastIndexOf(".")), r) + je(t.slice(t.lastIndexOf(".")));
  }
  throw new Error("unsupported format |" + t + "|");
}
function Or(e, t, r) {
  return (r | 0) === r ? Er(e, t, r) : hr(e, t, r);
}
function zs(e) {
  for (var t = [], r = !1, n = 0, a = 0; n < e.length; ++n)
    switch (e.charCodeAt(n)) {
      case 34:
        r = !r;
        break;
      case 95:
      case 42:
      case 92:
        ++n;
        break;
      case 59:
        ((t[t.length] = e.substr(a, n - a)), (a = n + 1));
    }
  if (((t[t.length] = e.substr(a)), r === !0))
    throw new Error("Format |" + e + "| unterminated string ");
  return t;
}
var wa = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function Sa(e) {
  for (var t = 0, r = "", n = ""; t < e.length; )
    switch ((r = e.charAt(t))) {
      case "G":
        (nn(e, t) && (t += 6), t++);
        break;
      case '"':
        for (; e.charCodeAt(++t) !== 34 && t < e.length; );
        ++t;
        break;
      case "\\":
        t += 2;
        break;
      case "_":
        t += 2;
        break;
      case "@":
        ++t;
        break;
      case "B":
      case "b":
        if (e.charAt(t + 1) === "1" || e.charAt(t + 1) === "2") return !0;
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        return !0;
      case "A":
      case "a":
      case "上":
        if (
          e.substr(t, 3).toUpperCase() === "A/P" ||
          e.substr(t, 5).toUpperCase() === "AM/PM" ||
          e.substr(t, 5).toUpperCase() === "上午/下午"
        )
          return !0;
        ++t;
        break;
      case "[":
        for (n = r; e.charAt(t++) !== "]" && t < e.length; ) n += e.charAt(t);
        if (n.match(wa)) return !0;
        break;
      case ".":
      case "0":
      case "#":
        for (
          ;
          t < e.length &&
          ("0#?.,E+-%".indexOf((r = e.charAt(++t))) > -1 ||
            (r == "\\" && e.charAt(t + 1) == "-" && "0#".indexOf(e.charAt(t + 2)) > -1));
        );
        break;
      case "?":
        for (; e.charAt(++t) === r; );
        break;
      case "*":
        (++t, (e.charAt(t) == " " || e.charAt(t) == "*") && ++t);
        break;
      case "(":
      case ")":
        ++t;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (; t < e.length && "0123456789".indexOf(e.charAt(++t)) > -1; );
        break;
      case " ":
        ++t;
        break;
      default:
        ++t;
        break;
    }
  return !1;
}
function Ks(e, t, r, n) {
  for (var a = [], i = "", s = 0, f = "", o = "t", l, c, p, x = "H"; s < e.length; )
    switch ((f = e.charAt(s))) {
      case "G":
        if (!nn(e, s)) throw new Error("unrecognized character " + f + " in " + e);
        ((a[a.length] = { t: "G", v: "General" }), (s += 7));
        break;
      case '"':
        for (i = ""; (p = e.charCodeAt(++s)) !== 34 && s < e.length; ) i += String.fromCharCode(p);
        ((a[a.length] = { t: "t", v: i }), ++s);
        break;
      case "\\":
        var d = e.charAt(++s),
          T = d === "(" || d === ")" ? d : "t";
        ((a[a.length] = { t: T, v: d }), ++s);
        break;
      case "_":
        ((a[a.length] = { t: "t", v: " " }), (s += 2));
        break;
      case "@":
        ((a[a.length] = { t: "T", v: t }), ++s);
        break;
      case "B":
      case "b":
        if (e.charAt(s + 1) === "1" || e.charAt(s + 1) === "2") {
          if (l == null && ((l = $t(t, r, e.charAt(s + 1) === "2")), l == null)) return "";
          ((a[a.length] = { t: "X", v: e.substr(s, 2) }), (o = f), (s += 2));
          break;
        }
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
        f = f.toLowerCase();
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        if (t < 0 || (l == null && ((l = $t(t, r)), l == null))) return "";
        for (i = f; ++s < e.length && e.charAt(s).toLowerCase() === f; ) i += f;
        (f === "m" && o.toLowerCase() === "h" && (f = "M"),
          f === "h" && (f = x),
          (a[a.length] = { t: f, v: i }),
          (o = f));
        break;
      case "A":
      case "a":
      case "上":
        var u = { t: f, v: f };
        if (
          (l == null && (l = $t(t, r)),
          e.substr(s, 3).toUpperCase() === "A/P"
            ? (l != null && (u.v = l.H >= 12 ? "P" : "A"), (u.t = "T"), (x = "h"), (s += 3))
            : e.substr(s, 5).toUpperCase() === "AM/PM"
              ? (l != null && (u.v = l.H >= 12 ? "PM" : "AM"), (u.t = "T"), (s += 5), (x = "h"))
              : e.substr(s, 5).toUpperCase() === "上午/下午"
                ? (l != null && (u.v = l.H >= 12 ? "下午" : "上午"),
                  (u.t = "T"),
                  (s += 5),
                  (x = "h"))
                : ((u.t = "t"), ++s),
          l == null && u.t === "T")
        )
          return "";
        ((a[a.length] = u), (o = f));
        break;
      case "[":
        for (i = f; e.charAt(s++) !== "]" && s < e.length; ) i += e.charAt(s);
        if (i.slice(-1) !== "]") throw 'unterminated "[" block: |' + i + "|";
        if (i.match(wa)) {
          if (l == null && ((l = $t(t, r)), l == null)) return "";
          ((a[a.length] = { t: "Z", v: i.toLowerCase() }), (o = i.charAt(1)));
        } else
          i.indexOf("$") > -1 &&
            ((i = (i.match(/\$([^-\[\]]*)/) || [])[1] || "$"),
            Sa(e) || (a[a.length] = { t: "t", v: i }));
        break;
      case ".":
        if (l != null) {
          for (i = f; ++s < e.length && (f = e.charAt(s)) === "0"; ) i += f;
          a[a.length] = { t: "s", v: i };
          break;
        }
      case "0":
      case "#":
        for (i = f; ++s < e.length && "0#?.,E+-%".indexOf((f = e.charAt(s))) > -1; ) i += f;
        a[a.length] = { t: "n", v: i };
        break;
      case "?":
        for (i = f; e.charAt(++s) === f; ) i += f;
        ((a[a.length] = { t: f, v: i }), (o = f));
        break;
      case "*":
        (++s, (e.charAt(s) == " " || e.charAt(s) == "*") && ++s);
        break;
      case "(":
      case ")":
        ((a[a.length] = { t: n === 1 ? "t" : f, v: f }), ++s);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (i = f; s < e.length && "0123456789".indexOf(e.charAt(++s)) > -1; ) i += e.charAt(s);
        a[a.length] = { t: "D", v: i };
        break;
      case " ":
        ((a[a.length] = { t: f, v: f }), ++s);
        break;
      case "$":
        ((a[a.length] = { t: "t", v: "$" }), ++s);
        break;
      default:
        if (",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(f) === -1)
          throw new Error("unrecognized character " + f + " in " + e);
        ((a[a.length] = { t: "t", v: f }), ++s);
        break;
    }
  var g = 0,
    O = 0,
    D;
  for (s = a.length - 1, o = "t"; s >= 0; --s)
    switch (a[s].t) {
      case "h":
      case "H":
        ((a[s].t = x), (o = "h"), g < 1 && (g = 1));
        break;
      case "s":
        ((D = a[s].v.match(/\.0+$/)) && (O = Math.max(O, D[0].length - 1)), g < 3 && (g = 3));
      case "d":
      case "y":
      case "M":
      case "e":
        o = a[s].t;
        break;
      case "m":
        o === "s" && ((a[s].t = "M"), g < 2 && (g = 2));
        break;
      case "X":
        break;
      case "Z":
        (g < 1 && a[s].v.match(/[Hh]/) && (g = 1),
          g < 2 && a[s].v.match(/[Mm]/) && (g = 2),
          g < 3 && a[s].v.match(/[Ss]/) && (g = 3));
    }
  switch (g) {
    case 0:
      break;
    case 1:
      (l.u >= 0.5 && ((l.u = 0), ++l.S),
        l.S >= 60 && ((l.S = 0), ++l.M),
        l.M >= 60 && ((l.M = 0), ++l.H));
      break;
    case 2:
      (l.u >= 0.5 && ((l.u = 0), ++l.S), l.S >= 60 && ((l.S = 0), ++l.M));
      break;
  }
  var C = "",
    B;
  for (s = 0; s < a.length; ++s)
    switch (a[s].t) {
      case "t":
      case "T":
      case " ":
      case "D":
        break;
      case "X":
        ((a[s].v = ""), (a[s].t = ";"));
        break;
      case "d":
      case "m":
      case "y":
      case "h":
      case "H":
      case "M":
      case "s":
      case "e":
      case "b":
      case "Z":
        ((a[s].v = Ms(a[s].t.charCodeAt(0), a[s].v, l, O)), (a[s].t = "t"));
        break;
      case "n":
      case "?":
        for (
          B = s + 1;
          a[B] != null &&
          ((f = a[B].t) === "?" ||
            f === "D" ||
            ((f === " " || f === "t") &&
              a[B + 1] != null &&
              (a[B + 1].t === "?" || (a[B + 1].t === "t" && a[B + 1].v === "/"))) ||
            (a[s].t === "(" && (f === " " || f === "n" || f === ")")) ||
            (f === "t" &&
              (a[B].v === "/" || (a[B].v === " " && a[B + 1] != null && a[B + 1].t == "?"))));
        )
          ((a[s].v += a[B].v), (a[B] = { v: "", t: ";" }), ++B);
        ((C += a[s].v), (s = B - 1));
        break;
      case "G":
        ((a[s].t = "t"), (a[s].v = Wn(t, r)));
        break;
    }
  var K = "",
    q,
    F;
  if (C.length > 0) {
    (C.charCodeAt(0) == 40
      ? ((q = t < 0 && C.charCodeAt(0) === 45 ? -t : t), (F = Or("n", C, q)))
      : ((q = t < 0 && n > 1 ? -t : t),
        (F = Or("n", C, q)),
        q < 0 && a[0] && a[0].t == "t" && ((F = F.substr(1)), (a[0].v = "-" + a[0].v))),
      (B = F.length - 1));
    var L = a.length;
    for (s = 0; s < a.length; ++s)
      if (a[s] != null && a[s].t != "t" && a[s].v.indexOf(".") > -1) {
        L = s;
        break;
      }
    var N = a.length;
    if (L === a.length && F.indexOf("E") === -1) {
      for (s = a.length - 1; s >= 0; --s)
        a[s] == null ||
          "n?".indexOf(a[s].t) === -1 ||
          (B >= a[s].v.length - 1
            ? ((B -= a[s].v.length), (a[s].v = F.substr(B + 1, a[s].v.length)))
            : B < 0
              ? (a[s].v = "")
              : ((a[s].v = F.substr(0, B + 1)), (B = -1)),
          (a[s].t = "t"),
          (N = s));
      B >= 0 && N < a.length && (a[N].v = F.substr(0, B + 1) + a[N].v);
    } else if (L !== a.length && F.indexOf("E") === -1) {
      for (B = F.indexOf(".") - 1, s = L; s >= 0; --s)
        if (!(a[s] == null || "n?".indexOf(a[s].t) === -1)) {
          for (
            c = a[s].v.indexOf(".") > -1 && s === L ? a[s].v.indexOf(".") - 1 : a[s].v.length - 1,
              K = a[s].v.substr(c + 1);
            c >= 0;
            --c
          )
            B >= 0 &&
              (a[s].v.charAt(c) === "0" || a[s].v.charAt(c) === "#") &&
              (K = F.charAt(B--) + K);
          ((a[s].v = K), (a[s].t = "t"), (N = s));
        }
      for (
        B >= 0 && N < a.length && (a[N].v = F.substr(0, B + 1) + a[N].v),
          B = F.indexOf(".") + 1,
          s = L;
        s < a.length;
        ++s
      )
        if (!(a[s] == null || ("n?(".indexOf(a[s].t) === -1 && s !== L))) {
          for (
            c = a[s].v.indexOf(".") > -1 && s === L ? a[s].v.indexOf(".") + 1 : 0,
              K = a[s].v.substr(0, c);
            c < a[s].v.length;
            ++c
          )
            B < F.length && (K += F.charAt(B++));
          ((a[s].v = K), (a[s].t = "t"), (N = s));
        }
    }
  }
  for (s = 0; s < a.length; ++s)
    a[s] != null &&
      "n?".indexOf(a[s].t) > -1 &&
      ((q = n > 1 && t < 0 && s > 0 && a[s - 1].v === "-" ? -t : t),
      (a[s].v = Or(a[s].t, a[s].v, q)),
      (a[s].t = "t"));
  var V = "";
  for (s = 0; s !== a.length; ++s) a[s] != null && (V += a[s].v);
  return V;
}
var k0 = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function N0(e, t) {
  if (t == null) return !1;
  var r = parseFloat(t[2]);
  switch (t[1]) {
    case "=":
      if (e == r) return !0;
      break;
    case ">":
      if (e > r) return !0;
      break;
    case "<":
      if (e < r) return !0;
      break;
    case "<>":
      if (e != r) return !0;
      break;
    case ">=":
      if (e >= r) return !0;
      break;
    case "<=":
      if (e <= r) return !0;
      break;
  }
  return !1;
}
function Ys(e, t) {
  var r = zs(e),
    n = r.length,
    a = r[n - 1].indexOf("@");
  if ((n < 4 && a > -1 && --n, r.length > 4))
    throw new Error("cannot find right format for |" + r.join("|") + "|");
  if (typeof t != "number") return [4, r.length === 4 || a > -1 ? r[r.length - 1] : "@"];
  switch (r.length) {
    case 1:
      r = a > -1 ? ["General", "General", "General", r[0]] : [r[0], r[0], r[0], "@"];
      break;
    case 2:
      r = a > -1 ? [r[0], r[0], r[0], r[1]] : [r[0], r[1], r[0], "@"];
      break;
    case 3:
      r = a > -1 ? [r[0], r[1], r[0], r[2]] : [r[0], r[1], r[2], "@"];
      break;
  }
  var i = t > 0 ? r[0] : t < 0 ? r[1] : r[2];
  if (r[0].indexOf("[") === -1 && r[1].indexOf("[") === -1) return [n, i];
  if (r[0].match(/\[[=<>]/) != null || r[1].match(/\[[=<>]/) != null) {
    var s = r[0].match(k0),
      f = r[1].match(k0);
    return N0(t, s) ? [n, r[0]] : N0(t, f) ? [n, r[1]] : [n, r[s != null && f != null ? 2 : 1]];
  }
  return [n, i];
}
function Br(e, t, r) {
  r == null && (r = {});
  var n = "";
  switch (typeof e) {
    case "string":
      e == "m/d/yy" && r.dateNF ? (n = r.dateNF) : (n = e);
      break;
    case "number":
      (e == 14 && r.dateNF ? (n = r.dateNF) : (n = (r.table != null ? r.table : Oe)[e]),
        n == null && (n = (r.table && r.table[D0[e]]) || Oe[D0[e]]),
        n == null && (n = Os[e] || "General"));
      break;
  }
  if (nn(n, 0)) return Wn(t, r);
  t instanceof Date && (t = da(t, r.date1904));
  var a = Ys(n, t);
  if (nn(a[1])) return Wn(t, r);
  if (t === !0) t = "TRUE";
  else if (t === !1) t = "FALSE";
  else if (t === "" || t == null) return "";
  return Ks(a[1], t, r, a[0]);
}
function Aa(e, t) {
  if (typeof t != "number") {
    t = +t || -1;
    for (var r = 0; r < 392; ++r) {
      if (Oe[r] == null) {
        t < 0 && (t = r);
        continue;
      }
      if (Oe[r] == e) {
        t = r;
        break;
      }
    }
    t < 0 && (t = 391);
  }
  return ((Oe[t] = e), t);
}
function mn(e) {
  for (var t = 0; t != 392; ++t) e[t] !== void 0 && Aa(e[t], t);
}
function gn() {
  Oe = Cs();
}
var Fa = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function $s(e) {
  var t = typeof e == "number" ? Oe[e] : e;
  return ((t = t.replace(Fa, "(\\d+)")), new RegExp("^" + t + "$"));
}
function js(e, t, r) {
  var n = -1,
    a = -1,
    i = -1,
    s = -1,
    f = -1,
    o = -1;
  ((t.match(Fa) || []).forEach(function (p, x) {
    var d = parseInt(r[x + 1], 10);
    switch (p.toLowerCase().charAt(0)) {
      case "y":
        n = d;
        break;
      case "d":
        i = d;
        break;
      case "h":
        s = d;
        break;
      case "s":
        o = d;
        break;
      case "m":
        s >= 0 ? (f = d) : (a = d);
        break;
    }
  }),
    o >= 0 && f == -1 && a >= 0 && ((f = a), (a = -1)));
  var l =
    ("" + (n >= 0 ? n : new Date().getFullYear())).slice(-4) +
    "-" +
    ("00" + (a >= 1 ? a : 1)).slice(-2) +
    "-" +
    ("00" + (i >= 1 ? i : 1)).slice(-2);
  (l.length == 7 && (l = "0" + l), l.length == 8 && (l = "20" + l));
  var c =
    ("00" + (s >= 0 ? s : 0)).slice(-2) +
    ":" +
    ("00" + (f >= 0 ? f : 0)).slice(-2) +
    ":" +
    ("00" + (o >= 0 ? o : 0)).slice(-2);
  return s == -1 && f == -1 && o == -1 ? l : n == -1 && a == -1 && i == -1 ? c : l + "T" + c;
}
var Js = (function () {
    var e = {};
    e.version = "1.2.0";
    function t() {
      for (var F = 0, L = new Array(256), N = 0; N != 256; ++N)
        ((F = N),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (F = F & 1 ? -306674912 ^ (F >>> 1) : F >>> 1),
          (L[N] = F));
      return typeof Int32Array < "u" ? new Int32Array(L) : L;
    }
    var r = t();
    function n(F) {
      var L = 0,
        N = 0,
        V = 0,
        U = typeof Int32Array < "u" ? new Int32Array(4096) : new Array(4096);
      for (V = 0; V != 256; ++V) U[V] = F[V];
      for (V = 0; V != 256; ++V)
        for (N = F[V], L = 256 + V; L < 4096; L += 256) N = U[L] = (N >>> 8) ^ F[N & 255];
      var X = [];
      for (V = 1; V != 16; ++V)
        X[V - 1] =
          typeof Int32Array < "u"
            ? U.subarray(V * 256, V * 256 + 256)
            : U.slice(V * 256, V * 256 + 256);
      return X;
    }
    var a = n(r),
      i = a[0],
      s = a[1],
      f = a[2],
      o = a[3],
      l = a[4],
      c = a[5],
      p = a[6],
      x = a[7],
      d = a[8],
      T = a[9],
      u = a[10],
      g = a[11],
      O = a[12],
      D = a[13],
      C = a[14];
    function B(F, L) {
      for (var N = L ^ -1, V = 0, U = F.length; V < U; )
        N = (N >>> 8) ^ r[(N ^ F.charCodeAt(V++)) & 255];
      return ~N;
    }
    function K(F, L) {
      for (var N = L ^ -1, V = F.length - 15, U = 0; U < V; )
        N =
          C[F[U++] ^ (N & 255)] ^
          D[F[U++] ^ ((N >> 8) & 255)] ^
          O[F[U++] ^ ((N >> 16) & 255)] ^
          g[F[U++] ^ (N >>> 24)] ^
          u[F[U++]] ^
          T[F[U++]] ^
          d[F[U++]] ^
          x[F[U++]] ^
          p[F[U++]] ^
          c[F[U++]] ^
          l[F[U++]] ^
          o[F[U++]] ^
          f[F[U++]] ^
          s[F[U++]] ^
          i[F[U++]] ^
          r[F[U++]];
      for (V += 15; U < V; ) N = (N >>> 8) ^ r[(N ^ F[U++]) & 255];
      return ~N;
    }
    function q(F, L) {
      for (var N = L ^ -1, V = 0, U = F.length, X = 0, re = 0; V < U; )
        ((X = F.charCodeAt(V++)),
          X < 128
            ? (N = (N >>> 8) ^ r[(N ^ X) & 255])
            : X < 2048
              ? ((N = (N >>> 8) ^ r[(N ^ (192 | ((X >> 6) & 31))) & 255]),
                (N = (N >>> 8) ^ r[(N ^ (128 | (X & 63))) & 255]))
              : X >= 55296 && X < 57344
                ? ((X = (X & 1023) + 64),
                  (re = F.charCodeAt(V++) & 1023),
                  (N = (N >>> 8) ^ r[(N ^ (240 | ((X >> 8) & 7))) & 255]),
                  (N = (N >>> 8) ^ r[(N ^ (128 | ((X >> 2) & 63))) & 255]),
                  (N = (N >>> 8) ^ r[(N ^ (128 | ((re >> 6) & 15) | ((X & 3) << 4))) & 255]),
                  (N = (N >>> 8) ^ r[(N ^ (128 | (re & 63))) & 255]))
                : ((N = (N >>> 8) ^ r[(N ^ (224 | ((X >> 12) & 15))) & 255]),
                  (N = (N >>> 8) ^ r[(N ^ (128 | ((X >> 6) & 63))) & 255]),
                  (N = (N >>> 8) ^ r[(N ^ (128 | (X & 63))) & 255])));
      return ~N;
    }
    return ((e.table = r), (e.bstr = B), (e.buf = K), (e.str = q), e);
  })(),
  Ee = (function () {
    var t = {};
    t.version = "1.2.1";
    function r(h, _) {
      for (
        var v = h.split("/"), m = _.split("/"), E = 0, w = 0, I = Math.min(v.length, m.length);
        E < I;
        ++E
      ) {
        if ((w = v[E].length - m[E].length)) return w;
        if (v[E] != m[E]) return v[E] < m[E] ? -1 : 1;
      }
      return v.length - m.length;
    }
    function n(h) {
      if (h.charAt(h.length - 1) == "/")
        return h.slice(0, -1).indexOf("/") === -1 ? h : n(h.slice(0, -1));
      var _ = h.lastIndexOf("/");
      return _ === -1 ? h : h.slice(0, _ + 1);
    }
    function a(h) {
      if (h.charAt(h.length - 1) == "/") return a(h.slice(0, -1));
      var _ = h.lastIndexOf("/");
      return _ === -1 ? h : h.slice(_ + 1);
    }
    function i(h, _) {
      typeof _ == "string" && (_ = new Date(_));
      var v = _.getHours();
      ((v = (v << 6) | _.getMinutes()),
        (v = (v << 5) | (_.getSeconds() >>> 1)),
        h.write_shift(2, v));
      var m = _.getFullYear() - 1980;
      ((m = (m << 4) | (_.getMonth() + 1)), (m = (m << 5) | _.getDate()), h.write_shift(2, m));
    }
    function s(h) {
      var _ = h.read_shift(2) & 65535,
        v = h.read_shift(2) & 65535,
        m = new Date(),
        E = v & 31;
      v >>>= 5;
      var w = v & 15;
      ((v >>>= 4), m.setMilliseconds(0), m.setFullYear(v + 1980), m.setMonth(w - 1), m.setDate(E));
      var I = _ & 31;
      _ >>>= 5;
      var W = _ & 63;
      return ((_ >>>= 6), m.setHours(_), m.setMinutes(W), m.setSeconds(I << 1), m);
    }
    function f(h) {
      ar(h, 0);
      for (var _ = {}, v = 0; h.l <= h.length - 4; ) {
        var m = h.read_shift(2),
          E = h.read_shift(2),
          w = h.l + E,
          I = {};
        (m === 21589 &&
          ((v = h.read_shift(1)),
          v & 1 && (I.mtime = h.read_shift(4)),
          E > 5 && (v & 2 && (I.atime = h.read_shift(4)), v & 4 && (I.ctime = h.read_shift(4))),
          I.mtime && (I.mt = new Date(I.mtime * 1e3))),
          (h.l = w),
          (_[m] = I));
      }
      return _;
    }
    var o;
    function l() {
      return o || (o = {});
    }
    function c(h, _) {
      if (h[0] == 80 && h[1] == 75) return T0(h, _);
      if ((h[0] | 32) == 109 && (h[1] | 32) == 105) return rs(h, _);
      if (h.length < 512) throw new Error("CFB file size " + h.length + " < 512");
      var v = 3,
        m = 512,
        E = 0,
        w = 0,
        I = 0,
        W = 0,
        R = 0,
        k = [],
        P = h.slice(0, 512);
      ar(P, 0);
      var z = p(P);
      switch (((v = z[0]), v)) {
        case 3:
          m = 512;
          break;
        case 4:
          m = 4096;
          break;
        case 0:
          if (z[1] == 0) return T0(h, _);
        default:
          throw new Error("Major Version: Expected 3 or 4 saw " + v);
      }
      m !== 512 && ((P = h.slice(0, m)), ar(P, 28));
      var Z = h.slice(0, m);
      x(P, v);
      var te = P.read_shift(4, "i");
      if (v === 3 && te !== 0) throw new Error("# Directory Sectors: Expected 0 saw " + te);
      ((P.l += 4),
        (I = P.read_shift(4, "i")),
        (P.l += 4),
        P.chk("00100000", "Mini Stream Cutoff Size: "),
        (W = P.read_shift(4, "i")),
        (E = P.read_shift(4, "i")),
        (R = P.read_shift(4, "i")),
        (w = P.read_shift(4, "i")));
      for (var Y = -1, ee = 0; ee < 109 && ((Y = P.read_shift(4, "i")), !(Y < 0)); ++ee) k[ee] = Y;
      var le = d(h, m);
      g(R, w, le, m, k);
      var Ae = D(le, I, k, m);
      ((Ae[I].name = "!Directory"),
        E > 0 && W !== re && (Ae[W].name = "!MiniFAT"),
        (Ae[k[0]].name = "!FAT"),
        (Ae.fat_addrs = k),
        (Ae.ssz = m));
      var Fe = {},
        ze = [],
        vt = [],
        mt = [];
      (C(I, Ae, le, ze, E, Fe, vt, W), T(vt, mt, ze), ze.shift());
      var gt = { FileIndex: vt, FullPaths: mt };
      return (_ && _.raw && (gt.raw = { header: Z, sectors: le }), gt);
    }
    function p(h) {
      if (h[h.l] == 80 && h[h.l + 1] == 75) return [0, 0];
      (h.chk(Te, "Header Signature: "), (h.l += 16));
      var _ = h.read_shift(2, "u");
      return [h.read_shift(2, "u"), _];
    }
    function x(h, _) {
      var v = 9;
      switch (((h.l += 2), (v = h.read_shift(2)))) {
        case 9:
          if (_ != 3) throw new Error("Sector Shift: Expected 9 saw " + v);
          break;
        case 12:
          if (_ != 4) throw new Error("Sector Shift: Expected 12 saw " + v);
          break;
        default:
          throw new Error("Sector Shift: Expected 9 or 12 saw " + v);
      }
      (h.chk("0600", "Mini Sector Shift: "), h.chk("000000000000", "Reserved: "));
    }
    function d(h, _) {
      for (var v = Math.ceil(h.length / _) - 1, m = [], E = 1; E < v; ++E)
        m[E - 1] = h.slice(E * _, (E + 1) * _);
      return ((m[v - 1] = h.slice(v * _)), m);
    }
    function T(h, _, v) {
      for (var m = 0, E = 0, w = 0, I = 0, W = 0, R = v.length, k = [], P = []; m < R; ++m)
        ((k[m] = P[m] = m), (_[m] = v[m]));
      for (; W < P.length; ++W)
        ((m = P[W]),
          (E = h[m].L),
          (w = h[m].R),
          (I = h[m].C),
          k[m] === m &&
            (E !== -1 && k[E] !== E && (k[m] = k[E]), w !== -1 && k[w] !== w && (k[m] = k[w])),
          I !== -1 && (k[I] = m),
          E !== -1 && m != k[m] && ((k[E] = k[m]), P.lastIndexOf(E) < W && P.push(E)),
          w !== -1 && m != k[m] && ((k[w] = k[m]), P.lastIndexOf(w) < W && P.push(w)));
      for (m = 1; m < R; ++m)
        k[m] === m &&
          (w !== -1 && k[w] !== w ? (k[m] = k[w]) : E !== -1 && k[E] !== E && (k[m] = k[E]));
      for (m = 1; m < R; ++m)
        if (h[m].type !== 0) {
          if (((W = m), W != k[W]))
            do ((W = k[W]), (_[m] = _[W] + "/" + _[m]));
            while (W !== 0 && k[W] !== -1 && W != k[W]);
          k[m] = -1;
        }
      for (_[0] += "/", m = 1; m < R; ++m) h[m].type !== 2 && (_[m] += "/");
    }
    function u(h, _, v) {
      for (var m = h.start, E = h.size, w = [], I = m; v && E > 0 && I >= 0; )
        (w.push(_.slice(I * X, I * X + X)), (E -= X), (I = zr(v, I * 4)));
      return w.length === 0 ? b(0) : He(w).slice(0, h.size);
    }
    function g(h, _, v, m, E) {
      var w = re;
      if (h === re) {
        if (_ !== 0) throw new Error("DIFAT chain shorter than expected");
      } else if (h !== -1) {
        var I = v[h],
          W = (m >>> 2) - 1;
        if (!I) return;
        for (var R = 0; R < W && (w = zr(I, R * 4)) !== re; ++R) E.push(w);
        g(zr(I, m - 4), _ - 1, v, m, E);
      }
    }
    function O(h, _, v, m, E) {
      var w = [],
        I = [];
      E || (E = []);
      var W = m - 1,
        R = 0,
        k = 0;
      for (R = _; R >= 0; ) {
        ((E[R] = !0), (w[w.length] = R), I.push(h[R]));
        var P = v[Math.floor((R * 4) / m)];
        if (((k = (R * 4) & W), m < 4 + k))
          throw new Error("FAT boundary crossed: " + R + " 4 " + m);
        if (!h[P]) break;
        R = zr(h[P], k);
      }
      return { nodes: w, data: H0([I]) };
    }
    function D(h, _, v, m) {
      var E = h.length,
        w = [],
        I = [],
        W = [],
        R = [],
        k = m - 1,
        P = 0,
        z = 0,
        Z = 0,
        te = 0;
      for (P = 0; P < E; ++P)
        if (((W = []), (Z = P + _), Z >= E && (Z -= E), !I[Z])) {
          R = [];
          var Y = [];
          for (z = Z; z >= 0; ) {
            ((Y[z] = !0), (I[z] = !0), (W[W.length] = z), R.push(h[z]));
            var ee = v[Math.floor((z * 4) / m)];
            if (((te = (z * 4) & k), m < 4 + te))
              throw new Error("FAT boundary crossed: " + z + " 4 " + m);
            if (!h[ee] || ((z = zr(h[ee], te)), Y[z])) break;
          }
          w[Z] = { nodes: W, data: H0([R]) };
        }
      return w;
    }
    function C(h, _, v, m, E, w, I, W) {
      for (
        var R = 0, k = m.length ? 2 : 0, P = _[h].data, z = 0, Z = 0, te;
        z < P.length;
        z += 128
      ) {
        var Y = P.slice(z, z + 128);
        (ar(Y, 64), (Z = Y.read_shift(2)), (te = Jn(Y, 0, Z - k)), m.push(te));
        var ee = {
            name: te,
            type: Y.read_shift(1),
            color: Y.read_shift(1),
            L: Y.read_shift(4, "i"),
            R: Y.read_shift(4, "i"),
            C: Y.read_shift(4, "i"),
            clsid: Y.read_shift(16),
            state: Y.read_shift(4, "i"),
            start: 0,
            size: 0,
          },
          le = Y.read_shift(2) + Y.read_shift(2) + Y.read_shift(2) + Y.read_shift(2);
        le !== 0 && (ee.ct = B(Y, Y.l - 8));
        var Ae = Y.read_shift(2) + Y.read_shift(2) + Y.read_shift(2) + Y.read_shift(2);
        (Ae !== 0 && (ee.mt = B(Y, Y.l - 8)),
          (ee.start = Y.read_shift(4, "i")),
          (ee.size = Y.read_shift(4, "i")),
          ee.size < 0 && ee.start < 0 && ((ee.size = ee.type = 0), (ee.start = re), (ee.name = "")),
          ee.type === 5
            ? ((R = ee.start), E > 0 && R !== re && (_[R].name = "!StreamData"))
            : ee.size >= 4096
              ? ((ee.storage = "fat"),
                _[ee.start] === void 0 && (_[ee.start] = O(v, ee.start, _.fat_addrs, _.ssz)),
                (_[ee.start].name = ee.name),
                (ee.content = _[ee.start].data.slice(0, ee.size)))
              : ((ee.storage = "minifat"),
                ee.size < 0
                  ? (ee.size = 0)
                  : R !== re &&
                    ee.start !== re &&
                    _[R] &&
                    (ee.content = u(ee, _[R].data, (_[W] || {}).data))),
          ee.content && ar(ee.content, 0),
          (w[te] = ee),
          I.push(ee));
      }
    }
    function B(h, _) {
      return new Date(
        ((sr(h, _ + 4) / 1e7) * Math.pow(2, 32) + sr(h, _) / 1e7 - 11644473600) * 1e3,
      );
    }
    function K(h, _) {
      return (l(), c(o.readFileSync(h), _));
    }
    function q(h, _) {
      var v = _ && _.type;
      switch ((v || (de && Buffer.isBuffer(h) && (v = "buffer")), v || "base64")) {
        case "file":
          return K(h, _);
        case "base64":
          return c(mr(Ir(h)), _);
        case "binary":
          return c(mr(h), _);
      }
      return c(h, _);
    }
    function F(h, _) {
      var v = _ || {},
        m = v.root || "Root Entry";
      if (
        (h.FullPaths || (h.FullPaths = []),
        h.FileIndex || (h.FileIndex = []),
        h.FullPaths.length !== h.FileIndex.length)
      )
        throw new Error("inconsistent CFB structure");
      (h.FullPaths.length === 0 &&
        ((h.FullPaths[0] = m + "/"), (h.FileIndex[0] = { name: m, type: 5 })),
        v.CLSID && (h.FileIndex[0].clsid = v.CLSID),
        L(h));
    }
    function L(h) {
      var _ = "Sh33tJ5";
      if (!Ee.find(h, "/" + _)) {
        var v = b(4);
        ((v[0] = 55),
          (v[1] = v[3] = 50),
          (v[2] = 54),
          h.FileIndex.push({ name: _, type: 2, content: v, size: 4, L: 69, R: 69, C: 69 }),
          h.FullPaths.push(h.FullPaths[0] + _),
          N(h));
      }
    }
    function N(h, _) {
      F(h);
      for (var v = !1, m = !1, E = h.FullPaths.length - 1; E >= 0; --E) {
        var w = h.FileIndex[E];
        switch (w.type) {
          case 0:
            m ? (v = !0) : (h.FileIndex.pop(), h.FullPaths.pop());
            break;
          case 1:
          case 2:
          case 5:
            ((m = !0),
              isNaN(w.R * w.L * w.C) && (v = !0),
              w.R > -1 && w.L > -1 && w.R == w.L && (v = !0));
            break;
          default:
            v = !0;
            break;
        }
      }
      if (!(!v && !_)) {
        var I = new Date(1987, 1, 19),
          W = 0,
          R = Object.create ? Object.create(null) : {},
          k = [];
        for (E = 0; E < h.FullPaths.length; ++E)
          ((R[h.FullPaths[E]] = !0),
            h.FileIndex[E].type !== 0 && k.push([h.FullPaths[E], h.FileIndex[E]]));
        for (E = 0; E < k.length; ++E) {
          var P = n(k[E][0]);
          ((m = R[P]),
            m ||
              (k.push([
                P,
                { name: a(P).replace("/", ""), type: 1, clsid: be, ct: I, mt: I, content: null },
              ]),
              (R[P] = !0)));
        }
        for (
          k.sort(function (te, Y) {
            return r(te[0], Y[0]);
          }),
            h.FullPaths = [],
            h.FileIndex = [],
            E = 0;
          E < k.length;
          ++E
        )
          ((h.FullPaths[E] = k[E][0]), (h.FileIndex[E] = k[E][1]));
        for (E = 0; E < k.length; ++E) {
          var z = h.FileIndex[E],
            Z = h.FullPaths[E];
          if (
            ((z.name = a(Z).replace("/", "")),
            (z.L = z.R = z.C = -(z.color = 1)),
            (z.size = z.content ? z.content.length : 0),
            (z.start = 0),
            (z.clsid = z.clsid || be),
            E === 0)
          )
            ((z.C = k.length > 1 ? 1 : -1), (z.size = 0), (z.type = 5));
          else if (Z.slice(-1) == "/") {
            for (W = E + 1; W < k.length && n(h.FullPaths[W]) != Z; ++W);
            for (
              z.C = W >= k.length ? -1 : W, W = E + 1;
              W < k.length && n(h.FullPaths[W]) != n(Z);
              ++W
            );
            ((z.R = W >= k.length ? -1 : W), (z.type = 1));
          } else (n(h.FullPaths[E + 1] || "") == n(Z) && (z.R = E + 1), (z.type = 2));
        }
      }
    }
    function V(h, _) {
      var v = _ || {};
      if (v.fileType == "mad") return ts(h, v);
      if ((N(h), v.fileType === "zip")) return ji(h, v);
      var m = (function (te) {
          for (var Y = 0, ee = 0, le = 0; le < te.FileIndex.length; ++le) {
            var Ae = te.FileIndex[le];
            if (Ae.content) {
              var Fe = Ae.content.length;
              Fe > 0 && (Fe < 4096 ? (Y += (Fe + 63) >> 6) : (ee += (Fe + 511) >> 9));
            }
          }
          for (
            var ze = (te.FullPaths.length + 3) >> 2,
              vt = (Y + 7) >> 3,
              mt = (Y + 127) >> 7,
              gt = vt + ee + ze + mt,
              Gr = (gt + 127) >> 7,
              On = Gr <= 109 ? 0 : Math.ceil((Gr - 109) / 127);
            (gt + Gr + On + 127) >> 7 > Gr;
          )
            On = ++Gr <= 109 ? 0 : Math.ceil((Gr - 109) / 127);
          var yr = [1, On, Gr, mt, ze, ee, Y, 0];
          return (
            (te.FileIndex[0].size = Y << 6),
            (yr[7] =
              (te.FileIndex[0].start = yr[0] + yr[1] + yr[2] + yr[3] + yr[4] + yr[5]) +
              ((yr[6] + 7) >> 3)),
            yr
          );
        })(h),
        E = b(m[7] << 9),
        w = 0,
        I = 0;
      {
        for (w = 0; w < 8; ++w) E.write_shift(1, oe[w]);
        for (w = 0; w < 8; ++w) E.write_shift(2, 0);
        for (
          E.write_shift(2, 62),
            E.write_shift(2, 3),
            E.write_shift(2, 65534),
            E.write_shift(2, 9),
            E.write_shift(2, 6),
            w = 0;
          w < 3;
          ++w
        )
          E.write_shift(2, 0);
        for (
          E.write_shift(4, 0),
            E.write_shift(4, m[2]),
            E.write_shift(4, m[0] + m[1] + m[2] + m[3] - 1),
            E.write_shift(4, 0),
            E.write_shift(4, 4096),
            E.write_shift(4, m[3] ? m[0] + m[1] + m[2] - 1 : re),
            E.write_shift(4, m[3]),
            E.write_shift(-4, m[1] ? m[0] - 1 : re),
            E.write_shift(4, m[1]),
            w = 0;
          w < 109;
          ++w
        )
          E.write_shift(-4, w < m[2] ? m[1] + w : -1);
      }
      if (m[1])
        for (I = 0; I < m[1]; ++I) {
          for (; w < 236 + I * 127; ++w) E.write_shift(-4, w < m[2] ? m[1] + w : -1);
          E.write_shift(-4, I === m[1] - 1 ? re : I + 1);
        }
      var W = function (te) {
        for (I += te; w < I - 1; ++w) E.write_shift(-4, w + 1);
        te && (++w, E.write_shift(-4, re));
      };
      for (I = w = 0, I += m[1]; w < I; ++w) E.write_shift(-4, De.DIFSECT);
      for (I += m[2]; w < I; ++w) E.write_shift(-4, De.FATSECT);
      (W(m[3]), W(m[4]));
      for (var R = 0, k = 0, P = h.FileIndex[0]; R < h.FileIndex.length; ++R)
        ((P = h.FileIndex[R]),
          P.content && ((k = P.content.length), !(k < 4096) && ((P.start = I), W((k + 511) >> 9))));
      for (W((m[6] + 7) >> 3); E.l & 511; ) E.write_shift(-4, De.ENDOFCHAIN);
      for (I = w = 0, R = 0; R < h.FileIndex.length; ++R)
        ((P = h.FileIndex[R]),
          P.content &&
            ((k = P.content.length), !(!k || k >= 4096) && ((P.start = I), W((k + 63) >> 6))));
      for (; E.l & 511; ) E.write_shift(-4, De.ENDOFCHAIN);
      for (w = 0; w < m[4] << 2; ++w) {
        var z = h.FullPaths[w];
        if (!z || z.length === 0) {
          for (R = 0; R < 17; ++R) E.write_shift(4, 0);
          for (R = 0; R < 3; ++R) E.write_shift(4, -1);
          for (R = 0; R < 12; ++R) E.write_shift(4, 0);
          continue;
        }
        ((P = h.FileIndex[w]), w === 0 && (P.start = P.size ? P.start - 1 : re));
        var Z = (w === 0 && v.root) || P.name;
        if (
          ((k = 2 * (Z.length + 1)),
          E.write_shift(64, Z, "utf16le"),
          E.write_shift(2, k),
          E.write_shift(1, P.type),
          E.write_shift(1, P.color),
          E.write_shift(-4, P.L),
          E.write_shift(-4, P.R),
          E.write_shift(-4, P.C),
          P.clsid)
        )
          E.write_shift(16, P.clsid, "hex");
        else for (R = 0; R < 4; ++R) E.write_shift(4, 0);
        (E.write_shift(4, P.state || 0),
          E.write_shift(4, 0),
          E.write_shift(4, 0),
          E.write_shift(4, 0),
          E.write_shift(4, 0),
          E.write_shift(4, P.start),
          E.write_shift(4, P.size),
          E.write_shift(4, 0));
      }
      for (w = 1; w < h.FileIndex.length; ++w)
        if (((P = h.FileIndex[w]), P.size >= 4096))
          if (((E.l = (P.start + 1) << 9), de && Buffer.isBuffer(P.content)))
            (P.content.copy(E, E.l, 0, P.size), (E.l += (P.size + 511) & -512));
          else {
            for (R = 0; R < P.size; ++R) E.write_shift(1, P.content[R]);
            for (; R & 511; ++R) E.write_shift(1, 0);
          }
      for (w = 1; w < h.FileIndex.length; ++w)
        if (((P = h.FileIndex[w]), P.size > 0 && P.size < 4096))
          if (de && Buffer.isBuffer(P.content))
            (P.content.copy(E, E.l, 0, P.size), (E.l += (P.size + 63) & -64));
          else {
            for (R = 0; R < P.size; ++R) E.write_shift(1, P.content[R]);
            for (; R & 63; ++R) E.write_shift(1, 0);
          }
      if (de) E.l = E.length;
      else for (; E.l < E.length; ) E.write_shift(1, 0);
      return E;
    }
    function U(h, _) {
      var v = h.FullPaths.map(function (R) {
          return R.toUpperCase();
        }),
        m = v.map(function (R) {
          var k = R.split("/");
          return k[k.length - (R.slice(-1) == "/" ? 2 : 1)];
        }),
        E = !1;
      _.charCodeAt(0) === 47
        ? ((E = !0), (_ = v[0].slice(0, -1) + _))
        : (E = _.indexOf("/") !== -1);
      var w = _.toUpperCase(),
        I = E === !0 ? v.indexOf(w) : m.indexOf(w);
      if (I !== -1) return h.FileIndex[I];
      var W = !w.match(Yt);
      for (w = w.replace(St, ""), W && (w = w.replace(Yt, "!")), I = 0; I < v.length; ++I)
        if (
          (W ? v[I].replace(Yt, "!") : v[I]).replace(St, "") == w ||
          (W ? m[I].replace(Yt, "!") : m[I]).replace(St, "") == w
        )
          return h.FileIndex[I];
      return null;
    }
    var X = 64,
      re = -2,
      Te = "d0cf11e0a1b11ae1",
      oe = [208, 207, 17, 224, 161, 177, 26, 225],
      be = "00000000000000000000000000000000",
      De = {
        MAXREGSECT: -6,
        DIFSECT: -4,
        FATSECT: -3,
        ENDOFCHAIN: re,
        FREESECT: -1,
        HEADER_SIGNATURE: Te,
        HEADER_MINOR_VERSION: "3e00",
        MAXREGSID: -6,
        NOSTREAM: -1,
        HEADER_CLSID: be,
        EntryTypes: ["unknown", "storage", "stream", "lockbytes", "property", "root"],
      };
    function dr(h, _, v) {
      l();
      var m = V(h, v);
      o.writeFileSync(_, m);
    }
    function Pe(h) {
      for (var _ = new Array(h.length), v = 0; v < h.length; ++v) _[v] = String.fromCharCode(h[v]);
      return _.join("");
    }
    function lr(h, _) {
      var v = V(h, _);
      switch ((_ && _.type) || "buffer") {
        case "file":
          return (l(), o.writeFileSync(_.filename, v), v);
        case "binary":
          return typeof v == "string" ? v : Pe(v);
        case "base64":
          return Rt(typeof v == "string" ? v : Pe(v));
        case "buffer":
          if (de) return Buffer.isBuffer(v) ? v : Nr(v);
        case "array":
          return typeof v == "string" ? mr(v) : v;
      }
      return v;
    }
    var tr;
    function S(h) {
      try {
        var _ = h.InflateRaw,
          v = new _();
        if ((v._processChunk(new Uint8Array([3, 0]), v._finishFlushFlag), v.bytesRead)) tr = h;
        else throw new Error("zlib does not expose bytesRead");
      } catch (m) {
        console.error("cannot use native zlib: " + (m.message || m));
      }
    }
    function M(h, _) {
      if (!tr) return g0(h, _);
      var v = tr.InflateRaw,
        m = new v(),
        E = m._processChunk(h.slice(h.l), m._finishFlushFlag);
      return ((h.l += m.bytesRead), E);
    }
    function y(h) {
      return tr ? tr.deflateRawSync(h) : u0(h);
    }
    var A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
      G = [
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115,
        131, 163, 195, 227, 258,
      ],
      ie = [
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
        2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577,
      ];
    function se(h) {
      var _ = (((h << 1) | (h << 11)) & 139536) | (((h << 5) | (h << 15)) & 558144);
      return ((_ >> 16) | (_ >> 8) | _) & 255;
    }
    for (
      var ae = typeof Uint8Array < "u", Q = ae ? new Uint8Array(256) : [], we = 0;
      we < 256;
      ++we
    )
      Q[we] = se(we);
    function ue(h, _) {
      var v = Q[h & 255];
      return _ <= 8
        ? v >>> (8 - _)
        : ((v = (v << 8) | Q[(h >> 8) & 255]),
          _ <= 16 ? v >>> (16 - _) : ((v = (v << 8) | Q[(h >> 16) & 255]), v >>> (24 - _)));
    }
    function $e(h, _) {
      var v = _ & 7,
        m = _ >>> 3;
      return ((h[m] | (v <= 6 ? 0 : h[m + 1] << 8)) >>> v) & 3;
    }
    function pe(h, _) {
      var v = _ & 7,
        m = _ >>> 3;
      return ((h[m] | (v <= 5 ? 0 : h[m + 1] << 8)) >>> v) & 7;
    }
    function Ar(h, _) {
      var v = _ & 7,
        m = _ >>> 3;
      return ((h[m] | (v <= 4 ? 0 : h[m + 1] << 8)) >>> v) & 15;
    }
    function ye(h, _) {
      var v = _ & 7,
        m = _ >>> 3;
      return ((h[m] | (v <= 3 ? 0 : h[m + 1] << 8)) >>> v) & 31;
    }
    function ne(h, _) {
      var v = _ & 7,
        m = _ >>> 3;
      return ((h[m] | (v <= 1 ? 0 : h[m + 1] << 8)) >>> v) & 127;
    }
    function or(h, _, v) {
      var m = _ & 7,
        E = _ >>> 3,
        w = (1 << v) - 1,
        I = h[E] >>> m;
      return (
        v < 8 - m ||
          ((I |= h[E + 1] << (8 - m)), v < 16 - m) ||
          ((I |= h[E + 2] << (16 - m)), v < 24 - m) ||
          (I |= h[E + 3] << (24 - m)),
        I & w
      );
    }
    function Fr(h, _, v) {
      var m = _ & 7,
        E = _ >>> 3;
      return (
        m <= 5
          ? (h[E] |= (v & 7) << m)
          : ((h[E] |= (v << m) & 255), (h[E + 1] = (v & 7) >> (8 - m))),
        _ + 3
      );
    }
    function Hr(h, _, v) {
      var m = _ & 7,
        E = _ >>> 3;
      return ((v = (v & 1) << m), (h[E] |= v), _ + 1);
    }
    function rt(h, _, v) {
      var m = _ & 7,
        E = _ >>> 3;
      return ((v <<= m), (h[E] |= v & 255), (v >>>= 8), (h[E + 1] = v), _ + 8);
    }
    function h0(h, _, v) {
      var m = _ & 7,
        E = _ >>> 3;
      return (
        (v <<= m), (h[E] |= v & 255), (v >>>= 8), (h[E + 1] = v & 255), (h[E + 2] = v >>> 8), _ + 16
      );
    }
    function An(h, _) {
      var v = h.length,
        m = 2 * v > _ ? 2 * v : _ + 5,
        E = 0;
      if (v >= _) return h;
      if (de) {
        var w = y0(m);
        if (h.copy) h.copy(w);
        else for (; E < h.length; ++E) w[E] = h[E];
        return w;
      } else if (ae) {
        var I = new Uint8Array(m);
        if (I.set) I.set(h);
        else for (; E < v; ++E) I[E] = h[E];
        return I;
      }
      return ((h.length = m), h);
    }
    function Tr(h) {
      for (var _ = new Array(h), v = 0; v < h; ++v) _[v] = 0;
      return _;
    }
    function Vt(h, _, v) {
      var m = 1,
        E = 0,
        w = 0,
        I = 0,
        W = 0,
        R = h.length,
        k = ae ? new Uint16Array(32) : Tr(32);
      for (w = 0; w < 32; ++w) k[w] = 0;
      for (w = R; w < v; ++w) h[w] = 0;
      R = h.length;
      var P = ae ? new Uint16Array(R) : Tr(R);
      for (w = 0; w < R; ++w) (k[(E = h[w])]++, m < E && (m = E), (P[w] = 0));
      for (k[0] = 0, w = 1; w <= m; ++w) k[w + 16] = W = (W + k[w - 1]) << 1;
      for (w = 0; w < R; ++w) ((W = h[w]), W != 0 && (P[w] = k[W + 16]++));
      var z = 0;
      for (w = 0; w < R; ++w)
        if (((z = h[w]), z != 0))
          for (W = ue(P[w], m) >> (m - z), I = (1 << (m + 4 - z)) - 1; I >= 0; --I)
            _[W | (I << z)] = (z & 15) | (w << 4);
      return m;
    }
    var Fn = ae ? new Uint16Array(512) : Tr(512),
      yn = ae ? new Uint16Array(32) : Tr(32);
    if (!ae) {
      for (var Vr = 0; Vr < 512; ++Vr) Fn[Vr] = 0;
      for (Vr = 0; Vr < 32; ++Vr) yn[Vr] = 0;
    }
    (function () {
      for (var h = [], _ = 0; _ < 32; _++) h.push(5);
      Vt(h, yn, 32);
      var v = [];
      for (_ = 0; _ <= 143; _++) v.push(8);
      for (; _ <= 255; _++) v.push(9);
      for (; _ <= 279; _++) v.push(7);
      for (; _ <= 287; _++) v.push(8);
      Vt(v, Fn, 288);
    })();
    var zi = (function () {
      for (var _ = ae ? new Uint8Array(32768) : [], v = 0, m = 0; v < ie.length - 1; ++v)
        for (; m < ie[v + 1]; ++m) _[m] = v;
      for (; m < 32768; ++m) _[m] = 29;
      var E = ae ? new Uint8Array(259) : [];
      for (v = 0, m = 0; v < G.length - 1; ++v) for (; m < G[v + 1]; ++m) E[m] = v;
      function w(W, R) {
        for (var k = 0; k < W.length; ) {
          var P = Math.min(65535, W.length - k),
            z = k + P == W.length;
          for (R.write_shift(1, +z), R.write_shift(2, P), R.write_shift(2, ~P & 65535); P-- > 0; )
            R[R.l++] = W[k++];
        }
        return R.l;
      }
      function I(W, R) {
        for (var k = 0, P = 0, z = ae ? new Uint16Array(32768) : []; P < W.length; ) {
          var Z = Math.min(65535, W.length - P);
          if (Z < 10) {
            for (
              k = Fr(R, k, +(P + Z == W.length)),
                k & 7 && (k += 8 - (k & 7)),
                R.l = (k / 8) | 0,
                R.write_shift(2, Z),
                R.write_shift(2, ~Z & 65535);
              Z-- > 0;
            )
              R[R.l++] = W[P++];
            k = R.l * 8;
            continue;
          }
          k = Fr(R, k, +(P + Z == W.length) + 2);
          for (var te = 0; Z-- > 0; ) {
            var Y = W[P];
            te = ((te << 5) ^ Y) & 32767;
            var ee = -1,
              le = 0;
            if ((ee = z[te]) && ((ee |= P & -32768), ee > P && (ee -= 32768), ee < P))
              for (; W[ee + le] == W[P + le] && le < 250; ) ++le;
            if (le > 2) {
              ((Y = E[le]),
                Y <= 22
                  ? (k = rt(R, k, Q[Y + 1] >> 1) - 1)
                  : (rt(R, k, 3), (k += 5), rt(R, k, Q[Y - 23] >> 5), (k += 3)));
              var Ae = Y < 8 ? 0 : (Y - 4) >> 2;
              (Ae > 0 && (h0(R, k, le - G[Y]), (k += Ae)),
                (Y = _[P - ee]),
                (k = rt(R, k, Q[Y] >> 3)),
                (k -= 3));
              var Fe = Y < 4 ? 0 : (Y - 2) >> 1;
              Fe > 0 && (h0(R, k, P - ee - ie[Y]), (k += Fe));
              for (var ze = 0; ze < le; ++ze)
                ((z[te] = P & 32767), (te = ((te << 5) ^ W[P]) & 32767), ++P);
              Z -= le - 1;
            } else
              (Y <= 143 ? (Y = Y + 48) : (k = Hr(R, k, 1)),
                (k = rt(R, k, Q[Y])),
                (z[te] = P & 32767),
                ++P);
          }
          k = rt(R, k, 0) - 1;
        }
        return ((R.l = ((k + 7) / 8) | 0), R.l);
      }
      return function (R, k) {
        return R.length < 8 ? w(R, k) : I(R, k);
      };
    })();
    function u0(h) {
      var _ = b(50 + Math.floor(h.length * 1.1)),
        v = zi(h, _);
      return _.slice(0, v);
    }
    var x0 = ae ? new Uint16Array(32768) : Tr(32768),
      d0 = ae ? new Uint16Array(32768) : Tr(32768),
      p0 = ae ? new Uint16Array(128) : Tr(128),
      v0 = 1,
      m0 = 1;
    function Ki(h, _) {
      var v = ye(h, _) + 257;
      _ += 5;
      var m = ye(h, _) + 1;
      _ += 5;
      var E = Ar(h, _) + 4;
      _ += 4;
      for (
        var w = 0,
          I = ae ? new Uint8Array(19) : Tr(19),
          W = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          R = 1,
          k = ae ? new Uint8Array(8) : Tr(8),
          P = ae ? new Uint8Array(8) : Tr(8),
          z = I.length,
          Z = 0;
        Z < E;
        ++Z
      )
        ((I[A[Z]] = w = pe(h, _)), R < w && (R = w), k[w]++, (_ += 3));
      var te = 0;
      for (k[0] = 0, Z = 1; Z <= R; ++Z) P[Z] = te = (te + k[Z - 1]) << 1;
      for (Z = 0; Z < z; ++Z) (te = I[Z]) != 0 && (W[Z] = P[te]++);
      var Y = 0;
      for (Z = 0; Z < z; ++Z)
        if (((Y = I[Z]), Y != 0)) {
          te = Q[W[Z]] >> (8 - Y);
          for (var ee = (1 << (7 - Y)) - 1; ee >= 0; --ee) p0[te | (ee << Y)] = (Y & 7) | (Z << 3);
        }
      var le = [];
      for (R = 1; le.length < v + m; )
        switch (((te = p0[ne(h, _)]), (_ += te & 7), (te >>>= 3))) {
          case 16:
            for (w = 3 + $e(h, _), _ += 2, te = le[le.length - 1]; w-- > 0; ) le.push(te);
            break;
          case 17:
            for (w = 3 + pe(h, _), _ += 3; w-- > 0; ) le.push(0);
            break;
          case 18:
            for (w = 11 + ne(h, _), _ += 7; w-- > 0; ) le.push(0);
            break;
          default:
            (le.push(te), R < te && (R = te));
            break;
        }
      var Ae = le.slice(0, v),
        Fe = le.slice(v);
      for (Z = v; Z < 286; ++Z) Ae[Z] = 0;
      for (Z = m; Z < 30; ++Z) Fe[Z] = 0;
      return ((v0 = Vt(Ae, x0, 286)), (m0 = Vt(Fe, d0, 30)), _);
    }
    function Yi(h, _) {
      if (h[0] == 3 && !(h[1] & 3)) return [Yr(_), 2];
      for (
        var v = 0, m = 0, E = y0(_ || 1 << 18), w = 0, I = E.length >>> 0, W = 0, R = 0;
        (m & 1) == 0;
      ) {
        if (((m = pe(h, v)), (v += 3), m >>> 1))
          m >> 1 == 1 ? ((W = 9), (R = 5)) : ((v = Ki(h, v)), (W = v0), (R = m0));
        else {
          v & 7 && (v += 8 - (v & 7));
          var k = h[v >>> 3] | (h[(v >>> 3) + 1] << 8);
          if (((v += 32), k > 0))
            for (!_ && I < w + k && ((E = An(E, w + k)), (I = E.length)); k-- > 0; )
              ((E[w++] = h[v >>> 3]), (v += 8));
          continue;
        }
        for (;;) {
          !_ && I < w + 32767 && ((E = An(E, w + 32767)), (I = E.length));
          var P = or(h, v, W),
            z = m >>> 1 == 1 ? Fn[P] : x0[P];
          if (((v += z & 15), (z >>>= 4), ((z >>> 8) & 255) === 0)) E[w++] = z;
          else {
            if (z == 256) break;
            z -= 257;
            var Z = z < 8 ? 0 : (z - 4) >> 2;
            Z > 5 && (Z = 0);
            var te = w + G[z];
            (Z > 0 && ((te += or(h, v, Z)), (v += Z)),
              (P = or(h, v, R)),
              (z = m >>> 1 == 1 ? yn[P] : d0[P]),
              (v += z & 15),
              (z >>>= 4));
            var Y = z < 4 ? 0 : (z - 2) >> 1,
              ee = ie[z];
            for (
              Y > 0 && ((ee += or(h, v, Y)), (v += Y)),
                !_ && I < te && ((E = An(E, te + 100)), (I = E.length));
              w < te;
            )
              ((E[w] = E[w - ee]), ++w);
          }
        }
      }
      return _ ? [E, (v + 7) >>> 3] : [E.slice(0, w), (v + 7) >>> 3];
    }
    function g0(h, _) {
      var v = h.slice(h.l || 0),
        m = Yi(v, _);
      return ((h.l += m[1]), m[0]);
    }
    function _0(h, _) {
      if (h) typeof console < "u" && console.error(_);
      else throw new Error(_);
    }
    function T0(h, _) {
      var v = h;
      ar(v, 0);
      var m = [],
        E = [],
        w = { FileIndex: m, FullPaths: E };
      F(w, { root: _.root });
      for (
        var I = v.length - 4;
        (v[I] != 80 || v[I + 1] != 75 || v[I + 2] != 5 || v[I + 3] != 6) && I >= 0;
      )
        --I;
      ((v.l = I + 4), (v.l += 4));
      var W = v.read_shift(2);
      v.l += 6;
      var R = v.read_shift(4);
      for (v.l = R, I = 0; I < W; ++I) {
        v.l += 20;
        var k = v.read_shift(4),
          P = v.read_shift(4),
          z = v.read_shift(2),
          Z = v.read_shift(2),
          te = v.read_shift(2);
        v.l += 8;
        var Y = v.read_shift(4),
          ee = f(v.slice(v.l + z, v.l + z + Z));
        v.l += z + Z + te;
        var le = v.l;
        ((v.l = Y + 4), $i(v, k, P, w, ee), (v.l = le));
      }
      return w;
    }
    function $i(h, _, v, m, E) {
      h.l += 2;
      var w = h.read_shift(2),
        I = h.read_shift(2),
        W = s(h);
      if (w & 8257) throw new Error("Unsupported ZIP encryption");
      for (
        var R = h.read_shift(4),
          k = h.read_shift(4),
          P = h.read_shift(4),
          z = h.read_shift(2),
          Z = h.read_shift(2),
          te = "",
          Y = 0;
        Y < z;
        ++Y
      )
        te += String.fromCharCode(h[h.l++]);
      if (Z) {
        var ee = f(h.slice(h.l, h.l + Z));
        ((ee[21589] || {}).mt && (W = ee[21589].mt),
          ((E || {})[21589] || {}).mt && (W = E[21589].mt));
      }
      h.l += Z;
      var le = h.slice(h.l, h.l + k);
      switch (I) {
        case 8:
          le = M(h, P);
          break;
        case 0:
          break;
        default:
          throw new Error("Unsupported ZIP Compression method " + I);
      }
      var Ae = !1;
      (w & 8 &&
        ((R = h.read_shift(4)),
        R == 134695760 && ((R = h.read_shift(4)), (Ae = !0)),
        (k = h.read_shift(4)),
        (P = h.read_shift(4))),
        k != _ && _0(Ae, "Bad compressed size: " + _ + " != " + k),
        P != v && _0(Ae, "Bad uncompressed size: " + v + " != " + P),
        Cn(m, te, le, { unsafe: !0, mt: W }));
    }
    function ji(h, _) {
      var v = _ || {},
        m = [],
        E = [],
        w = b(1),
        I = v.compression ? 8 : 0,
        W = 0,
        R = 0,
        k = 0,
        P = 0,
        z = 0,
        Z = h.FullPaths[0],
        te = Z,
        Y = h.FileIndex[0],
        ee = [],
        le = 0;
      for (R = 1; R < h.FullPaths.length; ++R)
        if (
          ((te = h.FullPaths[R].slice(Z.length)),
          (Y = h.FileIndex[R]),
          !(!Y.size || !Y.content || te == "Sh33tJ5"))
        ) {
          var Ae = P,
            Fe = b(te.length);
          for (k = 0; k < te.length; ++k) Fe.write_shift(1, te.charCodeAt(k) & 127);
          ((Fe = Fe.slice(0, Fe.l)), (ee[z] = Js.buf(Y.content, 0)));
          var ze = Y.content;
          (I == 8 && (ze = y(ze)),
            (w = b(30)),
            w.write_shift(4, 67324752),
            w.write_shift(2, 20),
            w.write_shift(2, W),
            w.write_shift(2, I),
            Y.mt ? i(w, Y.mt) : w.write_shift(4, 0),
            w.write_shift(-4, ee[z]),
            w.write_shift(4, ze.length),
            w.write_shift(4, Y.content.length),
            w.write_shift(2, Fe.length),
            w.write_shift(2, 0),
            (P += w.length),
            m.push(w),
            (P += Fe.length),
            m.push(Fe),
            (P += ze.length),
            m.push(ze),
            (w = b(46)),
            w.write_shift(4, 33639248),
            w.write_shift(2, 0),
            w.write_shift(2, 20),
            w.write_shift(2, W),
            w.write_shift(2, I),
            w.write_shift(4, 0),
            w.write_shift(-4, ee[z]),
            w.write_shift(4, ze.length),
            w.write_shift(4, Y.content.length),
            w.write_shift(2, Fe.length),
            w.write_shift(2, 0),
            w.write_shift(2, 0),
            w.write_shift(2, 0),
            w.write_shift(2, 0),
            w.write_shift(4, 0),
            w.write_shift(4, Ae),
            (le += w.l),
            E.push(w),
            (le += Fe.length),
            E.push(Fe),
            ++z);
        }
      return (
        (w = b(22)),
        w.write_shift(4, 101010256),
        w.write_shift(2, 0),
        w.write_shift(2, 0),
        w.write_shift(2, z),
        w.write_shift(2, z),
        w.write_shift(4, le),
        w.write_shift(4, P),
        w.write_shift(2, 0),
        He([He(m), He(E), w])
      );
    }
    var Gt = {
      htm: "text/html",
      xml: "text/xml",
      gif: "image/gif",
      jpg: "image/jpeg",
      png: "image/png",
      mso: "application/x-mso",
      thmx: "application/vnd.ms-officetheme",
      sh33tj5: "application/octet-stream",
    };
    function Ji(h, _) {
      if (h.ctype) return h.ctype;
      var v = h.name || "",
        m = v.match(/\.([^\.]+)$/);
      return (m && Gt[m[1]]) || (_ && ((m = (v = _).match(/[\.\\]([^\.\\])+$/)), m && Gt[m[1]]))
        ? Gt[m[1]]
        : "application/octet-stream";
    }
    function Zi(h) {
      for (var _ = Rt(h), v = [], m = 0; m < _.length; m += 76) v.push(_.slice(m, m + 76));
      return (
        v.join(`\r
`) +
        `\r
`
      );
    }
    function qi(h) {
      var _ = h.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function (k) {
        var P = k.charCodeAt(0).toString(16).toUpperCase();
        return "=" + (P.length == 1 ? "0" + P : P);
      });
      ((_ = _.replace(/ $/gm, "=20").replace(/\t$/gm, "=09")),
        _.charAt(0) ==
          `
` && (_ = "=0D" + _.slice(1)),
        (_ = _.replace(/\r(?!\n)/gm, "=0D")
          .replace(
            /\n\n/gm,
            `
=0A`,
          )
          .replace(/([^\r\n])\n/gm, "$1=0A")));
      for (
        var v = [],
          m = _.split(`\r
`),
          E = 0;
        E < m.length;
        ++E
      ) {
        var w = m[E];
        if (w.length == 0) {
          v.push("");
          continue;
        }
        for (var I = 0; I < w.length; ) {
          var W = 76,
            R = w.slice(I, I + W);
          (R.charAt(W - 1) == "="
            ? W--
            : R.charAt(W - 2) == "="
              ? (W -= 2)
              : R.charAt(W - 3) == "=" && (W -= 3),
            (R = w.slice(I, I + W)),
            (I += W),
            I < w.length && (R += "="),
            v.push(R));
        }
      }
      return v.join(`\r
`);
    }
    function Qi(h) {
      for (var _ = [], v = 0; v < h.length; ++v) {
        for (var m = h[v]; v <= h.length && m.charAt(m.length - 1) == "="; )
          m = m.slice(0, m.length - 1) + h[++v];
        _.push(m);
      }
      for (var E = 0; E < _.length; ++E)
        _[E] = _[E].replace(/[=][0-9A-Fa-f]{2}/g, function (w) {
          return String.fromCharCode(parseInt(w.slice(1), 16));
        });
      return mr(
        _.join(`\r
`),
      );
    }
    function es(h, _, v) {
      for (var m = "", E = "", w = "", I, W = 0; W < 10; ++W) {
        var R = _[W];
        if (!R || R.match(/^\s*$/)) break;
        var k = R.match(/^(.*?):\s*([^\s].*)$/);
        if (k)
          switch (k[1].toLowerCase()) {
            case "content-location":
              m = k[2].trim();
              break;
            case "content-type":
              w = k[2].trim();
              break;
            case "content-transfer-encoding":
              E = k[2].trim();
              break;
          }
      }
      switch ((++W, E.toLowerCase())) {
        case "base64":
          I = mr(Ir(_.slice(W).join("")));
          break;
        case "quoted-printable":
          I = Qi(_.slice(W));
          break;
        default:
          throw new Error("Unsupported Content-Transfer-Encoding " + E);
      }
      var P = Cn(h, m.slice(v.length), I, { unsafe: !0 });
      w && (P.ctype = w);
    }
    function rs(h, _) {
      if (Pe(h.slice(0, 13)).toLowerCase() != "mime-version:")
        throw new Error("Unsupported MAD header");
      var v = (_ && _.root) || "",
        m = (de && Buffer.isBuffer(h) ? h.toString("binary") : Pe(h)).split(`\r
`),
        E = 0,
        w = "";
      for (E = 0; E < m.length; ++E)
        if (
          ((w = m[E]),
          !!/^Content-Location:/i.test(w) &&
            ((w = w.slice(w.indexOf("file"))),
            v || (v = w.slice(0, w.lastIndexOf("/") + 1)),
            w.slice(0, v.length) != v))
        )
          for (
            ;
            v.length > 0 &&
            ((v = v.slice(0, v.length - 1)),
            (v = v.slice(0, v.lastIndexOf("/") + 1)),
            w.slice(0, v.length) != v);
          );
      var I = (m[1] || "").match(/boundary="(.*?)"/);
      if (!I) throw new Error("MAD cannot find boundary");
      var W = "--" + (I[1] || ""),
        R = [],
        k = [],
        P = { FileIndex: R, FullPaths: k };
      F(P);
      var z,
        Z = 0;
      for (E = 0; E < m.length; ++E) {
        var te = m[E];
        (te !== W && te !== W + "--") || (Z++ && es(P, m.slice(z, E), v), (z = E));
      }
      return P;
    }
    function ts(h, _) {
      var v = _ || {},
        m = v.boundary || "SheetJS";
      m = "------=" + m;
      for (
        var E = [
            "MIME-Version: 1.0",
            'Content-Type: multipart/related; boundary="' + m.slice(2) + '"',
            "",
            "",
            "",
          ],
          w = h.FullPaths[0],
          I = w,
          W = h.FileIndex[0],
          R = 1;
        R < h.FullPaths.length;
        ++R
      )
        if (
          ((I = h.FullPaths[R].slice(w.length)),
          (W = h.FileIndex[R]),
          !(!W.size || !W.content || I == "Sh33tJ5"))
        ) {
          I = I.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function (le) {
            return "_x" + le.charCodeAt(0).toString(16) + "_";
          }).replace(/[\u0080-\uFFFF]/g, function (le) {
            return "_u" + le.charCodeAt(0).toString(16) + "_";
          });
          for (
            var k = W.content,
              P = de && Buffer.isBuffer(k) ? k.toString("binary") : Pe(k),
              z = 0,
              Z = Math.min(1024, P.length),
              te = 0,
              Y = 0;
            Y <= Z;
            ++Y
          )
            (te = P.charCodeAt(Y)) >= 32 && te < 128 && ++z;
          var ee = z >= (Z * 4) / 5;
          (E.push(m),
            E.push("Content-Location: " + (v.root || "file:///C:/SheetJS/") + I),
            E.push("Content-Transfer-Encoding: " + (ee ? "quoted-printable" : "base64")),
            E.push("Content-Type: " + Ji(W, I)),
            E.push(""),
            E.push(ee ? qi(P) : Zi(P)));
        }
      return (
        E.push(
          m +
            `--\r
`,
        ),
        E.join(`\r
`)
      );
    }
    function ns(h) {
      var _ = {};
      return (F(_, h), _);
    }
    function Cn(h, _, v, m) {
      var E = m && m.unsafe;
      E || F(h);
      var w = !E && Ee.find(h, _);
      if (!w) {
        var I = h.FullPaths[0];
        (_.slice(0, I.length) == I
          ? (I = _)
          : (I.slice(-1) != "/" && (I += "/"), (I = (I + _).replace("//", "/"))),
          (w = { name: a(_), type: 2 }),
          h.FileIndex.push(w),
          h.FullPaths.push(I),
          E || Ee.utils.cfb_gc(h));
      }
      return (
        (w.content = v),
        (w.size = v ? v.length : 0),
        m && (m.CLSID && (w.clsid = m.CLSID), m.mt && (w.mt = m.mt), m.ct && (w.ct = m.ct)),
        w
      );
    }
    function as(h, _) {
      F(h);
      var v = Ee.find(h, _);
      if (v) {
        for (var m = 0; m < h.FileIndex.length; ++m)
          if (h.FileIndex[m] == v) return (h.FileIndex.splice(m, 1), h.FullPaths.splice(m, 1), !0);
      }
      return !1;
    }
    function is(h, _, v) {
      F(h);
      var m = Ee.find(h, _);
      if (m) {
        for (var E = 0; E < h.FileIndex.length; ++E)
          if (h.FileIndex[E] == m) return ((h.FileIndex[E].name = a(v)), (h.FullPaths[E] = v), !0);
      }
      return !1;
    }
    function ss(h) {
      N(h, !0);
    }
    return (
      (t.find = U),
      (t.read = q),
      (t.parse = c),
      (t.write = lr),
      (t.writeFile = dr),
      (t.utils = {
        cfb_new: ns,
        cfb_add: Cn,
        cfb_del: as,
        cfb_mov: is,
        cfb_gc: ss,
        ReadShift: Ft,
        CheckField: Ga,
        prep_blob: ar,
        bconcat: He,
        use_zlib: S,
        _deflateRaw: u0,
        _inflateRaw: g0,
        consts: De,
      }),
      t
    );
  })();
function Zs(e) {
  return typeof e == "string" ? vn(e) : Array.isArray(e) ? Ss(e) : e;
}
function Bt(e, t, r) {
  if (typeof Deno < "u") {
    if (r && typeof t == "string")
      switch (r) {
        case "utf8":
          t = new TextEncoder(r).encode(t);
          break;
        case "binary":
          t = vn(t);
          break;
        default:
          throw new Error("Unsupported encoding " + r);
      }
    return Deno.writeFileSync(e, t);
  }
  var n = r == "utf8" ? kt(t) : t;
  if (typeof IE_SaveFile < "u") return IE_SaveFile(n, e);
  if (typeof Blob < "u") {
    var a = new Blob([Zs(n)], { type: "application/octet-stream" });
    if (typeof navigator < "u" && navigator.msSaveBlob) return navigator.msSaveBlob(a, e);
    if (typeof saveAs < "u") return saveAs(a, e);
    if (
      typeof URL < "u" &&
      typeof document < "u" &&
      document.createElement &&
      URL.createObjectURL
    ) {
      var i = URL.createObjectURL(a);
      if (typeof chrome == "object" && typeof (chrome.downloads || {}).download == "function")
        return (
          URL.revokeObjectURL &&
            typeof setTimeout < "u" &&
            setTimeout(function () {
              URL.revokeObjectURL(i);
            }, 6e4),
          chrome.downloads.download({ url: i, filename: e, saveAs: !0 })
        );
      var s = document.createElement("a");
      if (s.download != null)
        return (
          (s.download = e),
          (s.href = i),
          document.body.appendChild(s),
          s.click(),
          document.body.removeChild(s),
          URL.revokeObjectURL &&
            typeof setTimeout < "u" &&
            setTimeout(function () {
              URL.revokeObjectURL(i);
            }, 6e4),
          i
        );
    }
  }
  if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u")
    try {
      var f = File(e);
      return (
        f.open("w"),
        (f.encoding = "binary"),
        Array.isArray(t) && (t = Mt(t)),
        f.write(t),
        f.close(),
        t
      );
    } catch (o) {
      if (!o.message || !o.message.match(/onstruct/)) throw o;
    }
  throw new Error("cannot save file " + e);
}
function Xe(e) {
  for (var t = Object.keys(e), r = [], n = 0; n < t.length; ++n)
    Object.prototype.hasOwnProperty.call(e, t[n]) && r.push(t[n]);
  return r;
}
function P0(e, t) {
  for (var r = [], n = Xe(e), a = 0; a !== n.length; ++a)
    r[e[n[a]][t]] == null && (r[e[n[a]][t]] = n[a]);
  return r;
}
function Kn(e) {
  for (var t = [], r = Xe(e), n = 0; n !== r.length; ++n) t[e[r[n]]] = r[n];
  return t;
}
function _n(e) {
  for (var t = [], r = Xe(e), n = 0; n !== r.length; ++n) t[e[r[n]]] = parseInt(r[n], 10);
  return t;
}
function qs(e) {
  for (var t = [], r = Xe(e), n = 0; n !== r.length; ++n)
    (t[e[r[n]]] == null && (t[e[r[n]]] = []), t[e[r[n]]].push(r[n]));
  return t;
}
var sn = new Date(1899, 11, 30, 0, 0, 0);
function er(e, t) {
  var r = e.getTime(),
    n = sn.getTime() + (e.getTimezoneOffset() - sn.getTimezoneOffset()) * 6e4;
  return (r - n) / (1440 * 60 * 1e3);
}
var ya = new Date(),
  Qs = sn.getTime() + (ya.getTimezoneOffset() - sn.getTimezoneOffset()) * 6e4,
  L0 = ya.getTimezoneOffset();
function Ca(e) {
  var t = new Date();
  return (
    t.setTime(e * 24 * 60 * 60 * 1e3 + Qs),
    t.getTimezoneOffset() !== L0 && t.setTime(t.getTime() + (t.getTimezoneOffset() - L0) * 6e4),
    t
  );
}
var M0 = new Date("2017-02-19T19:06:09.000Z"),
  Oa = isNaN(M0.getFullYear()) ? new Date("2/19/17") : M0,
  ef = Oa.getFullYear() == 2017;
function Ze(e, t) {
  var r = new Date(e);
  if (ef)
    return (
      t > 0
        ? r.setTime(r.getTime() + r.getTimezoneOffset() * 60 * 1e3)
        : t < 0 && r.setTime(r.getTime() - r.getTimezoneOffset() * 60 * 1e3),
      r
    );
  if (e instanceof Date) return e;
  if (Oa.getFullYear() == 1917 && !isNaN(r.getFullYear())) {
    var n = r.getFullYear();
    return (e.indexOf("" + n) > -1 || r.setFullYear(r.getFullYear() + 100), r);
  }
  var a = e.match(/\d+/g) || ["2017", "2", "19", "0", "0", "0"],
    i = new Date(+a[0], +a[1] - 1, +a[2], +a[3] || 0, +a[4] || 0, +a[5] || 0);
  return (e.indexOf("Z") > -1 && (i = new Date(i.getTime() - i.getTimezoneOffset() * 60 * 1e3)), i);
}
function Tn(e, t) {
  if (de && Buffer.isBuffer(e)) return e.toString("binary");
  if (typeof TextDecoder < "u")
    try {
      var r = {
        "€": "",
        "‚": "",
        ƒ: "",
        "„": "",
        "…": "",
        "†": "",
        "‡": "",
        ˆ: "",
        "‰": "",
        Š: "",
        "‹": "",
        Œ: "",
        Ž: "",
        "‘": "",
        "’": "",
        "“": "",
        "”": "",
        "•": "",
        "–": "",
        "—": "",
        "˜": "",
        "™": "",
        š: "",
        "›": "",
        œ: "",
        ž: "",
        Ÿ: "",
      };
      return (
        Array.isArray(e) && (e = new Uint8Array(e)),
        new TextDecoder("latin1").decode(e).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function (i) {
          return r[i] || i;
        })
      );
    } catch {}
  for (var n = [], a = 0; a != e.length; ++a) n.push(String.fromCharCode(e[a]));
  return n.join("");
}
function rr(e) {
  if (typeof JSON < "u" && !Array.isArray(e)) return JSON.parse(JSON.stringify(e));
  if (typeof e != "object" || e == null) return e;
  if (e instanceof Date) return new Date(e.getTime());
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = rr(e[r]));
  return t;
}
function Ce(e, t) {
  for (var r = ""; r.length < t; ) r += e;
  return r;
}
function Dr(e) {
  var t = Number(e);
  if (!isNaN(t)) return isFinite(t) ? t : NaN;
  if (!/\d/.test(e)) return t;
  var r = 1,
    n = e
      .replace(/([\d]),([\d])/g, "$1$2")
      .replace(/[$]/g, "")
      .replace(/[%]/g, function () {
        return ((r *= 100), "");
      });
  return !isNaN((t = Number(n))) ||
    ((n = n.replace(/[(](.*)[)]/, function (a, i) {
      return ((r = -r), i);
    })),
    !isNaN((t = Number(n))))
    ? t / r
    : t;
}
var rf = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
function It(e) {
  var t = new Date(e),
    r = new Date(NaN),
    n = t.getYear(),
    a = t.getMonth(),
    i = t.getDate();
  if (isNaN(i)) return r;
  var s = e.toLowerCase();
  if (s.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
    if (
      ((s = s.replace(/[^a-z]/g, "").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/, "")),
      s.length > 3 && rf.indexOf(s) == -1)
    )
      return r;
  } else if (s.match(/[a-z]/)) return r;
  return n < 0 || n > 8099
    ? r
    : (a > 0 || i > 1) && n != 101
      ? t
      : e.match(/[^-0-9:,\/\\]/)
        ? r
        : t;
}
function he(e, t, r) {
  if (e.FullPaths) {
    if (typeof r == "string") {
      var n;
      return (de ? (n = Nr(r)) : (n = As(r)), Ee.utils.cfb_add(e, t, n));
    }
    Ee.utils.cfb_add(e, t, r);
  } else e.file(t, r);
}
function Yn() {
  return Ee.utils.cfb_new();
}
var ke = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
`,
  tf = { "&quot;": '"', "&apos;": "'", "&gt;": ">", "&lt;": "<", "&amp;": "&" },
  $n = Kn(tf),
  jn = /[&<>'"]/g,
  nf = /[\u0000-\u0008\u000b-\u001f]/g;
function ge(e) {
  var t = e + "";
  return t
    .replace(jn, function (r) {
      return $n[r];
    })
    .replace(nf, function (r) {
      return "_x" + ("000" + r.charCodeAt(0).toString(16)).slice(-4) + "_";
    });
}
function B0(e) {
  return ge(e).replace(/ /g, "_x0020_");
}
var Da = /[\u0000-\u001f]/g;
function af(e) {
  var t = e + "";
  return t
    .replace(jn, function (r) {
      return $n[r];
    })
    .replace(/\n/g, "<br/>")
    .replace(Da, function (r) {
      return "&#x" + ("000" + r.charCodeAt(0).toString(16)).slice(-4) + ";";
    });
}
function sf(e) {
  var t = e + "";
  return t
    .replace(jn, function (r) {
      return $n[r];
    })
    .replace(Da, function (r) {
      return "&#x" + r.charCodeAt(0).toString(16).toUpperCase() + ";";
    });
}
function ff(e) {
  return e.replace(/(\r\n|[\r\n])/g, "&#10;");
}
function lf(e) {
  switch (e) {
    case 1:
    case !0:
    case "1":
    case "true":
    case "TRUE":
      return !0;
    default:
      return !1;
  }
}
function kn(e) {
  for (var t = "", r = 0, n = 0, a = 0, i = 0, s = 0, f = 0; r < e.length; ) {
    if (((n = e.charCodeAt(r++)), n < 128)) {
      t += String.fromCharCode(n);
      continue;
    }
    if (((a = e.charCodeAt(r++)), n > 191 && n < 224)) {
      ((s = (n & 31) << 6), (s |= a & 63), (t += String.fromCharCode(s)));
      continue;
    }
    if (((i = e.charCodeAt(r++)), n < 240)) {
      t += String.fromCharCode(((n & 15) << 12) | ((a & 63) << 6) | (i & 63));
      continue;
    }
    ((s = e.charCodeAt(r++)),
      (f = (((n & 7) << 18) | ((a & 63) << 12) | ((i & 63) << 6) | (s & 63)) - 65536),
      (t += String.fromCharCode(55296 + ((f >>> 10) & 1023))),
      (t += String.fromCharCode(56320 + (f & 1023))));
  }
  return t;
}
function b0(e) {
  var t = Yr(2 * e.length),
    r,
    n,
    a = 1,
    i = 0,
    s = 0,
    f;
  for (n = 0; n < e.length; n += a)
    ((a = 1),
      (f = e.charCodeAt(n)) < 128
        ? (r = f)
        : f < 224
          ? ((r = (f & 31) * 64 + (e.charCodeAt(n + 1) & 63)), (a = 2))
          : f < 240
            ? ((r = (f & 15) * 4096 + (e.charCodeAt(n + 1) & 63) * 64 + (e.charCodeAt(n + 2) & 63)),
              (a = 3))
            : ((a = 4),
              (r =
                (f & 7) * 262144 +
                (e.charCodeAt(n + 1) & 63) * 4096 +
                (e.charCodeAt(n + 2) & 63) * 64 +
                (e.charCodeAt(n + 3) & 63)),
              (r -= 65536),
              (s = 55296 + ((r >>> 10) & 1023)),
              (r = 56320 + (r & 1023))),
      s !== 0 && ((t[i++] = s & 255), (t[i++] = s >>> 8), (s = 0)),
      (t[i++] = r % 256),
      (t[i++] = r >>> 8));
  return t.slice(0, i).toString("ucs2");
}
function U0(e) {
  return Nr(e, "binary").toString("utf8");
}
var jt = "foo bar bazâð£",
  At = (de && ((U0(jt) == kn(jt) && U0) || (b0(jt) == kn(jt) && b0))) || kn,
  kt = de
    ? function (e) {
        return Nr(e, "utf8").toString("binary");
      }
    : function (e) {
        for (var t = [], r = 0, n = 0, a = 0; r < e.length; )
          switch (((n = e.charCodeAt(r++)), !0)) {
            case n < 128:
              t.push(String.fromCharCode(n));
              break;
            case n < 2048:
              (t.push(String.fromCharCode(192 + (n >> 6))),
                t.push(String.fromCharCode(128 + (n & 63))));
              break;
            case n >= 55296 && n < 57344:
              ((n -= 55296),
                (a = e.charCodeAt(r++) - 56320 + (n << 10)),
                t.push(String.fromCharCode(240 + ((a >> 18) & 7))),
                t.push(String.fromCharCode(144 + ((a >> 12) & 63))),
                t.push(String.fromCharCode(128 + ((a >> 6) & 63))),
                t.push(String.fromCharCode(128 + (a & 63))));
              break;
            default:
              (t.push(String.fromCharCode(224 + (n >> 12))),
                t.push(String.fromCharCode(128 + ((n >> 6) & 63))),
                t.push(String.fromCharCode(128 + (n & 63))));
          }
        return t.join("");
      },
  of = (function () {
    var e = [
      ["nbsp", " "],
      ["middot", "·"],
      ["quot", '"'],
      ["apos", "'"],
      ["gt", ">"],
      ["lt", "<"],
      ["amp", "&"],
    ].map(function (t) {
      return [new RegExp("&" + t[0] + ";", "ig"), t[1]];
    });
    return function (r) {
      for (
        var n = r
            .replace(/^[\t\n\r ]+/, "")
            .replace(/[\t\n\r ]+$/, "")
            .replace(/>\s+/g, ">")
            .replace(/\s+</g, "<")
            .replace(/[\t\n\r ]+/g, " ")
            .replace(
              /<\s*[bB][rR]\s*\/?>/g,
              `
`,
            )
            .replace(/<[^>]*>/g, ""),
          a = 0;
        a < e.length;
        ++a
      )
        n = n.replace(e[a][0], e[a][1]);
      return n;
    };
  })(),
  Ra = /(^\s|\s$|\n)/;
function Ve(e, t) {
  return "<" + e + (t.match(Ra) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e + ">";
}
function Nt(e) {
  return Xe(e)
    .map(function (t) {
      return " " + t + '="' + e[t] + '"';
    })
    .join("");
}
function j(e, t, r) {
  return (
    "<" +
    e +
    (r != null ? Nt(r) : "") +
    (t != null ? (t.match(Ra) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e : "/") +
    ">"
  );
}
function Hn(e, t) {
  try {
    return e.toISOString().replace(/\.\d*/, "");
  } catch (r) {
    if (t) throw r;
  }
  return "";
}
function cf(e, t) {
  switch (typeof e) {
    case "string":
      var r = j("vt:lpwstr", ge(e));
      return ((r = r.replace(/&quot;/g, "_x0022_")), r);
    case "number":
      return j((e | 0) == e ? "vt:i4" : "vt:r8", ge(String(e)));
    case "boolean":
      return j("vt:bool", e ? "true" : "false");
  }
  if (e instanceof Date) return j("vt:filetime", Hn(e));
  throw new Error("Unable to serialize " + e);
}
var Le = {
    CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
    CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
    EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
    CT: "http://schemas.openxmlformats.org/package/2006/content-types",
    RELS: "http://schemas.openxmlformats.org/package/2006/relationships",
    TCMNT: "http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments",
    dc: "http://purl.org/dc/elements/1.1/",
    dcterms: "http://purl.org/dc/terms/",
    dcmitype: "http://purl.org/dc/dcmitype/",
    r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
    xsi: "http://www.w3.org/2001/XMLSchema-instance",
    xsd: "http://www.w3.org/2001/XMLSchema",
  },
  ut = [
    "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "http://purl.oclc.org/ooxml/spreadsheetml/main",
    "http://schemas.microsoft.com/office/excel/2006/main",
    "http://schemas.microsoft.com/office/excel/2006/2",
  ],
  ir = {
    o: "urn:schemas-microsoft-com:office:office",
    x: "urn:schemas-microsoft-com:office:excel",
    ss: "urn:schemas-microsoft-com:office:spreadsheet",
    dt: "uuid:C2F41010-65B3-11d1-A29F-00AA00C14882",
    mv: "http://macVmlSchemaUri",
    v: "urn:schemas-microsoft-com:vml",
    html: "http://www.w3.org/TR/REC-html40",
  };
function hf(e, t) {
  for (
    var r = 1 - 2 * (e[t + 7] >>> 7),
      n = ((e[t + 7] & 127) << 4) + ((e[t + 6] >>> 4) & 15),
      a = e[t + 6] & 15,
      i = 5;
    i >= 0;
    --i
  )
    a = a * 256 + e[t + i];
  return n == 2047
    ? a == 0
      ? r * (1 / 0)
      : NaN
    : (n == 0 ? (n = -1022) : ((n -= 1023), (a += Math.pow(2, 52))), r * Math.pow(2, n - 52) * a);
}
function uf(e, t, r) {
  var n = (t < 0 || 1 / t == -1 / 0 ? 1 : 0) << 7,
    a = 0,
    i = 0,
    s = n ? -t : t;
  isFinite(s)
    ? s == 0
      ? (a = i = 0)
      : ((a = Math.floor(Math.log(s) / Math.LN2)),
        (i = s * Math.pow(2, 52 - a)),
        a <= -1023 && (!isFinite(i) || i < Math.pow(2, 52))
          ? (a = -1022)
          : ((i -= Math.pow(2, 52)), (a += 1023)))
    : ((a = 2047), (i = isNaN(t) ? 26985 : 0));
  for (var f = 0; f <= 5; ++f, i /= 256) e[r + f] = i & 255;
  ((e[r + 6] = ((a & 15) << 4) | (i & 15)), (e[r + 7] = (a >> 4) | n));
}
var W0 = function (e) {
    for (var t = [], r = 10240, n = 0; n < e[0].length; ++n)
      if (e[0][n])
        for (var a = 0, i = e[0][n].length; a < i; a += r) t.push.apply(t, e[0][n].slice(a, a + r));
    return t;
  },
  H0 = de
    ? function (e) {
        return e[0].length > 0 && Buffer.isBuffer(e[0][0])
          ? Buffer.concat(
              e[0].map(function (t) {
                return Buffer.isBuffer(t) ? t : Nr(t);
              }),
            )
          : W0(e);
      }
    : W0,
  V0 = function (e, t, r) {
    for (var n = [], a = t; a < r; a += 2) n.push(String.fromCharCode(wt(e, a)));
    return n.join("").replace(St, "");
  },
  Jn = de
    ? function (e, t, r) {
        return Buffer.isBuffer(e) ? e.toString("utf16le", t, r).replace(St, "") : V0(e, t, r);
      }
    : V0,
  G0 = function (e, t, r) {
    for (var n = [], a = t; a < t + r; ++a) n.push(("0" + e[a].toString(16)).slice(-2));
    return n.join("");
  },
  Ia = de
    ? function (e, t, r) {
        return Buffer.isBuffer(e) ? e.toString("hex", t, t + r) : G0(e, t, r);
      }
    : G0,
  X0 = function (e, t, r) {
    for (var n = [], a = t; a < r; a++) n.push(String.fromCharCode(it(e, a)));
    return n.join("");
  },
  bt = de
    ? function (t, r, n) {
        return Buffer.isBuffer(t) ? t.toString("utf8", r, n) : X0(t, r, n);
      }
    : X0,
  ka = function (e, t) {
    var r = sr(e, t);
    return r > 0 ? bt(e, t + 4, t + 4 + r - 1) : "";
  },
  Na = ka,
  Pa = function (e, t) {
    var r = sr(e, t);
    return r > 0 ? bt(e, t + 4, t + 4 + r - 1) : "";
  },
  La = Pa,
  Ma = function (e, t) {
    var r = 2 * sr(e, t);
    return r > 0 ? bt(e, t + 4, t + 4 + r - 1) : "";
  },
  Ba = Ma,
  ba = function (t, r) {
    var n = sr(t, r);
    return n > 0 ? Jn(t, r + 4, r + 4 + n) : "";
  },
  Ua = ba,
  Wa = function (e, t) {
    var r = sr(e, t);
    return r > 0 ? bt(e, t + 4, t + 4 + r) : "";
  },
  Ha = Wa,
  Va = function (e, t) {
    return hf(e, t);
  },
  fn = Va,
  Zn = function (t) {
    return Array.isArray(t) || (typeof Uint8Array < "u" && t instanceof Uint8Array);
  };
de &&
  ((Na = function (t, r) {
    if (!Buffer.isBuffer(t)) return ka(t, r);
    var n = t.readUInt32LE(r);
    return n > 0 ? t.toString("utf8", r + 4, r + 4 + n - 1) : "";
  }),
  (La = function (t, r) {
    if (!Buffer.isBuffer(t)) return Pa(t, r);
    var n = t.readUInt32LE(r);
    return n > 0 ? t.toString("utf8", r + 4, r + 4 + n - 1) : "";
  }),
  (Ba = function (t, r) {
    if (!Buffer.isBuffer(t)) return Ma(t, r);
    var n = 2 * t.readUInt32LE(r);
    return t.toString("utf16le", r + 4, r + 4 + n - 1);
  }),
  (Ua = function (t, r) {
    if (!Buffer.isBuffer(t)) return ba(t, r);
    var n = t.readUInt32LE(r);
    return t.toString("utf16le", r + 4, r + 4 + n);
  }),
  (Ha = function (t, r) {
    if (!Buffer.isBuffer(t)) return Wa(t, r);
    var n = t.readUInt32LE(r);
    return t.toString("utf8", r + 4, r + 4 + n);
  }),
  (fn = function (t, r) {
    return Buffer.isBuffer(t) ? t.readDoubleLE(r) : Va(t, r);
  }),
  (Zn = function (t) {
    return (
      Buffer.isBuffer(t) || Array.isArray(t) || (typeof Uint8Array < "u" && t instanceof Uint8Array)
    );
  }));
var it = function (e, t) {
    return e[t];
  },
  wt = function (e, t) {
    return e[t + 1] * 256 + e[t];
  },
  xf = function (e, t) {
    var r = e[t + 1] * 256 + e[t];
    return r < 32768 ? r : (65535 - r + 1) * -1;
  },
  sr = function (e, t) {
    return e[t + 3] * (1 << 24) + (e[t + 2] << 16) + (e[t + 1] << 8) + e[t];
  },
  zr = function (e, t) {
    return (e[t + 3] << 24) | (e[t + 2] << 16) | (e[t + 1] << 8) | e[t];
  },
  df = function (e, t) {
    return (e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3];
  };
function Ft(e, t) {
  var r = "",
    n,
    a,
    i = [],
    s,
    f,
    o,
    l;
  switch (t) {
    case "dbcs":
      if (((l = this.l), de && Buffer.isBuffer(this)))
        r = this.slice(this.l, this.l + 2 * e).toString("utf16le");
      else for (o = 0; o < e; ++o) ((r += String.fromCharCode(wt(this, l))), (l += 2));
      e *= 2;
      break;
    case "utf8":
      r = bt(this, this.l, this.l + e);
      break;
    case "utf16le":
      ((e *= 2), (r = Jn(this, this.l, this.l + e)));
      break;
    case "wstr":
      return Ft.call(this, e, "dbcs");
    case "lpstr-ansi":
      ((r = Na(this, this.l)), (e = 4 + sr(this, this.l)));
      break;
    case "lpstr-cp":
      ((r = La(this, this.l)), (e = 4 + sr(this, this.l)));
      break;
    case "lpwstr":
      ((r = Ba(this, this.l)), (e = 4 + 2 * sr(this, this.l)));
      break;
    case "lpp4":
      ((e = 4 + sr(this, this.l)), (r = Ua(this, this.l)), e & 2 && (e += 2));
      break;
    case "8lpp4":
      ((e = 4 + sr(this, this.l)), (r = Ha(this, this.l)), e & 3 && (e += 4 - (e & 3)));
      break;
    case "cstr":
      for (e = 0, r = ""; (s = it(this, this.l + e++)) !== 0; ) i.push(Kt(s));
      r = i.join("");
      break;
    case "_wstr":
      for (e = 0, r = ""; (s = wt(this, this.l + e)) !== 0; ) (i.push(Kt(s)), (e += 2));
      ((e += 2), (r = i.join("")));
      break;
    case "dbcs-cont":
      for (r = "", l = this.l, o = 0; o < e; ++o) {
        if (this.lens && this.lens.indexOf(l) !== -1)
          return (
            (s = it(this, l)),
            (this.l = l + 1),
            (f = Ft.call(this, e - o, s ? "dbcs-cont" : "sbcs-cont")),
            i.join("") + f
          );
        (i.push(Kt(wt(this, l))), (l += 2));
      }
      ((r = i.join("")), (e *= 2));
      break;
    case "cpstr":
    case "sbcs-cont":
      for (r = "", l = this.l, o = 0; o != e; ++o) {
        if (this.lens && this.lens.indexOf(l) !== -1)
          return (
            (s = it(this, l)),
            (this.l = l + 1),
            (f = Ft.call(this, e - o, s ? "dbcs-cont" : "sbcs-cont")),
            i.join("") + f
          );
        (i.push(Kt(it(this, l))), (l += 1));
      }
      r = i.join("");
      break;
    default:
      switch (e) {
        case 1:
          return ((n = it(this, this.l)), this.l++, n);
        case 2:
          return ((n = (t === "i" ? xf : wt)(this, this.l)), (this.l += 2), n);
        case 4:
        case -4:
          return t === "i" || (this[this.l + 3] & 128) === 0
            ? ((n = (e > 0 ? zr : df)(this, this.l)), (this.l += 4), n)
            : ((a = sr(this, this.l)), (this.l += 4), a);
        case 8:
        case -8:
          if (t === "f")
            return (
              e == 8
                ? (a = fn(this, this.l))
                : (a = fn(
                    [
                      this[this.l + 7],
                      this[this.l + 6],
                      this[this.l + 5],
                      this[this.l + 4],
                      this[this.l + 3],
                      this[this.l + 2],
                      this[this.l + 1],
                      this[this.l + 0],
                    ],
                    0,
                  )),
              (this.l += 8),
              a
            );
          e = 8;
        case 16:
          r = Ia(this, this.l, e);
          break;
      }
  }
  return ((this.l += e), r);
}
var pf = function (e, t, r) {
    ((e[r] = t & 255),
      (e[r + 1] = (t >>> 8) & 255),
      (e[r + 2] = (t >>> 16) & 255),
      (e[r + 3] = (t >>> 24) & 255));
  },
  vf = function (e, t, r) {
    ((e[r] = t & 255),
      (e[r + 1] = (t >> 8) & 255),
      (e[r + 2] = (t >> 16) & 255),
      (e[r + 3] = (t >> 24) & 255));
  },
  mf = function (e, t, r) {
    ((e[r] = t & 255), (e[r + 1] = (t >>> 8) & 255));
  };
function gf(e, t, r) {
  var n = 0,
    a = 0;
  if (r === "dbcs") {
    for (a = 0; a != t.length; ++a) mf(this, t.charCodeAt(a), this.l + 2 * a);
    n = 2 * t.length;
  } else if (r === "sbcs") {
    for (t = t.replace(/[^\x00-\x7F]/g, "_"), a = 0; a != t.length; ++a)
      this[this.l + a] = t.charCodeAt(a) & 255;
    n = t.length;
  } else if (r === "hex") {
    for (; a < e; ++a) this[this.l++] = parseInt(t.slice(2 * a, 2 * a + 2), 16) || 0;
    return this;
  } else if (r === "utf16le") {
    var i = Math.min(this.l + e, this.length);
    for (a = 0; a < Math.min(t.length, e); ++a) {
      var s = t.charCodeAt(a);
      ((this[this.l++] = s & 255), (this[this.l++] = s >> 8));
    }
    for (; this.l < i; ) this[this.l++] = 0;
    return this;
  } else
    switch (e) {
      case 1:
        ((n = 1), (this[this.l] = t & 255));
        break;
      case 2:
        ((n = 2), (this[this.l] = t & 255), (t >>>= 8), (this[this.l + 1] = t & 255));
        break;
      case 3:
        ((n = 3),
          (this[this.l] = t & 255),
          (t >>>= 8),
          (this[this.l + 1] = t & 255),
          (t >>>= 8),
          (this[this.l + 2] = t & 255));
        break;
      case 4:
        ((n = 4), pf(this, t, this.l));
        break;
      case 8:
        if (((n = 8), r === "f")) {
          uf(this, t, this.l);
          break;
        }
      case 16:
        break;
      case -4:
        ((n = 4), vf(this, t, this.l));
        break;
    }
  return ((this.l += n), this);
}
function Ga(e, t) {
  var r = Ia(this, this.l, e.length >> 1);
  if (r !== e) throw new Error(t + "Expected " + e + " saw " + r);
  this.l += e.length >> 1;
}
function ar(e, t) {
  ((e.l = t), (e.read_shift = Ft), (e.chk = Ga), (e.write_shift = gf));
}
function Sr(e, t) {
  e.l += t;
}
function b(e) {
  var t = Yr(e);
  return (ar(t, 0), t);
}
function Qe() {
  var e = [],
    t = de ? 256 : 2048,
    r = function (l) {
      var c = b(l);
      return (ar(c, 0), c);
    },
    n = r(t),
    a = function () {
      n &&
        (n.length > n.l && ((n = n.slice(0, n.l)), (n.l = n.length)),
        n.length > 0 && e.push(n),
        (n = null));
    },
    i = function (l) {
      return n && l < n.length - n.l ? n : (a(), (n = r(Math.max(l + 1, t))));
    },
    s = function () {
      return (a(), He(e));
    },
    f = function (l) {
      (a(), (n = l), n.l == null && (n.l = n.length), i(t));
    };
  return { next: i, push: f, end: s, _bufs: e };
}
function H(e, t, r, n) {
  var a = +t,
    i;
  if (!isNaN(a)) {
    (n || (n = uu[a].p || (r || []).length || 0),
      (i = 1 + (a >= 128 ? 1 : 0) + 1),
      n >= 128 && ++i,
      n >= 16384 && ++i,
      n >= 2097152 && ++i);
    var s = e.next(i);
    a <= 127 ? s.write_shift(1, a) : (s.write_shift(1, (a & 127) + 128), s.write_shift(1, a >> 7));
    for (var f = 0; f != 4; ++f)
      if (n >= 128) (s.write_shift(1, (n & 127) + 128), (n >>= 7));
      else {
        s.write_shift(1, n);
        break;
      }
    n > 0 && Zn(r) && e.push(r);
  }
}
function yt(e, t, r) {
  var n = rr(e);
  if (
    (t.s
      ? (n.cRel && (n.c += t.s.c), n.rRel && (n.r += t.s.r))
      : (n.cRel && (n.c += t.c), n.rRel && (n.r += t.r)),
    !r || r.biff < 12)
  ) {
    for (; n.c >= 256; ) n.c -= 256;
    for (; n.r >= 65536; ) n.r -= 65536;
  }
  return n;
}
function z0(e, t, r) {
  var n = rr(e);
  return ((n.s = yt(n.s, t.s, r)), (n.e = yt(n.e, t.s, r)), n);
}
function Ct(e, t) {
  if (e.cRel && e.c < 0) for (e = rr(e); e.c < 0; ) e.c += t > 8 ? 16384 : 256;
  if (e.rRel && e.r < 0) for (e = rr(e); e.r < 0; ) e.r += t > 8 ? 1048576 : t > 5 ? 65536 : 16384;
  var r = _e(e);
  return (!e.cRel && e.cRel != null && (r = Ef(r)), !e.rRel && e.rRel != null && (r = _f(r)), r);
}
function Nn(e, t) {
  return e.s.r == 0 &&
    !e.s.rRel &&
    e.e.r == (t.biff >= 12 ? 1048575 : t.biff >= 8 ? 65536 : 16384) &&
    !e.e.rRel
    ? (e.s.cRel ? "" : "$") + Ke(e.s.c) + ":" + (e.e.cRel ? "" : "$") + Ke(e.e.c)
    : e.s.c == 0 && !e.s.cRel && e.e.c == (t.biff >= 12 ? 16383 : 255) && !e.e.cRel
      ? (e.s.rRel ? "" : "$") + Ge(e.s.r) + ":" + (e.e.rRel ? "" : "$") + Ge(e.e.r)
      : Ct(e.s, t.biff) + ":" + Ct(e.e, t.biff);
}
function qn(e) {
  return parseInt(Tf(e), 10) - 1;
}
function Ge(e) {
  return "" + (e + 1);
}
function _f(e) {
  return e.replace(/([A-Z]|^)(\d+)$/, "$1$$$2");
}
function Tf(e) {
  return e.replace(/\$(\d+)$/, "$1");
}
function Qn(e) {
  for (var t = wf(e), r = 0, n = 0; n !== t.length; ++n) r = 26 * r + t.charCodeAt(n) - 64;
  return r - 1;
}
function Ke(e) {
  if (e < 0) throw new Error("invalid column " + e);
  var t = "";
  for (++e; e; e = Math.floor((e - 1) / 26)) t = String.fromCharCode(((e - 1) % 26) + 65) + t;
  return t;
}
function Ef(e) {
  return e.replace(/^([A-Z])/, "$$$1");
}
function wf(e) {
  return e.replace(/^\$([A-Z])/, "$1");
}
function Sf(e) {
  return e.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",");
}
function Me(e) {
  for (var t = 0, r = 0, n = 0; n < e.length; ++n) {
    var a = e.charCodeAt(n);
    a >= 48 && a <= 57 ? (t = 10 * t + (a - 48)) : a >= 65 && a <= 90 && (r = 26 * r + (a - 64));
  }
  return { c: r - 1, r: t - 1 };
}
function _e(e) {
  for (var t = e.c + 1, r = ""; t; t = ((t - 1) / 26) | 0)
    r = String.fromCharCode(((t - 1) % 26) + 65) + r;
  return r + (e.r + 1);
}
function fr(e) {
  var t = e.indexOf(":");
  return t == -1 ? { s: Me(e), e: Me(e) } : { s: Me(e.slice(0, t)), e: Me(e.slice(t + 1)) };
}
function Ie(e, t) {
  return typeof t > "u" || typeof t == "number"
    ? Ie(e.s, e.e)
    : (typeof e != "string" && (e = _e(e)),
      typeof t != "string" && (t = _e(t)),
      e == t ? e : e + ":" + t);
}
function Se(e) {
  var t = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } },
    r = 0,
    n = 0,
    a = 0,
    i = e.length;
  for (r = 0; n < i && !((a = e.charCodeAt(n) - 64) < 1 || a > 26); ++n) r = 26 * r + a;
  for (t.s.c = --r, r = 0; n < i && !((a = e.charCodeAt(n) - 48) < 0 || a > 9); ++n) r = 10 * r + a;
  if (((t.s.r = --r), n === i || a != 10)) return ((t.e.c = t.s.c), (t.e.r = t.s.r), t);
  for (++n, r = 0; n != i && !((a = e.charCodeAt(n) - 64) < 1 || a > 26); ++n) r = 26 * r + a;
  for (t.e.c = --r, r = 0; n != i && !((a = e.charCodeAt(n) - 48) < 0 || a > 9); ++n)
    r = 10 * r + a;
  return ((t.e.r = --r), t);
}
function K0(e, t) {
  var r = e.t == "d" && t instanceof Date;
  if (e.z != null)
    try {
      return (e.w = Br(e.z, r ? er(t) : t));
    } catch {}
  try {
    return (e.w = Br((e.XF || {}).numFmtId || (r ? 14 : 0), r ? er(t) : t));
  } catch {
    return "" + t;
  }
}
function kr(e, t, r) {
  return e == null || e.t == null || e.t == "z"
    ? ""
    : e.w !== void 0
      ? e.w
      : (e.t == "d" && !e.z && r && r.dateNF && (e.z = r.dateNF),
        e.t == "e" ? Ut[e.v] || e.v : t == null ? K0(e, e.v) : K0(e, t));
}
function Jr(e, t) {
  var r = t && t.sheet ? t.sheet : "Sheet1",
    n = {};
  return ((n[r] = e), { SheetNames: [r], Sheets: n });
}
function Xa(e, t, r) {
  var n = r || {},
    a = e ? Array.isArray(e) : n.dense,
    i = e || (a ? [] : {}),
    s = 0,
    f = 0;
  if (i && n.origin != null) {
    if (typeof n.origin == "number") s = n.origin;
    else {
      var o = typeof n.origin == "string" ? Me(n.origin) : n.origin;
      ((s = o.r), (f = o.c));
    }
    i["!ref"] || (i["!ref"] = "A1:A1");
  }
  var l = { s: { c: 1e7, r: 1e7 }, e: { c: 0, r: 0 } };
  if (i["!ref"]) {
    var c = Se(i["!ref"]);
    ((l.s.c = c.s.c),
      (l.s.r = c.s.r),
      (l.e.c = Math.max(l.e.c, c.e.c)),
      (l.e.r = Math.max(l.e.r, c.e.r)),
      s == -1 && (l.e.r = s = c.e.r + 1));
  }
  for (var p = 0; p != t.length; ++p)
    if (t[p]) {
      if (!Array.isArray(t[p])) throw new Error("aoa_to_sheet expects an array of arrays");
      for (var x = 0; x != t[p].length; ++x)
        if (!(typeof t[p][x] > "u")) {
          var d = { v: t[p][x] },
            T = s + p,
            u = f + x;
          if (
            (l.s.r > T && (l.s.r = T),
            l.s.c > u && (l.s.c = u),
            l.e.r < T && (l.e.r = T),
            l.e.c < u && (l.e.c = u),
            t[p][x] &&
              typeof t[p][x] == "object" &&
              !Array.isArray(t[p][x]) &&
              !(t[p][x] instanceof Date))
          )
            d = t[p][x];
          else if ((Array.isArray(d.v) && ((d.f = t[p][x][1]), (d.v = d.v[0])), d.v === null))
            if (d.f) d.t = "n";
            else if (n.nullError) ((d.t = "e"), (d.v = 0));
            else if (n.sheetStubs) d.t = "z";
            else continue;
          else
            typeof d.v == "number"
              ? (d.t = "n")
              : typeof d.v == "boolean"
                ? (d.t = "b")
                : d.v instanceof Date
                  ? ((d.z = n.dateNF || Oe[14]),
                    n.cellDates
                      ? ((d.t = "d"), (d.w = Br(d.z, er(d.v))))
                      : ((d.t = "n"), (d.v = er(d.v)), (d.w = Br(d.z, d.v))))
                  : (d.t = "s");
          if (a) (i[T] || (i[T] = []), i[T][u] && i[T][u].z && (d.z = i[T][u].z), (i[T][u] = d));
          else {
            var g = _e({ c: u, r: T });
            (i[g] && i[g].z && (d.z = i[g].z), (i[g] = d));
          }
        }
    }
  return (l.s.c < 1e7 && (i["!ref"] = Ie(l)), i);
}
function xt(e, t) {
  return Xa(null, e, t);
}
function Af(e) {
  return e.read_shift(4, "i");
}
function _r(e, t) {
  return (t || (t = b(4)), t.write_shift(4, e), t);
}
function Ye(e) {
  var t = e.read_shift(4);
  return t === 0 ? "" : e.read_shift(t, "dbcs");
}
function Be(e, t) {
  var r = !1;
  return (
    t == null && ((r = !0), (t = b(4 + 2 * e.length))),
    t.write_shift(4, e.length),
    e.length > 0 && t.write_shift(0, e, "dbcs"),
    r ? t.slice(0, t.l) : t
  );
}
function Ff(e) {
  return { ich: e.read_shift(2), ifnt: e.read_shift(2) };
}
function yf(e, t) {
  return (t || (t = b(4)), t.write_shift(2, 0), t.write_shift(2, 0), t);
}
function e0(e, t) {
  var r = e.l,
    n = e.read_shift(1),
    a = Ye(e),
    i = [],
    s = { t: a, h: a };
  if ((n & 1) !== 0) {
    for (var f = e.read_shift(4), o = 0; o != f; ++o) i.push(Ff(e));
    s.r = i;
  } else s.r = [{ ich: 0, ifnt: 0 }];
  return ((e.l = r + t), s);
}
function Cf(e, t) {
  var r = !1;
  return (
    t == null && ((r = !0), (t = b(15 + 4 * e.t.length))),
    t.write_shift(1, 0),
    Be(e.t, t),
    r ? t.slice(0, t.l) : t
  );
}
var Of = e0;
function Df(e, t) {
  var r = !1;
  return (
    t == null && ((r = !0), (t = b(23 + 4 * e.t.length))),
    t.write_shift(1, 1),
    Be(e.t, t),
    t.write_shift(4, 1),
    yf({}, t),
    r ? t.slice(0, t.l) : t
  );
}
function xr(e) {
  var t = e.read_shift(4),
    r = e.read_shift(2);
  return ((r += e.read_shift(1) << 16), e.l++, { c: t, iStyleRef: r });
}
function Zr(e, t) {
  return (
    t == null && (t = b(8)),
    t.write_shift(-4, e.c),
    t.write_shift(3, e.iStyleRef || e.s),
    t.write_shift(1, 0),
    t
  );
}
function qr(e) {
  var t = e.read_shift(2);
  return ((t += e.read_shift(1) << 16), e.l++, { c: -1, iStyleRef: t });
}
function Qr(e, t) {
  return (t == null && (t = b(4)), t.write_shift(3, e.iStyleRef || e.s), t.write_shift(1, 0), t);
}
var Rf = Ye,
  za = Be;
function r0(e) {
  var t = e.read_shift(4);
  return t === 0 || t === 4294967295 ? "" : e.read_shift(t, "dbcs");
}
function ln(e, t) {
  var r = !1;
  return (
    t == null && ((r = !0), (t = b(127))),
    t.write_shift(4, e.length > 0 ? e.length : 4294967295),
    e.length > 0 && t.write_shift(0, e, "dbcs"),
    r ? t.slice(0, t.l) : t
  );
}
var If = Ye,
  Vn = r0,
  t0 = ln;
function Ka(e) {
  var t = e.slice(e.l, e.l + 4),
    r = t[0] & 1,
    n = t[0] & 2;
  e.l += 4;
  var a = n === 0 ? fn([0, 0, 0, 0, t[0] & 252, t[1], t[2], t[3]], 0) : zr(t, 0) >> 2;
  return r ? a / 100 : a;
}
function Ya(e, t) {
  t == null && (t = b(4));
  var r = 0,
    n = 0,
    a = e * 100;
  if (
    (e == (e | 0) && e >= -536870912 && e < 1 << 29
      ? (n = 1)
      : a == (a | 0) && a >= -536870912 && a < 1 << 29 && ((n = 1), (r = 1)),
    n)
  )
    t.write_shift(-4, ((r ? a : e) << 2) + (r + 2));
  else throw new Error("unsupported RkNumber " + e);
}
function $a(e) {
  var t = { s: {}, e: {} };
  return (
    (t.s.r = e.read_shift(4)),
    (t.e.r = e.read_shift(4)),
    (t.s.c = e.read_shift(4)),
    (t.e.c = e.read_shift(4)),
    t
  );
}
function kf(e, t) {
  return (
    t || (t = b(16)),
    t.write_shift(4, e.s.r),
    t.write_shift(4, e.e.r),
    t.write_shift(4, e.s.c),
    t.write_shift(4, e.e.c),
    t
  );
}
var et = $a,
  dt = kf;
function pt(e) {
  if (e.length - e.l < 8) throw "XLS Xnum Buffer underflow";
  return e.read_shift(8, "f");
}
function $r(e, t) {
  return (t || b(8)).write_shift(8, e, "f");
}
function Nf(e) {
  var t = {},
    r = e.read_shift(1),
    n = r >>> 1,
    a = e.read_shift(1),
    i = e.read_shift(2, "i"),
    s = e.read_shift(1),
    f = e.read_shift(1),
    o = e.read_shift(1);
  switch ((e.l++, n)) {
    case 0:
      t.auto = 1;
      break;
    case 1:
      t.index = a;
      var l = Vf[a];
      l && (t.rgb = na(l));
      break;
    case 2:
      t.rgb = na([s, f, o]);
      break;
    case 3:
      t.theme = a;
      break;
  }
  return (i != 0 && (t.tint = i > 0 ? i / 32767 : i / 32768), t);
}
function on(e, t) {
  if ((t || (t = b(8)), !e || e.auto)) return (t.write_shift(4, 0), t.write_shift(4, 0), t);
  e.index != null
    ? (t.write_shift(1, 2), t.write_shift(1, e.index))
    : e.theme != null
      ? (t.write_shift(1, 6), t.write_shift(1, e.theme))
      : (t.write_shift(1, 5), t.write_shift(1, 0));
  var r = e.tint || 0;
  if (
    (r > 0 ? (r *= 32767) : r < 0 && (r *= 32768), t.write_shift(2, r), !e.rgb || e.theme != null)
  )
    (t.write_shift(2, 0), t.write_shift(1, 0), t.write_shift(1, 0));
  else {
    var n = e.rgb || "FFFFFF";
    (typeof n == "number" && (n = ("000000" + n.toString(16)).slice(-6)),
      t.write_shift(1, parseInt(n.slice(0, 2), 16)),
      t.write_shift(1, parseInt(n.slice(2, 4), 16)),
      t.write_shift(1, parseInt(n.slice(4, 6), 16)),
      t.write_shift(1, 255));
  }
  return t;
}
function Pf(e) {
  var t = e.read_shift(1);
  e.l++;
  var r = {
    fBold: t & 1,
    fItalic: t & 2,
    fUnderline: t & 4,
    fStrikeout: t & 8,
    fOutline: t & 16,
    fShadow: t & 32,
    fCondense: t & 64,
    fExtend: t & 128,
  };
  return r;
}
function Lf(e, t) {
  t || (t = b(2));
  var r =
    (e.italic ? 2 : 0) |
    (e.strike ? 8 : 0) |
    (e.outline ? 16 : 0) |
    (e.shadow ? 32 : 0) |
    (e.condense ? 64 : 0) |
    (e.extend ? 128 : 0);
  return (t.write_shift(1, r), t.write_shift(1, 0), t);
}
var ja = 2,
  nr = 3,
  Jt = 11,
  cn = 19,
  Zt = 64,
  Mf = 65,
  Bf = 71,
  bf = 4108,
  Uf = 4126,
  We = 80,
  Y0 = {
    1: { n: "CodePage", t: ja },
    2: { n: "Category", t: We },
    3: { n: "PresentationFormat", t: We },
    4: { n: "ByteCount", t: nr },
    5: { n: "LineCount", t: nr },
    6: { n: "ParagraphCount", t: nr },
    7: { n: "SlideCount", t: nr },
    8: { n: "NoteCount", t: nr },
    9: { n: "HiddenCount", t: nr },
    10: { n: "MultimediaClipCount", t: nr },
    11: { n: "ScaleCrop", t: Jt },
    12: { n: "HeadingPairs", t: bf },
    13: { n: "TitlesOfParts", t: Uf },
    14: { n: "Manager", t: We },
    15: { n: "Company", t: We },
    16: { n: "LinksUpToDate", t: Jt },
    17: { n: "CharacterCount", t: nr },
    19: { n: "SharedDoc", t: Jt },
    22: { n: "HyperlinksChanged", t: Jt },
    23: { n: "AppVersion", t: nr, p: "version" },
    24: { n: "DigSig", t: Mf },
    26: { n: "ContentType", t: We },
    27: { n: "ContentStatus", t: We },
    28: { n: "Language", t: We },
    29: { n: "Version", t: We },
    255: {},
    2147483648: { n: "Locale", t: cn },
    2147483651: { n: "Behavior", t: cn },
    1919054434: {},
  },
  $0 = {
    1: { n: "CodePage", t: ja },
    2: { n: "Title", t: We },
    3: { n: "Subject", t: We },
    4: { n: "Author", t: We },
    5: { n: "Keywords", t: We },
    6: { n: "Comments", t: We },
    7: { n: "Template", t: We },
    8: { n: "LastAuthor", t: We },
    9: { n: "RevNumber", t: We },
    10: { n: "EditTime", t: Zt },
    11: { n: "LastPrinted", t: Zt },
    12: { n: "CreatedDate", t: Zt },
    13: { n: "ModifiedDate", t: Zt },
    14: { n: "PageCount", t: nr },
    15: { n: "WordCount", t: nr },
    16: { n: "CharCount", t: nr },
    17: { n: "Thumbnail", t: Bf },
    18: { n: "Application", t: We },
    19: { n: "DocSecurity", t: nr },
    255: {},
    2147483648: { n: "Locale", t: cn },
    2147483651: { n: "Behavior", t: cn },
    1919054434: {},
  };
function Wf(e) {
  return e.map(function (t) {
    return [(t >> 16) & 255, (t >> 8) & 255, t & 255];
  });
}
var Hf = Wf([
    0, 16777215, 16711680, 65280, 255, 16776960, 16711935, 65535, 0, 16777215, 16711680, 65280, 255,
    16776960, 16711935, 65535, 8388608, 32768, 128, 8421376, 8388736, 32896, 12632256, 8421504,
    10066431, 10040166, 16777164, 13434879, 6684774, 16744576, 26316, 13421823, 128, 16711935,
    16776960, 65535, 8388736, 8388608, 32896, 255, 52479, 13434879, 13434828, 16777113, 10079487,
    16751052, 13408767, 16764057, 3368703, 3394764, 10079232, 16763904, 16750848, 16737792, 6710937,
    9868950, 13158, 3381606, 13056, 3355392, 10040064, 10040166, 3355545, 3355443, 16777215, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  Vf = rr(Hf),
  Ut = {
    0: "#NULL!",
    7: "#DIV/0!",
    15: "#VALUE!",
    23: "#REF!",
    29: "#NAME?",
    36: "#NUM!",
    42: "#N/A",
    43: "#GETTING_DATA",
    255: "#WTF?",
  },
  Gf = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
    "application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
    "application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
    "application/vnd.ms-excel.worksheet": "sheets",
    "application/vnd.ms-excel.binIndexWs": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
    "application/vnd.ms-excel.chartsheet": "charts",
    "application/vnd.ms-excel.macrosheet+xml": "macros",
    "application/vnd.ms-excel.macrosheet": "macros",
    "application/vnd.ms-excel.intlmacrosheet": "TODO",
    "application/vnd.ms-excel.binIndexMs": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
    "application/vnd.ms-excel.dialogsheet": "dialogs",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
    "application/vnd.ms-excel.sharedStrings": "strs",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
    "application/vnd.ms-excel.styles": "styles",
    "application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
    "application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
    "application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
    "application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
    "application/vnd.ms-excel.comments": "comments",
    "application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
    "application/vnd.ms-excel.person+xml": "people",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
    "application/vnd.ms-excel.sheetMetadata": "metadata",
    "application/vnd.ms-excel.pivotTable": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
    "application/vnd.ms-office.chartcolorstyle+xml": "TODO",
    "application/vnd.ms-office.chartstyle+xml": "TODO",
    "application/vnd.ms-office.chartex+xml": "TODO",
    "application/vnd.ms-excel.calcChain": "calcchains",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
    "application/vnd.ms-office.activeX": "TODO",
    "application/vnd.ms-office.activeX+xml": "TODO",
    "application/vnd.ms-excel.attachedToolbars": "TODO",
    "application/vnd.ms-excel.connections": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
    "application/vnd.ms-excel.externalLink": "links",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
    "application/vnd.ms-excel.pivotCacheDefinition": "TODO",
    "application/vnd.ms-excel.pivotCacheRecords": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
    "application/vnd.ms-excel.queryTable": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
    "application/vnd.ms-excel.userNames": "TODO",
    "application/vnd.ms-excel.revisionHeaders": "TODO",
    "application/vnd.ms-excel.revisionLog": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
    "application/vnd.ms-excel.tableSingleCells": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
    "application/vnd.ms-excel.slicer": "TODO",
    "application/vnd.ms-excel.slicerCache": "TODO",
    "application/vnd.ms-excel.slicer+xml": "TODO",
    "application/vnd.ms-excel.slicerCache+xml": "TODO",
    "application/vnd.ms-excel.wsSortMap": "TODO",
    "application/vnd.ms-excel.table": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.theme+xml": "themes",
    "application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
    "application/vnd.ms-excel.Timeline+xml": "TODO",
    "application/vnd.ms-excel.TimelineCache+xml": "TODO",
    "application/vnd.ms-office.vbaProject": "vba",
    "application/vnd.ms-office.vbaProjectSignature": "TODO",
    "application/vnd.ms-office.volatileDependencies": "TODO",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
    "application/vnd.ms-excel.controlproperties+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.model+data": "TODO",
    "application/vnd.ms-excel.Survey+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
    "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
    "application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
    "application/vnd.openxmlformats-package.relationships+xml": "rels",
    "application/vnd.openxmlformats-officedocument.oleObject": "TODO",
    "image/png": "TODO",
    sheet: "js",
  },
  qt = {
    workbooks: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
      xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
      xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
      xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
      xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml",
    },
    strs: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
      xlsb: "application/vnd.ms-excel.sharedStrings",
    },
    comments: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
      xlsb: "application/vnd.ms-excel.comments",
    },
    sheets: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
      xlsb: "application/vnd.ms-excel.worksheet",
    },
    charts: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
      xlsb: "application/vnd.ms-excel.chartsheet",
    },
    dialogs: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
      xlsb: "application/vnd.ms-excel.dialogsheet",
    },
    macros: {
      xlsx: "application/vnd.ms-excel.macrosheet+xml",
      xlsb: "application/vnd.ms-excel.macrosheet",
    },
    metadata: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
      xlsb: "application/vnd.ms-excel.sheetMetadata",
    },
    styles: {
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
      xlsb: "application/vnd.ms-excel.styles",
    },
  };
function Ja() {
  return {
    workbooks: [],
    sheets: [],
    charts: [],
    dialogs: [],
    macros: [],
    rels: [],
    strs: [],
    comments: [],
    threadedcomments: [],
    links: [],
    coreprops: [],
    extprops: [],
    custprops: [],
    themes: [],
    styles: [],
    calcchains: [],
    vba: [],
    drawings: [],
    metadata: [],
    people: [],
    TODO: [],
    xmlns: "",
  };
}
function Za(e, t) {
  var r = qs(Gf),
    n = [],
    a;
  ((n[n.length] = ke),
    (n[n.length] = j("Types", null, { xmlns: Le.CT, "xmlns:xsd": Le.xsd, "xmlns:xsi": Le.xsi })),
    (n = n.concat(
      [
        ["xml", "application/xml"],
        ["bin", "application/vnd.ms-excel.sheet.binary.macroEnabled.main"],
        ["vml", "application/vnd.openxmlformats-officedocument.vmlDrawing"],
        ["data", "application/vnd.openxmlformats-officedocument.model+data"],
        ["bmp", "image/bmp"],
        ["png", "image/png"],
        ["gif", "image/gif"],
        ["emf", "image/x-emf"],
        ["wmf", "image/x-wmf"],
        ["jpg", "image/jpeg"],
        ["jpeg", "image/jpeg"],
        ["tif", "image/tiff"],
        ["tiff", "image/tiff"],
        ["pdf", "application/pdf"],
        ["rels", "application/vnd.openxmlformats-package.relationships+xml"],
      ].map(function (o) {
        return j("Default", null, { Extension: o[0], ContentType: o[1] });
      }),
    )));
  var i = function (o) {
      e[o] &&
        e[o].length > 0 &&
        ((a = e[o][0]),
        (n[n.length] = j("Override", null, {
          PartName: (a[0] == "/" ? "" : "/") + a,
          ContentType: qt[o][t.bookType] || qt[o].xlsx,
        })));
    },
    s = function (o) {
      (e[o] || []).forEach(function (l) {
        n[n.length] = j("Override", null, {
          PartName: (l[0] == "/" ? "" : "/") + l,
          ContentType: qt[o][t.bookType] || qt[o].xlsx,
        });
      });
    },
    f = function (o) {
      (e[o] || []).forEach(function (l) {
        n[n.length] = j("Override", null, {
          PartName: (l[0] == "/" ? "" : "/") + l,
          ContentType: r[o][0],
        });
      });
    };
  return (
    i("workbooks"),
    s("sheets"),
    s("charts"),
    f("themes"),
    ["strs", "styles"].forEach(i),
    ["coreprops", "extprops", "custprops"].forEach(f),
    f("vba"),
    f("comments"),
    f("threadedcomments"),
    f("drawings"),
    s("metadata"),
    f("people"),
    n.length > 2 && ((n[n.length] = "</Types>"), (n[1] = n[1].replace("/>", ">"))),
    n.join("")
  );
}
var xe = {
  WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
  VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
  XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
  XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
  CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
  CORE_PROPS:
    "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
  EXT_PROPS:
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
  CUST_PROPS:
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
  SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
  STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
  THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
  WS: [
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet",
    "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet",
  ],
  DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
  XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
  TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
  PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
  VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject",
};
function qa(e) {
  var t = e.lastIndexOf("/");
  return e.slice(0, t + 1) + "_rels/" + e.slice(t + 1) + ".rels";
}
function lt(e) {
  var t = [ke, j("Relationships", null, { xmlns: Le.RELS })];
  return (
    Xe(e["!id"]).forEach(function (r) {
      t[t.length] = j("Relationship", null, e["!id"][r]);
    }),
    t.length > 2 && ((t[t.length] = "</Relationships>"), (t[1] = t[1].replace("/>", ">"))),
    t.join("")
  );
}
function me(e, t, r, n, a, i) {
  if ((a || (a = {}), e["!id"] || (e["!id"] = {}), e["!idx"] || (e["!idx"] = 1), t < 0))
    for (t = e["!idx"]; e["!id"]["rId" + t]; ++t);
  if (
    ((e["!idx"] = t + 1),
    (a.Id = "rId" + t),
    (a.Type = n),
    (a.Target = r),
    [xe.HLINK, xe.XPATH, xe.XMISS].indexOf(a.Type) > -1 && (a.TargetMode = "External"),
    e["!id"][a.Id])
  )
    throw new Error("Cannot rewrite rId " + t);
  return ((e["!id"][a.Id] = a), (e[("/" + a.Target).replace("//", "/")] = a), t);
}
function Xf(e) {
  var t = [ke];
  (t.push(`<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
`),
    t.push(`  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
`));
  for (var r = 0; r < e.length; ++r)
    t.push(
      '  <manifest:file-entry manifest:full-path="' +
        e[r][0] +
        '" manifest:media-type="' +
        e[r][1] +
        `"/>
`,
    );
  return (t.push("</manifest:manifest>"), t.join(""));
}
function j0(e, t, r) {
  return [
    '  <rdf:Description rdf:about="' +
      e +
      `">
`,
    '    <rdf:type rdf:resource="http://docs.oasis-open.org/ns/office/1.2/meta/' +
      (r || "odf") +
      "#" +
      t +
      `"/>
`,
    `  </rdf:Description>
`,
  ].join("");
}
function zf(e, t) {
  return [
    '  <rdf:Description rdf:about="' +
      e +
      `">
`,
    '    <ns0:hasPart xmlns:ns0="http://docs.oasis-open.org/ns/office/1.2/meta/pkg#" rdf:resource="' +
      t +
      `"/>
`,
    `  </rdf:Description>
`,
  ].join("");
}
function Kf(e) {
  var t = [ke];
  t.push(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
`);
  for (var r = 0; r != e.length; ++r) (t.push(j0(e[r][0], e[r][1])), t.push(zf("", e[r][0])));
  return (t.push(j0("", "Document", "pkg")), t.push("</rdf:RDF>"), t.join(""));
}
function Qa() {
  return (
    '<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"><office:meta><meta:generator>SheetJS ' +
    en.version +
    "</meta:generator></office:meta></office:document-meta>"
  );
}
var Kr = [
  ["cp:category", "Category"],
  ["cp:contentStatus", "ContentStatus"],
  ["cp:keywords", "Keywords"],
  ["cp:lastModifiedBy", "LastAuthor"],
  ["cp:lastPrinted", "LastPrinted"],
  ["cp:revision", "RevNumber"],
  ["cp:version", "Version"],
  ["dc:creator", "Author"],
  ["dc:description", "Comments"],
  ["dc:identifier", "Identifier"],
  ["dc:language", "Language"],
  ["dc:subject", "Subject"],
  ["dc:title", "Title"],
  ["dcterms:created", "CreatedDate", "date"],
  ["dcterms:modified", "ModifiedDate", "date"],
];
function Pn(e, t, r, n, a) {
  a[e] != null ||
    t == null ||
    t === "" ||
    ((a[e] = t), (t = ge(t)), (n[n.length] = r ? j(e, t, r) : Ve(e, t)));
}
function ei(e, t) {
  var r = t || {},
    n = [
      ke,
      j("cp:coreProperties", null, {
        "xmlns:cp": Le.CORE_PROPS,
        "xmlns:dc": Le.dc,
        "xmlns:dcterms": Le.dcterms,
        "xmlns:dcmitype": Le.dcmitype,
        "xmlns:xsi": Le.xsi,
      }),
    ],
    a = {};
  if (!e && !r.Props) return n.join("");
  e &&
    (e.CreatedDate != null &&
      Pn(
        "dcterms:created",
        typeof e.CreatedDate == "string" ? e.CreatedDate : Hn(e.CreatedDate, r.WTF),
        { "xsi:type": "dcterms:W3CDTF" },
        n,
        a,
      ),
    e.ModifiedDate != null &&
      Pn(
        "dcterms:modified",
        typeof e.ModifiedDate == "string" ? e.ModifiedDate : Hn(e.ModifiedDate, r.WTF),
        { "xsi:type": "dcterms:W3CDTF" },
        n,
        a,
      ));
  for (var i = 0; i != Kr.length; ++i) {
    var s = Kr[i],
      f = r.Props && r.Props[s[1]] != null ? r.Props[s[1]] : e ? e[s[1]] : null;
    (f === !0 ? (f = "1") : f === !1 ? (f = "0") : typeof f == "number" && (f = String(f)),
      f != null && Pn(s[0], f, null, n, a));
  }
  return (
    n.length > 2 && ((n[n.length] = "</cp:coreProperties>"), (n[1] = n[1].replace("/>", ">"))),
    n.join("")
  );
}
var ot = [
    ["Application", "Application", "string"],
    ["AppVersion", "AppVersion", "string"],
    ["Company", "Company", "string"],
    ["DocSecurity", "DocSecurity", "string"],
    ["Manager", "Manager", "string"],
    ["HyperlinksChanged", "HyperlinksChanged", "bool"],
    ["SharedDoc", "SharedDoc", "bool"],
    ["LinksUpToDate", "LinksUpToDate", "bool"],
    ["ScaleCrop", "ScaleCrop", "bool"],
    ["HeadingPairs", "HeadingPairs", "raw"],
    ["TitlesOfParts", "TitlesOfParts", "raw"],
  ],
  ri = ["Worksheets", "SheetNames", "NamedRanges", "DefinedNames", "Chartsheets", "ChartNames"];
function ti(e) {
  var t = [],
    r = j;
  return (
    e || (e = {}),
    (e.Application = "SheetJS"),
    (t[t.length] = ke),
    (t[t.length] = j("Properties", null, { xmlns: Le.EXT_PROPS, "xmlns:vt": Le.vt })),
    ot.forEach(function (n) {
      if (e[n[1]] !== void 0) {
        var a;
        switch (n[2]) {
          case "string":
            a = ge(String(e[n[1]]));
            break;
          case "bool":
            a = e[n[1]] ? "true" : "false";
            break;
        }
        a !== void 0 && (t[t.length] = r(n[0], a));
      }
    }),
    (t[t.length] = r(
      "HeadingPairs",
      r(
        "vt:vector",
        r("vt:variant", "<vt:lpstr>Worksheets</vt:lpstr>") +
          r("vt:variant", r("vt:i4", String(e.Worksheets))),
        { size: 2, baseType: "variant" },
      ),
    )),
    (t[t.length] = r(
      "TitlesOfParts",
      r(
        "vt:vector",
        e.SheetNames.map(function (n) {
          return "<vt:lpstr>" + ge(n) + "</vt:lpstr>";
        }).join(""),
        { size: e.Worksheets, baseType: "lpstr" },
      ),
    )),
    t.length > 2 && ((t[t.length] = "</Properties>"), (t[1] = t[1].replace("/>", ">"))),
    t.join("")
  );
}
function ni(e) {
  var t = [ke, j("Properties", null, { xmlns: Le.CUST_PROPS, "xmlns:vt": Le.vt })];
  if (!e) return t.join("");
  var r = 1;
  return (
    Xe(e).forEach(function (a) {
      (++r,
        (t[t.length] = j("property", cf(e[a]), {
          fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
          pid: r,
          name: ge(a),
        })));
    }),
    t.length > 2 && ((t[t.length] = "</Properties>"), (t[1] = t[1].replace("/>", ">"))),
    t.join("")
  );
}
var J0 = {
  Title: "Title",
  Subject: "Subject",
  Author: "Author",
  Keywords: "Keywords",
  Comments: "Description",
  LastAuthor: "LastAuthor",
  RevNumber: "Revision",
  Application: "AppName",
  LastPrinted: "LastPrinted",
  CreatedDate: "Created",
  ModifiedDate: "LastSaved",
  Category: "Category",
  Manager: "Manager",
  Company: "Company",
  AppVersion: "Version",
  ContentStatus: "ContentStatus",
  Identifier: "Identifier",
  Language: "Language",
};
function Yf(e, t) {
  var r = [];
  return (
    Xe(J0)
      .map(function (n) {
        for (var a = 0; a < Kr.length; ++a) if (Kr[a][1] == n) return Kr[a];
        for (a = 0; a < ot.length; ++a) if (ot[a][1] == n) return ot[a];
        throw n;
      })
      .forEach(function (n) {
        if (e[n[1]] != null) {
          var a = t && t.Props && t.Props[n[1]] != null ? t.Props[n[1]] : e[n[1]];
          (n[2] === "date" && (a = new Date(a).toISOString().replace(/\.\d*Z/, "Z")),
            typeof a == "number"
              ? (a = String(a))
              : a === !0 || a === !1
                ? (a = a ? "1" : "0")
                : a instanceof Date && (a = new Date(a).toISOString().replace(/\.\d*Z/, "")),
            r.push(Ve(J0[n[1]] || n[1], a)));
        }
      }),
    j("DocumentProperties", r.join(""), { xmlns: ir.o })
  );
}
function $f(e, t) {
  var r = ["Worksheets", "SheetNames"],
    n = "CustomDocumentProperties",
    a = [];
  return (
    e &&
      Xe(e).forEach(function (i) {
        if (Object.prototype.hasOwnProperty.call(e, i)) {
          for (var s = 0; s < Kr.length; ++s) if (i == Kr[s][1]) return;
          for (s = 0; s < ot.length; ++s) if (i == ot[s][1]) return;
          for (s = 0; s < r.length; ++s) if (i == r[s]) return;
          var f = e[i],
            o = "string";
          (typeof f == "number"
            ? ((o = "float"), (f = String(f)))
            : f === !0 || f === !1
              ? ((o = "boolean"), (f = f ? "1" : "0"))
              : (f = String(f)),
            a.push(j(B0(i), f, { "dt:dt": o })));
        }
      }),
    t &&
      Xe(t).forEach(function (i) {
        if (
          Object.prototype.hasOwnProperty.call(t, i) &&
          !(e && Object.prototype.hasOwnProperty.call(e, i))
        ) {
          var s = t[i],
            f = "string";
          (typeof s == "number"
            ? ((f = "float"), (s = String(s)))
            : s === !0 || s === !1
              ? ((f = "boolean"), (s = s ? "1" : "0"))
              : s instanceof Date
                ? ((f = "dateTime.tz"), (s = s.toISOString()))
                : (s = String(s)),
            a.push(j(B0(i), s, { "dt:dt": f })));
        }
      }),
    "<" + n + ' xmlns="' + ir.o + '">' + a.join("") + "</" + n + ">"
  );
}
function jf(e) {
  var t = typeof e == "string" ? new Date(Date.parse(e)) : e,
    r = t.getTime() / 1e3 + 11644473600,
    n = r % Math.pow(2, 32),
    a = (r - n) / Math.pow(2, 32);
  ((n *= 1e7), (a *= 1e7));
  var i = (n / Math.pow(2, 32)) | 0;
  i > 0 && ((n = n % Math.pow(2, 32)), (a += i));
  var s = b(8);
  return (s.write_shift(4, n), s.write_shift(4, a), s);
}
function Z0(e, t) {
  var r = b(4),
    n = b(4);
  switch ((r.write_shift(4, e == 80 ? 31 : e), e)) {
    case 3:
      n.write_shift(-4, t);
      break;
    case 5:
      ((n = b(8)), n.write_shift(8, t, "f"));
      break;
    case 11:
      n.write_shift(4, t ? 1 : 0);
      break;
    case 64:
      n = jf(t);
      break;
    case 31:
    case 80:
      for (
        n = b(4 + 2 * (t.length + 1) + (t.length % 2 ? 0 : 2)),
          n.write_shift(4, t.length + 1),
          n.write_shift(0, t, "dbcs");
        n.l != n.length;
      )
        n.write_shift(1, 0);
      break;
    default:
      throw new Error("TypedPropertyValue unrecognized type " + e + " " + t);
  }
  return He([r, n]);
}
var ai = ["CodePage", "Thumbnail", "_PID_LINKBASE", "_PID_HLINKS", "SystemIdentifier", "FMTID"];
function Jf(e) {
  switch (typeof e) {
    case "boolean":
      return 11;
    case "number":
      return (e | 0) == e ? 3 : 5;
    case "string":
      return 31;
    case "object":
      if (e instanceof Date) return 64;
      break;
  }
  return -1;
}
function q0(e, t, r) {
  var n = b(8),
    a = [],
    i = [],
    s = 8,
    f = 0,
    o = b(8),
    l = b(8);
  if (
    (o.write_shift(4, 2),
    o.write_shift(4, 1200),
    l.write_shift(4, 1),
    i.push(o),
    a.push(l),
    (s += 8 + o.length),
    !t)
  ) {
    ((l = b(8)), l.write_shift(4, 0), a.unshift(l));
    var c = [b(4)];
    for (c[0].write_shift(4, e.length), f = 0; f < e.length; ++f) {
      var p = e[f][0];
      for (
        o = b(8 + 2 * (p.length + 1) + (p.length % 2 ? 0 : 2)),
          o.write_shift(4, f + 2),
          o.write_shift(4, p.length + 1),
          o.write_shift(0, p, "dbcs");
        o.l != o.length;
      )
        o.write_shift(1, 0);
      c.push(o);
    }
    ((o = He(c)), i.unshift(o), (s += 8 + o.length));
  }
  for (f = 0; f < e.length; ++f)
    if (
      !(t && !t[e[f][0]]) &&
      !(ai.indexOf(e[f][0]) > -1 || ri.indexOf(e[f][0]) > -1) &&
      e[f][1] != null
    ) {
      var x = e[f][1],
        d = 0;
      if (t) {
        d = +t[e[f][0]];
        var T = r[d];
        if (T.p == "version" && typeof x == "string") {
          var u = x.split(".");
          x = (+u[0] << 16) + (+u[1] || 0);
        }
        o = Z0(T.t, x);
      } else {
        var g = Jf(x);
        (g == -1 && ((g = 31), (x = String(x))), (o = Z0(g, x)));
      }
      (i.push(o), (l = b(8)), l.write_shift(4, t ? d : 2 + f), a.push(l), (s += 8 + o.length));
    }
  var O = 8 * (i.length + 1);
  for (f = 0; f < i.length; ++f) (a[f].write_shift(4, O), (O += i[f].length));
  return (n.write_shift(4, s), n.write_shift(4, i.length), He([n].concat(a).concat(i)));
}
function Q0(e, t, r, n, a, i) {
  var s = b(a ? 68 : 48),
    f = [s];
  (s.write_shift(2, 65534),
    s.write_shift(2, 0),
    s.write_shift(4, 842412599),
    s.write_shift(16, Ee.utils.consts.HEADER_CLSID, "hex"),
    s.write_shift(4, a ? 2 : 1),
    s.write_shift(16, t, "hex"),
    s.write_shift(4, a ? 68 : 48));
  var o = q0(e, r, n);
  if ((f.push(o), a)) {
    var l = q0(a, null, null);
    (s.write_shift(16, i, "hex"), s.write_shift(4, 68 + o.length), f.push(l));
  }
  return He(f);
}
function Zf(e, t) {
  t || (t = b(e));
  for (var r = 0; r < e; ++r) t.write_shift(1, 0);
  return t;
}
function qf(e, t) {
  return e.read_shift(t) === 1;
}
function Je(e, t) {
  return (t || (t = b(2)), t.write_shift(2, +!!e), t);
}
function ii(e) {
  return e.read_shift(2, "u");
}
function ur(e, t) {
  return (t || (t = b(2)), t.write_shift(2, e), t);
}
function si(e, t, r) {
  return (
    r || (r = b(2)), r.write_shift(1, t == "e" ? +e : +!!e), r.write_shift(1, t == "e" ? 1 : 0), r
  );
}
function fi(e, t, r) {
  var n = e.read_shift(r && r.biff >= 12 ? 2 : 1),
    a = "sbcs-cont";
  if ((r && r.biff >= 8, !r || r.biff == 8)) {
    var i = e.read_shift(1);
    i && (a = "dbcs-cont");
  } else r.biff == 12 && (a = "wstr");
  r.biff >= 2 && r.biff <= 5 && (a = "cpstr");
  var s = n ? e.read_shift(n, a) : "";
  return s;
}
function Qf(e) {
  var t = e.t || "",
    r = b(3);
  (r.write_shift(2, t.length), r.write_shift(1, 1));
  var n = b(2 * t.length);
  n.write_shift(2 * t.length, t, "utf16le");
  var a = [r, n];
  return He(a);
}
function el(e, t, r) {
  var n;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return e.read_shift(t, "cpstr");
    if (r.biff >= 12) return e.read_shift(t, "dbcs-cont");
  }
  var a = e.read_shift(1);
  return (a === 0 ? (n = e.read_shift(t, "sbcs-cont")) : (n = e.read_shift(t, "dbcs-cont")), n);
}
function rl(e, t, r) {
  var n = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return n === 0 ? (e.l++, "") : el(e, n, r);
}
function tl(e, t, r) {
  if (r.biff > 5) return rl(e, t, r);
  var n = e.read_shift(1);
  return n === 0 ? (e.l++, "") : e.read_shift(n, r.biff <= 4 || !e.lens ? "cpstr" : "sbcs-cont");
}
function li(e, t, r) {
  return (
    r || (r = b(3 + 2 * e.length)),
    r.write_shift(2, e.length),
    r.write_shift(1, 1),
    r.write_shift(31, e, "utf16le"),
    r
  );
}
function ea(e, t) {
  (t || (t = b(6 + e.length * 2)), t.write_shift(4, 1 + e.length));
  for (var r = 0; r < e.length; ++r) t.write_shift(2, e.charCodeAt(r));
  return (t.write_shift(2, 0), t);
}
function nl(e) {
  var t = b(512),
    r = 0,
    n = e.Target;
  n.slice(0, 7) == "file://" && (n = n.slice(7));
  var a = n.indexOf("#"),
    i = a > -1 ? 31 : 23;
  switch (n.charAt(0)) {
    case "#":
      i = 28;
      break;
    case ".":
      i &= -3;
      break;
  }
  (t.write_shift(4, 2), t.write_shift(4, i));
  var s = [8, 6815827, 6619237, 4849780, 83];
  for (r = 0; r < s.length; ++r) t.write_shift(4, s[r]);
  if (i == 28) ((n = n.slice(1)), ea(n, t));
  else if (i & 2) {
    for (s = "e0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), r = 0; r < s.length; ++r)
      t.write_shift(1, parseInt(s[r], 16));
    var f = a > -1 ? n.slice(0, a) : n;
    for (t.write_shift(4, 2 * (f.length + 1)), r = 0; r < f.length; ++r)
      t.write_shift(2, f.charCodeAt(r));
    (t.write_shift(2, 0), i & 8 && ea(a > -1 ? n.slice(a + 1) : "", t));
  } else {
    for (s = "03 03 00 00 00 00 00 00 c0 00 00 00 00 00 00 46".split(" "), r = 0; r < s.length; ++r)
      t.write_shift(1, parseInt(s[r], 16));
    for (var o = 0; n.slice(o * 3, o * 3 + 3) == "../" || n.slice(o * 3, o * 3 + 3) == "..\\"; )
      ++o;
    for (
      t.write_shift(2, o), t.write_shift(4, n.length - 3 * o + 1), r = 0;
      r < n.length - 3 * o;
      ++r
    )
      t.write_shift(1, n.charCodeAt(r + 3 * o) & 255);
    for (t.write_shift(1, 0), t.write_shift(2, 65535), t.write_shift(2, 57005), r = 0; r < 6; ++r)
      t.write_shift(4, 0);
  }
  return t.slice(0, t.l);
}
function jr(e, t, r, n) {
  return (n || (n = b(6)), n.write_shift(2, e), n.write_shift(2, t), n.write_shift(2, r || 0), n);
}
function al(e, t, r) {
  var n = r.biff > 8 ? 4 : 2,
    a = e.read_shift(n),
    i = e.read_shift(n, "i"),
    s = e.read_shift(n, "i");
  return [a, i, s];
}
function il(e) {
  var t = e.read_shift(2),
    r = e.read_shift(2),
    n = e.read_shift(2),
    a = e.read_shift(2);
  return { s: { c: n, r: t }, e: { c: a, r } };
}
function oi(e, t) {
  return (
    t || (t = b(8)),
    t.write_shift(2, e.s.r),
    t.write_shift(2, e.e.r),
    t.write_shift(2, e.s.c),
    t.write_shift(2, e.e.c),
    t
  );
}
function n0(e, t, r) {
  var n = 1536,
    a = 16;
  switch (r.bookType) {
    case "biff8":
      break;
    case "biff5":
      ((n = 1280), (a = 8));
      break;
    case "biff4":
      ((n = 4), (a = 6));
      break;
    case "biff3":
      ((n = 3), (a = 6));
      break;
    case "biff2":
      ((n = 2), (a = 4));
      break;
    case "xla":
      break;
    default:
      throw new Error("unsupported BIFF version");
  }
  var i = b(a);
  return (
    i.write_shift(2, n),
    i.write_shift(2, t),
    a > 4 && i.write_shift(2, 29282),
    a > 6 && i.write_shift(2, 1997),
    a > 8 &&
      (i.write_shift(2, 49161), i.write_shift(2, 1), i.write_shift(2, 1798), i.write_shift(2, 0)),
    i
  );
}
function sl(e, t) {
  var r = !t || t.biff == 8,
    n = b(r ? 112 : 54);
  for (
    n.write_shift(t.biff == 8 ? 2 : 1, 7),
      r && n.write_shift(1, 0),
      n.write_shift(4, 859007059),
      n.write_shift(4, 5458548 | (r ? 0 : 536870912));
    n.l < n.length;
  )
    n.write_shift(1, r ? 0 : 32);
  return n;
}
function fl(e, t) {
  var r = !t || t.biff >= 8 ? 2 : 1,
    n = b(8 + r * e.name.length);
  (n.write_shift(4, e.pos),
    n.write_shift(1, e.hs || 0),
    n.write_shift(1, e.dt),
    n.write_shift(1, e.name.length),
    t.biff >= 8 && n.write_shift(1, 1),
    n.write_shift(r * e.name.length, e.name, t.biff < 8 ? "sbcs" : "utf16le"));
  var a = n.slice(0, n.l);
  return ((a.l = n.l), a);
}
function ll(e, t) {
  var r = b(8);
  (r.write_shift(4, e.Count), r.write_shift(4, e.Unique));
  for (var n = [], a = 0; a < e.length; ++a) n[a] = Qf(e[a]);
  var i = He([r].concat(n));
  return (
    (i.parts = [r.length].concat(
      n.map(function (s) {
        return s.length;
      }),
    )),
    i
  );
}
function ol() {
  var e = b(18);
  return (
    e.write_shift(2, 0),
    e.write_shift(2, 0),
    e.write_shift(2, 29280),
    e.write_shift(2, 17600),
    e.write_shift(2, 56),
    e.write_shift(2, 0),
    e.write_shift(2, 0),
    e.write_shift(2, 1),
    e.write_shift(2, 500),
    e
  );
}
function cl(e) {
  var t = b(18),
    r = 1718;
  return (
    e && e.RTL && (r |= 64),
    t.write_shift(2, r),
    t.write_shift(4, 0),
    t.write_shift(4, 64),
    t.write_shift(4, 0),
    t.write_shift(4, 0),
    t
  );
}
function hl(e, t) {
  var r = e.name || "Arial",
    n = t && t.biff == 5,
    a = n ? 15 + r.length : 16 + 2 * r.length,
    i = b(a);
  return (
    i.write_shift(2, e.sz * 20),
    i.write_shift(4, 0),
    i.write_shift(2, 400),
    i.write_shift(4, 0),
    i.write_shift(2, 0),
    i.write_shift(1, r.length),
    n || i.write_shift(1, 1),
    i.write_shift((n ? 1 : 2) * r.length, r, n ? "sbcs" : "utf16le"),
    i
  );
}
function ul(e, t, r, n) {
  var a = b(10);
  return (jr(e, t, n, a), a.write_shift(4, r), a);
}
function xl(e, t, r, n, a) {
  var i = !a || a.biff == 8,
    s = b(8 + +i + (1 + i) * r.length);
  return (
    jr(e, t, n, s),
    s.write_shift(2, r.length),
    i && s.write_shift(1, 1),
    s.write_shift((1 + i) * r.length, r, i ? "utf16le" : "sbcs"),
    s
  );
}
function dl(e, t, r, n) {
  var a = r && r.biff == 5;
  (n || (n = b(a ? 3 + t.length : 5 + 2 * t.length)),
    n.write_shift(2, e),
    n.write_shift(a ? 1 : 2, t.length),
    a || n.write_shift(1, 1),
    n.write_shift((a ? 1 : 2) * t.length, t, a ? "sbcs" : "utf16le"));
  var i = n.length > n.l ? n.slice(0, n.l) : n;
  return (i.l == null && (i.l = i.length), i);
}
function pl(e, t) {
  var r = t.biff == 8 || !t.biff ? 4 : 2,
    n = b(2 * r + 6);
  return (
    n.write_shift(r, e.s.r),
    n.write_shift(r, e.e.r + 1),
    n.write_shift(2, e.s.c),
    n.write_shift(2, e.e.c + 1),
    n.write_shift(2, 0),
    n
  );
}
function ra(e, t, r, n) {
  var a = r && r.biff == 5;
  (n || (n = b(a ? 16 : 20)),
    n.write_shift(2, 0),
    e.style
      ? (n.write_shift(2, e.numFmtId || 0), n.write_shift(2, 65524))
      : (n.write_shift(2, e.numFmtId || 0), n.write_shift(2, t << 4)));
  var i = 0;
  return (
    e.numFmtId > 0 && a && (i |= 1024),
    n.write_shift(4, i),
    n.write_shift(4, 0),
    a || n.write_shift(4, 0),
    n.write_shift(2, 0),
    n
  );
}
function vl(e) {
  var t = b(8);
  return (t.write_shift(4, 0), t.write_shift(2, 0), t.write_shift(2, 0), t);
}
function ml(e, t, r, n, a, i) {
  var s = b(8);
  return (jr(e, t, n, s), si(r, i, s), s);
}
function gl(e, t, r, n) {
  var a = b(14);
  return (jr(e, t, n, a), $r(r, a), a);
}
function _l(e, t, r) {
  if (r.biff < 8) return Tl(e, t, r);
  for (var n = [], a = e.l + t, i = e.read_shift(r.biff > 8 ? 4 : 2); i-- !== 0; )
    n.push(al(e, r.biff > 8 ? 12 : 6, r));
  if (e.l != a) throw new Error("Bad ExternSheet: " + e.l + " != " + a);
  return n;
}
function Tl(e, t, r) {
  e[e.l + 1] == 3 && e[e.l]++;
  var n = fi(e, t, r);
  return n.charCodeAt(0) == 3 ? n.slice(1) : n;
}
function El(e) {
  var t = b(2 + e.length * 8);
  t.write_shift(2, e.length);
  for (var r = 0; r < e.length; ++r) oi(e[r], t);
  return t;
}
function wl(e) {
  var t = b(24),
    r = Me(e[0]);
  (t.write_shift(2, r.r), t.write_shift(2, r.r), t.write_shift(2, r.c), t.write_shift(2, r.c));
  for (var n = "d0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), a = 0; a < 16; ++a)
    t.write_shift(1, parseInt(n[a], 16));
  return He([t, nl(e[1])]);
}
function Sl(e) {
  var t = e[1].Tooltip,
    r = b(10 + 2 * (t.length + 1));
  r.write_shift(2, 2048);
  var n = Me(e[0]);
  (r.write_shift(2, n.r), r.write_shift(2, n.r), r.write_shift(2, n.c), r.write_shift(2, n.c));
  for (var a = 0; a < t.length; ++a) r.write_shift(2, t.charCodeAt(a));
  return (r.write_shift(2, 0), r);
}
function Al(e) {
  return (e || (e = b(4)), e.write_shift(2, 1), e.write_shift(2, 1), e);
}
function Fl(e, t, r) {
  if (!r.cellStyles) return Sr(e, t);
  var n = r && r.biff >= 12 ? 4 : 2,
    a = e.read_shift(n),
    i = e.read_shift(n),
    s = e.read_shift(n),
    f = e.read_shift(n),
    o = e.read_shift(2);
  n == 2 && (e.l += 2);
  var l = { s: a, e: i, w: s, ixfe: f, flags: o };
  return ((r.biff >= 5 || !r.biff) && (l.level = (o >> 8) & 7), l);
}
function yl(e, t) {
  var r = b(12);
  (r.write_shift(2, t), r.write_shift(2, t), r.write_shift(2, e.width * 256), r.write_shift(2, 0));
  var n = 0;
  return (
    e.hidden && (n |= 1),
    r.write_shift(1, n),
    (n = e.level || 0),
    r.write_shift(1, n),
    r.write_shift(2, 0),
    r
  );
}
function Cl(e) {
  for (var t = b(2 * e), r = 0; r < e; ++r) t.write_shift(2, r + 1);
  return t;
}
function Ol(e, t, r) {
  var n = b(15);
  return (Ht(n, e, t), n.write_shift(8, r, "f"), n);
}
function Dl(e, t, r) {
  var n = b(9);
  return (Ht(n, e, t), n.write_shift(2, r), n);
}
var Rl = (function () {
    var e = {
        1: 437,
        2: 850,
        3: 1252,
        4: 1e4,
        100: 852,
        101: 866,
        102: 865,
        103: 861,
        104: 895,
        105: 620,
        106: 737,
        107: 857,
        120: 950,
        121: 949,
        122: 936,
        123: 932,
        124: 874,
        125: 1255,
        126: 1256,
        150: 10007,
        151: 10029,
        152: 10006,
        200: 1250,
        201: 1251,
        202: 1254,
        203: 1253,
        0: 20127,
        8: 865,
        9: 437,
        10: 850,
        11: 437,
        13: 437,
        14: 850,
        15: 437,
        16: 850,
        17: 437,
        18: 850,
        19: 932,
        20: 850,
        21: 437,
        22: 850,
        23: 865,
        24: 437,
        25: 437,
        26: 850,
        27: 437,
        28: 863,
        29: 850,
        31: 852,
        34: 852,
        35: 852,
        36: 860,
        37: 850,
        38: 866,
        55: 850,
        64: 852,
        77: 936,
        78: 949,
        79: 950,
        80: 874,
        87: 1252,
        88: 1252,
        89: 1252,
        108: 863,
        134: 737,
        135: 852,
        136: 857,
        204: 1257,
        255: 16969,
      },
      t = Kn({
        1: 437,
        2: 850,
        3: 1252,
        4: 1e4,
        100: 852,
        101: 866,
        102: 865,
        103: 861,
        104: 895,
        105: 620,
        106: 737,
        107: 857,
        120: 950,
        121: 949,
        122: 936,
        123: 932,
        124: 874,
        125: 1255,
        126: 1256,
        150: 10007,
        151: 10029,
        152: 10006,
        200: 1250,
        201: 1251,
        202: 1254,
        203: 1253,
        0: 20127,
      });
    function r(f, o) {
      var l = [],
        c = Yr(1);
      switch (o.type) {
        case "base64":
          c = mr(Ir(f));
          break;
        case "binary":
          c = mr(f);
          break;
        case "buffer":
        case "array":
          c = f;
          break;
      }
      ar(c, 0);
      var p = c.read_shift(1),
        x = !!(p & 136),
        d = !1,
        T = !1;
      switch (p) {
        case 2:
          break;
        case 3:
          break;
        case 48:
          ((d = !0), (x = !0));
          break;
        case 49:
          ((d = !0), (x = !0));
          break;
        case 131:
          break;
        case 139:
          break;
        case 140:
          T = !0;
          break;
        case 245:
          break;
        default:
          throw new Error("DBF Unsupported Version: " + p.toString(16));
      }
      var u = 0,
        g = 521;
      (p == 2 && (u = c.read_shift(2)),
        (c.l += 3),
        p != 2 && (u = c.read_shift(4)),
        u > 1048576 && (u = 1e6),
        p != 2 && (g = c.read_shift(2)));
      var O = c.read_shift(2),
        D = o.codepage || 1252;
      (p != 2 &&
        ((c.l += 16), c.read_shift(1), c[c.l] !== 0 && (D = e[c[c.l]]), (c.l += 1), (c.l += 2)),
        T && (c.l += 36));
      for (
        var C = [],
          B = {},
          K = Math.min(c.length, p == 2 ? 521 : g - 10 - (d ? 264 : 0)),
          q = T ? 32 : 11;
        c.l < K && c[c.l] != 13;
      )
        switch (
          ((B = {}),
          (B.name = rn.utils.decode(D, c.slice(c.l, c.l + q)).replace(/[\u0000\r\n].*$/g, "")),
          (c.l += q),
          (B.type = String.fromCharCode(c.read_shift(1))),
          p != 2 && !T && (B.offset = c.read_shift(4)),
          (B.len = c.read_shift(1)),
          p == 2 && (B.offset = c.read_shift(2)),
          (B.dec = c.read_shift(1)),
          B.name.length && C.push(B),
          p != 2 && (c.l += T ? 13 : 14),
          B.type)
        ) {
          case "B":
            (!d || B.len != 8) && o.WTF && console.log("Skipping " + B.name + ":" + B.type);
            break;
          case "G":
          case "P":
            o.WTF && console.log("Skipping " + B.name + ":" + B.type);
            break;
          case "+":
          case "0":
          case "@":
          case "C":
          case "D":
          case "F":
          case "I":
          case "L":
          case "M":
          case "N":
          case "O":
          case "T":
          case "Y":
            break;
          default:
            throw new Error("Unknown Field Type: " + B.type);
        }
      if ((c[c.l] !== 13 && (c.l = g - 1), c.read_shift(1) !== 13))
        throw new Error("DBF Terminator not found " + c.l + " " + c[c.l]);
      c.l = g;
      var F = 0,
        L = 0;
      for (l[0] = [], L = 0; L != C.length; ++L) l[0][L] = C[L].name;
      for (; u-- > 0; ) {
        if (c[c.l] === 42) {
          c.l += O;
          continue;
        }
        for (++c.l, l[++F] = [], L = 0, L = 0; L != C.length; ++L) {
          var N = c.slice(c.l, c.l + C[L].len);
          ((c.l += C[L].len), ar(N, 0));
          var V = rn.utils.decode(D, N);
          switch (C[L].type) {
            case "C":
              V.trim().length && (l[F][L] = V.replace(/\s+$/, ""));
              break;
            case "D":
              V.length === 8
                ? (l[F][L] = new Date(+V.slice(0, 4), +V.slice(4, 6) - 1, +V.slice(6, 8)))
                : (l[F][L] = V);
              break;
            case "F":
              l[F][L] = parseFloat(V.trim());
              break;
            case "+":
            case "I":
              l[F][L] = T ? N.read_shift(-4, "i") ^ 2147483648 : N.read_shift(4, "i");
              break;
            case "L":
              switch (V.trim().toUpperCase()) {
                case "Y":
                case "T":
                  l[F][L] = !0;
                  break;
                case "N":
                case "F":
                  l[F][L] = !1;
                  break;
                case "":
                case "?":
                  break;
                default:
                  throw new Error("DBF Unrecognized L:|" + V + "|");
              }
              break;
            case "M":
              if (!x) throw new Error("DBF Unexpected MEMO for type " + p.toString(16));
              l[F][L] = "##MEMO##" + (T ? parseInt(V.trim(), 10) : N.read_shift(4));
              break;
            case "N":
              ((V = V.replace(/\u0000/g, "").trim()), V && V != "." && (l[F][L] = +V || 0));
              break;
            case "@":
              l[F][L] = new Date(N.read_shift(-8, "f") - 621356832e5);
              break;
            case "T":
              l[F][L] = new Date((N.read_shift(4) - 2440588) * 864e5 + N.read_shift(4));
              break;
            case "Y":
              l[F][L] = N.read_shift(4, "i") / 1e4 + (N.read_shift(4, "i") / 1e4) * Math.pow(2, 32);
              break;
            case "O":
              l[F][L] = -N.read_shift(-8, "f");
              break;
            case "B":
              if (d && C[L].len == 8) {
                l[F][L] = N.read_shift(8, "f");
                break;
              }
            case "G":
            case "P":
              N.l += C[L].len;
              break;
            case "0":
              if (C[L].name === "_NullFlags") break;
            default:
              throw new Error("DBF Unsupported data type " + C[L].type);
          }
        }
      }
      if (p != 2 && c.l < c.length && c[c.l++] != 26)
        throw new Error(
          "DBF EOF Marker missing " + (c.l - 1) + " of " + c.length + " " + c[c.l - 1].toString(16),
        );
      return (o && o.sheetRows && (l = l.slice(0, o.sheetRows)), (o.DBF = C), l);
    }
    function n(f, o) {
      var l = o || {};
      l.dateNF || (l.dateNF = "yyyymmdd");
      var c = xt(r(f, l), l);
      return (
        (c["!cols"] = l.DBF.map(function (p) {
          return { wch: p.len, DBF: p };
        })),
        delete l.DBF,
        c
      );
    }
    function a(f, o) {
      try {
        return Jr(n(f, o), o);
      } catch (l) {
        if (o && o.WTF) throw l;
      }
      return { SheetNames: [], Sheets: {} };
    }
    var i = { B: 8, C: 250, L: 1, D: 8, "?": 0, "": 0 };
    function s(f, o) {
      var l = o || {};
      if ((+l.codepage >= 0 && Dt(+l.codepage), l.type == "string"))
        throw new Error("Cannot write DBF to JS string");
      var c = Qe(),
        p = pn(f, { header: 1, raw: !0, cellDates: !0 }),
        x = p[0],
        d = p.slice(1),
        T = f["!cols"] || [],
        u = 0,
        g = 0,
        O = 0,
        D = 1;
      for (u = 0; u < x.length; ++u) {
        if (((T[u] || {}).DBF || {}).name) {
          ((x[u] = T[u].DBF.name), ++O);
          continue;
        }
        if (x[u] != null) {
          if ((++O, typeof x[u] == "number" && (x[u] = x[u].toString(10)), typeof x[u] != "string"))
            throw new Error("DBF Invalid column name " + x[u] + " |" + typeof x[u] + "|");
          if (x.indexOf(x[u]) !== u) {
            for (g = 0; g < 1024; ++g)
              if (x.indexOf(x[u] + "_" + g) == -1) {
                x[u] += "_" + g;
                break;
              }
          }
        }
      }
      var C = Se(f["!ref"]),
        B = [],
        K = [],
        q = [];
      for (u = 0; u <= C.e.c - C.s.c; ++u) {
        var F = "",
          L = "",
          N = 0,
          V = [];
        for (g = 0; g < d.length; ++g) d[g][u] != null && V.push(d[g][u]);
        if (V.length == 0 || x[u] == null) {
          B[u] = "?";
          continue;
        }
        for (g = 0; g < V.length; ++g) {
          switch (typeof V[g]) {
            case "number":
              L = "B";
              break;
            case "string":
              L = "C";
              break;
            case "boolean":
              L = "L";
              break;
            case "object":
              L = V[g] instanceof Date ? "D" : "C";
              break;
            default:
              L = "C";
          }
          ((N = Math.max(N, String(V[g]).length)), (F = F && F != L ? "C" : L));
        }
        (N > 250 && (N = 250),
          (L = ((T[u] || {}).DBF || {}).type),
          L == "C" && T[u].DBF.len > N && (N = T[u].DBF.len),
          F == "B" && L == "N" && ((F = "N"), (q[u] = T[u].DBF.dec), (N = T[u].DBF.len)),
          (K[u] = F == "C" || L == "N" ? N : i[F] || 0),
          (D += K[u]),
          (B[u] = F));
      }
      var U = c.next(32);
      for (
        U.write_shift(4, 318902576),
          U.write_shift(4, d.length),
          U.write_shift(2, 296 + 32 * O),
          U.write_shift(2, D),
          u = 0;
        u < 4;
        ++u
      )
        U.write_shift(4, 0);
      for (U.write_shift(4, 0 | ((+t[ha] || 3) << 8)), u = 0, g = 0; u < x.length; ++u)
        if (x[u] != null) {
          var X = c.next(32),
            re = (x[u].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
          (X.write_shift(1, re, "sbcs"),
            X.write_shift(1, B[u] == "?" ? "C" : B[u], "sbcs"),
            X.write_shift(4, g),
            X.write_shift(1, K[u] || i[B[u]] || 0),
            X.write_shift(1, q[u] || 0),
            X.write_shift(1, 2),
            X.write_shift(4, 0),
            X.write_shift(1, 0),
            X.write_shift(4, 0),
            X.write_shift(4, 0),
            (g += K[u] || i[B[u]] || 0));
        }
      var Te = c.next(264);
      for (Te.write_shift(4, 13), u = 0; u < 65; ++u) Te.write_shift(4, 0);
      for (u = 0; u < d.length; ++u) {
        var oe = c.next(D);
        for (oe.write_shift(1, 0), g = 0; g < x.length; ++g)
          if (x[g] != null)
            switch (B[g]) {
              case "L":
                oe.write_shift(1, d[u][g] == null ? 63 : d[u][g] ? 84 : 70);
                break;
              case "B":
                oe.write_shift(8, d[u][g] || 0, "f");
                break;
              case "N":
                var be = "0";
                for (
                  typeof d[u][g] == "number" && (be = d[u][g].toFixed(q[g] || 0)), O = 0;
                  O < K[g] - be.length;
                  ++O
                )
                  oe.write_shift(1, 32);
                oe.write_shift(1, be, "sbcs");
                break;
              case "D":
                d[u][g]
                  ? (oe.write_shift(4, ("0000" + d[u][g].getFullYear()).slice(-4), "sbcs"),
                    oe.write_shift(2, ("00" + (d[u][g].getMonth() + 1)).slice(-2), "sbcs"),
                    oe.write_shift(2, ("00" + d[u][g].getDate()).slice(-2), "sbcs"))
                  : oe.write_shift(8, "00000000", "sbcs");
                break;
              case "C":
                var De = String(d[u][g] != null ? d[u][g] : "").slice(0, K[g]);
                for (oe.write_shift(1, De, "sbcs"), O = 0; O < K[g] - De.length; ++O)
                  oe.write_shift(1, 32);
                break;
            }
      }
      return (c.next(1).write_shift(1, 26), c.end());
    }
    return { to_workbook: a, to_sheet: n, from_sheet: s };
  })(),
  Il = (function () {
    var e = {
        AA: "À",
        BA: "Á",
        CA: "Â",
        DA: 195,
        HA: "Ä",
        JA: 197,
        AE: "È",
        BE: "É",
        CE: "Ê",
        HE: "Ë",
        AI: "Ì",
        BI: "Í",
        CI: "Î",
        HI: "Ï",
        AO: "Ò",
        BO: "Ó",
        CO: "Ô",
        DO: 213,
        HO: "Ö",
        AU: "Ù",
        BU: "Ú",
        CU: "Û",
        HU: "Ü",
        Aa: "à",
        Ba: "á",
        Ca: "â",
        Da: 227,
        Ha: "ä",
        Ja: 229,
        Ae: "è",
        Be: "é",
        Ce: "ê",
        He: "ë",
        Ai: "ì",
        Bi: "í",
        Ci: "î",
        Hi: "ï",
        Ao: "ò",
        Bo: "ó",
        Co: "ô",
        Do: 245,
        Ho: "ö",
        Au: "ù",
        Bu: "ú",
        Cu: "û",
        Hu: "ü",
        KC: "Ç",
        Kc: "ç",
        q: "æ",
        z: "œ",
        a: "Æ",
        j: "Œ",
        DN: 209,
        Dn: 241,
        Hy: 255,
        S: 169,
        c: 170,
        R: 174,
        "B ": 180,
        0: 176,
        1: 177,
        2: 178,
        3: 179,
        5: 181,
        6: 182,
        7: 183,
        Q: 185,
        k: 186,
        b: 208,
        i: 216,
        l: 222,
        s: 240,
        y: 248,
        "!": 161,
        '"': 162,
        "#": 163,
        "(": 164,
        "%": 165,
        "'": 167,
        "H ": 168,
        "+": 171,
        ";": 187,
        "<": 188,
        "=": 189,
        ">": 190,
        "?": 191,
        "{": 223,
      },
      t = new RegExp(
        "\x1BN(" +
          Xe(e)
            .join("|")
            .replace(/\|\|\|/, "|\\||")
            .replace(/([?()+])/g, "\\$1") +
          "|\\|)",
        "gm",
      ),
      r = function (x, d) {
        var T = e[d];
        return typeof T == "number" ? F0(T) : T;
      },
      n = function (x, d, T) {
        var u = ((d.charCodeAt(0) - 32) << 4) | (T.charCodeAt(0) - 48);
        return u == 59 ? x : F0(u);
      };
    e["|"] = 254;
    function a(x, d) {
      switch (d.type) {
        case "base64":
          return i(Ir(x), d);
        case "binary":
          return i(x, d);
        case "buffer":
          return i(de && Buffer.isBuffer(x) ? x.toString("binary") : Mt(x), d);
        case "array":
          return i(Tn(x), d);
      }
      throw new Error("Unrecognized type " + d.type);
    }
    function i(x, d) {
      var T = x.split(/[\n\r]+/),
        u = -1,
        g = -1,
        O = 0,
        D = 0,
        C = [],
        B = [],
        K = null,
        q = {},
        F = [],
        L = [],
        N = [],
        V = 0,
        U;
      for (+d.codepage >= 0 && Dt(+d.codepage); O !== T.length; ++O) {
        V = 0;
        var X = T[O]
            .trim()
            .replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, n)
            .replace(t, r),
          re = X.replace(/;;/g, "\0")
            .split(";")
            .map(function (A) {
              return A.replace(/\u0000/g, ";");
            }),
          Te = re[0],
          oe;
        if (X.length > 0)
          switch (Te) {
            case "ID":
              break;
            case "E":
              break;
            case "B":
              break;
            case "O":
              break;
            case "W":
              break;
            case "P":
              re[1].charAt(0) == "P" && B.push(X.slice(3).replace(/;;/g, ";"));
              break;
            case "C":
              var be = !1,
                De = !1,
                dr = !1,
                Pe = !1,
                lr = -1,
                tr = -1;
              for (D = 1; D < re.length; ++D)
                switch (re[D].charAt(0)) {
                  case "A":
                    break;
                  case "X":
                    ((g = parseInt(re[D].slice(1)) - 1), (De = !0));
                    break;
                  case "Y":
                    for (u = parseInt(re[D].slice(1)) - 1, De || (g = 0), U = C.length; U <= u; ++U)
                      C[U] = [];
                    break;
                  case "K":
                    ((oe = re[D].slice(1)),
                      oe.charAt(0) === '"'
                        ? (oe = oe.slice(1, oe.length - 1))
                        : oe === "TRUE"
                          ? (oe = !0)
                          : oe === "FALSE"
                            ? (oe = !1)
                            : isNaN(Dr(oe))
                              ? isNaN(It(oe).getDate()) || (oe = Ze(oe))
                              : ((oe = Dr(oe)), K !== null && Sa(K) && (oe = Ca(oe))),
                      (be = !0));
                    break;
                  case "E":
                    Pe = !0;
                    var S = Ro(re[D].slice(1), { r: u, c: g });
                    C[u][g] = [C[u][g], S];
                    break;
                  case "S":
                    ((dr = !0), (C[u][g] = [C[u][g], "S5S"]));
                    break;
                  case "G":
                    break;
                  case "R":
                    lr = parseInt(re[D].slice(1)) - 1;
                    break;
                  case "C":
                    tr = parseInt(re[D].slice(1)) - 1;
                    break;
                  default:
                    if (d && d.WTF) throw new Error("SYLK bad record " + X);
                }
              if (
                (be &&
                  (C[u][g] && C[u][g].length == 2 ? (C[u][g][0] = oe) : (C[u][g] = oe), (K = null)),
                dr)
              ) {
                if (Pe) throw new Error("SYLK shared formula cannot have own formula");
                var M = lr > -1 && C[lr][tr];
                if (!M || !M[1]) throw new Error("SYLK shared formula cannot find base");
                C[u][g][1] = Io(M[1], { r: u - lr, c: g - tr });
              }
              break;
            case "F":
              var y = 0;
              for (D = 1; D < re.length; ++D)
                switch (re[D].charAt(0)) {
                  case "X":
                    ((g = parseInt(re[D].slice(1)) - 1), ++y);
                    break;
                  case "Y":
                    for (u = parseInt(re[D].slice(1)) - 1, U = C.length; U <= u; ++U) C[U] = [];
                    break;
                  case "M":
                    V = parseInt(re[D].slice(1)) / 20;
                    break;
                  case "F":
                    break;
                  case "G":
                    break;
                  case "P":
                    K = B[parseInt(re[D].slice(1))];
                    break;
                  case "S":
                    break;
                  case "D":
                    break;
                  case "N":
                    break;
                  case "W":
                    for (
                      N = re[D].slice(1).split(" "), U = parseInt(N[0], 10);
                      U <= parseInt(N[1], 10);
                      ++U
                    )
                      ((V = parseInt(N[2], 10)),
                        (L[U - 1] = V === 0 ? { hidden: !0 } : { wch: V }),
                        a0(L[U - 1]));
                    break;
                  case "C":
                    ((g = parseInt(re[D].slice(1)) - 1), L[g] || (L[g] = {}));
                    break;
                  case "R":
                    ((u = parseInt(re[D].slice(1)) - 1),
                      F[u] || (F[u] = {}),
                      V > 0 ? ((F[u].hpt = V), (F[u].hpx = di(V))) : V === 0 && (F[u].hidden = !0));
                    break;
                  default:
                    if (d && d.WTF) throw new Error("SYLK bad record " + X);
                }
              y < 1 && (K = null);
              break;
            default:
              if (d && d.WTF) throw new Error("SYLK bad record " + X);
          }
      }
      return (
        F.length > 0 && (q["!rows"] = F),
        L.length > 0 && (q["!cols"] = L),
        d && d.sheetRows && (C = C.slice(0, d.sheetRows)),
        [C, q]
      );
    }
    function s(x, d) {
      var T = a(x, d),
        u = T[0],
        g = T[1],
        O = xt(u, d);
      return (
        Xe(g).forEach(function (D) {
          O[D] = g[D];
        }),
        O
      );
    }
    function f(x, d) {
      return Jr(s(x, d), d);
    }
    function o(x, d, T, u) {
      var g = "C;Y" + (T + 1) + ";X" + (u + 1) + ";K";
      switch (x.t) {
        case "n":
          ((g += x.v || 0), x.f && !x.F && (g += ";E" + s0(x.f, { r: T, c: u })));
          break;
        case "b":
          g += x.v ? "TRUE" : "FALSE";
          break;
        case "e":
          g += x.w || x.v;
          break;
        case "d":
          g += '"' + (x.w || x.v) + '"';
          break;
        case "s":
          g += '"' + x.v.replace(/"/g, "").replace(/;/g, ";;") + '"';
          break;
      }
      return g;
    }
    function l(x, d) {
      d.forEach(function (T, u) {
        var g = "F;W" + (u + 1) + " " + (u + 1) + " ";
        (T.hidden
          ? (g += "0")
          : (typeof T.width == "number" && !T.wpx && (T.wpx = hn(T.width)),
            typeof T.wpx == "number" && !T.wch && (T.wch = un(T.wpx)),
            typeof T.wch == "number" && (g += Math.round(T.wch))),
          g.charAt(g.length - 1) != " " && x.push(g));
      });
    }
    function c(x, d) {
      d.forEach(function (T, u) {
        var g = "F;";
        (T.hidden
          ? (g += "M0;")
          : T.hpt
            ? (g += "M" + 20 * T.hpt + ";")
            : T.hpx && (g += "M" + 20 * xn(T.hpx) + ";"),
          g.length > 2 && x.push(g + "R" + (u + 1)));
      });
    }
    function p(x, d) {
      var T = ["ID;PWXL;N;E"],
        u = [],
        g = Se(x["!ref"]),
        O,
        D = Array.isArray(x),
        C = `\r
`;
      (T.push("P;PGeneral"),
        T.push("F;P0;DG0G8;M255"),
        x["!cols"] && l(T, x["!cols"]),
        x["!rows"] && c(T, x["!rows"]),
        T.push(
          "B;Y" +
            (g.e.r - g.s.r + 1) +
            ";X" +
            (g.e.c - g.s.c + 1) +
            ";D" +
            [g.s.c, g.s.r, g.e.c, g.e.r].join(" "),
        ));
      for (var B = g.s.r; B <= g.e.r; ++B)
        for (var K = g.s.c; K <= g.e.c; ++K) {
          var q = _e({ r: B, c: K });
          ((O = D ? (x[B] || [])[K] : x[q]),
            !(!O || (O.v == null && (!O.f || O.F))) && u.push(o(O, x, B, K)));
        }
      return T.join(C) + C + u.join(C) + C + "E" + C;
    }
    return { to_workbook: f, to_sheet: s, from_sheet: p };
  })(),
  kl = (function () {
    function e(i, s) {
      switch (s.type) {
        case "base64":
          return t(Ir(i), s);
        case "binary":
          return t(i, s);
        case "buffer":
          return t(de && Buffer.isBuffer(i) ? i.toString("binary") : Mt(i), s);
        case "array":
          return t(Tn(i), s);
      }
      throw new Error("Unrecognized type " + s.type);
    }
    function t(i, s) {
      for (
        var f = i.split(`
`),
          o = -1,
          l = -1,
          c = 0,
          p = [];
        c !== f.length;
        ++c
      ) {
        if (f[c].trim() === "BOT") {
          ((p[++o] = []), (l = 0));
          continue;
        }
        if (!(o < 0)) {
          var x = f[c].trim().split(","),
            d = x[0],
            T = x[1];
          ++c;
          for (var u = f[c] || ""; (u.match(/["]/g) || []).length & 1 && c < f.length - 1; )
            u +=
              `
` + f[++c];
          switch (((u = u.trim()), +d)) {
            case -1:
              if (u === "BOT") {
                ((p[++o] = []), (l = 0));
                continue;
              } else if (u !== "EOD") throw new Error("Unrecognized DIF special command " + u);
              break;
            case 0:
              (u === "TRUE"
                ? (p[o][l] = !0)
                : u === "FALSE"
                  ? (p[o][l] = !1)
                  : isNaN(Dr(T))
                    ? isNaN(It(T).getDate())
                      ? (p[o][l] = T)
                      : (p[o][l] = Ze(T))
                    : (p[o][l] = Dr(T)),
                ++l);
              break;
            case 1:
              ((u = u.slice(1, u.length - 1)),
                (u = u.replace(/""/g, '"')),
                u && u.match(/^=".*"$/) && (u = u.slice(2, -1)),
                (p[o][l++] = u !== "" ? u : null));
              break;
          }
          if (u === "EOD") break;
        }
      }
      return (s && s.sheetRows && (p = p.slice(0, s.sheetRows)), p);
    }
    function r(i, s) {
      return xt(e(i, s), s);
    }
    function n(i, s) {
      return Jr(r(i, s), s);
    }
    var a = (function () {
      var i = function (o, l, c, p, x) {
          (o.push(l), o.push(c + "," + p), o.push('"' + x.replace(/"/g, '""') + '"'));
        },
        s = function (o, l, c, p) {
          (o.push(l + "," + c), o.push(l == 1 ? '"' + p.replace(/"/g, '""') + '"' : p));
        };
      return function (o) {
        var l = [],
          c = Se(o["!ref"]),
          p,
          x = Array.isArray(o);
        (i(l, "TABLE", 0, 1, "sheetjs"),
          i(l, "VECTORS", 0, c.e.r - c.s.r + 1, ""),
          i(l, "TUPLES", 0, c.e.c - c.s.c + 1, ""),
          i(l, "DATA", 0, 0, ""));
        for (var d = c.s.r; d <= c.e.r; ++d) {
          s(l, -1, 0, "BOT");
          for (var T = c.s.c; T <= c.e.c; ++T) {
            var u = _e({ r: d, c: T });
            if (((p = x ? (o[d] || [])[T] : o[u]), !p)) {
              s(l, 1, 0, "");
              continue;
            }
            switch (p.t) {
              case "n":
                var g = p.w;
                (!g && p.v != null && (g = p.v),
                  g == null
                    ? p.f && !p.F
                      ? s(l, 1, 0, "=" + p.f)
                      : s(l, 1, 0, "")
                    : s(l, 0, g, "V"));
                break;
              case "b":
                s(l, 0, p.v ? 1 : 0, p.v ? "TRUE" : "FALSE");
                break;
              case "s":
                s(l, 1, 0, isNaN(p.v) ? p.v : '="' + p.v + '"');
                break;
              case "d":
                (p.w || (p.w = Br(p.z || Oe[14], er(Ze(p.v)))), s(l, 0, p.w, "V"));
                break;
              default:
                s(l, 1, 0, "");
            }
          }
        }
        s(l, -1, 0, "EOD");
        var O = `\r
`,
          D = l.join(O);
        return D;
      };
    })();
    return { to_workbook: n, to_sheet: r, from_sheet: a };
  })(),
  ci = (function () {
    function e(p) {
      return p
        .replace(/\\b/g, "\\")
        .replace(/\\c/g, ":")
        .replace(
          /\\n/g,
          `
`,
        );
    }
    function t(p) {
      return p.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n");
    }
    function r(p, x) {
      for (
        var d = p.split(`
`),
          T = -1,
          u = -1,
          g = 0,
          O = [];
        g !== d.length;
        ++g
      ) {
        var D = d[g].trim().split(":");
        if (D[0] === "cell") {
          var C = Me(D[1]);
          if (O.length <= C.r) for (T = O.length; T <= C.r; ++T) O[T] || (O[T] = []);
          switch (((T = C.r), (u = C.c), D[2])) {
            case "t":
              O[T][u] = e(D[3]);
              break;
            case "v":
              O[T][u] = +D[3];
              break;
            case "vtf":
              var B = D[D.length - 1];
            case "vtc":
              (D[3] === "nl" ? (O[T][u] = !!+D[4]) : (O[T][u] = +D[4]),
                D[2] == "vtf" && (O[T][u] = [O[T][u], B]));
          }
        }
      }
      return (x && x.sheetRows && (O = O.slice(0, x.sheetRows)), O);
    }
    function n(p, x) {
      return xt(r(p, x), x);
    }
    function a(p, x) {
      return Jr(n(p, x), x);
    }
    var i = [
        "socialcalc:version:1.5",
        "MIME-Version: 1.0",
        "Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave",
      ].join(`
`),
      s =
        ["--SocialCalcSpreadsheetControlSave", "Content-type: text/plain; charset=UTF-8"].join(`
`) +
        `
`,
      f = ["# SocialCalc Spreadsheet Control Save", "part:sheet"].join(`
`),
      o = "--SocialCalcSpreadsheetControlSave--";
    function l(p) {
      if (!p || !p["!ref"]) return "";
      for (
        var x = [], d = [], T, u = "", g = fr(p["!ref"]), O = Array.isArray(p), D = g.s.r;
        D <= g.e.r;
        ++D
      )
        for (var C = g.s.c; C <= g.e.c; ++C)
          if (
            ((u = _e({ r: D, c: C })),
            (T = O ? (p[D] || [])[C] : p[u]),
            !(!T || T.v == null || T.t === "z"))
          ) {
            switch (((d = ["cell", u, "t"]), T.t)) {
              case "s":
              case "str":
                d.push(t(T.v));
                break;
              case "n":
                T.f
                  ? ((d[2] = "vtf"), (d[3] = "n"), (d[4] = T.v), (d[5] = t(T.f)))
                  : ((d[2] = "v"), (d[3] = T.v));
                break;
              case "b":
                ((d[2] = "vt" + (T.f ? "f" : "c")),
                  (d[3] = "nl"),
                  (d[4] = T.v ? "1" : "0"),
                  (d[5] = t(T.f || (T.v ? "TRUE" : "FALSE"))));
                break;
              case "d":
                var B = er(Ze(T.v));
                ((d[2] = "vtc"),
                  (d[3] = "nd"),
                  (d[4] = "" + B),
                  (d[5] = T.w || Br(T.z || Oe[14], B)));
                break;
              case "e":
                continue;
            }
            x.push(d.join(":"));
          }
      return (
        x.push("sheet:c:" + (g.e.c - g.s.c + 1) + ":r:" + (g.e.r - g.s.r + 1) + ":tvf:1"),
        x.push("valueformat:1:text-wiki"),
        x.join(`
`)
      );
    }
    function c(p) {
      return [i, s, f, s, l(p), o].join(`
`);
    }
    return { to_workbook: a, to_sheet: n, from_sheet: c };
  })(),
  Nl = (function () {
    function e(c, p, x, d, T) {
      T.raw
        ? (p[x][d] = c)
        : c === "" ||
          (c === "TRUE"
            ? (p[x][d] = !0)
            : c === "FALSE"
              ? (p[x][d] = !1)
              : isNaN(Dr(c))
                ? isNaN(It(c).getDate())
                  ? (p[x][d] = c)
                  : (p[x][d] = Ze(c))
                : (p[x][d] = Dr(c)));
    }
    function t(c, p) {
      var x = p || {},
        d = [];
      if (!c || c.length === 0) return d;
      for (var T = c.split(/[\r\n]/), u = T.length - 1; u >= 0 && T[u].length === 0; ) --u;
      for (var g = 10, O = 0, D = 0; D <= u; ++D)
        ((O = T[D].indexOf(" ")), O == -1 ? (O = T[D].length) : O++, (g = Math.max(g, O)));
      for (D = 0; D <= u; ++D) {
        d[D] = [];
        var C = 0;
        for (e(T[D].slice(0, g).trim(), d, D, C, x), C = 1; C <= (T[D].length - g) / 10 + 1; ++C)
          e(T[D].slice(g + (C - 1) * 10, g + C * 10).trim(), d, D, C, x);
      }
      return (x.sheetRows && (d = d.slice(0, x.sheetRows)), d);
    }
    var r = { 44: ",", 9: "	", 59: ";", 124: "|" },
      n = { 44: 3, 9: 2, 59: 1, 124: 0 };
    function a(c) {
      for (var p = {}, x = !1, d = 0, T = 0; d < c.length; ++d)
        (T = c.charCodeAt(d)) == 34 ? (x = !x) : !x && T in r && (p[T] = (p[T] || 0) + 1);
      T = [];
      for (d in p) Object.prototype.hasOwnProperty.call(p, d) && T.push([p[d], d]);
      if (!T.length) {
        p = n;
        for (d in p) Object.prototype.hasOwnProperty.call(p, d) && T.push([p[d], d]);
      }
      return (
        T.sort(function (u, g) {
          return u[0] - g[0] || n[u[1]] - n[g[1]];
        }),
        r[T.pop()[1]] || 44
      );
    }
    function i(c, p) {
      var x = p || {},
        d = "",
        T = x.dense ? [] : {},
        u = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
      c.slice(0, 4) == "sep="
        ? c.charCodeAt(5) == 13 && c.charCodeAt(6) == 10
          ? ((d = c.charAt(4)), (c = c.slice(7)))
          : c.charCodeAt(5) == 13 || c.charCodeAt(5) == 10
            ? ((d = c.charAt(4)), (c = c.slice(6)))
            : (d = a(c.slice(0, 1024)))
        : x && x.FS
          ? (d = x.FS)
          : (d = a(c.slice(0, 1024)));
      var g = 0,
        O = 0,
        D = 0,
        C = 0,
        B = 0,
        K = d.charCodeAt(0),
        q = !1,
        F = 0,
        L = c.charCodeAt(0);
      c = c.replace(
        /\r\n/gm,
        `
`,
      );
      var N = x.dateNF != null ? $s(x.dateNF) : null;
      function V() {
        var U = c.slice(C, B),
          X = {};
        if (
          (U.charAt(0) == '"' &&
            U.charAt(U.length - 1) == '"' &&
            (U = U.slice(1, -1).replace(/""/g, '"')),
          U.length === 0)
        )
          X.t = "z";
        else if (x.raw) ((X.t = "s"), (X.v = U));
        else if (U.trim().length === 0) ((X.t = "s"), (X.v = U));
        else if (U.charCodeAt(0) == 61)
          U.charCodeAt(1) == 34 && U.charCodeAt(U.length - 1) == 34
            ? ((X.t = "s"), (X.v = U.slice(2, -1).replace(/""/g, '"')))
            : ko(U)
              ? ((X.t = "n"), (X.f = U.slice(1)))
              : ((X.t = "s"), (X.v = U));
        else if (U == "TRUE") ((X.t = "b"), (X.v = !0));
        else if (U == "FALSE") ((X.t = "b"), (X.v = !1));
        else if (!isNaN((D = Dr(U)))) ((X.t = "n"), x.cellText !== !1 && (X.w = U), (X.v = D));
        else if (!isNaN(It(U).getDate()) || (N && U.match(N))) {
          X.z = x.dateNF || Oe[14];
          var re = 0;
          (N && U.match(N) && ((U = js(U, x.dateNF, U.match(N) || [])), (re = 1)),
            x.cellDates ? ((X.t = "d"), (X.v = Ze(U, re))) : ((X.t = "n"), (X.v = er(Ze(U, re)))),
            x.cellText !== !1 && (X.w = Br(X.z, X.v instanceof Date ? er(X.v) : X.v)),
            x.cellNF || delete X.z);
        } else ((X.t = "s"), (X.v = U));
        if (
          (X.t == "z" ||
            (x.dense ? (T[g] || (T[g] = []), (T[g][O] = X)) : (T[_e({ c: O, r: g })] = X)),
          (C = B + 1),
          (L = c.charCodeAt(C)),
          u.e.c < O && (u.e.c = O),
          u.e.r < g && (u.e.r = g),
          F == K)
        )
          ++O;
        else if (((O = 0), ++g, x.sheetRows && x.sheetRows <= g)) return !0;
      }
      e: for (; B < c.length; ++B)
        switch ((F = c.charCodeAt(B))) {
          case 34:
            L === 34 && (q = !q);
            break;
          case K:
          case 10:
          case 13:
            if (!q && V()) break e;
            break;
        }
      return (B - C > 0 && V(), (T["!ref"] = Ie(u)), T);
    }
    function s(c, p) {
      return !(p && p.PRN) ||
        p.FS ||
        c.slice(0, 4) == "sep=" ||
        c.indexOf("	") >= 0 ||
        c.indexOf(",") >= 0 ||
        c.indexOf(";") >= 0
        ? i(c, p)
        : xt(t(c, p), p);
    }
    function f(c, p) {
      var x = "",
        d = p.type == "string" ? [0, 0, 0, 0] : Ku(c, p);
      switch (p.type) {
        case "base64":
          x = Ir(c);
          break;
        case "binary":
          x = c;
          break;
        case "buffer":
          p.codepage == 65001
            ? (x = c.toString("utf8"))
            : (p.codepage && typeof rn < "u") ||
              (x = de && Buffer.isBuffer(c) ? c.toString("binary") : Mt(c));
          break;
        case "array":
          x = Tn(c);
          break;
        case "string":
          x = c;
          break;
        default:
          throw new Error("Unrecognized type " + p.type);
      }
      return (
        d[0] == 239 && d[1] == 187 && d[2] == 191
          ? (x = At(x.slice(3)))
          : p.type != "string" && p.type != "buffer" && p.codepage == 65001
            ? (x = At(x))
            : p.type == "binary" && typeof rn < "u",
        x.slice(0, 19) == "socialcalc:version:"
          ? ci.to_sheet(p.type == "string" ? x : At(x), p)
          : s(x, p)
      );
    }
    function o(c, p) {
      return Jr(f(c, p), p);
    }
    function l(c) {
      for (var p = [], x = Se(c["!ref"]), d, T = Array.isArray(c), u = x.s.r; u <= x.e.r; ++u) {
        for (var g = [], O = x.s.c; O <= x.e.c; ++O) {
          var D = _e({ r: u, c: O });
          if (((d = T ? (c[u] || [])[O] : c[D]), !d || d.v == null)) {
            g.push("          ");
            continue;
          }
          for (var C = (d.w || (kr(d), d.w) || "").slice(0, 10); C.length < 10; ) C += " ";
          g.push(C + (O === 0 ? " " : ""));
        }
        p.push(g.join(""));
      }
      return p.join(`
`);
    }
    return { to_workbook: o, to_sheet: f, from_sheet: l };
  })(),
  ta = (function () {
    function e(S, M, y) {
      if (S) {
        ar(S, S.l || 0);
        for (var A = y.Enum || lr; S.l < S.length; ) {
          var G = S.read_shift(2),
            ie = A[G] || A[65535],
            se = S.read_shift(2),
            ae = S.l + se,
            Q = ie.f && ie.f(S, se, y);
          if (((S.l = ae), M(Q, ie, G))) return;
        }
      }
    }
    function t(S, M) {
      switch (M.type) {
        case "base64":
          return r(mr(Ir(S)), M);
        case "binary":
          return r(mr(S), M);
        case "buffer":
        case "array":
          return r(S, M);
      }
      throw "Unsupported type " + M.type;
    }
    function r(S, M) {
      if (!S) return S;
      var y = M || {},
        A = y.dense ? [] : {},
        G = "Sheet1",
        ie = "",
        se = 0,
        ae = {},
        Q = [],
        we = [],
        ue = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } },
        $e = y.sheetRows || 0;
      if (S[2] == 0 && (S[3] == 8 || S[3] == 9) && S.length >= 16 && S[14] == 5 && S[15] === 108)
        throw new Error("Unsupported Works 3 for Mac file");
      if (S[2] == 2)
        ((y.Enum = lr),
          e(
            S,
            function (ne, or, Fr) {
              switch (Fr) {
                case 0:
                  ((y.vers = ne), ne >= 4096 && (y.qpro = !0));
                  break;
                case 6:
                  ue = ne;
                  break;
                case 204:
                  ne && (ie = ne);
                  break;
                case 222:
                  ie = ne;
                  break;
                case 15:
                case 51:
                  y.qpro || (ne[1].v = ne[1].v.slice(1));
                case 13:
                case 14:
                case 16:
                  (Fr == 14 &&
                    (ne[2] & 112) == 112 &&
                    (ne[2] & 15) > 1 &&
                    (ne[2] & 15) < 15 &&
                    ((ne[1].z = y.dateNF || Oe[14]),
                    y.cellDates && ((ne[1].t = "d"), (ne[1].v = Ca(ne[1].v)))),
                    y.qpro &&
                      ne[3] > se &&
                      ((A["!ref"] = Ie(ue)),
                      (ae[G] = A),
                      Q.push(G),
                      (A = y.dense ? [] : {}),
                      (ue = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }),
                      (se = ne[3]),
                      (G = ie || "Sheet" + (se + 1)),
                      (ie = "")));
                  var Hr = y.dense ? (A[ne[0].r] || [])[ne[0].c] : A[_e(ne[0])];
                  if (Hr) {
                    ((Hr.t = ne[1].t),
                      (Hr.v = ne[1].v),
                      ne[1].z != null && (Hr.z = ne[1].z),
                      ne[1].f != null && (Hr.f = ne[1].f));
                    break;
                  }
                  y.dense
                    ? (A[ne[0].r] || (A[ne[0].r] = []), (A[ne[0].r][ne[0].c] = ne[1]))
                    : (A[_e(ne[0])] = ne[1]);
                  break;
              }
            },
            y,
          ));
      else if (S[2] == 26 || S[2] == 14)
        ((y.Enum = tr),
          S[2] == 14 && ((y.qpro = !0), (S.l = 0)),
          e(
            S,
            function (ne, or, Fr) {
              switch (Fr) {
                case 204:
                  G = ne;
                  break;
                case 22:
                  ne[1].v = ne[1].v.slice(1);
                case 23:
                case 24:
                case 25:
                case 37:
                case 39:
                case 40:
                  if (
                    (ne[3] > se &&
                      ((A["!ref"] = Ie(ue)),
                      (ae[G] = A),
                      Q.push(G),
                      (A = y.dense ? [] : {}),
                      (ue = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }),
                      (se = ne[3]),
                      (G = "Sheet" + (se + 1))),
                    $e > 0 && ne[0].r >= $e)
                  )
                    break;
                  (y.dense
                    ? (A[ne[0].r] || (A[ne[0].r] = []), (A[ne[0].r][ne[0].c] = ne[1]))
                    : (A[_e(ne[0])] = ne[1]),
                    ue.e.c < ne[0].c && (ue.e.c = ne[0].c),
                    ue.e.r < ne[0].r && (ue.e.r = ne[0].r));
                  break;
                case 27:
                  ne[14e3] && (we[ne[14e3][0]] = ne[14e3][1]);
                  break;
                case 1537:
                  ((we[ne[0]] = ne[1]), ne[0] == se && (G = ne[1]));
                  break;
              }
            },
            y,
          ));
      else throw new Error("Unrecognized LOTUS BOF " + S[2]);
      if (((A["!ref"] = Ie(ue)), (ae[ie || G] = A), Q.push(ie || G), !we.length))
        return { SheetNames: Q, Sheets: ae };
      for (var pe = {}, Ar = [], ye = 0; ye < we.length; ++ye)
        ae[Q[ye]]
          ? (Ar.push(we[ye] || Q[ye]), (pe[we[ye]] = ae[we[ye]] || ae[Q[ye]]))
          : (Ar.push(we[ye]), (pe[we[ye]] = { "!ref": "A1" }));
      return { SheetNames: Ar, Sheets: pe };
    }
    function n(S, M) {
      var y = M || {};
      if ((+y.codepage >= 0 && Dt(+y.codepage), y.type == "string"))
        throw new Error("Cannot write WK1 to JS string");
      var A = Qe(),
        G = Se(S["!ref"]),
        ie = Array.isArray(S),
        se = [];
      (J(A, 0, i(1030)), J(A, 6, o(G)));
      for (var ae = Math.min(G.e.r, 8191), Q = G.s.r; Q <= ae; ++Q)
        for (var we = Ge(Q), ue = G.s.c; ue <= G.e.c; ++ue) {
          Q === G.s.r && (se[ue] = Ke(ue));
          var $e = se[ue] + we,
            pe = ie ? (S[Q] || [])[ue] : S[$e];
          if (!(!pe || pe.t == "z"))
            if (pe.t == "n")
              (pe.v | 0) == pe.v && pe.v >= -32768 && pe.v <= 32767
                ? J(A, 13, d(Q, ue, pe.v))
                : J(A, 14, u(Q, ue, pe.v));
            else {
              var Ar = kr(pe);
              J(A, 15, p(Q, ue, Ar.slice(0, 239)));
            }
        }
      return (J(A, 1), A.end());
    }
    function a(S, M) {
      var y = M || {};
      if ((+y.codepage >= 0 && Dt(+y.codepage), y.type == "string"))
        throw new Error("Cannot write WK3 to JS string");
      var A = Qe();
      J(A, 0, s(S));
      for (var G = 0, ie = 0; G < S.SheetNames.length; ++G)
        (S.Sheets[S.SheetNames[G]] || {})["!ref"] && J(A, 27, Pe(S.SheetNames[G], ie++));
      var se = 0;
      for (G = 0; G < S.SheetNames.length; ++G) {
        var ae = S.Sheets[S.SheetNames[G]];
        if (!(!ae || !ae["!ref"])) {
          for (
            var Q = Se(ae["!ref"]),
              we = Array.isArray(ae),
              ue = [],
              $e = Math.min(Q.e.r, 8191),
              pe = Q.s.r;
            pe <= $e;
            ++pe
          )
            for (var Ar = Ge(pe), ye = Q.s.c; ye <= Q.e.c; ++ye) {
              pe === Q.s.r && (ue[ye] = Ke(ye));
              var ne = ue[ye] + Ar,
                or = we ? (ae[pe] || [])[ye] : ae[ne];
              if (!(!or || or.t == "z"))
                if (or.t == "n") J(A, 23, V(pe, ye, se, or.v));
                else {
                  var Fr = kr(or);
                  J(A, 22, F(pe, ye, se, Fr.slice(0, 239)));
                }
            }
          ++se;
        }
      }
      return (J(A, 1), A.end());
    }
    function i(S) {
      var M = b(2);
      return (M.write_shift(2, S), M);
    }
    function s(S) {
      var M = b(26);
      (M.write_shift(2, 4096), M.write_shift(2, 4), M.write_shift(4, 0));
      for (var y = 0, A = 0, G = 0, ie = 0; ie < S.SheetNames.length; ++ie) {
        var se = S.SheetNames[ie],
          ae = S.Sheets[se];
        if (!(!ae || !ae["!ref"])) {
          ++G;
          var Q = fr(ae["!ref"]);
          (y < Q.e.r && (y = Q.e.r), A < Q.e.c && (A = Q.e.c));
        }
      }
      return (
        y > 8191 && (y = 8191),
        M.write_shift(2, y),
        M.write_shift(1, G),
        M.write_shift(1, A),
        M.write_shift(2, 0),
        M.write_shift(2, 0),
        M.write_shift(1, 1),
        M.write_shift(1, 2),
        M.write_shift(4, 0),
        M.write_shift(4, 0),
        M
      );
    }
    function f(S, M, y) {
      var A = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
      return M == 8 && y.qpro
        ? ((A.s.c = S.read_shift(1)),
          S.l++,
          (A.s.r = S.read_shift(2)),
          (A.e.c = S.read_shift(1)),
          S.l++,
          (A.e.r = S.read_shift(2)),
          A)
        : ((A.s.c = S.read_shift(2)),
          (A.s.r = S.read_shift(2)),
          M == 12 && y.qpro && (S.l += 2),
          (A.e.c = S.read_shift(2)),
          (A.e.r = S.read_shift(2)),
          M == 12 && y.qpro && (S.l += 2),
          A.s.c == 65535 && (A.s.c = A.e.c = A.s.r = A.e.r = 0),
          A);
    }
    function o(S) {
      var M = b(8);
      return (
        M.write_shift(2, S.s.c),
        M.write_shift(2, S.s.r),
        M.write_shift(2, S.e.c),
        M.write_shift(2, S.e.r),
        M
      );
    }
    function l(S, M, y) {
      var A = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0, 0];
      return (
        y.qpro && y.vers != 20768
          ? ((A[0].c = S.read_shift(1)),
            (A[3] = S.read_shift(1)),
            (A[0].r = S.read_shift(2)),
            (S.l += 2))
          : ((A[2] = S.read_shift(1)), (A[0].c = S.read_shift(2)), (A[0].r = S.read_shift(2))),
        A
      );
    }
    function c(S, M, y) {
      var A = S.l + M,
        G = l(S, M, y);
      if (((G[1].t = "s"), y.vers == 20768)) {
        S.l++;
        var ie = S.read_shift(1);
        return ((G[1].v = S.read_shift(ie, "utf8")), G);
      }
      return (y.qpro && S.l++, (G[1].v = S.read_shift(A - S.l, "cstr")), G);
    }
    function p(S, M, y) {
      var A = b(7 + y.length);
      (A.write_shift(1, 255), A.write_shift(2, M), A.write_shift(2, S), A.write_shift(1, 39));
      for (var G = 0; G < A.length; ++G) {
        var ie = y.charCodeAt(G);
        A.write_shift(1, ie >= 128 ? 95 : ie);
      }
      return (A.write_shift(1, 0), A);
    }
    function x(S, M, y) {
      var A = l(S, M, y);
      return ((A[1].v = S.read_shift(2, "i")), A);
    }
    function d(S, M, y) {
      var A = b(7);
      return (
        A.write_shift(1, 255), A.write_shift(2, M), A.write_shift(2, S), A.write_shift(2, y, "i"), A
      );
    }
    function T(S, M, y) {
      var A = l(S, M, y);
      return ((A[1].v = S.read_shift(8, "f")), A);
    }
    function u(S, M, y) {
      var A = b(13);
      return (
        A.write_shift(1, 255), A.write_shift(2, M), A.write_shift(2, S), A.write_shift(8, y, "f"), A
      );
    }
    function g(S, M, y) {
      var A = S.l + M,
        G = l(S, M, y);
      if (((G[1].v = S.read_shift(8, "f")), y.qpro)) S.l = A;
      else {
        var ie = S.read_shift(2);
        (B(S.slice(S.l, S.l + ie), G), (S.l += ie));
      }
      return G;
    }
    function O(S, M, y) {
      var A = M & 32768;
      return (
        (M &= -32769),
        (M = (A ? S : 0) + (M >= 8192 ? M - 16384 : M)),
        (A ? "" : "$") + (y ? Ke(M) : Ge(M))
      );
    }
    var D = {
        51: ["FALSE", 0],
        52: ["TRUE", 0],
        70: ["LEN", 1],
        80: ["SUM", 69],
        81: ["AVERAGEA", 69],
        82: ["COUNTA", 69],
        83: ["MINA", 69],
        84: ["MAXA", 69],
        111: ["T", 1],
      },
      C = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "+",
        "-",
        "*",
        "/",
        "^",
        "=",
        "<>",
        "<=",
        ">=",
        "<",
        ">",
        "",
        "",
        "",
        "",
        "&",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];
    function B(S, M) {
      ar(S, 0);
      for (var y = [], A = 0, G = "", ie = "", se = "", ae = ""; S.l < S.length; ) {
        var Q = S[S.l++];
        switch (Q) {
          case 0:
            y.push(S.read_shift(8, "f"));
            break;
          case 1:
            ((ie = O(M[0].c, S.read_shift(2), !0)),
              (G = O(M[0].r, S.read_shift(2), !1)),
              y.push(ie + G));
            break;
          case 2:
            {
              var we = O(M[0].c, S.read_shift(2), !0),
                ue = O(M[0].r, S.read_shift(2), !1);
              ((ie = O(M[0].c, S.read_shift(2), !0)),
                (G = O(M[0].r, S.read_shift(2), !1)),
                y.push(we + ue + ":" + ie + G));
            }
            break;
          case 3:
            if (S.l < S.length) {
              console.error("WK1 premature formula end");
              return;
            }
            break;
          case 4:
            y.push("(" + y.pop() + ")");
            break;
          case 5:
            y.push(S.read_shift(2));
            break;
          case 6:
            {
              for (var $e = ""; (Q = S[S.l++]); ) $e += String.fromCharCode(Q);
              y.push('"' + $e.replace(/"/g, '""') + '"');
            }
            break;
          case 8:
            y.push("-" + y.pop());
            break;
          case 23:
            y.push("+" + y.pop());
            break;
          case 22:
            y.push("NOT(" + y.pop() + ")");
            break;
          case 20:
          case 21:
            ((ae = y.pop()),
              (se = y.pop()),
              y.push(["AND", "OR"][Q - 20] + "(" + se + "," + ae + ")"));
            break;
          default:
            if (Q < 32 && C[Q]) ((ae = y.pop()), (se = y.pop()), y.push(se + C[Q] + ae));
            else if (D[Q]) {
              if (((A = D[Q][1]), A == 69 && (A = S[S.l++]), A > y.length)) {
                console.error(
                  "WK1 bad formula parse 0x" + Q.toString(16) + ":|" + y.join("|") + "|",
                );
                return;
              }
              var pe = y.slice(-A);
              ((y.length -= A), y.push(D[Q][0] + "(" + pe.join(",") + ")"));
            } else
              return Q <= 7
                ? console.error("WK1 invalid opcode " + Q.toString(16))
                : Q <= 24
                  ? console.error("WK1 unsupported op " + Q.toString(16))
                  : Q <= 30
                    ? console.error("WK1 invalid opcode " + Q.toString(16))
                    : Q <= 115
                      ? console.error("WK1 unsupported function opcode " + Q.toString(16))
                      : console.error("WK1 unrecognized opcode " + Q.toString(16));
        }
      }
      y.length == 1
        ? (M[1].f = "" + y[0])
        : console.error("WK1 bad formula parse |" + y.join("|") + "|");
    }
    function K(S) {
      var M = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0];
      return ((M[0].r = S.read_shift(2)), (M[3] = S[S.l++]), (M[0].c = S[S.l++]), M);
    }
    function q(S, M) {
      var y = K(S);
      return ((y[1].t = "s"), (y[1].v = S.read_shift(M - 4, "cstr")), y);
    }
    function F(S, M, y, A) {
      var G = b(6 + A.length);
      (G.write_shift(2, S), G.write_shift(1, y), G.write_shift(1, M), G.write_shift(1, 39));
      for (var ie = 0; ie < A.length; ++ie) {
        var se = A.charCodeAt(ie);
        G.write_shift(1, se >= 128 ? 95 : se);
      }
      return (G.write_shift(1, 0), G);
    }
    function L(S, M) {
      var y = K(S);
      y[1].v = S.read_shift(2);
      var A = y[1].v >> 1;
      if (y[1].v & 1)
        switch (A & 7) {
          case 0:
            A = (A >> 3) * 5e3;
            break;
          case 1:
            A = (A >> 3) * 500;
            break;
          case 2:
            A = (A >> 3) / 20;
            break;
          case 3:
            A = (A >> 3) / 200;
            break;
          case 4:
            A = (A >> 3) / 2e3;
            break;
          case 5:
            A = (A >> 3) / 2e4;
            break;
          case 6:
            A = (A >> 3) / 16;
            break;
          case 7:
            A = (A >> 3) / 64;
            break;
        }
      return ((y[1].v = A), y);
    }
    function N(S, M) {
      var y = K(S),
        A = S.read_shift(4),
        G = S.read_shift(4),
        ie = S.read_shift(2);
      if (ie == 65535)
        return (
          A === 0 && G === 3221225472
            ? ((y[1].t = "e"), (y[1].v = 15))
            : A === 0 && G === 3489660928
              ? ((y[1].t = "e"), (y[1].v = 42))
              : (y[1].v = 0),
          y
        );
      var se = ie & 32768;
      return (
        (ie = (ie & 32767) - 16446),
        (y[1].v = (1 - se * 2) * (G * Math.pow(2, ie + 32) + A * Math.pow(2, ie))),
        y
      );
    }
    function V(S, M, y, A) {
      var G = b(14);
      if ((G.write_shift(2, S), G.write_shift(1, y), G.write_shift(1, M), A == 0))
        return (G.write_shift(4, 0), G.write_shift(4, 0), G.write_shift(2, 65535), G);
      var ie = 0,
        se = 0,
        ae = 0,
        Q = 0;
      return (
        A < 0 && ((ie = 1), (A = -A)),
        (se = Math.log2(A) | 0),
        (A /= Math.pow(2, se - 31)),
        (Q = A >>> 0),
        (Q & 2147483648) == 0 && ((A /= 2), ++se, (Q = A >>> 0)),
        (A -= Q),
        (Q |= 2147483648),
        (Q >>>= 0),
        (A *= Math.pow(2, 32)),
        (ae = A >>> 0),
        G.write_shift(4, ae),
        G.write_shift(4, Q),
        (se += 16383 + (ie ? 32768 : 0)),
        G.write_shift(2, se),
        G
      );
    }
    function U(S, M) {
      var y = N(S);
      return ((S.l += M - 14), y);
    }
    function X(S, M) {
      var y = K(S),
        A = S.read_shift(4);
      return ((y[1].v = A >> 6), y);
    }
    function re(S, M) {
      var y = K(S),
        A = S.read_shift(8, "f");
      return ((y[1].v = A), y);
    }
    function Te(S, M) {
      var y = re(S);
      return ((S.l += M - 10), y);
    }
    function oe(S, M) {
      return S[S.l + M - 1] == 0 ? S.read_shift(M, "cstr") : "";
    }
    function be(S, M) {
      var y = S[S.l++];
      y > M - 1 && (y = M - 1);
      for (var A = ""; A.length < y; ) A += String.fromCharCode(S[S.l++]);
      return A;
    }
    function De(S, M, y) {
      if (!(!y.qpro || M < 21)) {
        var A = S.read_shift(1);
        ((S.l += 17), (S.l += 1), (S.l += 2));
        var G = S.read_shift(M - 21, "cstr");
        return [A, G];
      }
    }
    function dr(S, M) {
      for (var y = {}, A = S.l + M; S.l < A; ) {
        var G = S.read_shift(2);
        if (G == 14e3) {
          for (y[G] = [0, ""], y[G][0] = S.read_shift(2); S[S.l]; )
            ((y[G][1] += String.fromCharCode(S[S.l])), S.l++);
          S.l++;
        }
      }
      return y;
    }
    function Pe(S, M) {
      var y = b(5 + S.length);
      (y.write_shift(2, 14e3), y.write_shift(2, M));
      for (var A = 0; A < S.length; ++A) {
        var G = S.charCodeAt(A);
        y[y.l++] = G > 127 ? 95 : G;
      }
      return ((y[y.l++] = 0), y);
    }
    var lr = {
        0: { n: "BOF", f: ii },
        1: { n: "EOF" },
        2: { n: "CALCMODE" },
        3: { n: "CALCORDER" },
        4: { n: "SPLIT" },
        5: { n: "SYNC" },
        6: { n: "RANGE", f },
        7: { n: "WINDOW1" },
        8: { n: "COLW1" },
        9: { n: "WINTWO" },
        10: { n: "COLW2" },
        11: { n: "NAME" },
        12: { n: "BLANK" },
        13: { n: "INTEGER", f: x },
        14: { n: "NUMBER", f: T },
        15: { n: "LABEL", f: c },
        16: { n: "FORMULA", f: g },
        24: { n: "TABLE" },
        25: { n: "ORANGE" },
        26: { n: "PRANGE" },
        27: { n: "SRANGE" },
        28: { n: "FRANGE" },
        29: { n: "KRANGE1" },
        32: { n: "HRANGE" },
        35: { n: "KRANGE2" },
        36: { n: "PROTEC" },
        37: { n: "FOOTER" },
        38: { n: "HEADER" },
        39: { n: "SETUP" },
        40: { n: "MARGINS" },
        41: { n: "LABELFMT" },
        42: { n: "TITLES" },
        43: { n: "SHEETJS" },
        45: { n: "GRAPH" },
        46: { n: "NGRAPH" },
        47: { n: "CALCCOUNT" },
        48: { n: "UNFORMATTED" },
        49: { n: "CURSORW12" },
        50: { n: "WINDOW" },
        51: { n: "STRING", f: c },
        55: { n: "PASSWORD" },
        56: { n: "LOCKED" },
        60: { n: "QUERY" },
        61: { n: "QUERYNAME" },
        62: { n: "PRINT" },
        63: { n: "PRINTNAME" },
        64: { n: "GRAPH2" },
        65: { n: "GRAPHNAME" },
        66: { n: "ZOOM" },
        67: { n: "SYMSPLIT" },
        68: { n: "NSROWS" },
        69: { n: "NSCOLS" },
        70: { n: "RULER" },
        71: { n: "NNAME" },
        72: { n: "ACOMM" },
        73: { n: "AMACRO" },
        74: { n: "PARSE" },
        102: { n: "PRANGES??" },
        103: { n: "RRANGES??" },
        104: { n: "FNAME??" },
        105: { n: "MRANGES??" },
        204: { n: "SHEETNAMECS", f: oe },
        222: { n: "SHEETNAMELP", f: be },
        65535: { n: "" },
      },
      tr = {
        0: { n: "BOF" },
        1: { n: "EOF" },
        2: { n: "PASSWORD" },
        3: { n: "CALCSET" },
        4: { n: "WINDOWSET" },
        5: { n: "SHEETCELLPTR" },
        6: { n: "SHEETLAYOUT" },
        7: { n: "COLUMNWIDTH" },
        8: { n: "HIDDENCOLUMN" },
        9: { n: "USERRANGE" },
        10: { n: "SYSTEMRANGE" },
        11: { n: "ZEROFORCE" },
        12: { n: "SORTKEYDIR" },
        13: { n: "FILESEAL" },
        14: { n: "DATAFILLNUMS" },
        15: { n: "PRINTMAIN" },
        16: { n: "PRINTSTRING" },
        17: { n: "GRAPHMAIN" },
        18: { n: "GRAPHSTRING" },
        19: { n: "??" },
        20: { n: "ERRCELL" },
        21: { n: "NACELL" },
        22: { n: "LABEL16", f: q },
        23: { n: "NUMBER17", f: N },
        24: { n: "NUMBER18", f: L },
        25: { n: "FORMULA19", f: U },
        26: { n: "FORMULA1A" },
        27: { n: "XFORMAT", f: dr },
        28: { n: "DTLABELMISC" },
        29: { n: "DTLABELCELL" },
        30: { n: "GRAPHWINDOW" },
        31: { n: "CPA" },
        32: { n: "LPLAUTO" },
        33: { n: "QUERY" },
        34: { n: "HIDDENSHEET" },
        35: { n: "??" },
        37: { n: "NUMBER25", f: X },
        38: { n: "??" },
        39: { n: "NUMBER27", f: re },
        40: { n: "FORMULA28", f: Te },
        142: { n: "??" },
        147: { n: "??" },
        150: { n: "??" },
        151: { n: "??" },
        152: { n: "??" },
        153: { n: "??" },
        154: { n: "??" },
        155: { n: "??" },
        156: { n: "??" },
        163: { n: "??" },
        174: { n: "??" },
        175: { n: "??" },
        176: { n: "??" },
        177: { n: "??" },
        184: { n: "??" },
        185: { n: "??" },
        186: { n: "??" },
        187: { n: "??" },
        188: { n: "??" },
        195: { n: "??" },
        201: { n: "??" },
        204: { n: "SHEETNAMECS", f: oe },
        205: { n: "??" },
        206: { n: "??" },
        207: { n: "??" },
        208: { n: "??" },
        256: { n: "??" },
        259: { n: "??" },
        260: { n: "??" },
        261: { n: "??" },
        262: { n: "??" },
        263: { n: "??" },
        265: { n: "??" },
        266: { n: "??" },
        267: { n: "??" },
        268: { n: "??" },
        270: { n: "??" },
        271: { n: "??" },
        384: { n: "??" },
        389: { n: "??" },
        390: { n: "??" },
        393: { n: "??" },
        396: { n: "??" },
        512: { n: "??" },
        514: { n: "??" },
        513: { n: "??" },
        516: { n: "??" },
        517: { n: "??" },
        640: { n: "??" },
        641: { n: "??" },
        642: { n: "??" },
        643: { n: "??" },
        644: { n: "??" },
        645: { n: "??" },
        646: { n: "??" },
        647: { n: "??" },
        648: { n: "??" },
        658: { n: "??" },
        659: { n: "??" },
        660: { n: "??" },
        661: { n: "??" },
        662: { n: "??" },
        665: { n: "??" },
        666: { n: "??" },
        768: { n: "??" },
        772: { n: "??" },
        1537: { n: "SHEETINFOQP", f: De },
        1600: { n: "??" },
        1602: { n: "??" },
        1793: { n: "??" },
        1794: { n: "??" },
        1795: { n: "??" },
        1796: { n: "??" },
        1920: { n: "??" },
        2048: { n: "??" },
        2049: { n: "??" },
        2052: { n: "??" },
        2688: { n: "??" },
        10998: { n: "??" },
        12849: { n: "??" },
        28233: { n: "??" },
        28484: { n: "??" },
        65535: { n: "" },
      };
    return { sheet_to_wk1: n, book_to_wk3: a, to_workbook: t };
  })(),
  Pl = /^\s|\s$|[\t\n\r]/;
function hi(e, t) {
  if (!t.bookSST) return "";
  var r = [ke];
  r[r.length] = j("sst", null, { xmlns: ut[0], count: e.Count, uniqueCount: e.Unique });
  for (var n = 0; n != e.length; ++n)
    if (e[n] != null) {
      var a = e[n],
        i = "<si>";
      (a.r
        ? (i += a.r)
        : ((i += "<t"),
          a.t || (a.t = ""),
          a.t.match(Pl) && (i += ' xml:space="preserve"'),
          (i += ">" + ge(a.t) + "</t>")),
        (i += "</si>"),
        (r[r.length] = i));
    }
  return (r.length > 2 && ((r[r.length] = "</sst>"), (r[1] = r[1].replace("/>", ">"))), r.join(""));
}
function Ll(e) {
  return [e.read_shift(4), e.read_shift(4)];
}
function Ml(e, t) {
  return (t || (t = b(8)), t.write_shift(4, e.Count), t.write_shift(4, e.Unique), t);
}
var Bl = Cf;
function bl(e) {
  var t = Qe();
  H(t, 159, Ml(e));
  for (var r = 0; r < e.length; ++r) H(t, 19, Bl(e[r]));
  return (H(t, 160), t.end());
}
function Ul(e) {
  for (var t = [], r = e.split(""), n = 0; n < r.length; ++n) t[n] = r[n].charCodeAt(0);
  return t;
}
function ui(e) {
  var t = 0,
    r,
    n = Ul(e),
    a = n.length + 1,
    i,
    s,
    f,
    o,
    l;
  for (r = Yr(a), r[0] = n.length, i = 1; i != a; ++i) r[i] = n[i - 1];
  for (i = a - 1; i >= 0; --i)
    ((s = r[i]), (f = (t & 16384) === 0 ? 0 : 1), (o = (t << 1) & 32767), (l = f | o), (t = l ^ s));
  return t ^ 52811;
}
var Wl = (function () {
  function e(a, i) {
    switch (i.type) {
      case "base64":
        return t(Ir(a), i);
      case "binary":
        return t(a, i);
      case "buffer":
        return t(de && Buffer.isBuffer(a) ? a.toString("binary") : Mt(a), i);
      case "array":
        return t(Tn(a), i);
    }
    throw new Error("Unrecognized type " + i.type);
  }
  function t(a, i) {
    var s = i || {},
      f = s.dense ? [] : {},
      o = a.match(/\\trowd.*?\\row\b/g);
    if (!o.length) throw new Error("RTF missing table");
    var l = { s: { c: 0, r: 0 }, e: { c: 0, r: o.length - 1 } };
    return (
      o.forEach(function (c, p) {
        Array.isArray(f) && (f[p] = []);
        for (var x = /\\\w+\b/g, d = 0, T, u = -1; (T = x.exec(c)); ) {
          switch (T[0]) {
            case "\\cell":
              var g = c.slice(d, x.lastIndex - T[0].length);
              if ((g[0] == " " && (g = g.slice(1)), ++u, g.length)) {
                var O = { v: g, t: "s" };
                Array.isArray(f) ? (f[p][u] = O) : (f[_e({ r: p, c: u })] = O);
              }
              break;
          }
          d = x.lastIndex;
        }
        u > l.e.c && (l.e.c = u);
      }),
      (f["!ref"] = Ie(l)),
      f
    );
  }
  function r(a, i) {
    return Jr(e(a, i), i);
  }
  function n(a) {
    for (
      var i = ["{\\rtf1\\ansi"], s = Se(a["!ref"]), f, o = Array.isArray(a), l = s.s.r;
      l <= s.e.r;
      ++l
    ) {
      i.push("\\trowd\\trautofit1");
      for (var c = s.s.c; c <= s.e.c; ++c) i.push("\\cellx" + (c + 1));
      for (i.push("\\pard\\intbl"), c = s.s.c; c <= s.e.c; ++c) {
        var p = _e({ r: l, c });
        ((f = o ? (a[l] || [])[c] : a[p]),
          !(!f || (f.v == null && (!f.f || f.F))) &&
            (i.push(" " + (f.w || (kr(f), f.w))), i.push("\\cell")));
      }
      i.push("\\pard\\intbl\\row");
    }
    return i.join("") + "}";
  }
  return { to_workbook: r, to_sheet: e, from_sheet: n };
})();
function na(e) {
  for (var t = 0, r = 1; t != 3; ++t) r = r * 256 + (e[t] > 255 ? 255 : e[t] < 0 ? 0 : e[t]);
  return r.toString(16).toUpperCase().slice(1);
}
var Hl = 6,
  Rr = Hl;
function hn(e) {
  return Math.floor((e + Math.round(128 / Rr) / 256) * Rr);
}
function un(e) {
  return Math.floor(((e - 5) / Rr) * 100 + 0.5) / 100;
}
function Gn(e) {
  return Math.round(((e * Rr + 5) / Rr) * 256) / 256;
}
function a0(e) {
  (e.width
    ? ((e.wpx = hn(e.width)), (e.wch = un(e.wpx)), (e.MDW = Rr))
    : e.wpx
      ? ((e.wch = un(e.wpx)), (e.width = Gn(e.wch)), (e.MDW = Rr))
      : typeof e.wch == "number" && ((e.width = Gn(e.wch)), (e.wpx = hn(e.width)), (e.MDW = Rr)),
    e.customWidth && delete e.customWidth);
}
var Vl = 96,
  xi = Vl;
function xn(e) {
  return (e * 96) / xi;
}
function di(e) {
  return (e * xi) / 96;
}
function Gl(e) {
  var t = ["<numFmts>"];
  return (
    [
      [5, 8],
      [23, 26],
      [41, 44],
      [50, 392],
    ].forEach(function (r) {
      for (var n = r[0]; n <= r[1]; ++n)
        e[n] != null && (t[t.length] = j("numFmt", null, { numFmtId: n, formatCode: ge(e[n]) }));
    }),
    t.length === 1
      ? ""
      : ((t[t.length] = "</numFmts>"),
        (t[0] = j("numFmts", null, { count: t.length - 2 }).replace("/>", ">")),
        t.join(""))
  );
}
function Xl(e) {
  var t = [];
  return (
    (t[t.length] = j("cellXfs", null)),
    e.forEach(function (r) {
      t[t.length] = j("xf", null, r);
    }),
    (t[t.length] = "</cellXfs>"),
    t.length === 2
      ? ""
      : ((t[0] = j("cellXfs", null, { count: t.length - 2 }).replace("/>", ">")), t.join(""))
  );
}
function pi(e, t) {
  var r = [ke, j("styleSheet", null, { xmlns: ut[0], "xmlns:vt": Le.vt })],
    n;
  return (
    e.SSF && (n = Gl(e.SSF)) != null && (r[r.length] = n),
    (r[r.length] =
      '<fonts count="1"><font><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>'),
    (r[r.length] =
      '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'),
    (r[r.length] =
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'),
    (r[r.length] =
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'),
    (n = Xl(t.cellXfs)) && (r[r.length] = n),
    (r[r.length] =
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'),
    (r[r.length] = '<dxfs count="0"/>'),
    (r[r.length] =
      '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4"/>'),
    r.length > 2 && ((r[r.length] = "</styleSheet>"), (r[1] = r[1].replace("/>", ">"))),
    r.join("")
  );
}
function zl(e, t) {
  var r = e.read_shift(2),
    n = Ye(e);
  return [r, n];
}
function Kl(e, t, r) {
  (r || (r = b(6 + 4 * t.length)), r.write_shift(2, e), Be(t, r));
  var n = r.length > r.l ? r.slice(0, r.l) : r;
  return (r.l == null && (r.l = r.length), n);
}
function Yl(e, t, r) {
  var n = {};
  n.sz = e.read_shift(2) / 20;
  var a = Pf(e);
  (a.fItalic && (n.italic = 1),
    a.fCondense && (n.condense = 1),
    a.fExtend && (n.extend = 1),
    a.fShadow && (n.shadow = 1),
    a.fOutline && (n.outline = 1),
    a.fStrikeout && (n.strike = 1));
  var i = e.read_shift(2);
  switch ((i === 700 && (n.bold = 1), e.read_shift(2))) {
    case 1:
      n.vertAlign = "superscript";
      break;
    case 2:
      n.vertAlign = "subscript";
      break;
  }
  var s = e.read_shift(1);
  s != 0 && (n.underline = s);
  var f = e.read_shift(1);
  f > 0 && (n.family = f);
  var o = e.read_shift(1);
  switch ((o > 0 && (n.charset = o), e.l++, (n.color = Nf(e)), e.read_shift(1))) {
    case 1:
      n.scheme = "major";
      break;
    case 2:
      n.scheme = "minor";
      break;
  }
  return ((n.name = Ye(e)), n);
}
function $l(e, t) {
  (t || (t = b(153)), t.write_shift(2, e.sz * 20), Lf(e, t), t.write_shift(2, e.bold ? 700 : 400));
  var r = 0;
  (e.vertAlign == "superscript" ? (r = 1) : e.vertAlign == "subscript" && (r = 2),
    t.write_shift(2, r),
    t.write_shift(1, e.underline || 0),
    t.write_shift(1, e.family || 0),
    t.write_shift(1, e.charset || 0),
    t.write_shift(1, 0),
    on(e.color, t));
  var n = 0;
  return ((n = 2), t.write_shift(1, n), Be(e.name, t), t.length > t.l ? t.slice(0, t.l) : t);
}
var jl = [
    "none",
    "solid",
    "mediumGray",
    "darkGray",
    "lightGray",
    "darkHorizontal",
    "darkVertical",
    "darkDown",
    "darkUp",
    "darkGrid",
    "darkTrellis",
    "lightHorizontal",
    "lightVertical",
    "lightDown",
    "lightUp",
    "lightGrid",
    "lightTrellis",
    "gray125",
    "gray0625",
  ],
  Ln,
  Jl = Sr;
function aa(e, t) {
  (t || (t = b(84)), Ln || (Ln = Kn(jl)));
  var r = Ln[e.patternType];
  (r == null && (r = 40), t.write_shift(4, r));
  var n = 0;
  if (r != 40) for (on({ auto: 1 }, t), on({ auto: 1 }, t); n < 12; ++n) t.write_shift(4, 0);
  else {
    for (; n < 4; ++n) t.write_shift(4, 0);
    for (; n < 12; ++n) t.write_shift(4, 0);
  }
  return t.length > t.l ? t.slice(0, t.l) : t;
}
function Zl(e, t) {
  var r = e.l + t,
    n = e.read_shift(2),
    a = e.read_shift(2);
  return ((e.l = r), { ixfe: n, numFmtId: a });
}
function vi(e, t, r) {
  (r || (r = b(16)),
    r.write_shift(2, t || 0),
    r.write_shift(2, e.numFmtId || 0),
    r.write_shift(2, 0),
    r.write_shift(2, 0),
    r.write_shift(2, 0),
    r.write_shift(1, 0),
    r.write_shift(1, 0));
  var n = 0;
  return (r.write_shift(1, n), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r);
}
function Et(e, t) {
  return (
    t || (t = b(10)),
    t.write_shift(1, 0),
    t.write_shift(1, 0),
    t.write_shift(4, 0),
    t.write_shift(4, 0),
    t
  );
}
var ql = Sr;
function Ql(e, t) {
  return (
    t || (t = b(51)),
    t.write_shift(1, 0),
    Et(null, t),
    Et(null, t),
    Et(null, t),
    Et(null, t),
    Et(null, t),
    t.length > t.l ? t.slice(0, t.l) : t
  );
}
function eo(e, t) {
  return (
    t || (t = b(52)),
    t.write_shift(4, e.xfId),
    t.write_shift(2, 1),
    t.write_shift(1, 0),
    t.write_shift(1, 0),
    ln(e.name || "", t),
    t.length > t.l ? t.slice(0, t.l) : t
  );
}
function ro(e, t, r) {
  var n = b(2052);
  return (n.write_shift(4, e), ln(t, n), ln(r, n), n.length > n.l ? n.slice(0, n.l) : n);
}
function to(e, t) {
  if (t) {
    var r = 0;
    ([
      [5, 8],
      [23, 26],
      [41, 44],
      [50, 392],
    ].forEach(function (n) {
      for (var a = n[0]; a <= n[1]; ++a) t[a] != null && ++r;
    }),
      r != 0 &&
        (H(e, 615, _r(r)),
        [
          [5, 8],
          [23, 26],
          [41, 44],
          [50, 392],
        ].forEach(function (n) {
          for (var a = n[0]; a <= n[1]; ++a) t[a] != null && H(e, 44, Kl(a, t[a]));
        }),
        H(e, 616)));
  }
}
function no(e) {
  var t = 1;
  (H(e, 611, _r(t)),
    H(e, 43, $l({ sz: 12, color: { theme: 1 }, name: "Calibri", family: 2 })),
    H(e, 612));
}
function ao(e) {
  var t = 2;
  (H(e, 603, _r(t)),
    H(e, 45, aa({ patternType: "none" })),
    H(e, 45, aa({ patternType: "gray125" })),
    H(e, 604));
}
function io(e) {
  var t = 1;
  (H(e, 613, _r(t)), H(e, 46, Ql()), H(e, 614));
}
function so(e) {
  var t = 1;
  (H(e, 626, _r(t)), H(e, 47, vi({ numFmtId: 0 }, 65535)), H(e, 627));
}
function fo(e, t) {
  (H(e, 617, _r(t.length)),
    t.forEach(function (r) {
      H(e, 47, vi(r, 0));
    }),
    H(e, 618));
}
function lo(e) {
  var t = 1;
  (H(e, 619, _r(t)), H(e, 48, eo({ xfId: 0, name: "Normal" })), H(e, 620));
}
function oo(e) {
  var t = 0;
  (H(e, 505, _r(t)), H(e, 506));
}
function co(e) {
  var t = 0;
  (H(e, 508, ro(t, "TableStyleMedium9", "PivotStyleMedium4")), H(e, 509));
}
function ho(e, t) {
  var r = Qe();
  return (
    H(r, 278),
    to(r, e.SSF),
    no(r),
    ao(r),
    io(r),
    so(r),
    fo(r, t.cellXfs),
    lo(r),
    oo(r),
    co(r),
    H(r, 279),
    r.end()
  );
}
function mi(e, t) {
  if (t && t.themeXLSX) return t.themeXLSX;
  if (e && typeof e.raw == "string") return e.raw;
  var r = [ke];
  return (
    (r[r.length] =
      '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">'),
    (r[r.length] = "<a:themeElements>"),
    (r[r.length] = '<a:clrScheme name="Office">'),
    (r[r.length] = '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>'),
    (r[r.length] = '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>'),
    (r[r.length] = '<a:dk2><a:srgbClr val="1F497D"/></a:dk2>'),
    (r[r.length] = '<a:lt2><a:srgbClr val="EEECE1"/></a:lt2>'),
    (r[r.length] = '<a:accent1><a:srgbClr val="4F81BD"/></a:accent1>'),
    (r[r.length] = '<a:accent2><a:srgbClr val="C0504D"/></a:accent2>'),
    (r[r.length] = '<a:accent3><a:srgbClr val="9BBB59"/></a:accent3>'),
    (r[r.length] = '<a:accent4><a:srgbClr val="8064A2"/></a:accent4>'),
    (r[r.length] = '<a:accent5><a:srgbClr val="4BACC6"/></a:accent5>'),
    (r[r.length] = '<a:accent6><a:srgbClr val="F79646"/></a:accent6>'),
    (r[r.length] = '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>'),
    (r[r.length] = '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>'),
    (r[r.length] = "</a:clrScheme>"),
    (r[r.length] = '<a:fontScheme name="Office">'),
    (r[r.length] = "<a:majorFont>"),
    (r[r.length] = '<a:latin typeface="Cambria"/>'),
    (r[r.length] = '<a:ea typeface=""/>'),
    (r[r.length] = '<a:cs typeface=""/>'),
    (r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>'),
    (r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>'),
    (r[r.length] = '<a:font script="Hans" typeface="宋体"/>'),
    (r[r.length] = '<a:font script="Hant" typeface="新細明體"/>'),
    (r[r.length] = '<a:font script="Arab" typeface="Times New Roman"/>'),
    (r[r.length] = '<a:font script="Hebr" typeface="Times New Roman"/>'),
    (r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>'),
    (r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>'),
    (r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>'),
    (r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>'),
    (r[r.length] = '<a:font script="Khmr" typeface="MoolBoran"/>'),
    (r[r.length] = '<a:font script="Knda" typeface="Tunga"/>'),
    (r[r.length] = '<a:font script="Guru" typeface="Raavi"/>'),
    (r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>'),
    (r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>'),
    (r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>'),
    (r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>'),
    (r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>'),
    (r[r.length] = '<a:font script="Deva" typeface="Mangal"/>'),
    (r[r.length] = '<a:font script="Telu" typeface="Gautami"/>'),
    (r[r.length] = '<a:font script="Taml" typeface="Latha"/>'),
    (r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>'),
    (r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>'),
    (r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>'),
    (r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>'),
    (r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>'),
    (r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>'),
    (r[r.length] = '<a:font script="Viet" typeface="Times New Roman"/>'),
    (r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>'),
    (r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>'),
    (r[r.length] = "</a:majorFont>"),
    (r[r.length] = "<a:minorFont>"),
    (r[r.length] = '<a:latin typeface="Calibri"/>'),
    (r[r.length] = '<a:ea typeface=""/>'),
    (r[r.length] = '<a:cs typeface=""/>'),
    (r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>'),
    (r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>'),
    (r[r.length] = '<a:font script="Hans" typeface="宋体"/>'),
    (r[r.length] = '<a:font script="Hant" typeface="新細明體"/>'),
    (r[r.length] = '<a:font script="Arab" typeface="Arial"/>'),
    (r[r.length] = '<a:font script="Hebr" typeface="Arial"/>'),
    (r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>'),
    (r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>'),
    (r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>'),
    (r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>'),
    (r[r.length] = '<a:font script="Khmr" typeface="DaunPenh"/>'),
    (r[r.length] = '<a:font script="Knda" typeface="Tunga"/>'),
    (r[r.length] = '<a:font script="Guru" typeface="Raavi"/>'),
    (r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>'),
    (r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>'),
    (r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>'),
    (r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>'),
    (r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>'),
    (r[r.length] = '<a:font script="Deva" typeface="Mangal"/>'),
    (r[r.length] = '<a:font script="Telu" typeface="Gautami"/>'),
    (r[r.length] = '<a:font script="Taml" typeface="Latha"/>'),
    (r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>'),
    (r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>'),
    (r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>'),
    (r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>'),
    (r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>'),
    (r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>'),
    (r[r.length] = '<a:font script="Viet" typeface="Arial"/>'),
    (r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>'),
    (r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>'),
    (r[r.length] = "</a:minorFont>"),
    (r[r.length] = "</a:fontScheme>"),
    (r[r.length] = '<a:fmtScheme name="Office">'),
    (r[r.length] = "<a:fillStyleLst>"),
    (r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'),
    (r[r.length] = '<a:gradFill rotWithShape="1">'),
    (r[r.length] = "<a:gsLst>"),
    (r[r.length] =
      '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs>'),
    (r[r.length] = "</a:gsLst>"),
    (r[r.length] = '<a:lin ang="16200000" scaled="1"/>'),
    (r[r.length] = "</a:gradFill>"),
    (r[r.length] = '<a:gradFill rotWithShape="1">'),
    (r[r.length] = "<a:gsLst>"),
    (r[r.length] =
      '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>'),
    (r[r.length] = "</a:gsLst>"),
    (r[r.length] = '<a:lin ang="16200000" scaled="0"/>'),
    (r[r.length] = "</a:gradFill>"),
    (r[r.length] = "</a:fillStyleLst>"),
    (r[r.length] = "<a:lnStyleLst>"),
    (r[r.length] =
      '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln>'),
    (r[r.length] =
      '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>'),
    (r[r.length] =
      '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>'),
    (r[r.length] = "</a:lnStyleLst>"),
    (r[r.length] = "<a:effectStyleLst>"),
    (r[r.length] = "<a:effectStyle>"),
    (r[r.length] = "<a:effectLst>"),
    (r[r.length] =
      '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw>'),
    (r[r.length] = "</a:effectLst>"),
    (r[r.length] = "</a:effectStyle>"),
    (r[r.length] = "<a:effectStyle>"),
    (r[r.length] = "<a:effectLst>"),
    (r[r.length] =
      '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>'),
    (r[r.length] = "</a:effectLst>"),
    (r[r.length] = "</a:effectStyle>"),
    (r[r.length] = "<a:effectStyle>"),
    (r[r.length] = "<a:effectLst>"),
    (r[r.length] =
      '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>'),
    (r[r.length] = "</a:effectLst>"),
    (r[r.length] =
      '<a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d>'),
    (r[r.length] = '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>'),
    (r[r.length] = "</a:effectStyle>"),
    (r[r.length] = "</a:effectStyleLst>"),
    (r[r.length] = "<a:bgFillStyleLst>"),
    (r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'),
    (r[r.length] = '<a:gradFill rotWithShape="1">'),
    (r[r.length] = "<a:gsLst>"),
    (r[r.length] =
      '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs>'),
    (r[r.length] = "</a:gsLst>"),
    (r[r.length] =
      '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>'),
    (r[r.length] = "</a:gradFill>"),
    (r[r.length] = '<a:gradFill rotWithShape="1">'),
    (r[r.length] = "<a:gsLst>"),
    (r[r.length] =
      '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs>'),
    (r[r.length] =
      '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs>'),
    (r[r.length] = "</a:gsLst>"),
    (r[r.length] =
      '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>'),
    (r[r.length] = "</a:gradFill>"),
    (r[r.length] = "</a:bgFillStyleLst>"),
    (r[r.length] = "</a:fmtScheme>"),
    (r[r.length] = "</a:themeElements>"),
    (r[r.length] = "<a:objectDefaults>"),
    (r[r.length] = "<a:spDef>"),
    (r[r.length] =
      '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style>'),
    (r[r.length] = "</a:spDef>"),
    (r[r.length] = "<a:lnDef>"),
    (r[r.length] =
      '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style>'),
    (r[r.length] = "</a:lnDef>"),
    (r[r.length] = "</a:objectDefaults>"),
    (r[r.length] = "<a:extraClrSchemeLst/>"),
    (r[r.length] = "</a:theme>"),
    r.join("")
  );
}
function uo(e, t) {
  return { flags: e.read_shift(4), version: e.read_shift(4), name: Ye(e) };
}
function xo(e) {
  var t = b(12 + 2 * e.name.length);
  return (t.write_shift(4, e.flags), t.write_shift(4, e.version), Be(e.name, t), t.slice(0, t.l));
}
function po(e) {
  for (var t = [], r = e.read_shift(4); r-- > 0; ) t.push([e.read_shift(4), e.read_shift(4)]);
  return t;
}
function vo(e) {
  var t = b(4 + 8 * e.length);
  t.write_shift(4, e.length);
  for (var r = 0; r < e.length; ++r) (t.write_shift(4, e[r][0]), t.write_shift(4, e[r][1]));
  return t;
}
function mo(e, t) {
  var r = b(8 + 2 * t.length);
  return (r.write_shift(4, e), Be(t, r), r.slice(0, r.l));
}
function go(e) {
  return ((e.l += 4), e.read_shift(4) != 0);
}
function _o(e, t) {
  var r = b(8);
  return (r.write_shift(4, e), r.write_shift(4, 1), r);
}
function To() {
  var e = Qe();
  return (
    H(e, 332),
    H(e, 334, _r(1)),
    H(e, 335, xo({ name: "XLDAPR", version: 12e4, flags: 3496657072 })),
    H(e, 336),
    H(e, 339, mo(1, "XLDAPR")),
    H(e, 52),
    H(e, 35, _r(514)),
    H(e, 4096, _r(0)),
    H(e, 4097, ur(1)),
    H(e, 36),
    H(e, 53),
    H(e, 340),
    H(e, 337, _o(1)),
    H(e, 51, vo([[1, 0]])),
    H(e, 338),
    H(e, 333),
    e.end()
  );
}
function gi() {
  var e = [ke];
  return (
    e.push(`<metadata xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:xlrd="http://schemas.microsoft.com/office/spreadsheetml/2017/richdata" xmlns:xda="http://schemas.microsoft.com/office/spreadsheetml/2017/dynamicarray">
  <metadataTypes count="1">
    <metadataType name="XLDAPR" minSupportedVersion="120000" copy="1" pasteAll="1" pasteValues="1" merge="1" splitFirst="1" rowColShift="1" clearFormats="1" clearComments="1" assign="1" coerce="1" cellMeta="1"/>
  </metadataTypes>
  <futureMetadata name="XLDAPR" count="1">
    <bk>
      <extLst>
        <ext uri="{bdbb8cdc-fa1e-496e-a857-3c3f30c029c3}">
          <xda:dynamicArrayProperties fDynamic="1" fCollapsed="0"/>
        </ext>
      </extLst>
    </bk>
  </futureMetadata>
  <cellMetadata count="1">
    <bk>
      <rc t="1" v="0"/>
    </bk>
  </cellMetadata>
</metadata>`),
    e.join("")
  );
}
function Eo(e) {
  var t = {};
  t.i = e.read_shift(4);
  var r = {};
  ((r.r = e.read_shift(4)), (r.c = e.read_shift(4)), (t.r = _e(r)));
  var n = e.read_shift(1);
  return (n & 2 && (t.l = "1"), n & 8 && (t.a = "1"), t);
}
var st = 1024;
function _i(e, t) {
  for (
    var r = [21600, 21600],
      n = ["m0,0l0", r[1], r[0], r[1], r[0], "0xe"].join(","),
      a = [
        j("xml", null, {
          "xmlns:v": ir.v,
          "xmlns:o": ir.o,
          "xmlns:x": ir.x,
          "xmlns:mv": ir.mv,
        }).replace(/\/>/, ">"),
        j("o:shapelayout", j("o:idmap", null, { "v:ext": "edit", data: e }), { "v:ext": "edit" }),
        j(
          "v:shapetype",
          [
            j("v:stroke", null, { joinstyle: "miter" }),
            j("v:path", null, { gradientshapeok: "t", "o:connecttype": "rect" }),
          ].join(""),
          { id: "_x0000_t202", "o:spt": 202, coordsize: r.join(","), path: n },
        ),
      ];
    st < e * 1e3;
  )
    st += 1e3;
  return (
    t.forEach(function (i) {
      var s = Me(i[0]),
        f = { color2: "#BEFF82", type: "gradient" };
      f.type == "gradient" && (f.angle = "-180");
      var o =
          f.type == "gradient"
            ? j("o:fill", null, { type: "gradientUnscaled", "v:ext": "view" })
            : null,
        l = j("v:fill", o, f),
        c = { on: "t", obscured: "t" };
      (++st,
        (a = a.concat([
          "<v:shape" +
            Nt({
              id: "_x0000_s" + st,
              type: "#_x0000_t202",
              style:
                "position:absolute; margin-left:80pt;margin-top:5pt;width:104pt;height:64pt;z-index:10" +
                (i[1].hidden ? ";visibility:hidden" : ""),
              fillcolor: "#ECFAD4",
              strokecolor: "#edeaa1",
            }) +
            ">",
          l,
          j("v:shadow", null, c),
          j("v:path", null, { "o:connecttype": "none" }),
          '<v:textbox><div style="text-align:left"></div></v:textbox>',
          '<x:ClientData ObjectType="Note">',
          "<x:MoveWithCells/>",
          "<x:SizeWithCells/>",
          Ve("x:Anchor", [s.c + 1, 0, s.r + 1, 0, s.c + 3, 20, s.r + 5, 20].join(",")),
          Ve("x:AutoFill", "False"),
          Ve("x:Row", String(s.r)),
          Ve("x:Column", String(s.c)),
          i[1].hidden ? "" : "<x:Visible/>",
          "</x:ClientData>",
          "</v:shape>",
        ])));
    }),
    a.push("</xml>"),
    a.join("")
  );
}
function Ti(e) {
  var t = [ke, j("comments", null, { xmlns: ut[0] })],
    r = [];
  return (
    t.push("<authors>"),
    e.forEach(function (n) {
      n[1].forEach(function (a) {
        var i = ge(a.a);
        (r.indexOf(i) == -1 && (r.push(i), t.push("<author>" + i + "</author>")),
          a.T &&
            a.ID &&
            r.indexOf("tc=" + a.ID) == -1 &&
            (r.push("tc=" + a.ID), t.push("<author>tc=" + a.ID + "</author>")));
      });
    }),
    r.length == 0 && (r.push("SheetJ5"), t.push("<author>SheetJ5</author>")),
    t.push("</authors>"),
    t.push("<commentList>"),
    e.forEach(function (n) {
      var a = 0,
        i = [];
      if (
        (n[1][0] && n[1][0].T && n[1][0].ID
          ? (a = r.indexOf("tc=" + n[1][0].ID))
          : n[1].forEach(function (o) {
              (o.a && (a = r.indexOf(ge(o.a))), i.push(o.t || ""));
            }),
        t.push('<comment ref="' + n[0] + '" authorId="' + a + '"><text>'),
        i.length <= 1)
      )
        t.push(Ve("t", ge(i[0] || "")));
      else {
        for (
          var s =
              `Comment:
    ` +
              i[0] +
              `
`,
            f = 1;
          f < i.length;
          ++f
        )
          s +=
            `Reply:
    ` +
            i[f] +
            `
`;
        t.push(Ve("t", ge(s)));
      }
      t.push("</text></comment>");
    }),
    t.push("</commentList>"),
    t.length > 2 && ((t[t.length] = "</comments>"), (t[1] = t[1].replace("/>", ">"))),
    t.join("")
  );
}
function wo(e, t, r) {
  var n = [ke, j("ThreadedComments", null, { xmlns: Le.TCMNT }).replace(/[\/]>/, ">")];
  return (
    e.forEach(function (a) {
      var i = "";
      (a[1] || []).forEach(function (s, f) {
        if (!s.T) {
          delete s.ID;
          return;
        }
        s.a && t.indexOf(s.a) == -1 && t.push(s.a);
        var o = {
          ref: a[0],
          id: "{54EE7951-7262-4200-6969-" + ("000000000000" + r.tcid++).slice(-12) + "}",
        };
        (f == 0 ? (i = o.id) : (o.parentId = i),
          (s.ID = o.id),
          s.a &&
            (o.personId =
              "{54EE7950-7262-4200-6969-" + ("000000000000" + t.indexOf(s.a)).slice(-12) + "}"),
          n.push(j("threadedComment", Ve("text", s.t || ""), o)));
      });
    }),
    n.push("</ThreadedComments>"),
    n.join("")
  );
}
function So(e) {
  var t = [ke, j("personList", null, { xmlns: Le.TCMNT, "xmlns:x": ut[0] }).replace(/[\/]>/, ">")];
  return (
    e.forEach(function (r, n) {
      t.push(
        j("person", null, {
          displayName: r,
          id: "{54EE7950-7262-4200-6969-" + ("000000000000" + n).slice(-12) + "}",
          userId: r,
          providerId: "None",
        }),
      );
    }),
    t.push("</personList>"),
    t.join("")
  );
}
function Ao(e) {
  var t = {};
  t.iauthor = e.read_shift(4);
  var r = et(e);
  return ((t.rfx = r.s), (t.ref = _e(r.s)), (e.l += 16), t);
}
function Fo(e, t) {
  return (
    t == null && (t = b(36)),
    t.write_shift(4, e[1].iauthor),
    dt(e[0], t),
    t.write_shift(4, 0),
    t.write_shift(4, 0),
    t.write_shift(4, 0),
    t.write_shift(4, 0),
    t
  );
}
var yo = Ye;
function Co(e) {
  return Be(e.slice(0, 54));
}
function Oo(e) {
  var t = Qe(),
    r = [];
  return (
    H(t, 628),
    H(t, 630),
    e.forEach(function (n) {
      n[1].forEach(function (a) {
        r.indexOf(a.a) > -1 || (r.push(a.a.slice(0, 54)), H(t, 632, Co(a.a)));
      });
    }),
    H(t, 631),
    H(t, 633),
    e.forEach(function (n) {
      n[1].forEach(function (a) {
        a.iauthor = r.indexOf(a.a);
        var i = { s: Me(n[0]), e: Me(n[0]) };
        (H(t, 635, Fo([i, a])),
          a.t && a.t.length > 0 && H(t, 637, Df(a)),
          H(t, 636),
          delete a.iauthor);
      });
    }),
    H(t, 634),
    H(t, 629),
    t.end()
  );
}
function Do(e, t) {
  t.FullPaths.forEach(function (r, n) {
    if (n != 0) {
      var a = r.replace(/[^\/]*[\/]/, "/_VBA_PROJECT_CUR/");
      a.slice(-1) !== "/" && Ee.utils.cfb_add(e, a, t.FileIndex[n].content);
    }
  });
}
var Ei = ["xlsb", "xlsm", "xlam", "biff8", "xla"],
  Ro = (function () {
    var e = /(^|[^A-Za-z_])R(\[?-?\d+\]|[1-9]\d*|)C(\[?-?\d+\]|[1-9]\d*|)(?![A-Za-z0-9_])/g,
      t = { r: 0, c: 0 };
    function r(n, a, i, s) {
      var f = !1,
        o = !1;
      (i.length == 0 ? (o = !0) : i.charAt(0) == "[" && ((o = !0), (i = i.slice(1, -1))),
        s.length == 0 ? (f = !0) : s.charAt(0) == "[" && ((f = !0), (s = s.slice(1, -1))));
      var l = i.length > 0 ? parseInt(i, 10) | 0 : 0,
        c = s.length > 0 ? parseInt(s, 10) | 0 : 0;
      return (
        f ? (c += t.c) : --c,
        o ? (l += t.r) : --l,
        a + (f ? "" : "$") + Ke(c) + (o ? "" : "$") + Ge(l)
      );
    }
    return function (a, i) {
      return ((t = i), a.replace(e, r));
    };
  })(),
  i0 =
    /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})(?![_.\(A-Za-z0-9])/g,
  s0 = (function () {
    return function (t, r) {
      return t.replace(i0, function (n, a, i, s, f, o) {
        var l = Qn(s) - (i ? 0 : r.c),
          c = qn(o) - (f ? 0 : r.r),
          p = c == 0 ? "" : f ? c + 1 : "[" + c + "]",
          x = l == 0 ? "" : i ? l + 1 : "[" + l + "]";
        return a + "R" + p + "C" + x;
      });
    };
  })();
function Io(e, t) {
  return e.replace(i0, function (r, n, a, i, s, f) {
    return n + (a == "$" ? a + i : Ke(Qn(i) + t.c)) + (s == "$" ? s + f : Ge(qn(f) + t.r));
  });
}
function ko(e) {
  return e.length != 1;
}
function Re(e) {
  e.l += 1;
}
function br(e, t) {
  var r = e.read_shift(2);
  return [r & 16383, (r >> 14) & 1, (r >> 15) & 1];
}
function wi(e, t, r) {
  var n = 2;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return Si(e);
    r.biff == 12 && (n = 4);
  }
  var a = e.read_shift(n),
    i = e.read_shift(n),
    s = br(e),
    f = br(e);
  return {
    s: { r: a, c: s[0], cRel: s[1], rRel: s[2] },
    e: { r: i, c: f[0], cRel: f[1], rRel: f[2] },
  };
}
function Si(e) {
  var t = br(e),
    r = br(e),
    n = e.read_shift(1),
    a = e.read_shift(1);
  return {
    s: { r: t[0], c: n, cRel: t[1], rRel: t[2] },
    e: { r: r[0], c: a, cRel: r[1], rRel: r[2] },
  };
}
function No(e, t, r) {
  if (r.biff < 8) return Si(e);
  var n = e.read_shift(r.biff == 12 ? 4 : 2),
    a = e.read_shift(r.biff == 12 ? 4 : 2),
    i = br(e),
    s = br(e);
  return {
    s: { r: n, c: i[0], cRel: i[1], rRel: i[2] },
    e: { r: a, c: s[0], cRel: s[1], rRel: s[2] },
  };
}
function Ai(e, t, r) {
  if (r && r.biff >= 2 && r.biff <= 5) return Po(e);
  var n = e.read_shift(r && r.biff == 12 ? 4 : 2),
    a = br(e);
  return { r: n, c: a[0], cRel: a[1], rRel: a[2] };
}
function Po(e) {
  var t = br(e),
    r = e.read_shift(1);
  return { r: t[0], c: r, cRel: t[1], rRel: t[2] };
}
function Lo(e) {
  var t = e.read_shift(2),
    r = e.read_shift(2);
  return { r: t, c: r & 255, fQuoted: !!(r & 16384), cRel: r >> 15, rRel: r >> 15 };
}
function Mo(e, t, r) {
  var n = r && r.biff ? r.biff : 8;
  if (n >= 2 && n <= 5) return Bo(e);
  var a = e.read_shift(n >= 12 ? 4 : 2),
    i = e.read_shift(2),
    s = (i & 16384) >> 14,
    f = (i & 32768) >> 15;
  if (((i &= 16383), f == 1)) for (; a > 524287; ) a -= 1048576;
  if (s == 1) for (; i > 8191; ) i = i - 16384;
  return { r: a, c: i, cRel: s, rRel: f };
}
function Bo(e) {
  var t = e.read_shift(2),
    r = e.read_shift(1),
    n = (t & 32768) >> 15,
    a = (t & 16384) >> 14;
  return (
    (t &= 16383),
    n == 1 && t >= 8192 && (t = t - 16384),
    a == 1 && r >= 128 && (r = r - 256),
    { r: t, c: r, cRel: a, rRel: n }
  );
}
function bo(e, t, r) {
  var n = (e[e.l++] & 96) >> 5,
    a = wi(e, r.biff >= 2 && r.biff <= 5 ? 6 : 8, r);
  return [n, a];
}
function Uo(e, t, r) {
  var n = (e[e.l++] & 96) >> 5,
    a = e.read_shift(2, "i"),
    i = 8;
  if (r)
    switch (r.biff) {
      case 5:
        ((e.l += 12), (i = 6));
        break;
      case 12:
        i = 12;
        break;
    }
  var s = wi(e, i, r);
  return [n, a, s];
}
function Wo(e, t, r) {
  var n = (e[e.l++] & 96) >> 5;
  return ((e.l += r && r.biff > 8 ? 12 : r.biff < 8 ? 6 : 8), [n]);
}
function Ho(e, t, r) {
  var n = (e[e.l++] & 96) >> 5,
    a = e.read_shift(2),
    i = 8;
  if (r)
    switch (r.biff) {
      case 5:
        ((e.l += 12), (i = 6));
        break;
      case 12:
        i = 12;
        break;
    }
  return ((e.l += i), [n, a]);
}
function Vo(e, t, r) {
  var n = (e[e.l++] & 96) >> 5,
    a = No(e, t - 1, r);
  return [n, a];
}
function Go(e, t, r) {
  var n = (e[e.l++] & 96) >> 5;
  return ((e.l += r.biff == 2 ? 6 : r.biff == 12 ? 14 : 7), [n]);
}
function ia(e) {
  var t = e[e.l + 1] & 1,
    r = 1;
  return ((e.l += 4), [t, r]);
}
function Xo(e, t, r) {
  e.l += 2;
  for (var n = e.read_shift(r && r.biff == 2 ? 1 : 2), a = [], i = 0; i <= n; ++i)
    a.push(e.read_shift(r && r.biff == 2 ? 1 : 2));
  return a;
}
function zo(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return ((e.l += 2), [n, e.read_shift(r && r.biff == 2 ? 1 : 2)]);
}
function Ko(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return ((e.l += 2), [n, e.read_shift(r && r.biff == 2 ? 1 : 2)]);
}
function Yo(e) {
  var t = e[e.l + 1] & 255 ? 1 : 0;
  return ((e.l += 2), [t, e.read_shift(2)]);
}
function $o(e, t, r) {
  var n = e[e.l + 1] & 255 ? 1 : 0;
  return ((e.l += r && r.biff == 2 ? 3 : 4), [n]);
}
function Fi(e) {
  var t = e.read_shift(1),
    r = e.read_shift(1);
  return [t, r];
}
function jo(e) {
  return (e.read_shift(2), Fi(e));
}
function Jo(e) {
  return (e.read_shift(2), Fi(e));
}
function Zo(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = Ai(e, 0, r);
  return [n, a];
}
function qo(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = Mo(e, 0, r);
  return [n, a];
}
function Qo(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = e.read_shift(2);
  r && r.biff == 5 && (e.l += 12);
  var i = Ai(e, 0, r);
  return [n, a, i];
}
function ec(e, t, r) {
  var n = (e[e.l] & 96) >> 5;
  e.l += 1;
  var a = e.read_shift(r && r.biff <= 3 ? 1 : 2);
  return [e1[a], Oi[a], n];
}
function rc(e, t, r) {
  var n = e[e.l++],
    a = e.read_shift(1),
    i = r && r.biff <= 3 ? [n == 88 ? -1 : 0, e.read_shift(1)] : tc(e);
  return [a, (i[0] === 0 ? Oi : Qc)[i[1]]];
}
function tc(e) {
  return [e[e.l + 1] >> 7, e.read_shift(2) & 32767];
}
function nc(e, t, r) {
  e.l += r && r.biff == 2 ? 3 : 4;
}
function ac(e, t, r) {
  if ((e.l++, r && r.biff == 12)) return [e.read_shift(4, "i"), 0];
  var n = e.read_shift(2),
    a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function ic(e) {
  return (e.l++, Ut[e.read_shift(1)]);
}
function sc(e) {
  return (e.l++, e.read_shift(2));
}
function fc(e) {
  return (e.l++, e.read_shift(1) !== 0);
}
function lc(e) {
  return (e.l++, pt(e));
}
function oc(e, t, r) {
  return (e.l++, fi(e, t - 1, r));
}
function cc(e, t) {
  var r = [e.read_shift(1)];
  if (t == 12)
    switch (r[0]) {
      case 2:
        r[0] = 4;
        break;
      case 4:
        r[0] = 16;
        break;
      case 0:
        r[0] = 1;
        break;
      case 1:
        r[0] = 2;
        break;
    }
  switch (r[0]) {
    case 4:
      ((r[1] = qf(e, 1) ? "TRUE" : "FALSE"), t != 12 && (e.l += 7));
      break;
    case 37:
    case 16:
      ((r[1] = Ut[e[e.l]]), (e.l += t == 12 ? 4 : 8));
      break;
    case 0:
      e.l += 8;
      break;
    case 1:
      r[1] = pt(e);
      break;
    case 2:
      r[1] = tl(e, 0, { biff: t > 0 && t < 8 ? 2 : t });
      break;
    default:
      throw new Error("Bad SerAr: " + r[0]);
  }
  return r;
}
function hc(e, t, r) {
  for (var n = e.read_shift(r.biff == 12 ? 4 : 2), a = [], i = 0; i != n; ++i)
    a.push((r.biff == 12 ? et : il)(e));
  return a;
}
function uc(e, t, r) {
  var n = 0,
    a = 0;
  (r.biff == 12
    ? ((n = e.read_shift(4)), (a = e.read_shift(4)))
    : ((a = 1 + e.read_shift(1)), (n = 1 + e.read_shift(2))),
    r.biff >= 2 && r.biff < 8 && (--n, --a == 0 && (a = 256)));
  for (var i = 0, s = []; i != n && (s[i] = []); ++i)
    for (var f = 0; f != a; ++f) s[i][f] = cc(e, r.biff);
  return s;
}
function xc(e, t, r) {
  var n = (e.read_shift(1) >>> 5) & 3,
    a = !r || r.biff >= 8 ? 4 : 2,
    i = e.read_shift(a);
  switch (r.biff) {
    case 2:
      e.l += 5;
      break;
    case 3:
    case 4:
      e.l += 8;
      break;
    case 5:
      e.l += 12;
      break;
  }
  return [n, 0, i];
}
function dc(e, t, r) {
  if (r.biff == 5) return pc(e);
  var n = (e.read_shift(1) >>> 5) & 3,
    a = e.read_shift(2),
    i = e.read_shift(4);
  return [n, a, i];
}
function pc(e) {
  var t = (e.read_shift(1) >>> 5) & 3,
    r = e.read_shift(2, "i");
  e.l += 8;
  var n = e.read_shift(2);
  return ((e.l += 12), [t, r, n]);
}
function vc(e, t, r) {
  var n = (e.read_shift(1) >>> 5) & 3;
  e.l += r && r.biff == 2 ? 3 : 4;
  var a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function mc(e, t, r) {
  var n = (e.read_shift(1) >>> 5) & 3,
    a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [n, a];
}
function gc(e, t, r) {
  var n = (e.read_shift(1) >>> 5) & 3;
  return ((e.l += 4), r.biff < 8 && e.l--, r.biff == 12 && (e.l += 2), [n]);
}
function _c(e, t, r) {
  var n = (e[e.l++] & 96) >> 5,
    a = e.read_shift(2),
    i = 4;
  if (r)
    switch (r.biff) {
      case 5:
        i = 15;
        break;
      case 12:
        i = 6;
        break;
    }
  return ((e.l += i), [n, a]);
}
var Tc = Sr,
  Ec = Sr,
  wc = Sr;
function Wt(e, t, r) {
  return ((e.l += 2), [Lo(e)]);
}
function f0(e) {
  return ((e.l += 6), []);
}
var Sc = Wt,
  Ac = f0,
  Fc = f0,
  yc = Wt;
function yi(e) {
  return ((e.l += 2), [ii(e), e.read_shift(2) & 1]);
}
var Cc = Wt,
  Oc = yi,
  Dc = f0,
  Rc = Wt,
  Ic = Wt,
  kc = [
    "Data",
    "All",
    "Headers",
    "??",
    "?Data2",
    "??",
    "?DataHeaders",
    "??",
    "Totals",
    "??",
    "??",
    "??",
    "?DataTotals",
    "??",
    "??",
    "??",
    "?Current",
  ];
function Nc(e) {
  e.l += 2;
  var t = e.read_shift(2),
    r = e.read_shift(2),
    n = e.read_shift(4),
    a = e.read_shift(2),
    i = e.read_shift(2),
    s = kc[(r >> 2) & 31];
  return { ixti: t, coltype: r & 3, rt: s, idx: n, c: a, C: i };
}
function Pc(e) {
  return ((e.l += 2), [e.read_shift(4)]);
}
function Lc(e, t, r) {
  return ((e.l += 5), (e.l += 2), (e.l += r.biff == 2 ? 1 : 4), ["PTGSHEET"]);
}
function Mc(e, t, r) {
  return ((e.l += r.biff == 2 ? 4 : 5), ["PTGENDSHEET"]);
}
function Bc(e) {
  var t = (e.read_shift(1) >>> 5) & 3,
    r = e.read_shift(2);
  return [t, r];
}
function bc(e) {
  var t = (e.read_shift(1) >>> 5) & 3,
    r = e.read_shift(2);
  return [t, r];
}
function Uc(e) {
  return ((e.l += 4), [0, 0]);
}
var sa = {
    1: { n: "PtgExp", f: ac },
    2: { n: "PtgTbl", f: wc },
    3: { n: "PtgAdd", f: Re },
    4: { n: "PtgSub", f: Re },
    5: { n: "PtgMul", f: Re },
    6: { n: "PtgDiv", f: Re },
    7: { n: "PtgPower", f: Re },
    8: { n: "PtgConcat", f: Re },
    9: { n: "PtgLt", f: Re },
    10: { n: "PtgLe", f: Re },
    11: { n: "PtgEq", f: Re },
    12: { n: "PtgGe", f: Re },
    13: { n: "PtgGt", f: Re },
    14: { n: "PtgNe", f: Re },
    15: { n: "PtgIsect", f: Re },
    16: { n: "PtgUnion", f: Re },
    17: { n: "PtgRange", f: Re },
    18: { n: "PtgUplus", f: Re },
    19: { n: "PtgUminus", f: Re },
    20: { n: "PtgPercent", f: Re },
    21: { n: "PtgParen", f: Re },
    22: { n: "PtgMissArg", f: Re },
    23: { n: "PtgStr", f: oc },
    26: { n: "PtgSheet", f: Lc },
    27: { n: "PtgEndSheet", f: Mc },
    28: { n: "PtgErr", f: ic },
    29: { n: "PtgBool", f: fc },
    30: { n: "PtgInt", f: sc },
    31: { n: "PtgNum", f: lc },
    32: { n: "PtgArray", f: Go },
    33: { n: "PtgFunc", f: ec },
    34: { n: "PtgFuncVar", f: rc },
    35: { n: "PtgName", f: xc },
    36: { n: "PtgRef", f: Zo },
    37: { n: "PtgArea", f: bo },
    38: { n: "PtgMemArea", f: vc },
    39: { n: "PtgMemErr", f: Tc },
    40: { n: "PtgMemNoMem", f: Ec },
    41: { n: "PtgMemFunc", f: mc },
    42: { n: "PtgRefErr", f: gc },
    43: { n: "PtgAreaErr", f: Wo },
    44: { n: "PtgRefN", f: qo },
    45: { n: "PtgAreaN", f: Vo },
    46: { n: "PtgMemAreaN", f: Bc },
    47: { n: "PtgMemNoMemN", f: bc },
    57: { n: "PtgNameX", f: dc },
    58: { n: "PtgRef3d", f: Qo },
    59: { n: "PtgArea3d", f: Uo },
    60: { n: "PtgRefErr3d", f: _c },
    61: { n: "PtgAreaErr3d", f: Ho },
    255: {},
  },
  Wc = {
    64: 32,
    96: 32,
    65: 33,
    97: 33,
    66: 34,
    98: 34,
    67: 35,
    99: 35,
    68: 36,
    100: 36,
    69: 37,
    101: 37,
    70: 38,
    102: 38,
    71: 39,
    103: 39,
    72: 40,
    104: 40,
    73: 41,
    105: 41,
    74: 42,
    106: 42,
    75: 43,
    107: 43,
    76: 44,
    108: 44,
    77: 45,
    109: 45,
    78: 46,
    110: 46,
    79: 47,
    111: 47,
    88: 34,
    120: 34,
    89: 57,
    121: 57,
    90: 58,
    122: 58,
    91: 59,
    123: 59,
    92: 60,
    124: 60,
    93: 61,
    125: 61,
  },
  Hc = {
    1: { n: "PtgElfLel", f: yi },
    2: { n: "PtgElfRw", f: Rc },
    3: { n: "PtgElfCol", f: Sc },
    6: { n: "PtgElfRwV", f: Ic },
    7: { n: "PtgElfColV", f: yc },
    10: { n: "PtgElfRadical", f: Cc },
    11: { n: "PtgElfRadicalS", f: Dc },
    13: { n: "PtgElfColS", f: Ac },
    15: { n: "PtgElfColSV", f: Fc },
    16: { n: "PtgElfRadicalLel", f: Oc },
    25: { n: "PtgList", f: Nc },
    29: { n: "PtgSxName", f: Pc },
    255: {},
  },
  Vc = {
    0: { n: "PtgAttrNoop", f: Uc },
    1: { n: "PtgAttrSemi", f: $o },
    2: { n: "PtgAttrIf", f: Ko },
    4: { n: "PtgAttrChoose", f: Xo },
    8: { n: "PtgAttrGoto", f: zo },
    16: { n: "PtgAttrSum", f: nc },
    32: { n: "PtgAttrBaxcel", f: ia },
    33: { n: "PtgAttrBaxcel", f: ia },
    64: { n: "PtgAttrSpace", f: jo },
    65: { n: "PtgAttrSpaceSemi", f: Jo },
    128: { n: "PtgAttrIfError", f: Yo },
    255: {},
  };
function Gc(e, t, r, n) {
  if (n.biff < 8) return Sr(e, t);
  for (var a = e.l + t, i = [], s = 0; s !== r.length; ++s)
    switch (r[s][0]) {
      case "PtgArray":
        ((r[s][1] = uc(e, 0, n)), i.push(r[s][1]));
        break;
      case "PtgMemArea":
        ((r[s][2] = hc(e, r[s][1], n)), i.push(r[s][2]));
        break;
      case "PtgExp":
        n && n.biff == 12 && ((r[s][1][1] = e.read_shift(4)), i.push(r[s][1]));
        break;
      case "PtgList":
      case "PtgElfRadicalS":
      case "PtgElfColS":
      case "PtgElfColSV":
        throw "Unsupported " + r[s][0];
    }
  return ((t = a - e.l), t !== 0 && i.push(Sr(e, t)), i);
}
function Xc(e, t, r) {
  for (var n = e.l + t, a, i, s = []; n != e.l; )
    ((t = n - e.l),
      (i = e[e.l]),
      (a = sa[i] || sa[Wc[i]]),
      (i === 24 || i === 25) && (a = (i === 24 ? Hc : Vc)[e[e.l + 1]]),
      !a || !a.f ? Sr(e, t) : s.push([a.n, a.f(e, t, r)]));
  return s;
}
function zc(e) {
  for (var t = [], r = 0; r < e.length; ++r) {
    for (var n = e[r], a = [], i = 0; i < n.length; ++i) {
      var s = n[i];
      s ? (s[0] === 2 ? a.push('"' + s[1].replace(/"/g, '""') + '"') : a.push(s[1])) : a.push("");
    }
    t.push(a.join(","));
  }
  return t.join(";");
}
var Kc = {
  PtgAdd: "+",
  PtgConcat: "&",
  PtgDiv: "/",
  PtgEq: "=",
  PtgGe: ">=",
  PtgGt: ">",
  PtgLe: "<=",
  PtgLt: "<",
  PtgMul: "*",
  PtgNe: "<>",
  PtgPower: "^",
  PtgSub: "-",
};
function Yc(e, t) {
  if (!e && !(t && t.biff <= 5 && t.biff >= 2)) throw new Error("empty sheet name");
  return /[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(e) ? "'" + e + "'" : e;
}
function Ci(e, t, r) {
  if (!e) return "SH33TJSERR0";
  if (r.biff > 8 && (!e.XTI || !e.XTI[t])) return e.SheetNames[t];
  if (!e.XTI) return "SH33TJSERR6";
  var n = e.XTI[t];
  if (r.biff < 8) return (t > 1e4 && (t -= 65536), t < 0 && (t = -t), t == 0 ? "" : e.XTI[t - 1]);
  if (!n) return "SH33TJSERR1";
  var a = "";
  if (r.biff > 8)
    switch (e[n[0]][0]) {
      case 357:
        return (
          (a = n[1] == -1 ? "#REF" : e.SheetNames[n[1]]),
          n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]]
        );
      case 358:
        return r.SID != null ? e.SheetNames[r.SID] : "SH33TJSSAME" + e[n[0]][0];
      default:
        return "SH33TJSSRC" + e[n[0]][0];
    }
  switch (e[n[0]][0][0]) {
    case 1025:
      return (
        (a = n[1] == -1 ? "#REF" : e.SheetNames[n[1]] || "SH33TJSERR3"),
        n[1] == n[2] ? a : a + ":" + e.SheetNames[n[2]]
      );
    case 14849:
      return e[n[0]]
        .slice(1)
        .map(function (i) {
          return i.Name;
        })
        .join(";;");
    default:
      return e[n[0]][0][3]
        ? ((a = n[1] == -1 ? "#REF" : e[n[0]][0][3][n[1]] || "SH33TJSERR4"),
          n[1] == n[2] ? a : a + ":" + e[n[0]][0][3][n[2]])
        : "SH33TJSERR2";
  }
}
function fa(e, t, r) {
  var n = Ci(e, t, r);
  return n == "#REF" ? n : Yc(n, r);
}
function ht(e, t, r, n, a) {
  var i = (a && a.biff) || 8,
    s = { s: { c: 0, r: 0 } },
    f = [],
    o,
    l,
    c,
    p = 0,
    x = 0,
    d,
    T = "";
  if (!e[0] || !e[0][0]) return "";
  for (var u = -1, g = "", O = 0, D = e[0].length; O < D; ++O) {
    var C = e[0][O];
    switch (C[0]) {
      case "PtgUminus":
        f.push("-" + f.pop());
        break;
      case "PtgUplus":
        f.push("+" + f.pop());
        break;
      case "PtgPercent":
        f.push(f.pop() + "%");
        break;
      case "PtgAdd":
      case "PtgConcat":
      case "PtgDiv":
      case "PtgEq":
      case "PtgGe":
      case "PtgGt":
      case "PtgLe":
      case "PtgLt":
      case "PtgMul":
      case "PtgNe":
      case "PtgPower":
      case "PtgSub":
        if (((o = f.pop()), (l = f.pop()), u >= 0)) {
          switch (e[0][u][1][0]) {
            case 0:
              g = Ce(" ", e[0][u][1][1]);
              break;
            case 1:
              g = Ce("\r", e[0][u][1][1]);
              break;
            default:
              if (((g = ""), a.WTF))
                throw new Error("Unexpected PtgAttrSpaceType " + e[0][u][1][0]);
          }
          ((l = l + g), (u = -1));
        }
        f.push(l + Kc[C[0]] + o);
        break;
      case "PtgIsect":
        ((o = f.pop()), (l = f.pop()), f.push(l + " " + o));
        break;
      case "PtgUnion":
        ((o = f.pop()), (l = f.pop()), f.push(l + "," + o));
        break;
      case "PtgRange":
        ((o = f.pop()), (l = f.pop()), f.push(l + ":" + o));
        break;
      case "PtgAttrChoose":
        break;
      case "PtgAttrGoto":
        break;
      case "PtgAttrIf":
        break;
      case "PtgAttrIfError":
        break;
      case "PtgRef":
        ((c = yt(C[1][1], s, a)), f.push(Ct(c, i)));
        break;
      case "PtgRefN":
        ((c = r ? yt(C[1][1], r, a) : C[1][1]), f.push(Ct(c, i)));
        break;
      case "PtgRef3d":
        ((p = C[1][1]), (c = yt(C[1][2], s, a)), (T = fa(n, p, a)), f.push(T + "!" + Ct(c, i)));
        break;
      case "PtgFunc":
      case "PtgFuncVar":
        var B = C[1][0],
          K = C[1][1];
        (B || (B = 0), (B &= 127));
        var q = B == 0 ? [] : f.slice(-B);
        ((f.length -= B), K === "User" && (K = q.shift()), f.push(K + "(" + q.join(",") + ")"));
        break;
      case "PtgBool":
        f.push(C[1] ? "TRUE" : "FALSE");
        break;
      case "PtgInt":
        f.push(C[1]);
        break;
      case "PtgNum":
        f.push(String(C[1]));
        break;
      case "PtgStr":
        f.push('"' + C[1].replace(/"/g, '""') + '"');
        break;
      case "PtgErr":
        f.push(C[1]);
        break;
      case "PtgAreaN":
        ((d = z0(C[1][1], r ? { s: r } : s, a)), f.push(Nn(d, a)));
        break;
      case "PtgArea":
        ((d = z0(C[1][1], s, a)), f.push(Nn(d, a)));
        break;
      case "PtgArea3d":
        ((p = C[1][1]), (d = C[1][2]), (T = fa(n, p, a)), f.push(T + "!" + Nn(d, a)));
        break;
      case "PtgAttrSum":
        f.push("SUM(" + f.pop() + ")");
        break;
      case "PtgAttrBaxcel":
      case "PtgAttrSemi":
        break;
      case "PtgName":
        x = C[1][2];
        var F = (n.names || [])[x - 1] || (n[0] || [])[x],
          L = F ? F.Name : "SH33TJSNAME" + String(x);
        (L && L.slice(0, 6) == "_xlfn." && !a.xlfn && (L = L.slice(6)), f.push(L));
        break;
      case "PtgNameX":
        var N = C[1][1];
        x = C[1][2];
        var V;
        if (a.biff <= 5) (N < 0 && (N = -N), n[N] && (V = n[N][x]));
        else {
          var U = "";
          if (
            (((n[N] || [])[0] || [])[0] == 14849 ||
              (((n[N] || [])[0] || [])[0] == 1025
                ? n[N][x] && n[N][x].itab > 0 && (U = n.SheetNames[n[N][x].itab - 1] + "!")
                : (U = n.SheetNames[x - 1] + "!")),
            n[N] && n[N][x])
          )
            U += n[N][x].Name;
          else if (n[0] && n[0][x]) U += n[0][x].Name;
          else {
            var X = (Ci(n, N, a) || "").split(";;");
            X[x - 1] ? (U = X[x - 1]) : (U += "SH33TJSERRX");
          }
          f.push(U);
          break;
        }
        (V || (V = { Name: "SH33TJSERRY" }), f.push(V.Name));
        break;
      case "PtgParen":
        var re = "(",
          Te = ")";
        if (u >= 0) {
          switch (((g = ""), e[0][u][1][0])) {
            case 2:
              re = Ce(" ", e[0][u][1][1]) + re;
              break;
            case 3:
              re = Ce("\r", e[0][u][1][1]) + re;
              break;
            case 4:
              Te = Ce(" ", e[0][u][1][1]) + Te;
              break;
            case 5:
              Te = Ce("\r", e[0][u][1][1]) + Te;
              break;
            default:
              if (a.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][u][1][0]);
          }
          u = -1;
        }
        f.push(re + f.pop() + Te);
        break;
      case "PtgRefErr":
        f.push("#REF!");
        break;
      case "PtgRefErr3d":
        f.push("#REF!");
        break;
      case "PtgExp":
        c = { c: C[1][1], r: C[1][0] };
        var oe = { c: r.c, r: r.r };
        if (n.sharedf[_e(c)]) {
          var be = n.sharedf[_e(c)];
          f.push(ht(be, s, oe, n, a));
        } else {
          var De = !1;
          for (o = 0; o != n.arrayf.length; ++o)
            if (
              ((l = n.arrayf[o]),
              !(c.c < l[0].s.c || c.c > l[0].e.c) && !(c.r < l[0].s.r || c.r > l[0].e.r))
            ) {
              (f.push(ht(l[1], s, oe, n, a)), (De = !0));
              break;
            }
          De || f.push(C[1]);
        }
        break;
      case "PtgArray":
        f.push("{" + zc(C[1]) + "}");
        break;
      case "PtgMemArea":
        break;
      case "PtgAttrSpace":
      case "PtgAttrSpaceSemi":
        u = O;
        break;
      case "PtgTbl":
        break;
      case "PtgMemErr":
        break;
      case "PtgMissArg":
        f.push("");
        break;
      case "PtgAreaErr":
        f.push("#REF!");
        break;
      case "PtgAreaErr3d":
        f.push("#REF!");
        break;
      case "PtgList":
        f.push("Table" + C[1].idx + "[#" + C[1].rt + "]");
        break;
      case "PtgMemAreaN":
      case "PtgMemNoMemN":
      case "PtgAttrNoop":
      case "PtgSheet":
      case "PtgEndSheet":
        break;
      case "PtgMemFunc":
        break;
      case "PtgMemNoMem":
        break;
      case "PtgElfCol":
      case "PtgElfColS":
      case "PtgElfColSV":
      case "PtgElfColV":
      case "PtgElfLel":
      case "PtgElfRadical":
      case "PtgElfRadicalLel":
      case "PtgElfRadicalS":
      case "PtgElfRw":
      case "PtgElfRwV":
        throw new Error("Unsupported ELFs");
      case "PtgSxName":
        throw new Error("Unrecognized Formula Token: " + String(C));
      default:
        throw new Error("Unrecognized Formula Token: " + String(C));
    }
    var dr = ["PtgAttrSpace", "PtgAttrSpaceSemi", "PtgAttrGoto"];
    if (a.biff != 3 && u >= 0 && dr.indexOf(e[0][O][0]) == -1) {
      C = e[0][u];
      var Pe = !0;
      switch (C[1][0]) {
        case 4:
          Pe = !1;
        case 0:
          g = Ce(" ", C[1][1]);
          break;
        case 5:
          Pe = !1;
        case 1:
          g = Ce("\r", C[1][1]);
          break;
        default:
          if (((g = ""), a.WTF)) throw new Error("Unexpected PtgAttrSpaceType " + C[1][0]);
      }
      (f.push((Pe ? g : "") + f.pop() + (Pe ? "" : g)), (u = -1));
    }
  }
  if (f.length > 1 && a.WTF) throw new Error("bad formula stack");
  return f[0];
}
function $c(e) {
  if (e == null) {
    var t = b(8);
    return (
      t.write_shift(1, 3),
      t.write_shift(1, 0),
      t.write_shift(2, 0),
      t.write_shift(2, 0),
      t.write_shift(2, 65535),
      t
    );
  } else if (typeof e == "number") return $r(e);
  return $r(0);
}
function jc(e, t, r, n, a) {
  var i = jr(t, r, a),
    s = $c(e.v),
    f = b(6),
    o = 33;
  (f.write_shift(2, o), f.write_shift(4, 0));
  for (var l = b(e.bf.length), c = 0; c < e.bf.length; ++c) l[c] = e.bf[c];
  var p = He([i, s, f, l]);
  return p;
}
function En(e, t, r) {
  var n = e.read_shift(4),
    a = Xc(e, n, r),
    i = e.read_shift(4),
    s = i > 0 ? Gc(e, i, a, r) : null;
  return [a, s];
}
var Jc = En,
  wn = En,
  Zc = En,
  qc = En,
  Qc = {
    0: "BEEP",
    1: "OPEN",
    2: "OPEN.LINKS",
    3: "CLOSE.ALL",
    4: "SAVE",
    5: "SAVE.AS",
    6: "FILE.DELETE",
    7: "PAGE.SETUP",
    8: "PRINT",
    9: "PRINTER.SETUP",
    10: "QUIT",
    11: "NEW.WINDOW",
    12: "ARRANGE.ALL",
    13: "WINDOW.SIZE",
    14: "WINDOW.MOVE",
    15: "FULL",
    16: "CLOSE",
    17: "RUN",
    22: "SET.PRINT.AREA",
    23: "SET.PRINT.TITLES",
    24: "SET.PAGE.BREAK",
    25: "REMOVE.PAGE.BREAK",
    26: "FONT",
    27: "DISPLAY",
    28: "PROTECT.DOCUMENT",
    29: "PRECISION",
    30: "A1.R1C1",
    31: "CALCULATE.NOW",
    32: "CALCULATION",
    34: "DATA.FIND",
    35: "EXTRACT",
    36: "DATA.DELETE",
    37: "SET.DATABASE",
    38: "SET.CRITERIA",
    39: "SORT",
    40: "DATA.SERIES",
    41: "TABLE",
    42: "FORMAT.NUMBER",
    43: "ALIGNMENT",
    44: "STYLE",
    45: "BORDER",
    46: "CELL.PROTECTION",
    47: "COLUMN.WIDTH",
    48: "UNDO",
    49: "CUT",
    50: "COPY",
    51: "PASTE",
    52: "CLEAR",
    53: "PASTE.SPECIAL",
    54: "EDIT.DELETE",
    55: "INSERT",
    56: "FILL.RIGHT",
    57: "FILL.DOWN",
    61: "DEFINE.NAME",
    62: "CREATE.NAMES",
    63: "FORMULA.GOTO",
    64: "FORMULA.FIND",
    65: "SELECT.LAST.CELL",
    66: "SHOW.ACTIVE.CELL",
    67: "GALLERY.AREA",
    68: "GALLERY.BAR",
    69: "GALLERY.COLUMN",
    70: "GALLERY.LINE",
    71: "GALLERY.PIE",
    72: "GALLERY.SCATTER",
    73: "COMBINATION",
    74: "PREFERRED",
    75: "ADD.OVERLAY",
    76: "GRIDLINES",
    77: "SET.PREFERRED",
    78: "AXES",
    79: "LEGEND",
    80: "ATTACH.TEXT",
    81: "ADD.ARROW",
    82: "SELECT.CHART",
    83: "SELECT.PLOT.AREA",
    84: "PATTERNS",
    85: "MAIN.CHART",
    86: "OVERLAY",
    87: "SCALE",
    88: "FORMAT.LEGEND",
    89: "FORMAT.TEXT",
    90: "EDIT.REPEAT",
    91: "PARSE",
    92: "JUSTIFY",
    93: "HIDE",
    94: "UNHIDE",
    95: "WORKSPACE",
    96: "FORMULA",
    97: "FORMULA.FILL",
    98: "FORMULA.ARRAY",
    99: "DATA.FIND.NEXT",
    100: "DATA.FIND.PREV",
    101: "FORMULA.FIND.NEXT",
    102: "FORMULA.FIND.PREV",
    103: "ACTIVATE",
    104: "ACTIVATE.NEXT",
    105: "ACTIVATE.PREV",
    106: "UNLOCKED.NEXT",
    107: "UNLOCKED.PREV",
    108: "COPY.PICTURE",
    109: "SELECT",
    110: "DELETE.NAME",
    111: "DELETE.FORMAT",
    112: "VLINE",
    113: "HLINE",
    114: "VPAGE",
    115: "HPAGE",
    116: "VSCROLL",
    117: "HSCROLL",
    118: "ALERT",
    119: "NEW",
    120: "CANCEL.COPY",
    121: "SHOW.CLIPBOARD",
    122: "MESSAGE",
    124: "PASTE.LINK",
    125: "APP.ACTIVATE",
    126: "DELETE.ARROW",
    127: "ROW.HEIGHT",
    128: "FORMAT.MOVE",
    129: "FORMAT.SIZE",
    130: "FORMULA.REPLACE",
    131: "SEND.KEYS",
    132: "SELECT.SPECIAL",
    133: "APPLY.NAMES",
    134: "REPLACE.FONT",
    135: "FREEZE.PANES",
    136: "SHOW.INFO",
    137: "SPLIT",
    138: "ON.WINDOW",
    139: "ON.DATA",
    140: "DISABLE.INPUT",
    142: "OUTLINE",
    143: "LIST.NAMES",
    144: "FILE.CLOSE",
    145: "SAVE.WORKBOOK",
    146: "DATA.FORM",
    147: "COPY.CHART",
    148: "ON.TIME",
    149: "WAIT",
    150: "FORMAT.FONT",
    151: "FILL.UP",
    152: "FILL.LEFT",
    153: "DELETE.OVERLAY",
    155: "SHORT.MENUS",
    159: "SET.UPDATE.STATUS",
    161: "COLOR.PALETTE",
    162: "DELETE.STYLE",
    163: "WINDOW.RESTORE",
    164: "WINDOW.MAXIMIZE",
    166: "CHANGE.LINK",
    167: "CALCULATE.DOCUMENT",
    168: "ON.KEY",
    169: "APP.RESTORE",
    170: "APP.MOVE",
    171: "APP.SIZE",
    172: "APP.MINIMIZE",
    173: "APP.MAXIMIZE",
    174: "BRING.TO.FRONT",
    175: "SEND.TO.BACK",
    185: "MAIN.CHART.TYPE",
    186: "OVERLAY.CHART.TYPE",
    187: "SELECT.END",
    188: "OPEN.MAIL",
    189: "SEND.MAIL",
    190: "STANDARD.FONT",
    191: "CONSOLIDATE",
    192: "SORT.SPECIAL",
    193: "GALLERY.3D.AREA",
    194: "GALLERY.3D.COLUMN",
    195: "GALLERY.3D.LINE",
    196: "GALLERY.3D.PIE",
    197: "VIEW.3D",
    198: "GOAL.SEEK",
    199: "WORKGROUP",
    200: "FILL.GROUP",
    201: "UPDATE.LINK",
    202: "PROMOTE",
    203: "DEMOTE",
    204: "SHOW.DETAIL",
    206: "UNGROUP",
    207: "OBJECT.PROPERTIES",
    208: "SAVE.NEW.OBJECT",
    209: "SHARE",
    210: "SHARE.NAME",
    211: "DUPLICATE",
    212: "APPLY.STYLE",
    213: "ASSIGN.TO.OBJECT",
    214: "OBJECT.PROTECTION",
    215: "HIDE.OBJECT",
    216: "SET.EXTRACT",
    217: "CREATE.PUBLISHER",
    218: "SUBSCRIBE.TO",
    219: "ATTRIBUTES",
    220: "SHOW.TOOLBAR",
    222: "PRINT.PREVIEW",
    223: "EDIT.COLOR",
    224: "SHOW.LEVELS",
    225: "FORMAT.MAIN",
    226: "FORMAT.OVERLAY",
    227: "ON.RECALC",
    228: "EDIT.SERIES",
    229: "DEFINE.STYLE",
    240: "LINE.PRINT",
    243: "ENTER.DATA",
    249: "GALLERY.RADAR",
    250: "MERGE.STYLES",
    251: "EDITION.OPTIONS",
    252: "PASTE.PICTURE",
    253: "PASTE.PICTURE.LINK",
    254: "SPELLING",
    256: "ZOOM",
    259: "INSERT.OBJECT",
    260: "WINDOW.MINIMIZE",
    265: "SOUND.NOTE",
    266: "SOUND.PLAY",
    267: "FORMAT.SHAPE",
    268: "EXTEND.POLYGON",
    269: "FORMAT.AUTO",
    272: "GALLERY.3D.BAR",
    273: "GALLERY.3D.SURFACE",
    274: "FILL.AUTO",
    276: "CUSTOMIZE.TOOLBAR",
    277: "ADD.TOOL",
    278: "EDIT.OBJECT",
    279: "ON.DOUBLECLICK",
    280: "ON.ENTRY",
    281: "WORKBOOK.ADD",
    282: "WORKBOOK.MOVE",
    283: "WORKBOOK.COPY",
    284: "WORKBOOK.OPTIONS",
    285: "SAVE.WORKSPACE",
    288: "CHART.WIZARD",
    289: "DELETE.TOOL",
    290: "MOVE.TOOL",
    291: "WORKBOOK.SELECT",
    292: "WORKBOOK.ACTIVATE",
    293: "ASSIGN.TO.TOOL",
    295: "COPY.TOOL",
    296: "RESET.TOOL",
    297: "CONSTRAIN.NUMERIC",
    298: "PASTE.TOOL",
    302: "WORKBOOK.NEW",
    305: "SCENARIO.CELLS",
    306: "SCENARIO.DELETE",
    307: "SCENARIO.ADD",
    308: "SCENARIO.EDIT",
    309: "SCENARIO.SHOW",
    310: "SCENARIO.SHOW.NEXT",
    311: "SCENARIO.SUMMARY",
    312: "PIVOT.TABLE.WIZARD",
    313: "PIVOT.FIELD.PROPERTIES",
    314: "PIVOT.FIELD",
    315: "PIVOT.ITEM",
    316: "PIVOT.ADD.FIELDS",
    318: "OPTIONS.CALCULATION",
    319: "OPTIONS.EDIT",
    320: "OPTIONS.VIEW",
    321: "ADDIN.MANAGER",
    322: "MENU.EDITOR",
    323: "ATTACH.TOOLBARS",
    324: "VBAActivate",
    325: "OPTIONS.CHART",
    328: "VBA.INSERT.FILE",
    330: "VBA.PROCEDURE.DEFINITION",
    336: "ROUTING.SLIP",
    338: "ROUTE.DOCUMENT",
    339: "MAIL.LOGON",
    342: "INSERT.PICTURE",
    343: "EDIT.TOOL",
    344: "GALLERY.DOUGHNUT",
    350: "CHART.TREND",
    352: "PIVOT.ITEM.PROPERTIES",
    354: "WORKBOOK.INSERT",
    355: "OPTIONS.TRANSITION",
    356: "OPTIONS.GENERAL",
    370: "FILTER.ADVANCED",
    373: "MAIL.ADD.MAILER",
    374: "MAIL.DELETE.MAILER",
    375: "MAIL.REPLY",
    376: "MAIL.REPLY.ALL",
    377: "MAIL.FORWARD",
    378: "MAIL.NEXT.LETTER",
    379: "DATA.LABEL",
    380: "INSERT.TITLE",
    381: "FONT.PROPERTIES",
    382: "MACRO.OPTIONS",
    383: "WORKBOOK.HIDE",
    384: "WORKBOOK.UNHIDE",
    385: "WORKBOOK.DELETE",
    386: "WORKBOOK.NAME",
    388: "GALLERY.CUSTOM",
    390: "ADD.CHART.AUTOFORMAT",
    391: "DELETE.CHART.AUTOFORMAT",
    392: "CHART.ADD.DATA",
    393: "AUTO.OUTLINE",
    394: "TAB.ORDER",
    395: "SHOW.DIALOG",
    396: "SELECT.ALL",
    397: "UNGROUP.SHEETS",
    398: "SUBTOTAL.CREATE",
    399: "SUBTOTAL.REMOVE",
    400: "RENAME.OBJECT",
    412: "WORKBOOK.SCROLL",
    413: "WORKBOOK.NEXT",
    414: "WORKBOOK.PREV",
    415: "WORKBOOK.TAB.SPLIT",
    416: "FULL.SCREEN",
    417: "WORKBOOK.PROTECT",
    420: "SCROLLBAR.PROPERTIES",
    421: "PIVOT.SHOW.PAGES",
    422: "TEXT.TO.COLUMNS",
    423: "FORMAT.CHARTTYPE",
    424: "LINK.FORMAT",
    425: "TRACER.DISPLAY",
    430: "TRACER.NAVIGATE",
    431: "TRACER.CLEAR",
    432: "TRACER.ERROR",
    433: "PIVOT.FIELD.GROUP",
    434: "PIVOT.FIELD.UNGROUP",
    435: "CHECKBOX.PROPERTIES",
    436: "LABEL.PROPERTIES",
    437: "LISTBOX.PROPERTIES",
    438: "EDITBOX.PROPERTIES",
    439: "PIVOT.REFRESH",
    440: "LINK.COMBO",
    441: "OPEN.TEXT",
    442: "HIDE.DIALOG",
    443: "SET.DIALOG.FOCUS",
    444: "ENABLE.OBJECT",
    445: "PUSHBUTTON.PROPERTIES",
    446: "SET.DIALOG.DEFAULT",
    447: "FILTER",
    448: "FILTER.SHOW.ALL",
    449: "CLEAR.OUTLINE",
    450: "FUNCTION.WIZARD",
    451: "ADD.LIST.ITEM",
    452: "SET.LIST.ITEM",
    453: "REMOVE.LIST.ITEM",
    454: "SELECT.LIST.ITEM",
    455: "SET.CONTROL.VALUE",
    456: "SAVE.COPY.AS",
    458: "OPTIONS.LISTS.ADD",
    459: "OPTIONS.LISTS.DELETE",
    460: "SERIES.AXES",
    461: "SERIES.X",
    462: "SERIES.Y",
    463: "ERRORBAR.X",
    464: "ERRORBAR.Y",
    465: "FORMAT.CHART",
    466: "SERIES.ORDER",
    467: "MAIL.LOGOFF",
    468: "CLEAR.ROUTING.SLIP",
    469: "APP.ACTIVATE.MICROSOFT",
    470: "MAIL.EDIT.MAILER",
    471: "ON.SHEET",
    472: "STANDARD.WIDTH",
    473: "SCENARIO.MERGE",
    474: "SUMMARY.INFO",
    475: "FIND.FILE",
    476: "ACTIVE.CELL.FONT",
    477: "ENABLE.TIPWIZARD",
    478: "VBA.MAKE.ADDIN",
    480: "INSERTDATATABLE",
    481: "WORKGROUP.OPTIONS",
    482: "MAIL.SEND.MAILER",
    485: "AUTOCORRECT",
    489: "POST.DOCUMENT",
    491: "PICKLIST",
    493: "VIEW.SHOW",
    494: "VIEW.DEFINE",
    495: "VIEW.DELETE",
    509: "SHEET.BACKGROUND",
    510: "INSERT.MAP.OBJECT",
    511: "OPTIONS.MENONO",
    517: "MSOCHECKS",
    518: "NORMAL",
    519: "LAYOUT",
    520: "RM.PRINT.AREA",
    521: "CLEAR.PRINT.AREA",
    522: "ADD.PRINT.AREA",
    523: "MOVE.BRK",
    545: "HIDECURR.NOTE",
    546: "HIDEALL.NOTES",
    547: "DELETE.NOTE",
    548: "TRAVERSE.NOTES",
    549: "ACTIVATE.NOTES",
    620: "PROTECT.REVISIONS",
    621: "UNPROTECT.REVISIONS",
    647: "OPTIONS.ME",
    653: "WEB.PUBLISH",
    667: "NEWWEBQUERY",
    673: "PIVOT.TABLE.CHART",
    753: "OPTIONS.SAVE",
    755: "OPTIONS.SPELL",
    808: "HIDEALL.INKANNOTS",
  },
  Oi = {
    0: "COUNT",
    1: "IF",
    2: "ISNA",
    3: "ISERROR",
    4: "SUM",
    5: "AVERAGE",
    6: "MIN",
    7: "MAX",
    8: "ROW",
    9: "COLUMN",
    10: "NA",
    11: "NPV",
    12: "STDEV",
    13: "DOLLAR",
    14: "FIXED",
    15: "SIN",
    16: "COS",
    17: "TAN",
    18: "ATAN",
    19: "PI",
    20: "SQRT",
    21: "EXP",
    22: "LN",
    23: "LOG10",
    24: "ABS",
    25: "INT",
    26: "SIGN",
    27: "ROUND",
    28: "LOOKUP",
    29: "INDEX",
    30: "REPT",
    31: "MID",
    32: "LEN",
    33: "VALUE",
    34: "TRUE",
    35: "FALSE",
    36: "AND",
    37: "OR",
    38: "NOT",
    39: "MOD",
    40: "DCOUNT",
    41: "DSUM",
    42: "DAVERAGE",
    43: "DMIN",
    44: "DMAX",
    45: "DSTDEV",
    46: "VAR",
    47: "DVAR",
    48: "TEXT",
    49: "LINEST",
    50: "TREND",
    51: "LOGEST",
    52: "GROWTH",
    53: "GOTO",
    54: "HALT",
    55: "RETURN",
    56: "PV",
    57: "FV",
    58: "NPER",
    59: "PMT",
    60: "RATE",
    61: "MIRR",
    62: "IRR",
    63: "RAND",
    64: "MATCH",
    65: "DATE",
    66: "TIME",
    67: "DAY",
    68: "MONTH",
    69: "YEAR",
    70: "WEEKDAY",
    71: "HOUR",
    72: "MINUTE",
    73: "SECOND",
    74: "NOW",
    75: "AREAS",
    76: "ROWS",
    77: "COLUMNS",
    78: "OFFSET",
    79: "ABSREF",
    80: "RELREF",
    81: "ARGUMENT",
    82: "SEARCH",
    83: "TRANSPOSE",
    84: "ERROR",
    85: "STEP",
    86: "TYPE",
    87: "ECHO",
    88: "SET.NAME",
    89: "CALLER",
    90: "DEREF",
    91: "WINDOWS",
    92: "SERIES",
    93: "DOCUMENTS",
    94: "ACTIVE.CELL",
    95: "SELECTION",
    96: "RESULT",
    97: "ATAN2",
    98: "ASIN",
    99: "ACOS",
    100: "CHOOSE",
    101: "HLOOKUP",
    102: "VLOOKUP",
    103: "LINKS",
    104: "INPUT",
    105: "ISREF",
    106: "GET.FORMULA",
    107: "GET.NAME",
    108: "SET.VALUE",
    109: "LOG",
    110: "EXEC",
    111: "CHAR",
    112: "LOWER",
    113: "UPPER",
    114: "PROPER",
    115: "LEFT",
    116: "RIGHT",
    117: "EXACT",
    118: "TRIM",
    119: "REPLACE",
    120: "SUBSTITUTE",
    121: "CODE",
    122: "NAMES",
    123: "DIRECTORY",
    124: "FIND",
    125: "CELL",
    126: "ISERR",
    127: "ISTEXT",
    128: "ISNUMBER",
    129: "ISBLANK",
    130: "T",
    131: "N",
    132: "FOPEN",
    133: "FCLOSE",
    134: "FSIZE",
    135: "FREADLN",
    136: "FREAD",
    137: "FWRITELN",
    138: "FWRITE",
    139: "FPOS",
    140: "DATEVALUE",
    141: "TIMEVALUE",
    142: "SLN",
    143: "SYD",
    144: "DDB",
    145: "GET.DEF",
    146: "REFTEXT",
    147: "TEXTREF",
    148: "INDIRECT",
    149: "REGISTER",
    150: "CALL",
    151: "ADD.BAR",
    152: "ADD.MENU",
    153: "ADD.COMMAND",
    154: "ENABLE.COMMAND",
    155: "CHECK.COMMAND",
    156: "RENAME.COMMAND",
    157: "SHOW.BAR",
    158: "DELETE.MENU",
    159: "DELETE.COMMAND",
    160: "GET.CHART.ITEM",
    161: "DIALOG.BOX",
    162: "CLEAN",
    163: "MDETERM",
    164: "MINVERSE",
    165: "MMULT",
    166: "FILES",
    167: "IPMT",
    168: "PPMT",
    169: "COUNTA",
    170: "CANCEL.KEY",
    171: "FOR",
    172: "WHILE",
    173: "BREAK",
    174: "NEXT",
    175: "INITIATE",
    176: "REQUEST",
    177: "POKE",
    178: "EXECUTE",
    179: "TERMINATE",
    180: "RESTART",
    181: "HELP",
    182: "GET.BAR",
    183: "PRODUCT",
    184: "FACT",
    185: "GET.CELL",
    186: "GET.WORKSPACE",
    187: "GET.WINDOW",
    188: "GET.DOCUMENT",
    189: "DPRODUCT",
    190: "ISNONTEXT",
    191: "GET.NOTE",
    192: "NOTE",
    193: "STDEVP",
    194: "VARP",
    195: "DSTDEVP",
    196: "DVARP",
    197: "TRUNC",
    198: "ISLOGICAL",
    199: "DCOUNTA",
    200: "DELETE.BAR",
    201: "UNREGISTER",
    204: "USDOLLAR",
    205: "FINDB",
    206: "SEARCHB",
    207: "REPLACEB",
    208: "LEFTB",
    209: "RIGHTB",
    210: "MIDB",
    211: "LENB",
    212: "ROUNDUP",
    213: "ROUNDDOWN",
    214: "ASC",
    215: "DBCS",
    216: "RANK",
    219: "ADDRESS",
    220: "DAYS360",
    221: "TODAY",
    222: "VDB",
    223: "ELSE",
    224: "ELSE.IF",
    225: "END.IF",
    226: "FOR.CELL",
    227: "MEDIAN",
    228: "SUMPRODUCT",
    229: "SINH",
    230: "COSH",
    231: "TANH",
    232: "ASINH",
    233: "ACOSH",
    234: "ATANH",
    235: "DGET",
    236: "CREATE.OBJECT",
    237: "VOLATILE",
    238: "LAST.ERROR",
    239: "CUSTOM.UNDO",
    240: "CUSTOM.REPEAT",
    241: "FORMULA.CONVERT",
    242: "GET.LINK.INFO",
    243: "TEXT.BOX",
    244: "INFO",
    245: "GROUP",
    246: "GET.OBJECT",
    247: "DB",
    248: "PAUSE",
    251: "RESUME",
    252: "FREQUENCY",
    253: "ADD.TOOLBAR",
    254: "DELETE.TOOLBAR",
    255: "User",
    256: "RESET.TOOLBAR",
    257: "EVALUATE",
    258: "GET.TOOLBAR",
    259: "GET.TOOL",
    260: "SPELLING.CHECK",
    261: "ERROR.TYPE",
    262: "APP.TITLE",
    263: "WINDOW.TITLE",
    264: "SAVE.TOOLBAR",
    265: "ENABLE.TOOL",
    266: "PRESS.TOOL",
    267: "REGISTER.ID",
    268: "GET.WORKBOOK",
    269: "AVEDEV",
    270: "BETADIST",
    271: "GAMMALN",
    272: "BETAINV",
    273: "BINOMDIST",
    274: "CHIDIST",
    275: "CHIINV",
    276: "COMBIN",
    277: "CONFIDENCE",
    278: "CRITBINOM",
    279: "EVEN",
    280: "EXPONDIST",
    281: "FDIST",
    282: "FINV",
    283: "FISHER",
    284: "FISHERINV",
    285: "FLOOR",
    286: "GAMMADIST",
    287: "GAMMAINV",
    288: "CEILING",
    289: "HYPGEOMDIST",
    290: "LOGNORMDIST",
    291: "LOGINV",
    292: "NEGBINOMDIST",
    293: "NORMDIST",
    294: "NORMSDIST",
    295: "NORMINV",
    296: "NORMSINV",
    297: "STANDARDIZE",
    298: "ODD",
    299: "PERMUT",
    300: "POISSON",
    301: "TDIST",
    302: "WEIBULL",
    303: "SUMXMY2",
    304: "SUMX2MY2",
    305: "SUMX2PY2",
    306: "CHITEST",
    307: "CORREL",
    308: "COVAR",
    309: "FORECAST",
    310: "FTEST",
    311: "INTERCEPT",
    312: "PEARSON",
    313: "RSQ",
    314: "STEYX",
    315: "SLOPE",
    316: "TTEST",
    317: "PROB",
    318: "DEVSQ",
    319: "GEOMEAN",
    320: "HARMEAN",
    321: "SUMSQ",
    322: "KURT",
    323: "SKEW",
    324: "ZTEST",
    325: "LARGE",
    326: "SMALL",
    327: "QUARTILE",
    328: "PERCENTILE",
    329: "PERCENTRANK",
    330: "MODE",
    331: "TRIMMEAN",
    332: "TINV",
    334: "MOVIE.COMMAND",
    335: "GET.MOVIE",
    336: "CONCATENATE",
    337: "POWER",
    338: "PIVOT.ADD.DATA",
    339: "GET.PIVOT.TABLE",
    340: "GET.PIVOT.FIELD",
    341: "GET.PIVOT.ITEM",
    342: "RADIANS",
    343: "DEGREES",
    344: "SUBTOTAL",
    345: "SUMIF",
    346: "COUNTIF",
    347: "COUNTBLANK",
    348: "SCENARIO.GET",
    349: "OPTIONS.LISTS.GET",
    350: "ISPMT",
    351: "DATEDIF",
    352: "DATESTRING",
    353: "NUMBERSTRING",
    354: "ROMAN",
    355: "OPEN.DIALOG",
    356: "SAVE.DIALOG",
    357: "VIEW.GET",
    358: "GETPIVOTDATA",
    359: "HYPERLINK",
    360: "PHONETIC",
    361: "AVERAGEA",
    362: "MAXA",
    363: "MINA",
    364: "STDEVPA",
    365: "VARPA",
    366: "STDEVA",
    367: "VARA",
    368: "BAHTTEXT",
    369: "THAIDAYOFWEEK",
    370: "THAIDIGIT",
    371: "THAIMONTHOFYEAR",
    372: "THAINUMSOUND",
    373: "THAINUMSTRING",
    374: "THAISTRINGLENGTH",
    375: "ISTHAIDIGIT",
    376: "ROUNDBAHTDOWN",
    377: "ROUNDBAHTUP",
    378: "THAIYEAR",
    379: "RTD",
    380: "CUBEVALUE",
    381: "CUBEMEMBER",
    382: "CUBEMEMBERPROPERTY",
    383: "CUBERANKEDMEMBER",
    384: "HEX2BIN",
    385: "HEX2DEC",
    386: "HEX2OCT",
    387: "DEC2BIN",
    388: "DEC2HEX",
    389: "DEC2OCT",
    390: "OCT2BIN",
    391: "OCT2HEX",
    392: "OCT2DEC",
    393: "BIN2DEC",
    394: "BIN2OCT",
    395: "BIN2HEX",
    396: "IMSUB",
    397: "IMDIV",
    398: "IMPOWER",
    399: "IMABS",
    400: "IMSQRT",
    401: "IMLN",
    402: "IMLOG2",
    403: "IMLOG10",
    404: "IMSIN",
    405: "IMCOS",
    406: "IMEXP",
    407: "IMARGUMENT",
    408: "IMCONJUGATE",
    409: "IMAGINARY",
    410: "IMREAL",
    411: "COMPLEX",
    412: "IMSUM",
    413: "IMPRODUCT",
    414: "SERIESSUM",
    415: "FACTDOUBLE",
    416: "SQRTPI",
    417: "QUOTIENT",
    418: "DELTA",
    419: "GESTEP",
    420: "ISEVEN",
    421: "ISODD",
    422: "MROUND",
    423: "ERF",
    424: "ERFC",
    425: "BESSELJ",
    426: "BESSELK",
    427: "BESSELY",
    428: "BESSELI",
    429: "XIRR",
    430: "XNPV",
    431: "PRICEMAT",
    432: "YIELDMAT",
    433: "INTRATE",
    434: "RECEIVED",
    435: "DISC",
    436: "PRICEDISC",
    437: "YIELDDISC",
    438: "TBILLEQ",
    439: "TBILLPRICE",
    440: "TBILLYIELD",
    441: "PRICE",
    442: "YIELD",
    443: "DOLLARDE",
    444: "DOLLARFR",
    445: "NOMINAL",
    446: "EFFECT",
    447: "CUMPRINC",
    448: "CUMIPMT",
    449: "EDATE",
    450: "EOMONTH",
    451: "YEARFRAC",
    452: "COUPDAYBS",
    453: "COUPDAYS",
    454: "COUPDAYSNC",
    455: "COUPNCD",
    456: "COUPNUM",
    457: "COUPPCD",
    458: "DURATION",
    459: "MDURATION",
    460: "ODDLPRICE",
    461: "ODDLYIELD",
    462: "ODDFPRICE",
    463: "ODDFYIELD",
    464: "RANDBETWEEN",
    465: "WEEKNUM",
    466: "AMORDEGRC",
    467: "AMORLINC",
    468: "CONVERT",
    724: "SHEETJS",
    469: "ACCRINT",
    470: "ACCRINTM",
    471: "WORKDAY",
    472: "NETWORKDAYS",
    473: "GCD",
    474: "MULTINOMIAL",
    475: "LCM",
    476: "FVSCHEDULE",
    477: "CUBEKPIMEMBER",
    478: "CUBESET",
    479: "CUBESETCOUNT",
    480: "IFERROR",
    481: "COUNTIFS",
    482: "SUMIFS",
    483: "AVERAGEIF",
    484: "AVERAGEIFS",
  },
  e1 = {
    2: 1,
    3: 1,
    10: 0,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    19: 0,
    20: 1,
    21: 1,
    22: 1,
    23: 1,
    24: 1,
    25: 1,
    26: 1,
    27: 2,
    30: 2,
    31: 3,
    32: 1,
    33: 1,
    34: 0,
    35: 0,
    38: 1,
    39: 2,
    40: 3,
    41: 3,
    42: 3,
    43: 3,
    44: 3,
    45: 3,
    47: 3,
    48: 2,
    53: 1,
    61: 3,
    63: 0,
    65: 3,
    66: 3,
    67: 1,
    68: 1,
    69: 1,
    70: 1,
    71: 1,
    72: 1,
    73: 1,
    74: 0,
    75: 1,
    76: 1,
    77: 1,
    79: 2,
    80: 2,
    83: 1,
    85: 0,
    86: 1,
    89: 0,
    90: 1,
    94: 0,
    95: 0,
    97: 2,
    98: 1,
    99: 1,
    101: 3,
    102: 3,
    105: 1,
    106: 1,
    108: 2,
    111: 1,
    112: 1,
    113: 1,
    114: 1,
    117: 2,
    118: 1,
    119: 4,
    121: 1,
    126: 1,
    127: 1,
    128: 1,
    129: 1,
    130: 1,
    131: 1,
    133: 1,
    134: 1,
    135: 1,
    136: 2,
    137: 2,
    138: 2,
    140: 1,
    141: 1,
    142: 3,
    143: 4,
    144: 4,
    161: 1,
    162: 1,
    163: 1,
    164: 1,
    165: 2,
    172: 1,
    175: 2,
    176: 2,
    177: 3,
    178: 2,
    179: 1,
    184: 1,
    186: 1,
    189: 3,
    190: 1,
    195: 3,
    196: 3,
    197: 1,
    198: 1,
    199: 3,
    201: 1,
    207: 4,
    210: 3,
    211: 1,
    212: 2,
    213: 2,
    214: 1,
    215: 1,
    225: 0,
    229: 1,
    230: 1,
    231: 1,
    232: 1,
    233: 1,
    234: 1,
    235: 3,
    244: 1,
    247: 4,
    252: 2,
    257: 1,
    261: 1,
    271: 1,
    273: 4,
    274: 2,
    275: 2,
    276: 2,
    277: 3,
    278: 3,
    279: 1,
    280: 3,
    281: 3,
    282: 3,
    283: 1,
    284: 1,
    285: 2,
    286: 4,
    287: 3,
    288: 2,
    289: 4,
    290: 3,
    291: 3,
    292: 3,
    293: 4,
    294: 1,
    295: 3,
    296: 1,
    297: 3,
    298: 1,
    299: 2,
    300: 3,
    301: 3,
    302: 4,
    303: 2,
    304: 2,
    305: 2,
    306: 2,
    307: 2,
    308: 2,
    309: 3,
    310: 2,
    311: 2,
    312: 2,
    313: 2,
    314: 2,
    315: 2,
    316: 4,
    325: 2,
    326: 2,
    327: 2,
    328: 2,
    331: 2,
    332: 2,
    337: 2,
    342: 1,
    343: 1,
    346: 2,
    347: 1,
    350: 4,
    351: 3,
    352: 1,
    353: 2,
    360: 1,
    368: 1,
    369: 1,
    370: 1,
    371: 1,
    372: 1,
    373: 1,
    374: 1,
    375: 1,
    376: 1,
    377: 1,
    378: 1,
    382: 3,
    385: 1,
    392: 1,
    393: 1,
    396: 2,
    397: 2,
    398: 2,
    399: 1,
    400: 1,
    401: 1,
    402: 1,
    403: 1,
    404: 1,
    405: 1,
    406: 1,
    407: 1,
    408: 1,
    409: 1,
    410: 1,
    414: 4,
    415: 1,
    416: 1,
    417: 2,
    420: 1,
    421: 1,
    422: 2,
    424: 1,
    425: 2,
    426: 2,
    427: 2,
    428: 2,
    430: 3,
    438: 3,
    439: 3,
    440: 3,
    443: 2,
    444: 2,
    445: 2,
    446: 2,
    447: 6,
    448: 6,
    449: 2,
    450: 2,
    464: 2,
    468: 3,
    476: 2,
    479: 1,
    480: 2,
    65535: 0,
  };
function r1(e) {
  var t = "of:=" + e.replace(i0, "$1[.$2$3$4$5]").replace(/\]:\[/g, ":");
  return t.replace(/;/g, "|").replace(/,/g, ";");
}
function t1(e) {
  return e.replace(/\./, "!");
}
var Ot = typeof Map < "u";
function l0(e, t, r) {
  var n = 0,
    a = e.length;
  if (r) {
    if (Ot ? r.has(t) : Object.prototype.hasOwnProperty.call(r, t)) {
      for (var i = Ot ? r.get(t) : r[t]; n < i.length; ++n)
        if (e[i[n]].t === t) return (e.Count++, i[n]);
    }
  } else for (; n < a; ++n) if (e[n].t === t) return (e.Count++, n);
  return (
    (e[a] = { t }),
    e.Count++,
    e.Unique++,
    r &&
      (Ot
        ? (r.has(t) || r.set(t, []), r.get(t).push(a))
        : (Object.prototype.hasOwnProperty.call(r, t) || (r[t] = []), r[t].push(a))),
    a
  );
}
function Sn(e, t) {
  var r = { min: e + 1, max: e + 1 },
    n = -1;
  return (
    t.MDW && (Rr = t.MDW),
    t.width != null
      ? (r.customWidth = 1)
      : t.wpx != null
        ? (n = un(t.wpx))
        : t.wch != null && (n = t.wch),
    n > -1 ? ((r.width = Gn(n)), (r.customWidth = 1)) : t.width != null && (r.width = t.width),
    t.hidden && (r.hidden = !0),
    t.level != null && (r.outlineLevel = r.level = t.level),
    r
  );
}
function Di(e, t) {
  if (e) {
    var r = [0.7, 0.7, 0.75, 0.75, 0.3, 0.3];
    (e.left == null && (e.left = r[0]),
      e.right == null && (e.right = r[1]),
      e.top == null && (e.top = r[2]),
      e.bottom == null && (e.bottom = r[3]),
      e.header == null && (e.header = r[4]),
      e.footer == null && (e.footer = r[5]));
  }
}
function Wr(e, t, r) {
  var n = r.revssf[t.z != null ? t.z : "General"],
    a = 60,
    i = e.length;
  if (n == null && r.ssf) {
    for (; a < 392; ++a)
      if (r.ssf[a] == null) {
        (Aa(t.z, a), (r.ssf[a] = t.z), (r.revssf[t.z] = n = a));
        break;
      }
  }
  for (a = 0; a != i; ++a) if (e[a].numFmtId === n) return a;
  return (
    (e[i] = { numFmtId: n, fontId: 0, fillId: 0, borderId: 0, xfId: 0, applyNumberFormat: 1 }), i
  );
}
function n1(e, t, r) {
  if (e && e["!ref"]) {
    var n = Se(e["!ref"]);
    if (n.e.c < n.s.c || n.e.r < n.s.r) throw new Error("Bad range (" + r + "): " + e["!ref"]);
  }
}
function a1(e) {
  if (e.length === 0) return "";
  for (var t = '<mergeCells count="' + e.length + '">', r = 0; r != e.length; ++r)
    t += '<mergeCell ref="' + Ie(e[r]) + '"/>';
  return t + "</mergeCells>";
}
function i1(e, t, r, n, a) {
  var i = !1,
    s = {},
    f = null;
  if (n.bookType !== "xlsx" && t.vbaraw) {
    var o = t.SheetNames[r];
    try {
      t.Workbook && (o = t.Workbook.Sheets[r].CodeName || o);
    } catch {}
    ((i = !0), (s.codeName = kt(ge(o))));
  }
  if (e && e["!outline"]) {
    var l = { summaryBelow: 1, summaryRight: 1 };
    (e["!outline"].above && (l.summaryBelow = 0),
      e["!outline"].left && (l.summaryRight = 0),
      (f = (f || "") + j("outlinePr", null, l)));
  }
  (!i && !f) || (a[a.length] = j("sheetPr", f, s));
}
var s1 = ["objects", "scenarios", "selectLockedCells", "selectUnlockedCells"],
  f1 = [
    "formatColumns",
    "formatRows",
    "formatCells",
    "insertColumns",
    "insertRows",
    "insertHyperlinks",
    "deleteColumns",
    "deleteRows",
    "sort",
    "autoFilter",
    "pivotTables",
  ];
function l1(e) {
  var t = { sheet: 1 };
  return (
    s1.forEach(function (r) {
      e[r] != null && e[r] && (t[r] = "1");
    }),
    f1.forEach(function (r) {
      e[r] != null && !e[r] && (t[r] = "0");
    }),
    e.password && (t.password = ui(e.password).toString(16).toUpperCase()),
    j("sheetProtection", null, t)
  );
}
function o1(e) {
  return (Di(e), j("pageMargins", null, e));
}
function c1(e, t) {
  for (var r = ["<cols>"], n, a = 0; a != t.length; ++a)
    (n = t[a]) && (r[r.length] = j("col", null, Sn(a, n)));
  return ((r[r.length] = "</cols>"), r.join(""));
}
function h1(e, t, r, n) {
  var a = typeof e.ref == "string" ? e.ref : Ie(e.ref);
  (r.Workbook || (r.Workbook = { Sheets: [] }), r.Workbook.Names || (r.Workbook.Names = []));
  var i = r.Workbook.Names,
    s = fr(a);
  s.s.r == s.e.r && ((s.e.r = fr(t["!ref"]).e.r), (a = Ie(s)));
  for (var f = 0; f < i.length; ++f) {
    var o = i[f];
    if (o.Name == "_xlnm._FilterDatabase" && o.Sheet == n) {
      o.Ref = "'" + r.SheetNames[n] + "'!" + a;
      break;
    }
  }
  return (
    f == i.length &&
      i.push({ Name: "_xlnm._FilterDatabase", Sheet: n, Ref: "'" + r.SheetNames[n] + "'!" + a }),
    j("autoFilter", null, { ref: a })
  );
}
function u1(e, t, r, n) {
  var a = { workbookViewId: "0" };
  return (
    (((n || {}).Workbook || {}).Views || [])[0] &&
      (a.rightToLeft = n.Workbook.Views[0].RTL ? "1" : "0"),
    j("sheetViews", j("sheetView", null, a), {})
  );
}
function x1(e, t, r, n) {
  if (
    (e.c && r["!comments"].push([t, e.c]),
    (e.v === void 0 && typeof e.f != "string") || (e.t === "z" && !e.f))
  )
    return "";
  var a = "",
    i = e.t,
    s = e.v;
  if (e.t !== "z")
    switch (e.t) {
      case "b":
        a = e.v ? "1" : "0";
        break;
      case "n":
        a = "" + e.v;
        break;
      case "e":
        a = Ut[e.v];
        break;
      case "d":
        (n && n.cellDates
          ? (a = Ze(e.v, -1).toISOString())
          : ((e = rr(e)), (e.t = "n"), (a = "" + (e.v = er(Ze(e.v))))),
          typeof e.z > "u" && (e.z = Oe[14]));
        break;
      default:
        a = e.v;
        break;
    }
  var f = Ve("v", ge(a)),
    o = { r: t },
    l = Wr(n.cellXfs, e, n);
  switch ((l !== 0 && (o.s = l), e.t)) {
    case "n":
      break;
    case "d":
      o.t = "d";
      break;
    case "b":
      o.t = "b";
      break;
    case "e":
      o.t = "e";
      break;
    case "z":
      break;
    default:
      if (e.v == null) {
        delete e.t;
        break;
      }
      if (e.v.length > 32767) throw new Error("Text length must not exceed 32767 characters");
      if (n && n.bookSST) {
        ((f = Ve("v", "" + l0(n.Strings, e.v, n.revStrings))), (o.t = "s"));
        break;
      }
      o.t = "str";
      break;
  }
  if ((e.t != i && ((e.t = i), (e.v = s)), typeof e.f == "string" && e.f)) {
    var c = e.F && e.F.slice(0, t.length) == t ? { t: "array", ref: e.F } : null;
    f = j("f", ge(e.f), c) + (e.v != null ? f : "");
  }
  return (e.l && r["!links"].push([t, e.l]), e.D && (o.cm = 1), j("c", f, o));
}
function d1(e, t, r, n) {
  var a = [],
    i = [],
    s = Se(e["!ref"]),
    f = "",
    o,
    l = "",
    c = [],
    p = 0,
    x = 0,
    d = e["!rows"],
    T = Array.isArray(e),
    u = { r: l },
    g,
    O = -1;
  for (x = s.s.c; x <= s.e.c; ++x) c[x] = Ke(x);
  for (p = s.s.r; p <= s.e.r; ++p) {
    for (i = [], l = Ge(p), x = s.s.c; x <= s.e.c; ++x) {
      o = c[x] + l;
      var D = T ? (e[p] || [])[x] : e[o];
      D !== void 0 && (f = x1(D, o, e, t)) != null && i.push(f);
    }
    (i.length > 0 || (d && d[p])) &&
      ((u = { r: l }),
      d &&
        d[p] &&
        ((g = d[p]),
        g.hidden && (u.hidden = 1),
        (O = -1),
        g.hpx ? (O = xn(g.hpx)) : g.hpt && (O = g.hpt),
        O > -1 && ((u.ht = O), (u.customHeight = 1)),
        g.level && (u.outlineLevel = g.level)),
      (a[a.length] = j("row", i.join(""), u)));
  }
  if (d)
    for (; p < d.length; ++p)
      d &&
        d[p] &&
        ((u = { r: p + 1 }),
        (g = d[p]),
        g.hidden && (u.hidden = 1),
        (O = -1),
        g.hpx ? (O = xn(g.hpx)) : g.hpt && (O = g.hpt),
        O > -1 && ((u.ht = O), (u.customHeight = 1)),
        g.level && (u.outlineLevel = g.level),
        (a[a.length] = j("row", "", u)));
  return a.join("");
}
function Ri(e, t, r, n) {
  var a = [ke, j("worksheet", null, { xmlns: ut[0], "xmlns:r": Le.r })],
    i = r.SheetNames[e],
    s = 0,
    f = "",
    o = r.Sheets[i];
  o == null && (o = {});
  var l = o["!ref"] || "A1",
    c = Se(l);
  if (c.e.c > 16383 || c.e.r > 1048575) {
    if (t.WTF) throw new Error("Range " + l + " exceeds format limit A1:XFD1048576");
    ((c.e.c = Math.min(c.e.c, 16383)), (c.e.r = Math.min(c.e.c, 1048575)), (l = Ie(c)));
  }
  (n || (n = {}), (o["!comments"] = []));
  var p = [];
  (i1(o, r, e, t, a),
    (a[a.length] = j("dimension", null, { ref: l })),
    (a[a.length] = u1(o, t, e, r)),
    t.sheetFormat &&
      (a[a.length] = j("sheetFormatPr", null, {
        defaultRowHeight: t.sheetFormat.defaultRowHeight || "16",
        baseColWidth: t.sheetFormat.baseColWidth || "10",
        outlineLevelRow: t.sheetFormat.outlineLevelRow || "7",
      })),
    o["!cols"] != null && o["!cols"].length > 0 && (a[a.length] = c1(o, o["!cols"])),
    (a[(s = a.length)] = "<sheetData/>"),
    (o["!links"] = []),
    o["!ref"] != null && ((f = d1(o, t)), f.length > 0 && (a[a.length] = f)),
    a.length > s + 1 && ((a[a.length] = "</sheetData>"), (a[s] = a[s].replace("/>", ">"))),
    o["!protect"] && (a[a.length] = l1(o["!protect"])),
    o["!autofilter"] != null && (a[a.length] = h1(o["!autofilter"], o, r, e)),
    o["!merges"] != null && o["!merges"].length > 0 && (a[a.length] = a1(o["!merges"])));
  var x = -1,
    d,
    T = -1;
  return (
    o["!links"].length > 0 &&
      ((a[a.length] = "<hyperlinks>"),
      o["!links"].forEach(function (u) {
        u[1].Target &&
          ((d = { ref: u[0] }),
          u[1].Target.charAt(0) != "#" &&
            ((T = me(n, -1, ge(u[1].Target).replace(/#.*$/, ""), xe.HLINK)),
            (d["r:id"] = "rId" + T)),
          (x = u[1].Target.indexOf("#")) > -1 && (d.location = ge(u[1].Target.slice(x + 1))),
          u[1].Tooltip && (d.tooltip = ge(u[1].Tooltip)),
          (a[a.length] = j("hyperlink", null, d)));
      }),
      (a[a.length] = "</hyperlinks>")),
    delete o["!links"],
    o["!margins"] != null && (a[a.length] = o1(o["!margins"])),
    (!t || t.ignoreEC || t.ignoreEC == null) &&
      (a[a.length] = Ve(
        "ignoredErrors",
        j("ignoredError", null, { numberStoredAsText: 1, sqref: l }),
      )),
    p.length > 0 &&
      ((T = me(n, -1, "../drawings/drawing" + (e + 1) + ".xml", xe.DRAW)),
      (a[a.length] = j("drawing", null, { "r:id": "rId" + T })),
      (o["!drawing"] = p)),
    o["!comments"].length > 0 &&
      ((T = me(n, -1, "../drawings/vmlDrawing" + (e + 1) + ".vml", xe.VML)),
      (a[a.length] = j("legacyDrawing", null, { "r:id": "rId" + T })),
      (o["!legacy"] = T)),
    a.length > 1 && ((a[a.length] = "</worksheet>"), (a[1] = a[1].replace("/>", ">"))),
    a.join("")
  );
}
function p1(e, t) {
  var r = {},
    n = e.l + t;
  ((r.r = e.read_shift(4)), (e.l += 4));
  var a = e.read_shift(2);
  e.l += 1;
  var i = e.read_shift(1);
  return (
    (e.l = n), i & 7 && (r.level = i & 7), i & 16 && (r.hidden = !0), i & 32 && (r.hpt = a / 20), r
  );
}
function v1(e, t, r) {
  var n = b(145),
    a = (r["!rows"] || [])[e] || {};
  (n.write_shift(4, e), n.write_shift(4, 0));
  var i = 320;
  (a.hpx ? (i = xn(a.hpx) * 20) : a.hpt && (i = a.hpt * 20),
    n.write_shift(2, i),
    n.write_shift(1, 0));
  var s = 0;
  (a.level && (s |= a.level),
    a.hidden && (s |= 16),
    (a.hpx || a.hpt) && (s |= 32),
    n.write_shift(1, s),
    n.write_shift(1, 0));
  var f = 0,
    o = n.l;
  n.l += 4;
  for (var l = { r: e, c: 0 }, c = 0; c < 16; ++c)
    if (!(t.s.c > (c + 1) << 10 || t.e.c < c << 10)) {
      for (var p = -1, x = -1, d = c << 10; d < (c + 1) << 10; ++d) {
        l.c = d;
        var T = Array.isArray(r) ? (r[l.r] || [])[l.c] : r[_e(l)];
        T && (p < 0 && (p = d), (x = d));
      }
      p < 0 || (++f, n.write_shift(4, p), n.write_shift(4, x));
    }
  var u = n.l;
  return ((n.l = o), n.write_shift(4, f), (n.l = u), n.length > n.l ? n.slice(0, n.l) : n);
}
function m1(e, t, r, n) {
  var a = v1(n, r, t);
  (a.length > 17 || (t["!rows"] || [])[n]) && H(e, 0, a);
}
var g1 = et,
  _1 = dt;
function T1() {}
function E1(e, t) {
  var r = {},
    n = e[e.l];
  return (++e.l, (r.above = !(n & 64)), (r.left = !(n & 128)), (e.l += 18), (r.name = Rf(e)), r);
}
function w1(e, t, r) {
  r == null && (r = b(84 + 4 * e.length));
  var n = 192;
  (t && (t.above && (n &= -65), t.left && (n &= -129)), r.write_shift(1, n));
  for (var a = 1; a < 3; ++a) r.write_shift(1, 0);
  return (
    on({ auto: 1 }, r), r.write_shift(-4, -1), r.write_shift(-4, -1), za(e, r), r.slice(0, r.l)
  );
}
function S1(e) {
  var t = xr(e);
  return [t];
}
function A1(e, t, r) {
  return (r == null && (r = b(8)), Zr(t, r));
}
function F1(e) {
  var t = qr(e);
  return [t];
}
function y1(e, t, r) {
  return (r == null && (r = b(4)), Qr(t, r));
}
function C1(e) {
  var t = xr(e),
    r = e.read_shift(1);
  return [t, r, "b"];
}
function O1(e, t, r) {
  return (r == null && (r = b(9)), Zr(t, r), r.write_shift(1, e.v ? 1 : 0), r);
}
function D1(e) {
  var t = qr(e),
    r = e.read_shift(1);
  return [t, r, "b"];
}
function R1(e, t, r) {
  return (r == null && (r = b(5)), Qr(t, r), r.write_shift(1, e.v ? 1 : 0), r);
}
function I1(e) {
  var t = xr(e),
    r = e.read_shift(1);
  return [t, r, "e"];
}
function k1(e, t, r) {
  return (r == null && (r = b(9)), Zr(t, r), r.write_shift(1, e.v), r);
}
function N1(e) {
  var t = qr(e),
    r = e.read_shift(1);
  return [t, r, "e"];
}
function P1(e, t, r) {
  return (
    r == null && (r = b(8)),
    Qr(t, r),
    r.write_shift(1, e.v),
    r.write_shift(2, 0),
    r.write_shift(1, 0),
    r
  );
}
function L1(e) {
  var t = xr(e),
    r = e.read_shift(4);
  return [t, r, "s"];
}
function M1(e, t, r) {
  return (r == null && (r = b(12)), Zr(t, r), r.write_shift(4, t.v), r);
}
function B1(e) {
  var t = qr(e),
    r = e.read_shift(4);
  return [t, r, "s"];
}
function b1(e, t, r) {
  return (r == null && (r = b(8)), Qr(t, r), r.write_shift(4, t.v), r);
}
function U1(e) {
  var t = xr(e),
    r = pt(e);
  return [t, r, "n"];
}
function W1(e, t, r) {
  return (r == null && (r = b(16)), Zr(t, r), $r(e.v, r), r);
}
function H1(e) {
  var t = qr(e),
    r = pt(e);
  return [t, r, "n"];
}
function V1(e, t, r) {
  return (r == null && (r = b(12)), Qr(t, r), $r(e.v, r), r);
}
function G1(e) {
  var t = xr(e),
    r = Ka(e);
  return [t, r, "n"];
}
function X1(e, t, r) {
  return (r == null && (r = b(12)), Zr(t, r), Ya(e.v, r), r);
}
function z1(e) {
  var t = qr(e),
    r = Ka(e);
  return [t, r, "n"];
}
function K1(e, t, r) {
  return (r == null && (r = b(8)), Qr(t, r), Ya(e.v, r), r);
}
function Y1(e) {
  var t = xr(e),
    r = e0(e);
  return [t, r, "is"];
}
function $1(e) {
  var t = xr(e),
    r = Ye(e);
  return [t, r, "str"];
}
function j1(e, t, r) {
  return (
    r == null && (r = b(12 + 4 * e.v.length)),
    Zr(t, r),
    Be(e.v, r),
    r.length > r.l ? r.slice(0, r.l) : r
  );
}
function J1(e) {
  var t = qr(e),
    r = Ye(e);
  return [t, r, "str"];
}
function Z1(e, t, r) {
  return (
    r == null && (r = b(8 + 4 * e.v.length)),
    Qr(t, r),
    Be(e.v, r),
    r.length > r.l ? r.slice(0, r.l) : r
  );
}
function q1(e, t, r) {
  var n = e.l + t,
    a = xr(e);
  a.r = r["!row"];
  var i = e.read_shift(1),
    s = [a, i, "b"];
  if (r.cellFormula) {
    e.l += 2;
    var f = wn(e, n - e.l, r);
    s[3] = ht(f, null, a, r.supbooks, r);
  } else e.l = n;
  return s;
}
function Q1(e, t, r) {
  var n = e.l + t,
    a = xr(e);
  a.r = r["!row"];
  var i = e.read_shift(1),
    s = [a, i, "e"];
  if (r.cellFormula) {
    e.l += 2;
    var f = wn(e, n - e.l, r);
    s[3] = ht(f, null, a, r.supbooks, r);
  } else e.l = n;
  return s;
}
function eh(e, t, r) {
  var n = e.l + t,
    a = xr(e);
  a.r = r["!row"];
  var i = pt(e),
    s = [a, i, "n"];
  if (r.cellFormula) {
    e.l += 2;
    var f = wn(e, n - e.l, r);
    s[3] = ht(f, null, a, r.supbooks, r);
  } else e.l = n;
  return s;
}
function rh(e, t, r) {
  var n = e.l + t,
    a = xr(e);
  a.r = r["!row"];
  var i = Ye(e),
    s = [a, i, "str"];
  if (r.cellFormula) {
    e.l += 2;
    var f = wn(e, n - e.l, r);
    s[3] = ht(f, null, a, r.supbooks, r);
  } else e.l = n;
  return s;
}
var th = et,
  nh = dt;
function ah(e, t) {
  return (t == null && (t = b(4)), t.write_shift(4, e), t);
}
function ih(e, t) {
  var r = e.l + t,
    n = et(e),
    a = r0(e),
    i = Ye(e),
    s = Ye(e),
    f = Ye(e);
  e.l = r;
  var o = { rfx: n, relId: a, loc: i, display: f };
  return (s && (o.Tooltip = s), o);
}
function sh(e, t) {
  var r = b(50 + 4 * (e[1].Target.length + (e[1].Tooltip || "").length));
  (dt({ s: Me(e[0]), e: Me(e[0]) }, r), t0("rId" + t, r));
  var n = e[1].Target.indexOf("#"),
    a = n == -1 ? "" : e[1].Target.slice(n + 1);
  return (Be(a || "", r), Be(e[1].Tooltip || "", r), Be("", r), r.slice(0, r.l));
}
function fh() {}
function lh(e, t, r) {
  var n = e.l + t,
    a = $a(e),
    i = e.read_shift(1),
    s = [a];
  if (((s[2] = i), r.cellFormula)) {
    var f = Jc(e, n - e.l, r);
    s[1] = f;
  } else e.l = n;
  return s;
}
function oh(e, t, r) {
  var n = e.l + t,
    a = et(e),
    i = [a];
  if (r.cellFormula) {
    var s = qc(e, n - e.l, r);
    ((i[1] = s), (e.l = n));
  } else e.l = n;
  return i;
}
function ch(e, t, r) {
  r == null && (r = b(18));
  var n = Sn(e, t);
  (r.write_shift(-4, e),
    r.write_shift(-4, e),
    r.write_shift(4, (n.width || 10) * 256),
    r.write_shift(4, 0));
  var a = 0;
  return (
    t.hidden && (a |= 1),
    typeof n.width == "number" && (a |= 2),
    t.level && (a |= t.level << 8),
    r.write_shift(2, a),
    r
  );
}
var Ii = ["left", "right", "top", "bottom", "header", "footer"];
function hh(e) {
  var t = {};
  return (
    Ii.forEach(function (r) {
      t[r] = pt(e);
    }),
    t
  );
}
function uh(e, t) {
  return (
    t == null && (t = b(48)),
    Di(e),
    Ii.forEach(function (r) {
      $r(e[r], t);
    }),
    t
  );
}
function xh(e) {
  var t = e.read_shift(2);
  return ((e.l += 28), { RTL: t & 32 });
}
function dh(e, t, r) {
  r == null && (r = b(30));
  var n = 924;
  return (
    (((t || {}).Views || [])[0] || {}).RTL && (n |= 32),
    r.write_shift(2, n),
    r.write_shift(4, 0),
    r.write_shift(4, 0),
    r.write_shift(4, 0),
    r.write_shift(1, 0),
    r.write_shift(1, 0),
    r.write_shift(2, 0),
    r.write_shift(2, 100),
    r.write_shift(2, 0),
    r.write_shift(2, 0),
    r.write_shift(2, 0),
    r.write_shift(4, 0),
    r
  );
}
function ph(e) {
  var t = b(24);
  return (t.write_shift(4, 4), t.write_shift(4, 1), dt(e, t), t);
}
function vh(e, t) {
  return (
    t == null && (t = b(66)),
    t.write_shift(2, e.password ? ui(e.password) : 0),
    t.write_shift(4, 1),
    [
      ["objects", !1],
      ["scenarios", !1],
      ["formatCells", !0],
      ["formatColumns", !0],
      ["formatRows", !0],
      ["insertColumns", !0],
      ["insertRows", !0],
      ["insertHyperlinks", !0],
      ["deleteColumns", !0],
      ["deleteRows", !0],
      ["selectLockedCells", !1],
      ["sort", !0],
      ["autoFilter", !0],
      ["pivotTables", !0],
      ["selectUnlockedCells", !1],
    ].forEach(function (r) {
      r[1]
        ? t.write_shift(4, e[r[0]] != null && !e[r[0]] ? 1 : 0)
        : t.write_shift(4, e[r[0]] != null && e[r[0]] ? 0 : 1);
    }),
    t
  );
}
function mh() {}
function gh() {}
function _h(e, t, r, n, a, i, s) {
  if (t.v === void 0) return !1;
  var f = "";
  switch (t.t) {
    case "b":
      f = t.v ? "1" : "0";
      break;
    case "d":
      ((t = rr(t)), (t.z = t.z || Oe[14]), (t.v = er(Ze(t.v))), (t.t = "n"));
      break;
    case "n":
    case "e":
      f = "" + t.v;
      break;
    default:
      f = t.v;
      break;
  }
  var o = { r, c: n };
  switch (
    ((o.s = Wr(a.cellXfs, t, a)),
    t.l && i["!links"].push([_e(o), t.l]),
    t.c && i["!comments"].push([_e(o), t.c]),
    t.t)
  ) {
    case "s":
    case "str":
      return (
        a.bookSST
          ? ((f = l0(a.Strings, t.v, a.revStrings)),
            (o.t = "s"),
            (o.v = f),
            s ? H(e, 18, b1(t, o)) : H(e, 7, M1(t, o)))
          : ((o.t = "str"), s ? H(e, 17, Z1(t, o)) : H(e, 6, j1(t, o))),
        !0
      );
    case "n":
      return (
        t.v == (t.v | 0) && t.v > -1e3 && t.v < 1e3
          ? s
            ? H(e, 13, K1(t, o))
            : H(e, 2, X1(t, o))
          : s
            ? H(e, 16, V1(t, o))
            : H(e, 5, W1(t, o)),
        !0
      );
    case "b":
      return ((o.t = "b"), s ? H(e, 15, R1(t, o)) : H(e, 4, O1(t, o)), !0);
    case "e":
      return ((o.t = "e"), s ? H(e, 14, P1(t, o)) : H(e, 3, k1(t, o)), !0);
  }
  return (s ? H(e, 12, y1(t, o)) : H(e, 1, A1(t, o)), !0);
}
function Th(e, t, r, n) {
  var a = Se(t["!ref"] || "A1"),
    i,
    s = "",
    f = [];
  H(e, 145);
  var o = Array.isArray(t),
    l = a.e.r;
  t["!rows"] && (l = Math.max(a.e.r, t["!rows"].length - 1));
  for (var c = a.s.r; c <= l; ++c) {
    ((s = Ge(c)), m1(e, t, a, c));
    var p = !1;
    if (c <= a.e.r)
      for (var x = a.s.c; x <= a.e.c; ++x) {
        (c === a.s.r && (f[x] = Ke(x)), (i = f[x] + s));
        var d = o ? (t[c] || [])[x] : t[i];
        if (!d) {
          p = !1;
          continue;
        }
        p = _h(e, d, c, x, n, t, p);
      }
  }
  H(e, 146);
}
function Eh(e, t) {
  !t ||
    !t["!merges"] ||
    (H(e, 177, ah(t["!merges"].length)),
    t["!merges"].forEach(function (r) {
      H(e, 176, nh(r));
    }),
    H(e, 178));
}
function wh(e, t) {
  !t ||
    !t["!cols"] ||
    (H(e, 390),
    t["!cols"].forEach(function (r, n) {
      r && H(e, 60, ch(n, r));
    }),
    H(e, 391));
}
function Sh(e, t) {
  !t || !t["!ref"] || (H(e, 648), H(e, 649, ph(Se(t["!ref"]))), H(e, 650));
}
function Ah(e, t, r) {
  (t["!links"].forEach(function (n) {
    if (n[1].Target) {
      var a = me(r, -1, n[1].Target.replace(/#.*$/, ""), xe.HLINK);
      H(e, 494, sh(n, a));
    }
  }),
    delete t["!links"]);
}
function Fh(e, t, r, n) {
  if (t["!comments"].length > 0) {
    var a = me(n, -1, "../drawings/vmlDrawing" + (r + 1) + ".vml", xe.VML);
    (H(e, 551, t0("rId" + a)), (t["!legacy"] = a));
  }
}
function yh(e, t, r, n) {
  if (t["!autofilter"]) {
    var a = t["!autofilter"],
      i = typeof a.ref == "string" ? a.ref : Ie(a.ref);
    (r.Workbook || (r.Workbook = { Sheets: [] }), r.Workbook.Names || (r.Workbook.Names = []));
    var s = r.Workbook.Names,
      f = fr(i);
    f.s.r == f.e.r && ((f.e.r = fr(t["!ref"]).e.r), (i = Ie(f)));
    for (var o = 0; o < s.length; ++o) {
      var l = s[o];
      if (l.Name == "_xlnm._FilterDatabase" && l.Sheet == n) {
        l.Ref = "'" + r.SheetNames[n] + "'!" + i;
        break;
      }
    }
    (o == s.length &&
      s.push({ Name: "_xlnm._FilterDatabase", Sheet: n, Ref: "'" + r.SheetNames[n] + "'!" + i }),
      H(e, 161, dt(Se(i))),
      H(e, 162));
  }
}
function Ch(e, t, r) {
  (H(e, 133), H(e, 137, dh(t, r)), H(e, 138), H(e, 134));
}
function Oh(e, t) {
  t["!protect"] && H(e, 535, vh(t["!protect"]));
}
function Dh(e, t, r, n) {
  var a = Qe(),
    i = r.SheetNames[e],
    s = r.Sheets[i] || {},
    f = i;
  try {
    r && r.Workbook && (f = r.Workbook.Sheets[e].CodeName || f);
  } catch {}
  var o = Se(s["!ref"] || "A1");
  if (o.e.c > 16383 || o.e.r > 1048575) {
    if (t.WTF)
      throw new Error("Range " + (s["!ref"] || "A1") + " exceeds format limit A1:XFD1048576");
    ((o.e.c = Math.min(o.e.c, 16383)), (o.e.r = Math.min(o.e.c, 1048575)));
  }
  return (
    (s["!links"] = []),
    (s["!comments"] = []),
    H(a, 129),
    (r.vbaraw || s["!outline"]) && H(a, 147, w1(f, s["!outline"])),
    H(a, 148, _1(o)),
    Ch(a, s, r.Workbook),
    wh(a, s),
    Th(a, s, e, t),
    Oh(a, s),
    yh(a, s, r, e),
    Eh(a, s),
    Ah(a, s, n),
    s["!margins"] && H(a, 476, uh(s["!margins"])),
    (!t || t.ignoreEC || t.ignoreEC == null) && Sh(a, s),
    Fh(a, s, e, n),
    H(a, 130),
    a.end()
  );
}
function Rh(e, t) {
  e.l += 10;
  var r = Ye(e);
  return { name: r };
}
var Ih = [
  ["allowRefreshQuery", !1, "bool"],
  ["autoCompressPictures", !0, "bool"],
  ["backupFile", !1, "bool"],
  ["checkCompatibility", !1, "bool"],
  ["CodeName", ""],
  ["date1904", !1, "bool"],
  ["defaultThemeVersion", 0, "int"],
  ["filterPrivacy", !1, "bool"],
  ["hidePivotFieldList", !1, "bool"],
  ["promptedSolutions", !1, "bool"],
  ["publishItems", !1, "bool"],
  ["refreshAllConnections", !1, "bool"],
  ["saveExternalLinkValues", !0, "bool"],
  ["showBorderUnselectedTables", !0, "bool"],
  ["showInkAnnotation", !0, "bool"],
  ["showObjects", "all"],
  ["showPivotChartFilter", !1, "bool"],
  ["updateLinks", "userSet"],
];
function kh(e) {
  return !e.Workbook || !e.Workbook.WBProps
    ? "false"
    : lf(e.Workbook.WBProps.date1904)
      ? "true"
      : "false";
}
var Nh = "][*?/\\".split("");
function ki(e, t) {
  if (e.length > 31) throw new Error("Sheet names cannot exceed 31 chars");
  var r = !0;
  return (
    Nh.forEach(function (n) {
      if (e.indexOf(n) != -1) throw new Error("Sheet name cannot contain : \\ / ? * [ ]");
    }),
    r
  );
}
function Ph(e, t, r) {
  e.forEach(function (n, a) {
    ki(n);
    for (var i = 0; i < a; ++i) if (n == e[i]) throw new Error("Duplicate Sheet Name: " + n);
    if (r) {
      var s = (t && t[a] && t[a].CodeName) || n;
      if (s.charCodeAt(0) == 95 && s.length > 22) throw new Error("Bad Code Name: Worksheet" + s);
    }
  });
}
function Lh(e) {
  if (!e || !e.SheetNames || !e.Sheets) throw new Error("Invalid Workbook");
  if (!e.SheetNames.length) throw new Error("Workbook is empty");
  var t = (e.Workbook && e.Workbook.Sheets) || [];
  Ph(e.SheetNames, t, !!e.vbaraw);
  for (var r = 0; r < e.SheetNames.length; ++r) n1(e.Sheets[e.SheetNames[r]], e.SheetNames[r], r);
}
function Ni(e) {
  var t = [ke];
  t[t.length] = j("workbook", null, { xmlns: ut[0], "xmlns:r": Le.r });
  var r = e.Workbook && (e.Workbook.Names || []).length > 0,
    n = { codeName: "ThisWorkbook" };
  (e.Workbook &&
    e.Workbook.WBProps &&
    (Ih.forEach(function (f) {
      e.Workbook.WBProps[f[0]] != null &&
        e.Workbook.WBProps[f[0]] != f[1] &&
        (n[f[0]] = e.Workbook.WBProps[f[0]]);
    }),
    e.Workbook.WBProps.CodeName && ((n.codeName = e.Workbook.WBProps.CodeName), delete n.CodeName)),
    (t[t.length] = j("workbookPr", null, n)));
  var a = (e.Workbook && e.Workbook.Sheets) || [],
    i = 0;
  if (a && a[0] && a[0].Hidden) {
    for (
      t[t.length] = "<bookViews>", i = 0;
      i != e.SheetNames.length && !(!a[i] || !a[i].Hidden);
      ++i
    );
    (i == e.SheetNames.length && (i = 0),
      (t[t.length] = '<workbookView firstSheet="' + i + '" activeTab="' + i + '"/>'),
      (t[t.length] = "</bookViews>"));
  }
  for (t[t.length] = "<sheets>", i = 0; i != e.SheetNames.length; ++i) {
    var s = { name: ge(e.SheetNames[i].slice(0, 31)) };
    if (((s.sheetId = "" + (i + 1)), (s["r:id"] = "rId" + (i + 1)), a[i]))
      switch (a[i].Hidden) {
        case 1:
          s.state = "hidden";
          break;
        case 2:
          s.state = "veryHidden";
          break;
      }
    t[t.length] = j("sheet", null, s);
  }
  return (
    (t[t.length] = "</sheets>"),
    r &&
      ((t[t.length] = "<definedNames>"),
      e.Workbook &&
        e.Workbook.Names &&
        e.Workbook.Names.forEach(function (f) {
          var o = { name: f.Name };
          (f.Comment && (o.comment = f.Comment),
            f.Sheet != null && (o.localSheetId = "" + f.Sheet),
            f.Hidden && (o.hidden = "1"),
            f.Ref && (t[t.length] = j("definedName", ge(f.Ref), o)));
        }),
      (t[t.length] = "</definedNames>")),
    t.length > 2 && ((t[t.length] = "</workbook>"), (t[1] = t[1].replace("/>", ">"))),
    t.join("")
  );
}
function Mh(e, t) {
  var r = {};
  return (
    (r.Hidden = e.read_shift(4)),
    (r.iTabID = e.read_shift(4)),
    (r.strRelID = Vn(e)),
    (r.name = Ye(e)),
    r
  );
}
function Bh(e, t) {
  return (
    t || (t = b(127)),
    t.write_shift(4, e.Hidden),
    t.write_shift(4, e.iTabID),
    t0(e.strRelID, t),
    Be(e.name.slice(0, 31), t),
    t.length > t.l ? t.slice(0, t.l) : t
  );
}
function bh(e, t) {
  var r = {},
    n = e.read_shift(4);
  r.defaultThemeVersion = e.read_shift(4);
  var a = t > 8 ? Ye(e) : "";
  return (
    a.length > 0 && (r.CodeName = a),
    (r.autoCompressPictures = !!(n & 65536)),
    (r.backupFile = !!(n & 64)),
    (r.checkCompatibility = !!(n & 4096)),
    (r.date1904 = !!(n & 1)),
    (r.filterPrivacy = !!(n & 8)),
    (r.hidePivotFieldList = !!(n & 1024)),
    (r.promptedSolutions = !!(n & 16)),
    (r.publishItems = !!(n & 2048)),
    (r.refreshAllConnections = !!(n & 262144)),
    (r.saveExternalLinkValues = !!(n & 128)),
    (r.showBorderUnselectedTables = !!(n & 4)),
    (r.showInkAnnotation = !!(n & 32)),
    (r.showObjects = ["all", "placeholders", "none"][(n >> 13) & 3]),
    (r.showPivotChartFilter = !!(n & 32768)),
    (r.updateLinks = ["userSet", "never", "always"][(n >> 8) & 3]),
    r
  );
}
function Uh(e, t) {
  t || (t = b(72));
  var r = 0;
  return (
    e && e.filterPrivacy && (r |= 8),
    t.write_shift(4, r),
    t.write_shift(4, 0),
    za((e && e.CodeName) || "ThisWorkbook", t),
    t.slice(0, t.l)
  );
}
function Wh(e, t, r) {
  var n = e.l + t;
  ((e.l += 4), (e.l += 1));
  var a = e.read_shift(4),
    i = If(e),
    s = Zc(e, 0, r),
    f = r0(e);
  e.l = n;
  var o = { Name: i, Ptg: s };
  return (a < 268435455 && (o.Sheet = a), f && (o.Comment = f), o);
}
function Hh(e, t) {
  H(e, 143);
  for (var r = 0; r != t.SheetNames.length; ++r) {
    var n =
        (t.Workbook && t.Workbook.Sheets && t.Workbook.Sheets[r] && t.Workbook.Sheets[r].Hidden) ||
        0,
      a = { Hidden: n, iTabID: r + 1, strRelID: "rId" + (r + 1), name: t.SheetNames[r] };
    H(e, 156, Bh(a));
  }
  H(e, 144);
}
function Vh(e, t) {
  t || (t = b(127));
  for (var r = 0; r != 4; ++r) t.write_shift(4, 0);
  return (
    Be("SheetJS", t),
    Be(en.version, t),
    Be(en.version, t),
    Be("7262", t),
    t.length > t.l ? t.slice(0, t.l) : t
  );
}
function Gh(e, t) {
  (t || (t = b(29)),
    t.write_shift(-4, 0),
    t.write_shift(-4, 460),
    t.write_shift(4, 28800),
    t.write_shift(4, 17600),
    t.write_shift(4, 500),
    t.write_shift(4, e),
    t.write_shift(4, e));
  var r = 120;
  return (t.write_shift(1, r), t.length > t.l ? t.slice(0, t.l) : t);
}
function Xh(e, t) {
  if (!(!t.Workbook || !t.Workbook.Sheets)) {
    for (var r = t.Workbook.Sheets, n = 0, a = -1, i = -1; n < r.length; ++n)
      !r[n] || (!r[n].Hidden && a == -1) ? (a = n) : r[n].Hidden == 1 && i == -1 && (i = n);
    i > a || (H(e, 135), H(e, 158, Gh(a)), H(e, 136));
  }
}
function zh(e, t) {
  var r = Qe();
  return (
    H(r, 131),
    H(r, 128, Vh()),
    H(r, 153, Uh((e.Workbook && e.Workbook.WBProps) || null)),
    Xh(r, e),
    Hh(r, e),
    H(r, 132),
    r.end()
  );
}
function Kh(e, t, r) {
  return (t.slice(-4) === ".bin" ? zh : Ni)(e);
}
function Yh(e, t, r, n, a) {
  return (t.slice(-4) === ".bin" ? Dh : Ri)(e, r, n, a);
}
function $h(e, t, r) {
  return (t.slice(-4) === ".bin" ? ho : pi)(e, r);
}
function jh(e, t, r) {
  return (t.slice(-4) === ".bin" ? bl : hi)(e, r);
}
function Jh(e, t, r) {
  return (t.slice(-4) === ".bin" ? Oo : Ti)(e);
}
function Zh(e) {
  return (e.slice(-4) === ".bin" ? To : gi)();
}
function qh(e, t) {
  var r = [];
  return (
    e.Props && r.push(Yf(e.Props, t)), e.Custprops && r.push($f(e.Props, e.Custprops)), r.join("")
  );
}
function Qh() {
  return "";
}
function eu(e, t) {
  var r = ['<Style ss:ID="Default" ss:Name="Normal"><NumberFormat/></Style>'];
  return (
    t.cellXfs.forEach(function (n, a) {
      var i = [];
      i.push(j("NumberFormat", null, { "ss:Format": ge(Oe[n.numFmtId]) }));
      var s = { "ss:ID": "s" + (21 + a) };
      r.push(j("Style", i.join(""), s));
    }),
    j("Styles", r.join(""))
  );
}
function Pi(e) {
  return j("NamedRange", null, {
    "ss:Name": e.Name,
    "ss:RefersTo": "=" + s0(e.Ref, { r: 0, c: 0 }),
  });
}
function ru(e) {
  if (!((e || {}).Workbook || {}).Names) return "";
  for (var t = e.Workbook.Names, r = [], n = 0; n < t.length; ++n) {
    var a = t[n];
    a.Sheet == null && (a.Name.match(/^_xlfn\./) || r.push(Pi(a)));
  }
  return j("Names", r.join(""));
}
function tu(e, t, r, n) {
  if (!e || !((n || {}).Workbook || {}).Names) return "";
  for (var a = n.Workbook.Names, i = [], s = 0; s < a.length; ++s) {
    var f = a[s];
    f.Sheet == r && (f.Name.match(/^_xlfn\./) || i.push(Pi(f)));
  }
  return i.join("");
}
function nu(e, t, r, n) {
  if (!e) return "";
  var a = [];
  if (
    (e["!margins"] &&
      (a.push("<PageSetup>"),
      e["!margins"].header && a.push(j("Header", null, { "x:Margin": e["!margins"].header })),
      e["!margins"].footer && a.push(j("Footer", null, { "x:Margin": e["!margins"].footer })),
      a.push(
        j("PageMargins", null, {
          "x:Bottom": e["!margins"].bottom || "0.75",
          "x:Left": e["!margins"].left || "0.7",
          "x:Right": e["!margins"].right || "0.7",
          "x:Top": e["!margins"].top || "0.75",
        }),
      ),
      a.push("</PageSetup>")),
    n && n.Workbook && n.Workbook.Sheets && n.Workbook.Sheets[r])
  )
    if (n.Workbook.Sheets[r].Hidden)
      a.push(
        j("Visible", n.Workbook.Sheets[r].Hidden == 1 ? "SheetHidden" : "SheetVeryHidden", {}),
      );
    else {
      for (var i = 0; i < r && !(n.Workbook.Sheets[i] && !n.Workbook.Sheets[i].Hidden); ++i);
      i == r && a.push("<Selected/>");
    }
  return (
    ((((n || {}).Workbook || {}).Views || [])[0] || {}).RTL && a.push("<DisplayRightToLeft/>"),
    e["!protect"] &&
      (a.push(Ve("ProtectContents", "True")),
      e["!protect"].objects && a.push(Ve("ProtectObjects", "True")),
      e["!protect"].scenarios && a.push(Ve("ProtectScenarios", "True")),
      e["!protect"].selectLockedCells != null && !e["!protect"].selectLockedCells
        ? a.push(Ve("EnableSelection", "NoSelection"))
        : e["!protect"].selectUnlockedCells != null &&
          !e["!protect"].selectUnlockedCells &&
          a.push(Ve("EnableSelection", "UnlockedCells")),
      [
        ["formatCells", "AllowFormatCells"],
        ["formatColumns", "AllowSizeCols"],
        ["formatRows", "AllowSizeRows"],
        ["insertColumns", "AllowInsertCols"],
        ["insertRows", "AllowInsertRows"],
        ["insertHyperlinks", "AllowInsertHyperlinks"],
        ["deleteColumns", "AllowDeleteCols"],
        ["deleteRows", "AllowDeleteRows"],
        ["sort", "AllowSort"],
        ["autoFilter", "AllowFilter"],
        ["pivotTables", "AllowUsePivotTables"],
      ].forEach(function (s) {
        e["!protect"][s[0]] && a.push("<" + s[1] + "/>");
      })),
    a.length == 0 ? "" : j("WorksheetOptions", a.join(""), { xmlns: ir.x })
  );
}
function au(e) {
  return e
    .map(function (t) {
      var r = ff(t.t || ""),
        n = j("ss:Data", r, { xmlns: "http://www.w3.org/TR/REC-html40" });
      return j("Comment", n, { "ss:Author": t.a });
    })
    .join("");
}
function iu(e, t, r, n, a, i, s) {
  if (!e || (e.v == null && e.f == null)) return "";
  var f = {};
  if ((e.f && (f["ss:Formula"] = "=" + ge(s0(e.f, s))), e.F && e.F.slice(0, t.length) == t)) {
    var o = Me(e.F.slice(t.length + 1));
    f["ss:ArrayRange"] =
      "RC:R" +
      (o.r == s.r ? "" : "[" + (o.r - s.r) + "]") +
      "C" +
      (o.c == s.c ? "" : "[" + (o.c - s.c) + "]");
  }
  if (
    (e.l &&
      e.l.Target &&
      ((f["ss:HRef"] = ge(e.l.Target)), e.l.Tooltip && (f["x:HRefScreenTip"] = ge(e.l.Tooltip))),
    r["!merges"])
  )
    for (var l = r["!merges"], c = 0; c != l.length; ++c)
      l[c].s.c != s.c ||
        l[c].s.r != s.r ||
        (l[c].e.c > l[c].s.c && (f["ss:MergeAcross"] = l[c].e.c - l[c].s.c),
        l[c].e.r > l[c].s.r && (f["ss:MergeDown"] = l[c].e.r - l[c].s.r));
  var p = "",
    x = "";
  switch (e.t) {
    case "z":
      if (!n.sheetStubs) return "";
      break;
    case "n":
      ((p = "Number"), (x = String(e.v)));
      break;
    case "b":
      ((p = "Boolean"), (x = e.v ? "1" : "0"));
      break;
    case "e":
      ((p = "Error"), (x = Ut[e.v]));
      break;
    case "d":
      ((p = "DateTime"), (x = new Date(e.v).toISOString()), e.z == null && (e.z = e.z || Oe[14]));
      break;
    case "s":
      ((p = "String"), (x = sf(e.v || "")));
      break;
  }
  var d = Wr(n.cellXfs, e, n);
  ((f["ss:StyleID"] = "s" + (21 + d)), (f["ss:Index"] = s.c + 1));
  var T = e.v != null ? x : "",
    u = e.t == "z" ? "" : '<Data ss:Type="' + p + '">' + T + "</Data>";
  return ((e.c || []).length > 0 && (u += au(e.c)), j("Cell", u, f));
}
function su(e, t) {
  var r = '<Row ss:Index="' + (e + 1) + '"';
  return (
    t &&
      (t.hpt && !t.hpx && (t.hpx = di(t.hpt)),
      t.hpx && (r += ' ss:AutoFitHeight="0" ss:Height="' + t.hpx + '"'),
      t.hidden && (r += ' ss:Hidden="1"')),
    r + ">"
  );
}
function fu(e, t, r, n) {
  if (!e["!ref"]) return "";
  var a = Se(e["!ref"]),
    i = e["!merges"] || [],
    s = 0,
    f = [];
  e["!cols"] &&
    e["!cols"].forEach(function (g, O) {
      a0(g);
      var D = !!g.width,
        C = Sn(O, g),
        B = { "ss:Index": O + 1 };
      (D && (B["ss:Width"] = hn(C.width)),
        g.hidden && (B["ss:Hidden"] = "1"),
        f.push(j("Column", null, B)));
    });
  for (var o = Array.isArray(e), l = a.s.r; l <= a.e.r; ++l) {
    for (var c = [su(l, (e["!rows"] || [])[l])], p = a.s.c; p <= a.e.c; ++p) {
      var x = !1;
      for (s = 0; s != i.length; ++s)
        if (!(i[s].s.c > p) && !(i[s].s.r > l) && !(i[s].e.c < p) && !(i[s].e.r < l)) {
          (i[s].s.c != p || i[s].s.r != l) && (x = !0);
          break;
        }
      if (!x) {
        var d = { r: l, c: p },
          T = _e(d),
          u = o ? (e[l] || [])[p] : e[T];
        c.push(iu(u, T, e, t, r, n, d));
      }
    }
    (c.push("</Row>"), c.length > 2 && f.push(c.join("")));
  }
  return f.join("");
}
function lu(e, t, r) {
  var n = [],
    a = r.SheetNames[e],
    i = r.Sheets[a],
    s = i ? tu(i, t, e, r) : "";
  return (
    s.length > 0 && n.push("<Names>" + s + "</Names>"),
    (s = i ? fu(i, t, e, r) : ""),
    s.length > 0 && n.push("<Table>" + s + "</Table>"),
    n.push(nu(i, t, e, r)),
    n.join("")
  );
}
function ou(e, t) {
  (t || (t = {}),
    e.SSF || (e.SSF = rr(Oe)),
    e.SSF &&
      (gn(),
      mn(e.SSF),
      (t.revssf = _n(e.SSF)),
      (t.revssf[e.SSF[65535]] = 0),
      (t.ssf = e.SSF),
      (t.cellXfs = []),
      Wr(t.cellXfs, {}, { revssf: { General: 0 } })));
  var r = [];
  (r.push(qh(e, t)), r.push(Qh()), r.push(""), r.push(""));
  for (var n = 0; n < e.SheetNames.length; ++n)
    r.push(j("Worksheet", lu(n, t, e), { "ss:Name": ge(e.SheetNames[n]) }));
  return (
    (r[2] = eu(e, t)),
    (r[3] = ru(e)),
    ke +
      j("Workbook", r.join(""), {
        xmlns: ir.ss,
        "xmlns:o": ir.o,
        "xmlns:x": ir.x,
        "xmlns:ss": ir.ss,
        "xmlns:dt": ir.dt,
        "xmlns:html": ir.html,
      })
  );
}
var Mn = {
  SI: "e0859ff2f94f6810ab9108002b27b3d9",
  DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
  UDI: "05d5cdd59c2e1b10939708002b2cf9ae",
};
function cu(e, t) {
  var r = [],
    n = [],
    a = [],
    i = 0,
    s,
    f = P0(Y0, "n"),
    o = P0($0, "n");
  if (e.Props)
    for (s = Xe(e.Props), i = 0; i < s.length; ++i)
      (Object.prototype.hasOwnProperty.call(f, s[i])
        ? r
        : Object.prototype.hasOwnProperty.call(o, s[i])
          ? n
          : a
      ).push([s[i], e.Props[s[i]]]);
  if (e.Custprops)
    for (s = Xe(e.Custprops), i = 0; i < s.length; ++i)
      Object.prototype.hasOwnProperty.call(e.Props || {}, s[i]) ||
        (Object.prototype.hasOwnProperty.call(f, s[i])
          ? r
          : Object.prototype.hasOwnProperty.call(o, s[i])
            ? n
            : a
        ).push([s[i], e.Custprops[s[i]]]);
  var l = [];
  for (i = 0; i < a.length; ++i)
    ai.indexOf(a[i][0]) > -1 || ri.indexOf(a[i][0]) > -1 || (a[i][1] != null && l.push(a[i]));
  (n.length && Ee.utils.cfb_add(t, "/SummaryInformation", Q0(n, Mn.SI, o, $0)),
    (r.length || l.length) &&
      Ee.utils.cfb_add(
        t,
        "/DocumentSummaryInformation",
        Q0(r, Mn.DSI, f, Y0, l.length ? l : null, Mn.UDI),
      ));
}
function hu(e, t) {
  var r = t || {},
    n = Ee.utils.cfb_new({ root: "R" }),
    a = "/Workbook";
  switch (r.bookType || "xls") {
    case "xls":
      r.bookType = "biff8";
    case "xla":
      r.bookType || (r.bookType = "xla");
    case "biff8":
      ((a = "/Workbook"), (r.biff = 8));
      break;
    case "biff5":
      ((a = "/Book"), (r.biff = 5));
      break;
    default:
      throw new Error("invalid type " + r.bookType + " for XLS CFB");
  }
  return (
    Ee.utils.cfb_add(n, a, Li(e, r)),
    r.biff == 8 && (e.Props || e.Custprops) && cu(e, n),
    r.biff == 8 &&
      e.vbaraw &&
      Do(n, Ee.read(e.vbaraw, { type: typeof e.vbaraw == "string" ? "binary" : "buffer" })),
    n
  );
}
var uu = {
  0: { f: p1 },
  1: { f: S1 },
  2: { f: G1 },
  3: { f: I1 },
  4: { f: C1 },
  5: { f: U1 },
  6: { f: $1 },
  7: { f: L1 },
  8: { f: rh },
  9: { f: eh },
  10: { f: q1 },
  11: { f: Q1 },
  12: { f: F1 },
  13: { f: z1 },
  14: { f: N1 },
  15: { f: D1 },
  16: { f: H1 },
  17: { f: J1 },
  18: { f: B1 },
  19: { f: e0 },
  20: {},
  21: {},
  22: {},
  23: {},
  24: {},
  25: {},
  26: {},
  27: {},
  28: {},
  29: {},
  30: {},
  31: {},
  32: {},
  33: {},
  34: {},
  35: { T: 1 },
  36: { T: -1 },
  37: { T: 1 },
  38: { T: -1 },
  39: { f: Wh },
  40: {},
  42: {},
  43: { f: Yl },
  44: { f: zl },
  45: { f: Jl },
  46: { f: ql },
  47: { f: Zl },
  48: {},
  49: { f: Af },
  50: {},
  51: { f: po },
  52: { T: 1 },
  53: { T: -1 },
  54: { T: 1 },
  55: { T: -1 },
  56: { T: 1 },
  57: { T: -1 },
  58: {},
  59: {},
  60: { f: Fl },
  62: { f: Y1 },
  63: { f: Eo },
  64: { f: mh },
  65: {},
  66: {},
  67: {},
  68: {},
  69: {},
  70: {},
  128: {},
  129: { T: 1 },
  130: { T: -1 },
  131: { T: 1, f: Sr, p: 0 },
  132: { T: -1 },
  133: { T: 1 },
  134: { T: -1 },
  135: { T: 1 },
  136: { T: -1 },
  137: { T: 1, f: xh },
  138: { T: -1 },
  139: { T: 1 },
  140: { T: -1 },
  141: { T: 1 },
  142: { T: -1 },
  143: { T: 1 },
  144: { T: -1 },
  145: { T: 1 },
  146: { T: -1 },
  147: { f: E1 },
  148: { f: g1, p: 16 },
  151: { f: fh },
  152: {},
  153: { f: bh },
  154: {},
  155: {},
  156: { f: Mh },
  157: {},
  158: {},
  159: { T: 1, f: Ll },
  160: { T: -1 },
  161: { T: 1, f: et },
  162: { T: -1 },
  163: { T: 1 },
  164: { T: -1 },
  165: { T: 1 },
  166: { T: -1 },
  167: {},
  168: {},
  169: {},
  170: {},
  171: {},
  172: { T: 1 },
  173: { T: -1 },
  174: {},
  175: {},
  176: { f: th },
  177: { T: 1 },
  178: { T: -1 },
  179: { T: 1 },
  180: { T: -1 },
  181: { T: 1 },
  182: { T: -1 },
  183: { T: 1 },
  184: { T: -1 },
  185: { T: 1 },
  186: { T: -1 },
  187: { T: 1 },
  188: { T: -1 },
  189: { T: 1 },
  190: { T: -1 },
  191: { T: 1 },
  192: { T: -1 },
  193: { T: 1 },
  194: { T: -1 },
  195: { T: 1 },
  196: { T: -1 },
  197: { T: 1 },
  198: { T: -1 },
  199: { T: 1 },
  200: { T: -1 },
  201: { T: 1 },
  202: { T: -1 },
  203: { T: 1 },
  204: { T: -1 },
  205: { T: 1 },
  206: { T: -1 },
  207: { T: 1 },
  208: { T: -1 },
  209: { T: 1 },
  210: { T: -1 },
  211: { T: 1 },
  212: { T: -1 },
  213: { T: 1 },
  214: { T: -1 },
  215: { T: 1 },
  216: { T: -1 },
  217: { T: 1 },
  218: { T: -1 },
  219: { T: 1 },
  220: { T: -1 },
  221: { T: 1 },
  222: { T: -1 },
  223: { T: 1 },
  224: { T: -1 },
  225: { T: 1 },
  226: { T: -1 },
  227: { T: 1 },
  228: { T: -1 },
  229: { T: 1 },
  230: { T: -1 },
  231: { T: 1 },
  232: { T: -1 },
  233: { T: 1 },
  234: { T: -1 },
  235: { T: 1 },
  236: { T: -1 },
  237: { T: 1 },
  238: { T: -1 },
  239: { T: 1 },
  240: { T: -1 },
  241: { T: 1 },
  242: { T: -1 },
  243: { T: 1 },
  244: { T: -1 },
  245: { T: 1 },
  246: { T: -1 },
  247: { T: 1 },
  248: { T: -1 },
  249: { T: 1 },
  250: { T: -1 },
  251: { T: 1 },
  252: { T: -1 },
  253: { T: 1 },
  254: { T: -1 },
  255: { T: 1 },
  256: { T: -1 },
  257: { T: 1 },
  258: { T: -1 },
  259: { T: 1 },
  260: { T: -1 },
  261: { T: 1 },
  262: { T: -1 },
  263: { T: 1 },
  264: { T: -1 },
  265: { T: 1 },
  266: { T: -1 },
  267: { T: 1 },
  268: { T: -1 },
  269: { T: 1 },
  270: { T: -1 },
  271: { T: 1 },
  272: { T: -1 },
  273: { T: 1 },
  274: { T: -1 },
  275: { T: 1 },
  276: { T: -1 },
  277: {},
  278: { T: 1 },
  279: { T: -1 },
  280: { T: 1 },
  281: { T: -1 },
  282: { T: 1 },
  283: { T: 1 },
  284: { T: -1 },
  285: { T: 1 },
  286: { T: -1 },
  287: { T: 1 },
  288: { T: -1 },
  289: { T: 1 },
  290: { T: -1 },
  291: { T: 1 },
  292: { T: -1 },
  293: { T: 1 },
  294: { T: -1 },
  295: { T: 1 },
  296: { T: -1 },
  297: { T: 1 },
  298: { T: -1 },
  299: { T: 1 },
  300: { T: -1 },
  301: { T: 1 },
  302: { T: -1 },
  303: { T: 1 },
  304: { T: -1 },
  305: { T: 1 },
  306: { T: -1 },
  307: { T: 1 },
  308: { T: -1 },
  309: { T: 1 },
  310: { T: -1 },
  311: { T: 1 },
  312: { T: -1 },
  313: { T: -1 },
  314: { T: 1 },
  315: { T: -1 },
  316: { T: 1 },
  317: { T: -1 },
  318: { T: 1 },
  319: { T: -1 },
  320: { T: 1 },
  321: { T: -1 },
  322: { T: 1 },
  323: { T: -1 },
  324: { T: 1 },
  325: { T: -1 },
  326: { T: 1 },
  327: { T: -1 },
  328: { T: 1 },
  329: { T: -1 },
  330: { T: 1 },
  331: { T: -1 },
  332: { T: 1 },
  333: { T: -1 },
  334: { T: 1 },
  335: { f: uo },
  336: { T: -1 },
  337: { f: go, T: 1 },
  338: { T: -1 },
  339: { T: 1 },
  340: { T: -1 },
  341: { T: 1 },
  342: { T: -1 },
  343: { T: 1 },
  344: { T: -1 },
  345: { T: 1 },
  346: { T: -1 },
  347: { T: 1 },
  348: { T: -1 },
  349: { T: 1 },
  350: { T: -1 },
  351: {},
  352: {},
  353: { T: 1 },
  354: { T: -1 },
  355: { f: Vn },
  357: {},
  358: {},
  359: {},
  360: { T: 1 },
  361: {},
  362: { f: _l },
  363: {},
  364: {},
  366: {},
  367: {},
  368: {},
  369: {},
  370: {},
  371: {},
  372: { T: 1 },
  373: { T: -1 },
  374: { T: 1 },
  375: { T: -1 },
  376: { T: 1 },
  377: { T: -1 },
  378: { T: 1 },
  379: { T: -1 },
  380: { T: 1 },
  381: { T: -1 },
  382: { T: 1 },
  383: { T: -1 },
  384: { T: 1 },
  385: { T: -1 },
  386: { T: 1 },
  387: { T: -1 },
  388: { T: 1 },
  389: { T: -1 },
  390: { T: 1 },
  391: { T: -1 },
  392: { T: 1 },
  393: { T: -1 },
  394: { T: 1 },
  395: { T: -1 },
  396: {},
  397: {},
  398: {},
  399: {},
  400: {},
  401: { T: 1 },
  403: {},
  404: {},
  405: {},
  406: {},
  407: {},
  408: {},
  409: {},
  410: {},
  411: {},
  412: {},
  413: {},
  414: {},
  415: {},
  416: {},
  417: {},
  418: {},
  419: {},
  420: {},
  421: {},
  422: { T: 1 },
  423: { T: 1 },
  424: { T: -1 },
  425: { T: -1 },
  426: { f: lh },
  427: { f: oh },
  428: {},
  429: { T: 1 },
  430: { T: -1 },
  431: { T: 1 },
  432: { T: -1 },
  433: { T: 1 },
  434: { T: -1 },
  435: { T: 1 },
  436: { T: -1 },
  437: { T: 1 },
  438: { T: -1 },
  439: { T: 1 },
  440: { T: -1 },
  441: { T: 1 },
  442: { T: -1 },
  443: { T: 1 },
  444: { T: -1 },
  445: { T: 1 },
  446: { T: -1 },
  447: { T: 1 },
  448: { T: -1 },
  449: { T: 1 },
  450: { T: -1 },
  451: { T: 1 },
  452: { T: -1 },
  453: { T: 1 },
  454: { T: -1 },
  455: { T: 1 },
  456: { T: -1 },
  457: { T: 1 },
  458: { T: -1 },
  459: { T: 1 },
  460: { T: -1 },
  461: { T: 1 },
  462: { T: -1 },
  463: { T: 1 },
  464: { T: -1 },
  465: { T: 1 },
  466: { T: -1 },
  467: { T: 1 },
  468: { T: -1 },
  469: { T: 1 },
  470: { T: -1 },
  471: {},
  472: {},
  473: { T: 1 },
  474: { T: -1 },
  475: {},
  476: { f: hh },
  477: {},
  478: {},
  479: { T: 1 },
  480: { T: -1 },
  481: { T: 1 },
  482: { T: -1 },
  483: { T: 1 },
  484: { T: -1 },
  485: { f: T1 },
  486: { T: 1 },
  487: { T: -1 },
  488: { T: 1 },
  489: { T: -1 },
  490: { T: 1 },
  491: { T: -1 },
  492: { T: 1 },
  493: { T: -1 },
  494: { f: ih },
  495: { T: 1 },
  496: { T: -1 },
  497: { T: 1 },
  498: { T: -1 },
  499: {},
  500: { T: 1 },
  501: { T: -1 },
  502: { T: 1 },
  503: { T: -1 },
  504: {},
  505: { T: 1 },
  506: { T: -1 },
  507: {},
  508: { T: 1 },
  509: { T: -1 },
  510: { T: 1 },
  511: { T: -1 },
  512: {},
  513: {},
  514: { T: 1 },
  515: { T: -1 },
  516: { T: 1 },
  517: { T: -1 },
  518: { T: 1 },
  519: { T: -1 },
  520: { T: 1 },
  521: { T: -1 },
  522: {},
  523: {},
  524: {},
  525: {},
  526: {},
  527: {},
  528: { T: 1 },
  529: { T: -1 },
  530: { T: 1 },
  531: { T: -1 },
  532: { T: 1 },
  533: { T: -1 },
  534: {},
  535: {},
  536: {},
  537: {},
  538: { T: 1 },
  539: { T: -1 },
  540: { T: 1 },
  541: { T: -1 },
  542: { T: 1 },
  548: {},
  549: {},
  550: { f: Vn },
  551: {},
  552: {},
  553: {},
  554: { T: 1 },
  555: { T: -1 },
  556: { T: 1 },
  557: { T: -1 },
  558: { T: 1 },
  559: { T: -1 },
  560: { T: 1 },
  561: { T: -1 },
  562: {},
  564: {},
  565: { T: 1 },
  566: { T: -1 },
  569: { T: 1 },
  570: { T: -1 },
  572: {},
  573: { T: 1 },
  574: { T: -1 },
  577: {},
  578: {},
  579: {},
  580: {},
  581: {},
  582: {},
  583: {},
  584: {},
  585: {},
  586: {},
  587: {},
  588: { T: -1 },
  589: {},
  590: { T: 1 },
  591: { T: -1 },
  592: { T: 1 },
  593: { T: -1 },
  594: { T: 1 },
  595: { T: -1 },
  596: {},
  597: { T: 1 },
  598: { T: -1 },
  599: { T: 1 },
  600: { T: -1 },
  601: { T: 1 },
  602: { T: -1 },
  603: { T: 1 },
  604: { T: -1 },
  605: { T: 1 },
  606: { T: -1 },
  607: {},
  608: { T: 1 },
  609: { T: -1 },
  610: {},
  611: { T: 1 },
  612: { T: -1 },
  613: { T: 1 },
  614: { T: -1 },
  615: { T: 1 },
  616: { T: -1 },
  617: { T: 1 },
  618: { T: -1 },
  619: { T: 1 },
  620: { T: -1 },
  625: {},
  626: { T: 1 },
  627: { T: -1 },
  628: { T: 1 },
  629: { T: -1 },
  630: { T: 1 },
  631: { T: -1 },
  632: { f: yo },
  633: { T: 1 },
  634: { T: -1 },
  635: { T: 1, f: Ao },
  636: { T: -1 },
  637: { f: Of },
  638: { T: 1 },
  639: {},
  640: { T: -1 },
  641: { T: 1 },
  642: { T: -1 },
  643: { T: 1 },
  644: {},
  645: { T: -1 },
  646: { T: 1 },
  648: { T: 1 },
  649: {},
  650: { T: -1 },
  651: { f: Rh },
  652: {},
  653: { T: 1 },
  654: { T: -1 },
  655: { T: 1 },
  656: { T: -1 },
  657: { T: 1 },
  658: { T: -1 },
  659: {},
  660: { T: 1 },
  661: {},
  662: { T: -1 },
  663: {},
  664: { T: 1 },
  665: {},
  666: { T: -1 },
  667: {},
  668: {},
  669: {},
  671: { T: 1 },
  672: { T: -1 },
  673: { T: 1 },
  674: { T: -1 },
  675: {},
  676: {},
  677: {},
  678: {},
  679: {},
  680: {},
  681: {},
  1024: {},
  1025: {},
  1026: { T: 1 },
  1027: { T: -1 },
  1028: { T: 1 },
  1029: { T: -1 },
  1030: {},
  1031: { T: 1 },
  1032: { T: -1 },
  1033: { T: 1 },
  1034: { T: -1 },
  1035: {},
  1036: {},
  1037: {},
  1038: { T: 1 },
  1039: { T: -1 },
  1040: {},
  1041: { T: 1 },
  1042: { T: -1 },
  1043: {},
  1044: {},
  1045: {},
  1046: { T: 1 },
  1047: { T: -1 },
  1048: { T: 1 },
  1049: { T: -1 },
  1050: {},
  1051: { T: 1 },
  1052: { T: 1 },
  1053: { f: gh },
  1054: { T: 1 },
  1055: {},
  1056: { T: 1 },
  1057: { T: -1 },
  1058: { T: 1 },
  1059: { T: -1 },
  1061: {},
  1062: { T: 1 },
  1063: { T: -1 },
  1064: { T: 1 },
  1065: { T: -1 },
  1066: { T: 1 },
  1067: { T: -1 },
  1068: { T: 1 },
  1069: { T: -1 },
  1070: { T: 1 },
  1071: { T: -1 },
  1072: { T: 1 },
  1073: { T: -1 },
  1075: { T: 1 },
  1076: { T: -1 },
  1077: { T: 1 },
  1078: { T: -1 },
  1079: { T: 1 },
  1080: { T: -1 },
  1081: { T: 1 },
  1082: { T: -1 },
  1083: { T: 1 },
  1084: { T: -1 },
  1085: {},
  1086: { T: 1 },
  1087: { T: -1 },
  1088: { T: 1 },
  1089: { T: -1 },
  1090: { T: 1 },
  1091: { T: -1 },
  1092: { T: 1 },
  1093: { T: -1 },
  1094: { T: 1 },
  1095: { T: -1 },
  1096: {},
  1097: { T: 1 },
  1098: {},
  1099: { T: -1 },
  1100: { T: 1 },
  1101: { T: -1 },
  1102: {},
  1103: {},
  1104: {},
  1105: {},
  1111: {},
  1112: {},
  1113: { T: 1 },
  1114: { T: -1 },
  1115: { T: 1 },
  1116: { T: -1 },
  1117: {},
  1118: { T: 1 },
  1119: { T: -1 },
  1120: { T: 1 },
  1121: { T: -1 },
  1122: { T: 1 },
  1123: { T: -1 },
  1124: { T: 1 },
  1125: { T: -1 },
  1126: {},
  1128: { T: 1 },
  1129: { T: -1 },
  1130: {},
  1131: { T: 1 },
  1132: { T: -1 },
  1133: { T: 1 },
  1134: { T: -1 },
  1135: { T: 1 },
  1136: { T: -1 },
  1137: { T: 1 },
  1138: { T: -1 },
  1139: { T: 1 },
  1140: { T: -1 },
  1141: {},
  1142: { T: 1 },
  1143: { T: -1 },
  1144: { T: 1 },
  1145: { T: -1 },
  1146: {},
  1147: { T: 1 },
  1148: { T: -1 },
  1149: { T: 1 },
  1150: { T: -1 },
  1152: { T: 1 },
  1153: { T: -1 },
  1154: { T: -1 },
  1155: { T: -1 },
  1156: { T: -1 },
  1157: { T: 1 },
  1158: { T: -1 },
  1159: { T: 1 },
  1160: { T: -1 },
  1161: { T: 1 },
  1162: { T: -1 },
  1163: { T: 1 },
  1164: { T: -1 },
  1165: { T: 1 },
  1166: { T: -1 },
  1167: { T: 1 },
  1168: { T: -1 },
  1169: { T: 1 },
  1170: { T: -1 },
  1171: {},
  1172: { T: 1 },
  1173: { T: -1 },
  1177: {},
  1178: { T: 1 },
  1180: {},
  1181: {},
  1182: {},
  2048: { T: 1 },
  2049: { T: -1 },
  2050: {},
  2051: { T: 1 },
  2052: { T: -1 },
  2053: {},
  2054: {},
  2055: { T: 1 },
  2056: { T: -1 },
  2057: { T: 1 },
  2058: { T: -1 },
  2060: {},
  2067: {},
  2068: { T: 1 },
  2069: { T: -1 },
  2070: {},
  2071: {},
  2072: { T: 1 },
  2073: { T: -1 },
  2075: {},
  2076: {},
  2077: { T: 1 },
  2078: { T: -1 },
  2079: {},
  2080: { T: 1 },
  2081: { T: -1 },
  2082: {},
  2083: { T: 1 },
  2084: { T: -1 },
  2085: { T: 1 },
  2086: { T: -1 },
  2087: { T: 1 },
  2088: { T: -1 },
  2089: { T: 1 },
  2090: { T: -1 },
  2091: {},
  2092: {},
  2093: { T: 1 },
  2094: { T: -1 },
  2095: {},
  2096: { T: 1 },
  2097: { T: -1 },
  2098: { T: 1 },
  2099: { T: -1 },
  2100: { T: 1 },
  2101: { T: -1 },
  2102: {},
  2103: { T: 1 },
  2104: { T: -1 },
  2105: {},
  2106: { T: 1 },
  2107: { T: -1 },
  2108: {},
  2109: { T: 1 },
  2110: { T: -1 },
  2111: { T: 1 },
  2112: { T: -1 },
  2113: { T: 1 },
  2114: { T: -1 },
  2115: {},
  2116: {},
  2117: {},
  2118: { T: 1 },
  2119: { T: -1 },
  2120: {},
  2121: { T: 1 },
  2122: { T: -1 },
  2123: { T: 1 },
  2124: { T: -1 },
  2125: {},
  2126: { T: 1 },
  2127: { T: -1 },
  2128: {},
  2129: { T: 1 },
  2130: { T: -1 },
  2131: { T: 1 },
  2132: { T: -1 },
  2133: { T: 1 },
  2134: {},
  2135: {},
  2136: {},
  2137: { T: 1 },
  2138: { T: -1 },
  2139: { T: 1 },
  2140: { T: -1 },
  2141: {},
  3072: {},
  3073: {},
  4096: { T: 1 },
  4097: { T: -1 },
  5002: { T: 1 },
  5003: { T: -1 },
  5081: { T: 1 },
  5082: { T: -1 },
  5083: {},
  5084: { T: 1 },
  5085: { T: -1 },
  5086: { T: 1 },
  5087: { T: -1 },
  5088: {},
  5089: {},
  5090: {},
  5092: { T: 1 },
  5093: { T: -1 },
  5094: {},
  5095: { T: 1 },
  5096: { T: -1 },
  5097: {},
  5099: {},
  65535: { n: "" },
};
function J(e, t, r, n) {
  var a = t;
  if (!isNaN(a)) {
    var i = n || (r || []).length || 0,
      s = e.next(4);
    (s.write_shift(2, a), s.write_shift(2, i), i > 0 && Zn(r) && e.push(r));
  }
}
function xu(e, t, r, n) {
  var a = (r || []).length || 0;
  if (a <= 8224) return J(e, t, r, a);
  var i = t;
  if (!isNaN(i)) {
    for (var s = r.parts || [], f = 0, o = 0, l = 0; l + (s[f] || 8224) <= 8224; )
      ((l += s[f] || 8224), f++);
    var c = e.next(4);
    for (c.write_shift(2, i), c.write_shift(2, l), e.push(r.slice(o, o + l)), o += l; o < a; ) {
      for (c = e.next(4), c.write_shift(2, 60), l = 0; l + (s[f] || 8224) <= 8224; )
        ((l += s[f] || 8224), f++);
      (c.write_shift(2, l), e.push(r.slice(o, o + l)), (o += l));
    }
  }
}
function Ht(e, t, r) {
  return (
    e || (e = b(7)),
    e.write_shift(2, t),
    e.write_shift(2, r),
    e.write_shift(2, 0),
    e.write_shift(1, 0),
    e
  );
}
function du(e, t, r, n) {
  var a = b(9);
  return (Ht(a, e, t), si(r, n || "b", a), a);
}
function pu(e, t, r) {
  var n = b(8 + 2 * r.length);
  return (
    Ht(n, e, t),
    n.write_shift(1, r.length),
    n.write_shift(r.length, r, "sbcs"),
    n.l < n.length ? n.slice(0, n.l) : n
  );
}
function vu(e, t, r, n) {
  if (t.v != null)
    switch (t.t) {
      case "d":
      case "n":
        var a = t.t == "d" ? er(Ze(t.v)) : t.v;
        a == (a | 0) && a >= 0 && a < 65536 ? J(e, 2, Dl(r, n, a)) : J(e, 3, Ol(r, n, a));
        return;
      case "b":
      case "e":
        J(e, 5, du(r, n, t.v, t.t));
        return;
      case "s":
      case "str":
        J(e, 4, pu(r, n, (t.v || "").slice(0, 255)));
        return;
    }
  J(e, 1, Ht(null, r, n));
}
function mu(e, t, r, n) {
  var a = Array.isArray(t),
    i = Se(t["!ref"] || "A1"),
    s,
    f = "",
    o = [];
  if (i.e.c > 255 || i.e.r > 16383) {
    if (n.WTF) throw new Error("Range " + (t["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    ((i.e.c = Math.min(i.e.c, 255)), (i.e.r = Math.min(i.e.c, 16383)), (s = Ie(i)));
  }
  for (var l = i.s.r; l <= i.e.r; ++l) {
    f = Ge(l);
    for (var c = i.s.c; c <= i.e.c; ++c) {
      (l === i.s.r && (o[c] = Ke(c)), (s = o[c] + f));
      var p = a ? (t[l] || [])[c] : t[s];
      p && vu(e, p, l, c);
    }
  }
}
function gu(e, t) {
  for (var r = t || {}, n = Qe(), a = 0, i = 0; i < e.SheetNames.length; ++i)
    e.SheetNames[i] == r.sheet && (a = i);
  if (a == 0 && r.sheet && e.SheetNames[0] != r.sheet)
    throw new Error("Sheet not found: " + r.sheet);
  return (
    J(n, r.biff == 4 ? 1033 : r.biff == 3 ? 521 : 9, n0(e, 16, r)),
    mu(n, e.Sheets[e.SheetNames[a]], a, r),
    J(n, 10),
    n.end()
  );
}
function _u(e, t, r) {
  J(e, 49, hl({ sz: 12, name: "Arial" }, r));
}
function Tu(e, t, r) {
  t &&
    [
      [5, 8],
      [23, 26],
      [41, 44],
      [50, 392],
    ].forEach(function (n) {
      for (var a = n[0]; a <= n[1]; ++a) t[a] != null && J(e, 1054, dl(a, t[a], r));
    });
}
function Eu(e, t) {
  var r = b(19);
  (r.write_shift(4, 2151),
    r.write_shift(4, 0),
    r.write_shift(4, 0),
    r.write_shift(2, 3),
    r.write_shift(1, 1),
    r.write_shift(4, 0),
    J(e, 2151, r),
    (r = b(39)),
    r.write_shift(4, 2152),
    r.write_shift(4, 0),
    r.write_shift(4, 0),
    r.write_shift(2, 3),
    r.write_shift(1, 0),
    r.write_shift(4, 0),
    r.write_shift(2, 1),
    r.write_shift(4, 4),
    r.write_shift(2, 0),
    oi(Se(t["!ref"] || "A1"), r),
    r.write_shift(4, 4),
    J(e, 2152, r));
}
function wu(e, t) {
  for (var r = 0; r < 16; ++r) J(e, 224, ra({ numFmtId: 0, style: !0 }, 0, t));
  t.cellXfs.forEach(function (n) {
    J(e, 224, ra(n, 0, t));
  });
}
function Su(e, t) {
  for (var r = 0; r < t["!links"].length; ++r) {
    var n = t["!links"][r];
    (J(e, 440, wl(n)), n[1].Tooltip && J(e, 2048, Sl(n)));
  }
  delete t["!links"];
}
function Au(e, t) {
  if (t) {
    var r = 0;
    t.forEach(function (n, a) {
      ++r <= 256 && n && J(e, 125, yl(Sn(a, n), a));
    });
  }
}
function Fu(e, t, r, n, a) {
  var i = 16 + Wr(a.cellXfs, t, a);
  if (t.v == null && !t.bf) {
    J(e, 513, jr(r, n, i));
    return;
  }
  if (t.bf) J(e, 6, jc(t, r, n, a, i));
  else
    switch (t.t) {
      case "d":
      case "n":
        var s = t.t == "d" ? er(Ze(t.v)) : t.v;
        J(e, 515, gl(r, n, s, i));
        break;
      case "b":
      case "e":
        J(e, 517, ml(r, n, t.v, i, a, t.t));
        break;
      case "s":
      case "str":
        if (a.bookSST) {
          var f = l0(a.Strings, t.v, a.revStrings);
          J(e, 253, ul(r, n, f, i));
        } else J(e, 516, xl(r, n, (t.v || "").slice(0, 255), i, a));
        break;
      default:
        J(e, 513, jr(r, n, i));
    }
}
function yu(e, t, r) {
  var n = Qe(),
    a = r.SheetNames[e],
    i = r.Sheets[a] || {},
    s = (r || {}).Workbook || {},
    f = (s.Sheets || [])[e] || {},
    o = Array.isArray(i),
    l = t.biff == 8,
    c,
    p = "",
    x = [],
    d = Se(i["!ref"] || "A1"),
    T = l ? 65536 : 16384;
  if (d.e.c > 255 || d.e.r >= T) {
    if (t.WTF) throw new Error("Range " + (i["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    ((d.e.c = Math.min(d.e.c, 255)), (d.e.r = Math.min(d.e.c, T - 1)));
  }
  (J(n, 2057, n0(r, 16, t)),
    J(n, 13, ur(1)),
    J(n, 12, ur(100)),
    J(n, 15, Je(!0)),
    J(n, 17, Je(!1)),
    J(n, 16, $r(0.001)),
    J(n, 95, Je(!0)),
    J(n, 42, Je(!1)),
    J(n, 43, Je(!1)),
    J(n, 130, ur(1)),
    J(n, 128, vl()),
    J(n, 131, Je(!1)),
    J(n, 132, Je(!1)),
    l && Au(n, i["!cols"]),
    J(n, 512, pl(d, t)),
    l && (i["!links"] = []));
  for (var u = d.s.r; u <= d.e.r; ++u) {
    p = Ge(u);
    for (var g = d.s.c; g <= d.e.c; ++g) {
      (u === d.s.r && (x[g] = Ke(g)), (c = x[g] + p));
      var O = o ? (i[u] || [])[g] : i[c];
      O && (Fu(n, O, u, g, t), l && O.l && i["!links"].push([c, O.l]));
    }
  }
  var D = f.CodeName || f.name || a;
  return (
    l && J(n, 574, cl((s.Views || [])[0])),
    l && (i["!merges"] || []).length && J(n, 229, El(i["!merges"])),
    l && Su(n, i),
    J(n, 442, li(D)),
    l && Eu(n, i),
    J(n, 10),
    n.end()
  );
}
function Cu(e, t, r) {
  var n = Qe(),
    a = (e || {}).Workbook || {},
    i = a.Sheets || [],
    s = a.WBProps || {},
    f = r.biff == 8,
    o = r.biff == 5;
  if (
    (J(n, 2057, n0(e, 5, r)),
    r.bookType == "xla" && J(n, 135),
    J(n, 225, f ? ur(1200) : null),
    J(n, 193, Zf(2)),
    o && J(n, 191),
    o && J(n, 192),
    J(n, 226),
    J(n, 92, sl("SheetJS", r)),
    J(n, 66, ur(f ? 1200 : 1252)),
    f && J(n, 353, ur(0)),
    f && J(n, 448),
    J(n, 317, Cl(e.SheetNames.length)),
    f && e.vbaraw && J(n, 211),
    f && e.vbaraw)
  ) {
    var l = s.CodeName || "ThisWorkbook";
    J(n, 442, li(l));
  }
  (J(n, 156, ur(17)),
    J(n, 25, Je(!1)),
    J(n, 18, Je(!1)),
    J(n, 19, ur(0)),
    f && J(n, 431, Je(!1)),
    f && J(n, 444, ur(0)),
    J(n, 61, ol()),
    J(n, 64, Je(!1)),
    J(n, 141, ur(0)),
    J(n, 34, Je(kh(e) == "true")),
    J(n, 14, Je(!0)),
    f && J(n, 439, Je(!1)),
    J(n, 218, ur(0)),
    _u(n, e, r),
    Tu(n, e.SSF, r),
    wu(n, r),
    f && J(n, 352, Je(!1)));
  var c = n.end(),
    p = Qe();
  (f && J(p, 140, Al()), f && r.Strings && xu(p, 252, ll(r.Strings)), J(p, 10));
  var x = p.end(),
    d = Qe(),
    T = 0,
    u = 0;
  for (u = 0; u < e.SheetNames.length; ++u)
    T += (f ? 12 : 11) + (f ? 2 : 1) * e.SheetNames[u].length;
  var g = c.length + T + x.length;
  for (u = 0; u < e.SheetNames.length; ++u) {
    var O = i[u] || {};
    (J(d, 133, fl({ pos: g, hs: O.Hidden || 0, dt: 0, name: e.SheetNames[u] }, r)),
      (g += t[u].length));
  }
  var D = d.end();
  if (T != D.length) throw new Error("BS8 " + T + " != " + D.length);
  var C = [];
  return (c.length && C.push(c), D.length && C.push(D), x.length && C.push(x), He(C));
}
function Ou(e, t) {
  var r = t || {},
    n = [];
  (e && !e.SSF && (e.SSF = rr(Oe)),
    e &&
      e.SSF &&
      (gn(), mn(e.SSF), (r.revssf = _n(e.SSF)), (r.revssf[e.SSF[65535]] = 0), (r.ssf = e.SSF)),
    (r.Strings = []),
    (r.Strings.Count = 0),
    (r.Strings.Unique = 0),
    o0(r),
    (r.cellXfs = []),
    Wr(r.cellXfs, {}, { revssf: { General: 0 } }),
    e.Props || (e.Props = {}));
  for (var a = 0; a < e.SheetNames.length; ++a) n[n.length] = yu(a, r, e);
  return (n.unshift(Cu(e, n, r)), He(n));
}
function Li(e, t) {
  for (var r = 0; r <= e.SheetNames.length; ++r) {
    var n = e.Sheets[e.SheetNames[r]];
    if (!(!n || !n["!ref"])) {
      var a = fr(n["!ref"]);
      a.e.c > 255 &&
        typeof console < "u" &&
        console.error &&
        console.error(
          "Worksheet '" + e.SheetNames[r] + "' extends beyond column IV (255).  Data may be lost.",
        );
    }
  }
  var i = t || {};
  switch (i.biff || 2) {
    case 8:
    case 5:
      return Ou(e, t);
    case 4:
    case 3:
    case 2:
      return gu(e, t);
  }
  throw new Error("invalid type " + i.bookType + " for BIFF");
}
function Du(e, t, r, n) {
  for (var a = e["!merges"] || [], i = [], s = t.s.c; s <= t.e.c; ++s) {
    for (var f = 0, o = 0, l = 0; l < a.length; ++l)
      if (!(a[l].s.r > r || a[l].s.c > s) && !(a[l].e.r < r || a[l].e.c < s)) {
        if (a[l].s.r < r || a[l].s.c < s) {
          f = -1;
          break;
        }
        ((f = a[l].e.r - a[l].s.r + 1), (o = a[l].e.c - a[l].s.c + 1));
        break;
      }
    if (!(f < 0)) {
      var c = _e({ r, c: s }),
        p = n.dense ? (e[r] || [])[s] : e[c],
        x = (p && p.v != null && (p.h || af(p.w || (kr(p), p.w) || ""))) || "",
        d = {};
      (f > 1 && (d.rowspan = f),
        o > 1 && (d.colspan = o),
        n.editable
          ? (x = '<span contenteditable="true">' + x + "</span>")
          : p &&
            ((d["data-t"] = (p && p.t) || "z"),
            p.v != null && (d["data-v"] = p.v),
            p.z != null && (d["data-z"] = p.z),
            p.l &&
              (p.l.Target || "#").charAt(0) != "#" &&
              (x = '<a href="' + p.l.Target + '">' + x + "</a>")),
        (d.id = (n.id || "sjs") + "-" + c),
        i.push(j("td", x, d)));
    }
  }
  var T = "<tr>";
  return T + i.join("") + "</tr>";
}
var Ru = '<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body>',
  Iu = "</body></html>";
function ku(e, t, r) {
  var n = [];
  return n.join("") + "<table" + (r && r.id ? ' id="' + r.id + '"' : "") + ">";
}
function Mi(e, t) {
  var r = t || {},
    n = r.header != null ? r.header : Ru,
    a = r.footer != null ? r.footer : Iu,
    i = [n],
    s = fr(e["!ref"]);
  ((r.dense = Array.isArray(e)), i.push(ku(e, s, r)));
  for (var f = s.s.r; f <= s.e.r; ++f) i.push(Du(e, s, f, r));
  return (i.push("</table>" + a), i.join(""));
}
function Bi(e, t, r) {
  var n = r || {},
    a = 0,
    i = 0;
  if (n.origin != null)
    if (typeof n.origin == "number") a = n.origin;
    else {
      var s = typeof n.origin == "string" ? Me(n.origin) : n.origin;
      ((a = s.r), (i = s.c));
    }
  var f = t.getElementsByTagName("tr"),
    o = Math.min(n.sheetRows || 1e7, f.length),
    l = { s: { r: 0, c: 0 }, e: { r: a, c: i } };
  if (e["!ref"]) {
    var c = fr(e["!ref"]);
    ((l.s.r = Math.min(l.s.r, c.s.r)),
      (l.s.c = Math.min(l.s.c, c.s.c)),
      (l.e.r = Math.max(l.e.r, c.e.r)),
      (l.e.c = Math.max(l.e.c, c.e.c)),
      a == -1 && (l.e.r = a = c.e.r + 1));
  }
  var p = [],
    x = 0,
    d = e["!rows"] || (e["!rows"] = []),
    T = 0,
    u = 0,
    g = 0,
    O = 0,
    D = 0,
    C = 0;
  for (e["!cols"] || (e["!cols"] = []); T < f.length && u < o; ++T) {
    var B = f[T];
    if (la(B)) {
      if (n.display) continue;
      d[u] = { hidden: !0 };
    }
    var K = B.children;
    for (g = O = 0; g < K.length; ++g) {
      var q = K[g];
      if (!(n.display && la(q))) {
        var F = q.hasAttribute("data-v")
            ? q.getAttribute("data-v")
            : q.hasAttribute("v")
              ? q.getAttribute("v")
              : of(q.innerHTML),
          L = q.getAttribute("data-z") || q.getAttribute("z");
        for (x = 0; x < p.length; ++x) {
          var N = p[x];
          N.s.c == O + i && N.s.r < u + a && u + a <= N.e.r && ((O = N.e.c + 1 - i), (x = -1));
        }
        ((C = +q.getAttribute("colspan") || 1),
          ((D = +q.getAttribute("rowspan") || 1) > 1 || C > 1) &&
            p.push({
              s: { r: u + a, c: O + i },
              e: { r: u + a + (D || 1) - 1, c: O + i + (C || 1) - 1 },
            }));
        var V = { t: "s", v: F },
          U = q.getAttribute("data-t") || q.getAttribute("t") || "";
        (F != null &&
          (F.length == 0
            ? (V.t = U || "z")
            : n.raw ||
              F.trim().length == 0 ||
              U == "s" ||
              (F === "TRUE"
                ? (V = { t: "b", v: !0 })
                : F === "FALSE"
                  ? (V = { t: "b", v: !1 })
                  : isNaN(Dr(F))
                    ? isNaN(It(F).getDate()) ||
                      ((V = { t: "d", v: Ze(F) }),
                      n.cellDates || (V = { t: "n", v: er(V.v) }),
                      (V.z = n.dateNF || Oe[14]))
                    : (V = { t: "n", v: Dr(F) }))),
          V.z === void 0 && L != null && (V.z = L));
        var X = "",
          re = q.getElementsByTagName("A");
        if (re && re.length)
          for (
            var Te = 0;
            Te < re.length &&
            !(
              re[Te].hasAttribute("href") && ((X = re[Te].getAttribute("href")), X.charAt(0) != "#")
            );
            ++Te
          );
        (X && X.charAt(0) != "#" && (V.l = { Target: X }),
          n.dense
            ? (e[u + a] || (e[u + a] = []), (e[u + a][O + i] = V))
            : (e[_e({ c: O + i, r: u + a })] = V),
          l.e.c < O + i && (l.e.c = O + i),
          (O += C));
      }
    }
    ++u;
  }
  return (
    p.length && (e["!merges"] = (e["!merges"] || []).concat(p)),
    (l.e.r = Math.max(l.e.r, u - 1 + a)),
    (e["!ref"] = Ie(l)),
    u >= o && (e["!fullref"] = Ie(((l.e.r = f.length - T + u - 1 + a), l))),
    e
  );
}
function bi(e, t) {
  var r = t || {},
    n = r.dense ? [] : {};
  return Bi(n, e, t);
}
function Nu(e, t) {
  return Jr(bi(e, t), t);
}
function la(e) {
  var t = "",
    r = Pu(e);
  return (
    r && (t = r(e).getPropertyValue("display")), t || (t = e.style && e.style.display), t === "none"
  );
}
function Pu(e) {
  return e.ownerDocument.defaultView &&
    typeof e.ownerDocument.defaultView.getComputedStyle == "function"
    ? e.ownerDocument.defaultView.getComputedStyle
    : typeof getComputedStyle == "function"
      ? getComputedStyle
      : null;
}
var Lu = (function () {
    var e = [
        "<office:master-styles>",
        '<style:master-page style:name="mp1" style:page-layout-name="mp1">',
        "<style:header/>",
        '<style:header-left style:display="false"/>',
        "<style:footer/>",
        '<style:footer-left style:display="false"/>',
        "</style:master-page>",
        "</office:master-styles>",
      ].join(""),
      t =
        "<office:document-styles " +
        Nt({
          "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
          "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
          "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
          "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
          "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
          "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "xmlns:dc": "http://purl.org/dc/elements/1.1/",
          "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
          "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
          "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
          "office:version": "1.2",
        }) +
        ">" +
        e +
        "</office:document-styles>";
    return function () {
      return ke + t;
    };
  })(),
  oa = (function () {
    var e = function (i) {
        return ge(i)
          .replace(/  +/g, function (s) {
            return '<text:s text:c="' + s.length + '"/>';
          })
          .replace(/\t/g, "<text:tab/>")
          .replace(/\n/g, "</text:p><text:p>")
          .replace(/^ /, "<text:s/>")
          .replace(/ $/, "<text:s/>");
      },
      t = `          <table:table-cell />
`,
      r = `          <table:covered-table-cell/>
`,
      n = function (i, s, f) {
        var o = [];
        o.push(
          '      <table:table table:name="' +
            ge(s.SheetNames[f]) +
            `" table:style-name="ta1">
`,
        );
        var l = 0,
          c = 0,
          p = fr(i["!ref"] || "A1"),
          x = i["!merges"] || [],
          d = 0,
          T = Array.isArray(i);
        if (i["!cols"])
          for (c = 0; c <= p.e.c; ++c)
            o.push(
              "        <table:table-column" +
                (i["!cols"][c] ? ' table:style-name="co' + i["!cols"][c].ods + '"' : "") +
                `></table:table-column>
`,
            );
        var u = "",
          g = i["!rows"] || [];
        for (l = 0; l < p.s.r; ++l)
          ((u = g[l] ? ' table:style-name="ro' + g[l].ods + '"' : ""),
            o.push(
              "        <table:table-row" +
                u +
                `></table:table-row>
`,
            ));
        for (; l <= p.e.r; ++l) {
          for (
            u = g[l] ? ' table:style-name="ro' + g[l].ods + '"' : "",
              o.push(
                "        <table:table-row" +
                  u +
                  `>
`,
              ),
              c = 0;
            c < p.s.c;
            ++c
          )
            o.push(t);
          for (; c <= p.e.c; ++c) {
            var O = !1,
              D = {},
              C = "";
            for (d = 0; d != x.length; ++d)
              if (!(x[d].s.c > c) && !(x[d].s.r > l) && !(x[d].e.c < c) && !(x[d].e.r < l)) {
                ((x[d].s.c != c || x[d].s.r != l) && (O = !0),
                  (D["table:number-columns-spanned"] = x[d].e.c - x[d].s.c + 1),
                  (D["table:number-rows-spanned"] = x[d].e.r - x[d].s.r + 1));
                break;
              }
            if (O) {
              o.push(r);
              continue;
            }
            var B = _e({ r: l, c }),
              K = T ? (i[l] || [])[c] : i[B];
            if (
              K &&
              K.f &&
              ((D["table:formula"] = ge(r1(K.f))), K.F && K.F.slice(0, B.length) == B)
            ) {
              var q = fr(K.F);
              ((D["table:number-matrix-columns-spanned"] = q.e.c - q.s.c + 1),
                (D["table:number-matrix-rows-spanned"] = q.e.r - q.s.r + 1));
            }
            if (!K) {
              o.push(t);
              continue;
            }
            switch (K.t) {
              case "b":
                ((C = K.v ? "TRUE" : "FALSE"),
                  (D["office:value-type"] = "boolean"),
                  (D["office:boolean-value"] = K.v ? "true" : "false"));
                break;
              case "n":
                ((C = K.w || String(K.v || 0)),
                  (D["office:value-type"] = "float"),
                  (D["office:value"] = K.v || 0));
                break;
              case "s":
              case "str":
                ((C = K.v == null ? "" : K.v), (D["office:value-type"] = "string"));
                break;
              case "d":
                ((C = K.w || Ze(K.v).toISOString()),
                  (D["office:value-type"] = "date"),
                  (D["office:date-value"] = Ze(K.v).toISOString()),
                  (D["table:style-name"] = "ce1"));
                break;
              default:
                o.push(t);
                continue;
            }
            var F = e(C);
            if (K.l && K.l.Target) {
              var L = K.l.Target;
              ((L = L.charAt(0) == "#" ? "#" + t1(L.slice(1)) : L),
                L.charAt(0) != "#" && !L.match(/^\w+:/) && (L = "../" + L),
                (F = j("text:a", F, { "xlink:href": L.replace(/&/g, "&amp;") })));
            }
            o.push(
              "          " +
                j("table:table-cell", j("text:p", F, {}), D) +
                `
`,
            );
          }
          o.push(`        </table:table-row>
`);
        }
        return (
          o.push(`      </table:table>
`),
          o.join("")
        );
      },
      a = function (i, s) {
        (i.push(` <office:automatic-styles>
`),
          i.push(`  <number:date-style style:name="N37" number:automatic-order="true">
`),
          i.push(`   <number:month number:style="long"/>
`),
          i.push(`   <number:text>/</number:text>
`),
          i.push(`   <number:day number:style="long"/>
`),
          i.push(`   <number:text>/</number:text>
`),
          i.push(`   <number:year/>
`),
          i.push(`  </number:date-style>
`));
        var f = 0;
        s.SheetNames.map(function (l) {
          return s.Sheets[l];
        }).forEach(function (l) {
          if (l && l["!cols"]) {
            for (var c = 0; c < l["!cols"].length; ++c)
              if (l["!cols"][c]) {
                var p = l["!cols"][c];
                if (p.width == null && p.wpx == null && p.wch == null) continue;
                (a0(p), (p.ods = f));
                var x = l["!cols"][c].wpx + "px";
                (i.push(
                  '  <style:style style:name="co' +
                    f +
                    `" style:family="table-column">
`,
                ),
                  i.push(
                    '   <style:table-column-properties fo:break-before="auto" style:column-width="' +
                      x +
                      `"/>
`,
                  ),
                  i.push(`  </style:style>
`),
                  ++f);
              }
          }
        });
        var o = 0;
        (s.SheetNames.map(function (l) {
          return s.Sheets[l];
        }).forEach(function (l) {
          if (l && l["!rows"]) {
            for (var c = 0; c < l["!rows"].length; ++c)
              if (l["!rows"][c]) {
                l["!rows"][c].ods = o;
                var p = l["!rows"][c].hpx + "px";
                (i.push(
                  '  <style:style style:name="ro' +
                    o +
                    `" style:family="table-row">
`,
                ),
                  i.push(
                    '   <style:table-row-properties fo:break-before="auto" style:row-height="' +
                      p +
                      `"/>
`,
                  ),
                  i.push(`  </style:style>
`),
                  ++o);
              }
          }
        }),
          i.push(`  <style:style style:name="ta1" style:family="table" style:master-page-name="mp1">
`),
          i.push(`   <style:table-properties table:display="true" style:writing-mode="lr-tb"/>
`),
          i.push(`  </style:style>
`),
          i.push(`  <style:style style:name="ce1" style:family="table-cell" style:parent-style-name="Default" style:data-style-name="N37"/>
`),
          i.push(` </office:automatic-styles>
`));
      };
    return function (s, f) {
      var o = [ke],
        l = Nt({
          "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
          "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
          "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
          "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
          "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
          "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "xmlns:dc": "http://purl.org/dc/elements/1.1/",
          "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
          "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
          "xmlns:presentation": "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
          "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
          "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
          "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
          "xmlns:math": "http://www.w3.org/1998/Math/MathML",
          "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
          "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
          "xmlns:ooo": "http://openoffice.org/2004/office",
          "xmlns:ooow": "http://openoffice.org/2004/writer",
          "xmlns:oooc": "http://openoffice.org/2004/calc",
          "xmlns:dom": "http://www.w3.org/2001/xml-events",
          "xmlns:xforms": "http://www.w3.org/2002/xforms",
          "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
          "xmlns:rpt": "http://openoffice.org/2005/report",
          "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
          "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
          "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
          "xmlns:tableooo": "http://openoffice.org/2009/table",
          "xmlns:drawooo": "http://openoffice.org/2010/draw",
          "xmlns:calcext": "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
          "xmlns:loext": "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
          "xmlns:field": "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
          "xmlns:formx": "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
          "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
          "office:version": "1.2",
        }),
        c = Nt({
          "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
          "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet",
        });
      (f.bookType == "fods"
        ? (o.push(
            "<office:document" +
              l +
              c +
              `>
`,
          ),
          o.push(Qa().replace(/office:document-meta/g, "office:meta")))
        : o.push(
            "<office:document-content" +
              l +
              `>
`,
          ),
        a(o, s),
        o.push(`  <office:body>
`),
        o.push(`    <office:spreadsheet>
`));
      for (var p = 0; p != s.SheetNames.length; ++p) o.push(n(s.Sheets[s.SheetNames[p]], s, p));
      return (
        o.push(`    </office:spreadsheet>
`),
        o.push(`  </office:body>
`),
        f.bookType == "fods" ? o.push("</office:document>") : o.push("</office:document-content>"),
        o.join("")
      );
    };
  })();
function Ui(e, t) {
  if (t.bookType == "fods") return oa(e, t);
  var r = Yn(),
    n = "",
    a = [],
    i = [];
  return (
    (n = "mimetype"),
    he(r, n, "application/vnd.oasis.opendocument.spreadsheet"),
    (n = "content.xml"),
    he(r, n, oa(e, t)),
    a.push([n, "text/xml"]),
    i.push([n, "ContentFile"]),
    (n = "styles.xml"),
    he(r, n, Lu(e, t)),
    a.push([n, "text/xml"]),
    i.push([n, "StylesFile"]),
    (n = "meta.xml"),
    he(r, n, ke + Qa()),
    a.push([n, "text/xml"]),
    i.push([n, "MetadataFile"]),
    (n = "manifest.rdf"),
    he(r, n, Kf(i)),
    a.push([n, "application/rdf+xml"]),
    (n = "META-INF/manifest.xml"),
    he(r, n, Xf(a)),
    r
  );
}
function dn(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Mu(e) {
  return typeof TextEncoder < "u" ? new TextEncoder().encode(e) : mr(kt(e));
}
function Bu(e, t) {
  e: for (var r = 0; r <= e.length - t.length; ++r) {
    for (var n = 0; n < t.length; ++n) if (e[r + n] != t[n]) continue e;
    return !0;
  }
  return !1;
}
function Ur(e) {
  var t = e.reduce(function (a, i) {
      return a + i.length;
    }, 0),
    r = new Uint8Array(t),
    n = 0;
  return (
    e.forEach(function (a) {
      (r.set(a, n), (n += a.length));
    }),
    r
  );
}
function bu(e, t, r) {
  var n = Math.floor(r == 0 ? 0 : Math.LOG10E * Math.log(Math.abs(r))) + 6176 - 20,
    a = r / Math.pow(10, n - 6176);
  ((e[t + 15] |= n >> 7), (e[t + 14] |= (n & 127) << 1));
  for (var i = 0; a >= 1; ++i, a /= 256) e[t + i] = a & 255;
  e[t + 15] |= r >= 0 ? 0 : 128;
}
function Pt(e, t) {
  var r = t ? t[0] : 0,
    n = e[r] & 127;
  e: if (
    e[r++] >= 128 &&
    ((n |= (e[r] & 127) << 7),
    e[r++] < 128 ||
      ((n |= (e[r] & 127) << 14), e[r++] < 128) ||
      ((n |= (e[r] & 127) << 21), e[r++] < 128) ||
      ((n += (e[r] & 127) * Math.pow(2, 28)), ++r, e[r++] < 128) ||
      ((n += (e[r] & 127) * Math.pow(2, 35)), ++r, e[r++] < 128) ||
      ((n += (e[r] & 127) * Math.pow(2, 42)), ++r, e[r++] < 128))
  )
    break e;
  return (t && (t[0] = r), n);
}
function ve(e) {
  var t = new Uint8Array(7);
  t[0] = e & 127;
  var r = 1;
  e: if (e > 127) {
    if (
      ((t[r - 1] |= 128),
      (t[r] = (e >> 7) & 127),
      ++r,
      e <= 16383 ||
        ((t[r - 1] |= 128), (t[r] = (e >> 14) & 127), ++r, e <= 2097151) ||
        ((t[r - 1] |= 128), (t[r] = (e >> 21) & 127), ++r, e <= 268435455) ||
        ((t[r - 1] |= 128), (t[r] = ((e / 256) >>> 21) & 127), ++r, e <= 34359738367) ||
        ((t[r - 1] |= 128), (t[r] = ((e / 65536) >>> 21) & 127), ++r, e <= 4398046511103))
    )
      break e;
    ((t[r - 1] |= 128), (t[r] = ((e / 16777216) >>> 21) & 127), ++r);
  }
  return t.slice(0, r);
}
function ct(e) {
  var t = 0,
    r = e[t] & 127;
  e: if (e[t++] >= 128) {
    if (
      ((r |= (e[t] & 127) << 7),
      e[t++] < 128 ||
        ((r |= (e[t] & 127) << 14), e[t++] < 128) ||
        ((r |= (e[t] & 127) << 21), e[t++] < 128))
    )
      break e;
    r |= (e[t] & 127) << 28;
  }
  return r;
}
function Ne(e) {
  for (var t = [], r = [0]; r[0] < e.length; ) {
    var n = r[0],
      a = Pt(e, r),
      i = a & 7;
    a = Math.floor(a / 8);
    var s = 0,
      f;
    if (a == 0) break;
    switch (i) {
      case 0:
        {
          for (var o = r[0]; e[r[0]++] >= 128; );
          f = e.slice(o, r[0]);
        }
        break;
      case 5:
        ((s = 4), (f = e.slice(r[0], r[0] + s)), (r[0] += s));
        break;
      case 1:
        ((s = 8), (f = e.slice(r[0], r[0] + s)), (r[0] += s));
        break;
      case 2:
        ((s = Pt(e, r)), (f = e.slice(r[0], r[0] + s)), (r[0] += s));
        break;
      default:
        throw new Error("PB Type ".concat(i, " for Field ").concat(a, " at offset ").concat(n));
    }
    var l = { data: f, type: i };
    t[a] == null ? (t[a] = [l]) : t[a].push(l);
  }
  return t;
}
function Ue(e) {
  var t = [];
  return (
    e.forEach(function (r, n) {
      r.forEach(function (a) {
        a.data &&
          (t.push(ve(n * 8 + a.type)), a.type == 2 && t.push(ve(a.data.length)), t.push(a.data));
      });
    }),
    Ur(t)
  );
}
function pr(e) {
  for (var t, r = [], n = [0]; n[0] < e.length; ) {
    var a = Pt(e, n),
      i = Ne(e.slice(n[0], n[0] + a));
    n[0] += a;
    var s = { id: ct(i[1][0].data), messages: [] };
    (i[2].forEach(function (f) {
      var o = Ne(f.data),
        l = ct(o[3][0].data);
      (s.messages.push({ meta: o, data: e.slice(n[0], n[0] + l) }), (n[0] += l));
    }),
      (t = i[3]) != null && t[0] && (s.merge = ct(i[3][0].data) >>> 0 > 0),
      r.push(s));
  }
  return r;
}
function nt(e) {
  var t = [];
  return (
    e.forEach(function (r) {
      var n = [];
      ((n[1] = [{ data: ve(r.id), type: 0 }]),
        (n[2] = []),
        r.merge != null && (n[3] = [{ data: ve(+!!r.merge), type: 0 }]));
      var a = [];
      r.messages.forEach(function (s) {
        (a.push(s.data),
          (s.meta[3] = [{ type: 0, data: ve(s.data.length) }]),
          n[2].push({ data: Ue(s.meta), type: 2 }));
      });
      var i = Ue(n);
      (t.push(ve(i.length)),
        t.push(i),
        a.forEach(function (s) {
          return t.push(s);
        }));
    }),
    Ur(t)
  );
}
function Uu(e, t) {
  if (e != 0) throw new Error("Unexpected Snappy chunk type ".concat(e));
  for (var r = [0], n = Pt(t, r), a = []; r[0] < t.length; ) {
    var i = t[r[0]] & 3;
    if (i == 0) {
      var s = t[r[0]++] >> 2;
      if (s < 60) ++s;
      else {
        var f = s - 59;
        ((s = t[r[0]]),
          f > 1 && (s |= t[r[0] + 1] << 8),
          f > 2 && (s |= t[r[0] + 2] << 16),
          f > 3 && (s |= t[r[0] + 3] << 24),
          (s >>>= 0),
          s++,
          (r[0] += f));
      }
      (a.push(t.slice(r[0], r[0] + s)), (r[0] += s));
      continue;
    } else {
      var o = 0,
        l = 0;
      if (
        (i == 1
          ? ((l = ((t[r[0]] >> 2) & 7) + 4), (o = (t[r[0]++] & 224) << 3), (o |= t[r[0]++]))
          : ((l = (t[r[0]++] >> 2) + 1),
            i == 2
              ? ((o = t[r[0]] | (t[r[0] + 1] << 8)), (r[0] += 2))
              : ((o =
                  (t[r[0]] | (t[r[0] + 1] << 8) | (t[r[0] + 2] << 16) | (t[r[0] + 3] << 24)) >>> 0),
                (r[0] += 4))),
        (a = [Ur(a)]),
        o == 0)
      )
        throw new Error("Invalid offset 0");
      if (o > a[0].length) throw new Error("Invalid offset beyond length");
      if (l >= o)
        for (a.push(a[0].slice(-o)), l -= o; l >= a[a.length - 1].length; )
          (a.push(a[a.length - 1]), (l -= a[a.length - 1].length));
      a.push(a[0].slice(-o, -o + l));
    }
  }
  var c = Ur(a);
  if (c.length != n) throw new Error("Unexpected length: ".concat(c.length, " != ").concat(n));
  return c;
}
function vr(e) {
  for (var t = [], r = 0; r < e.length; ) {
    var n = e[r++],
      a = e[r] | (e[r + 1] << 8) | (e[r + 2] << 16);
    ((r += 3), t.push(Uu(n, e.slice(r, r + a))), (r += a));
  }
  if (r !== e.length) throw new Error("data is not a valid framed stream!");
  return Ur(t);
}
function at(e) {
  for (var t = [], r = 0; r < e.length; ) {
    var n = Math.min(e.length - r, 268435455),
      a = new Uint8Array(4);
    t.push(a);
    var i = ve(n),
      s = i.length;
    (t.push(i),
      n <= 60
        ? (s++, t.push(new Uint8Array([(n - 1) << 2])))
        : n <= 256
          ? ((s += 2), t.push(new Uint8Array([240, (n - 1) & 255])))
          : n <= 65536
            ? ((s += 3), t.push(new Uint8Array([244, (n - 1) & 255, ((n - 1) >> 8) & 255])))
            : n <= 16777216
              ? ((s += 4),
                t.push(
                  new Uint8Array([248, (n - 1) & 255, ((n - 1) >> 8) & 255, ((n - 1) >> 16) & 255]),
                ))
              : n <= 4294967296 &&
                ((s += 5),
                t.push(
                  new Uint8Array([
                    252,
                    (n - 1) & 255,
                    ((n - 1) >> 8) & 255,
                    ((n - 1) >> 16) & 255,
                    ((n - 1) >>> 24) & 255,
                  ]),
                )),
      t.push(e.slice(r, r + n)),
      (s += n),
      (a[0] = 0),
      (a[1] = s & 255),
      (a[2] = (s >> 8) & 255),
      (a[3] = (s >> 16) & 255),
      (r += n));
  }
  return Ur(t);
}
function Bn(e, t) {
  var r = new Uint8Array(32),
    n = dn(r),
    a = 12,
    i = 0;
  switch (((r[0] = 5), e.t)) {
    case "n":
      ((r[1] = 2), bu(r, a, e.v), (i |= 1), (a += 16));
      break;
    case "b":
      ((r[1] = 6), n.setFloat64(a, e.v ? 1 : 0, !0), (i |= 2), (a += 8));
      break;
    case "s":
      if (t.indexOf(e.v) == -1) throw new Error("Value ".concat(e.v, " missing from SST!"));
      ((r[1] = 3), n.setUint32(a, t.indexOf(e.v), !0), (i |= 8), (a += 4));
      break;
    default:
      throw "unsupported cell type " + e.t;
  }
  return (n.setUint32(8, i, !0), r.slice(0, a));
}
function bn(e, t) {
  var r = new Uint8Array(32),
    n = dn(r),
    a = 12,
    i = 0;
  switch (((r[0] = 3), e.t)) {
    case "n":
      ((r[2] = 2), n.setFloat64(a, e.v, !0), (i |= 32), (a += 8));
      break;
    case "b":
      ((r[2] = 6), n.setFloat64(a, e.v ? 1 : 0, !0), (i |= 32), (a += 8));
      break;
    case "s":
      if (t.indexOf(e.v) == -1) throw new Error("Value ".concat(e.v, " missing from SST!"));
      ((r[2] = 3), n.setUint32(a, t.indexOf(e.v), !0), (i |= 16), (a += 4));
      break;
    default:
      throw "unsupported cell type " + e.t;
  }
  return (n.setUint32(4, i, !0), r.slice(0, a));
}
function Pr(e) {
  var t = Ne(e);
  return Pt(t[1][0].data);
}
function Wu(e, t, r) {
  var n, a, i, s;
  if (!((n = e[6]) != null && n[0]) || !((a = e[7]) != null && a[0]))
    throw "Mutation only works on post-BNC storages!";
  var f =
    (((s = (i = e[8]) == null ? void 0 : i[0]) == null ? void 0 : s.data) &&
      ct(e[8][0].data) > 0) ||
    !1;
  if (f) throw "Math only works with normal offsets";
  for (
    var o = 0, l = dn(e[7][0].data), c = 0, p = [], x = dn(e[4][0].data), d = 0, T = [], u = 0;
    u < t.length;
    ++u
  ) {
    if (t[u] == null) {
      (l.setUint16(u * 2, 65535, !0), x.setUint16(u * 2, 65535));
      continue;
    }
    (l.setUint16(u * 2, c, !0), x.setUint16(u * 2, d, !0));
    var g, O;
    switch (typeof t[u]) {
      case "string":
        ((g = Bn({ t: "s", v: t[u] }, r)), (O = bn({ t: "s", v: t[u] }, r)));
        break;
      case "number":
        ((g = Bn({ t: "n", v: t[u] }, r)), (O = bn({ t: "n", v: t[u] }, r)));
        break;
      case "boolean":
        ((g = Bn({ t: "b", v: t[u] }, r)), (O = bn({ t: "b", v: t[u] }, r)));
        break;
      default:
        throw new Error("Unsupported value " + t[u]);
    }
    (p.push(g), (c += g.length), T.push(O), (d += O.length), ++o);
  }
  for (e[2][0].data = ve(o); u < e[7][0].data.length / 2; ++u)
    (l.setUint16(u * 2, 65535, !0), x.setUint16(u * 2, 65535, !0));
  return ((e[6][0].data = Ur(p)), (e[3][0].data = Ur(T)), o);
}
function Hu(e, t) {
  if (!t || !t.numbers) throw new Error("Must pass a `numbers` option -- check the README");
  var r = e.Sheets[e.SheetNames[0]];
  e.SheetNames.length > 1 &&
    console.error("The Numbers writer currently writes only the first table");
  var n = fr(r["!ref"]);
  n.s.r = n.s.c = 0;
  var a = !1;
  (n.e.c > 9 && ((a = !0), (n.e.c = 9)),
    n.e.r > 49 && ((a = !0), (n.e.r = 49)),
    a && console.error("The Numbers writer is currently limited to ".concat(Ie(n))));
  var i = pn(r, { range: n, header: 1 }),
    s = ["~Sh33tJ5~"];
  i.forEach(function (M) {
    return M.forEach(function (y) {
      typeof y == "string" && s.push(y);
    });
  });
  var f = {},
    o = [],
    l = Ee.read(t.numbers, { type: "base64" });
  (l.FileIndex.map(function (M, y) {
    return [M, l.FullPaths[y]];
  }).forEach(function (M) {
    var y = M[0],
      A = M[1];
    if (y.type == 2 && y.name.match(/\.iwa/)) {
      var G = y.content,
        ie = vr(G),
        se = pr(ie);
      se.forEach(function (ae) {
        (o.push(ae.id),
          (f[ae.id] = { deps: [], location: A, type: ct(ae.messages[0].meta[1][0].data) }));
      });
    }
  }),
    o.sort(function (M, y) {
      return M - y;
    }));
  var c = o
    .filter(function (M) {
      return M > 1;
    })
    .map(function (M) {
      return [M, ve(M)];
    });
  l.FileIndex.map(function (M, y) {
    return [M, l.FullPaths[y]];
  }).forEach(function (M) {
    var y = M[0];
    if ((M[1], !!y.name.match(/\.iwa/))) {
      var A = pr(vr(y.content));
      A.forEach(function (G) {
        G.messages.forEach(function (ie) {
          c.forEach(function (se) {
            G.messages.some(function (ae) {
              return ct(ae.meta[1][0].data) != 11006 && Bu(ae.data, se[1]);
            }) && f[se[0]].deps.push(G.id);
          });
        });
      });
    }
  });
  for (var p = Ee.find(l, f[1].location), x = pr(vr(p.content)), d, T = 0; T < x.length; ++T) {
    var u = x[T];
    u.id == 1 && (d = u);
  }
  var g = Pr(Ne(d.messages[0].data)[1][0].data);
  for (p = Ee.find(l, f[g].location), x = pr(vr(p.content)), T = 0; T < x.length; ++T)
    ((u = x[T]), u.id == g && (d = u));
  for (
    g = Pr(Ne(d.messages[0].data)[2][0].data),
      p = Ee.find(l, f[g].location),
      x = pr(vr(p.content)),
      T = 0;
    T < x.length;
    ++T
  )
    ((u = x[T]), u.id == g && (d = u));
  for (
    g = Pr(Ne(d.messages[0].data)[2][0].data),
      p = Ee.find(l, f[g].location),
      x = pr(vr(p.content)),
      T = 0;
    T < x.length;
    ++T
  )
    ((u = x[T]), u.id == g && (d = u));
  var O = Ne(d.messages[0].data);
  {
    ((O[6][0].data = ve(n.e.r + 1)), (O[7][0].data = ve(n.e.c + 1)));
    var D = Pr(O[46][0].data),
      C = Ee.find(l, f[D].location),
      B = pr(vr(C.content));
    {
      for (var K = 0; K < B.length && B[K].id != D; ++K);
      if (B[K].id != D) throw "Bad ColumnRowUIDMapArchive";
      var q = Ne(B[K].messages[0].data);
      ((q[1] = []), (q[2] = []), (q[3] = []));
      for (var F = 0; F <= n.e.c; ++F) {
        var L = [];
        ((L[1] = L[2] = [{ type: 0, data: ve(F + 420690) }]),
          q[1].push({ type: 2, data: Ue(L) }),
          q[2].push({ type: 0, data: ve(F) }),
          q[3].push({ type: 0, data: ve(F) }));
      }
      ((q[4] = []), (q[5] = []), (q[6] = []));
      for (var N = 0; N <= n.e.r; ++N)
        ((L = []),
          (L[1] = L[2] = [{ type: 0, data: ve(N + 726270) }]),
          q[4].push({ type: 2, data: Ue(L) }),
          q[5].push({ type: 0, data: ve(N) }),
          q[6].push({ type: 0, data: ve(N) }));
      B[K].messages[0].data = Ue(q);
    }
    ((C.content = at(nt(B))), (C.size = C.content.length), delete O[46]);
    var V = Ne(O[4][0].data);
    {
      V[7][0].data = ve(n.e.r + 1);
      var U = Ne(V[1][0].data),
        X = Pr(U[2][0].data);
      ((C = Ee.find(l, f[X].location)), (B = pr(vr(C.content))));
      {
        if (B[0].id != X) throw "Bad HeaderStorageBucket";
        var re = Ne(B[0].messages[0].data);
        for (N = 0; N < i.length; ++N) {
          var Te = Ne(re[2][0].data);
          ((Te[1][0].data = ve(N)),
            (Te[4][0].data = ve(i[N].length)),
            (re[2][N] = { type: re[2][0].type, data: Ue(Te) }));
        }
        B[0].messages[0].data = Ue(re);
      }
      ((C.content = at(nt(B))), (C.size = C.content.length));
      var oe = Pr(V[2][0].data);
      ((C = Ee.find(l, f[oe].location)), (B = pr(vr(C.content))));
      {
        if (B[0].id != oe) throw "Bad HeaderStorageBucket";
        for (re = Ne(B[0].messages[0].data), F = 0; F <= n.e.c; ++F)
          ((Te = Ne(re[2][0].data)),
            (Te[1][0].data = ve(F)),
            (Te[4][0].data = ve(n.e.r + 1)),
            (re[2][F] = { type: re[2][0].type, data: Ue(Te) }));
        B[0].messages[0].data = Ue(re);
      }
      ((C.content = at(nt(B))), (C.size = C.content.length));
      var be = Pr(V[4][0].data);
      (function () {
        for (
          var M = Ee.find(l, f[be].location), y = pr(vr(M.content)), A, G = 0;
          G < y.length;
          ++G
        ) {
          var ie = y[G];
          ie.id == be && (A = ie);
        }
        var se = Ne(A.messages[0].data);
        {
          se[3] = [];
          var ae = [];
          s.forEach(function (ue, $e) {
            ((ae[1] = [{ type: 0, data: ve($e) }]),
              (ae[2] = [{ type: 0, data: ve(1) }]),
              (ae[3] = [{ type: 2, data: Mu(ue) }]),
              se[3].push({ type: 2, data: Ue(ae) }));
          });
        }
        A.messages[0].data = Ue(se);
        var Q = nt(y),
          we = at(Q);
        ((M.content = we), (M.size = M.content.length));
      })();
      var De = Ne(V[3][0].data);
      {
        var dr = De[1][0];
        delete De[2];
        var Pe = Ne(dr.data);
        {
          var lr = Pr(Pe[2][0].data);
          (function () {
            for (
              var M = Ee.find(l, f[lr].location), y = pr(vr(M.content)), A, G = 0;
              G < y.length;
              ++G
            ) {
              var ie = y[G];
              ie.id == lr && (A = ie);
            }
            var se = Ne(A.messages[0].data);
            {
              (delete se[6], delete De[7]);
              var ae = new Uint8Array(se[5][0].data);
              se[5] = [];
              for (var Q = 0, we = 0; we <= n.e.r; ++we) {
                var ue = Ne(ae);
                ((Q += Wu(ue, i[we], s)),
                  (ue[1][0].data = ve(we)),
                  se[5].push({ data: Ue(ue), type: 2 }));
              }
              ((se[1] = [{ type: 0, data: ve(n.e.c + 1) }]),
                (se[2] = [{ type: 0, data: ve(n.e.r + 1) }]),
                (se[3] = [{ type: 0, data: ve(Q) }]),
                (se[4] = [{ type: 0, data: ve(n.e.r + 1) }]));
            }
            A.messages[0].data = Ue(se);
            var $e = nt(y),
              pe = at($e);
            ((M.content = pe), (M.size = M.content.length));
          })();
        }
        dr.data = Ue(Pe);
      }
      V[3][0].data = Ue(De);
    }
    O[4][0].data = Ue(V);
  }
  d.messages[0].data = Ue(O);
  var tr = nt(x),
    S = at(tr);
  return ((p.content = S), (p.size = p.content.length), l);
}
function Vu(e) {
  return function (r) {
    for (var n = 0; n != e.length; ++n) {
      var a = e[n];
      (r[a[0]] === void 0 && (r[a[0]] = a[1]), a[2] === "n" && (r[a[0]] = Number(r[a[0]])));
    }
  };
}
function o0(e) {
  Vu([
    ["cellDates", !1],
    ["bookSST", !1],
    ["bookType", "xlsx"],
    ["compression", !1],
    ["WTF", !1],
  ])(e);
}
function Gu(e, t) {
  return t.bookType == "ods"
    ? Ui(e, t)
    : t.bookType == "numbers"
      ? Hu(e, t)
      : t.bookType == "xlsb"
        ? Xu(e, t)
        : zu(e, t);
}
function Xu(e, t) {
  ((st = 1024),
    e && !e.SSF && (e.SSF = rr(Oe)),
    e &&
      e.SSF &&
      (gn(), mn(e.SSF), (t.revssf = _n(e.SSF)), (t.revssf[e.SSF[65535]] = 0), (t.ssf = e.SSF)),
    (t.rels = {}),
    (t.wbrels = {}),
    (t.Strings = []),
    (t.Strings.Count = 0),
    (t.Strings.Unique = 0),
    Ot
      ? (t.revStrings = new Map())
      : ((t.revStrings = {}), (t.revStrings.foo = []), delete t.revStrings.foo));
  var r = t.bookType == "xlsb" ? "bin" : "xml",
    n = Ei.indexOf(t.bookType) > -1,
    a = Ja();
  o0((t = t || {}));
  var i = Yn(),
    s = "",
    f = 0;
  if (
    ((t.cellXfs = []),
    Wr(t.cellXfs, {}, { revssf: { General: 0 } }),
    e.Props || (e.Props = {}),
    (s = "docProps/core.xml"),
    he(i, s, ei(e.Props, t)),
    a.coreprops.push(s),
    me(t.rels, 2, s, xe.CORE_PROPS),
    (s = "docProps/app.xml"),
    !(e.Props && e.Props.SheetNames))
  )
    if (!e.Workbook || !e.Workbook.Sheets) e.Props.SheetNames = e.SheetNames;
    else {
      for (var o = [], l = 0; l < e.SheetNames.length; ++l)
        (e.Workbook.Sheets[l] || {}).Hidden != 2 && o.push(e.SheetNames[l]);
      e.Props.SheetNames = o;
    }
  for (
    e.Props.Worksheets = e.Props.SheetNames.length,
      he(i, s, ti(e.Props)),
      a.extprops.push(s),
      me(t.rels, 3, s, xe.EXT_PROPS),
      e.Custprops !== e.Props &&
        Xe(e.Custprops || {}).length > 0 &&
        ((s = "docProps/custom.xml"),
        he(i, s, ni(e.Custprops)),
        a.custprops.push(s),
        me(t.rels, 4, s, xe.CUST_PROPS)),
      f = 1;
    f <= e.SheetNames.length;
    ++f
  ) {
    var c = { "!id": {} },
      p = e.Sheets[e.SheetNames[f - 1]],
      x = (p || {})["!type"] || "sheet";
    if (
      ((s = "xl/worksheets/sheet" + f + "." + r),
      he(i, s, Yh(f - 1, s, t, e, c)),
      a.sheets.push(s),
      me(t.wbrels, -1, "worksheets/sheet" + f + "." + r, xe.WS[0]),
      p)
    ) {
      var d = p["!comments"],
        T = !1,
        u = "";
      (d &&
        d.length > 0 &&
        ((u = "xl/comments" + f + "." + r),
        he(i, u, Jh(d, u)),
        a.comments.push(u),
        me(c, -1, "../comments" + f + "." + r, xe.CMNT),
        (T = !0)),
        p["!legacy"] && T && he(i, "xl/drawings/vmlDrawing" + f + ".vml", _i(f, p["!comments"])),
        delete p["!comments"],
        delete p["!legacy"]);
    }
    c["!id"].rId1 && he(i, qa(s), lt(c));
  }
  return (
    t.Strings != null &&
      t.Strings.length > 0 &&
      ((s = "xl/sharedStrings." + r),
      he(i, s, jh(t.Strings, s, t)),
      a.strs.push(s),
      me(t.wbrels, -1, "sharedStrings." + r, xe.SST)),
    (s = "xl/workbook." + r),
    he(i, s, Kh(e, s)),
    a.workbooks.push(s),
    me(t.rels, 1, s, xe.WB),
    (s = "xl/theme/theme1.xml"),
    he(i, s, mi(e.Themes, t)),
    a.themes.push(s),
    me(t.wbrels, -1, "theme/theme1.xml", xe.THEME),
    (s = "xl/styles." + r),
    he(i, s, $h(e, s, t)),
    a.styles.push(s),
    me(t.wbrels, -1, "styles." + r, xe.STY),
    e.vbaraw &&
      n &&
      ((s = "xl/vbaProject.bin"),
      he(i, s, e.vbaraw),
      a.vba.push(s),
      me(t.wbrels, -1, "vbaProject.bin", xe.VBA)),
    (s = "xl/metadata." + r),
    he(i, s, Zh(s)),
    a.metadata.push(s),
    me(t.wbrels, -1, "metadata." + r, xe.XLMETA),
    he(i, "[Content_Types].xml", Za(a, t)),
    he(i, "_rels/.rels", lt(t.rels)),
    he(i, "xl/_rels/workbook." + r + ".rels", lt(t.wbrels)),
    delete t.revssf,
    delete t.ssf,
    i
  );
}
function zu(e, t) {
  ((st = 1024),
    e && !e.SSF && (e.SSF = rr(Oe)),
    e &&
      e.SSF &&
      (gn(), mn(e.SSF), (t.revssf = _n(e.SSF)), (t.revssf[e.SSF[65535]] = 0), (t.ssf = e.SSF)),
    (t.rels = {}),
    (t.wbrels = {}),
    (t.Strings = []),
    (t.Strings.Count = 0),
    (t.Strings.Unique = 0),
    Ot
      ? (t.revStrings = new Map())
      : ((t.revStrings = {}), (t.revStrings.foo = []), delete t.revStrings.foo));
  var r = "xml",
    n = Ei.indexOf(t.bookType) > -1,
    a = Ja();
  o0((t = t || {}));
  var i = Yn(),
    s = "",
    f = 0;
  if (
    ((t.cellXfs = []),
    Wr(t.cellXfs, {}, { revssf: { General: 0 } }),
    e.Props || (e.Props = {}),
    (s = "docProps/core.xml"),
    he(i, s, ei(e.Props, t)),
    a.coreprops.push(s),
    me(t.rels, 2, s, xe.CORE_PROPS),
    (s = "docProps/app.xml"),
    !(e.Props && e.Props.SheetNames))
  )
    if (!e.Workbook || !e.Workbook.Sheets) e.Props.SheetNames = e.SheetNames;
    else {
      for (var o = [], l = 0; l < e.SheetNames.length; ++l)
        (e.Workbook.Sheets[l] || {}).Hidden != 2 && o.push(e.SheetNames[l]);
      e.Props.SheetNames = o;
    }
  ((e.Props.Worksheets = e.Props.SheetNames.length),
    he(i, s, ti(e.Props)),
    a.extprops.push(s),
    me(t.rels, 3, s, xe.EXT_PROPS),
    e.Custprops !== e.Props &&
      Xe(e.Custprops || {}).length > 0 &&
      ((s = "docProps/custom.xml"),
      he(i, s, ni(e.Custprops)),
      a.custprops.push(s),
      me(t.rels, 4, s, xe.CUST_PROPS)));
  var c = ["SheetJ5"];
  for (t.tcid = 0, f = 1; f <= e.SheetNames.length; ++f) {
    var p = { "!id": {} },
      x = e.Sheets[e.SheetNames[f - 1]],
      d = (x || {})["!type"] || "sheet";
    if (
      ((s = "xl/worksheets/sheet" + f + "." + r),
      he(i, s, Ri(f - 1, t, e, p)),
      a.sheets.push(s),
      me(t.wbrels, -1, "worksheets/sheet" + f + "." + r, xe.WS[0]),
      x)
    ) {
      var T = x["!comments"],
        u = !1,
        g = "";
      if (T && T.length > 0) {
        var O = !1;
        (T.forEach(function (D) {
          D[1].forEach(function (C) {
            C.T == !0 && (O = !0);
          });
        }),
          O &&
            ((g = "xl/threadedComments/threadedComment" + f + "." + r),
            he(i, g, wo(T, c, t)),
            a.threadedcomments.push(g),
            me(p, -1, "../threadedComments/threadedComment" + f + "." + r, xe.TCMNT)),
          (g = "xl/comments" + f + "." + r),
          he(i, g, Ti(T)),
          a.comments.push(g),
          me(p, -1, "../comments" + f + "." + r, xe.CMNT),
          (u = !0));
      }
      (x["!legacy"] && u && he(i, "xl/drawings/vmlDrawing" + f + ".vml", _i(f, x["!comments"])),
        delete x["!comments"],
        delete x["!legacy"]);
    }
    p["!id"].rId1 && he(i, qa(s), lt(p));
  }
  return (
    t.Strings != null &&
      t.Strings.length > 0 &&
      ((s = "xl/sharedStrings." + r),
      he(i, s, hi(t.Strings, t)),
      a.strs.push(s),
      me(t.wbrels, -1, "sharedStrings." + r, xe.SST)),
    (s = "xl/workbook." + r),
    he(i, s, Ni(e)),
    a.workbooks.push(s),
    me(t.rels, 1, s, xe.WB),
    (s = "xl/theme/theme1.xml"),
    he(i, s, mi(e.Themes, t)),
    a.themes.push(s),
    me(t.wbrels, -1, "theme/theme1.xml", xe.THEME),
    (s = "xl/styles." + r),
    he(i, s, pi(e, t)),
    a.styles.push(s),
    me(t.wbrels, -1, "styles." + r, xe.STY),
    e.vbaraw &&
      n &&
      ((s = "xl/vbaProject.bin"),
      he(i, s, e.vbaraw),
      a.vba.push(s),
      me(t.wbrels, -1, "vbaProject.bin", xe.VBA)),
    (s = "xl/metadata." + r),
    he(i, s, gi()),
    a.metadata.push(s),
    me(t.wbrels, -1, "metadata." + r, xe.XLMETA),
    c.length > 1 &&
      ((s = "xl/persons/person.xml"),
      he(i, s, So(c)),
      a.people.push(s),
      me(t.wbrels, -1, "persons/person.xml", xe.PEOPLE)),
    he(i, "[Content_Types].xml", Za(a, t)),
    he(i, "_rels/.rels", lt(t.rels)),
    he(i, "xl/_rels/workbook." + r + ".rels", lt(t.wbrels)),
    delete t.revssf,
    delete t.ssf,
    i
  );
}
function Ku(e, t) {
  var r = "";
  switch ((t || {}).type || "base64") {
    case "buffer":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    case "base64":
      r = Ir(e.slice(0, 12));
      break;
    case "binary":
      r = e;
      break;
    case "array":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    default:
      throw new Error("Unrecognized type " + ((t && t.type) || "undefined"));
  }
  return [
    r.charCodeAt(0),
    r.charCodeAt(1),
    r.charCodeAt(2),
    r.charCodeAt(3),
    r.charCodeAt(4),
    r.charCodeAt(5),
    r.charCodeAt(6),
    r.charCodeAt(7),
  ];
}
function Wi(e, t) {
  switch (t.type) {
    case "base64":
    case "binary":
      break;
    case "buffer":
    case "array":
      t.type = "";
      break;
    case "file":
      return Bt(t.file, Ee.write(e, { type: de ? "buffer" : "" }));
    case "string":
      throw new Error("'string' output type invalid for '" + t.bookType + "' files");
    default:
      throw new Error("Unrecognized type " + t.type);
  }
  return Ee.write(e, t);
}
function Yu(e, t) {
  var r = rr(t || {}),
    n = Gu(e, r);
  return $u(n, r);
}
function $u(e, t) {
  var r = {},
    n = de ? "nodebuffer" : typeof Uint8Array < "u" ? "array" : "string";
  if ((t.compression && (r.compression = "DEFLATE"), t.password)) r.type = n;
  else
    switch (t.type) {
      case "base64":
        r.type = "base64";
        break;
      case "binary":
        r.type = "string";
        break;
      case "string":
        throw new Error("'string' output type invalid for '" + t.bookType + "' files");
      case "buffer":
      case "file":
        r.type = n;
        break;
      default:
        throw new Error("Unrecognized type " + t.type);
    }
  var a = e.FullPaths
    ? Ee.write(e, {
        fileType: "zip",
        type: { nodebuffer: "buffer", string: "binary" }[r.type] || r.type,
        compression: !!t.compression,
      })
    : e.generate(r);
  if (typeof Deno < "u" && typeof a == "string") {
    if (t.type == "binary" || t.type == "base64") return a;
    a = new Uint8Array(vn(a));
  }
  return t.password && typeof encrypt_agile < "u"
    ? Wi(encrypt_agile(a, t.password), t)
    : t.type === "file"
      ? Bt(t.file, a)
      : t.type == "string"
        ? At(a)
        : a;
}
function ju(e, t) {
  var r = t || {},
    n = hu(e, r);
  return Wi(n, r);
}
function wr(e, t, r) {
  r || (r = "");
  var n = r + e;
  switch (t.type) {
    case "base64":
      return Rt(kt(n));
    case "binary":
      return kt(n);
    case "string":
      return e;
    case "file":
      return Bt(t.file, n, "utf8");
    case "buffer":
      return de
        ? Nr(n, "utf8")
        : typeof TextEncoder < "u"
          ? new TextEncoder().encode(n)
          : wr(n, { type: "binary" })
              .split("")
              .map(function (a) {
                return a.charCodeAt(0);
              });
  }
  throw new Error("Unrecognized type " + t.type);
}
function Ju(e, t) {
  switch (t.type) {
    case "base64":
      return Rt(e);
    case "binary":
      return e;
    case "string":
      return e;
    case "file":
      return Bt(t.file, e, "binary");
    case "buffer":
      return de
        ? Nr(e, "binary")
        : e.split("").map(function (r) {
            return r.charCodeAt(0);
          });
  }
  throw new Error("Unrecognized type " + t.type);
}
function Qt(e, t) {
  switch (t.type) {
    case "string":
    case "base64":
    case "binary":
      for (var r = "", n = 0; n < e.length; ++n) r += String.fromCharCode(e[n]);
      return t.type == "base64" ? Rt(r) : t.type == "string" ? At(r) : r;
    case "file":
      return Bt(t.file, e);
    case "buffer":
      return e;
    default:
      throw new Error("Unrecognized type " + t.type);
  }
}
function Hi(e, t) {
  (ws(), Lh(e));
  var r = rr(t || {});
  if ((r.cellStyles && ((r.cellNF = !0), (r.sheetStubs = !0)), r.type == "array")) {
    r.type = "binary";
    var n = Hi(e, r);
    return ((r.type = "array"), vn(n));
  }
  var a = 0;
  if (
    r.sheet &&
    (typeof r.sheet == "number" ? (a = r.sheet) : (a = e.SheetNames.indexOf(r.sheet)),
    !e.SheetNames[a])
  )
    throw new Error("Sheet not found: " + r.sheet + " : " + typeof r.sheet);
  switch (r.bookType || "xlsb") {
    case "xml":
    case "xlml":
      return wr(ou(e, r), r);
    case "slk":
    case "sylk":
      return wr(Il.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "htm":
    case "html":
      return wr(Mi(e.Sheets[e.SheetNames[a]], r), r);
    case "txt":
      return Ju(Vi(e.Sheets[e.SheetNames[a]], r), r);
    case "csv":
      return wr(c0(e.Sheets[e.SheetNames[a]], r), r, "\uFEFF");
    case "dif":
      return wr(kl.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "dbf":
      return Qt(Rl.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "prn":
      return wr(Nl.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "rtf":
      return wr(Wl.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "eth":
      return wr(ci.from_sheet(e.Sheets[e.SheetNames[a]], r), r);
    case "fods":
      return wr(Ui(e, r), r);
    case "wk1":
      return Qt(ta.sheet_to_wk1(e.Sheets[e.SheetNames[a]], r), r);
    case "wk3":
      return Qt(ta.book_to_wk3(e, r), r);
    case "biff2":
      r.biff || (r.biff = 2);
    case "biff3":
      r.biff || (r.biff = 3);
    case "biff4":
      return (r.biff || (r.biff = 4), Qt(Li(e, r), r));
    case "biff5":
      r.biff || (r.biff = 5);
    case "biff8":
    case "xla":
    case "xls":
      return (r.biff || (r.biff = 8), ju(e, r));
    case "xlsx":
    case "xlsm":
    case "xlam":
    case "xlsb":
    case "numbers":
    case "ods":
      return Yu(e, r);
    default:
      throw new Error("Unrecognized bookType |" + r.bookType + "|");
  }
}
function Zu(e) {
  if (!e.bookType) {
    var t = { xls: "biff8", htm: "html", slk: "sylk", socialcalc: "eth", Sh33tJS: "WTF" },
      r = e.file.slice(e.file.lastIndexOf(".")).toLowerCase();
    (r.match(/^\.[a-z]+$/) && (e.bookType = r.slice(1)),
      (e.bookType = t[e.bookType] || e.bookType));
  }
}
function qu(e, t, r) {
  var n = {};
  return ((n.type = "file"), (n.file = t), Zu(n), Hi(e, n));
}
function Qu(e, t, r, n, a, i, s, f) {
  var o = Ge(r),
    l = f.defval,
    c = f.raw || !Object.prototype.hasOwnProperty.call(f, "raw"),
    p = !0,
    x = a === 1 ? [] : {};
  if (a !== 1)
    if (Object.defineProperty)
      try {
        Object.defineProperty(x, "__rowNum__", { value: r, enumerable: !1 });
      } catch {
        x.__rowNum__ = r;
      }
    else x.__rowNum__ = r;
  if (!s || e[r])
    for (var d = t.s.c; d <= t.e.c; ++d) {
      var T = s ? e[r][d] : e[n[d] + o];
      if (T === void 0 || T.t === void 0) {
        if (l === void 0) continue;
        i[d] != null && (x[i[d]] = l);
        continue;
      }
      var u = T.v;
      switch (T.t) {
        case "z":
          if (u == null) break;
          continue;
        case "e":
          u = u == 0 ? null : void 0;
          break;
        case "s":
        case "d":
        case "b":
        case "n":
          break;
        default:
          throw new Error("unrecognized type " + T.t);
      }
      if (i[d] != null) {
        if (u == null)
          if (T.t == "e" && u === null) x[i[d]] = null;
          else if (l !== void 0) x[i[d]] = l;
          else if (c && u === null) x[i[d]] = null;
          else continue;
        else x[i[d]] = c && (T.t !== "n" || (T.t === "n" && f.rawNumbers !== !1)) ? u : kr(T, u, f);
        u != null && (p = !1);
      }
    }
  return { row: x, isempty: p };
}
function pn(e, t) {
  if (e == null || e["!ref"] == null) return [];
  var r = { t: "n", v: 0 },
    n = 0,
    a = 1,
    i = [],
    s = 0,
    f = "",
    o = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } },
    l = t || {},
    c = l.range != null ? l.range : e["!ref"];
  switch (
    (l.header === 1
      ? (n = 1)
      : l.header === "A"
        ? (n = 2)
        : Array.isArray(l.header)
          ? (n = 3)
          : l.header == null && (n = 0),
    typeof c)
  ) {
    case "string":
      o = Se(c);
      break;
    case "number":
      ((o = Se(e["!ref"])), (o.s.r = c));
      break;
    default:
      o = c;
  }
  n > 0 && (a = 0);
  var p = Ge(o.s.r),
    x = [],
    d = [],
    T = 0,
    u = 0,
    g = Array.isArray(e),
    O = o.s.r,
    D = 0,
    C = {};
  g && !e[O] && (e[O] = []);
  var B = (l.skipHidden && e["!cols"]) || [],
    K = (l.skipHidden && e["!rows"]) || [];
  for (D = o.s.c; D <= o.e.c; ++D)
    if (!(B[D] || {}).hidden)
      switch (((x[D] = Ke(D)), (r = g ? e[O][D] : e[x[D] + p]), n)) {
        case 1:
          i[D] = D - o.s.c;
          break;
        case 2:
          i[D] = x[D];
          break;
        case 3:
          i[D] = l.header[D - o.s.c];
          break;
        default:
          if (
            (r == null && (r = { w: "__EMPTY", t: "s" }),
            (f = s = kr(r, null, l)),
            (u = C[s] || 0),
            !u)
          )
            C[s] = 1;
          else {
            do f = s + "_" + u++;
            while (C[f]);
            ((C[s] = u), (C[f] = 1));
          }
          i[D] = f;
      }
  for (O = o.s.r + a; O <= o.e.r; ++O)
    if (!(K[O] || {}).hidden) {
      var q = Qu(e, o, O, x, n, i, g, l);
      (q.isempty === !1 || (n === 1 ? l.blankrows !== !1 : l.blankrows)) && (d[T++] = q.row);
    }
  return ((d.length = T), d);
}
var ca = /"/g;
function ex(e, t, r, n, a, i, s, f) {
  for (var o = !0, l = [], c = "", p = Ge(r), x = t.s.c; x <= t.e.c; ++x)
    if (n[x]) {
      var d = f.dense ? (e[r] || [])[x] : e[n[x] + p];
      if (d == null) c = "";
      else if (d.v != null) {
        ((o = !1), (c = "" + (f.rawNumbers && d.t == "n" ? d.v : kr(d, null, f))));
        for (var T = 0, u = 0; T !== c.length; ++T)
          if ((u = c.charCodeAt(T)) === a || u === i || u === 34 || f.forceQuotes) {
            c = '"' + c.replace(ca, '""') + '"';
            break;
          }
        c == "ID" && (c = '"ID"');
      } else
        d.f != null && !d.F
          ? ((o = !1),
            (c = "=" + d.f),
            c.indexOf(",") >= 0 && (c = '"' + c.replace(ca, '""') + '"'))
          : (c = "");
      l.push(c);
    }
  return f.blankrows === !1 && o ? null : l.join(s);
}
function c0(e, t) {
  var r = [],
    n = t ?? {};
  if (e == null || e["!ref"] == null) return "";
  var a = Se(e["!ref"]),
    i = n.FS !== void 0 ? n.FS : ",",
    s = i.charCodeAt(0),
    f =
      n.RS !== void 0
        ? n.RS
        : `
`,
    o = f.charCodeAt(0),
    l = new RegExp((i == "|" ? "\\|" : i) + "+$"),
    c = "",
    p = [];
  n.dense = Array.isArray(e);
  for (
    var x = (n.skipHidden && e["!cols"]) || [], d = (n.skipHidden && e["!rows"]) || [], T = a.s.c;
    T <= a.e.c;
    ++T
  )
    (x[T] || {}).hidden || (p[T] = Ke(T));
  for (var u = 0, g = a.s.r; g <= a.e.r; ++g)
    (d[g] || {}).hidden ||
      ((c = ex(e, a, g, p, s, o, i, n)),
      c != null &&
        (n.strip && (c = c.replace(l, "")),
        (c || n.blankrows !== !1) && r.push((u++ ? f : "") + c)));
  return (delete n.dense, r.join(""));
}
function Vi(e, t) {
  (t || (t = {}),
    (t.FS = "	"),
    (t.RS = `
`));
  var r = c0(e, t);
  return r;
}
function rx(e) {
  var t = "",
    r,
    n = "";
  if (e == null || e["!ref"] == null) return [];
  var a = Se(e["!ref"]),
    i = "",
    s = [],
    f,
    o = [],
    l = Array.isArray(e);
  for (f = a.s.c; f <= a.e.c; ++f) s[f] = Ke(f);
  for (var c = a.s.r; c <= a.e.r; ++c)
    for (i = Ge(c), f = a.s.c; f <= a.e.c; ++f)
      if (((t = s[f] + i), (r = l ? (e[c] || [])[f] : e[t]), (n = ""), r !== void 0)) {
        if (r.F != null) {
          if (((t = r.F), !r.f)) continue;
          ((n = r.f), t.indexOf(":") == -1 && (t = t + ":" + t));
        }
        if (r.f != null) n = r.f;
        else {
          if (r.t == "z") continue;
          if (r.t == "n" && r.v != null) n = "" + r.v;
          else if (r.t == "b") n = r.v ? "TRUE" : "FALSE";
          else if (r.w !== void 0) n = "'" + r.w;
          else {
            if (r.v === void 0) continue;
            r.t == "s" ? (n = "'" + r.v) : (n = "" + r.v);
          }
        }
        o[o.length] = t + "=" + n;
      }
  return o;
}
function Gi(e, t, r) {
  var n = r || {},
    a = +!n.skipHeader,
    i = e || {},
    s = 0,
    f = 0;
  if (i && n.origin != null)
    if (typeof n.origin == "number") s = n.origin;
    else {
      var o = typeof n.origin == "string" ? Me(n.origin) : n.origin;
      ((s = o.r), (f = o.c));
    }
  var l,
    c = { s: { c: 0, r: 0 }, e: { c: f, r: s + t.length - 1 + a } };
  if (i["!ref"]) {
    var p = Se(i["!ref"]);
    ((c.e.c = Math.max(c.e.c, p.e.c)),
      (c.e.r = Math.max(c.e.r, p.e.r)),
      s == -1 && ((s = p.e.r + 1), (c.e.r = s + t.length - 1 + a)));
  } else s == -1 && ((s = 0), (c.e.r = t.length - 1 + a));
  var x = n.header || [],
    d = 0;
  (t.forEach(function (u, g) {
    Xe(u).forEach(function (O) {
      (d = x.indexOf(O)) == -1 && (x[(d = x.length)] = O);
      var D = u[O],
        C = "z",
        B = "",
        K = _e({ c: f + d, r: s + g + a });
      ((l = Lt(i, K)),
        D && typeof D == "object" && !(D instanceof Date)
          ? (i[K] = D)
          : (typeof D == "number"
              ? (C = "n")
              : typeof D == "boolean"
                ? (C = "b")
                : typeof D == "string"
                  ? (C = "s")
                  : D instanceof Date
                    ? ((C = "d"), n.cellDates || ((C = "n"), (D = er(D))), (B = n.dateNF || Oe[14]))
                    : D === null && n.nullError && ((C = "e"), (D = 0)),
            l
              ? ((l.t = C), (l.v = D), delete l.w, delete l.R, B && (l.z = B))
              : (i[K] = l = { t: C, v: D }),
            B && (l.z = B)));
    });
  }),
    (c.e.c = Math.max(c.e.c, f + x.length - 1)));
  var T = Ge(s);
  if (a) for (d = 0; d < x.length; ++d) i[Ke(d + f) + T] = { t: "s", v: x[d] };
  return ((i["!ref"] = Ie(c)), i);
}
function tx(e, t) {
  return Gi(null, e, t);
}
function Lt(e, t, r) {
  if (typeof t == "string") {
    if (Array.isArray(e)) {
      var n = Me(t);
      return (e[n.r] || (e[n.r] = []), e[n.r][n.c] || (e[n.r][n.c] = { t: "z" }));
    }
    return e[t] || (e[t] = { t: "z" });
  }
  return typeof t != "number" ? Lt(e, _e(t)) : Lt(e, _e({ r: t, c: r || 0 }));
}
function nx(e, t) {
  if (typeof t == "number") {
    if (t >= 0 && e.SheetNames.length > t) return t;
    throw new Error("Cannot find sheet # " + t);
  } else if (typeof t == "string") {
    var r = e.SheetNames.indexOf(t);
    if (r > -1) return r;
    throw new Error("Cannot find sheet name |" + t + "|");
  } else throw new Error("Cannot find sheet |" + t + "|");
}
function ax() {
  return { SheetNames: [], Sheets: {} };
}
function ix(e, t, r, n) {
  var a = 1;
  if (!r) for (; a <= 65535 && e.SheetNames.indexOf((r = "Sheet" + a)) != -1; ++a, r = void 0);
  if (!r || e.SheetNames.length >= 65535) throw new Error("Too many worksheets");
  if (n && e.SheetNames.indexOf(r) >= 0) {
    var i = r.match(/(^.*?)(\d+)$/);
    a = (i && +i[2]) || 0;
    var s = (i && i[1]) || r;
    for (++a; a <= 65535 && e.SheetNames.indexOf((r = s + a)) != -1; ++a);
  }
  if ((ki(r), e.SheetNames.indexOf(r) >= 0))
    throw new Error("Worksheet with name |" + r + "| already exists!");
  return (e.SheetNames.push(r), (e.Sheets[r] = t), r);
}
function sx(e, t, r) {
  (e.Workbook || (e.Workbook = {}), e.Workbook.Sheets || (e.Workbook.Sheets = []));
  var n = nx(e, t);
  switch ((e.Workbook.Sheets[n] || (e.Workbook.Sheets[n] = {}), r)) {
    case 0:
    case 1:
    case 2:
      break;
    default:
      throw new Error("Bad sheet visibility setting " + r);
  }
  e.Workbook.Sheets[n].Hidden = r;
}
function fx(e, t) {
  return ((e.z = t), e);
}
function Xi(e, t, r) {
  return (t ? ((e.l = { Target: t }), r && (e.l.Tooltip = r)) : delete e.l, e);
}
function lx(e, t, r) {
  return Xi(e, "#" + t, r);
}
function ox(e, t, r) {
  (e.c || (e.c = []), e.c.push({ t, a: r || "SheetJS" }));
}
function cx(e, t, r, n) {
  for (
    var a = typeof t != "string" ? t : Se(t), i = typeof t == "string" ? t : Ie(t), s = a.s.r;
    s <= a.e.r;
    ++s
  )
    for (var f = a.s.c; f <= a.e.c; ++f) {
      var o = Lt(e, s, f);
      ((o.t = "n"),
        (o.F = i),
        delete o.v,
        s == a.s.r && f == a.s.c && ((o.f = r), n && (o.D = !0)));
    }
  return e;
}
var Un = {
  encode_col: Ke,
  encode_row: Ge,
  encode_cell: _e,
  encode_range: Ie,
  decode_col: Qn,
  decode_row: qn,
  split_cell: Sf,
  decode_cell: Me,
  decode_range: fr,
  format_cell: kr,
  sheet_add_aoa: Xa,
  sheet_add_json: Gi,
  sheet_add_dom: Bi,
  aoa_to_sheet: xt,
  json_to_sheet: tx,
  table_to_sheet: bi,
  table_to_book: Nu,
  sheet_to_csv: c0,
  sheet_to_txt: Vi,
  sheet_to_json: pn,
  sheet_to_html: Mi,
  sheet_to_formulae: rx,
  sheet_to_row_object_array: pn,
  sheet_get_cell: Lt,
  book_new: ax,
  book_append_sheet: ix,
  book_set_sheet_visibility: sx,
  cell_set_number_format: fx,
  cell_set_hyperlink: Xi,
  cell_set_internal_link: lx,
  cell_add_comment: ox,
  sheet_set_array_formula: cx,
  consts: { SHEET_VISIBLE: 0, SHEET_HIDDEN: 1, SHEET_VERY_HIDDEN: 2 },
};
const hx = { class: "flex flex-col h-screen overflow-hidden bg-white" },
  ux = { class: "shrink-0 bg-white border-b border-border" },
  xx = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6" },
  dx = { class: "flex items-center gap-4" },
  px = { class: "flex items-center gap-3" },
  vx = ["disabled"],
  mx = { class: "flex-1 overflow-y-auto pt-6 pb-20 custom-scrollbar" },
  gx = { class: "space-y-6 px-6" },
  _x = { key: 0, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  Tx = { class: "border border-border rounded-xl bg-white" },
  Ex = { class: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-5" },
  wx = { class: "flex flex-wrap items-center gap-2" },
  Sx = ["disabled"],
  Ax = { class: "flex flex-wrap items-center gap-3 p-5 border-b border-border bg-gray-50/30" },
  Fx = { class: "flex-1 min-w-[200px]" },
  yx = { class: "w-48" },
  Cx = { class: "w-32" },
  Ox = { key: 0, class: "overflow-x-auto" },
  Dx = { class: "w-full" },
  Rx = { class: "divide-y divide-gray-100" },
  Ix = { class: "py-3 px-4 text-sm text-gray-600" },
  kx = { class: "py-3 px-4" },
  Nx = { class: "text-sm font-medium text-[#012D5A]" },
  Px = { class: "py-3 px-4 text-sm" },
  Lx = { class: "flex flex-col" },
  Mx = { class: "font-medium text-gray-900" },
  Bx = { class: "text-[10px] text-muted-foreground uppercase font-bold tracking-tight" },
  bx = { class: "py-3 px-4 text-sm text-right font-medium text-gray-700" },
  Ux = { class: "py-3 px-4 text-sm text-bold text-right text-orange-600" },
  Wx = { class: "py-3 px-4 text-center" },
  Hx = { class: "bg-gray-50/50 font-bold border-t border-border" },
  Vx = { class: "py-4 px-4 text-right text-sm text-[#012D5A] font-bold" },
  Gx = { class: "py-4 px-4 text-right text-sm text-orange-600 font-bold" },
  Xx = {
    key: 1,
    class: "flex items-center justify-between p-4 border-t border-border bg-gray-50/10",
  },
  zx = { class: "text-sm text-muted-foreground font-medium" },
  Kx = { key: 2, class: "flex flex-col items-center justify-center py-24 px-6" },
  Yx = { class: "w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4" },
  $x = { key: 3, class: "flex flex-col items-center justify-center py-24" },
  jx = us({
    __name: "outstanding",
    setup(e) {
      const { fetchOutstandingReport: t, isLoading: r } = os(),
        { companies: n, fetchCompanies: a } = cs(),
        i = _t({ companyId: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
        s = _t({ page: 1, limit: 10, total: 0 }),
        f = _t(null),
        o = async () => {
          const F = await t({
            companyId: i.value.companyId || void 0,
            month: i.value.month || void 0,
            year: i.value.year || void 0,
            page: s.value.page,
            limit: s.value.limit,
          });
          F.success && F.data && ((f.value = F.data), (s.value.total = F.data.pagination.total));
        };
      xs(
        i,
        () => {
          s.value.page = 1;
        },
        { deep: !0 },
      );
      const l = hs,
        c = (F) =>
          new Date(F).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        p = _t(!1),
        x = () => {
          if (f.value) {
            p.value = !0;
            try {
              const F = ["Inv Date", "Invoice No.", "Customer", "Total", "Outstanding", "Status"],
                L = f.value.invoices.map((U) => [
                  c(U.issuedDate),
                  U.invoiceNumber,
                  U.company.name,
                  U.total,
                  U.balanceDue,
                  U.status.name,
                ]);
              (L.push([]),
                L.push([
                  "",
                  "",
                  "GRAND TOTALS",
                  f.value.summary.totalInvoiced,
                  f.value.summary.totalOutstanding,
                  "",
                ]));
              const N = Un.aoa_to_sheet([F, ...L]),
                V = Un.book_new();
              (Un.book_append_sheet(V, N, "Outstanding Report"),
                qu(V, `OUTSTANDING_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`));
            } catch (F) {
              console.error("Export error:", F);
            } finally {
              p.value = !1;
            }
          }
        },
        d = [
          { label: "January", value: 1 },
          { label: "February", value: 2 },
          { label: "March", value: 3 },
          { label: "April", value: 4 },
          { label: "May", value: 5 },
          { label: "June", value: 6 },
          { label: "July", value: 7 },
          { label: "August", value: 8 },
          { label: "September", value: 9 },
          { label: "October", value: 10 },
          { label: "November", value: 11 },
          { label: "December", value: 12 },
        ],
        T = new Date().getFullYear(),
        u = Array.from({ length: 5 }, (F, L) => {
          const N = T - L;
          return { label: String(N), value: N };
        }),
        g = ds(),
        O = () => g.push("/finance/dashboard"),
        D = Xt(() =>
          f.value
            ? [
                {
                  title: "Total Invoiced",
                  value: l(f.value.summary.totalInvoiced),
                  changeLabel: `From ${f.value.summary.count} invoices`,
                  isPrimary: !1,
                },
                {
                  title: "Total Paid",
                  value: l(f.value.summary.totalPaid),
                  changeLabel: "Collected funds",
                  isPrimary: !1,
                },
                {
                  title: "Total Outstanding",
                  value: l(f.value.summary.totalOutstanding),
                  changeLabel: "Awaiting collection",
                  isPrimary: !0,
                },
              ]
            : [],
        ),
        C = Xt(() => [
          { name: "All Customers", id: "" },
          ...n.value.map((F) => ({ name: F.name, id: F.id })),
        ]),
        B = _t("/images/transparentnscontinenttebal.png"),
        K = Xt({ get: () => String(i.value.month), set: (F) => (i.value.month = Number(F)) }),
        q = Xt({ get: () => String(i.value.year), set: (F) => (i.value.year = Number(F)) });
      return (
        ps(() => {
          (typeof window < "u" &&
            (B.value = window.location.origin + "/images/transparentnscontinenttebal.png"),
            a({ type: "CUSTOMER" }),
            o());
        }),
        (F, L) => {
          const N = fs,
            V = ls;
          return (
            qe(),
            Cr("div", hx, [
              fe("div", ux, [
                fe("div", xx, [
                  fe("div", dx, [
                    fe(
                      "button",
                      {
                        onClick: O,
                        class:
                          "w-10 h-10 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-all active:scale-95",
                      },
                      [Xr(ce(ms), { class: "w-5 h-5" })],
                    ),
                    L[4] ||
                      (L[4] = fe(
                        "div",
                        null,
                        [
                          fe("h1", { class: "text-2xl font-bold" }, "Outstanding Payments"),
                          fe(
                            "p",
                            { class: "text-muted-foreground text-base" },
                            "Financial aging and collection report",
                          ),
                        ],
                        -1,
                      )),
                  ]),
                  fe("div", px, [
                    fe(
                      "button",
                      {
                        onClick: x,
                        disabled: ce(p) || !ce(f),
                        class:
                          "flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50",
                      },
                      [
                        ce(p)
                          ? (qe(), Tt(ce(Rn), { key: 1, class: "w-4 h-4 animate-spin" }))
                          : (qe(), Tt(ce(gs), { key: 0, class: "w-4 h-4 text-green-600" })),
                        L[5] ||
                          (L[5] = fe(
                            "span",
                            { class: "font-medium text-gray-700" },
                            "Export Excel",
                            -1,
                          )),
                      ],
                      8,
                      vx,
                    ),
                  ]),
                ]),
              ]),
              fe("div", mx, [
                fe("div", gx, [
                  ce(f)
                    ? (qe(),
                      Cr("div", _x, [
                        (qe(!0),
                        Cr(
                          E0,
                          null,
                          w0(
                            ce(D),
                            (U, X) => (
                              qe(), Tt(N, { key: X, card: U, index: X }, null, 8, ["card", "index"])
                            ),
                          ),
                          128,
                        )),
                      ]))
                    : zt("", !0),
                  fe("div", Tx, [
                    fe("div", Ex, [
                      L[7] ||
                        (L[7] = fe("h2", { class: "text-lg font-semibold" }, "Report Data", -1)),
                      fe("div", wx, [
                        fe(
                          "button",
                          {
                            onClick: o,
                            disabled: ce(r),
                            class:
                              "flex items-center gap-2 px-4 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-all active:scale-95 disabled:opacity-50",
                          },
                          [
                            ce(r)
                              ? (qe(), Tt(ce(Rn), { key: 1, class: "w-4 h-4 animate-spin" }))
                              : (qe(), Tt(ce(A0), { key: 0, class: "w-4 h-4" })),
                            L[6] || (L[6] = fe("span", null, "Generate Report", -1)),
                          ],
                          8,
                          Sx,
                        ),
                      ]),
                    ]),
                    fe("div", Ax, [
                      fe("div", Fx, [
                        Xr(
                          Dn,
                          {
                            modelValue: ce(i).companyId,
                            "onUpdate:modelValue": L[0] || (L[0] = (U) => (ce(i).companyId = U)),
                            options: ce(C),
                            "label-key": "name",
                            "value-key": "id",
                            placeholder: "All Customers",
                          },
                          null,
                          8,
                          ["modelValue", "options"],
                        ),
                      ]),
                      fe("div", yx, [
                        Xr(
                          Dn,
                          {
                            modelValue: ce(K),
                            "onUpdate:modelValue":
                              L[1] || (L[1] = (U) => (S0(K) ? (K.value = U) : null)),
                            options: d,
                            "label-key": "label",
                            "value-key": "value",
                            placeholder: "Month",
                          },
                          null,
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      fe("div", Cx, [
                        Xr(
                          Dn,
                          {
                            modelValue: ce(q),
                            "onUpdate:modelValue":
                              L[2] || (L[2] = (U) => (S0(q) ? (q.value = U) : null)),
                            options: ce(u),
                            "label-key": "label",
                            "value-key": "value",
                            placeholder: "Year",
                          },
                          null,
                          8,
                          ["modelValue", "options"],
                        ),
                      ]),
                    ]),
                    ce(f)
                      ? (qe(),
                        Cr("div", Ox, [
                          fe("table", Dx, [
                            L[10] ||
                              (L[10] = fe(
                                "thead",
                                null,
                                [
                                  fe("tr", { class: "border-b border-border bg-gray-50/50" }, [
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-left text-sm font-medium text-gray-500",
                                      },
                                      "Inv Date",
                                    ),
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-left text-sm font-medium text-gray-500",
                                      },
                                      "Invoice No.",
                                    ),
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-left text-sm font-medium text-gray-500",
                                      },
                                      "Customer",
                                    ),
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-right text-sm font-medium text-gray-500",
                                      },
                                      "Total",
                                    ),
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-right text-sm font-medium text-gray-500",
                                      },
                                      " Outstanding ",
                                    ),
                                    fe(
                                      "th",
                                      {
                                        class:
                                          "py-3 px-4 text-center text-sm font-medium text-gray-500",
                                      },
                                      "Status",
                                    ),
                                  ]),
                                ],
                                -1,
                              )),
                            fe("tbody", Rx, [
                              (qe(!0),
                              Cr(
                                E0,
                                null,
                                w0(
                                  ce(f).invoices,
                                  (U) => (
                                    qe(),
                                    Cr(
                                      "tr",
                                      { key: U.id, class: "hover:bg-gray-50/50 transition-colors" },
                                      [
                                        fe("td", Ix, cr(c(U.issuedDate)), 1),
                                        fe("td", kx, [fe("span", Nx, cr(U.invoiceNumber), 1)]),
                                        fe("td", Px, [
                                          fe("div", Lx, [
                                            fe("span", Mx, cr(U.company.name), 1),
                                            fe("span", Bx, cr(U.company.code), 1),
                                          ]),
                                        ]),
                                        fe("td", bx, cr(ce(l)(U.total)), 1),
                                        fe("td", Ux, cr(ce(l)(U.balanceDue)), 1),
                                        fe("td", Wx, [
                                          fe(
                                            "span",
                                            {
                                              class: vs([
                                                "px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider",
                                                U.status.code === "PARTIALLY_PAID"
                                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                                  : "bg-gray-50 text-gray-600 border-gray-200",
                                              ]),
                                            },
                                            cr(U.status.name),
                                            3,
                                          ),
                                        ]),
                                      ],
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]),
                            fe("tfoot", Hx, [
                              fe("tr", null, [
                                L[8] ||
                                  (L[8] = fe(
                                    "td",
                                    {
                                      colspan: "3",
                                      class:
                                        "py-4 px-4 text-sm text-gray-700 text-right uppercase tracking-wider",
                                    },
                                    " Grand Totals ",
                                    -1,
                                  )),
                                fe("td", Vx, cr(ce(l)(ce(f).summary.totalInvoiced)), 1),
                                fe("td", Gx, cr(ce(l)(ce(f).summary.totalOutstanding)), 1),
                                L[9] || (L[9] = fe("td", null, null, -1)),
                              ]),
                            ]),
                          ]),
                        ]))
                      : zt("", !0),
                    ce(f) && ce(s).total > 0
                      ? (qe(),
                        Cr("div", Xx, [
                          fe(
                            "p",
                            zx,
                            " Showing " +
                              cr((ce(s).page - 1) * ce(s).limit + 1) +
                              " to " +
                              cr(Math.min(ce(s).page * ce(s).limit, ce(s).total)) +
                              " of " +
                              cr(ce(s).total) +
                              " results ",
                            1,
                          ),
                          Xr(
                            V,
                            {
                              page: ce(s).page,
                              "onUpdate:page": [L[3] || (L[3] = (U) => (ce(s).page = U)), o],
                              total: ce(s).total,
                              "items-per-page": ce(s).limit,
                            },
                            null,
                            8,
                            ["page", "total", "items-per-page"],
                          ),
                        ]))
                      : ce(r)
                        ? zt("", !0)
                        : (qe(),
                          Cr("div", Kx, [
                            fe("div", Yx, [Xr(ce(A0), { class: "w-8 h-8 text-gray-300" })]),
                            L[11] ||
                              (L[11] = fe(
                                "h3",
                                { class: "text-lg font-semibold text-gray-900 mb-1" },
                                "Generate Report",
                                -1,
                              )),
                            L[12] ||
                              (L[12] = fe(
                                "p",
                                { class: "text-muted-foreground text-center max-w-sm text-sm" },
                                " Select filters above and click generate to analyze outstanding payments. ",
                                -1,
                              )),
                          ])),
                    ce(r)
                      ? (qe(),
                        Cr("div", $x, [
                          Xr(ce(Rn), {
                            class: "w-10 h-10 animate-spin text-[#012D5A] opacity-20 mb-4",
                          }),
                          L[13] ||
                            (L[13] = fe(
                              "p",
                              { class: "text-sm font-medium text-muted-foreground animate-pulse" },
                              " Calculating balances... ",
                              -1,
                            )),
                        ]))
                      : zt("", !0),
                  ]),
                ]),
              ]),
            ])
          );
        }
      );
    },
  }),
  u2 = _s(jx, [["__scopeId", "data-v-74907b38"]]);
export { u2 as default };
