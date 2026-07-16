type InvoiceItemDraft = {
  description: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
};

export function buildInvoiceItems(items: InvoiceItemDraft[]) {
  return items.map((it) => {
    const quantity = Number(it.quantity || 1);
    const unitPrice = Number(it.unitPrice || 0);

    return {
      chargeId: null,
      description: it.description.trim(),
      quantity,
      unitPrice,
      currency: (it.currency || "IDR") as "IDR" | "USD",
      amount: quantity * unitPrice,
    };
  });
}
