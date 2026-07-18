// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const frontPagePath = resolve(root, "app/components/operational/ebl/JobEblFrontPage.vue");

describe("eBL/FCR signature area", () => {
  it("renders the signature area as two columns with signed-by inside the empty box", () => {
    const contents = readFileSync(frontPagePath, "utf8");

    expect(contents).toContain("ebl-signature-columns");
    expect(contents).toContain("ebl-signature-box");
    expect(contents).toContain("ebl-signature-caption");
    expect(contents).toContain("w-[270px]");
    expect(contents).toContain("w-[150px]");
    expect(contents).toContain("h-[58px]");
    expect(contents).toContain("mt-3");
    expect(contents).toContain('style="height: 74px"');
    expect(contents).toContain("height: 256px");
    expect(contents).toContain("height: 245px");
    expect(contents).toContain("border border-[#062c58]");
    expect(contents).toContain("Signed By:");
    expect(contents).toContain("PT Nova Sync Continent");
    expect(contents.indexOf("ebl-signature-caption")).toBeLessThan(
      contents.indexOf("ebl-signature-box"),
    );
  });
});
