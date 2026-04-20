import { t as toast } from "./index-DJGQOf1Z.mjs";
import { u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

const usePayments = () => {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const isSaving = ref(false);
  async function fetchPayments() {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/finance/payment`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || "Failed to fetch payments" };
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchPaymentById(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/finance/payment/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch payment details",
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function createPayment(data) {
    isSaving.value = true;
    try {
      const responseData = await $fetch(`${config.public.apiBase}/finance/payment`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      toast.success("Payment recorded successfully");
      return { success: true, data: responseData };
    } catch (error) {
      const errorMsg = error.message || "Failed to record payment";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isSaving.value = false;
    }
  }
  async function fetchOutstandingReport(filters = {}) {
    isLoading.value = true;
    try {
      const query = {};
      if (filters.companyId) query.companyId = filters.companyId;
      if (filters.month) query.month = filters.month;
      if (filters.year) query.year = filters.year;
      if (filters.page) query.page = filters.page;
      if (filters.limit) query.limit = filters.limit;
      const data = await $fetch(`${config.public.apiBase}/finance/report/outstanding`, {
        query,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch outstanding report",
      };
    } finally {
      isLoading.value = false;
    }
  }
  async function deletePayment(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/finance/payment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      toast.success("Payment deleted successfully");
      return { success: true };
    } catch (error) {
      const msg = error.message || "Failed to delete payment";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  }
  async function voidPayment(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/finance/payment/${id}/void`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Payment voided successfully");
      return { success: true };
    } catch (error) {
      const e = error;
      const errorMsg = e.data?.message || e.message || "Failed to void payment";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    isSaving,
    fetchPayments,
    fetchPaymentById,
    createPayment,
    fetchOutstandingReport,
    deletePayment,
    voidPayment,
  };
};

export { usePayments as u };
//# sourceMappingURL=usePayments-BGfFm4PO.mjs.map
