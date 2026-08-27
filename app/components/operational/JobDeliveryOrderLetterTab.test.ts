// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const componentPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "JobDeliveryOrderLetterTab.vue",
);

describe("JobDeliveryOrderLetterTab print layout", () => {
  it("uses the shared bordered document layout", () => {
    const component = readFileSync(componentPath, "utf8");

    expect(component).toContain("transparentnscontinenttebal.png");
    expect(component).toContain("JobPartyRow");
    expect(component).toContain("Combobox");
    expect(component).toContain('import DatePicker from "~/components/ui/DatePicker.vue"');
    expect(component).toContain("fetchVessels");
    expect(component).toContain("vessels = ref<Vessel[]>([])");
    expect(component).toContain("vesselId");
    expect(component).toContain("if (vessel?.voyageNumber != null)");
    expect(component).toContain('form.value.voyageNumber = vessel.voyageNumber || ""');
    expect(component).toContain("shippingLineCompanyId");
    expect(component).toContain("shippingLineAddressId");
    expect(component).toContain('partyRoleCode: "SHIPPING_LINE"');
    expect(component).toContain("shippingLineAddress");
    expect(component).toContain("a4-page-wrapper");
    expect(component).toContain("header-section");
    expect(component).toContain("main-border-container");
    expect(component).toContain("PAGE: 1 OF 1");
    expect(component).toContain('alt="NS Continent Logo"');
    expect(component).toContain("opening-box border border-[#062c58]");
    expect(component).toContain("opening-recipient grid");
    expect(component).toContain("opening-paragraph-box border border-[#062c58]");
    expect(component).toContain("opening-paragraph px-2 py-1.5");
    expect(component).toContain("grid-cols-[1.15fr_0.85fr_0.8fr]");
    expect(component).toContain("min-w-0 break-words");
    expect(component).toContain("Container Details");
    expect(component).toContain("isFinalized");
    expect(component).toContain("handleFinalize");
    expect(component).toContain("handleUnfinalize");
    expect(component).toContain("Finalize Surat Pengantar DO?");
    expect(component).toContain("Unfinalize Surat Pengantar DO?");
    expect(component).toContain("Reopen Draft");
    expect(component).toContain("container-input-grid");
    expect(component).toContain("Container No.");
    expect(component).toContain("Seal No.");
    expect(component).toContain("Gross Weight");
    expect(component).toContain("No container rows yet.");
    expect(component).toContain("w-8 h-8 rounded-md");
    expect(component).toContain("signature-section mt-10");
    expect(component).toContain('style="min-height: 64px"');
    expect(component).toContain("main-border-container border border-[#062c58] flex flex-col");
    expect(component).toContain("closing-section p-4 pb-6");
    expect(component).toContain("text-sm font-normal text-foreground");
    expect(component).toContain("grid grid-cols-2 gap-x-4 gap-y-5");
    expect(component).toContain(
      'class="block space-y-1.5 text-xs font-semibold text-muted-foreground"',
    );
    expect(component).toContain('<span class="block">Nomor Surat</span>');
    expect(component).toContain('<span class="block">Tanggal Surat</span>');
    expect(component).toContain('<span class="block">ETA</span>');
    expect(component).toContain('<DatePicker v-model="form.letterDate"');
    expect(component).toContain('<DatePicker v-model="form.eta"');
    expect(component).not.toContain('type="date"');
    expect(component).not.toContain(
      'label class="space-y-1 text-xs font-semibold text-muted-foreground"',
    );
    expect(component).not.toContain("flex-1 flex flex-col justify-between p-4");
    expect(component).not.toContain("opening-recipient mt-2 mb-3 px-2");
    expect(component).not.toContain('v-model="form.vesselName"');
    expect(component).not.toContain(
      "main-border-container border border-[#062c58] flex-1 flex flex-col",
    );
    expect(component).not.toContain("flex-1 p-4 text-[11px]");

    expect(component.indexOf("opening-recipient")).toBeLessThan(
      component.indexOf("main-border-container"),
    );
    expect(component.indexOf("opening-paragraph")).toBeLessThan(
      component.indexOf("main-border-container"),
    );
  });
});
