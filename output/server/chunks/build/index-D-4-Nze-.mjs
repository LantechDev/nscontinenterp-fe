import { _ as __nuxt_component_0 } from "./Checkbox-BPDemuax.mjs";
import { defineComponent, mergeProps, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderComponent,
} from "vue/server-renderer";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PermissionsTable",
  __ssrInlineRender: true,
  props: {
    permissions: {},
    availableActions: {},
    availableResources: {},
  },
  emits: ["toggle", "toggle-all"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const hasPermission = (resource, action) => {
      return props.permissions[resource]?.includes(action) || false;
    };
    const isAllSelected = (resource) => {
      const current = props.permissions[resource];
      return current && current.length === props.availableActions.length;
    };
    const handleToggle = (resource, action) => {
      emit("toggle", resource, action);
    };
    const handleToggleAll = (resource) => {
      emit("toggle-all", resource);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiCheckbox = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-lg overflow-hidden bg-white" }, _attrs))}><table class="w-full text-sm"><thead class="bg-gray-50 border-b border-border"><tr><th class="text-left py-3 px-4 font-medium text-muted-foreground w-1/3">Resource</th><!--[-->`,
      );
      ssrRenderList(__props.availableActions, (action) => {
        _push(
          `<th class="text-center py-3 px-4 font-medium text-muted-foreground capitalize">${ssrInterpolate(action)}</th>`,
        );
      });
      _push(
        `<!--]--><th class="text-center py-3 px-4 font-medium text-muted-foreground">All</th></tr></thead><tbody><!--[-->`,
      );
      ssrRenderList(__props.availableResources, (resource) => {
        _push(
          `<tr class="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"><td class="py-3 px-4"><div class="font-medium text-foreground">${ssrInterpolate(resource.label)}</div><div class="text-xs text-muted-foreground">${ssrInterpolate(resource.description)}</div></td><!--[-->`,
        );
        ssrRenderList(__props.availableActions, (action) => {
          _push(`<td class="text-center py-3 px-4"><div class="flex justify-center">`);
          _push(
            ssrRenderComponent(
              _component_UiCheckbox,
              {
                "model-value": hasPermission(resource.key, action),
                "onUpdate:modelValue": ($event) => handleToggle(resource.key, action),
              },
              null,
              _parent,
            ),
          );
          _push(`</div></td>`);
        });
        _push(`<!--]--><td class="text-center py-3 px-4"><div class="flex justify-center">`);
        _push(
          ssrRenderComponent(
            _component_UiCheckbox,
            {
              "model-value": isAllSelected(resource.key),
              "onUpdate:modelValue": ($event) => handleToggleAll(resource.key),
            },
            null,
            _parent,
          ),
        );
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/settings/roles/components/PermissionsTable.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const PermissionsTableCzSBCZ9i = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

const indexD4Nze_ = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      PermissionsTable: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

export { PermissionsTableCzSBCZ9i as P, _sfc_main as _, indexD4Nze_ as i };
//# sourceMappingURL=index-D-4-Nze-.mjs.map
