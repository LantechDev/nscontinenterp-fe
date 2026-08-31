type ShipmentMode = {
  serviceType?: string | null;
  shipmentType?: string | null;
};

type JobContainerItemInput = {
  sequenceNo?: number | null;
  qty?: number | null;
  packageTypeCode?: string | null;
  grossWeight?: number | null;
  netWeight?: number | null;
  measurementCbm?: number | null;
  description?: string | null;
  hsCode?: string | null;
};

type JobContainerInput = {
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  vehicleNumber?: string | null;
  driverName?: string | null;
  driverContactNumber?: string | null;
  isHazardous?: boolean | null;
  items?: JobContainerItemInput[];
};

export const isAirFreightMode = (mode: ShipmentMode) =>
  mode.serviceType === "AIR" || mode.shipmentType === "AIR";

export const optionalJobId = (value: string | null | undefined) => value || undefined;

const hasCargoItemPayload = (container: JobContainerInput) =>
  (container.items || []).some(
    (item) =>
      item.packageTypeCode ||
      item.grossWeight ||
      item.netWeight ||
      item.measurementCbm ||
      item.description ||
      item.hsCode,
  );

const hasContainerPayload = (container: JobContainerInput) =>
  Boolean(
    container.containerNumber ||
    container.sealNumber ||
    container.containerTypeId ||
    container.vehicleNumber ||
    container.driverName ||
    container.driverContactNumber ||
    container.isHazardous ||
    hasCargoItemPayload(container),
  );

export const sanitizeJobContainersForShipment = ({
  serviceType,
  shipmentType,
  containers,
}: ShipmentMode & { containers: JobContainerInput[] }) => {
  const isAir = isAirFreightMode({ serviceType, shipmentType });
  const isTrucking = serviceType === "TRUCKING";

  return containers
    .filter((container) =>
      isAir
        ? hasCargoItemPayload(container)
        : isTrucking
          ? container.vehicleNumber || container.containerTypeId || hasCargoItemPayload(container)
          : hasContainerPayload(container),
    )
    .map((container) => ({
      containerNumber: isAir || isTrucking ? null : container.containerNumber || null,
      sealNumber: isAir || isTrucking ? null : container.sealNumber || null,
      containerTypeId: isAir ? undefined : optionalJobId(container.containerTypeId),
      vehicleNumber: isTrucking ? container.vehicleNumber || null : null,
      driverName: isTrucking ? container.driverName || null : null,
      driverContactNumber: isTrucking ? container.driverContactNumber || null : null,
      isHazardous: Boolean(container.isHazardous),
      items: (container.items || [])
        .filter((item) =>
          Boolean(
            item.packageTypeCode ||
            item.grossWeight ||
            item.netWeight ||
            item.measurementCbm ||
            item.description ||
            item.hsCode,
          ),
        )
        .map((item, index) => ({
          sequenceNo: item.sequenceNo ?? index + 1,
          qty: item.qty ?? 1,
          packageTypeCode: item.packageTypeCode || null,
          grossWeight: item.grossWeight ?? undefined,
          netWeight: item.netWeight ?? undefined,
          measurementCbm: item.measurementCbm ?? undefined,
          description: item.description || undefined,
          hsCode: item.hsCode || null,
        })),
    }));
};

export const getTransportLocationDisplay = ({
  serviceType,
  shipmentType,
  code,
  name,
  fallback = "-",
}: ShipmentMode & {
  code?: string | null;
  name?: string | null;
  fallback?: string;
}) => {
  if (isAirFreightMode({ serviceType, shipmentType })) return code || name || fallback;
  return name || code || fallback;
};
