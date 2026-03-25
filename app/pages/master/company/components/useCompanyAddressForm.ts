import { ref, computed } from "vue";
import type { Address } from "~/composables/useMasterData";
import { useCompanies } from "~/composables/useCompanies";

export function useCompanyAddressForm(companyDetails: {
  value: { id: string; addresses: Address[] } | null;
}) {
  const { createAddress, updateAddress, deleteAddress } = useCompanies();

  // Address popup menu state
  const activeAddressMenu = ref<string | null>(null);
  const showAddressMenu = (addressId: string) => {
    activeAddressMenu.value = activeAddressMenu.value === addressId ? null : addressId;
  };
  const closeAddressMenu = () => {
    activeAddressMenu.value = null;
  };

  // Address edit/add mode state
  const addressMode = ref<"view" | "edit" | "add">("view");
  const editingAddressId = ref<string | null>(null);
  const isSaving = ref(false);

  // Get company addresses
  const companyAddresses = computed<Address[]>(() => {
    return companyDetails.value?.addresses || [];
  });

  // Get the address being edited
  const editingAddress = computed<Address | null>(() => {
    if (!editingAddressId.value || !companyAddresses.value.length) return null;
    return companyAddresses.value.find((addr) => addr.id === editingAddressId.value) || null;
  });

  const openAddAddressMode = () => {
    addressMode.value = "add";
    editingAddressId.value = null;
    closeAddressMenu();
  };

  const openEditAddressMode = (addressId: string) => {
    addressMode.value = "edit";
    editingAddressId.value = addressId.replace("tab-", "");
    closeAddressMenu();
  };

  const closeAddressMode = () => {
    addressMode.value = "view";
    editingAddressId.value = null;
  };

  // Handle address save (create or update)
  const handleAddressSave = async (formData: {
    label: string;
    fullAddress: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    eori?: string;
  }) => {
    if (!companyDetails.value) return;

    isSaving.value = true;
    try {
      if (addressMode.value === "add") {
        const { success, data } = await createAddress(companyDetails.value.id, {
          label: formData.label,
          fullAddress: formData.fullAddress,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country || "Indonesia",
          eori: formData.eori,
          isDefault: companyAddresses.value.length === 0,
        });
        if (success && data) {
          companyDetails.value = {
            ...companyDetails.value,
            addresses: [...companyAddresses.value, data],
          };
        }
      } else if (addressMode.value === "edit" && editingAddressId.value) {
        const { success, data } = await updateAddress(
          companyDetails.value.id,
          editingAddressId.value,
          {
            label: formData.label,
            fullAddress: formData.fullAddress,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            eori: formData.eori,
          },
        );
        if (success && data) {
          companyDetails.value = {
            ...companyDetails.value,
            addresses: companyAddresses.value.map((addr) =>
              addr.id === editingAddressId.value ? { ...addr, ...data } : addr,
            ),
          };
        }
      }
      closeAddressMode();
    } finally {
      isSaving.value = false;
    }
  };

  // Handle address delete
  const handleDeleteAddress = async (addressId: string) => {
    if (!companyDetails.value) return;

    const cleanId = addressId.replace("tab-", "");
    const { success } = await deleteAddress(companyDetails.value.id, cleanId);
    if (success) {
      companyDetails.value = {
        ...companyDetails.value,
        addresses: companyAddresses.value.filter((addr) => addr.id !== cleanId),
      };
    }
    closeAddressMenu();
  };

  return {
    activeAddressMenu,
    showAddressMenu,
    closeAddressMenu,
    addressMode,
    editingAddressId,
    isSaving,
    companyAddresses,
    editingAddress,
    openAddAddressMode,
    openEditAddressMode,
    closeAddressMode,
    handleAddressSave,
    handleDeleteAddress,
  };
}
