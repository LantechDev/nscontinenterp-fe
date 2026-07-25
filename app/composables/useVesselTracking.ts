import { type AuthResponse } from "../types/auth";

export interface VesselTrackingLeg {
  id: string;
  trackingId: string;
  sequence: number;
  vesselType: string;
  initialTransportId: string | null;
  initialTransportType: string;
  initialVesselName: string | null;
  initialVoyageNumber: string | null;
  initialTsPortId: string | null;
  initialTsPortName: string | null;
  initialEtd: string | null;
  initialEta: string | null;
  updatedTransportId: string | null;
  updatedTransportType: string;
  updatedVesselName: string | null;
  updatedVoyageNumber: string | null;
  updatedTsPortId: string | null;
  updatedTsPortName: string | null;
  updatedEtd: string | null;
  updatedEta: string | null;
  remarks: string | null;
}

export interface VesselTracking {
  id: string;
  jobId: string;
  jobNumber: string;
  status: string;
  remarks: string | null;
  startedAt: string;
  customerName: string;
  consigneeName: string;
  overseasAgentName: string;
  linerName: string;
  carrierBlNo: string;
  hblNo: string;
  containerNo: string;
  pol: string;
  pod: string;
  polName: string;
  podName: string;
  initialVesselDetail: string;
  updatedVesselDetail: string;
  delayDays: number;
  legs: VesselTrackingLeg[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateVesselTrackingPayload {
  remarks?: string | null;
  deletedLegIds?: string[];
  legs?: Array<{
    id: string;
    sequence?: number | null;
    vesselType?: string | null;
    updatedTransportId?: string | null;
    updatedTransportType?: string | null;
    updatedVesselName?: string | null;
    updatedVoyageNumber?: string | null;
    updatedTsPortId?: string | null;
    updatedEtd?: string | null;
    updatedEta?: string | null;
    remarks?: string | null;
  }>;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string; error?: string } }).data;
    return data?.message || data?.error || "An error occurred";
  }
  return error instanceof Error ? error.message : "An error occurred";
}

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  console.error("[useVesselTracking API Error]", error);
  return { success: false, error: getErrorMessage(error) };
}

export function useVesselTracking() {
  const isLoading = ref(false);
  const trackings = useState<VesselTracking[]>("vessel-trackings-list", () => []);

  async function fetchVesselTrackings(search?: string): Promise<AuthResponse<VesselTracking[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<VesselTracking[]>("/api/operational/vessel-tracking", {
        query: search ? { search } : undefined,
      });
      trackings.value = data || [];
      return { success: true, data: trackings.value };
    } catch (error) {
      return handleApiError<VesselTracking[]>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function startVesselTracking(jobId: string): Promise<AuthResponse<VesselTracking>> {
    isLoading.value = true;
    try {
      const data = await $fetch<VesselTracking>(
        `/api/operational/vessel-tracking/jobs/${jobId}/start`,
        { method: "POST" },
      );
      trackings.value = [data, ...trackings.value.filter((item) => item.id !== data.id)];
      return { success: true, data };
    } catch (error) {
      return handleApiError<VesselTracking>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateVesselTracking(
    id: string,
    payload: UpdateVesselTrackingPayload,
  ): Promise<AuthResponse<VesselTracking>> {
    isLoading.value = true;
    try {
      const data = await $fetch<VesselTracking>(`/api/operational/vessel-tracking/${id}`, {
        method: "PATCH",
        body: payload,
      });
      const index = trackings.value.findIndex((item) => item.id === id);
      if (index >= 0) trackings.value[index] = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError<VesselTracking>(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    trackings,
    fetchVesselTrackings,
    startVesselTracking,
    updateVesselTracking,
  };
}
