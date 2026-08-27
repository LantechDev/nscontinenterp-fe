/* eslint-disable @typescript-eslint/no-explicit-any -- BC/FCR snapshots and Job payloads are loose API shapes */
type AnyRecord = Record<string, any>;

export interface BcDocumentForm {
  bookingNumber: string;
  bookingDate: string | null;
  serviceContractNo: string;
  warehouseDepotName: string;
  warehouseDepotAddress: string;
  pickupLocation: string;
  cutoffDate: string | null;
  cutoffTime: string;
  remarks: string;
  shipperId: string;
  shipperAddressId: string;
  consigneeId: string;
  consigneeAddressId: string;
  notifyPartyId: string;
  notifyPartyAddressId: string;
  isNotifySameAsConsignee: boolean;
  mainDescription: string;
  shippingMark: string;
  pol: string;
  pod: string;
  preCarriageBy: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  finalDestination: string;
  cargoMovementId: string;
  deliveryMovementId: string;
  eta: string;
  dateCargoReceived: string;
  freightPayment: string;
  prepaidValue: string;
  collectValue: string;
  shipperReferences: string[];
  showShipperReferencesOnBc: boolean;
  vessels: AnyRecord[];
  containers: AnyRecord[];
}

const toNum = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const pick = (...values: unknown[]): string => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const text = String(value);
    if (text.trim() !== "") return text;
  }
  return "";
};

const roleCode = (party: AnyRecord | undefined) =>
  String(party?.partyRole?.code || party?.partyRoleCode || "").toUpperCase();

const findRole = (items: AnyRecord[] | undefined, role: string) =>
  (items || []).find((item) => roleCode(item) === role);

const pickParty = (
  documentParties: AnyRecord[] | undefined,
  jobParties: AnyRecord[],
  role: string,
) => {
  const fromDocument = findRole(documentParties, role);
  const fromJob = findRole(jobParties, role);
  const source = fromDocument?.companyId ? fromDocument : fromJob || fromDocument;
  return {
    companyId: source?.companyId || source?.company?.id || "",
    addressBookId: source?.addressBookId || source?.addressBook?.id || "",
  };
};

const includesSamePlace = (value: string, place: string) =>
  Boolean(value && place && value.toUpperCase().includes(place.toUpperCase()));

const buildFreightValues = ({
  freightPayment,
  prepaidValue,
  collectValue,
  polDisplay,
  podDisplay,
}: {
  freightPayment: string;
  prepaidValue: string;
  collectValue: string;
  polDisplay: string;
  podDisplay: string;
}) => {
  let nextFreightPayment = freightPayment;
  let nextPrepaidValue = prepaidValue;
  let nextCollectValue = collectValue;

  if (!nextFreightPayment) {
    if (includesSamePlace(nextPrepaidValue, polDisplay)) nextFreightPayment = "PREPAID_POL";
    else if (includesSamePlace(nextPrepaidValue, podDisplay)) nextFreightPayment = "PREPAID_POD";
    else if (includesSamePlace(nextCollectValue, polDisplay)) nextFreightPayment = "COLLECT_POL";
    else if (includesSamePlace(nextCollectValue, podDisplay)) nextFreightPayment = "COLLECT_POD";
    else if (podDisplay) nextFreightPayment = "COLLECT_POD";
  }

  if (!nextPrepaidValue && !nextCollectValue) {
    if (nextFreightPayment === "PREPAID_POL" && polDisplay)
      nextPrepaidValue = `PREPAID AT ${polDisplay.toUpperCase()}`;
    else if (nextFreightPayment === "PREPAID_POD" && podDisplay)
      nextPrepaidValue = `PREPAID AT ${podDisplay.toUpperCase()}`;
    else if (nextFreightPayment === "COLLECT_POL" && polDisplay)
      nextCollectValue = `COLLECT AT ${polDisplay.toUpperCase()}`;
    else if (nextFreightPayment === "COLLECT_POD" && podDisplay)
      nextCollectValue = `COLLECT AT ${podDisplay.toUpperCase()}`;
  }

  return {
    freightPayment: nextFreightPayment,
    prepaidValue: nextPrepaidValue,
    collectValue: nextCollectValue,
  };
};

const mapVessel = (vessel: AnyRecord, index: number) => ({
  id: vessel.id ?? index,
  vesselId: vessel.transportId || vessel.vesselId || "",
  vesselName: vessel.vesselName || vessel.vessel?.name || vessel.plane?.name || "",
  voyageNumber: vessel.voyageNumber || "",
  etd: vessel.etd || "",
  eta: vessel.eta || "",
  tsPortId: vessel.tsPortId || "",
  sequence: vessel.sequence ?? index,
  vesselType: vessel.vesselType || (index === 0 ? "feeder" : "mother"),
});

const mapContainer = (container: AnyRecord) => ({
  containerNumber: container.containerNumber || "",
  sealNumber: container.sealNumber || "",
  containerTypeId: container.containerTypeId || "",
  vehicleNumber: container.vehicleNumber || "",
  driverName: container.driverName || "",
  driverContactNumber: container.driverContactNumber || "",
  isHazardous: container.isHazardous || false,
  items: (container.items || []).map((item: AnyRecord, index: number) => ({
    sequenceNo: item.sequenceNo ?? index + 1,
    qty: toNum(item.qty) ?? 1,
    packageTypeCode: item.packageTypeCode || "",
    grossWeight: toNum(item.grossWeight),
    netWeight: toNum(item.netWeight),
    measurementCbm: toNum(item.measurementCbm),
    description: item.description || "",
    hsCode: item.hsCode || "",
  })),
});

export const createEmptyBcDocumentForm = (): BcDocumentForm => ({
  bookingNumber: "",
  bookingDate: null,
  serviceContractNo: "",
  warehouseDepotName: "",
  warehouseDepotAddress: "",
  pickupLocation: "",
  cutoffDate: null,
  cutoffTime: "",
  remarks: "",
  shipperId: "",
  shipperAddressId: "",
  consigneeId: "",
  consigneeAddressId: "",
  notifyPartyId: "",
  notifyPartyAddressId: "",
  isNotifySameAsConsignee: false,
  mainDescription: "",
  shippingMark: "",
  pol: "",
  pod: "",
  preCarriageBy: "",
  placeOfReceipt: "",
  placeOfDelivery: "",
  finalDestination: "",
  cargoMovementId: "",
  deliveryMovementId: "",
  eta: "",
  dateCargoReceived: "",
  freightPayment: "",
  prepaidValue: "",
  collectValue: "",
  shipperReferences: [] as string[],
  showShipperReferencesOnBc: true,
  vessels: [] as ReturnType<typeof mapVessel>[],
  containers: [] as ReturnType<typeof mapContainer>[],
});

export function buildBcDocumentEditForm({
  document,
  job,
}: {
  document: AnyRecord;
  job: AnyRecord;
}): BcDocumentForm {
  const firstBl = job?.billsOfLading?.[0] || {};
  const jobParties = job?.jobParties || [];
  const shipper = pickParty(document?.parties, jobParties, "SHIPPER");
  const consignee = pickParty(document?.parties, jobParties, "CONSIGNEE");
  const notify = pickParty(document?.parties, jobParties, "NOTIFY_PARTY");
  const vesselSource = document?.vessels?.length ? document.vessels : job?.vessels || [];
  const containerSource = document?.containers?.length
    ? document.containers
    : job?.jobContainers || [];
  const pol = pick(document?.pol, job?.pol);
  const pod = pick(document?.pod, job?.pod);
  const polDisplay = getTransportLocationDisplay({
    serviceType: pick(document?.serviceType, job?.serviceType),
    shipmentType: pick(document?.shipmentType, job?.shipmentType),
    code: pol,
    name: pick(document?.polName, job?.polName),
  });
  const podDisplay = getTransportLocationDisplay({
    serviceType: pick(document?.serviceType, job?.serviceType),
    shipmentType: pick(document?.shipmentType, job?.shipmentType),
    code: pod,
    name: pick(document?.podName, job?.podName),
  });
  const freightValues = buildFreightValues({
    freightPayment: pick(document?.freightPayment),
    prepaidValue: pick(document?.prepaidValue),
    collectValue: pick(document?.collectValue),
    polDisplay,
    podDisplay,
  });

  return {
    ...createEmptyBcDocumentForm(),
    bookingNumber: pick(document?.bookingNumber, job?.jobNumber),
    bookingDate: document?.bookingDate || null,
    serviceContractNo: pick(document?.serviceContractNo, firstBl?.serviceContractNo),
    warehouseDepotName: pick(document?.warehouseDepotName),
    warehouseDepotAddress: pick(document?.warehouseDepotAddress),
    pickupLocation: pick(document?.pickupLocation, job?.pickupLocation),
    cutoffDate: document?.cutoffDate || null,
    cutoffTime: pick(document?.cutoffTime),
    remarks: pick(document?.remarks),
    shipperId: shipper.companyId,
    shipperAddressId: shipper.addressBookId,
    consigneeId: consignee.companyId,
    consigneeAddressId: consignee.addressBookId,
    notifyPartyId: notify.companyId,
    notifyPartyAddressId: notify.addressBookId,
    isNotifySameAsConsignee:
      Boolean(notify.companyId) &&
      notify.companyId === consignee.companyId &&
      (!notify.addressBookId ||
        !consignee.addressBookId ||
        notify.addressBookId === consignee.addressBookId),
    mainDescription: pick(document?.mainDescription, job?.mainDescription, job?.commodity),
    shippingMark: pick(document?.shippingMark, job?.shippingMark),
    pol,
    pod,
    preCarriageBy: pick(document?.preCarriageBy, job?.preCarriageBy),
    placeOfReceipt: pick(
      document?.placeOfReceipt,
      job?.placeOfReceipt,
      document?.polName,
      job?.polName,
      pol,
    ),
    placeOfDelivery: pick(
      document?.placeOfDelivery,
      job?.placeOfDelivery,
      document?.podName,
      job?.podName,
      pod,
    ),
    finalDestination: pick(
      document?.finalDestination,
      job?.finalDestination,
      document?.podName,
      job?.podName,
      pod,
    ),
    cargoMovementId: pick(
      document?.cargoMovementId,
      job?.cargoMovement?.code,
      job?.cargoMovementId,
    ),
    deliveryMovementId: pick(
      document?.deliveryMovementId,
      job?.deliveryMovement?.code,
      job?.deliveryMovementId,
    ),
    eta: pick(document?.eta, job?.eta),
    dateCargoReceived: pick(document?.dateCargoReceived, firstBl?.dateCargoReceived),
    freightPayment: freightValues.freightPayment,
    prepaidValue: freightValues.prepaidValue,
    collectValue: freightValues.collectValue,
    shipperReferences: [
      ...((document?.shipperReferences?.length
        ? document.shipperReferences
        : firstBl?.shipperReferences || job?.shipperReferences || []) as string[]),
    ],
    showShipperReferencesOnBc:
      document?.showShipperReferencesOnBc ?? document?.showShipperReferencesOnFcr ?? true,
    vessels: vesselSource.map(mapVessel),
    containers: containerSource.map(mapContainer),
  };
}
import { getTransportLocationDisplay } from "./airFreightJob";
