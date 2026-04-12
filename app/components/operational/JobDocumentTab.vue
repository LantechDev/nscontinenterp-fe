<script setup lang="ts">
import { UploadCloud, FileText, Trash2, Download, Loader2, Eye, X } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
}>();

const { getJobDocuments, uploadJobDocument, deleteJobDocument } = useJobs();
const { confirm: confirmDialog } = useConfirm();

// Files fetched from DB
const uploadedDocuments = ref<JobDocumentItem[]>([]);
const isLoading = ref(true);
const isUploading = ref(false);
const isDragging = ref(false);
const previewDoc = ref<JobDocumentItem | null>(null);

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
    target.value = ""; // reset input
  }
};

const uploadFileToApi = async (file: File) => {
  isUploading.value = true;
  const res = await uploadJobDocument(props.jobId, file);
  if (res.success && res.data) {
    uploadedDocuments.value.unshift(res.data);
    toast.success(`${file.name} uploaded successfully.`);
  } else {
    toast.error(`Failed to upload ${file.name}`);
  }
  isUploading.value = false;
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

    <!-- Upload Area -->
    <div
      class="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4"
      :class="
        isDragging
          ? 'border-[#012D5A] bg-[#012D5A]/5 scale-[1.02]'
          : 'border-border bg-gray-50/50 hover:bg-gray-50'
      "
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div
        class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2 shadow-sm border border-blue-100"
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
        <input type="file" multiple class="hidden" @change="handleFileInput" />
      </label>
    </div>

    <!-- File List -->
    <div v-if="isLoading" class="flex justify-center p-8">
      <Loader2 class="w-6 h-6 animate-spin text-[#012D5A]" />
    </div>
    <div v-else-if="uploadedDocuments.length > 0" class="space-y-4 mt-8">
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
              @click="previewDoc = file"
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

    <!-- Preview Modal -->
    <Teleport to="body">
      <div
        v-if="previewDoc"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="previewDoc = null"
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
                @click="previewDoc = null"
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
            <!-- Image Preview -->
            <img
              v-if="previewDoc.fileType.startsWith('image/')"
              :src="previewDoc.fileUrl"
              class="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
            <!-- PDF Preview -->
            <iframe
              v-else-if="previewDoc.fileType === 'application/pdf'"
              :src="previewDoc.fileUrl"
              class="w-full h-full min-h-[70vh] border border-border rounded-lg shadow-sm bg-white"
            ></iframe>
            <!-- Unrecognized / Fallback -->
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
