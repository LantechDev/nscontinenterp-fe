<script setup lang="ts">
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
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
const { fetchVessels, fetchPlanes } = useMasterData();
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
const isSaving = ref(false);
const isExporting = ref(false);
const masterVessels = ref<Array<{ id: string; name: string }>>([]);
const masterPlanes = ref<Array<{ id: string; name: string }>>([]);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

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
  const delayed = data.filter((item) => item.delayDays > 0).length;
  const onTime = data.filter((item) => item.delayDays === 0).length;
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
    if (tracking.delayDays <= 0) return;

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
  getTrackingArrivalDate(tracking) && getTrackingArrivalDate(tracking)! < getTodayDateKey()
    ? "arrived"
    : "not_arrived";

const getArrivalStatusLabel = (tracking: VesselTracking) =>
  getArrivalStatus(tracking) === "arrived" ? "Sudah sampai" : "Belum sampai";

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
      { key: "job", label: "Job / First ETD", width: 26 },
      { key: "customer", label: "Customer", width: 34 },
      { key: "liner", label: "Liner / BL", width: 34 },
      { key: "route", label: "Route", width: 42 },
      { key: "initial", label: "Initial Vessel", width: 55 },
      { key: "updated", label: "Updated Vessel", width: 55 },
      { key: "delay", label: "Delay", width: 19, align: "right" as const },
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
      doc.setFontSize(7);
      doc.text(getFilterSummary().toUpperCase(), pageWidth / 2, 27, { align: "center" });

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
        `${tracking.jobNumber}\n${formatTrackingScheduleDate(tracking)}`,
        tracking.customerName || "-",
        `${tracking.linerName || "-"}\n${tracking.carrierBlNo || tracking.containerNo || "-"}`,
        `${tracking.polName || tracking.pol || "-"}\nTO\n${tracking.podName || tracking.pod || "-"}`,
        getTrackingLegSummary(tracking, "initial") || "-",
        getTrackingLegSummary(tracking, "updated") || "-",
        `${tracking.delayDays} days`,
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
        doc.setTextColor(cellIndex === 6 && tracking.delayDays > 0 ? 185 : 31, 41, 55);
        doc.setFont("helvetica", cellIndex === 0 || cellIndex === 6 ? "bold" : "normal");
        doc.setFontSize(6.8);
        const textX =
          col.align === "right" ? x + col.width - 2 : cellIndex === 6 ? x + col.width - 3 : x + 2;
        doc.text(lines, textX, y + 5, { align: col.align || "left", lineHeightFactor: 1.18 });
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
      "Liner",
      "Carrier BL No",
      "HBL No",
      "Container No",
      "POL",
      "POD",
      "Initial Vessel Detail",
      "Updated Vessel Detail",
      "Delay Days",
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
          tracking.linerName || "-",
          tracking.carrierBlNo || "-",
          tracking.hblNo || "-",
          tracking.containerNo || "-",
          tracking.polName || tracking.pol || "-",
          tracking.podName || tracking.pod || "-",
          tracking.initialVesselDetail || "-",
          tracking.updatedVesselDetail || "-",
          tracking.delayDays,
          tracking.remarks || "-",
        ],
        style: isEven ? 5 : 6,
      });
    });

    buildStyledWorkbook(
      "Vessel Tracking",
      rows,
      [18, 16, 28, 18, 22, 22, 22, 22, 22, 45, 45, 12, 35],
      `VESSEL_TRACKING_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Vessel tracking exported to Excel.");
  } catch (error) {
    console.error("Export vessel tracking error:", error);
    toast.error("Gagal mengekspor vessel tracking.");
  }
};

const openEdit = (tracking: VesselTracking) => {
  selectedTracking.value = tracking;
  editLegs.value = tracking.legs.map((leg) => ({ ...leg }));
  editRemarks.value = tracking.remarks || "";
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

const closeEdit = () => {
  selectedTracking.value = null;
  editLegs.value = [];
  editRemarks.value = "";
};

const saveTracking = async () => {
  if (!selectedTracking.value) return;
  isSaving.value = true;
  try {
    const res = await updateVesselTracking(selectedTracking.value.id, {
      remarks: editRemarks.value || null,
      legs: editLegs.value.map((leg) => ({
        id: leg.id,
        updatedTransportId: leg.updatedTransportId,
        updatedTransportType: leg.updatedTransportType,
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
  const [vessels, planes] = await Promise.all([fetchVessels(), fetchPlanes(), loadData()]);
  masterVessels.value = vessels;
  masterPlanes.value = planes;
  const selectedId = typeof route.query.id === "string" ? route.query.id : "";
  if (selectedId) {
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
              placeholder="Cari job, customer, liner..."
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

    <div v-if="isLoading && trackings.length === 0" class="p-8 text-center text-muted-foreground">
      Loading vessel tracking...
    </div>

    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[1180px]">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Job
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Customer
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Liner / BL
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Route
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Initial Vessel
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Updated Vessel
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center"
              >
                Delay
              </th>
              <th class="py-3 px-4 w-10"></th>
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
                    <span class="text-sm font-semibold text-[#012D5A]">{{
                      tracking.jobNumber
                    }}</span>
                    <span class="text-[10px] text-muted-foreground font-medium uppercase">
                      {{ formatTrackingScheduleDate(tracking) }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="text-sm text-foreground max-w-[200px] truncate">
                  {{ tracking.customerName || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col max-w-[220px]">
                  <span class="text-sm font-medium truncate">{{ tracking.linerName || "-" }}</span>
                  <span class="text-xs text-muted-foreground font-mono truncate">
                    {{ tracking.carrierBlNo || tracking.containerNo || "-" }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col max-w-[190px]">
                  <span class="text-sm font-medium truncate">{{
                    tracking.polName || tracking.pol || "-"
                  }}</span>
                  <span class="text-xs text-muted-foreground truncate">
                    → {{ tracking.podName || tracking.pod || "-" }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="w-[280px] space-y-1.5">
                  <div
                    v-for="leg in tracking.legs"
                    :key="`initial-${leg.id}`"
                    class="rounded-md border border-border bg-gray-50/50 px-2.5 py-2"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs font-bold text-foreground leading-snug">
                        {{ getLegDisplay(tracking, leg, "initial").vesselName }}
                      </p>
                      <span
                        v-if="getLegDisplay(tracking, leg, 'initial').voyageNumber"
                        class="shrink-0 text-[10px] font-bold text-[#012D5A] bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5"
                      >
                        {{ getLegDisplay(tracking, leg, "initial").voyageNumber }}
                      </span>
                    </div>
                    <div class="space-y-1.5 mt-2">
                      <div
                        class="schedule-line list-schedule border-orange-100 bg-orange-50 text-orange-700"
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
                        class="schedule-line list-schedule border-emerald-100 bg-emerald-50 text-emerald-700"
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
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="w-[280px] space-y-1.5">
                  <div
                    v-for="leg in tracking.legs"
                    :key="`updated-${leg.id}`"
                    class="rounded-md border border-border bg-white px-2.5 py-2"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs font-bold text-foreground leading-snug">
                        {{ getLegDisplay(tracking, leg, "updated").vesselName }}
                      </p>
                      <span
                        v-if="getLegDisplay(tracking, leg, 'updated').voyageNumber"
                        class="shrink-0 text-[10px] font-bold text-[#012D5A] bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5"
                      >
                        {{ getLegDisplay(tracking, leg, "updated").voyageNumber }}
                      </span>
                    </div>
                    <div class="space-y-1.5 mt-2">
                      <div
                        class="schedule-line list-schedule border-orange-100 bg-orange-50 text-orange-700"
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
                        class="schedule-line list-schedule border-emerald-100 bg-emerald-50 text-emerald-700"
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
                    {{ getArrivalStatusLabel(tracking) }}
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
              <td class="py-3 px-4 text-right">
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
              <td colspan="8" class="p-8 text-center text-muted-foreground">
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
              <div
                v-for="leg in tracking.legs"
                :key="`card-initial-${leg.id}`"
                class="rounded-md bg-gray-50 px-2 py-1.5"
              >
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
              {{ getArrivalStatusLabel(tracking) }}
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
        <div
          v-for="(leg, index) in editLegs"
          :key="leg.id"
          class="border border-border rounded-xl bg-white overflow-visible"
        >
          <div class="px-4 py-3 bg-muted/30 border-b border-border flex items-center gap-2">
            <CalendarClock class="w-4 h-4 text-[#012D5A]" />
            <span class="text-sm font-bold">Leg {{ index + 1 }}</span>
            <span class="text-xs text-muted-foreground uppercase">{{ leg.vesselType }}</span>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="p-4 border-b lg:border-b-0 lg:border-r border-border">
              <p class="text-[10px] font-bold text-muted-foreground uppercase mb-3">Initial</p>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">Vessel</p>
                  <p class="font-semibold">{{ leg.initialVesselName || "-" }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">Voyage</p>
                  <p class="font-mono">{{ leg.initialVoyageNumber || "-" }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">ETD</p>
                  <p>{{ formatDate(leg.initialEtd) }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-muted-foreground uppercase">ETA</p>
                  <p>{{ formatDate(leg.initialEta) }}</p>
                </div>
              </div>
            </div>
            <div class="p-4">
              <p class="text-[10px] font-bold text-muted-foreground uppercase mb-3">Updated</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Vessel</label
                  >
                  <Combobox
                    :model-value="leg.updatedTransportId"
                    :options="getTransportOptions(leg)"
                    label-key="name"
                    value-key="id"
                    :placeholder="
                      leg.updatedTransportType === 'plane' ? 'Select Plane...' : 'Select Vessel...'
                    "
                    class="h-10"
                    @update:model-value="(value) => handleTransportChange(leg, value)"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Voyage</label
                  >
                  <input
                    v-model="leg.updatedVoyageNumber"
                    v-uppercase
                    class="input-field h-10"
                    placeholder="Voyage no"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">ETD</label>
                  <DatePicker v-model="leg.updatedEtd" class="h-10" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase">ETA</label>
                  <div class="eta-date-picker">
                    <DatePicker v-model="leg.updatedEta" class="h-10" />
                  </div>
                </div>
                <div class="space-y-1 md:col-span-2">
                  <label class="text-[10px] font-bold text-muted-foreground uppercase"
                    >Remarks</label
                  >
                  <input
                    v-model="leg.remarks"
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
