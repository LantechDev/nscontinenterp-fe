export interface TaxOptionSource {
  id: string;
  name: string;
  rate: string | number;
}

export interface TaxSelectOption {
  id: string;
  name: string;
}

export function buildTaxSelectOptions(taxes: TaxOptionSource[]): TaxSelectOption[] {
  const hasZeroRateTax = taxes.some((tax) => Number(tax.rate) === 0);

  return [
    ...(hasZeroRateTax ? [] : [{ id: "", name: "NON PPN" }]),
    ...taxes.map((tax) => ({ id: tax.id, name: `${tax.name} (${Number(tax.rate)}%)` })),
  ];
}
