import { _ as g } from "./CF_HezSe.js";
import { _ } from "./Ch8fDJ4_.js";
import { _ as h } from "./B_vq8aUR.js";
import { _ as j } from "./D0tO-5lw.js";
import { _ as k } from "./BT3qE56k.js";
import {
  e as T,
  q as r,
  R as n,
  Q as e,
  T as f,
  K as l,
  a0 as A,
  a1 as w,
  O as c,
  $ as m,
  _ as a,
} from "./D9q6143x.js";
const C = {
    class: "flex-1 self-stretch flex flex-col justify-center items-end gap-4 overflow-hidden",
  },
  I = { class: "self-stretch flex-1 flex flex-col justify-start items-start overflow-hidden" },
  $ = { class: "self-stretch p-5 flex justify-start items-center gap-4" },
  B = {
    class:
      "flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start",
  },
  D = {
    class: "text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6",
  },
  J = {
    class:
      "flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start",
  },
  L = {
    class: "text-center justify-start text-black text-base font-semibold font-['Inter'] leading-6",
  },
  M = { key: 0 },
  V = { key: 1 },
  N = { key: 2 },
  E = { key: 3 },
  S = {
    class:
      "flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start",
  },
  q = {
    class:
      "text-center justify-start text-[#012D5A] text-base font-semibold font-['Inter'] leading-6",
  },
  z = {
    class: "self-stretch flex flex-col justify-start items-start gap-4 flex-1 overflow-hidden",
  },
  F = {
    class:
      "self-stretch border-b border-black/5 flex justify-start items-start gap-2.5 overflow-hidden shrink-0",
  },
  K = ["onClick"],
  O = {
    class:
      "self-stretch px-5 flex flex-col justify-start items-start gap-4 overflow-y-auto flex-1 pb-4",
  },
  Q = { key: 5, class: "w-full py-12 flex flex-col items-center justify-center text-gray-400" },
  R = { class: "text-sm" },
  tt = T({
    __name: "CompanyMainContent",
    props: { company: {}, activeTab: {}, tabList: {}, activeAddressMenu: {} },
    emits: ["update:activeTab", "add-address", "edit-address", "delete-address", "toggle-menu"],
    setup(t, { emit: x }) {
      const i = t,
        d = x,
        y = r(() => i.company.addresses || []),
        v = r(() => i.company.activities || []),
        u = r(() => i.company.jobs || []),
        b = r(() => i.company.invoices || []),
        p = r(() => i.company.totalJobs || 0);
      return (G, s) => (
        a(),
        n("div", C, [
          e("div", I, [
            e("div", $, [
              e("div", B, [
                s[4] ||
                  (s[4] = e(
                    "div",
                    {
                      class:
                        "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5",
                    },
                    " Total Job ",
                    -1,
                  )),
                e("div", D, f(l(p)), 1),
              ]),
              e("div", J, [
                s[5] ||
                  (s[5] = e(
                    "div",
                    {
                      class:
                        "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5",
                    },
                    " Type ",
                    -1,
                  )),
                e("div", L, [
                  t.company.isCustomer && t.company.isVendor
                    ? (a(), n("span", M, "Both"))
                    : t.company.isCustomer
                      ? (a(), n("span", V, "Customer"))
                      : t.company.isVendor
                        ? (a(), n("span", N, "Vendor"))
                        : (a(), n("span", E, "-")),
                ]),
              ]),
              e("div", S, [
                s[6] ||
                  (s[6] = e(
                    "div",
                    {
                      class:
                        "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5",
                    },
                    " Status ",
                    -1,
                  )),
                e("div", q, f(t.company.isActive ? "Active" : "Inactive"), 1),
              ]),
            ]),
            e("div", z, [
              e("div", F, [
                (a(!0),
                n(
                  A,
                  null,
                  w(
                    t.tabList,
                    (o) => (
                      a(),
                      n(
                        "div",
                        {
                          key: o,
                          onClick: (H) => d("update:activeTab", o),
                          class: m([
                            "px-4 py-3 border-b inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden cursor-pointer transition-colors",
                            t.activeTab === o
                              ? "border-[#012D5A]"
                              : "border-transparent hover:border-gray-200",
                          ]),
                        },
                        [
                          e(
                            "div",
                            {
                              class: m([
                                "justify-start text-sm leading-5",
                                t.activeTab === o
                                  ? "text-[#012D5A] font-semibold font-['Inter']"
                                  : "text-black font-normal font-['Inter']",
                              ]),
                            },
                            f(o),
                            3,
                          ),
                        ],
                        10,
                        K,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
              e("div", O, [
                t.activeTab === "Activity"
                  ? (a(), c(g, { key: 0, activities: l(v) }, null, 8, ["activities"]))
                  : t.activeTab === "Job"
                    ? (a(),
                      c(_, { key: 1, jobs: l(u), "company-code": t.company.code }, null, 8, [
                        "jobs",
                        "company-code",
                      ]))
                    : t.activeTab === "Invoice"
                      ? (a(), c(h, { key: 2, invoices: l(b) }, null, 8, ["invoices"]))
                      : t.activeTab === "Address"
                        ? (a(),
                          c(
                            j,
                            {
                              key: 3,
                              addresses: l(y),
                              "active-address-menu": t.activeAddressMenu,
                              onAddAddress: s[0] || (s[0] = (o) => d("add-address")),
                              onEditAddress: s[1] || (s[1] = (o) => d("edit-address", o)),
                              onDeleteAddress: s[2] || (s[2] = (o) => d("delete-address", o)),
                              onToggleMenu: s[3] || (s[3] = (o) => d("toggle-menu", o)),
                            },
                            null,
                            8,
                            ["addresses", "active-address-menu"],
                          ))
                        : t.activeTab === "Notes"
                          ? (a(), c(k, { key: 4, notes: t.company.notes }, null, 8, ["notes"]))
                          : (a(),
                            n("div", Q, [
                              e(
                                "p",
                                R,
                                "No data available for " + f(t.activeTab.toLowerCase()) + " yet.",
                                1,
                              ),
                            ])),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { tt as _ };
