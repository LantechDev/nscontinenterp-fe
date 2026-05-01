import { d as useState, u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

function getApiBase() {
  const config = useRuntimeConfig();
  return config.public.apiBase;
}
function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
const companyApi = {
  async fetchCompanies(params) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies`, {
        params,
        credentials: "include",
      });
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: getErrorMessage(error), data: [] };
    }
  },
  async getCompanyById(id) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async getCompanyDetails(id) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies/${id}/details`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async createCompany(companyData) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies`, {
        method: "POST",
        body: companyData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async updateCompany(id, companyData) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies/${id}`, {
        method: "PUT",
        body: companyData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async deleteCompany(id) {
    try {
      await $fetch(`${getApiBase()}/master/companies/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async createAddress(companyId, addressData) {
    try {
      const data = await $fetch(`${getApiBase()}/master/companies/${companyId}/addresses`, {
        method: "POST",
        body: addressData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async updateAddress(companyId, addressId, addressData) {
    try {
      const data = await $fetch(
        `${getApiBase()}/master/companies/${companyId}/addresses/${addressId}`,
        {
          method: "PUT",
          body: addressData,
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
  async deleteAddress(companyId, addressId) {
    try {
      await $fetch(`${getApiBase()}/master/companies/${companyId}/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
function useCompanies() {
  const companies = useState("companies", () => []);
  const isLoading = ref(false);
  async function fetchCompanies(params) {
    isLoading.value = true;
    try {
      const result = await companyApi.fetchCompanies(params);
      if (result.success && result.data) {
        companies.value = result.data;
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function getCompanyById(id) {
    isLoading.value = true;
    try {
      return await companyApi.getCompanyById(id);
    } finally {
      isLoading.value = false;
    }
  }
  async function getCompanyDetails(id) {
    isLoading.value = true;
    try {
      return await companyApi.getCompanyDetails(id);
    } finally {
      isLoading.value = false;
    }
  }
  async function createCompany(companyData) {
    isLoading.value = true;
    try {
      const result = await companyApi.createCompany(companyData);
      if (result.success && result.data) {
        companies.value = [result.data, ...companies.value];
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateCompany(id, companyData) {
    isLoading.value = true;
    try {
      const result = await companyApi.updateCompany(id, companyData);
      if (result.success && result.data) {
        companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...result.data } : c));
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteCompany(id) {
    isLoading.value = true;
    try {
      const result = await companyApi.deleteCompany(id);
      if (result.success) {
        companies.value = companies.value.filter((c) => c.id !== id);
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function createAddress(companyId, addressData) {
    isLoading.value = true;
    try {
      return await companyApi.createAddress(companyId, addressData);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateAddress(companyId, addressId, addressData) {
    isLoading.value = true;
    try {
      return await companyApi.updateAddress(companyId, addressId, addressData);
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteAddress(companyId, addressId) {
    isLoading.value = true;
    try {
      return await companyApi.deleteAddress(companyId, addressId);
    } finally {
      isLoading.value = false;
    }
  }
  return {
    companies,
    isLoading,
    fetchCompanies,
    getCompanyById,
    getCompanyDetails,
    createCompany,
    updateCompany,
    deleteCompany,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}

export { useCompanies as u };
//# sourceMappingURL=useCompanies-D5TCq9CR.mjs.map
