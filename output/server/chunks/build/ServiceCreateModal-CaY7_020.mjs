import { _ as __nuxt_component_0 } from "./Modal-DzxIm9v2.mjs";
import {
  defineComponent,
  computed,
  ref,
  watch,
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
  useSSRContext,
} from "vue";
import {
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { Loader2, Save } from "lucide-vue-next";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "./server.mjs";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ServiceCreateModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    isSubmitting: { type: Boolean, default: false },
    error: { default: null },
    initialData: { default: null },
  },
  emits: ["update:isOpen", "submit"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { categories, units } = useServices();
    const categoryOptions = computed(() =>
      categories.value.map((c) => ({ id: c.id, name: c.name })),
    );
    const unitOptions = computed(() => units.value.map((u) => ({ id: u.id, name: u.name })));
    const formData = ref({
      name: "",
      code: "",
      vendorPrice: "",
      customerPrice: "",
      currency: "IDR",
      taxRate: "0",
      status: "Active",
      unitId: "",
      categoryId: "",
    });
    const resetForm = () => {
      formData.value = {
        name: "",
        code: "",
        vendorPrice: "",
        customerPrice: "",
        currency: "IDR",
        taxRate: "0",
        status: "Active",
        unitId: "",
        categoryId: "",
      };
    };
    const syncForm = () => {
      if (props.initialData) {
        formData.value = {
          name: props.initialData.name || "",
          code: props.initialData.code || "",
          vendorPrice:
            props.initialData.vendorPrice !== void 0 && props.initialData.vendorPrice !== null
              ? Number(props.initialData.vendorPrice).toLocaleString("id-ID")
              : "",
          customerPrice:
            props.initialData.customerPrice !== void 0 && props.initialData.customerPrice !== null
              ? Number(props.initialData.customerPrice).toLocaleString("id-ID")
              : "",
          currency: props.initialData.currency || "IDR",
          taxRate: String(props.initialData.taxRate ?? "0"),
          status: props.initialData.isActive ? "Active" : "Inactive",
          unitId: props.initialData.unitId || "",
          categoryId: props.initialData.categoryId || "",
        };
      } else {
        resetForm();
      }
    };
    watch(
      () => props.initialData,
      () => syncForm(),
      { immediate: true },
    );
    watch(
      () => props.isOpen,
      (newVal) => {
        if (newVal) syncForm();
      },
    );
    const handlePriceInput = (field, event) => {
      const input = event.target;
      const val = input.value;
      const numericValue = val.replace(/\D/g, "");
      if (numericValue === "") {
        formData.value[field] = "";
      } else {
        formData.value[field] = Number(numericValue).toLocaleString("id-ID");
      }
      input.value = formData.value[field];
    };
    const handleSubmit = () => {
      emit("submit", { ...formData.value });
    };
    const handleClose = () => {
      emit("update:isOpen", false);
      resetForm();
    };
    __expose({ resetForm });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0;
      _push(
        ssrRenderComponent(
          _component_UiModal,
          mergeProps(
            {
              "model-value": __props.isOpen,
              "onUpdate:modelValue": (val) => emit("update:isOpen", val),
              title: __props.initialData ? "Edit Service" : "Add new Service",
              description: __props.initialData
                ? "Modify service details"
                : "Register your new Service",
              width: "max-w-3xl",
              onClose: handleClose,
            },
            _attrs,
          ),
          {
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>`,
                );
                if (__props.isSubmitting) {
                  _push2(
                    ssrRenderComponent(
                      unref(Loader2),
                      { class: "w-4 h-4 animate-spin" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(
                    ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                  );
                }
                _push2(` ${ssrInterpolate(__props.isSubmitting ? "Saving..." : "Save")}</button>`);
              } else {
                return [
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: handleClose,
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: __props.isSubmitting,
                    },
                    " Cancel ",
                    8,
                    ["disabled"],
                  ),
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: handleSubmit,
                      disabled: __props.isSubmitting,
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      __props.isSubmitting
                        ? (openBlock(),
                          createBlock(unref(Loader2), {
                            key: 0,
                            class: "w-4 h-4 animate-spin",
                          }))
                        : (openBlock(),
                          createBlock(unref(Save), {
                            key: 1,
                            class: "w-4 h-4",
                          })),
                      createTextVNode(
                        " " + toDisplayString(__props.isSubmitting ? "Saving..." : "Save"),
                        1,
                      ),
                    ],
                    8,
                    ["disabled"],
                  ),
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<form class="space-y-4 pb-32"${_scopeId}>`);
                if (__props.error) {
                  _push2(
                    `<div class="p-4 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(__props.error)}</p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `<div class="grid grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Service Name <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).name)} type="text" placeholder="e.g. Ocean Freight" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Code <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).code)} type="text" placeholder="SVC-XXX" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Category</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).categoryId,
                      "onUpdate:modelValue": ($event) => (unref(formData).categoryId = $event),
                      options: unref(categoryOptions),
                      placeholder: "-- Select Category --",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Unit</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).unitId,
                      "onUpdate:modelValue": ($event) => (unref(formData).unitId = $event),
                      options: unref(unitOptions),
                      placeholder: "-- Select Unit --",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="grid grid-cols-3 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Currency</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).currency,
                      "onUpdate:modelValue": ($event) => (unref(formData).currency = $event),
                      options: [
                        { id: "IDR", name: "IDR" },
                        { id: "USD", name: "USD" },
                        { id: "EUR", name: "EUR" },
                      ],
                      placeholder: "Select Currency",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Tax Rate (%)</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).taxRate,
                      "onUpdate:modelValue": ($event) => (unref(formData).taxRate = $event),
                      options: [
                        { id: "0", name: "0%" },
                        { id: "1.1", name: "1.1%" },
                        { id: "11", name: "11%" },
                      ],
                      placeholder: "Select Tax Rate",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Status</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).status,
                      "onUpdate:modelValue": ($event) => (unref(formData).status = $event),
                      options: [
                        { id: "Active", name: "Active" },
                        { id: "Inactive", name: "Inactive" },
                      ],
                      placeholder: "Select Status",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Cost Price (Vendor)</label><div class="relative"${_scopeId}><div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(formData).currency)}</div><input${ssrRenderAttr("value", unref(formData).vendorPrice)} type="text" placeholder="0" class="w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Selling Price (Customer) <span class="text-red-500"${_scopeId}>*</span></label><div class="relative"${_scopeId}><div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(formData).currency)}</div><input${ssrRenderAttr("value", unref(formData).customerPrice)} type="text" placeholder="0" class="w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div></div></div></form>`,
                );
              } else {
                return [
                  createVNode(
                    "form",
                    {
                      class: "space-y-4 pb-32",
                      onSubmit: withModifiers(handleSubmit, ["prevent"]),
                    },
                    [
                      __props.error
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
                                toDisplayString(__props.error),
                                1,
                              ),
                            ],
                          ))
                        : createCommentVNode("", true),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Service Name "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) => (unref(formData).name = $event),
                                type: "text",
                                placeholder: "e.g. Ocean Freight",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).name]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Code "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) => (unref(formData).code = $event),
                                type: "text",
                                placeholder: "SVC-XXX",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).code]],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Category",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).categoryId,
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).categoryId = $event),
                              options: unref(categoryOptions),
                              placeholder: "-- Select Category --",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue", "options"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Unit",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).unitId,
                              "onUpdate:modelValue": ($event) => (unref(formData).unitId = $event),
                              options: unref(unitOptions),
                              placeholder: "-- Select Unit --",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue", "options"],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Currency",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).currency,
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).currency = $event),
                              options: [
                                { id: "IDR", name: "IDR" },
                                { id: "USD", name: "USD" },
                                { id: "EUR", name: "EUR" },
                              ],
                              placeholder: "Select Currency",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Tax Rate (%)",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).taxRate,
                              "onUpdate:modelValue": ($event) => (unref(formData).taxRate = $event),
                              options: [
                                { id: "0", name: "0%" },
                                { id: "1.1", name: "1.1%" },
                                { id: "11", name: "11%" },
                              ],
                              placeholder: "Select Tax Rate",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Status",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).status,
                              "onUpdate:modelValue": ($event) => (unref(formData).status = $event),
                              options: [
                                { id: "Active", name: "Active" },
                                { id: "Inactive", name: "Inactive" },
                              ],
                              placeholder: "Select Status",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Cost Price (Vendor)",
                          ),
                          createVNode("div", { class: "relative" }, [
                            createVNode(
                              "div",
                              {
                                class:
                                  "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium",
                              },
                              toDisplayString(unref(formData).currency),
                              1,
                            ),
                            createVNode(
                              "input",
                              {
                                value: unref(formData).vendorPrice,
                                onInput: ($event) => handlePriceInput("vendorPrice", $event),
                                type: "text",
                                placeholder: "0",
                                class:
                                  "w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              40,
                              ["value", "onInput"],
                            ),
                          ]),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode("Selling Price (Customer) "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          createVNode("div", { class: "relative" }, [
                            createVNode(
                              "div",
                              {
                                class:
                                  "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium",
                              },
                              toDisplayString(unref(formData).currency),
                              1,
                            ),
                            createVNode(
                              "input",
                              {
                                value: unref(formData).customerPrice,
                                onInput: ($event) => handlePriceInput("customerPrice", $event),
                                type: "text",
                                placeholder: "0",
                                class:
                                  "w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              40,
                              ["value", "onInput"],
                            ),
                          ]),
                        ]),
                      ]),
                    ],
                    32,
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
    "pages/master/services/components/ServiceCreateModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ServiceCreateModal-CaY7_020.mjs.map
