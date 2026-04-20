import {
  e as g,
  r as f,
  N as m,
  R as C,
  Q as e,
  T as c,
  U as r,
  V as x,
  W as a,
  a3 as y,
  _ as V,
} from "./D9q6143x.js";
const w = { class: "flex-1 self-stretch flex flex-col overflow-hidden" },
  E = { class: "self-stretch flex-1 p-6 overflow-y-auto" },
  U = { class: "self-stretch flex flex-col gap-6" },
  S = { class: "text-black text-lg font-semibold font-['Inter'] leading-7" },
  k = { class: "self-stretch flex flex-col gap-4" },
  A = { class: "flex flex-col gap-1.5" },
  h = { class: "flex flex-col gap-1.5" },
  B = { class: "flex flex-col gap-1.5" },
  I = { class: "flex flex-col gap-1.5" },
  N = { class: "grid grid-cols-2 gap-4" },
  D = { class: "flex flex-col gap-1.5" },
  M = { class: "flex flex-col gap-1.5" },
  T = { class: "grid grid-cols-2 gap-4" },
  F = { class: "flex flex-col gap-1.5" },
  O = { class: "flex flex-col gap-1.5" },
  R = { class: "flex flex-col gap-1.5" },
  W = {
    class: "self-stretch border-t border-slate-300 flex justify-end gap-3 p-4 bg-white shrink-0",
  },
  j = ["disabled"],
  H = g({
    __name: "CompanyAddressForm",
    props: { mode: {}, companyId: {}, address: {} },
    emits: ["cancel", "save"],
    setup(i, { emit: v }) {
      const d = i,
        p = v,
        u = {
          label: "",
          type: "main",
          fullAddress: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "id",
          eori: "",
        },
        l = f({ ...u });
      (m(
        () => d.address,
        (o) => {
          d.mode === "edit" && o
            ? (l.value = {
                label: o.label || "",
                type: "main",
                fullAddress: o.fullAddress || "",
                street: o.street || "",
                city: o.city || "",
                state: o.state || "",
                postalCode: o.postalCode || "",
                country: o.country || "id",
                eori: o.eori || "",
              })
            : d.mode === "add" && (l.value = { ...u });
        },
        { immediate: !0 },
      ),
        m(
          () => d.mode,
          (o) => {
            o === "add" && (l.value = { ...u });
          },
        ));
      const n = f(!1),
        b = async () => {
          if (!n.value) {
            n.value = !0;
            try {
              p("save", l.value);
            } finally {
              n.value = !1;
            }
          }
        };
      return (o, t) => (
        V(),
        C("div", w, [
          e("div", E, [
            e("div", U, [
              e("div", S, c(i.mode === "add" ? "Add New Address" : "Edit Address"), 1),
              e("div", k, [
                e("div", A, [
                  t[10] ||
                    (t[10] = e(
                      "label",
                      { class: "text-sm font-medium text-slate-700" },
                      [x("Address Label "), e("span", { class: "text-red-500" }, "*")],
                      -1,
                    )),
                  r(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue": t[0] || (t[0] = (s) => (l.value.label = s)),
                        type: "text",
                        placeholder: "e.g., Head Office, Branch, Warehouse",
                        class:
                          "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      },
                      null,
                      512,
                    ),
                    [[a, l.value.label]],
                  ),
                ]),
                e("div", h, [
                  t[12] ||
                    (t[12] = e(
                      "label",
                      { class: "text-sm font-medium text-slate-700" },
                      "Type",
                      -1,
                    )),
                  r(
                    e(
                      "select",
                      {
                        "onUpdate:modelValue": t[1] || (t[1] = (s) => (l.value.type = s)),
                        class:
                          "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      },
                      [
                        ...(t[11] ||
                          (t[11] = [
                            e("option", { value: "main" }, "Main", -1),
                            e("option", { value: "branch" }, "Branch", -1),
                            e("option", { value: "warehouse" }, "Warehouse", -1),
                          ])),
                      ],
                      512,
                    ),
                    [[y, l.value.type]],
                  ),
                ]),
                e("div", B, [
                  t[13] ||
                    (t[13] = e(
                      "label",
                      { class: "text-sm font-medium text-slate-700" },
                      [x("Full Address "), e("span", { class: "text-red-500" }, "*")],
                      -1,
                    )),
                  r(
                    e(
                      "textarea",
                      {
                        "onUpdate:modelValue": t[2] || (t[2] = (s) => (l.value.fullAddress = s)),
                        rows: "3",
                        placeholder: "Enter full address",
                        class:
                          "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none",
                      },
                      null,
                      512,
                    ),
                    [[a, l.value.fullAddress]],
                  ),
                ]),
                e("div", I, [
                  t[14] ||
                    (t[14] = e(
                      "label",
                      { class: "text-sm font-medium text-slate-700" },
                      "Street",
                      -1,
                    )),
                  r(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue": t[3] || (t[3] = (s) => (l.value.street = s)),
                        type: "text",
                        placeholder: "Enter street name",
                        class:
                          "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      },
                      null,
                      512,
                    ),
                    [[a, l.value.street]],
                  ),
                ]),
                e("div", N, [
                  e("div", D, [
                    t[15] ||
                      (t[15] = e(
                        "label",
                        { class: "text-sm font-medium text-slate-700" },
                        "City",
                        -1,
                      )),
                    r(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue": t[4] || (t[4] = (s) => (l.value.city = s)),
                          type: "text",
                          placeholder: "Enter city",
                          class:
                            "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        },
                        null,
                        512,
                      ),
                      [[a, l.value.city]],
                    ),
                  ]),
                  e("div", M, [
                    t[16] ||
                      (t[16] = e(
                        "label",
                        { class: "text-sm font-medium text-slate-700" },
                        "State",
                        -1,
                      )),
                    r(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue": t[5] || (t[5] = (s) => (l.value.state = s)),
                          type: "text",
                          placeholder: "Enter state/province",
                          class:
                            "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        },
                        null,
                        512,
                      ),
                      [[a, l.value.state]],
                    ),
                  ]),
                ]),
                e("div", T, [
                  e("div", F, [
                    t[17] ||
                      (t[17] = e(
                        "label",
                        { class: "text-sm font-medium text-slate-700" },
                        "Postal Code",
                        -1,
                      )),
                    r(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue": t[6] || (t[6] = (s) => (l.value.postalCode = s)),
                          type: "text",
                          placeholder: "Enter postal code",
                          class:
                            "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        },
                        null,
                        512,
                      ),
                      [[a, l.value.postalCode]],
                    ),
                  ]),
                  e("div", O, [
                    t[19] ||
                      (t[19] = e(
                        "label",
                        { class: "text-sm font-medium text-slate-700" },
                        "Country",
                        -1,
                      )),
                    r(
                      e(
                        "select",
                        {
                          "onUpdate:modelValue": t[7] || (t[7] = (s) => (l.value.country = s)),
                          class:
                            "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        },
                        [
                          ...(t[18] ||
                            (t[18] = [
                              e("option", { value: "id" }, "Indonesia", -1),
                              e("option", { value: "sg" }, "Singapore", -1),
                              e("option", { value: "my" }, "Malaysia", -1),
                            ])),
                        ],
                        512,
                      ),
                      [[y, l.value.country]],
                    ),
                  ]),
                ]),
                e("div", R, [
                  t[20] ||
                    (t[20] = e(
                      "label",
                      { class: "text-sm font-medium text-slate-700" },
                      "EORI Number",
                      -1,
                    )),
                  r(
                    e(
                      "input",
                      {
                        "onUpdate:modelValue": t[8] || (t[8] = (s) => (l.value.eori = s)),
                        type: "text",
                        placeholder: "Enter EORI number",
                        class:
                          "w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      },
                      null,
                      512,
                    ),
                    [[a, l.value.eori]],
                  ),
                ]),
              ]),
            ]),
          ]),
          e("div", W, [
            e(
              "button",
              {
                class:
                  "px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors",
                onClick: t[9] || (t[9] = (s) => p("cancel")),
              },
              " Cancel ",
            ),
            e(
              "button",
              {
                class:
                  "px-4 py-2 bg-primary rounded-md text-sm text-white hover:bg-primary/90 transition-colors disabled:opacity-50",
                disabled: n.value || !l.value.label || !l.value.fullAddress,
                onClick: b,
              },
              c(i.mode === "add" ? "Add Address" : "Save Changes"),
              9,
              j,
            ),
          ]),
        ])
      );
    },
  });
export { H as _ };
