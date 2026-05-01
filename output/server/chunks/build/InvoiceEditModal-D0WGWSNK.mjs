import { _ as __nuxt_component_0 } from "./Modal-DzxIm9v2.mjs";
import {
  defineComponent,
  mergeProps,
  withCtx,
  unref,
  createVNode,
  withModifiers,
  createBlock,
  createCommentVNode,
  openBlock,
  toDisplayString,
  withDirectives,
  createTextVNode,
  vModelText,
  Fragment,
  renderList,
  vModelSelect,
  useSSRContext,
} from "vue";
import {
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
} from "vue/server-renderer";
import { Plus, Trash2, Save } from "lucide-vue-next";
import { f as formatRupiah } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InvoiceEditModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    isSubmitting: { type: Boolean },
    editError: {},
    formData: {},
    selectedTaxRate: {},
    statusOptions: {},
    taxOptions: {},
    companies: {},
    jobs: {},
    services: {},
  },
  emits: ["close", "submit", "addLineItem", "removeLineItem", "updateItemAmount", "updateTaxRate"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const formatCurrency = formatRupiah;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0;
      _push(
        ssrRenderComponent(
          _component_UiModal,
          mergeProps(
            {
              "model-value": __props.isOpen,
              title: "Edit Invoice",
              description: "Ubah semua detail invoice",
              width: "max-w-4xl",
              "onUpdate:modelValue": (val) => !val && emit("close"),
              onClose: ($event) => emit("close"),
            },
            _attrs,
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<form class="space-y-6"${_scopeId}>`);
                if (__props.editError) {
                  _push2(
                    `<div class="p-4 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(__props.editError)}</p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Nomor Invoice <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", __props.formData.invoiceNumber)} type="text" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Status Invoice <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(__props.formData.statusId) ? ssrLooseContain(__props.formData.statusId, "") : ssrLooseEqual(__props.formData.statusId, "")) ? " selected" : ""}${_scopeId}>Pilih status</option><!--[-->`,
                );
                ssrRenderList(__props.statusOptions, (status) => {
                  _push2(
                    `<option${ssrRenderAttr("value", status.id)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.statusId) ? ssrLooseContain(__props.formData.statusId, status.id) : ssrLooseEqual(__props.formData.statusId, status.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(status.name)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Tanggal Invoice <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", __props.formData.issuedDate)} type="date" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Jatuh Tempo <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", __props.formData.dueDate)} type="date" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Customer <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(__props.formData.companyId) ? ssrLooseContain(__props.formData.companyId, "") : ssrLooseEqual(__props.formData.companyId, "")) ? " selected" : ""}${_scopeId}>Pilih customer</option><!--[-->`,
                );
                ssrRenderList(__props.companies, (company) => {
                  _push2(
                    `<option${ssrRenderAttr("value", company.id)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.companyId) ? ssrLooseContain(__props.formData.companyId, company.id) : ssrLooseEqual(__props.formData.companyId, company.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(company.name)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Job Reference </label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(__props.formData.jobId) ? ssrLooseContain(__props.formData.jobId, "") : ssrLooseEqual(__props.formData.jobId, "")) ? " selected" : ""}${_scopeId}>Pilih job (opsional)</option><!--[-->`,
                );
                ssrRenderList(__props.jobs, (job) => {
                  _push2(
                    `<option${ssrRenderAttr("value", job.id)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.jobId) ? ssrLooseContain(__props.formData.jobId, job.id) : ssrLooseEqual(__props.formData.jobId, job.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(job.jobNumber)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div></div><div class="space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Item Invoice <span class="text-red-500"${_scopeId}>*</span></label><button type="button" class="text-sm text-[#012D5A] hover:text-[#012D5A]/80 font-medium flex items-center gap-1"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(
                  ` Tambah Item </button></div><div class="border border-border rounded-lg overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead class="bg-muted"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left font-medium text-foreground w-1/3"${_scopeId}>Deskripsi</th><th class="px-3 py-2 text-left font-medium text-foreground"${_scopeId}>Service</th><th class="px-3 py-2 text-center font-medium text-foreground w-20"${_scopeId}>Qty</th><th class="px-3 py-2 text-right font-medium text-foreground"${_scopeId}>Harga Satuan</th><th class="px-3 py-2 text-right font-medium text-foreground"${_scopeId}>Jumlah</th><th class="px-3 py-2 w-10"${_scopeId}></th></tr></thead><tbody class="divide-y divide-border"${_scopeId}><!--[-->`,
                );
                ssrRenderList(__props.formData.items, (item, index) => {
                  _push2(
                    `<tr class="hover:bg-muted/50"${_scopeId}><td class="p-2"${_scopeId}><input${ssrRenderAttr("value", item.description)} type="text" placeholder="Deskripsi" class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm" required${_scopeId}></td><td class="p-2"${_scopeId}><select class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(item.serviceId) ? ssrLooseContain(item.serviceId, "") : ssrLooseEqual(item.serviceId, "")) ? " selected" : ""}${_scopeId}>Pilih service</option><!--[-->`,
                  );
                  ssrRenderList(__props.services, (service) => {
                    _push2(
                      `<option${ssrRenderAttr("value", service.id)}${ssrIncludeBooleanAttr(Array.isArray(item.serviceId) ? ssrLooseContain(item.serviceId, service.id) : ssrLooseEqual(item.serviceId, service.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(service.name)}</option>`,
                    );
                  });
                  _push2(
                    `<!--]--></select></td><td class="p-2"${_scopeId}><input${ssrRenderAttr("value", item.quantity)} type="number" min="1" class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-center" required${_scopeId}></td><td class="p-2"${_scopeId}><input${ssrRenderAttr("value", item.unitPrice)} type="number" min="0" class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-right" required${_scopeId}></td><td class="p-2 text-right font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.amount))}</td><td class="p-2"${_scopeId}><button type="button" class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(Trash2),
                      { class: "w-4 h-4" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</button></td></tr>`);
                });
                _push2(
                  `<!--]--></tbody></table></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>PPN</label><select${ssrRenderAttr("model-value", __props.selectedTaxRate)} class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"${_scopeId}><!--[-->`,
                );
                ssrRenderList(__props.taxOptions, (tax) => {
                  _push2(
                    `<option${ssrRenderAttr("value", tax.value)}${_scopeId}>${ssrInterpolate(tax.label)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Catatan</label><textarea rows="2" placeholder="Catatan invoice (opsional)" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"${_scopeId}>${ssrInterpolate(__props.formData.notes)}</textarea></div></div><div class="border-t border-border pt-4"${_scopeId}><div class="flex justify-end"${_scopeId}><div class="w-64 space-y-2"${_scopeId}><div class="flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Subtotal:</span><span class="font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(__props.formData.subTotal))}</span></div><div class="flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Pajak (PPN):</span><span class="font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(__props.formData.taxAmount))}</span></div><div class="flex justify-between pt-2 border-t border-border"${_scopeId}><span class="font-semibold"${_scopeId}>Total:</span><span class="font-semibold text-lg"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(__props.formData.total))}</span></div></div></div></div><div class="flex justify-end gap-3 pt-4 border-t border-border"${_scopeId}><button type="button" class="btn-secondary"${_scopeId}>Batal</button><button type="submit"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="btn-primary flex items-center gap-2"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(
                  ` ${ssrInterpolate(__props.isSubmitting ? "Menyimpan..." : "Simpan")}</button></div></form>`,
                );
              } else {
                return [
                  createVNode(
                    "form",
                    {
                      class: "space-y-6",
                      onSubmit: withModifiers(($event) => emit("submit"), ["prevent"]),
                    },
                    [
                      __props.editError
                        ? (openBlock(),
                          createBlock(
                            "div",
                            {
                              key: 0,
                              class: "p-4 bg-red-50 border border-red-200 rounded-lg",
                            },
                            [
                              createVNode(
                                "p",
                                { class: "text-sm text-red-600" },
                                toDisplayString(__props.editError),
                                1,
                              ),
                            ],
                          ))
                        : createCommentVNode("", true),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Nomor Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.invoiceNumber = $event),
                                type: "text",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, __props.formData.invoiceNumber]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Status Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.statusId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              [
                                createVNode(
                                  "option",
                                  {
                                    value: "",
                                    disabled: "",
                                  },
                                  "Pilih status",
                                ),
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(__props.statusOptions, (status) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "option",
                                        {
                                          key: status.id,
                                          value: status.id,
                                        },
                                        toDisplayString(status.name),
                                        9,
                                        ["value"],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, __props.formData.statusId]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Tanggal Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.issuedDate = $event),
                                type: "date",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, __props.formData.issuedDate]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Jatuh Tempo "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.dueDate = $event),
                                type: "date",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, __props.formData.dueDate]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Customer "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.companyId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              [
                                createVNode(
                                  "option",
                                  {
                                    value: "",
                                    disabled: "",
                                  },
                                  "Pilih customer",
                                ),
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(__props.companies, (company) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "option",
                                        {
                                          key: company.id,
                                          value: company.id,
                                        },
                                        toDisplayString(company.name),
                                        9,
                                        ["value"],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, __props.formData.companyId]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            " Job Reference ",
                          ),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.jobId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              },
                              [
                                createVNode("option", { value: "" }, "Pilih job (opsional)"),
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(__props.jobs, (job) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "option",
                                        {
                                          key: job.id,
                                          value: job.id,
                                        },
                                        toDisplayString(job.jobNumber),
                                        9,
                                        ["value"],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, __props.formData.jobId]],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Item Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          createVNode(
                            "button",
                            {
                              type: "button",
                              onClick: ($event) => emit("addLineItem"),
                              class:
                                "text-sm text-[#012D5A] hover:text-[#012D5A]/80 font-medium flex items-center gap-1",
                            },
                            [
                              createVNode(unref(Plus), { class: "w-4 h-4" }),
                              createTextVNode(" Tambah Item "),
                            ],
                            8,
                            ["onClick"],
                          ),
                        ]),
                        createVNode(
                          "div",
                          { class: "border border-border rounded-lg overflow-hidden" },
                          [
                            createVNode("table", { class: "w-full text-sm" }, [
                              createVNode("thead", { class: "bg-muted" }, [
                                createVNode("tr", null, [
                                  createVNode(
                                    "th",
                                    {
                                      class:
                                        "px-3 py-2 text-left font-medium text-foreground w-1/3",
                                    },
                                    "Deskripsi",
                                  ),
                                  createVNode(
                                    "th",
                                    { class: "px-3 py-2 text-left font-medium text-foreground" },
                                    "Service",
                                  ),
                                  createVNode(
                                    "th",
                                    {
                                      class:
                                        "px-3 py-2 text-center font-medium text-foreground w-20",
                                    },
                                    "Qty",
                                  ),
                                  createVNode(
                                    "th",
                                    { class: "px-3 py-2 text-right font-medium text-foreground" },
                                    "Harga Satuan",
                                  ),
                                  createVNode(
                                    "th",
                                    { class: "px-3 py-2 text-right font-medium text-foreground" },
                                    "Jumlah",
                                  ),
                                  createVNode("th", { class: "px-3 py-2 w-10" }),
                                ]),
                              ]),
                              createVNode("tbody", { class: "divide-y divide-border" }, [
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(__props.formData.items, (item, index) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "tr",
                                        {
                                          key: index,
                                          class: "hover:bg-muted/50",
                                        },
                                        [
                                          createVNode("td", { class: "p-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.description = $event),
                                                  type: "text",
                                                  placeholder: "Deskripsi",
                                                  class:
                                                    "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                                                  required: "",
                                                },
                                                null,
                                                8,
                                                ["onUpdate:modelValue"],
                                              ),
                                              [[vModelText, item.description]],
                                            ),
                                          ]),
                                          createVNode("td", { class: "p-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "select",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.serviceId = $event),
                                                  class:
                                                    "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                                                },
                                                [
                                                  createVNode(
                                                    "option",
                                                    { value: "" },
                                                    "Pilih service",
                                                  ),
                                                  (openBlock(true),
                                                  createBlock(
                                                    Fragment,
                                                    null,
                                                    renderList(__props.services, (service) => {
                                                      return (
                                                        openBlock(),
                                                        createBlock(
                                                          "option",
                                                          {
                                                            key: service.id,
                                                            value: service.id,
                                                          },
                                                          toDisplayString(service.name),
                                                          9,
                                                          ["value"],
                                                        )
                                                      );
                                                    }),
                                                    128,
                                                  )),
                                                ],
                                                8,
                                                ["onUpdate:modelValue"],
                                              ),
                                              [[vModelSelect, item.serviceId]],
                                            ),
                                          ]),
                                          createVNode("td", { class: "p-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.quantity = $event),
                                                  type: "number",
                                                  min: "1",
                                                  class:
                                                    "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-center",
                                                  onInput: ($event) =>
                                                    emit("updateItemAmount", index),
                                                  required: "",
                                                },
                                                null,
                                                40,
                                                ["onUpdate:modelValue", "onInput"],
                                              ),
                                              [
                                                [
                                                  vModelText,
                                                  item.quantity,
                                                  void 0,
                                                  { number: true },
                                                ],
                                              ],
                                            ),
                                          ]),
                                          createVNode("td", { class: "p-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.unitPrice = $event),
                                                  type: "number",
                                                  min: "0",
                                                  class:
                                                    "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-right",
                                                  onInput: ($event) =>
                                                    emit("updateItemAmount", index),
                                                  required: "",
                                                },
                                                null,
                                                40,
                                                ["onUpdate:modelValue", "onInput"],
                                              ),
                                              [
                                                [
                                                  vModelText,
                                                  item.unitPrice,
                                                  void 0,
                                                  { number: true },
                                                ],
                                              ],
                                            ),
                                          ]),
                                          createVNode(
                                            "td",
                                            { class: "p-2 text-right font-medium" },
                                            toDisplayString(unref(formatCurrency)(item.amount)),
                                            1,
                                          ),
                                          createVNode("td", { class: "p-2" }, [
                                            createVNode(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: ($event) => emit("removeLineItem", index),
                                                class:
                                                  "p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded",
                                              },
                                              [createVNode(unref(Trash2), { class: "w-4 h-4" })],
                                              8,
                                              ["onClick"],
                                            ),
                                          ]),
                                        ],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ]),
                            ]),
                          ],
                        ),
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "PPN",
                          ),
                          createVNode(
                            "select",
                            {
                              "model-value": __props.selectedTaxRate,
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              "onUpdate:modelValue": ($event) =>
                                emit("updateTaxRate", Number($event)),
                            },
                            [
                              (openBlock(true),
                              createBlock(
                                Fragment,
                                null,
                                renderList(__props.taxOptions, (tax) => {
                                  return (
                                    openBlock(),
                                    createBlock(
                                      "option",
                                      {
                                        key: tax.value,
                                        value: tax.value,
                                      },
                                      toDisplayString(tax.label),
                                      9,
                                      ["value"],
                                    )
                                  );
                                }),
                                128,
                              )),
                            ],
                            8,
                            ["model-value", "onUpdate:modelValue"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Catatan",
                          ),
                          withDirectives(
                            createVNode(
                              "textarea",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (__props.formData.notes = $event),
                                rows: "2",
                                placeholder: "Catatan invoice (opsional)",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, __props.formData.notes]],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "border-t border-border pt-4" }, [
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode("div", { class: "w-64 space-y-2" }, [
                            createVNode("div", { class: "flex justify-between text-sm" }, [
                              createVNode("span", { class: "text-muted-foreground" }, "Subtotal:"),
                              createVNode(
                                "span",
                                { class: "font-medium" },
                                toDisplayString(unref(formatCurrency)(__props.formData.subTotal)),
                                1,
                              ),
                            ]),
                            createVNode("div", { class: "flex justify-between text-sm" }, [
                              createVNode(
                                "span",
                                { class: "text-muted-foreground" },
                                "Pajak (PPN):",
                              ),
                              createVNode(
                                "span",
                                { class: "font-medium" },
                                toDisplayString(unref(formatCurrency)(__props.formData.taxAmount)),
                                1,
                              ),
                            ]),
                            createVNode(
                              "div",
                              { class: "flex justify-between pt-2 border-t border-border" },
                              [
                                createVNode("span", { class: "font-semibold" }, "Total:"),
                                createVNode(
                                  "span",
                                  { class: "font-semibold text-lg" },
                                  toDisplayString(unref(formatCurrency)(__props.formData.total)),
                                  1,
                                ),
                              ],
                            ),
                          ]),
                        ]),
                      ]),
                      createVNode(
                        "div",
                        { class: "flex justify-end gap-3 pt-4 border-t border-border" },
                        [
                          createVNode(
                            "button",
                            {
                              type: "button",
                              onClick: ($event) => emit("close"),
                              class: "btn-secondary",
                            },
                            "Batal",
                            8,
                            ["onClick"],
                          ),
                          createVNode(
                            "button",
                            {
                              type: "submit",
                              disabled: __props.isSubmitting,
                              class: "btn-primary flex items-center gap-2",
                            },
                            [
                              createVNode(unref(Save), { class: "w-4 h-4" }),
                              createTextVNode(
                                " " +
                                  toDisplayString(__props.isSubmitting ? "Menyimpan..." : "Simpan"),
                                1,
                              ),
                            ],
                            8,
                            ["disabled"],
                          ),
                        ],
                      ),
                    ],
                    40,
                    ["onSubmit"],
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/invoice/components/InvoiceEditModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=InvoiceEditModal-D0WGWSNK.mjs.map
