// @ts-ignore
import { describe, expect, it } from "bun:test";
import { buildBcDocumentEditForm } from "./bcDocumentForm";

describe("buildBcDocumentEditForm", () => {
  it("hydrates blank BC/FCR edit fields from the same Job and BL fallbacks used by preview", () => {
    const form = buildBcDocumentEditForm({
      document: {
        id: "bc1",
        bookingNumber: "BC-001",
        bookingDate: null,
        serviceContractNo: null,
        warehouseDepotName: "",
        warehouseDepotAddress: "",
        pickupLocation: "",
        cutoffDate: null,
        cutoffTime: "",
        remarks: "",
        parties: [],
        containers: [],
        vessels: [],
        status: "draft",
        createdAt: "2026-07-26T00:00:00.000Z",
        updatedAt: "2026-07-26T00:00:00.000Z",
      },
      job: {
        pol: "IDBLW",
        pod: "TWTXG",
        polName: "BELAWAN, SUMATRA, INDONESIA",
        podName: "TAICHUNG, TAIWAN",
        placeOfReceipt: "BELAWAN DEPOT",
        placeOfDelivery: "TAICHUNG CY",
        finalDestination: "TAICHUNG, TAIWAN",
        cargoMovement: { code: "FCL_FCL" },
        deliveryMovement: { code: "CY_CY" },
        mainDescription: "FABRIC ROLLS",
        shippingMark: "N/M",
        eta: "2026-08-10",
        jobParties: [
          {
            partyRole: { code: "SHIPPER" },
            companyId: "shipper-company",
            addressBookId: "shipper-address",
            company: { name: "SHIPPER LTD" },
            addressBook: { fullAddress: "SHIPPER ADDRESS" },
          },
          {
            partyRole: { code: "CONSIGNEE" },
            companyId: "consignee-company",
            addressBookId: "consignee-address",
            company: { name: "CONSIGNEE LTD" },
            addressBook: { fullAddress: "CONSIGNEE ADDRESS" },
          },
        ],
        vessels: [
          {
            id: "job-vessel",
            transportId: "vessel-1",
            vesselName: "WAN HAI 101",
            voyageNumber: "V001",
            etd: "2026-07-30",
            eta: "2026-08-10",
          },
        ],
        jobContainers: [
          {
            containerNumber: "CONT001",
            sealNumber: "SEAL001",
            containerTypeId: "20GP",
            items: [{ sequenceNo: 1, qty: 2, description: "FABRIC ROLLS" }],
          },
        ],
        billsOfLading: [
          {
            serviceContractNo: "SC-123",
            dateCargoReceived: "2026-07-29",
            shipperReferences: ["PO-001"],
          },
        ],
      },
    });

    expect(form.serviceContractNo).toBe("SC-123");
    expect(form.pol).toBe("IDBLW");
    expect(form.pod).toBe("TWTXG");
    expect(form.placeOfReceipt).toBe("BELAWAN DEPOT");
    expect(form.placeOfDelivery).toBe("TAICHUNG CY");
    expect(form.finalDestination).toBe("TAICHUNG, TAIWAN");
    expect(form.cargoMovementId).toBe("FCL_FCL");
    expect(form.deliveryMovementId).toBe("CY_CY");
    expect(form.mainDescription).toBe("FABRIC ROLLS");
    expect(form.shippingMark).toBe("N/M");
    expect(form.dateCargoReceived).toBe("2026-07-29");
    expect(form.shipperReferences).toEqual(["PO-001"]);
    expect(form.shipperId).toBe("shipper-company");
    expect(form.consigneeId).toBe("consignee-company");
    expect(form.vessels[0]?.vesselId).toBe("vessel-1");
    expect(form.containers[0]?.containerNumber).toBe("CONT001");
  });

  it("defaults blank freight payment to the POD payable value shown in preview", () => {
    const form = buildBcDocumentEditForm({
      document: { id: "fcr1", status: "draft", parties: [], containers: [], vessels: [] },
      job: { pod: "TWTXG", podName: "TAICHUNG, TAIWAN" },
    });

    expect(form.freightPayment).toBe("COLLECT_POD");
    expect(form.collectValue).toBe("COLLECT AT TAICHUNG, TAIWAN");
    expect(form.prepaidValue).toBe("");
  });

  it("infers the freight payment selection from existing payable text", () => {
    const form = buildBcDocumentEditForm({
      document: {
        id: "bc1",
        status: "draft",
        prepaidValue: "PREPAID AT BELAWAN, SUMATRA, INDONESIA",
        parties: [],
        containers: [],
        vessels: [],
      },
      job: {
        pol: "IDBLW",
        pod: "TWTXG",
        polName: "BELAWAN, SUMATRA, INDONESIA",
        podName: "TAICHUNG, TAIWAN",
      },
    });

    expect(form.freightPayment).toBe("PREPAID_POL");
    expect(form.prepaidValue).toBe("PREPAID AT BELAWAN, SUMATRA, INDONESIA");
    expect(form.collectValue).toBe("");
  });
});
