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
  vModelSelect,
  vModelCheckbox,
  useSSRContext,
} from "vue";
import {
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
} from "vue/server-renderer";
import { ChevronDown, Loader2, Save } from "lucide-vue-next";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
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
  __name: "CompanyCreateModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
  },
  emits: ["update:modelValue", "refresh"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isOpen = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });
    const { createCompany } = useCompanies();
    const isSubmitting = ref(false);
    const formError = ref(null);
    const formData = ref({
      name: "",
      email: "",
      phone: "",
      countryCode: "ID",
      isCustomer: true,
      isVendor: false,
      status: "active",
      country: "",
      city: "",
      fullAddress: "",
      postalCode: "",
      state: "",
      eoriNo: "",
      description: "",
      notes: "",
    });
    const resetForm = () => {
      formData.value = {
        name: "",
        email: "",
        phone: "",
        countryCode: "ID",
        isCustomer: true,
        isVendor: false,
        status: "active",
        country: "",
        city: "",
        fullAddress: "",
        postalCode: "",
        state: "",
        eoriNo: "",
        description: "",
        notes: "",
      };
      formError.value = null;
    };
    watch(isOpen, (val) => {
      if (val) resetForm();
    });
    const handleCreateCompany = async () => {
      if (!formData.value.name || !formData.value.email || !formData.value.phone) {
        formError.value = "Please fill in all required fields (Name, Email, Phone)";
        return;
      }
      isSubmitting.value = true;
      formError.value = null;
      const result = await createCompany({
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        fullAddress: formData.value.fullAddress,
        country: formData.value.country,
        city: formData.value.city,
        isCustomer: formData.value.isCustomer,
        isVendor: formData.value.isVendor,
        description: formData.value.description,
        notes: formData.value.notes,
      });
      if (result.success) {
        isOpen.value = false;
        emit("refresh");
      } else {
        formError.value = result.error || "Failed to create company";
      }
      isSubmitting.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0;
      _push(
        ssrRenderComponent(
          _component_UiModal,
          mergeProps(
            {
              modelValue: isOpen.value,
              "onUpdate:modelValue": ($event) => (isOpen.value = $event),
              title: "Add new Company",
              description: "Register your new Company",
              width: "max-w-4xl",
            },
            _attrs,
          ),
          {
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>`,
                );
                if (isSubmitting.value) {
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
                _push2(` ${ssrInterpolate(isSubmitting.value ? "Saving..." : "Save")}</button>`);
              } else {
                return [
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: ($event) => (isOpen.value = false),
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: isSubmitting.value,
                    },
                    " Cancel ",
                    8,
                    ["onClick", "disabled"],
                  ),
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: handleCreateCompany,
                      disabled: isSubmitting.value,
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      isSubmitting.value
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
                        " " + toDisplayString(isSubmitting.value ? "Saving..." : "Save"),
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
                _push2(`<form class="space-y-6"${_scopeId}>`);
                if (formError.value) {
                  _push2(
                    `<div class="p-4 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(formError.value)}</p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `<div${_scopeId}><h3 class="text-base font-bold text-foreground mb-4"${_scopeId}>Company Detail</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Name <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", formData.value.name)} type="text" placeholder="Input name" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Email <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", formData.value.email)} type="email" placeholder="Input email" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Phone number <span class="text-red-500"${_scopeId}>*</span></label><div class="flex gap-2"${_scopeId}><select class="w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}><option value="ID"${ssrIncludeBooleanAttr(Array.isArray(formData.value.countryCode) ? ssrLooseContain(formData.value.countryCode, "ID") : ssrLooseEqual(formData.value.countryCode, "ID")) ? " selected" : ""}${_scopeId}>ID</option><option value="US"${ssrIncludeBooleanAttr(Array.isArray(formData.value.countryCode) ? ssrLooseContain(formData.value.countryCode, "US") : ssrLooseEqual(formData.value.countryCode, "US")) ? " selected" : ""}${_scopeId}>US</option><option value="SG"${ssrIncludeBooleanAttr(Array.isArray(formData.value.countryCode) ? ssrLooseContain(formData.value.countryCode, "SG") : ssrLooseEqual(formData.value.countryCode, "SG")) ? " selected" : ""}${_scopeId}>SG</option><option value="MY"${ssrIncludeBooleanAttr(Array.isArray(formData.value.countryCode) ? ssrLooseContain(formData.value.countryCode, "MY") : ssrLooseEqual(formData.value.countryCode, "MY")) ? " selected" : ""}${_scopeId}>MY</option></select><input${ssrRenderAttr("value", formData.value.phone)} type="tel" placeholder="+62 812-3456-7890" class="flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Role</label><div class="flex items-center gap-4 mt-2"${_scopeId}><label class="flex items-center gap-2 text-sm text-foreground"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formData.value.isCustomer) ? ssrLooseContain(formData.value.isCustomer, null) : formData.value.isCustomer) ? " checked" : ""} class="rounded border-gray-300 text-primary focus:ring-primary"${_scopeId}> Customer </label><label class="flex items-center gap-2 text-sm text-foreground"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(formData.value.isVendor) ? ssrLooseContain(formData.value.isVendor, null) : formData.value.isVendor) ? " checked" : ""} class="rounded border-gray-300 text-primary focus:ring-primary"${_scopeId}> Vendor </label></div></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Status</label><div class="relative"${_scopeId}><select class="w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none"${_scopeId}><option value="active"${ssrIncludeBooleanAttr(Array.isArray(formData.value.status) ? ssrLooseContain(formData.value.status, "active") : ssrLooseEqual(formData.value.status, "active")) ? " selected" : ""}${_scopeId}>Active</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(formData.value.status) ? ssrLooseContain(formData.value.status, "inactive") : ssrLooseEqual(formData.value.status, "inactive")) ? " selected" : ""}${_scopeId}>Inactive</option></select>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(ChevronDown),
                    {
                      class:
                        "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div></div></div><div class="border-t border-border"${_scopeId}></div><div${_scopeId}><h3 class="text-base font-bold text-foreground mb-4"${_scopeId}>Address</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Country</label><input${ssrRenderAttr("value", formData.value.country)} type="text" placeholder="Input country" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>City</label><input${ssrRenderAttr("value", formData.value.city)} type="text" placeholder="Input city" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="space-y-1.5 md:col-span-2"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Full Address</label><textarea placeholder="Enter full address" rows="3" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"${_scopeId}>${ssrInterpolate(formData.value.fullAddress)}</textarea></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Postal/ Zip code</label><input${ssrRenderAttr("value", formData.value.postalCode)} type="text" placeholder="Input postal code" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>State</label><input${ssrRenderAttr("value", formData.value.state)} type="text" placeholder="Input state" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div></div></div><div class="border-t border-border"${_scopeId}></div><div${_scopeId}><h3 class="text-base font-bold text-foreground mb-4"${_scopeId}>Additional Information</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Description</label><textarea placeholder="Enter company description" rows="3" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"${_scopeId}>${ssrInterpolate(formData.value.description)}</textarea></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Notes</label><textarea placeholder="Enter notes" rows="3" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"${_scopeId}>${ssrInterpolate(formData.value.notes)}</textarea></div></div></div></form>`,
                );
              } else {
                return [
                  createVNode(
                    "form",
                    {
                      class: "space-y-6",
                      onSubmit: withModifiers(handleCreateCompany, ["prevent"]),
                    },
                    [
                      formError.value
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
                                toDisplayString(formError.value),
                                1,
                              ),
                            ],
                          ))
                        : createCommentVNode("", true),
                      createVNode("div", null, [
                        createVNode(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Company Detail",
                        ),
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                              createTextVNode("Name "),
                              createVNode("span", { class: "text-red-500" }, "*"),
                            ]),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) => (formData.value.name = $event),
                                  type: "text",
                                  placeholder: "Input name",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                  required: "",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.name]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                              createTextVNode("Email "),
                              createVNode("span", { class: "text-red-500" }, "*"),
                            ]),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.email = $event),
                                  type: "email",
                                  placeholder: "Input email",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                  required: "",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.email]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                              createTextVNode("Phone number "),
                              createVNode("span", { class: "text-red-500" }, "*"),
                            ]),
                            createVNode("div", { class: "flex gap-2" }, [
                              withDirectives(
                                createVNode(
                                  "select",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (formData.value.countryCode = $event),
                                    class:
                                      "w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                                  },
                                  [
                                    createVNode("option", { value: "ID" }, "ID"),
                                    createVNode("option", { value: "US" }, "US"),
                                    createVNode("option", { value: "SG" }, "SG"),
                                    createVNode("option", { value: "MY" }, "MY"),
                                  ],
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelSelect, formData.value.countryCode]],
                              ),
                              withDirectives(
                                createVNode(
                                  "input",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (formData.value.phone = $event),
                                    type: "tel",
                                    placeholder: "+62 812-3456-7890",
                                    class:
                                      "flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                    required: "",
                                  },
                                  null,
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelText, formData.value.phone]],
                              ),
                            ]),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Role",
                            ),
                            createVNode("div", { class: "flex items-center gap-4 mt-2" }, [
                              createVNode(
                                "label",
                                { class: "flex items-center gap-2 text-sm text-foreground" },
                                [
                                  withDirectives(
                                    createVNode(
                                      "input",
                                      {
                                        type: "checkbox",
                                        "onUpdate:modelValue": ($event) =>
                                          (formData.value.isCustomer = $event),
                                        class:
                                          "rounded border-gray-300 text-primary focus:ring-primary",
                                      },
                                      null,
                                      8,
                                      ["onUpdate:modelValue"],
                                    ),
                                    [[vModelCheckbox, formData.value.isCustomer]],
                                  ),
                                  createTextVNode(" Customer "),
                                ],
                              ),
                              createVNode(
                                "label",
                                { class: "flex items-center gap-2 text-sm text-foreground" },
                                [
                                  withDirectives(
                                    createVNode(
                                      "input",
                                      {
                                        type: "checkbox",
                                        "onUpdate:modelValue": ($event) =>
                                          (formData.value.isVendor = $event),
                                        class:
                                          "rounded border-gray-300 text-primary focus:ring-primary",
                                      },
                                      null,
                                      8,
                                      ["onUpdate:modelValue"],
                                    ),
                                    [[vModelCheckbox, formData.value.isVendor]],
                                  ),
                                  createTextVNode(" Vendor "),
                                ],
                              ),
                            ]),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Status",
                            ),
                            createVNode("div", { class: "relative" }, [
                              withDirectives(
                                createVNode(
                                  "select",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (formData.value.status = $event),
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none",
                                  },
                                  [
                                    createVNode("option", { value: "active" }, "Active"),
                                    createVNode("option", { value: "inactive" }, "Inactive"),
                                  ],
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelSelect, formData.value.status]],
                              ),
                              createVNode(unref(ChevronDown), {
                                class:
                                  "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                              }),
                            ]),
                          ]),
                        ]),
                      ]),
                      createVNode("div", { class: "border-t border-border" }),
                      createVNode("div", null, [
                        createVNode(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Address",
                        ),
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Country",
                            ),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.country = $event),
                                  type: "text",
                                  placeholder: "Input country",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.country]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "City",
                            ),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) => (formData.value.city = $event),
                                  type: "text",
                                  placeholder: "Input city",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.city]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5 md:col-span-2" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Full Address",
                            ),
                            withDirectives(
                              createVNode(
                                "textarea",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.fullAddress = $event),
                                  placeholder: "Enter full address",
                                  rows: "3",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.fullAddress]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Postal/ Zip code",
                            ),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.postalCode = $event),
                                  type: "text",
                                  placeholder: "Input postal code",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.postalCode]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "State",
                            ),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.state = $event),
                                  type: "text",
                                  placeholder: "Input state",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.state]],
                            ),
                          ]),
                        ]),
                      ]),
                      createVNode("div", { class: "border-t border-border" }),
                      createVNode("div", null, [
                        createVNode(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Additional Information",
                        ),
                        createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Description",
                            ),
                            withDirectives(
                              createVNode(
                                "textarea",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.description = $event),
                                  placeholder: "Enter company description",
                                  rows: "3",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.description]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-1.5" }, [
                            createVNode(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Notes",
                            ),
                            withDirectives(
                              createVNode(
                                "textarea",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (formData.value.notes = $event),
                                  placeholder: "Enter notes",
                                  rows: "3",
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, formData.value.notes]],
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
    "pages/master/company/components/CompanyCreateModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyCreateModal-BTEc1Ih0.mjs.map
