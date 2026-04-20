import { u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function useInvoices() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  async function deleteInvoice(id) {
    try {
      await $fetch(`${config.public.apiBase}/finance/invoice/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }
  async function fetchInvoices(jobId) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/finance/invoice`, {
        query: jobId ? { jobId } : void 0,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      console.error("[Invoices] Failed to fetch:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchInvoiceById(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/finance/invoice/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function createInvoice(data) {
    isLoading.value = true;
    try {
      const responseData = await $fetch(`${config.public.apiBase}/finance/invoice`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function updateInvoice(id, data) {
    isLoading.value = true;
    try {
      const responseData = await $fetch(`${config.public.apiBase}/finance/invoice/${id}`, {
        method: "PATCH",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function voidInvoice(id) {
    isLoading.value = true;
    try {
      const responseData = await $fetch(`${config.public.apiBase}/finance/invoice/${id}/void`, {
        method: "POST",
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    voidInvoice,
  };
}

export { useInvoices as u };
//# sourceMappingURL=useInvoices-DKKCQ9mY.mjs.map
