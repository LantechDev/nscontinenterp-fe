import { d as useState, u as useRuntimeConfig } from "./server.mjs";
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
function useServices() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const services = useState("services-list", () => []);
  const currentService = useState("services-current", () => null);
  const categories = useState("service-categories-list", () => []);
  const units = useState("service-units-list", () => []);
  async function fetchServices(search, categoryId) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/services`, {
        params: { search, categoryId },
        credentials: "include",
      });
      services.value = data || [];
      return { success: true, data: services.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchCategories() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/service-categories`, {
        credentials: "include",
      });
      categories.value = data || [];
      return { success: true, data: categories.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }
  async function fetchUnits() {
    try {
      const data = await $fetch(`${config.public.apiBase}/master/service-units`, {
        credentials: "include",
      });
      units.value = data || [];
      return { success: true, data: units.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }
  async function getService(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/services/${id}`, {
        credentials: "include",
      });
      currentService.value = data;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function createService(payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/services`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      services.value = [...services.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function updateService(id, payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/master/services/${id}`, {
        method: "PUT",
        body: payload,
        credentials: "include",
      });
      if (currentService.value?.id === id) {
        currentService.value = data;
      }
      services.value = services.value.map((s) => (s.id === id ? { ...s, ...data } : s));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteService(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/master/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      services.value = services.value.filter((s) => s.id !== id);
      if (currentService.value?.id === id) {
        currentService.value = null;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }
  return {
    services,
    currentService,
    categories,
    units,
    isLoading,
    fetchServices,
    fetchCategories,
    fetchUnits,
    getService,
    createService,
    updateService,
    deleteService,
  };
}

export { useServices as u };
//# sourceMappingURL=useServices-DFtvjO_i.mjs.map
