/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatLogCurrency = (amount: number | string, currencyCode: string = "IDR") => {
  const numericVal = Number(amount);
  if (isNaN(numericVal)) return amount;

  if (currencyCode === "IDR") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(numericVal)
      .replace(/\s+/g, " ");
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(numericVal);
  }
};

export const formatLogDetails = (log: any) => {
  if (log.action === "UPDATE" && log.oldData && log.newData) {
    const changes: string[] = [];
    const oldVal = log.oldData;
    const newVal = log.newData;
    const currency = oldVal.currency || newVal.currency || "IDR";

    if (
      newVal.amount !== undefined &&
      oldVal.amount !== undefined &&
      Number(newVal.amount) !== Number(oldVal.amount)
    ) {
      changes.push(
        `Amount changed from ${formatLogCurrency(oldVal.amount, currency)} to ${formatLogCurrency(newVal.amount, currency)}`,
      );
    }
    if (
      newVal.total !== undefined &&
      oldVal.total !== undefined &&
      Number(newVal.total) !== Number(oldVal.total)
    ) {
      changes.push(
        `Total changed from ${formatLogCurrency(oldVal.total, currency)} to ${formatLogCurrency(newVal.total, currency)}`,
      );
    }
    if (
      newVal.subTotal !== undefined &&
      oldVal.subTotal !== undefined &&
      Number(newVal.subTotal) !== Number(oldVal.subTotal)
    ) {
      changes.push(
        `Subtotal changed from ${formatLogCurrency(oldVal.subTotal, currency)} to ${formatLogCurrency(newVal.subTotal, currency)}`,
      );
    }
    if (
      newVal.description !== undefined &&
      oldVal.description !== undefined &&
      newVal.description !== oldVal.description
    ) {
      changes.push(`Description updated`);
    }

    const oldItems = oldVal.items || [];
    const newItems = newVal.items || [];

    if (oldItems.length > 0 || newItems.length > 0) {
      const oldItemsMap = new Map(oldItems.map((item: any) => [item.id, item]));
      const newItemsMap = new Map(newItems.map((item: any) => [item.id, item]));

      // 1. Added items
      for (const item of newItems) {
        if (!item.id || !oldItemsMap.has(item.id)) {
          changes.push(
            `Added item: "${item.description}" (${Number(item.quantity)} x ${formatLogCurrency(item.unitPrice, currency)})`,
          );
        }
      }

      // 2. Removed items
      for (const item of oldItems) {
        if (!newItemsMap.has(item.id)) {
          changes.push(`Removed item: "${item.description}"`);
        }
      }

      // 3. Modified items
      for (const item of newItems) {
        if (item.id && oldItemsMap.has(item.id)) {
          const oldItem = oldItemsMap.get(item.id) as any;
          const descChanged = item.description !== oldItem.description;
          const qtyChanged = Number(item.quantity) !== Number(oldItem.quantity);
          const priceChanged = Number(item.unitPrice) !== Number(oldItem.unitPrice);

          if (descChanged || qtyChanged || priceChanged) {
            const parts: string[] = [];
            if (descChanged) parts.push(`description to "${item.description}"`);
            if (qtyChanged)
              parts.push(`qty to ${Number(item.quantity)} (was ${Number(oldItem.quantity)})`);
            if (priceChanged)
              parts.push(
                `price to ${formatLogCurrency(item.unitPrice, currency)} (was ${formatLogCurrency(oldItem.unitPrice, currency)})`,
              );
            changes.push(`Updated item "${oldItem.description}": changed ${parts.join(", ")}`);
          }
        }
      }
    } else if (newVal.itemsCount !== undefined) {
      changes.push(`Items updated (${newVal.itemsCount} items)`);
    }

    return changes;
  }
  return [];
};

export const formatLogDescription = (log: any) => {
  if (log.targetName) {
    const actionVerb =
      log.action === "CREATE"
        ? "Created"
        : log.action === "UPDATE"
          ? "Updated"
          : log.action === "DELETE"
            ? "Deleted"
            : log.action === "CANCEL"
              ? "Voided"
              : log.action;
    const modelName =
      log.targetModel === "Invoice"
        ? "Invoice"
        : log.targetModel === "Expense"
          ? "Vendor Invoice"
          : log.targetModel;
    return `${actionVerb} ${modelName} ${log.targetName}`;
  }

  const doc = log.oldData || log.newData;
  if (doc) {
    const docNum = doc.invoiceNumber || doc.number;
    if (docNum) {
      const actionVerb =
        log.action === "CREATE"
          ? "Created"
          : log.action === "UPDATE"
            ? "Updated"
            : log.action === "DELETE"
              ? "Deleted"
              : log.action === "CANCEL"
                ? "Voided"
                : log.action;
      const modelName =
        log.targetModel === "Invoice"
          ? "Invoice"
          : log.targetModel === "Expense"
            ? "Vendor Invoice"
            : log.targetModel;
      return `${actionVerb} ${modelName} ${docNum}`;
    }
  }

  if (log.description) {
    return log.description.replace(/\(ID: [a-z0-9]+\)/i, "").trim();
  }

  return "Activity Log";
};
