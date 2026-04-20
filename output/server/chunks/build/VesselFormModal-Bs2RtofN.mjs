import { _ as __nuxt_component_0 } from "./Modal-DzxIm9v2.mjs";
import {
  defineComponent,
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
  vModelRadio,
  useSSRContext,
} from "vue";
import {
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseEqual,
} from "vue/server-renderer";
import { Loader2, Save } from "lucide-vue-next";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VesselFormModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    isSubmitting: { type: Boolean, default: false },
    error: { default: null },
    editingVessel: { default: null },
  },
  emits: ["update:isOpen", "submit"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formData = ref({
      name: "",
      imoNumber: "",
      description: "",
      isActive: true,
    });
    const resetForm = () => {
      formData.value = {
        name: "",
        imoNumber: "",
        description: "",
        isActive: true,
      };
    };
    const handleSubmit = () => {
      emit("submit", { ...formData.value });
    };
    const handleClose = () => {
      emit("update:isOpen", false);
      resetForm();
    };
    watch(
      () => props.editingVessel,
      (vessel) => {
        if (vessel) {
          formData.value = {
            name: vessel.name,
            imoNumber: vessel.imoNumber || "",
            description: vessel.description || "",
            isActive: vessel.isActive,
          };
        } else {
          resetForm();
        }
      },
      { immediate: true },
    );
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
              title: __props.editingVessel ? "Edit Vessel" : "Add New Vessel",
              description: __props.editingVessel
                ? "Update vessel information"
                : "Register a new vessel",
              width: "max-w-lg",
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
                _push2(`<form class="space-y-4"${_scopeId}>`);
                if (__props.error) {
                  _push2(
                    `<div class="p-4 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(__props.error)}</p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `<div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Vessel Name <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).name)} type="text" placeholder="e.g. MV Ever Given" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>IMO Number</label><input${ssrRenderAttr("value", unref(formData).imoNumber)} type="text" placeholder="e.g. IMO9811000" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Status</label><div class="flex items-center gap-4"${_scopeId}><label class="flex items-center gap-2 cursor-pointer"${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formData).isActive, true)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", true)} class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"${_scopeId}><span class="text-sm text-foreground"${_scopeId}>Active</span></label><label class="flex items-center gap-2 cursor-pointer"${_scopeId}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(formData).isActive, false)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", false)} class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"${_scopeId}><span class="text-sm text-foreground"${_scopeId}>Inactive</span></label></div></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}>Description</label><textarea rows="3" placeholder="Enter vessel description..." class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"${_scopeId}>${ssrInterpolate(unref(formData).description)}</textarea></div></form>`,
                );
              } else {
                return [
                  createVNode(
                    "form",
                    {
                      class: "space-y-4",
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
                      createVNode("div", { class: "space-y-1.5" }, [
                        createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                          createTextVNode(" Vessel Name "),
                          createVNode("span", { class: "text-red-500" }, "*"),
                        ]),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) => (unref(formData).name = $event),
                              type: "text",
                              placeholder: "e.g. MV Ever Given",
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
                        createVNode(
                          "label",
                          { class: "text-sm font-medium text-foreground" },
                          "IMO Number",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).imoNumber = $event),
                              type: "text",
                              placeholder: "e.g. IMO9811000",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(formData).imoNumber]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-1.5" }, [
                        createVNode(
                          "label",
                          { class: "text-sm font-medium text-foreground" },
                          "Status",
                        ),
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          createVNode(
                            "label",
                            { class: "flex items-center gap-2 cursor-pointer" },
                            [
                              withDirectives(
                                createVNode(
                                  "input",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (unref(formData).isActive = $event),
                                    type: "radio",
                                    value: true,
                                    class:
                                      "w-4 h-4 text-[#012D5A] border-border focus:ring-primary",
                                  },
                                  null,
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelRadio, unref(formData).isActive]],
                              ),
                              createVNode("span", { class: "text-sm text-foreground" }, "Active"),
                            ],
                          ),
                          createVNode(
                            "label",
                            { class: "flex items-center gap-2 cursor-pointer" },
                            [
                              withDirectives(
                                createVNode(
                                  "input",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (unref(formData).isActive = $event),
                                    type: "radio",
                                    value: false,
                                    class:
                                      "w-4 h-4 text-[#012D5A] border-border focus:ring-primary",
                                  },
                                  null,
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelRadio, unref(formData).isActive]],
                              ),
                              createVNode("span", { class: "text-sm text-foreground" }, "Inactive"),
                            ],
                          ),
                        ]),
                      ]),
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
                                (unref(formData).description = $event),
                              rows: "3",
                              placeholder: "Enter vessel description...",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(formData).description]],
                        ),
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
    "pages/master/vessel/components/VesselFormModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=VesselFormModal-Bs2RtofN.mjs.map
