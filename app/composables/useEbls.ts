import axios, { type AxiosError } from "axios";

interface EblStatus {
  code: string | null;
  name: string | null;
}

interface EblContainerType {
  code: string;
  name: string;
}

interface EblJob {
  jobNumber: string;
}

export interface EblData {
  id: string;
  blNumber: string;
  jobId: string;
  job?: EblJob;
  statusId: string | null;
  status?: EblStatus | null;
  containerTypeId: string | null;
  containerType?: EblContainerType | null;
  grossWeight: string | null;
  measurement: string | null;
  createdAt: string;
}

export function useEbls() {
  const config = useRuntimeConfig();
  const ebls = ref<EblData[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

  async function fetchEbls(): Promise<EblData[]> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.get<EblData[]>("/operational/jobs/bls");
      ebls.value = data || [];
      return ebls.value;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || "Failed to fetch EBLs";
      console.error("Error fetching EBLs:", err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getEblById(id: string): Promise<EblData | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await api.get<EblData>(`/operational/jobs/bl/${id}`);
      return data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || "Failed to fetch EBL";
      console.error("Error fetching EBL:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    ebls,
    isLoading,
    error,
    fetchEbls,
    getEblById,
  };
}
