<script setup lang="ts">
import * as XLSX from "xlsx";

function test() {
  const ws: Record<string, unknown> = {};
  // Direct cell objects with styles
  const darkNavy = "012D5A";
  const white = "FFFFFF";
  const lightGray = "F5F5F5";

  ws["A1"] = {
    t: "s",
    v: "Dark Navy Header",
    s: {
      font: { name: "Arial", sz: 11, bold: true, color: { rgb: white } },
      fill: { patternType: "solid", fgColor: { rgb: darkNavy } },
      alignment: { horizontal: "center" as const, vertical: "center" as const },
    },
  };
  ws["A2"] = {
    t: "s",
    v: "White Row",
    s: {
      font: { name: "Arial", sz: 10, color: { rgb: "000000" } },
      fill: { patternType: "solid", fgColor: { rgb: white } },
      alignment: { horizontal: "left" as const, vertical: "center" as const },
    },
  };
  ws["A3"] = {
    t: "s",
    v: "Gray Row",
    s: {
      font: { name: "Arial", sz: 10, color: { rgb: "000000" } },
      fill: { patternType: "solid", fgColor: { rgb: lightGray } },
      alignment: { horizontal: "left" as const, vertical: "center" as const },
    },
  };
  ws["B1"] = { t: "n", v: 123 };
  ws["B2"] = { t: "n", v: 456 };
  ws["B3"] = { t: "n", v: 789 };
  ws["!ref"] = "A1:B3";

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Test");
  XLSX.writeFile(wb, "test-styled.xlsx");
}
</script>

<template>
  <div>
    <button @click="test">Test Excel Style</button>
  </div>
</template>
