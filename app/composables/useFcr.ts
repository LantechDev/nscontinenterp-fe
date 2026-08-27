/* eslint-disable @typescript-eslint/no-explicit-any -- API error catch + loose data */
import { ref } from "vue";

export interface FcrParty {
  partyRoleCode: string;
  partyRole?: { code?: string | null } | null;
  companyId?: string | null;
  addressBookId?: string | null;
  companyName?: string | null;
  fullAddress?: string | null;
  city?: string | null;
  country?: string | null;
  company?: { name?: string | null } | null;
  addressBook?: { fullAddress?: string | null; city?: string | null } | null;
}

export interface FcrContainerItem {
  id?: string;
  sequenceNo: number;
  qty: number;
  packageTypeCode?: string | null;
  grossWeight?: string | number | null;
  netWeight?: string | number | null;
  measurementCbm?: string | number | null;
  description?: string | null;
  hsCode?: string | null;
}

export interface FcrContainer {
  id?: string;
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  containerType?: { code?: string | null; name?: string | null } | null;
  vehicleNumber?: string | null;
  driverName?: string | null;
  driverContactNumber?: string | null;
  isHazardous?: boolean;
  totalQty?: number | null;
  totalGrossWeight?: string | number | null;
  totalNetWeight?: string | number | null;
  totalMeasurementCbm?: string | number | null;
  items?: FcrContainerItem[];
}

export interface FcrVessel {
  id?: string;
  vesselId?: string | null;
  transportId?: string | null;
  transportType?: string | null;
  vesselName?: string | null;
  vessel?: { name?: string | null } | null;
  plane?: { name?: string | null } | null;
  voyageNumber?: string | null;
  tsPortId?: string | null;
  etd?: string | null;
  eta?: string | null;
  sequence?: number;
  vesselType?: string | null;
}

export interface Fcr {
  id: string;
  jobId: string;
  bookingNumber?: string | null;
  bookingDate?: string | null;
  serviceContractNo?: string | null;
  warehouseDepotName?: string | null;
  warehouseDepotAddress?: string | null;
  pickupLocation?: string | null;
  cutoffDate?: string | null;
  cutoffTime?: string | null;
  remarks?: string | null;

  pol?: string | null;
  pod?: string | null;
  polName?: string | null;
  podName?: string | null;
  preCarriageBy?: string | null;
  placeOfReceipt?: string | null;
  placeOfDelivery?: string | null;
  finalDestination?: string | null;
  cargoMovementId?: string | null;
  deliveryMovementId?: string | null;
  mainDescription?: string | null;
  shippingMark?: string | null;
  etd?: string | null;
  eta?: string | null;
  dateCargoReceived?: string | null;
  freightPayment?: string | null;
  prepaidValue?: string | null;
  collectValue?: string | null;
  shipperReferences?: string[] | null;
  showShipperReferencesOnFcr?: boolean;

  parties?: FcrParty[];
  containers?: FcrContainer[];
  vessels?: FcrVessel[];

  status: string;
  finalizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useFcr() {
  const isLoading = ref(false);

  const fetchFcrs = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/fcrs`, {
        method: "GET",
      });
      return { success: true, data: response as Fcr[] };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const createFcr = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/fcrs`, {
        method: "POST",
      });
      return { success: true, data: response as Fcr };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const updateFcrDraftById = async (fcrId: string, payload: Record<string, unknown>) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/fcrs/${fcrId}/draft`, {
        method: "PATCH",
        body: payload,
      });
      return { success: true, data: response as Fcr };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteFcr = async (fcrId: string) => {
    isLoading.value = true;
    try {
      await $fetch(`/api/operational/jobs/fcrs/${fcrId}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const finalizeFcrById = async (fcrId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/fcrs/${fcrId}/finalize`, {
        method: "POST",
      });
      return { success: true, data: response as Fcr };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const unfinalizeFcrById = async (fcrId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/fcrs/${fcrId}/unfinalize`, {
        method: "POST",
      });
      return { success: true, data: response as Fcr };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    fetchFcrs,
    createFcr,
    updateFcrDraftById,
    finalizeFcrById,
    unfinalizeFcrById,
    deleteFcr,
  };
}
