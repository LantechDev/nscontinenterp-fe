<script setup lang="ts">
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  Plus,
  CheckCircle2,
  Download,
  Edit3,
  FileSpreadsheet,
  LayoutGrid,
  LayoutList,
  Loader2,
  MoreVertical,
  Save,
  Search,
  Ship,
  Trash2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import DashboardStatCard from "~/components/dashboard/StatCard.vue";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import Modal from "~/components/ui/Modal.vue";
import { buildStyledWorkbook, type StyledRow } from "~/lib/excel-styled";
import { cn } from "~/lib/utils";
import type { VesselTracking, VesselTrackingLeg } from "~/composables/useVesselTracking";

definePageMeta({
  layout: "dashboard",
  title: "Vessel Tracking",
});

const { trackings, fetchVesselTrackings, updateVesselTracking, isLoading } = useVesselTracking();
const { canManage, requireManage } = useFeatureAccess("operational.vesselTracking");
const { fetchVessels, fetchPlanes, fetchPorts } = useMasterData();
const { showExportOptions, triggerX, triggerY, triggerWidth, triggerHeight, openExportPopup } =
  useExportPopup();
const route = useRoute();
const router = useRouter();

const search = ref("");
const linerFilter = ref<string[]>([]);
const vesselFilter = ref<string[]>([]);
const arrivalFilter = ref<"all" | "arrived" | "not_arrived">("all");
const dateFrom = ref("");
const dateTo = ref("");
type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const selectedTracking = ref<VesselTracking | null>(null);
const editLegs = ref<VesselTrackingLeg[]>([]);
const editRemarks = ref("");
const activeUpdateIndex = ref(0);
const deletedLegIds = ref<string[]>([]);
const isSaving = ref(false);
const isExporting = ref(false);
const masterVessels = ref<Array<{ id: string; name: string }>>([]);
const masterPlanes = ref<Array<{ id: string; name: string }>>([]);
const masterPorts = ref<Array<{ id: string; name: string; code?: string }>>([]);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

type TrackingPortOption = { id: string; name: string; code?: string };

const linerOptions = computed(() =>
  Array.from(new Set(trackings.value.map((item) => item.linerName).filter(Boolean)))
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => ({ id: name, name })),
);

const arrivalFilterOptions = [
  { id: "all", name: "All status" },
  { id: "arrived", name: "Sudah sampai" },
  { id: "not_arrived", name: "Belum sampai" },
];

const arrivalFilterValue = computed({
  get: () => arrivalFilter.value,
  set: (value: string | null | undefined) => {
    arrivalFilter.value =
      value === "arrived" || value === "not_arrived" || value === "all" ? value : "all";
  },
});

const vesselOptions = computed(() =>
  Array.from(
    new Set(
      trackings.value.flatMap((tracking) =>
        tracking.legs
          .flatMap((leg) => [leg.updatedVesselName, leg.initialVesselName])
          .filter((name): name is string => Boolean(name && name !== "-")),
      ),
    ),
  )
    .toSorted((a, b) => a.localeCompare(b))
    .map((name) => ({ id: name, name })),
);

const filteredTrackings = computed(() =>
  trackings.value.filter((tracking) => {
    if (linerFilter.value.length > 0 && !linerFilter.value.includes(tracking.linerName)) {
      return false;
    }
    if (
      vesselFilter.value.length > 0 &&
      !tracking.legs.some((leg) =>
        vesselFilter.value.includes(leg.updatedVesselName || leg.initialVesselName || ""),
      )
    ) {
      return false;
    }
    const arrivalStatus = getArrivalStatus(tracking);
    if (arrivalFilter.value === "arrived" && arrivalStatus !== "arrived") return false;
    if (arrivalFilter.value === "not_arrived" && arrivalStatus !== "not_arrived") return false;

    const scheduleDate = getTrackingScheduleDate(tracking);
    if (dateFrom.value && scheduleDate && scheduleDate < dateFrom.value) return false;
    if (dateTo.value && scheduleDate && scheduleDate > dateTo.value) return false;

    return true;
  }),
);

const stats = computed(() => {
  const data = filteredTrackings.value;
  const delayed = data.filter((item) => item.exceptionStatus !== "ON_TIME").length;
  const onTime = data.filter((item) => item.exceptionStatus === "ON_TIME").length;
  const arrived = data.filter((item) => getArrivalStatus(item) === "arrived").length;
  const notArrived = data.filter((item) => getArrivalStatus(item) === "not_arrived").length;
  const totalDelayDays = data.reduce((sum, item) => sum + item.delayDays, 0);
  return {
    total: data.length,
    delayed,
    onTime,
    arrived,
    notArrived,
    totalDelayDays,
    averageDelay: data.length > 0 ? Number((totalDelayDays / data.length).toFixed(1)) : 0,
  };
});

const delayRanking = computed(() => {
  const ranking = new Map<string, { vesselName: string; shipments: number; totalDelay: number }>();

  filteredTrackings.value.forEach((tracking) => {
    if (tracking.exceptionStatus === "ON_TIME") return;

    const names = Array.from(
      new Set(
        tracking.legs
          .map((leg) => leg.updatedVesselName || leg.initialVesselName)
          .filter((name): name is string => Boolean(name && name !== "-")),
      ),
    );

    names.forEach((vesselName) => {
      const current = ranking.get(vesselName) || { vesselName, shipments: 0, totalDelay: 0 };
      current.shipments += 1;
      current.totalDelay += tracking.delayDays;
      ranking.set(vesselName, current);
    });
  });

  return Array.from(ranking.values())
    .map((item) => ({
      ...item,
      averageDelay: Number((item.totalDelay / item.shipments).toFixed(1)),
    }))
    .toSorted((a, b) => b.totalDelay - a.totalDelay)
    .slice(0, 5);
});

const loadData = async () => {
  const res = await fetchVesselTrackings(search.value.trim() || undefined);
  if (!res.success) toast.error(res.error || "Gagal memuat vessel tracking.");
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLegDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
};

const getContainerNumberList = (containerNo?: string | null) =>
  (containerNo || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const formatPortLabel = (portName?: string | null) =>
  portName?.split(",")[0]?.trim().toUpperCase() || "";

const getTodayDateKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTrackingScheduleDate = (tracking: VesselTracking) =>
  tracking.legs
    .map((leg) => leg.initialEtd || leg.updatedEtd)
    .filter((date): date is string => Boolean(date))
    .toSorted()[0] || null;

const formatTrackingScheduleDate = (tracking: VesselTracking) =>
  formatDate(getTrackingScheduleDate(tracking));

const getTrackingArrivalDate = (tracking: VesselTracking) =>
  tracking.legs
    .toSorted((a, b) => a.sequence - b.sequence)
    .toReversed()
    .map((leg) => leg.updatedEta || leg.initialEta)
    .find((date): date is string => Boolean(date)) || null;

const getArrivalStatus = (tracking: VesselTracking) =>
  tracking.movementStatus === "ARRIVED" ||
  (!tracking.movementStatus &&
    getTrackingArrivalDate(tracking) &&
    getTrackingArrivalDate(tracking)! < getTodayDateKey())
    ? "arrived"
    : "not_arrived";

const getArrivalStatusLabel = (tracking: VesselTracking) =>
  tracking.movementStatusLabel ||
  (getArrivalStatus(tracking) === "arrived" ? "Sudah sampai" : "Belum sampai");

const getLegPortName = (
  tracking: VesselTracking,
  leg: VesselTrackingLeg,
  mode: "initial" | "updated",
  side: "etd" | "eta",
) => {
  const sortedLegs = tracking.legs.toSorted((a, b) => a.sequence - b.sequence);
  const legIndex = sortedLegs.findIndex((item) => item.id === leg.id);
  const currentIndex = legIndex >= 0 ? legIndex : 0;
  const tsPortName =
    mode === "initial"
      ? leg.initialTsPortName || leg.initialTsPortId
      : leg.updatedTsPortName || leg.updatedTsPortId;

  if (side === "etd") {
    if (currentIndex === 0) return formatPortLabel(tracking.polName || tracking.pol);
    const previousLeg = sortedLegs[currentIndex - 1];
    const previousTsPortName =
      mode === "initial"
        ? previousLeg?.initialTsPortName || previousLeg?.initialTsPortId
        : previousLeg?.updatedTsPortName || previousLeg?.updatedTsPortId;
    return formatPortLabel(previousTsPortName);
  }

  if (currentIndex === sortedLegs.length - 1) {
    return formatPortLabel(tracking.podName || tracking.pod);
  }
  return formatPortLabel(tsPortName);
};

const getLegDisplay = (
  tracking: VesselTracking,
  leg: VesselTrackingLeg,
  mode: "initial" | "updated",
) => {
  const vesselName = mode === "initial" ? leg.initialVesselName : leg.updatedVesselName;
  const voyageNumber = mode === "initial" ? leg.initialVoyageNumber : leg.updatedVoyageNumber;
  const etd = mode === "initial" ? leg.initialEtd : leg.updatedEtd;
  const eta = mode === "initial" ? leg.initialEta : leg.updatedEta;
  return {
    vesselName: vesselName || "-",
    voyageNumber: voyageNumber || "",
    etdPortName: getLegPortName(tracking, leg, mode, "etd"),
    etaPortName: getLegPortName(tracking, leg, mode, "eta"),
    etd: formatLegDate(etd),
    eta: formatLegDate(eta),
  };
};

const hasInitialLegDisplay = (leg: VesselTrackingLeg) =>
  Boolean(
    leg.initialTransportId ||
    leg.initialVesselName ||
    leg.initialVoyageNumber ||
    leg.initialTsPortId ||
    leg.initialEtd ||
    leg.initialEta,
  );

const getFilterSummary = () => {
  const parts = [
    search.value ? `Search: ${search.value}` : "Search: All",
    linerFilter.value.length > 0 ? `Liner: ${linerFilter.value.join(", ")}` : "Liner: All",
    vesselFilter.value.length > 0 ? `Vessel: ${vesselFilter.value.join(", ")}` : "Vessel: All",
    arrivalFilter.value === "arrived"
      ? "Status: Sudah sampai"
      : arrivalFilter.value === "not_arrived"
        ? "Status: Belum sampai"
        : "Status: All",
    dateFrom.value ? `From: ${dateFrom.value}` : "",
    dateTo.value ? `To: ${dateTo.value}` : "",
  ].filter(Boolean);

  return parts.join(" | ");
};

const getUpdateButtonLabel = (index: number) => {
  const number = index + 1;
  const suffix =
    number % 100 >= 11 && number % 100 <= 13
      ? "th"
      : number % 10 === 1
        ? "st"
        : number % 10 === 2
          ? "nd"
          : number % 10 === 3
            ? "rd"
            : "th";
  return `${number}${suffix} Update`;
};

const portOptions = computed(() =>
  masterPorts.value.map((port) => ({
    ...port,
    name: port.name || port.id,
  })),
);

const activeLeg = computed(() => editLegs.value[activeUpdateIndex.value] || null);
const portLabels = computed(() => getTrackingPortLabels(activeUpdateIndex.value));

const isNewLeg = (leg: VesselTrackingLeg) => leg.id.startsWith("new-");

const normalizePortOption = (port: {
  code?: string | null;
  id?: string | null;
  name?: string | null;
}) => {
  const id = port.code || port.id || "";
  return {
    id,
    code: port.code || id,
    name: port.name || id,
  };
};

const upsertPortOptions = (ports: TrackingPortOption[]) => {
  const byId = new Map(masterPorts.value.map((port) => [port.id, port]));
  ports.forEach((port) => {
    if (port.id) byId.set(port.id, port);
  });
  masterPorts.value = Array.from(byId.values()).toSorted((a, b) =>
    (a.name || a.id).localeCompare(b.name || b.id),
  );
};

const ensureSelectedPortOption = (id?: string | null, name?: string | null) => {
  if (!id || masterPorts.value.some((port) => port.id === id)) return;
  upsertPortOptions([{ id, code: id, name: name || id }]);
};

const ensureTrackingPorts = (tracking: VesselTracking) => {
  ensureSelectedPortOption(tracking.pol, tracking.polName);
  ensureSelectedPortOption(tracking.pod, tracking.podName);
  tracking.legs.forEach((leg) => {
    ensureSelectedPortOption(leg.initialTsPortId, leg.initialTsPortName);
    ensureSelectedPortOption(leg.updatedTsPortId, leg.updatedTsPortName);
  });
};

const handleSearchTrackingPort = async (query: string) => {
  const results = await fetchPorts(query || undefined, "ocean");
  upsertPortOptions(results.map(normalizePortOption));
};

const handleActivePortChange = (value: string | null | undefined) => {
  if (!activeLeg.value) return;
  activeLeg.value.updatedTsPortId = value || null;
  const selected = portOptions.value.find((port) => port.id === value);
  activeLeg.value.updatedTsPortName = selected?.name || selected?.code || null;
};

const getTrackingPortLabels = (index: number) => {
  const leg = editLegs.value[index];
  const vesselType = leg?.vesselType?.toLowerCase() || "";

  if (vesselType === "additional") {
    return { left: "T/S PORT", right: "POD", editableSide: "left" as const };
  }

  if (vesselType === "mother") {
    return { left: "T/S PORT", right: "", editableSide: "left" as const };
  }

  return { left: "POL", right: "T/S PORT", editableSide: "right" as const };
};

const getReadonlyRoutePortValue = (label: string) => {
  if (!selectedTracking.value) return "-";
  if (label === "POL") {
    return selectedTracking.value.polName || selectedTracking.value.pol || "-";
  }
  if (label === "POD") {
    return selectedTracking.value.podName || selectedTracking.value.pod || "-";
  }
  return activeLeg.value?.updatedTsPortName || activeLeg.value?.updatedTsPortId || "-";
};

const getLegRouteLabel = (leg: VesselTrackingLeg) => {
  const from = leg.updatedEtd ? formatDate(leg.updatedEtd) : "ETD -";
  const toPort = leg.updatedTsPortName || leg.updatedTsPortId || "Port -";
  const toDate = leg.updatedEta ? formatDate(leg.updatedEta) : "ETA -";
  return `${from} -> ${toPort} / ${toDate}`;
};

const getTrackingLegSummary = (tracking: VesselTracking, mode: "initial" | "updated") =>
  tracking.legs
    .map((leg) => {
      const display = getLegDisplay(tracking, leg, mode);
      const voyage = display.voyageNumber ? ` ${display.voyageNumber}` : "";
      const etdPort = display.etdPortName ? ` ${display.etdPortName}` : "";
      const etaPort = display.etaPortName ? ` ${display.etaPortName}` : "";
      return [
        `${display.vesselName}${voyage}`,
        `ETD${etdPort} ${display.etd}`,
        `ETA${etaPort} ${display.eta}`,
      ].join("\n");
    })
    .join("\n\n");

const loadVesselTrackingLogo = async () => {
  try {
    const response = await fetch("/images/transparentnscontinenttebal.png");
    const blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => resolve(reader.result as string));
      reader.addEventListener("error", () => resolve(null));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const handleExportPdf = async () => {
  if (filteredTrackings.value.length === 0) {
    toast.error("Tidak ada data untuk diexport.");
    return;
  }

  isExporting.value = true;
  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentX = 14;
    const contentWidth = pageWidth - contentX * 2;
    const primary = [6, 44, 88] as [number, number, number];
    const border = [210, 217, 226] as [number, number, number];
    const muted = [100, 116, 139] as [number, number, number];
    const columns = [
      { key: "hbl", label: "HBL", width: 25 },
      { key: "mbl", label: "MBL", width: 30 },
      { key: "container", label: "Container", width: 30 },
      { key: "initialVessel", label: "Initial Vessel", width: 47 },
      { key: "currentVessel", label: "Current Vessel", width: 47 },
      { key: "status", label: "Status", width: 34 },
      { key: "reason", label: "Reason", width: 56 },
    ];
    let y = 18;
    let pageNumber = 1;

    const logo = await loadVesselTrackingLogo();
    const drawHeader = () => {
      doc.setDrawColor(...primary);
      doc.setLineWidth(0.4);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

      if (logo) {
        doc.addImage(logo, "PNG", contentX, 15, 28, 10);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...primary);
        doc.text("NS CONTINENT", contentX, 22);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(...primary);
      doc.text("OPERATIONAL MANAGEMENT SYSTEM", contentX, 29);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("VESSEL TRACKING REPORT", pageWidth / 2, 21, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(31, 41, 55);
      doc.text(`PAGE: ${pageNumber}`, pageWidth - contentX, 19, { align: "right" });
      doc.text(`DATE: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - contentX, 23, {
        align: "right",
      });

      doc.setDrawColor(...primary);
      doc.setLineWidth(0.2);
      doc.line(contentX, 32, pageWidth - contentX, 32);
      y = 38;
    };

    const drawTableHeader = () => {
      let x = contentX;
      doc.setFillColor(...primary);
      doc.rect(contentX, y, contentWidth, 9, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      columns.forEach((col) => {
        doc.text(col.label, x + 2, y + 5.8);
        x += col.width;
      });
      y += 9;
    };

    const addPage = () => {
      doc.addPage();
      pageNumber += 1;
      drawHeader();
      drawTableHeader();
    };

    const splitCell = (value: string | number, width: number) => {
      const lines = String(value || "-")
        .split("\n")
        .flatMap((line) => doc.splitTextToSize(line || " ", width - 4));
      return lines.length > 0 ? lines : ["-"];
    };

    drawHeader();
    drawTableHeader();

    filteredTrackings.value.forEach((tracking, index) => {
      const cells = [
        tracking.hblNo || "-",
        tracking.carrierBlNo || "-",
        tracking.containerNo || "-",
        getTrackingLegSummary(tracking, "initial") || "-",
        getTrackingLegSummary(tracking, "updated") ||
          getTrackingLegSummary(tracking, "initial") ||
          "-",
        `${tracking.movementStatusLabel || getArrivalStatusLabel(tracking)}\n${tracking.exceptionStatusLabel}\n${tracking.delayDays} days`,
        tracking.reason || tracking.remarks || "-",
      ];
      const splitCells = cells.map((cell, cellIndex) => splitCell(cell, columns[cellIndex]!.width));
      const rowHeight = Math.max(12, ...splitCells.map((lines) => lines.length * 4 + 5));

      if (y + rowHeight > pageHeight - 16) addPage();

      doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, 252);
      doc.rect(contentX, y, contentWidth, rowHeight, "F");
      doc.setDrawColor(...border);
      doc.line(contentX, y + rowHeight, pageWidth - contentX, y + rowHeight);

      let x = contentX;
      splitCells.forEach((lines, cellIndex) => {
        const col = columns[cellIndex]!;
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", cellIndex === 0 || cellIndex === 5 ? "bold" : "normal");
        doc.setFontSize(6.8);
        doc.text(lines, x + 2, y + 5, { align: "left", lineHeightFactor: 1.18 });
        x += col.width;
      });

      y += rowHeight;
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text(
      "This report is generated automatically by NS Continent ERP.",
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" },
    );
    doc.save(`VESSEL_TRACKING_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Vessel tracking exported to PDF.");
  } catch (error) {
    console.error("Export vessel tracking PDF error:", error);
    toast.error("Gagal mengekspor vessel tracking PDF.");
  } finally {
    isExporting.value = false;
  }
};

const handleExportExcel = () => {
  if (filteredTrackings.value.length === 0) {
    toast.error("Tidak ada data untuk diexport.");
    return;
  }

  try {
    const headers = [
      "Job No",
      "First ETD",
      "Customer",
      "Shipper",
      "Consignee",
      "Overseas Agent",
      "Liner",
      "Booking No",
      "Carrier BL No",
      "HBL No",
      "Container No",
      "POL",
      "POD",
      "Initial Vessel Detail",
      "Updated Vessel Detail",
      "Status",
      "Exception",
      "Delay Days",
      "Reason / Note",
      "Remarks",
    ];
    const rows: StyledRow[] = [
      {
        cells: [
          "PT Nova Sync Continent - VESSEL TRACKING REPORT",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        style: 7,
      },
      {
        cells: [
          `Generated: ${new Date().toLocaleDateString("id-ID")} | ${getFilterSummary()}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        style: 8,
      },
      { cells: headers, style: 0 },
    ];

    filteredTrackings.value.forEach((tracking, index) => {
      const isEven = index % 2 === 0;
      rows.push({
        cells: [
          tracking.jobNumber,
          formatTrackingScheduleDate(tracking),
          tracking.customerName || "-",
          tracking.shipperName || "-",
          tracking.consigneeName || "-",
          tracking.overseasAgentName || "-",
          tracking.linerName || "-",
          tracking.bookingNo || "-",
          tracking.carrierBlNo || "-",
          tracking.hblNo || "-",
          tracking.containerNo || "-",
          tracking.polName || tracking.pol || "-",
          tracking.podName || tracking.pod || "-",
          tracking.initialVesselDetail || "-",
          tracking.updatedVesselDetail || "-",
          tracking.movementStatusLabel || getArrivalStatusLabel(tracking),
          tracking.exceptionStatusLabel,
          tracking.delayDays,
          tracking.reason || "-",
          tracking.remarks || "-",
        ],
        style: isEven ? 5 : 6,
      });
    });

    buildStyledWorkbook(
      "Vessel Tracking",
      rows,
      [18, 16, 28, 28, 28, 28, 18, 22, 22, 22, 22, 22, 22, 45, 45, 20, 18, 12, 35, 35],
      `VESSEL_TRACKING_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Vessel tracking exported to Excel.");
  } catch (error) {
    console.error("Export vessel tracking error:", error);
    toast.error("Gagal mengekspor vessel tracking.");
  }
};

const openEdit = (tracking: VesselTracking) => {
  if (!requireManage("You only have view access for vessel tracking.")) return;
  selectedTracking.value = tracking;
  ensureTrackingPorts(tracking);
  editLegs.value = tracking.legs.map((leg) => ({ ...leg }));
  editRemarks.value = tracking.remarks || "";
  activeUpdateIndex.value = 0;
  deletedLegIds.value = [];
};

const getTransportOptions = (leg: VesselTrackingLeg) =>
  leg.updatedTransportType === "plane" ? masterPlanes.value : masterVessels.value;

const handleTransportChange = (leg: VesselTrackingLeg, value: string | null | undefined) => {
  leg.updatedTransportId = value || null;
  const selected = getTransportOptions(leg).find((item) => item.id === value);
  if (selected?.name) {
    leg.updatedVesselName = selected.name;
  }
};

const handleActiveTransportChange = (value: string | null | undefined) => {
  if (!activeLeg.value) return;
  handleTransportChange(activeLeg.value, value);
};

const createDraftLeg = (source?: VesselTrackingLeg | null): VesselTrackingLeg => {
  const sequence =
    editLegs.value.reduce((max, leg) => Math.max(max, Number(leg.sequence ?? -1)), -1) + 1;
  return {
    id: `new-${Date.now()}-${sequence}`,
    trackingId: selectedTracking.value?.id || "",
    sequence,
    vesselType: "additional",
    initialTransportId: null,
    initialTransportType: source?.updatedTransportType || "vessel",
    initialVesselName: null,
    initialVoyageNumber: null,
    initialTsPortId: null,
    initialTsPortName: null,
    initialEtd: null,
    initialEta: null,
    updatedTransportId: null,
    updatedTransportType: source?.updatedTransportType || "vessel",
    updatedVesselName: null,
    updatedVoyageNumber: null,
    updatedTsPortId: null,
    updatedTsPortName: null,
    updatedEtd: source?.updatedEta || null,
    updatedEta: null,
    remarks: null,
  };
};

const addUpdateLeg = () => {
  if (!canManage.value) return;
  const source = editLegs.value[activeUpdateIndex.value] || editLegs.value.at(-1) || null;
  editLegs.value.push(createDraftLeg(source));
  activeUpdateIndex.value = editLegs.value.length - 1;
};

const addVesselLeg = () => {
  if (!canManage.value) return;
  editLegs.value.push(createDraftLeg(null));
  activeUpdateIndex.value = editLegs.value.length - 1;
};

const deleteEditLeg = (index: number) => {
  if (!canManage.value) return;
  if (editLegs.value.length <= 1) {
    toast.error("Minimal harus ada 1 vessel update.");
    return;
  }
  const [removed] = editLegs.value.splice(index, 1);
  if (removed && !isNewLeg(removed)) {
    deletedLegIds.value.push(removed.id);
  }
  if (activeUpdateIndex.value >= editLegs.value.length) {
    activeUpdateIndex.value = editLegs.value.length - 1;
  } else if (activeUpdateIndex.value > index) {
    activeUpdateIndex.value -= 1;
  }
};

const closeEdit = () => {
  selectedTracking.value = null;
  editLegs.value = [];
  editRemarks.value = "";
  activeUpdateIndex.value = 0;
  deletedLegIds.value = [];
};

const saveTracking = async () => {
  if (!selectedTracking.value) return;
  if (!requireManage("You only have view access for vessel tracking.")) return;
  isSaving.value = true;
  try {
    const res = await updateVesselTracking(selectedTracking.value.id, {
      remarks: editRemarks.value || null,
      deletedLegIds: deletedLegIds.value,
      legs: editLegs.value.map((leg) => ({
        id: leg.id,
        updatedTransportId: leg.updatedTransportId,
        updatedTransportType: leg.updatedTransportType,
        sequence: leg.sequence,
        vesselType: leg.vesselType,
        updatedVesselName: leg.updatedVesselName,
        updatedVoyageNumber: leg.updatedVoyageNumber,
        updatedTsPortId: leg.updatedTsPortId,
        updatedEtd: leg.updatedEtd,
        updatedEta: leg.updatedEta,
        remarks: leg.remarks,
      })),
    });
    if (res.success) {
      toast.success("Vessel tracking updated.");
      closeEdit();
    } else {
      toast.error(res.error || "Gagal update vessel tracking.");
    }
  } finally {
    isSaving.value = false;
  }
};

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadData();
  }, 350);
});

onMounted(async () => {
  const [vessels, planes, ports] = await Promise.all([
    fetchVessels(),
    fetchPlanes(),
    fetchPorts(undefined, "ocean"),
    loadData(),
  ]);
  masterVessels.value = vessels;
  masterPlanes.value = planes;
  upsertPortOptions(ports.map(normalizePortOption));
  const selectedId = typeof route.query.id === "string" ? route.query.id : "";
  if (selectedId && canManage.value) {
    const found = trackings.value.find((item) => item.id === selectedId);
    if (found) openEdit(found);
    await router.replace({ path: route.path, query: {} });
  }
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Vessel Tracking</h1>
        <p class="text-muted-foreground mt-1">
          Monitor vessel updates, delay performance, dan export report operasional
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 px-3 rounded-lg bg-[#012D5A] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#012D5A]/90 disabled:opacity-60"
          :disabled="filteredTrackings.length === 0 || isExporting"
          @click="openExportPopup($event)"
        >
          <Loader2 v-if="isExporting" class="w-4 h-4 animate-spin" />
          <Download v-else class="w-4 h-4" />
          {{ isExporting ? "Exporting..." : "Export" }}
        </button>
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard title="Total Tracking" :value="String(stats.total)" :icon="Ship" />
      <DashboardStatCard title="On Schedule" :value="String(stats.onTime)" :icon="CheckCircle2" />
      <DashboardStatCard title="Delayed" :value="String(stats.delayed)" :icon="AlertTriangle" />
      <DashboardStatCard
        title="Avg Delay Days"
        :value="String(stats.averageDelay)"
        :icon="CalendarClock"
      />
    </div>

    <div class="border border-border rounded-xl bg-white p-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="relative flex-1 min-w-[240px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            Search
          </label>
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <input
              v-model="search"
              type="text"
              placeholder="HBL NO, MBL NO, BOOKING NO, CONTAINER NO, SHIPPER, STATUS, REASON"
              class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div class="min-w-[190px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            Liner
          </label>
          <Combobox
            :model-value="null"
            :selected-values="linerFilter"
            :options="linerOptions"
            label-key="name"
            value-key="id"
            multiple
            placeholder="All liner"
            class="h-10"
            @update:selected-values="(value) => (linerFilter = value)"
          />
        </div>
        <div class="min-w-[210px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            Vessel
          </label>
          <Combobox
            :model-value="null"
            :selected-values="vesselFilter"
            :options="vesselOptions"
            label-key="name"
            value-key="id"
            multiple
            placeholder="All vessel"
            class="h-10"
            @update:selected-values="(value) => (vesselFilter = value)"
          />
        </div>
        <div class="min-w-[150px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            Status
          </label>
          <Combobox
            v-model="arrivalFilterValue"
            :options="arrivalFilterOptions"
            label-key="name"
            value-key="id"
            placeholder="All status"
            class="h-10"
          />
        </div>
        <div class="min-w-[150px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            ETD From
          </label>
          <DatePicker v-model="dateFrom" class="h-10" />
        </div>
        <div class="min-w-[150px]">
          <label class="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
            ETD To
          </label>
          <div class="filter-end-date-picker">
            <DatePicker v-model="dateTo" class="h-10" />
          </div>
        </div>
        <div class="ml-auto text-right">
          <p class="text-[10px] font-bold text-muted-foreground uppercase">Shown</p>
          <p class="text-sm font-bold text-[#012D5A]">
            {{ filteredTrackings.length }} of {{ trackings.length }}
          </p>
        </div>
      </div>
    </div>

    <UiLoadingSkeleton v-if="isLoading" variant="table" :columns="canManage ? 8 : 7" />

    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1380px]">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                HBL No
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                MBL No
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Container No
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Customer
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Shipper
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Consignee
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Overseas Agent
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Initial / Updated Vessel
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Reason / Note
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center"
              >
                Status
              </th>
              <th v-if="canManage" class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tracking in filteredTrackings"
              :key="tracking.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                    <Ship class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-[#012D5A] font-mono">
                      {{ tracking.hblNo || "-" }}
                    </span>
                    <span
                      class="text-[10px] text-muted-foreground font-medium uppercase truncate max-w-[150px]"
                    >
                      {{ tracking.jobNumber }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col max-w-[180px]">
                  <span class="text-sm font-semibold text-foreground font-mono truncate">
                    {{ tracking.carrierBlNo || "-" }}
                  </span>
                  <span class="text-[10px] text-muted-foreground font-medium uppercase">
                    Booking: {{ tracking.bookingNo || "-" }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col items-start gap-1 max-w-[220px]">
                  <span
                    v-for="containerNo in getContainerNumberList(tracking.containerNo)"
                    :key="`${tracking.id}-${containerNo}`"
                    class="tracking-container-chip"
                  >
                    {{ containerNo }}
                  </span>
                  <span
                    v-if="getContainerNumberList(tracking.containerNo).length === 0"
                    class="tracking-container-chip"
                  >
                    -
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[190px] truncate">
                  {{ tracking.customerName || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[190px] truncate">
                  {{ tracking.shipperName || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[190px] truncate">
                  {{ tracking.consigneeName || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[190px] truncate">
                  {{ tracking.overseasAgentName || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="w-[480px] space-y-1.5">
                  <div
                    v-for="leg in tracking.legs"
                    :key="`vessel-row-${leg.id}`"
                    class="rounded-md border border-border bg-white px-2.5 py-2"
                  >
                    <div
                      :class="
                        cn(
                          'grid gap-2 items-start',
                          hasInitialLegDisplay(leg) ? 'grid-cols-[1fr_auto_1fr]' : 'grid-cols-1',
                        )
                      "
                    >
                      <div v-if="hasInitialLegDisplay(leg)" class="min-w-0">
                        <p class="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                          Initial
                        </p>
                        <p class="text-xs font-bold text-foreground truncate">
                          {{ getLegDisplay(tracking, leg, "initial").vesselName }}
                        </p>
                        <p class="text-[10px] text-muted-foreground truncate">
                          {{ getLegDisplay(tracking, leg, "initial").voyageNumber || "-" }}
                        </p>
                      </div>
                      <span
                        v-if="hasInitialLegDisplay(leg)"
                        class="text-muted-foreground text-xs pt-5"
                        >→</span
                      >
                      <div class="min-w-0">
                        <p class="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                          Updated
                        </p>
                        <p class="text-xs font-bold text-foreground truncate">
                          {{ getLegDisplay(tracking, leg, "updated").vesselName }}
                        </p>
                        <p class="text-[10px] text-muted-foreground truncate">
                          {{ getLegDisplay(tracking, leg, "updated").voyageNumber || "-" }}
                        </p>
                      </div>
                    </div>
                    <div
                      :class="
                        cn(
                          'grid gap-2 mt-2',
                          hasInitialLegDisplay(leg) ? 'grid-cols-[1fr_auto_1fr]' : 'grid-cols-1',
                        )
                      "
                    >
                      <div v-if="hasInitialLegDisplay(leg)" class="space-y-1.5 min-w-0">
                        <div
                          class="schedule-line compact-schedule border-orange-100 bg-orange-50 text-orange-700"
                        >
                          <CalendarClock class="schedule-icon" />
                          <span class="schedule-kind">ETD</span>
                          <span
                            class="schedule-port"
                            :title="getLegDisplay(tracking, leg, 'initial').etdPortName"
                          >
                            {{ getLegDisplay(tracking, leg, "initial").etdPortName || "-" }}
                          </span>
                          <span class="schedule-date">{{
                            getLegDisplay(tracking, leg, "initial").etd
                          }}</span>
                        </div>
                        <div
                          class="schedule-line compact-schedule border-emerald-100 bg-emerald-50 text-emerald-700"
                        >
                          <Calendar class="schedule-icon" />
                          <span class="schedule-kind">ETA</span>
                          <span
                            class="schedule-port"
                            :title="getLegDisplay(tracking, leg, 'initial').etaPortName"
                          >
                            {{ getLegDisplay(tracking, leg, "initial").etaPortName || "-" }}
                          </span>
                          <span class="schedule-date">{{
                            getLegDisplay(tracking, leg, "initial").eta
                          }}</span>
                        </div>
                      </div>
                      <span
                        v-if="hasInitialLegDisplay(leg)"
                        class="text-muted-foreground text-xs self-center"
                        >→</span
                      >
                      <div class="space-y-1.5 min-w-0">
                        <div
                          class="schedule-line compact-schedule border-orange-100 bg-orange-50 text-orange-700"
                        >
                          <CalendarClock class="schedule-icon" />
                          <span class="schedule-kind">ETD</span>
                          <span
                            class="schedule-port"
                            :title="getLegDisplay(tracking, leg, 'updated').etdPortName"
                          >
                            {{ getLegDisplay(tracking, leg, "updated").etdPortName || "-" }}
                          </span>
                          <span class="schedule-date">{{
                            getLegDisplay(tracking, leg, "updated").etd
                          }}</span>
                        </div>
                        <div
                          class="schedule-line compact-schedule border-emerald-100 bg-emerald-50 text-emerald-700"
                        >
                          <Calendar class="schedule-icon" />
                          <span class="schedule-kind">ETA</span>
                          <span
                            class="schedule-port"
                            :title="getLegDisplay(tracking, leg, 'updated').etaPortName"
                          >
                            {{ getLegDisplay(tracking, leg, "updated").etaPortName || "-" }}
                          </span>
                          <span class="schedule-date">{{
                            getLegDisplay(tracking, leg, "updated").eta
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[220px] whitespace-pre-wrap">
                  {{ tracking.reason || tracking.remarks || "-" }}
                </div>
              </td>
              <td class="py-3 px-4 text-center align-middle">
                <div class="inline-flex flex-col items-center gap-1.5">
                  <span
                    :class="
                      cn(
                        'arrival-badge',
                        getArrivalStatus(tracking) === 'arrived'
                          ? 'bg-blue-50 text-[#012D5A] border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200',
                      )
                    "
                  >
                    <CheckCircle2
                      v-if="getArrivalStatus(tracking) === 'arrived'"
                      class="delay-icon"
                    />
                    <CalendarClock v-else class="delay-icon" />
                    {{ tracking.movementStatusLabel || getArrivalStatusLabel(tracking) }}
                  </span>
                  <span
                    :class="
                      cn(
                        'delay-badge',
                        tracking.exceptionStatus === 'ROLLOVER'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : tracking.exceptionStatus === 'DELAY'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-green-50 text-green-700 border-green-200',
                      )
                    "
                  >
                    <AlertTriangle
                      v-if="
                        tracking.exceptionStatus === 'ROLLOVER' ||
                        tracking.exceptionStatus === 'DELAY'
                      "
                      class="delay-icon"
                    />
                    <CheckCircle2 v-else class="delay-icon" />
                    {{ tracking.exceptionStatusLabel }}
                  </span>
                  <span
                    :class="
                      cn(
                        'delay-badge',
                        tracking.delayDays > 0
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-green-50 text-green-700 border-green-200',
                      )
                    "
                  >
                    <AlertTriangle v-if="tracking.delayDays > 0" class="delay-icon" />
                    <CheckCircle2 v-else class="delay-icon" />
                    {{ tracking.delayDays }} DAYS
                  </span>
                </div>
              </td>
              <td v-if="canManage" class="py-3 px-4 text-right">
                <UiActionMenu>
                  <template #trigger>
                    <button
                      class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <MoreVertical class="w-4 h-4" />
                    </button>
                  </template>
                  <template #content>
                    <button
                      class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                      @click="openEdit(tracking)"
                    >
                      <Edit3 class="w-4 h-4" />
                      Update Tracking
                    </button>
                  </template>
                </UiActionMenu>
              </td>
            </tr>
            <tr v-if="filteredTrackings.length === 0">
              <td :colspan="canManage ? 8 : 7" class="p-8 text-center text-muted-foreground">
                Belum ada vessel tracking sesuai filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="tracking in filteredTrackings"
        :key="tracking.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
            >
              <Ship class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ tracking.jobNumber }}</h3>
              <p class="text-xs text-muted-foreground max-w-[220px] truncate">
                {{ tracking.customerName || "-" }}
              </p>
            </div>
          </div>
          <button
            v-if="canManage"
            class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors"
            @click="openEdit(tracking)"
            title="Update Tracking"
          >
            <Edit3 class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground text-xs uppercase font-bold tracking-tighter"
              >Liner:</span
            >
            <span class="font-semibold truncate">{{ tracking.linerName || "-" }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <Calendar class="w-4 h-4 text-muted-foreground opacity-50" />
            <span class="font-medium">{{ formatTrackingScheduleDate(tracking) }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            {{ tracking.polName || tracking.pol || "-" }} →
            {{ tracking.podName || tracking.pod || "-" }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="rounded-lg border border-border p-3">
            <p class="font-bold text-muted-foreground uppercase mb-2">Initial</p>
            <div class="space-y-2">
              <template v-for="leg in tracking.legs" :key="`card-initial-${leg.id}`">
                <div v-if="hasInitialLegDisplay(leg)" class="rounded-md bg-gray-50 px-2 py-1.5">
                  <p class="font-bold text-foreground leading-snug">
                    {{ getLegDisplay(tracking, leg, "initial").vesselName }}
                    <span
                      v-if="getLegDisplay(tracking, leg, 'initial').voyageNumber"
                      class="font-mono text-[10px] text-[#012D5A]"
                    >
                      {{ getLegDisplay(tracking, leg, "initial").voyageNumber }}
                    </span>
                  </p>
                  <div class="space-y-1 mt-2">
                    <div class="schedule-line border-orange-100 bg-orange-50 text-orange-700">
                      <CalendarClock class="schedule-icon" />
                      <span class="schedule-kind">ETD</span>
                      <span
                        class="schedule-port"
                        :title="getLegDisplay(tracking, leg, 'initial').etdPortName"
                      >
                        {{ getLegDisplay(tracking, leg, "initial").etdPortName || "-" }}
                      </span>
                      <span class="schedule-date">{{
                        getLegDisplay(tracking, leg, "initial").etd
                      }}</span>
                    </div>
                    <div class="schedule-line border-emerald-100 bg-emerald-50 text-emerald-700">
                      <Calendar class="schedule-icon" />
                      <span class="schedule-kind">ETA</span>
                      <span
                        class="schedule-port"
                        :title="getLegDisplay(tracking, leg, 'initial').etaPortName"
                      >
                        {{ getLegDisplay(tracking, leg, "initial").etaPortName || "-" }}
                      </span>
                      <span class="schedule-date">{{
                        getLegDisplay(tracking, leg, "initial").eta
                      }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="rounded-lg border border-border p-3">
            <p class="font-bold text-muted-foreground uppercase mb-2">Updated</p>
            <div class="space-y-2">
              <div
                v-for="leg in tracking.legs"
                :key="`card-updated-${leg.id}`"
                class="rounded-md bg-gray-50 px-2 py-1.5"
              >
                <p class="font-bold text-foreground leading-snug">
                  {{ getLegDisplay(tracking, leg, "updated").vesselName }}
                  <span
                    v-if="getLegDisplay(tracking, leg, 'updated').voyageNumber"
                    class="font-mono text-[10px] text-[#012D5A]"
                  >
                    {{ getLegDisplay(tracking, leg, "updated").voyageNumber }}
                  </span>
                </p>
                <div class="space-y-1 mt-2">
                  <div class="schedule-line border-orange-100 bg-orange-50 text-orange-700">
                    <CalendarClock class="schedule-icon" />
                    <span class="schedule-kind">ETD</span>
                    <span
                      class="schedule-port"
                      :title="getLegDisplay(tracking, leg, 'updated').etdPortName"
                    >
                      {{ getLegDisplay(tracking, leg, "updated").etdPortName || "-" }}
                    </span>
                    <span class="schedule-date">{{
                      getLegDisplay(tracking, leg, "updated").etd
                    }}</span>
                  </div>
                  <div class="schedule-line border-emerald-100 bg-emerald-50 text-emerald-700">
                    <Calendar class="schedule-icon" />
                    <span class="schedule-kind">ETA</span>
                    <span
                      class="schedule-port"
                      :title="getLegDisplay(tracking, leg, 'updated').etaPortName"
                    >
                      {{ getLegDisplay(tracking, leg, "updated").etaPortName || "-" }}
                    </span>
                    <span class="schedule-date">{{
                      getLegDisplay(tracking, leg, "updated").eta
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <span class="text-xs text-muted-foreground font-mono">{{
            tracking.carrierBlNo || tracking.containerNo || "-"
          }}</span>
          <div class="flex flex-col items-end gap-1.5">
            <span
              :class="
                cn(
                  'arrival-badge',
                  getArrivalStatus(tracking) === 'arrived'
                    ? 'bg-blue-50 text-[#012D5A] border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200',
                )
              "
            >
              <CheckCircle2 v-if="getArrivalStatus(tracking) === 'arrived'" class="delay-icon" />
              <CalendarClock v-else class="delay-icon" />
              {{ tracking.movementStatusLabel || getArrivalStatusLabel(tracking) }}
            </span>
            <span
              :class="
                cn(
                  'delay-badge',
                  tracking.exceptionStatus === 'ROLLOVER'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : tracking.exceptionStatus === 'DELAY'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-green-50 text-green-700 border-green-200',
                )
              "
            >
              <AlertTriangle
                v-if="
                  tracking.exceptionStatus === 'ROLLOVER' || tracking.exceptionStatus === 'DELAY'
                "
                class="delay-icon"
              />
              <CheckCircle2 v-else class="delay-icon" />
              {{ tracking.exceptionStatusLabel }}
            </span>
            <span
              :class="
                cn(
                  'delay-badge',
                  tracking.delayDays > 0
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200',
                )
              "
            >
              <AlertTriangle v-if="tracking.delayDays > 0" class="delay-icon" />
              <CheckCircle2 v-else class="delay-icon" />
              {{ tracking.delayDays }} DAYS
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="filteredTrackings.length === 0"
        class="col-span-full p-8 text-center text-muted-foreground"
      >
        Belum ada vessel tracking sesuai filter.
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 border border-border rounded-xl bg-white overflow-hidden">
        <div class="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold">Vessel Delay Ranking</h2>
            <p class="text-xs text-muted-foreground">
              Top vessel berdasarkan total delay dari data filter
            </p>
          </div>
          <FileSpreadsheet class="w-4 h-4 text-green-600" />
        </div>
        <div v-if="delayRanking.length > 0" class="divide-y divide-border">
          <div
            v-for="(item, index) in delayRanking"
            :key="item.vesselName"
            class="px-4 py-3 flex items-center gap-4"
          >
            <div
              class="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center text-xs font-bold"
            >
              {{ index + 1 }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold truncate">{{ item.vesselName }}</p>
              <p class="text-xs text-muted-foreground">
                {{ item.shipments }} shipment · avg {{ item.averageDelay }} days
              </p>
            </div>
            <div class="text-right">
              <p class="text-base font-bold text-red-700">{{ item.totalDelay }}</p>
              <p class="text-[10px] font-bold text-muted-foreground uppercase">delay days</p>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-sm text-muted-foreground">
          Belum ada delay dari data yang sedang tampil.
        </div>
      </div>

      <div class="border border-border rounded-xl bg-white p-4">
        <h2 class="text-sm font-bold mb-3">Filter Summary</h2>
        <div class="space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Total Delay</span>
            <span class="font-bold">{{ stats.totalDelayDays }} days</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Delayed Ratio</span>
            <span class="font-bold">
              {{ stats.total ? Math.round((stats.delayed / stats.total) * 100) : 0 }}%
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">On Schedule</span>
            <span class="font-bold text-green-700">{{ stats.onTime }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Delayed</span>
            <span class="font-bold text-red-700">{{ stats.delayed }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Sudah Sampai</span>
            <span class="font-bold text-[#012D5A]">{{ stats.arrived }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Belum Sampai</span>
            <span class="font-bold text-amber-700">{{ stats.notArrived }}</span>
          </div>
        </div>
      </div>
    </div>

    <Modal
      :model-value="!!selectedTracking"
      width="max-w-5xl"
      title="Update Vessel Tracking"
      :description="selectedTracking?.jobNumber || ''"
      @update:model-value="(value) => !value && closeEdit()"
    >
      <div class="space-y-4">
        <div class="rounded-xl border border-border bg-white overflow-hidden">
          <div
            class="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <p class="text-sm font-bold">Update Legs</p>
              <p class="text-xs text-muted-foreground">
                Pilih leg yang mau diupdate atau tambah vessel baru.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="h-9 px-3 rounded-md border border-border text-xs font-bold inline-flex items-center gap-2 hover:bg-muted"
                @click="addUpdateLeg"
              >
                <Plus class="w-3.5 h-3.5" />
                Duplicate Current
              </button>
              <button
                type="button"
                class="h-9 px-3 rounded-md bg-[#012D5A] text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-[#012D5A]/90"
                @click="addVesselLeg"
              >
                <Plus class="w-3.5 h-3.5" />
                Add Vessel
              </button>
            </div>
          </div>
          <div class="divide-y divide-border">
            <div
              v-for="(leg, index) in editLegs"
              :key="`update-switch-${leg.id}`"
              role="button"
              tabindex="0"
              class="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
              :class="
                cn('', activeUpdateIndex === index ? 'bg-blue-50' : 'bg-white hover:bg-muted/40')
              "
              @click="activeUpdateIndex = index"
              @keydown.enter.prevent="activeUpdateIndex = index"
              @keydown.space.prevent="activeUpdateIndex = index"
            >
              <span
                :class="
                  cn(
                    'w-9 h-9 rounded-md border inline-flex items-center justify-center text-xs font-bold shrink-0',
                    activeUpdateIndex === index
                      ? 'bg-[#012D5A] text-white border-[#012D5A]'
                      : 'bg-white text-muted-foreground border-border',
                  )
                "
              >
                {{ index + 1 }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="text-sm font-bold text-foreground">{{
                    getUpdateButtonLabel(index)
                  }}</span>
                  <span class="text-[10px] font-bold uppercase text-muted-foreground">{{
                    leg.vesselType
                  }}</span>
                </span>
                <span class="block text-xs text-muted-foreground truncate">
                  {{ leg.updatedVesselName || leg.initialVesselName || "Select vessel" }}
                  <span v-if="leg.updatedVoyageNumber || leg.initialVoyageNumber">
                    / {{ leg.updatedVoyageNumber || leg.initialVoyageNumber }}
                  </span>
                  · {{ getLegRouteLabel(leg) }}
                </span>
              </span>
              <button
                type="button"
                class="h-8 w-8 rounded-md text-red-600 hover:bg-red-50 inline-flex items-center justify-center shrink-0"
                title="Delete update"
                @click.stop="deleteEditLeg(index)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div v-if="activeLeg" class="border border-border rounded-xl bg-white overflow-visible">
          <div
            class="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-2">
              <CalendarClock class="w-4 h-4 text-[#012D5A]" />
              <span class="text-sm font-bold">{{ getUpdateButtonLabel(activeUpdateIndex) }}</span>
              <span class="text-xs text-muted-foreground uppercase">{{
                activeLeg.vesselType
              }}</span>
            </div>
            <button
              type="button"
              class="h-8 px-3 rounded-md text-red-600 hover:bg-red-50 text-xs font-bold inline-flex items-center gap-2"
              @click="deleteEditLeg(activeUpdateIndex)"
            >
              <Trash2 class="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
          <div class="p-4 space-y-4">
            <div class="rounded-lg border border-border bg-muted/20 p-3">
              <p class="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                Initial Reference
              </p>
              <div
                v-if="hasInitialLegDisplay(activeLeg)"
                class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"
              >
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">Vessel</p>
                  <p class="font-semibold">{{ activeLeg.initialVesselName || "-" }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">Voyage</p>
                  <p class="font-mono">{{ activeLeg.initialVoyageNumber || "-" }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">ETD</p>
                  <p>{{ formatDate(activeLeg.initialEtd) }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">ETA</p>
                  <p>{{ formatDate(activeLeg.initialEta) }}</p>
                </div>
              </div>
              <p v-else class="text-sm text-muted-foreground">
                Update-only leg. Tidak ada initial schedule dari Job.
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-muted-foreground uppercase mb-3">
                Updated Schedule
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Vessel</label
                  >
                  <Combobox
                    :model-value="activeLeg.updatedTransportId"
                    :options="getTransportOptions(activeLeg)"
                    label-key="name"
                    value-key="id"
                    :placeholder="
                      activeLeg.updatedTransportType === 'plane'
                        ? 'Select Plane...'
                        : 'Select Vessel...'
                    "
                    class="h-10"
                    @update:model-value="handleActiveTransportChange"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Voyage</label
                  >
                  <input
                    v-model="activeLeg.updatedVoyageNumber"
                    v-uppercase
                    class="input-field h-10"
                    placeholder="Voyage no"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">ETD</label>
                  <DatePicker v-model="activeLeg.updatedEtd" class="h-10" />
                </div>
                <div v-if="portLabels.left" class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">
                    {{ portLabels.left }}
                  </label>
                  <Combobox
                    v-if="portLabels.editableSide === 'left'"
                    :model-value="activeLeg.updatedTsPortId"
                    :options="portOptions"
                    label-key="name"
                    value-key="id"
                    placeholder="Select T/S Port..."
                    class="h-10"
                    :filter-local="false"
                    @search="handleSearchTrackingPort"
                    @update:model-value="handleActivePortChange"
                  />
                  <div v-else class="input-field h-10 flex items-center bg-muted/30 text-sm">
                    {{ getReadonlyRoutePortValue(portLabels.left) }}
                  </div>
                </div>
                <div v-if="portLabels.right" class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">
                    {{ portLabels.right }}
                  </label>
                  <Combobox
                    v-if="portLabels.editableSide === 'right'"
                    :model-value="activeLeg.updatedTsPortId"
                    :options="portOptions"
                    label-key="name"
                    value-key="id"
                    placeholder="Select T/S Port..."
                    class="h-10"
                    :filter-local="false"
                    @search="handleSearchTrackingPort"
                    @update:model-value="handleActivePortChange"
                  />
                  <div v-else class="input-field h-10 flex items-center bg-muted/30 text-sm">
                    {{ getReadonlyRoutePortValue(portLabels.right) }}
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">ETA</label>
                  <div class="eta-date-picker">
                    <DatePicker v-model="activeLeg.updatedEta" class="h-10" />
                  </div>
                </div>
                <div class="space-y-1 md:col-span-3">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Remarks</label
                  >
                  <input
                    v-model="activeLeg.remarks"
                    v-uppercase
                    class="input-field h-10"
                    placeholder="Delay / connection note"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-bold text-muted-foreground uppercase">Remarks</label>
          <textarea
            v-model="editRemarks"
            v-uppercase
            rows="3"
            class="input-field min-h-24 py-3"
            placeholder="General tracking remarks"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          class="h-10 px-4 rounded-md border border-border text-sm font-bold hover:bg-gray-50"
          @click="closeEdit"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-10 px-5 rounded-md bg-[#012D5A] text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-[#012D5A]/90 disabled:opacity-60"
          :disabled="isSaving"
          @click="saveTracking"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          Save
        </button>
      </template>
    </Modal>

    <UiExportOptionsModal
      v-model:open="showExportOptions"
      :trigger-x="triggerX"
      :trigger-y="triggerY"
      :trigger-width="triggerWidth"
      :trigger-height="triggerHeight"
      title="Export Vessel Tracking Report"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />
  </div>
</template>

<style>
.schedule-line {
  display: grid;
  grid-template-columns: 0.75rem 1.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.25rem;
  min-height: 1.5rem;
  width: 100%;
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.1875rem 0.375rem;
  font-size: 0.625rem;
  line-height: 1rem;
}

.schedule-icon {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 0.8;
}

.schedule-kind {
  font-weight: 900;
  letter-spacing: 0;
}

.schedule-port {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 800;
}

.schedule-date {
  white-space: nowrap;
  font-weight: 700;
  opacity: 0.85;
}

.list-schedule {
  grid-template-columns: 0.75rem 1.75rem minmax(4rem, 1fr) auto;
}

.compact-schedule {
  grid-template-columns: 0.75rem 1.75rem minmax(3rem, 1fr) auto;
  min-width: 0;
}

.delay-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 4.75rem;
  white-space: nowrap;
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.1875rem 0.5rem;
  font-size: 0.625rem;
  line-height: 1rem;
  font-weight: 900;
  letter-spacing: 0;
}

.tracking-container-chip {
  display: inline-flex;
  max-width: 100%;
  border-width: 1px;
  border-color: rgb(226 232 240);
  border-radius: 0.375rem;
  background: rgb(248 250 252);
  padding: 0.125rem 0.375rem;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 800;
  color: rgb(15 23 42);
  white-space: nowrap;
}

.arrival-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-width: 6.5rem;
  white-space: nowrap;
  border-width: 1px;
  border-radius: 0.375rem;
  padding: 0.1875rem 0.5rem;
  font-size: 0.625rem;
  line-height: 1rem;
  font-weight: 900;
  letter-spacing: 0;
}

.delay-icon {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
}

.eta-date-picker > div > div.absolute {
  left: auto;
  right: 0;
}

.filter-end-date-picker > div > div.absolute {
  left: auto;
  right: 0;
}
</style>
