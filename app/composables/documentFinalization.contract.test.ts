// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("document finalization composables", () => {
  it("exposes FCR finalize and unfinalize calls", () => {
    const composable = readFileSync(resolve(appRoot, "composables/useFcr.ts"), "utf8");

    expect(composable).toContain("finalizeFcrById");
    expect(composable).toContain("unfinalizeFcrById");
    expect(composable).toContain("/api/operational/jobs/fcrs/${fcrId}/finalize");
    expect(composable).toContain("/api/operational/jobs/fcrs/${fcrId}/unfinalize");
  });

  it("exposes Surat Pengantar DO finalize and unfinalize calls", () => {
    const composable = readFileSync(
      resolve(appRoot, "composables/useDeliveryOrderLetters.ts"),
      "utf8",
    );

    expect(composable).toContain("finalizeDeliveryOrderLetter");
    expect(composable).toContain("unfinalizeDeliveryOrderLetter");
    expect(composable).toContain(
      "/api/operational/jobs/delivery-order-letters/${letterId}/finalize",
    );
    expect(composable).toContain(
      "/api/operational/jobs/delivery-order-letters/${letterId}/unfinalize",
    );
  });
});
