interface TradeTypeLike {
  tradeType?: { code?: string | null } | null;
  tradeTypeId?: string | null;
}

export interface JobDocumentTabItem {
  id: string;
  label: string;
}

const EXPORT_DOMESTIC_TABS: JobDocumentTabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "bookingConfirmation", label: "Booking Confirmation" },
  { id: "ebl", label: "eBL" },
  { id: "fcr", label: "FCR" },
  { id: "finance", label: "Finance" },
  { id: "jobCover", label: "Job Cover" },
  { id: "document", label: "Upload Document" },
];

const IMPORT_TABS: JobDocumentTabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "finance", label: "Finance" },
  { id: "jobCover", label: "Job Cover" },
  { id: "deliveryOrderLetter", label: "Surat Pengantar DO" },
  { id: "document", label: "Upload Document" },
];

export const normalizeTradeTypeCode = (job?: TradeTypeLike | null) =>
  String(job?.tradeType?.code || job?.tradeTypeId || "")
    .trim()
    .toUpperCase();

export const isImportJob = (job?: TradeTypeLike | null) => normalizeTradeTypeCode(job) === "IMPORT";

export const getJobDocumentTabs = (job?: TradeTypeLike | null): JobDocumentTabItem[] =>
  isImportJob(job) ? IMPORT_TABS : EXPORT_DOMESTIC_TABS;
