import { _ as __nuxt_component_0 } from "./Modal-DzxIm9v2.mjs";
import {
  defineComponent,
  ref,
  computed,
  mergeProps,
  unref,
  isRef,
  withCtx,
  createBlock,
  createCommentVNode,
  openBlock,
  createVNode,
  createTextVNode,
  toDisplayString,
  readonly,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { Search, Plus, Loader2, Trash2 } from "lucide-vue-next";
import _sfc_main$3 from "./VesselFormModal-Bs2RtofN.mjs";
import _sfc_main$2 from "./VesselTable-zIHHJvqD.mjs";
import _sfc_main$1 from "./VesselStats-DdMK8Yed.mjs";
import { d as useState, u as useRuntimeConfig } from "./server.mjs";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
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

function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function useVessels() {
  const config = useRuntimeConfig();
  const vessels = useState("vessels", () => []);
  const isLoading = ref(false);
  const stats = computed(() => {
    const list = vessels.value || [];
    return {
      total: list.length,
      active: list.filter((v) => v.isActive && !v.deletedAt).length,
      inactive: list.filter((v) => !v.isActive || v.deletedAt).length,
    };
  });
  const fetchVessels = async (search) => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/vessels`, {
        params: { search },
        credentials: "include",
      });
      vessels.value = data || [];
      return { success: true, data: vessels.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };
  const createVessel = async (vesselData) => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/vessels`, {
        method: "POST",
        body: vesselData,
        credentials: "include",
      });
      vessels.value = [data, ...vessels.value];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };
  const updateVessel = async (id, vesselData) => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/vessels/${id}`, {
        method: "PUT",
        body: vesselData,
        credentials: "include",
      });
      vessels.value = vessels.value.map((v) => (v.id === id ? { ...v, ...data } : v));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };
  const deleteVessel = async (id) => {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/master/vessels/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      vessels.value = vessels.value.filter((v) => v.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };
  const getVesselById = async (id) => {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/vessels/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };
  return {
    vessels: readonly(vessels),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchVessels,
    createVessel,
    updateVessel,
    deleteVessel,
    getVesselById,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      vessels: vesselsList,
      stats,
      isLoading,
      fetchVessels,
      createVessel,
      updateVessel,
      deleteVessel,
    } = useVessels();
    const searchQuery = ref("");
    const vessels = computed(() => {
      let filtered = vesselsList.value.map((v) => ({
        id: v.id,
        name: v.name,
        imoNumber: v.imoNumber || "-",
        createdAt: new Date(v.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: v.isActive && !v.deletedAt ? "Active" : "Inactive",
      }));
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (v) => v.name.toLowerCase().includes(query) || v.imoNumber.toLowerCase().includes(query),
        );
      }
      return filtered;
    });
    const sortField = ref("name");
    const sortDirection = ref("asc");
    const sortedVessels = computed(() => {
      const sorted = [...vessels.value];
      sorted.sort((a, b) => {
        let comparison = 0;
        switch (sortField.value) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "imoNumber":
            comparison = a.imoNumber.localeCompare(b.imoNumber);
            break;
          case "createdAt":
            comparison = a.createdAt.localeCompare(b.createdAt);
            break;
          case "status":
            comparison = a.status.localeCompare(b.status);
            break;
          default:
            comparison = a.name.localeCompare(b.name);
        }
        return sortDirection.value === "asc" ? comparison : -comparison;
      });
      return sorted;
    });
    const toggleSort = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortDirection.value = "asc";
      }
    };
    const isModalOpen = ref(false);
    const isSubmitting = ref(false);
    const formError = ref(null);
    const editingVessel = ref(null);
    const openEditModal = (id) => {
      editingVessel.value = vesselsList.value.find((v) => v.id === id) || null;
      isModalOpen.value = true;
    };
    const handleSubmit = async (formData) => {
      if (!formData.name) {
        formError.value = "Vessel name is required";
        return;
      }
      isSubmitting.value = true;
      formError.value = null;
      const vesselData = {
        name: formData.name,
        imoNumber: formData.imoNumber || void 0,
        description: formData.description || void 0,
        isActive: formData.isActive,
      };
      let result;
      if (editingVessel.value) {
        result = await updateVessel(editingVessel.value.id, vesselData);
      } else {
        result = await createVessel(vesselData);
      }
      if (result.success) {
        isModalOpen.value = false;
        editingVessel.value = null;
        await fetchVessels();
      } else {
        formError.value = result.error || "Failed to save vessel";
      }
      isSubmitting.value = false;
    };
    const isDeleteModalOpen = ref(false);
    const vesselToDelete = ref(null);
    const openDeleteModal = (id) => {
      vesselToDelete.value = vesselsList.value.find((v) => v.id === id) || null;
      isDeleteModalOpen.value = true;
    };
    const handleDelete = async () => {
      if (!vesselToDelete.value) return;
      isSubmitting.value = true;
      const result = await deleteVessel(vesselToDelete.value.id);
      if (result.success) {
        isDeleteModalOpen.value = false;
        vesselToDelete.value = null;
        await fetchVessels();
      } else {
        formError.value = result.error || "Failed to delete vessel";
      }
      isSubmitting.value = false;
    };
    const openMenuId = ref(null);
    const toggleMenu = (id) => {
      openMenuId.value = openMenuId.value === id ? null : id;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Vessels</h1></div>`,
      );
      _push(
        ssrRenderComponent(
          unref(_sfc_main$1),
          {
            total: unref(stats).total,
            active: unref(stats).active,
            inactive: unref(stats).inactive,
          },
          null,
          _parent,
        ),
      );
      _push(
        `<div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
      );
      _push(
        ssrRenderComponent(
          unref(Search),
          { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search Vessel..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><button class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap">`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent));
      _push(`<span>New Vessel</span></button></div>`);
      if (unref(isLoading)) {
        _push(`<div class="flex items-center justify-center py-12">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-8 h-8 animate-spin text-[#012D5A]" },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$2),
            {
              vessels: unref(sortedVessels),
              "sort-field": unref(sortField),
              "sort-direction": unref(sortDirection),
              "open-menu-id": unref(openMenuId),
              onToggleSort: toggleSort,
              onToggleMenu: toggleMenu,
              onEdit: openEditModal,
              onDelete: openDeleteModal,
            },
            null,
            _parent,
          ),
        );
      }
      _push(
        ssrRenderComponent(
          unref(_sfc_main$3),
          {
            "is-open": unref(isModalOpen),
            "is-submitting": unref(isSubmitting),
            error: unref(formError),
            "editing-vessel": unref(editingVessel),
            "onUpdate:isOpen": (val) => (isModalOpen.value = val),
            onSubmit: handleSubmit,
          },
          null,
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _component_UiModal,
          {
            modelValue: unref(isDeleteModalOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isDeleteModalOpen) ? (isDeleteModalOpen.value = $event) : null,
            title: "Delete Vessel",
            description:
              "Are you sure you want to delete this vessel? This action cannot be undone.",
            width: "max-w-md",
          },
          {
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>`,
                );
                if (unref(isSubmitting)) {
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
                    ssrRenderComponent(
                      unref(Trash2),
                      { class: "w-4 h-4" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                }
                _push2(
                  ` ${ssrInterpolate(unref(isSubmitting) ? "Deleting..." : "Delete")}</button>`,
                );
              } else {
                return [
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: ($event) => (isDeleteModalOpen.value = false),
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: unref(isSubmitting),
                    },
                    " Cancel ",
                    8,
                    ["onClick", "disabled"],
                  ),
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: handleDelete,
                      disabled: unref(isSubmitting),
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      unref(isSubmitting)
                        ? (openBlock(),
                          createBlock(unref(Loader2), {
                            key: 0,
                            class: "w-4 h-4 animate-spin",
                          }))
                        : (openBlock(),
                          createBlock(unref(Trash2), {
                            key: 1,
                            class: "w-4 h-4",
                          })),
                      createTextVNode(
                        " " + toDisplayString(unref(isSubmitting) ? "Deleting..." : "Delete"),
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
                if (unref(vesselToDelete)) {
                  _push2(
                    `<div class="py-4"${_scopeId}><p class="text-sm text-muted-foreground"${_scopeId}> You are about to delete <span class="font-medium text-foreground"${_scopeId}>${ssrInterpolate(unref(vesselToDelete).name)}</span>. </p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  unref(vesselToDelete)
                    ? (openBlock(),
                      createBlock(
                        "div",
                        {
                          key: 0,
                          class: "py-4",
                        },
                        [
                          createVNode("p", { class: "text-sm text-muted-foreground" }, [
                            createTextVNode(" You are about to delete "),
                            createVNode(
                              "span",
                              { class: "font-medium text-foreground" },
                              toDisplayString(unref(vesselToDelete).name),
                              1,
                            ),
                            createTextVNode(". "),
                          ]),
                        ],
                      ))
                    : createCommentVNode("", true),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/vessel/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cl7MNCkQ.mjs.map
