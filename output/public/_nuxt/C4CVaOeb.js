import {
  e as z,
  q as J,
  r as y,
  N as C,
  o as O,
  aj as F,
  O as u,
  a2 as h,
  ap as I,
  P as U,
  af as q,
  R as c,
  S as i,
  Q as t,
  V as x,
  T as D,
  K as s,
  a0 as K,
  ae as P,
  a8 as Q,
  t as R,
  _ as d,
} from "./D9q6143x.js";
import { _ as X } from "./CUYdA7L4.js";
import { _ as G } from "./Rkz5wlRr.js";
import { _ as H } from "./C57YAU4g.js";
import { useCompanyAddressForm as W } from "./b429KWHv.js";
import { u as Y } from "./CJdNv5wq.js";
import { _ as Z } from "./DlAUqK2U.js";
import "./CWUm5Boh.js";
import "./DvCSiYg8.js";
import "./DLVTjFfJ.js";
import "./DOtcRZfx.js";
import "./DeUJRdQC.js";
import "./p41O2Qdo.js";
import "./DhzAXlPS.js";
import "./CF_HezSe.js";
import "./CEUvAbAU.js";
import "./Ch8fDJ4_.js";
import "./B_vq8aUR.js";
import "./D0tO-5lw.js";
import "./BT3qE56k.js";
const ee = { key: 0, class: "fixed inset-0 z-[1050] flex justify-end" },
  se = { key: 0, class: "flex items-center justify-center h-full" },
  te = { key: 1, class: "w-full h-full bg-white flex flex-col overflow-hidden" },
  oe = {
    class:
      "px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20",
  },
  ae = { class: "flex items-center gap-2 text-sm text-muted-foreground font-medium" },
  de = { class: "text-foreground" },
  ne = { class: "text-foreground" },
  le = { class: "flex items-center gap-2" },
  ie = { class: "self-stretch flex-1 flex justify-start items-stretch overflow-hidden" },
  re = z({
    __name: "CompanyDetailModal",
    props: { modelValue: { type: Boolean }, company: {} },
    emits: ["update:modelValue"],
    setup(T, { emit: V }) {
      const r = T,
        E = V,
        { getCompanyDetails: N } = Y(),
        m = J({ get: () => r.modelValue, set: (a) => E("update:modelValue", a) }),
        p = y("Activity"),
        j = ["Activity", "Job", "Invoice", "Address", "Notes"],
        o = y(null),
        v = y(!1),
        {
          activeAddressMenu: A,
          showAddressMenu: g,
          closeAddressMenu: f,
          addressMode: n,
          editingAddress: S,
          openAddAddressMode: b,
          openEditAddressMode: w,
          closeAddressMode: _,
          handleAddressSave: B,
          handleDeleteAddress: k,
          companyAddresses: L,
        } = W(o);
      (C(
        () => r.modelValue,
        async (a) => {
          if (a && r.company?.id) {
            ((p.value = "Activity"), (v.value = !0));
            const { success: e, data: l } = await N(r.company.id);
            (e && l && (o.value = l), (v.value = !1));
          }
        },
      ),
        C(
          () => r.modelValue,
          (a) => {
            a || (_(), f(), (o.value = null));
          },
        ));
      const $ = () => {
          ((m.value = !1), R("/operational/jobs/create"));
        },
        M = (a) => {
          a.target.closest(".address-menu-container") || f();
        };
      return (
        O(() => {
          document.addEventListener("click", M);
        }),
        F(() => {
          document.removeEventListener("click", M);
        }),
        (a, e) => (
          d(),
          u(q, { to: "body" }, [
            h(
              I,
              { name: "slide-over" },
              {
                default: U(() => [
                  m.value
                    ? (d(),
                      c("div", ee, [
                        t("div", {
                          class: "absolute inset-0 bg-black/40 transition-opacity",
                          onClick: e[0] || (e[0] = (l) => (m.value = !1)),
                        }),
                        t(
                          "div",
                          {
                            class:
                              "slide-panel relative w-full bg-white h-full shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300",
                            style: Q(
                              s(n) !== "view"
                                ? "max-width: 600px;"
                                : "max-width: calc(100vw - 320px);",
                            ),
                          },
                          [
                            v.value
                              ? (d(),
                                c("div", se, [
                                  ...(e[3] ||
                                    (e[3] = [
                                      t(
                                        "div",
                                        { class: "flex flex-col items-center gap-3" },
                                        [
                                          t("div", {
                                            class:
                                              "h-10 w-10 animate-spin rounded-full border-4 border-[#012D5A] border-t-transparent",
                                          }),
                                          t(
                                            "p",
                                            { class: "text-sm text-gray-500" },
                                            "Loading company details...",
                                          ),
                                        ],
                                        -1,
                                      ),
                                    ])),
                                ]))
                              : o.value
                                ? (d(),
                                  c("div", te, [
                                    t("div", oe, [
                                      t("div", ae, [
                                        e[7] || (e[7] = x(" Master Data ", -1)),
                                        e[8] || (e[8] = t("span", { class: "mx-1" }, "›", -1)),
                                        e[9] || (e[9] = x(" Company ", -1)),
                                        e[10] || (e[10] = t("span", { class: "mx-1" }, "›", -1)),
                                        t("span", de, D(o.value.name), 1),
                                        s(n) !== "view"
                                          ? (d(),
                                            c(
                                              K,
                                              { key: 0 },
                                              [
                                                e[4] ||
                                                  (e[4] = t("span", { class: "mx-1" }, "›", -1)),
                                                e[5] || (e[5] = x(" Address ", -1)),
                                                e[6] ||
                                                  (e[6] = t("span", { class: "mx-1" }, "›", -1)),
                                                t(
                                                  "span",
                                                  ne,
                                                  D(s(n) === "add" ? "Add" : "Edit"),
                                                  1,
                                                ),
                                              ],
                                              64,
                                            ))
                                          : i("", !0),
                                      ]),
                                      t("div", le, [
                                        t(
                                          "button",
                                          {
                                            onClick: e[1] || (e[1] = (l) => (m.value = !1)),
                                            class:
                                              "p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                                          },
                                          [h(s(P), { class: "w-5 h-5" })],
                                        ),
                                      ]),
                                    ]),
                                    t("div", ie, [
                                      s(n) === "view"
                                        ? (d(),
                                          u(
                                            X,
                                            {
                                              key: 0,
                                              company: o.value,
                                              addresses: s(L),
                                              "active-address-menu": s(A),
                                              onNewJob: $,
                                              onAddAddress: s(b),
                                              onEditAddress: s(w),
                                              onToggleMenu: s(g),
                                              onCloseMenu: s(f),
                                              onDeleteAddress: s(k),
                                            },
                                            null,
                                            8,
                                            [
                                              "company",
                                              "addresses",
                                              "active-address-menu",
                                              "onAddAddress",
                                              "onEditAddress",
                                              "onToggleMenu",
                                              "onCloseMenu",
                                              "onDeleteAddress",
                                            ],
                                          ))
                                        : i("", !0),
                                      s(n) !== "view"
                                        ? (d(),
                                          u(
                                            H,
                                            {
                                              key: 1,
                                              mode: s(n),
                                              "company-id": o.value.id,
                                              address: s(S),
                                              onCancel: s(_),
                                              onSave: s(B),
                                            },
                                            null,
                                            8,
                                            ["mode", "company-id", "address", "onCancel", "onSave"],
                                          ))
                                        : i("", !0),
                                      s(n) === "view"
                                        ? (d(),
                                          u(
                                            G,
                                            {
                                              key: 2,
                                              company: o.value,
                                              "active-tab": p.value,
                                              "tab-list": j,
                                              "active-address-menu": s(A),
                                              "onUpdate:activeTab":
                                                e[2] || (e[2] = (l) => (p.value = l)),
                                              onAddAddress: s(b),
                                              onEditAddress: s(w),
                                              onToggleMenu: s(g),
                                              onDeleteAddress: s(k),
                                            },
                                            null,
                                            8,
                                            [
                                              "company",
                                              "active-tab",
                                              "active-address-menu",
                                              "onAddAddress",
                                              "onEditAddress",
                                              "onToggleMenu",
                                              "onDeleteAddress",
                                            ],
                                          ))
                                        : i("", !0),
                                    ]),
                                  ]))
                                : i("", !0),
                          ],
                          4,
                        ),
                      ]))
                    : i("", !0),
                ]),
                _: 1,
              },
            ),
          ])
        )
      );
    },
  }),
  Ee = Z(re, [["__scopeId", "data-v-9b3c022e"]]);
export { Ee as default };
