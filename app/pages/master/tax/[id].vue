<script setup lang="ts">
import { ArrowLeft, Calculator, Edit, Trash2, Download } from "lucide-vue-next";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { cn } from "~/lib/utils";
import { jsPDF } from "jspdf";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const taxId = route.params.id as string;
const { fetchTaxById, deleteTax } = useFinanceTax();

// SSR-first: fetch tax detail
const {
  data: taxData,
  pending: loading,
  error,
} = await useAsyncData<Tax>(`tax-${taxId}`, async () => await fetchTaxById(taxId), {
  server: false,
});

const tax = computed(() => taxData.value);
const isLoading = computed(() => loading.value);

async function handleDelete() {
  if (confirm("Apakah Anda yakin ingin menghapus pajak ini?")) {
    try {
      await deleteTax(taxId);
      navigateTo("/master/tax");
    } catch (err) {
      toast.error("Gagal menghapus pajak: " + (err as Error).message);
    }
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function handleDownloadPdf() {
  if (!tax.value) return;
  const t = tax.value;

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Colors
    const primaryColor: [number, number, number] = [1, 45, 90]; // #012D5A
    const textColor: [number, number, number] = [31, 41, 55]; // #1f2937
    const grayColor: [number, number, number] = [107, 114, 128]; // #6b7280

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TAX RECORD", margin, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(t.type?.toUpperCase() || "TAX", pageWidth - margin, 20, { align: "right" });
    doc.text(t.isActive ? "Active" : "Inactive", pageWidth - margin, 30, { align: "right" });

    let yPos = 55;

    // Rate Box
    doc.setFillColor(239, 246, 255); // #eff6ff
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 40, 3, 3, "F");
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text("RATE", pageWidth / 2, yPos + 15, { align: "center" });
    doc.setTextColor(...primaryColor);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(`${t.rate}%`, pageWidth / 2, yPos + 32, { align: "center" });

    yPos += 55;

    // Details
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Name:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(t.name || "-", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Type:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(t.type || "-", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Created Date:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(t.createdAt ? formatDate(t.createdAt) : "-", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Status:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(t.isActive ? "Active" : "Inactive", margin + 35, yPos);

    // Description
    if (t.description) {
      yPos += 20;
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 3, 3, "F");
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text("Description:", margin + 5, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      const descLines = doc.splitTextToSize(t.description, pageWidth - margin * 2 - 10);
      doc.text(descLines, margin + 5, yPos);
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("PT. Nusantara Continent - Tax Record", pageWidth / 2, footerY + 5, {
      align: "center",
    });

    // Generate filename
    const filename = `Tax_${t.name?.replace(/\s+/g, "_") || "Record"}.pdf`;

    // Download the PDF directly
    doc.save(filename);
  } catch (err) {
    console.error("Failed to download tax PDF:", err);
    toast.error("Failed to download PDF. Please try again.");
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div v-if="isLoading && !tax" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="tax">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/master/tax" class="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold">{{ tax.name }}</h1>
              <p class="text-muted-foreground mt-1">Detail catatan pajak</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleDownloadPdf"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Download class="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              @click="handleDelete"
              class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 class="w-5 h-5" />
            </button>
            <NuxtLink
              :to="`/master/tax/edit/${tax.id}`"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Edit class="w-4 h-4" />
              <span>Edit</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-xl border border-border shadow-sm">
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Calculator class="w-8 h-8 text-[#012D5A]" />
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ tax.name }}</h2>
            <p class="text-muted-foreground font-medium uppercase">{{ tax.type }}</p>
          </div>
          <div class="ml-auto text-right">
            <p class="text-sm text-muted-foreground mb-1">Rate</p>
            <p class="text-3xl font-black text-[#012D5A]">{{ tax.rate }}%</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Tipe Pajak</p>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase bg-muted text-muted-foreground border"
            >
              {{ tax.type }}
            </span>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Rate</p>
            <p class="font-bold text-lg">{{ tax.rate }}%</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Status</p>
            <span
              :class="
                cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  tax.isActive
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200',
                )
              "
            >
              {{ tax.isActive ? "Aktif" : "Nonaktif" }}
            </span>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Tanggal Dibuat</p>
            <p class="font-bold">{{ formatDate(tax.createdAt) }}</p>
          </div>
          <div class="space-y-1.5 md:col-span-2 lg:col-span-2 pt-4 border-t">
            <p class="text-sm text-muted-foreground">Deskripsi</p>
            <p class="text-sm text-foreground italic">{{ tax.description || "-" }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
