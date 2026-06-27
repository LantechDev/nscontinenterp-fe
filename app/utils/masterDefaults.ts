// Pure selection helpers for "set as default" master data. Kept framework-agnostic so
// they can be unit-tested and reused by every consumer that pre-selects a default.

export interface DefaultableItem {
  id: string;
  isDefault?: boolean;
}

/**
 * Return the id of the flagged default item, falling back to `fallback` (e.g. "" or a
 * legacy hardcoded value) when nothing is flagged.
 */
export function selectDefaultId<T extends DefaultableItem>(
  items: T[] | null | undefined,
  fallback = "",
): string {
  const def = (items ?? []).find((item) => item.isDefault);
  return def?.id ?? fallback;
}

export interface BankAccountLike {
  id: string;
  currency: string;
  isDefault?: boolean;
}

/**
 * Pick the bank account to show on a document. Prefers the default account in the
 * document's currency, then any account in that currency, then the default account of
 * any currency, then an IDR account, then the first available.
 */
export function selectBankAccount<T extends BankAccountLike>(
  accounts: T[] | null | undefined,
  currency: string | null | undefined,
): T | null {
  const list = accounts ?? [];
  return (
    list.find((b) => b.isDefault && b.currency === currency) ||
    list.find((b) => b.currency === currency) ||
    list.find((b) => b.isDefault) ||
    list.find((b) => b.currency === "IDR") ||
    list[0] ||
    null
  );
}
