import { ref, computed } from "vue";
import { useBlConditions, type BlCondition } from "./useBlConditions";
import { useConfirm } from "./useConfirm";
import { toast } from "vue-sonner";

export interface BlConditionFormData {
  clauseNumber: string;
  clauseTitle: string;
  clauseContent: string;
  isActive: boolean;
}

export type BlConditionViewMode = "list" | "grid";

export function useBlConditionsPage() {
  const {
    conditions: allConditions,
    isLoading: isApiLoading,
    fetchConditions,
    createCondition,
    updateCondition,
    deleteCondition,
    reorderConditions,
  } = useBlConditions();
  const { confirm } = useConfirm();

  // State
  const viewMode = ref<BlConditionViewMode>("list");
  const searchQuery = ref("");
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref<string | null>(null);
  const editingId = ref<string | null>(null);

  // Form state
  const formData = ref<BlConditionFormData>({
    clauseNumber: "",
    clauseTitle: "",
    clauseContent: "",
    isActive: true,
  });

  // Computed
  const isLoading = computed(() => isApiLoading.value);

  const filteredConditions = computed(() => {
    if (!searchQuery.value) return allConditions.value;
    const q = searchQuery.value.toLowerCase();
    return allConditions.value.filter(
      (c) =>
        c.clauseTitle.toLowerCase().includes(q) ||
        c.clauseNumber.toLowerCase().includes(q) ||
        c.clauseContent.toLowerCase().includes(q),
    );
  });

  // Actions
  const openAddModal = () => {
    editingId.value = null;
    formData.value = {
      clauseNumber: "",
      clauseTitle: "",
      clauseContent: "",
      isActive: true,
    };
    isEditModalOpen.value = true;
  };

  const openEditModal = (id: string) => {
    const item = allConditions.value.find((c) => c.id === id);
    if (!item) return;

    editingId.value = id;
    formData.value = {
      clauseNumber: item.clauseNumber,
      clauseTitle: item.clauseTitle,
      clauseContent: item.clauseContent,
      isActive: item.isActive,
    };
    isEditModalOpen.value = true;
  };

  const closeEditModal = () => {
    isEditModalOpen.value = false;
    editingId.value = null;
    editError.value = null;
  };

  const handleSubmit = async () => {
    isSubmitting.value = true;
    editError.value = null;
    try {
      if (editingId.value) {
        const res = await updateCondition(editingId.value, formData.value);
        if (res.success) {
          toast.success("Clause updated successfully");
          closeEditModal();
        } else {
          editError.value = res.error || "Failed to update clause";
        }
      } else {
        const res = await createCondition({
          ...formData.value,
          sortOrder: allConditions.value.length,
        });
        if (res.success) {
          toast.success("Clause created successfully");
          closeEditModal();
        } else {
          editError.value = res.error || "Failed to create clause";
        }
      }
    } catch (err: unknown) {
      editError.value = (err as Error).message || "An error occurred";
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleDelete = async (id: string) => {
    const item = allConditions.value.find((c) => c.id === id);
    const confirmed = await confirm({
      title: "Delete Clause",
      message: `Are you sure you want to delete clause "${item?.clauseTitle}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (confirmed) {
      const res = await deleteCondition(id);
      if (res.success) {
        toast.success("Clause deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete clause");
      }
    }
  };

  const toggleStatus = async (item: BlCondition) => {
    const res = await updateCondition(item.id, { isActive: !item.isActive });
    if (res.success) {
      toast.success(`Clause ${!item.isActive ? "activated" : "deactivated"} successfully`);
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const move = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= allConditions.value.length) return;

    const items = [...allConditions.value];
    const [movedItem] = items.splice(index, 1);
    if (movedItem) {
      items.splice(newIndex, 0, movedItem);
    }

    const reorderPayload = items.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    const res = await reorderConditions(reorderPayload);
    if (!res.success) {
      toast.error(res.error || "Failed to reorder");
    }
  };

  const initialize = () => {
    fetchConditions();
  };

  const setData = (data: { items: BlCondition[] }) => {
    if (data?.items) {
      allConditions.value = data.items;
    }
  };

  return {
    conditions: allConditions,
    filteredConditions,
    viewMode,
    searchQuery,
    isEditModalOpen,
    isSubmitting,
    editError,
    editingId,
    formData,
    isLoading,
    openAddModal,
    openEditModal,
    closeEditModal,
    handleSubmit,
    handleDelete,
    toggleStatus,
    move,
    initialize,
    setData,
  };
}
