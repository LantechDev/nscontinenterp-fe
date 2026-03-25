import { type AuthResponse } from "../types/auth";
export type { BlParty } from "~/types/operational";
import { getErrorMessage } from "~/lib/utils";

// TypeScript Interfaces based on OpenAPI spec
export interface Job {
  id: string;
  jobNumber: string;
  organizationId: string;
  pol: string;
  pod: string;
  tradeTypeId?: string | null;
  commodity: string;
  containerTypeId?: string | null;
  quantity: number;
  cargoMovementId?: string | null;
  deliveryMovementId?: string | null;
  vesselId?: string | null;
  etd?: string | null;
  eta?: string | null;
  grossWeight?: string | null;
  netWeight?: string | null;
  measurement?: string | null;
  shippingMark?: string | null;
  totalBlCount: number;
  statusId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  vessel?: { name: string; imoNumber?: string | null } | null;
  containerType?: { name: string; code: string } | null;
  tradeType?: { name: string; code: string } | null;
  cargoMovement?: { name: string; code: string } | null;
  deliveryMovement?: { name: string; code: string } | null;
  jobParties?: JobParty[];
  status?: { name: string; code: string } | null;
}

export interface JobParty {
  id: string;
  partyRoleId: string;
  companyName?: string;
  partyRole?: { name: string; code?: string };
  company?: { name: string };
}

export interface BillOfLading {
  id: string;
  blNumber: string;
  containerNumber?: string | null;
  sealNumber?: string | null;
  grossWeight?: string | null;
  cargoDescription?: string | null;
  status?: { name: string; code?: string } | null;
  blParties?: BlParty[];
  createdAt: string;
  updatedAt: string;
}

export interface JobWithBls extends Job {
  billsOfLading: BillOfLading[];
}

export interface CreateJob {
  shipperId: string;
  consigneeId: string;
  notifyPartyId?: string;
  commodity: string;
  containerTypeId?: string;
  pol: string;
  pod: string;
  vesselId?: string;
  etd?: string;
  eta?: string;
  totalBlCount: number;
}

export interface UpdateBl {
  blNumber?: string;
  containerNumber?: string;
  sealNumber?: string;
  grossWeight?: number;
  cargoDescription?: string;
}

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  return { success: false, error: getErrorMessage(error) };
}

export function useJobs() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const jobs = useState<JobWithBls[]>("jobs-list", () => []);
  const currentJob = useState<JobWithBls | null>("jobs-current", () => null);

  async function fetchJobs(): Promise<AuthResponse<JobWithBls[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls[]>(`${config.public.apiBase}/operational/jobs`, {
        credentials: "include",
      });
      jobs.value = data || [];
      return { success: true, data: jobs.value };
    } catch (error) {
      return handleApiError<JobWithBls[]>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createJob(payload: CreateJob): Promise<AuthResponse<JobWithBls>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls>(`${config.public.apiBase}/operational/jobs`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      jobs.value = [...jobs.value, data];
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobWithBls>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getJob(id: string): Promise<AuthResponse<JobWithBls>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls>(`${config.public.apiBase}/operational/jobs/${id}`, {
        credentials: "include",
      });
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobWithBls>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateBl(id: string, payload: UpdateBl): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(
        `${config.public.apiBase}/operational/jobs/bl/${id}`,
        {
          method: "PUT",
          body: payload,
          credentials: "include",
        },
      );
      if (currentJob.value && currentJob.value.billsOfLading) {
        const blIndex = currentJob.value.billsOfLading.findIndex((bl) => bl.id === id);
        if (blIndex !== -1) {
          currentJob.value.billsOfLading[blIndex] = data;
        }
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError<BillOfLading>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteBl(id: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (currentJob.value && currentJob.value.billsOfLading) {
        currentJob.value.billsOfLading = currentJob.value.billsOfLading.filter(
          (bl) => bl.id !== id,
        );
      }
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    jobs,
    currentJob,
    isLoading,
    fetchJobs,
    createJob,
    getJob,
    updateBl,
    deleteBl,
  };
}
