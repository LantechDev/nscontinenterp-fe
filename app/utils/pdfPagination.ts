export interface PdfRowPage<T> {
  items: T[];
  pageNumber: number;
  startIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

interface PaginatePdfRowsOptions<T> {
  items: T[];
  mainHeightPx: number;
  firstHeaderPx: number;
  continuationHeaderPx: number;
  tableHeaderPx: number;
  lastPageReservePx: number;
  getRowHeightPx: (item: T) => number;
}

export function paginatePdfRows<T>({
  items,
  mainHeightPx,
  firstHeaderPx,
  continuationHeaderPx,
  tableHeaderPx,
  lastPageReservePx,
  getRowHeightPx,
}: PaginatePdfRowsOptions<T>): PdfRowPage<T>[] {
  const pages: Array<{ items: T[]; startIndex: number }> = [];
  let index = 0;
  let isFirst = true;

  while (index < items.length) {
    const headerPx = isFirst ? firstHeaderPx : continuationHeaderPx;
    let budgetPx = mainHeightPx - headerPx - tableHeaderPx;
    const startIndex = index;
    const pageItems: T[] = [];

    while (index < items.length) {
      const item = items[index];
      if (!item) break;
      const rowHeightPx = getRowHeightPx(item);
      const reservePx = index === items.length - 1 ? lastPageReservePx : 0;
      if (budgetPx - rowHeightPx - reservePx < 0 && pageItems.length > 0) break;
      pageItems.push(item);
      index++;
      budgetPx -= rowHeightPx;
    }

    pages.push({ items: pageItems, startIndex });
    isFirst = false;
  }

  if (pages.length === 0) pages.push({ items: [], startIndex: 0 });

  return pages.map((page, pageIndex) => ({
    ...page,
    pageNumber: pageIndex + 1,
    isFirstPage: pageIndex === 0,
    isLastPage: pageIndex === pages.length - 1,
  }));
}
