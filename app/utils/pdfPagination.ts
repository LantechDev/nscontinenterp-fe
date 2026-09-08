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
  maxRowsPerPage?: (context: { isFirstPage: boolean; startIndex: number }) => number | null;
}

export function paginatePdfRows<T>({
  items,
  mainHeightPx,
  firstHeaderPx,
  continuationHeaderPx,
  tableHeaderPx,
  lastPageReservePx,
  getRowHeightPx,
  maxRowsPerPage,
}: PaginatePdfRowsOptions<T>): PdfRowPage<T>[] {
  const pages: Array<{ items: T[]; startIndex: number }> = [];
  let index = 0;
  let isFirst = true;

  while (index < items.length) {
    const headerPx = isFirst ? firstHeaderPx : continuationHeaderPx;
    let budgetPx = mainHeightPx - headerPx - tableHeaderPx;
    const startIndex = index;
    const pageItems: T[] = [];
    const pageRowLimit = maxRowsPerPage?.({ isFirstPage: isFirst, startIndex }) ?? null;

    while (index < items.length) {
      const item = items[index];
      if (!item) break;
      if (pageRowLimit !== null && pageItems.length >= pageRowLimit && pageItems.length > 0) break;
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
