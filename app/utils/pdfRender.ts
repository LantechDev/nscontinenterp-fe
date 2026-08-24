import { nextTick } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface RenderA4PdfOptions {
  filename: string;
  pageSelector?: string;
  resetScroll?: boolean;
}

export async function renderA4Pdf(
  container: HTMLElement,
  { filename, pageSelector = ".a4-page-wrapper", resetScroll = false }: RenderA4PdfOptions,
) {
  await nextTick();

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pages = container.querySelectorAll(pageSelector);

  for (let index = 0; index < pages.length; index++) {
    if (index > 0) pdf.addPage();

    const canvas = await html2canvas(pages[index] as HTMLElement, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      ...(resetScroll ? { scrollY: 0, scrollX: 0 } : {}),
    });

    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297, undefined, "FAST");
  }

  pdf.save(filename);
  return true;
}

export async function renderElementPdf(element: HTMLElement, filename: string) {
  await nextTick();

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = margin;
  const pageContentHeight = pageHeight - margin * 2;
  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageContentHeight;

  while (heightLeft > 0) {
    position = margin - pageContentHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageContentHeight;
  }

  pdf.save(filename);
  return true;
}
