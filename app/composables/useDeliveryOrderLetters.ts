/* eslint-disable @typescript-eslint/no-explicit-any -- API error catch + loose draft payload */
import { ref } from "vue";

export interface DeliveryOrderLetterContainer {
  id?: string;
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  containerType?: { code?: string | null; name?: string | null } | null;
  totalQty?: number | null;
  grossWeight?: string | number | null;
  measurementCbm?: string | number | null;
  sequence?: number;
}

export interface DeliveryOrderLetterParty {
  id?: string;
  partyRoleCode: string;
  companyId?: string | null;
  addressBookId?: string | null;
  companyName?: string | null;
  fullAddress?: string | null;
}

export interface DeliveryOrderLetter {
  id: string;
  jobId: string;
  letterNumber?: string | null;
  letterDate?: string | null;
  shippingLineName?: string | null;
  deliveryOrderNo?: string | null;
  mblNumber?: string | null;
  vesselName?: string | null;
  voyageNumber?: string | null;
  eta?: string | null;
  pickupLocation?: string | null;
  consigneeName?: string | null;
  consigneeAddress?: string | null;
  notifyName?: string | null;
  notifyAddress?: string | null;
  remarks?: string | null;
  parties?: DeliveryOrderLetterParty[];
  containers?: DeliveryOrderLetterContainer[];
  status: string;
  finalizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useDeliveryOrderLetters() {
  const isLoading = ref(false);

  const fetchDeliveryOrderLetters = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/delivery-order-letters`, {
        method: "GET",
      });
      return { success: true, data: response as DeliveryOrderLetter[] };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const createDeliveryOrderLetter = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/delivery-order-letters`, {
        method: "POST",
      });
      return { success: true, data: response as DeliveryOrderLetter };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const updateDeliveryOrderLetterDraft = async (
    letterId: string,
    payload: Record<string, unknown>,
  ) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/delivery-order-letters/${letterId}/draft`,
        {
          method: "PATCH",
          body: payload,
        },
      );
      return { success: true, data: response as DeliveryOrderLetter };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteDeliveryOrderLetter = async (letterId: string) => {
    isLoading.value = true;
    try {
      await $fetch(`/api/operational/jobs/delivery-order-letters/${letterId}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const finalizeDeliveryOrderLetter = async (letterId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/delivery-order-letters/${letterId}/finalize`,
        { method: "POST" },
      );
      return { success: true, data: response as DeliveryOrderLetter };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const unfinalizeDeliveryOrderLetter = async (letterId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/delivery-order-letters/${letterId}/unfinalize`,
        { method: "POST" },
      );
      return { success: true, data: response as DeliveryOrderLetter };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    fetchDeliveryOrderLetters,
    createDeliveryOrderLetter,
    updateDeliveryOrderLetterDraft,
    finalizeDeliveryOrderLetter,
    unfinalizeDeliveryOrderLetter,
    deleteDeliveryOrderLetter,
  };
}
