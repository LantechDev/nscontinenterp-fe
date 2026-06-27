<script setup lang="ts">
import { UploadCloud, FileText, Trash2, Download, Loader2, Eye, X } from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
}>();

const { getJobDocuments, uploadJobDocument, deleteJobDocument } = useJobs();
const { confirm: confirmDialog } = useConfirm();

const uploadedDocuments = ref<JobDocumentItem[]>([]);
const isLoading = ref(true);
const isUploading = ref(false);
const uploadingFileName = ref<string | null>(null);
const isDragging = ref(false);
const previewDoc = ref<JobDocumentItem | null>(null);
const isPdfLoading = ref(false);
const pdfBlobUrl = ref<string | null>(null);
const textContent = ref<string | null>(null);
const isTextLoading = ref(false);

const getExtension = (name: string): string => {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
};
const OFFICE_EXTENSIONS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
const TEXT_EXTENSIONS = ["csv", "txt"];

const isOfficeDoc = (file: JobDocumentItem): boolean =>
  OFFICE_EXTENSIONS.includes(getExtension(file.fileName));
const isTextDoc = (file: JobDocumentItem): boolean =>
  TEXT_EXTENSIONS.includes(getExtension(file.fileName)) ||
  file.fileType === "text/plain" ||
  file.fileType === "text/csv";

const officeViewerUrl = computed(() =>
  previewDoc.value
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewDoc.value.fileUrl)}`
    : "",
);

const loadDocuments = async () => {
  isLoading.value = true;
  const res = await getJobDocuments(props.jobId);
  if (res.success && res.data) {
    uploadedDocuments.value = res.data;
  }
  isLoading.value = false;
};

onMounted(() => {
  loadDocuments();
});

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    for (const file of Array.from(e.dataTransfer.files)) {
      await uploadFileToApi(file);
    }
  }
};

const handleFileInput = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    for (const file of Array.from(target.files)) {
      await uploadFileToApi(file);
    }
    target.value = "";
  }
};

const uploadFileToApi = async (file: File) => {
  isUploading.value = true;
  uploadingFileName.value = file.name;
  const res = await uploadJobDocument(props.jobId, file);
  if (res.success && res.data) {
    uploadedDocuments.value.unshift(res.data);
    toast.success(`${file.name} uploaded successfully.`);
  } else {
    toast.error(`Failed to upload ${file.name}`);
  }
  isUploading.value = false;
  uploadingFileName.value = null;
};

const removeFile = async (idx: number, docId: string) => {
  const isConfirmed = await confirmDialog({
    title: "Delete Document",
    message: "Are you sure you want to delete this document? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!isConfirmed) return;

  const res = await deleteJobDocument(props.jobId, docId);
  if (res.success) {
    uploadedDocuments.value.splice(idx, 1);
    toast.success("Document deleted.");
  } else {
    toast.error("Failed to delete document.");
  }
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed", error);
    toast.error("Failed to download file directly.");
  }
};

const openPreview = async (file: JobDocumentItem) => {
  previewDoc.value = file;
  textContent.value = null;

  if (isTextDoc(file)) {
    isTextLoading.value = true;
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error("Failed to fetch text file");
      textContent.value = await response.text();
    } catch (err) {
      console.error("Failed to load text preview", err);
      toast.error("Failed to load text preview.");
    } finally {
      isTextLoading.value = false;
    }
    return;
  }

  if (file.fileType === "application/pdf") {
    isPdfLoading.value = true;
    pdfBlobUrl.value = null;
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      pdfBlobUrl.value = window.URL.createObjectURL(pdfBlob);
    } catch (err) {
      console.error("Failed to load PDF preview", err);
      toast.error("Failed to load PDF preview.");
    } finally {
      isPdfLoading.value = false;
    }
  }
};

const closePreview = () => {
  if (pdfBlobUrl.value) {
    window.URL.revokeObjectURL(pdfBlobUrl.value);
    pdfBlobUrl.value = null;
  }
  textContent.value = null;
  previewDoc.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-border pb-4">
      <div>
        <h3 class="text-lg font-bold text-foreground">External Documents</h3>
        <p class="text-sm text-muted-foreground mt-1">
          Upload and manage related documents for this job.
        </p>
      </div>
    </div>

    <div
      class="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
      :class="[
        isDragging
          ? 'border-[#012D5A] bg-[#012D5A]/5 scale-[1.02]'
          : 'border-border bg-gray-50/50 hover:bg-gray-50',
        isUploading ? 'pointer-events-none' : '',
      ]"
      @dragover.prevent="!isUploading && (isDragging = true)"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="!isUploading && handleDrop($event)"
    >
      <div
        v-if="isUploading"
        class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] animate-fade-in z-10"
      >
        <div class="relative flex items-center justify-center">
          <div class="absolute w-20 h-20 bg-blue-100/75 rounded-full animate-ping opacity-75"></div>
          <div class="absolute w-16 h-16 bg-blue-50/80 rounded-full animate-pulse"></div>

          <div
            class="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md border border-blue-100"
          >
            <Loader2 class="w-6 h-6 animate-spin text-[#012D5A]" />
          </div>
        </div>
        <div class="mt-2 space-y-1">
          <p class="text-sm font-bold text-foreground animate-pulse">Uploading document...</p>
          <p class="text-[11px] text-muted-foreground">
            Please wait while the file is being processed
          </p>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-center gap-4 transition-opacity duration-200"
        :class="{ 'opacity-0 pointer-events-none': isUploading }"
      >
        <div
          class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2 shadow-sm border border-blue-100 transition-transform group-hover:scale-105 duration-200"
        >
          <UploadCloud class="w-8 h-8 text-[#012D5A]" />
        </div>
        <div>
          <p class="text-base font-bold text-foreground mb-1">Drag & drop files here</p>
          <p class="text-sm text-muted-foreground">or click to browse from your computer</p>
        </div>
        <label
          class="px-5 py-2.5 bg-[#012D5A] text-white text-sm font-semibold rounded-lg hover:bg-[#012D5A]/90 cursor-pointer transition-colors shadow-sm mt-4 inline-flex items-center gap-2"
        >
          Browse Files
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.msg,.png,.jpg,.jpeg,.gif,.webp,.svg,.bmp,.tif,.tiff"
            class="hidden"
            @change="handleFileInput"
          />
        </label>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center p-8">
      <Loader2 class="w-6 h-6 animate-spin text-[#012D5A]" />
    </div>
    <div v-else-if="uploadedDocuments.length > 0 || isUploading" class="space-y-4 mt-8">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-bold text-foreground uppercase tracking-wider">
          Uploaded Files
          <span class="ml-2 px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">
            {{ uploadedDocuments.length }}
          </span>
        </h4>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-if="isUploading"
          class="flex items-center justify-between p-4 bg-[#012D5A]/5 border border-[#012D5A]/20 border-dashed rounded-xl shadow-sm animate-pulse"
        >
          <div class="flex items-center gap-4 min-w-0 w-full">
            <div
              class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"
            >
              <Loader2 class="w-5 h-5 animate-spin text-[#012D5A]" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-foreground truncate">
                Uploading: {{ uploadingFileName || "file..." }}
              </p>
              <div class="w-full bg-gray-200/80 h-1.5 rounded-full mt-2 overflow-hidden relative">
                <div
                  class="absolute inset-y-0 left-0 bg-[#012D5A] w-1/3 rounded-full animate-loading-bar"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(file, idx) in uploadedDocuments"
          :key="file.id"
          class="flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-sm group hover:border-[#012D5A]/30 transition-all hover:shadow-md"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div
              class="w-10 h-10 rounded-lg bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100"
            >
              <FileText class="w-5 h-5 text-[#012D5A]" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-foreground truncate">
                {{ file.fileName }}
              </p>
              <p class="text-xs font-medium text-muted-foreground mt-0.5">
                {{ formatSize(file.fileSize) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="openPreview(file)"
              class="p-2 text-muted-foreground hover:text-[#012D5A] transition-colors rounded-lg hover:bg-blue-50"
              title="Preview"
            >
              <Eye class="w-4 h-4" />
            </button>
            <button
              @click="downloadFile(file.fileUrl, file.fileName)"
              class="p-2 text-muted-foreground hover:text-[#012D5A] transition-colors rounded-lg hover:bg-blue-50"
              title="Download"
            >
              <Download class="w-4 h-4" />
            </button>
            <button
              @click="removeFile(idx, file.id)"
              class="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Remove"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-border mt-8"
    >
      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <FileText class="w-6 h-6 text-muted-foreground opacity-60" />
      </div>
      <p class="text-sm font-medium text-foreground mb-1">No documents uploaded yet</p>
      <p class="text-xs text-muted-foreground">Files you upload will appear here.</p>
    </div>

    <Teleport to="body">
      <div
        v-if="previewDoc"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closePreview"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-[90vw] max-w-[1400px] max-h-[95vh] h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <div class="flex items-center justify-between p-4 border-b border-border">
            <h3 class="font-bold text-lg text-foreground truncate pl-2 mr-4 flex-1">
              {{ previewDoc.fileName }}
            </h3>
            <div class="flex items-center gap-2">
              <button
                @click="downloadFile(previewDoc.fileUrl, previewDoc.fileName)"
                class="p-2 hover:bg-gray-100 rounded-lg shrink-0 transition-colors"
                title="Download"
              >
                <Download class="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                @click="closePreview"
                class="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0 transition-colors"
                title="Close"
              >
                <X class="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div
            class="p-4 flex-1 overflow-auto bg-gray-50/50 flex justify-center items-center min-h-[500px]"
          >
            <img
              v-if="previewDoc.fileType.startsWith('image/')"
              :src="previewDoc.fileUrl"
              class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
            <div
              v-else-if="previewDoc.fileType === 'application/pdf'"
              class="w-full h-full min-h-[70vh] flex flex-col relative"
            >
              <div
                v-if="isPdfLoading"
                class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 gap-3 z-10"
              >
                <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
                <p class="text-sm font-semibold text-[#012D5A] animate-pulse">
                  Loading PDF preview...
                </p>
              </div>
              <iframe
                v-if="pdfBlobUrl || !isPdfLoading"
                :src="pdfBlobUrl || previewDoc.fileUrl"
                class="w-full h-full flex-1 border border-border rounded-lg shadow-sm bg-white"
              ></iframe>
            </div>
            <div
              v-else-if="isOfficeDoc(previewDoc)"
              class="w-full h-full min-h-[70vh] flex flex-col"
            >
              <iframe
                :src="officeViewerUrl"
                class="w-full h-full flex-1 border border-border rounded-lg shadow-sm bg-white"
              ></iframe>
              <p class="text-xs text-muted-foreground mt-2 text-center">
                Pratinjau dirender oleh Microsoft Office Online.
                <button
                  class="underline hover:text-foreground"
                  @click="downloadFile(previewDoc.fileUrl, previewDoc.fileName)"
                >
                  Unduh file
                </button>
                untuk membuka di aplikasi.
              </p>
            </div>
            <div
              v-else-if="isTextDoc(previewDoc)"
              class="w-full h-full min-h-[70vh] flex flex-col relative"
            >
              <div
                v-if="isTextLoading"
                class="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
              >
                <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
              </div>
              <pre
                class="w-full h-full flex-1 overflow-auto text-left text-sm font-mono whitespace-pre-wrap break-words border border-border rounded-lg shadow-sm bg-white p-4"
                >{{ textContent || "" }}</pre
              >
            </div>
            <div v-else class="text-center p-8 bg-white border border-border rounded-xl shadow-sm">
              <FileText class="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
              <p class="text-foreground font-medium text-lg">No preview available</p>
              <p class="text-muted-foreground text-sm mt-1">
                This file type cannot be previewed directly.
              </p>
              <button
                @click="downloadFile(previewDoc.fileUrl, previewDoc.fileName)"
                class="mt-6 px-4 py-2 bg-[#012D5A] text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#012D5A]/90 transition-colors shadow-sm"
              >
                <Download class="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(300%);
  }
}

.animate-loading-bar {
  animation: loading-bar 2s infinite linear;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.25s ease-out forwards;
}
</style>
