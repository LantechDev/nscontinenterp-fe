import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_0$1 } from "./Modal-DzxIm9v2.mjs";
import {
  defineComponent,
  ref,
  watch,
  unref,
  withCtx,
  createVNode,
  isRef,
  withModifiers,
  createBlock,
  createCommentVNode,
  openBlock,
  toDisplayString,
  withDirectives,
  createTextVNode,
  vModelText,
  Fragment,
  renderList,
  vModelSelect,
  useSSRContext,
} from "vue";
import {
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderClass,
  ssrRenderList,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
} from "vue/server-renderer";
import { ArrowLeft, Download, Edit, Receipt, Plus, Trash2, Loader2, Save } from "lucide-vue-next";
import { u as useInvoices } from "./useInvoices-DKKCQ9mY.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import { f as formatRupiah, t as toNumber } from "./utils-C_kyg7_s.mjs";
import { e as useRoute, a as useRouter } from "./server.mjs";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const invoiceId = route.params.id;
    const { fetchInvoiceById, updateInvoice } = useInvoices();
    const { companies } = useCompanies();
    const { jobs } = useJobs();
    const { services } = useServices();
    const invoice = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const isEditModalOpen = ref(false);
    const isSubmitting = ref(false);
    const editError = ref(null);
    const formData = ref({
      invoiceNumber: "",
      issuedDate: "",
      dueDate: "",
      companyId: "",
      jobId: "",
      notes: "",
      subTotal: 0,
      taxAmount: 0,
      total: 0,
      statusId: "",
      items: [],
    });
    const statusOptions = [
      { id: "PAID", name: "Lunas (Paid)" },
      { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
      { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
    ];
    const taxOptions = [
      { value: 0, label: "Tanpa PPN" },
      { value: 1.1, label: "PPN 1.1% (Freight)" },
      { value: 11, label: "PPN 11%" },
    ];
    const selectedTaxRate = ref(0);
    const getStatusBadge = (statusCode) => {
      const statusMap = {
        PAID: { label: "Lunas", class: "badge-success" },
        UNPAID: { label: "Pending", class: "badge-warning" },
        PARTIALLY_PAID: { label: "Sebagian", class: "badge-warning" },
        OVERDUE: { label: "Jatuh Tempo", class: "badge-danger" },
      };
      return statusMap[statusCode] || { label: statusCode, class: "badge-warning" };
    };
    const formatCurrency = formatRupiah;
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };
    const calculateItemAmount = (item) => {
      return item.quantity * item.unitPrice;
    };
    const calculateSubTotal = () => {
      return formData.value.items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
    };
    const calculateTaxAmount = () => {
      return (calculateSubTotal() * selectedTaxRate.value) / 100;
    };
    const calculateTotal = () => {
      return calculateSubTotal() + calculateTaxAmount();
    };
    const addLineItem = () => {
      formData.value.items.push({
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      });
    };
    const removeLineItem = (index) => {
      formData.value.items.splice(index, 1);
      recalculateTotals();
    };
    const recalculateTotals = () => {
      formData.value.subTotal = calculateSubTotal();
      formData.value.taxAmount = calculateTaxAmount();
      formData.value.total = calculateTotal();
    };
    const updateItemAmount = (index) => {
      const item = formData.value.items[index];
      if (item) {
        item.amount = calculateItemAmount(item);
        recalculateTotals();
      }
    };
    const loadInvoice = async () => {
      try {
        loading.value = true;
        error.value = null;
        const result = await fetchInvoiceById(invoiceId);
        if (result.success && result.data) {
          invoice.value = result.data;
        } else {
          throw new Error(result.error || "Failed to load invoice");
        }
      } catch (e) {
        console.error("Failed to fetch invoice:", e);
        error.value = "Failed to load invoice";
      } finally {
        loading.value = false;
      }
    };
    const closeEditModal = () => {
      isEditModalOpen.value = false;
      editError.value = null;
    };
    const handleFullUpdate = async () => {
      if (!invoice.value || !formData.value.companyId) return;
      try {
        isSubmitting.value = true;
        editError.value = null;
        const itemsToUpdate = formData.value.items.map((item) => ({
          id: item.id,
          serviceId: item.serviceId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        }));
        const subTotal = calculateSubTotal();
        const taxAmount = calculateTaxAmount();
        const total = calculateTotal();
        const result = await updateInvoice(invoice.value.id, {
          invoiceNumber: formData.value.invoiceNumber,
          issuedDate: formData.value.issuedDate,
          dueDate: formData.value.dueDate,
          companyId: formData.value.companyId,
          jobId: formData.value.jobId || void 0,
          notes: formData.value.notes,
          subTotal,
          taxAmount,
          total,
          balanceDue: total,
          // For simplicity, set balanceDue equal to total
          statusId: formData.value.statusId,
          items: itemsToUpdate,
        });
        if (result.success && result.data) {
          await loadInvoice();
          closeEditModal();
        } else {
          throw new Error(result.error || "Failed to update invoice");
        }
      } catch (e) {
        console.error("Failed to update invoice:", e);
        editError.value = "Failed to update invoice";
      } finally {
        isSubmitting.value = false;
      }
    };
    watch(selectedTaxRate, () => {
      recalculateTotals();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiModal = __nuxt_component_0$1;
      _push(`<!--[-->`);
      if (unref(loading)) {
        _push(
          `<div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div></div>`,
        );
      } else if (unref(error)) {
        _push(
          `<div class="text-center py-12"><p class="text-red-500">${ssrInterpolate(unref(error))}</p><button class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg"> Retry </button></div>`,
        );
      } else if (unref(invoice)) {
        _push(
          `<div class="space-y-6 animate-fade-in p-6"><div class="page-header"><div class="flex items-center gap-4">`,
        );
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: "/finance/invoice",
              class: "p-2 rounded-lg hover:bg-muted transition-colors",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    ssrRenderComponent(
                      unref(ArrowLeft),
                      { class: "w-5 h-5" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  return [createVNode(unref(ArrowLeft), { class: "w-5 h-5" })];
                }
              }),
              _: 1,
            },
            _parent,
          ),
        );
        _push(
          `<div><h1 class="page-title">${ssrInterpolate(unref(invoice).invoiceNumber)}</h1><p class="text-muted-foreground mt-1">Detail invoice</p></div></div><div class="flex gap-2"><button class="btn-secondary">`,
        );
        _push(ssrRenderComponent(unref(Download), { class: "w-4 h-4 mr-2" }, null, _parent));
        _push(` Download </button><button class="btn-primary">`);
        _push(ssrRenderComponent(unref(Edit), { class: "w-4 h-4 mr-2" }, null, _parent));
        _push(
          ` Edit Invoice </button></div></div><div class="card-elevated p-6"><div class="flex items-center gap-4 mb-6 pb-6 border-b border-border"><div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">`,
        );
        _push(ssrRenderComponent(unref(Receipt), { class: "w-7 h-7 text-primary" }, null, _parent));
        _push(
          `</div><div><h2 class="text-xl font-semibold">${ssrInterpolate(unref(invoice).invoiceNumber)}</h2><p class="text-muted-foreground">${ssrInterpolate(unref(invoice).company?.name)}</p></div><span class="${ssrRenderClass(["ml-auto", getStatusBadge(unref(invoice).status?.code || "").class])}">${ssrInterpolate(getStatusBadge(unref(invoice).status?.code || "").label)}</span></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"><div class="space-y-1"><p class="text-sm text-muted-foreground">Customer</p><p class="font-medium text-primary">${ssrInterpolate(unref(invoice).company?.name)}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Tanggal</p><p class="font-medium">${ssrInterpolate(formatDate(unref(invoice).issuedDate))}</p></div><div class="space-y-1"><p class="text-sm text-muted-foreground">Jatuh Tempo</p><p class="font-medium">${ssrInterpolate(formatDate(unref(invoice).dueDate))}</p></div>`,
        );
        if (unref(invoice).job) {
          _push(
            `<div class="space-y-1"><p class="text-sm text-muted-foreground">Job Reference</p><p class="font-medium">${ssrInterpolate(unref(invoice).job.jobNumber)}</p></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(
          `</div><div class="border-t border-border pt-6"><h3 class="font-semibold mb-4">Detail Item</h3><div class="space-y-2"><!--[-->`,
        );
        ssrRenderList(unref(invoice).items, (item, index) => {
          _push(
            `<div class="flex justify-between py-2 border-b border-border last:border-0"><div><span class="font-medium">${ssrInterpolate(item.description)}</span>`,
          );
          if (item.service) {
            _push(
              `<span class="text-sm text-muted-foreground ml-2">(${ssrInterpolate(item.service.name)})</span>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(
            `<div class="text-sm text-muted-foreground">${ssrInterpolate(item.quantity)} x ${ssrInterpolate(unref(formatCurrency)(item.unitPrice))}</div></div><span class="font-medium">${ssrInterpolate(unref(formatCurrency)(item.amount))}</span></div>`,
          );
        });
        _push(
          `<!--]--></div><div class="mt-4 pt-4 border-t border-border space-y-2"><div class="flex justify-between"><span class="text-muted-foreground">Subtotal</span><span class="font-medium">${ssrInterpolate(unref(formatCurrency)(unref(toNumber)(unref(invoice).subTotal) || 0))}</span></div><div class="flex justify-between"><span class="text-muted-foreground">Pajak (PPN)</span><span class="font-medium">${ssrInterpolate(unref(formatCurrency)(unref(toNumber)(unref(invoice).taxAmount) || 0))}</span></div><div class="flex justify-between pt-2 border-t border-border"><span class="text-muted-foreground">Total</span><span class="font-medium text-lg">${ssrInterpolate(unref(formatCurrency)(unref(toNumber)(unref(invoice).total)))}</span></div></div></div>`,
        );
        if (unref(invoice).notes) {
          _push(
            `<div class="border-t border-border pt-6 mt-6"><h3 class="font-semibold mb-2">Catatan</h3><p class="text-muted-foreground whitespace-pre-wrap">${ssrInterpolate(unref(invoice).notes)}</p></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(
        ssrRenderComponent(
          _component_UiModal,
          {
            modelValue: unref(isEditModalOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isEditModalOpen) ? (isEditModalOpen.value = $event) : null,
            title: "Edit Invoice",
            description: "Ubah semua detail invoice",
            width: "max-w-4xl",
            onClose: closeEditModal,
          },
          {
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(formData).companyId || unref(formData).items.length === 0) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>`,
                );
                if (unref(isSubmitting)) {
                  _push2(
                    ssrRenderComponent(
                      unref(Loader2),
                      { class: "w-4 h-4 animate-spin" },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                } else {
                  _push2(
                    ssrRenderComponent(unref(Save), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                  );
                }
                _push2(
                  ` ${ssrInterpolate(unref(isSubmitting) ? "Saving..." : "Save Changes")}</button>`,
                );
              } else {
                return [
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: closeEditModal,
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: unref(isSubmitting),
                    },
                    " Cancel ",
                    8,
                    ["disabled"],
                  ),
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: handleFullUpdate,
                      disabled:
                        unref(isSubmitting) ||
                        !unref(formData).companyId ||
                        unref(formData).items.length === 0,
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      unref(isSubmitting)
                        ? (openBlock(),
                          createBlock(unref(Loader2), {
                            key: 0,
                            class: "w-4 h-4 animate-spin",
                          }))
                        : (openBlock(),
                          createBlock(unref(Save), {
                            key: 1,
                            class: "w-4 h-4",
                          })),
                      createTextVNode(
                        " " + toDisplayString(unref(isSubmitting) ? "Saving..." : "Save Changes"),
                        1,
                      ),
                    ],
                    8,
                    ["disabled"],
                  ),
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<form class="space-y-6"${_scopeId}>`);
                if (unref(editError)) {
                  _push2(
                    `<div class="p-4 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editError))}</p></div>`,
                  );
                } else {
                  _push2(`<!---->`);
                }
                _push2(
                  `<div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Nomor Invoice <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).invoiceNumber)} type="text" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Status Invoice <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(formData).statusId) ? ssrLooseContain(unref(formData).statusId, "") : ssrLooseEqual(unref(formData).statusId, "")) ? " selected" : ""}${_scopeId}>Pilih status</option><!--[-->`,
                );
                ssrRenderList(statusOptions, (status) => {
                  _push2(
                    `<option${ssrRenderAttr("value", status.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(formData).statusId) ? ssrLooseContain(unref(formData).statusId, status.id) : ssrLooseEqual(unref(formData).statusId, status.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(status.name)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Tanggal Invoice <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).issuedDate)} type="date" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Jatuh Tempo <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(formData).dueDate)} type="date" class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Customer <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(formData).companyId) ? ssrLooseContain(unref(formData).companyId, "") : ssrLooseEqual(unref(formData).companyId, "")) ? " selected" : ""}${_scopeId}>Pilih customer</option><!--[-->`,
                );
                ssrRenderList(unref(companies), (company) => {
                  _push2(
                    `<option${ssrRenderAttr("value", company.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(formData).companyId) ? ssrLooseContain(unref(formData).companyId, company.id) : ssrLooseEqual(unref(formData).companyId, company.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(company.name)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Job Reference </label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(formData).jobId) ? ssrLooseContain(unref(formData).jobId, "") : ssrLooseEqual(unref(formData).jobId, "")) ? " selected" : ""}${_scopeId}>Pilih job (opsional)</option><!--[-->`,
                );
                ssrRenderList(unref(jobs), (job) => {
                  _push2(
                    `<option${ssrRenderAttr("value", job.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(formData).jobId) ? ssrLooseContain(unref(formData).jobId, job.id) : ssrLooseEqual(unref(formData).jobId, job.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(job.jobNumber)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div></div><div class="space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Item Invoice <span class="text-red-500"${_scopeId}>*</span></label><button type="button" class="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(
                  ` Tambah Item </button></div><div class="border border-border rounded-lg overflow-hidden"${_scopeId}><div class="grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium"${_scopeId}><div class="col-span-4"${_scopeId}>Deskripsi</div><div class="col-span-2"${_scopeId}>Layanan</div><div class="col-span-2"${_scopeId}>Jumlah</div><div class="col-span-2"${_scopeId}>Harga Satuan</div><div class="col-span-1.5"${_scopeId}>Total</div><div class="col-span-0.5"${_scopeId}></div></div>`,
                );
                if (unref(formData).items.length === 0) {
                  _push2(
                    `<div class="p-4 text-center text-muted-foreground"${_scopeId}> Belum ada item. Klik &quot;Tambah Item&quot; untuk menambahkan. </div>`,
                  );
                } else {
                  _push2(`<!--[-->`);
                  ssrRenderList(unref(formData).items, (item, index) => {
                    _push2(
                      `<div class="grid grid-cols-12 gap-2 p-3 border-t border-border items-center"${_scopeId}><div class="col-span-4"${_scopeId}><input${ssrRenderAttr("value", item.description)} type="text" placeholder="Deskripsi item" class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="col-span-2"${_scopeId}><select class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(item.serviceId) ? ssrLooseContain(item.serviceId, "") : ssrLooseEqual(item.serviceId, "")) ? " selected" : ""}${_scopeId}>Pilih</option><!--[-->`,
                    );
                    ssrRenderList(unref(services), (service) => {
                      _push2(
                        `<option${ssrRenderAttr("value", service.id)}${ssrIncludeBooleanAttr(Array.isArray(item.serviceId) ? ssrLooseContain(item.serviceId, service.id) : ssrLooseEqual(item.serviceId, service.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(service.name)}</option>`,
                      );
                    });
                    _push2(
                      `<!--]--></select></div><div class="col-span-2"${_scopeId}><input${ssrRenderAttr("value", item.quantity)} type="number" min="1" class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="col-span-2"${_scopeId}><input${ssrRenderAttr("value", item.unitPrice)} type="number" min="0" class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"${_scopeId}></div><div class="col-span-1.5 text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(calculateItemAmount(item)))}</div><div class="col-span-0.5"${_scopeId}><button type="button" class="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"${_scopeId}>`,
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
                    _push2(`</button></div></div>`);
                  });
                  _push2(`<!--]-->`);
                }
                _push2(
                  `</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> PPN </label><select class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"${_scopeId}><!--[-->`,
                );
                ssrRenderList(taxOptions, (tax) => {
                  _push2(
                    `<option${ssrRenderAttr("value", tax.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTaxRate)) ? ssrLooseContain(unref(selectedTaxRate), tax.value) : ssrLooseEqual(unref(selectedTaxRate), tax.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(tax.label)}</option>`,
                  );
                });
                _push2(
                  `<!--]--></select></div><div class="space-y-1.5"${_scopeId}><label class="text-sm font-medium text-foreground"${_scopeId}> Catatan </label><textarea rows="3" placeholder="Catatan invoice..." class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white resize-none"${_scopeId}>${ssrInterpolate(unref(formData).notes)}</textarea></div></div><div class="border-t border-border pt-4"${_scopeId}><div class="flex justify-end"${_scopeId}><div class="w-64 space-y-2"${_scopeId}><div class="flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Subtotal</span><span class="font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(calculateSubTotal()))}</span></div><div class="flex justify-between text-sm"${_scopeId}><span class="text-muted-foreground"${_scopeId}>Pajak (PPN ${ssrInterpolate(unref(selectedTaxRate))}%)</span><span class="font-medium"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(calculateTaxAmount()))}</span></div><div class="flex justify-between pt-2 border-t border-border"${_scopeId}><span class="font-medium"${_scopeId}>Total</span><span class="font-bold text-lg"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(calculateTotal()))}</span></div></div></div></div></form>`,
                );
              } else {
                return [
                  createVNode(
                    "form",
                    {
                      class: "space-y-6",
                      onSubmit: withModifiers(handleFullUpdate, ["prevent"]),
                    },
                    [
                      unref(editError)
                        ? (openBlock(),
                          createBlock(
                            "div",
                            {
                              key: 0,
                              class: "p-4 bg-red-50 border border-red-200 rounded-lg",
                            },
                            [
                              createVNode(
                                "p",
                                { class: "text-sm text-red-600" },
                                toDisplayString(unref(editError)),
                                1,
                              ),
                            ],
                          ))
                        : createCommentVNode("", true),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Nomor Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).invoiceNumber = $event),
                                type: "text",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).invoiceNumber]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Status Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).statusId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              [
                                createVNode(
                                  "option",
                                  {
                                    value: "",
                                    disabled: "",
                                  },
                                  "Pilih status",
                                ),
                                (openBlock(),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(statusOptions, (status) => {
                                    return createVNode(
                                      "option",
                                      {
                                        key: status.id,
                                        value: status.id,
                                      },
                                      toDisplayString(status.name),
                                      9,
                                      ["value"],
                                    );
                                  }),
                                  64,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, unref(formData).statusId]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Tanggal Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).issuedDate = $event),
                                type: "date",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).issuedDate]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Jatuh Tempo "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).dueDate = $event),
                                type: "date",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).dueDate]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Customer "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).companyId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                required: "",
                              },
                              [
                                createVNode(
                                  "option",
                                  {
                                    value: "",
                                    disabled: "",
                                  },
                                  "Pilih customer",
                                ),
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(unref(companies), (company) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "option",
                                        {
                                          key: company.id,
                                          value: company.id,
                                        },
                                        toDisplayString(company.name),
                                        9,
                                        ["value"],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, unref(formData).companyId]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            " Job Reference ",
                          ),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) => (unref(formData).jobId = $event),
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              },
                              [
                                createVNode("option", { value: "" }, "Pilih job (opsional)"),
                                (openBlock(true),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(unref(jobs), (job) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "option",
                                        {
                                          key: job.id,
                                          value: job.id,
                                        },
                                        toDisplayString(job.jobNumber),
                                        9,
                                        ["value"],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, unref(formData).jobId]],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("label", { class: "text-sm font-medium text-foreground" }, [
                            createTextVNode(" Item Invoice "),
                            createVNode("span", { class: "text-red-500" }, "*"),
                          ]),
                          createVNode(
                            "button",
                            {
                              type: "button",
                              onClick: addLineItem,
                              class:
                                "flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors",
                            },
                            [
                              createVNode(unref(Plus), { class: "w-4 h-4" }),
                              createTextVNode(" Tambah Item "),
                            ],
                          ),
                        ]),
                        createVNode(
                          "div",
                          { class: "border border-border rounded-lg overflow-hidden" },
                          [
                            createVNode(
                              "div",
                              { class: "grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium" },
                              [
                                createVNode("div", { class: "col-span-4" }, "Deskripsi"),
                                createVNode("div", { class: "col-span-2" }, "Layanan"),
                                createVNode("div", { class: "col-span-2" }, "Jumlah"),
                                createVNode("div", { class: "col-span-2" }, "Harga Satuan"),
                                createVNode("div", { class: "col-span-1.5" }, "Total"),
                                createVNode("div", { class: "col-span-0.5" }),
                              ],
                            ),
                            unref(formData).items.length === 0
                              ? (openBlock(),
                                createBlock(
                                  "div",
                                  {
                                    key: 0,
                                    class: "p-4 text-center text-muted-foreground",
                                  },
                                  ' Belum ada item. Klik "Tambah Item" untuk menambahkan. ',
                                ))
                              : (openBlock(true),
                                createBlock(
                                  Fragment,
                                  { key: 1 },
                                  renderList(unref(formData).items, (item, index) => {
                                    return (
                                      openBlock(),
                                      createBlock(
                                        "div",
                                        {
                                          key: index,
                                          class:
                                            "grid grid-cols-12 gap-2 p-3 border-t border-border items-center",
                                        },
                                        [
                                          createVNode("div", { class: "col-span-4" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.description = $event),
                                                  type: "text",
                                                  placeholder: "Deskripsi item",
                                                  class:
                                                    "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                },
                                                null,
                                                8,
                                                ["onUpdate:modelValue"],
                                              ),
                                              [[vModelText, item.description]],
                                            ),
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "select",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.serviceId = $event),
                                                  class:
                                                    "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                                },
                                                [
                                                  createVNode("option", { value: "" }, "Pilih"),
                                                  (openBlock(true),
                                                  createBlock(
                                                    Fragment,
                                                    null,
                                                    renderList(unref(services), (service) => {
                                                      return (
                                                        openBlock(),
                                                        createBlock(
                                                          "option",
                                                          {
                                                            key: service.id,
                                                            value: service.id,
                                                          },
                                                          toDisplayString(service.name),
                                                          9,
                                                          ["value"],
                                                        )
                                                      );
                                                    }),
                                                    128,
                                                  )),
                                                ],
                                                8,
                                                ["onUpdate:modelValue"],
                                              ),
                                              [[vModelSelect, item.serviceId]],
                                            ),
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.quantity = $event),
                                                  type: "number",
                                                  min: "1",
                                                  onInput: ($event) => updateItemAmount(index),
                                                  class:
                                                    "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                },
                                                null,
                                                40,
                                                ["onUpdate:modelValue", "onInput"],
                                              ),
                                              [
                                                [
                                                  vModelText,
                                                  item.quantity,
                                                  void 0,
                                                  { number: true },
                                                ],
                                              ],
                                            ),
                                          ]),
                                          createVNode("div", { class: "col-span-2" }, [
                                            withDirectives(
                                              createVNode(
                                                "input",
                                                {
                                                  "onUpdate:modelValue": ($event) =>
                                                    (item.unitPrice = $event),
                                                  type: "number",
                                                  min: "0",
                                                  onInput: ($event) => updateItemAmount(index),
                                                  class:
                                                    "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                },
                                                null,
                                                40,
                                                ["onUpdate:modelValue", "onInput"],
                                              ),
                                              [
                                                [
                                                  vModelText,
                                                  item.unitPrice,
                                                  void 0,
                                                  { number: true },
                                                ],
                                              ],
                                            ),
                                          ]),
                                          createVNode(
                                            "div",
                                            { class: "col-span-1.5 text-sm font-medium" },
                                            toDisplayString(
                                              unref(formatCurrency)(calculateItemAmount(item)),
                                            ),
                                            1,
                                          ),
                                          createVNode("div", { class: "col-span-0.5" }, [
                                            createVNode(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: ($event) => removeLineItem(index),
                                                class:
                                                  "p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors",
                                              },
                                              [createVNode(unref(Trash2), { class: "w-4 h-4" })],
                                              8,
                                              ["onClick"],
                                            ),
                                          ]),
                                        ],
                                      )
                                    );
                                  }),
                                  128,
                                )),
                          ],
                        ),
                      ]),
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            " PPN ",
                          ),
                          withDirectives(
                            createVNode(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  isRef(selectedTaxRate) ? (selectedTaxRate.value = $event) : null,
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              },
                              [
                                (openBlock(),
                                createBlock(
                                  Fragment,
                                  null,
                                  renderList(taxOptions, (tax) => {
                                    return createVNode(
                                      "option",
                                      {
                                        key: tax.value,
                                        value: tax.value,
                                      },
                                      toDisplayString(tax.label),
                                      9,
                                      ["value"],
                                    );
                                  }),
                                  64,
                                )),
                              ],
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelSelect, unref(selectedTaxRate), void 0, { number: true }]],
                          ),
                        ]),
                        createVNode("div", { class: "space-y-1.5" }, [
                          createVNode(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            " Catatan ",
                          ),
                          withDirectives(
                            createVNode(
                              "textarea",
                              {
                                "onUpdate:modelValue": ($event) => (unref(formData).notes = $event),
                                rows: "3",
                                placeholder: "Catatan invoice...",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white resize-none",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).notes]],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "border-t border-border pt-4" }, [
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode("div", { class: "w-64 space-y-2" }, [
                            createVNode("div", { class: "flex justify-between text-sm" }, [
                              createVNode("span", { class: "text-muted-foreground" }, "Subtotal"),
                              createVNode(
                                "span",
                                { class: "font-medium" },
                                toDisplayString(unref(formatCurrency)(calculateSubTotal())),
                                1,
                              ),
                            ]),
                            createVNode("div", { class: "flex justify-between text-sm" }, [
                              createVNode(
                                "span",
                                { class: "text-muted-foreground" },
                                "Pajak (PPN " + toDisplayString(unref(selectedTaxRate)) + "%)",
                                1,
                              ),
                              createVNode(
                                "span",
                                { class: "font-medium" },
                                toDisplayString(unref(formatCurrency)(calculateTaxAmount())),
                                1,
                              ),
                            ]),
                            createVNode(
                              "div",
                              { class: "flex justify-between pt-2 border-t border-border" },
                              [
                                createVNode("span", { class: "font-medium" }, "Total"),
                                createVNode(
                                  "span",
                                  { class: "font-bold text-lg" },
                                  toDisplayString(unref(formatCurrency)(calculateTotal())),
                                  1,
                                ),
                              ],
                            ),
                          ]),
                        ]),
                      ]),
                    ],
                    32,
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/invoice/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-6np9mMEF.mjs.map
