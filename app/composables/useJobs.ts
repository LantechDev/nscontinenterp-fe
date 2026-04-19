import { type AuthResponse } from "../types/auth";
import type {
  ActiveBlData,
  ActiveJobData,
  EblContainer,
} from "../components/operational/ebl/types";

export interface JobVessel {
  id: string;
  vesselId: string | null;
  vesselName: string | null;
  voyageNumber: string | null;
  etd: string | null;
  sequence: number;
  vessel?: { name: string; imoNumber?: string | null } | null;
}

export interface BlVessel {
  id: string;
  vesselId: string | null;
  vesselName: string | null;
  voyageNumber: string | null;
  etd: string | null;
  sequence: number;
  vessel?: { name: string; imoNumber?: string | null } | null;
}

export interface JobDocumentItem {
  id: string;
  jobId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  createdAt: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  organizationId: string;
  pol: string;
  pod: string;
  polName?: string | null;
  podName?: string | null;
  voyageNumber?: string | null;
  preCarriageBy?: string | null;
  placeOfReceipt?: string | null;
  placeOfDelivery?: string | null;
  finalDestination?: string | null;
  tradeTypeId?: string | null;
  commodity: string;
  mainDescription?: string | null;
  containerTypeId?: string | null;
  vendorId?: string | null;
  customerId?: string | null;
  serviceId?: string | null;
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
  freightTerm?: "PREPAID" | "COLLECT" | null;
  hsCode?: string | null;
  blType?: "DRAFT" | "ORIGINAL" | "SEAWAYBILL" | null;
  isNegotiable?: boolean;
  placeOfIssue?: string | null;
  dateOfIssue?: string | null;
  customerReference?: string | null;
  createdAt: string;
  updatedAt: string;
  vessels?: JobVessel[];
  // Relations
  vessel?: { name: string; imoNumber?: string | null } | null;
  containerType?: { name: string; code: string } | null;
  tradeType?: { name: string; code: string } | null;
  cargoMovement?: { name: string; code: string } | null;
  deliveryMovement?: { name: string; code: string } | null;
  vendor?: { name: string } | null;
  customer?: { name: string } | null;
  service?: { name: string } | null;
  jobParties?: JobParty[];
  jobContainers?: {
    id: string;
    containerNumber?: string | null;
    sealNumber?: string | null;
    containerTypeId?: string | null;
    containerType?: { name: string; code: string } | null;
    items?: {
      id: string;
      sequenceNo: number;
      qty: number;
      packageTypeCode: string;
      grossWeight?: string | null;
      netWeight?: string | null;
      measurementCbm?: string | null;
      description?: string | null;
      hsCode?: string | null;
      isHazardous?: boolean;
    }[];
    isHazardous?: boolean;
    totalQty?: number | null;
    totalGrossWeight?: string | null;
    totalMeasurementCbm?: string | null;
  }[];
  status?: { name: string; code: string } | null;
}

export interface JobParty {
  id: string;
  partyRoleId: string;
  companyId: string;
  addressBookId?: string | null;
  companyName?: string;
  partyRole?: { name: string; code?: string };
  company?: { name: string };
  addressBook?: { fullAddress?: string; address?: string; city?: string; isDefault?: boolean };
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
  freightTerm?: "PREPAID" | "COLLECT" | null;
  blType?: "DRAFT" | "ORIGINAL" | "SEAWAYBILL" | null;
  placeOfIssue?: string | null;
  dateOfIssue?: string | null;
  isNegotiable?: boolean;
  pol?: string | null;
  pod?: string | null;
  vesselId?: string | null;
  voyageNumber?: string | null;
  preCarriageBy?: string | null;
  placeOfReceipt?: string | null;
  placeOfDelivery?: string | null;
  finalDestination?: string | null;
  etd?: string | null;
  eta?: string | null;
  commodity?: string | null;
  mainDescription?: string | null;
  shippingMark?: string | null;
  hsCode?: string | null;
  dateCargoReceived?: string | null;
  status?: { name: string; code?: string } | null;
  blParties?: BlParty[];
  vessels?: BlVessel[];
  // Mapping for frontend UI / edit.vue
  items?: {
    id: string;
    sequenceNo: number;
    qty: number;
    packageTypeCode: string;
    grossWeight?: string | null;
    netWeight?: string | null;
    measurementCbm?: string | null;
    description?: string | null;
    hsCode?: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BlRenderResponse {
  bl?: ActiveBlData;
  parties: Record<string, { name: string; address: string }>;
  mainDescription?: string | null;
  job?: Partial<ActiveJobData>;
  renderContainers: EblContainer[];
  jobContainers: EblContainer[];
  totals?: {
    qty: number;
    grossWeight: number;
    netWeight: number;
    measurement: number;
  };
}

export interface JobWithBls extends Job {
  billsOfLading: BillOfLading[];
}

export interface CreateJob {
  shipperId: string;
  shipperAddressId?: string;
  consigneeId: string;
  consigneeAddressId?: string;
  notifyPartyId?: string;
  notifyPartyAddressId?: string;
  forwarderId?: string;
  forwarderAddressId?: string;
  commodity: string;
  customerId?: string;
  containerTypeId?: string;
  pol: string;
  pod: string;
  vesselId?: string;
  voyageNumber?: string | null;
  preCarriageBy?: string | null;
  placeOfReceipt?: string | null;
  placeOfDelivery?: string | null;
  finalDestination?: string | null;
  etd?: string;
  eta?: string;
  vessels?: {
    vesselId?: string | null;
    vesselName?: string | null;
    voyageNumber?: string | null;
    etd?: string | null;
    sequence?: number;
  }[];
  totalBlCount: number;
  tradeTypeId?: string;
  cargoMovementId?: string;
  deliveryMovementId?: string;
  grossWeight?: number | null;
  netWeight?: number | null;
  measurement?: number | null;
  shippingMark?: string;
  mainDescription?: string;

  freightTerm?: "PREPAID" | "COLLECT";
  hsCode?: string;
  blType?: "DRAFT" | "ORIGINAL" | "SEAWAYBILL";
  isNegotiable?: boolean;
  placeOfIssue?: string;
  dateOfIssue?: string;

  containers?: {
    containerNumber?: string;
    sealNumber?: string;
    containerTypeId?: string;
    items?: {
      sequenceNo: number;
      qty: number;
      packageTypeCode: string;
      grossWeight?: number | null;
      netWeight?: number | null;
      measurementCbm?: number | null;
      description?: string | null;
      hsCode?: string | null;
    }[];
  }[];
}

export interface UpdateBl {
  blNumber?: string;
  containerNumber?: string;
  sealNumber?: string;
  grossWeight?: number;
  cargoDescription?: string;
}

export interface UpdateBlDraft {
  shipperId?: string;
  shipperAddressId?: string;
  consigneeId?: string;
  consigneeAddressId?: string;
  notifyPartyId?: string;
  notifyPartyAddressId?: string;
  forwarderId?: string;
  forwarderAddressId?: string;
  customerId?: string;

  cargoDescription?: string;
  mainDescription?: string;
  shippingMark?: string;
  commodity?: string;
  hsCode?: string;

  blNumber?: string;
  blType?: string;
  freightTerm?: "PREPAID" | "COLLECT";
  totalBlCount?: number;
  isNegotiable?: boolean;
  placeOfIssue?: string;
  dateOfIssue?: string;

  pol?: string;
  pod?: string;
  vesselId?: string;
  voyageNumber?: string | null;
  preCarriageBy?: string | null;
  placeOfReceipt?: string | null;
  placeOfDelivery?: string | null;
  finalDestination?: string | null;
  etd?: string;
  eta?: string;
  vessels?: {
    vesselId?: string | null;
    vesselName?: string | null;
    voyageNumber?: string | null;
    etd?: string | null;
    sequence?: number;
  }[];
  tradeTypeId?: string;
  cargoMovementId?: string;
  deliveryMovementId?: string;

  containers?: {
    containerNumber?: string;
    sealNumber?: string;
    containerTypeId?: string;
    items?: {
      sequenceNo: number;
      qty: number;
      packageTypeCode: string;
      grossWeight?: number;
      netWeight?: number;
      measurementCbm?: number;
      description?: string;
      hsCode?: string;
    }[];
  }[];
}

// Removed unused ErrorResponse

const formatPath = (path: (string | number)[]) => {
  if (!path || path.length === 0) return "";
  return path
    .map((p, _i) => {
      if (typeof p === "number") return (p + 1).toString();
      if (p === "containers") return "Container #";
      if (p === "items") return "Item #";
      return p;
    })
    .join("")
    .replace(/#(\d+)/g, "#$1 ")
    .replace(/\.([^0-9])/g, " $1")
    .trim();
};

const formatIssues = (issues: Array<{ path: (string | number)[]; message: string }>) => {
  return issues
    .map((issue) => {
      const path = formatPath(issue.path);
      return `${path ? path + ": " : ""}${issue.message}`;
    })
    .join(" | ");
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (
      error as {
        data?: {
          error?: { issues?: Array<{ path: (string | number)[]; message: string }> };
          message?: string;
        };
      }
    ).data;

    // Case 1: Issues are in an array under error.issues
    if (errorData?.error?.issues && Array.isArray(errorData.error.issues)) {
      return formatIssues(errorData.error.issues);
    }

    // Case 2: message is a stringified JSON array
    if (
      typeof errorData?.message === "string" &&
      (errorData.message.startsWith("[") || errorData.message.startsWith("{"))
    ) {
      try {
        const parsed = JSON.parse(errorData.message);
        const issues = Array.isArray(parsed) ? parsed : parsed.issues || parsed.error?.issues || [];
        if (Array.isArray(issues) && issues.length > 0) {
          return formatIssues(issues);
        }
      } catch {
        // Fallback to original message if parsing fails
      }
    }

    if (errorData?.message) return errorData.message;
    if (errorData?.error)
      return typeof errorData.error === "string"
        ? errorData.error
        : JSON.stringify(errorData.error);
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  return { success: false, error: getErrorMessage(error) };
}

export function useJobs() {
  const isLoading = ref(false);
  const jobs = useState<JobWithBls[]>("jobs-list", () => []);
  const currentJob = useState<JobWithBls | null>("jobs-current", () => null);

  async function fetchJobs(): Promise<AuthResponse<JobWithBls[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls[]>("/api/operational/jobs");
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
      const data = await $fetch<JobWithBls>("/api/operational/jobs", {
        method: "POST",
        body: payload,
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
      const data = await $fetch<JobWithBls>(`/api/operational/jobs/${id}`);
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
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}`, {
        method: "PUT",
        body: payload,
      });
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

  async function updateBlDraft(
    id: string,
    payload: UpdateBlDraft,
  ): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}`, {
        method: "PATCH",
        body: payload,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<BillOfLading>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function finalizeBl(id: string): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}/finalize`, {
        method: "POST",
      });
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

  async function requestFinalizeBl(id: string): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}/request-finalize`, {
        method: "POST",
      });
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

  async function unfinalizeBl(id: string): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}/unfinalize`, {
        method: "POST",
      });
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
      await $fetch(`/api/operational/jobs/bl/${id}`, {
        method: "DELETE",
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

  async function rejectBl(id: string, reason: string): Promise<AuthResponse<BillOfLading>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BillOfLading>(`/api/operational/jobs/bl/${id}/reject`, {
        method: "POST",
        body: { reason },
      });
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

  async function updateJob(
    id: string,
    payload: Partial<CreateJob>,
  ): Promise<AuthResponse<JobWithBls>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls>(`/api/operational/jobs/${id}`, {
        method: "PUT",
        body: payload,
      });
      const index = jobs.value.findIndex((j) => j.id === id);
      if (index !== -1) {
        jobs.value[index] = data;
      }
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobWithBls>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function completeJob(id: string): Promise<AuthResponse<JobWithBls>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls>(`/api/operational/jobs/${id}/complete`, {
        method: "POST",
      });
      const index = jobs.value.findIndex((j) => j.id === id);
      if (index !== -1) {
        jobs.value[index] = data;
      }
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobWithBls>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelCompleteJob(id: string): Promise<AuthResponse<JobWithBls>> {
    isLoading.value = true;
    try {
      const data = await $fetch<JobWithBls>(`/api/operational/jobs/${id}/cancel-complete`, {
        method: "POST",
      });
      const index = jobs.value.findIndex((j) => j.id === id);
      if (index !== -1) {
        jobs.value[index] = data;
      }
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobWithBls>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getBlRender(id: string): Promise<AuthResponse<BlRenderResponse>> {
    isLoading.value = true;
    try {
      const data = await $fetch<BlRenderResponse>(`/api/operational/jobs/bl/${id}/render`);
      return { success: true, data };
    } catch (error) {
      return handleApiError<BlRenderResponse>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getJobDocuments(jobId: string): Promise<AuthResponse<JobDocumentItem[]>> {
    try {
      const data = await $fetch<JobDocumentItem[]>(`/api/operational/jobs/${jobId}/documents`);
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobDocumentItem[]>(error);
    }
  }

  async function uploadJobDocument(
    jobId: string,
    file: File,
  ): Promise<AuthResponse<JobDocumentItem>> {
    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await $fetch<JobDocumentItem>(`/api/operational/jobs/${jobId}/documents`, {
        method: "POST",
        body: formData,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<JobDocumentItem>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteJobDocument(jobId: string, docId: string): Promise<AuthResponse> {
    isLoading.value = true;
    try {
      await $fetch(`/api/operational/jobs/${jobId}/documents/${docId}`, {
        method: "DELETE",
      });
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
    updateJob,
    completeJob,
    cancelCompleteJob,
    getJob,
    updateBl,
    updateBlDraft,
    deleteBl,
    getBlRender,
    finalizeBl,
    requestFinalizeBl,
    unfinalizeBl,
    rejectBl,
    getJobDocuments,
    uploadJobDocument,
    deleteJobDocument,
  };
}
