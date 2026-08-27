// @ts-ignore
import { describe, expect, it } from "bun:test";

import { getJobDocumentTabs, normalizeTradeTypeCode } from "./jobDocumentTabs";

describe("job document tabs", () => {
  it("shows Surat Pengantar DO for import jobs without BC, eBL, or FCR", () => {
    const tabs = getJobDocumentTabs({ tradeType: { code: "IMPORT" } });

    expect(tabs.map((tab) => tab.id)).toEqual([
      "overview",
      "finance",
      "jobCover",
      "deliveryOrderLetter",
      "document",
    ]);
  });

  it("keeps BC, eBL, and FCR for export and domestic jobs", () => {
    expect(getJobDocumentTabs({ tradeTypeId: "EXPORT" }).map((tab) => tab.id)).toEqual([
      "overview",
      "bookingConfirmation",
      "ebl",
      "fcr",
      "finance",
      "jobCover",
      "document",
    ]);
    expect(getJobDocumentTabs({ tradeType: { code: "DOMESTIC" } }).map((tab) => tab.id)).toEqual([
      "overview",
      "bookingConfirmation",
      "ebl",
      "fcr",
      "finance",
      "jobCover",
      "document",
    ]);
  });

  it("normalizes trade type from either relation code or raw id", () => {
    expect(normalizeTradeTypeCode({ tradeType: { code: " import " } })).toBe("IMPORT");
    expect(normalizeTradeTypeCode({ tradeTypeId: "domestic" })).toBe("DOMESTIC");
  });
});
