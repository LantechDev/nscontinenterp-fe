import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  computed,
  watch,
  resolveComponent,
  unref,
  createVNode,
  resolveDynamicComponent,
  withCtx,
  createTextVNode,
  mergeProps,
  nextTick,
  isRef,
  createBlock,
  createCommentVNode,
  openBlock,
  toDisplayString,
  withDirectives,
  vModelText,
  reactive,
  mergeModels,
  useModel,
  vModelCheckbox,
  withKeys,
  Fragment,
  renderList,
  useSSRContext,
} from "vue";
import {
  ssrRenderTeleport,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderList,
  ssrRenderClass,
  ssrRenderAttr,
  ssrRenderVNode,
  ssrRenderAttrs,
  ssrRenderStyle,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
} from "vue/server-renderer";
import {
  X,
  Loader2,
  Calendar,
  Settings,
  CheckCircle2,
  CalendarClock,
  Building2,
  Ship,
  Edit,
  Plus,
  Check,
  Trash2,
  Mail,
  Box,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Receipt,
  Download,
  MoreHorizontal,
  Pencil,
  Ban,
  AlertCircle,
  ExternalLink,
  AlertTriangle,
  Info,
  RotateCcw,
  Send,
  Save,
  UploadCloud,
  FileText,
  Eye,
  CreditCard,
  Wallet,
  ArrowRightLeft,
  Zap,
  Clock,
  Hash,
  Users,
  MapPin,
} from "lucide-vue-next";
import { u as useInvoices } from "./useInvoices-DKKCQ9mY.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import { _ as __nuxt_component_0$1 } from "./Modal-DzxIm9v2.mjs";
import { t as toast } from "./index-DJGQOf1Z.mjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import { u as usePayments } from "./usePayments-BGfFm4PO.mjs";
import { u as useMasterData, D as DatePicker } from "./DatePicker-I7QCahB1.mjs";
import { g as useAuth } from "./server.mjs";
import _sfc_main$c from "./JobPartyRow-CsBs8qVt.mjs";
import _sfc_main$b from "./SectionCard-BNHBHmfw.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";

const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "JobInvoiceForm",
  __ssrInlineRender: true,
  props: {
    jobId: {},
    jobNumber: {},
    customerId: {},
    invoice: {},
  },
  emits: ["success", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isLoading: isSaving } = useInvoices();
    const { services, fetchServices, createService } = useServices();
    const { companies } = useCompanies();
    const form = ref({
      invoiceNumber:
        props.invoice?.invoiceNumber ||
        `INV-${/* @__PURE__ */ new Date().getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`,
      issuedDate: props.invoice?.issuedDate
        ? new Date(props.invoice.issuedDate).toISOString().split("T")[0]
        : /* @__PURE__ */ new Date().toISOString().split("T")[0],
      dueDate: props.invoice?.dueDate
        ? new Date(props.invoice.dueDate).toISOString().split("T")[0]
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      currency: props.invoice?.currency || "IDR",
      customerId: props.invoice?.company?.id || props.customerId || "",
      notes: props.invoice?.notes || "",
      items: props.invoice?.items?.map((item) => ({
        id: item.id,
        serviceId: item.service?.id || "",
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: 11,
      })) || [{ serviceId: "", description: "", quantity: 1, unitPrice: 0, taxRate: 11 }],
    });
    const isServiceModalOpen = ref(false);
    const isSubmittingService = ref(false);
    const activeItemIndex = ref(null);
    const serviceForm = reactive({
      name: "",
      code: "",
      customerPrice: 0,
    });
    const onServiceChange = (index) => {
      const item = form.value.items[index];
      if (!item) return;
      const service = services.value.find((s) => s.id === item.serviceId);
      if (service) {
        item.description = service.name;
        item.unitPrice = Number(service.customerPrice) || 0;
        item.taxRate = Number(service.taxRate) || 0;
      }
    };
    const handleCreateService = (name, index) => {
      serviceForm.name = name;
      serviceForm.code = name.toUpperCase().replace(/\s+/g, "_").substring(0, 10);
      serviceForm.customerPrice = 0;
      activeItemIndex.value = index;
      isServiceModalOpen.value = true;
    };
    async function submitServiceForm() {
      if (!serviceForm.name || !serviceForm.code) {
        toast.error("Name and Code are required.");
        return;
      }
      try {
        isSubmittingService.value = true;
        const result = await createService({
          name: serviceForm.name,
          code: serviceForm.code,
          customerPrice: Number(serviceForm.customerPrice),
        });
        if (result.success && result.data) {
          await fetchServices();
          if (activeItemIndex.value !== null) {
            const item = form.value.items[activeItemIndex.value];
            if (item) {
              item.serviceId = result.data.id;
              item.description = result.data.name;
              item.unitPrice = Number(result.data.customerPrice) || 0;
            }
          }
          isServiceModalOpen.value = false;
        } else {
          toast.error("Failed to create service: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        toast.error("Failed to create service: " + error?.message);
      } finally {
        isSubmittingService.value = false;
      }
    }
    const subTotal = computed(() => {
      return form.value.items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
        0,
      );
    });
    const taxAmount = computed(() => {
      return form.value.items.reduce(
        (sum, item) =>
          sum + Number(item.quantity) * Number(item.unitPrice) * (Number(item.taxRate) / 100),
        0,
      );
    });
    const total = computed(() => {
      return subTotal.value + taxAmount.value;
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat(form.value.currency === "IDR" ? "id-ID" : "en-US", {
        style: "currency",
        currency: form.value.currency,
        minimumFractionDigits: form.value.currency === "IDR" ? 0 : 2,
      }).format(amount);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Receipt = resolveComponent("Receipt");
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in" }, _attrs))}><div class="px-6 py-4 border-b border-border bg-gray-50 flex items-center justify-between"><div class="flex items-center gap-4"><div class="flex items-center gap-2">`,
      );
      _push(
        ssrRenderComponent(_component_Receipt, { class: "w-5 h-5 text-[#012D5A]" }, null, _parent),
      );
      _push(
        `<h3 class="font-bold text-foreground">${ssrInterpolate(props.invoice?.id ? "Edit" : "Create New")} Invoice </h3></div><div class="h-4 w-[1px] bg-border mx-1"></div><div class="flex items-center gap-2"><span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currency</span><div class="flex border border-border rounded-lg overflow-hidden bg-white"><button type="button" class="${ssrRenderClass(
          [
            unref(form).currency === "IDR"
              ? "bg-[#012D5A] text-white"
              : "hover:bg-gray-50 text-muted-foreground",
            "px-3 py-1 text-[10px] font-bold transition-colors",
          ],
        )}"> IDR </button><button type="button" class="${ssrRenderClass([
          unref(form).currency === "USD"
            ? "bg-[#012D5A] text-white"
            : "hover:bg-gray-50 text-muted-foreground",
          "px-3 py-1 text-[10px] font-bold border-l border-border transition-colors",
        ])}"> USD </button></div></div></div><button type="button" class="text-muted-foreground hover:text-foreground transition-colors">`,
      );
      _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
      _push(
        `</button></div><form class="p-6 space-y-6"><div class="p-4 bg-blue-50/30 rounded-xl border border-blue-100/50 space-y-3"><div class="flex items-center gap-2 mb-1">`,
      );
      _push(
        ssrRenderComponent(unref(Building2), { class: "w-4 h-4 text-[#012D5A]" }, null, _parent),
      );
      _push(
        `<span class="text-xs font-bold text-[#012D5A] uppercase tracking-wider">Billing Information</span></div><div class="grid grid-cols-1 gap-4"><div class="space-y-1.5"><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Billing Party (Customer) <span class="text-red-500">*</span></label>`,
      );
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(form).customerId,
            "onUpdate:modelValue": ($event) => (unref(form).customerId = $event),
            options: unref(companies),
            "label-key": "name",
            "value-key": "id",
            placeholder: "Search or select customer...",
            class: "bg-white",
          },
          null,
          _parent,
        ),
      );
      if (!props.customerId) {
        _push(
          `<p class="text-[9px] text-amber-600 font-medium italic"> Note: This job does not have a linked customer. Please select one manually. </p>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></div></div><div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issued Date</label><input type="date"${ssrRenderAttr("value", unref(form).issuedDate)} class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"></div><div class="space-y-1.5"><label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Due Date</label><input type="date"${ssrRenderAttr("value", unref(form).dueDate)} class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"></div></div><div class="space-y-4"><div class="flex items-center justify-between"><label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service Items</label><button type="button" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#012D5A] hover:bg-[#012D5A]/5 px-2 py-1 rounded transition-colors">`,
      );
      _push(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(
        ` Add Service Item </button></div><div class="border rounded-xl border-border bg-muted/5"><div class="grid grid-cols-12 gap-3 px-4 py-2 border-b border-border bg-gray-50/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"><div class="col-span-4">Service / Description</div><div class="col-span-2">Qty</div><div class="col-span-3 text-right">Unit Price</div><div class="col-span-2 px-2">Tax</div><div class="col-span-1"></div></div><div class="divide-y divide-border/50"><!--[-->`,
      );
      ssrRenderList(unref(form).items, (item, index) => {
        _push(
          `<div class="grid grid-cols-12 gap-3 px-4 py-3 items-start group hover:bg-white transition-colors relative" style="${ssrRenderStyle({ zIndex: unref(form).items.length + 10 - index })}"><div class="col-span-4 space-y-2">`,
        );
        _push(
          ssrRenderComponent(
            Combobox,
            {
              modelValue: item.serviceId,
              "onUpdate:modelValue": [
                ($event) => (item.serviceId = $event),
                ($event) => onServiceChange(index),
              ],
              options: unref(services),
              "label-key": "name",
              "value-key": "id",
              placeholder: "Choose service...",
              "allow-create": "",
              onCreate: (name) => handleCreateService(name, index),
            },
            null,
            _parent,
          ),
        );
        _push(
          `<textarea placeholder="Item description..." rows="1" class="w-full px-3 py-1.5 bg-white border border-border rounded-md text-xs focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all resize-none">${ssrInterpolate(item.description)}</textarea></div><div class="col-span-2"><input type="number"${ssrRenderAttr("value", item.quantity)} min="1" class="w-full px-3 py-2 bg-white border border-border rounded-md text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"></div><div class="col-span-3"><div class="relative"><span class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold pr-1 border-r border-border mr-1">${ssrInterpolate(unref(form).currency)}</span><input type="number"${ssrRenderAttr("value", item.unitPrice)} step="0.01" class="w-full pl-10 pr-3 py-2 bg-white border border-border rounded-md text-sm text-right font-medium focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all"></div><p class="text-[9px] text-right mt-1.5 font-bold text-muted-foreground"> Sub: ${ssrInterpolate(formatCurrency(Number(item.quantity) * Number(item.unitPrice)))}</p></div><div class="col-span-2 px-2"><select class="w-full bg-white border border-border rounded px-2 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-[#012D5A]"><option${ssrRenderAttr("value", 0)}${ssrIncludeBooleanAttr(Array.isArray(item.taxRate) ? ssrLooseContain(item.taxRate, 0) : ssrLooseEqual(item.taxRate, 0)) ? " selected" : ""}>0%</option><option${ssrRenderAttr("value", 1.1)}${ssrIncludeBooleanAttr(Array.isArray(item.taxRate) ? ssrLooseContain(item.taxRate, 1.1) : ssrLooseEqual(item.taxRate, 1.1)) ? " selected" : ""}>1.1%</option><option${ssrRenderAttr("value", 11)}${ssrIncludeBooleanAttr(Array.isArray(item.taxRate) ? ssrLooseContain(item.taxRate, 11) : ssrLooseEqual(item.taxRate, 11)) ? " selected" : ""}>11%</option></select><p class="text-[9px] text-right mt-1.5 font-bold text-slate-400"> Tax: ${ssrInterpolate(
            formatCurrency(
              Number(item.quantity) * Number(item.unitPrice) * (Number(item.taxRate) / 100),
            ),
          )}</p></div><div class="col-span-1 flex justify-end"><button type="button" class="p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-30"${ssrIncludeBooleanAttr(unref(form).items.length === 1) ? " disabled" : ""}>`,
        );
        _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div></div>`);
      });
      _push(
        `<!--]--></div></div></div><div class="space-y-2"><label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Internal Notes</label><textarea rows="2" placeholder="Add any internal notes here..." class="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] outline-none transition-all resize-none">${ssrInterpolate(unref(form).notes)}</textarea></div><div class="flex justify-end pt-4"><div class="w-72 space-y-3 bg-gray-50/50 p-4 rounded-xl border border-border"><div class="flex justify-between text-sm"><span class="text-muted-foreground font-inter">Subtotal</span><span class="font-medium text-foreground font-inter">${ssrInterpolate(formatCurrency(unref(subTotal)))}</span></div><div class="flex items-center justify-between text-sm"><span class="text-muted-foreground font-inter">Total Tax</span><span class="font-medium text-foreground font-inter">${ssrInterpolate(formatCurrency(unref(taxAmount)))}</span></div><div class="flex justify-between border-t border-border pt-2 mt-2"><span class="font-bold text-foreground font-inter">Total Amount</span><span class="font-bold text-[#0a0b0b] text-lg font-inter">${ssrInterpolate(formatCurrency(unref(total)))}</span></div></div></div></form><div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50/30"><button type="button" class="btn-outline h-10 px-6 font-semibold"${ssrIncludeBooleanAttr(unref(isSaving)) ? " disabled" : ""}> Cancel </button><button type="button" class="bg-[#012D5A] hover:bg-[#012D5A]/90 text-white h-10 px-8 rounded-lg font-bold text-sm shadow-lg shadow-[#012D5A]/10 transition-all active:scale-95 flex items-center gap-2"${ssrIncludeBooleanAttr(unref(isSaving)) ? " disabled" : ""}>`,
      );
      if (unref(isSaving)) {
        _push(`<span>${ssrInterpolate(props.invoice?.id ? "Updating..." : "Saving...")}</span>`);
      } else {
        _push(`<span>${ssrInterpolate(props.invoice?.id ? "Update" : "Create")} Invoice</span>`);
      }
      _push(`</button></div>`);
      _push(
        ssrRenderComponent(
          __nuxt_component_0$1,
          {
            modelValue: unref(isServiceModalOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isServiceModalOpen) ? (isServiceModalOpen.value = $event) : null,
            title: "Add New Service",
            description: "Create a new service to master data.",
            width: "max-w-md",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-bold text-muted-foreground uppercase"${_scopeId}>Service Name</label><input${ssrRenderAttr("value", unref(serviceForm).name)} type="text" class="input-field" placeholder="e.g. Ocean Freight"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-bold text-muted-foreground uppercase"${_scopeId}>Service Code</label><input${ssrRenderAttr("value", unref(serviceForm).code)} type="text" class="input-field" placeholder="e.g. OF_001"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-bold text-muted-foreground uppercase"${_scopeId}>Default Customer Price</label><div class="relative"${_scopeId}><span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold"${_scopeId}>${ssrInterpolate(unref(form).currency)}</span><input${ssrRenderAttr("value", unref(serviceForm).customerPrice)} type="number" class="input-field pl-12" placeholder="0"${_scopeId}></div></div><div class="flex justify-end gap-3 pt-4"${_scopeId}><button type="button" class="btn-outline px-4 py-2"${_scopeId}> Cancel </button><button type="button" class="btn-primary px-6 py-2 bg-[#012D5A]"${ssrIncludeBooleanAttr(unref(isSubmittingService)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(isSubmittingService) ? "Creating..." : "Create Service")}</button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        { class: "text-xs font-bold text-muted-foreground uppercase" },
                        "Service Name",
                      ),
                      withDirectives(
                        createVNode(
                          "input",
                          {
                            "onUpdate:modelValue": ($event) => (unref(serviceForm).name = $event),
                            type: "text",
                            class: "input-field",
                            placeholder: "e.g. Ocean Freight",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, unref(serviceForm).name]],
                      ),
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        { class: "text-xs font-bold text-muted-foreground uppercase" },
                        "Service Code",
                      ),
                      withDirectives(
                        createVNode(
                          "input",
                          {
                            "onUpdate:modelValue": ($event) => (unref(serviceForm).code = $event),
                            type: "text",
                            class: "input-field",
                            placeholder: "e.g. OF_001",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, unref(serviceForm).code]],
                      ),
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        { class: "text-xs font-bold text-muted-foreground uppercase" },
                        "Default Customer Price",
                      ),
                      createVNode("div", { class: "relative" }, [
                        createVNode(
                          "span",
                          {
                            class:
                              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold",
                          },
                          toDisplayString(unref(form).currency),
                          1,
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(serviceForm).customerPrice = $event),
                              type: "number",
                              class: "input-field pl-12",
                              placeholder: "0",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [
                            [
                              vModelText,
                              unref(serviceForm).customerPrice,
                              void 0,
                              { number: true },
                            ],
                          ],
                        ),
                      ]),
                    ]),
                    createVNode("div", { class: "flex justify-end gap-3 pt-4" }, [
                      createVNode(
                        "button",
                        {
                          type: "button",
                          onClick: ($event) => (isServiceModalOpen.value = false),
                          class: "btn-outline px-4 py-2",
                        },
                        " Cancel ",
                        8,
                        ["onClick"],
                      ),
                      createVNode(
                        "button",
                        {
                          type: "button",
                          onClick: submitServiceForm,
                          class: "btn-primary px-6 py-2 bg-[#012D5A]",
                          disabled: unref(isSubmittingService),
                        },
                        toDisplayString(
                          unref(isSubmittingService) ? "Creating..." : "Create Service",
                        ),
                        9,
                        ["disabled"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobInvoiceForm.vue",
  );
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const JobInvoiceForm = Object.assign(_sfc_main$a, { __name: "OperationalJobInvoiceForm" });
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "JobInvoicePreview",
  __ssrInlineRender: true,
  props: {
    invoice: {},
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const logoUrl = ref("/images/transparentnscontinenttebal.png");
    const isGeneratingPDF = ref(false);
    const printContainerRef = ref(null);
    const getVal = (val, fallback = "") => (val ? String(val) : fallback ? String(fallback) : "");
    const formatCurrency = (amount) => {
      if (amount === void 0 || amount === null) return "-";
      const num = Number(amount);
      return new Intl.NumberFormat(props.invoice?.currency === "USD" ? "en-US" : "id-ID", {
        style: "decimal",
        minimumFractionDigits: props.invoice?.currency === "IDR" ? 0 : 2,
        maximumFractionDigits: props.invoice?.currency === "IDR" ? 0 : 2,
      }).format(num);
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const d = new Date(dateStr);
        const parts = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).formatToParts(d);
        return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
      } catch {
        return dateStr;
      }
    };
    const generatePDF = async () => {
      if (!printContainerRef.value || !props.invoice) return false;
      try {
        isGeneratingPDF.value = true;
        await nextTick();
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pages = printContainerRef.value.querySelectorAll(".a4-page-wrapper");
        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();
          const canvas = await html2canvas(pages[i], {
            scale: 3,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            scrollY: 0,
            scrollX: 0,
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, void 0, "FAST");
        }
        pdf.save(`INVOICE_${props.invoice.invoiceNumber || "DRAFT"}.pdf`);
        return true;
      } catch (error) {
        console.error(error);
        toast.error("Gagal membuat PDF. Cek console.");
        return false;
      } finally {
        isGeneratingPDF.value = false;
      }
    };
    __expose({
      generatePDF,
      isGeneratingPDF,
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto custom-scrollbar font-mono" }, _attrs))} data-v-83558c64><div class="relative group flex flex-col gap-10" data-v-83558c64><div class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border" style="${ssrRenderStyle({ width: "794px", height: "1123px", padding: "20px 30px", "box-sizing": "border-box", position: "relative" })}" data-v-83558c64><div class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white" style="${ssrRenderStyle({ height: "70px" })}" data-v-83558c64><div class="w-[35%] pb-1" data-v-83558c64><img${ssrRenderAttr("src", logoUrl.value)} alt="NS Continent Logo" class="h-16 object-contain max-w-[190px]" crossorigin="anonymous" data-v-83558c64></div><div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full" data-v-83558c64><span class="text-xs font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]" data-v-83558c64>${ssrInterpolate(__props.invoice?.status?.code === "draft" ? "PROFORMA INVOICE" : "COMMERCIAL INVOICE")}</span></div><div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full" data-v-83558c64><div class="text-[0.6rem] font-mono mb-1 text-black" data-v-83558c64>PAGE: 1 OF 1</div><h1 class="text-xl font-bold tracking-widest uppercase leading-none" data-v-83558c64>INVOICE</h1></div></div><div class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full" data-v-83558c64><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "100px" })}" data-v-83558c64><div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2" data-v-83558c64><span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase" data-v-83558c64>BILL TO:</span><div class="font-medium text-xs text-black uppercase leading-tight" data-v-83558c64>${ssrInterpolate(getVal(__props.invoice?.companyName, __props.invoice?.company?.name))}</div><div class="whitespace-pre-wrap font-mono uppercase text-[0.65rem] leading-tight text-black/80 mt-1" data-v-83558c64>${ssrInterpolate(getVal(__props.invoice?.companyAddress, __props.invoice?.company?.address))}</div></div><div class="w-1/2" data-v-83558c64><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ height: "50px" })}" data-v-83558c64><div class="w-1/2 border-r border-[#062c58] pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase" data-v-83558c64>INVOICE NO.</span><span class="font-mono text-[0.85rem] text-black font-medium" data-v-83558c64>${ssrInterpolate(getVal(__props.invoice?.invoiceNumber, "DRAFT"))}</span></div><div class="w-1/2 pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase" data-v-83558c64>DATE</span><span class="font-mono text-[0.8rem] text-black" data-v-83558c64>${ssrInterpolate(formatDate(__props.invoice?.issuedDate))}</span></div></div><div class="flex" style="${ssrRenderStyle({ height: "50px" })}" data-v-83558c64><div class="w-1/2 border-r border-[#062c58] pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase" data-v-83558c64>JOB NO.</span><span class="font-mono text-[0.75rem] text-black font-medium" data-v-83558c64>${ssrInterpolate(getVal(__props.invoice?.job?.jobNumber, "-"))}</span></div><div class="w-1/2 pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase" data-v-83558c64>DUE DATE</span><span class="font-mono text-[0.75rem] text-black" data-v-83558c64>${ssrInterpolate(formatDate(__props.invoice?.dueDate))}</span></div></div></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "45px" })}" data-v-83558c64><div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-1" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>VESSEL / VOYAGE</span><span class="font-mono text-[0.75rem] uppercase text-black font-medium" data-v-83558c64>${ssrInterpolate(__props.invoice?.job?.vessels?.[0]?.vessel?.name || __props.invoice?.job?.vessels?.[0]?.vesselName || "-")} ${ssrInterpolate(__props.invoice?.job?.vessels?.[0]?.voyageNumber ? "/ " + __props.invoice?.job?.vessels[0].voyageNumber : "")}</span></div><div class="w-1/4 border-r border-[#062c58] pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>PORT OF LOADING</span><span class="font-mono text-[0.7rem] uppercase text-black" data-v-83558c64>${ssrInterpolate(__props.invoice?.job?.polName || __props.invoice?.job?.pol || "-")}</span></div><div class="w-1/4 pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>PORT OF DISCHARGE</span><span class="font-mono text-[0.7rem] uppercase text-black" data-v-83558c64>${ssrInterpolate(__props.invoice?.job?.podName || __props.invoice?.job?.pod || "-")}</span></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "45px" })}" data-v-83558c64><div class="w-1/4 border-r border-[#062c58] pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>CURRENCY</span><span class="font-mono text-[0.75rem] uppercase text-black font-medium" data-v-83558c64>${ssrInterpolate(__props.invoice?.currency || "IDR")}</span></div><div class="w-1/4 border-r border-[#062c58] pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>FREIGHT TERM</span><span class="font-mono text-[0.7rem] uppercase text-black" data-v-83558c64>${ssrInterpolate(getVal(__props.invoice?.job?.tradeType?.name, "PREPAID"))}</span></div><div class="w-1/2 pt-1 px-2" data-v-83558c64><span class="font-bold text-[0.6rem] block leading-none mb-1" data-v-83558c64>CUSTOMER REFERENCE</span><span class="font-mono text-[0.7rem] uppercase text-black" data-v-83558c64>${ssrInterpolate(
          (() => {
            const refs =
              props.invoice?.job?.billsOfLading?.flatMap((bl) => bl.shipperReferences || []) || [];
            const uniqueRefs = [...new Set(refs.filter((r) => !!r))];
            return uniqueRefs.length ? uniqueRefs.join(", ") : "-";
          })(),
        )}</span></div></div><div class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]" data-v-83558c64><div class="w-[8%] border-r border-[#062c58] flex items-center justify-center" data-v-83558c64>NO</div><div class="flex-1 border-r border-[#062c58] flex items-center px-3" data-v-83558c64>DESCRIPTION</div><div class="w-[10%] border-r border-[#062c58] flex items-center justify-center" data-v-83558c64> QTY </div><div class="w-[18%] border-r border-[#062c58] flex items-center justify-end px-3" data-v-83558c64> UNIT PRICE </div><div class="w-[20%] flex items-center justify-end px-3" data-v-83558c64>TOTAL AMOUNT</div></div><div class="flex-1 relative" data-v-83558c64><div class="absolute inset-0 flex pointer-events-none" data-v-83558c64><div class="w-[8%] border-r border-[#062c58]/30" data-v-83558c64></div><div class="flex-1 border-r border-[#062c58]/30" data-v-83558c64></div><div class="w-[10%] border-r border-[#062c58]/30" data-v-83558c64></div><div class="w-[18%] border-r border-[#062c58]/30" data-v-83558c64></div><div class="w-[20%]" data-v-83558c64></div></div><div class="relative z-[1] p-0 font-mono text-black" data-v-83558c64><!--[-->`,
      );
      ssrRenderList(__props.invoice?.items || [], (item, idx) => {
        _push(
          `<div class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2" data-v-83558c64><div class="w-[8%] text-center text-[0.7rem]" data-v-83558c64>${ssrInterpolate(idx + 1)}</div><div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight" data-v-83558c64>${ssrInterpolate(item.description)}</div><div class="w-[10%] text-center text-[0.7rem]" data-v-83558c64>${ssrInterpolate(item.quantity)}</div><div class="w-[18%] text-right px-3 text-[0.7rem] text-black" data-v-83558c64>${ssrInterpolate(formatCurrency(item.unitPrice))}</div><div class="w-[20%] text-right px-3 text-[0.7rem] font-medium text-black" data-v-83558c64>${ssrInterpolate(formatCurrency(item.amount))}</div></div>`,
        );
      });
      _push(`<!--]-->`);
      if ((__props.invoice?.items?.length || 0) < 10) {
        _push(`<!--[-->`);
        ssrRenderList(10 - (__props.invoice?.items?.length || 0), (i) => {
          _push(
            `<div class="flex min-h-[35px] border-b border-[#062c58]/5" data-v-83558c64><div class="w-[8%]" data-v-83558c64></div><div class="flex-1" data-v-83558c64></div><div class="w-[10%]" data-v-83558c64></div><div class="w-[18%]" data-v-83558c64></div><div class="w-[20%]" data-v-83558c64></div></div>`,
          );
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></div><div class="border-t border-[#062c58] mt-auto" data-v-83558c64><div class="flex items-stretch min-h-[140px]" data-v-83558c64><div class="w-[58%] border-r border-[#062c58] p-3" data-v-83558c64><span class="font-bold text-[0.6rem] block text-[#062c58] uppercase mb-2" data-v-83558c64>PLEASE REMIT PAYMENT TO:</span><div class="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-[0.65rem] font-mono text-black leading-tight uppercase" data-v-83558c64><span class="text-[#062c58]/70" data-v-83558c64>BANK NAME:</span><span class="font-medium" data-v-83558c64>BANK CENTRAL ASIA (BCA)</span><span class="text-[#062c58]/70" data-v-83558c64>ACCOUNT NAME:</span><span class="font-medium" data-v-83558c64>PT NOVA SYNC CONTINENT</span><span class="text-[#062c58]/70" data-v-83558c64>ACCOUNT NO:</span><span class="font-medium text-sm" data-v-83558c64>1234567890 (${ssrInterpolate(__props.invoice?.currency || "IDR")})</span><span class="text-[#062c58]/70" data-v-83558c64>SWIFT CODE:</span><span class="font-medium" data-v-83558c64>CENAIDJA</span></div><div class="mt-4 pt-2 border-t border-[#062c58]/10" data-v-83558c64><span class="font-bold text-[0.55rem] text-[#062c58]/50 block uppercase" data-v-83558c64>REMARKS:</span><p class="text-[0.65rem] text-black/60 italic leading-tight uppercase" data-v-83558c64>${ssrInterpolate(__props.invoice?.notes || "PLEASE INCLUDE THE INVOICE NUMBER ON YOUR REMITTANCE.")}</p></div></div><div class="w-[42%] flex flex-col" data-v-83558c64><div class="flex-1 flex flex-col" data-v-83558c64><div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0" data-v-83558c64><div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]" data-v-83558c64> SUBTOTAL (${ssrInterpolate(__props.invoice?.currency || "IDR")}) </div><div class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black" data-v-83558c64>${ssrInterpolate(formatCurrency(__props.invoice?.subTotal))}</div></div><div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0" data-v-83558c64><div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]" data-v-83558c64> VAT / TAX (${ssrInterpolate(Math.round(((__props.invoice?.taxAmount || 0) / (__props.invoice?.subTotal || 1)) * 100))}%) </div><div class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black" data-v-83558c64>${ssrInterpolate(formatCurrency(__props.invoice?.taxAmount))}</div></div><div class="flex bg-[#062c58] text-white flex-1 items-center" data-v-83558c64><div class="w-1/2 px-3 flex flex-col" data-v-83558c64><span class="text-[0.55rem] font-bold opacity-70" data-v-83558c64>TOTAL AMOUNT DUE</span><span class="text-[0.8rem] font-black tracking-wider uppercase leading-none mt-1" data-v-83558c64>${ssrInterpolate(__props.invoice?.currency || "IDR")}</span></div><div class="flex-1 px-3 text-right font-mono text-xl font-black" data-v-83558c64>${ssrInterpolate(formatCurrency(__props.invoice?.total))}</div></div></div></div></div></div></div><div class="mt-4 flex justify-between items-end" data-v-83558c64><div class="w-2/3" data-v-83558c64><p class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]" data-v-83558c64> Computer generated invoice. No signature required unless specifically requested by the recipient for legal compliance. All business transacted is subject to the standard trading conditions of the carrier. </p></div><div class="text-center min-w-[200px]" data-v-83558c64><div class="text-[0.65rem] font-bold text-[#062c58] uppercase mb-12" data-v-83558c64> AUTHORIZED SIGNATORY </div><div class="w-full h-[0.5px] bg-[#062c58] mb-1" data-v-83558c64></div><div class="text-[0.7rem] font-black text-[#062c58] uppercase" data-v-83558c64> PT NOVA SYNC CONTINENT </div></div></div></div></div></div>`,
      );
    };
  },
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobInvoicePreview.vue",
  );
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const JobInvoicePreview = /* @__PURE__ */ Object.assign(
  _export_sfc(_sfc_main$9, [["__scopeId", "data-v-83558c64"]]),
  { __name: "OperationalJobInvoicePreview" },
);
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "JobPaymentTab",
  __ssrInlineRender: true,
  props: {
    jobId: {},
  },
  emits: ["reload"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { fetchInvoices, isLoading } = useInvoices();
    const { voidPayment } = usePayments();
    const invoices = ref([]);
    const error = ref(null);
    const isVoiding = ref(false);
    const showVoidConfirm = ref(false);
    const paymentToVoid = ref(null);
    const paymentNumberToVoid = ref(null);
    const loadData = async () => {
      error.value = null;
      const result = await fetchInvoices(props.jobId);
      if (result.success) {
        invoices.value = result.data || [];
      } else {
        error.value = result.error || "Failed to load payment history";
      }
    };
    const allPayments = computed(() => {
      const payments = [];
      invoices.value.forEach((invoice) => {
        if (invoice.paymentAllocations && invoice.paymentAllocations.length > 0) {
          invoice.paymentAllocations.forEach((alloc) => {
            if (alloc.payment) {
              payments.push({
                ...alloc.payment,
                amount: alloc.amount,
                // Use the allocated amount for this invoice
                invoiceNumber: invoice.invoiceNumber,
                invoiceId: invoice.id,
              });
            }
          });
        }
      });
      return payments.toSorted(
        (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
      );
    });
    const totalPaid = computed(() => {
      return allPayments.value.reduce((sum, p) => sum + Number(p.amount), 0);
    });
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };
    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    };
    const handleVoidPayment = async () => {
      if (!paymentToVoid.value) return;
      isVoiding.value = true;
      try {
        const result = await voidPayment(paymentToVoid.value);
        if (result.success) {
          showVoidConfirm.value = false;
          await loadData();
          emit("reload");
        } else {
          error.value = result.error || "Failed to void payment";
        }
      } catch (err) {
        error.value = err.message || "An unexpected error occurred";
      } finally {
        isVoiding.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(isLoading) && unref(invoices).length === 0) {
        _push(`<div class="py-12 flex flex-col items-center justify-center space-y-3">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-8 h-8 animate-spin text-primary opacity-60" },
            null,
            _parent,
          ),
        );
        _push(`<p class="text-sm text-muted-foreground">Loading payment history...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-6 text-center bg-red-50 rounded-xl border border-red-100">`);
        _push(
          ssrRenderComponent(
            unref(AlertCircle),
            { class: "w-8 h-8 text-red-400 mx-auto mb-3" },
            null,
            _parent,
          ),
        );
        _push(
          `<p class="text-sm font-medium text-red-800">${ssrInterpolate(unref(error))}</p><button class="mt-4 text-xs font-bold text-red-700 hover:underline"> Try Again </button></div>`,
        );
      } else if (unref(allPayments).length === 0) {
        _push(
          `<div class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"><div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border">`,
        );
        _push(
          ssrRenderComponent(
            unref(Receipt),
            { class: "w-6 h-6 text-muted-foreground opacity-40" },
            null,
            _parent,
          ),
        );
        _push(
          `</div><p class="text-sm font-semibold text-foreground mb-1">No Payments Recorded</p><p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed"> There are no payments linked to any invoices for this job yet. </p></div>`,
        );
      } else {
        _push(
          `<div class="space-y-6"><div class="bg-[#012D5A] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative"><div class="relative z-10"><p class="text-xs font-bold uppercase tracking-widest opacity-70 mb-1"> Total Payments Received </p><h3 class="text-3xl font-black">${ssrInterpolate(formatCurrency(unref(totalPaid)))}</h3><div class="mt-4 flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10">`,
        );
        _push(
          ssrRenderComponent(
            unref(CheckCircle2),
            { class: "w-3.5 h-3.5 text-emerald-400" },
            null,
            _parent,
          ),
        );
        _push(
          ` Across ${ssrInterpolate(unref(invoices).length)} Invoice${ssrInterpolate(unref(invoices).length > 1 ? "s" : "")}</div></div><div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div></div><div class="space-y-1"><h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1"> Recent Transactions </h3><div class="space-y-3"><!--[-->`,
        );
        ssrRenderList(unref(allPayments), (payment) => {
          _push(
            `<div class="group p-4 rounded-xl border border-border bg-white hover:border-emerald-500/30 hover:shadow-md transition-all"><div class="flex items-start justify-between mb-4"><div class="flex gap-4"><div class="${ssrRenderClass(
              [
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                payment.status === "VOIDED"
                  ? "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600",
              ],
            )}">`,
          );
          if (payment.status === "VOIDED") {
            _push(ssrRenderComponent(unref(Ban), { class: "w-5 h-5" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(CreditCard), { class: "w-5 h-5" }, null, _parent));
          }
          _push(
            `</div><div class="space-y-0.5"><p class="${ssrRenderClass([
              "font-bold text-sm",
              (payment.status || "").toUpperCase() === "VOIDED"
                ? "text-gray-400 line-through"
                : "text-foreground",
            ])}">${ssrInterpolate(formatCurrency(payment.amount))}</p><div class="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">`,
          );
          _push(ssrRenderComponent(unref(Calendar), { class: "w-3 h-3" }, null, _parent));
          _push(` ${ssrInterpolate(formatDate(payment.paymentDate))} `);
          if ((payment.status || "").toUpperCase() === "VOIDED") {
            _push(
              `<span class="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-bold uppercase tracking-wider">Voided</span>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div></div><div class="flex flex-col items-end gap-3 shrink-0"><div class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-100 text-[9px] font-black uppercase tracking-widest shadow-sm">${ssrInterpolate(payment.invoiceNumber)}</div>`,
          );
          if ((payment.status || "").toUpperCase() === "PAID" && payment.paymentNumber) {
            _push(
              `<button class="flex items-center gap-1.5 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-all border border-red-100/50 hover:border-red-200 shadow-sm" title="Void Payment">`,
            );
            _push(ssrRenderComponent(unref(Ban), { class: "w-3.5 h-3.5" }, null, _parent));
            _push(
              `<span class="text-[9px] font-bold uppercase tracking-wider">Void</span></button>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div><div class="${ssrRenderClass([
              "grid grid-cols-2 gap-4 border-t border-border/50 pt-3 mt-3",
              payment.status === "VOIDED" ? "opacity-50" : "",
            ])}"><div><p class="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1"> Method </p><p class="text-xs font-bold text-foreground">${ssrInterpolate(payment.paymentMethod?.name || "Bank Transfer")}</p></div><div class="text-right"><p class="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1"> Reference </p><p class="text-xs font-bold text-foreground">${ssrInterpolate(payment.reference || "-")}</p></div></div></div>`,
          );
        });
        _push(`<!--]--></div></div></div>`);
      }
      _push(
        ssrRenderComponent(
          __nuxt_component_0$1,
          {
            modelValue: unref(showVoidConfirm),
            "onUpdate:modelValue": ($event) =>
              isRef(showVoidConfirm) ? (showVoidConfirm.value = $event) : null,
            title: "Void Payment",
            description:
              "Are you sure you want to void this payment? This will restore the balance on the related invoice and cannot be undone.",
            width: "max-w-sm",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-4 pt-2"${_scopeId}><div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(AlertCircle),
                    { class: "w-5 h-5 text-red-600 shrink-0 mt-0.5" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `<p class="text-xs text-red-800 leading-relaxed font-medium"${_scopeId}> Voiding payment ${ssrInterpolate(unref(paymentNumberToVoid))} will mark it as inactive and restore the corresponding amount to the balance due of invoice(s) it was applied to. </p></div><div class="flex justify-end gap-3 pt-2"${_scopeId}><button class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors"${_scopeId}> Cancel </button><button${ssrIncludeBooleanAttr(unref(isVoiding)) ? " disabled" : ""} class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2"${_scopeId}>`,
                );
                if (unref(isVoiding)) {
                  _push2(
                    ssrRenderComponent(
                      unref(Loader2),
                      { class: "w-3.5 h-3.5 animate-spin" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  ` ${ssrInterpolate(unref(isVoiding) ? "Voiding..." : "Confirm Void")}</button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-4 pt-2" }, [
                    createVNode(
                      "div",
                      {
                        class:
                          "p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3",
                      },
                      [
                        createVNode(unref(AlertCircle), {
                          class: "w-5 h-5 text-red-600 shrink-0 mt-0.5",
                        }),
                        createVNode(
                          "p",
                          { class: "text-xs text-red-800 leading-relaxed font-medium" },
                          " Voiding payment " +
                            toDisplayString(unref(paymentNumberToVoid)) +
                            " will mark it as inactive and restore the corresponding amount to the balance due of invoice(s) it was applied to. ",
                          1,
                        ),
                      ],
                    ),
                    createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                      createVNode(
                        "button",
                        {
                          onClick: ($event) => (showVoidConfirm.value = false),
                          class:
                            "px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors",
                        },
                        " Cancel ",
                        8,
                        ["onClick"],
                      ),
                      createVNode(
                        "button",
                        {
                          onClick: handleVoidPayment,
                          disabled: unref(isVoiding),
                          class:
                            "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2",
                        },
                        [
                          unref(isVoiding)
                            ? (openBlock(),
                              createBlock(unref(Loader2), {
                                key: 0,
                                class: "w-3.5 h-3.5 animate-spin",
                              }))
                            : createCommentVNode("", true),
                          createTextVNode(
                            " " + toDisplayString(unref(isVoiding) ? "Voiding..." : "Confirm Void"),
                            1,
                          ),
                        ],
                        8,
                        ["disabled"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobPaymentTab.vue",
  );
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const JobPaymentTab = Object.assign(_sfc_main$8, { __name: "OperationalJobPaymentTab" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "PaymentEntryForm",
  __ssrInlineRender: true,
  props: {
    jobId: {},
    invoiceId: {},
    companyId: {},
  },
  emits: ["success", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isSaving } = usePayments();
    const { fetchInvoices } = useInvoices();
    const { companies, isLoading: isFetchingCompanies } = useCompanies();
    useMasterData();
    const paymentMethods = ref([]);
    const form = ref({
      companyId: props.companyId || "",
      amount: 0,
      paymentDate: /* @__PURE__ */ new Date().toISOString().split("T")[0],
      paymentMethodId: "",
      reference: "",
      notes: "",
      useFifo: false,
      allocations: [],
    });
    const outstandingInvoices = ref([]);
    const isFetchingInvoices = ref(false);
    const loadOutstandingInvoices = async (companyId) => {
      if (!companyId) return;
      isFetchingInvoices.value = true;
      const result = await fetchInvoices();
      if (result.success && result.data) {
        outstandingInvoices.value = result.data.filter(
          (inv) => inv.companyId === companyId && Number(inv.balanceDue) > 0,
        );
        if (props.invoiceId) {
          const target = outstandingInvoices.value.find((inv) => inv.id === props.invoiceId);
          if (target && !form.value.allocations.some((a) => a.invoiceId === target.id)) {
            form.value.allocations.push({
              invoiceId: target.id,
              invoiceNumber: target.invoiceNumber,
              balanceDue: Number(target.balanceDue),
              amount: Number(target.balanceDue),
            });
            updateTotalFromAllocations();
          }
        }
      }
      isFetchingInvoices.value = false;
    };
    const formatThousand = (val) => {
      if (!val && val !== 0) return "";
      const num = typeof val === "string" ? parseInt(val.replace(/\D/g, "")) : val;
      if (isNaN(num)) return "";
      return new Intl.NumberFormat("id-ID").format(num);
    };
    const totalOutstandingSelected = computed(() => {
      if (form.value.useFifo) {
        return outstandingInvoices.value.reduce((sum, inv) => sum + Number(inv.balanceDue), 0);
      }
      return form.value.allocations.reduce((sum, a) => sum + a.balanceDue, 0);
    });
    const remainingBalance = computed(() => {
      return Math.max(0, totalOutstandingSelected.value - form.value.amount);
    });
    watch(
      () => props.companyId,
      (newId) => {
        if (newId) form.value.companyId = newId;
      },
      { immediate: true },
    );
    watch(
      () => form.value.companyId,
      (newId) => {
        if (newId) loadOutstandingInvoices(newId);
        else outstandingInvoices.value = [];
      },
      { immediate: true },
    );
    const updateTotalFromAllocations = () => {
      if (!form.value.useFifo) {
        form.value.amount = form.value.allocations.reduce((sum, a) => sum + a.amount, 0);
      }
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 font-sans p-1" }, _attrs))} data-v-03ddfde7><div class="space-y-5 bg-gray-50/50 p-6 rounded-xl border border-border/50 shadow-sm" data-v-03ddfde7><div class="space-y-2 flex-1" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5" data-v-03ddfde7>`,
      );
      _push(ssrRenderComponent(unref(Building2), { class: "w-4 h-4" }, null, _parent));
      _push(` Customer / Payer <span class="text-red-500" data-v-03ddfde7>*</span></label>`);
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(form).companyId,
            "onUpdate:modelValue": ($event) => (unref(form).companyId = $event),
            options: unref(companies),
            "label-key": "name",
            "value-key": "id",
            placeholder: "Search customer...",
            loading: unref(isFetchingCompanies),
            class: "bg-white",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="grid grid-cols-2 gap-5" data-v-03ddfde7><div class="space-y-2" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5" data-v-03ddfde7>`,
      );
      _push(ssrRenderComponent(unref(Calendar), { class: "w-4 h-4" }, null, _parent));
      _push(` Date Received <span class="text-red-500" data-v-03ddfde7>*</span></label>`);
      _push(
        ssrRenderComponent(
          DatePicker,
          {
            modelValue: unref(form).paymentDate,
            "onUpdate:modelValue": ($event) => (unref(form).paymentDate = $event),
            placeholder: "Select date",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="space-y-2" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 ml-0.5" data-v-03ddfde7>`,
      );
      _push(ssrRenderComponent(unref(Wallet), { class: "w-4 h-4" }, null, _parent));
      _push(` Payment Method </label>`);
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: unref(form).paymentMethodId,
            "onUpdate:modelValue": ($event) => (unref(form).paymentMethodId = $event),
            options: unref(paymentMethods),
            "label-key": "name",
            "value-key": "id",
            placeholder: "Select method...",
            class: "bg-white",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div></div></div><div class="space-y-5 px-1" data-v-03ddfde7><div class="flex items-center justify-between" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-0.5" data-v-03ddfde7>`,
      );
      _push(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-4 h-4" }, null, _parent));
      _push(
        ` Allocation Logic </label><div class="flex border border-border rounded-lg bg-gray-100 p-0.5 shadow-sm" data-v-03ddfde7><button type="button" class="${ssrRenderClass(
          [
            !unref(form).useFifo
              ? "bg-white text-[#012D5A] shadow-sm ring-1 ring-black/5"
              : "text-muted-foreground hover:bg-white/50",
            "px-5 py-1.5 text-xs font-bold transition-all rounded-md",
          ],
        )}" data-v-03ddfde7> Manual </button><button type="button" class="${ssrRenderClass([
          unref(form).useFifo
            ? "bg-white text-[#012D5A] shadow-sm ring-1 ring-black/5"
            : "text-muted-foreground hover:bg-white/50",
          "px-5 py-1.5 text-xs font-bold transition-all rounded-md",
        ])}" data-v-03ddfde7> Auto FIFO </button></div></div>`,
      );
      if (unref(form).useFifo) {
        _push(
          `<div class="border rounded-xl border-border bg-emerald-50/20 p-10 flex flex-col items-center animate-in zoom-in-95 duration-200" data-v-03ddfde7><div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 mb-4 shadow-sm" data-v-03ddfde7>`,
        );
        _push(ssrRenderComponent(unref(Zap), { class: "w-7 h-7 text-emerald-600" }, null, _parent));
        _push(
          `</div><p class="text-sm font-bold text-foreground mb-6" data-v-03ddfde7>FIFO Mode Active</p><div class="w-full max-w-[360px] space-y-3" data-v-03ddfde7><label class="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center block" data-v-03ddfde7>Total Received Amount</label><div class="relative group" data-v-03ddfde7><div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-border/50" data-v-03ddfde7><span class="text-[10px] font-black text-muted-foreground" data-v-03ddfde7>IDR</span></div><input${ssrRenderAttr("value", formatThousand(unref(form).amount))} type="text" placeholder="Enter amount..." class="w-full pl-16 pr-5 h-14 bg-white border border-border rounded-xl text-xl font-black text-[#012D5A] outline-none shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500" data-v-03ddfde7></div></div></div>`,
        );
      } else {
        _push(
          `<div class="space-y-5 animate-in slide-in-from-top-1 duration-200" data-v-03ddfde7>`,
        );
        if (!unref(form).companyId) {
          _push(
            `<div class="py-20 text-center border-2 border-dashed border-border rounded-xl bg-gray-50/50" data-v-03ddfde7><p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-35" data-v-03ddfde7> Select customer to view invoices </p></div>`,
          );
        } else {
          _push(
            `<div class="border rounded-xl border-border overflow-hidden bg-white shadow-md" data-v-03ddfde7><div class="grid grid-cols-12 gap-3 px-6 py-3 border-b border-border bg-gray-50/80 text-[10px] font-black text-muted-foreground uppercase tracking-widest" data-v-03ddfde7><div class="col-span-1" data-v-03ddfde7></div><div class="col-span-6" data-v-03ddfde7>Invoice details</div><div class="col-span-5 text-right" data-v-03ddfde7>Apply Amount</div></div><div class="divide-y divide-border/50 max-h-[380px] overflow-y-auto custom-scrollbar" data-v-03ddfde7><!--[-->`,
          );
          ssrRenderList(unref(outstandingInvoices), (inv) => {
            _push(
              `<div class="${ssrRenderClass([
                "grid grid-cols-12 gap-3 px-6 py-4 items-center group cursor-pointer transition-all",
                unref(form).allocations.some((a) => a.invoiceId === inv.id)
                  ? "bg-[#012D5A]/5"
                  : "hover:bg-gray-50/80",
              ])}" data-v-03ddfde7><div class="col-span-1 flex justify-center" data-v-03ddfde7><div class="${ssrRenderClass(
                [
                  "w-4 h-4 rounded border flex items-center justify-center transition-all",
                  unref(form).allocations.some((a) => a.invoiceId === inv.id)
                    ? "bg-[#012D5A] border-[#012D5A] text-white shadow-sm scale-110"
                    : "bg-white border-border group-hover:border-[#012D5A]/30",
                ],
              )}" data-v-03ddfde7>`,
            );
            if (unref(form).allocations.some((a) => a.invoiceId === inv.id)) {
              _push(
                ssrRenderComponent(
                  unref(Check),
                  {
                    class: "w-2.5 h-2.5",
                    "stroke-width": "6",
                  },
                  null,
                  _parent,
                ),
              );
            } else {
              _push(`<!---->`);
            }
            _push(
              `</div></div><div class="col-span-6 space-y-1" data-v-03ddfde7><span class="text-xs font-black text-foreground block" data-v-03ddfde7>${ssrInterpolate(inv.invoiceNumber)}</span><div class="flex items-center gap-1.5 opacity-60" data-v-03ddfde7>`,
            );
            _push(ssrRenderComponent(unref(Clock), { class: "w-3.5 h-3.5" }, null, _parent));
            _push(
              `<span class="text-[10px] font-bold" data-v-03ddfde7>Balance: ${ssrInterpolate(formatCurrency(inv.balanceDue))}</span></div></div><div class="col-span-5 flex justify-end" data-v-03ddfde7>`,
            );
            if (unref(form).allocations.some((a) => a.invoiceId === inv.id)) {
              _push(
                `<div class="relative w-full max-w-[220px]" data-v-03ddfde7><span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground opacity-50" data-v-03ddfde7>Rp</span><input${ssrRenderAttr(
                  "value",
                  formatThousand(
                    unref(form).allocations.find((a) => a.invoiceId === inv.id).amount,
                  ),
                )} type="text" class="w-full pl-8 pr-3 py-2 bg-white border border-[#012D5A]/20 rounded-lg text-right font-black text-[#012D5A] focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] outline-none shadow-sm text-sm" data-v-03ddfde7></div>`,
              );
            } else {
              _push(
                `<span class="text-[10px] font-black text-slate-300 uppercase tracking-tighter self-center italic" data-v-03ddfde7>Select to apply</span>`,
              );
            }
            _push(`</div></div>`);
          });
          _push(`<!--]-->`);
          if (unref(outstandingInvoices).length === 0) {
            _push(
              `<div class="py-16 text-center text-[10px] font-bold text-muted-foreground uppercase opacity-25 italic" data-v-03ddfde7> No unpaid items found </div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
      if (unref(form).companyId) {
        _push(
          `<div class="bg-[#012D5A]/5 rounded-xl p-6 border border-[#012D5A]/10 space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-300" data-v-03ddfde7><div class="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest" data-v-03ddfde7><div class="flex items-center gap-2" data-v-03ddfde7>`,
        );
        _push(ssrRenderComponent(unref(Info), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(
          ` Selected Total </div><span class="text-foreground -tracking-tight font-black" data-v-03ddfde7>${ssrInterpolate(formatCurrency(unref(totalOutstandingSelected)))}</span></div><div class="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest pb-3 border-b border-[#012D5A]/10" data-v-03ddfde7><div class="flex items-center gap-2" data-v-03ddfde7>`,
        );
        _push(ssrRenderComponent(unref(Wallet), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(
          ` Payment Received </div><span class="text-[#012D5A] font-black -tracking-tight" data-v-03ddfde7>${ssrInterpolate(formatCurrency(unref(form).amount))}</span></div><div class="flex items-center justify-between pt-1" data-v-03ddfde7><span class="text-[11px] font-black text-muted-foreground uppercase tracking-widest" data-v-03ddfde7>Remaining Balance</span><span class="${ssrRenderClass(
            [
              "text-base font-black -tracking-tight",
              unref(remainingBalance) > 0 ? "text-red-600" : "text-emerald-600",
            ],
          )}" data-v-03ddfde7>${ssrInterpolate(formatCurrency(unref(remainingBalance)))}</span></div></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<div class="grid grid-cols-2 gap-4 pt-1" data-v-03ddfde7><div class="space-y-1.5" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5" data-v-03ddfde7>Reference #</label><div class="relative group" data-v-03ddfde7>`,
      );
      _push(
        ssrRenderComponent(
          unref(Hash),
          {
            class:
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40",
          },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(form).reference)} type="text" placeholder="Bank Ref, Check #" class="w-full h-11 pl-10 pr-3 bg-white border border-border rounded-md text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] transition-all" data-v-03ddfde7></div></div><div class="space-y-1.5" data-v-03ddfde7><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-0.5" data-v-03ddfde7>Internal Notes</label><div class="relative group" data-v-03ddfde7>`,
      );
      _push(
        ssrRenderComponent(
          unref(FileText),
          {
            class:
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40",
          },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(form).notes)} type="text" placeholder="Optional notes..." class="w-full h-11 pl-10 pr-3 bg-white border border-border rounded-md text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#012D5A]/10 focus:border-[#012D5A] transition-all" data-v-03ddfde7></div></div></div><div class="flex items-center justify-between border-t border-border pt-8 mt-4" data-v-03ddfde7><button type="button" class="px-6 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all" data-v-03ddfde7> Cancel </button><button type="button" class="bg-[#012D5A] hover:bg-[#062c58] text-white h-11 px-10 rounded-lg font-black text-sm shadow-xl shadow-[#012D5A]/10 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"${ssrIncludeBooleanAttr(unref(isSaving) || unref(form).amount <= 0 || !unref(form).companyId) ? " disabled" : ""} data-v-03ddfde7>`,
      );
      if (unref(isSaving)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(
        `<span data-v-03ddfde7>${ssrInterpolate(unref(isSaving) ? "POSTING..." : "RECORD PAYMENT")}</span></button></div></div>`,
      );
    };
  },
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/finance/PaymentEntryForm.vue",
  );
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const PaymentEntryForm = /* @__PURE__ */ Object.assign(
  _export_sfc(_sfc_main$7, [["__scopeId", "data-v-03ddfde7"]]),
  { __name: "FinancePaymentEntryForm" },
);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "JobInvoiceTab",
  __ssrInlineRender: true,
  props: {
    jobId: {},
    jobNumber: {},
    customerId: {},
    jobParties: {},
    initialInvoiceId: {},
  },
  setup(__props) {
    const props = __props;
    const { fetchInvoices, isLoading, fetchInvoiceById, voidInvoice } = useInvoices();
    const invoices = ref([]);
    const error = ref(null);
    const showForm = ref(false);
    const isEditing = ref(false);
    const showPaymentForm = ref(false);
    const activeInvoice = ref(null);
    const isLoadingDetail = ref(false);
    const previewRef = ref(null);
    const isGeneratingPDF = ref(false);
    const isVoiding = ref(false);
    const showVoidConfirm = ref(false);
    const showMoreActions = ref(false);
    const resolvedCustomerId = computed(() => {
      if (props.customerId) return props.customerId;
      const shipper = props.jobParties?.find((p) => p.partyRole?.code === "SHIPPER");
      if (shipper?.companyId) return shipper.companyId;
      const consignee = props.jobParties?.find((p) => p.partyRole?.code === "CONSIGNEE");
      if (consignee?.companyId) return consignee.companyId;
      const notify = props.jobParties?.find((p) => p.partyRole?.code === "NOTIFY_PARTY");
      if (notify?.companyId) return notify.companyId;
      return props.jobParties?.[0]?.companyId || null;
    });
    const loadInvoices = async () => {
      error.value = null;
      const result = await fetchInvoices(props.jobId);
      if (result.success) {
        invoices.value = result.data || [];
      } else {
        error.value = result.error || "Failed to load invoices";
      }
    };
    const loadInvoiceDetail = async (id) => {
      isLoadingDetail.value = true;
      error.value = null;
      const result = await fetchInvoiceById(id);
      if (result.success && result.data) {
        activeInvoice.value = result.data;
      } else {
        error.value = result.error || "Failed to load invoice details";
      }
      isLoadingDetail.value = false;
    };
    const handleVoid = async () => {
      if (!activeInvoice.value) return;
      isVoiding.value = true;
      const result = await voidInvoice(activeInvoice.value.id);
      if (result.success) {
        showVoidConfirm.value = false;
        await loadInvoiceDetail(activeInvoice.value.id);
        await loadInvoices();
      } else {
        alert(result.error || "Failed to void invoice");
      }
      isVoiding.value = false;
    };
    watch(
      () => props.initialInvoiceId,
      (newId) => {
        if (newId) {
          loadInvoiceDetail(newId);
        }
      },
    );
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };
    const formatDate = (dateString) => {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    };
    const getStatusClass = (status) => {
      switch (status) {
        case "PAID":
          return "bg-green-100 text-green-700 border-green-200";
        case "PARTIAL":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "UNPAID":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "OVERDUE":
          return "bg-red-100 text-red-700 border-red-200";
        case "VOIDED":
          return "bg-gray-100 text-gray-400 border-gray-200 grayscale opacity-70";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };
    const handleFormSuccess = () => {
      showForm.value = false;
      if (isEditing.value && activeInvoice.value) {
        loadInvoiceDetail(activeInvoice.value.id);
      }
      isEditing.value = false;
      loadInvoices();
    };
    const handlePaymentSuccess = () => {
      showPaymentForm.value = false;
      if (activeInvoice.value) {
        loadInvoiceDetail(activeInvoice.value.id);
      }
      loadInvoices();
    };
    const handlePaymentVoided = async () => {
      await loadInvoices();
      if (activeInvoice.value) {
        await loadInvoiceDetail(activeInvoice.value.id);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(showForm)) {
        _push(`<div class="animate-fade-in">`);
        _push(
          ssrRenderComponent(
            JobInvoiceForm,
            {
              "job-id": __props.jobId,
              "job-number": __props.jobNumber,
              "customer-id": unref(resolvedCustomerId),
              invoice: unref(isEditing) ? unref(activeInvoice) : null,
              onCancel: ($event) => {
                showForm.value = false;
                isEditing.value = false;
              },
              onSuccess: handleFormSuccess,
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (unref(activeInvoice)) {
        _push(
          `<div class="animate-fade-in flex flex-col gap-6"><div class="flex items-center justify-between border-b border-border/50 pb-4"><div class="flex items-center gap-4"><button class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0">`,
        );
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent));
        _push(
          `</button><div><h2 class="text-xl font-bold flex items-center gap-2"> Invoice ${ssrInterpolate(unref(activeInvoice).invoiceNumber)}</h2><p class="text-sm text-muted-foreground mt-0.5"> Issued on ${ssrInterpolate(formatDate(unref(activeInvoice).createdAt))}</p></div></div><div class="flex items-center gap-4"><span class="${ssrRenderClass(
            [
              "px-3 py-1.5 rounded-md text-[10px] font-bold border uppercase tracking-widest shadow-sm shadow-black/5",
              getStatusClass(unref(activeInvoice).status?.code || ""),
            ],
          )}">${ssrInterpolate(unref(activeInvoice).status?.name || unref(activeInvoice).status?.code)}</span><div class="h-8 w-px bg-border/40 mx-1"></div><div class="flex items-center gap-3">`,
        );
        if (unref(activeInvoice).status?.code !== "VOIDED") {
          _push(
            `<button class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-emerald-200/50 text-[11px] font-black uppercase tracking-wider gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">`,
          );
          _push(ssrRenderComponent(unref(Receipt), { class: "w-4 h-4" }, null, _parent));
          _push(` Record Payment </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `<button${ssrIncludeBooleanAttr(unref(isGeneratingPDF)) ? " disabled" : ""} class="inline-flex items-center px-4 py-2 bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg shadow-md hover:shadow-blue-200/50 text-[11px] font-black uppercase tracking-wider gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">`,
        );
        if (unref(isGeneratingPDF)) {
          _push(
            ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent),
          );
        } else {
          _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
        }
        _push(
          ` ${ssrInterpolate(unref(isGeneratingPDF) ? "Generating" : "Download PDF")}</button><div class="relative ml-1"><button class="p-2.5 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white shadow-sm flex items-center justify-center">`,
        );
        _push(ssrRenderComponent(unref(MoreHorizontal), { class: "w-4 h-4" }, null, _parent));
        _push(`</button>`);
        if (unref(showMoreActions)) {
          _push(`<div class="fixed inset-0 z-40"></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showMoreActions)) {
          _push(
            `<div class="absolute right-0 mt-3 w-52 bg-white border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 origin-top-right py-1.5 flex flex-col"><div class="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between gap-2"><p class="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0"> Manage Invoice </p><span class="text-[8px] font-mono text-muted-foreground opacity-50 truncate">#${ssrInterpolate(unref(activeInvoice).status?.code || "None")}</span></div><button class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none">`,
          );
          _push(
            ssrRenderComponent(unref(Pencil), { class: "w-4 h-4 text-primary" }, null, _parent),
          );
          _push(` Edit Invoice Settings </button>`);
          if (unref(activeInvoice).status?.code !== "VOIDED") {
            _push(
              `<button class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none">`,
            );
            _push(ssrRenderComponent(unref(Ban), { class: "w-4 h-4" }, null, _parent));
            _push(` Void Commercial Invoice </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
        if (
          unref(activeInvoice).paymentAllocations &&
          unref(activeInvoice).paymentAllocations.length > 0
        ) {
          _push(
            `<div class="bg-gray-50/50 border border-border rounded-xl p-4"><h4 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3"> Payment History </h4><div class="space-y-2"><!--[-->`,
          );
          ssrRenderList(unref(activeInvoice).paymentAllocations, (alloc) => {
            _push(
              `<div class="flex items-center justify-between p-2 bg-white rounded-lg border border-border/50 shadow-sm"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">`,
            );
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4" }, null, _parent));
            _push(`</div>`);
            if (alloc.payment) {
              _push(
                `<div><p class="text-sm font-bold text-foreground">${ssrInterpolate(formatCurrency(alloc.amount))}</p><p class="text-[10px] text-muted-foreground uppercase tracking-wider">${ssrInterpolate(alloc.payment.paymentMethod?.name || "Bank Transfer")} • ${ssrInterpolate(formatDate(alloc.payment.paymentDate))}</p></div>`,
              );
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (alloc.payment?.reference) {
              _push(
                `<div class="text-right"><p class="text-[10px] text-muted-foreground uppercase font-bold">Ref/Check</p><p class="text-xs text-foreground">${ssrInterpolate(alloc.payment.reference)}</p></div>`,
              );
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        } else if (unref(activeInvoice).status?.code === "VOIDED") {
          _push(
            `<div class="bg-gray-50/50 border border-border border-dashed rounded-xl p-8 text-center mt-4">`,
          );
          _push(
            ssrRenderComponent(
              unref(Receipt),
              { class: "w-8 h-8 text-muted-foreground/30 mx-auto mb-3" },
              null,
              _parent,
            ),
          );
          _push(
            `<p class="text-xs font-bold text-muted-foreground uppercase tracking-widest"> Payment History Cleared </p><p class="text-[10px] text-muted-foreground mt-1 max-w-[200px] mx-auto leading-relaxed"> Applied payments were released back to their original records when this invoice was voided. </p></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          ssrRenderComponent(
            JobInvoicePreview,
            {
              ref_key: "previewRef",
              ref: previewRef,
              invoice: unref(activeInvoice),
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else {
        _push(
          `<div class="space-y-6"><div class="flex items-center justify-between"><h3 class="text-base font-bold text-foreground">Job Invoices</h3><button class="inline-flex items-center px-3 py-1.5 bg-[#062c58] text-white text-xs font-semibold rounded-md hover:bg-[#062c58]/90 transition-colors gap-1.5 shadow-sm">`,
        );
        _push(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(` Create Invoice </button></div>`);
        if (unref(isLoading) && unref(invoices).length === 0) {
          _push(`<div class="py-12 flex flex-col items-center justify-center space-y-3">`);
          _push(
            ssrRenderComponent(
              unref(Loader2),
              { class: "w-8 h-8 animate-spin text-primary opacity-60" },
              null,
              _parent,
            ),
          );
          _push(`<p class="text-sm text-muted-foreground">Loading invoices...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-6 text-center bg-red-50 rounded-xl border border-red-100">`);
          _push(
            ssrRenderComponent(
              unref(AlertCircle),
              { class: "w-8 h-8 text-red-400 mx-auto mb-3" },
              null,
              _parent,
            ),
          );
          _push(
            `<p class="text-sm font-medium text-red-800">${ssrInterpolate(unref(error))}</p><button class="mt-4 text-xs font-bold text-red-700 hover:underline"> Try Again </button></div>`,
          );
        } else if (unref(invoices).length === 0) {
          _push(
            `<div class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"><div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border">`,
          );
          _push(
            ssrRenderComponent(
              unref(Receipt),
              { class: "w-6 h-6 text-muted-foreground opacity-40" },
              null,
              _parent,
            ),
          );
          _push(
            `</div><p class="text-sm font-semibold text-foreground mb-1">No Invoices Found</p><p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed"> There are no invoices linked to this job yet. Click &quot;Create Invoice&quot; to start a new billing. </p></div>`,
          );
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(invoices), (invoice) => {
            _push(
              `<div class="group p-4 rounded-xl border border-border bg-white hover:border-[#062c58]/30 hover:shadow-md transition-all cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="space-y-1"><div class="flex items-center gap-2"><span class="font-bold text-sm text-foreground group-hover:text-[#062c58] flex items-center gap-1.5 transition-colors">${ssrInterpolate(invoice.invoiceNumber)} `,
            );
            _push(
              ssrRenderComponent(
                unref(ExternalLink),
                { class: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" },
                null,
                _parent,
              ),
            );
            _push(
              `</span></div><p class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"> Issued on ${ssrInterpolate(formatDate(invoice.createdAt))}</p></div><span class="${ssrRenderClass(
                [
                  "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide",
                  getStatusClass(invoice.status?.code || ""),
                ],
              )}">${ssrInterpolate(invoice.status?.name || invoice.status?.code)}</span></div><div class="grid grid-cols-2 gap-4 border-t border-border pt-4"><div><p class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"> Total Amount </p><p class="font-bold text-sm text-foreground">${ssrInterpolate(formatCurrency(invoice.total))}</p></div><div class="text-right"><p class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"> Balance Due </p>`,
            );
            if (invoice.status?.code === "VOIDED") {
              _push(`<p class="font-bold text-sm text-gray-400 line-through"> Voided </p>`);
            } else if (Number(invoice.balanceDue) > 0) {
              _push(
                `<p class="font-bold text-sm text-red-600">${ssrInterpolate(formatCurrency(invoice.balanceDue))}</p>`,
              );
            } else {
              _push(`<p class="font-bold text-sm text-green-600">Paid In Full</p>`);
            }
            _push(`</div></div></div>`);
          });
          _push(
            `<!--]--><div class="mt-12 pt-12 border-t border-border/50"><h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6"> Consolidated Payment History </h3>`,
          );
          _push(
            ssrRenderComponent(
              JobPaymentTab,
              {
                "job-id": __props.jobId,
                onReload: handlePaymentVoided,
              },
              null,
              _parent,
            ),
          );
          _push(`</div></div>`);
        }
        _push(`</div>`);
      }
      _push(
        ssrRenderComponent(
          __nuxt_component_0$1,
          {
            modelValue: unref(showPaymentForm),
            "onUpdate:modelValue": ($event) =>
              isRef(showPaymentForm) ? (showPaymentForm.value = $event) : null,
            title: "Record Payment",
            description: "Allocate customer payment to invoices.",
            width: "lg",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (unref(activeInvoice)) {
                  _push2(
                    ssrRenderComponent(
                      PaymentEntryForm,
                      {
                        "company-id": unref(activeInvoice).company.id,
                        "invoice-id": unref(activeInvoice).id,
                        onSuccess: handlePaymentSuccess,
                        onCancel: ($event) => (showPaymentForm.value = false),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  unref(activeInvoice)
                    ? (openBlock(),
                      createBlock(
                        PaymentEntryForm,
                        {
                          key: 0,
                          "company-id": unref(activeInvoice).company.id,
                          "invoice-id": unref(activeInvoice).id,
                          onSuccess: handlePaymentSuccess,
                          onCancel: ($event) => (showPaymentForm.value = false),
                        },
                        null,
                        8,
                        ["company-id", "invoice-id", "onCancel"],
                      ))
                    : createCommentVNode("", true),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          __nuxt_component_0$1,
          {
            modelValue: unref(showVoidConfirm),
            "onUpdate:modelValue": ($event) =>
              isRef(showVoidConfirm) ? (showVoidConfirm.value = $event) : null,
            title: "Void Invoice",
            description:
              "Are you sure you want to void this invoice? This will create a reversal journal entry and cannot be undone.",
            width: "max-w-sm",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-4 pt-2"${_scopeId}><div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(AlertCircle),
                    { class: "w-5 h-5 text-red-600 shrink-0 mt-0.5" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `<p class="text-xs text-red-800 leading-relaxed font-medium"${_scopeId}> Voiding an invoice will record it as inactive for audit purposes and zero out the balance due. </p></div><div class="flex justify-end gap-3 pt-2"${_scopeId}><button class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors"${_scopeId}> Cancel </button><button${ssrIncludeBooleanAttr(unref(isVoiding)) ? " disabled" : ""} class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2"${_scopeId}>`,
                );
                if (unref(isVoiding)) {
                  _push2(
                    ssrRenderComponent(
                      unref(Loader2),
                      { class: "w-3.5 h-3.5 animate-spin" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  ` ${ssrInterpolate(unref(isVoiding) ? "Voiding..." : "Confirm Void")}</button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-4 pt-2" }, [
                    createVNode(
                      "div",
                      {
                        class:
                          "p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3",
                      },
                      [
                        createVNode(unref(AlertCircle), {
                          class: "w-5 h-5 text-red-600 shrink-0 mt-0.5",
                        }),
                        createVNode(
                          "p",
                          { class: "text-xs text-red-800 leading-relaxed font-medium" },
                          " Voiding an invoice will record it as inactive for audit purposes and zero out the balance due. ",
                        ),
                      ],
                    ),
                    createVNode("div", { class: "flex justify-end gap-3 pt-2" }, [
                      createVNode(
                        "button",
                        {
                          onClick: ($event) => (showVoidConfirm.value = false),
                          class:
                            "px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors",
                        },
                        " Cancel ",
                        8,
                        ["onClick"],
                      ),
                      createVNode(
                        "button",
                        {
                          onClick: handleVoid,
                          disabled: unref(isVoiding),
                          class:
                            "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2",
                        },
                        [
                          unref(isVoiding)
                            ? (openBlock(),
                              createBlock(unref(Loader2), {
                                key: 0,
                                class: "w-3.5 h-3.5 animate-spin",
                              }))
                            : createCommentVNode("", true),
                          createTextVNode(
                            " " + toDisplayString(unref(isVoiding) ? "Voiding..." : "Confirm Void"),
                            1,
                          ),
                        ],
                        8,
                        ["disabled"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobInvoiceTab.vue",
  );
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const JobInvoiceTab = Object.assign(_sfc_main$6, { __name: "OperationalJobInvoiceTab" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "JobEblList",
  __ssrInlineRender: true,
  props: {
    job: {},
    approvingId: {},
    rejectingId: {},
  },
  emits: ["select", "approve", "reject", "request-finalize"],
  setup(__props, { emit: __emit }) {
    const { canApproveJobs } = useAuth();
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const d = new Date(dateStr);
        const parts = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).formatToParts(d);
        return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
      } catch {
        return dateStr;
      }
    };
    const getStatusCode = (status) => {
      if (!status) return "";
      const code =
        typeof status === "string" ? status.toLowerCase() : status.code?.toLowerCase() || "";
      if (code === "confirmed" || code === "finalized") return "finalized";
      if (code === "pending_approval") return "pending_approval";
      return code;
    };
    const getStatusName = (status) => {
      if (!status) return "DRAFT";
      const name = typeof status === "string" ? status : status.name || status.code || "DRAFT";
      const upper = name.toUpperCase();
      if (upper === "CONFIRMED") return "FINALIZED";
      if (upper === "PENDING_APPROVAL") return "PENDING APPROVAL";
      return upper;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div><h3 class="text-base font-bold text-foreground">Bill of Lading</h3></div></div>`,
      );
      if (!__props.job.billsOfLading || __props.job.billsOfLading.length === 0) {
        _push(
          `<div class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"><div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border">`,
        );
        _push(
          ssrRenderComponent(
            unref(FileText),
            { class: "w-6 h-6 text-muted-foreground opacity-40" },
            null,
            _parent,
          ),
        );
        _push(
          `</div><p class="text-sm font-semibold text-foreground mb-1">No Bills of Lading available</p><p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed"> There are no bills of lading linked to this job yet. </p></div>`,
        );
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(__props.job.billsOfLading, (bl) => {
          _push(
            `<div class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="space-y-1"><div class="flex items-center gap-2"><span class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors flex items-center gap-1.5">${ssrInterpolate(bl.blNumber || "Draft BL")} `,
          );
          _push(
            ssrRenderComponent(
              unref(ArrowLeft),
              { class: "w-3 h-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" },
              null,
              _parent,
            ),
          );
          _push(
            `</span></div><p class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium"> Created on ${ssrInterpolate(formatDate(bl.createdAt))}</p></div><div class="flex items-center gap-2"><span class="${ssrRenderClass(
              [
                {
                  "bg-emerald-50 text-emerald-700 border-emerald-200":
                    getStatusCode(bl.status) === "finalized",
                  "bg-amber-50 text-amber-700 border-amber-200":
                    getStatusCode(bl.status) === "draft" && !bl.rejectReason,
                  "bg-red-50 text-red-700 border-red-200":
                    getStatusCode(bl.status) === "draft" && !!bl.rejectReason,
                  "bg-blue-50 text-blue-700 border-blue-200":
                    getStatusCode(bl.status) === "pending_approval",
                },
                "px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest leading-none",
              ],
            )}">${ssrInterpolate(getStatusCode(bl.status) === "draft" && bl.rejectReason ? "REVISION REQUIRED" : getStatusName(bl.status))}</span>`,
          );
          if (unref(canApproveJobs) && getStatusCode(bl.status) === "pending_approval") {
            _push(
              `<button${ssrIncludeBooleanAttr(__props.rejectingId === bl.id || __props.approvingId === bl.id) ? " disabled" : ""} class="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold rounded hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50">`,
            );
            if (__props.rejectingId === bl.id) {
              _push(
                ssrRenderComponent(
                  unref(Loader2),
                  { class: "w-3 h-3 animate-spin" },
                  null,
                  _parent,
                ),
              );
            } else {
              _push(`<!---->`);
            }
            _push(
              ` ${ssrInterpolate(__props.rejectingId === bl.id ? "REJECTING..." : "REJECT")}</button>`,
            );
          } else {
            _push(`<!---->`);
          }
          if (unref(canApproveJobs) && getStatusCode(bl.status) === "pending_approval") {
            _push(
              `<button${ssrIncludeBooleanAttr(__props.approvingId === bl.id || __props.rejectingId === bl.id) ? " disabled" : ""} class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition-colors flex items-center gap-1 disabled:opacity-50">`,
            );
            if (__props.approvingId === bl.id) {
              _push(
                ssrRenderComponent(
                  unref(Loader2),
                  { class: "w-3 h-3 animate-spin" },
                  null,
                  _parent,
                ),
              );
            } else {
              _push(`<!---->`);
            }
            _push(
              ` ${ssrInterpolate(__props.approvingId === bl.id ? "APPROVING..." : "APPROVE")}</button>`,
            );
          } else {
            _push(`<!---->`);
          }
          if (getStatusCode(bl.status) === "draft") {
            _push(
              `<button class="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded hover:bg-blue-700 transition-colors flex items-center gap-1"> REQUEST FINALIZE </button>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div><div class="border-t border-border pt-4"><p class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"> Cargo Description </p><p class="text-sm text-foreground line-clamp-2">${ssrInterpolate(bl.cargoDescription || "-")}</p></div></div>`,
          );
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/ebl/JobEblList.vue",
  );
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const JobEblList = Object.assign(_sfc_main$5, { __name: "OperationalEblJobEblList" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "JobEblEditForm",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(
    {
      jobData: {},
    },
    {
      modelValue: { required: true },
      modelModifiers: {},
    },
  ),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const editForm = useModel(__props, "modelValue");
    const { fetchVessels, fetchPorts, createVessel } = useMasterData();
    const { confirm } = useConfirm();
    const companies = ref([]);
    const containerTypes = ref([]);
    const packageTypes = ref([]);
    const vessels = ref([]);
    const portsPol = ref([]);
    const portsPod = ref([]);
    const newShipperRef = ref("");
    const addShipperRef = () => {
      if (newShipperRef.value.trim()) {
        if (!editForm.value.shipperReferences) editForm.value.shipperReferences = [];
        editForm.value.shipperReferences.push(newShipperRef.value.trim());
        newShipperRef.value = "";
      }
    };
    const removeShipperRef = (index) => {
      editForm.value.shipperReferences.splice(index, 1);
    };
    watch(
      () => editForm.value.isNotifySameAsConsignee,
      (val) => {
        if (val) {
          editForm.value.notifyPartyId = editForm.value.consigneeId;
          editForm.value.notifyPartyAddressId = editForm.value.consigneeAddressId;
        } else {
          editForm.value.notifyPartyId = "";
          editForm.value.notifyPartyAddressId = "";
        }
      },
    );
    watch(
      () => editForm.value.consigneeId,
      (val) => {
        if (editForm.value.isNotifySameAsConsignee) {
          editForm.value.notifyPartyId = val;
        }
      },
    );
    watch(
      () => editForm.value.consigneeAddressId,
      (val) => {
        if (editForm.value.isNotifySameAsConsignee) {
          editForm.value.notifyPartyAddressId = val;
        }
      },
    );
    const assignDefaultAddress = (companyId, addressKey) => {
      if (!companyId) {
        editForm.value[addressKey] = "";
        return;
      }
      const company = companies.value.find((c) => c.id === companyId);
      if (company && company.addresses && company.addresses.length > 0) {
        const defaultAddr = company.addresses.find((a) => a.isDefault);
        editForm.value[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0].id;
      } else {
        editForm.value[addressKey] = "";
      }
    };
    watch(
      () => editForm.value.shipperId,
      (val) => assignDefaultAddress(val || "", "shipperAddressId"),
    );
    watch(
      () => editForm.value.consigneeId,
      (val) => assignDefaultAddress(val || "", "consigneeAddressId"),
    );
    watch(
      () => editForm.value.notifyPartyId,
      (val) => {
        if (!editForm.value.isNotifySameAsConsignee) {
          assignDefaultAddress(val || "", "notifyPartyAddressId");
        }
      },
    );
    watch(
      () => editForm.value.forwarderId,
      (val) => assignDefaultAddress(val || "", "forwarderAddressId"),
    );
    watch(
      () => [editForm.value.freightPayment, editForm.value.pol, editForm.value.pod],
      () => {
        const f = editForm.value;
        const polCity =
          portsPol.value.find((p) => p.code === f.pol)?.name ||
          props.jobData?.polName ||
          f.pol ||
          "";
        const podCity =
          portsPod.value.find((p) => p.code === f.pod)?.name ||
          props.jobData?.podName ||
          f.pod ||
          "";
        f.prepaidValue = "";
        f.collectValue = "";
        if (f.freightPayment === "PREPAID_POL") {
          f.prepaidValue = `Prepaid at ${polCity}`;
        } else if (f.freightPayment === "PREPAID_POD") {
          f.prepaidValue = `Prepaid at ${podCity}`;
        } else if (f.freightPayment === "COLLECT_POL") {
          f.collectValue = `Collect at ${polCity}`;
        } else if (f.freightPayment === "COLLECT_POD") {
          f.collectValue = `Collect at ${podCity}`;
        }
      },
      { deep: true },
    );
    const handleSearchPol = async (q) => {
      portsPol.value = await fetchPorts(q);
    };
    const handleSearchPod = async (q) => {
      portsPod.value = await fetchPorts(q);
    };
    const handleCreateVessel = async (name, vessel) => {
      const isConfirmed = await confirm({
        title: "Create New Vessel",
        message: `Are you sure you want to create a new vessel named "${name}"?`,
        confirmText: "Create Vessel",
        type: "info",
      });
      if (!isConfirmed) return;
      const result = await createVessel(name);
      if (result.success && result.data) {
        vessels.value = await fetchVessels();
        if (vessel) {
          vessel.vesselId = result.data.id;
        } else {
          if (!editForm.value.vessels) editForm.value.vessels = [];
          if (editForm.value.vessels && editForm.value.vessels.length > 0) {
            const firstVessel = editForm.value.vessels[0];
            if (firstVessel) {
              firstVessel.vesselId = result.data.id;
            }
          } else {
            editForm.value.vessels.push({
              vesselId: result.data.id,
              vesselName: name,
              voyageNumber: "",
              etd: "",
              sequence: 0,
            });
          }
        }
        toast.success(`Vessel "${name}" created successfully.`);
      } else {
        toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
      }
    };
    const CARGO_MOVEMENTS = [
      { id: "FCL_FCL", name: "FCL/FCL" },
      { id: "LCL_LCL", name: "LCL/LCL" },
      { id: "FCL_LCL", name: "FCL/LCL" },
      { id: "LCL_FCL", name: "LCL/FCL" },
    ];
    const DELIVERY_MOVEMENTS = [
      { id: "CY_CY", name: "CY-CY" },
      { id: "CY_DOOR", name: "CY-DOOR" },
      { id: "DOOR_CY", name: "DOOR-CY" },
      { id: "DOOR_DOOR", name: "DOOR-DOOR" },
    ];
    const FREIGHT_PAYMENT_OPTIONS = computed(() => {
      const f = editForm.value;
      const polCity =
        portsPol.value.find((p) => p.code === f.pol)?.name ||
        props.jobData?.polName ||
        f.pol ||
        "POLPort";
      const podCity =
        portsPod.value.find((p) => p.code === f.pod)?.name ||
        props.jobData?.podName ||
        f.pod ||
        "PODPort";
      return [
        { id: "PREPAID_POL", name: `Prepaid at POL (${polCity})` },
        { id: "PREPAID_POD", name: `Prepaid at POD (${podCity})` },
        { id: "COLLECT_POL", name: `Collect at POL (${polCity})` },
        { id: "COLLECT_POD", name: `Collect at POD (${podCity})` },
      ];
    });
    const addContainer = () => {
      if (!editForm.value.containers) editForm.value.containers = [];
      editForm.value.containers.push({
        containerNumber: "",
        sealNumber: "",
        containerTypeId: "",
        isHazardous: false,
        items: [{ sequenceNo: 1, qty: 1, packageTypeCode: "", description: "" }],
      });
    };
    const removeContainer = (idx) => editForm.value.containers.splice(idx, 1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto space-y-6" }, _attrs))}>`);
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "parties",
            title: "Involved Parties",
            icon: unref(Users),
            "no-padding": "",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-full"${_scopeId}>`);
                _push2(
                  ssrRenderComponent(
                    _sfc_main$c,
                    {
                      label: "Shipper",
                      required: "",
                      companies: companies.value,
                      companyId: editForm.value.shipperId,
                      "onUpdate:companyId": ($event) => (editForm.value.shipperId = $event),
                      addressId: editForm.value.shipperAddressId,
                      "onUpdate:addressId": ($event) => (editForm.value.shipperAddressId = $event),
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `<div class="mt-4 mb-2 p-4 bg-muted/5 rounded-xl border border-border/50"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"${_scopeId}><label class="text-xs font-bold text-muted-foreground tracking-wider uppercase"${_scopeId}>Shipper References (PO Numbers)</label><label class="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-foreground transition-colors group"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.showShipperReferencesOnBl) ? ssrLooseContain(editForm.value.showShipperReferencesOnBl, null) : editForm.value.showShipperReferencesOnBl) ? " checked" : ""} class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"${_scopeId}><span class="group-hover:underline"${_scopeId}>Show on printed BL</span></label></div><div class="space-y-3"${_scopeId}><div class="flex gap-2"${_scopeId}><input${ssrRenderAttr("value", newShipperRef.value)} type="text" placeholder="Enter PO Number..." class="input-field flex-1 max-w-sm h-9 text-sm"${_scopeId}><button type="button" class="btn-outline h-9 px-4 text-xs font-semibold gap-1.5 flex items-center shadow-sm"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(` Add Reference </button></div>`);
                if (
                  editForm.value.shipperReferences &&
                  editForm.value.shipperReferences.length > 0
                ) {
                  _push2(
                    `<div class="flex flex-wrap gap-2 mt-3 p-3 bg-white border border-border/40 rounded-lg shadow-sm"${_scopeId}><!--[-->`,
                  );
                  ssrRenderList(editForm.value.shipperReferences, (ref2, idx) => {
                    _push2(
                      `<span class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50/50 border border-blue-100 text-blue-900 text-xs font-semibold"${_scopeId}>${ssrInterpolate(ref2)} <button type="button" class="hover:text-red-500 text-blue-400 hover:bg-red-50 rounded-sm p-0.5 transition-colors"${_scopeId}>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        unref(Trash2),
                        { class: "w-3.5 h-3.5" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(`</button></span>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(
                    `<p class="text-xs text-muted-foreground italic mt-2"${_scopeId}> No shipper references added yet. </p>`,
                  );
                }
                _push2(`</div></div>`);
                _push2(
                  ssrRenderComponent(
                    _sfc_main$c,
                    {
                      label: "Consignee",
                      required: "",
                      companies: companies.value,
                      companyId: editForm.value.consigneeId,
                      "onUpdate:companyId": ($event) => (editForm.value.consigneeId = $event),
                      addressId: editForm.value.consigneeAddressId,
                      "onUpdate:addressId": ($event) =>
                        (editForm.value.consigneeAddressId = $event),
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$c,
                    {
                      label: "Notify Party",
                      companies: companies.value,
                      companyId: editForm.value.notifyPartyId,
                      "onUpdate:companyId": ($event) => (editForm.value.notifyPartyId = $event),
                      addressId: editForm.value.notifyPartyAddressId,
                      "onUpdate:addressId": ($event) =>
                        (editForm.value.notifyPartyAddressId = $event),
                      "has-extra-controls": "",
                      "disabled-company": editForm.value.isNotifySameAsConsignee,
                    },
                    {
                      "extra-controls": withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            `<label class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"${_scopeId2}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.isNotifySameAsConsignee) ? ssrLooseContain(editForm.value.isNotifySameAsConsignee, null) : editForm.value.isNotifySameAsConsignee) ? " checked" : ""} class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"${_scopeId2}><span class="group-hover:underline"${_scopeId2}>Same as Consignee</span></label>`,
                          );
                        } else {
                          return [
                            createVNode(
                              "label",
                              {
                                class:
                                  "flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5",
                              },
                              [
                                withDirectives(
                                  createVNode(
                                    "input",
                                    {
                                      type: "checkbox",
                                      "onUpdate:modelValue": ($event) =>
                                        (editForm.value.isNotifySameAsConsignee = $event),
                                      class:
                                        "rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all",
                                    },
                                    null,
                                    8,
                                    ["onUpdate:modelValue"],
                                  ),
                                  [[vModelCheckbox, editForm.value.isNotifySameAsConsignee]],
                                ),
                                createVNode(
                                  "span",
                                  { class: "group-hover:underline" },
                                  "Same as Consignee",
                                ),
                              ],
                            ),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ssrRenderComponent(
                    _sfc_main$c,
                    {
                      label: "Forwarder",
                      description: "(Optional)",
                      companies: companies.value,
                      companyId: editForm.value.forwarderId,
                      "onUpdate:companyId": ($event) => (editForm.value.forwarderId = $event),
                      addressId: editForm.value.forwarderAddressId,
                      "onUpdate:addressId": ($event) =>
                        (editForm.value.forwarderAddressId = $event),
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "w-full" }, [
                    createVNode(
                      _sfc_main$c,
                      {
                        label: "Shipper",
                        required: "",
                        companies: companies.value,
                        companyId: editForm.value.shipperId,
                        "onUpdate:companyId": ($event) => (editForm.value.shipperId = $event),
                        addressId: editForm.value.shipperAddressId,
                        "onUpdate:addressId": ($event) =>
                          (editForm.value.shipperAddressId = $event),
                      },
                      null,
                      8,
                      [
                        "companies",
                        "companyId",
                        "onUpdate:companyId",
                        "addressId",
                        "onUpdate:addressId",
                      ],
                    ),
                    createVNode(
                      "div",
                      { class: "mt-4 mb-2 p-4 bg-muted/5 rounded-xl border border-border/50" },
                      [
                        createVNode(
                          "div",
                          {
                            class:
                              "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4",
                          },
                          [
                            createVNode(
                              "label",
                              {
                                class:
                                  "text-xs font-bold text-muted-foreground tracking-wider uppercase",
                              },
                              "Shipper References (PO Numbers)",
                            ),
                            createVNode(
                              "label",
                              {
                                class:
                                  "flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-foreground transition-colors group",
                              },
                              [
                                withDirectives(
                                  createVNode(
                                    "input",
                                    {
                                      type: "checkbox",
                                      "onUpdate:modelValue": ($event) =>
                                        (editForm.value.showShipperReferencesOnBl = $event),
                                      class:
                                        "rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all",
                                    },
                                    null,
                                    8,
                                    ["onUpdate:modelValue"],
                                  ),
                                  [[vModelCheckbox, editForm.value.showShipperReferencesOnBl]],
                                ),
                                createVNode(
                                  "span",
                                  { class: "group-hover:underline" },
                                  "Show on printed BL",
                                ),
                              ],
                            ),
                          ],
                        ),
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("div", { class: "flex gap-2" }, [
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) => (newShipperRef.value = $event),
                                  onKeyup: withKeys(addShipperRef, ["enter"]),
                                  type: "text",
                                  placeholder: "Enter PO Number...",
                                  class: "input-field flex-1 max-w-sm h-9 text-sm",
                                },
                                null,
                                40,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, newShipperRef.value]],
                            ),
                            createVNode(
                              "button",
                              {
                                type: "button",
                                onClick: addShipperRef,
                                class:
                                  "btn-outline h-9 px-4 text-xs font-semibold gap-1.5 flex items-center shadow-sm",
                              },
                              [
                                createVNode(unref(Plus), { class: "w-4 h-4" }),
                                createTextVNode(" Add Reference "),
                              ],
                            ),
                          ]),
                          editForm.value.shipperReferences &&
                          editForm.value.shipperReferences.length > 0
                            ? (openBlock(),
                              createBlock(
                                "div",
                                {
                                  key: 0,
                                  class:
                                    "flex flex-wrap gap-2 mt-3 p-3 bg-white border border-border/40 rounded-lg shadow-sm",
                                },
                                [
                                  (openBlock(true),
                                  createBlock(
                                    Fragment,
                                    null,
                                    renderList(editForm.value.shipperReferences, (ref2, idx) => {
                                      return (
                                        openBlock(),
                                        createBlock(
                                          "span",
                                          {
                                            key: idx,
                                            class:
                                              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50/50 border border-blue-100 text-blue-900 text-xs font-semibold",
                                          },
                                          [
                                            createTextVNode(toDisplayString(ref2) + " ", 1),
                                            createVNode(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: ($event) => removeShipperRef(idx),
                                                class:
                                                  "hover:text-red-500 text-blue-400 hover:bg-red-50 rounded-sm p-0.5 transition-colors",
                                              },
                                              [
                                                createVNode(unref(Trash2), {
                                                  class: "w-3.5 h-3.5",
                                                }),
                                              ],
                                              8,
                                              ["onClick"],
                                            ),
                                          ],
                                        )
                                      );
                                    }),
                                    128,
                                  )),
                                ],
                              ))
                            : (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 1,
                                  class: "text-xs text-muted-foreground italic mt-2",
                                },
                                " No shipper references added yet. ",
                              )),
                        ]),
                      ],
                    ),
                    createVNode(
                      _sfc_main$c,
                      {
                        label: "Consignee",
                        required: "",
                        companies: companies.value,
                        companyId: editForm.value.consigneeId,
                        "onUpdate:companyId": ($event) => (editForm.value.consigneeId = $event),
                        addressId: editForm.value.consigneeAddressId,
                        "onUpdate:addressId": ($event) =>
                          (editForm.value.consigneeAddressId = $event),
                      },
                      null,
                      8,
                      [
                        "companies",
                        "companyId",
                        "onUpdate:companyId",
                        "addressId",
                        "onUpdate:addressId",
                      ],
                    ),
                    createVNode(
                      _sfc_main$c,
                      {
                        label: "Notify Party",
                        companies: companies.value,
                        companyId: editForm.value.notifyPartyId,
                        "onUpdate:companyId": ($event) => (editForm.value.notifyPartyId = $event),
                        addressId: editForm.value.notifyPartyAddressId,
                        "onUpdate:addressId": ($event) =>
                          (editForm.value.notifyPartyAddressId = $event),
                        "has-extra-controls": "",
                        "disabled-company": editForm.value.isNotifySameAsConsignee,
                      },
                      {
                        "extra-controls": withCtx(() => [
                          createVNode(
                            "label",
                            {
                              class:
                                "flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5",
                            },
                            [
                              withDirectives(
                                createVNode(
                                  "input",
                                  {
                                    type: "checkbox",
                                    "onUpdate:modelValue": ($event) =>
                                      (editForm.value.isNotifySameAsConsignee = $event),
                                    class:
                                      "rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all",
                                  },
                                  null,
                                  8,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelCheckbox, editForm.value.isNotifySameAsConsignee]],
                              ),
                              createVNode(
                                "span",
                                { class: "group-hover:underline" },
                                "Same as Consignee",
                              ),
                            ],
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      [
                        "companies",
                        "companyId",
                        "onUpdate:companyId",
                        "addressId",
                        "onUpdate:addressId",
                        "disabled-company",
                      ],
                    ),
                    createVNode(
                      _sfc_main$c,
                      {
                        label: "Forwarder",
                        description: "(Optional)",
                        companies: companies.value,
                        companyId: editForm.value.forwarderId,
                        "onUpdate:companyId": ($event) => (editForm.value.forwarderId = $event),
                        addressId: editForm.value.forwarderAddressId,
                        "onUpdate:addressId": ($event) =>
                          (editForm.value.forwarderAddressId = $event),
                      },
                      null,
                      8,
                      [
                        "companies",
                        "companyId",
                        "onUpdate:companyId",
                        "addressId",
                        "onUpdate:addressId",
                      ],
                    ),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "route",
            title: "Route Details",
            icon: unref(MapPin),
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative items-end border-b border-border/50 pb-6 mb-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PRE-CARRIAGE BY</label><input${ssrRenderAttr("value", editForm.value.preCarriageBy)} type="text" placeholder="e.g. TRUCK" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PLACE OF RECEIPT</label><input${ssrRenderAttr("value", editForm.value.placeOfReceipt)} type="text" placeholder="Defaults to POL if empty" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PORT OF LOADING (POL)</label><div class="relative"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(MapPin),
                    {
                      class:
                        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: editForm.value.pol,
                      "onUpdate:modelValue": ($event) => (editForm.value.pol = $event),
                      options: portsPol.value,
                      "label-key": "name",
                      "value-key": "code",
                      placeholder: "Search port...",
                      class: "[&_button]:pl-9",
                      "filter-local": false,
                      onSearch: handleSearchPol,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="hidden md:flex absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(MapPin),
                    { class: "w-5 h-5 opacity-0" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PORT OF DISCHARGE (POD)</label><div class="relative"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(MapPin),
                    {
                      class:
                        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: editForm.value.pod,
                      "onUpdate:modelValue": ($event) => (editForm.value.pod = $event),
                      options: portsPod.value,
                      "label-key": "name",
                      "value-key": "code",
                      placeholder: "Search port...",
                      class: "[&_button]:pl-9",
                      "filter-local": false,
                      onSearch: handleSearchPod,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PLACE OF DELIVERY</label><input${ssrRenderAttr("value", editForm.value.placeOfDelivery)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>FINAL DESTINATION</label><input${ssrRenderAttr("value", editForm.value.finalDestination)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div></div>`,
                );
              } else {
                return [
                  createVNode(
                    "div",
                    {
                      class:
                        "grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative items-end border-b border-border/50 pb-6 mb-6",
                    },
                    [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "PRE-CARRIAGE BY",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.preCarriageBy = $event),
                              type: "text",
                              placeholder: "e.g. TRUCK",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, editForm.value.preCarriageBy]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "PLACE OF RECEIPT",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.placeOfReceipt = $event),
                              type: "text",
                              placeholder: "Defaults to POL if empty",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, editForm.value.placeOfReceipt]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "PORT OF LOADING (POL)",
                        ),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(MapPin), {
                            class:
                              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none",
                          }),
                          createVNode(
                            Combobox,
                            {
                              modelValue: editForm.value.pol,
                              "onUpdate:modelValue": ($event) => (editForm.value.pol = $event),
                              options: portsPol.value,
                              "label-key": "name",
                              "value-key": "code",
                              placeholder: "Search port...",
                              class: "[&_button]:pl-9",
                              "filter-local": false,
                              onSearch: handleSearchPol,
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue", "options"],
                          ),
                        ]),
                      ]),
                      createVNode(
                        "div",
                        {
                          class:
                            "hidden md:flex absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40",
                        },
                        [createVNode(unref(MapPin), { class: "w-5 h-5 opacity-0" })],
                      ),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "PORT OF DISCHARGE (POD)",
                        ),
                        createVNode("div", { class: "relative" }, [
                          createVNode(unref(MapPin), {
                            class:
                              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10 pointer-events-none",
                          }),
                          createVNode(
                            Combobox,
                            {
                              modelValue: editForm.value.pod,
                              "onUpdate:modelValue": ($event) => (editForm.value.pod = $event),
                              options: portsPod.value,
                              "label-key": "name",
                              "value-key": "code",
                              placeholder: "Search port...",
                              class: "[&_button]:pl-9",
                              "filter-local": false,
                              onSearch: handleSearchPod,
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue", "options"],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "PLACE OF DELIVERY",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.placeOfDelivery = $event),
                              type: "text",
                              placeholder: "Defaults to POD if empty",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, editForm.value.placeOfDelivery]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "FINAL DESTINATION",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.finalDestination = $event),
                              type: "text",
                              placeholder: "Defaults to POD if empty",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, editForm.value.finalDestination]],
                        ),
                      ]),
                    ],
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "cargo",
            title: "Cargo Information",
            icon: unref(Box),
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>HS CODE / COMMODITY</label><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"${_scopeId}><div class="md:col-span-1"${_scopeId}><input${ssrRenderAttr("value", editForm.value.hsCode)} type="text" placeholder="e.g. 19023040" class="input-field" required${_scopeId}></div><div class="md:col-span-3"${_scopeId}><textarea rows="6" placeholder="e.g. 3317 CARTONS OF INSTANT NOODLES" class="input-field min-h-[120px] py-3 resize-y transition-all duration-200" required${_scopeId}>${ssrInterpolate(editForm.value.commodity)}</textarea></div></div></div><div class="space-y-2 md:col-span-4"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>MAIN DESCRIPTION (OVERALL COMMODITY)</label><textarea rows="10" placeholder="Description of goods to appear on BL..." class="input-field min-h-[250px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(editForm.value.mainDescription)}</textarea></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SHIPPING MARKS</label><textarea rows="6" placeholder="Enter marks and numbers..." class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(editForm.value.shippingMark)}</textarea></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        "HS CODE / COMMODITY",
                      ),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" }, [
                        createVNode("div", { class: "md:col-span-1" }, [
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) => (editForm.value.hsCode = $event),
                                type: "text",
                                placeholder: "e.g. 19023040",
                                class: "input-field",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, editForm.value.hsCode]],
                          ),
                        ]),
                        createVNode("div", { class: "md:col-span-3" }, [
                          withDirectives(
                            createVNode(
                              "textarea",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (editForm.value.commodity = $event),
                                rows: "6",
                                placeholder: "e.g. 3317 CARTONS OF INSTANT NOODLES",
                                class:
                                  "input-field min-h-[120px] py-3 resize-y transition-all duration-200",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, editForm.value.commodity]],
                          ),
                        ]),
                      ]),
                    ]),
                    createVNode("div", { class: "space-y-2 md:col-span-4" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        "MAIN DESCRIPTION (OVERALL COMMODITY)",
                      ),
                      withDirectives(
                        createVNode(
                          "textarea",
                          {
                            "onUpdate:modelValue": ($event) =>
                              (editForm.value.mainDescription = $event),
                            rows: "10",
                            placeholder: "Description of goods to appear on BL...",
                            class:
                              "input-field min-h-[250px] py-3 resize-y transition-all duration-200",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, editForm.value.mainDescription]],
                      ),
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        "SHIPPING MARKS",
                      ),
                      withDirectives(
                        createVNode(
                          "textarea",
                          {
                            "onUpdate:modelValue": ($event) =>
                              (editForm.value.shippingMark = $event),
                            rows: "6",
                            placeholder: "Enter marks and numbers...",
                            class:
                              "input-field min-h-[120px] py-3 resize-y transition-all duration-200",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, editForm.value.shippingMark]],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "movement",
            title: "Movement & Schedule",
            icon: unref(Clock),
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-8"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/50"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>CARGO MOVEMENT</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: editForm.value.cargoMovementId,
                      "onUpdate:modelValue": ($event) => (editForm.value.cargoMovementId = $event),
                      options: CARGO_MOVEMENTS,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>DELIVERY MOVEMENT</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: editForm.value.deliveryMovementId,
                      "onUpdate:modelValue": ($event) =>
                        (editForm.value.deliveryMovementId = $event),
                      options: DELIVERY_MOVEMENTS,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h4 class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"${_scopeId}><div class="w-1.5 h-4 bg-primary rounded-full"${_scopeId}></div> Vessel Schedule </h4><button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Plus),
                    { class: "w-3.5 h-3.5" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(` Add Vessel </button></div><div class="space-y-4"${_scopeId}><!--[-->`);
                ssrRenderList(editForm.value.vessels, (vessel, vIndex) => {
                  _push2(
                    `<div class="p-5 bg-muted/5 border border-border/50 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-sm"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end"${_scopeId}><div class="md:col-span-5 space-y-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"${_scopeId}>${ssrInterpolate(vIndex === 0 ? "Feeder / First Vessel" : "Vessel " + (vIndex + 1))}</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: vessel.vesselId,
                        "onUpdate:modelValue": ($event) => (vessel.vesselId = $event),
                        options: vessels.value,
                        "label-key": "name",
                        "value-key": "id",
                        placeholder: "Search Vessel...",
                        "allow-create": "",
                        onCreate: (name) => handleCreateVessel(name, vessel),
                        class: "h-10",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="md:col-span-3 space-y-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"${_scopeId}>Voyage No</label><input${ssrRenderAttr("value", vessel.voyageNumber)} type="text" class="input-field h-10" placeholder="Voyage..."${_scopeId}></div><div class="md:col-span-3 space-y-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"${_scopeId}>ETD</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      DatePicker,
                      {
                        modelValue: vessel.etd,
                        "onUpdate:modelValue": ($event) => (vessel.etd = $event),
                        placeholder: "Select ETD...",
                        class: "h-10",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</div>`);
                  if (editForm.value.vessels.length > 1) {
                    _push2(
                      `<div class="md:col-span-1 flex justify-end pb-1"${_scopeId}><button type="button" class="w-10 h-10 rounded-xl bg-white border border-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm"${_scopeId}>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        unref(Trash2),
                        { class: "w-4 h-4" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(`</button></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                });
                _push2(
                  `<!--]--></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Final ETA</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    DatePicker,
                    {
                      modelValue: editForm.value.eta,
                      "onUpdate:modelValue": ($event) => (editForm.value.eta = $event),
                      placeholder: "Select Final ETA...",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2 md:col-span-1"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Date Cargo Received</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    DatePicker,
                    {
                      modelValue: editForm.value.dateCargoReceived,
                      "onUpdate:modelValue": ($event) =>
                        (editForm.value.dateCargoReceived = $event),
                      placeholder: "Select Date...",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(`</div></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-8" }, [
                    createVNode(
                      "div",
                      {
                        class:
                          "grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/50",
                      },
                      [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            "CARGO MOVEMENT",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: editForm.value.cargoMovementId,
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.cargoMovementId = $event),
                              options: CARGO_MOVEMENTS,
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            "DELIVERY MOVEMENT",
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: editForm.value.deliveryMovementId,
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.deliveryMovementId = $event),
                              options: DELIVERY_MOVEMENTS,
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                      ],
                    ),
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode(
                          "h4",
                          {
                            class:
                              "text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2",
                          },
                          [
                            createVNode("div", { class: "w-1.5 h-4 bg-primary rounded-full" }),
                            createTextVNode(" Vessel Schedule "),
                          ],
                        ),
                        createVNode(
                          "button",
                          {
                            type: "button",
                            onClick: ($event) => {
                              !editForm.value.vessels ? (editForm.value.vessels = []) : null;
                              editForm.value.vessels.push({
                                vesselId: "",
                                vesselName: "",
                                voyageNumber: "",
                                etd: "",
                                sequence: editForm.value.vessels.length,
                              });
                            },
                            class:
                              "text-xs text-blue-600 hover:text-blue-700 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors",
                          },
                          [
                            createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                            createTextVNode(" Add Vessel "),
                          ],
                          8,
                          ["onClick"],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-4" }, [
                        (openBlock(true),
                        createBlock(
                          Fragment,
                          null,
                          renderList(editForm.value.vessels, (vessel, vIndex) => {
                            return (
                              openBlock(),
                              createBlock(
                                "div",
                                {
                                  key: vIndex,
                                  class:
                                    "p-5 bg-muted/5 border border-border/50 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-sm",
                                },
                                [
                                  createVNode(
                                    "div",
                                    { class: "grid grid-cols-1 md:grid-cols-12 gap-5 items-end" },
                                    [
                                      createVNode("div", { class: "md:col-span-5 space-y-2" }, [
                                        createVNode(
                                          "label",
                                          {
                                            class:
                                              "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1",
                                          },
                                          toDisplayString(
                                            vIndex === 0
                                              ? "Feeder / First Vessel"
                                              : "Vessel " + (vIndex + 1),
                                          ),
                                          1,
                                        ),
                                        createVNode(
                                          Combobox,
                                          {
                                            modelValue: vessel.vesselId,
                                            "onUpdate:modelValue": ($event) =>
                                              (vessel.vesselId = $event),
                                            options: vessels.value,
                                            "label-key": "name",
                                            "value-key": "id",
                                            placeholder: "Search Vessel...",
                                            "allow-create": "",
                                            onCreate: (name) => handleCreateVessel(name, vessel),
                                            class: "h-10",
                                          },
                                          null,
                                          8,
                                          [
                                            "modelValue",
                                            "onUpdate:modelValue",
                                            "options",
                                            "onCreate",
                                          ],
                                        ),
                                      ]),
                                      createVNode("div", { class: "md:col-span-3 space-y-2" }, [
                                        createVNode(
                                          "label",
                                          {
                                            class:
                                              "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1",
                                          },
                                          "Voyage No",
                                        ),
                                        withDirectives(
                                          createVNode(
                                            "input",
                                            {
                                              "onUpdate:modelValue": ($event) =>
                                                (vessel.voyageNumber = $event),
                                              type: "text",
                                              class: "input-field h-10",
                                              placeholder: "Voyage...",
                                            },
                                            null,
                                            8,
                                            ["onUpdate:modelValue"],
                                          ),
                                          [[vModelText, vessel.voyageNumber]],
                                        ),
                                      ]),
                                      createVNode("div", { class: "md:col-span-3 space-y-2" }, [
                                        createVNode(
                                          "label",
                                          {
                                            class:
                                              "text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1",
                                          },
                                          "ETD",
                                        ),
                                        createVNode(
                                          DatePicker,
                                          {
                                            modelValue: vessel.etd,
                                            "onUpdate:modelValue": ($event) =>
                                              (vessel.etd = $event),
                                            placeholder: "Select ETD...",
                                            class: "h-10",
                                          },
                                          null,
                                          8,
                                          ["modelValue", "onUpdate:modelValue"],
                                        ),
                                      ]),
                                      editForm.value.vessels.length > 1
                                        ? (openBlock(),
                                          createBlock(
                                            "div",
                                            {
                                              key: 0,
                                              class: "md:col-span-1 flex justify-end pb-1",
                                            },
                                            [
                                              createVNode(
                                                "button",
                                                {
                                                  type: "button",
                                                  onClick: ($event) =>
                                                    editForm.value.vessels.splice(vIndex, 1),
                                                  class:
                                                    "w-10 h-10 rounded-xl bg-white border border-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm",
                                                },
                                                [createVNode(unref(Trash2), { class: "w-4 h-4" })],
                                                8,
                                                ["onClick"],
                                              ),
                                            ],
                                          ))
                                        : createCommentVNode("", true),
                                    ],
                                  ),
                                ],
                              )
                            );
                          }),
                          128,
                        )),
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            "Final ETA",
                          ),
                          createVNode(
                            DatePicker,
                            {
                              modelValue: editForm.value.eta,
                              "onUpdate:modelValue": ($event) => (editForm.value.eta = $event),
                              placeholder: "Select Final ETA...",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-2 md:col-span-1" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            "Date Cargo Received",
                          ),
                          createVNode(
                            DatePicker,
                            {
                              modelValue: editForm.value.dateCargoReceived,
                              "onUpdate:modelValue": ($event) =>
                                (editForm.value.dateCargoReceived = $event),
                              placeholder: "Select Date...",
                            },
                            null,
                            8,
                            ["modelValue", "onUpdate:modelValue"],
                          ),
                        ]),
                      ]),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "freight",
            title: "Freight & Charges",
            icon: unref(FileText),
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Freight Payment</label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: editForm.value.freightPayment,
                      "onUpdate:modelValue": ($event) => (editForm.value.freightPayment = $event),
                      options: FREIGHT_PAYMENT_OPTIONS.value,
                      placeholder: "Select Payment...",
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Selected Summary</label><div class="p-3 bg-muted/20 rounded-lg text-sm font-mono min-h-[40px] flex items-center"${_scopeId}>`,
                );
                if (editForm.value.prepaidValue) {
                  _push2(
                    `<span class="text-blue-600 font-bold"${_scopeId}>${ssrInterpolate(editForm.value.prepaidValue)}</span>`,
                  );
                } else if (editForm.value.collectValue) {
                  _push2(
                    `<span class="text-orange-600 font-bold"${_scopeId}>${ssrInterpolate(editForm.value.collectValue)}</span>`,
                  );
                } else {
                  _push2(
                    `<span class="text-muted-foreground italic"${_scopeId}>No payment selected</span>`,
                  );
                }
                _push2(`</div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        "Freight Payment",
                      ),
                      createVNode(
                        Combobox,
                        {
                          modelValue: editForm.value.freightPayment,
                          "onUpdate:modelValue": ($event) =>
                            (editForm.value.freightPayment = $event),
                          options: FREIGHT_PAYMENT_OPTIONS.value,
                          placeholder: "Select Payment...",
                        },
                        null,
                        8,
                        ["modelValue", "onUpdate:modelValue", "options"],
                      ),
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        "Selected Summary",
                      ),
                      createVNode(
                        "div",
                        {
                          class:
                            "p-3 bg-muted/20 rounded-lg text-sm font-mono min-h-[40px] flex items-center",
                        },
                        [
                          editForm.value.prepaidValue
                            ? (openBlock(),
                              createBlock(
                                "span",
                                {
                                  key: 0,
                                  class: "text-blue-600 font-bold",
                                },
                                toDisplayString(editForm.value.prepaidValue),
                                1,
                              ))
                            : editForm.value.collectValue
                              ? (openBlock(),
                                createBlock(
                                  "span",
                                  {
                                    key: 1,
                                    class: "text-orange-600 font-bold",
                                  },
                                  toDisplayString(editForm.value.collectValue),
                                  1,
                                ))
                              : (openBlock(),
                                createBlock(
                                  "span",
                                  {
                                    key: 2,
                                    class: "text-muted-foreground italic",
                                  },
                                  "No payment selected",
                                )),
                        ],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _sfc_main$b,
          {
            id: "containers",
            title: "Containers Breakdown",
            icon: unref(Box),
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-6"${_scopeId}><div class="border rounded-xl mt-6 overflow-visible"${_scopeId}><div class="bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl"${_scopeId}><h3 class="font-medium text-[14px]"${_scopeId}>Containers &amp; Seals</h3><button type="button" class="btn-outline h-8 px-3 text-xs gap-1.5 flex items-center"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Plus),
                    { class: "w-3.5 h-3.5" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ` Add Container </button></div><div class="p-4 space-y-4 bg-muted/5 rounded-b-xl"${_scopeId}><!--[-->`,
                );
                ssrRenderList(editForm.value.containers, (container, index) => {
                  _push2(
                    `<div class="space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"${_scopeId}><div class="col-span-3 space-y-1.5 pt-px"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"${_scopeId}>Type</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: container.containerTypeId,
                        "onUpdate:modelValue": ($event) => (container.containerTypeId = $event),
                        options: containerTypes.value,
                        placeholder: "Select Type...",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>CONTAINER NO.</label><input${ssrRenderAttr("value", container.containerNumber)} type="text" placeholder="e.g. TEMU1234567" class="input-field uppercase"${_scopeId}></div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SEAL NO.</label><input${ssrRenderAttr("value", container.sealNumber)} type="text" placeholder="e.g. SN123456" class="input-field uppercase"${_scopeId}></div><div class="md:col-span-1 flex flex-col items-center justify-center pb-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase mb-1"${_scopeId}>HM</label><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(container.isHazardous) ? ssrLooseContain(container.isHazardous, null) : container.isHazardous) ? " checked" : ""} class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"${_scopeId}></div><div class="md:col-span-1 flex justify-end pb-1.5"${_scopeId}><button type="button" class="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(Trash2),
                      { class: "w-4 h-4" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</button></div></div><div class="ml-4 pl-4 border-l-2 border-border/50 space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h4 class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}> Container Breakdown Items </h4><button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(Plus),
                      { class: "w-3.5 h-3.5" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(` Add Item </button></div><!--[-->`);
                  ssrRenderList(container.items, (item, itemIndex) => {
                    _push2(
                      `<div class="p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative"${_scopeId}><button type="button" class="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"${ssrIncludeBooleanAttr(!container.items || container.items.length === 1) ? " disabled" : ""}${_scopeId}>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        unref(Trash2),
                        { class: "w-3.5 h-3.5" },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(
                      `</button><div class="grid grid-cols-12 gap-3 pr-6"${_scopeId}><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Qty</label><input type="number"${ssrRenderAttr("value", item.qty)} class="input-field h-8 text-sm"${_scopeId}></div><div class="col-span-3 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Unit</label>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        Combobox,
                        {
                          modelValue: item.packageTypeCode,
                          "onUpdate:modelValue": ($event) => (item.packageTypeCode = $event),
                          options: packageTypes.value,
                          "value-key": "code",
                          "label-key": "code",
                          placeholder: "PKGS",
                          class: "h-8",
                        },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(
                      `</div><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>GW (KG)</label><input type="number"${ssrRenderAttr("value", item.grossWeight)} step="0.01" class="input-field h-8 text-sm"${_scopeId}></div><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>NW (KG)</label><input type="number"${ssrRenderAttr("value", item.netWeight)} step="0.01" class="input-field h-8 text-sm"${_scopeId}></div><div class="col-span-3 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>CBM</label><input type="number"${ssrRenderAttr("value", item.measurementCbm)} step="0.01" class="input-field h-8 text-sm"${_scopeId}></div></div><div class="grid grid-cols-12 gap-3 pr-6 mt-1"${_scopeId}><div class="col-span-4 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>HS Code</label><input type="text"${ssrRenderAttr("value", item.hsCode)} class="input-field h-8 text-sm placeholder:opacity-50" placeholder="e.g. 1902..."${_scopeId}></div><div class="col-span-8 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Description Breakdown</label><textarea rows="6" class="input-field text-sm placeholder:opacity-50 resize-y min-h-[100px] py-2 transition-all duration-200" placeholder="Description of goods in this container..."${_scopeId}>${ssrInterpolate(item.description)}</textarea></div></div></div>`,
                    );
                  });
                  _push2(`<!--]--></div></div>`);
                });
                _push2(`<!--]--></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "border rounded-xl mt-6 overflow-visible" }, [
                      createVNode(
                        "div",
                        {
                          class:
                            "bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl",
                        },
                        [
                          createVNode(
                            "h3",
                            { class: "font-medium text-[14px]" },
                            "Containers & Seals",
                          ),
                          createVNode(
                            "button",
                            {
                              type: "button",
                              onClick: addContainer,
                              class: "btn-outline h-8 px-3 text-xs gap-1.5 flex items-center",
                            },
                            [
                              createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                              createTextVNode(" Add Container "),
                            ],
                          ),
                        ],
                      ),
                      createVNode("div", { class: "p-4 space-y-4 bg-muted/5 rounded-b-xl" }, [
                        (openBlock(true),
                        createBlock(
                          Fragment,
                          null,
                          renderList(editForm.value.containers, (container, index) => {
                            return (
                              openBlock(),
                              createBlock(
                                "div",
                                {
                                  key: index,
                                  class:
                                    "space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0",
                                },
                                [
                                  createVNode(
                                    "div",
                                    {
                                      class:
                                        "grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative",
                                    },
                                    [
                                      createVNode(
                                        "div",
                                        { class: "col-span-3 space-y-1.5 pt-px" },
                                        [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[10px] font-bold text-muted-foreground uppercase opacity-70",
                                            },
                                            "Type",
                                          ),
                                          createVNode(
                                            Combobox,
                                            {
                                              modelValue: container.containerTypeId,
                                              "onUpdate:modelValue": ($event) =>
                                                (container.containerTypeId = $event),
                                              options: containerTypes.value,
                                              placeholder: "Select Type...",
                                            },
                                            null,
                                            8,
                                            ["modelValue", "onUpdate:modelValue", "options"],
                                          ),
                                        ],
                                      ),
                                      createVNode("div", { class: "md:col-span-4 space-y-2" }, [
                                        createVNode(
                                          "label",
                                          {
                                            class:
                                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                                          },
                                          "CONTAINER NO.",
                                        ),
                                        withDirectives(
                                          createVNode(
                                            "input",
                                            {
                                              "onUpdate:modelValue": ($event) =>
                                                (container.containerNumber = $event),
                                              type: "text",
                                              placeholder: "e.g. TEMU1234567",
                                              class: "input-field uppercase",
                                            },
                                            null,
                                            8,
                                            ["onUpdate:modelValue"],
                                          ),
                                          [[vModelText, container.containerNumber]],
                                        ),
                                      ]),
                                      createVNode("div", { class: "md:col-span-4 space-y-2" }, [
                                        createVNode(
                                          "label",
                                          {
                                            class:
                                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                                          },
                                          "SEAL NO.",
                                        ),
                                        withDirectives(
                                          createVNode(
                                            "input",
                                            {
                                              "onUpdate:modelValue": ($event) =>
                                                (container.sealNumber = $event),
                                              type: "text",
                                              placeholder: "e.g. SN123456",
                                              class: "input-field uppercase",
                                            },
                                            null,
                                            8,
                                            ["onUpdate:modelValue"],
                                          ),
                                          [[vModelText, container.sealNumber]],
                                        ),
                                      ]),
                                      createVNode(
                                        "div",
                                        {
                                          class:
                                            "md:col-span-1 flex flex-col items-center justify-center pb-2",
                                        },
                                        [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[10px] font-bold text-muted-foreground uppercase mb-1",
                                            },
                                            "HM",
                                          ),
                                          withDirectives(
                                            createVNode(
                                              "input",
                                              {
                                                type: "checkbox",
                                                "onUpdate:modelValue": ($event) =>
                                                  (container.isHazardous = $event),
                                                class:
                                                  "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer",
                                              },
                                              null,
                                              8,
                                              ["onUpdate:modelValue"],
                                            ),
                                            [[vModelCheckbox, container.isHazardous]],
                                          ),
                                        ],
                                      ),
                                      createVNode(
                                        "div",
                                        { class: "md:col-span-1 flex justify-end pb-1.5" },
                                        [
                                          createVNode(
                                            "button",
                                            {
                                              type: "button",
                                              onClick: ($event) => removeContainer(Number(index)),
                                              class:
                                                "p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50",
                                            },
                                            [createVNode(unref(Trash2), { class: "w-4 h-4" })],
                                            8,
                                            ["onClick"],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  createVNode(
                                    "div",
                                    { class: "ml-4 pl-4 border-l-2 border-border/50 space-y-3" },
                                    [
                                      createVNode(
                                        "div",
                                        { class: "flex items-center justify-between" },
                                        [
                                          createVNode(
                                            "h4",
                                            {
                                              class:
                                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                                            },
                                            " Container Breakdown Items ",
                                          ),
                                          createVNode(
                                            "button",
                                            {
                                              type: "button",
                                              onClick: ($event) =>
                                                !container.items
                                                  ? (container.items = [
                                                      {
                                                        sequenceNo: 1,
                                                        qty: 1,
                                                        packageTypeCode: "",
                                                        grossWeight: null,
                                                        netWeight: null,
                                                        measurementCbm: null,
                                                        hsCode: "",
                                                        description: "",
                                                      },
                                                    ])
                                                  : container.items.push({
                                                      sequenceNo: container.items.length + 1,
                                                      qty: 1,
                                                      packageTypeCode: "",
                                                      grossWeight: null,
                                                      netWeight: null,
                                                      measurementCbm: null,
                                                      hsCode: "",
                                                      description: "",
                                                    }),
                                              class:
                                                "text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1",
                                            },
                                            [
                                              createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                                              createTextVNode(" Add Item "),
                                            ],
                                            8,
                                            ["onClick"],
                                          ),
                                        ],
                                      ),
                                      (openBlock(true),
                                      createBlock(
                                        Fragment,
                                        null,
                                        renderList(container.items, (item, itemIndex) => {
                                          return (
                                            openBlock(),
                                            createBlock(
                                              "div",
                                              {
                                                key: itemIndex,
                                                class:
                                                  "p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative",
                                              },
                                              [
                                                createVNode(
                                                  "button",
                                                  {
                                                    type: "button",
                                                    onClick: ($event) =>
                                                      container.items?.splice(itemIndex, 1),
                                                    class:
                                                      "absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors",
                                                    disabled:
                                                      !container.items ||
                                                      container.items.length === 1,
                                                  },
                                                  [
                                                    createVNode(unref(Trash2), {
                                                      class: "w-3.5 h-3.5",
                                                    }),
                                                  ],
                                                  8,
                                                  ["onClick", "disabled"],
                                                ),
                                                createVNode(
                                                  "div",
                                                  { class: "grid grid-cols-12 gap-3 pr-6" },
                                                  [
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-2 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "Qty",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "input",
                                                            {
                                                              type: "number",
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.qty = $event),
                                                              class: "input-field h-8 text-sm",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [
                                                            [
                                                              vModelText,
                                                              item.qty,
                                                              void 0,
                                                              { number: true },
                                                            ],
                                                          ],
                                                        ),
                                                      ],
                                                    ),
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-3 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "Unit",
                                                        ),
                                                        createVNode(
                                                          Combobox,
                                                          {
                                                            modelValue: item.packageTypeCode,
                                                            "onUpdate:modelValue": ($event) =>
                                                              (item.packageTypeCode = $event),
                                                            options: packageTypes.value,
                                                            "value-key": "code",
                                                            "label-key": "code",
                                                            placeholder: "PKGS",
                                                            class: "h-8",
                                                          },
                                                          null,
                                                          8,
                                                          [
                                                            "modelValue",
                                                            "onUpdate:modelValue",
                                                            "options",
                                                          ],
                                                        ),
                                                      ],
                                                    ),
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-2 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "GW (KG)",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "input",
                                                            {
                                                              type: "number",
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.grossWeight = $event),
                                                              step: "0.01",
                                                              class: "input-field h-8 text-sm",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [
                                                            [
                                                              vModelText,
                                                              item.grossWeight,
                                                              void 0,
                                                              { number: true },
                                                            ],
                                                          ],
                                                        ),
                                                      ],
                                                    ),
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-2 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "NW (KG)",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "input",
                                                            {
                                                              type: "number",
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.netWeight = $event),
                                                              step: "0.01",
                                                              class: "input-field h-8 text-sm",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [
                                                            [
                                                              vModelText,
                                                              item.netWeight,
                                                              void 0,
                                                              { number: true },
                                                            ],
                                                          ],
                                                        ),
                                                      ],
                                                    ),
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-3 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "CBM",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "input",
                                                            {
                                                              type: "number",
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.measurementCbm = $event),
                                                              step: "0.01",
                                                              class: "input-field h-8 text-sm",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [
                                                            [
                                                              vModelText,
                                                              item.measurementCbm,
                                                              void 0,
                                                              { number: true },
                                                            ],
                                                          ],
                                                        ),
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                                createVNode(
                                                  "div",
                                                  { class: "grid grid-cols-12 gap-3 pr-6 mt-1" },
                                                  [
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-4 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "HS Code",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "input",
                                                            {
                                                              type: "text",
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.hsCode = $event),
                                                              class:
                                                                "input-field h-8 text-sm placeholder:opacity-50",
                                                              placeholder: "e.g. 1902...",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [[vModelText, item.hsCode]],
                                                        ),
                                                      ],
                                                    ),
                                                    createVNode(
                                                      "div",
                                                      { class: "col-span-8 space-y-1" },
                                                      [
                                                        createVNode(
                                                          "label",
                                                          {
                                                            class:
                                                              "text-[10px] uppercase font-bold text-muted-foreground",
                                                          },
                                                          "Description Breakdown",
                                                        ),
                                                        withDirectives(
                                                          createVNode(
                                                            "textarea",
                                                            {
                                                              "onUpdate:modelValue": ($event) =>
                                                                (item.description = $event),
                                                              rows: "6",
                                                              class:
                                                                "input-field text-sm placeholder:opacity-50 resize-y min-h-[100px] py-2 transition-all duration-200",
                                                              placeholder:
                                                                "Description of goods in this container...",
                                                            },
                                                            null,
                                                            8,
                                                            ["onUpdate:modelValue"],
                                                          ),
                                                          [[vModelText, item.description]],
                                                        ),
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            )
                                          );
                                        }),
                                        128,
                                      )),
                                    ],
                                  ),
                                ],
                              )
                            );
                          }),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/ebl/JobEblEditForm.vue",
  );
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const JobEblEditForm = Object.assign(_sfc_main$4, { __name: "OperationalEblJobEblEditForm" });
const LINE_HEIGHT = 16;
const PAGE_1_MAX_HEIGHT = 200;
const PAGE_2_MAX_HEIGHT = 750;
const CHARS_PER_LINE = 32;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "JobEblPreview",
  __ssrInlineRender: true,
  props: {
    jobData: {},
    activeBl: {},
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const logoUrl = ref("/images/transparentnscontinenttebal.png");
    const isGeneratingPDF = ref(false);
    const eblContainer = ref(null);
    const blStatus = computed(() => {
      const s = props.activeBl?.status;
      const raw = props.activeBl?.statusRaw;
      if (!s) return "";
      if (typeof s === "string") {
        const lower = s.toLowerCase();
        if (lower === "finalized" || lower === "confirmed") return "confirmed";
        return lower;
      }
      const code = s.code?.toLowerCase() || "";
      if (code === "draft" && raw?.toLowerCase() === "finalized") return "confirmed";
      return code;
    });
    const isDraft = computed(() => blStatus.value === "draft" || !props.activeBl);
    computed(() => blStatus.value === "finalized" || blStatus.value === "confirmed");
    const getVal = (val, fallback = "") => (val ? String(val) : fallback ? String(fallback) : "");
    const formatNumber = (num, decimals = 3) => {
      if (!num && num !== 0) return "-";
      const n = parseFloat(num);
      if (isNaN(n)) return "-";
      return n.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    };
    const getContainerTotals = (cnt) => {
      let gw = 0,
        nw = 0,
        cbm = 0,
        qty = 0;
      if (cnt.items && Array.isArray(cnt.items)) {
        cnt.items.forEach((item) => {
          qty += Number(item.qty) || 0;
          gw += Number(item.grossWeight) || 0;
          nw += Number(item.netWeight) || 0;
          cbm += Number(item.measurementCbm) || 0;
        });
      }
      if (qty === 0) qty = Number(cnt.totalQty) || Number(cnt.quantity) || 0;
      if (gw === 0) gw = Number(cnt.totalGrossWeight) || Number(cnt.grossWeight) || 0;
      if (nw === 0) nw = Number(cnt.totalNetWeight) || Number(cnt.netWeight) || 0;
      if (cbm === 0) cbm = Number(cnt.totalMeasurementCbm) || Number(cnt.measurement) || 0;
      if (containers.value?.length === 1) {
        if (qty === 0)
          qty = Number(props.activeBl?.totalQty) || Number(props.jobData?.quantity) || 0;
        if (gw === 0)
          gw = Number(props.activeBl?.totalGrossWeight) || Number(props.jobData?.grossWeight) || 0;
        if (nw === 0)
          nw = Number(props.activeBl?.totalNetWeight) || Number(props.jobData?.netWeight) || 0;
        if (cbm === 0)
          cbm =
            Number(props.activeBl?.totalMeasurementCbm) || Number(props.jobData?.measurement) || 0;
      }
      return { gw, nw, cbm, qty };
    };
    const shipper = computed(
      () =>
        props.activeBl?.job?.jobParties?.find((p) => p.partyRole?.code === "SHIPPER") ||
        props.jobData?.jobParties?.find((p) => p.partyRole?.code === "SHIPPER"),
    );
    const consignee = computed(
      () =>
        props.activeBl?.job?.jobParties?.find((p) => p.partyRole?.code === "CONSIGNEE") ||
        props.jobData?.jobParties?.find((p) => p.partyRole?.code === "CONSIGNEE"),
    );
    const notifyParty = computed(
      () =>
        props.activeBl?.job?.jobParties?.find(
          (p) => p.partyRole?.code === "NOTIFY PARTY" || p.partyRole?.code === "NOTIFY_PARTY",
        ) || props.jobData?.jobParties?.find((p) => p.partyRole?.code === "NOTIFY PARTY"),
    );
    const containers = computed(() => {
      if (
        props.activeBl?.renderContainers &&
        Array.isArray(props.activeBl.renderContainers) &&
        props.activeBl.renderContainers.length > 0
      ) {
        return props.activeBl.renderContainers;
      }
      if (
        props.activeBl?.jobContainers &&
        Array.isArray(props.activeBl.jobContainers) &&
        props.activeBl.jobContainers.length > 0
      ) {
        return props.activeBl.jobContainers;
      }
      if (
        props.activeBl?.blContainers &&
        Array.isArray(props.activeBl.blContainers) &&
        props.activeBl.blContainers.length > 0
      ) {
        return props.activeBl.blContainers.map((bc) => bc.container);
      }
      if (
        props.activeBl?.containers &&
        Array.isArray(props.activeBl.containers) &&
        props.activeBl.containers.length > 0
      ) {
        return props.activeBl.containers;
      }
      if (
        props.jobData?.jobContainers &&
        Array.isArray(props.jobData.jobContainers) &&
        props.jobData.jobContainers.length > 0
      ) {
        return props.jobData.jobContainers;
      }
      return [];
    });
    const totals = computed(() => {
      let qty = 0;
      let grossWeight = 0;
      let netWeight = 0;
      let measurement = 0;
      if (containers.value && containers.value.length > 0) {
        (containers.value || []).forEach((cnt) => {
          const ct = getContainerTotals(cnt);
          qty += ct.qty;
          grossWeight += ct.gw;
          netWeight += ct.nw;
          measurement += ct.cbm;
        });
      }
      if (qty === 0) qty = Number(props.activeBl?.totalQty) || Number(props.jobData?.quantity) || 0;
      if (grossWeight === 0)
        grossWeight =
          Number(props.activeBl?.totalGrossWeight) || Number(props.jobData?.grossWeight) || 0;
      if (netWeight === 0)
        netWeight = Number(props.activeBl?.totalNetWeight) || Number(props.jobData?.netWeight) || 0;
      if (measurement === 0)
        measurement =
          Number(props.activeBl?.totalMeasurementCbm) || Number(props.jobData?.measurement) || 0;
      return { qty, grossWeight, netWeight, measurement };
    });
    const formatPartyDisplay = (partyInfo) => {
      if (!partyInfo) return "";
      const name = partyInfo.companyName || partyInfo.company?.name || "";
      const address = partyInfo.addressBook?.fullAddress || partyInfo.addressBook?.address || "";
      const city = partyInfo.addressBook?.city || "";
      const parts = [name, address, city].filter(Boolean);
      return parts.join("\n");
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const d = new Date(dateStr);
        const parts = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).formatToParts(d);
        return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
      } catch {
        return dateStr;
      }
    };
    const paginatedPages = computed(() => {
      const pages = [];
      let currentPageContent = [];
      let currentHeight = 0;
      let isFirstPage = true;
      const getMaxHeight = () => (isFirstPage ? PAGE_1_MAX_HEIGHT : PAGE_2_MAX_HEIGHT);
      if (!containers.value || containers.value.length === 0) {
        return [[{ isHeaderVisible: true, isFallback: true, renderItems: [] }]];
      }
      containers.value.forEach((container) => {
        if (!container) return;
        const headerHeight = 60;
        if (currentHeight + headerHeight > getMaxHeight()) {
          pages.push(currentPageContent);
          currentPageContent = [];
          currentHeight = 0;
          isFirstPage = false;
        }
        let currentContainerOnPage = {
          ...container,
          renderItems: [],
          isHeaderVisible: true,
        };
        currentHeight += headerHeight;
        (container.items || []).forEach((item) => {
          const descriptionText = item.description || "";
          const rawLines = descriptionText.split("\n");
          const processedLines = [];
          rawLines.forEach((line) => {
            if (line.length <= CHARS_PER_LINE) {
              processedLines.push(line);
            } else {
              const regex = new RegExp(`.{1,${CHARS_PER_LINE}}`, "g");
              const chunks = line.match(regex);
              if (chunks) processedLines.push(...chunks);
            }
          });
          const itemLinesCount = processedLines.length;
          const itemTotalHeight = itemLinesCount * LINE_HEIGHT + 12;
          if (currentHeight + itemTotalHeight > getMaxHeight()) {
            currentPageContent.push(currentContainerOnPage);
            pages.push(currentPageContent);
            currentPageContent = [];
            currentHeight = 10;
            isFirstPage = false;
            currentContainerOnPage = {
              ...container,
              renderItems: [],
              isHeaderVisible: false,
            };
          }
          if (!currentContainerOnPage.renderItems) currentContainerOnPage.renderItems = [];
          currentContainerOnPage.renderItems.push({
            ...item,
            displayLines: processedLines,
          });
          currentHeight += itemTotalHeight;
        });
        currentPageContent.push(currentContainerOnPage);
        currentHeight += 20;
      });
      if (currentPageContent.length > 0) pages.push(currentPageContent);
      return pages;
    });
    const generatePDF = async () => {
      if (!eblContainer.value || !props.jobData) return false;
      try {
        isGeneratingPDF.value = true;
        await nextTick();
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pages = eblContainer.value.querySelectorAll(".a4-page-wrapper");
        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();
          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            scrollY: 0,
            scrollX: 0,
          });
          const imgData = canvas.toDataURL("image/jpeg", 0.8);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, void 0, "FAST");
        }
        pdf.save(`BL_${props.jobData.jobNumber || "DRAFT"}.pdf`);
        return true;
      } catch (error) {
        console.error(error);
        toast.error("Gagal membuat PDF. Cek console.");
        return false;
      } finally {
        isGeneratingPDF.value = false;
      }
    };
    __expose({
      generatePDF,
      isGeneratingPDF,
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto" }, _attrs))} data-v-9f2cc937><div class="relative group flex flex-col gap-10" data-v-9f2cc937><!--[-->`,
      );
      ssrRenderList(paginatedPages.value, (pageItems, pIdx) => {
        _push(
          `<div class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border" style="${ssrRenderStyle({ width: "794px", height: "1123px", padding: "20px 30px", "box-sizing": "border-box", position: "relative" })}" data-v-9f2cc937><div class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white" style="${ssrRenderStyle({ height: "70px" })}" data-v-9f2cc937><div class="w-[35%] pb-1" data-v-9f2cc937><img${ssrRenderAttr("src", logoUrl.value)} alt="NS Continent Logo" class="h-16 object-contain max-w-[190px]" crossorigin="anonymous" data-v-9f2cc937></div><div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full relative" data-v-9f2cc937>`,
        );
        if (isDraft.value) {
          _push(
            `<span class="text-sm font-bold tracking-widest uppercase block leading-none text-[#062c58]" data-v-9f2cc937>DRAFT - NON NEGOTIABLE</span>`,
          );
        } else {
          _push(
            `<span class="text-sm font-bold tracking-widest uppercase block leading-none text-[#062c58]" data-v-9f2cc937>ORIGINAL NEGOTIABLE</span>`,
          );
        }
        _push(
          `</div><div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full" data-v-9f2cc937><div class="text-[0.6rem] font-mono mb-1 text-black" data-v-9f2cc937> PAGE: ${ssrInterpolate(pIdx + 1)} OF ${ssrInterpolate(paginatedPages.value.length)}</div><h1 class="text-lg font-bold tracking-widest uppercase leading-none" data-v-9f2cc937>BILL OF LADING</h1></div></div><div class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full" data-v-9f2cc937>`,
        );
        if (pIdx === 0) {
          _push(
            `<div class="routing-section relative z-[1] bg-white" data-v-9f2cc937><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "75px" })}" data-v-9f2cc937><div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold mb-0.5 text-[0.6rem] leading-none block" data-v-9f2cc937>SHIPPER/EXPORTER</span><div class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black" data-v-9f2cc937>${ssrInterpolate(formatPartyDisplay(shipper.value) || "-")}</div></div><div class="w-1/2" data-v-9f2cc937><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold text-[0.6rem] leading-none mb-0.5 block" data-v-9f2cc937>BOOKING NO.</span><span class="font-mono text-[0.8rem] text-black leading-none" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.jobNumber))}</span></div><div class="w-1/2 pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold text-[0.6rem] leading-none mb-0.5 block" data-v-9f2cc937>BILL OF LADING NO.</span><span class="font-mono text-[0.8rem] text-black leading-none" data-v-9f2cc937>${ssrInterpolate(getVal(__props.activeBl?.blNumber))}</span></div></div><div class="pt-1 px-2 pb-3" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none" data-v-9f2cc937>EXPORT REFERENCES</span><div class="font-mono text-[0.75rem] text-black pb-1.5" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.customerReference, "-"))}</div>`,
          );
          if (
            __props.activeBl?.showShipperReferencesOnBl !== false &&
            __props.activeBl?.shipperReferences?.length
          ) {
            _push(
              `<div class="pt-1.5 border-t border-[#062c58] -mx-2 px-2" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>SHIPPER REFERENCE</span><div class="font-mono text-[0.75rem] text-black" data-v-9f2cc937>${ssrInterpolate(__props.activeBl.shipperReferences.join(", "))}</div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `</div></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "75px" })}" data-v-9f2cc937><div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold mb-0.5 text-[0.6rem] leading-none block" data-v-9f2cc937>CONSIGNEE</span><div class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black" data-v-9f2cc937>${ssrInterpolate(formatPartyDisplay(consignee.value) || "-")}</div></div><div class="w-1/2 pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold mb-0.5 text-[0.6rem] leading-none block" data-v-9f2cc937>FORWARDING AGENT - REFERENCES</span><div class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black" data-v-9f2cc937> PT NOVA SYNC CONTINENT<br data-v-9f2cc937>KMP MUARA BAHARI NOMOR 189 RT.010<br data-v-9f2cc937>RW.013, TANJUNG PRIOK </div></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "100px" })}" data-v-9f2cc937><div class="w-1/2 border-r border-[#062c58]" data-v-9f2cc937><div class="pt-1 px-2 pb-2" data-v-9f2cc937><span class="font-bold text-[0.6rem] mb-0.5 leading-none block" data-v-9f2cc937>NOTIFY PARTY</span><div class="whitespace-pre-wrap font-mono uppercase text-[0.75rem] leading-tight text-black" data-v-9f2cc937>${ssrInterpolate(formatPartyDisplay(notifyParty.value) || "-")}</div></div></div><div class="w-1/2 pt-1 px-2 pb-2 text-[0.45rem] text-justify leading-[1.1] font-medium text-[#062c58]" data-v-9f2cc937> RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated herein) the total number or quantity of Containers or other packages or units indicated in the box entitled &quot;Carrier&#39;s Receipt&quot;, to be carried subject to all the terms and conditions hereof from the Place of Receipt or Port of Loading to the Port of Discharge or Place of Delivery, as applicable. Delivery of the Goods to the Carrier for Carriage hereunder constitutes acceptance by the Merchant of all the terms and conditions of this Bill of Lading. </div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "40px" })}" data-v-9f2cc937><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>PRE-CARRIAGE BY</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.preCarriageBy, "-"))}</span></div><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>PLACE OF RECEIPT</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.placeOfReceipt, getVal(__props.jobData?.polName, __props.jobData?.pol)))}</span></div><div class="w-[50%] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>VESSEL/VOYAGE</span><span class="font-mono text-[0.75rem] uppercase text-black leading-none" data-v-9f2cc937>${ssrInterpolate(
              (__props.activeBl?.vessels || __props.jobData?.vessels || [])
                .map((v) => `${v.vesselName || ""} / ${v.voyageNumber || ""}`)
                .filter((s) => s.trim() !== "/")
                .join(", ") || "-",
            )}</span></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "40px" })}" data-v-9f2cc937><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>OCEAN VESSEL</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate((__props.activeBl?.vessels || __props.jobData?.vessels || [])[0]?.vesselName || getVal(__props.jobData?.vessel?.name, "-"))}</span></div><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>PORT OF LOADING</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.polName, __props.jobData?.pol))}</span></div><div class="w-[50%] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.6rem] block leading-none mb-0.5" data-v-9f2cc937>PORT OF DISCHARGE</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.podName, __props.jobData?.pod))}</span></div></div><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "40px" })}" data-v-9f2cc937><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.55rem] block leading-none mb-0.5" data-v-9f2cc937>PLACE OF DELIVERY</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.placeOfDelivery, getVal(__props.jobData?.podName, __props.jobData?.pod)))}</span></div><div class="w-[25%] border-r border-[#062c58] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.55rem] block leading-none mb-0.5" data-v-9f2cc937>TYPE OF MOVEMENT</span><span class="font-mono text-[0.7rem] uppercase text-black leading-none" data-v-9f2cc937>${ssrInterpolate(
              (
                __props.jobData?.cargoMovement?.code ||
                __props.jobData?.cargoMovementId ||
                "FCL_FCL"
              ).replace("_", "/"),
            )} - ${ssrInterpolate((__props.jobData?.deliveryMovement?.code || __props.jobData?.deliveryMovementId || "CY_CY").replace("_", "/"))}</span></div><div class="w-[50%] pt-0.5 px-2 pb-1.5" data-v-9f2cc937><span class="font-bold text-[0.55rem] block leading-none mb-0.5" data-v-9f2cc937>FINAL DESTINATION</span><span class="font-mono text-[0.75rem] uppercase leading-none text-black" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.finalDestination, getVal(__props.jobData?.podName, __props.jobData?.pod)))}</span></div></div></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (pIdx > 0) {
          _push(
            `<div class="vessel-minimal-header flex justify-between items-end border-b border-[#062c58] p-2 text-black font-mono text-[0.6rem] uppercase relative z-[1] bg-white" style="${ssrRenderStyle({ height: "30px" })}" data-v-9f2cc937><span data-v-9f2cc937>VESSEL VOYAGE: ${ssrInterpolate(
              (__props.activeBl?.vessels || __props.jobData?.vessels || [])
                .map((v) => `${v.vesselName || ""} ${v.voyageNumber || ""}`)
                .filter((s) => s.trim())
                .join(", ") || "-",
            )}</span><span class="text-[#062c58] text-[0.6rem] font-bold tracking-widest leading-none" data-v-9f2cc937>`,
          );
          if (isDraft.value) {
            _push(`<!--[-->DRAFT - NON NEGOTIABLE<!--]-->`);
          } else {
            _push(`<!--[-->ORIGINAL NEGOTIABLE<!--]-->`);
          }
          _push(`</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `<div class="flex flex-col border-b border-[#062c58] bg-white relative z-[1]" data-v-9f2cc937><div class="flex border-b border-[#062c58]" style="${ssrRenderStyle({ "min-height": "25px" })}" data-v-9f2cc937><div class="w-[32%] px-2 py-1 text-[0.55rem] italic flex items-center border-r border-[#062c58]" data-v-9f2cc937> (CHECK &quot;HM&quot; COLUMN IF HAZARDOUS MATERIAL) </div><div class="flex-1 text-center font-bold text-[0.65rem] px-2 py-1 flex items-center justify-center" data-v-9f2cc937> PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER </div></div><div class="flex bg-[#062c58]/5 font-bold text-[0.55rem] h-[45px]" data-v-9f2cc937><div class="w-[22%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-tight" data-v-9f2cc937><span data-v-9f2cc937>CNTR. NOS. W/SEAL NOS.</span><span data-v-9f2cc937>MARKS &amp; NUMBERS</span></div><div class="w-[10%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-tight text-[0.5rem]" data-v-9f2cc937><span data-v-9f2cc937>QUANTITY</span><span class="font-normal" data-v-9f2cc937>(FOR CUSTOMS</span><span class="font-normal" data-v-9f2cc937>DECLARATION ONLY)</span></div><div class="w-[3%] border-r border-[#062c58] p-1 flex flex-col items-center justify-center leading-none" data-v-9f2cc937><span data-v-9f2cc937>H</span><span class="mt-0.5" data-v-9f2cc937>M</span></div><div class="w-[40%] border-r border-[#062c58] p-1 flex items-center justify-center" data-v-9f2cc937> DESCRIPTION OF PACKAGES AND GOODS </div><div class="w-[12.5%] border-r border-[#062c58] p-1 flex items-center justify-center" data-v-9f2cc937> GROSS WEIGHT </div><div class="w-[12.5%] p-1 flex items-center justify-center" data-v-9f2cc937>GROSS MEASUREMENT</div></div></div><div class="${ssrRenderClass([[pIdx === 0 ? "cargo-window-p1" : "cargo-window-p2"], "relative"])}" data-v-9f2cc937><div class="vertical-grid-lines" data-v-9f2cc937><div class="w-[22%] border-r border-[#062c58]" data-v-9f2cc937></div><div class="w-[10%] border-r border-[#062c58]" data-v-9f2cc937></div><div class="w-[3%] border-r border-[#062c58]" data-v-9f2cc937></div><div class="w-[40%] border-r border-[#062c58]" data-v-9f2cc937></div><div class="w-[12.5%] border-r border-[#062c58]" data-v-9f2cc937></div><div class="w-[12.5%]" data-v-9f2cc937></div></div><div class="relative z-[1] text-black font-mono pt-4" data-v-9f2cc937><!--[-->`,
        );
        ssrRenderList(pageItems, (cnt, cIdx) => {
          _push(`<!--[-->`);
          if (cnt.isHeaderVisible && !cnt.isFallback) {
            _push(
              `<div class="flex w-full mb-1 font-bold italic border-b border-[#062c58]/10" data-v-9f2cc937><div class="w-[22%] pl-3 pr-6 break-words whitespace-pre-wrap text-[11px]" data-v-9f2cc937>${ssrInterpolate(cnt.containerNumber || "")}`,
            );
            if (cnt.sealNumber) {
              _push(`<span class="ml-1" data-v-9f2cc937>/${ssrInterpolate(cnt.sealNumber)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(
              `</div><div class="w-[10%] px-2 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(getContainerTotals(cnt).qty, 0))}</div><div class="w-[3%] flex items-center justify-center text-[10px] leading-none" data-v-9f2cc937>${ssrInterpolate(cnt.isHazardous ? "X" : "")}</div><div class="w-[40%] px-3 font-mono text-[11px]" data-v-9f2cc937> 1X${ssrInterpolate(cnt.containerType?.code || "")} S.T.C.: </div><div class="w-[12.5%] px-3 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(getContainerTotals(cnt).gw))}KGS </div><div class="w-[12.5%] px-3 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(getContainerTotals(cnt).cbm))}CBM </div></div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(cnt.renderItems, (item, iIdx) => {
            _push(
              `<div class="flex w-full mb-3 tracking-tight" data-v-9f2cc937><div class="w-[22%] pl-3 text-[9px] uppercase leading-tight" data-v-9f2cc937>${ssrInterpolate(pIdx === 0 && cIdx === 0 && iIdx === 0 ? __props.jobData?.shippingMark : "")}</div><div class="w-[10%] px-2 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(item.qty, 0))}</div><div class="w-[3%] flex items-center justify-center text-[10px] leading-none" data-v-9f2cc937>${ssrInterpolate(cnt.isHazardous ? "X" : "")}</div><div class="w-[40%] px-3 font-mono" data-v-9f2cc937><div class="font-bold underline mb-0.5 text-[11px]" data-v-9f2cc937>${ssrInterpolate(item.packageTypeCode || "PKGS")} OF: </div><!--[-->`,
            );
            ssrRenderList(item.displayLines, (line, lIdx) => {
              _push(
                `<div class="break-all text-[11px] leading-[14px]" data-v-9f2cc937>${ssrInterpolate(line)}</div>`,
              );
            });
            _push(`<!--]-->`);
            if (item.hsCode) {
              _push(
                `<div class="text-[10px] mt-1 font-bold" data-v-9f2cc937> (HS CODE: ${ssrInterpolate(item.hsCode)}) </div>`,
              );
            } else {
              _push(`<!---->`);
            }
            _push(
              `</div><div class="w-[12.5%] px-3 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(item.grossWeight, 0))}</div><div class="w-[12.5%] px-3 text-right text-[11px]" data-v-9f2cc937>${ssrInterpolate(formatNumber(item.measurementCbm, 2))}</div></div>`,
            );
          });
          _push(`<!--]--><div class="mb-4" data-v-9f2cc937></div><!--]-->`);
        });
        _push(`<!--]-->`);
        if (pageItems[0]?.isFallback) {
          _push(
            `<div class="flex w-full mb-2 tracking-tight text-[11px]" data-v-9f2cc937><div class="w-[22%] pl-2 pr-6 whitespace-pre-wrap break-words" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.shippingMark))}</div><div class="w-[10%] px-2 text-right" data-v-9f2cc937><div data-v-9f2cc937>${ssrInterpolate(formatNumber(totals.value.qty, 0))}</div><div data-v-9f2cc937>PACKAGES</div></div><div class="w-[3%]" data-v-9f2cc937></div><div class="w-[40%] px-2 whitespace-pre-wrap break-words" data-v-9f2cc937>${ssrInterpolate("NO CARGO DATA")}</div><div class="w-[12.5%] px-2 text-right text-black" data-v-9f2cc937>${ssrInterpolate(formatNumber(totals.value.grossWeight))}KGS </div><div class="w-[12.5%] px-2 text-right text-black" data-v-9f2cc937>${ssrInterpolate(formatNumber(totals.value.measurement))}CBM </div></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (pIdx < paginatedPages.value.length - 1) {
          _push(
            `<div class="border-t border-[#062c58] text-center font-bold text-[0.55rem] py-1 mt-auto" data-v-9f2cc937> ** TO BE CONTINUED ON PAGE ${ssrInterpolate(pIdx + 2)} ** </div>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (pIdx === 0) {
          _push(
            `<div class="bl-footer border-t border-[#062c58] flex flex-col relative z-[1] bg-white" data-v-9f2cc937><div class="flex border-b border-[#062c58] text-[#062c58]" style="${ssrRenderStyle({ "min-height": "20px" })}" data-v-9f2cc937><div class="px-3 w-1/4 font-bold flex items-start pt-1 text-[0.55rem] leading-none" data-v-9f2cc937> Declared Cargo Value US $ </div><div class="border-l border-[#062c58] flex-1 text-left font-normal text-[0.45rem] leading-tight flex items-start pt-1 px-2 text-black" data-v-9f2cc937> . If Merchant enters a value, Carrier&#39;s limitation of liability shall not apply and the ad valorem rate will be charged. </div></div><div class="flex border-b border-[#062c58] text-[0.5rem] font-bold" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><div class="w-[20%] border-r border-[#062c58] pt-1 px-2 pb-2" data-v-9f2cc937><span class="text-[0.55rem] leading-tight text-[#062c58] font-bold uppercase block" data-v-9f2cc937>FREIGHT &amp; CHARGES PAYABLE AT / BY:</span><span class="uppercase font-mono text-[0.6rem] text-black leading-none font-normal mt-1 block" data-v-9f2cc937>${ssrInterpolate(getVal(__props.jobData?.podName, __props.jobData?.pod))}</span></div><div class="w-[15%] border-r border-[#062c58] p-1" data-v-9f2cc937><span class="text-[#062c58] font-bold block" data-v-9f2cc937>SERVICE CONTRACT NO.</span></div><div class="w-[12%] border-r border-[#062c58] p-1" data-v-9f2cc937><span class="text-[#062c58] font-bold block" data-v-9f2cc937>DOC FORM NO.</span></div><div class="w-[12%] border-r border-[#062c58] p-1" data-v-9f2cc937><span class="text-[#062c58] font-bold block" data-v-9f2cc937>COMMODITY CODE</span></div><div class="w-[12%] border-r border-[#062c58] p-1" data-v-9f2cc937><span class="text-[#062c58] font-bold block" data-v-9f2cc937>EXCHANGE RATE</span></div><div class="w-[29%] p-0.5 text-[0.42rem] font-normal leading-tight text-justify flex items-start text-black" data-v-9f2cc937> [1] ORIGINAL BILL(S) OF LADING HAVE BEEN SIGNED, WHERE DELIVERED AGAINST ONE, THE OTHERS(S) TO BE VOID. </div></div><div class="flex flex-1" style="${ssrRenderStyle({ "min-height": "110px" })}" data-v-9f2cc937><div class="w-[71%] border-r border-[#062c58] flex flex-col" data-v-9f2cc937><div class="flex border-b border-[#062c58] text-[0.55rem] text-center font-bold" style="${ssrRenderStyle({ "min-height": "20px" })}" data-v-9f2cc937><div class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center" data-v-9f2cc937> CODE </div><div class="w-[20%] border-r border-[#062c58] h-full p-1 flex items-center justify-center" data-v-9f2cc937> TARIFF ITEM </div><div class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center" data-v-9f2cc937> FREIGHTED AS </div><div class="w-[15%] border-r border-[#062c58] h-full p-1 flex items-center justify-center" data-v-9f2cc937> RATE </div><div class="w-[17.5%] border-r border-[#062c58] h-full p-1 flex items-center justify-center" data-v-9f2cc937> PREPAID </div><div class="w-[17.5%] h-full p-1 flex items-center justify-center" data-v-9f2cc937>COLLECT</div></div><div class="flex-1 relative" data-v-9f2cc937><div class="absolute inset-0 flex pointer-events-none text-[#062c58]" data-v-9f2cc937><div class="w-[15%] border-r border-[#062c58] h-full" data-v-9f2cc937></div><div class="w-[20%] border-r border-[#062c58] h-full" data-v-9f2cc937></div><div class="w-[15%] border-r border-[#062c58] h-full" data-v-9f2cc937></div><div class="w-[15%] border-r border-[#062c58] h-full" data-v-9f2cc937></div><div class="w-[17.5%] border-r border-[#062c58] h-full" data-v-9f2cc937></div><div class="w-[17.5%] h-full" data-v-9f2cc937></div></div><div class="relative z-[1] flex h-full items-start pt-1 font-mono text-[8.5px] uppercase" data-v-9f2cc937><div class="w-[15%]" data-v-9f2cc937></div><div class="w-[20%]" data-v-9f2cc937></div><div class="w-[15%]" data-v-9f2cc937></div><div class="w-[15%]" data-v-9f2cc937></div><div class="w-[17.5%] px-2 text-left text-black font-normal text-[8.1px] break-words" data-v-9f2cc937>${ssrInterpolate(__props.activeBl?.prepaid)}</div><div class="w-[17.5%] px-2 text-left text-black font-normal text-[8.1px] break-words" data-v-9f2cc937>${ssrInterpolate(__props.activeBl?.collect)}</div></div></div></div><div class="w-[29%] flex flex-col text-[0.5rem]" data-v-9f2cc937><div class="border-b border-[#062c58] px-2 pt-0.5 pb-2" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><span class="text-[#062c58] text-[0.38rem] tracking-tighter uppercase opacity-80 font-bold leading-none block" data-v-9f2cc937>DATE CARGO RECEIVED</span><span class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block" data-v-9f2cc937>${ssrInterpolate(formatDate(__props.activeBl?.dateCargoReceived))}</span></div><div class="border-b border-[#062c58] px-2 pt-0.5 pb-2" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><span class="text-[#062c58] text-[0.38rem] tracking-tighter opacity-80 uppercase font-bold leading-none block" data-v-9f2cc937>DATE LADEN ON BOARD</span><span class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block" data-v-9f2cc937>${ssrInterpolate(formatDate(__props.jobData?.etd))}</span></div><div class="border-b border-[#062c58] px-2 pt-0.5 pb-2" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><span class="text-[#062c58] text-[0.38rem] tracking-tighter opacity-80 uppercase font-bold leading-none block" data-v-9f2cc937>PLACE OF BILL(S) ISSUE</span><span class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block" data-v-9f2cc937>${ssrInterpolate(getVal(__props.activeBl?.placeOfIssue))}</span></div><div class="px-2 pt-1 pb-2" style="${ssrRenderStyle({ "min-height": "35px" })}" data-v-9f2cc937><span class="text-[#062c58] text-[0.38rem] tracking-tighter uppercase opacity-80 font-bold leading-none block" data-v-9f2cc937>DATED</span><span class="font-mono text-[0.65rem] text-black uppercase leading-none mt-1 block" data-v-9f2cc937>${ssrInterpolate(formatDate(__props.activeBl?.dateOfIssue) || formatDate(/* @__PURE__ */ new Date().toISOString()))}</span></div></div></div></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="mt-1 flex justify-between pr-2 text-[#062c58]" style="${ssrRenderStyle({ height: "35px" })}" data-v-9f2cc937><div class="text-[0.45rem] w-1/2 mt-0.5 italic leading-tight" data-v-9f2cc937> The printed terms and conditions on this Bill are available at its website at www.nscontinent.com </div>`,
        );
        if (pIdx === paginatedPages.value.length - 1) {
          _push(
            `<div class="w-[260px] text-[0.45rem] flex flex-col items-end" data-v-9f2cc937><div class="w-full text-left font-mono leading-tight bg-white p-2" data-v-9f2cc937><span class="font-bold" data-v-9f2cc937>SIGNED BY: </span>PT. SAMUDERA AGENCIES INDONESIA<br data-v-9f2cc937><span class="pl-14 text-[0.4rem] italic" data-v-9f2cc937>, as agent for and on behalf of NS CONTINENT</span></div></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  },
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/ebl/JobEblPreview.vue",
  );
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const JobEblPreview = /* @__PURE__ */ Object.assign(
  _export_sfc(_sfc_main$3, [["__scopeId", "data-v-9f2cc937"]]),
  { __name: "OperationalEblJobEblPreview" },
);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "JobEblTab",
  __ssrInlineRender: true,
  props: {
    job: {},
    initialBlId: {},
  },
  setup(__props) {
    const props = __props;
    const { getBlRender, finalizeBl, requestFinalizeBl, rejectBl } = useJobs();
    const { confirm } = useConfirm();
    const { canApproveJobs } = useAuth();
    const activeBl = ref(null);
    const isRendering = ref(false);
    const isSavingDraft = ref(false);
    const isGeneratingPDF = ref(false);
    const editMode = ref(false);
    const isFinalizing = ref(false);
    const isRejecting = ref(false);
    const showRejectReason = ref(false);
    const showRejectModal = ref(false);
    const rejectReasonForm = ref("");
    const listApprovingId = ref(null);
    const listRejectingId = ref(null);
    const previewRef = ref(null);
    const blStatus = computed(() => {
      const s = activeBl.value?.status;
      const raw = activeBl.value?.statusRaw;
      if (!s) return "";
      if (typeof s === "string") {
        const lower = s.toLowerCase();
        if (lower === "finalized" || lower === "confirmed") return "confirmed";
        return lower;
      }
      const code = s.code?.toLowerCase() || "";
      if (code === "draft" && raw?.toLowerCase() === "finalized") return "confirmed";
      if (code === "pending_approval") return "pending_approval";
      return code;
    });
    const isDraft = computed(() => blStatus.value === "draft");
    const isPendingApproval = computed(() => blStatus.value === "pending_approval");
    const isFinalized = computed(
      () => blStatus.value === "finalized" || blStatus.value === "confirmed",
    );
    const editForm = ref({
      shipperId: "",
      shipperAddressId: "",
      consigneeId: "",
      consigneeAddressId: "",
      notifyPartyId: "",
      notifyPartyAddressId: "",
      forwarderId: "",
      forwarderAddressId: "",
      isNotifySameAsConsignee: false,
      mainDescription: "",
      commodity: "",
      hsCode: "",
      shippingMark: "",
      blNumber: "",
      blType: "DRAFT",
      freightTerm: "PREPAID",
      freightPayment: "",
      prepaidValue: "",
      collectValue: "",
      totalBlCount: 1,
      isNegotiable: false,
      placeOfIssue: "",
      dateOfIssue: "",
      dateCargoReceived: "",
      pol: "",
      pod: "",
      vesselId: "",
      voyageNumber: "",
      preCarriageBy: "",
      placeOfReceipt: "",
      placeOfDelivery: "",
      finalDestination: "",
      etd: "",
      eta: "",
      tradeTypeId: "EXPORT",
      cargoMovementId: "FCL_FCL",
      deliveryMovementId: "CY_CY",
      containers: [],
      vessels: [],
      shipperReferences: [],
      showShipperReferencesOnBl: true,
    });
    const jobData = computed(() => activeBl.value?.job || props.job);
    watch(
      () => editForm.value.containers,
      (containers) => {
        if (!containers || !Array.isArray(containers)) return;
        let totalGw = 0;
        let totalNw = 0;
        let totalCbm = 0;
        let hasItems = false;
        containers.forEach((container) => {
          if (container.items && Array.isArray(container.items)) {
            container.items.forEach((item) => {
              hasItems = true;
              totalGw += Number(item.grossWeight) || 0;
              totalNw += Number(item.netWeight) || 0;
              totalCbm += Number(item.measurementCbm) || 0;
            });
          }
        });
        if (hasItems && activeBl.value) {
          if (totalGw > 0) activeBl.value.totalGrossWeight = totalGw;
          if (totalNw > 0) activeBl.value.totalNetWeight = totalNw;
          if (totalCbm > 0) activeBl.value.totalMeasurementCbm = totalCbm;
        }
      },
      { deep: true },
    );
    const loadBlRender = async (blId) => {
      isRendering.value = true;
      try {
        const resp = await getBlRender(blId);
        if (resp.success && resp.data) {
          const data = resp.data;
          const mappedBl = data.bl || data;
          if (data.renderContainers) mappedBl.renderContainers = data.renderContainers;
          if (data.jobContainers) mappedBl.jobContainers = data.jobContainers;
          if (data.parties) mappedBl.renderParties = data.parties;
          if (data.mainDescription !== void 0) mappedBl.mainDescription = data.mainDescription;
          activeBl.value = mappedBl;
        }
      } finally {
        isRendering.value = false;
      }
    };
    watch(
      () => props.initialBlId,
      (newBlId) => {
        if (newBlId) {
          loadBlRender(newBlId);
        }
      },
      { immediate: true },
    );
    const handleRequestFinalize = async () => {
      if (!activeBl.value?.id) return;
      const isConfirmed = await confirm({
        title: "Request Finalization",
        message:
          "Are you sure you want to request finalization for this BL? It will be sent to the owner for approval.",
        confirmText: "Request Now",
        type: "info",
      });
      if (isConfirmed) {
        const resp = await requestFinalizeBl(activeBl.value.id);
        if (resp.success && resp.data) {
          toast.success("Finalization request sent!");
          await loadBlRender(activeBl.value.id);
        } else {
          toast.error(resp.error || "Failed to request finalization");
        }
      }
    };
    const handleFinalize = async () => {
      if (!activeBl.value || !jobData.value) return;
      const isConfirmed = await confirm({
        title: "Finalize Bill of Lading",
        message:
          "Are you sure you want to Finalize this BL? This action will assign a BL number and lock all details for further editing.",
        confirmText: "Finalize BL",
        type: "warning",
      });
      if (isConfirmed) {
        isFinalizing.value = true;
        const blId = activeBl.value.id || jobData.value.billsOfLading?.[0]?.id;
        const resp = await finalizeBl(blId);
        if (resp.success && resp.data) {
          toast.success("BL Finalized successfully");
          await loadBlRender(blId);
        } else {
          toast.error(resp.error || "Failed to finalize BL");
        }
        isFinalizing.value = false;
      }
    };
    const handleListApprove = async (id) => {
      listApprovingId.value = id;
      await loadBlRender(id);
      listApprovingId.value = null;
      await handleFinalize();
    };
    const handleListReject = async (id) => {
      listRejectingId.value = id;
      await loadBlRender(id);
      listRejectingId.value = null;
      await handleReject();
    };
    const handleReject = () => {
      if (!activeBl.value?.id) return;
      rejectReasonForm.value = "";
      showRejectModal.value = true;
    };
    const submitReject = async () => {
      if (!activeBl.value?.id || !rejectReasonForm.value.trim()) return;
      isRejecting.value = true;
      const resp = await rejectBl(activeBl.value.id, rejectReasonForm.value.trim());
      if (resp.success && resp.data) {
        toast.success("BL rejected and sent back to Draft.");
        showRejectModal.value = false;
        await loadBlRender(activeBl.value.id);
      } else {
        toast.error(resp.error || "Failed to reject BL");
      }
      isRejecting.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 relative" }, _attrs))}>`);
      _push(
        ssrRenderComponent(
          _component_UiModal,
          {
            modelValue: showRejectModal.value,
            "onUpdate:modelValue": ($event) => (showRejectModal.value = $event),
            width: "max-w-lg",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="p-4"${_scopeId}><div class="flex flex-col items-center text-center gap-4 py-4"${_scopeId}><div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(AlertTriangle),
                    { class: "w-6 h-6" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2 w-full"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Reject Bill of Lading</h3><p class="text-sm text-muted-foreground w-full mb-6"${_scopeId}> Please provide a reason for rejecting this BL. It will be reverted to Draft for revision. </p><div class="text-left w-full pt-2"${_scopeId}><label class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5"${_scopeId}> Rejection Reason <span class="text-red-500"${_scopeId}>*</span></label><textarea class="input-field min-h-[120px] py-3 resize-y transition-all duration-200" placeholder="E.g., Cargo description is incomplete"${_scopeId}>${ssrInterpolate(rejectReasonForm.value)}</textarea></div></div></div><div class="flex items-center gap-3 mt-4"${_scopeId}><button type="button" class="btn-secondary flex-1 justify-center"${ssrIncludeBooleanAttr(isRejecting.value) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button" class="btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 disabled:opacity-50"${ssrIncludeBooleanAttr(!rejectReasonForm.value.trim() || isRejecting.value) ? " disabled" : ""}${_scopeId}>`,
                );
                if (isRejecting.value) {
                  _push2(
                    ssrRenderComponent(
                      unref(Loader2),
                      { class: "w-4 h-4 animate-spin mr-2" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  ` ${ssrInterpolate(isRejecting.value ? "Rejecting..." : "Confirm Reject")}</button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "p-4" }, [
                    createVNode(
                      "div",
                      { class: "flex flex-col items-center text-center gap-4 py-4" },
                      [
                        createVNode(
                          "div",
                          {
                            class:
                              "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600",
                          },
                          [createVNode(unref(AlertTriangle), { class: "w-6 h-6" })],
                        ),
                        createVNode("div", { class: "space-y-2 w-full" }, [
                          createVNode(
                            "h3",
                            { class: "text-lg font-semibold" },
                            "Reject Bill of Lading",
                          ),
                          createVNode(
                            "p",
                            { class: "text-sm text-muted-foreground w-full mb-6" },
                            " Please provide a reason for rejecting this BL. It will be reverted to Draft for revision. ",
                          ),
                          createVNode("div", { class: "text-left w-full pt-2" }, [
                            createVNode(
                              "label",
                              {
                                class:
                                  "block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5",
                              },
                              [
                                createTextVNode(" Rejection Reason "),
                                createVNode("span", { class: "text-red-500" }, "*"),
                              ],
                            ),
                            withDirectives(
                              createVNode(
                                "textarea",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (rejectReasonForm.value = $event),
                                  class:
                                    "input-field min-h-[120px] py-3 resize-y transition-all duration-200",
                                  placeholder: "E.g., Cargo description is incomplete",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, rejectReasonForm.value]],
                            ),
                          ]),
                        ]),
                      ],
                    ),
                    createVNode("div", { class: "flex items-center gap-3 mt-4" }, [
                      createVNode(
                        "button",
                        {
                          type: "button",
                          class: "btn-secondary flex-1 justify-center",
                          onClick: ($event) => (showRejectModal.value = false),
                          disabled: isRejecting.value,
                        },
                        " Cancel ",
                        8,
                        ["onClick", "disabled"],
                      ),
                      createVNode(
                        "button",
                        {
                          type: "button",
                          class:
                            "btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 disabled:opacity-50",
                          onClick: submitReject,
                          disabled: !rejectReasonForm.value.trim() || isRejecting.value,
                        },
                        [
                          isRejecting.value
                            ? (openBlock(),
                              createBlock(unref(Loader2), {
                                key: 0,
                                class: "w-4 h-4 animate-spin mr-2",
                              }))
                            : createCommentVNode("", true),
                          createTextVNode(
                            " " +
                              toDisplayString(
                                isRejecting.value ? "Rejecting..." : "Confirm Reject",
                              ),
                            1,
                          ),
                        ],
                        8,
                        ["disabled"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _component_UiModal,
          {
            modelValue: showRejectReason.value,
            "onUpdate:modelValue": ($event) => (showRejectReason.value = $event),
            width: "max-w-md",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="p-4"${_scopeId}><div class="flex flex-col items-center text-center gap-4 py-4"${_scopeId}><div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(AlertTriangle),
                    { class: "w-6 h-6" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2 w-full"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Rejection Reason</h3><p class="text-sm text-muted-foreground w-full mb-6"${_scopeId}> This Bill of Lading was rejected for the following reason: </p><div class="text-left w-full pt-2"${_scopeId}><div class="w-full min-h-[80px] text-sm p-3 bg-muted/30 border border-border rounded-md text-foreground whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(activeBl.value?.rejectReason)}</div></div></div></div><div class="flex justify-center mt-4 w-full"${_scopeId}><button type="button" class="btn-secondary px-8 justify-center w-full"${_scopeId}> Close </button></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "p-4" }, [
                    createVNode(
                      "div",
                      { class: "flex flex-col items-center text-center gap-4 py-4" },
                      [
                        createVNode(
                          "div",
                          {
                            class:
                              "w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600",
                          },
                          [createVNode(unref(AlertTriangle), { class: "w-6 h-6" })],
                        ),
                        createVNode("div", { class: "space-y-2 w-full" }, [
                          createVNode("h3", { class: "text-lg font-semibold" }, "Rejection Reason"),
                          createVNode(
                            "p",
                            { class: "text-sm text-muted-foreground w-full mb-6" },
                            " This Bill of Lading was rejected for the following reason: ",
                          ),
                          createVNode("div", { class: "text-left w-full pt-2" }, [
                            createVNode(
                              "div",
                              {
                                class:
                                  "w-full min-h-[80px] text-sm p-3 bg-muted/30 border border-border rounded-md text-foreground whitespace-pre-wrap",
                              },
                              toDisplayString(activeBl.value?.rejectReason),
                              1,
                            ),
                          ]),
                        ]),
                      ],
                    ),
                    createVNode("div", { class: "flex justify-center mt-4 w-full" }, [
                      createVNode(
                        "button",
                        {
                          type: "button",
                          class: "btn-secondary px-8 justify-center w-full",
                          onClick: ($event) => (showRejectReason.value = false),
                        },
                        " Close ",
                        8,
                        ["onClick"],
                      ),
                    ]),
                  ]),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      if (!activeBl.value) {
        _push(
          ssrRenderComponent(
            JobEblList,
            {
              job: __props.job,
              "approving-id": listApprovingId.value,
              "rejecting-id": listRejectingId.value,
              onSelect: loadBlRender,
              onApprove: handleListApprove,
              onReject: handleListReject,
              onRequestFinalize: async (id) => {
                await loadBlRender(id);
                await handleRequestFinalize();
              },
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(
          `<!--[--><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"><div class="flex items-start gap-4"><button class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5">`,
        );
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent));
        _push(
          `</button><div class="flex flex-col gap-2 mt-1"><h1 class="text-2xl font-bold text-foreground leading-none">${ssrInterpolate(activeBl.value?.blNumber || "Bill of Lading Details")}</h1><p class="text-sm text-muted-foreground leading-none mb-1"> Review and manage your bill of lading details </p><div class="flex items-center gap-3">`,
        );
        if (activeBl.value?.status) {
          _push(
            `<span class="${ssrRenderClass([
              {
                "bg-emerald-50 text-emerald-600 border-emerald-100": isFinalized.value,
                "bg-amber-50 text-amber-600 border-amber-100":
                  isDraft.value && !activeBl.value.rejectReason,
                "bg-red-50 text-red-600 border-red-100":
                  isDraft.value && !!activeBl.value.rejectReason,
                "bg-blue-50 text-blue-600 border-blue-100": isPendingApproval.value,
              },
              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit",
            ])}">${ssrInterpolate(isFinalized.value ? "Finalized" : isPendingApproval.value ? "Pending Approval" : isDraft.value && activeBl.value.rejectReason ? "Revision Required" : typeof activeBl.value.status === "string" ? activeBl.value.status : activeBl.value.status.name || activeBl.value.status.code)}</span>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (isDraft.value && activeBl.value?.rejectReason) {
          _push(
            `<button class="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 bg-red-50/50 hover:bg-red-50 px-2 py-1 rounded-md border border-transparent hover:border-red-100 transition-colors">`,
          );
          _push(ssrRenderComponent(unref(Info), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` View Reason </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div></div></div><div class="flex flex-wrap items-center justify-end gap-3 shrink-0">`,
        );
        if (isFinalized.value) {
          _push(
            `<button${ssrIncludeBooleanAttr(isRendering.value) ? " disabled" : ""} class="px-4 py-2 text-xs font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 shadow-sm transition-colors">`,
          );
          _push(ssrRenderComponent(unref(RotateCcw), { class: "w-4 h-4" }, null, _parent));
          _push(` Batal Finalized </button>`);
        } else {
          _push(`<!---->`);
        }
        if (isDraft.value || (isPendingApproval.value && unref(canApproveJobs))) {
          _push(
            `<button${ssrIncludeBooleanAttr(isRendering.value) ? " disabled" : ""} class="px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors">`,
          );
          if (editMode.value) {
            _push(ssrRenderComponent(unref(X), { class: "w-3.5 h-3.5" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Edit), { class: "w-3.5 h-3.5" }, null, _parent));
          }
          _push(` ${ssrInterpolate(editMode.value ? "Cancel Edit" : "Edit BL")}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (isDraft.value && !editMode.value) {
          _push(
            `<button${ssrIncludeBooleanAttr(isRendering.value) ? " disabled" : ""} class="px-4 py-2 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2">`,
          );
          _push(ssrRenderComponent(unref(Send), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` Request Finalize </button>`);
        } else {
          _push(`<!---->`);
        }
        if (isPendingApproval.value && !editMode.value && unref(canApproveJobs)) {
          _push(
            `<button${ssrIncludeBooleanAttr(isRendering.value || isRejecting.value) ? " disabled" : ""} class="px-4 py-2 text-xs font-semibold rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-2 shadow-sm transition-colors">`,
          );
          if (isRejecting.value) {
            _push(
              ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent),
            );
          } else {
            _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
          }
          _push(
            ` ${ssrInterpolate(isRejecting.value ? "REJECTING..." : "REJECT / REVISE")}</button>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (isPendingApproval.value && !editMode.value && unref(canApproveJobs)) {
          _push(
            `<button${ssrIncludeBooleanAttr(isRendering.value || isFinalizing.value) ? " disabled" : ""} class="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50">`,
          );
          if (isFinalizing.value) {
            _push(
              ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent),
            );
          } else {
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-4 h-4" }, null, _parent));
          }
          _push(
            ` ${ssrInterpolate(isFinalizing.value ? "APPROVING..." : "APPROVE & FINALIZE")}</button>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (isPendingApproval.value && !unref(canApproveJobs)) {
          _push(
            `<div class="px-4 py-2 text-xs font-semibold rounded-md border border-blue-100 bg-blue-50/50 text-blue-400 flex items-center gap-2 cursor-not-allowed"> Awaiting Approval </div>`,
          );
        } else {
          _push(`<!---->`);
        }
        if (editMode.value) {
          _push(
            `<button${ssrIncludeBooleanAttr(isSavingDraft.value) ? " disabled" : ""} class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors">`,
          );
          if (!isSavingDraft.value) {
            _push(ssrRenderComponent(unref(Save), { class: "w-3.5 h-3.5" }, null, _parent));
          } else {
            _push(
              ssrRenderComponent(
                unref(Loader2),
                { class: "w-3.5 h-3.5 animate-spin" },
                null,
                _parent,
              ),
            );
          }
          _push(` ${ssrInterpolate(isSavingDraft.value ? "Saving..." : "Save Draft")}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (!editMode.value) {
          _push(
            `<button${ssrIncludeBooleanAttr(isGeneratingPDF.value || !jobData.value) ? " disabled" : ""} class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50">`,
          );
          if (isGeneratingPDF.value) {
            _push(
              ssrRenderComponent(
                unref(Loader2),
                { class: "w-3.5 h-3.5 animate-spin" },
                null,
                _parent,
              ),
            );
          } else {
            _push(ssrRenderComponent(unref(Download), { class: "w-3.5 h-3.5" }, null, _parent));
          }
          _push(
            ` ${ssrInterpolate(isGeneratingPDF.value ? "Generating..." : "Download PDF")}</button>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (activeBl.value?.revisionCount || activeBl.value?.finalizeRequestCount) {
          _push(
            `<div class="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/20 border border-border/50 rounded-lg p-3 mb-6"><span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 shrink-0">`,
          );
          _push(ssrRenderComponent(unref(Info), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` BL History: </span><div class="flex flex-wrap items-center gap-2">`);
          if (activeBl.value?.revisionCount) {
            _push(
              `<div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#012D5A] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 shadow-sm" title="Number of times this BL was revised">`,
            );
            _push(ssrRenderComponent(unref(RotateCcw), { class: "w-3 h-3" }, null, _parent));
            _push(` ${ssrInterpolate(activeBl.value.revisionCount)}x Revised </div>`);
          } else {
            _push(`<!---->`);
          }
          if (activeBl.value?.finalizeRequestCount) {
            _push(
              `<div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm" title="Number of times finalization was requested">`,
            );
            _push(ssrRenderComponent(unref(Send), { class: "w-3 h-3" }, null, _parent));
            _push(` ${ssrInterpolate(activeBl.value.finalizeRequestCount)}x Requested </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (editMode.value) {
          _push(`<div class="w-full relative"><div class="flex-1 w-full min-w-0">`);
          _push(
            ssrRenderComponent(
              JobEblEditForm,
              {
                modelValue: editForm.value,
                "onUpdate:modelValue": ($event) => (editForm.value = $event),
                jobData: jobData.value,
              },
              null,
              _parent,
            ),
          );
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(
          ssrRenderComponent(
            JobEblPreview,
            {
              style: !editMode.value ? null : { display: "none" },
              ref_key: "previewRef",
              ref: previewRef,
              jobData: jobData.value,
              activeBl: activeBl.value,
            },
            null,
            _parent,
          ),
        );
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobEblTab.vue",
  );
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const JobEblTab = Object.assign(_sfc_main$2, { __name: "OperationalJobEblTab" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "JobDocumentTab",
  __ssrInlineRender: true,
  props: {
    jobId: {},
  },
  setup(__props) {
    useJobs();
    useConfirm();
    const uploadedDocuments = ref([]);
    const isLoading = ref(true);
    ref(false);
    const isDragging = ref(false);
    const previewDoc = ref(null);
    const formatSize = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between border-b border-border pb-4"><div><h3 class="text-lg font-bold text-foreground">External Documents</h3><p class="text-sm text-muted-foreground mt-1"> Upload and manage related documents for this job. </p></div></div><div class="${ssrRenderClass(
          [
            isDragging.value
              ? "border-[#012D5A] bg-[#012D5A]/5 scale-[1.02]"
              : "border-border bg-gray-50/50 hover:bg-gray-50",
            "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4",
          ],
        )}"><div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2 shadow-sm border border-blue-100">`,
      );
      _push(
        ssrRenderComponent(unref(UploadCloud), { class: "w-8 h-8 text-[#012D5A]" }, null, _parent),
      );
      _push(
        `</div><div><p class="text-base font-bold text-foreground mb-1">Drag &amp; drop files here</p><p class="text-sm text-muted-foreground">or click to browse from your computer</p></div><label class="px-5 py-2.5 bg-[#012D5A] text-white text-sm font-semibold rounded-lg hover:bg-[#012D5A]/90 cursor-pointer transition-colors shadow-sm mt-4 inline-flex items-center gap-2"> Browse Files <input type="file" multiple class="hidden"></label></div>`,
      );
      if (isLoading.value) {
        _push(`<div class="flex justify-center p-8">`);
        _push(
          ssrRenderComponent(
            unref(Loader2),
            { class: "w-6 h-6 animate-spin text-[#012D5A]" },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (uploadedDocuments.value.length > 0) {
        _push(
          `<div class="space-y-4 mt-8"><div class="flex items-center justify-between"><h4 class="text-sm font-bold text-foreground uppercase tracking-wider"> Uploaded Files <span class="ml-2 px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">${ssrInterpolate(uploadedDocuments.value.length)}</span></h4></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`,
        );
        ssrRenderList(uploadedDocuments.value, (file, idx) => {
          _push(
            `<div class="flex items-center justify-between p-4 bg-white border border-border rounded-xl shadow-sm group hover:border-[#012D5A]/30 transition-all hover:shadow-md"><div class="flex items-center gap-4 min-w-0"><div class="w-10 h-10 rounded-lg bg-blue-50/80 flex items-center justify-center shrink-0 border border-blue-100">`,
          );
          _push(
            ssrRenderComponent(unref(FileText), { class: "w-5 h-5 text-[#012D5A]" }, null, _parent),
          );
          _push(
            `</div><div class="min-w-0"><p class="text-sm font-bold text-foreground truncate">${ssrInterpolate(file.fileName)}</p><p class="text-xs font-medium text-muted-foreground mt-0.5">${ssrInterpolate(formatSize(file.fileSize))}</p></div></div><div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-2 text-muted-foreground hover:text-[#012D5A] transition-colors rounded-lg hover:bg-blue-50" title="Preview">`,
          );
          _push(ssrRenderComponent(unref(Eye), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button><button class="p-2 text-muted-foreground hover:text-[#012D5A] transition-colors rounded-lg hover:bg-blue-50" title="Download">`,
          );
          _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
          _push(
            `</button><button class="p-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Remove">`,
          );
          _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(
          `<div class="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-border mt-8"><div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">`,
        );
        _push(
          ssrRenderComponent(
            unref(FileText),
            { class: "w-6 h-6 text-muted-foreground opacity-60" },
            null,
            _parent,
          ),
        );
        _push(
          `</div><p class="text-sm font-medium text-foreground mb-1">No documents uploaded yet</p><p class="text-xs text-muted-foreground">Files you upload will appear here.</p></div>`,
        );
      }
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (previewDoc.value) {
            _push2(
              `<div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div class="bg-white rounded-xl shadow-xl w-[90vw] max-w-[1400px] max-h-[95vh] h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"><div class="flex items-center justify-between p-4 border-b border-border"><h3 class="font-bold text-lg text-foreground truncate pl-2 mr-4 flex-1">${ssrInterpolate(previewDoc.value.fileName)}</h3><div class="flex items-center gap-2"><button class="p-2 hover:bg-gray-100 rounded-lg shrink-0 transition-colors" title="Download">`,
            );
            _push2(
              ssrRenderComponent(
                unref(Download),
                { class: "w-5 h-5 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push2(
              `</button><button class="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg shrink-0 transition-colors" title="Close">`,
            );
            _push2(
              ssrRenderComponent(
                unref(X),
                { class: "w-5 h-5 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push2(
              `</button></div></div><div class="p-4 flex-1 overflow-auto bg-gray-50/50 flex justify-center items-center min-h-[500px]">`,
            );
            if (previewDoc.value.fileType.startsWith("image/")) {
              _push2(
                `<img${ssrRenderAttr("src", previewDoc.value.fileUrl)} class="max-w-full max-h-full object-contain rounded-lg shadow-sm">`,
              );
            } else if (previewDoc.value.fileType === "application/pdf") {
              _push2(
                `<iframe${ssrRenderAttr("src", previewDoc.value.fileUrl)} class="w-full h-full min-h-[70vh] border border-border rounded-lg shadow-sm bg-white"></iframe>`,
              );
            } else {
              _push2(
                `<div class="text-center p-8 bg-white border border-border rounded-xl shadow-sm">`,
              );
              _push2(
                ssrRenderComponent(
                  unref(FileText),
                  { class: "w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" },
                  null,
                  _parent,
                ),
              );
              _push2(
                `<p class="text-foreground font-medium text-lg">No preview available</p><p class="text-muted-foreground text-sm mt-1"> This file type cannot be previewed directly. </p><button class="mt-6 px-4 py-2 bg-[#012D5A] text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#012D5A]/90 transition-colors shadow-sm">`,
              );
              _push2(ssrRenderComponent(unref(Download), { class: "w-4 h-4" }, null, _parent));
              _push2(` Download File </button></div>`);
            }
            _push2(`</div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        },
        "body",
        false,
        _parent,
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobDocumentTab.vue",
  );
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const JobDocumentTab = Object.assign(_sfc_main$1, { __name: "OperationalJobDocumentTab" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobDetailSlideOver",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    jobId: {},
    initialTab: {},
    initialBlId: {},
    initialInvoiceId: {},
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    useAuth();
    const props = __props;
    const { currentJob, getJob, isLoading } = useJobs();
    const activeTab = ref("overview");
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "ebl", label: "eBL" },
      { id: "invoice", label: "Billing" },
      { id: "document", label: "Upload Document" },
    ];
    useJobs();
    const { fetchVessels, createVessel } = useMasterData();
    const { confirm } = useConfirm();
    const isEditingVessels = ref(false);
    const editableVessels = ref([]);
    const masterVessels = ref([]);
    const refreshMasterData = async () => {
      masterVessels.value = await fetchVessels();
    };
    const handleCreateVessel = async (name, vessel) => {
      const isConfirmed = await confirm({
        title: "Create New Vessel",
        message: `Are you sure you want to create a new vessel named "${name}"?`,
        confirmText: "Create Vessel",
        type: "info",
      });
      if (!isConfirmed) return;
      const result = await createVessel(name);
      if (result.success && result.data) {
        await refreshMasterData();
        if (vessel) {
          vessel.vesselId = result.data.id;
        }
        toast.success(`Vessel "${name}" created successfully.`);
      } else {
        toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
      }
    };
    const job = computed(() => currentJob.value);
    watch(
      () => props.modelValue,
      async (isOpen) => {
        if (isOpen && props.jobId) {
          activeTab.value = props.initialTab || "overview";
          await Promise.all([getJob(props.jobId), refreshMasterData()]);
        }
      },
      { immediate: true },
    );
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        return new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(dateString));
      } catch (e) {
        return dateString;
      }
    };
    const formatDateTime = (dateString) => {
      if (!dateString) return "-";
      try {
        return new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(dateString));
      } catch (e) {
        return dateString;
      }
    };
    const getCustomerName = computed(
      () => job.value?.customer?.name || job.value?.customerId || "CUST-001",
    );
    const getStatusName = computed(() => {
      const name = job.value?.status?.name || "Not Invoiced";
      return name.toUpperCase() === "CONFIRMED" ? "FINALIZED" : name;
    });
    const getJobTypeName = computed(
      () => job.value?.tradeType?.name || job.value?.tradeTypeId || "Export",
    );
    computed(() => job.value?.vessel?.name || job.value?.vesselId || "-");
    computed(() => job.value?.service?.name || job.value?.serviceId || "Ocean Freight");
    const getVendorName = computed(() => job.value?.vendor?.name || "PT Nova Sync Continent");
    const getPol = computed(() => {
      if (!job.value?.pol) return "-";
      if (job.value.polName) return `${job.value.polName} (${job.value.pol})`;
      return job.value.pol;
    });
    const getPod = computed(() => {
      if (!job.value?.pod) return "-";
      if (job.value.podName) return `${job.value.podName} (${job.value.pod})`;
      return job.value.pod;
    });
    computed(() => job.value?.totalBlCount || 2);
    const getPartyAddress = (roleCode) => {
      const party = job.value?.jobParties?.find((p) => p.partyRole?.code === roleCode);
      if (!party) return "-";
      if (party.addressBook?.fullAddress) {
        return party.addressBook.fullAddress;
      }
      if (roleCode === "SHIPPER")
        return "No. 88 Jinxiu Road, Pudong new District\nShanghai China 200120";
      if (roleCode === "CONSIGNEE")
        return "No. 88 Jinxiu Road, Pudong new District\nLos Angeles US 200120";
      return "-";
    };
    const expandedItems = ref(/* @__PURE__ */ new Set());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutList = resolveComponent("LayoutList");
      const _component_NuxtLink = __nuxt_component_0;
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (__props.modelValue) {
            _push2(
              `<div class="fixed inset-0 z-[1050] flex justify-end" data-v-99f265b2><div class="absolute inset-0 bg-black/40 transition-opacity" data-v-99f265b2></div><div class="slide-panel relative w-full md:max-w-5xl bg-white h-full shadow-2xl flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]" data-v-99f265b2><div class="px-4 sm:px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20" data-v-99f265b2><div class="flex items-center gap-2 text-sm text-muted-foreground font-medium" data-v-99f265b2> Job <span class="mx-1" data-v-99f265b2>›</span><span class="text-foreground" data-v-99f265b2>${ssrInterpolate(unref(job)?.jobNumber || "...")}</span></div><div class="flex items-center gap-2" data-v-99f265b2><button class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" data-v-99f265b2>`,
            );
            _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
            _push2(`</button></div></div>`);
            if (unref(isLoading)) {
              _push2(`<div class="flex-1 flex items-center justify-center" data-v-99f265b2>`);
              _push2(
                ssrRenderComponent(
                  unref(Loader2),
                  { class: "w-8 h-8 animate-spin text-primary" },
                  null,
                  _parent,
                ),
              );
              _push2(`</div>`);
            } else if (unref(job)) {
              _push2(
                `<div class="flex-1 flex flex-col min-h-0" data-v-99f265b2><div class="flex-1 overflow-y-auto" data-v-99f265b2><div class="px-5 sm:px-8 py-6 pb-2" data-v-99f265b2><h2 class="text-xl sm:text-2xl font-bold text-foreground mb-1" data-v-99f265b2>${ssrInterpolate(unref(job).jobNumber)}</h2><p class="text-xs sm:text-sm text-muted-foreground mb-6" data-v-99f265b2>${ssrInterpolate(unref(getCustomerName))}</p><div class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-sm" data-v-99f265b2><div class="flex items-center gap-2 text-muted-foreground" data-v-99f265b2>`,
              );
              _push2(
                ssrRenderComponent(unref(Calendar), { class: "w-4 h-4 shrink-0" }, null, _parent),
              );
              _push2(
                `<span class="whitespace-nowrap" data-v-99f265b2>Created Time</span></div><div class="font-medium pl-6 sm:pl-0" data-v-99f265b2>${ssrInterpolate(formatDateTime(unref(job).createdAt))}</div><div class="flex items-center gap-2 text-muted-foreground" data-v-99f265b2>`,
              );
              _push2(
                ssrRenderComponent(unref(Settings), { class: "w-4 h-4 shrink-0" }, null, _parent),
              );
              _push2(
                `<span class="whitespace-nowrap" data-v-99f265b2>Status</span></div><div class="pl-6 sm:pl-0" data-v-99f265b2><span class="inline-flex items-center px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold leading-none bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase" data-v-99f265b2>${ssrInterpolate(unref(getStatusName))}</span></div><div class="flex items-center gap-2 text-muted-foreground" data-v-99f265b2>`,
              );
              _push2(
                ssrRenderComponent(
                  unref(CheckCircle2),
                  { class: "w-4 h-4 shrink-0" },
                  null,
                  _parent,
                ),
              );
              _push2(
                `<span class="whitespace-nowrap" data-v-99f265b2>Job Type</span></div><div class="pl-6 sm:pl-0" data-v-99f265b2><span class="inline-flex items-center px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold leading-none bg-blue-50 text-blue-700 border border-blue-200 uppercase" data-v-99f265b2>${ssrInterpolate(unref(getJobTypeName))}</span></div><div class="flex items-center gap-2 text-muted-foreground" data-v-99f265b2>`,
              );
              _push2(
                ssrRenderComponent(
                  unref(CalendarClock),
                  { class: "w-4 h-4 shrink-0" },
                  null,
                  _parent,
                ),
              );
              _push2(
                `<span class="whitespace-nowrap" data-v-99f265b2>ETD - ETA</span></div><div class="font-medium pl-6 sm:pl-0 whitespace-nowrap overflow-x-auto" data-v-99f265b2>${ssrInterpolate(formatDate(unref(job).etd))} - ${ssrInterpolate(formatDate(unref(job).eta))}</div></div></div><div class="px-5 sm:px-8 mt-6 pt-4 border-b border-border flex gap-4 sm:gap-6 sticky top-0 bg-white z-10 overflow-x-auto scrollbar-hide" data-v-99f265b2><!--[-->`,
              );
              ssrRenderList(tabs, (tab) => {
                _push2(
                  `<button class="${ssrRenderClass([
                    unref(activeTab) === tab.id
                      ? "text-[#012D5A]"
                      : "text-muted-foreground hover:text-foreground",
                    "pb-3 text-xs sm:text-sm font-semibold transition-colors relative shrink-0 whitespace-nowrap",
                  ])}" data-v-99f265b2>${ssrInterpolate(tab.label)} `,
                );
                if (unref(activeTab) === tab.id) {
                  _push2(
                    `<div class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#012D5A] rounded-t-full" data-v-99f265b2></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</button>`);
              });
              _push2(`<!--]--></div><div class="px-5 sm:p-8 py-8 sm:py-8" data-v-99f265b2>`);
              if (unref(activeTab) === "overview") {
                _push2(
                  `<div class="space-y-8 animate-fade-in" data-v-99f265b2><section data-v-99f265b2><h3 class="text-base font-bold flex items-center gap-2" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    _component_LayoutList,
                    { class: "w-4 h-4 text-[#012D5A]" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  ` Shipments Details </h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-6" data-v-99f265b2><div class="flex gap-4 items-center" data-v-99f265b2><div class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Building2),
                    { class: "w-5 h-5 text-[#012D5A]/80" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  `</div><div data-v-99f265b2><p class="text-xs text-muted-foreground mb-0.5" data-v-99f265b2>Port of Landing</p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(unref(getPol))}</p></div></div><div class="flex gap-4 items-center" data-v-99f265b2><div class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Building2),
                    { class: "w-5 h-5 text-[#012D5A]/80" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  `</div><div data-v-99f265b2><p class="text-xs text-muted-foreground mb-0.5" data-v-99f265b2>Port of Discharge</p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(unref(getPod))}</p></div></div><div class="flex gap-4 items-start col-span-2" data-v-99f265b2><div class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Ship),
                    { class: "w-5 h-5 text-[#012D5A]/80" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  `</div><div class="flex-1" data-v-99f265b2><div class="flex items-center justify-between mb-2" data-v-99f265b2><p class="text-xs text-muted-foreground uppercase font-bold tracking-wider" data-v-99f265b2> Vessel Schedule </p>`,
                );
                if (!unref(isEditingVessels)) {
                  _push2(
                    `<div class="flex items-center gap-2" data-v-99f265b2><button class="p-1.5 rounded-md hover:bg-blue-50 text-[#012D5A] transition-colors" title="Edit Schedule" data-v-99f265b2>`,
                  );
                  _push2(ssrRenderComponent(unref(Edit), { class: "w-3.5 h-3.5" }, null, _parent));
                  _push2(`</button></div>`);
                } else {
                  _push2(
                    `<div class="flex items-center gap-2" data-v-99f265b2><button class="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold uppercase tracking-wider" data-v-99f265b2>`,
                  );
                  _push2(ssrRenderComponent(unref(Plus), { class: "w-3 h-3" }, null, _parent));
                  _push2(
                    ` Add </button><button class="p-1.5 rounded-md bg-[#012D5A] text-white hover:bg-[#012D5A]/90 transition-colors" title="Save Changes" data-v-99f265b2>`,
                  );
                  _push2(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5" }, null, _parent));
                  _push2(
                    `</button><button class="p-1.5 rounded-md hover:bg-gray-100 text-muted-foreground transition-colors" title="Cancel" data-v-99f265b2>`,
                  );
                  _push2(ssrRenderComponent(unref(X), { class: "w-3.5 h-3.5" }, null, _parent));
                  _push2(`</button></div>`);
                }
                _push2(`</div>`);
                if (!unref(isEditingVessels)) {
                  _push2(`<div class="space-y-3" data-v-99f265b2><!--[-->`);
                  ssrRenderList(unref(job).vessels, (vessel, idx) => {
                    _push2(
                      `<div class="flex items-center justify-between group" data-v-99f265b2><div class="flex items-center gap-3" data-v-99f265b2><div class="w-6 h-6 rounded bg-[#012D5A] text-white flex items-center justify-center text-[10px] font-bold" data-v-99f265b2>${ssrInterpolate(idx + 1)}</div><div data-v-99f265b2><p class="font-bold text-sm text-foreground leading-tight" data-v-99f265b2>${ssrInterpolate(vessel.vesselName || vessel.vessel?.name || "Unknown Vessel")}</p><p class="text-[11px] text-muted-foreground" data-v-99f265b2> Voyage: ${ssrInterpolate(vessel.voyageNumber || "-")}</p></div></div><div class="text-right" data-v-99f265b2><p class="text-[11px] font-bold text-primary uppercase tracking-tighter" data-v-99f265b2> ETD </p><p class="text-xs font-semibold text-foreground" data-v-99f265b2>${ssrInterpolate(formatDate(vessel.etd))}</p></div></div>`,
                    );
                  });
                  _push2(`<!--]-->`);
                  if (!unref(job).vessels || unref(job).vessels.length === 0) {
                    _push2(
                      `<div class="text-sm font-medium text-muted-foreground italic" data-v-99f265b2> No vessels assigned </div>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<div class="space-y-4" data-v-99f265b2><!--[-->`);
                  ssrRenderList(unref(editableVessels), (vessel, idx) => {
                    _push2(
                      `<div class="p-3 bg-gray-50/50 rounded-lg border border-border space-y-3 relative group" data-v-99f265b2><button class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10" data-v-99f265b2>`,
                    );
                    _push2(ssrRenderComponent(unref(Trash2), { class: "w-3 h-3" }, null, _parent));
                    _push2(
                      `</button><div class="grid grid-cols-1 gap-3" data-v-99f265b2><div data-v-99f265b2><label class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block" data-v-99f265b2>Vessel Name</label>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        Combobox,
                        {
                          modelValue: vessel.vesselId,
                          "onUpdate:modelValue": ($event) => (vessel.vesselId = $event),
                          options: unref(masterVessels),
                          "label-key": "name",
                          "value-key": "id",
                          placeholder: "Search Vessel...",
                          "allow-create": "",
                          onCreate: (name) => handleCreateVessel(name, vessel),
                          class: "h-8",
                        },
                        null,
                        _parent,
                      ),
                    );
                    _push2(
                      `</div><div class="grid grid-cols-2 gap-3" data-v-99f265b2><div data-v-99f265b2><label class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block" data-v-99f265b2>Voyage</label><input${ssrRenderAttr("value", vessel.voyageNumber)} type="text" class="w-full h-8 px-2 text-xs rounded border border-border focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Voyage..." data-v-99f265b2></div><div data-v-99f265b2><label class="text-[9px] font-bold text-muted-foreground uppercase mb-1 block" data-v-99f265b2>ETD</label>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        DatePicker,
                        {
                          modelValue: vessel.etd,
                          "onUpdate:modelValue": ($event) => (vessel.etd = $event),
                          placeholder: "ETD...",
                          class: "h-8 shadow-none",
                        },
                        null,
                        _parent,
                      ),
                    );
                    _push2(`</div></div></div></div>`);
                  });
                  _push2(`<!--]-->`);
                  if (unref(editableVessels).length === 0) {
                    _push2(
                      `<div class="text-xs text-center py-4 text-muted-foreground italic bg-gray-50 border border-dashed border-border rounded-lg" data-v-99f265b2> Click &quot;Add&quot; to add a vessel to the schedule </div>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                }
                _push2(
                  `</div></div><div class="flex gap-4 items-center" data-v-99f265b2><div class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Mail),
                    { class: "w-5 h-5 text-[#012D5A]/80" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  `</div><div data-v-99f265b2><p class="text-xs text-muted-foreground mb-0.5" data-v-99f265b2>Shipping Line</p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(unref(getVendorName))}</p></div></div></div></section><section data-v-99f265b2><h3 class="text-base font-bold flex items-center gap-2 mb-4" data-v-99f265b2>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Building2),
                    { class: "w-4 h-4 text-[#012D5A]" },
                    null,
                    _parent,
                  ),
                );
                _push2(
                  ` Involved Parties </h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" data-v-99f265b2><!--[-->`,
                );
                ssrRenderList(unref(job).jobParties, (party) => {
                  _push2(
                    `<div class="p-5 rounded-xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow" data-v-99f265b2><p class="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider" data-v-99f265b2>${ssrInterpolate(party.partyRole?.name || party.partyRoleId)}</p><p class="font-bold text-base text-foreground mb-2" data-v-99f265b2>${ssrInterpolate(party.companyName || party.company?.name || "-")}</p>`,
                  );
                  if (
                    party.addressBook?.fullAddress ||
                    party.partyRole?.code === "SHIPPER" ||
                    party.partyRole?.code === "CONSIGNEE"
                  ) {
                    _push2(
                      `<p class="text-xs text-muted-foreground leading-relaxed whitespace-pre-line" data-v-99f265b2>${ssrInterpolate(getPartyAddress(party.partyRole?.code || ""))}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]-->`);
                if (!unref(job).jobParties || unref(job).jobParties.length === 0) {
                  _push2(
                    `<div class="col-span-2 p-8 text-muted-foreground text-center bg-gray-50/50 rounded-xl border border-dashed border-border" data-v-99f265b2> No parties assigned to this job yet. </div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `</div></section><section data-v-99f265b2><h3 class="text-base font-bold" data-v-99f265b2>Container</h3><div class="space-y-4 mt-4" data-v-99f265b2><!--[-->`,
                );
                ssrRenderList(unref(job).jobContainers, (container) => {
                  _push2(
                    `<div class="border border-border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow" data-v-99f265b2><div class="flex items-start justify-between mb-8" data-v-99f265b2><div class="flex gap-4 items-center" data-v-99f265b2><div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100" data-v-99f265b2>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(Box),
                      { class: "w-6 h-6 text-gray-700" },
                      null,
                      _parent,
                    ),
                  );
                  _push2(
                    `</div><div data-v-99f265b2><h3 class="font-bold text-base text-foreground" data-v-99f265b2>${ssrInterpolate(container.containerNumber || "MSKU9081234")}</h3><p class="text-xs text-muted-foreground mt-0.5" data-v-99f265b2> Seal: ${ssrInterpolate(container.sealNumber || "ML-882211")}</p></div></div><span class="px-2.5 py-1 bg-gray-100/80 text-gray-700 rounded text-xs font-semibold tracking-wide border border-gray-200" data-v-99f265b2>${ssrInterpolate(container.containerType?.name || container.containerTypeId || "")}</span></div><div class="grid grid-cols-3 divide-x divide-border mt-4 border-t border-border pt-6" data-v-99f265b2><div class="text-center" data-v-99f265b2><p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide" data-v-99f265b2> Packages </p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(container.totalQty || "1")}</p></div><div class="text-center" data-v-99f265b2><p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide" data-v-99f265b2> Gross Weight </p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(container.totalGrossWeight || "-")} KGS </p></div><div class="text-center" data-v-99f265b2><p class="text-xs text-muted-foreground mb-1.5 font-medium tracking-wide" data-v-99f265b2> Measurement </p><p class="font-bold text-sm text-foreground" data-v-99f265b2>${ssrInterpolate(container.totalMeasurementCbm || "-")} CBM </p></div></div>`,
                  );
                  if (container.items && container.items.length > 0) {
                    _push2(
                      `<div class="mt-6 border-t border-border pt-5" data-v-99f265b2><div class="flex items-center justify-between mb-4" data-v-99f265b2><p class="text-xs font-bold text-muted-foreground tracking-widest uppercase" data-v-99f265b2> Item Breakdown </p><span class="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium" data-v-99f265b2>${ssrInterpolate(container.items.length)} Items </span></div><div class="space-y-3" data-v-99f265b2><!--[-->`,
                    );
                    ssrRenderList(container.items, (item, idx) => {
                      _push2(
                        `<div class="group relative flex flex-col p-4 bg-gray-50/40 border border-border rounded-xl transition-all hover:bg-white hover:shadow-md hover:border-primary/20" data-v-99f265b2><div class="flex items-start justify-between gap-4" data-v-99f265b2><div class="flex-1 min-w-0" data-v-99f265b2><div class="flex items-center gap-2 mb-1.5" data-v-99f265b2><span class="shrink-0 flex items-center justify-center w-5 h-5 bg-[#012D5A] text-white rounded text-[10px] font-bold shadow-sm" data-v-99f265b2>${ssrInterpolate(item.sequenceNo)}</span><h4 class="${ssrRenderClass(
                          [
                            "font-semibold text-foreground transition-all duration-300",
                            unref(expandedItems).has(String(item.id || idx))
                              ? "whitespace-normal"
                              : "truncate",
                          ],
                        )}" data-v-99f265b2>${ssrInterpolate(item.description || "-")}</h4></div><div class="flex items-center gap-2" data-v-99f265b2><span class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter shrink-0" data-v-99f265b2>HS CODE</span><p class="${ssrRenderClass(
                          [
                            "text-xs font-medium text-muted-foreground transition-all duration-300",
                            unref(expandedItems).has(String(item.id || idx))
                              ? "whitespace-normal"
                              : "truncate",
                          ],
                        )}" data-v-99f265b2>${ssrInterpolate(item.hsCode || "-")}</p></div></div><button class="shrink-0 p-1.5 rounded-lg border border-border bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm" data-v-99f265b2>`,
                      );
                      ssrRenderVNode(
                        _push2,
                        createVNode(
                          resolveDynamicComponent(
                            unref(expandedItems).has(String(item.id || idx))
                              ? unref(ChevronUp)
                              : unref(ChevronDown),
                          ),
                          { class: "w-3.5 h-3.5" },
                          null,
                        ),
                        _parent,
                      );
                      _push2(
                        `</button></div><div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50" data-v-99f265b2><div class="space-y-1" data-v-99f265b2><p class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase" data-v-99f265b2> Quantity </p><p class="font-bold text-xs text-[#012D5A]" data-v-99f265b2>${ssrInterpolate(item.qty)} <span class="text-[10px] font-medium opacity-70" data-v-99f265b2>${ssrInterpolate(item.packageTypeCode)}</span></p></div><div class="space-y-1 px-2 border-x border-border/50" data-v-99f265b2><p class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase" data-v-99f265b2> Gross / Net </p><p class="font-bold text-xs text-[#012D5A]" data-v-99f265b2>${ssrInterpolate(item.grossWeight || "-")} <span class="text-[10px] font-medium opacity-60" data-v-99f265b2>/</span> ${ssrInterpolate(item.netWeight || "-")} <span class="text-[9px] font-medium opacity-70" data-v-99f265b2>KG</span></p></div><div class="space-y-1 pl-1 text-right" data-v-99f265b2><p class="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase text-right" data-v-99f265b2> Volume </p><p class="font-bold text-xs text-[#012D5A]" data-v-99f265b2>${ssrInterpolate(item.measurementCbm || "-")} <span class="text-[10px] font-medium opacity-70" data-v-99f265b2>CBM</span></p></div></div></div>`,
                      );
                    });
                    _push2(`<!--]--></div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]-->`);
                if (!unref(job).jobContainers || unref(job).jobContainers.length === 0) {
                  _push2(
                    `<div class="border border-dashed border-border rounded-xl p-8 text-center bg-gray-50/50" data-v-99f265b2><div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3" data-v-99f265b2>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(Box),
                      { class: "w-6 h-6 text-muted-foreground opacity-60" },
                      null,
                      _parent,
                    ),
                  );
                  _push2(
                    `</div><p class="text-sm font-medium text-foreground mb-1" data-v-99f265b2>No Containers Found</p><p class="text-xs text-muted-foreground" data-v-99f265b2> This job does not have any attached containers or bills of lading. </p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `</div></section><section data-v-99f265b2><h3 class="text-base font-bold mb-4 border-b pb-2" data-v-99f265b2>Movement Details</h3><div class="grid grid-cols-2 gap-6 text-sm" data-v-99f265b2><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Cargo Movement</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).cargoMovement?.name || unref(job).cargoMovementId || "-")}</p></div><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Delivery Movement</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).deliveryMovement?.name || unref(job).deliveryMovementId || "-")}</p></div></div></section><section data-v-99f265b2><h3 class="text-base font-bold mb-4 border-b pb-2" data-v-99f265b2>Cargo Information</h3><div class="grid grid-cols-1 gap-6 text-sm" data-v-99f265b2><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Commodity</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).commodity || "-")}</p></div><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Shipping Mark</p><p class="font-medium whitespace-pre-wrap" data-v-99f265b2>${ssrInterpolate(unref(job).shippingMark || "-")}</p></div></div></section><section data-v-99f265b2><h3 class="text-base font-bold mb-4 border-b pb-2" data-v-99f265b2>Weight &amp; Measurement</h3><div class="grid grid-cols-3 gap-6 text-sm" data-v-99f265b2><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Gross Weight</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).grossWeight || "-")} KGS</p></div><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Net Weight</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).netWeight || "-")} KGS</p></div><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Measurement</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).measurement || "-")} CBM</p></div></div></section><section data-v-99f265b2><h3 class="text-base font-bold mb-4 border-b pb-2" data-v-99f265b2>BL Setup</h3><div class="grid grid-cols-2 gap-6 text-sm" data-v-99f265b2><div data-v-99f265b2><p class="text-muted-foreground" data-v-99f265b2>Total BL Count</p><p class="font-medium" data-v-99f265b2>${ssrInterpolate(unref(job).totalBlCount || "-")}</p></div></div></section></div>`,
                );
              } else if (unref(activeTab) === "invoice") {
                _push2(`<div class="space-y-8 animate-fade-in pb-12 pt-4" data-v-99f265b2>`);
                _push2(
                  ssrRenderComponent(
                    JobInvoiceTab,
                    {
                      "job-id": unref(job).id,
                      "job-number": unref(job).jobNumber,
                      "customer-id": unref(job).customerId || void 0,
                      "job-parties": unref(job).jobParties,
                      "initial-invoice-id": __props.initialInvoiceId,
                    },
                    null,
                    _parent,
                  ),
                );
                _push2(`</div>`);
              } else if (unref(activeTab) === "ebl") {
                _push2(`<div class="space-y-8 animate-fade-in pb-12 pt-4" data-v-99f265b2>`);
                _push2(
                  ssrRenderComponent(
                    JobEblTab,
                    {
                      job: unref(job),
                      "initial-bl-id": __props.initialBlId,
                      onRefresh: ($event) => unref(getJob)(props.jobId),
                    },
                    null,
                    _parent,
                  ),
                );
                _push2(`</div>`);
              } else if (unref(activeTab) === "document") {
                _push2(`<div class="space-y-8 animate-fade-in pb-12 pt-4" data-v-99f265b2>`);
                _push2(
                  ssrRenderComponent(
                    JobDocumentTab,
                    {
                      "job-id": unref(job).id,
                    },
                    null,
                    _parent,
                  ),
                );
                _push2(`</div>`);
              } else {
                _push2(
                  `<div class="py-12 text-center text-muted-foreground" data-v-99f265b2><p data-v-99f265b2>${ssrInterpolate(tabs.find((t) => t.id === unref(activeTab))?.label)} content coming soon.</p></div>`,
                );
              }
              _push2(
                `</div></div><div class="p-4 border-t border-border flex justify-end bg-white shrink-0" data-v-99f265b2><div class="flex gap-3" data-v-99f265b2>`,
              );
              if (unref(job)?.id) {
                _push2(
                  ssrRenderComponent(
                    _component_NuxtLink,
                    {
                      to: `/operational/jobs/${unref(job).id}/edit`,
                      onClick: ($event) => _ctx.$emit("update:modelValue", false),
                      class:
                        "px-4 py-2 font-medium border border-border hover:bg-muted text-foreground rounded-md transition-colors flex items-center gap-2 text-sm shadow-sm",
                    },
                    {
                      default: withCtx((_, _push3, _parent2, _scopeId) => {
                        if (_push3) {
                          _push3(
                            ssrRenderComponent(
                              unref(Edit),
                              { class: "w-4 h-4" },
                              null,
                              _parent2,
                              _scopeId,
                            ),
                          );
                          _push3(` Edit Job `);
                        } else {
                          return [
                            createVNode(unref(Edit), { class: "w-4 h-4" }),
                            createTextVNode(" Edit Job "),
                          ];
                        }
                      }),
                      _: 1,
                    },
                    _parent,
                  ),
                );
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div>`);
            } else {
              _push2(
                `<div class="flex-1 flex items-center justify-center text-muted-foreground" data-v-99f265b2> Job not found </div>`,
              );
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        },
        "body",
        false,
        _parent,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/operational/JobDetailSlideOver.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(
  _export_sfc(_sfc_main, [["__scopeId", "data-v-99f265b2"]]),
  { __name: "OperationalJobDetailSlideOver" },
);

export { JobInvoicePreview as J, __nuxt_component_1 as _ };
//# sourceMappingURL=JobDetailSlideOver-BAyYqm_H.mjs.map
