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

type ErrorResponse = {
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

export function useEbls() {
  const config = useRuntimeConfig();
  const ebls = ref<EblData[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchEbls(): Promise<EblData[]> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<EblData[]>(`${config.public.apiBase}/operational/jobs/bls`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      ebls.value = data || [];
      return ebls.value;
    } catch (err) {
      error.value = getErrorMessage(err);
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
      const data = await $fetch<EblData>(`${config.public.apiBase}/operational/jobs/bl/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (err) {
      error.value = getErrorMessage(err);
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
