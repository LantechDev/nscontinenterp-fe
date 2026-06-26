/* eslint-disable @typescript-eslint/no-explicit-any -- API error catch + loose data */
import { ref } from "vue";

export interface BcParty {
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

export interface BcContainerItem {
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

export interface BcContainer {
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
  items?: BcContainerItem[];
}

export interface BcVessel {
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

export interface BookingConfirmation {
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
  showShipperReferencesOnBc?: boolean;

  parties?: BcParty[];
  containers?: BcContainer[];
  vessels?: BcVessel[];

  status: string;
  finalizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useBookingConfirmation() {
  const isLoading = ref(false);

  const getBookingConfirmation = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/booking-confirmation`, {
        method: "GET",
      });
      return { success: true, data: response as BookingConfirmation | null };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const createBookingConfirmation = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/booking-confirmation`, {
        method: "POST",
      });
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const updateBookingConfirmation = async (
    jobId: string,
    payload: Partial<BookingConfirmation>,
  ) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/booking-confirmation`, {
        method: "PATCH",
        body: payload,
      });
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const updateBookingConfirmationDraft = async (
    jobId: string,
    payload: Record<string, unknown>,
  ) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/operational/jobs/${jobId}/booking-confirmation/draft`, {
        method: "PATCH",
        body: payload,
      });
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const copyBookingConfirmationFromJob = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/${jobId}/booking-confirmation/copy-from-job`,
        { method: "POST" },
      );
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const finalizeBookingConfirmation = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/${jobId}/booking-confirmation/finalize`,
        {
          method: "POST",
        },
      );
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const unfinalizeBookingConfirmation = async (jobId: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch(
        `/api/operational/jobs/${jobId}/booking-confirmation/unfinalize`,
        {
          method: "POST",
        },
      );
      return { success: true, data: response as BookingConfirmation };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    getBookingConfirmation,
    createBookingConfirmation,
    updateBookingConfirmation,
    updateBookingConfirmationDraft,
    copyBookingConfirmationFromJob,
    finalizeBookingConfirmation,
    unfinalizeBookingConfirmation,
  };
}
