import axios from "axios";

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

export function useJobs() {
    const config = useRuntimeConfig();
    const isLoading = useState<boolean>("jobs-loading", () => false);
    const jobs = useState<JobWithBls[]>("jobs-list", () => []);
    const currentJob = useState<JobWithBls | null>("jobs-current", () => null);

    const apiBase = config.public.apiBase;
    const baseURL = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;

    const api = axios.create({
        baseURL: baseURL,
        withCredentials: true,
    });

    async function fetchJobs() {
        isLoading.value = true;
        try {
            const { data } = await api.get("/operational/jobs");
            jobs.value = data || [];
            return { success: true, data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
        } finally {
            isLoading.value = false;
        }
    }

    async function createJob(payload: CreateJob) {
        isLoading.value = true;
        try {
            const { data } = await api.post("/operational/jobs", payload);
            // Optimistically update or re-fetch
            // For now, simpler to re-fetch to get server-generated fields
            await fetchJobs();
            return { success: true, data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
        } finally {
            isLoading.value = false;
        }
    }

    async function getJob(id: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get(`/operational/jobs/${id}`);
            currentJob.value = data;
            return { success: true, data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
        } finally {
            isLoading.value = false;
        }
    }

    async function updateBl(id: string, payload: UpdateBl) {
        isLoading.value = true;
        try {
            const { data } = await api.put(`/operational/jobs/bl/${id}`, payload);
            // Update local state if currentJob is present and has this BL
            if (currentJob.value && currentJob.value.billsOfLading) {
                const blIndex = currentJob.value.billsOfLading.findIndex((bl) => bl.id === id);
                if (blIndex !== -1) {
                    currentJob.value.billsOfLading[blIndex] = data;
                }
            }
            return { success: true, data };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteBl(id: string) {
        isLoading.value = true;
        try {
            await api.delete(`/operational/jobs/bl/${id}`);
            // Remove from local state
            if (currentJob.value && currentJob.value.billsOfLading) {
                currentJob.value.billsOfLading = currentJob.value.billsOfLading.filter(
                    (bl) => bl.id !== id
                );
            }
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data || error.message,
            };
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
