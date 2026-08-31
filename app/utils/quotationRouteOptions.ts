import type { ContainerType } from "../composables/useMasterData";

export interface QuotationServiceMode {
  serviceType?: string | null;
  shipmentType?: string | null;
}

export interface QuotationContainerTypeOption {
  id: string;
  name: string;
}

const AIR_CONTAINER_TYPE: QuotationContainerTypeOption = { id: "AIR_AIR", name: "AIR/AIR" };
const TRUCK_CONTAINER_TYPE_CODES = new Set(["CDE", "CDD", "CDD_LONG", "WING_BOX"]);

export function isQuotationAirFreight(mode: QuotationServiceMode) {
  return mode.serviceType === "AIR" || mode.shipmentType === "AIR";
}

export function getQuotationPortSearchType(mode: QuotationServiceMode): "ocean" | "air" {
  return isQuotationAirFreight(mode) ? "air" : "ocean";
}

export function normalizeQuotationServiceMode(mode: QuotationServiceMode) {
  if (isQuotationAirFreight(mode)) {
    return { serviceType: "AIR", shipmentType: "AIR" };
  }

  return {
    serviceType: mode.serviceType || "OCEAN",
    shipmentType: ["OCEAN", "AIR"].includes(mode.shipmentType || "")
      ? mode.shipmentType || "OCEAN"
      : "OCEAN",
  };
}

export function getQuotationContainerTypeOptions({
  serviceType,
  shipmentType,
  containerTypes,
}: QuotationServiceMode & { containerTypes: ContainerType[] }): QuotationContainerTypeOption[] {
  if (isQuotationAirFreight({ serviceType, shipmentType })) {
    return [AIR_CONTAINER_TYPE];
  }

  return containerTypes
    .filter((ct) => !TRUCK_CONTAINER_TYPE_CODES.has(ct.code))
    .map((ct) => ({
      id: ct.id,
      name: ct.name,
    }));
}
