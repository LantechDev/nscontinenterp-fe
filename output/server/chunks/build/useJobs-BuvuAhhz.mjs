import { d as useState, u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

const formatPath = (path) => {
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
const formatIssues = (issues) => {
  return issues
    .map((issue) => {
      const path = formatPath(issue.path);
      return `${path ? path + ": " : ""}${issue.message}`;
    })
    .join(" | ");
};
function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.error?.issues && Array.isArray(errorData.error.issues)) {
      return formatIssues(errorData.error.issues);
    }
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
      } catch {}
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
function handleApiError(error) {
  return { success: false, error: getErrorMessage(error) };
}
function useJobs() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const jobs = useState("jobs-list", () => []);
  const currentJob = useState("jobs-current", () => null);
  async function fetchJobs() {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs`, {
        credentials: "include",
      });
      jobs.value = data || [];
      return { success: true, data: jobs.value };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function createJob(payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      jobs.value = [...jobs.value, data];
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function getJob(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/${id}`, {
        credentials: "include",
      });
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateBl(id, payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}`, {
        method: "PUT",
        body: payload,
        credentials: "include",
      });
      if (currentJob.value && currentJob.value.billsOfLading) {
        const blIndex = currentJob.value.billsOfLading.findIndex((bl) => bl.id === id);
        if (blIndex !== -1) {
          currentJob.value.billsOfLading[blIndex] = data;
        }
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateBlDraft(id, payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}`, {
        method: "PATCH",
        body: payload,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function finalizeBl(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}/finalize`, {
        method: "POST",
        credentials: "include",
      });
      if (currentJob.value && currentJob.value.billsOfLading) {
        const blIndex = currentJob.value.billsOfLading.findIndex((bl) => bl.id === id);
        if (blIndex !== -1) {
          currentJob.value.billsOfLading[blIndex] = data;
        }
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function requestFinalizeBl(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(
        `${config.public.apiBase}/operational/jobs/bl/${id}/request-finalize`,
        {
          method: "POST",
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
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function unfinalizeBl(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}/unfinalize`, {
        method: "POST",
        credentials: "include",
      });
      if (currentJob.value && currentJob.value.billsOfLading) {
        const blIndex = currentJob.value.billsOfLading.findIndex((bl) => bl.id === id);
        if (blIndex !== -1) {
          currentJob.value.billsOfLading[blIndex] = data;
        }
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteBl(id) {
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
  async function rejectBl(id, reason) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}/reject`, {
        method: "POST",
        credentials: "include",
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
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateJob(id, payload) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/${id}`, {
        method: "PUT",
        body: payload,
        credentials: "include",
      });
      const index = jobs.value.findIndex((j) => j.id === id);
      if (index !== -1) {
        jobs.value[index] = data;
      }
      currentJob.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function getBlRender(id) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/bl/${id}/render`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function getJobDocuments(jobId) {
    try {
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/${jobId}/documents`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  }
  async function uploadJobDocument(jobId, file) {
    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await $fetch(`${config.public.apiBase}/operational/jobs/${jobId}/documents`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteJobDocument(jobId, docId) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/operational/jobs/${jobId}/documents/${docId}`, {
        method: "DELETE",
        credentials: "include",
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

export { useJobs as u };
//# sourceMappingURL=useJobs-BuvuAhhz.mjs.map
