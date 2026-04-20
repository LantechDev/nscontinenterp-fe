import { ref, computed } from "vue";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
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
import "vue/server-renderer";

function useCompanyAddressForm(companyDetails) {
  const { createAddress, updateAddress, deleteAddress } = useCompanies();
  const activeAddressMenu = ref(null);
  const showAddressMenu = (addressId) => {
    activeAddressMenu.value = activeAddressMenu.value === addressId ? null : addressId;
  };
  const closeAddressMenu = () => {
    activeAddressMenu.value = null;
  };
  const addressMode = ref("view");
  const editingAddressId = ref(null);
  const isSaving = ref(false);
  const companyAddresses = computed(() => {
    return companyDetails.value?.addresses || [];
  });
  const editingAddress = computed(() => {
    if (!editingAddressId.value || !companyAddresses.value.length) return null;
    return companyAddresses.value.find((addr) => addr.id === editingAddressId.value) || null;
  });
  const openAddAddressMode = () => {
    addressMode.value = "add";
    editingAddressId.value = null;
    closeAddressMenu();
  };
  const openEditAddressMode = (addressId) => {
    addressMode.value = "edit";
    editingAddressId.value = addressId.replace("tab-", "");
    closeAddressMenu();
  };
  const closeAddressMode = () => {
    addressMode.value = "view";
    editingAddressId.value = null;
  };
  const handleAddressSave = async (formData) => {
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
  const handleDeleteAddress = async (addressId) => {
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

export { useCompanyAddressForm };
//# sourceMappingURL=useCompanyAddressForm-5b9x2tuV.mjs.map
