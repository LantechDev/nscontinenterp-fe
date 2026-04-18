import type { Company, ContainerType, PackageType } from "~/composables/useMasterData";
import type { BlData, BlParty } from "~/types/operational";

function findParty(parties: BlParty[] | undefined, roleCode: string): BlParty | undefined {
  if (!parties) return undefined;
  return parties.find((p) => p.partyRole?.code === roleCode || p.partyRoleCode === roleCode);
}

export interface FormData {
  blNumber: string;
  containerNumber: string;
  sealNumber: string;
  containerTypeId: string;
  grossWeight: number;
  netWeight: number;
  measurement: number;
  packagesCount: number;
  packageTypeId: string;
  cargoDescription: string;
  statusId: string;
  shipperId: string;
  consigneeId: string;
  notifyPartyId: string;
}

export function useBlEditor(blId: string) {
  const { confirm } = useConfirm();
  const { fetchCompanies, fetchContainerTypes, fetchPackageTypes } = useMasterData();

  const companies = ref<Company[]>([]);
  const containerTypes = ref<ContainerType[]>([]);
  const packageTypes = ref<PackageType[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  const formData = reactive<FormData>({
    blNumber: "",
    containerNumber: "",
    sealNumber: "",
    containerTypeId: "",
    grossWeight: 0,
    netWeight: 0,
    measurement: 0,
    packagesCount: 0,
    packageTypeId: "",
    cargoDescription: "",
    statusId: "",
    shipperId: "",
    consigneeId: "",
    notifyPartyId: "",
  });

  async function loadBlData() {
    if (!blId) return;
    isLoading.value = true;
    try {
      const response = await $fetch<{ data: BlData }>(`/api/operational/bill-of-lading/${blId}`);
      const data = response.data;

      formData.blNumber = data.blNumber || "";
      formData.containerNumber = data.containerNumber || "";
      formData.sealNumber = data.sealNumber || "";
      formData.containerTypeId = data.containerTypeId || "";
      formData.grossWeight = Number(data.grossWeight) || 0;
      formData.netWeight = Number(data.netWeight) || 0;
      formData.measurement = Number(data.measurement) || 0;
      formData.packagesCount = data.packagesCount || 0;
      formData.packageTypeId = data.packageTypeId || "";
      formData.cargoDescription = data.cargoDescription || "";
      formData.statusId = data.statusId || "";

      const shipper = findParty(data.blParties, "SHIPPER");
      const consignee = findParty(data.blParties, "CONSIGNEE");
      const notify = findParty(data.blParties, "NOTIFY_PARTY");

      formData.shipperId = shipper?.companyId || "";
      formData.consigneeId = consignee?.companyId || "";
      formData.notifyPartyId = notify?.companyId || "";
    } catch (error) {
      console.error("Failed to load BL", error);
      await confirm({
        title: "Error",
        message: "Failed to load BL details",
        type: "danger",
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMasterData() {
    const [companiesData, containerData, packageData] = await Promise.all([
      fetchCompanies(),
      fetchContainerTypes(),
      fetchPackageTypes(),
    ]);
    companies.value = companiesData || [];
    containerTypes.value = containerData || [];
    packageTypes.value = packageData || [];
  }

  async function handleCopyFromJob(onSuccess?: () => void) {
    const confirmed = await confirm({
      title: "Copy from Job",
      message: "This will overwrite existing parties with data from the Job. Continue?",
    });
    if (!confirmed) return;

    isLoading.value = true;
    try {
      await $fetch(`/api/operational/bill-of-lading/${blId}/copy-from-job`, {
        method: "POST",
        credentials: "include",
      });
      await loadBlData();
      await confirm({
        title: "Success",
        message: "Data copied from Job. You can now edit it for this BL.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Copy failed", error);
      await confirm({
        title: "Error",
        message: "Failed to copy data",
        type: "danger",
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function handleSave(): Promise<boolean> {
    isSaving.value = true;
    try {
      const payload = {
        ...formData,
        parties: [
          { roleCode: "SHIPPER", companyId: formData.shipperId },
          { roleCode: "CONSIGNEE", companyId: formData.consigneeId },
          { roleCode: "NOTIFY_PARTY", companyId: formData.notifyPartyId },
        ].filter((p) => p.companyId),
      };

      await $fetch(`/api/operational/bill-of-lading/${blId}`, {
        method: "PATCH",
        body: payload,
        credentials: "include",
      });

      return true;
    } catch (error) {
      console.error("Save failed", error);
      await confirm({
        title: "Error",
        message: "Failed to save BL",
        type: "danger",
      });
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function initialize() {
    await Promise.all([loadMasterData(), loadBlData()]);
  }

  return {
    // State
    formData,
    companies,
    containerTypes,
    packageTypes,
    isLoading,
    isSaving,

    // Methods
    loadBlData,
    loadMasterData,
    handleCopyFromJob,
    handleSave,
    initialize,
  };
}
