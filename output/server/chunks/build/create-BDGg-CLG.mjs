import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  mergeProps,
  withCtx,
  unref,
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
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrRenderList,
  ssrRenderClass,
  ssrLooseContain,
  ssrRenderAttr,
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
  Building2,
} from "lucide-vue-next";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import { u as useMasterData, D as DatePicker } from "./DatePicker-I7QCahB1.mjs";
import { _ as __nuxt_component_0$1 } from "./Modal-DzxIm9v2.mjs";
import _sfc_main$1 from "./SectionCard-BNHBHmfw.mjs";
import _sfc_main$2 from "./JobPartyRow-CsBs8qVt.mjs";
import { t as toast } from "./index-DJGQOf1Z.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { a as useRouter, g as useAuth } from "./server.mjs";
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
import "@vueuse/core";
import "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const { isLoading } = useJobs();
    const { confirm } = useConfirm();
    const {
      fetchCompanies,
      fetchContainerTypes,
      fetchPackageTypes,
      fetchVessels,
      fetchPorts,
      createCompany,
      createVessel,
    } = useMasterData();
    useRouter();
    const { user } = useAuth();
    const companies = ref([]);
    const containerTypes = ref([]);
    const vessels = ref([]);
    const portsPol = ref([]);
    const portsPod = ref([]);
    const packageTypes = ref([]);
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
    async function refreshMasterData() {
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
      portsPol.value = initialPorts;
      portsPod.value = initialPorts;
    }
    async function handleSearchPol(query) {
      portsPol.value = await fetchPorts(query);
    }
    async function handleSearchPod(query) {
      portsPod.value = await fetchPorts(query);
    }
    const formData = reactive({
      // Job Info
      tradeTypeId: "EXPORT",
      customerId: "",
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
      // Containers (BL Ready)
      containers: [
        {
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
              description: "",
              hsCode: "",
            },
          ],
        },
      ],
      // Movement & Schedule
      cargoMovementId: "FCL_FCL",
      deliveryMovementId: "CY_DOOR",
      vessels: [
        {
          id: Date.now(),
          vesselId: "",
          vesselName: "",
          voyageNumber: "",
          etd: "",
          sequence: 0,
        },
      ],
      etd: "",
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
    });
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
        const defaultAddr = company.addresses.find((a) => a.isDefault);
        formData[addressKey] = defaultAddr ? defaultAddr.id : company.addresses[0].id;
      } else {
        formData[addressKey] = "";
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
        containers.forEach((container) => {
          if (container.items && Array.isArray(container.items)) {
            container.items.forEach((item) => {
              totalGw += Number(item.grossWeight) || 0;
              totalNw += Number(item.netWeight) || 0;
              totalCbm += Number(item.measurementCbm) || 0;
            });
          }
        });
        const hasItems = containers.some((c) => c.items && c.items.length > 0);
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
    ref(false);
    function handleCreateCompany(name, field) {
      companyForm.name = name;
      companyForm.fullAddress = "";
      companyForm.street = "";
      companyForm.city = "";
      companyForm.state = "";
      companyForm.postalCode = "";
      companyForm.country = "Indonesia";
      companyForm.eori = "";
      companyForm.taxId = "";
      activeCompanyField.value = field;
      isCompanyModalOpen.value = true;
    }
    async function submitCompanyForm() {
      if (!companyForm.name) {
        toast.error("Company Name is required.");
        return;
      }
      try {
        isSubmittingCompany.value = true;
        const addressPayload =
          companyForm.fullAddress || companyForm.city || companyForm.taxId
            ? {
                fullAddress: companyForm.fullAddress || companyForm.city || "-",
                // fallback if only city is provided
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
        if (result.success && result.data && result.data.id) {
          await refreshMasterData();
          if (activeCompanyField.value) {
            formData[activeCompanyField.value] = result.data.id;
          }
          isCompanyModalOpen.value = false;
        } else {
          toast.error("Failed to create company: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        toast.error("Failed to create company: " + error?.message);
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
        } else {
          if (formData.vessels[0]) {
            formData.vessels[0].vesselId = result.data.id;
          }
        }
        toast.success(`Vessel "${name}" created successfully.`);
      } else {
        toast.error("Failed to create vessel: " + (result.error || "Unknown error"));
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="sticky top-16 z-[900] -mx-6 -mt-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-200"><header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-2 sm:gap-4">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/operational/jobs",
            class:
              "p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0",
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
        `<div class="min-w-0"><h1 class="text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground truncate">`,
      );
      _push(
        ssrRenderComponent(
          unref(Briefcase),
          { class: "w-5 h-5 text-[#062c58] shrink-0 hidden sm:block" },
          null,
          _parent,
        ),
      );
      _push(` Create Job </h1>`);
      if (unref(activeSection)) {
        _push(
          `<p class="text-[10px] uppercase tracking-tighter text-blue-600 sm:hidden font-bold"> Step: ${ssrInterpolate(SECTIONS.find((s) => s.id === unref(activeSection))?.label)}</p>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></div><div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide"><button type="button" class="btn-outline flex-1 sm:flex-none justify-center sm:justify-start px-4"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}> Cancel </button><button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm flex-1 sm:flex-none"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}>`,
      );
      _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2 opacity-70" }, null, _parent));
      _push(
        ` Save Draft </button><button type="button" class="btn-primary flex-1 sm:flex-none justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}>`,
      );
      _push(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent));
      _push(
        ` ${ssrInterpolate(unref(isLoading) ? "Creating..." : "Create Job")}</button></div></header></div><div class="flex flex-col lg:flex-row gap-8 relative items-start"><aside class="w-60 shrink-0 hidden lg:block sticky top-[165px] h-fit"><nav class="space-y-2"><!--[-->`,
      );
      ssrRenderList(SECTIONS, (section) => {
        _push(
          `<button class="${ssrRenderClass([
            [
              unref(activeSection) === section.id
                ? "bg-blue-50/60 border-[#062c58]/20 text-[#062c58] shadow-sm"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border-transparent hover:border-border/50",
            ],
            "w-full flex items-center gap-3.5 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all text-left border group",
          ])}"><span class="${ssrRenderClass([
            unref(activeSection) === section.id
              ? "bg-[#062c58] text-white border-[#062c58] scale-110 shadow-md"
              : "border-muted-foreground/30 group-hover:border-foreground/40",
            "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border transition-all duration-300",
          ])}">${ssrInterpolate(section.step)}</span><span class="truncate">${ssrInterpolate(section.label)}</span></button>`,
        );
      });
      _push(
        `<!--]--></nav></aside><main id="main-scroll-container" class="flex-1 w-full min-w-0"><div class="max-w-6xl mx-auto space-y-6 pb-20">`,
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
                  `<div class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6"${_scopeId}><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>JOB NUMBER</label></div><input type="text" placeholder="Auto-generated" class="input-field bg-muted/30 cursor-not-allowed border-dashed" disabled${_scopeId}></div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center justify-between"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}> JOB CUSTOMER <span class="text-destructive"${_scopeId}>*</span></label><div class="flex gap-2"${_scopeId}>`,
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
                      onCreate: (name) => handleCreateCompany(name, "shipperId"),
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
                  `</div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>STATUS</label></div><div class="h-11 flex items-center"${_scopeId}><span class="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold uppercase tracking-wider bg-blue-50/50 text-blue-700 border border-blue-200/50"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"${_scopeId}></span> Draft </span></div></div><div class="space-y-2"${_scopeId}><div class="h-6 flex items-center"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>CREATED BY</label></div><div class="h-11 flex items-center gap-2.5"${_scopeId}><div class="w-8 h-8 rounded-full bg-[#062c58]/10 text-[#062c58] flex items-center justify-center text-[12px] font-black border border-[#062c58]/10 shadow-sm"${_scopeId}>${ssrInterpolate(unref(user)?.name ? unref(user).name.substring(0, 2).toUpperCase() : "AD")}</div><span class="text-sm font-semibold text-foreground/80"${_scopeId}>${ssrInterpolate(unref(user)?.name || "Administrator")}</span></div></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6" }, [
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
                      createVNode("input", {
                        type: "text",
                        placeholder: "Auto-generated",
                        class: "input-field bg-muted/30 cursor-not-allowed border-dashed",
                        disabled: "",
                      }),
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
                          "onUpdate:modelValue": ($event) => (unref(formData).customerId = $event),
                          options: unref(companies),
                          "label-key": "name",
                          "value-key": "id",
                          placeholder: "Select Main Customer...",
                          "allow-create": "",
                          onCreate: (name) => handleCreateCompany(name, "shipperId"),
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
                          "onUpdate:modelValue": ($event) => (unref(formData).tradeTypeId = $event),
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
                            createTextVNode(" Draft "),
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
                            unref(user)?.name
                              ? unref(user).name.substring(0, 2).toUpperCase()
                              : "AD",
                          ),
                          1,
                        ),
                        createVNode(
                          "span",
                          { class: "text-sm font-semibold text-foreground/80" },
                          toDisplayString(unref(user)?.name || "Administrator"),
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
                  `<div class="w-full"${_scopeId}><div class="hidden md:grid grid-cols-12 gap-6 px-6 py-4 border-b border-border/40 bg-muted/5 text-[11px] font-bold text-muted-foreground/70 tracking-widest uppercase"${_scopeId}><div class="col-span-2"${_scopeId}>ROLE</div><div class="col-span-4 pl-1"${_scopeId}>COMPANY</div><div class="col-span-4 pl-1"${_scopeId}>ADDRESS</div><div class="col-span-2"${_scopeId}>DETAILS</div></div><div class="divide-y divide-border/50"${_scopeId}>`,
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
                      "onUpdate:addressId": ($event) => (unref(formData).shipperAddressId = $event),
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
                            `<label class="flex items-center gap-2 text-[14px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5"${_scopeId2}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formData).isNotifySameAsConsignee) ? ssrLooseContain(unref(formData).isNotifySameAsConsignee, null) : unref(formData).isNotifySameAsConsignee) ? " checked" : ""} class="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background transition-all"${_scopeId2}><span class="group-hover:underline"${_scopeId2}>Same as Consignee</span></label>`,
                          );
                        } else {
                          return [
                            createVNode(
                              "label",
                              {
                                class:
                                  "flex items-center gap-2 text-[14px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5",
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
                          "hidden md:grid grid-cols-12 gap-6 px-6 py-4 border-b border-border/40 bg-muted/5 text-[11px] font-bold text-muted-foreground/70 tracking-widest uppercase",
                      },
                      [
                        createVNode("div", { class: "col-span-2" }, "ROLE"),
                        createVNode("div", { class: "col-span-4 pl-1" }, "COMPANY"),
                        createVNode("div", { class: "col-span-4 pl-1" }, "ADDRESS"),
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
                          "onUpdate:companyId": ($event) => (unref(formData).consigneeId = $event),
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
                                  "flex items-center gap-2 text-[14px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors group w-fit mb-1.5",
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
                          "onUpdate:companyId": ($event) => (unref(formData).forwarderId = $event),
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
                  `<div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative items-end pb-4"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PRE-CARRIAGE BY</label><input${ssrRenderAttr("value", unref(formData).preCarriageBy)} type="text" placeholder="e.g. TRUCK" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PLACE OF RECEIPT</label><input${ssrRenderAttr("value", unref(formData).placeOfReceipt)} type="text" placeholder="Defaults to POL if empty" class="input-field"${_scopeId}></div><div class="space-y-2 relative"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PORT OF LOADING (POL)</label><div class="relative group"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(MapPin),
                    {
                      class:
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none",
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
                        "[&_button]:pl-10",
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
                  `</div><div class="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20"${_scopeId}><div class="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground/40"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(ArrowLeft),
                    { class: "w-3.5 h-3.5 rotate-180" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="space-y-2 relative"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PORT OF DISCHARGE (POD)</label><div class="relative group"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(MapPin),
                    {
                      class:
                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none",
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
                        "[&_button]:pl-10",
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
                  `</div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PLACE OF DELIVERY</label><input${ssrRenderAttr("value", unref(formData).placeOfDelivery)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>FINAL DESTINATION</label><input${ssrRenderAttr("value", unref(formData).finalDestination)} type="text" placeholder="Defaults to POD if empty" class="input-field"${_scopeId}></div></div>`,
                );
              } else {
                return [
                  createVNode(
                    "div",
                    {
                      class:
                        "grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative items-end pb-4",
                    },
                    [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                      createVNode("div", { class: "space-y-2 relative" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                          },
                          "PORT OF LOADING (POL)",
                        ),
                        createVNode("div", { class: "relative group" }, [
                          createVNode(unref(MapPin), {
                            class:
                              "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none",
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
                                "[&_button]:pl-10",
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
                            "hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20",
                        },
                        [
                          createVNode(
                            "div",
                            {
                              class:
                                "w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground/40",
                            },
                            [createVNode(unref(ArrowLeft), { class: "w-3.5 h-3.5 rotate-180" })],
                          ),
                        ],
                      ),
                      createVNode("div", { class: "space-y-2 relative" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
                          },
                          "PORT OF DISCHARGE (POD)",
                        ),
                        createVNode("div", { class: "relative group" }, [
                          createVNode(unref(MapPin), {
                            class:
                              "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10 pointer-events-none",
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
                                "[&_button]:pl-10",
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
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                  `</div><div class="md:col-span-3"${_scopeId}><textarea rows="6" placeholder="e.g. 3317 CARTONS OF INSTANT NOODLES" class="input-field min-h-[120px] py-3 resize-y transition-all duration-200" required${_scopeId}>${ssrInterpolate(unref(formData).commodity)}</textarea></div></div></div><div class="space-y-2 md:col-span-4"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>MAIN DESCRIPTION (OVERALL COMMODITY)</label><textarea rows="8" placeholder="Description of goods to appear on BL..." class="input-field min-h-[150px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(unref(formData).mainDescription)}</textarea></div><div class="border border-border/60 rounded-xl mt-8 overflow-hidden bg-muted/5"${_scopeId}><div class="bg-muted/10 px-5 py-3.5 border-b border-border/50 flex justify-between items-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Box),
                    { class: "w-4 h-4 text-primary/70" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `<h3 class="font-semibold text-[14px] uppercase tracking-wider text-foreground/80"${_scopeId}> Containers &amp; Seals </h3></div><button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"${_scopeId}>`,
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
                  ` Add Container </button></div><div class="p-5 space-y-8"${_scopeId}><!--[-->`,
                );
                ssrRenderList(unref(formData).containers, (container, index) => {
                  _push2(
                    `<div class="space-y-5 pb-8 border-b border-border/40 last:border-0 last:pb-0 relative group"${_scopeId}><div class="absolute -left-2 top-0 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-[11px] font-bold text-muted-foreground z-10 group-hover:border-primary/30 group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(index + 1)}</div><div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end pl-6"${_scopeId}><div class="col-span-3 space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"${_scopeId}>Type</label>`,
                  );
                  _push2(
                    ssrRenderComponent(
                      Combobox,
                      {
                        modelValue: container.containerTypeId,
                        "onUpdate:modelValue": ($event) => (container.containerTypeId = $event),
                        options: unref(containerTypes),
                        placeholder: "Select...",
                      },
                      null,
                      _parent2,
                      _scopeId,
                    ),
                  );
                  _push2(
                    `</div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"${_scopeId}>Container No.</label><input${ssrRenderAttr("value", container.containerNumber)} type="text" placeholder="TEMU1234567" class="${ssrRenderClass(
                      [
                        {
                          "!border-destructive focus:!ring-destructive/20":
                            unref(containerErrors)[container.id],
                        },
                        "input-field uppercase tracking-wider font-mono text-xs",
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
                    `</div><div class="md:col-span-4 space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1"${_scopeId}>Seal No.</label><input${ssrRenderAttr("value", container.sealNumber)} type="text" placeholder="SN123456" class="input-field uppercase tracking-wider font-mono text-xs"${_scopeId}></div><div class="md:col-span-1 flex flex-col items-center justify-center pb-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground/70 uppercase mb-2 tracking-widest"${_scopeId}>HM</label><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(container.isHazardous) ? ssrLooseContain(container.isHazardous, null) : container.isHazardous) ? " checked" : ""} class="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer transition-all"${_scopeId}></div></div>`,
                  );
                  if (unref(formData).containers.length > 1) {
                    _push2(
                      `<div class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}><button type="button" class="w-8 h-8 rounded-full bg-white border border-destructive/20 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center shadow-sm transition-all"${_scopeId}>`,
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
                    _push2(`</button></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(
                    `<div class="ml-6 pl-6 border-l-2 border-primary/10 space-y-4"${_scopeId}><div class="flex items-center justify-between pt-1"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="w-1.5 h-1.5 rounded-full bg-primary/40"${_scopeId}></span><h4 class="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest"${_scopeId}> Breakdown Items </h4></div><button type="button" class="text-[11px] text-primary hover:text-primary/80 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"${_scopeId}>`,
                  );
                  _push2(
                    ssrRenderComponent(unref(Plus), { class: "w-3 h-3" }, null, _parent2, _scopeId),
                  );
                  _push2(
                    ` Add Item </button></div><div class="grid grid-cols-1 gap-4"${_scopeId}><!--[-->`,
                  );
                  ssrRenderList(container.items, (item, itemIndex) => {
                    _push2(
                      `<div class="p-4 bg-white/60 border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative group/item"${_scopeId}><div class="grid grid-cols-12 gap-x-4 gap-y-3"${_scopeId}><div class="col-span-2 space-y-1.5 relative"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>Qty</label><div${_scopeId}><input type="number"${ssrRenderAttr("value", item.qty)} class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[`${container.id}-${item.id}-qty`],
                          },
                          "input-field h-9 text-xs",
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
                      `</div></div><div class="col-span-3 space-y-1.5"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>Unit</label>`,
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
                          class: "h-9",
                        },
                        null,
                        _parent2,
                        _scopeId,
                      ),
                    );
                    _push2(
                      `</div><div class="col-span-2 space-y-1.5 relative"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>GW (KG)</label><div${_scopeId}><input type="number"${ssrRenderAttr("value", item.grossWeight)} step="0.01" class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[`${container.id}-${item.id}-gw`],
                          },
                          "input-field h-9 text-xs",
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
                      `</div></div><div class="col-span-2 space-y-1.5 relative"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>NW (KG)</label><div${_scopeId}><input type="number"${ssrRenderAttr("value", item.netWeight)} step="0.01" class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[`${container.id}-${item.id}-nw`],
                          },
                          "input-field h-9 text-xs",
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
                      `</div></div><div class="col-span-3 space-y-1.5 relative"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>CBM</label><div${_scopeId}><input type="number"${ssrRenderAttr("value", item.measurementCbm)} step="0.01" class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[`${container.id}-${item.id}-cbm`],
                          },
                          "input-field h-9 text-xs",
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
                      `</div></div><div class="col-span-4 space-y-1.5 relative"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>HS Code</label><div${_scopeId}><input type="text"${ssrRenderAttr("value", item.hsCode)} class="${ssrRenderClass(
                        [
                          {
                            "!border-destructive focus:!ring-destructive/20":
                              unref(containerErrors)[`${container.id}-${item.id}-hscode`],
                          },
                          "input-field h-9 text-xs placeholder:opacity-40",
                        ],
                      )}" placeholder="1902..."${_scopeId}>`,
                    );
                    if (unref(containerErrors)[`${container.id}-${item.id}-hscode`]) {
                      _push2(
                        `<p class="text-[8.5px] leading-tight text-destructive mt-0.5 font-medium absolute"${_scopeId}>${ssrInterpolate(unref(containerErrors)[`${container.id}-${item.id}-hscode`])}</p>`,
                      );
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(
                      `</div></div><div class="col-span-8 space-y-1.5"${_scopeId}><label class="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5"${_scopeId}>Description Breakdown</label><textarea rows="2" class="input-field min-h-[44px] h-11 py-2 text-xs placeholder:opacity-40 resize-none" placeholder="Breakdown description..."${_scopeId}>${ssrInterpolate(item.description)}</textarea></div></div>`,
                    );
                    if (container.items.length > 1) {
                      _push2(
                        `<button type="button" class="absolute -right-1.5 -top-1.5 w-6 h-6 rounded-full bg-white border border-destructive/10 text-destructive opacity-0 group-item/hover:opacity-100 transition-all flex items-center justify-center hover:bg-destructive hover:text-white"${_scopeId}>`,
                      );
                      _push2(
                        ssrRenderComponent(
                          unref(Trash2),
                          { class: "w-3 h-3" },
                          null,
                          _parent2,
                          _scopeId,
                        ),
                      );
                      _push2(`</button>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div>`);
                  });
                  _push2(`<!--]--></div></div></div>`);
                });
                _push2(
                  `<!--]--></div></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>SHIPPING MARKS</label><textarea rows="6" placeholder="Enter marks and numbers..." class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"${_scopeId}>${ssrInterpolate(unref(formData).shippingMark)}</textarea></div></div>`,
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
                              (unref(formData).mainDescription = $event),
                            rows: "8",
                            placeholder: "Description of goods to appear on BL...",
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
                    createVNode(
                      "div",
                      {
                        class: "border border-border/60 rounded-xl mt-8 overflow-hidden bg-muted/5",
                      },
                      [
                        createVNode(
                          "div",
                          {
                            class:
                              "bg-muted/10 px-5 py-3.5 border-b border-border/50 flex justify-between items-center",
                          },
                          [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode(unref(Box), { class: "w-4 h-4 text-primary/70" }),
                              createVNode(
                                "h3",
                                {
                                  class:
                                    "font-semibold text-[14px] uppercase tracking-wider text-foreground/80",
                                },
                                " Containers & Seals ",
                              ),
                            ]),
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
                                class:
                                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors",
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
                        createVNode("div", { class: "p-5 space-y-8" }, [
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
                                      "space-y-5 pb-8 border-b border-border/40 last:border-0 last:pb-0 relative group",
                                  },
                                  [
                                    createVNode(
                                      "div",
                                      {
                                        class:
                                          "absolute -left-2 top-0 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-[11px] font-bold text-muted-foreground z-10 group-hover:border-primary/30 group-hover:text-primary transition-colors",
                                      },
                                      toDisplayString(index + 1),
                                      1,
                                    ),
                                    createVNode(
                                      "div",
                                      {
                                        class:
                                          "grid grid-cols-1 md:grid-cols-12 gap-5 items-end pl-6",
                                      },
                                      [
                                        createVNode("div", { class: "col-span-3 space-y-2" }, [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1",
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
                                              placeholder: "Select...",
                                            },
                                            null,
                                            8,
                                            ["modelValue", "onUpdate:modelValue", "options"],
                                          ),
                                        ]),
                                        createVNode("div", { class: "md:col-span-4 space-y-2" }, [
                                          createVNode(
                                            "label",
                                            {
                                              class:
                                                "text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1",
                                            },
                                            "Container No.",
                                          ),
                                          withDirectives(
                                            createVNode(
                                              "input",
                                              {
                                                "onUpdate:modelValue": ($event) =>
                                                  (container.containerNumber = $event),
                                                type: "text",
                                                placeholder: "TEMU1234567",
                                                class: [
                                                  "input-field uppercase tracking-wider font-mono text-xs",
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
                                                "text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest pl-1",
                                            },
                                            "Seal No.",
                                          ),
                                          withDirectives(
                                            createVNode(
                                              "input",
                                              {
                                                "onUpdate:modelValue": ($event) =>
                                                  (container.sealNumber = $event),
                                                type: "text",
                                                placeholder: "SN123456",
                                                class:
                                                  "input-field uppercase tracking-wider font-mono text-xs",
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
                                                  "text-[11px] font-bold text-muted-foreground/70 uppercase mb-2 tracking-widest",
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
                                                    "w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer transition-all",
                                                },
                                                null,
                                                8,
                                                ["onUpdate:modelValue"],
                                              ),
                                              [[vModelCheckbox, container.isHazardous]],
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    unref(formData).containers.length > 1
                                      ? (openBlock(),
                                        createBlock(
                                          "div",
                                          {
                                            key: 0,
                                            class:
                                              "absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                          },
                                          [
                                            createVNode(
                                              "button",
                                              {
                                                type: "button",
                                                onClick: ($event) =>
                                                  unref(formData).containers.splice(index, 1),
                                                class:
                                                  "w-8 h-8 rounded-full bg-white border border-destructive/20 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center shadow-sm transition-all",
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
                                        ))
                                      : createCommentVNode("", true),
                                    createVNode(
                                      "div",
                                      { class: "ml-6 pl-6 border-l-2 border-primary/10 space-y-4" },
                                      [
                                        createVNode(
                                          "div",
                                          { class: "flex items-center justify-between pt-1" },
                                          [
                                            createVNode(
                                              "div",
                                              { class: "flex items-center gap-2" },
                                              [
                                                createVNode("span", {
                                                  class: "w-1.5 h-1.5 rounded-full bg-primary/40",
                                                }),
                                                createVNode(
                                                  "h4",
                                                  {
                                                    class:
                                                      "text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest",
                                                  },
                                                  " Breakdown Items ",
                                                ),
                                              ],
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
                                                  "text-[11px] text-primary hover:text-primary/80 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors",
                                              },
                                              [
                                                createVNode(unref(Plus), { class: "w-3 h-3" }),
                                                createTextVNode(" Add Item "),
                                              ],
                                              8,
                                              ["onClick"],
                                            ),
                                          ],
                                        ),
                                        createVNode("div", { class: "grid grid-cols-1 gap-4" }, [
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
                                                      "p-4 bg-white/60 border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 relative group/item",
                                                  },
                                                  [
                                                    createVNode(
                                                      "div",
                                                      {
                                                        class: "grid grid-cols-12 gap-x-4 gap-y-3",
                                                      },
                                                      [
                                                        createVNode(
                                                          "div",
                                                          {
                                                            class:
                                                              "col-span-2 space-y-1.5 relative",
                                                          },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "Qty",
                                                            ),
                                                            createVNode("div", null, [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "number",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) => (item.qty = $event),
                                                                    class: [
                                                                      "input-field h-9 text-xs",
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
                                                            ]),
                                                          ],
                                                        ),
                                                        createVNode(
                                                          "div",
                                                          { class: "col-span-3 space-y-1.5" },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
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
                                                                class: "h-9",
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
                                                          {
                                                            class:
                                                              "col-span-2 space-y-1.5 relative",
                                                          },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "GW (KG)",
                                                            ),
                                                            createVNode("div", null, [
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
                                                                      "input-field h-9 text-xs",
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
                                                            ]),
                                                          ],
                                                        ),
                                                        createVNode(
                                                          "div",
                                                          {
                                                            class:
                                                              "col-span-2 space-y-1.5 relative",
                                                          },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "NW (KG)",
                                                            ),
                                                            createVNode("div", null, [
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
                                                                      "input-field h-9 text-xs",
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
                                                            ]),
                                                          ],
                                                        ),
                                                        createVNode(
                                                          "div",
                                                          {
                                                            class:
                                                              "col-span-3 space-y-1.5 relative",
                                                          },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "CBM",
                                                            ),
                                                            createVNode("div", null, [
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
                                                                      "input-field h-9 text-xs",
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
                                                            ]),
                                                          ],
                                                        ),
                                                        createVNode(
                                                          "div",
                                                          {
                                                            class:
                                                              "col-span-4 space-y-1.5 relative",
                                                          },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "HS Code",
                                                            ),
                                                            createVNode("div", null, [
                                                              withDirectives(
                                                                createVNode(
                                                                  "input",
                                                                  {
                                                                    type: "text",
                                                                    "onUpdate:modelValue": (
                                                                      $event,
                                                                    ) => (item.hsCode = $event),
                                                                    class: [
                                                                      "input-field h-9 text-xs placeholder:opacity-40",
                                                                      {
                                                                        "!border-destructive focus:!ring-destructive/20":
                                                                          unref(containerErrors)[
                                                                            `${container.id}-${item.id}-hscode`
                                                                          ],
                                                                      },
                                                                    ],
                                                                    placeholder: "1902...",
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
                                                            ]),
                                                          ],
                                                        ),
                                                        createVNode(
                                                          "div",
                                                          { class: "col-span-8 space-y-1.5" },
                                                          [
                                                            createVNode(
                                                              "label",
                                                              {
                                                                class:
                                                                  "text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest pl-0.5",
                                                              },
                                                              "Description Breakdown",
                                                            ),
                                                            withDirectives(
                                                              createVNode(
                                                                "textarea",
                                                                {
                                                                  "onUpdate:modelValue": ($event) =>
                                                                    (item.description = $event),
                                                                  rows: "2",
                                                                  class:
                                                                    "input-field min-h-[44px] h-11 py-2 text-xs placeholder:opacity-40 resize-none",
                                                                  placeholder:
                                                                    "Breakdown description...",
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
                                                    container.items.length > 1
                                                      ? (openBlock(),
                                                        createBlock(
                                                          "button",
                                                          {
                                                            key: 0,
                                                            type: "button",
                                                            onClick: ($event) =>
                                                              container.items.splice(itemIndex, 1),
                                                            class:
                                                              "absolute -right-1.5 -top-1.5 w-6 h-6 rounded-full bg-white border border-destructive/10 text-destructive opacity-0 group-item/hover:opacity-100 transition-all flex items-center justify-center hover:bg-destructive hover:text-white",
                                                          },
                                                          [
                                                            createVNode(unref(Trash2), {
                                                              class: "w-3 h-3",
                                                            }),
                                                          ],
                                                          8,
                                                          ["onClick"],
                                                        ))
                                                      : createCommentVNode("", true),
                                                  ],
                                                )
                                              );
                                            }),
                                            128,
                                          )),
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
                      ],
                    ),
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
                  `<div class="space-y-8"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>CARGO MOVEMENT <span class="text-destructive"${_scopeId}>*</span></label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).cargoMovementId,
                      "onUpdate:modelValue": ($event) => (unref(formData).cargoMovementId = $event),
                      options: CARGO_MOVEMENTS,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>DELIVERY MOVEMENT <span class="text-destructive"${_scopeId}>*</span></label>`,
                );
                _push2(
                  ssrRenderComponent(
                    Combobox,
                    {
                      modelValue: unref(formData).deliveryMovementId,
                      "onUpdate:modelValue": ($event) =>
                        (unref(formData).deliveryMovementId = $event),
                      options: DELIVERY_MOVEMENTS,
                    },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  `</div></div><div class="space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h4 class="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2"${_scopeId}><div class="w-1.5 h-4 bg-primary rounded-full"${_scopeId}></div> Vessel Schedule </h4><button type="button" class="btn-secondary py-1.5 px-3 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:ring-2 hover:ring-primary/20"${_scopeId}>`,
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
                ssrRenderList(unref(formData).vessels, (vessel, vIndex) => {
                  _push2(
                    `<div class="p-5 bg-muted/30 border border-border/40 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-md hover:border-primary/20"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end"${_scopeId}><div class="md:col-span-5 space-y-2"${_scopeId}><label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1"${_scopeId}>${ssrInterpolate(vIndex === 0 ? "Feeder / First Vessel" : "Vessel " + (vIndex + 1))}</label>`,
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
                  if (unref(formData).vessels.length > 1) {
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
                      modelValue: unref(formData).eta,
                      "onUpdate:modelValue": ($event) => (unref(formData).eta = $event),
                      placeholder: "Select Final ETA...",
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
                _push2(`</div></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "space-y-8" }, [
                    createVNode(
                      "div",
                      {
                        class:
                          "grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/40",
                      },
                      [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                            },
                            [
                              createTextVNode("CARGO MOVEMENT "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).cargoMovementId,
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).cargoMovementId = $event),
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
                            [
                              createTextVNode("DELIVERY MOVEMENT "),
                              createVNode("span", { class: "text-destructive" }, "*"),
                            ],
                          ),
                          createVNode(
                            Combobox,
                            {
                              modelValue: unref(formData).deliveryMovementId,
                              "onUpdate:modelValue": ($event) =>
                                (unref(formData).deliveryMovementId = $event),
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
                            onClick: ($event) =>
                              unref(formData).vessels.push({
                                id: Date.now(),
                                vesselId: "",
                                vesselName: "",
                                voyageNumber: "",
                                etd: "",
                                sequence: unref(formData).vessels.length,
                              }),
                            class:
                              "btn-secondary py-1.5 px-3 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:ring-2 hover:ring-primary/20",
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
                          renderList(unref(formData).vessels, (vessel, vIndex) => {
                            return (
                              openBlock(),
                              createBlock(
                                "div",
                                {
                                  key: vessel.id,
                                  class:
                                    "p-5 bg-muted/30 border border-border/40 rounded-2xl relative group/vessel transition-all hover:bg-white hover:shadow-md hover:border-primary/20",
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
                                            options: unref(vessels),
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
                                      unref(formData).vessels.length > 1
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
                                                    unref(formData).vessels.splice(vIndex, 1),
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
                              modelValue: unref(formData).eta,
                              "onUpdate:modelValue": ($event) => (unref(formData).eta = $event),
                              placeholder: "Select Final ETA...",
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
                  `<div class="grid grid-cols-1 md:grid-cols-3 gap-8"${_scopeId}><div class="relative space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>GROSS WT</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).grossWeight)} type="number" step="0.01" class="${ssrRenderClass(
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
                    "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                  `</div><div class="relative space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>NET WT</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).netWeight)} type="number" step="0.01" class="${ssrRenderClass(
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
                    "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                  `</div><div class="relative space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>MEAS.</label><div class="relative group"${_scopeId}><input${ssrRenderAttr("value", unref(formData).measurement)} type="number" step="0.01" class="${ssrRenderClass(
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
                    "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-8" }, [
                    createVNode("div", { class: "relative space-y-2" }, [
                      createVNode(
                        "label",
                        {
                          class:
                            "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                            "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                            "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[11px] font-bold text-muted-foreground",
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
                  `<div class="space-y-10"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-3 gap-8"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>BL TYPE <span class="text-destructive"${_scopeId}>*</span></label>`,
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
                  `</div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>FREIGHT TERM <span class="text-destructive"${_scopeId}>*</span></label>`,
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
                  `</div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>TOTAL BL COUNT</label><input${ssrRenderAttr("value", unref(formData).totalBlCount)} type="number" min="1" class="input-field h-11"${_scopeId}></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end"${_scopeId}><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>PLACE OF ISSUE</label><input${ssrRenderAttr("value", unref(formData).placeOfIssue)} type="text" placeholder="e.g. Jakarta" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-[11px] font-bold text-muted-foreground uppercase tracking-widest"${_scopeId}>DATE OF ISSUE</label>`,
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
                  `</div><div class="h-11 flex items-center"${_scopeId}><label class="flex items-center gap-3.5 cursor-pointer group select-none"${_scopeId}><div class="relative flex items-center"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(formData).isNegotiable) ? ssrLooseContain(unref(formData).isNegotiable, null) : unref(formData).isNegotiable) ? " checked" : ""} class="w-5 h-5 rounded-md border-border/60 text-primary focus:ring-primary/20 transition-all cursor-pointer shadow-sm"${_scopeId}></div><div class="flex flex-col"${_scopeId}><span class="text-[14px] font-bold text-foreground/80 group-hover:text-primary transition-colors leading-none"${_scopeId}>Negotiable BL</span><span class="text-[11px] font-medium text-muted-foreground/70 mt-1 leading-none tracking-tight"${_scopeId}>Requires Original BL</span></div></label></div></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-10" }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-8" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                              class: "input-field h-11",
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
                      { class: "grid grid-cols-1 md:grid-cols-3 gap-8 items-end" },
                      [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(
                            "label",
                            {
                              class:
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                                "text-[11px] font-bold text-muted-foreground uppercase tracking-widest",
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
                        createVNode("div", { class: "h-11 flex items-center" }, [
                          createVNode(
                            "label",
                            { class: "flex items-center gap-3.5 cursor-pointer group select-none" },
                            [
                              createVNode("div", { class: "relative flex items-center" }, [
                                withDirectives(
                                  createVNode(
                                    "input",
                                    {
                                      type: "checkbox",
                                      "onUpdate:modelValue": ($event) =>
                                        (unref(formData).isNegotiable = $event),
                                      class:
                                        "w-5 h-5 rounded-md border-border/60 text-primary focus:ring-primary/20 transition-all cursor-pointer shadow-sm",
                                    },
                                    null,
                                    8,
                                    ["onUpdate:modelValue"],
                                  ),
                                  [[vModelCheckbox, unref(formData).isNegotiable]],
                                ),
                              ]),
                              createVNode("div", { class: "flex flex-col" }, [
                                createVNode(
                                  "span",
                                  {
                                    class:
                                      "text-[14px] font-bold text-foreground/80 group-hover:text-primary transition-colors leading-none",
                                  },
                                  "Negotiable BL",
                                ),
                                createVNode(
                                  "span",
                                  {
                                    class:
                                      "text-[11px] font-medium text-muted-foreground/70 mt-1 leading-none tracking-tight",
                                  },
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
      _push(
        ssrRenderComponent(
          __nuxt_component_0$1,
          {
            modelValue: unref(isCompanyModalOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isCompanyModalOpen) ? (isCompanyModalOpen.value = $event) : null,
            title: "Add New Company",
            description: "Create a new company to use in this job.",
            width: "max-w-2xl",
          },
          {
            footer: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<button type="button" class="btn-outline justify-center px-4"${ssrIncludeBooleanAttr(unref(isSubmittingCompany)) ? " disabled" : ""}${_scopeId}> Cancel </button><button type="button" class="btn-primary justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm"${ssrIncludeBooleanAttr(unref(isSubmittingCompany) || !unref(companyForm).name) ? " disabled" : ""}${_scopeId}>`,
                );
                _push2(
                  ssrRenderComponent(
                    unref(Building2),
                    { class: "w-4 h-4 mr-2" },
                    null,
                    _parent2,
                    _scopeId,
                  ),
                );
                _push2(
                  ` ${ssrInterpolate(unref(isSubmittingCompany) ? "Saving..." : "Save Company")}</button>`,
                );
              } else {
                return [
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: ($event) => (isCompanyModalOpen.value = false),
                      class: "btn-outline justify-center px-4",
                      disabled: unref(isSubmittingCompany),
                    },
                    " Cancel ",
                    8,
                    ["onClick", "disabled"],
                  ),
                  createVNode(
                    "button",
                    {
                      type: "button",
                      onClick: submitCompanyForm,
                      class:
                        "btn-primary justify-center bg-[#062c58] hover:bg-[#062c58]/90 text-white shadow-sm",
                      disabled: unref(isSubmittingCompany) || !unref(companyForm).name,
                    },
                    [
                      createVNode(unref(Building2), { class: "w-4 h-4 mr-2" }),
                      createTextVNode(
                        " " +
                          toDisplayString(
                            unref(isSubmittingCompany) ? "Saving..." : "Save Company",
                          ),
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
                _push2(
                  `<div class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Company Name <span class="text-destructive"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(companyForm).name)} type="text" placeholder="e.g. PT Maju Bersama" class="input-field" required${_scopeId}></div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Full Address</label><textarea rows="2" placeholder="e.g. Jl. Raya Perjuangan No.1" class="input-field resize-none"${_scopeId}>${ssrInterpolate(unref(companyForm).fullAddress)}</textarea></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>City</label><input${ssrRenderAttr("value", unref(companyForm).city)} type="text" placeholder="e.g. Jakarta" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>State / Province</label><input${ssrRenderAttr("value", unref(companyForm).state)} type="text" placeholder="e.g. DKI Jakarta" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Postal Code</label><input${ssrRenderAttr("value", unref(companyForm).postalCode)} type="text" placeholder="e.g. 12345" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Country</label><input${ssrRenderAttr("value", unref(companyForm).country)} type="text" placeholder="e.g. Indonesia" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>Tax ID / NPWP</label><input${ssrRenderAttr("value", unref(companyForm).taxId)} type="text" placeholder="e.g. 01.234.567.8-901.000" class="input-field"${_scopeId}></div><div class="space-y-2"${_scopeId}><label class="text-xs font-semibold text-muted-foreground tracking-wider uppercase"${_scopeId}>EORI (Optional)</label><input${ssrRenderAttr("value", unref(companyForm).eori)} type="text" placeholder="" class="input-field"${_scopeId}></div></div></div>`,
                );
              } else {
                return [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          [
                            createTextVNode("Company Name "),
                            createVNode("span", { class: "text-destructive" }, "*"),
                          ],
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) => (unref(companyForm).name = $event),
                              type: "text",
                              placeholder: "e.g. PT Maju Bersama",
                              class: "input-field",
                              required: "",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).name]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "Full Address",
                        ),
                        withDirectives(
                          createVNode(
                            "textarea",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(companyForm).fullAddress = $event),
                              rows: "2",
                              placeholder: "e.g. Jl. Raya Perjuangan No.1",
                              class: "input-field resize-none",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).fullAddress]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "City",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) => (unref(companyForm).city = $event),
                              type: "text",
                              placeholder: "e.g. Jakarta",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).city]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "State / Province",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(companyForm).state = $event),
                              type: "text",
                              placeholder: "e.g. DKI Jakarta",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).state]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "Postal Code",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(companyForm).postalCode = $event),
                              type: "text",
                              placeholder: "e.g. 12345",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).postalCode]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "Country",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(companyForm).country = $event),
                              type: "text",
                              placeholder: "e.g. Indonesia",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).country]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "Tax ID / NPWP",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) =>
                                (unref(companyForm).taxId = $event),
                              type: "text",
                              placeholder: "e.g. 01.234.567.8-901.000",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).taxId]],
                        ),
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(
                          "label",
                          {
                            class:
                              "text-xs font-semibold text-muted-foreground tracking-wider uppercase",
                          },
                          "EORI (Optional)",
                        ),
                        withDirectives(
                          createVNode(
                            "input",
                            {
                              "onUpdate:modelValue": ($event) => (unref(companyForm).eori = $event),
                              type: "text",
                              placeholder: "",
                              class: "input-field",
                            },
                            null,
                            8,
                            ["onUpdate:modelValue"],
                          ),
                          [[vModelText, unref(companyForm).eori]],
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
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/create.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-BDGg-CLG.mjs.map
