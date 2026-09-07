// @ts-ignore
import { describe, expect, it } from "bun:test";
import {
  mapCopiedQuotationCharges,
  mapCopiedQuotationCosts,
  mapCopiedQuotationInvoices,
} from "./quotationCopy";

describe("quotation copy mapping", () => {
  it("copies quotation charges without reusing old record ownership", () => {
    expect(
      mapCopiedQuotationCharges([
        {
          id: "old-charge",
          quotationId: "old-quotation",
          serviceId: "svc-1",
          taxId: "tax-1",
          description: "Ocean Freight",
          quantity: 2,
          unitPrice: 125,
          amount: 250,
          currency: "USD",
          atCost: false,
        },
      ]),
    ).toEqual([
      {
        serviceId: "svc-1",
        taxId: "tax-1",
        description: "Ocean Freight",
        quantity: 2,
        unitPrice: 125,
        amount: 250,
        currency: "USD",
        atCost: false,
        vendorId: null,
        costUnitPrice: undefined,
        costCurrency: undefined,
        costExchangeRate: undefined,
        sellingUnitPrice: undefined,
        sellingCurrency: undefined,
        sellingExchangeRate: undefined,
      },
    ]);
  });

  it("copies quotation costs and invoice documents without old ids", () => {
    expect(
      mapCopiedQuotationCosts([
        {
          id: "old-cost",
          quotationId: "old-quotation",
          vendorId: "vendor-1",
          number: "COST-1",
          date: "2026-09-05",
          exchangeRate: 1,
          subTotal: 100,
          taxTotal: 0,
          amount: 100,
          items: [
            {
              id: "old-cost-item",
              costId: "old-cost",
              serviceId: "svc-1",
              description: "Vendor Freight",
              quantity: 1,
              unitPrice: 100,
              currency: "USD",
              amount: 100,
            },
          ],
        },
      ]),
    ).toEqual([
      {
        number: "COST-1",
        vendorId: "vendor-1",
        categoryId: null,
        date: "2026-09-05",
        exchangeRate: 1,
        taxId: null,
        subTotal: 100,
        taxTotal: 0,
        amount: 100,
        notes: null,
        items: [
          {
            serviceId: "svc-1",
            description: "Vendor Freight",
            quantity: 1,
            unitPrice: 100,
            currency: "USD",
            amount: 100,
          },
        ],
      },
    ]);

    expect(
      mapCopiedQuotationInvoices([
        {
          id: "old-invoice",
          quotationId: "old-quotation",
          number: "INV-DRAFT",
          date: "2026-09-05",
          subTotal: 250,
          taxAmount: 0,
          total: 250,
          items: [
            {
              id: "old-invoice-item",
              invoiceId: "old-invoice",
              chargeId: "old-charge",
              serviceId: "svc-1",
              description: "Ocean Freight",
              quantity: 2,
              unitPrice: 125,
              currency: "USD",
              amount: 250,
            },
          ],
        },
      ]),
    ).toEqual([
      {
        number: "INV-DRAFT",
        date: "2026-09-05",
        notes: null,
        subTotal: 250,
        taxAmount: 0,
        total: 250,
        items: [
          {
            chargeId: null,
            serviceId: "svc-1",
            description: "Ocean Freight",
            quantity: 2,
            unitPrice: 125,
            currency: "USD",
            amount: 250,
          },
        ],
      },
    ]);
  });
});
