import axios, { type AxiosError } from "axios";

import { type AuthResponse } from "../types/auth";

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

export interface BlParty {
  id: string;
  partyRoleCode?: string;
  companyName?: string;
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

type ErrorResponse = {
  message?: string;
  error?: string;
};

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  const axiosError = error as AxiosError<ErrorResponse>;
  const apiError = axiosError.response?.data;
  const errorMessage =
    typeof apiError === "string"
      ? apiError
      : apiError?.message || apiError?.error || axiosError.message || "An error occurred";

  return { success: false, error: errorMessage };
}

export function useJobs() {
  const config = useRuntimeConfig();
  const isLoading = useState<boolean>("jobs-loading", () => false);
  const jobs = useState<JobWithBls[]>("jobs-list", () => []);
  const currentJob = useState<JobWithBls | null>("jobs-current", () => null);

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

  async function fetchJobs(): Promise<AuthResponse<JobWithBls[]>> {
    isLoading.value = true;
    try {
      const { data } = await api.get<JobWithBls[]>("/operational/jobs");
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
      const { data } = await api.post<JobWithBls>("/operational/jobs", payload);
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
      const { data } = await api.get<JobWithBls>(`/operational/jobs/${id}`);
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
      const { data } = await api.put<BillOfLading>(`/operational/jobs/bl/${id}`, payload);
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
      await api.delete(`/operational/jobs/bl/${id}`);
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
