import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  createTextVNode,
  createBlock,
  createCommentVNode,
  openBlock,
  toDisplayString,
  withDirectives,
  vModelCheckbox,
  vModelText,
  Fragment,
  renderList,
  isRef,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrIncludeBooleanAttr,
  ssrInterpolate,
  ssrRenderList,
  ssrRenderClass,
  ssrRenderAttr,
  ssrLooseContain,
} from "vue/server-renderer";
import {
  ArrowLeft,
  Briefcase,
  Save,
  Users,
  MapPin,
  Box,
  Plus,
  Trash2,
  Clock,
  Scale,
  FileText,
} from "lucide-vue-next";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import { u as useMasterData, D as DatePicker } from "./DatePicker-I7QCahB1.mjs";
import { _ as __nuxt_component_0 } from "./Modal-DzxIm9v2.mjs";
import _sfc_main$1 from "./SectionCard-BNHBHmfw.mjs";
import _sfc_main$2 from "./JobPartyRow-CsBs8qVt.mjs";
import { t as toast } from "./index-DJGQOf1Z.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { a as useRouter, e as useRoute, g as useAuth } from "./server.mjs";
import "@vueuse/core";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
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
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const { isLoading: isJobLoading } = useJobs();
    const { confirm } = useConfirm();
    const {
      fetchCompanies,
      fetchContainerTypes,
      fetchVessels,
      fetchPorts,
      createCompany,
      createVessel,
      fetchPackageTypes,
    } = useMasterData();
    useRouter();
    const route = useRoute();
    route.params.id;
    useAuth();
    const companies = ref([]);
    const containerTypes = ref([]);
    const packageTypes = ref([]);
    const vessels = ref([]);
    const portsPol = ref([]);
    const portsPod = ref([]);
    ref(false);
    const isCompanyModalOpen = ref(false);
    const isSubmittingCompany = ref(false);
    const activeCompanyField = ref(null);
    const companyForm = reactive({
      name: "",
      fullAddress: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Indonesia",
      eori: "",
      taxId: "",
    });
    const formData = reactive({
      // Job Info
      tradeTypeId: "EXPORT",
      // Route Details
      pol: "",
      pod: "",
      voyageNumber: "",
      preCarriageBy: "",
      placeOfReceipt: "",
      placeOfDelivery: "",
      finalDestination: "",
      // Cargo & Customs
      hsCode: "",
      commodity: "",
      // mapped to Description of Goods
      shippingMark: "",
      mainDescription: "",
      customerReference: "",
      // Containers (BL Ready)
      containers: [
        {
          id: Date.now(),
          containerNumber: "",
          sealNumber: "",
          containerTypeId: "",
          items: [
            {
              id: Date.now() + 1,
              sequenceNo: 1,
              qty: 1,
              packageTypeCode: "",
              grossWeight: null,
              netWeight: null,
              measurementCbm: null,
              description: "",
              hsCode: "",
            },
          ],
          isHazardous: false,
        },
      ],
      // Movement & Schedule
      cargoMovementId: "FCL_FCL",
      deliveryMovementId: "CY_DOOR",
      vessels: [],
      vesselId: "",
      // Legacy support
      etd: "",
      // Legacy support
      eta: "",
      // Weight & Measurement
      grossWeight: null,
      netWeight: null,
      measurement: null,
      // BL Setup
      totalBlCount: 1,
      freightTerm: "PREPAID",
      blType: "ORIGINAL",
      isNegotiable: false,
      placeOfIssue: "",
      dateOfIssue: "",
      // Involved Parties
      shipperId: "",
      shipperAddressId: "",
      consigneeId: "",
      consigneeAddressId: "",
      isNotifySameAsConsignee: false,
      notifyPartyId: "",
      notifyPartyAddressId: "",
      forwarderId: "",
      forwarderAddressId: "",
      vendorId: "",
      customerId: "",
    });
    const jobDetails = ref(null);
    async function refreshMasterData(polCode, podCode) {
      const [comps, types, packs, vess, initialPorts] = await Promise.all([
        fetchCompanies(),
        fetchContainerTypes(),
        fetchPackageTypes(),
        fetchVessels(),
        fetchPorts(),
      ]);
      companies.value = comps;
      containerTypes.value = types;
      packageTypes.value = packs;
      vessels.value = vess;
      const selectedPol = formData.pol;
      const selectedPod = formData.pod;
      portsPol.value = initialPorts;
      portsPod.value = initialPorts;
      if (selectedPol) {
        if (!portsPol.value.find((p) => p.code === selectedPol)) {
          const polPort = await fetchPorts(selectedPol);
          if (polPort.length > 0) {
            portsPol.value = [...portsPol.value, ...polPort];
          }
        }
      }
      if (selectedPod) {
        if (!portsPod.value.find((p) => p.code === selectedPod)) {
          const podPort = await fetchPorts(selectedPod);
          if (podPort.length > 0) {
            portsPod.value = [...portsPod.value, ...podPort];
          }
        }
      }
    }
    async function handleSearchPol(query) {
      portsPol.value = await fetchPorts(query);
    }
    async function handleSearchPod(query) {
      portsPod.value = await fetchPorts(query);
    }
    watch(
      () => formData.isNotifySameAsConsignee,
      (val) => {
        if (val) {
          formData.notifyPartyId = formData.consigneeId;
          formData.notifyPartyAddressId = formData.consigneeAddressId;
        } else {
          formData.notifyPartyId = "";
          formData.notifyPartyAddressId = "";
        }
      },
    );
    watch(
      () => formData.consigneeId,
      (val) => {
        if (formData.isNotifySameAsConsignee) {
          formData.notifyPartyId = val;
        }
      },
    );
    watch(
      () => formData.consigneeAddressId,
      (val) => {
        if (formData.isNotifySameAsConsignee) {
          formData.notifyPartyAddressId = val;
        }
      },
    );
    const assignDefaultAddress = (companyId, addressKey) => {
      if (!companyId) {
        formData[addressKey] = "";
        return;
      }
      const company = companies.value.find((c) => c.id === companyId);
      if (company && company.addresses && company.addresses.length > 0) {
        if (formData[addressKey] && company.addresses.some((a) => a.id === formData[addressKey])) {
          return;
        }
        const defaultAddr = company.addresses.find((a) => a.isDefault);
        formData[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0].id;
      }
    };
    watch(
      () => formData.shipperId,
      (val) => assignDefaultAddress(val, "shipperAddressId"),
    );
    watch(
      () => formData.consigneeId,
      (val) => assignDefaultAddress(val, "consigneeAddressId"),
    );
    watch(
      () => formData.notifyPartyId,
      (val) => {
        if (!formData.isNotifySameAsConsignee) {
          assignDefaultAddress(val, "notifyPartyAddressId");
        }
      },
    );
    watch(
      () => formData.forwarderId,
      (val) => assignDefaultAddress(val, "forwarderAddressId"),
    );
    watch(
      () => formData.containers,
      (containers) => {
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
        if (hasItems) {
          if (totalGw > 0) formData.grossWeight = totalGw;
          if (totalNw > 0) formData.netWeight = totalNw;
          if (totalCbm > 0) formData.measurement = totalCbm;
        }
      },
      { deep: true },
    );
    const containerErrors = computed(() => {
      const errors = {};
      formData.containers.forEach((c) => {
        if (c.containerNumber) {
          const regex = /^[A-Z]{4}\d{7}$/;
          if (!regex.test(c.containerNumber.toUpperCase())) {
            errors[c.id] = "Must be 4 letters + 7 digits (e.g. TEMU1234567)";
          }
        }
        if (c.items && Array.isArray(c.items)) {
          c.items.forEach((item) => {
            if (item.qty !== null && item.qty !== void 0) {
              if (!Number.isInteger(item.qty) || item.qty <= 0) {
                errors[`${c.id}-${item.id}-qty`] = "Must be > 0";
              }
            }
            if (item.grossWeight !== null && item.grossWeight < 0) {
              errors[`${c.id}-${item.id}-gw`] = "Cannot be < 0";
            }
            if (item.netWeight !== null) {
              if (item.netWeight < 0) {
                errors[`${c.id}-${item.id}-nw`] = "Cannot be < 0";
              } else if (item.grossWeight !== null && item.netWeight > item.grossWeight) {
                errors[`${c.id}-${item.id}-nw`] = "Cannot exceed GW";
              }
            }
            if (item.measurementCbm !== null && item.measurementCbm < 0) {
              errors[`${c.id}-${item.id}-cbm`] = "Cannot be < 0";
            }
            if (item.hsCode) {
              const digits = item.hsCode.replace(/\D/g, "");
              if (digits.length > 0 && digits.length < 6) {
                errors[`${c.id}-${item.id}-hscode`] = "Min. 6 digits";
              }
            }
          });
        }
      });
      return errors;
    });
    const routeErrors = computed(() => {
      const errors = {};
      if (formData.pol && formData.pod && formData.pol === formData.pod) {
        errors.polPod = "POL and POD cannot be the same";
      }
      return errors;
    });
    const scheduleErrors = computed(() => {
      const errors = {};
      if (formData.eta && formData.vessels.length > 0) {
        const lastVesselEtd = formData.vessels[formData.vessels.length - 1]?.etd;
        if (lastVesselEtd) {
          if (new Date(formData.eta) < new Date(lastVesselEtd)) {
            errors.eta = "Final ETA cannot be earlier than last ETD";
          }
        }
      }
      return errors;
    });
    const totalErrorsConfigs = computed(() => {
      let totalGw = 0;
      let totalNw = 0;
      let totalCbm = 0;
      formData.containers.forEach((c) => {
        if (c.items && Array.isArray(c.items)) {
          c.items.forEach((item) => {
            totalGw += Number(item.grossWeight) || 0;
            totalNw += Number(item.netWeight) || 0;
            totalCbm += Number(item.measurementCbm) || 0;
          });
        }
      });
      const errors = {};
      const warnings = {};
      if (formData.grossWeight !== null && formData.grossWeight < 0) {
        errors.gw = "Cannot be negative";
      } else if (
        formData.grossWeight !== null &&
        Math.abs(formData.grossWeight - totalGw) > 0.01 &&
        totalGw > 0
      ) {
        warnings.gw = `Sum of container items is ${totalGw.toFixed(2)} KG`;
      }
      if (formData.netWeight !== null && formData.netWeight < 0) {
        errors.nw = "Cannot be negative";
      } else if (
        formData.netWeight !== null &&
        Math.abs(formData.netWeight - totalNw) > 0.01 &&
        totalNw > 0
      ) {
        warnings.nw = `Sum of container items is ${totalNw.toFixed(2)} KG`;
      }
      if (formData.measurement !== null && formData.measurement < 0) {
        errors.cbm = "Cannot be negative";
      } else if (
        formData.measurement !== null &&
        Math.abs(formData.measurement - totalCbm) > 0.01 &&
        totalCbm > 0
      ) {
        warnings.cbm = `Sum of container items is ${totalCbm.toFixed(2)} CBM`;
      }
      return { errors, warnings };
    });
    const jobErrors = computed(() => {
      const errors = {};
      if (formData.hsCode) {
        const digits = formData.hsCode.replace(/\D/g, "");
        if (digits.length > 0 && digits.length < 6) {
          errors.hsCode = "Min. 6 digits";
        }
      }
      return errors;
    });
    const TRADE_TYPES = [
      { id: "EXPORT", name: "Export" },
      { id: "IMPORT", name: "Import" },
    ];
    const BL_TYPES = [
      { id: "DRAFT", name: "DRAFT" },
      { id: "ORIGINAL", name: "ORIGINAL" },
      { id: "SEAWAYBILL", name: "SEAWAYBILL" },
    ];
    const FREIGHT_TERMS = [
      { id: "PREPAID", name: "PREPAID" },
      { id: "COLLECT", name: "COLLECT" },
    ];
    const SECTIONS = [
      { id: "job-info", label: "Job Information", step: 1 },
      { id: "parties", label: "Involved Parties", step: 2 },
      { id: "route", label: "Route Details", step: 3 },
      { id: "cargo", label: "Cargo Information", step: 4 },
      { id: "movement", label: "Movement & Schedule", step: 5 },
      { id: "weight", label: "Weight & Measurement", step: 6 },
      { id: "bl", label: "BL Setup", step: 7 },
    ];
    const activeSection = ref("job-info");
    function handleCreateCompany(name, field) {
      companyForm.name = name;
      activeCompanyField.value = field;
      isCompanyModalOpen.value = true;
    }
    async function submitCompanyForm() {
      if (!companyForm.name) return;
      try {
        isSubmittingCompany.value = true;
        const addressPayload =
          companyForm.fullAddress || companyForm.city
            ? {
                fullAddress: companyForm.fullAddress || companyForm.city || "-",
                street: companyForm.street,
                city: companyForm.city,
                state: companyForm.state,
                postalCode: companyForm.postalCode,
                country: companyForm.country,
                eori: companyForm.eori,
                taxId: companyForm.taxId,
              }
            : void 0;
        const result = await createCompany(companyForm.name, addressPayload);
        if (result.success && result.data) {
          await refreshMasterData();
          if (activeCompanyField.value) {
            formData[activeCompanyField.value] = result.data.id;
          }
          isCompanyModalOpen.value = false;
        }
      } finally {
        isSubmittingCompany.value = false;
      }
    }
    async function handleCreateVessel(name, vessel) {
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
          vessel.vesselName = result.data.name;
        } else {
          formData.vesselId = result.data.id;
          if (formData.vessels.length > 0 && formData.vessels[0]) {
            formData.vessels[0].vesselId = result.data.id;
            formData.vessels[0].vesselName = result.data.name;
          }
        }
        toast.success(`Vessel "${name}" created successfully.`);
      } else {
        toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in pb-10" }, _attrs))}><div class="sticky top-16 z-[900] -mx-6 -mt-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-200"><header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-4"><button type="button" class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">`,
      );
      _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent));
      _push(`</button><h1 class="text-xl font-bold flex items-center gap-2 text-foreground">`);
      _push(
        ssrRenderComponent(unref(Briefcase), { class: "w-5 h-5 text-[#062c58]" }, null, _parent),
      );
      _push(
        ` Edit Job </h1></div><div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"><button type="button" class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4"${ssrIncludeBooleanAttr(unref(isJobLoading)) ? " disabled" : ""}> Cancel </button><button type="button" class="btn-primary flex-1 sm:flex-none justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"${ssrIncludeBooleanAttr(unref(isJobLoading)) ? " disabled" : ""}>`,
      );
      _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` ${ssrInterpolate(unref(isJobLoading) ? "Saving..." : "Save Changes")}</button></div></header></div>`,
      );
      if (unref(isJobLoading)) {
        _push(
          `<div class="flex flex-col items-center justify-center py-20 gap-4"><div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p class="text-muted-foreground animate-pulse">Loading job details...</p></div>`,
        );
      } else {
        _push(
          `<div class="flex gap-8 relative px-0"><aside class="w-64 shrink-0 hidden lg:block"><div class="sticky top-36"><nav class="space-y-2"><!--[-->`,
        );
        ssrRenderList(SECTIONS, (section) => {
          _push(
            `<button class="${ssrRenderClass([
              [
                unref(activeSection) === section.id
                  ? "bg-blue-50/50 border-[#062c58]/20 text-[#062c58] shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent",
              ],
              "w-full flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all text-left border",
            ])}"><span class="${ssrRenderClass([
              unref(activeSection) === section.id
                ? "bg-[#062c58] text-white border-[#062c58]"
                : "border-current opacity-70",
              "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors",
            ])}">${ssrInterpolate(section.step)}</span> ${ssrInterpolate(section.label)}</button>`,
          );
        });
        _push(
          `<!--]--></nav></div></aside><main id="main-scroll-container" class="flex-1 w-full min-w-0"><div class="max-w-6xl mx-auto space-y-6 pb-20">`,
        );
        _push(
          ssrRenderComponent(
            _sfc_main$1,
            {
              id: "job-info",
              title: "Job Information",
              icon: unref(Briefcase),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="grid grid-cols-1 md:grid-cols-4 gap-6"${_scopeId}><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>JOB NUMBER</label></div><input type="text"${ssrRenderAttr("value", unref(jobDetails)?.jobNumber)} class="input-field bg-muted/30 cursor-not-allowed border-dashed" disabled${_scopeId}></div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center justify-between"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}> JOB CUSTOMER <span class="text-destructive"${_scopeId}>*</span></label><div class="flex gap-2"${_scopeId}>`,
                  );
                  if (unref(formData).shipperId) {
                    _push2(
                      `<button type="button" class="text-[9px] font-bold text-blue-600 hover:underline uppercase"${_scopeId}> Use Shipper </button>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(formData).consigneeId) {
                    _push2(
                      `<button type="button" class="text-[9px] font-bold text-blue-600 hover:underline uppercase"${_scopeId}> Use Consignee </button>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: unref(formData).customerId,
                        "onUpdate:modelValue": ($event) => (unref(formData).customerId = $event),
                        options: unref(companies),
                        "label-key": "name",
                        "value-key": "id",
                        placeholder: "Select Main Customer...",
                        "allow-create": "",
                        onCreate: (name) => handleCreateCompany(name, "customerId"),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>SERVICE TYPE <span class="text-destructive"${_scopeId}>*</span></label></div>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: unref(formData).tradeTypeId,
                        "onUpdate:modelValue": ($event) => (unref(formData).tradeTypeId = $event),
                        options: TRADE_TYPES,
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>STATUS</label></div><div class="h-11 flex items-center"${_scopeId}><span class="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider bg-blue-50/50 text-blue-700 border border-blue-200/50"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"${_scopeId}></span> ${ssrInterpolate(unref(jobDetails)?.status?.name || "Active")}</span></div></div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>CREATED BY</label></div><div class="h-11 flex items-center gap-2.5"${_scopeId}><div class="w-8 h-8 rounded-full bg-[#062c58]/10 text-[#062c58] flex items-center justify-center text-[12px] font-black border border-[#062c58]/10 shadow-sm"${_scopeId}>${ssrInterpolate(unref(jobDetails)?.createdBy ? unref(jobDetails).createdBy.substring(0, 2).toUpperCase() : "AD")}</div><span class="text-sm font-semibold text-foreground/80"${_scopeId}>${ssrInterpolate(unref(jobDetails)?.createdBy || "Administrator")}</span></div></div></div>`,
                  );
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-6" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-6 flex items-center" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                            },
                            "JOB NUMBER",
                          ),
                        ]),
                        createVNode(
                          "input",
                          {
                            type: "text",
                            value: unref(jobDetails)?.jobNumber,
                            class: "input-field bg-muted/30 cursor-not-allowed border-dashed",
                            disabled: "",
                          },
                          null,
                          8,
                          ["value"],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-6 flex items-center justify-between" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                            },
                            [
                              createTextVNode(" JOB CUSTOMER "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                          createVNode("div", { class: "flex gap-2" }, [
                            unref(formData).shipperId
                              ? (openBlock(),
                                createBlock(
                                  "button",
                                  {
                                    key: 0,
                                    type: "button",
                                    onClick: ($event) =>
                                      (unref(formData).customerId = unref(formData).shipperId),
                                    class:
                                      "text-[9px] font-bold text-blue-600 hover:underline uppercase",
                                  },
                                  " Use Shipper ",
                                  8,
                                  ["onClick"],
                                ))
                              : createCommentVNode("", true),
                            unref(formData).consigneeId
                              ? (openBlock(),
                                createBlock(
                                  "button",
                                  {
                                    key: 1,
                                    type: "button",
                                    onClick: ($event) =>
                                      (unref(formData).customerId = unref(formData).consigneeId),
                                    class:
                                      "text-[9px] font-bold text-blue-600 hover:underline uppercase",
                                  },
                                  " Use Consignee ",
                                  8,
                                  ["onClick"],
                                ))
                              : createCommentVNode("", true),
                          ]),
                        ]),
                        createVNode(
                          Combobox,
                          {
                            modelValue: unref(formData).customerId,
                            "onUpdate:modelValue": ($event) =>
                              (unref(formData).customerId = $event),
                            options: unref(companies),
                            "label-key": "name",
                            "value-key": "id",
                            placeholder: "Select Main Customer...",
                            "allow-create": "",
                            onCreate: (name) => handleCreateCompany(name, "customerId"),
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "options", "onCreate"],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-6 flex items-center" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                            },
                            [
                              createTextVNode("SERVICE TYPE "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                        ]),
                        createVNode(
                          Combobox,
                          {
                            modelValue: unref(formData).tradeTypeId,
                            "onUpdate:modelValue": ($event) =>
                              (unref(formData).tradeTypeId = $event),
                            options: TRADE_TYPES,
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue"],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-6 flex items-center" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                            },
                            "STATUS",
                          ),
                        ]),
                        createVNode("div", { class: "h-11 flex items-center" }, [
                          createVNode(
                            "span",
                            {
                              class:
                                "inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider bg-blue-50/50 text-blue-700 border border-blue-200/50",
                            },
                            [
                              createVNode("span", {
                                class: "w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse",
                              }),
                              createTextVNode(
                                " " + toDisplayString(unref(jobDetails)?.status?.name || "Active"),
                                1,
                              ),
                            ],
                          ),
                        ]),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-6 flex items-center" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                            },
                            "CREATED BY",
                          ),
                        ]),
                        createVNode("div", { class: "h-11 flex items-center gap-2.5" }, [
                          createVNode(
                            "div",
                            {
                              class:
                                "w-8 h-8 rounded-full bg-[#062c58]/10 text-[#062c58] flex items-center justify-center text-[12px] font-black border border-[#062c58]/10 shadow-sm",
                            },
                            toDisplayString(
                              unref(jobDetails)?.createdBy
                                ? unref(jobDetails).createdBy.substring(0, 2).toUpperCase()
                                : "AD",
                            ),
                            1,
                          ),
                          createVNode(
                            "span",
                            { class: "text-sm font-semibold text-foreground/80" },
                            toDisplayString(unref(jobDetails)?.createdBy || "Administrator"),
                            1,
                          ),
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
            _sfc_main$1,
            {
              id: "parties",
              title: "Involved Parties",
              icon: unref(Users),
              "no-padding": "",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="w-full"${_scopeId}><div class="grid grid-cols-12 gap-6 px-6 py-3 border-b border-border bg-muted/5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}><div class="col-span-2"${_scopeId}>ROLE</div><div class="col-span-4"${_scopeId}>COMPANY</div><div class="col-span-4"${_scopeId}>ADDRESS</div><div class="col-span-2"${_scopeId}>DETAILS</div></div><div class="divide-y divide-border/50"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      _sfc_main$2,
                      {
                        label: "Shipper",
                        required: "",
                        companies: unref(companies),
                        companyId: unref(formData).shipperId,
                        "onUpdate:companyId": ($event) => (unref(formData).shipperId = $event),
                        addressId: unref(formData).shipperAddressId,
                        "onUpdate:addressId": ($event) =>
                          (unref(formData).shipperAddressId = $event),
                        "z-index": "40",
                        onCreate: (name) => handleCreateCompany(name, "shipperId"),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    ssrRenderComponent(
                      _sfc_main$2,
                      {
                        label: "Consignee",
                        required: "",
                        companies: unref(companies),
                        companyId: unref(formData).consigneeId,
                        "onUpdate:companyId": ($event) => (unref(formData).consigneeId = $event),
                        addressId: unref(formData).consigneeAddressId,
                        "onUpdate:addressId": ($event) =>
                          (unref(formData).consigneeAddressId = $event),
                        "z-index": "30",
                        onCreate: (name) => handleCreateCompany(name, "consigneeId"),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    ssrRenderComponent(
                      _sfc_main$2,
                      {
                        label: "Notify Party",
                        companies: unref(companies),
                        companyId: unref(formData).notifyPartyId,
                        "onUpdate:companyId": ($event) => (unref(formData).notifyPartyId = $event),
                        addressId: unref(formData).notifyPartyAddressId,
                        "onUpdate:addressId": ($event) =>
                          (unref(formData).notifyPartyAddressId = $event),
                        "z-index": "20",
                        "has-extra-controls": "",
                        "disabled-company": unref(formData).isNotifySameAsConsignee,
                        onCreate: (name) => handleCreateCompany(name, "notifyPartyId"),
                      },
                      {
                        "extra-controls": withCtx((_2, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(
                              `<label class="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"${_scopeId2}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formData).isNotifySameAsConsignee) ? ssrLooseContain(unref(formData).isNotifySameAsConsignee, null) : unref(formData).isNotifySameAsConsignee) ? " checked" : ""} class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"${_scopeId2}><span class="group-hover:underline"${_scopeId2}>Same as Consignee</span></label>`,
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
                                          (unref(formData).isNotifySameAsConsignee = $event),
                                        class:
                                          "rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all",
                                      },
                                      null,
                                      8,
                                      ["onUpdate:modelValue"],
                                    ),
                                    [[vModelCheckbox, unref(formData).isNotifySameAsConsignee]],
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
                      _sfc_main$2,
                      {
                        label: "Forwarder",
                        description: "(Optional)",
                        companies: unref(companies),
                        companyId: unref(formData).forwarderId,
                        "onUpdate:companyId": ($event) => (unref(formData).forwarderId = $event),
                        addressId: unref(formData).forwarderAddressId,
                        "onUpdate:addressId": ($event) =>
                          (unref(formData).forwarderAddressId = $event),
                        "z-index": "10",
                        onCreate: (name) => handleCreateCompany(name, "forwarderId"),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "w-full" }, [
                      createVNode(
                        "div",
                        {
                          class:
                            "grid grid-cols-12 gap-6 px-6 py-3 border-b border-border bg-muted/5 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase",
                        },
                        [
                          createVNode("div", { class: "col-span-2" }, "ROLE"),
                          createVNode("div", { class: "col-span-4" }, "COMPANY"),
                          createVNode("div", { class: "col-span-4" }, "ADDRESS"),
                          createVNode("div", { class: "col-span-2" }, "DETAILS"),
                        ],
                      ),
                      createVNode("div", { class: "divide-y divide-border/50" }, [
                        createVNode(
                          _sfc_main$2,
                          {
                            label: "Shipper",
                            required: "",
                            companies: unref(companies),
                            companyId: unref(formData).shipperId,
                            "onUpdate:companyId": ($event) => (unref(formData).shipperId = $event),
                            addressId: unref(formData).shipperAddressId,
                            "onUpdate:addressId": ($event) =>
                              (unref(formData).shipperAddressId = $event),
                            "z-index": "40",
                            onCreate: (name) => handleCreateCompany(name, "shipperId"),
                          },
                          null,
                          8,
                          [
                            "companies",
                            "companyId",
                            "onUpdate:companyId",
                            "addressId",
                            "onUpdate:addressId",
                            "onCreate",
                          ],
                        ),
                        createVNode(
                          _sfc_main$2,
                          {
                            label: "Consignee",
                            required: "",
                            companies: unref(companies),
                            companyId: unref(formData).consigneeId,
                            "onUpdate:companyId": ($event) =>
                              (unref(formData).consigneeId = $event),
                            addressId: unref(formData).consigneeAddressId,
                            "onUpdate:addressId": ($event) =>
                              (unref(formData).consigneeAddressId = $event),
                            "z-index": "30",
                            onCreate: (name) => handleCreateCompany(name, "consigneeId"),
                          },
                          null,
                          8,
                          [
                            "companies",
                            "companyId",
                            "onUpdate:companyId",
                            "addressId",
                            "onUpdate:addressId",
                            "onCreate",
                          ],
                        ),
                        createVNode(
                          _sfc_main$2,
                          {
                            label: "Notify Party",
                            companies: unref(companies),
                            companyId: unref(formData).notifyPartyId,
                            "onUpdate:companyId": ($event) =>
                              (unref(formData).notifyPartyId = $event),
                            addressId: unref(formData).notifyPartyAddressId,
                            "onUpdate:addressId": ($event) =>
                              (unref(formData).notifyPartyAddressId = $event),
                            "z-index": "20",
                            "has-extra-controls": "",
                            "disabled-company": unref(formData).isNotifySameAsConsignee,
                            onCreate: (name) => handleCreateCompany(name, "notifyPartyId"),
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
                                          (unref(formData).isNotifySameAsConsignee = $event),
                                        class:
                                          "rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all",
                                      },
                                      null,
                                      8,
                                      ["onUpdate:modelValue"],
                                    ),
                                    [[vModelCheckbox, unref(formData).isNotifySameAsConsignee]],
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
                            "onCreate",
                          ],
                        ),
                        createVNode(
                          _sfc_main$2,
                          {
                            label: "Forwarder",
                            description: "(Optional)",
                            companies: unref(companies),
                            companyId: unref(formData).forwarderId,
                            "onUpdate:companyId": ($event) =>
                              (unref(formData).forwarderId = $event),
                            addressId: unref(formData).forwarderAddressId,
                            "onUpdate:addressId": ($event) =>
                              (unref(formData).forwarderAddressId = $event),
                            "z-index": "10",
                            onCreate: (name) => handleCreateCompany(name, "forwarderId"),
                          },
                          null,
                          8,
                          [
                            "companies",
                            "companyId",
                            "onUpdate:companyId",
                            "addressId",
                            "onUpdate:addressId",
                            "onCreate",
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
            _sfc_main$1,
            {
              id: "route",
              title: "Route Details",
              icon: unref(MapPin),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 relative items-end border-b border-border/50 pb-6 mb-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PRE-CARRIAGE BY</label><input${ssrRenderAttr("value", unref(formData).preCarriageBy)} type="text" placeholder="e.g. TRUCK" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PLACE OF RECEIPT</label><input${ssrRenderAttr("value", unref(formData).placeOfReceipt)} type="text" placeholder="Defaults to POL if empty" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PORT OF LOADING (POL)</label><div class="relative"${_scopeId}>`,
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
                        modelValue: unref(formData).pol,
                        "onUpdate:modelValue": ($event) => (unref(formData).pol = $event),
                        options: unref(portsPol),
                        "label-key": "name",
                        "value-key": "code",
                        placeholder: "Search port...",
                        class: [
                          "[&_button]:pl-9",
                          {
                            "[&_button]:border-destructive [&_button]:ring-destructive/20":
                              unref(routeErrors).polPod,
                          },
                        ],
                        "filter-local": false,
                        onSearch: handleSearchPol,
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</div>`);
                  if (unref(routeErrors).polPod) {
                    _push2(
                      `<p class="text-[10px] text-destructive font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(routeErrors).polPod)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `</div><div class="hidden md:flex absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      unref(ArrowLeft),
                      { class: "w-5 h-5 rotate-180 opacity-0" },
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
                        modelValue: unref(formData).pod,
                        "onUpdate:modelValue": ($event) => (unref(formData).pod = $event),
                        options: unref(portsPod),
                        "label-key": "name",
                        "value-key": "code",
                        placeholder: "Search port...",
                        class: [
                          "[&_button]:pl-9",
                          {
                            "[&_button]:border-destructive [&_button]:ring-destructive/20":
                              unref(routeErrors).polPod,
                          },
                        ],
                        "filter-local": false,
                        onSearch: handleSearchPod,
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(`</div>`);
                  if (unref(routeErrors).polPod) {
                    _push2(
                      `<p class="text-[10px] text-destructive font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(routeErrors).polPod)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PLACE OF DELIVERY</label><input${ssrRenderAttr("value", unref(formData).placeOfDelivery)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>FINAL DESTINATION</label><input${ssrRenderAttr("value", unref(formData).finalDestination)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div></div>`,
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
                                  (unref(formData).preCarriageBy = $event),
                                type: "text",
                                placeholder: "e.g. TRUCK",
                                class: "input-field",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).preCarriageBy]],
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
                                  (unref(formData).placeOfReceipt = $event),
                                type: "text",
                                placeholder: "Defaults to POL if empty",
                                class: "input-field",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).placeOfReceipt]],
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
                                modelValue: unref(formData).pol,
                                "onUpdate:modelValue": ($event) => (unref(formData).pol = $event),
                                options: unref(portsPol),
                                "label-key": "name",
                                "value-key": "code",
                                placeholder: "Search port...",
                                class: [
                                  "[&_button]:pl-9",
                                  {
                                    "[&_button]:border-destructive [&_button]:ring-destructive/20":
                                      unref(routeErrors).polPod,
                                  },
                                ],
                                "filter-local": false,
                                onSearch: handleSearchPol,
                              },
                              null,
                              8,
                              ["modelValue", "onUpdate:modelValue", "options", "class"],
                            ),
                          ]),
                          unref(routeErrors).polPod
                            ? (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 0,
                                  class: "text-[10px] text-destructive font-medium mt-1",
                                },
                                toDisplayString(unref(routeErrors).polPod),
                                1,
                              ))
                            : createCommentVNode("", true),
                        ]),
                        createVNode(
                          "div",
                          {
                            class:
                              "hidden md:flex absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 text-muted-foreground/40",
                          },
                          [
                            createVNode(unref(ArrowLeft), {
                              class: "w-5 h-5 rotate-180 opacity-0",
                            }),
                          ],
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
                                modelValue: unref(formData).pod,
                                "onUpdate:modelValue": ($event) => (unref(formData).pod = $event),
                                options: unref(portsPod),
                                "label-key": "name",
                                "value-key": "code",
                                placeholder: "Search port...",
                                class: [
                                  "[&_button]:pl-9",
                                  {
                                    "[&_button]:border-destructive [&_button]:ring-destructive/20":
                                      unref(routeErrors).polPod,
                                  },
                                ],
                                "filter-local": false,
                                onSearch: handleSearchPod,
                              },
                              null,
                              8,
                              ["modelValue", "onUpdate:modelValue", "options", "class"],
                            ),
                          ]),
                          unref(routeErrors).polPod
                            ? (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 0,
                                  class: "text-[10px] text-destructive font-medium mt-1",
                                },
                                toDisplayString(unref(routeErrors).polPod),
                                1,
                              ))
                            : createCommentVNode("", true),
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
                                  (unref(formData).placeOfDelivery = $event),
                                type: "text",
                                placeholder: "Defaults to POD if empty",
                                class: "input-field",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).placeOfDelivery]],
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
                                  (unref(formData).finalDestination = $event),
                                type: "text",
                                placeholder: "Defaults to POD if empty",
                                class: "input-field",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).finalDestination]],
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
            _sfc_main$1,
            {
              id: "cargo",
              title: "Cargo Information",
              icon: unref(Box),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="space-y-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>HS CODE / COMMODITY</label><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"${_scopeId}><div class="md:col-span-1"${_scopeId}><input${ssrRenderAttr("value", unref(formData).hsCode)} type="text" placeholder="e.g. 1902..." class="${ssrRenderClass(
                      [
                        {
                          "!border-destructive focus:!ring-destructive/20": unref(jobErrors).hsCode,
                        },
                        "input-field",
                      ],
                    )}" required${_scopeId}>`,
                  );
                  if (unref(jobErrors).hsCode) {
                    _push2(
                      `<p class="text-[10px] text-destructive mt-1 font-medium"${_scopeId}>${ssrInterpolate(unref(jobErrors).hsCode)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `</div><div class="md:col-span-3"${_scopeId}><textarea rows="6" placeholder="e.g. 3317 CARTONS OF INSTANT NOODLES" class="input-field min-h-[120px] py-3 resize-y transition-all duration-200" required${_scopeId}>${ssrInterpolate(unref(formData).commodity)}</textarea></div></div></div><div class="border rounded-xl overflow-visible mt-6"${_scopeId}><div class="bg-muted/10 px-4 py-3 border-b flex justify-between items-center rounded-t-xl"${_scopeId}><h3 class="font-medium text-[14px]"${_scopeId}>Containers &amp; Seals</h3><button type="button" class="btn-outline h-8 px-3 text-xs gap-1.5 flex items-center"${_scopeId}>`,
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
                  ssrRenderList(unref(formData).containers, (container, index) => {
                    _push2(
                      `<div class="space-y-4 pb-4 border-b border-border/50 last:border-0 last:pb-0"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative"${_scopeId}><div class="col-span-3 space-y-1.5 pt-px"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase opacity-70"${_scopeId}>Type</label>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        Combobox,
                        {
                          modelValue: container.containerTypeId,
                          "onUpdate:modelValue": ($event) => (container.containerTypeId = $event),
                          options: unref(containerTypes),
                          placeholder: "Select Type...",
                        },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(
                      `</div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>CONTAINER NO.</label><input${ssrRenderAttr("value", container.containerNumber)} type="text" placeholder="e.g. TEMU1234567" class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[container.id],
                          },
                          "input-field uppercase",
                        ],
                      )}"${_scopeId}>`,
                    );
                    if (unref(containerErrors)[container.id]) {
                      _push2(
                        `<p class="text-[10px] text-destructive mt-1 font-medium"${_scopeId}>${ssrInterpolate(unref(containerErrors)[container.id])}</p>`,
                      );
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(
                      `</div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SEAL NO.</label><input${ssrRenderAttr("value", container.sealNumber)} type="text" placeholder="e.g. SN123456" class="input-field uppercase"${_scopeId}></div><div class="md:col-span-1 flex flex-col items-center justify-center pb-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase mb-1"${_scopeId}>HM</label><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(container.isHazardous) ? ssrLooseContain(container.isHazardous, null) : container.isHazardous) ? " checked" : ""} class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"${_scopeId}></div><div class="md:col-span-1 flex justify-end pb-1.5"${_scopeId}><button type="button"${ssrIncludeBooleanAttr(unref(formData).containers.length === 1) ? " disabled" : ""} class="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"${_scopeId}>`,
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
                        `<div class="p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative"${_scopeId}><button type="button" class="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"${ssrIncludeBooleanAttr(container.items.length === 1) ? " disabled" : ""}${_scopeId}>`,
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
                        `</button><div class="grid grid-cols-12 gap-3 pr-6"${_scopeId}><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Qty</label><div class="relative"${_scopeId}><input type="number"${ssrRenderAttr("value", item.qty)} class="${ssrRenderClass(
                          [
                            {
                              "!border-destructive focus:!ring-destructive/20":
                                unref(containerErrors)[`${container.id}-${item.id}-qty`],
                            },
                            "input-field h-8 text-sm",
                          ],
                        )}"${_scopeId}>`,
                      );
                      if (unref(containerErrors)[`${container.id}-${item.id}-qty`]) {
                        _push2(
                          `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-qty`])}</p>`,
                        );
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(
                        `</div></div><div class="col-span-3 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Unit</label>`,
                      );
                      _push2(
                        ssrRenderComponent(
                          Combobox,
                          {
                            modelValue: item.packageTypeCode,
                            "onUpdate:modelValue": ($event) => (item.packageTypeCode = $event),
                            options: unref(packageTypes),
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
                        `</div><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>GW (KG)</label><div class="relative"${_scopeId}><input type="number"${ssrRenderAttr("value", item.grossWeight)} step="0.01" class="${ssrRenderClass(
                          [
                            {
                              "!border-destructive focus:!ring-destructive/20":
                                unref(containerErrors)[`${container.id}-${item.id}-gw`],
                            },
                            "input-field h-8 text-sm",
                          ],
                        )}"${_scopeId}>`,
                      );
                      if (unref(containerErrors)[`${container.id}-${item.id}-gw`]) {
                        _push2(
                          `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-gw`])}</p>`,
                        );
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(
                        `</div></div><div class="col-span-2 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>NW (KG)</label><div class="relative"${_scopeId}><input type="number"${ssrRenderAttr("value", item.netWeight)} step="0.01" class="${ssrRenderClass(
                          [
                            {
                              "!border-destructive focus:!ring-destructive/20":
                                unref(containerErrors)[`${container.id}-${item.id}-nw`],
                            },
                            "input-field h-8 text-sm",
                          ],
                        )}"${_scopeId}>`,
                      );
                      if (unref(containerErrors)[`${container.id}-${item.id}-nw`]) {
                        _push2(
                          `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-nw`])}</p>`,
                        );
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(
                        `</div></div><div class="col-span-3 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>CBM</label><div class="relative"${_scopeId}><input type="number"${ssrRenderAttr("value", item.measurementCbm)} step="0.01" class="${ssrRenderClass(
                          [
                            {
                              "!border-destructive focus:!ring-destructive/20":
                                unref(containerErrors)[`${container.id}-${item.id}-cbm`],
                            },
                            "input-field h-8 text-sm",
                          ],
                        )}"${_scopeId}>`,
                      );
                      if (unref(containerErrors)[`${container.id}-${item.id}-cbm`]) {
                        _push2(
                          `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-cbm`])}</p>`,
                        );
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(
                        `</div></div></div><div class="grid grid-cols-12 gap-3 pr-6 mt-1"${_scopeId}><div class="col-span-4 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>HS Code</label><div class="relative"${_scopeId}><input type="text"${ssrRenderAttr("value", item.hsCode)} class="${ssrRenderClass(
                          [
                            {
                              "!border-destructive focus:!ring-destructive/20":
                                unref(containerErrors)[`${container.id}-${item.id}-hscode`],
                            },
                            "input-field h-8 text-sm placeholder:opacity-50",
                          ],
                        )}" placeholder="e.g. 1902..."${_scopeId}>`,
                      );
                      if (unref(containerErrors)[`${container.id}-${item.id}-hscode`]) {
                        _push2(
                          `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-hscode`])}</p>`,
                        );
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(
                        `</div></div><div class="col-span-8 space-y-1"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground"${_scopeId}>Description Breakdown</label><textarea rows="4" class="input-field min-h-[100px] py-2 text-sm placeholder:opacity-50 resize-y transition-all duration-200" placeholder="Description of goods in this container..."${_scopeId}>${ssrInterpolate(item.description)}</textarea></div></div></div>`,
                      );
                    });
                    _push2(`<!--]--></div></div>`);
                  });
                  _push2(
                    `<!--]--></div></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SHIPPING MARKS</label><textarea rows="6" placeholder="Enter marks and numbers..." class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(unref(formData).shippingMark)}</textarea></div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>MAIN DESCRIPTION (GOODS DESCRIPTION)</label><textarea rows="8" placeholder="Enter detailed goods description..." class="input-field min-h-[150px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(unref(formData).mainDescription)}</textarea></div></div>`,
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
                        createVNode(
                          "div",
                          { class: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-4" },
                          [
                            createVNode("div", { class: "md:col-span-1" }, [
                              withDirectives(
                                createVNode(
                                  "input",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (unref(formData).hsCode = $event),
                                    type: "text",
                                    placeholder: "e.g. 1902...",
                                    class: [
                                      "input-field",
                                      {
                                        "!border-destructive focus:!ring-destructive/20":
                                          unref(jobErrors).hsCode,
                                      },
                                    ],
                                    required: "",
                                  },
                                  null,
                                  10,
                                  ["onUpdate:modelValue"],
                                ),
                                [[vModelText, unref(formData).hsCode]],
                              ),
                              unref(jobErrors).hsCode
                                ? (openBlock(),
                                  createBlock(
                                    "p",
                                    {
                                      key: 0,
                                      class: "text-[10px] text-destructive mt-1 font-medium",
                                    },
                                    toDisplayString(unref(jobErrors).hsCode),
                                    1,
                                  ))
                                : createCommentVNode("", true),
                            ]),
                            createVNode("div", { class: "md:col-span-3" }, [
                              withDirectives(
                                createVNode(
                                  "textarea",
                                  {
                                    "onUpdate:modelValue": ($event) =>
                                      (unref(formData).commodity = $event),
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
                                [[vModelText, unref(formData).commodity]],
                              ),
                            ]),
                          ],
                        ),
                      ]),
                      createVNode("div", { class: "border rounded-xl overflow-visible mt-6" }, [
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
                                onClick: ($event) =>
                                  unref(formData).containers.push({
                                    id: Date.now(),
                                    containerNumber: "",
                                    sealNumber: "",
                                    containerTypeId: "",
                                    isHazardous: false,
                                    items: [
                                      {
                                        id: Date.now() + 1,
                                        sequenceNo: 1,
                                        qty: 1,
                                        packageTypeCode: "",
                                        grossWeight: null,
                                        netWeight: null,
                                        measurementCbm: null,
                                        hsCode: "",
                                        description: "",
                                      },
                                    ],
                                  }),
                                class: "btn-outline h-8 px-3 text-xs gap-1.5 flex items-center",
                              },
                              [
                                createVNode(unref(Plus), { class: "w-3.5 h-3.5" }),
                                createTextVNode(" Add Container "),
                              ],
                              8,
                              ["onClick"],
                            ),
                          ],
                        ),
                        createVNode("div", { class: "p-4 space-y-4 bg-muted/5 rounded-b-xl" }, [
                          (openBlock(true),
                          createBlock(
                            Fragment,
                            null,
                            renderList(unref(formData).containers, (container, index) => {
                              return (
                                openBlock(),
                                createBlock(
                                  "div",
                                  {
                                    key: container.id,
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
                                                options: unref(containerTypes),
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
                                                class: [
                                                  "input-field uppercase",
                                                  {
                                                    "!border-destructive focus:!ring-destructive/20":
                                                      unref(containerErrors)[container.id],
                                                  },
                                                ],
                                              },
                                              null,
                                              10,
                                              ["onUpdate:modelValue"],
                                            ),
                                            [[vModelText, container.containerNumber]],
                                          ),
                                          unref(containerErrors)[container.id]
                                            ? (openBlock(),
                                              createBlock(
                                                "p",
                                                {
                                                  key: 0,
                                                  class:
                                                    "text-[10px] text-destructive mt-1 font-medium",
                                                },
                                                toDisplayString(
                                                  unref(containerErrors)[container.id],
                                                ),
                                                1,
                                              ))
                                            : createCommentVNode("", true),
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
                                                onClick: ($event) =>
                                                  unref(formData).containers.splice(index, 1),
                                                disabled: unref(formData).containers.length === 1,
                                                class:
                                                  "p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50",
                                              },
                                              [createVNode(unref(Trash2), { class: "w-4 h-4" })],
                                              8,
                                              ["onClick", "disabled"],
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
                                                  container.items.push({
                                                    id: Date.now(),
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
                                                  key: item.id,
                                                  class:
                                                    "p-3 bg-white border border-border/50 rounded-lg shadow-sm space-y-3 relative",
                                                },
                                                [
                                                  createVNode(
                                                    "button",
                                                    {
                                                      type: "button",
                                                      onClick: ($event) =>
                                                        container.items.splice(itemIndex, 1),
                                                      class:
                                                        "absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors",
                                                      disabled: container.items.length === 1,
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
                                                          createVNode(
                                                            "div",
                                                            { class: "relative" },
                                                            [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "number",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) => (item.qty = $event),
                                                                    class: [
                                                                      "input-field h-8 text-sm",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-qty`
                                                                          ],
                                                                      },
                                                                    ],
                                                                  },
                                                                  null,
                                                                  10,
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
                                                              unref(containerErrors)[
                                                                `${container.id}-${item.id}-qty`
                                                              ]
                                                                ? (openBlock(),
                                                                  createBlock(
                                                                    "p",
                                                                    {
                                                                      key: 0,
                                                                      class:
                                                                        "text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute",
                                                                    },
                                                                    toDisplayString(
                                                                      unref(containerErrors)[
                                                                        `${container.id}-${item.id}-qty`
                                                                      ],
                                                                    ),
                                                                    1,
                                                                  ))
                                                                : createCommentVNode("", true),
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
                                                              options: unref(packageTypes),
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
                                                          createVNode(
                                                            "div",
                                                            { class: "relative" },
                                                            [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "number",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) =>
                                                                      (item.grossWeight = $event),
                                                                    step: "0.01",
                                                                    class: [
                                                                      "input-field h-8 text-sm",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-gw`
                                                                          ],
                                                                      },
                                                                    ],
                                                                  },
                                                                  null,
                                                                  10,
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
                                                              unref(containerErrors)[
                                                                `${container.id}-${item.id}-gw`
                                                              ]
                                                                ? (openBlock(),
                                                                  createBlock(
                                                                    "p",
                                                                    {
                                                                      key: 0,
                                                                      class:
                                                                        "text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute",
                                                                    },
                                                                    toDisplayString(
                                                                      unref(containerErrors)[
                                                                        `${container.id}-${item.id}-gw`
                                                                      ],
                                                                    ),
                                                                    1,
                                                                  ))
                                                                : createCommentVNode("", true),
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
                                                          createVNode(
                                                            "div",
                                                            { class: "relative" },
                                                            [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "number",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) => (item.netWeight = $event),
                                                                    step: "0.01",
                                                                    class: [
                                                                      "input-field h-8 text-sm",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-nw`
                                                                          ],
                                                                      },
                                                                    ],
                                                                  },
                                                                  null,
                                                                  10,
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
                                                              unref(containerErrors)[
                                                                `${container.id}-${item.id}-nw`
                                                              ]
                                                                ? (openBlock(),
                                                                  createBlock(
                                                                    "p",
                                                                    {
                                                                      key: 0,
                                                                      class:
                                                                        "text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute",
                                                                    },
                                                                    toDisplayString(
                                                                      unref(containerErrors)[
                                                                        `${container.id}-${item.id}-nw`
                                                                      ],
                                                                    ),
                                                                    1,
                                                                  ))
                                                                : createCommentVNode("", true),
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
                                                          createVNode(
                                                            "div",
                                                            { class: "relative" },
                                                            [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "number",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) =>
                                                                      (item.measurementCbm =
                                                                        $event),
                                                                    step: "0.01",
                                                                    class: [
                                                                      "input-field h-8 text-sm",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-cbm`
                                                                          ],
                                                                      },
                                                                    ],
                                                                  },
                                                                  null,
                                                                  10,
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
                                                              unref(containerErrors)[
                                                                `${container.id}-${item.id}-cbm`
                                                              ]
                                                                ? (openBlock(),
                                                                  createBlock(
                                                                    "p",
                                                                    {
                                                                      key: 0,
                                                                      class:
                                                                        "text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute",
                                                                    },
                                                                    toDisplayString(
                                                                      unref(containerErrors)[
                                                                        `${container.id}-${item.id}-cbm`
                                                                      ],
                                                                    ),
                                                                    1,
                                                                  ))
                                                                : createCommentVNode("", true),
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
                                                          createVNode(
                                                            "div",
                                                            { class: "relative" },
                                                            [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "text",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) => (item.hsCode = $event),
                                                                    class: [
                                                                      "input-field h-8 text-sm placeholder:opacity-50",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-hscode`
                                                                          ],
                                                                      },
                                                                    ],
                                                                    placeholder: "e.g. 1902...",
                                                                  },
                                                                  null,
                                                                  10,
                                                                  ["onUpdate:modelValue"],
                                                                ),
                                                                [[vModelText, item.hsCode]],
                                                              ),
                                                              unref(containerErrors)[
                                                                `${container.id}-${item.id}-hscode`
                                                              ]
                                                                ? (openBlock(),
                                                                  createBlock(
                                                                    "p",
                                                                    {
                                                                      key: 0,
                                                                      class:
                                                                        "text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute",
                                                                    },
                                                                    toDisplayString(
                                                                      unref(containerErrors)[
                                                                        `${container.id}-${item.id}-hscode`
                                                                      ],
                                                                    ),
                                                                    1,
                                                                  ))
                                                                : createCommentVNode("", true),
                                                            ],
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
                                                                rows: "4",
                                                                class:
                                                                  "input-field min-h-[100px] py-2 text-sm placeholder:opacity-50 resize-y transition-all duration-200",
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
                                (unref(formData).shippingMark = $event),
                              rows: "6",
                              placeholder: "Enter marks and numbers...",
                              class:
                                "input-field min-h-[120px] py-3 resize-y transition-all duration-200",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(formData).shippingMark]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "MAIN DESCRIPTION (GOODS DESCRIPTION)",
                        ),
                        withDirectives(
                          createVNode(
                            "textarea",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).mainDescription = $event),
                              rows: "8",
                              placeholder: "Enter detailed goods description...",
                              class:
                                "input-field min-h-[150px] py-3 resize-y transition-all duration-200",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(formData).mainDescription]],
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
            _sfc_main$1,
            {
              id: "movement",
              title: "Movement & Schedule",
              icon: unref(Clock),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="md:col-span-2 space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>VESSEL SCHEDULE (MULTI-VESSEL)</label><button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"${_scopeId}>`,
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
                  ssrRenderList(unref(formData).vessels, (vessel, index) => {
                    _push2(
                      `<div class="p-4 bg-muted/5 border border-border/50 rounded-xl relative group animate-fade-in"${_scopeId}>`,
                    );
                    if (unref(formData).vessels.length > 1) {
                      _push2(
                        `<button type="button" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-border text-muted-foreground hover:text-destructive rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"${_scopeId}>`,
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
                      _push2(`</button>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(
                      `<div class="grid grid-cols-1 md:grid-cols-12 gap-4"${_scopeId}><div class="md:col-span-1 flex items-center justify-center"${_scopeId}><div class="w-8 h-8 rounded-full bg-blue-50 text-[#062c58] flex items-center justify-center text-xs font-bold border border-blue-100"${_scopeId}>${ssrInterpolate(index + 1)}</div></div><div class="md:col-span-4 self-end"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"${_scopeId}>Vessel Name</label>`,
                    );
                    _push2(
                      ssrRenderComponent(
                        Combobox,
                        {
                          modelValue: vessel.vesselId,
                          "onUpdate:modelValue": ($event) => (vessel.vesselId = $event),
                          options: unref(vessels),
                          "label-key": "name",
                          "value-key": "id",
                          placeholder: "Select vessel...",
                          "allow-create": "",
                          onCreate: (name) => handleCreateVessel(name, vessel),
                        },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(
                      `</div><div class="md:col-span-3 self-end"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"${_scopeId}>Voyage Number</label><input${ssrRenderAttr("value", vessel.voyageNumber)} type="text" class="input-field" placeholder="Voyage..."${_scopeId}></div><div class="md:col-span-4 self-end"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase mb-1 block"${_scopeId}>ETD</label><input${ssrRenderAttr("value", vessel.etd)} type="date" class="input-field"${_scopeId}></div></div></div>`,
                    );
                  });
                  _push2(
                    `<!--]--></div></div><div class="space-y-2 self-end"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SHIPPING LINE</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: unref(formData).vendorId,
                        "onUpdate:modelValue": ($event) => (unref(formData).vendorId = $event),
                        options: unref(companies),
                        "label-key": "name",
                        "value-key": "id",
                        placeholder: "Select Shipping Line...",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>ETD</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      DatePicker,
                      {
                        modelValue: unref(formData).etd,
                        "onUpdate:modelValue": ($event) => (unref(formData).etd = $event),
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>ETA</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      DatePicker,
                      {
                        modelValue: unref(formData).eta,
                        "onUpdate:modelValue": ($event) => (unref(formData).eta = $event),
                        class: {
                          "[&_button]:border-destructive [&_button]:ring-destructive/20":
                            unref(scheduleErrors).eta,
                        },
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  if (unref(scheduleErrors).eta) {
                    _push2(
                      `<p class="text-[10px] text-destructive mt-1 font-medium"${_scopeId}>${ssrInterpolate(unref(scheduleErrors).eta)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                      createVNode("div", { class: "md:col-span-2 space-y-4" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            "VESSEL SCHEDULE (MULTI-VESSEL)",
                          ),
                          createVNode(
                            "button",
                            {
                              type: "button",
                              onClick: ($event) =>
                                unref(formData).vessels.push({
                                  vesselId: "",
                                  vesselName: "",
                                  voyageNumber: "",
                                  etd: "",
                                  sequence: unref(formData).vessels.length,
                                }),
                              class:
                                "text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1",
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
                            renderList(unref(formData).vessels, (vessel, index) => {
                              return (
                                openBlock(),
                                createBlock(
                                  "div",
                                  {
                                    key: index,
                                    class:
                                      "p-4 bg-muted/5 border border-border/50 rounded-xl relative group animate-fade-in",
                                  },
                                  [
                                    unref(formData).vessels.length > 1
                                      ? (openBlock(),
                                        createBlock(
                                          "button",
                                          {
                                            key: 0,
                                            type: "button",
                                            onClick: ($event) =>
                                              unref(formData).vessels.splice(index, 1),
                                            class:
                                              "absolute -top-2 -right-2 w-6 h-6 bg-white border border-border text-muted-foreground hover:text-destructive rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10",
                                          },
                                          [createVNode(unref(Trash2), { class: "w-3.5 h-3.5" })],
                                          8,
                                          ["onClick"],
                                        ))
                                      : createCommentVNode("", true),
                                    createVNode(
                                      "div",
                                      { class: "grid grid-cols-1 md:grid-cols-12 gap-4" },
                                      [
                                        createVNode(
                                          "div",
                                          {
                                            class: "md:col-span-1 flex items-center justify-center",
                                          },
                                          [
                                            createVNode(
                                              "div",
                                              {
                                                class:
                                                  "w-8 h-8 rounded-full bg-blue-50 text-[#062c58] flex items-center justify-center text-xs font-bold border border-blue-100",
                                              },
                                              toDisplayString(index + 1),
                                              1,
                                            ),
                                          ],
                                        ),
                                        createVNode("div", { class: "md:col-span-4 self-end" }, [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[10px] font-bold text-muted-foreground uppercase mb-1 block",
                                            },
                                            "Vessel Name",
                                          ),
                                          createVNode(
                                            Combobox,
                                            {
                                              modelValue: vessel.vesselId,
                                              "onUpdate:modelValue": ($event) =>
                                                (vessel.vesselId = $event),
                                              options: unref(vessels),
                                              "label-key": "name",
                                              "value-key": "id",
                                              placeholder: "Select vessel...",
                                              "allow-create": "",
                                              onCreate: (name) => handleCreateVessel(name, vessel),
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
                                        createVNode("div", { class: "md:col-span-3 self-end" }, [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[10px] font-bold text-muted-foreground uppercase mb-1 block",
                                            },
                                            "Voyage Number",
                                          ),
                                          withDirectives(
                                            createVNode(
                                              "input",
                                              {
                                                "onUpdate:modelValue": ($event) =>
                                                  (vessel.voyageNumber = $event),
                                                type: "text",
                                                class: "input-field",
                                                placeholder: "Voyage...",
                                              },
                                              null,
                                              8,
                                              ["onUpdate:modelValue"],
                                            ),
                                            [[vModelText, vessel.voyageNumber]],
                                          ),
                                        ]),
                                        createVNode("div", { class: "md:col-span-4 self-end" }, [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[10px] font-bold text-muted-foreground uppercase mb-1 block",
                                            },
                                            "ETD",
                                          ),
                                          withDirectives(
                                            createVNode(
                                              "input",
                                              {
                                                "onUpdate:modelValue": ($event) =>
                                                  (vessel.etd = $event),
                                                type: "date",
                                                class: "input-field",
                                              },
                                              null,
                                              8,
                                              ["onUpdate:modelValue"],
                                            ),
                                            [[vModelText, vessel.etd]],
                                          ),
                                        ]),
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
                      createVNode("div", { class: "space-y-2 self-end" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "SHIPPING LINE",
                        ),
                        createVNode(
                          Combobox,
                          {
                            modelValue: unref(formData).vendorId,
                            "onUpdate:modelValue": ($event) => (unref(formData).vendorId = $event),
                            options: unref(companies),
                            "label-key": "name",
                            "value-key": "id",
                            placeholder: "Select Shipping Line...",
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
                          "ETD",
                        ),
                        createVNode(
                          DatePicker,
                          {
                            modelValue: unref(formData).etd,
                            "onUpdate:modelValue": ($event) => (unref(formData).etd = $event),
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
                          "ETA",
                        ),
                        createVNode(
                          DatePicker,
                          {
                            modelValue: unref(formData).eta,
                            "onUpdate:modelValue": ($event) => (unref(formData).eta = $event),
                            class: {
                              "[&_button]:border-destructive [&_button]:ring-destructive/20":
                                unref(scheduleErrors).eta,
                            },
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue", "class"],
                        ),
                        unref(scheduleErrors).eta
                          ? (openBlock(),
                            createBlock(
                              "p",
                              {
                                key: 0,
                                class: "text-[10px] text-destructive mt-1 font-medium",
                              },
                              toDisplayString(unref(scheduleErrors).eta),
                              1,
                            ))
                          : createCommentVNode("", true),
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
            _sfc_main$1,
            {
              id: "weight",
              title: "Weight & Measurement",
              icon: unref(Scale),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="relative space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>GROSS WT</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).grossWeight)} type="number" step="0.01" class="${ssrRenderClass(
                      [
                        {
                          "!border-destructive focus:!ring-destructive/20":
                            unref(totalErrorsConfigs).errors.gw,
                          "!border-amber-500 focus:!ring-amber-500/20":
                            !unref(totalErrorsConfigs).errors.gw &&
                            unref(totalErrorsConfigs).warnings.gw,
                        },
                        "input-field pr-12 group-hover:border-primary/50 transition-colors",
                      ],
                    )}" placeholder="0"${_scopeId}><div class="${ssrRenderClass([
                      {
                        "text-destructive": unref(totalErrorsConfigs).errors.gw,
                        "text-amber-600":
                          !unref(totalErrorsConfigs).errors.gw &&
                          unref(totalErrorsConfigs).warnings.gw,
                      },
                      "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                    ])}"${_scopeId}> KG </div></div>`,
                  );
                  if (unref(totalErrorsConfigs).errors.gw) {
                    _push2(
                      `<p class="text-[10px] text-destructive font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).errors.gw)}</p>`,
                    );
                  } else if (unref(totalErrorsConfigs).warnings.gw) {
                    _push2(
                      `<p class="text-[10px] text-amber-600 font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).warnings.gw)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `</div><div class="relative space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>NET WT</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).netWeight)} type="number" step="0.01" class="${ssrRenderClass(
                      [
                        {
                          "!border-destructive focus:!ring-destructive/20":
                            unref(totalErrorsConfigs).errors.nw,
                          "!border-amber-500 focus:!ring-amber-500/20":
                            !unref(totalErrorsConfigs).errors.nw &&
                            unref(totalErrorsConfigs).warnings.nw,
                        },
                        "input-field pr-12 group-hover:border-primary/50 transition-colors",
                      ],
                    )}" placeholder="0"${_scopeId}><div class="${ssrRenderClass([
                      {
                        "text-destructive": unref(totalErrorsConfigs).errors.nw,
                        "text-amber-600":
                          !unref(totalErrorsConfigs).errors.nw &&
                          unref(totalErrorsConfigs).warnings.nw,
                      },
                      "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                    ])}"${_scopeId}> KG </div></div>`,
                  );
                  if (unref(totalErrorsConfigs).errors.nw) {
                    _push2(
                      `<p class="text-[10px] text-destructive font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).errors.nw)}</p>`,
                    );
                  } else if (unref(totalErrorsConfigs).warnings.nw) {
                    _push2(
                      `<p class="text-[10px] text-amber-600 font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).warnings.nw)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `</div><div class="relative space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>MEAS.</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).measurement)} type="number" step="0.01" class="${ssrRenderClass(
                      [
                        {
                          "!border-destructive focus:!ring-destructive/20":
                            unref(totalErrorsConfigs).errors.cbm,
                          "!border-amber-500 focus:!ring-amber-500/20":
                            !unref(totalErrorsConfigs).errors.cbm &&
                            unref(totalErrorsConfigs).warnings.cbm,
                        },
                        "input-field pr-14 group-hover:border-primary/50 transition-colors",
                      ],
                    )}" placeholder="0"${_scopeId}><div class="${ssrRenderClass([
                      {
                        "text-destructive": unref(totalErrorsConfigs).errors.cbm,
                        "text-amber-600":
                          !unref(totalErrorsConfigs).errors.cbm &&
                          unref(totalErrorsConfigs).warnings.cbm,
                      },
                      "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                    ])}"${_scopeId}> CBM </div></div>`,
                  );
                  if (unref(totalErrorsConfigs).errors.cbm) {
                    _push2(
                      `<p class="text-[10px] text-destructive font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).errors.cbm)}</p>`,
                    );
                  } else if (unref(totalErrorsConfigs).warnings.cbm) {
                    _push2(
                      `<p class="text-[10px] text-amber-600 font-medium mt-1"${_scopeId}>${ssrInterpolate(unref(totalErrorsConfigs).warnings.cbm)}</p>`,
                    );
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                      createVNode("div", { class: "relative space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "GROSS WT",
                        ),
                        createVNode("div", { class: "relative group" }, [
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).grossWeight = $event),
                                type: "number",
                                step: "0.01",
                                class: [
                                  "input-field pr-12 group-hover:border-primary/50 transition-colors",
                                  {
                                    "!border-destructive focus:!ring-destructive/20":
                                      unref(totalErrorsConfigs).errors.gw,
                                    "!border-amber-500 focus:!ring-amber-500/20":
                                      !unref(totalErrorsConfigs).errors.gw &&
                                      unref(totalErrorsConfigs).warnings.gw,
                                  },
                                ],
                                placeholder: "0",
                              },
                              null,
                              10,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).grossWeight, void 0, { number: true }]],
                          ),
                          createVNode(
                            "div",
                            {
                              class: [
                                "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                                {
                                  "text-destructive": unref(totalErrorsConfigs).errors.gw,
                                  "text-amber-600":
                                    !unref(totalErrorsConfigs).errors.gw &&
                                    unref(totalErrorsConfigs).warnings.gw,
                                },
                              ],
                            },
                            " KG ",
                            2,
                          ),
                        ]),
                        unref(totalErrorsConfigs).errors.gw
                          ? (openBlock(),
                            createBlock(
                              "p",
                              {
                                key: 0,
                                class: "text-[10px] text-destructive font-medium mt-1",
                              },
                              toDisplayString(unref(totalErrorsConfigs).errors.gw),
                              1,
                            ))
                          : unref(totalErrorsConfigs).warnings.gw
                            ? (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 1,
                                  class: "text-[10px] text-amber-600 font-medium mt-1",
                                },
                                toDisplayString(unref(totalErrorsConfigs).warnings.gw),
                                1,
                              ))
                            : createCommentVNode("", true),
                      ]),
                      createVNode("div", { class: "relative space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "NET WT",
                        ),
                        createVNode("div", { class: "relative group" }, [
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).netWeight = $event),
                                type: "number",
                                step: "0.01",
                                class: [
                                  "input-field pr-12 group-hover:border-primary/50 transition-colors",
                                  {
                                    "!border-destructive focus:!ring-destructive/20":
                                      unref(totalErrorsConfigs).errors.nw,
                                    "!border-amber-500 focus:!ring-amber-500/20":
                                      !unref(totalErrorsConfigs).errors.nw &&
                                      unref(totalErrorsConfigs).warnings.nw,
                                  },
                                ],
                                placeholder: "0",
                              },
                              null,
                              10,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).netWeight, void 0, { number: true }]],
                          ),
                          createVNode(
                            "div",
                            {
                              class: [
                                "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                                {
                                  "text-destructive": unref(totalErrorsConfigs).errors.nw,
                                  "text-amber-600":
                                    !unref(totalErrorsConfigs).errors.nw &&
                                    unref(totalErrorsConfigs).warnings.nw,
                                },
                              ],
                            },
                            " KG ",
                            2,
                          ),
                        ]),
                        unref(totalErrorsConfigs).errors.nw
                          ? (openBlock(),
                            createBlock(
                              "p",
                              {
                                key: 0,
                                class: "text-[10px] text-destructive font-medium mt-1",
                              },
                              toDisplayString(unref(totalErrorsConfigs).errors.nw),
                              1,
                            ))
                          : unref(totalErrorsConfigs).warnings.nw
                            ? (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 1,
                                  class: "text-[10px] text-amber-600 font-medium mt-1",
                                },
                                toDisplayString(unref(totalErrorsConfigs).warnings.nw),
                                1,
                              ))
                            : createCommentVNode("", true),
                      ]),
                      createVNode("div", { class: "relative space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "MEAS.",
                        ),
                        createVNode("div", { class: "relative group" }, [
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).measurement = $event),
                                type: "number",
                                step: "0.01",
                                class: [
                                  "input-field pr-14 group-hover:border-primary/50 transition-colors",
                                  {
                                    "!border-destructive focus:!ring-destructive/20":
                                      unref(totalErrorsConfigs).errors.cbm,
                                    "!border-amber-500 focus:!ring-amber-500/20":
                                      !unref(totalErrorsConfigs).errors.cbm &&
                                      unref(totalErrorsConfigs).warnings.cbm,
                                  },
                                ],
                                placeholder: "0",
                              },
                              null,
                              10,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).measurement, void 0, { number: true }]],
                          ),
                          createVNode(
                            "div",
                            {
                              class: [
                                "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground text-xs font-medium",
                                {
                                  "text-destructive": unref(totalErrorsConfigs).errors.cbm,
                                  "text-amber-600":
                                    !unref(totalErrorsConfigs).errors.cbm &&
                                    unref(totalErrorsConfigs).warnings.cbm,
                                },
                              ],
                            },
                            " CBM ",
                            2,
                          ),
                        ]),
                        unref(totalErrorsConfigs).errors.cbm
                          ? (openBlock(),
                            createBlock(
                              "p",
                              {
                                key: 0,
                                class: "text-[10px] text-destructive font-medium mt-1",
                              },
                              toDisplayString(unref(totalErrorsConfigs).errors.cbm),
                              1,
                            ))
                          : unref(totalErrorsConfigs).warnings.cbm
                            ? (openBlock(),
                              createBlock(
                                "p",
                                {
                                  key: 1,
                                  class: "text-[10px] text-amber-600 font-medium mt-1",
                                },
                                toDisplayString(unref(totalErrorsConfigs).warnings.cbm),
                                1,
                              ))
                            : createCommentVNode("", true),
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
            _sfc_main$1,
            {
              id: "bl",
              title: "BL Setup",
              icon: unref(FileText),
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    `<div class="space-y-8"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>BL TYPE <span class="text-destructive"${_scopeId}>*</span></label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: unref(formData).blType,
                        "onUpdate:modelValue": ($event) => (unref(formData).blType = $event),
                        options: BL_TYPES,
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>FREIGHT TERM <span class="text-destructive"${_scopeId}>*</span></label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: unref(formData).freightTerm,
                        "onUpdate:modelValue": ($event) => (unref(formData).freightTerm = $event),
                        options: FREIGHT_TERMS,
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>TOTAL BL COUNT</label><input${ssrRenderAttr("value", unref(formData).totalBlCount)} type="number" min="1" class="input-field"${_scopeId}></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>PLACE OF ISSUE</label><input${ssrRenderAttr("value", unref(formData).placeOfIssue)} type="text" placeholder="e.g. Jakarta" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>DATE OF ISSUE</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      DatePicker,
                      {
                        modelValue: unref(formData).dateOfIssue,
                        "onUpdate:modelValue": ($event) => (unref(formData).dateOfIssue = $event),
                        placeholder: "Select date...",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="h-11 flex items-center pb-1"${_scopeId}><label class="flex items-center gap-3 cursor-pointer group"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formData).isNegotiable) ? ssrLooseContain(unref(formData).isNegotiable, null) : unref(formData).isNegotiable) ? " checked" : ""} class="w-4 h-4 rounded border-input text-primary focus:ring-primary/20 transition-all"${_scopeId}><div class="flex flex-col"${_scopeId}><span class="text-sm font-medium group-hover:text-primary transition-colors"${_scopeId}>Negotiable BL</span><span class="text-[10px] text-muted-foreground leading-none"${_scopeId}>Requires Original BL</span></div></label></div></div></div>`,
                  );
                } else {
                  return [
                    createVNode("div", { class: "space-y-8" }, [
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            [
                              createTextVNode("BL TYPE "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).blType,
                              "onUpdate:modelValue": ($event) => (unref(formData).blType = $event),
                              options: BL_TYPES,
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
                            [
                              createTextVNode("FREIGHT TERM "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).freightTerm,
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).freightTerm = $event),
                              options: FREIGHT_TERMS,
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
                            "TOTAL BL COUNT",
                          ),
                          withDirectives(
                            createVNode(
                              "input",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).totalBlCount = $event),
                                type: "number",
                                min: "1",
                                class: "input-field",
                              },
                              null,
                              8,
                              ["onUpdate:modelValue"],
                            ),
                            [[vModelText, unref(formData).totalBlCount, void 0, { number: true }]],
                          ),
                        ]),
                      ]),
                      createVNode(
                        "div",
                        { class: "grid grid-cols-1 md:grid-cols-3 gap-6 items-end" },
                        [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(
                              "label",
                              {
                                class:
                                  "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                              },
                              "PLACE OF ISSUE",
                            ),
                            withDirectives(
                              createVNode(
                                "input",
                                {
                                  "onUpdate:modelValue": ($event) =>
                                    (unref(formData).placeOfIssue = $event),
                                  type: "text",
                                  placeholder: "e.g. Jakarta",
                                  class: "input-field",
                                },
                                null,
                                8,
                                ["onUpdate:modelValue"],
                              ),
                              [[vModelText, unref(formData).placeOfIssue]],
                            ),
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(
                              "label",
                              {
                                class:
                                  "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                              },
                              "DATE OF ISSUE",
                            ),
                            createVNode(
                              DatePicker,
                              {
                                modelValue: unref(formData).dateOfIssue,
                                "onUpdate:modelValue": ($event) =>
                                  (unref(formData).dateOfIssue = $event),
                                placeholder: "Select date...",
                              },
                              null,
                              8,
                              ["modelValue", "onUpdate:modelValue"],
                            ),
                          ]),
                          createVNode("div", { class: "h-11 flex items-center pb-1" }, [
                            createVNode(
                              "label",
                              { class: "flex items-center gap-3 cursor-pointer group" },
                              [
                                withDirectives(
                                  createVNode(
                                    "input",
                                    {
                                      type: "checkbox",
                                      "onUpdate:modelValue": ($event) =>
                                        (unref(formData).isNegotiable = $event),
                                      class:
                                        "w-4 h-4 rounded border-input text-primary focus:ring-primary/20 transition-all",
                                    },
                                    null,
                                    8,
                                    ["onUpdate:modelValue"],
                                  ),
                                  [[vModelCheckbox, unref(formData).isNegotiable]],
                                ),
                                createVNode("div", { class: "flex flex-col" }, [
                                  createVNode(
                                    "span",
                                    {
                                      class:
                                        "text-sm font-medium group-hover:text-primary transition-colors",
                                    },
                                    "Negotiable BL",
                                  ),
                                  createVNode(
                                    "span",
                                    { class: "text-[10px] text-muted-foreground leading-none" },
                                    "Requires Original BL",
                                  ),
                                ]),
                              ],
                            ),
                          ]),
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
        _push(`</div></main></div>`);
      }
      _push(
        ssrRenderComponent(
          __nuxt_component_0,
          {
            modelValue: unref(isCompanyModalOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isCompanyModalOpen) ? (isCompanyModalOpen.value = $event) : null,
            title: "Add New Company",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<div class="space-y-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold uppercase tracking-wider"${_scopeId}>Company Name</label><input${ssrRenderAttr("value", unref(companyForm).name)} type="text" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold uppercase tracking-wider"${_scopeId}>Address</label><textarea class="input-field"${_scopeId}>${ssrInterpolate(unref(companyForm).fullAddress)}</textarea></div><button${ssrIncludeBooleanAttr(unref(isSubmittingCompany)) ? " disabled" : ""} class="btn-primary w-full shadow-md"${_scopeId}>${ssrInterpolate(unref(isSubmittingCompany) ? "Creating..." : "Create Company")}</button></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        { class: "text-xs font-semibold uppercase tracking-wider" },
                        "Company Name",
                      ),
                      withDirectives(
                        createVNode(
                          "input",
                          {
                            "onUpdate:modelValue": ($event) => (unref(companyForm).name = $event),
                            type: "text",
                            class: "input-field",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, unref(companyForm).name]],
                      ),
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(
                        "label",
                        { class: "text-xs font-semibold uppercase tracking-wider" },
                        "Address",
                      ),
                      withDirectives(
                        createVNode(
                          "textarea",
                          {
                            "onUpdate:modelValue": ($event) =>
                              (unref(companyForm).fullAddress = $event),
                            class: "input-field",
                          },
                          null,
                          8,
                          ["onUpdate:modelValue"],
                        ),
                        [[vModelText, unref(companyForm).fullAddress]],
                      ),
                    ]),
                    createVNode(
                      "button",
                      {
                        onClick: submitCompanyForm,
                        disabled: unref(isSubmittingCompany),
                        class: "btn-primary w-full shadow-md",
                      },
                      toDisplayString(
                        unref(isSubmittingCompany) ? "Creating..." : "Create Company",
                      ),
                      9,
                      ["disabled"],
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
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/[id]/edit.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-DG-sqHkq.mjs.map
